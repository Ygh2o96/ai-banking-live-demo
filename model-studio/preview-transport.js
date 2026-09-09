/* Static deployment adapter for the real workstation UI. Only synthetic,
 * allowlisted records are loaded. No request falls through to a live API. */
import {ROOMS} from './workrooms.js';
const copy=value=>structuredClone(value);
export function createPreviewTransport(snapshot) {
  const responses=copy(snapshot.responses),downloads=copy(snapshot.downloads||{});
  // Original bytes and object URLs belong only to this page's transport.
  const localFiles=new Map(),localDownloadURLs=new Set();
  const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
  const fail=message=>reply({ok:false,error:{message}},409);
  const normalize=path=>{const url=new URL(path,'https://preview.invalid');url.searchParams.sort();return url.pathname+(url.searchParams.size?'?'+url.searchParams:'');};
  const keys=new Map(Object.entries(responses).map(([key,value])=>{const i=key.indexOf(' ');return [key.slice(0,i)+' '+normalize(key.slice(i+1)),value];}));
  function lookup(method,path) {return keys.get(`${method} ${normalize(path)}`)??keys.get(`${method} ${new URL(path,'https://preview.invalid').pathname}`);}
  function allRuns(){return [...new Map([...keys.values()].filter(v=>v?.run).map(v=>[v.run.id,v.run])).values()];}
  const save=(method,path,value)=>keys.set(`${method} ${normalize(path)}`,value);
  const sourceEndpoint=/^\/api\/projects\/([^/]+)\/data-room\/([^/]+)$/;
  function previewResponse(parsed) {
    const [,projectId,sourceId]=parsed.pathname.match(sourceEndpoint),q=parsed.searchParams;
    const integer=(key,fallback)=>q.has(key)&&!/^\d+$/.test(q.get(key))?NaN:Number(q.get(key)??fallback);
    const offset=integer('offset',0),limit=integer('limit',100),showAll=q.get('show_all')??'false';
    if(!Number.isSafeInteger(offset)||offset<0||!Number.isSafeInteger(limit)||limit<1||limit>200||!['true','false'].includes(showAll))return fail('预览页码或范围无效，请重新选择。');
    const pages=[...keys.entries()].filter(([key])=>key.startsWith('GET ')&&new URL(key.slice(4),'https://preview.invalid').pathname===parsed.pathname).map(([,value])=>value?.preview).filter(Boolean);
    if(!pages.length)return reply({ok:false,error:{message:'这份资料没有可读取的公开预览。'}},404);
    const initial=pages.find(p=>p.offset===0)||pages[0];
    const source=lookup('GET',`/api/projects/${projectId}`)?.project?.sources?.find(s=>s.id===sourceId);
    const sameSource=source?.sha256===initial.sha256;
    const unavailable=()=>reply({ok:false,error:{message:'这段资料未包含在公开快照中；请下载原件查看，当前页未返回其他位置的内容。'}},404);
    if(initial.kind==='text') {
      const total=initial.total;
      if(!Number.isSafeInteger(total)||total<0)return unavailable();
      const end=Math.min(total,offset+12000),characters=new Map();
      const full=sameSource&&typeof source.text==='string'?Array.from(source.text):null;
      if(full&&full.length===total)full.forEach((char,index)=>characters.set(index,char));
      else for(const p of pages.filter(p=>p.kind==='text'&&p.sha256===initial.sha256&&p.total===total&&Number.isSafeInteger(p.offset)))Array.from(p.text||'').forEach((char,index)=>characters.set(p.offset+index,char));
      const content=[];
      for(let i=offset;i<end;i++){if(!characters.has(i))return unavailable();content.push(characters.get(i));}
      return reply({ok:true,preview:{...copy(initial),text:content.join(''),offset,total,next_offset:end<total?end:null}});
    }
    if(initial.kind!=='table')return unavailable();
    const infos=initial.sheet_metadata||initial.sheets?.map(name=>({name,default_visible:true}))||[];
    const sheet=q.get('sheet')||(showAll==='true'?infos[0]?.name:(infos.find(i=>i.default_visible)||infos[0])?.name)||initial.sheet;
    if(!infos.some(i=>i.name===sheet))return fail('这份资料没有所选工作表，请重新选择。');
    const selectedPages=pages.filter(p=>p.kind==='table'&&p.sheet===sheet&&p.sha256===initial.sha256),template=selectedPages[0]||initial;
    const rawPreview=sameSource?source.preview:null,tables=rawPreview?.sheets?.length?rawPreview.sheets:rawPreview?.headers?[{name:'CSV',...rawPreview}]:[];
    const table=tables.find(t=>t.name===sheet);
    let total=selectedPages[0]?.total,rows=new Map();
    if(table) {
      const values=table.grid||[table.headers,...(table.rows||[])],numbers=table.grid_row_numbers||[table.header_row||1,...(table.row_numbers||[])];
      if(values.length===numbers.length&&values.every(Array.isArray)&&numbers.every(Number.isSafeInteger)) {
        const column=n=>{let text='';for(let i=n+1;i>0;i=Math.floor((i-1)/26))text=String.fromCharCode(65+(i-1)%26)+text;return text;};
        total=values.length;
        values.forEach((value,index)=>{const row=numbers[index];rows.set(index,{row,values:copy(value),cells:value.map((v,col)=>{const address=column(col)+row;return {address,value:copy(v),...copy(table.cell_metadata?.[address]||{})};})});});
      }
    }
    if(!rows.size)for(const p of selectedPages.filter(p=>p.total===total&&Number.isSafeInteger(p.offset)))for(const [index,row] of (p.rows||[]).entries())rows.set(p.offset+index,copy(row));
    if(!Number.isSafeInteger(total)||total<0)return unavailable();
    const end=Math.min(total,offset+limit),content=[];
    for(let i=offset;i<end;i++){if(!rows.has(i))return unavailable();content.push(rows.get(i));}
    return reply({ok:true,preview:{...copy(template),sheet,sheets:infos.map(i=>i.name),sheet_metadata:copy(infos),rows:content,total,offset,next_offset:end<total?end:null,show_all:showAll==='true',hidden_sheet_count:infos.filter(i=>!i.default_visible).length,formula_execution:'not_executed'}});
  }
  function resolveSources(projectId,body) {
    const projectEntry=lookup('GET',`/api/projects/${projectId}`),catalogEntry=lookup('GET',`/api/projects/${projectId}/data-room`);
    const before=projectEntry?.project;
    if(!before||!Array.isArray(before.sources)||!Array.isArray(catalogEntry?.sources))return fail('没有找到这份项目的资料目录，请重新打开项目。');
    if(before.internal_workspace)return fail('共享工坊资料请在所属工坊处理，本页只记录公司项目资料关系。');
    if(!body||Array.isArray(body)||Object.keys(body).some(k=>!['revision','source_id','other_id','decision','reason'].includes(k)))return fail('资料关系参数无效，请重新选择。');
    if(!Number.isSafeInteger(body.revision)||body.revision!==before.revision)return fail('资料版本已改变。请刷新后核对；本次判断尚未保存。');
    if(!['supersedes','coexists','different_purpose','no_version_link'].includes(body.decision))return fail('请选择资料关系，再记录判断。');
    if(typeof body.reason!=='string'||!body.reason.trim()||Array.from(body.reason).length>3000)return fail('请填写范围与依据，且不超过3,000字。');
    const a=before.sources.find(s=>s.id===body.source_id),b=before.sources.find(s=>s.id===body.other_id);
    const ca=catalogEntry.sources.find(s=>s.id===body.source_id),cb=catalogEntry.sources.find(s=>s.id===body.other_id);
    if(!a||!b||a===b||!ca||!cb)return fail('请指定本项目内两份不同资料。');
    if(a.active===false||b.active===false||ca.active===false||cb.active===false)return fail('资料关系已有变化，请重新核对当前有效版本。');
    const candidate=ca.relationship_candidates?.find(c=>c.other_id===b.id&&c.current_proposal!==false&&c.compatible===true)
      ||cb.relationship_candidates?.find(c=>c.other_id===a.id&&c.current_proposal!==false&&c.compatible===true);
    if(body.decision==='supersedes'&&!candidate)return fail('快照中没有这两份资料可以完整替代的依据；请核对用途及范围，或记录并存关系。');
    // Validate first, then replace the local records together. Originals, quotes,
    // prior decisions and numerical model results remain immutable.
    const project=copy(before),catalog=copy(catalogEntry),at=new Date().toISOString();
    const decision={id:crypto.randomUUID(),at,actor:'local_preview_user',source_id:a.id,other_id:b.id,decision:body.decision,reason:body.reason.trim(),synthetic:true,local_only:true};
    for(const collection of [project.sources,catalog.sources]) {
      for(const source of collection) {
        if([a.id,b.id].includes(source.id)) {
          source.authority_decisions=[...(source.authority_decisions||[]),copy(decision)];
          const other=source.id===a.id?b.id:a.id;
          source.update_candidates=(source.update_candidates||[]).filter(id=>id!==other);
          const links=source.relationship_candidates||[];
          source.relationship_candidates=links.map(link=>link.other_id===other?{...link,operator_decision:copy(decision)}:link);
          if(!links.some(link=>link.other_id===other))source.relationship_candidates.push({other_id:other,current_proposal:true,compatible:!!candidate,reason:'本页记录的资料范围判断。',operator_decision:copy(decision),evidence:[]});
        }
      }
      if(body.decision==='supersedes') {
        const current=collection.find(s=>s.id===a.id),old=collection.find(s=>s.id===b.id);
        old.active=false;old.authority_status='superseded';current.supersedes_id=old.id;
        for(const source of collection.filter(s=>s.id!==old.id&&s.id!==current.id)) {
          if((source.update_candidates||[]).includes(old.id)) {
            source.update_candidates=[...new Set(source.update_candidates.map(id=>id===old.id?current.id:id))];
            current.update_candidates=[...new Set([...(current.update_candidates||[]),source.id])];
            const prior=source.relationship_candidates?.find(link=>link.other_id===old.id);
            if(prior)source.relationship_candidates=source.relationship_candidates.map(link=>link.other_id===old.id?{...link,current_proposal:false}:link);
            source.relationship_candidates||=[];
            if(!source.relationship_candidates.some(link=>link.other_id===current.id&&link.current_proposal!==false))source.relationship_candidates.push({other_id:current.id,current_proposal:true,compatible:prior?.compatible??true,reason:'原候选版本已归档，需核对与当前版本的关系。',evidence:copy(prior?.evidence||[])});
            current.relationship_candidates||=[];
            if(!current.relationship_candidates.some(link=>link.other_id===source.id&&link.current_proposal!==false))current.relationship_candidates.push({other_id:source.id,current_proposal:true,compatible:prior?.compatible??true,reason:'另有一份有效资料与原版本存在未解关系，继续保留待核对。',evidence:copy(prior?.evidence||[])});
          }
        }
      }
      for(const source of collection)if(source.active!==false)source.authority_status=source.update_candidates?.length?'unresolved':source.authority_decisions?.length?'operator_resolved':'available';
    }
    project.revision+=1;project.updated_at=at;
    project.events=[...(project.events||[]),{at,type:'preview_source_authority_resolved',revision:project.revision,decision:copy(decision)}];
    catalog.revision=project.revision;
    const updatedProject={...copy(projectEntry),project};
    save('GET',`/api/projects/${projectId}`,updatedProject);save('GET',`/api/projects/${projectId}/data-room`,catalog);
    const bootstrap=lookup('GET','/api/bootstrap');
    for(const item of bootstrap?.projects||[])if(item.id===projectId)Object.assign(item,{revision:project.revision,updated_at:at});
    for(const run of allRuns().filter(r=>r.project_id===projectId&&r.source_revision!==project.revision)) {
      run.source_current=false;run.current_source_revision=project.revision;run.status='source_changed';
      run.preview_source_history=[...(run.preview_source_history||[]),{...copy(decision),revision:project.revision,model_recalculated:false}];
      for(const field of ['native_artifacts','workpapers','models','documents','narratives','calls','business_boards'])for(const value of run[field]||[])value.current=false;
      for(const value of run.banker?.boards||[])value.current=false;
      for(const value of run.worker_state?.artifacts||[])value.current=false;
      for(const room of run.workrooms?.rooms||[]){room.workpaper_current=false;room.activity=null;}
    }
    return reply({ok:true,project,sources:catalog.sources,local_only:true,model_recalculated:false,message:'资料关系已保留在本页记录。已有模型保留原数，并标明来源已有更新。'});
  }
  function addNote(run,cmd) {
    const id=crypto.randomUUID(),at=new Date().toISOString();
    run.inputs||=[];run.events||=[];
    run.inputs.push({id,text:cmd.text,status:'received',intent:cmd.intent||'discussion',workspace:cmd.workspace,at,received_at:at,created_at:at});
    run.events.push({id:crypto.randomUUID(),seq:run.events.length+1,kind:'input_received',created_at:at,at,payload:{input_id:id,text:cmd.text}});
    run.events.push({id:crypto.randomUUID(),seq:run.events.length+1,kind:'progress_saved',created_at:at,at,payload:{text:'意见已保留在本页体验记录。在线 AI 接入后，可继续分析和修改模型。'}});
    run.updated_at=at;
  }
  function attachmentContext(project,raw,requestReturn) {
    if(!raw||typeof raw!=='object'||Array.isArray(raw)||Object.keys(raw).some(k=>!['kind','run_id','target_id','signature','room_id'].includes(k)))throw Error('附件关联信息无效，请重新选择。');
    if(!Object.keys(raw).length&&!requestReturn)return {};
    if(!(requestReturn?['request_return']:['todo','question','chat']).includes(raw.kind))throw Error('请选择附件对应的待办、问题或对话。');
    for(const field of ['run_id','target_id','signature','room_id'])if(field in raw&&(typeof raw[field]!=='string'||!raw[field].trim()))throw Error('附件关联信息不完整，请重新选择。');
    if(!raw.run_id)throw Error('请先打开附件所属的工作记录。');
    const run=lookup('GET',`/api/harness/${encodeURIComponent(raw.run_id)}`)?.run;
    if(!run||run.id!==raw.run_id||run.project_id!==project.id)throw Error('附件所属工作记录与当前项目不一致。');
    const role=run.role_id||'modelling',roleRooms={modelling:['overview','harness',...ROOMS.map(room=>room[0])],source_librarian:['intake','data-room'],intake_librarian:['intake'],data_librarian:['data-room'],audit_reviewer:['audit-lab']};
    if(!roleRooms[role])throw Error('请在公司项目工作间附上文件；共享工坊须使用其资料入口。');
    if(run.source_current===false||(run.source_revision!==undefined&&run.source_revision!==project.revision))throw Error('这份工作记录对应旧资料，请打开当前版本后再附上文件。');
    if(raw.room_id&&!roleRooms[role].includes(raw.room_id))throw Error('附件所属工作间已变化，请重新打开。');
    const context={kind:raw.kind,run_id:run.id};
    if(raw.kind==='todo') {
      const todo=run.banker?.todos?.find(item=>item.id===raw.target_id);
      if(!todo||typeof todo.signature!=='string'||raw.signature!==todo.signature)throw Error('待办已有更新，请核对后再附上文件。');
      Object.assign(context,{target_id:todo.id,signature:todo.signature,title:todo.title||todo.text||'',text:todo.text||''});
    }else if(raw.kind==='question') {
      const question=run.questions?.find(item=>item.id===raw.target_id);
      if(!question||typeof question.text!=='string'||raw.signature!==question.text)throw Error('问题已有更新，请核对后再附上文件。');
      Object.assign(context,{target_id:question.id,signature:question.text,title:question.text,text:question.text});
    }else if(raw.kind==='request_return') {
      const list=run.request_lists?.find(item=>item.id===raw.target_id&&item.format==='xlsx');
      if(!list)throw Error('没有找到本工作记录的 Excel 资料清单。');
      Object.assign(context,{target_id:list.id,title:list.title||list.name||'回传资料清单'});
    }else if(raw.target_id||raw.signature)throw Error('对话附件的关联信息无效，请重新附上文件。');
    if(raw.room_id)context.room_id=raw.room_id;
    return context;
  }
  async function stageAttachment(projectId,form,requestReturn=null) {
    try {
      if(!(form instanceof FormData)||[...form.keys()].some(k=>!['file','revision',...(requestReturn?[]:['context'])].includes(k))||form.getAll('file').length!==1||form.getAll('revision').length!==1||form.getAll('context').length>1)throw Error('请选择一个附件，再重新提交。');
      const file=form.get('file'),revision=form.get('revision');
      if(!(file instanceof Blob)||typeof file.name!=='string'||!file.name.trim()||/[\\/\u0000]/.test(file.name)||file.webkitRelativePath)throw Error('请附上文件；文件夹不能直接添加。');
      if(!Number.isSafeInteger(file.size)||file.size<1||file.size>20*1024*1024)throw Error('附件须有内容，且单个文件不超过 20 MB。');
      if(requestReturn&&!/\.xlsx$/i.test(file.name))throw Error('请附上填回的 .xlsx 文件。');
      if(typeof revision!=='string'||!/^\d+$/.test(revision)||!Number.isSafeInteger(Number(revision)))throw Error('资料版本无效，请刷新项目后再附上文件。');
      let raw={};
      if(requestReturn)raw={kind:'request_return',...requestReturn};
      else if(form.has('context')) {
        const value=form.get('context');
        if(typeof value!=='string'||value.length>16000)throw Error('附件关联信息无效，请重新选择。');
        try{raw=JSON.parse(value);}catch{throw Error('附件关联信息未能读取，请重新选择。');}
      }
      const validate=()=>{
        const entry=lookup('GET',`/api/projects/${encodeURIComponent(projectId)}`),project=entry?.project;
        if(!project||project.id!==projectId)throw Error('没有找到附件所属的项目，请重新打开。');
        if(project.internal_workspace)throw Error('请在公司项目工作间附上文件；共享工坊须使用其资料入口。');
        if(project.revision!==Number(revision))throw Error('资料版本已改变，请刷新后再附上文件。');
        return {entry,project,context:attachmentContext(project,raw,requestReturn)};
      };
      validate();
      const sha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer())),byte=>byte.toString(16).padStart(2,'0')).join('');
      // Hashing yields to the page: recheck revision/context before any mutation.
      const {entry,project:before,context}=validate();
      const project=copy(before),byHash=localFiles.get(projectId)||new Map(),existing=byHash.get(sha256);
      const existingSource=project.sources?.find(source=>source.sha256===sha256);
      const sameContext=receipt=>['kind','run_id','target_id','signature','room_id'].every(field=>receipt.context?.[field]===context[field]);
      const previous=existing&&(project.attachment_receipts||[]).find(receipt=>receipt.sha256===sha256&&receipt.source_id===existing.source_id&&receipt.local_only===true&&sameContext(receipt));
      if(previous)return reply({ok:true,project,source_id:previous.source_id,duplicate:true,attachment_receipt:previous,local_only:true,model_applied:false,message:'这份附件已暂存在本页的同一事项下；刷新页面后需重新添加。'});
      const sourceId=existing?.source_id||existingSource?.id||crypto.randomUUID(),id=crypto.randomUUID(),at=new Date().toISOString();
      let staged=existing;
      if(!staged) {
        const url=URL.createObjectURL(file);
        if(!url.startsWith('blob:')){URL.revokeObjectURL(url);throw Error('无法在本页暂存附件，请重试。');}
        staged={file,source_id:sourceId,url};
        byHash.set(sha256,staged);localFiles.set(projectId,byHash);localDownloadURLs.add(url);
        const original=`/api/projects/${encodeURIComponent(projectId)}/data-room/${encodeURIComponent(sourceId)}/original`;
        // Retain the frozen demo's existing download if this file matches it.
        downloads[original]||={path:url,filename:file.name,local_only:true};
      }
      const receipt={id,source_id:sourceId,sha256,name:file.name,filename:file.name,context,at,status:'local_only',local_only:true,model_applied:false,download_url:staged.url};
      project.attachment_receipts=[...(project.attachment_receipts||[]),receipt];
      save('GET',`/api/projects/${encodeURIComponent(projectId)}`,{...copy(entry),project});
      return reply({ok:true,project,source_id:sourceId,duplicate:!!(existing||existingSource),attachment_receipt:receipt,local_only:true,model_applied:false,message:requestReturn?'回传文件已暂存在本页；尚未读取或导入工作表，刷新页面后需重新添加。':'附件已暂存在本页；尚未提取内容或交给 AI，刷新页面后需重新添加。'});
    }catch(error){return fail(error instanceof Error?error.message:'附件未能暂存，请重新选择。');}
  }
  const transport={
    downloads,
    isLocalDownload:url=>localDownloadURLs.has(url),
    dispose(){for(const url of localDownloadURLs)URL.revokeObjectURL(url);localDownloadURLs.clear();localFiles.clear();},
    async request(path,options={}) {
      const method=(options.method||'GET').toUpperCase();
      let body=options.body;
      if(typeof body==='string'){try{body=JSON.parse(body);}catch{return fail('这项输入未能读取，请重新填写。');}}
      const parsed=new URL(path,'https://preview.invalid');
      const intake=parsed.pathname.match(/^\/api\/projects\/([^/]+)\/intake$/);
      if(method==='POST'&&intake)return stageAttachment(decodeURIComponent(intake[1]),body);
      const requestReturn=parsed.pathname.match(/^\/api\/harness\/([^/]+)\/request-lists\/([^/]+)\/return$/);
      if(method==='POST'&&requestReturn) {
        const runId=decodeURIComponent(requestReturn[1]),run=lookup('GET',`/api/harness/${encodeURIComponent(runId)}`)?.run;
        if(!run)return fail('没有找到这份工作记录，请重新打开项目。');
        return stageAttachment(run.project_id,body,{run_id:runId,target_id:decodeURIComponent(requestReturn[2])});
      }
      const relation=parsed.pathname.match(/^\/api\/projects\/([^/]+)\/data-room\/resolve$/);
      if(method==='POST'&&relation)return resolveSources(relation[1],body);
      if(method==='GET'&&sourceEndpoint.test(parsed.pathname)&&!['resolve','original'].includes(parsed.pathname.split('/').at(-1)))return previewResponse(parsed);
      const match=parsed.pathname.match(/^\/api\/harness\/([^/]+)\/commands$/);
      if(method==='POST'&&match) {
        const entry=lookup('GET',`/api/harness/${match[1]}`),run=entry?.run;
        if(!run)return fail('没有找到这份工作记录，请重新打开项目。');
        if(run.source_current===false)return fail('这份记录对应旧资料版本；意见尚未提交，请先核对当前来源并建立接续记录。');
        if(!body?.text?.trim())return fail('请先填写意见或处理原因。');
        if(body.kind==='banker_response') {
          const todo=run.banker?.todos?.find(t=>t.id===body.todo_id);
          if(!todo)return fail('这项待办已变化，请重新打开待办列表。');
          if(body.question_signature!==todo.signature)return fail('问题已有更新，请核对后再回复。');
          const status={reply:'awaiting_agent',resolve:'resolved',unavailable:'unavailable',reopen:'open'}[body.action];
          if(!status)return fail('请选择这项待办的处理方式。');
          const event={actor:'user',text:body.text,action:body.action,at:new Date().toISOString()};
          todo.status=status;todo.last_action=event;todo.history=[...(todo.history||[]),event];
          run.banker.attention_count=run.banker.todos.filter(t=>['open','awaiting_agent'].includes(t.status)).length;
          for(const room of run.workrooms?.rooms||[])room.attention_count=run.banker.todos.filter(t=>['open','awaiting_agent'].includes(t.status)&&(room.id==='todos'||t.room_ids?.includes(room.id))).length;
          addNote(run,body);return reply({ok:true,run});
        }
        if(['steer','answer'].includes(body.kind)){addNote(run,body);return reply({ok:true,run});}
        return fail('这一步需要在线 AI 或正式项目服务。可先浏览已保存成果，并在对话中留下意见。');
      }
      const found=lookup(method,path);
      if(found!==undefined)return reply(copy(found));
      if(method==='GET'&&parsed.pathname.endsWith('/harness')) {
        const role=parsed.searchParams.get('role_id')||'modelling';
        const projectId=parsed.pathname.split('/')[3];
        return reply({ok:true,runs:allRuns().filter(r=>(r.role_id||'modelling')===role&&r.project_id===projectId)});
      }
      if(method==='POST')return fail('当前展示使用合成项目。文件上传、AI 分析及正式保存将在服务器接入后开放；已有资料和成果可直接查看。');
      return reply({ok:false,error:{message:'这项示例资料尚未提供。请返回工作区查看已有成果。'}},404);
    }
  };
  return transport;
}

export function installPreviewPresentation(snapshot,transport) {
  const base=new URL('./',import.meta.url);
  const banner=document.createElement('div');banner.className='preview-environment';
  banner.innerHTML='<strong>合成项目体验</strong><span>与本机工作台共用界面 · 在线 AI 待接入</span><button type="button" data-preview-rooms>查看全部工作间 ↗</button>';
  document.querySelector('.main-shell').prepend(banner);
  banner.querySelector('button').addEventListener('click',()=>{const directory=document.querySelector('[data-open-room="room-list"]');if(directory)directory.click();else document.querySelector('#step-nav')?.scrollIntoView({block:'start'});});
  const mapLinks=root=>{for(const a of root.querySelectorAll('a[href]')){
    const raw=a.getAttribute('data-preview-original-href')||a.getAttribute('href');
    if(!raw?.startsWith('/api/'))continue;
    a.dataset.previewOriginalHref=raw;
    const target=transport.downloads[raw];
    if(target){const local=new URL(typeof target==='string'?target:target.path,base);if(!transport.isLocalDownload(local.href)&&(local.origin!==location.origin||!local.href.startsWith(base.href)))throw Error('Invalid preview download');a.href=local.href;a.setAttribute('download',typeof target==='object'&&target.filename?target.filename:local.pathname.split('/').at(-1));}
  }};
  const paint=()=>{
    mapLinks(document);
    const label=document.querySelector('#connection-label');if(label&&label.textContent!=='合成资料已载入')label.textContent='合成资料已载入';
    for(const el of document.querySelectorAll('[data-reporting-status]'))if(!['已保存的示例成果','需要建立接续记录'].includes(el.textContent))el.textContent='已保存的示例成果';
  };
  let queued=false;
  const observer=new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(()=>{queued=false;paint();});}});
  observer.observe(document.body,{childList:true,subtree:true});paint();
  document.addEventListener('click',event=>{const a=event.target.closest('a[data-preview-original-href]');if(a&&!transport.downloads[a.dataset.previewOriginalHref]){event.preventDefault();const box=document.querySelector('#toast');box.textContent='这项文件尚未加入公开示例；可查看当前工作区的内容和依据。';box.hidden=false;setTimeout(()=>box.hidden=true,5000);}},true);
  window.addEventListener('pagehide',event=>{if(!event.persisted){observer.disconnect();transport.dispose();}});
}

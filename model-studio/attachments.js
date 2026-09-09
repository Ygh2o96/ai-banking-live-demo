/* One intake path for file picking and dropping; receipts never resolve a question. */
const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MAX_BYTES=20*1024*1024;
const queues=new Map(),jobs=[],saved=new Map();
export const supportsInlineIntake=role=>['modelling','source_librarian','intake_librarian','data_librarian','audit_reviewer'].includes(role||'modelling');
export function attachmentTargetHTML(context={}, {compact=false,returnFile=false}={}){
 return `<div class="attachment-target${compact?' attachment-compact':''}" data-attachment-context="${escape(JSON.stringify(context))}"><div class="attachment-drop"><span aria-hidden="true">＋</span><span>${returnFile?'把客户填回的 Excel 拖到这里':'拖入文件，或'}</span><button type="button" class="attachment-choose" data-attachment-choose>${returnFile?'选择 Excel':'选择文件'}</button><input class="sr-only" type="file" data-attachment-input aria-label="${returnFile?'选择客户填回的 Excel':'选择补充资料'}" ${returnFile?'accept=".xlsx"':'multiple'}></div><ul class="attachment-files" data-attachment-files aria-live="polite" aria-relevant="additions text"></ul></div>`;
}
const contextOf=r=>r.context||r;
const sameContext=(a,b)=>a.kind===b.kind&&(a.run_id||'')===(b.run_id||'')&&(a.target_id||'')===(b.target_id||'')&&(a.signature||'')===(b.signature||'')&&(a.kind!=='chat'||(a.room_id||'')===(b.room_id||''));
const changed=()=>document.dispatchEvent(new CustomEvent('model-studio-attachments-updated'));
const receiptsFor=(project,context)=>[...(project.attachment_receipts||[]),...(saved.get(project.id)||[]),...(context.kind==='request_return'?(project.sources||[]).filter(s=>s.request_return?.pack_id===context.target_id).map(s=>({id:s.id,source_id:s.id,filename:s.name,context,status:'received'})):[])].filter((r,i,all)=>all.findIndex(x=>x.id===r.id)===i);
function sourceLink(projectId,receipt){
 if(receipt.local_only){try{const u=new URL(receipt.download_url);return u.protocol==='blob:'&&u.origin===location.origin?u.href:'';}catch{return '';}}
 return receipt.source_id?`/api/projects/${encodeURIComponent(projectId)}/data-room/${encodeURIComponent(receipt.source_id)}/original`:'';
}
export function createAttachmentController({api,getState,onProject,onError}){
 let root=null;
 function contextFor(zone){
  const state=getState();let context=JSON.parse(zone.dataset.attachmentContext||'{}');
  if(context.kind==='chat')context=state.run?{...context,run_id:state.run.id,room_id:state.discussionRoom||state.room||'overview'}:{};
  return context;
 }
 function refresh(){
  const state=getState();if(!root||!state.project)return;
  for(const zone of root.querySelectorAll('[data-attachment-context]')){
   const context=contextFor(zone),receipts=receiptsFor(state.project,context).filter(r=>sameContext(contextOf(r),context));
   const pending=jobs.filter(j=>j.projectId===state.project.id&&sameContext(j.context,context)&&!['received','local_only'].includes(j.status));
   const html=receipts.map(r=>{const href=sourceLink(state.project.id,r),name=r.filename||r.name||'补充资料';return `<li class="attachment-file received"><span class="attachment-file-name">${href?`<a href="${escape(href)}" download>${escape(name)}</a>`:escape(name)}</span><small>${r.local_only?'本页暂存 · 刷新后需重新添加':r.context?.kind==='request_return'||r.kind==='request_return'?'清单已读回 · 待核对':'已收到 · 待核对'}</small></li>`;}).join('')+pending.map(j=>`<li class="attachment-file ${escape(j.status)}"><span class="attachment-file-name">${escape(j.filename)}</span><small>${escape(j.message)}</small>${j.status==='failed'&&j.retryable?`<button type="button" class="attachment-choose" data-attachment-retry="${escape(j.id)}">重试</button>`:''}</li>`).join('');
   const list=zone.querySelector('[data-attachment-files]');if(list&&list._content!==html){list.innerHTML=html;list._content=html;}
   zone.setAttribute('aria-busy',String(pending.some(j=>['queued','uploading'].includes(j.status))));
  }
 }
 function target(event){
  const el=event.target instanceof Element?event.target:null;
  return el?.closest('[data-attachment-context]')||el?.closest('.banker-todo,.reporting-question,.harness-item,.reporting-output-card,.reporting-composer,form.live-chat-composer')?.querySelector('[data-attachment-context]')||el?.closest('.agent-conversation')&&root?.querySelector('.reporting-composer [data-attachment-context]');
 }
 function enqueue(job){
  job.status='queued';job.message='等待接收…';changed();
  const prior=queues.get(job.projectId)||Promise.resolve();
  const task=prior.catch(()=>{}).then(async()=>{
   const state=getState();
   if(!state.project||state.project.id!==job.projectId){job.status='failed';job.message='尚未上传，请回到原项目后重试。';changed();return;}
   job.status='uploading';job.message='正在接收…';changed();
   const body=new FormData();body.append('file',job.file);body.append('revision',String(state.project.revision));
   if(job.context.kind&&job.context.kind!=='request_return')body.append('context',JSON.stringify(job.context));
   const route=job.context.kind==='request_return'?`/api/harness/${encodeURIComponent(job.context.run_id)}/request-lists/${encodeURIComponent(job.context.target_id)}/return`:`/api/projects/${encodeURIComponent(job.projectId)}/intake`;
   try{
    const result=await api(route,{method:'POST',body});
    if(result.project?.id!==job.projectId)throw new Error('返回的项目不一致，尚未确认文件保存结果。');
    let receipt=result.attachment_receipt;
    // The existing strict Excel-return reader has its own immutable source receipt.
    if(!receipt&&result.return_receipt){const source=result.project.sources?.find(s=>s.request_return?.source_sha256===result.return_receipt.source_sha256);receipt={id:source?.id||job.id,source_id:source?.id,filename:job.filename,sha256:result.return_receipt.source_sha256,context:job.context,status:'received',model_applied:false};}
    if(!receipt&&Object.keys(job.context).length===0)receipt={id:result.source_id,source_id:result.source_id,filename:job.filename,context:{},status:'received'};
    if(!receipt?.id)throw new Error('文件可能已收到，但未返回问题关联回执。请重试核对。');
    const list=saved.get(job.projectId)||[];if(!list.some(r=>r.id===receipt.id))list.push(receipt);saved.set(job.projectId,list);
    job.status=receipt.local_only?'local_only':'received';job.file=null;
    // A view refresh failure does not undo a successful receipt or resend bytes.
    try{onProject(result);}catch(error){onError(new Error('文件已收到，页面未能更新，请刷新查看。'));}
    changed();
   }catch(error){job.status='failed';job.message=error.message||'未能接收，请重试。';changed();}
  });
  queues.set(job.projectId,task);task.finally(()=>{if(queues.get(job.projectId)===task)queues.delete(job.projectId);});
 }
 function rejectDrop(zone,message){
  const state=getState();if(!state.project||!zone)return;
  const context=contextFor(zone);
  if(!jobs.some(j=>j.structural&&j.projectId===state.project.id&&sameContext(j.context,context)&&j.message===message))jobs.push({id:crypto.randomUUID(),projectId:state.project.id,context:structuredClone(context),filename:'文件未能添加',status:'failed',message,retryable:false,structural:true});
  changed();
 }
 function accept(files,zone){
  const state=getState();if(!state.project||!zone||!files.length)return;
  let context;try{context=contextFor(zone);}catch{return;}
  if(context.kind==='request_return'&&files.length!==1){rejectDrop(zone,'每次请提供一份填回的 Excel。');return;}
  for(let i=jobs.length-1;i>=0;i--)if(jobs[i].structural&&jobs[i].projectId===state.project.id&&sameContext(jobs[i].context,context))jobs.splice(i,1);
  for(const file of files){
   const job={id:crypto.randomUUID(),projectId:state.project.id,context:structuredClone(context),file,filename:file.name||'未命名文件',status:'queued',retryable:true};
   let error=file.size===0?'文件为空，请重新选择。':file.size>MAX_BYTES?'单份文件上限 20 MB，请拆分后提供。':context.kind==='request_return'&&!/\.xlsx$/i.test(file.name)?'请提供填回的 .xlsx 文件。':'';
   if(jobs.some(j=>j.projectId===job.projectId&&sameContext(j.context,context)&&['queued','uploading'].includes(j.status)&&j.filename===job.filename&&j.file?.size===file.size&&j.file?.lastModified===file.lastModified))continue;
   jobs.push(job);if(error){job.status='failed';job.message=error;job.retryable=false;job.file=null;changed();}else enqueue(job);
  }
 }
 const fileDrag=e=>[...(e.dataTransfer?.types||[])].includes('Files');
 function bind(el,signal){
  root=el;const options={signal};
  document.addEventListener('model-studio-attachments-updated',refresh,options);
  el.addEventListener('click',event=>{const retry=event.target.closest('[data-attachment-retry]');if(retry){event.preventDefault();event.stopPropagation();const job=jobs.find(j=>j.id===retry.dataset.attachmentRetry);if(job?.status==='failed'&&job.file)enqueue(job);return;}if(event.target.closest('[data-attachment-choose]')){event.preventDefault();event.stopPropagation();target(event)?.querySelector('[data-attachment-input]')?.click();}},options);
  el.addEventListener('change',event=>{if(event.target.matches('[data-attachment-input]')){event.stopPropagation();accept([...event.target.files],target(event));event.target.value='';}},options);
  for(const name of ['dragenter','dragover'])el.addEventListener(name,event=>{if(!fileDrag(event))return;event.preventDefault();const zone=target(event);if(zone){event.dataTransfer.dropEffect='copy';zone.classList.add('is-dragging');}},options);
  el.addEventListener('dragleave',event=>{const zone=target(event);if(zone&&!zone.contains(event.relatedTarget))zone.classList.remove('is-dragging');},options);
  el.addEventListener('drop',event=>{if(!fileDrag(event))return;event.preventDefault();event.stopPropagation();el.querySelectorAll('.is-dragging').forEach(z=>z.classList.remove('is-dragging'));const zone=target(event);if(!zone)return;const items=[...(event.dataTransfer?.items||[])];if(items.some(i=>i.webkitGetAsEntry?.()?.isDirectory)){rejectDrop(zone,'请拖入文件，文件夹请先展开。');return;}const files=[...(event.dataTransfer?.files||[])];if(!files.length){rejectDrop(zone,'未能读取拖入的文件。请先保存到本机，再拖入或点选文件。');return;}accept(files,zone);},options);
  refresh();
 }
 return {bind,refresh,unmount(){root=null;}};
}

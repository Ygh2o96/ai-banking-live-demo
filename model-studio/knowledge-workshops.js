/* Public knowledge intake and project-owned review surfaces. */
import {bankerValueHTML,readableKey,timeHK} from './runtime-ui.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const memoKinds={memo_reference:'Memo 参考资料',memo_draft:'Memo 草稿',profit_forecast_memo:'PFM memo',sponsor_comment:'联席保荐人意见',regulatory_query:'监管问询',regulatory_response:'监管问询回复',other_reference:'其他参考资料'};
const relationLabels={version_of:'另一版本',comments_on:'针对以下资料的意见',responds_to:'回复以下问题',supports:'支持以下资料',related_to:'关联资料'};
const sourceKind=source=>({...memoKinds,accounting_reference:'会计参考资料',tb:'试算平衡表',mdd:'管理层讨论',fdd:'财务尽调资料',fdd_note:'财务尽调纪要',minutes:'纪要 / 文稿',model_meeting:'模型讨论记录',business_note:'业务纪要'}[source.source_kind||source.role]||readableKey(source.source_kind||source.role||'用途待识别'));
const sourceList=project=>Array.isArray(project?.source_index)?project.source_index:Array.isArray(project?.sources)?project.sources:[];
const receiptDate=value=>value&&Number.isFinite(Date.parse(value))?new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'short',day:'numeric',timeZone:'Asia/Hong_Kong'}).format(new Date(value)):'';
const fileKind=source=>{const ext=String(source.name||'').match(/\.([a-z0-9]{1,8})$/i);return ext?ext[1].toUpperCase():'资料';};
function recentSourcesHTML(project,mode){
 const sources=sourceList(project),recent=[...sources].sort((a,b)=>(Date.parse(b.uploaded_at)||0)-(Date.parse(a.uploaded_at)||0)).slice(0,3);
 const label={accounting:'会计书架',memo:'Memo 书架',audit:'审阅资料'}[mode];
 return `<div class="workshop-exhibit-head"><div><p class="eyebrow">${label}</p><h2>${recent.some(source=>receiptDate(source.uploaded_at))?'最近收到':'已上传资料'}</h2></div>${mode==='audit'?'<button class="button button-quiet" data-step="intake">＋ 补充资料</button>':'<button class="button button-quiet" data-workshop-upload-focus>＋ 上传资料</button>'}</div><div class="workshop-exhibit-items">${recent.map(source=>`<button type="button" class="workshop-source-card" data-workshop-source-open="${esc(source.id)}"><span class="workshop-file-tab" aria-hidden="true">${esc(fileKind(source))}</span><strong>${esc(source.name||'未命名资料')}</strong>${receiptDate(source.uploaded_at)?`<small>收到 ${esc(receiptDate(source.uploaded_at))}</small>`:''}<span class="workshop-card-link">查看原件与详情 ↗</span></button>`).join('')||`<p class="workshop-exhibit-empty">${mode==='audit'?'本项目尚未添加审阅资料。':'书架等待第一份资料。上传后，原件会出现在这里。'}</p>`}</div>`;
}
function sourcesHTML(project,mode){
 const sources=sourceList(project),names=new Map(sources.map(source=>[source.id,source.name]));
 const title={accounting:'已上传的会计资料',memo:'Memo、意见与问询原件',audit:'本项目审阅资料'}[mode];
 const empty={accounting:'可以先上传会计指引、处理备忘录或配平案例，再交给右侧管理员整理。',memo:'上传 PFM memo、联席保荐人意见或监管问询回复，逐轮保留原文及明确的版本关联。',audit:'请补充本项目的 PFM、memo 和支持资料。'}[mode];
 return `<div class="supervisor-section-head"><h2>${title} · ${sources.length} 份</h2>${mode==='audit'?'<button class="button button-primary" data-step="intake">补充 PFM、memo 或支持资料 ↗</button>':''}</div><div class="source-register">${sources.map(source=>`<article class="source-register-row" data-workshop-source-row="${esc(source.id)}" tabindex="-1"><strong>${esc(source.name||'未命名资料')}</strong><span class="badge neutral">${esc(sourceKind(source))}</span>${source.purpose||source.agent_description?.purpose?`<p>${esc(source.purpose||source.agent_description.purpose)}</p>`:''}<small>资料日期：${esc(source.source_date||source.agent_description?.source_date||'待从原件识别')}</small>${source.period||source.agent_description?.period?`<small>覆盖期间：${esc(source.period||source.agent_description.period)}</small>`:''}${source.uploaded_at?`<small>收到：${esc(timeHK(source.uploaded_at))}</small>`:''}${source.document_relations?.length?`<ul>${source.document_relations.map(link=>`<li>${esc(relationLabels[link.relation]||readableKey(link.relation))}：${esc(names.get(link.other_id)||link.other_id)}</li>`).join('')}</ul>`:''}${project?.id&&source.id?`<a class="button button-quiet" href="/api/projects/${encodeURIComponent(project.id)}/data-room/${encodeURIComponent(source.id)}/original">下载留存原件</a>`:''}<details><summary>来源记录</summary><dl class="banker-key-values"><div><dt>来源编号</dt><dd>${esc(source.id)}</dd></div><div><dt>文件校验值</dt><dd>${esc(source.sha256||'未提供')}</dd></div></dl></details></article>`).join('')||`<p class="muted">${empty}</p>`}</div>`;
}
function catalogHTML(knowledge){
 const rows=knowledge?.results||[];
 return `<div class="supervisor-section-head"><h2>会计知识与配平案例</h2><span class="badge neutral">本次找到 ${rows.length} 项</span></div>${rows.length?`<div class="precedent-grid">${rows.map(row=>`<article class="supervisor-panel"><h3>${esc(row.title||row.id)}</h3><p>${esc(row.summary)}</p><details><summary>适用环节与来源记录</summary>${bankerValueHTML({环节:row.stage,专业:row.discipline,证据状态:row.evidence_status,记录编号:row.id,版本:row.revision,内容校验值:row.content_sha256},{escape:esc})}</details></article>`).join('')}</div>`:'<p class="muted">没有找到匹配条目，可以换一个科目、会计事项或勾稽关系检索。</p>'}`;
}
function reviewBoardsHTML(run){
 const boards=(run?.business_boards||run?.banker?.boards||[]).filter(board=>board.room_id==='audit-lab');
 if(!boards.length)return '';
 const latest=new Map();for(const board of boards)latest.set(board.id,board);
 return `<h2>已形成的审阅记录</h2>${[...latest.values()].map(board=>`<section class="supervisor-panel"><h3>${esc(board.title)}</h3><p>${esc(board.summary)}</p>${(board.sections||[]).map(section=>`<h4>${esc(section.title)}</h4>${(section.rows||[]).map(row=>`<article class="harness-item"><strong>${esc(row.label)}</strong>${row.value==null?'':bankerValueHTML(row.value,{escape:esc})}<p>${esc(row.meaning||'')}</p>${row.formula?`<p>${esc(row.formula)}</p>`:''}${row.evidence?.length?`<details><summary>查看依据</summary>${row.evidence.map(evidence=>`<blockquote>${esc(evidence.quote)}<small>${esc(evidence.locator)}</small></blockquote>`).join('')}</details>`:''}</article>`).join('')}`).join('')}</section>`).join('')}`;
}
function memoUploadFields(){
 return `<label>资料用途<select name="source_kind">${Object.entries(memoKinds).map(([id,title])=>`<option value="${id}">${title}</option>`).join('')}</select></label><details><summary>关联已有版本、意见或问询（可选）</summary><label>与已有资料的关系<select name="relation"><option value="">暂不关联</option>${Object.entries(relationLabels).map(([id,title])=>`<option value="${id}">${title}</option>`).join('')}</select></label><label>选择关联原件<select name="related_source_ids" multiple size="4" aria-describedby="memo-relation-hint"></select></label><p class="field-hint" id="memo-relation-hint">关系与原件需同时选择。原文按各自版本留存。</p></details>`;
}
export function createKnowledgeWorkshop({api,onError=()=>{},onWorkspace=()=>{}}){
 let root=null,mode='accounting',project=null,generation=0,searchTicket=0,events=null,uploading=false,compact=false;
 const live=current=>root&&current===generation;
 const endpoint=()=>`/api/${mode}-library`;
 function notice(message){const status=root?.querySelector('[data-workshop-notice]');if(status)status.textContent=message;}
 function failure(error,current,target){if(!live(current))return;const status=target&&root.querySelector(target);if(status)status.textContent=error.message;notice(error.message);onError(error);}
 function updateSources(value){
  root.querySelector('[data-workshop-sources]').innerHTML=sourcesHTML(value,mode);
  if(compact)root.querySelector('[data-workshop-recent]').innerHTML=recentSourcesHTML(value,mode);
  const select=root.querySelector('[name="related_source_ids"]');
  if(select){const selected=new Set([...select.selectedOptions].map(option=>option.value));select.innerHTML=sourceList(value).map(source=>`<option value="${esc(source.id)}"${selected.has(source.id)?' selected':''}>${esc(source.name||source.id)}</option>`).join('');}
 }
 function adoptWorkspace(value,current,reason='mount'){
  if(!live(current))return false;
  if(!value?.id||value.internal_workspace!==`${mode}_librarian`||(project&&project.id!==value.id))throw new Error('服务返回的资料范围与当前工坊不一致。');
  if(project&&Number.isFinite(Number(project.revision))&&Number(value.revision)<Number(project.revision))return true;
  project=value;updateSources(project);onWorkspace(project,mode,{reason});return true;
 }
 async function search(query=''){
  const current=generation,ticket=++searchTicket;if(!live(current)||mode!=='accounting')return;
  const status=root.querySelector('[data-search-status]');status.textContent='正在查找…';
  try{const data=await api(endpoint()+'?'+new URLSearchParams({query,limit:'10'}));if(!live(current)||ticket!==searchTicket)return;if(!Array.isArray(data.knowledge?.results))throw new Error('知识目录暂未返回可读条目。');root.querySelector('[data-knowledge-results]').innerHTML=catalogHTML(data.knowledge);status.textContent='';}
  catch(error){if(ticket===searchTicket)failure(error,current,'[data-search-status]');}
 }
 async function memoCatalog(current){
  try{const data=await api(endpoint());if(!live(current))return;if(!Array.isArray(data.sources)||data.library_ownership!=='global_memo_workspace')throw new Error('Memo 目录暂未返回可读资料。');if(!project)updateSources({id:data.workspace_id,sources:data.sources});}
  catch(error){failure(error,current,'[data-catalog-status]');}
 }
 function unmount(){generation++;searchTicket++;events?.abort();events=null;root=null;project=null;uploading=false;}
 function compactSurface(){
  if(!compact)return;
  const content=root.innerHTML.replaceAll('在右侧','在聊天中').replaceAll('右侧管理员','管理员');
  root.innerHTML=`<section class="workshop-showcase" aria-label="${mode==='memo'?'Memo 书架':mode==='audit'?'本项目审阅资料':'会计书架'}"><div data-workshop-recent>${project?recentSourcesHTML(project,mode):'<p role="status">正在读取书架…</p>'}</div><p data-workshop-notice role="status" aria-live="polite"></p><details class="workshop-drawer" data-workshop-drawer><summary>${mode==='accounting'?'浏览全部资料与知识库':mode==='audit'?'浏览全部资料与审阅记录':'浏览全部资料与版本关系'} <span aria-hidden="true">↗</span></summary><div class="workshop-drawer-body">${content}</div></details></section>`;
  root.querySelector('.workshop-drawer-body .supervisor-heading')?.remove();
 }
 function reveal(target){
  const drawer=root.querySelector('[data-workshop-drawer]');if(drawer)drawer.open=true;
  if(!target)return;
  target.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  (target.querySelector('input,a,summary,button')||target).focus({preventScroll:true});
 }
 async function mount(el,options={}){
  unmount();root=el;mode=options.mode||'accounting';compact=options.compact===true;project=mode==='audit'?options.project||null:null;const current=generation;events=new AbortController();
  root.addEventListener('click',event=>{if(event.target.closest('[data-workshop-upload-focus]')){reveal(root.querySelector('[data-workshop-upload]'));return;}const card=event.target.closest('[data-workshop-source-open]');if(card)reveal([...root.querySelectorAll('[data-workshop-source-row]')].find(el=>el.dataset.workshopSourceRow===card.dataset.workshopSourceOpen));},{signal:events.signal});
  if(!['accounting','audit','memo'].includes(mode)){root.textContent='未登记此工作坊。';failure(new Error('未登记此工作坊。'),current);return;}
  if(mode==='audit'){
   if(!project?.id){root.innerHTML='<section class="supervisor-panel"><h1>项目审阅室</h1><p>先选择需要审阅的项目。</p></section>';return;}
   root.innerHTML=`<div class="supervisor-heading"><div><h1>项目审阅室</h1><p>审阅 ${esc(project.name||'本项目')} 的 PFM、memo 及支持资料，在原始出处上核对问题并复核修订。</p></div><button class="button button-primary" data-step="intake">补充审阅资料 ↗</button></div><div class="precedent-grid">${[['模型接线与勾稽','核对三表连接、现金与借款、历史重构及变动明细。'],['数字与假设','对照管理层讨论、FDD 和原始数据，核对数字、预测假设及其依据。'],['memo 与监管问题','核对 memo、模型结果与支持材料的一致性，记录相关披露及监管问题。']].map(([title,text])=>`<section class="supervisor-panel"><h2>${title}</h2><p>${text}</p></section>`).join('')}</div><section class="supervisor-panel" data-workshop-sources>${sourcesHTML(project,mode)}</section><div data-audit-boards></div>`;
   compactSurface();
   window.addEventListener('model-studio-room-update',event=>{if(!live(current)||event.detail?.projectId!==project.id||event.detail?.run?.role_id!=='audit_reviewer')return;root.querySelector('[data-audit-boards]').innerHTML=reviewBoardsHTML(event.detail.run);},{signal:events.signal});
   onWorkspace(project,mode,{reason:'mount'});return;
  }
  const memo=mode==='memo',title=memo?'Memo 工坊':'会计与配平工坊',kind=memo?'PFM memo、意见或监管问答':'会计指引、处理备忘录或案例',administrator=memo?'Memo 知识管理员':'会计知识管理员';
  root.innerHTML=`<div class="supervisor-heading"><div><h1>${title}</h1><p>${memo?'留存每轮 PFM memo、联席保荐人意见和监管问询回复，按原文整理问题、处理结论与版本关联。':'检索会计处理和配平案例，把适用条件、出处与处理意见交给管理员整理。'}</p></div><button class="button button-primary" data-workshop-upload-focus>上传${memo?'文稿或意见':'会计资料'} ↓</button></div><section class="supervisor-panel"><h2>上传${kind}</h2><form data-workshop-upload><label>选择资料<input name="file" type="file" accept=".json,.xlsx,.docx,.pdf,.txt,.md" required></label>${memo?memoUploadFields():''}<button class="button button-primary" type="submit">保存资料</button><p data-upload-status role="status" aria-live="polite"></p></form><p class="field-hint">支持 JSON、Excel、Word、PDF、TXT 和 Markdown（20 MB 以内）。保存后可在右侧确认阅读范围，交给${administrator}整理。</p></section>${memo?'<p data-catalog-status role="status"></p>':'<section class="supervisor-panel"><form data-workshop-search><label>检索会计问题或勾稽关系<input name="query" type="search" maxlength="200" placeholder="如借款、固定资产、现金流"></label><button class="button button-primary" type="submit">查找知识与案例</button><p data-search-status role="status" aria-live="polite"></p></form></section><div data-knowledge-results></div>'}<section class="supervisor-panel" data-workshop-sources><p>正在读取已上传资料…</p></section><p data-workspace-status role="status"></p>`;
  compactSurface();
  root.addEventListener('submit',async event=>{
   const form=event.target;if(!form.matches('[data-workshop-search],[data-workshop-upload]'))return;event.preventDefault();event.stopPropagation();if(!form.reportValidity())return;
   if(form.matches('[data-workshop-search]')){await search(String(new FormData(form).get('query')||''));return;}
   if(uploading)return;
   const body=new FormData(form),status=form.querySelector('[data-upload-status]');
   if(mode==='memo'){
    const relation=String(body.get('relation')||''),related=body.getAll('related_source_ids');
    if(Boolean(relation)!==Boolean(related.length)){status.textContent='请选择关系及关联原件，或同时清空两项后保存。';return;}
    body.delete('related_source_ids');if(related.length)body.set('related_source_ids',JSON.stringify(related));if(!relation)body.delete('relation');
   }
   uploading=true;const own=generation,button=form.querySelector('button');button.disabled=true;status.textContent='正在保存资料…';notice(status.textContent);
   try{const result=await api(endpoint()+'/sources',{method:'POST',body});if(!live(own))return;if(!adoptWorkspace(result.project,own,'sources-updated'))return;form.reset();const related=form.querySelector('[name="related_source_ids"]');if(related)related.selectedIndex=-1;status.textContent=result.duplicate?'该原件已有留存，已更新下方资料清单。':compact?'资料已保存。确认聊天中的阅读范围后即可继续整理。':'资料已保存。可在右侧确认本轮阅读范围并继续整理。';notice(status.textContent);}
   catch(error){failure(error,own,'[data-upload-status]');}
   finally{if(live(own)){uploading=false;button.disabled=false;}}
  },{signal:events.signal});
  await Promise.allSettled([memo?memoCatalog(current):search(),(async()=>{try{const result=await api(endpoint()+'/agent-workspace',{method:'POST',body:{}});adoptWorkspace(result.project,current);}catch(error){failure(error,current,'[data-workspace-status]');}})()]);
 }
 return {mount,unmount,search};
}

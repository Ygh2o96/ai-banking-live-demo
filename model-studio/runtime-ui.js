/* Projection of public events only. No inference of agent thought or approval. */
export const timeHK=value=>{if(!value)return '日期未提供';const d=new Date(value);return Number.isNaN(d.valueOf())?String(value):new Intl.DateTimeFormat('zh-HK',{timeZone:'Asia/Hong_Kong',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(d);};
export function captureScroll(root){return [...root.querySelectorAll('[data-live-scroll]')].map(e=>({id:e.dataset.liveScroll,top:e.scrollTop,left:e.scrollLeft,follow:e.scrollHeight-e.clientHeight-e.scrollTop<48}));}
export function restoreScroll(root,states){for(const e of root.querySelectorAll('[data-live-scroll]')){const state=states.find(s=>s.id===e.dataset.liveScroll);e.scrollTop=!state||state.follow?e.scrollHeight:state.top;e.scrollLeft=state?.left||0;}}
const names={consult_librarian:'请教常驻知识管理员',delegate_specialists:'并行安排专员',delegate_specialist:'安排专项专员',record_specialist_decision:'核对并接入专员成果',record_business_board:'更新业务看板',read_banker_todos:'查看待办',resolve_banker_todo:'记录问题解决依据',read_source:'阅读原始资料',get_context:'核对当前工作与指令',read_sop:'查阅工作指引',capability:'查阅工具合同',search_knowledge:'查询方法与先例知识',search_workshop_library:'查阅工坊资料与整理成果',read_tool_result:'查看完整计算结果',calculate:'核算数字',run_modelling_tool:'运行建模工具',record_workpaper:'保存工作底稿',patch_workpaper:'增量保存底稿',save_progress:'保存阶段笔记',read_previous_work:'接回前版工作',read_project_skill:'查阅项目 skill 与案例方法',record_source_metadata:'记录资料用途与日期',request_input:'提出具体问题',propose_decision:'提出关键判断',ack_input:'读取你的指令',record_document:'生成文稿',record_model_narratives:'更新业务叙事'};
export const toolName=k=>names[k]||k;
export function chatEvents(run){
 const events=(run?.events||[]).filter(e=>['agent_message','input_received','agent_tool_started','agent_tool_finished','progress_saved','runtime_nudge'].includes(e.kind));
 const finished=new Map(events.filter(e=>e.kind==='agent_tool_finished').map(e=>[e.payload.call_id,e]));
 return events.filter(e=>e.kind!=='agent_tool_finished').map(e=>{
  if(e.kind==='input_received'){const input=(run.inputs||[]).find(i=>i.id===e.payload.input_id||i.id===e.payload.id);return {...e,type:'user',text:input?.text||e.payload.text||'你的输入已收到',input};}
  if(e.kind==='agent_tool_started'){const end=finished.get(e.payload.call_id);return {...e,type:'tool',text:e.payload.tool==='run_modelling_tool'?e.payload.title:toolName(e.payload.tool),status:end?.payload.status||(['starting','running'].includes(run.agent_state?.status)&&e.payload.epoch===run.epoch?'running':'interrupted'),summary:end?.payload.summary||'调用已开始，尚无完成回执。'};}
  return {...e,type:e.kind==='agent_message'?'agent':'note',text:e.payload.text||e.payload.summary};
 });
}
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const fieldLabels={source_value:'来源数值',value:'数值',line:'科目',label:'项目',name:'名称',amount:'金额',unit:'单位',currency:'币种',period:'期间',entity:'主体',total:'合计',revenue:'收入',net_income:'净利润',cash:'现金',closing_cash:'期末现金',debt:'借款',closing_debt:'期末借款',cost:'成本',quantity:'数量',volume:'销量',price:'价格',rate:'比率',growth:'增长率',margin:'利润率',opening:'期初',closing:'期末',actual:'实际',forecast:'预测',historical:'历史',assumption:'假设',status:'状态',method:'方法',rationale:'判断依据',evidence:'来源依据',note:'说明',notes:'说明',reason:'原因',min:'下限',max:'上限',source_id:'来源编号',source_sha256:'来源校验值',sha256:'校验值',item_id:'项目编号',id:'编号',source:'来源',target:'目标',difference:'差额',gap:'缺口',comparison:'对比',drivers:'业务驱动',formula:'计算关系',reported:'报表数值',adjusted:'调整后数值',adjustment:'调整',segment:'分部',product:'产品',customer:'客户',supplier:'供应商',counterparty:'交易对方',description:'说明',title:'标题'};
export const readableKey=key=>fieldLabels[key]||(/^\d{4}[-/]\d{2}(?:[-/]\d{2})?$/.test(String(key))?String(key):String(key??'').replace(/([a-z\d])([A-Z])/g,'$1 $2').replace(/[_-]+/g,' ').replace(/^./,c=>c.toUpperCase()));
const digits=new Intl.NumberFormat('zh-CN',{maximumFractionDigits:6});
export function valueText(value){
 if(value===null||value===undefined)return '未取得';
 if(typeof value==='number')return Number.isFinite(value)?digits.format(value):'数值无效';
 if(typeof value==='boolean')return value?'是':'否';
 if(typeof value!=='object')return String(value);
 if(Array.isArray(value))return value.length?value.map(valueText).join('；'):'未提供明细';
 return Object.keys(value).length?Object.entries(value).map(([key,item])=>`${readableKey(key)}：${valueText(item)}`).join('；'):'未提供明细';
}
// Values stay source-shaped: unknown keys are made readable, never assigned financial meaning.
export function bankerValueHTML(value,{escape=escapeHTML,format=valueText}={}){
 if(value===null||typeof value!=='object')return `<span class="banker-scalar">${escape(format(value))}</span>`;
 if(Array.isArray(value)){
  if(!value.length)return '<span class="muted">未提供明细</span>';
  const records=value.every(item=>item&&typeof item==='object'&&!Array.isArray(item));
  if(records){const keys=[...new Set(value.flatMap(Object.keys))];return `<div class="banker-table-wrap"><table class="banker-value-table"><thead><tr>${keys.map(key=>`<th scope="col">${escape(readableKey(key))}</th>`).join('')}</tr></thead><tbody>${value.map(item=>`<tr>${keys.map(key=>`<td>${bankerValueHTML(item[key],{escape,format})}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
  return `<ul class="banker-value-list">${value.map(item=>`<li>${bankerValueHTML(item,{escape,format})}</li>`).join('')}</ul>`;
 }
 const entries=Object.entries(value);
 return entries.length?`<dl class="banker-key-values">${entries.map(([key,item])=>`<div><dt>${escape(readableKey(key))}</dt><dd>${bankerValueHTML(item,{escape,format})}</dd></div>`).join('')}</dl>`:'<span class="muted">未提供明细</span>';
}
export const technicalDetailsHTML=(value,{escape=escapeHTML,label='原始字段与计算依据',id=''}={})=>`<details class="technical-details" ${id?`data-h-detail="${escape(id)}"`:''}><summary>${escape(label)}</summary><pre>${escape(JSON.stringify(value,null,2))}</pre></details>`;
export const agentTitle=run=>(!run?.role_id||run.role_id==='modelling')?'华泰建模专家':run.role_title||({source_librarian:'资料管理员',precedent_librarian:'先例图书管理员',accounting_librarian:'会计知识管理员',memo_librarian:'Memo 知识管理员',audit_reviewer:'项目审阅员'}[run.role_id]||'资料管理员');
const toolStatus={succeeded:'已产出结果',failed:'调用失败',running:'运行中',interrupted:'已中断，未取得完成回执',superseded:'已被新指令替代'};
function entryHTML(e,run,esc,receipt){
 if(e.type==='attachment')return `<article class="conversation-entry output" data-event-id="${esc(e.id)}" data-output-kind="${esc(e.recordKind)}" data-output-record="${esc(e.recordId)}"><div class="conversation-meta"><strong>${esc(e.label||'已保存成果')}</strong><time>${e.at?esc(timeHK(e.at)):'保存时间未记录'}</time>${e.status?`<span>${esc(e.status)}</span>`:''}</div><div data-output-body>${e.html}</div></article>`;
 return `<article class="conversation-entry ${e.type}" data-event-id="${esc(e.id)}"><div class="conversation-meta"><strong>${e.type==='user'?'你':e.type==='tool'?'工具':e.type==='note'?'工作记录':esc(agentTitle(run))}</strong><time>${esc(timeHK(e.at))}</time>${e.payload?.epoch!==undefined&&e.payload.epoch!==run.epoch?'<span>前轮记录</span>':''}</div>${e.type==='tool'?`<p><span class="tool-light ${esc(e.status)}"></span>${esc(e.text)} · ${esc(toolStatus[e.status]||e.status)}</p><small>${esc(e.summary)}</small>`:`<div class="harness-verbatim" data-message-text>${esc(e.text)}</div>`}<small data-message-interruption ${e.payload?.partial?'':'hidden'}>中断前已输出的片段</small>${e.input?receipt(e.input,esc):''}</article>`;
}
const splitEvents=run=>{const all=chatEvents(run);return {messages:all.filter(e=>['user','agent'].includes(e.type)),actions:all.filter(e=>!['user','agent'].includes(e.type))};};
const dated=e=>typeof e.at==='string'&&Number.isFinite(Date.parse(e.at));
function chronological(a,b){
 const delta=(dated(a)?Date.parse(a.at):Infinity)-(dated(b)?Date.parse(b.at):Infinity);
 if(delta)return delta;
 // Preserve server sub-millisecond timestamps before using the same-run sequence.
 const fraction=e=>(typeof e.at==='string'?e.at.match(/\.(\d+)(?:Z|[+-]\d\d:\d\d)$/)?.[1]||'':'').padEnd(9,'0').slice(3,9);
 return fraction(a).localeCompare(fraction(b))||(Number.isInteger(a.seq)&&Number.isInteger(b.seq)?a.seq-b.seq:0);
}
export function conversationEntries(run,attachments=[]){
 const {messages,actions}=splitEvents(run);
 return {messages:[...messages,...attachments.filter(dated)].sort(chronological),actions,undated:attachments.filter(e=>!dated(e))};
}
export function conversationHTML(run,esc=escapeHTML,receipt=()=> '',{attachments=[]}={}){
 const {messages,actions,undated}=conversationEntries(run,attachments);
 return `<div class="agent-conversation" data-live-scroll="chat:${esc(run.id)}" role="log" aria-label="与${esc(agentTitle(run))}的对话" aria-live="off"><details class="conversation-undated" data-conversation-undated data-h-detail="undated-outputs-${esc(run.id)}" ${undated.length?'':'hidden'}><summary>保存时间未记录的成果</summary><div data-conversation-undated-entries>${undated.map(e=>entryHTML(e,run,esc,receipt)).join('')}</div></details><div data-conversation-messages>${messages.map(e=>entryHTML(e,run,esc,receipt)).join('')}</div><p class="muted" data-conversation-empty ${messages.length||undated.length||run.live_message?'hidden':''}>可以直接讨论本间工作，或告诉我需要调整的地方。</p><article class="conversation-entry agent" data-live-message ${run.live_message?.text?'':'hidden'}><div class="conversation-meta"><strong>${esc(agentTitle(run))}</strong><span>正在回复</span></div><div class="harness-verbatim" data-message-text>${esc(run.live_message?.text||'')}</div></article><details class="conversation-actions" data-h-detail="chat-actions-${esc(run.id)}" ${actions.length?'':'hidden'}><summary>查看工作动作 <span data-action-count>${actions.length}</span></summary><div data-conversation-actions>${actions.map(e=>entryHTML(e,run,esc,receipt)).join('')}</div></details></div>`;
}
function appendText(element,text){
 const next=String(text??''),prior=element.textContent;
 if(prior===next)return;
 if(next.startsWith(prior)&&element.childNodes.length===1&&element.firstChild.nodeType===3)element.firstChild.appendData(next.slice(prior.length));
 else element.textContent=next;
}
function patchEntries(container,events,run,esc,receipt,beforeRemove=()=>{}){
 const existing=new Map([...container.children].map(node=>[node.dataset.eventId,node]));
 let cursor=container.firstElementChild;
 for(const event of events){
  let node=existing.get(String(event.id));const signature=JSON.stringify([event,run.epoch,agentTitle(run)]);
  if(!node){const template=container.ownerDocument.createElement('template');template.innerHTML=entryHTML(event,run,esc,receipt);node=template.content.firstElementChild;}
  else if(event.type==='attachment'){
   // Metadata changes must not destroy an interactive board or its filter state.
   if(node._outputHTML!==event.html){const body=node.querySelector('[data-output-body]');beforeRemove(body);body.innerHTML=event.html;}
   if(node._eventSignature!==signature){const template=container.ownerDocument.createElement('template');template.innerHTML=entryHTML(event,run,esc,receipt);node.querySelector('.conversation-meta').replaceWith(template.content.querySelector('.conversation-meta'));}
  }
  else if(node._eventSignature!==signature){const text=node.querySelector('[data-message-text]');if(event.type==='agent'&&text){appendText(text,event.text);const metaKey=JSON.stringify([event.at,event.payload?.epoch,run.epoch,agentTitle(run)]);if(node._metaKey!==metaKey){const template=container.ownerDocument.createElement('template');template.innerHTML=entryHTML(event,run,esc,receipt);node.querySelector('.conversation-meta').replaceWith(template.content.querySelector('.conversation-meta'));node._metaKey=metaKey;}node.querySelector('[data-message-interruption]').hidden=!event.payload?.partial;}else {const template=container.ownerDocument.createElement('template');template.innerHTML=entryHTML(event,run,esc,receipt);const next=template.content.firstElementChild;node.replaceWith(next);node=next;}}
  if(cursor&&!cursor.isConnected)cursor=node.parentElement===container?node:container.firstElementChild;
  if(node!==cursor)container.insertBefore(node,cursor);cursor=node.nextElementSibling;
  if(event.type==='attachment')node._outputHTML=event.html;
  node._eventSignature=signature;existing.delete(String(event.id));
 }
 for(const node of existing.values()){beforeRemove(node);node.remove();}
}
// Polling changes only new message text or changed receipts; the composer and scroll host survive.
export function syncConversation(root,run,esc=escapeHTML,receipt=()=> '',{attachments=[],beforeRemove=()=>{}}={}){
 const host=root?.matches?.('.agent-conversation')?root:root?.querySelector('.agent-conversation');
 if(!host||host.dataset.liveScroll!==`chat:${run?.id}`)return false;
 const states=captureScroll(root===host?host.parentElement:root),{messages,actions,undated}=conversationEntries(run,attachments);
 patchEntries(host.querySelector('[data-conversation-messages]'),messages,run,esc,receipt,beforeRemove);
 patchEntries(host.querySelector('[data-conversation-actions]'),actions,run,esc,receipt,beforeRemove);
 patchEntries(host.querySelector('[data-conversation-undated-entries]'),undated,run,esc,receipt,beforeRemove);
 host.querySelector('[data-conversation-undated]').hidden=!undated.length;
 host.setAttribute('aria-label',`与${agentTitle(run)}的对话`);const live=host.querySelector('[data-live-message]');appendText(live.querySelector('strong'),agentTitle(run));live.hidden=!run.live_message?.text;appendText(live.querySelector('[data-message-text]'),run.live_message?.text||'');
 host.querySelector('[data-conversation-empty]').hidden=!!(messages.length||undated.length||run.live_message?.text);
 const detail=host.querySelector('.conversation-actions');detail.hidden=!actions.length;appendText(detail.querySelector('[data-action-count]'),actions.length);
 restoreScroll(root===host?host.parentElement:root,states);return true;
}
// Runtime timestamps and public token deltas do not invalidate the financial workspace.
export function workspaceRenderKey(run){
 if(!run)return 'no-run';
 const keys=['id','role_id','role_title','business_boards','goal','epoch','control','source_revision','source_current','current_source_revision','engine_current','source_sha256','knowledge_sha256','agent_consent','source_index','knowledge_index','workpapers','questions','decisions','completions','calls','models','documents','narratives','request_drafts','request_lists','inputs','progress_notes','carryover','workrooms','banker'];
 return JSON.stringify([keys.map(key=>run[key]),run.agent_state?.status,run.agent_state?.error,run.native_artifacts,run.worker_state]);
}
export function toolShelfHTML(cap,run,room,projection,esc){
 const all=cap?.tools||[],recommended=room==='overview'?all:all.filter(t=>projection?.recommended_tool_ids?.includes(t.id));
 const sops=run?.knowledge_index?.sops||cap?.knowledge?.sops||[];
 const relevant=room==='overview'?sops:sops.filter(s=>projection?.recommended_sop_ids?.includes(s.id));
 const methods=(run?.knowledge_index?.project_methods?.resources||cap?.knowledge?.project_methods?.resources||[]).filter(m=>room==='overview'||m.rooms?.includes(room));
 const card=t=>{const calls=(run?.calls||[]).filter(c=>c.tool===t.id),latest=calls.at(-1);return `<article class="tool-shelf-item"><strong><span class="tool-light ${esc(latest?.status||'ready')}"></span>${esc(t.label)}</strong><p>${esc(t.description)}</p><small>${latest?`本工作版本调用 ${calls.length} 次 · ${{running:'运行中',succeeded:'已产出结果',failed:'调用失败',superseded:'已被新输入替代'}[latest.status]||latest.status}`:'可按需调用'}</small></article>`;};
 return `<details class="room-tool-shelf" data-h-detail="tool-shelf-${esc(room)}"><summary>可用分析工具与方法</summary><div class="tool-shelf">${recommended.map(card).join('')}</div><details data-h-detail="sops-${esc(room)}"><summary>本间工作指引</summary>${relevant.map(s=>`<p><strong>${esc(s.title)}</strong><br>${esc(s.when)}</p>`).join('')||'<p>由主 agent 按本次目标选择指引。</p>'}</details><details data-h-detail="project-skills-${esc(room)}"><summary>项目 skill 与案例方法 · ${methods.length} 项</summary>${methods.map(m=>`<article class="tool-shelf-item"><strong>${esc(m.title)}</strong><p>${esc(m.scope)}</p><small>可用工具：${m.tools.map(id=>esc(all.find(t=>t.id===id)?.label||toolName(id))).join('、')}<br>版本 ${esc(m.sha256.slice(0,12))} · 按需读取</small></article>`).join('')}</details><details data-h-detail="all-tools-${esc(room)}"><summary>全部工具与工作指引</summary>${all.filter(t=>!recommended.includes(t)).map(card).join('')}${sops.map(s=>`<p>${esc(s.title)} · ${esc(s.when)}</p>`).join('')}</details></details>`;
}

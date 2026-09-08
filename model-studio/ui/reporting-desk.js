import {presentationTypes,renderFinancialSection} from './financial-presentations.js';
/* Reporting is a presentation of saved runs and public messages, never a new agent. */
import {conversationHTML, agentTitle} from './runtime-ui.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ownRooms={source_librarian:'intake',intake_librarian:'intake',data_librarian:'data-room',precedent_librarian:'precedents',accounting_librarian:'accounting-library',memo_librarian:'memo-library',audit_reviewer:'audit-lab'};
export const reportingIntakeRoom=roleId=>roleId==='audit_reviewer'?'intake':ownRooms[roleId]||'intake';
export const reportingIsCurrent=run=>!!run&&run.source_current&&run.engine_current!==false&&run.control!=='cancelled';
const nativeId=value=>typeof value==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value);
const currentWorker=run=>run.worker_state&&Number.isInteger(run.epoch)&&run.worker_state.parent_epoch===run.epoch?run.worker_state:null;
function nativeArtifacts(run){
 const artifacts=new Map(),workerArtifacts=Array.isArray(run.worker_state?.artifacts)?run.worker_state.artifacts:[];
 const candidates=[...(Array.isArray(run.native_artifacts)?run.native_artifacts:[]),...workerArtifacts.map(item=>item&&({...item,current:!!currentWorker(run)&&item.current===true}))];
 // The parent projection takes precedence when a worker entry is also present.
 for(const item of candidates){
  if(!item||!nativeId(item.run_id)||!nativeId(item.id))continue;
  const key=`${item.run_id}:${item.id}`;if(!artifacts.has(key))artifacts.set(key,item);
 }
 return [...artifacts.values()];
}
const nativeArtifactCurrent=(run,item)=>reportingIsCurrent(run)&&item.current===true;
const nativeArtifactLabel=item=>/\.xlsx?$/i.test(item.filename||'')||/\.xlsm$/i.test(item.filename||'')?'工作簿':/\.(docx?|pdf|md|txt)$/i.test(item.filename||'')?'文稿':'成果文件';
const nativeArtifactPrimary=item=>/\.(xlsx|xls|xlsm|docx|doc|pdf|pptx|html)$/i.test(item.filename||'')||['report','memo','workbook'].includes(item.kind);
export function reportingStatus(run){
 if(!run)return '准备开始';
 if(run.control==='paused')return '已暂停';
 if(!reportingIsCurrent(run))return '需要建立接续记录';
 if(run.agent_state?.error||run.agent_state?.status==='failed')return '本轮未完成';
 if(run.agent_state?.status==='starting')return '正在连接';
 const worker=currentWorker(run),workerFinished=['waiting','completed'].includes(worker?.status);
 const hasCurrentArtifacts=!!worker&&nativeArtifacts(run).some(item=>item.run_id===worker.run_id&&nativeArtifactCurrent(run,item));
 if(run.agent_state?.status==='running')return workerFinished&&!hasCurrentArtifacts?'正在整理下一步':'正在处理';
 if(run.status==='needs_input')return '有事项需要你判断';
 if(run.status==='input_received')return '补充已收到';
 if(worker){
  if(worker.status==='failed')return '模型搭建未完成';
  if(['starting','running'].includes(worker.status))return '正在搭建模型';
  if(Array.isArray(worker.questions)&&worker.questions.some(q=>q?.status==='open'))return '有模型事项需要补充';
  if(workerFinished)return hasCurrentArtifacts?'模型成果已保存':'本轮建模已结束';
 }
 if(run.status==='succeeded')return '已保存成果';
 if(run.agent_state?.status==='waiting'||run.status==='agent_waiting')return '本轮已结束';
 return run.agent_state?.status==='stopped'?'可以接续工作':'目标已保存';
}
function roomButton(room,label,extra=''){return `<button type="button" class="reporting-room-link" data-reporting-open-room="${esc(room)}" ${extra}>${esc(label)}<span aria-hidden="true">↗</span></button>`;}
function pickerHTML(runs,run){return `<label class="run-picker">工作记录<select data-h-run><option value="">＋ 新工作目标</option>${runs.map(r=>`<option value="${esc(r.id)}" ${r.id===run?.id?'selected':''}>${esc(r.goal)}</option>`).join('')}</select></label>`;}
export function reportingControlsHTML({run,runs=[],cap,scope,hasConsent,scopeHTML='',pending=false}){
 runs=runs.filter(r=>r?.role_id!=='model_worker');
 const record=`<details class="reporting-record" data-h-detail="reporting-record"><summary>工作记录${run?' · '+esc(run.goal?.slice(0,34)):''}</summary>${run?`<p class="harness-verbatim">${esc(run.goal)}</p>`:''}${pickerHTML(runs,run)}</details>`;
 if(!run)return runs.length?record:'';
 const current=reportingIsCurrent(run),operating=['starting','running','waiting'].includes(run.agent_state?.status),disabled=pending?'disabled':'';
 let action='';
 if(!current){
  action=`<form class="reporting-continuation" data-h-form="continue" data-h-kind="continue"><p>${run.control==='cancelled'?'这次工作已结束。':'资料或工作方法已有更新。'}已有讨论和底稿可以接回。</p><label>接下来做什么<textarea name="text" rows="2" required>${esc(run.goal)}</textarea></label><button class="button button-primary" type="submit" ${disabled}>按当前资料接续</button><p data-role-result role="status"></p></form>`;
 }else if(!hasConsent){
  action=`<form class="reporting-consent" data-h-form="start" data-h-kind="start"><p class="reporting-service">${esc(cap?.agent?.label||'正在读取服务信息')}</p><details data-h-detail="reporting-consent"><summary>本次使用 ${(run.source_index||[]).length} 份资料 · 查看范围</summary><ul>${(run.source_index||[]).map(s=>`<li>${esc(s.name)}</li>`).join('')||'<li>本次未选择项目来源文件。</li>'}</ul>${scopeHTML}<p>包括本次目标、后续指令及已固定的工作方法。${run.continued_from?'同时接回前次工作记录。':''}</p><details data-h-detail="reporting-scope-identifiers"><summary>资料与版本校验依据</summary><pre>${esc(JSON.stringify({scope,sources:(run.source_index||[]).map(s=>({name:s.name,sha256:s.sha256}))},null,2))}</pre></details></details><div class="reporting-consent-footer"><label class="check-label"><input name="consent" type="checkbox" required>同意按上述资料和服务范围处理本次任务</label><button class="button button-primary" type="submit" ${pending||!cap?.agent?.available?'disabled':''}>确认并开始</button></div>${!cap?.agent?.available?'<p class="field-hint">服务暂不可用，工作目标已保存。</p>':''}<p data-role-result role="status"></p></form>`;
 }else if(run.control==='paused'){
  action=`<button type="button" class="button button-small" data-h-control="resume" ${disabled}>继续工作</button>`;
 }else if(operating){
  action=`<button type="button" class="button button-small reporting-pause" data-h-control="pause" ${disabled}>暂停</button>`;
 }else{
  action=`<form data-h-form="start" data-h-kind="start"><button class="button button-small" type="submit" ${pending||!cap?.agent?.available?'disabled':''}>接续工作</button><p data-role-result role="status"></p></form>`;
 }
 return `<div class="reporting-session-row">${record}${hasConsent&&current?action:''}</div>${!hasConsent||!current?action:''}${run.agent_state?.error?`<details class="reporting-error" data-h-detail="reporting-error"><summary>这次处理未完成，查看原因</summary><p>${esc(run.agent_state.error)}</p></details>`:''}`;
}
function responseForm(item,kind='answer'){
 const permission=['decision_response','completion_response'].includes(kind);
 return `<form data-h-form="${esc(item.id)}" data-h-kind="${kind}"><label><span class="sr-only">你的回复</span><textarea name="text" rows="2" required placeholder="补充情况，或说明你希望怎么处理…"></textarea></label>${permission?'<label>本次决定<select name="accept" required><option value="">请选择</option><option value="true">同意在上述范围内推进</option><option value="false">按我的意见调整</option></select></label>':''}<button type="submit" class="button button-small button-primary">回复并继续</button><p data-role-result role="status"></p></form>`;
}
export function reportingAttentionHTML(run){
 if(!run)return '';
 const todos=(run.banker?.todos||[]).filter(t=>t.needs_banker&&t.status==='open');
 const questions=run.banker?.todos?(todos.map(t=>`<details class="reporting-question" data-h-detail="reporting-todo-${esc(t.id)}"><summary>${esc(t.title)}</summary>${t.text!==t.title?`<p>${esc(t.text)}</p>`:''}<p>${esc(t.rationale)}</p><form data-h-form="todo:${esc(t.id)}" data-h-kind="banker_response" data-todo-id="${esc(t.id)}" data-todo-signature="${esc(t.signature)}"><label><span class="sr-only">你的回复</span><textarea name="text" rows="2" required placeholder="补充情况；暂时拿不到也可以说明原因…"></textarea></label><div class="reporting-answer-actions"><select name="action" aria-label="如何处理这项问题"><option value="reply">回复，交给我核对</option><option value="unavailable">暂时无法提供</option><option value="resolve">这项已解决</option></select><button type="submit" class="button button-small button-primary">回复并继续</button></div><p data-banker-result role="status"></p></form></details>`).join('')):(run.questions||[]).filter(q=>q.status==='open').map(q=>`<details class="reporting-question" data-h-detail="reporting-question-${esc(q.id)}"><summary>${esc(q.text)}</summary><p>${esc(q.rationale)}</p>${responseForm(q)}</details>`).join('');
 const decisions=(run.decisions||[]).filter(d=>d.status==='proposed'&&d.epoch===run.epoch).map(d=>`<details class="reporting-question" data-h-detail="reporting-decision-${esc(d.id)}"><summary>${esc(d.text)}</summary><p>${esc(d.rationale)}</p>${responseForm(d,'decision_response')}</details>`).join('');
 const completions=(run.completions||[]).filter(c=>c.status==='proposed'&&c.epoch===run.epoch).map(c=>`<details class="reporting-question" data-h-detail="reporting-completion-${esc(c.id)}"><summary>${esc(c.title)}</summary><p>${esc(c.rationale)}</p><ul>${(c.targets||[]).map(t=>`<li><strong>${esc(t.label)} · ${esc(t.min)}–${esc(t.max)} ${esc(t.unit)}</strong><p>${esc(t.entity)} · ${esc(t.period)}<br>${esc(t.method)}<br>替换条件：${esc(t.replacement_trigger)}</p></li>`).join('')}</ul>${responseForm(c,'completion_response')}</details>`).join('');
 return questions||decisions||completions?`<section class="reporting-attention"><h3>需要你的判断</h3>${questions}${decisions}${completions}</section>`:'';
}
export function reportingOutputsHTML(run,roleId='modelling'){
 if(!run)return '';
 const cards=[],supportingFiles=[],paper=run.workpapers?.at(-1),ownRoom=ownRooms[roleId]||'alchemy';
 for(const item of nativeArtifacts(run)){
  const title=typeof item.title==='string'&&item.title.trim()?item.title:typeof item.filename==='string'&&item.filename.trim()?item.filename:'下载成果文件';
  const current=nativeArtifactCurrent(run,item),target=current&&nativeArtifactPrimary(item)?cards:supportingFiles;
  target.push(`<article class="reporting-output-card" data-native-artifact="${item.id}"><span>${current?'本版':'前版'}${nativeArtifactLabel(item)}</span><a href="#preview-file-${item.run_id}/native-artifacts/${item.id}">${esc(title)} <span aria-hidden="true">↓</span></a>${typeof item.filename==='string'&&item.filename!==title?`<small>${esc(item.filename)}</small>`:''}</article>`);
 }
 if(paper)cards.push(`<article class="reporting-output-card"><span>工作底稿${paper.version!=null?' · V'+esc(paper.version):''}</span>${roomButton(ownRoom,paper.summary||'查看已保存底稿')}<small>${paper.current?'本版底稿':'前版底稿'}</small></article>`);
 const boards=new Map();for(const board of run.business_boards||run.banker?.boards||[])boards.set(board.id,board);
 for(const board of [...boards.values()].slice(-3)){if(['inline','both'].includes(board.placement)){cards.push(`<section class="reporting-inline-board"><h3>${esc(board.title)}</h3><p>${esc(board.summary)}</p>${(board.sections||[]).filter(s=>presentationTypes.includes(s.type)).map(s=>renderFinancialSection(s,esc)).join('')}</section>`);if(board.placement==='inline')continue;}cards.push(`<article class="reporting-output-card"><span>工作间成果</span>${roomButton(board.room_id||ownRoom,board.title)}<small>${esc(board.summary)}</small></article>`);}
 for(const c of (run.calls||[]).filter(c=>c.tool==='model_export'&&c.status==='succeeded').slice(-2))cards.push(`<article class="reporting-output-card"><span>${c.current?'本版工作簿':'前版工作簿'}</span><a href="#preview-file-${encodeURIComponent(run.id)}/artifacts/${encodeURIComponent(c.id)}">下载公式 Excel <span aria-hidden="true">↓</span></a></article>`);
 for(const d of (run.documents||[]).slice(-3))cards.push(`<article class="reporting-output-card"><span>${d.current?'本版文稿':'前版文稿'}</span><a target="_blank" rel="noopener" href="#preview-file-${encodeURIComponent(run.id)}/documents/${encodeURIComponent(d.id)}">${esc(d.title_zh||d.title||'查看文稿')} <span aria-hidden="true">↗</span></a></article>`);
 for(const request of (run.request_lists||[]).slice(-2))cards.push(`<article class="reporting-output-card"><span>已审批资料清单</span><a href="#preview-file-${encodeURIComponent(run.id)}/request-lists/${encodeURIComponent(request.id)}">${request.format==='xlsx'?'下载可填写 Excel':'下载资料清单'} <span aria-hidden="true">↓</span></a></article>`);
 if((run.request_drafts||[]).some(d=>d.epoch===run.epoch))cards.push(`<article class="reporting-output-card"><span>资料需求草稿</span>${roomButton('dispatch','审阅资料需求')}</article>`);
 const history=supportingFiles.length?`<details class="reporting-record reporting-artifact-history" data-h-detail="native-artifact-history" style="margin-top:12px"><summary>计算底稿与历史版本</summary><div class="reporting-output-grid">${supportingFiles.join('')}</div></details>`:'';
 return cards.length||history?`<section class="reporting-outputs"><h3>已保存的成果</h3>${cards.length?`<div class="reporting-output-grid">${cards.join('')}</div>`:''}${history}</section>`:'';
}
export function reportingComposerHTML({run,roleId='modelling',steerId,hasConsent,pending=false,discussionContext=null}){
 const current=reportingIsCurrent(run),canSend=!run||current&&hasConsent&&run.control!=='paused';
 return `<form class="live-chat-composer reporting-composer" data-h-form="${run?esc(steerId):'goal'}" data-h-kind="${run?'steer':'create'}"><div class="reporting-context" data-reporting-context ${discussionContext?'':'hidden'} style="margin-bottom:9px"><span class="badge neutral" style="display:inline-flex;align-items:center;gap:8px;max-width:100%"><span data-reporting-context-label style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${discussionContext?'讨论：'+esc(discussionContext.label):''}</span><button type="button" class="button button-small" data-reporting-clear-context aria-label="清除讨论上下文" title="清除讨论上下文" style="padding:0 4px;border:0;background:transparent;line-height:1.2">×</button></span></div><label><span class="sr-only">${run?'给'+esc(agentTitle(run))+'发消息':'这次需要完成什么'}</span><textarea name="${run?'text':'goal'}" rows="3" required maxlength="12000" placeholder="${run?'说说你的判断，或告诉我接下来怎么做…':'说说这次需要完成什么，也可以先上传资料…'}"></textarea></label><div class="reporting-composer-footer"><button class="reporting-attach" type="button" data-reporting-open-room="${esc(reportingIntakeRoom(roleId))}" data-reporting-intent="upload" aria-label="添加资料" title="添加资料"><span aria-hidden="true">＋</span> 资料</button>${run?`<label class="reporting-intent"><span class="sr-only">处理方式</span><select name="intent" aria-label="处理方式"><option value="revision">按此继续工作</option><option value="discussion">先讨论</option>${roleId==='modelling'?'<option value="trial">先试算</option>':''}</select></label>`:'<span class="reporting-composer-hint">先保存目标，再确认资料范围</span>'}<button class="button button-primary reporting-send" type="submit" ${!canSend||pending?'disabled':''}>${run?'发送':'开始'} <span aria-hidden="true">↑</span></button></div><small data-reporting-composer-hint ${canSend?'hidden':''}>${run?.control==='paused'?'工作已暂停，点击上方继续工作。':current?'请先确认上方资料与服务范围。':'请先按当前资料建立接续记录。'}</small><p data-role-result role="status"></p></form>`;
}
export function reportingDeskHTML(options){
 const {run,roleId='modelling',receipt=()=>''}=options,title=roleId==='modelling'?'华泰建模专家':agentTitle(run||{role_id:roleId});
 const conversation=run?conversationHTML(run,esc,receipt).replace('<details class="conversation-actions"',`<div data-reporting-outputs>${reportingOutputsHTML(run,roleId)}</div><div data-reporting-attention>${reportingAttentionHTML(run)}</div><details class="conversation-actions"`):`<div class="agent-conversation reporting-welcome"><span class="reporting-welcome-symbol" aria-hidden="true">↗</span><h2>${roleId==='modelling'?'这次，我们要完成什么？':'把这次需要整理的事情交给我'}</h2><p>${roleId==='modelling'?'从资料和你的目标开始。讨论、底稿和需要你判断的事项都会留在这里。':'说明需要解决的问题，选择相关资料，然后继续讨论。'}</p></div>`;
 return `<section class="reporting-desk" data-live-chat data-run-id="${esc(run?.id||'')}" data-role-id="${esc(roleId)}"><header class="reporting-desk-head"><div><span class="reporting-eyebrow">${roleId==='modelling'?'项目汇报桌':'工作间对话'}</span><h2>${esc(title)}</h2></div><div class="reporting-runtime" role="status"><span class="activity-dot" data-reporting-dot></span><span data-reporting-status>${esc(reportingStatus(run))}</span></div></header><div class="reporting-controls" data-reporting-controls>${reportingControlsHTML(options)}</div>${conversation}<button type="button" class="button button-small chat-latest" data-chat-latest ${run?'':'hidden'}>最新进展 ↓</button><div data-reporting-composer>${reportingComposerHTML(options)}</div></section>`;
}

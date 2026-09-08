import {projectRequest} from './project-transport.js';
import {createCashScheduleEditor} from './cash-schedule.js';
import {createFundingEditor} from './funding.js';
import {createTraceViewer,resolveTraceBinding} from './trace.js';
import {OPERATING_DRIVERS,createOperatingControls,hasEffectiveOperatingMap,operatingStageText} from './operating.js';
import {createProvisionalControls,provisionalSummaryHTML} from './provisional.js';
import {createLiquidityController,liquidityHTML,liquidityTraceTarget,resolveLiquidityInputTarget} from './liquidity.js';
import {createHarnessController} from './harness.js';
import {ROOMS} from './workrooms.js';
import {createSourceRoom} from './source-room.js';
import {createPrecedentWorkshop} from './precedents.js';
import {createKnowledgeWorkshop} from './knowledge-workshops.js';
import {createRoomDrawer} from './reporting-shell.js';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const clone = value => JSON.parse(JSON.stringify(value));
const array = value => Array.isArray(value) ? value : [];
const readable = value => typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '');
const first = (...values) => values.find(value => value !== undefined && value !== null);
const number = value => value === null || value === undefined || value === '' || !Number.isFinite(Number(value)) ? null : Number(value);
const fmt = (value, digits = 1) => number(value) === null ? '—' : new Intl.NumberFormat('zh-CN', {maximumFractionDigits:digits,minimumFractionDigits:digits}).format(Number(value));
const stamp = value => { if (!value) return '时间未提供'; const date = new Date(value); return Number.isNaN(date.valueOf()) ? esc(value) : date.toLocaleString('zh-CN', {timeZone:'Asia/Hong_Kong',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}); };
const LEGACY_STEPS = [['harness','主工作台','看 agent 工作、审判断、随时纠偏'],['sources','资料库','上传和核对原始资料'],['mapping','映射底稿','查看 agent 的科目判断与依据'],['assumptions','核心假设','查看业务叙事并调整假设'],['model','模型与情景','查看模型和情景结果'],['review','交付与返工','冻结成果、复核与修改']];
const STEPS=[['harness','主工作台','统筹项目'],['intake','收件室','接收已有项目资料'],['data-room','标准件房','查看全套数据与适用来源'],...ROOMS,['audit-lab','审核工坊','独立审阅本项目 PFM 与 memo']];
let auditMode=false;try{auditMode=sessionStorage.getItem('model-studio-audit-mode')==='true';}catch{}
const roomUpdates=new Map();
let roomSeen;try{roomSeen=new Map(JSON.parse(localStorage.getItem('model-studio-room-seen')||'[]'));}catch{roomSeen=new Map();}
function rememberRoom(key,value){roomSeen.set(key,value);try{localStorage.setItem('model-studio-room-seen',JSON.stringify([...roomSeen].slice(-500)));}catch{}}
function updateRoomNavigation(detail){
 if(detail)roomUpdates.set(`${detail.projectId}:${detail.run?.role_id||'modelling'}`,detail);
 for(const d of roomUpdates.values()){
 if(d.projectId!==state.project?.id&&!['precedent_librarian','accounting_librarian','memo_librarian'].includes(d.run?.role_id))continue;
 for(const r of d.run?.workrooms?.rooms||[]){
  const button=document.querySelector(`#step-nav [data-step="${r.id}"]`);
  const key=`${d.projectId}:${d.run.id}:${r.id}`;
  if(state.step===r.id||roomDrawer.current()===r.id)rememberRoom(key,r.output_revision);
  if(!button)continue;
  let badge=button.querySelector('.room-nav-status');if(!badge){badge=document.createElement('span');badge.className='room-nav-status';button.append(badge);}
  const fresh=!!r.output_revision&&r.output_revision!==roomSeen.get(key);
  const next=r.activity?['working','处理中']:r.attention_count?['attention',String(r.attention_count)]:fresh?['new','新']:['',''];
  badge.className='room-nav-status '+next[0];badge.textContent=next[1];badge.hidden=!next[1];
  button.title=r.activity?.title|| (r.attention_count?`${r.attention_count} 项待处理`:'');
 }
 }
}
window.addEventListener('model-studio-room-update',e=>updateRoomNavigation(e.detail));
const ROOM_ALIAS={sources:'alchemy',mapping:'chassis',assumptions:'drivers',model:'assembly',review:'quality'};
const LINES = {cash:'现金及银行结余',receivables:'应收款项',inventory:'存货',ppe:'固定资产原值',accumulated_depreciation:'累计折旧',other_assets:'其他资产',payables:'应付款项',tax_payable:'应付税款',debt:'借款',lease_liability:'租赁负债',other_liabilities:'其他负债',share_capital:'股本',retained_earnings:'留存收益',other_equity:'其他权益',revenue:'营业收入',cogs:'营业成本',selling_expense:'销售费用',admin_expense:'管理费用',research_expense:'研发费用',depreciation:'折旧费用',interest_expense:'利息费用',tax_expense:'所得税费用',other_income:'其他收益',unmapped:'待分类'};
const MONTHS=Object.fromEntries(Array.from({length:12},(_,index)=>[String(index+1),`${index+1} 月`]));
const DRIVERS = {monthly_revenue:'月收入输入',revenue_growth:'收入增长率',volume_growth:'销量增长率',asp_growth:'售价增长率',service_growth:'服务量增长率',service_rate_growth:'服务单价增长率',volume:'产品月销量',asp:'平均售价',service_units:'月服务量',service_rate:'服务单价',contract_value:'合同余额',recognition_ratio:'月收入确认比例',contract_additions:'月新增合同额',gross_margin:'现金毛利率（折旧前）',selling_ratio:'销售费用率',admin_ratio:'管理费用率',research_ratio:'研发费用率',dso:'应收周转天数',dio:'存货周转天数',dpo:'应付周转天数',capex:'每月资本开支',depreciation_rate:'年折旧率',tax_rate:'所得税率',interest_rate:'年借款利率',dividends:'每月股息',debt_draw:'每月新增借款',debt_repayment:'每月偿还借款',min_cash:'最低现金余额',facility_limit:'融资额度'};
const GROWTH_DRIVERS=new Set(['revenue_growth','volume_growth','asp_growth','service_growth','service_rate_growth']);
function boundsText(bounds){const lo=Array.isArray(bounds)?bounds[0]:bounds?.min ?? bounds?.lower;const hi=Array.isArray(bounds)?bounds[1]:bounds?.max ?? bounds?.upper;return [lo!=null?`下限 ${lo}`:'',hi!=null?`上限 ${hi}`:''].filter(Boolean).join('，');}
const UNIT_LABELS = {yuan:'元',thousand:'千元',million:'百万元','1':'元','1000':'千元','10000':'万元','1000000':'百万元'};
const STATUS = {proposed:'待确认',confirmed:'已确认',missing:'待补充',conflicted:'存在分歧',completed:'已完成',running:'处理中',queued:'排队中',failed:'未完成',submitted:'已提交复核',pending:'待复核',withdrawn:'已撤回'};
const POLICIES = [
  ['opening_basis','closing_tb','以期末试算表为预测期初','本期预测从已确认的历史期末余额开始。'],
  ['cash_tax_policy','same_month','所得税在当月缴付','暂不模拟分期预缴、汇算清缴及递延所得税。'],
  ['depreciation_policy','opening_net_ppe','按期初固定资产净额计提折旧','采用明确的简化折旧口径，新增资本开支时点需另行复核。'],
  ['other_balances_policy','constant','其他余额维持不变','未建立专项变动明细的其他资产及负债保持期初水平。'],
  ['cost_basis','cash_before_depreciation','成本及费用不包含另列折旧','毛利率、销售、管理及研发费用率采用折旧前口径；折旧由模型另行计算，避免重复计入。']
];
const state = {csrf:'',capabilities:{},projects:[],project:null,step:STEPS.some(r=>r[0]===location.hash.slice(1))||['#precedents','#accounting-library','#memo-library'].includes(location.hash)?location.hash.slice(1):'harness',busy:false,connected:false,drafts:new Map(),dirtySteps:new Set(),draftRevisions:new Map(),extraAssumptions:new Map(),sheet:'',modelTab:'pl',buildId:'',compareId:'',job:null,latticeResults:new Map(),loadSeq:0};
const operatingDrafts=new Map(),operatingControls=new Map(),operatingCalendars=new Map();
const provisionalControls=new Map();
const assumptionDraftLabels=new Map();
const governanceHTML=(governance,options={})=>provisionalSummaryHTML(governance,{resolveLabel:id=>DRIVERS[id] || id,...options});
function assumptionIdentity(row) {
  if(row.candidate_id)return `${state.project.id}:candidate:${row.candidate_id}`;
  if(row.required_placeholder)return `${state.project.id}:placeholder:${row.id}`;
  throw new Error('候选记录缺少固定编号，请刷新项目后核对；未保存输入不能按行号转移。');
}
const assumptionFieldKey=(identity,field)=>`assumption-row:${JSON.stringify([identity,field])}`;
const operatingKey=row=>assumptionIdentity(row);
function refreshOperatingCalendar() {
  if(state.step!=='assumptions' || !operatingControls.size)return;
  const projectId=state.project.id,revision=state.project.revision,key=`${projectId}:${revision}`;
  const apply=entry=>{if(state.step!=='assumptions' || state.project?.id!==projectId || state.project?.revision!==revision)return;operatingControls.forEach(control=>control.setCalendar(entry.periods,entry.error));};
  if(operatingCalendars.has(key)){apply(operatingCalendars.get(key));return;}
  operatingCalendars.set(key,{periods:[]});
  api(`/api/projects/${encodeURIComponent(projectId)}/schedule-calendar`).then(data=>{const entry={periods:array(data.forecast_periods)};operatingCalendars.set(key,entry);apply(entry);}).catch(()=>{const entry={periods:[],error:'预测月份暂不可用；请先确认历史试算表。月份不会自动填写。'};operatingCalendars.set(key,entry);apply(entry);});
}
const traceEntries=new Map();
const traceViewer=createTraceViewer({api,resolveLabel:label=>DRIVERS[label] || LINES[label] || ({'Net profit':'净利润','Operating cash flow':'经营活动现金流','Investing cash flow':'投资活动现金流','Financing cash flow':'融资活动现金流','Revenue':'营业收入','Cash':'现金','Debt':'借款'})[label] || label});
const liquidity=createLiquidityController({api,onChange:renderLiquiditySlots});
const libraryBindings=new Map(),libraryProjects=new Map();
function mountLibraryChat(project,mode,meta={}) {
 const expected={precedents:'precedents',audit:'audit-lab',memo:'memo-library',accounting:'accounting-library'}[mode];
 if(state.step!==expected)return;
 libraryProjects.set(expected,project);
 const el=$('[data-harness]');if(!el)return;
 const key=`${project.id}:${expected}:${auditMode}`;
 if(libraryBindings.get(el)===key&&meta.reason==='sources-updated'){harness.updateProject(project);return;}
 libraryBindings.set(el,key);
 harness.mount(el,project,{room:expected,roleId:{precedents:'precedent_librarian',audit:'audit_reviewer',memo:'memo_librarian',accounting:'accounting_librarian'}[mode],chatOnly:auditMode,reporting:!auditMode});
}
const precedents=createPrecedentWorkshop({api,onError:showError,onWorkspace:(project,mode='precedents',meta={})=>mountLibraryChat(project,mode,meta)});
function receiveSourceProject(data,repaint) {
 if(!data.project||data.project.id!==state.project?.id)return;
 state.project=data.project;
 const i=state.projects.findIndex(p=>p.id===data.project.id);if(i>=0)state.projects[i]=data.project;
 renderChrome();harness.updateProject(data.project);drawerHarness.updateProject(data.project);
 const shelf=$('[data-source-exhibit]');if(shelf)shelf.innerHTML=sourceExhibitHTML();
 if(repaint&&auditMode)render();else toast('资料已保存。');
}
const sourceRoom=createSourceRoom({api,onError:showError,onProject:receiveSourceProject});
const harness=createHarnessController({api,onError:showError,onProject:data=>adoptProject(data,'客户回传已读入新资料版本。'),onOpenRoom:openRoom});
const drawerHarness=createHarnessController({api,onError:showError,onProject:data=>adoptProject(data,'修改已保存。'),onOpenRoom:openRoom});
const drawerSources=createSourceRoom({api,onError:showError,onProject:receiveSourceProject});
const knowledgeWorkshop=createKnowledgeWorkshop({api,onError:showError,onWorkspace:mountLibraryChat});
const roomDrawer=createRoomDrawer({mount:(el,id)=>{
 if(['intake','data-room'].includes(id)){drawerSources.mount(el,state.project,id);return;}
 if(id==='room-list'){
  const groups=[['项目工作间',STEPS.filter(r=>r[0]!=='harness')],['常驻知识工坊',[['precedents','先例工坊','按适用业务查找模型模板与先例'],['accounting-library','会计与配平工坊','查阅会计处理、配平案例与适用条件'],['memo-library','PFM Memo 工坊','留存文稿、联席意见与监管问答']]]];
  el.innerHTML=groups.map(([title,rooms])=>'<section class="report-directory-group"><h3>'+esc(title)+'</h3><div class="report-room-directory">'+rooms.map(([key,label,intro])=>`<button class="report-directory-entry" data-step="${esc(key)}"><strong>${esc(label)}</strong><span>${esc(intro)}</span></button>`).join('')+'</div></section>').join('');return;
 }
 el.innerHTML='<div data-harness></div>';const context=roomDrawer.element._reportContext||{};drawerHarness.mount(el.firstElementChild,libraryProjects.get(id)||state.project,{room:id,roleId:context.roleId||'modelling',runId:context.runId});
},unmount:()=>{drawerHarness.unmount();drawerSources.unmount();},onDiscuss:id=>{
 harness.setDiscussionContext?.(id,roomName(id));const composer=$('#workspace .live-chat-composer textarea');composer?.focus({preventScroll:true});
}});
function roomName(id){return ({overview:'本次工作','room-list':'全部工作间'}[id]||STEPS.find(r=>r[0]===id)?.[1]||id);}
function openRoom(id,context={}){
 if(!context.runId){const main=$('#workspace [data-live-chat]');if(main?.dataset.roleId==='modelling'&&ROOMS.some(r=>r[0]===id))context={...context,runId:main.dataset.runId,roleId:'modelling',projectId:state.project?.id};}

 if(id===state.step&&context.intent==='upload'&&['precedents','accounting-library','memo-library'].includes(id)){const button=$('#workspace [data-upload-focus],#workspace [data-workshop-upload-focus]');button?.click();return;}
 if(['precedents','accounting-library','memo-library','audit-lab'].includes(id)&&id!==state.step){navigate(id);return;}
 if(!state.project&&!libraryProjects.has(id)){$('#project-dialog').showModal();return;}
 if(id==='harness'||id==='overview'){roomDrawer.close();return;}
 roomDrawer.element._reportContext=context;roomDrawer.open(id,roomName(id),JSON.stringify([context.projectId||state.project?.id,context.roleId,context.runId]));updateRoomNavigation();
}
window.addEventListener('model-studio-open-room',event=>openRoom(event.detail.room,event.detail));
function sourceExhibitHTML(){
 const sources=array(state.project?.sources).slice().sort((a,b)=>String(b.uploaded_at||'').localeCompare(String(a.uploaded_at||''))).slice(0,4);
 return `<section class="report-source-shelf"><h2>最近收到</h2>${sources.map(s=>`<button class="report-source-file" data-open-room="data-room"><span>${esc(s.name?.split('.').at(-1)?.toUpperCase()||'文档')}</span><strong>${esc(s.name)}${s.source_date?`<small>${esc(s.source_date)}</small>`:''}</strong></button>`).join('')||'<p>上传已有资料，随时补充。</p>'}<button class="button button-small" data-open-room="intake">＋ 上传资料</button> <button class="button button-small" data-open-room="data-room">全部资料</button></section>`;
}
let liquidityFollowup=null;
const draftKey = () => `${state.project?.id || 'none'}:${state.step}`;
const tbWorkspaces=new Map();
const tbFiles=()=>array(state.project?.sources).filter(source=>source.role==='tb');
const tbScope=(sourceId,sheet)=>JSON.stringify([sourceId,sheet || '']);
const tbSavedSelections=p=>array(p?.normalization?.selections);
function tbWorkbench() {
  const p=state.project;if(!p)return null;
  if(!tbWorkspaces.has(p.id)) {
    const selections=clone(tbSavedSelections(p));
    const files=tbFiles();const legacyId=p.normalization?.source_id || p.tb?.source_id || (array(p.tb?.source_ids).length===1?p.tb.source_ids[0]:null);
    const sourceId=selections[0]?.source_id || legacyId || files.at(-1)?.id || '';
    const sheets={};for(const part of selections)if(sheets[part.source_id]===undefined)sheets[part.source_id]=part.settings?.sheet || '';
    if(legacyId && p.normalization?.settings?.sheet)sheets[legacyId]=p.normalization.settings.sheet;
    tbWorkspaces.set(p.id,{sourceId,sheets,queue:selections,drafts:new Map(),pending:new Set(),editIndex:null,revision:p.revision,bound:selections.length>0,changed:false});
  }
  const work=tbWorkspaces.get(p.id);
  if(!work.bound)work.revision=p.revision;
  if(!work.sourceId)work.sourceId=tbFiles().at(-1)?.id || '';
  return work;
}
function tbSheetName(source,preferred) {
  const names=array(source?.preview?.sheets).map(sheet=>sheet.name || sheet);
  return names.includes(preferred)?preferred:names[0] || '';
}
function tbCurrentScope() {const source=tbSource();return tbScope(source?.id || '',tbSheetName(source,tbWorkbench()?.sheets[source?.id]));}
function tbPin() {const work=tbWorkbench();if(!work.bound){work.revision=state.project.revision;work.bound=true;}work.changed=true;$('#save-state').textContent='有尚未保存的历史资料设置';}
function rememberTBSlice(form=$('#normalize-form')) {
  if(!form || !state.project)return;
  const work=tbWorkbench();const values={};
  $$('input[name],select[name]',form).forEach(el=>{if(el.name.startsWith('setting_') || el.name.startsWith('col_') || el.name==='normalization_confirmed')values[el.name]=el.type==='checkbox'?el.checked:el.value;});
  values.setting_sheet=form.dataset.sheet || '';
  work.drafts.set(tbScope(form.dataset.sourceId,form.dataset.sheet),values);
}
function restoreTBSlice() {
  const form=$('#normalize-form');if(!form)return;
  const values=tbWorkbench().drafts.get(tbScope(form.dataset.sourceId,form.dataset.sheet));if(!values)return;
  $$('input[name],select[name]',form).forEach(el=>{if(el.name==='setting_sheet' || !(el.name in values))return;if(el.type==='checkbox')el.checked=values[el.name]===true;else el.value=values[el.name];});
}
function tbConfiguration(source,sheet) {
  const work=tbWorkbench();const part=work.queue.find(part=>part.source_id===source.id && tbSheetName(source,part.settings?.sheet)===sheet);
  if(part)return {columns:part.columns || {},settings:part.settings || {}};
  const p=state.project;const norm=p.normalization || {};
  const legacyId=norm.source_id || p.tb?.source_id || (array(p.tb?.source_ids).length===1?p.tb.source_ids[0]:null) || (tbFiles().length===1?source.id:null);
  if(!tbSavedSelections(p).length && legacyId===source.id && tbSheetName(source,norm.settings?.sheet)===sheet)return {columns:norm.columns || p.tb?.columns || {},settings:norm.settings || p.tb?.settings || p.tb?.summary?.settings || {}};
  return {columns:{},settings:{}};
}
function tbSelectionFromForm(form) {
  if(!form.reportValidity())return null;
  const values=getFormValues(form),columns={};
  Object.entries(values).filter(([key,value])=>key.startsWith('col_') && value!=='').forEach(([key,value])=>{columns[key.slice(4)]=value.startsWith('__column_')?Number(value.slice(9)):value;});
  const settings={currency:state.project.currency,unit:state.project.unit};
  Object.entries(values).filter(([key,value])=>key.startsWith('setting_') && value!=='').forEach(([key,value])=>{settings[key.slice(8)]=['setting_header_row','setting_fiscal_year_start_month'].includes(key)?Number(value):value;});
  if(columns.entity===undefined && !settings.entity)throw new Error('请选择主体列，或填写缺省主体名称。');
  if(columns.period===undefined && !settings.period)throw new Error('请选择期间列，或填写缺省期间。');
  if(!tbFiles().some(source=>source.id===form.dataset.sourceId))throw new Error('当前选择的试算表原件不可用，请重新核对文件。');
  return {source_id:form.dataset.sourceId,columns,settings};
}
function tbSelect(sourceId,sheet) {
  if(hasUnsavedFile())throw new Error('请先上传已选文件，再切换试算表预览；当前文件选择仍保留。');
  rememberDraft();const work=tbWorkbench();const source=tbFiles().find(source=>source.id===sourceId);
  if(!source)throw new Error('未找到所选试算表原件。');
  work.sourceId=sourceId;work.sheets[sourceId]=tbSheetName(source,sheet ?? work.sheets[sourceId]);
  const edited=work.queue[work.editIndex];if(edited && tbScope(edited.source_id,tbSheetName(tbFiles().find(item=>item.id===edited.source_id),edited.settings?.sheet))!==tbCurrentScope())work.editIndex=null;
  render();
}
function tbFileSelect(id='tb-source-select') {
  const current=tbSource();return `<label class="field">试算表文件<select id="${id}" data-tb-source>${tbFiles().map(source=>`<option value="${esc(source.id)}"${source.id===current?.id?' selected':''}>${esc(source.name || '试算表原件')}</option>`).join('')}</select></label>`;
}
function tbBundleHTML() {
  const work=tbWorkbench(),p=state.project;const stale=work.bound && work.revision!==p.revision;
  const pending=[...work.pending];const loaded=Boolean(p.tb) && JSON.stringify(work.queue)===JSON.stringify(tbSavedSelections(p));
  return `<section class="panel tb-bundle"><div class="panel-head"><div><h2>历史资料清单</h2><p>仅清单中的文件与工作表会合并读取；每个文件和工作表组合只加入一次。</p></div><span class="badge ${work.queue.length && !loaded?'warning':'neutral'}">${work.queue.length} / 60 项${loaded?' · 已读取':''}</span></div><div class="panel-body">${stale?`<div class="notice warning">本清单和设置基于资料版本 ${esc(work.revision)}，当前为 ${esc(p.revision)}。旧设置已保留，请逐项核对文件、工作表和口径后再更新版本。<label class="check-label spacer-top"><input type="checkbox" id="tb-rebase-confirm">我已核对保留的清单和各项设置与当前资料一致。</label><button type="button" class="button button-small spacer-top" data-action="tb-rebase">采用当前资料版本继续</button></div>`:''}${work.queue.length?`<div class="table-scroll"><table class="tb-bundle-table"><thead><tr><th>文件 / 工作表</th><th>期间 / 主体</th><th>已选口径</th><th>操作</th></tr></thead><tbody>${work.queue.map((part,index)=>{const source=tbFiles().find(source=>source.id===part.source_id);const settings=part.settings || {};return `<tr data-tb-queue-index="${index}"><td><strong>${esc(source?.name || '原件不可用')}</strong><div class="driver-unit">${esc(settings.sheet || tbSheetName(source) || '当前数据表')}</div></td><td>${esc(settings.period || (part.columns?.period!==undefined?'读取所选期间列':'期间未明确'))}<div class="driver-unit">${esc(settings.entity || (part.columns?.entity!==undefined?'读取所选主体列':'主体未明确'))}</div></td><td><details><summary>核对口径与列</summary><p>${esc({balance:'时点余额',movement:'单期发生额',ytd:'年初至今累计发生额'}[settings.basis] || '金额性质未明确')} · ${esc({debit_positive:'借方为正',credit_positive:'贷方为正'}[settings.sign_convention] || '借贷方向未明确')}<br>${esc({closed:'本年利润已结转',unclosed:'本年利润未结转'}[settings.profit_closure] || '结转未明确')} · ${esc({movement:'损益按月',ytd:'损益累计'}[settings.pl_basis] || '损益口径未明确')}<br>表头第 ${esc(settings.header_row || 1)} 行 · 单位 ${esc(settings.unit || p.unit)}</p><p>${Object.entries(part.columns || {}).map(([key,value])=>`${esc({account_code:'科目编码',account_name:'科目名称',period:'期间',entity:'主体',opening:'期初',debit:'借方',credit:'贷方',closing:'期末',line:'已有分类'}[key] || key)}：${esc(typeof value==='number'?`第 ${value+1} 列`:value)}`).join('<br>')}</p></details></td><td><div class="button-row"><button type="button" class="button button-small" data-action="tb-edit" data-index="${index}">编辑</button><button type="button" class="button button-small" data-source="${esc(part.source_id)}" data-source-sheet="${esc(settings.sheet || '')}">原表</button><button type="button" class="button button-small button-danger" data-action="tb-remove" data-index="${index}">移出</button></div></td></tr>`;}).join('')}</tbody></table></div>`:'<p class="field-hint">清单为空。可以直接读取当前文件，或先逐项确认后加入清单。</p>'}${pending.length?`<div class="notice warning spacer-top">有 ${pending.length} 项设置尚未加入或更新到清单。合并前请处理，其他文件的设置仍保留。${pending.map(scope=>{const [sourceId,sheet]=JSON.parse(scope);return `<div class="tb-pending-row"><span>${esc(tbFiles().find(source=>source.id===sourceId)?.name || '原件不可用')} · ${esc(sheet || '当前数据表')}</span><button type="button" class="button button-small" data-action="tb-open-draft" data-scope="${esc(scope)}">继续填写</button><button type="button" class="button button-small" data-action="tb-discard-slice" data-scope="${esc(scope)}">放弃这项未加入修改</button></div>`;}).join('')}</div>`:''}${work.queue.length?`<form id="tb-bundle-form"><label class="check-label spacer-top"><input type="checkbox" name="tb_bundle_confirmed" required>我已核对全部所选资料的期间、主体和口径；不将重叠科目或期间自动累加。</label><div class="button-row spacer-top"><button class="button button-primary" type="submit">合并读取所选历史</button><span class="field-hint">任何一项不成立，整次读取均不保存。</span></div></form>`:''}</div></section>`;
}
function tbHasUnsaved() {const work=tbWorkspaces.get(state.project?.id);return Boolean(work?.changed || work?.pending.size);}
function tbMarkInput(target) {
  const form=target.closest('#normalize-form');if(!form || !tbFiles().some(source=>source.id===form.dataset.sourceId))return;
  tbPin();const work=tbWorkbench();work.pending.add(tbScope(form.dataset.sourceId,form.dataset.sheet));
  if(target.name!=='normalization_confirmed'){const confirmation=$('[name="normalization_confirmed"]',form);if(confirmation)confirmation.checked=false;}
  rememberTBSlice(form);
}
function tbQueueAction(name,action) {
  const work=tbWorkbench();rememberDraft();
  if(name==='tb-add') {
    const selection=tbSelectionFromForm($('#normalize-form'));if(!selection)return;
    const source=tbFiles().find(item=>item.id===selection.source_id);const scope=tbScope(selection.source_id,tbSheetName(source,selection.settings.sheet));
    const duplicate=work.queue.findIndex(part=>tbScope(part.source_id,tbSheetName(tbFiles().find(item=>item.id===part.source_id),part.settings?.sheet))===scope);
    if(duplicate!==-1 && work.editIndex!==duplicate)throw new Error('此文件和工作表已经在清单中，请点击该项“编辑”后更新，不重复加入。');
    if(work.editIndex!==null) {
      const original=work.queue[work.editIndex];
      if(!original || tbScope(original.source_id,tbSheetName(tbFiles().find(item=>item.id===original.source_id),original.settings?.sheet))!==scope)throw new Error('正在编辑的清单项与当前文件、工作表不同，请先回到该项完成修改。');
      work.queue[work.editIndex]=selection;
    } else {if(work.queue.length>=60)throw new Error('每次最多选择 60 个文件和工作表组合。');work.queue.push(selection);}
    tbPin();work.pending.delete(scope);work.editIndex=null;render();toast('已更新本页历史资料清单；合并读取后才会保存到项目。');return;
  }
  if(name==='tb-edit' || name==='tb-open-draft') {
    const index=name==='tb-edit'?Number(action.dataset.index):-1;
    const part=work.queue[index];const [sourceId,sheet]=part?[part.source_id,part.settings?.sheet]:JSON.parse(action.dataset.scope);
    if(part)work.editIndex=index;
    else work.editIndex=work.queue.findIndex(item=>tbScope(item.source_id,tbSheetName(tbFiles().find(source=>source.id===item.source_id),item.settings?.sheet))===action.dataset.scope);
    if(work.editIndex===-1)work.editIndex=null;
    tbSelect(sourceId,sheet);$('#normalize-form').scrollIntoView({block:'start',behavior:'auto'});return;
  }
  if(name==='tb-remove') {
    const index=Number(action.dataset.index);if(!work.queue[index])return;
    work.queue.splice(index,1);if(work.editIndex===index)work.editIndex=null;else if(work.editIndex>index)work.editIndex--;
    tbPin();render();toast('已从本页清单移出，上传原件仍保留；重新读取后生效。');return;
  }
  if(name==='tb-discard-slice') {
    const scope=action.dataset.scope;work.drafts.delete(scope);work.pending.delete(scope);
    if(scope===tbCurrentScope())work.editIndex=null;
    work.changed=work.pending.size>0 || JSON.stringify(work.queue)!==JSON.stringify(tbSavedSelections(state.project));render();return;
  }
  if(name==='tb-rebase') {
    if(!$('#tb-rebase-confirm')?.checked)throw new Error('请先逐项核对清单、文件和工作表设置，并确认与当前资料一致。');
    work.revision=state.project.revision;work.bound=true;work.changed=true;
    for(const fields of work.drafts.values())fields.normalization_confirmed=false;
    render();toast('清单已明确采用当前资料版本；请再次确认后合并读取。');
  }
}
async function saveTB(form) {
  if(state.dirtySteps.has(`${state.project.id}:mapping`))throw new Error('科目分类有尚未保存的修改。请先保存或明确放弃这些分类修改，再重新读取历史资料。');
  rememberDraft();const work=tbWorkbench();let payload;
  if(form.id==='tb-bundle-form') {
    if(!work.queue.length)throw new Error('请先加入至少一项历史资料。');
    if(work.pending.size)throw new Error('还有未加入清单的设置，请更新对应清单项或明确放弃该项修改后再合并。');
    payload={selections:clone(work.queue)};
  } else {
    if(work.queue.length)throw new Error('已有历史资料清单，请通过“合并读取所选历史”保存。');
    if([...work.pending].some(scope=>scope!==tbCurrentScope()))throw new Error('其他文件或工作表仍有未保存的设置，请先加入清单或明确放弃，再读取当前文件。');
    payload=tbSelectionFromForm(form);if(!payload)return;
  }
  tbPin();
  const data=await api(`/api/projects/${encodeURIComponent(state.project.id)}/normalize`,{method:'POST',body:{revision:work.revision,...payload}});
  const project=data.project;
  if(!project)throw new Error('服务未返回保存后的项目，请刷新后核对。当前清单仍保留。');
  work.queue=clone(tbSavedSelections(project));work.revision=project.revision;work.bound=true;work.changed=false;work.pending.clear();work.drafts.clear();work.editIndex=null;
  adoptProject(data,'所选历史已读取，请重新核对并保存科目分类。');
}

const cashDrafts=new Map();
const fundingDrafts=new Map();
const legacyFundingDrivers=new Set(['interest_rate','debt_draw','debt_repayment','facility_limit']);
let fundingModalDirty=false;
const fundingPlan=()=>fundingDrafts.get(state.project?.id)?.plan ?? state.project?.funding;
const fundingEditor=createFundingEditor({api,onDirty:({dirty})=>{fundingModalDirty=dirty;$('#save-state').textContent=dirty?'融资窗口有尚未返回表格的输入':state.dirtySteps.has(draftKey())?'有尚未保存的输入':'';},onApply:({projectId,revision,plan,replaceLegacy})=>{
  if(projectId!==state.project?.id || state.step!=='assumptions')throw new Error('当前项目或页面已经变化，请回到原项目假设页；融资输入仍保留在窗口中。');
  const key=draftKey();const existingRevision=state.draftRevisions.get(key);
  if(existingRevision!==undefined && existingRevision!==revision)throw new Error('融资窗口与假设表基于不同资料版本。请先分别保留输入，核对版本后重新采用。');
  provisionalControls.forEach(control=>control.resetAcceptance());
  rememberDraft();const rows=allAssumptions();const previous=fundingPlan();
  markDirty();state.draftRevisions.set(key,revision);
  fundingDrafts.set(projectId,{plan:clone(plan),revision,replaceLegacy});
  const draft=state.drafts.get(key) || {};
  const message=`本模型改用${plan.mode==='none'?'明确无期初及预测借款的安排':'逐笔融资条款'}，不再采用此总额融资输入；原值与原始依据保留。`;
  rows.forEach((row,index)=>{
    if(!legacyFundingDrivers.has(row.id))return;
    const identity=assumptionIdentity(row),statusKey=assumptionFieldKey(identity,'assumption_status'),noteKey=assumptionFieldKey(identity,'assumption_note');
    if(replaceLegacy){draft[statusKey]='excluded';const note=draft[noteKey] ?? row.adoption_note ?? '';draft[noteKey]=note.includes(message)?note:[note,message].filter(Boolean).join('\n');}
    else if(plan.mode==='aggregate' && previous && previous.mode!=='aggregate' && (draft[statusKey] || row.status)==='excluded')draft[statusKey]='proposed';
  });
  state.drafts.set(key,draft);render();toast('融资安排已返回假设表；请保存假设、融资安排与建模范围后生成。');
}});
function fundingPanelHTML() {
  const p=fundingPlan(),local=fundingDrafts.has(state.project.id);
  const mode=p?.mode || 'aggregate';const title={aggregate:'只有总额计划 / 合同条款尚未提供',facilities:'逐笔融资条款与合同应还安排',none:'明确无期初借款及预测期借款'}[mode] || '融资口径待核对';
  return `<section class="panel funding-overview"><div class="panel-head"><div><h2>融资事实与偿债安排</h2><p>${esc(title)}</p></div><button class="button button-small" type="button" data-action="funding-edit">${p?'查看 / 修改融资口径':'补充融资依据与条款'}</button></div><div class="panel-body"><span class="badge ${p?.status==='adopted'?'neutral':'warning'}">${local?'未保存 · ':''}${p?.status==='adopted'?'操作人已采用本版本':p?'融资安排草稿':'合同融资事实未知'}</span><p class="field-hint">没有提供条款不等于没有债务。计划还款不代表合同到期款；操作人的建模采用不代表管理层或贷款人确认。</p>${p?.invalidated_reason?`<p class="notice warning">原融资安排因资料更新已失效：${esc(p.invalidated_reason)}。保留为草稿，请重新核对来源、历史余额与预测月份。</p>`:''}${mode!=='aggregate'?`<p class="notice ${p?.status==='adopted'?'':'warning'}">${p?.status==='adopted'?'本版本按此融资口径计算；原总额年利率、提款、还款、额度上限四类假设应保留为“本模型不采用”。':'本模式尚未采用，不能在生成时自动退回总额计划。'}</p>`:''}${array(p?.facilities).length?`<ol class="funding-overview-list">${p.facilities.map((facility,index)=>`<li>${index+1}. ${esc(facility.name || '名称待提供')}<small>${esc(facility.kind==='term'?'定期融资':facility.kind==='revolver'?'循环额度':'类型待提供')} · 期初本金 ${esc(facility.opening_principal ?? '待提供')} · 到期 ${esc(facility.maturity || '待提供')}</small></li>`).join('')}</ol>`:''}${p?.adoption_note?`<p class="funding-overview-source">本次说明：${esc(p.adoption_note)}</p>`:''}</div></section>`;
}
const cashDrivers=new Set(['capex','dividends','debt_draw','debt_repayment','contract_additions']);
const cashKey=row=>assumptionIdentity(row);
let activeCashRow=null;
const cashEditor=createCashScheduleEditor({api,onApply:updated=>{
  if(!activeCashRow || activeCashRow.projectId!==state.project?.id)throw new Error('项目已变化，请返回当前项目重新核对月份安排。');
  provisionalControls.get(activeCashRow.index)?.resetAcceptance();
  markDirty();rememberDraft();
  cashDrafts.set(activeCashRow.key,{cash_allocation:updated.cash_allocation,values:updated.values});
  const draft=state.drafts.get(draftKey()) || {};
  draft[assumptionFieldKey(activeCashRow.key,'assumption_status')]=updated.status;
  state.drafts.set(draftKey(),draft);
  render();toast('分月安排已放回假设表；请保存假设与建模范围后生成。');
}});
function assumptionElementKey(element) {
  const row=element.closest('.assumption-table tr[data-assumption-key]');
  return row?assumptionFieldKey(row.dataset.assumptionKey,element.name.replace(/_\d+$/,'')):null;
}
function preserveDraftElement(element) {
  return element.type!=='file' && !element.name.startsWith('accept_provisional_') && !element.closest('#normalize-form,#tb-bundle-form,.operating-controls');
}
function rememberDraft() {
  rememberTBSlice();
  if(!state.dirtySteps.has(draftKey())) return;
  const values=Object.fromEntries(Object.entries(state.drafts.get(draftKey()) || {}).filter(([key])=>key.startsWith('assumption-row:')));
  $$('#workspace input[name],#workspace select[name],#workspace textarea[name]').forEach(el=>{
    if(!preserveDraftElement(el))return;
    const value=el.type==='checkbox'?el.checked:el.value,key=assumptionElementKey(el);
    if(!key)values[el.name]=value;
    else if(JSON.stringify(value)!==el.dataset.draftBaseline)values[key]=value;
    else delete values[key];
  });
  state.drafts.set(draftKey(),values);
}
function restoreDraft() {
  restoreTBSlice();
  const values = state.drafts.get(draftKey()); if (!values) return;
  $$('#workspace input[name],#workspace select[name],#workspace textarea[name]').forEach(el=>{if(!preserveDraftElement(el))return;const key=assumptionElementKey(el) || el.name;if(!(key in values))return;if(el.type==='checkbox')el.checked=values[key];else el.value=values[key];});
}
function orphanAssumptionDraftsHTML() {
  if(state.step!=='assumptions')return '';
  const present=new Set($$('.assumption-table tr[data-assumption-key]').map(row=>row.dataset.assumptionKey)),orphaned=new Map();
  for(const [key,value] of Object.entries(state.drafts.get(draftKey()) || {})) {
    if(!key.startsWith('assumption-row:'))continue;
    const [identity,field]=JSON.parse(key.slice('assumption-row:'.length));if(present.has(identity))continue;
    if(!orphaned.has(identity))orphaned.set(identity,{});orphaned.get(identity)[field]=value;
  }
  for(const [kind,drafts] of [['现金分月草稿',cashDrafts],['经营数值用法草稿',operatingDrafts]])for(const [identity,value] of drafts) {
    if(!identity.startsWith(`${state.project.id}:`) || present.has(identity))continue;
    if(!orphaned.has(identity))orphaned.set(identity,{});orphaned.get(identity)[kind]=value;
  }
  if(!orphaned.size)return '';
  const labels={assumption_value:'数值',assumption_period:'期间',assumption_owner:'责任归属',assumption_status:'采用状态',assumption_unit:'单位',assumption_note:'采用说明',assumption_origin:'来源类别',assumption_growth_basis:'增长频率',rate_basis:'利率 / 折旧频率',provisional_responsible:'暂定责任人',provisional_reason:'暂定原因'};
  const display=(field,value)=>{
    const amount=value=>value===null || value===undefined || value===''?'未填写':String(value);
    if(field==='现金分月草稿')return [`期间 ${value.cash_allocation?.start_month || '未填写'} 至 ${value.cash_allocation?.end_month || '未填写'}`,`总额 ${amount(value.cash_allocation?.total)}`,...Object.entries(value.values || {}).map(([month,total])=>`${month}：${amount(total)}`)].join('；');
    if(field==='经营数值用法草稿')return [{effective_monthly:'指定月份的最终预测值',baseline_rollforward:'从基期按增长推算',legacy:'现有增长前输入'}[value.mode] || '数值用法尚未选择',value.month?`指定月份 ${value.month}`:'',value.anchor?`基期 ${value.anchor}`:'',value.through?`推算至 ${value.through}`:'',value.spanStart || value.spanEnd?`待列月份 ${value.spanStart || '未填写'} 至 ${value.spanEnd || '未填写'}`:'',...array(value.entries).map(entry=>`${entry.month || '月份未填写'}：${amount(entry.value)}`)].filter(Boolean).join('；');
    const choices={assumption_owner:{management:'管理层',banker:'银行团队',accountant:'会计师'},assumption_status:STATUS_FILTER,assumption_origin:{management_input:'管理层输入',banker_provisional:'银行团队暂定假设'},assumption_growth_basis:{monthly:'按月复合增长',annual:'有效年复合增长率'},rate_basis:{annual:'年率',monthly:'月率'}};
    return choices[field]?.[value] || amount(value);
  };
  return `<div class="notice warning" data-orphan-assumption-drafts><strong>部分未保存输入对应的候选已不在当前资料中。</strong><p>这些输入仍单独保留，没有转移到其他候选。请先核对资料版本及下列内容；放弃本页草稿会同时清除这些保留项。</p>${[...orphaned].map(([identity,fields])=>`<details><summary>${esc(assumptionDraftLabels.get(identity) || '原候选记录')}</summary><dl>${Object.entries(fields).map(([field,value])=>`<dt>${esc(labels[field] || field)}</dt><dd>${esc(display(field,value))}</dd>`).join('')}</dl></details>`).join('')}</div>`;
}
function clearDraft() {state.drafts.delete(draftKey());state.dirtySteps.delete(draftKey());state.draftRevisions.delete(draftKey());if(state.step==='assumptions'){fundingDrafts.delete(state.project?.id);for(const key of cashDrafts.keys())if(key.startsWith(`${state.project?.id}:`))cashDrafts.delete(key);for(const key of operatingDrafts.keys())if(key.startsWith(`${state.project?.id}:`))operatingDrafts.delete(key);}$('#save-state').textContent = '';}
function markDirty() {state.dirtySteps.add(draftKey());if(!state.draftRevisions.has(draftKey()))state.draftRevisions.set(draftKey(),state.project?.revision);$('#save-state').textContent='有尚未保存的输入';}
function toast(message) {const el=$('#toast');el.textContent=message;el.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>{el.hidden=true;},5000);}
function showError(error) {const box=$('#global-error');box.replaceChildren();const text=document.createElement('span');text.textContent=error?.message || String(error);box.append(text);if(Array.isArray(error?.details)){const list=document.createElement('ul');error.details.forEach(item=>{const li=document.createElement('li');li.textContent=typeof item==='string'?item:item.message || item.question || item.label || '';if(li.textContent)list.append(li);});box.append(list);}const close=document.createElement('button');close.textContent='关闭';close.type='button';close.addEventListener('click',()=>{box.hidden=true;});box.append(close);box.hidden=false;}
function clearError() {$('#global-error').hidden=true;}
async function api(path,{method='GET',body}={}) {
  const headers = {'Accept':'application/json'};
  if (method !== 'GET') headers['X-CSRF-Token']=state.csrf;
  if (body && !(body instanceof FormData)) {headers['Content-Type']='application/json';body=JSON.stringify(body);}
  let response;
  try {response=await projectRequest(path,{method,headers,body,credentials:'same-origin'});} catch {throw new Error('未能连接工作台服务。请确认连接后再刷新。');}
  let data;
  try {data=await response.json();} catch {throw new Error(`服务未返回可读取的结果（${response.status}）。资料尚未确认保存。`);}
  if (!response.ok || data.ok === false) {
    const err = new Error(data.error?.message || `请求未完成（${response.status}）`);
    err.code=data.error?.code;err.details=data.error?.details;err.status=response.status;
    if (response.status===409) err.message+=' 当前页面可能基于旧版资料；请刷新项目后重新核对。';
    throw err;
  }
  return data;
}
async function perform(fn) {
  if(state.busy) return;
  state.busy=true;clearError();
  const buttons = $$('button[type="submit"],button[data-mutation],#new-project,#refresh-project,#project-select,[data-action^="tb-"]');
  const disabled=buttons.map(el=>[el,el.disabled]);buttons.forEach(el=>{el.disabled=true;});
  const tbForms=$$('#normalize-form,#tb-bundle-form,#assumption-form');tbForms.forEach(el=>{el.inert=true;});
  try {await fn();} catch(error) {showError(error);}
  finally {state.busy=false;disabled.forEach(([el,value])=>{if(el.isConnected) el.disabled=value;});tbForms.forEach(el=>{if(el.isConnected)el.inert=false;});}
}
function options(items,current,empty='请选择') {
  return `${empty !== null ? `<option value="">${esc(empty)}</option>`:''}${Object.entries(items).map(([value,label])=>`<option value="${esc(value)}"${String(current)===value?' selected':''}>${esc(label)}</option>`).join('')}`;
}
function badge(status) {return `<span class="badge ${['missing','conflicted','failed'].includes(status)?'warning':['confirmed','completed'].includes(status)?'':'neutral'}">${esc(STATUS[status] || status || '未提供')}</span>`;}
function sectionHead(step,description,actions='') {const index=LEGACY_STEPS.findIndex(item=>item[0]===step);return `<div class="page-head"><div><p class="eyebrow">MODEL STUDIO / INPUT DETAIL</p><h1>${esc(LEGACY_STEPS[index]?.[1] || step)}</h1><p>${description}</p></div>${actions?`<div class="page-head-actions">${actions}</div>`:''}</div>`;}
const unitLabel = () => `${state.project?.currency || ''} · ${UNIT_LABELS[state.project?.unit] || state.project?.unit || '单位待确认'}`;
const latestBuild = () => array(state.project?.builds).at(-1);
const selectedBuild = () => state.buildId?array(state.project?.builds).find(build=>build.id===state.buildId):latestBuild();
const resultOf = build => build?.result?.forecast ? build.result : build?.result?.model || build?.model || build?.result || {};
const forecastOf = result => array(result.forecast).length ? result.forecast : array(result.forecast?.periods).length ? result.forecast.periods : [];
function sourceButton(id,label='查看原文') {return id ? `<button type="button" class="source-link" data-source="${esc(id)}">${esc(label)}</button>` : '<span class="muted small">未关联来源</span>';}
function gapsHTML(gaps) {
  const messages={HISTORICAL_CFS_UNDETERMINED:'历史现金流尚缺非现金变动及相关明细。当前未重建历史现金流表，预测部分使用已确认期初余额。',ACCOUNTING_SCOPE:'预测采用已确认的简化成本、折旧、现金税及其他余额口径。正式使用前，须复核未单独建表的重大变动。',AGGREGATE_REVENUE:'收入按明确采用的总额增长法预测；未建立销量、服务产能或订单明细。',PROJECT_RECOGNITION_POLICY:'项目收入按明确采用的确认比例预测；履约义务、进度证明及合同资产负债仍需专项支持。'};
  return `<ul class="issue-list">${array(gaps).map(gap=>`<li><span class="badge ${gap.severity==='info'?'neutral':'warning'}">${gap.severity==='info'?'说明':'待处理'}</span><span>${esc(typeof gap==='string'?gap:messages[gap.code] || first(gap.message,gap.question,gap.label,gap.description,gap.code,'需要核对'))}</span></li>`).join('')}</ul>`;
}
function empty(title,description,action='') {return `<div class="empty-state"><div class="empty-mark" aria-hidden="true">—</div><h3>${esc(title)}</h3><p>${esc(description)}</p>${action}</div>`;}
function renderChrome() {
  $('#project-select').innerHTML=`<option value="">选择项目</option>${state.projects.map(project=>`<option value="${esc(project.id)}"${project.id===state.project?.id?' selected':''}>${esc(project.name)}</option>`).join('')}`;
  $('#project-title').textContent=['precedents','accounting-library','memo-library'].includes(state.step)?(state.step==='precedents'?'先例工坊':state.step==='memo-library'?'PFM Memo 工坊':'会计与配平工坊')+' · 常驻知识':state.project?.name || '新建财务模型';
  $('#revision-label').textContent=['precedents','accounting-library','memo-library'].includes(state.step)?'常驻知识工坊':state.project ? `资料版本 ${state.project.revision}`:'尚未选定项目';
  $('#connection-dot').classList.toggle('online',state.connected);
  $('#connection-label').textContent=state.connected?'本机服务已连接':'连接尚未就绪';
  const completed={sources:array(state.project?.sources).length>0,mapping:array(state.project?.mapping).length>0 && array(state.project?.mapping).every(row=>row.confirmed && row.line!=='unmapped'),assumptions:array(state.project?.assumptions).length>0 && array(state.project?.assumptions).every(row=>['confirmed','excluded'].includes(row.status)),model:array(state.project?.builds).length>0,review:false};
  const activeRoom=ROOM_ALIAS[state.step]||state.step;
  document.body.classList.toggle('report-mode',!auditMode);
  $('#audit-mode-toggle').setAttribute('aria-pressed',String(auditMode));
  $('#audit-mode-toggle').textContent=auditMode?'返回简洁对话':'专业审计模式';
  if(auditMode)$('#step-nav').innerHTML=STEPS.map(([key,label],index)=>`${key==='audit-lab'?'<div class="room-nav-divider">项目复核</div>':''}<button class="step-button ${activeRoom===key?'active':''}" data-step="${key}" ${activeRoom===key?'aria-current="page"':''}><span class="step-number">${String(index+1).padStart(2,'0')}</span><span>${label}</span>${completed[key]?'<span class="step-check" aria-label="已有保存内容"></span>':''}</button>`).join('')+`<div class="room-nav-divider">共享知识</div><button class="step-button ${state.step==='precedents'?'active':''}" data-step="precedents"><span class="step-number">▦</span><span>先例工坊</span></button><button class="step-button ${state.step==='accounting-library'?'active':''}" data-step="accounting-library"><span class="step-number">▤</span><span>会计与配平工坊</span></button><button class="step-button ${state.step==='memo-library'?'active':''}" data-step="memo-library"><span class="step-number">▧</span><span>PFM Memo 工坊</span></button>`;
  else {
   const simple=[['harness','项目对话','◇'],['intake','资料管理员','▤']];
   const nav=(key,label,icon)=>`<button class="step-button ${state.step===key?'active':''}" data-step="${key}" ${state.step===key?'aria-current="page"':''}><span class="step-number" aria-hidden="true">${icon}</span><span>${label}</span></button>`;
   $('#step-nav').innerHTML=simple.map(r=>nav(...r)).join('')+`<button class="step-button" data-open-room="room-list"><span class="step-number" aria-hidden="true">▦</span><span>展开工作间</span></button><details class="report-nav-libraries" ${['precedents','accounting-library','memo-library','audit-lab'].includes(state.step)?'open':''}><summary>工坊与审阅</summary>${[['precedents','先例工坊','▦'],['accounting-library','会计与配平','▤'],['memo-library','Memo 工坊','▧'],['audit-lab','独立审阅','⌕']].map(r=>nav(...r)).join('')}</details>`;
  }
  $('#footer-state').textContent=state.project?`${unitLabel()} · ${state.project.forecast_months || '—'} 个月预测 · 复核用工作版本`:'新模型 · 来源可追溯 · Excel 可编辑';
  updateRoomNavigation();
}
function render() {
  roomDrawer.close({focus:false});
  harness.unmount();
  precedents.unmount();
  knowledgeWorkshop.unmount();
  sourceRoom.unmount();
  traceViewer.notifyProject({projectId:state.project?.id,revision:state.project?.revision});traceEntries.clear();
  const build=selectedBuild();
  liquidity.select(build && ['model','review'].includes(state.step)?{projectId:state.project.id,currentRevision:state.project.revision,build}:null);
  renderChrome();
  const workspace=$('#workspace');
  if(!auditMode){
   const library=state.step==='precedents'||['accounting-library','memo-library','audit-lab'].includes(state.step);
   if(library){
    if(state.step==='audit-lab'&&!state.project){workspace.innerHTML=landingHTML();return;}
    workspace.innerHTML='<div class="report-workshop-layout"><div data-harness></div><aside data-report-exhibit><div data-workshop-compact></div></aside></div>';
    const exhibit=workspace.querySelector('[data-workshop-compact]');
    if(state.step==='precedents')precedents.mount(exhibit,{compact:true});
    else knowledgeWorkshop.mount(exhibit,{mode:state.step==='audit-lab'?'audit':state.step==='memo-library'?'memo':'accounting',project:state.project,compact:true});
    $('#save-state').textContent='';return;
   }
   if(!state.project){workspace.innerHTML=landingHTML();return;}
   const sourceRole=['intake','data-room'].includes(state.step);
   workspace.innerHTML=sourceRole?'<div class="report-workshop-layout"><div data-harness></div><aside data-report-exhibit data-source-exhibit>'+sourceExhibitHTML()+'</aside></div>':'<div data-harness></div>';
   harness.mount(workspace.querySelector('[data-harness]'),state.project,{room:sourceRole?state.step:'overview',roleId:sourceRole?'source_librarian':'modelling',reporting:true});
   $('#save-state').textContent='';
   if(!sourceRole&&state.step!=='harness'){const target=ROOM_ALIAS[state.step]||state.step;state.step='harness';history.replaceState(null,'','#harness');renderChrome();openRoom(target);}
   return;
  }
  if(state.step==='precedents'){workspace.innerHTML='<div class="source-has-chat" data-precedents></div><div data-harness></div>';precedents.mount(workspace.querySelector('[data-precedents]'));$('#save-state').textContent='';return;}
  if(['accounting-library','memo-library'].includes(state.step)){workspace.innerHTML='<div class="source-has-chat" data-knowledge-workshop></div><div data-harness></div>';knowledgeWorkshop.mount(workspace.querySelector('[data-knowledge-workshop]'),{mode:state.step==='memo-library'?'memo':'accounting'});$('#save-state').textContent='';return;}
  if(!state.project) {workspace.innerHTML=landingHTML();return;}
  if(state.step==='audit-lab'){workspace.innerHTML='<div class="source-has-chat" data-knowledge-workshop></div><div data-harness></div>';knowledgeWorkshop.mount(workspace.querySelector('[data-knowledge-workshop]'),{mode:'audit',project:state.project});$('#save-state').textContent='';return;}
  const sample=state.project.name?.includes('教学样本')?'<div class="sample-strip"><span class="badge warning">教学样本</span><span>本项目为合成资料。结果仅用于了解操作流程，不代表任何真实公司的财务情况。</span></div>':'';
  if(['intake','data-room'].includes(state.step)){workspace.innerHTML=sample+'<div class="source-has-chat" data-source-room></div><div data-harness></div>';sourceRoom.mount(workspace.querySelector('[data-source-room]'),state.project,state.step);harness.mount(workspace.querySelector('[data-harness]'),state.project,{room:state.step,roleId:'source_librarian',chatOnly:true});$('#save-state').textContent='';return;}
  if(state.step==='harness'||ROOMS.some(r=>r[0]===state.step)){workspace.innerHTML=sample+'<div data-harness></div>';harness.mount(workspace.querySelector('[data-harness]'),state.project,{room:state.step==='harness'?'overview':state.step});$('#save-state').textContent='';return;}
  const content=({sources:sourcesHTML,mapping:mappingHTML,assumptions:assumptionsHTML,model:modelHTML,review:reviewHTML}[state.step] || sourcesHTML)();
  const agentView=['mapping','assumptions','model','review'].includes(state.step);
  workspace.innerHTML=sample+(agentView?'<div data-harness></div><details class="supervisor-advanced"><summary>高级编辑：直接修改规范化输入与编译设置</summary>'+content+'</details>':content);
  if(agentView)harness.mount(workspace.querySelector('[data-harness]'),state.project,['mapping','assumptions'].includes(state.step)?state.step:'');
  enhanceAssumptionFields();
  restoreDraft();
  operatingControls.forEach(control=>control.sync());
  provisionalControls.forEach(control=>control.sync());
  const orphans=orphanAssumptionDraftsHTML();if(orphans)workspace.insertAdjacentHTML('afterbegin',orphans);
  $('#save-state').textContent=state.dirtySteps.has(draftKey()) || tbHasUnsaved()?'有尚未保存的输入':'';
  if(state.dirtySteps.has(draftKey()) && state.draftRevisions.get(draftKey())!==state.project.revision)workspace.insertAdjacentHTML('afterbegin',`<div class="notice warning">此页尚未保存的输入基于较早的资料版本。请重新核对当前资料后填写。<button class="button button-small" data-action="discard-draft">放弃此页未保存输入并加载当前版本</button></div>`);
  renderLiquidityFollowup();
}
function liquiditySlot(compact=false) {
  const saved=liquidity.state();return `<div data-liquidity-slot="${esc(saved.key)}" data-liquidity-compact="${compact}">${liquidityHTML(saved,{compact,resolveLabel:id=>DRIVERS[id] || id})}</div>`;
}
function renderLiquiditySlots() {
  const saved=liquidity.state();
  $$('[data-liquidity-slot]').forEach(slot=>{
    if(!saved.context){slot.innerHTML='';return;}
    if(slot.dataset.liquiditySlot!==saved.key || selectedBuild()?.id!==saved.context.build.id || state.project?.id!==saved.context.projectId)return;
    const reportHadFocus=slot.contains(document.activeElement);
    slot.innerHTML=liquidityHTML(saved,{compact:slot.dataset.liquidityCompact==='true',resolveLabel:id=>DRIVERS[id] || id});
    // A delayed GET replaces the loading panel. Keep keyboard focus in this
    // report only if the operator has not already moved to another control.
    if(reportHadFocus)slot.querySelector('#liquidity-report')?.focus({preventScroll:true});
  });
}
function unavailableSelectionHTML() {
  return `<div class="notice warning" role="alert">所选模型版本在当前项目中不可用。请选择一个明确版本；此处没有自动改用最新模型。</div><div class="model-bar"><label for="build-select">重新选择模型版本</label><select id="build-select" class="version-select"><option value="${esc(state.buildId)}" selected disabled>原所选版本不可用</option>${versionOptions('')}</select></div>`;
}
function renderLiquidityFollowup() {
  const follow=liquidityFollowup;if(!follow || follow.projectId!==state.project?.id || follow.step!==state.step)return;
  const resolved=resolveLiquidityInputTarget(allAssumptions(),follow.target);
  const notice=document.createElement('div');notice.className='notice liquidity-followup';notice.setAttribute('role','status');notice.tabIndex=-1;
  notice.innerHTML=`正在处理当前资料版本 ${esc(state.project.revision)} 的输入；原资金报告对应资料版本 ${esc(follow.sourceRevision)}。${resolved.reason?`<p>${esc(resolved.reason)}</p>`:'<p>本次导航保留当前输入，尚未保存任何修改。保存后另生成模型，原报告保持不变。</p>'}<button type="button" class="button button-small" data-liquidity-return>返回原版资金报告</button>`;
  $('#workspace').prepend(notice);
  if(!follow.focus)return;follow.focus=false;
  let target=null;
  if(!resolved.reason && resolved.section==='assumptions') {
    const row=allAssumptions()[resolved.index],identity=row?assumptionIdentity(row):null;
    target=$$('.assumption-table tr[data-assumption-key]').find(el=>el.dataset.assumptionKey===identity);
    target?.classList.add('liquidity-target');
  } else if(resolved.section==='funding')target=$('.funding-overview');
  else if(resolved.section==='sources')target=$('#upload-tb');
  else if(resolved.section==='mapping')target=$('#mapping-form');
  const focus=target?.querySelector('input,select,textarea,button') || notice;
  focus.focus({preventScroll:true});(target || notice).scrollIntoView({block:'center'});
}
function openLiquidityInput(issueId,buildId) {
  const saved=liquidity.state();
  if(saved.phase!=='ready' || saved.context?.build.id!==buildId || selectedBuild()?.id!==buildId || saved.context.projectId!==state.project?.id)throw new Error('所选模型已经变化，请重新打开本版事项。');
  const matches=array(saved.report?.issues).filter(issue=>issue.id===issueId);if(matches.length!==1)throw new Error('本版事项编号不唯一或已不可用。');
  const target=matches[0].input_target,resolved=resolveLiquidityInputTarget(allAssumptions(),target);
  if(!resolved.section)throw new Error(resolved.reason);
  const step=resolved.section==='funding'?'assumptions':resolved.section;
  liquidityFollowup={projectId:state.project.id,buildId,sourceRevision:saved.report.build.source_revision,target,step,focus:true};
  navigate(step,{focusWorkspace:false});
}
function landingHTML() {if(!auditMode)return `<section class="report-landing"><span class="landing-mark" aria-hidden="true">M</span><h1>一起把模型搭起来。</h1><p>上传手边的资料，告诉华泰建模专家你想完成什么。<br>边讨论，边看成果，随时调整。</p><div class="button-row"><button class="button button-primary" data-action="new-project">＋ 新建项目</button><button class="button" data-action="sample">先体验一下</button></div><small>已有项目可以从左侧继续。</small></section>`;return `<div class="intro-layout"><section class="intro-copy"><p class="eyebrow">A WORKSPACE FOR FINANCIAL MODELING</p><h1>从公司底稿，<br>建立一个可复核的新模型。</h1><p>分批上传业务纪要、MDD、FDD 和历史 TB，把目标交给主 agent。它会查资料、选择工具、准备模型；你查看关键判断，随时改方向。每次调整保留版本和依据。</p><div class="button-row"><button class="button button-primary" data-action="new-project">建立新项目 <span aria-hidden="true">→</span></button><button class="button" data-action="sample" data-mutation>打开教学样本</button></div><div class="intro-steps"><div class="intro-step"><span>01</span><strong>理解公司与历史</strong><span>试算表、期间、科目及主体范围</span></div><div class="intro-step"><span>02</span><strong>形成预测依据</strong><span>管理层原话、数值假设与待确认事项</span></div><div class="intro-step"><span>03</span><strong>生成并复核</strong><span>情景调整、模型检查、可编辑 Excel</span></div></div></section><aside class="intro-sheet"><p class="sheet-title">WHAT YOU WILL NEED</p><h2>从现有资料开始，随时补充</h2><dl><div><dt>历史试算表</dt><dd>XLSX / CSV<br><span class="muted small">科目、期间及余额或发生额</span></dd></div><div><dt>MDD、FDD 与业务纪要</dt><dd>DOCX / PDF / TXT<br><span class="muted small">也可以直接粘贴原文</span></dd></div><div><dt>需要你作出的判断</dt><dd>关键判断与方向调整<br><span class="muted small">Agent 先分析，再请你处理少数例外</span></dd></div><div><dt>模型交付</dt><dd>新建 Excel 工作簿<br><span class="muted small">可编辑公式及来源记录</span></dd></div></dl><p class="callout">资料保存在本机项目中。使用外部 AI 前，需要单独确认当前资料版本和处理服务。</p></aside></div>`;}
function tbSource() {const work=tbWorkbench();return tbFiles().find(source=>source.id===work?.sourceId);}
function sourceTable(preview,limit=8,raw=false) {
  const headers=array(preview?.headers);
  const originalGrid=raw && array(preview?.grid).length>0;
  const allRows=originalGrid?preview.grid:raw?[headers,...array(preview?.rows)]:array(preview?.rows);
  const rowNumbers=originalGrid?array(preview.grid_row_numbers):raw?[preview?.header_row,...array(preview?.row_numbers)]:array(preview?.row_numbers);
  const width=allRows.reduce((size,row)=>Math.max(size,Array.isArray(row)?row.length:headers.length),headers.length);
  if(!width || !allRows.length)return '<p class="field-hint">没有可显示的表格预览。请检查文件是否包含表头与记录。</p>';
  const columns=Array.from({length:width},(_,index)=>index);const rows=allRows.slice(0,limit);
  return `<div class="table-scroll" tabindex="0" aria-label="${raw?'原始工作表，保留列位置与原始行号':'来源表格预览'}"><table><thead><tr><th>原始行</th>${columns.map(col=>`<th>${esc(raw?columnLetter(col):headers[col] || `${columnLetter(col)} · 空表头`)}</th>`).join('')}</tr></thead><tbody>${rows.map((row,index)=>`<tr><td class="muted mono">${esc(rowNumbers[index] ?? '未提供')}</td>${columns.map(col=>`<td>${esc(Array.isArray(row)?row[col]:row?.[headers[col]])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${allRows.length>limit?`<p class="field-hint">仅预览前 ${limit} 行，其余原始行仍保留在上传文件中。</p>`:''}`;
}
function sourcesHTML() {
  const p=state.project;const sources=array(p.sources);const tb=tbSource();
  return sectionHead('sources','上传原始资料。系统保留每份来源，后续假设与模型可以回到原文核对。',`<button class="button button-primary" data-step="harness">交给主 agent 分析 →</button>`)+`<div class="split"><section class="panel"><div class="panel-head"><div><h2>历史试算表</h2><p>可上传多份试算表，再按文件与工作表选择历史范围。</p></div><span class="badge neutral">01 / TB</span></div><div class="panel-body"><form class="upload-zone" id="upload-tb"><h3>选择试算表文件</h3><p>支持 XLSX、CSV，单个文件不超过 20 MiB。每次上传保留原件；可逐次上传不同年度或月份的文件，在科目映射页组合所需工作表。请保留科目编码、期间及原始借贷方向。</p><label class="sr-only" for="tb-file">历史试算表文件</label><input id="tb-file" name="file" type="file" accept=".xlsx,.csv" required><button class="button button-primary" type="submit">上传试算表</button></form><div class="source-list">${sources.filter(source=>source.role==='tb').map(sourceRow).join('') || '<p class="field-hint">尚未上传历史试算表。</p>'}</div></div>${tb?`<div class="panel-head"><div><h3>所选文件预览</h3><span class="muted small">${esc(tb.name)} · ${esc(tbSheetName(tb,tbWorkbench().sheets[tb.id]) || '当前数据表')} · 最多显示前 8 行</span></div></div><div class="panel-body">${tbFileSelect('tb-preview-source')}<label class="field spacer-top">工作表<select data-tb-sheet>${array(tb.preview?.sheets).map(item=>`<option value="${esc(item.name)}"${item.name===tbSheetName(tb,tbWorkbench().sheets[tb.id])?' selected':''}>${esc(item.name)}</option>`).join('') || '<option value="">当前数据表</option>'}</select></label></div>${sourceTable(sheetPreview(tb),8,true)}`:''}</section><section class="panel"><div class="panel-head"><div><h2>业务、尽调与会议资料</h2><p>逐步形成项目认识；资料共同保留，agent 按需检索、对照和更新判断。</p></div><span class="badge neutral">02 / MINUTES</span></div><div class="panel-body"><form class="upload-zone" id="upload-minutes"><h3>分批补充项目资料</h3><label class="field">资料类别<select name="source_kind"><option value="mdd">管理层访谈 MDD</option><option value="business_note">前期业务纪要</option><option value="fdd_note">财务尽调 FDD</option><option value="model_meeting">财务模型讨论会反馈</option><option value="other_note">其他业务资料</option></select></label><p>支持 DOCX、PDF、TXT，单个文件不超过 20 MiB；扫描件是否可提取以实际结果为准。</p><label class="sr-only" for="minutes-file">管理层讨论纪要文件</label><input id="minutes-file" name="file" type="file" accept=".docx,.pdf,.txt,.md" required><button class="button" type="submit">上传纪要</button></form><form id="paste-minutes"><label class="field">或直接粘贴原文<textarea name="minutes_text" placeholder="粘贴讨论纪要，建议包括讨论日期、发言人、收入和成本驱动，以及尚待确认的事项。" required></textarea></label><div class="button-row spacer-top"><button class="button" type="submit">保存纪要原文</button><span class="muted small">保存后可提取待确认假设</span></div></form><div class="source-list spacer-top">${sources.filter(source=>source.role==='minutes').map(sourceRow).join('')}</div></div></section></div><section class="panel spacer-top"><div class="panel-head"><div><h2>提取讨论中的建模线索</h2><p>数值只是候选假设，保存原文后仍需逐项确认。</p></div></div><div class="panel-body"><div class="button-row"><button class="button button-primary" data-action="analyze-local" data-mutation ${!sources.some(source=>source.role==='minutes')?'disabled':''}>本机规则提取</button><span class="muted small">按本机规则识别，不等同于 AI 理解或事实确认。</span></div>${(state.capabilities.ai?.available ?? state.capabilities.ai_available)?`<details class="spacer-top"><summary>使用已配置的外部 AI</summary><div class="notice warning"><strong>发送前核对</strong><p>处理服务：${esc(state.capabilities.ai?.route || state.capabilities.ai_route || '服务信息尚未提供')}<br>当前资料版本：${esc(p.revision)}。仅发送当前版本的管理层纪要文本，不发送试算表。</p><label class="check-label"><input type="checkbox" id="ai-consent" name="ai_consent">我同意把当前版本的管理层纪要发送至上述服务。</label></div><button class="button" data-action="analyze-ai" data-mutation>按已同意范围进行 AI 提取</button></details>`:'<p class="field-hint">主 agent 在工作台启动，会结合全部已选资料进行分析。此处保留本机提取工具供需要时使用。</p>'}</div></section>`;
}
function sourceRow(source) {
  const compiled=source.role==='tb' && Boolean(state.project?.tb) && (array(state.project.tb.source_ids).includes(source.id) || state.project.tb.source_id===source.id || (!array(state.project.tb.source_ids).length && source.active===true));
  return `<div class="source-row"><span class="source-type">${source.role==='tb'?'TB':'DOC'}</span><div><div class="source-name">${esc(source.name || '纪要原文')}</div><div class="source-meta">${source.sha256?`指纹 ${esc(source.sha256.slice(0,12))}…`:'来源指纹由服务保存'}</div>${source.role==='tb'?`<span class="badge ${compiled?'neutral':'warning'}">${compiled?'已用于当前历史读取':'原件已上传，当前未采用'}</span>`:''}</div><button class="button button-small" data-source="${esc(source.id)}">查看来源</button></div>`;
}
function sheetPreview(source=tbSource(),sheetName) {
  const work=tbWorkbench();const sheets=array(source?.preview?.sheets);
  const selectedName=tbSheetName(source,sheetName ?? work?.sheets[source?.id]);
  const selected=sheets.find(sheet=>(sheet.name || sheet)===selectedName);
  return selected && typeof selected==='object'?selected:source?.preview || {};
}
function tbHeaderPreview(preview,headerRow) {
  if(Number(headerRow)===Number(preview.header_row || 1))return preview;
  const index=array(preview.grid_row_numbers).findIndex(value=>Number(value)===Number(headerRow));
  const row=preview.grid?.[index];
  if(!Array.isArray(row))return {...preview,headers:[],rows:[],headerUnavailable:true};
  return {...preview,header_row:Number(headerRow),headers:row.map(value=>String(value ?? '').trim()),rows:preview.grid.slice(index+1),row_numbers:array(preview.grid_row_numbers).slice(index+1)};
}
function columnLetter(index) {let label='';for(let n=index+1;n>0;n=Math.floor((n-1)/26))label=String.fromCharCode(65+(n-1)%26)+label;return label;}
function mappingHTML() {
  const p=state.project;const source=tbSource();if(!source) return sectionHead('mapping','先导入历史试算表，再确认期间和科目。')+`<section class="panel">${empty('还没有试算表','回到资料页上传 XLSX 或 CSV。','<button class="button button-primary" data-step="sources">导入资料</button>')}</section>`;
  const work=tbWorkbench();const rawPreview=sheetPreview();const sheet=tbSheetName(source,work.sheets[source.id]);work.sheets[source.id]=sheet;const config=tbConfiguration(source,sheet);const fields=work.drafts.get(tbScope(source.id,sheet)) || {};const settings=config.settings;const preview=tbHeaderPreview(rawPreview,fields.setting_header_row ?? settings.header_row ?? rawPreview.header_row ?? 1);const headers=array(preview.headers);
  const columnLabels={account_code:'科目编码',account_name:'科目名称',period:'期间',entity:'主体',opening:'期初余额',debit:'借方发生额',credit:'贷方发生额',closing:'期末余额',line:'已有分类（如有）'};
  const savedColumns=config.columns;const columnChoices=headers.map((header,index)=>({value:header && !header.startsWith('__column_') && headers.indexOf(header)===headers.lastIndexOf(header)?header:`__column_${index}`,label:`${columnLetter(index)} · ${header || '空表头'}`}));
  const suggested={account_code:/^(account.?code|科目编码|科目代码)$/i,account_name:/^(account.?name|科目名称|科目)$/i,period:/^(period|期间|年月|月份|date|日期)$/i,entity:/^(entity|主体|公司)$/i,opening:/^(opening|期初余额|期初)$/i,debit:/^(debit|借方发生额|借方)$/i,credit:/^(credit|贷方发生额|贷方)$/i,closing:/^(closing|期末余额|期末)$/i,line:/^(line|分类|报表项目)$/i};
  const mappings=array(p.mapping).length?p.mapping:array(p.tb?.accounts);
  const mapped=mappings.filter(row=>row.line && row.line!=='unmapped');
  return sectionHead('mapping','确认原始列、借贷方向和利润结转口径。没有对应分类的科目会保留为待处理项。',`<button class="button" data-step="assumptions">下一步：建模假设 →</button>`)+`<section class="panel"><div class="panel-head"><div><h2>历史数据口径</h2><p>${esc(source.name)} · ${esc(sheet || '当前数据表')} · 自动识别的列仅供核对</p></div><button class="button button-small" data-source="${esc(source.id)}" data-source-sheet="${esc(sheet)}">查看所选原表</button></div><form id="normalize-form" data-source-id="${esc(source.id)}" data-sheet="${esc(sheet)}"><div class="panel-body"><div class="form-grid three">${tbFileSelect()}<label class="field">工作表<select name="setting_sheet" id="sheet-select">${array(source.preview?.sheets).map(sheet=>`<option value="${esc(sheet.name || sheet)}"${(sheet.name||sheet)===rawPreview.name?' selected':''}>${esc(sheet.name || sheet)}</option>`).join('') || '<option value="">当前数据表</option>'}</select></label><label class="field">表头所在行<input type="number" min="1" step="1" id="tb-header-row" name="setting_header_row" value="${esc(fields.setting_header_row ?? settings.header_row ?? rawPreview.header_row ?? 1)}" required></label><label class="field">金额性质<select name="setting_basis" required>${options({balance:'时点余额',movement:'单期发生额',ytd:'年初至今累计发生额'},settings.basis)}</select></label><label class="field">余额正负号<select name="setting_sign_convention" required>${options({debit_positive:'借方为正，贷方为负',credit_positive:'贷方为正，借方为负'},settings.sign_convention)}</select></label><label class="field">主体范围<select name="setting_consolidation_scope" required>${options({standalone:'单体报表',consolidated:'合并报表（已完成抵销）'},settings.consolidation_scope)}</select></label><label class="field">财政年度起始月<select name="setting_fiscal_year_start_month" required>${options(MONTHS,settings.fiscal_year_start_month)}</select></label><label class="field">本年利润结转<select name="setting_profit_closure" required>${options({closed:'已结转至权益科目',unclosed:'尚未结转至权益科目'},settings.profit_closure)}</select></label><label class="field">损益金额口径<select name="setting_pl_basis" required>${options({movement:'本月发生额',ytd:'年初至今累计额'},settings.pl_basis)}</select></label><label class="field">缺省主体名称<input name="setting_entity" value="${esc(settings.entity || '')}" placeholder="无主体列时必填"></label><label class="field">缺省期间<input name="setting_period" value="${esc(settings.period || '')}" placeholder="无期间列时填写，如 2025-12"></label><label class="field">期初余额对应期间<input name="setting_opening_period" value="${esc(settings.opening_period || '')}" placeholder="如 2025-11；无期初可留空"></label></div><p class="field-hint">列报口径：${esc(unitLabel())}。多主体资料的合并、抵销与范围应先由团队确认。</p><div class="section-label">将原始列对应到所需信息</div>${preview.headerUnavailable?'<p class="notice warning">预览中未取得该表头行，请核对行号；必要时整理原文件后重新上传。</p>':''}<div class="form-grid three">${Object.entries(columnLabels).map(([key,label])=>{const saved=typeof savedColumns[key]==='number'?columnChoices[savedColumns[key]]?.value:savedColumns[key];const matched=headers.findIndex(header=>suggested[key].test(header));const guess=first(fields[`col_${key}`],saved,matched>=0?columnChoices[matched].value:undefined,'');return `<label class="field">${label}<select name="col_${key}" ${['account_code','account_name'].includes(key)?'required':''}>${options(Object.fromEntries(columnChoices.map(choice=>[choice.value,choice.label])),guess,['account_code','account_name'].includes(key)?'请选择对应列':'未提供 / 使用缺省值')}</select></label>`;}).join('')}</div><label class="check-label spacer-top"><input type="checkbox" name="normalization_confirmed" required>我已核对上述期间、主体、金额单位和借贷口径。</label></div><div class="panel-foot"><p>缺失金额保持为缺失，不自动补零。设置仅属于此文件和工作表。</p><div class="button-row"><button class="button" type="button" data-action="tb-add">${work.editIndex!==null?'更新清单中的此项':'加入历史资料清单'}</button>${!work.queue.length?'<button class="button button-primary" type="submit">确认口径并读取科目</button>':''}</div></div></form><details class="tb-selected-preview"><summary>预览当前文件与工作表：${esc(source.name)} · ${esc(sheet || '当前数据表')}</summary>${sourceTable(preview)}</details></section>${tbBundleHTML()}${array(p.tb?.issues).length?`<section class="panel"><div class="panel-head"><h2>导入时发现的事项</h2></div><div class="panel-body">${gapsHTML(p.tb.issues)}</div></section>`:''}<section class="panel"><div class="panel-head"><div><h2>科目与报表项目</h2><p>逐行确认分类。分类建议并不代表会计结论。</p></div>${mappings.length?'<button class="button button-small" data-action="confirm-mappings">确认当前已分类科目</button>':''}</div>${mappings.length?`<div class="mini-statbar"><div><span class="value">${mappings.length}</span><span class="label">科目</span></div><div><span class="value">${mapped.length}</span><span class="label">已有分类</span></div><div><span class="value">${mappings.length-mapped.length}</span><span class="label">待分类</span></div><div><span class="label">历史期间 ${esc(array(p.tb?.periods).join(' / ') || '未提供')}</span></div></div><form id="mapping-form"><div class="table-scroll" tabindex="0" aria-label="科目映射"><table class="mapping-table"><thead><tr><th>科目编码</th><th>原始科目</th><th>报表项目</th><th>确认状态</th></tr></thead><tbody>${mappings.map((row,index)=>`<tr class="${!row.line||row.line==='unmapped'?'unmapped':''}"><td class="mono">${esc(row.account_code)}</td><td>${esc(row.account_name || row.name || '')}</td><td><label class="sr-only" for="mapping-line-${index}">${esc(row.account_name)} 对应报表项目</label><select id="mapping-line-${index}" name="mapping_line_${index}" data-map-index="${index}">${options(LINES,row.line || 'unmapped',null)}</select></td><td><label class="check-label"><input type="checkbox" name="mapping_confirmed_${index}" ${row.confirmed?'checked':''}>已核对</label></td></tr>`).join('')}</tbody></table></div><div class="panel-foot"><p>待分类或未确认的重大余额将阻止正式交付。</p><button class="button button-primary" type="submit">保存科目映射</button></div></form>`:empty('确认口径后，科目会显示在这里','先选择原始列和期间口径，再读取科目。')}</section>`;
}
function allAssumptions() {
  const rows=[...array(state.project?.assumptions),...array(state.extraAssumptions.get(state.project?.id))];
  const definitions=state.capabilities.driver_definitions || {};
  const method=state.project?.architecture?.revenue_method || state.project?.business_type;
  const required=[...array(definitions.common_required),...array(definitions.business_required?.[method])];
  for(const id of required)if(!rows.some(row=>row.id===id)) {
    if(state.project?.funding?.mode && state.project.funding.mode!=='aggregate' && legacyFundingDrivers.has(id))continue;
    const info=array(definitions.drivers).find(row=>row.id===id) || {};
    rows.push({id,label:DRIVERS[id] || info.label || id,value:null,unit:['ratio','days','units'].includes(info.unit)?info.unit:'',period:'forecast',basis:'人工明确采用的建模假设',owner:'',status:'missing',source_quote:'',question:'资料中尚未明确此项；请补充数值、单位及采用依据。',required_placeholder:true,...(OPERATING_DRIVERS.has(id)?{operating_binding_required:true}:{})});
  }
  return rows.map((row,index)=>({...row,...(cashDrafts.get(cashKey(row,index)) || {})}));
}
function enhanceAssumptionFields() {
  operatingControls.clear();
  provisionalControls.clear();
  if(state.step!=='assumptions')return;
  allAssumptions().forEach((row,index)=>{
    const input=$(`[name="assumption_value_${index}"]`);if(!input)return;
    const line=input.closest('tr');
    line.dataset.assumptionKey=assumptionIdentity(row);assumptionDraftLabels.set(line.dataset.assumptionKey,row.label || DRIVERS[row.id] || row.id);
    const details=document.createElement('details');details.className='spacer-top small';
    details.innerHTML=`<summary>单位、频率及采用依据</summary><label class="field">数值单位<input name="assumption_unit_${index}" value="${esc(row.unit || '')}" placeholder="如：ratio、days、CNY、units"></label>${['interest_rate','depreciation_rate'].includes(row.id)?`<label class="field">利率 / 折旧率频率<select name="rate_basis_${index}">${options({annual:'年率',monthly:'月率'},row.rate_basis || (['annual','monthly'].includes(row.basis)?row.basis:''))}</select></label>`:''}<label class="field">本次采用说明<textarea name="assumption_note_${index}" rows="2" placeholder="说明人工假设或换算依据；原文会另行保留。">${esc(row.adoption_note || '')}</textarea></label>`;
    line.lastElementChild.append(details);
    const provisional=createProvisionalControls({row,index,onDirty:markDirty});
    provisionalControls.set(index,provisional);line.lastElementChild.append(provisional.element);
    if(OPERATING_DRIVERS.has(row.id)) {
      const key=operatingKey(row,index);
      const control=createOperatingControls({row,index,draft:operatingDrafts.get(key),onDirty:draft=>{provisional.resetAcceptance();markDirty();operatingDrafts.set(key,draft);}});
      operatingControls.set(index,control);line.children[2].append(control.element);
    }
    if(cashDrivers.has(row.id)) {
      const schedule=document.createElement('button');schedule.type='button';schedule.className='button button-small spacer-top';
      schedule.dataset.action='cash-schedule';schedule.dataset.assumptionIndex=String(index);
      schedule.textContent=row.cash_allocation?'查看 / 修改分月安排':'按发生月份安排总额';
      line.lastElementChild.append(schedule);
      if(row.cash_allocation){const note=document.createElement('p');note.className='field-hint';note.textContent=`${row.cash_allocation.start_month} 至 ${row.cash_allocation.end_month} · ${row.cash_allocation.confirmed?'分月安排已确认':'分月安排草稿'}；本行数值为该期间合计。`;line.lastElementChild.append(note);}
    }
    const period=$(`[name="assumption_period_${index}"]`);
    if(period?.value==='forecast')period.value='全预测期';
    $$('input[name],select[name],textarea[name]',line).forEach(el=>{if(preserveDraftElement(el))el.dataset.draftBaseline=JSON.stringify(el.type==='checkbox'?el.checked:el.value);});
  });
  refreshOperatingCalendar();
}
function assumptionsHTML() {
  const p=state.project;const rows=allAssumptions();const architecture=p.architecture || {};const confirmed=rows.filter(row=>row.status==='confirmed').length;
  return sectionHead('assumptions','区分管理层输入与银行团队暂定假设。保留出处、适用期间和责任人，再明确本版采用。',`<button class="button" data-step="model">进入模型与调整 →</button>`)+`<form id="assumption-form"><section class="panel"><div class="panel-head"><div><h2>建模范围与收入驱动</h2><p>仅建立明确支持、且由你确认的业务模块。</p></div></div><div class="panel-body"><div class="form-grid"><label class="field">收入驱动方式<select name="arch_revenue_method" required>${options({product:'产品销售：销量 × 平均售价',service:'服务收入：服务量 × 单价',project:'项目收入：合同余额 × 确认比例',growth:'简化收入：基准月收入 × 月增长'},architecture.revenue_method || '')}</select></label><label class="field">财政年度起始月<select name="arch_fiscal_year_start_month" required>${options(MONTHS,architecture.fiscal_year_start_month)}</select></label><div><h3>预测范围</h3><p class="field-hint">${esc(p.forecast_months || '—')} 个月 · ${esc(unitLabel())}<br>适用于已支持的非金融企业模块。行业专属收入确认和复杂业务安排需另行建立明细。</p></div></div><div class="section-label">以下简化政策须逐项确认</div><div class="policy-grid">${POLICIES.map(([key,value,title,description])=>`<div class="policy-item"><h3>${title}</h3><p>${description}</p><label class="check-label"><input type="checkbox" name="policy_${key}" ${architecture[key]===value && architecture.policies_confirmed===true?'checked':''}>接受此版本采用该口径</label></div>`).join('')}</div></div></section>${fundingPanelHTML()}<section class="panel"><div class="panel-head"><div><h2>预测假设</h2><p>比例按小数输入：0.20 表示 20%。有分歧时确认采用的一项，将其他项设为‘本模型不采用’；所有原话都会保留。</p></div><span class="badge neutral">${confirmed} / ${rows.length} 已采用建模</span></div>${rows.length?`<div class="table-scroll" tabindex="0" aria-label="可编辑预测假设"><table class="assumption-table"><thead><tr><th>业务驱动</th><th>数值</th><th>适用期间</th><th>责任归属</th><th>状态</th><th>原文与依据</th></tr></thead><tbody>${rows.map((row,index)=>`<tr><td class="driver-label">${esc(row.label || DRIVERS[row.id] || row.id)}<div class="driver-unit">${esc(row.unit || '')}${row.id==='gross_margin'?' · 模型采用折旧前口径':''}${row.basis?` · ${esc(row.basis)}`:''}${boundsText(row.bounds)?` · ${row.cash_allocation?'总额':'数值'}范围：${esc(boundsText(row.bounds))}`:''}</div></td><td><label class="sr-only" for="assumption-value-${index}">${esc(row.label || row.id)} 数值</label><input id="assumption-value-${index}" type="number" step="any" name="assumption_value_${index}" value="${esc(first(row.value,''))}" placeholder="待提供">${row.proposed_value!==undefined?`<div class="driver-unit">原建议 ${esc(row.proposed_value)}</div>`:''}</td><td><label class="sr-only" for="assumption-period-${index}">适用期间</label><input id="assumption-period-${index}" type="text" name="assumption_period_${index}" value="${esc(row.period || '')}" placeholder="填写适用期间">${GROWTH_DRIVERS.has(row.id)?`<label class="field-hint">增长频率<select name="assumption_growth_basis_${index}">${options({monthly:'按月复合增长',annual:'有效年复合增长率，按月折算'},row.growth_basis || (['monthly','annual'].includes(row.basis)?row.basis:''))}</select></label><p class="field-hint warning">同比 / 全年增幅需另确认含义，不能直接视为有效年复合增长率。</p>`:''}</td><td><label class="sr-only" for="assumption-owner-${index}">责任归属</label><select id="assumption-owner-${index}" name="assumption_owner_${index}">${options({management:'管理层（责任归属）',banker:'银行团队',accountant:'会计师'},row.owner || '', '请选择')}</select></td><td><label class="sr-only" for="assumption-status-${index}">确认状态</label><select id="assumption-status-${index}" name="assumption_status_${index}">${options(STATUS_FILTER,row.status || 'proposed',null)}</select></td><td><div class="source-quote">${esc(row.source_quote || row.basis || '尚未附上来源依据')}${row.question?`<p class="field-hint warning">待问清：${esc(row.question)}</p>`:''}</div>${row.source_date || row.date?`<div class="driver-unit">讨论日期 ${esc(row.source_date || row.date)}</div>`:''}${sourceButton(row.source_id)}</td></tr>`).join('')}</tbody></table></div>`:empty('还没有候选假设','先提取管理层纪要，或在下方补充已知的业务输入。')}<div class="panel-foot"><p>‘已采用建模’仅表示操作人选择本版输入。管理层责任归属和操作采用均不代表公司已经确认。</p><button class="button button-primary" type="submit">保存假设、融资安排与建模范围</button></div></section></form><section class="panel"><div class="panel-head"><h2>补充一项业务假设</h2></div><form id="add-assumption"><div class="panel-body"><div class="form-grid three"><label class="field">业务驱动<select name="new_driver" required>${options(DRIVERS,'')}</select></label><label class="field">数值<input type="number" step="any" name="new_value" placeholder="可以留空，作为待问事项"></label><label class="field">单位 / 比例口径<input name="new_unit" placeholder="如：比例、天、元、件" required></label><label class="field">适用期间<input name="new_period" placeholder="如：预测期每月" required></label><label class="field">关联来源<select name="new_source">${options(Object.fromEntries(array(p.sources).map(source=>[source.id,source.name || '纪要原文'])),'','尚未关联')}</select></label><label class="field">讨论日期<input type="date" name="new_date"></label></div><label class="field spacer-top">逐字引文（有关联来源时填写）<textarea name="new_quote" rows="3" style="min-height:90px" placeholder="仅填写来源中的原话；无来源可留空，暂定原因和数值依据在候选表中分别填写。"></textarea></label><button class="button spacer-top" type="submit">加入候选假设</button><p class="field-hint">加入后仍为待采用；在上方明确来源类别、责任和采用依据后保存。</p></div></form></section>${array(p.statements).length?`<section class="panel"><div class="panel-head"><h2>纪要中的原始陈述</h2></div><div class="panel-body">${p.statements.map(statement=>`<div class="evidence-item"><span class="inline-tag">${esc(statement.date || statement.period || '日期未明确')}</span><span class="inline-tag">${esc(statement.speaker || '发言人未明确')}</span><blockquote>${esc(first(statement.source_quote,statement.text,statement.quote,statement.statement,''))}</blockquote>${sourceButton(statement.source_id)}${statement.question?`<p class="field-hint warning">${esc(statement.question)}</p>`:''}</div>`).join('')}</div></section>`:''}${array(p.gaps).length?`<section class="panel"><div class="panel-head"><h2>尚待补充的事项</h2></div><div class="panel-body">${gapsHTML(p.gaps)}</div></section>`:''}`;
}
const STATUS_FILTER={proposed:'待采用',confirmed:'已采用建模',missing:'待补充',conflicted:'存在分歧',excluded:'本模型不采用'};
const statementRows = {
  pl:[['revenue','营业收入'],['cogs','营业成本（折旧前）'],['gross_profit','现金毛利（折旧前）','total'],['selling_expense','销售费用'],['admin_expense','管理费用'],['research_expense','研发费用'],['ebitda','EBITDA','total'],['depreciation','折旧费用'],['ebit','经营利润 EBIT','total'],['interest_expense','利息费用'],['other_income','其他收益'],['profit_before_tax','税前利润','total'],['tax_expense','所得税费用'],['net_profit','净利润','total']],
  bs:[['cash','现金及银行结余'],['receivables','应收款项'],['inventory','存货'],['net_ppe','固定资产净额'],['other_assets','其他资产'],['total_assets','资产总额','total'],['payables','应付款项'],['tax_payable','应付税款'],['debt','借款'],['lease_liability','租赁负债'],['other_liabilities','其他负债'],['total_liabilities','负债总额','total'],['share_capital','股本'],['retained_earnings','留存收益'],['other_equity','其他权益'],['total_equity','权益总额','total'],['balance_check','资产负债差额','total']],
  cfs:[['net_profit','净利润'],['depreciation','加回折旧'],['change_receivables','应收变动现金影响'],['change_inventory','存货变动现金影响'],['change_payables','应付变动现金影响'],['change_tax_payable','应付税款变动现金影响'],['operating_cash_flow','经营活动现金流','total'],['capex','资本开支（流出额）'],['investing_cash_flow','投资活动现金流','total'],['debt_draw','新增借款'],['debt_repayment','偿还借款（流出额）'],['dividends','股息（流出额）'],['financing_cash_flow','融资活动现金流','total'],['net_cash_flow','现金净变动','total'],['opening_cash','期初现金'],['cash','期末现金','total'],['funding_gap','现金缺口','total']]
};
const aliases={net_ppe:['ppe_net','fixed_assets_net'],ebit:['operating_profit'],profit_before_tax:['pbt','pretax_profit'],total_assets:['assets'],total_liabilities:['liabilities'],total_equity:['equity'],cash:['ending_cash','closing_cash'],net_profit:['net_income'],operating_cash_flow:['cfo','operating_cf'],investing_cash_flow:['cfi','investing_cf'],financing_cash_flow:['cff','financing_cf'],net_cash_flow:['cash_change','net_change_cash'],funding_gap:['cash_gap','unmet_funding','unmet_debt'],debt_draw:['draw_effective','effective_debt_draw','debt_draw_effective'],debt_repayment:['repayment_effective','effective_debt_repayment'],dividends:['dividends_effective'],balance_check:['bs_check','balance_difference'],change_receivables:['delta_receivables','receivables_change'],change_inventory:['delta_inventory','inventory_change'],change_payables:['delta_payables','payables_change']};
function financialEntry(period,key,tab) {
  for(const source of [period?.[tab],period?.[tab==='pl'?'income_statement':tab==='bs'?'balance_sheet':'cash_flow'],period]) for(const name of [key,...(aliases[key] || [])]) if(source?.[name]!==undefined && source?.[name]!==null) return {field:name,value:source[name]};
  return {field:null,value:null};
}
function financialValue(period,key,tab) {return financialEntry(period,key,tab).value;}
function traceCell(build,result,period,key,label,tab) {
  const entry=financialEntry(period,key,tab==='history'?'pl':tab),binding=resolveTraceBinding(result,{scope:tab==='history'?'history':'forecast',period:period.period || period.month,field:entry.field,value:entry.value,aliases:aliases[entry.field] || []});
  if(!binding.nodeId)return `<span title="${esc(binding.reason)}">${fmt(entry.value)}</span>${binding.mismatch?`<span class="trace-unavailable">${esc(binding.reason)}</span>`:''}`;
  const id=String(traceEntries.size);traceEntries.set(id,{buildId:build.id,nodeId:binding.nodeId,projectId:build.project_id || state.project.id,currentProjectRevision:state.project.revision,expectedValue:entry.value,displayLabel:label,currency:result.currency,unit:result.unit,buildName:build.name,createdAt:build.created_at});
  return `<button type="button" class="trace-number" data-trace-entry="${id}" data-trace-build="${esc(build.id)}" data-trace-period="${esc(period.period || period.month)}" data-trace-field="${esc(entry.field)}" aria-label="${esc(label)} ${esc(period.period || period.month)} ${esc(entry.value)} ${esc(result.currency)} ${esc(UNIT_LABELS[result.unit] || result.unit)}，查看计算与原始依据">${fmt(entry.value)}</button>`;
}
function summaryMetrics(result) {
  const forecast=forecastOf(result);const summary=result.summary || {};const last=forecast.at(-1);const sum=(key)=>forecast.length && forecast.every(period=>number(financialValue(period,key,'pl'))!==null)?forecast.reduce((total,period)=>total+Number(financialValue(period,key,'pl')),0):null;
  return {revenue:first(summary.total_revenue,summary.revenue,sum('revenue')),profit:first(summary.total_net_profit,summary.net_profit,summary.net_income,sum('net_profit')),cash:first(summary.ending_cash,summary.closing_cash,summary.cash,financialValue(last,'cash','bs')),gap:first(summary.max_funding_gap,summary.funding_gap,forecast.length && forecast.every(period=>number(financialValue(period,'funding_gap','cfs'))!==null)?Math.max(...forecast.map(period=>Number(financialValue(period,'funding_gap','cfs')))):null)};
}
function metricsHTML(result) {
  const metrics=summaryMetrics(result);
  return `<div class="metrics">${[['预测期收入',metrics.revenue,'revenue'],['预测期净利润',metrics.profit,'profit'],['期末现金',metrics.cash,'cash'],['最大现金缺口',metrics.gap,'gap']].map(([label,value,key])=>`<div class="metric"><div class="metric-label">${label}</div><div class="metric-value ${number(value)<0||key==='gap'&&number(value)>0?'negative':''}">${fmt(value)}</div><div class="metric-note">${esc(result.currency || '币种未提供')} · ${esc(UNIT_LABELS[result.unit] || result.unit || '单位未提供')}${key==='gap'?' · 不能以配平代替融资':''}</div></div>`).join('')}</div>`;
}
function chartHTML(result) {
  const periods=forecastOf(result);if(!periods.length) return '';
  const series=periods.map(period=>({period:String(period.period || period.month || ''),revenue:number(financialValue(period,'revenue','pl')),cash:number(financialValue(period,'cash','bs'))}));
  const values=series.flatMap(point=>[point.revenue,point.cash]).filter(value=>value!==null);if(!values.length) return '';
  const width=900,height=160,left=65,right=20,top=15,bottom=30;const max=Math.max(...values,0),min=Math.min(...values,0),range=max-min || 1;
  const x=index=>left+index*(width-left-right)/Math.max(series.length-1,1);const y=value=>top+(max-value)*(height-top-bottom)/range;
  const path=key=>{let move=true;return series.map((point,index)=>{if(point[key]===null){move=true;return '';}const segment=`${move?'M':'L'}${x(index).toFixed(2)},${y(point[key]).toFixed(2)}`;move=false;return segment;}).join(' ');};
  const indexes=[...new Set([0,Math.floor((series.length-1)/2),series.length-1])];
  return `<div class="chart-wrap"><div class="chart-head"><span>预测月度趋势 · ${esc(result.currency || '币种未提供')} · ${esc(UNIT_LABELS[result.unit] || result.unit || '单位未提供')}</span><div class="chart-legend"><span>收入</span><span>期末现金</span></div></div><svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="预测月度收入及期末现金趋势，明细见下方报表">${[max,(max+min)/2,min].map(value=>`<line x1="${left}" y1="${y(value)}" x2="${width-right}" y2="${y(value)}" stroke="#e5eadf"/><text x="${left-12}" y="${y(value)+4}" text-anchor="end">${esc(fmt(value,0))}</text>`).join('')}<path d="${path('revenue')}" fill="none" stroke="#204b39" stroke-width="2.5"/><path d="${path('cash')}" fill="none" stroke="#a7b68c" stroke-width="2.5"/>${indexes.map(index=>`<text x="${x(index)}" y="${height-8}" text-anchor="${index===0?'start':index===series.length-1?'end':'middle'}">${esc(series[index].period)}</text>`).join('')}</svg></div>`;
}
function statementHTML(result,tab,build) {
  let periods=forecastOf(result);
  if(tab==='history') {periods=Array.isArray(result.history)?result.history:array(result.history?.periods);if(!periods.length) return empty('历史报表尚未提供','本版结果没有可直接显示的历史期间报表。请查阅历史数据和输出明细。');}
  if(!periods.length) return empty('本版没有可显示的期间数据','模型尚未完成，或当前输出未包含所选报表。');
  const displayTab=tab==='history'?'pl':tab;const rows=statementRows[displayTab] || statementRows.pl;
  return `<div class="table-scroll" tabindex="0" aria-label="${esc(tab)} 财务报表"><table class="statement-table"><thead><tr><th>报表项目 · ${esc(result.currency || '币种未提供')} · ${esc(UNIT_LABELS[result.unit] || result.unit || '单位未提供')}</th>${periods.map(period=>`<th class="numeric">${esc(period.period || period.month || period.label || '期间未提供')}</th>`).join('')}</tr></thead><tbody>${rows.map(([key,label,type])=>`<tr class="${type==='total'?'subtotal':''}"><td>${label}</td>${periods.map(period=>`<td class="numeric">${build?traceCell(build,result,period,key,label,tab):fmt(financialValue(period,key,displayTab))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
const buildRevision = build => first(build?.source_revision,build?.revision);
function versionOptions(current,emptyLabel) {return `${emptyLabel?`<option value="">${emptyLabel}</option>`:''}${array(state.project?.builds).map((build,index)=>`<option value="${esc(build.id)}"${build.id===current?' selected':''}>版本 ${index+1} · ${esc(build.name || build.scenario_name || '基准模型')} · 资料版本 ${esc(first(buildRevision(build),'未提供'))} · ${stamp(build.created_at)}</option>`).join('')}`;}
function comparisonHTML(build) {
  const compare=array(state.project?.builds).find(item=>item.id===state.compareId);if(!compare || compare.id===build.id) return '<p class="field-hint">选择一个不同的已生成版本，比较实际输出。</p>';
  const current=summaryMetrics(resultOf(build)),prior=summaryMetrics(resultOf(compare));
  return `<div class="table-scroll"><table><thead><tr><th>指标</th><th class="numeric">当前所选版本</th><th class="numeric">比较版本</th><th class="numeric">变化</th></tr></thead><tbody>${[['revenue','收入'],['profit','净利润'],['cash','期末现金'],['gap','最大现金缺口']].map(([key,label])=>`<tr><td>${label}</td><td class="numeric">${fmt(current[key])}</td><td class="numeric">${fmt(prior[key])}</td><td class="numeric">${number(current[key])!==null && number(prior[key])!==null?fmt(Number(current[key])-Number(prior[key])):'—'}</td></tr>`).join('')}</tbody></table></div>`;
}
function modelHTML() {
  const p=state.project;const build=selectedBuild();const result=resultOf(build);const confirmed=allAssumptions().filter(row=>row.status==='confirmed').length;
  const heading=sectionHead('model','每次生成保留独立模型版本。修改假设或情景后重新计算，再比较结果与资金缺口。',`<button class="button button-primary" data-action="build" data-mutation ${state.job?'disabled':''}>${build?'按当前假设生成新版本':'生成新财务模型'}</button>`);
  if(!build && state.buildId)return heading+unavailableSelectionHTML();
  if(!build) return heading+`<section class="panel"><div class="panel-head"><h2>开始生成前</h2><span class="badge neutral">尚未生成</span></div><div class="panel-body"><div class="mini-statbar"><div><span class="value">${array(p.sources).length}</span><span class="label">份资料</span></div><div><span class="value">${array(p.mapping).filter(row=>row.confirmed).length}</span><span class="label">个已确认科目</span></div><div><span class="value">${confirmed}</span><span class="label">项已采用假设</span></div></div>${empty('模型将从当前已确认资料新建','先保存科目映射、收入方式及经营假设。资料不足时，生成任务会列明需要补充的内容。','<button class="button" data-step="assumptions">核对建模假设</button>')}${array(p.gaps).length?gapsHTML(p.gaps):''}</div></section>`;
  const grouped=new Map();
  for(const row of allAssumptions().filter(row=>row.status==='confirmed' && (number(row.value)!==null || hasEffectiveOperatingMap(row)))) {
    const prior=grouped.get(row.id);
    grouped.set(row.id,prior?{...prior,multiplePeriods:true,operatingModes:[...new Set([...prior.operatingModes,row.operating_binding?.mode || 'legacy'])]}:{...row,operatingModes:[row.operating_binding?.mode || 'legacy']});
  }
  const scenarioDrivers=[...grouped.values()];
  return heading+`<div class="model-bar"><div class="button-row"><label for="build-select" class="small muted">当前查看</label><select id="build-select" class="version-select">${versionOptions(build.id)}</select>${badge(build.status || '结果已保存')}</div><div class="button-row"><a class="button button-small" href="/api/builds/${encodeURIComponent(build.id)}/download?kind=xlsx">下载复核用 Excel ↓</a><a class="button button-small" href="/api/builds/${encodeURIComponent(build.id)}/download?kind=json">下载数据记录</a></div></div>${buildRevision(build)!==undefined && buildRevision(build)!==p.revision?'<div class="notice warning">此模型来自较早的资料版本。当前资料已修改，原版模型保留供比较，请生成新版本后重新复核。</div>':''}${governanceHTML(result.assumption_governance)}${metricsHTML(result)}${liquiditySlot(true)}<p class="trace-hint">带下划线的报表数字可逐层查看本版计算与原始依据；未提供追溯记录的数字保持原样。</p><section class="panel">${chartHTML(result)}<div class="tabs" role="tablist" aria-label="模型报表">${[['pl','利润表'],['bs','资产负债表'],['cfs','现金流量表'],['history','历史数据']].map(([key,label])=>`<button class="tab ${state.modelTab===key?'active':''}" role="tab" aria-selected="${state.modelTab===key}" data-model-tab="${key}" id="tab-${key}" aria-controls="statement-content">${label}</button>`).join('')}</div><div id="statement-content" role="tabpanel" aria-labelledby="tab-${state.modelTab}">${statementHTML(result,state.modelTab,build)}</div><div class="panel-foot"><p>“—” 表示输出未提供该项，不代表零。所有数值以当前版本实际结果为准。</p><button class="button button-small" data-step="review">查看检查结果 →</button></div></section><div class="scenario-grid"><section class="panel"><div class="panel-head"><div><h2>调整一个情景</h2><p>情景值用于该驱动的全部适用月份；期初存量只调整期初。分月调整请回到建模假设。</p></div></div><form id="scenario-form"><div class="panel-body">${governanceHTML(result.assumption_governance,{compact:true,context:'当前查看的模型'})}<p class="field-hint">新情景使用当前已保存的假设重新生成，完成后请核对新版本的暂定记录。</p><label class="field">情景名称<input name="scenario_name" required placeholder="如：销量下行情景" maxlength="100"></label><details open class="spacer-top"><summary>修改已采用的输入</summary>${scenarioDrivers.length?scenarioDrivers.map(row=>`<div class="scenario-field"><label for="scenario-${esc(row.id)}">${esc(row.label || DRIVERS[row.id] || row.id)}<small>${row.multiplePeriods?'存在分期基准，请在建模假设查看':hasEffectiveOperatingMap(row)?'逐月最终值，请在建模假设查看':`当前基准 ${esc(row.value)} ${esc(row.unit || '')}`} </small>${operatingStageText(row)?`<span class="operating-stage">${esc(operatingStageText(row))}</span>`:''}</label><input id="scenario-${esc(row.id)}" name="scenario_${esc(row.id)}" data-driver="${esc(row.id)}" type="number" step="any" placeholder="沿用基准" aria-label="${esc(row.label || row.id)} 情景输入"></div>`).join(''):'<p class="field-hint">尚无已采用的数值输入，请先核对建模假设。</p>'}</details></div><div class="panel-foot"><button class="button" type="button" data-action="restore-base" data-mutation ${state.job?'disabled':''}>重新计算基准</button><button class="button button-primary" type="submit" ${state.job?'disabled':''}>生成情景版本</button></div></form></section><section class="panel"><div class="panel-head"><div><h2>版本对比</h2><p>比较已生成的模型，判断调整影响。</p></div></div><div class="panel-body"><label class="field">选择比较版本<select id="compare-select">${versionOptions(state.compareId,'选择其他版本')}</select></label><div class="spacer-top">${comparisonHTML(build)}</div><div class="section-label">本版模型范围</div>${result.coverage?`<div class="small muted">${coverageHTML(result.coverage)}</div>`:'<p class="field-hint">服务尚未提供详细覆盖范围。</p>'}${array(result.gaps).length?gapsHTML(result.gaps):''}</div></section></div>${latticeHTML()}<details class="spacer-top"><summary>查看当前模型的输出与来源记录</summary><pre class="raw-json">${esc(JSON.stringify({assumption_governance:result.assumption_governance,lineage:result.lineage,engine:result.engine,summary:result.summary},null,2))}</pre></details>`;
}
function latticeOf() {
  const p=state.project || {};const stored=state.latticeResults.get(p.id) || p.lattice || p.last_lattice || array(p.lattices).at(-1);
  return stored?.lattice?{...stored.lattice,source_revision:first(stored.source_revision,stored.revision,stored.lattice.source_revision)}:stored?.result?.lattice || stored?.result || stored;
}
function latticeHTML() {
  const drivers=allAssumptions().filter(row=>row.status==='confirmed' && (number(row.value)!==null || hasEffectiveOperatingMap(row)));const choices=Object.fromEntries(drivers.map(row=>[row.id,row.label || DRIVERS[row.id] || row.id]));const lattice=latticeOf();const cases=array(lattice?.cases);
  return `<section class="panel spacer-top"><div class="panel-head"><div><h2>有限情景网格</h2><p>指定一到两个驱动，逐一计算你给定的取值组合。仅比较这些情景，不代表全局最优。</p></div><span class="badge neutral">最多 2 个维度</span></div><form id="lattice-form"><div class="panel-body"><div class="form-grid">${[1,2].map(index=>`<label class="field">维度 ${index}${index===2?'（可选）':''}<select name="lattice_axis_${index}" ${index===1?'required':''}>${options(choices,'')}</select></label><label class="field">维度 ${index} 的测试值<input name="lattice_values_${index}" ${index===1?'required':''} placeholder="填写不超过 5 个数值，用逗号分隔" autocomplete="off"></label>`).join('')}</div><p class="field-hint">填写实际输入值；比例用小数，金额及数量沿用对应假设单位。系统不会替你设定合理范围。</p></div><div class="panel-foot"><p>比较目标：净利润；本表仅显示内存计算约束，不代表各情景已完成原生 Excel 资金检查。生成所选情景后查看该版资金报告。</p><button type="submit" class="button button-primary" ${state.job?'disabled':''}>计算这些情景组合</button></div></form>${lattice?`<div class="panel-body"><div class="notice ${lattice.source_revision!==undefined&&lattice.source_revision!==state.project.revision?'warning':''}">实际返回 ${cases.length} 个情景。${lattice.source_revision!==undefined?`资料版本 ${esc(lattice.source_revision)}。`:''}${esc(typeof lattice.scope==='string'?lattice.scope:'结论限于本次列出的测试输入与已实现的模型范围。')}</div>${governanceHTML(lattice.assumption_governance,{compact:true,context:'本次已保存网格'})}${cases.length?`<div class="table-scroll" tabindex="0" aria-label="情景网格结果"><table><thead><tr><th>情景输入</th><th class="numeric">净利润</th><th class="numeric">现金缺口</th><th>可行性与事项</th><th>后续操作</th></tr></thead><tbody>${cases.map((item,index)=>`<tr><td>${Object.entries(item.overrides || {}).map(([key,value])=>`<span class="inline-tag">${esc(DRIVERS[key] || key)} ${esc(value)}</span>`).join('<br>')}</td><td class="numeric">${fmt(first(item.summary?.net_income,item.summary?.net_profit,item.summary?.total_net_profit))}</td><td class="numeric">${fmt(first(item.summary?.funding_gap,item.summary?.max_funding_gap))}</td><td>${item.feasible===true?'<span class="badge">本次内存约束内满足</span>':item.feasible===false?'<span class="badge warning">不满足约束</span>':'<span class="badge neutral">未判定</span>'}${governanceHTML(item.assumption_governance || lattice.assumption_governance,{compact:true,context:'此网格情景'})}${item.error?`<p class="field-hint warning">${esc(typeof item.error==='string'?item.error:item.error.message)}</p>`:''}${array(item.failures).length?`<p class="field-hint warning">${esc(item.failures.map(failure=>typeof failure==='string'?failure:failure.label || failure.message || failure.id).join('；'))}</p>`:''}</td><td><button type="button" class="button button-small" data-action="apply-grid-case" data-case-index="${index}" data-mutation ${!item.overrides || state.job?'disabled':''}>生成此情景</button></td></tr>`).join('')}</tbody></table></div>`:'<p class="field-hint">本次任务未返回可显示的情景明细。</p>'}</div>`:''}</section>`;
}
function coverageHTML(coverage) {
  if(typeof coverage==='string')return esc(coverage);
  const methods={volume_asp:'产品销量 × 平均售价',service_units_rate:'服务量 × 服务单价',contract_recognition:'合同余额及收入确认比例',growth:'总额收入及明确增长假设'};
  const modules={entity_consolidation:'多主体合并及抵销',FX_translation:'外币折算',statutory_VAT:'增值税明细',deferred_tax:'递延所得税',lease_ROU:'租赁与使用权资产',manufacturing_BOM_capacity:'物料及产能约束',payroll_roster:'人员及薪酬明细',detailed_asset_commissioning:'资产投产及折旧明细',project_contract_assets:'合同资产负债及进度认证'};
  return `<p><strong>收入结构：</strong>${esc(methods[coverage.revenue_method] || '按已确认的业务结构生成')}</p><p><strong>期间与范围：</strong>按月预测；采用一份单体或已完成抵销的合并 TB。</p><p><strong>历史现金流：</strong>${coverage.historical_cfs==='not_reconstructed'?'未重建，相关资料缺口单独保留。':'以本版实际披露范围为准。'}</p><p><strong>已采用政策：</strong>${POLICIES.filter(([key])=>coverage.policies?.[key]).map(([, ,title])=>esc(title)).join('；')}。</p>${array(coverage.not_implemented).length?`<p><strong>尚未纳入专项计算：</strong>${coverage.not_implemented.map(key=>esc(modules[key] || key)).join('、')}。</p>`:''}`;
}
function testsHTML(tests) {
  const labels={dso_up:'应收周转放缓',dpo_up:'应付周转延长',cash_shortfall_no_plug:'现金短缺不使用配平项',repayment_cash_stock_cap:'还款受现金与借款余额约束',missing_driver_rejected:'缺失关键假设应被拦截',restore:'恢复基准结果'};
  const cases=array(tests.cases);
  return `${governanceHTML(tests.assumption_governance,{compact:true,context:'本次扰动检查'})}<div class="notice">${cases.length?`已返回 ${cases.length} 项测试记录。`:'已收到测试任务结果。'}这是内存模型测试证据，不代表各情景已经完成原生 Excel 资金检查；导出新情景版本后查看其独立资金报告。独立复核仍待复核人完成。</div>${cases.length?`<div class="table-scroll"><table><thead><tr><th>测试</th><th>实际结果与原因</th><th>预期行为</th></tr></thead><tbody>${cases.map(item=>`<tr><td>${esc(labels[item.id] || item.label || item.id)}${governanceHTML(item.assumption_governance,{compact:true,context:'此项检查'})}</td><td>${esc(item.reason || (typeof item.error==='string'?item.error:item.error?.message) || '未附文字说明')}${item.summary?`<div class="field-hint">期末现金 ${fmt(first(item.summary.closing_cash,item.summary.ending_cash))} · 现金缺口 ${fmt(item.summary.funding_gap)}</div>`:''}</td><td>${item.passed===true?'<span class="badge">符合预期</span>':item.passed===false?'<span class="badge danger">不符合预期</span>':'<span class="badge neutral">未判定</span>'}</td></tr>`).join('')}</tbody></table></div>`:''}<details class="spacer-top"><summary>查看完整测试记录</summary><pre class="raw-json">${esc(JSON.stringify(tests,null,2))}</pre></details>`;
}
function reviewHTML() {
  const p=state.project;const build=selectedBuild();if(!build && state.buildId)return sectionHead('review','先确认一个明确模型版本，再查看检查或交审。')+unavailableSelectionHTML();if(!build) return sectionHead('review','先生成模型，才能检查具体版本。')+`<section class="panel">${empty('还没有可检查的模型','每份检查和复核记录都需要对应一个具体模型版本。','<button class="button button-primary" data-step="model">进入模型页</button>')}</section>`;
  const result=resultOf(build);const checks=array(result.checks);const reviews=array(p.reviews).filter(review=>review.build_id===build.id);const lastReview=reviews.filter(review=>review.action==='submit'||review.action==='withdraw').at(-1);const submitted=lastReview?.action==='submit' && lastReview?.status!=='withdrawn' && lastReview?.status!=='invalidated';const testReport=array(p.test_reports).filter(report=>report.build_id===build.id).at(-1);const tests=testReport?.tests || build.tests || result.tests;
  return sectionHead('review','计算检查、独立复核和对外授权分别记录。此处交审不会自动产生复核通过结论。',`<button class="button" data-action="tests" data-mutation ${state.job?'disabled':''}>运行扰动与情景检查</button>`)+`<div class="model-bar"><div class="button-row"><label for="build-select" class="small muted">检查版本</label><select id="build-select" class="version-select">${versionOptions(build.id)}</select></div><a class="button button-small" href="/api/builds/${encodeURIComponent(build.id)}/download?kind=xlsx">下载复核用 Excel ↓</a></div>${governanceHTML(result.assumption_governance,{context:'当前检查的模型'})}${liquiditySlot(false)}<div class="notice warning">下载文件为复核用工作版本。模型计算检查通过，不等于来源事实、管理层假设或独立复核已经完成。</div><div class="split"><section class="panel"><div class="panel-head"><div><h2>模型计算检查</h2><p>读取本版模型返回的实际检查记录。</p></div><span class="badge neutral">${checks.filter(check=>check.passed===true).length} / ${checks.length} 已通过</span></div>${checks.length?`<div class="table-scroll" tabindex="0" aria-label="模型检查"><table class="check-table"><thead><tr><th>检查项目</th><th>期间 / 类型</th><th class="numeric">差额或数值</th><th>结果</th></tr></thead><tbody>${checks.map(check=>`<tr><td>${esc(check.label || check.id)}${check.message?`<div class="field-hint">${esc(check.message)}</div>`:''}</td><td><span class="small">${esc(check.period || '整体')}</span><div class="driver-unit">${esc(check.kind || '')}</div></td><td class="numeric">${fmt(check.value,4)}${check.tolerance!==undefined?`<div class="driver-unit">容差 ${esc(check.tolerance)}</div>`:''}</td><td>${check.passed===true?'<span class="badge">通过</span>':check.passed===false?'<span class="badge danger">未通过</span>':'<span class="badge neutral">未判定</span>'}</td></tr>`).join('')}</tbody></table></div>`:empty('没有返回检查记录','当前模型没有可展示的检查证据，不能据此判断计算已经通过。')}</section><section class="panel"><div class="panel-head"><h2>交审与责任边界</h2></div><div class="panel-body"><div class="audit-state"><span class="audit-glyph" aria-hidden="true">${submitted?'⌁':'—'}</span><div><h3>${submitted?'本版已提交复核':'尚未完成独立复核'}</h3><p>${submitted?'已保存本版交审记录。等待复核人就同一版本给出意见。':'可以冻结并提交当前版本，附上需要重点核对的事项。'}</p></div></div>${buildRevision(build)!==p.revision?'<p class="notice warning">交审须使用当前资料版本生成的模型。当前所选旧版可继续查看，不能作为当前资料版本交审。</p>':''}<form id="review-form"><label class="field">提交说明或复核事项<textarea name="review_comment" required rows="4" placeholder="说明本版假设范围、待公司确认事项，以及希望复核人重点检查的内容。"></textarea></label><div class="button-row spacer-top"><button class="button button-primary" type="submit" ${buildRevision(build)!==p.revision?'disabled':''}>${submitted?'补充交审说明':'冻结本版并提交复核'}</button>${submitted?`<button class="button" type="button" data-action="withdraw-review" data-mutation ${buildRevision(build)!==p.revision?'disabled':''}>撤回本版交审</button>`:''}</div></form><hr class="divider"><p class="field-hint">管理层确认经营假设；会计师确认其职责范围内的会计事项；银行团队完成自身复核。系统不代替任何一方签署结论。</p><p class="field-hint">正式对外授权尚未开放自动操作。当前功能仅保存交审和说明。</p></div></section></div><section class="panel spacer-top"><div class="panel-head"><h2>扰动与情景检查记录</h2></div><div class="panel-body">${tests?`${testsHTML(tests)}`:empty('尚无测试记录','运行检查后显示实际返回结果。尚未运行不代表模型已通过测试。')}${array(result.gaps).length?gapsHTML(result.gaps):''}</div></section><section class="panel"><div class="panel-head"><h2>本版交审记录</h2></div><div class="panel-body">${reviews.length?`<ol class="timeline">${reviews.slice().reverse().map(review=>`<li><strong>${esc({submit:'提交复核',withdraw:'撤回交审',comment:'补充说明'}[review.action] || STATUS[review.status] || '复核记录')}</strong><time>${stamp(review.at || review.created_at || review.timestamp)}</time><p>${esc(review.comment || review.message || '')}</p>${review.reviewer?`<span class="muted small">复核人：${esc(review.reviewer)}</span>`:''}</li>`).join('')}</ol>`:'<p class="field-hint">当前版本尚无交审记录。</p>'}</div></section>`;
}
async function loadProject(id,{renderNow=true}={}) {
  liquidity.clear();
  const seq=++state.loadSeq;const data=await api(`/api/projects/${encodeURIComponent(id)}`);if(seq!==state.loadSeq) return;
  state.project=data.project;state.sheet='';state.connected=true;try{localStorage.setItem('model-studio-project',id);}catch{}
  const index=state.projects.findIndex(project=>project.id===id);if(index<0)state.projects.push(data.project);else state.projects[index]={...state.projects[index],...data.project};
  if(renderNow)render();
}
function adoptProject(data,message,{clear=true}={}) {
  if(!data.project)throw new Error('服务未返回保存后的项目，请刷新确认保存结果。');
  liquidity.clear();if(clear)clearDraft();state.project=data.project;const index=state.projects.findIndex(project=>project.id===data.project.id);if(index<0)state.projects.push(data.project);else state.projects[index]=data.project;
  try{localStorage.setItem('model-studio-project',data.project.id);}catch{}
  render();if(message)toast(message);
}
async function postProject(endpoint,payload={}) {
  const revision=['normalize','mapping','assumptions'].includes(endpoint)?first(state.draftRevisions.get(draftKey()),state.project.revision):state.project.revision;
  if(endpoint==='assumptions')payload.assumptions?.forEach((row,index)=>{
    row.unit=$(`[name="assumption_unit_${index}"]`)?.value.trim() ?? row.unit;
    row.adoption_note=$(`[name="assumption_note_${index}"]`)?.value.trim() ?? row.adoption_note;
    row.rate_basis=$(`[name="rate_basis_${index}"]`)?.value || row.rate_basis;
    if(['全预测期','预测期每月','全部预测月份'].includes(row.period))row.period='forecast';
    if(row.required_placeholder && row.status==='confirmed' && !row.adoption_note)throw new Error(`请填写“${row.label}”的采用依据。`);
    if(row.required_placeholder && row.adoption_note)row.basis=row.adoption_note;
    const operating=operatingControls.get(index)?.collect(row) || row;
    payload.assumptions[index]=provisionalControls.get(index)?.collect(operating) || operating;
  });
  return api(`/api/projects/${encodeURIComponent(state.project.id)}/${endpoint}`,{method:'POST',body:{revision,...payload}});
}
function showSource(id,sheet) {
  const source=array(state.project?.sources).find(item=>item.id===id);if(!source){showError(new Error('当前资料版本中没有找到该来源。'));return;}
  const selectedSheet=tbSheetName(source,sheet ?? tbWorkbench()?.sheets[source.id]);
  $('#evidence-title').textContent=(source.name || '来源原文')+(source.role==='tb'?` · ${selectedSheet || '当前数据表'}`:'');
  $('#evidence-body').innerHTML=`<p class="source-hash">${source.sha256?`SHA-256 · ${esc(source.sha256)}`:'来源指纹未提供'}</p>${source.role==='tb'?sourceTable(sheetPreview(source,selectedSheet),100,true):`<div class="evidence-content">${esc(source.text || source.preview?.text || '来源未提供可显示的文字。请核对原始文件。')}</div>`}`;
  $('#evidence-dialog').showModal();
}
async function beginJob(endpoint,payload,label) {
  if(state.job)throw new Error('已有任务正在执行，请等待结果后再提交新任务。');
  if(fundingModalDirty || fundingEditor.hasUnsaved())throw new Error('融资窗口仍有未返回表格的修改，请先处理并保存。');
  if(tbHasUnsaved() || ['sources','mapping','assumptions'].some(step=>state.dirtySteps.has(`${state.project.id}:${step}`)))throw new Error('资料、科目映射或建模假设有尚未保存的输入。请先回到对应页面保存，再生成或检查模型。');
  rememberDraft();const projectId=state.project.id;const data=await postProject(endpoint,payload);if(!data.job_id)throw new Error('服务未返回任务编号，请刷新项目确认状态。');
  state.job={id:data.job_id,projectId,label,status:'queued',revision:state.project.revision};try{localStorage.setItem('model-studio-job',JSON.stringify(state.job));}catch{}renderJob();toast(`${label}已提交，结果以任务完成记录为准。`);pollJob();
}
function renderJob() {
  const banner=$('#job-banner');if(!state.job){banner.hidden=true;return;}
  banner.hidden=false;banner.innerHTML=`<span class="spinner" aria-hidden="true"></span><strong>${esc(state.job.label)}</strong><span>${esc(state.job.message || STATUS[state.job.status] || state.job.status)}</span><span class="job-detail">任务 ${esc(state.job.id.slice(0,8))} · 可继续查看已保存版本</span>`;
}
async function pollJob() {
  const job=state.job;if(!job)return;
  try {
    const data=await api(`/api/jobs/${encodeURIComponent(job.id)}`);if(state.job?.id!==job.id)return;
    const actual=data.job || {};Object.assign(state.job,{status:actual.status,message:actual.message || actual.progress?.message});renderJob();
    if(actual.status==='completed') {
      state.job=null;try{localStorage.removeItem('model-studio-job');}catch{}renderJob();
      if(actual.result?.lattice)state.latticeResults.set(job.projectId,{...actual.result.lattice,source_revision:job.revision});
      if(state.project?.id===job.projectId) {rememberDraft();await loadProject(job.projectId,{renderNow:false});if(actual.result?.build_id)state.buildId=actual.result.build_id;if(job.label.includes('检查')){const build=array(state.project.builds).find(item=>item.id===state.buildId)||latestBuild();if(build && !build.tests)build.tests=actual.result;}render();}
      const finished=array(state.project?.builds).find(item=>item.id===actual.result?.build_id),funds=actual.result?.liquidity || finished?.liquidity;
      toast(actual.result?.build_id && !job.label.includes('检查')?(funds?.effective_gate==='BLOCKED'?'模型已生成；资金检查仍有待处理事项，请核对本版报告。':'模型已生成；资金检查状态及待复核事项请以本版报告为准。'):`${job.label}任务已完成，请检查实际输出。`);return;
    }
    if(actual.status==='failed') {state.job=null;try{localStorage.removeItem('model-studio-job');}catch{}renderJob();const message=typeof actual.error==='string'?actual.error:actual.error?.message;const error=new Error(message || '任务未完成，请核对输入资料和确认状态。');error.details=actual.error?.details;showError(error);if(state.project?.id===job.projectId){rememberDraft();await loadProject(job.projectId);}return;}
    if(!['queued','running'].includes(actual.status))throw new Error('任务状态无法识别，请刷新项目后核对。');
    setTimeout(pollJob,1400);
  } catch(error) {if([403,404].includes(error.status)){state.job=null;try{localStorage.removeItem('model-studio-job');}catch{}renderJob();showError(error);return;}if(state.job?.id===job.id){state.job.message='连接暂时中断，正在重试';renderJob();setTimeout(pollJob,4000);}showError(error);}
}
function getFormValues(form) {return Object.fromEntries(new FormData(form));}
function hasUnsavedFile() {return $$('#workspace input[type=file]').some(input=>input.files.length);}
function navigate(step,{focusWorkspace=true}={}) {
  if(!auditMode&&ROOMS.some(r=>r[0]===step)&&state.project&&state.step==='harness'){openRoom(step);return;}
  traceViewer.close();
  if(hasUnsavedFile() && !window.confirm('已选文件尚未上传。切换页面会清除文件选择，是否继续？'))return;
  rememberDraft();state.step=step;history.replaceState(null,'','#'+step);clearError();render();if(focusWorkspace){$('#workspace').focus({preventScroll:true});window.scrollTo({top:0,behavior:'auto'});}
}
function resetProvisionalAcknowledgement(target) {
  if(!target.closest('#assumption-form') || target.name?.startsWith('accept_provisional_'))return;
  const marker=target.closest('tr')?.querySelector('[data-provisional-index]');
  if(marker)provisionalControls.get(Number(marker.dataset.provisionalIndex))?.resetAcceptance();
  else provisionalControls.forEach(control=>control.resetAcceptance());
}
document.addEventListener('input',event=>{
  if(event.target.closest('[data-harness]'))return;
  resetProvisionalAcknowledgement(event.target);
  if(event.target.matches('[data-tb-source],[data-tb-sheet],#sheet-select') || event.target.closest('#tb-bundle-form'))return;
  if(event.target.closest('#normalize-form')){tbMarkInput(event.target);return;}
  if(event.target.closest('#workspace form'))markDirty();
});
document.addEventListener('change',event=>{
  if(event.target.closest('[data-harness]'))return;
  resetProvisionalAcknowledgement(event.target);
  if(event.target.matches('[data-tb-source]')){if(!state.busy)try{tbSelect(event.target.value);}catch(error){event.target.value=tbSource()?.id || '';showError(error);}return;}
  if(event.target.matches('#sheet-select,[data-tb-sheet]')){if(!state.busy)try{tbSelect(tbSource().id,event.target.value);}catch(error){event.target.value=tbSheetName(tbSource(),tbWorkbench().sheets[tbSource()?.id]);showError(error);}return;}
  if(event.target.closest('#tb-bundle-form'))return;
  if(event.target.closest('#normalize-form')){
    tbMarkInput(event.target);
    if(event.target.id==='tb-header-row'){
      const fields=tbWorkbench().drafts.get(tbCurrentScope());for(const key of Object.keys(fields))if(key.startsWith('col_'))fields[key]='';
      render();$('#tb-header-row')?.focus();
    }
    return;
  }
  if(event.target.closest('#workspace form'))markDirty();
  if(event.target.dataset.mapIndex!==undefined){const box=$(`[name="mapping_confirmed_${event.target.dataset.mapIndex}"]`);if(box)box.checked=false;}
  if(event.target.id==='build-select'){rememberDraft();traceViewer.close();state.buildId=event.target.value;render();}
  if(event.target.id==='compare-select'){rememberDraft();state.compareId=event.target.value;render();}
});
document.addEventListener('click',event=>{
  const liquidityTrace=event.target.closest('[data-liquidity-trace]');if(liquidityTrace){try{const saved=liquidity.state();if(saved.phase!=='ready' || saved.context?.build.id!==liquidityTrace.dataset.liquidityBuild || selectedBuild()?.id!==saved.context.build.id || state.project?.id!==saved.context.projectId)throw new Error('所选模型已变化，请重新选择本版数字。');const entry=liquidityTraceTarget(saved.report,saved.context,liquidityTrace.dataset.liquidityPeriod,liquidityTrace.dataset.liquidityField);if(!entry.nodeId)throw new Error(entry.reason);traceViewer.open({...entry,returnFocus:liquidityTrace});}catch(error){showError(error);}return;}
  if(event.target.closest('[data-liquidity-retry]')){liquidity.refresh();return;}
  if(event.target.closest('[data-liquidity-full]')){navigate('review');$('#liquidity-report')?.focus({preventScroll:true});$('#liquidity-report')?.scrollIntoView({block:'start'});return;}
  const inputAction=event.target.closest('[data-liquidity-input]');if(inputAction){try{openLiquidityInput(inputAction.dataset.liquidityInput,inputAction.dataset.liquidityBuild);}catch(error){showError(error);}return;}
  if(event.target.closest('[data-liquidity-return]')){if(liquidityFollowup?.projectId===state.project?.id){state.buildId=liquidityFollowup.buildId;liquidityFollowup=null;navigate('review');$('#liquidity-report')?.focus({preventScroll:true});}return;}
  const trace=event.target.closest('[data-trace-entry]');if(trace){const entry=traceEntries.get(trace.dataset.traceEntry);if(entry && entry.buildId===trace.dataset.traceBuild)traceViewer.open({...entry,returnFocus:trace});return;}
  const close=event.target.closest('[data-close-dialog]');if(close){document.getElementById(close.dataset.closeDialog).close();return;}
  const source=event.target.closest('button[data-source],a[data-source]');if(source){showSource(source.dataset.source,source.dataset.sourceSheet);return;}
  const drawerButton=event.target.closest('[data-open-room]');if(drawerButton){openRoom(drawerButton.dataset.openRoom);return;}
  const step=event.target.closest('[data-step]');if(step){navigate(step.dataset.step);return;}
  const tab=event.target.closest('[data-model-tab]');if(tab){rememberDraft();state.modelTab=tab.dataset.modelTab;render();return;}
  const action=event.target.closest('[data-action]');if(!action)return;
  const name=action.dataset.action;
  if(name==='funding-edit') {
    if(state.busy)return;
    rememberDraft();const rows=allAssumptions().map((row,index)=>({...row,value:number($(`[name="assumption_value_${index}"]`)?.value)})).filter(row=>legacyFundingDrivers.has(row.id));
    fundingEditor.open({projectId:state.project.id,revision:first(state.draftRevisions.get(draftKey()),state.project.revision),plan:fundingPlan(),currency:state.project.currency,unit:state.project.unit,sources:state.project.sources,legacyRows:rows}).catch(showError);return;
  }
  if(name.startsWith('tb-')){if(!state.busy)try{clearError();tbQueueAction(name,action);}catch(error){showError(error);}return;}
  if(name==='cash-schedule'){
    const index=Number(action.dataset.assumptionIndex);const row=clone(allAssumptions()[index]);
    row.value=number($(`[name="assumption_value_${index}"]`)?.value);
    row.unit=$(`[name="assumption_unit_${index}"]`)?.value || row.unit;
    row.status=$(`[name="assumption_status_${index}"]`)?.value || row.status;
    activeCashRow={projectId:state.project.id,key:cashKey(row,index),index};
    cashEditor.open({projectId:state.project.id,row}).catch(showError);return;
  }
  if(name==='new-project'){rememberDraft();$('#project-dialog').showModal();return;}
  if(name==='discard-draft'){clearDraft();state.extraAssumptions.delete(state.project.id);render();return;}
  if(name==='confirm-mappings'){$$('#mapping-form select[data-map-index]').forEach(select=>{const checkbox=$(`[name="mapping_confirmed_${select.dataset.mapIndex}"]`);checkbox.checked=select.value!=='unmapped';});markDirty();toast('已勾选当前已分类科目，点击保存后生效。');return;}
  perform(async()=>{
    if(name==='sample'){rememberDraft();const data=await api('/api/sample',{method:'POST',body:{}});state.step=auditMode?'sources':'harness';state.buildId='';state.compareId='';adoptProject(data,'教学样本已建立，内容均为合成资料。');}
    if(name==='analyze-local'){if(hasUnsavedFile() || $('[name=minutes_text]')?.value.trim())throw new Error('请先保存或上传当前页面的资料，再提取已保存的纪要。');const data=await postProject('analyze',{mode:'local',consent:false});adoptProject(data,'本机提取结果已留存，可交给主 agent 结合原文判断。');}
    if(name==='analyze-ai'){if(hasUnsavedFile() || $('[name=minutes_text]')?.value.trim())throw new Error('请先保存纪要原文，再确认发送当前版本。');if(!$('#ai-consent')?.checked)throw new Error('请先核对当前资料版本与处理服务，并勾选发送同意。');if(!state.capabilities.ai?.route && !state.capabilities.ai_route)throw new Error('未提供明确处理服务，不能发送资料。');const data=await postProject('analyze',{mode:'ai',consent:true,consent_revision:state.project.revision,consent_route:state.capabilities.ai?.route || state.capabilities.ai_route});adoptProject(data,'已收到候选假设，请核对原文和数值。');}
    if(name==='build')await beginJob('build',{},'新模型生成');
    if(name==='apply-grid-case'){const lattice=latticeOf();const item=array(lattice?.cases)[Number(action.dataset.caseIndex)];if(!item?.overrides)throw new Error('未找到该网格情景的实际输入，请重新运行网格。');await beginJob('scenario',{name:`网格情景 ${Number(action.dataset.caseIndex)+1}`,overrides:item.overrides},'网格情景模型生成');}
    if(name==='restore-base')await beginJob('scenario',{name:'基准复算',overrides:{}},'基准复算');
    if(name==='tests'){const build=selectedBuild();await beginJob('tests',{build_id:build.id},'扰动与情景检查');}
    if(name==='withdraw-review'){const comment=$('[name=review_comment]')?.value || '撤回本版交审，继续核对。';adoptProject(await postProject('review',{build_id:selectedBuild().id,action:'withdraw',comment}),'已保存本版撤回记录。');}
  });
});
document.addEventListener('submit',event=>{
  const form=event.target;if(!(form instanceof HTMLFormElement))return;event.preventDefault();
  if(!form.reportValidity())return;
  if(form.id==='add-assumption') {
    const values=getFormValues(form);
    if(values.new_source && !values.new_quote.trim()){showError(new Error('已关联来源时，请填写该来源中的逐字引文。'));return;}
    if(allAssumptions().some(row=>row.required_placeholder && row.id===values.new_driver)){showError(new Error('上方已有此驱动的待补充行，请在该行填写并保存；本表输入仍保留，避免覆盖尚未保存的候选草稿。'));return;}
    markDirty();rememberDraft();const extra=array(state.extraAssumptions.get(state.project.id));extra.push({candidate_id:crypto.randomUUID(),id:values.new_driver,label:DRIVERS[values.new_driver],value:number(values.new_value),proposed_value:number(values.new_value),unit:values.new_unit,period:values.new_period,source_quote:values.new_quote,source_id:values.new_source,source_date:values.new_date,owner:'',status:number(values.new_value)===null?'missing':'proposed',basis:'用户补充，待采用',...(OPERATING_DRIVERS.has(values.new_driver)?{operating_binding_required:true}:{})});state.extraAssumptions.set(state.project.id,extra);const draft=state.drafts.get(draftKey());Object.keys(draft || {}).filter(key=>key.startsWith('new_')).forEach(key=>delete draft[key]);render();toast('已加入候选假设，请确认责任和状态后保存。');return;
  }
  perform(async()=>{
    const values=getFormValues(form);
    if(form.id==='project-form') {try{const data=await api('/api/projects',{method:'POST',body:{...values,forecast_months:Number(values.forecast_months),frequency:'monthly'}});state.step=auditMode?'sources':'harness';state.buildId='';state.compareId='';adoptProject(data,'项目已创建。',{clear:false});$('#project-dialog').close();form.reset();}catch(error){const box=$('#project-form-error');box.textContent=error.message;box.hidden=false;throw error;}return;}
    if(form.id==='upload-tb'||form.id==='upload-minutes'){rememberDraft();const body=new FormData(form);body.append('role',form.id==='upload-tb'?'tb':'minutes');body.append('revision',String(state.project.revision));const hasPaste=Boolean(state.drafts.get(draftKey())?.minutes_text?.trim());adoptProject(await api(`/api/projects/${encodeURIComponent(state.project.id)}/sources`,{method:'POST',body}),'资料已保存。',{clear:!hasPaste});return;}
    if(form.id==='paste-minutes'){const text=values.minutes_text.trim();if(!text)throw new Error('请先粘贴纪要原文。');adoptProject(await postProject('minutes',{text}),'纪要原文已保存。');return;}
    if(form.id==='normalize-form' || form.id==='tb-bundle-form'){await saveTB(form);return;}
    if(form.id==='mapping-form'){const rows=array(state.project.mapping).length?state.project.mapping:array(state.project.tb?.accounts);const mappings=rows.map((row,index)=>({account_code:row.account_code,line:values[`mapping_line_${index}`],confirmed:values[`mapping_confirmed_${index}`]==='on'}));adoptProject(await postProject('mapping',{mappings}),'科目映射已保存。');return;}
    if(form.id==='assumption-form'){const assumptions=allAssumptions().map((row,index)=>({...clone(row),proposed_value:first(row.proposed_value,row.value,null),value:number(values[`assumption_value_${index}`]),period:values[`assumption_period_${index}`],basis:row.basis,...(GROWTH_DRIVERS.has(row.id)?{growth_basis:values[`assumption_growth_basis_${index}`] || null}:{}),owner:values[`assumption_owner_${index}`],status:values[`assumption_status_${index}`]})).map((row,index)=>operatingControls.get(index)?.collect(row) || row);for(const row of assumptions){if(row.status==='confirmed' && row.value===null && !hasEffectiveOperatingMap(row))throw new Error(`“${row.label || row.id}”尚未填写有效数值，不能标为已采用建模。`);if(row.status==='confirmed' && !row.owner)throw new Error(`请明确“${row.label || row.id}”的责任归属。`);}const architecture={...state.project.architecture,revenue_method:values.arch_revenue_method,fiscal_year_start_month:Number(values.arch_fiscal_year_start_month)};POLICIES.forEach(([key,value])=>{if(values[`policy_${key}`]==='on')architecture[key]=value;else delete architecture[key];});architecture.policies_confirmed=POLICIES.every(([key])=>values[`policy_${key}`]==='on');const funding=fundingDrafts.get(state.project.id)?.plan;const effectiveFunding=funding ?? state.project.funding;if(effectiveFunding?.status==='adopted' && effectiveFunding.mode!=='aggregate' && assumptions.some(row=>legacyFundingDrivers.has(row.id) && row.status==='confirmed'))throw new Error('已采用逐笔或无借款口径，请将原四类总额融资假设明确保留为本模型不采用，避免重复计算。');const removed_facility_ids=funding?array(state.project.funding?.facilities).map(item=>item.facility_id).filter(id=>!array(funding.facilities).some(item=>item.facility_id===id)):[];const data=await postProject('assumptions',{assumptions,architecture,...(funding?{funding:clone(funding),removed_facility_ids}:{})});state.extraAssumptions.delete(state.project.id);adoptProject(data,'假设、融资安排与建模范围已保存。');return;}
    if(form.id==='lattice-form'){const axes={};for(const index of [1,2]){const id=values[`lattice_axis_${index}`];const text=values[`lattice_values_${index}`]?.trim();if(!id && !text)continue;if(!id || !text)throw new Error('每个网格维度都需要同时选择驱动和填写测试值。');if(axes[id])throw new Error('两个维度请选择不同驱动。');const tokens=text.replaceAll('，',',').split(',').map(value=>value.trim());if(tokens.some(value=>value==='' || number(value)===null))throw new Error('测试值请用逗号分隔的有限数字填写，不能包含空值。');if(tokens.length>5)throw new Error('每个维度最多测试 5 个明确数值。');axes[id]=[...new Set(tokens.map(Number))];}if(!Object.keys(axes).length)throw new Error('请至少填写一个测试维度。');await beginJob('lattice',{axes,objective:'net_income'},'有限情景网格');return;}
    if(form.id==='scenario-form'){const overrides={};$$('input[data-driver]',form).forEach(input=>{if(input.value!==''){const value=number(input.value);if(value!==null)overrides[input.dataset.driver]=value;}});if(!Object.keys(overrides).length)throw new Error('至少填写一项情景输入，或使用“重新计算基准”。');await beginJob('scenario',{name:values.scenario_name,overrides},'情景模型生成');return;}
    if(form.id==='review-form'){const build=selectedBuild();const reviews=array(state.project.reviews).filter(review=>review.build_id===build.id);const latestDecision=reviews.filter(review=>review.action==='submit'||review.action==='withdraw').at(-1);const submitted=latestDecision?.action==='submit' && latestDecision?.status!=='withdrawn' && latestDecision?.status!=='invalidated';adoptProject(await postProject('review',{build_id:build.id,action:submitted?'comment':'submit',comment:values.review_comment}),'交审记录已保存；独立复核结论仍待复核人提供。');}
  });
});
$('#new-project').addEventListener('click',()=>{rememberDraft();$('#project-form-error').hidden=true;$('#project-dialog').showModal();});
$('#refresh-project').addEventListener('click',()=>perform(async()=>{rememberDraft();if(state.project)await loadProject(state.project.id);else await bootstrap();toast('项目已刷新，未保存输入仍保留在当前页面。');}));
$('#project-select').addEventListener('change',event=>{const id=event.target.value;if(hasUnsavedFile() && !window.confirm('已选文件尚未上传。切换项目会清除文件选择，是否继续？')){event.target.value=state.project?.id || '';return;}rememberDraft();perform(async()=>{state.buildId='';state.compareId='';if(id)await loadProject(id);else{state.project=null;render();}});});
window.addEventListener('beforeunload',event=>{if(fundingModalDirty || fundingEditor.hasUnsaved() || state.dirtySteps.size || [...tbWorkspaces.values()].some(work=>work.changed || work.pending.size) || hasUnsavedFile()){event.preventDefault();event.returnValue='';}});
$('#audit-mode-toggle').addEventListener('click',()=>{
 rememberDraft();auditMode=!auditMode;try{sessionStorage.setItem('model-studio-audit-mode',String(auditMode));}catch{}
 render();$('#audit-mode-toggle').focus({preventScroll:true});
});
async function bootstrap() {
  try {const data=await api('/api/bootstrap');state.csrf=data.csrf;state.projects=array(data.projects);state.capabilities=data.capabilities || {};state.connected=true;let saved='';try{saved=localStorage.getItem('model-studio-project') || '';}catch{}const linked=new URLSearchParams(location.search).get('project');if(linked&&state.projects.some(project=>project.id===linked))saved=linked;if(saved && state.projects.some(project=>project.id===saved))await loadProject(saved);else render();try{const savedJob=JSON.parse(localStorage.getItem('model-studio-job') || 'null');if(savedJob?.id && savedJob?.projectId){state.job=savedJob;renderJob();pollJob();}}catch{}}
  catch(error){state.connected=false;render();showError(error);}
}
bootstrap();

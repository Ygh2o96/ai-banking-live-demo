import {provisionalSummaryHTML} from './provisional.js';

// Read-only projection of one immutable build's native report. No model edits or recalculation.
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list=value=>Array.isArray(value)?value:[];
const finite=value=>typeof value==='number' && Number.isFinite(value);
const hash=value=>typeof value==='string' && /^[a-f0-9]{64}$/.test(value);
const amount=value=>finite(value)?new Intl.NumberFormat('zh-CN',{maximumFractionDigits:2,minimumFractionDigits:2}).format(value):'—';
const count=value=>Number.isSafeInteger(value) && value>=0;
const text=value=>typeof value==='string' && value.trim().length>0;
const object=value=>value!==null && typeof value==='object' && !Array.isArray(value);
const owns=(value,key)=>object(value) && Object.hasOwn(value,key);
const sameData=(left,right)=>left===right || (Array.isArray(left) && Array.isArray(right) && left.length===right.length && left.every((value,index)=>sameData(value,right[index]))) || (object(left) && object(right) && Object.keys(left).length===Object.keys(right).length && Object.keys(left).every(key=>owns(right,key) && sameData(left[key],right[key])));
const countAmount=value=>count(value)?new Intl.NumberFormat('zh-CN',{maximumFractionDigits:0}).format(value):'—';
const units={'1':'元','1000':'千元','10000':'万元','1000000':'百万元',yuan:'元',thousand:'千元',million:'百万元'};
const fields={opening_cash:'期初现金',cfo:'经营现金流',cfi:'投资现金流',cff:'融资现金流',fx:'汇率变动现金影响',ending_cash:'月末现金',bs_cash:'资产负债表现金',assets:'资产',liabilities:'负债',equity:'权益',cash_floor:'已采用现金底线',unmet_due_repayment:'未付合同到期款',overdue_facility:'逾期融资余额',facility_limit_excess:'超出融资上限',invalid_input_count:'无效输入数量',dso:'应收周转天数'};
const groups=[
  ['DIAGNOSE','核对来源、符号与时点','核对期初现金、币种、单位、限制、来源映射和现金桥。缺少控制时先补齐依据或模型控制。'],
  ['OPERATING','核对回款、库存与付款假设','需要可执行的客户、供应商及经营安排；不能任意释放营运资金。'],
  ['ASSET_LIQUIDITY','补充可动用资产资料','核对主体、币种、可用日期、限制、赎回条件和成本。尚无专项模块时，先补来源资料。'],
  ['DISCRETIONARY_OUTFLOWS','核对支出时点与变更权限','核对资本开支、股息等支出的约束和权限；已承诺或已宣派款项不能自动取消。'],
  ['EXTERNAL_FINANCE','补充或核对融资条款','核对承诺或暂定状态、金额、可用期、条件、成本及到期款；提款申请不等于实际可用资金。']
];
const groupNames=new Map(groups.map(([id,title])=>[id,title]));
const kindNames={observed_constraint:'已观察到的约束异常',missing_data:'资料或控制缺口',mapping_or_engine:'映射或计算证据问题',source_or_assumption:'来源或假设待核对'};
const modelOf=build=>build?.result?.forecast?build.result:build?.result?.model || build?.model || build?.result || {};
const revisionOf=build=>build?.source_revision ?? build?.revision;
const contextKey=context=>context?JSON.stringify([context.projectId,context.build.id,revisionOf(context.build),context.build.xlsx_sha256,context.build.spec_sha256,context.build.liquidity?.report_sha256,context.build.file_hashes?.['model.json'],context.build.file_hashes?.['project.json']]):'';
const identityError=()=>new Error('资金检查记录与所选模型版本不一致，已停止显示。请重试本版或重新选择版本。');
const inputCount=(report,field)=>report?.input_controls!==undefined && field==='invalid_input_count';
const fieldLabel=(report,field)=>inputCount(report,field)?'未通过的输入规则数':fields[field] || field;
const controlsClaimed=build=>{
  const model=modelOf(build);
  return owns(model,'input_controls') || owns(model.coverage,'editable_input_controls') || ['model-studio-core/1.7.0','model-studio-core/1.7.1'].includes(model.engine?.id) ||
    ['input_controls','input_control_formulas'].some(key=>owns(model.engine?.implementation_hashes,key)) ||
    ['studio/input_controls.py','input_control_formulas.mjs'].some(key=>owns(build.engine_stamp,key)) ||
    list(model.workbook_spec?.nodes).some(node=>node?.expr?.op==='input_control' || ['input_control','input_control_count'].includes(node?.kind));
};

// Compare the report projection with the selected immutable model, including its
// actual inventories. Report omission cannot turn a control-aware build into legacy.
function pinnedInputControls(report,context) {
  const model=modelOf(context.build),registry=model.input_controls,coverage=registry?.coverage,nodes=list(model.workbook_spec?.nodes);
  if(!object(registry) || registry.schema!=='model-input-controls/v1' || ![1,2].includes(registry.version) || !object(coverage) || !sameData(coverage,model.coverage?.editable_input_controls) || !['slots','rules','uncovered_rules','periods'].every(key=>Array.isArray(registry[key])) || !sameData(registry.periods,report.expected_periods) || !object(registry.period_membership) || !object(registry.count_node_ids) || !text(registry.count_semantics))throw identityError();
  const inputNodes=nodes.filter(node=>node.kind==='input'),ruleNodes=nodes.filter(node=>node.kind==='input_control');
  if(coverage.expected_input_count!==inputNodes.length || coverage.covered_input_count!==registry.slots.length || coverage.rule_count!==registry.rules.length || coverage.uncovered_rule_count!==registry.uncovered_rules.length || !registry.slots.length || !registry.rules.length || ruleNodes.length!==registry.rules.length)throw identityError();
  const uniqueBindings=(items,key,targets)=>items.every(item=>object(item) && text(item[key]) && targets.filter(node=>node.id===item[key]).length===1) && new Set(items.map(item=>item[key])).size===items.length;
  if(!uniqueBindings(registry.slots,'node_id',inputNodes) || !uniqueBindings(registry.rules,'node_id',ruleNodes) || registry.rules.some(rule=>!text(rule.id) || !Array.isArray(rule.periods) || !rule.periods.length || new Set(rule.periods).size!==rule.periods.length || rule.periods.some(period=>!registry.periods.includes(period))) || new Set(registry.rules.map(rule=>rule.id)).size!==registry.rules.length)throw identityError();
  if(registry.uncovered_rules.some(rule=>!object(rule) || !text(rule.kind) || !text(rule.reason)))throw identityError();
  const expected={schema:'model-input-controls-report/v1',...Object.fromEntries(['status','expected_input_count','covered_input_count','rule_count'].map(key=>[key,coverage[key]])),uncovered_rules:registry.uncovered_rules.map(rule=>({...rule,code:rule.kind,message:rule.reason})),count_semantics:registry.count_semantics,receipt_scope:'exact_generated_workbook_only'};
  if(!sameData(report.input_controls,expected) || !sameData(Object.keys(registry.count_node_ids).sort(),[...registry.periods].sort()) || !sameData(Object.keys(registry.period_membership).sort(),[...registry.periods].sort()))throw identityError();
  for(const period of registry.periods) {
    const membership=registry.rules.filter(rule=>rule.periods.includes(period)).map(rule=>rule.node_id),countNodes=nodes.filter(node=>node.id===registry.count_node_ids[period]);
    if(!sameData(registry.period_membership[period],membership) || countNodes.length!==1 || countNodes[0].kind!=='input_control_count')throw identityError();
  }
  return registry;
}

function validateInputControls(report,context) {
  const controls=report.input_controls;
  if(controls===undefined){if(controlsClaimed(context.build))throw identityError();return;}
  if(!controls || Array.isArray(controls) || controls.schema!=='model-input-controls-report/v1' || !['complete','partial'].includes(controls.status) || !['expected_input_count','covered_input_count','rule_count'].every(key=>count(controls[key])) || controls.covered_input_count>controls.expected_input_count || !Array.isArray(controls.uncovered_rules) || !text(controls.count_semantics) || controls.receipt_scope!=='exact_generated_workbook_only')throw identityError();
  if(controls.uncovered_rules.some(rule=>!rule || Array.isArray(rule) || !text(rule.code) || !text(rule.message)))throw identityError();
  const complete=controls.covered_input_count===controls.expected_input_count && controls.uncovered_rules.length===0;
  if((controls.status==='complete')!==complete)throw identityError();
  const registry=pinnedInputControls(report,context),missing=report.coverage.missing.filter(item=>item?.field==='invalid_input_count');
  if(!complete && (report.coverage.status==='complete' || report.effective_gate!=='BLOCKED' || report.mechanical_gate==='CHECKS_PASSED' || report.guard_exit_code===0 || missing.length!==1 || !sameData(missing[0].periods,report.expected_periods)))throw identityError();
  if(complete && missing.length)throw identityError();
  for(const row of report.periods) {
    const field=row.fields.invalid_input_count;
    if(!field)throw identityError();
    if(controls.status==='partial') {
      if(field.value!==null || field.trace?.status==='available' || !row.missing_fields.includes('invalid_input_count'))throw identityError();
    } else if(report.native_status==='verified') {
      if(!count(field.value) || field.value>registry.period_membership[row.id].length || row.missing_fields.includes('invalid_input_count') || (field.value>0 && report.effective_gate==='CHECKS_PASSED') || liquidityTraceTarget(report,context,row.id,'invalid_input_count').nodeId!==registry.count_node_ids[row.id])throw identityError();
    }
  }
}

export function validateLiquidityResponse(response,context) {
  const report=response?.liquidity,b=report?.build,build=context?.build;
  if(!build || report?.schema!=='model-studio-liquidity-report/v1' || !b || b.id!==build.id || b.project_id!==context.projectId || b.source_revision!==revisionOf(build))throw identityError();
  if(build.project_id && build.project_id!==context.projectId)throw identityError();
  if(report.availability==='legacy_unavailable') {
    if(build.liquidity || build.liquidity_schema || controlsClaimed(build) || response.report_sha256!==null || report.input_controls!==undefined)throw identityError();
    return report;
  }
  if(report.availability!=='available' || !hash(response.report_sha256) || !['spec_sha256','xlsx_sha256','project_sha256','model_json_sha256'].every(key=>hash(b[key])))throw identityError();
  for(const [expected,actual] of [[build.xlsx_sha256,b.xlsx_sha256],[build.spec_sha256,b.spec_sha256],[build.file_hashes?.['project.json'],b.project_sha256],[build.file_hashes?.['model.json'],b.model_json_sha256],[build.liquidity?.report_sha256,response.report_sha256]])if(expected!==undefined && expected!==actual)throw identityError();
  const model=modelOf(build);
  if((model.currency!==undefined && model.currency!==report.currency) || (model.unit!==undefined && String(model.unit)!==String(report.unit)))throw identityError();
  if(typeof report.currency!=='string' || !report.currency || !['string','number'].includes(typeof report.unit) || !finite(report.unit_scale) || report.unit_scale<=0)throw identityError();
  if(!['verified','not_established'].includes(report.native_status) || !['BLOCKED','CHECKS_PASSED'].includes(report.effective_gate) || !['complete','partial','not_evaluable'].includes(report.coverage?.status) || !['breach_observed','no_breach_in_checked_values','not_evaluable'].includes(report.observed_constraints))throw identityError();
  if(report.effective_gate==='CHECKS_PASSED' && (report.adapter_status!=='verified' || report.native_status!=='verified' || report.coverage.status!=='complete' || report.mechanical_gate!=='CHECKS_PASSED' || report.guard_exit_code!==0 || report.observed_constraints!=='no_breach_in_checked_values'))throw identityError();
  if(!Array.isArray(report.expected_periods) || !Array.isArray(report.periods) || !Array.isArray(report.issues) || !Array.isArray(report.coverage.missing))throw identityError();
  const axis=report.expected_periods;
  if(new Set(axis).size!==axis.length || !axis.every(period=>typeof period==='string' && /^\d{4}-\d{2}$/.test(period)) || report.periods.length!==axis.length || report.periods.some((row,index)=>row.id!==axis[index]))throw identityError();
  const modelAxis=list(model.forecast).map(row=>row.period || row.month);
  if(modelAxis.length && (modelAxis.length!==axis.length || modelAxis.some((period,index)=>period!==axis[index])))throw identityError();
  for(const row of report.periods) {
    if(!row.fields || !Array.isArray(row.missing_fields) || !Array.isArray(row.observed_codes))throw identityError();
    for(const field of [row.ending_cash,row.cash_floor,...Object.values(row.fields)]) {
      if(!field || (field.value!==null && !finite(field.value)) || (report.native_status!=='verified' && field.value!==null))throw identityError();
    }
    if(!row.shortfall || (row.shortfall.value!==null && !finite(row.shortfall.value)) || (report.native_status!=='verified' && row.shortfall.value!==null))throw identityError();
    if(row.ending_cash.value!==row.fields.ending_cash?.value || row.cash_floor.value!==row.fields.cash_floor?.value)throw identityError();
  }
  if(new Set(report.issues.map(issue=>issue.id)).size!==report.issues.length || report.issues.some(issue=>typeof issue.id!=='string' || !issue.id))throw identityError();
  if(report.native_status!=='verified' && report.observed_constraints!=='not_evaluable')throw identityError();
  validateInputControls(report,context);
  return report;
}

export function createLiquidityController({api,onChange=()=>{}}={}) {
  if(typeof api!=='function')throw new TypeError('Liquidity requires a read-only API.');
  let current={key:'',context:null,phase:'idle',report:null,reportSha:null,error:''},sequence=0;
  async function load() {
    if(!current.context)return;
    const token=++sequence,key=current.key,context=current.context;
    current={...current,phase:'loading',report:null,reportSha:null,error:''};onChange(current);
    try {
      const response=await api(`/api/builds/${encodeURIComponent(context.build.id)}/liquidity`,{method:'GET'});
      if(token!==sequence || key!==current.key)return;
      const report=validateLiquidityResponse(response,context);
      current={...current,phase:'ready',report,reportSha:response.report_sha256,error:''};onChange(current);
    } catch(error) {
      if(token!==sequence || key!==current.key)return;
      current={...current,phase:'error',report:null,reportSha:null,error:error.message || '本版资金检查暂不可用。'};onChange(current);
    }
  }
  return {state:()=>current,select(context) {
    const key=contextKey(context);
    if(key===current.key){current={...current,context};return;}
    sequence++;current={key,context,phase:context?'loading':'idle',report:null,reportSha:null,error:''};
    if(context)load();
  },refresh:load,clear(){sequence++;current={key:'',context:null,phase:'idle',report:null,reportSha:null,error:''};onChange(current);}};
}

export function liquidityField(report,period,field) {
  const row=list(report?.periods).find(row=>row.id===period);
  return row?.fields?.[field] || (['ending_cash','cash_floor'].includes(field)?row?.[field]:null);
}

export function liquidityTraceTarget(report,context,period,field) {
  const value=liquidityField(report,period,field),binding=value?.trace;
  if(report?.availability!=='available' || report.native_status!=='verified' || !finite(value?.value) || binding?.status!=='available' || !finite(binding.graph_value))return {reason:binding?.reason || value?.reason || '本项未提供可验证的原生单元格追溯。'};
  if(inputCount(report,field) && (!count(value.value) || !count(binding.graph_value) || value.value!==binding.graph_value))return {reason:'本版规则计数与计算节点不完全一致，不能替换追溯。'};
  const nodes=list(modelOf(context.build).workbook_spec?.nodes),matches=nodes.filter(node=>node.id===binding.node_id),cells=nodes.filter(node=>node.sheet===value.sheet && node.cell===value.cell);
  if(matches.length!==1 || cells.length!==1 || matches[0]!==cells[0] || matches[0].calculated_value!==binding.graph_value)return {reason:'本版单元格与计算节点不一致，不能替换追溯。'};
  if(Math.abs(value.value-binding.graph_value)>Math.max(1e-8,Math.abs(binding.graph_value)*1e-9))return {reason:'本版原生缓存与已绑定计算节点数值不一致，不能替换追溯。'};
  return {buildId:context.build.id,projectId:context.projectId,currentProjectRevision:context.currentRevision,nodeId:binding.node_id,expectedValue:binding.graph_value,displayLabel:fieldLabel(report,field),currency:report.currency,unit:report.unit,buildName:context.build.name,createdAt:context.build.created_at};
}

export function resolveLiquidityInputTarget(assumptions,target) {
  if(!target || !['assumptions','funding','sources','mapping'].includes(target.section))return {reason:'本事项未提供明确的当前输入入口。'};
  if(target.section!=='assumptions')return {section:target.section};
  if(!target.candidate_id)return {section:'assumptions',reason:'本版事项未绑定固定假设记录，请在当前假设页核对；系统没有按同名驱动选择替代行。'};
  const matches=list(assumptions).map((row,index)=>({row,index})).filter(({row})=>row.candidate_id===target.candidate_id && (!target.assumption_id || row.id===target.assumption_id));
  if(matches.length!==1)return {section:'assumptions',reason:'本版对应的假设在当前资料中已缺失或不唯一；请核对当前假设，没有按行号选择替代项。'};
  return {section:'assumptions',candidateId:matches[0].row.candidate_id,assumptionId:matches[0].row.id,index:matches[0].index};
}

function headline(report) {
  if(report.adapter_status==='execution_failed')return '资金检查未能完成；无法据此判断现金约束';
  if(report.native_status!=='verified')return '本版原生重算证据未建立；现金检查尚不能判断';
  if(report.observed_constraints==='breach_observed')return report.coverage.status==='complete'?'已发现本版月末现金或资金约束异常':'已发现本版资金约束异常；部分检查资料仍不完整';
  if(report.effective_gate==='CHECKS_PASSED')return '本版已配置的月末现金检查未见异常';
  return report.observed_constraints==='no_breach_in_checked_values'?'已检查数值未见异常；资料或控制缺口仍阻止完整判断':'本版资金检查尚不能完整判断';
}
function numberHTML(report,context,period,field) {
  const value=liquidityField(report,period,field),binding=liquidityTraceTarget(report,context,period,field),label=fieldLabel(report,field),isCount=inputCount(report,field),display=isCount?countAmount(value?.value):amount(value?.value);
  if(!finite(value?.value))return `<span class="liquidity-unknown" title="${esc(value?.reason || '未提供有效原生数值')}">— <small>未提供</small></span>`;
  if(!binding.nodeId)return `<span>${display}</span><small class="liquidity-unavailable">${esc(binding.reason)}</small>`;
  return `<button type="button" class="trace-number" data-liquidity-trace data-liquidity-build="${esc(context.build.id)}" data-liquidity-period="${esc(period)}" data-liquidity-field="${esc(field)}" aria-label="${esc(period)} ${esc(label)} ${esc(value.value)} ${isCount?'条规则':`${esc(report.currency)} ${esc(units[report.unit] || report.unit)}`}，查看本版 ${esc(value.sheet)}!${esc(value.cell)}">${display}</button><small class="liquidity-cell">${esc(value.sheet)}!${esc(value.cell)}</small>`;
}
function traceLinkHTML(report,context,ref) {
  const field=liquidityField(report,ref.period,ref.field),target=liquidityTraceTarget(report,context,ref.period,ref.field);
  if(!target.nodeId)return `<span class="field-hint">${esc(ref.period)} ${esc(fields[ref.field] || ref.field)}：${esc(target.reason)}</span>`;
  return `<button type="button" class="button button-small" data-liquidity-trace data-liquidity-build="${esc(context.build.id)}" data-liquidity-period="${esc(ref.period)}" data-liquidity-field="${esc(ref.field)}">查看本版 ${esc(ref.period)} ${esc(fields[ref.field] || ref.field)} · ${esc(field.sheet)}!${esc(field.cell)}</button>`;
}
function issueHTML(report,context,issue) {
  const role=issue.responsible_role || {},provenance={recorded:'已保存责任记录（不代表身份认证或事实确认）',suggested:'建议跟进角色（尚未分派）',unassigned:'尚未明确责任人'}[role.provenance] || '责任归属尚未核实';
  const section=issue.input_target?.section,label={assumptions:'到当前假设处理',funding:'到当前融资安排处理',sources:'到当前资料处理',mapping:'到当前科目映射处理'}[section];
  return `<article class="liquidity-issue" data-liquidity-issue="${esc(issue.id)}"><div class="liquidity-issue-heading"><h4>${esc(issue.title || fields[issue.field] || '待核对事项')}</h4><span class="badge ${issue.kind==='observed_constraint'?'danger':'warning'}">${esc(kindNames[issue.kind] || '待核对事项')}</span></div><p>${esc(issue.detail || '')}</p><p class="field-hint">适用期间：${esc(list(issue.periods).join('、') || '整体')}</p><p><strong>下一步需要：</strong>${esc(issue.next_input || '补充可核对的来源和处理依据。')}</p><p class="field-hint">${esc(role.name || '责任人未提供')} · ${esc(provenance)}</p><div class="button-row liquidity-evidence-links">${list(issue.trace_refs).map(ref=>traceLinkHTML(report,context,ref)).join('')}</div>${label?`<button type="button" class="button button-small" data-liquidity-input="${esc(issue.id)}" data-liquidity-build="${esc(context.build.id)}">${label} · 资料版本 ${esc(context.currentRevision)}</button>`:''}<details><summary>查看检查记录编号</summary><p class="field-hint">${esc(list(issue.codes).join(' / ') || '未提供')}</p></details></article>`;
}
function inputControlsHTML(report,context) {
  const controls=report.input_controls;if(!controls)return '';
  const registry=modelOf(context.build).input_controls,archivedOpeningTie=registry?.version===1 && list(registry.rules).some(rule=>rule.id==='relation:funding_opening_tie');
  const archive=archivedOpeningTie?'<p class="notice warning" data-liquidity-archived-controls>旧版融资期初精确勾稽存在已知覆盖缺口；请重新生成版本。以下覆盖状态及数值保留生成时的记录，不构成当前完整有效性结论。</p>':'';
  return `<section data-liquidity-input-controls aria-label="本版 Excel 输入检查覆盖"><h3>Excel 输入检查覆盖</h3>${archive}<p><span class="badge ${controls.status==='complete'&&!archivedOpeningTie?'neutral':'warning'}">${archivedOpeningTie?'旧版记录：':''}${controls.status==='complete'?'已配置的输入规则覆盖完整':'输入规则覆盖仍有缺口'}</span> 已覆盖 ${countAmount(controls.covered_input_count)} / ${countAmount(controls.expected_input_count)} 个输入，已生成 ${countAmount(controls.rule_count)} 条检查规则。</p><p>逐月显示未通过的规则数，不是不同输入单元格的数量；同一输入可能触发多条规则，全局规则会在各月重复计数，不能按月相加。</p><p>本版生成的 Excel 中，已有的输入检查公式会在修改输入并重新计算后更新。这里保留生成时的报告；原生重算回执只覆盖当时生成的确切文件。当前尚未接入修改后 Excel 的回传检查。</p>${controls.uncovered_rules.length?`<p><strong>尚未覆盖的规则：</strong></p><ul>${controls.uncovered_rules.map(rule=>`<li><strong>${esc(rule.code)}</strong>：${esc(rule.message)}</li>`).join('')}</ul>`:''}<p class="field-hint">规则覆盖完整不等于模型可正式交付，也不代表公司确认、独立复核完成或取得对外使用授权。</p><details><summary>查看本版计数口径</summary><p>${esc(controls.count_semantics)}</p></details></section>`;
}
function periodHTML(report,context,row) {
  const details=Object.entries(row.fields).filter(([name])=>!['ending_cash','cash_floor'].includes(name));
  const hasBreach=report.native_status==='verified' && row.observed_codes.some(code=>!['MISSING_OR_NONNUMERIC','CONTROL_MAPPING_MISSING'].includes(code));
  const failedRules=report.input_controls && report.native_status==='verified' && row.fields.invalid_input_count?.value>0;
  const monthStatus=report.native_status!=='verified'?'未判定':hasBreach?'已观察到异常':failedRules?'存在未通过的输入规则':!finite(row.ending_cash.value) || !finite(row.cash_floor.value)?'现金底线未能判定':'已检查值未见异常';
  return `<tr data-liquidity-month="${esc(row.id)}"><th scope="row">${esc(row.id)}</th><td class="numeric">${numberHTML(report,context,row.id,'ending_cash')}</td><td class="numeric">${numberHTML(report,context,row.id,'cash_floor')}</td><td class="numeric">${amount(row.shortfall?.value)}<small class="liquidity-cell">相对已采用底线</small></td>${report.input_controls?`<td class="numeric">${numberHTML(report,context,row.id,'invalid_input_count')}</td>`:''}<td><span class="badge ${hasBreach || failedRules?'danger':'neutral'}">${monthStatus}</span>${row.missing_fields.length?`<p class="liquidity-missing">未完整检查：${row.missing_fields.map(name=>esc(fieldLabel(report,name))).join('、')}</p>`:''}</td></tr><tr class="liquidity-detail-row"><td colspan="${report.input_controls?6:5}"><details><summary>${esc(row.id)} · 现金桥、原生单元格与控制明细</summary><div class="table-scroll" tabindex="0" aria-label="${esc(row.id)} 原生现金及控制明细"><table><thead><tr><th>字段</th><th class="numeric">原生数值 / 追溯</th><th>完整缓存值或缺口</th></tr></thead><tbody>${details.map(([name,value])=>`<tr><td>${esc(fieldLabel(report,name))}</td><td class="numeric">${numberHTML(report,context,row.id,name)}</td><td>${esc(value.native_literal ?? value.reason ?? '未提供原生缓存文字')}</td></tr>`).join('')}</tbody></table></div><p class="field-hint">现金缺口 = max(已采用现金底线 − 月末现金, 0)。缺口是派生值，不另设虚构单元格。期间净流出本身不等于现金不足。</p></details></td></tr>`;
}
export function liquidityHTML(state,{compact=false,resolveLabel=value=>value}={}) {
  const context=state.context;if(!context)return '';
  const build=context.build,report=state.report,old=revisionOf(build)!==context.currentRevision;
  const identity=`<p class="liquidity-version">${esc(build.name || '已保存模型')} · 版本 ${esc(build.id.slice(0,8))} · 资料版本 ${esc(revisionOf(build))}</p>${old?`<p class="notice warning" data-liquidity-old>本报告属于资料版本 ${esc(revisionOf(build))}；当前项目为 ${esc(context.currentRevision)}。以下数字及依据保留原版，修改输入后须另生成版本。</p>`:''}`;
  const top=`<section class="panel liquidity-panel" id="liquidity-report" tabindex="-1" data-liquidity-panel="${esc(build.id)}" aria-label="所选版本资金检查"><div class="panel-head"><div><h2>本版资金检查</h2>${identity}</div></div>`;
  if(state.phase==='loading')return top+'<div class="panel-body" role="status" aria-live="polite" aria-busy="true">正在读取本版保存的原生资金检查；此处不会改用其他版本。</div></section>';
  if(state.phase==='error')return top+`<div class="panel-body"><div role="alert" class="liquidity-error"><strong>本版资金检查暂不可用</strong><p>${esc(state.error)}</p><button type="button" class="button" data-liquidity-retry>重试本版报告</button></div></div></section>`;
  if(!report)return top+'<div class="panel-body">尚未取得本版资金检查记录。</div></section>';
  if(report.availability==='legacy_unavailable')return top+`<div class="panel-body"><p class="liquidity-headline">此历史版本未保存资金检查报告</p><p>${esc(report.reason)}</p><p class="field-hint">没有报告不等于没有现金缺口。新版本将使用当前已保存资料。</p><button type="button" class="button" data-step="model">回到模型页生成新版本</button></div></section>`;
  const breach=report.observed_constraints==='breach_observed',missing=report.coverage.status!=='complete';
  const summary=`<div class="panel-body"><p class="liquidity-headline ${breach?'negative':''}" data-liquidity-headline>${esc(headline(report))}</p><div class="liquidity-facets"><span class="badge ${breach?'danger':'neutral'}">${breach?'已观察到资金约束异常':report.observed_constraints==='no_breach_in_checked_values'?'已检查值未见异常':'现金约束未判定'}</span><span class="badge ${missing?'warning':'neutral'}">${missing?'检查覆盖不完整':'已配置期间及字段完整'}</span><span class="badge neutral">${report.native_status==='verified'?'本版原生重算证据已核对':'原生重算尚未建立'}</span></div><p class="field-hint">${esc(report.currency)} · ${esc(units[report.unit] || report.unit)} · ${esc(report.expected_periods[0] || '期间未提供')} 至 ${esc(report.expected_periods.at(-1) || '期间未提供')}。月末账面现金及已配置约束的检查，不代表完整资金可用性结论。</p>${provisionalSummaryHTML(report.assumption_governance,{compact:true,context:'此资金报告对应的模型',resolveLabel})}${inputControlsHTML(report,context)}`;
  if(compact)return top+summary+`<button type="button" class="button" data-liquidity-full>查看逐月现金与待处理事项 →</button></div></section>`;
  const grouped=groups.map(([id,title,note])=>{const items=report.issues.filter(issue=>issue.next_action_group===id);return `<section class="liquidity-action-group"><h3>${title}</h3>${items.length?items.map(issue=>issueHTML(report,context,issue)).join(''):`<p class="field-hint">本报告未单列此类事项。${esc(note)}</p>`}</section>`;}).join('');
  const other=report.issues.filter(issue=>!groupNames.has(issue.next_action_group));
  return top+summary+`<p class="field-hint">资金缺口与资料缺口分别列示。资金检查状态及报告指纹将随本版交审保存；交审仅是请求复核。</p></div><div class="table-scroll liquidity-table-scroll" tabindex="0" aria-label="本版逐月原生现金、底线与检查缺口"><table class="liquidity-table"><thead><tr><th>月份</th><th class="numeric">月末现金</th><th class="numeric">已采用现金底线</th><th class="numeric">现金缺口</th>${report.input_controls?'<th class="numeric">未通过输入规则（条）</th>':''}<th>已观察结果与缺口</th></tr></thead><tbody>${report.periods.map(row=>periodHTML(report,context,row)).join('')}</tbody></table></div><div class="panel-body"><div class="liquidity-action-intro"><h3>按下一步要处理的事项核对</h3><p>以下是需结合证据评估的处理方向，没有固定先后，也不保证能消除缺口。先看本版依据，再进入当前资料版本处理；不会自动改数或提款。</p></div>${grouped}${other.length?`<section class="liquidity-action-group"><h3>其他待核对事项</h3>${other.map(issue=>issueHTML(report,context,issue)).join('')}</section>`:''}${list(report.scope_limitations).length?`<details><summary>本报告的检查范围</summary><ul>${report.scope_limitations.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></details>`:''}<details><summary>查看报告记录与文件指纹</summary><p class="liquidity-hash">报告 SHA-256 ${esc(state.reportSha)}</p><p class="liquidity-hash">Excel SHA-256 ${esc(report.build.xlsx_sha256)}</p><p>原生检查进程退出值：${esc(report.guard_exit_code ?? '未运行')} · 已配置检查：${esc(report.mechanical_gate ?? '未建立')} · 综合保留状态：${esc(report.effective_gate)}</p>${report.native_status!=='verified'?'<p class="notice warning">以下原始记录未建立本版原生证据，不能作为已验证的现金异常。</p>':''}<pre class="raw-json">${esc(JSON.stringify({raw_events:report.raw_events,coverage:report.coverage,planning_constraints:report.planning_constraints},null,2))}</pre><p class="field-hint">计划申请未执行不自动等于合同到期未付。检查通过不会产生公司确认、独立 QA 或对外授权。</p></details><div class="button-row"><a class="button button-small" href="/api/builds/${encodeURIComponent(build.id)}/liquidity/download" download>下载本版资金检查记录</a><button type="button" class="button button-small" data-liquidity-retry>重新读取本版报告</button></div></div></section>`;
}

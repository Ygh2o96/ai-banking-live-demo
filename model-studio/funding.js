/** Contract v1.2 funding editor. The host owns atomic, revision-checked saving. */
const copy=value=>JSON.parse(JSON.stringify(value));
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const list=value=>Array.isArray(value)?value:[];
const NUMBERS=['opening_principal','principal_limit','opening_drawn_total','opening_overdue','annual_rate'];
const MONTHS=['available_from','available_to','maturity'];
const ROW_NUMBERS=['draw_requested','draw_cap','principal_due','optional_repayment'];
const LABELS={opening_principal:'期初借款本金',principal_limit:'本金 / 承诺额度上限',opening_drawn_total:'期初累计已提款总额',opening_overdue:'期初已逾期本金',annual_rate:'固定年利率',available_from:'最早可提款月份',available_to:'最后可提款月份',maturity:'最终到期月份',draw_requested:'计划提款',draw_cap:'本月可提款上限',principal_due:'本期新增到期本金（不含以前欠款）',optional_repayment:'可酌情还款'};
const POLICY='mandatory_then_optional_in_list_order';
const INTEREST={opening_principal_monthly_12:'期初本金 × 年率 ÷ 12',opening_principal_actual_365:'期初本金 × 年率 × 当月天数 ÷ 365',opening_principal_actual_360:'期初本金 × 年率 × 当月天数 ÷ 360'};
const validMonth=value=>/^(?!0000)\d{4}-(0[1-9]|1[0-2])$/.test(value || '');
const emptyEvidence=()=>({kind:null,source_id:null,quote:null,note:null});
const emptyRow=()=>({draw_requested:null,draw_cap:null,principal_due:null,optional_repayment:null,conditions_met:null});
const selectOptions=(options,value,placeholder='请选择')=>`<option value="">${esc(placeholder)}</option>`+Object.entries(options).map(([key,label])=>`<option value="${esc(key)}"${String(value)===key?' selected':''}>${esc(label)}</option>`).join('');
function finiteAmount(raw,label) {
  if(raw===null || raw===undefined || String(raw).trim()==='')return null;
  const text=String(raw).trim();
  if(text.length>400 || !/^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text))throw new Error(`${label}须为有限非负数字；未知金额请留空。`);
  const value=Number(text);if(!Number.isFinite(value) || value<0 || (value===0 && /[1-9]/.test(text.split(/e/i)[0])))throw new Error(`${label}超出可保存的有限数值范围。`);
  return value;
}
function evidenceForRequest(value) {
  const evidence=value || {};const kind=evidence.kind || null;
  return kind==='operator_assumption'?{kind,note:evidence.note?.trim() || null}:{kind,source_id:evidence.source_id || null,quote:evidence.quote || null,note:evidence.note?.trim() || null};
}
function planForRequest(value) {
  return {schema:'model-funding/v1',mode:value.mode,status:'draft',adoption_note:value.adoption_note?.trim() || null,
    payment_policy:value.payment_policy || null,interest_policy:value.interest_policy || null,evidence:evidenceForRequest(value.evidence),
    facilities:list(value.facilities).map(facility=>{
      const item={facility_id:facility.facility_id,name:facility.name?.trim() || null,kind:facility.kind || null,currency:facility.currency || null,unit:facility.unit || null,evidence:evidenceForRequest(facility.evidence),schedule:{}};
      item.prepayment_permission=facility.prepayment_permission===true || facility.prepayment_permission==='true'?true:facility.prepayment_permission===false || facility.prepayment_permission==='false'?false:null;
      item.prepayment_allocation=facility.prepayment_allocation || null;
      for(const key of NUMBERS)item[key]=finiteAmount(facility[key],LABELS[key]);
      for(const key of MONTHS)item[key]=facility[key] || null;
      for(const [month,row] of Object.entries(facility.schedule || {})){
        item.schedule[month]={};for(const key of ROW_NUMBERS)item.schedule[month][key]=finiteAmount(row[key],`${month} ${LABELS[key]}`);
        item.schedule[month].conditions_met=row.conditions_met===true || row.conditions_met==='true'?true:row.conditions_met===false || row.conditions_met==='false'?false:null;
      }
      return item;
    })};
}
let sequence=0;
export function createFundingEditor({api,onApply,onDirty=()=>{}}={}) {
  if(typeof onApply!=='function')throw new TypeError('Funding editor requires onApply.');
  const prefix=`funding-editor-${++sequence}`;
  const dialog=document.createElement('dialog');dialog.className='funding-editor';dialog.setAttribute('aria-labelledby',`${prefix}-title`);
  document.body.append(dialog);
  let session=null,generation=0,applying=false,returnFocus=null;
  const get=selector=>dialog.querySelector(selector);
  function markDirty() {
    if(!session)return;session.dirty=true;session.plan.status='draft';session.confirmed=false;session.replaceLegacy=false;
    const confirmed=get('[data-funding-confirm]'),replace=get('[data-funding-replace]');if(confirmed)confirmed.checked=false;if(replace)replace.checked=false;
    onDirty({projectId:session.projectId,revision:session.revision,dirty:true});
  }
  function error(message='') {const box=get('[data-funding-error]');if(box){box.textContent=message;box.hidden=!message;if(message)box.focus();}}
  function activeFacility() {return list(session?.plan.facilities).find(item=>item.facility_id===session?.selected);}
  function sourceOptions() {return Object.fromEntries(session.sources.map(source=>[source.id,source.name || '纪要原文']));}
  function evidenceHTML(value,scope,title) {
    const e=value || {};const source=session.sources.find(item=>item.id===e.source_id);
    return `<fieldset class="funding-evidence" data-evidence-scope="${esc(scope)}"><legend>${title}</legend><label>依据类型<select data-evidence-field="kind">${selectOptions({minutes_quote:'当前纪要中的明确原话',operator_assumption:'操作人明确提出的模型假设'},e.kind)}</select></label>${e.kind==='minutes_quote'?`<label>当前有效纪要<select data-evidence-field="source_id">${selectOptions(sourceOptions(),e.source_id,'选择已保存的纪要')}</select></label>${e.source_id && !source?'<p class="funding-warning">原关联纪要当前不可采用，请重新核对；原版本依据仍保留。</p>':''}<label>逐字引文<textarea data-evidence-field="quote" placeholder="须逐字包含于所选有效纪要；不改写为管理层原话。">${esc(e.quote)}</textarea></label>${source?`<details><summary>查看当前所选纪要原文</summary><pre class="funding-source-text">${esc(source.text)}</pre></details>`:''}`:''}<label>${e.kind==='operator_assumption'?'人工假设依据（不代表公司或贷款人确认）':'本次采用说明'}<textarea data-evidence-field="note" placeholder="说明本次采用的依据与范围">${esc(e.note)}</textarea></label></fieldset>`;
  }
  function scheduleHTML(facility) {
    const months=[...new Set([...session.calendar,...Object.keys(facility.schedule || {})])].sort();
    if(!months.length)return '<p class="funding-warning">尚未取得预测月份。可以先保留条款草稿；请确认历史口径后重新打开，不能凭空安排月份。</p>';
    const outside=months.filter(month=>!session.calendar.includes(month));
    return `<div class="funding-schedule-head"><h3>逐月提款与偿还</h3><p>所有金额与条件逐月明确填写。空白是未知；没有金额时需明确填写 0。计划提款不会因现金短缺自动增加。</p>${outside.length?`<p class="funding-warning">${outside.map(esc).join('、')} 不在当前预测期内。旧行仍保留；采用前须核对并明确移除。</p><button type="button" data-funding-action="remove-outside">核对并移除预测期外的旧行</button>`:''}</div><div class="funding-table-wrap" tabindex="0" aria-label="${esc(facility.name || '当前融资')} 每月提款、合同应还与可酌情还款"><table><thead><tr><th scope="col">月份</th>${ROW_NUMBERS.map(key=>`<th scope="col">${LABELS[key]}</th>`).join('')}<th scope="col">提款条件</th></tr></thead><tbody>${months.map(month=>{const row=facility.schedule?.[month] || emptyRow();return `<tr data-funding-month="${esc(month)}"><th scope="row">${esc(month)}${outside.includes(month)?'<small>预测期外</small>':''}</th>${ROW_NUMBERS.map(key=>`<td><label class="sr-only">${esc(month)} ${LABELS[key]}</label><input type="text" inputmode="decimal" data-schedule-field="${key}" aria-label="${esc(month)} ${LABELS[key]}" value="${esc(row[key])}" placeholder="待提供" autocomplete="off"></td>`).join('')}<td><select data-schedule-field="conditions_met" aria-label="${esc(month)} 提款条件">${selectOptions({true:'已满足',false:'未满足'},row.conditions_met,'待核对')}</select></td></tr>`;}).join('')}</tbody></table></div>`;
  }
  function facilityHTML(facility) {
    if(!facility)return '<p class="funding-empty">先添加一笔融资，逐项录入本金、可提款期与合同应还安排。</p>';
    const original=list(session.original?.facilities).find(item=>item.facility_id===facility.facility_id);
    return `<section class="funding-facility" data-facility-id="${esc(facility.facility_id)}"><div class="funding-section-head"><h3>本笔融资条款</h3><button type="button" data-funding-action="remove-facility" class="funding-danger">移除此笔融资</button></div>${original?`<details class="funding-original"><summary>查看此笔已保存的原版本依据</summary><blockquote>${esc(original.evidence?.quote || original.evidence?.note || '原版本依据未提供')}</blockquote><p>${esc(original.name)} · 原期初本金 ${esc(original.opening_principal ?? '待提供')} · 原到期月 ${esc(original.maturity || '待提供')}</p></details>`:''}<div class="funding-fields"><label>融资名称<input type="text" maxlength="120" data-facility-field="name" value="${esc(facility.name)}" placeholder="按来源识别此笔融资"></label><label>融资类型<select data-facility-field="kind">${selectOptions({revolver:'循环额度（偿还可恢复容量）',term:'定期融资（偿还不恢复已提款容量）'},facility.kind)}</select></label><label>币种<select data-facility-field="currency">${selectOptions({[session.currency]:session.currency},facility.currency,'明确采用项目币种')}</select></label><label>金额单位<select data-facility-field="unit">${selectOptions({[session.unit]:session.unitLabel},facility.unit,'明确采用项目金额单位')}</select></label>${NUMBERS.map(key=>`<label>${LABELS[key]}${key==='annual_rate'?'（小数，例如 0.06）':''}<input type="text" inputmode="decimal" data-facility-field="${key}" value="${esc(facility[key])}" placeholder="待提供" autocomplete="off"></label>`).join('')}${MONTHS.map(key=>`<label>${LABELS[key]}<input type="month" min="0001-01" max="9999-12" data-facility-field="${key}" value="${esc(facility[key])}"></label>`).join('')}</div><p class="funding-hint">本模块按月采用条款；精确日期保留在原文和采用说明中。最后可提款月必须早于到期月；到期月及以后全部剩余本金到期。本期新增到期本金不包含以前欠款。循环额度的累计已提款填期初本金；定期融资填累计历史提款，偿还不恢复容量。期初超限金额如实保留。</p><div class="funding-fields"><label>提前还款许可<select data-facility-field="prepayment_permission">${selectOptions({true:'允许',false:'不允许'},facility.prepayment_permission,'待核对')}</select></label><label>提前还款后的分期口径<select data-facility-field="prepayment_allocation">${selectOptions({keep_scheduled_principal:'保留原计划分期本金，不自动重排'},facility.prepayment_allocation)}</select></label></div><p class="funding-hint">提前还款不自动减少以后分期；需按确认后的安排更新。不等于免除手续费或其他同意条件。不允许提前还款时，仍可保留原请求，但模型支付为零并显示未满足金额。</p>${evidenceHTML(facility.evidence,'facility','本笔融资的依据')}${scheduleHTML(facility)}</section>`;
  }
  function render() {
    if(!session)return;
    const p=session.plan,facilities=list(p.facilities),isFacilities=p.mode==='facilities';
    dialog.innerHTML=`<div class="funding-editor-head"><div><p class="funding-eyebrow">融资事实与偿债安排</p><h2 id="${prefix}-title">确定本版本采用的融资口径</h2><p>资料版本 ${esc(session.revision)} · ${esc(session.currency)} · ${esc(session.unitLabel)}</p></div><button type="button" class="funding-close" data-funding-action="close" aria-label="关闭融资编辑">关闭</button></div><div class="funding-editor-body"><p class="funding-error" data-funding-error role="alert" tabindex="-1" hidden></p><div class="funding-decision" data-funding-decision hidden></div><label class="funding-mode">本版本采用的口径<select data-plan-field="mode">${selectOptions({aggregate:'只有总额计划 / 尚未提供合同条款',facilities:'按逐笔融资条款与应还月份计算',none:'明确无期初借款及预测期借款'},p.mode,null)}</select></label><p class="funding-hint">未提供融资事实不等于没有债务。总额计划不能证明合同到期款、逾期情况或融资可用性。所有采用均是操作人的建模选择，不是公司或贷款人的确认。</p><p class="funding-calendar" data-funding-calendar role="status">${session.calendar.length?`当前预测月份：${esc(session.calendar[0])} 至 ${esc(session.calendar.at(-1))}`:esc(session.calendarError || '正在读取已确认的预测月份…')}</p>${p.mode==='aggregate'?`<div class="funding-callout">继续采用现有总额假设；合同偿债事实仍未建立。由逐笔模式切回后，原四项融资假设须在表格中重新核对确认。</div>`:`<div class="funding-callout">${isFacilities?'每月先支付全部合同应付款，再处理可酌情还款。现金不足时保留未付及逾期；不会自动借款配平。':'本声明覆盖期初无借款本金及预测期不安排借款；后台仍须核对实际 TB 借款余额为零。'}</div><label>模型现金支付顺序<select data-plan-field="payment_policy">${selectOptions({[POLICY]:'先合同应还，后可酌情还款；同组按列表顺序'},p.payment_policy)}</select></label><p class="funding-hint">这是模型的现金分配顺序，不代表法定清偿顺位。合同应付款不会因现金底线而消失。</p>${isFacilities?`<label>利息计算口径<select data-plan-field="interest_policy">${selectOptions(INTEREST,p.interest_policy)}</select></label><p class="funding-hint">固定年率，按期初本金计息并当期支付；月末新增提款从下月计息。本模块未表示欠息、费用、资本化利息、浮息及外汇安排；需要这些条款时不能据此确认完整覆盖。</p>`:''}${evidenceHTML(p.evidence,'plan',p.mode==='none'?'无借款声明及适用范围的依据':'本版本融资安排的依据')}`}${session.original?`<details class="funding-original"><summary>查看已保存版本的整体依据</summary><blockquote>${esc(session.original.evidence?.quote || session.original.evidence?.note || '原版本尚未提供整体依据')}</blockquote><p>${esc(session.original.adoption_note || '原版本尚无采用说明')}</p></details>`:''}<label>本次采用 / 草稿说明<textarea data-plan-field="adoption_note" placeholder="明确说明范围、月度转换及本版本采用理由；无借款模式需写明期初与预测期范围。">${esc(p.adoption_note)}</textarea></label>${facilities.length && !isFacilities?'<div class="funding-warning">当前草稿仍保留逐笔融资。采用其他模式前，请明确移除这些条款；本次切换不会暗中丢弃。</div><button type="button" data-funding-action="remove-all" class="funding-danger">核对并移除此草稿的逐笔列表</button>':''}${isFacilities?`<div class="funding-section-head"><h3>逐笔融资 · ${facilities.length} / 12</h3><button type="button" data-funding-action="add-facility"${facilities.length>=12?' disabled':''}>添加一笔融资</button></div><p class="funding-hint">列表顺序决定同一支付组内现金不足时的分配顺序；上下移动会改变模型采用口径。</p><div class="funding-facility-list">${facilities.map((f,index)=>`<div class="funding-facility-row${f.facility_id===session.selected?' selected':''}"><button type="button" data-funding-action="select-facility" data-facility-id="${esc(f.facility_id)}">${index+1}. ${esc(f.name || '未命名融资')}<small>${esc(f.kind==='term'?'定期融资':f.kind==='revolver'?'循环额度':'类型待提供')} · 期初本金 ${esc(f.opening_principal ?? '待提供')} · 到期 ${esc(f.maturity || '待提供')}</small></button><button type="button" data-funding-action="move-up" data-facility-id="${esc(f.facility_id)}" aria-label="将第 ${index+1} 笔融资上移"${index===0?' disabled':''}>上移</button><button type="button" data-funding-action="move-down" data-facility-id="${esc(f.facility_id)}" aria-label="将第 ${index+1} 笔融资下移"${index===facilities.length-1?' disabled':''}>下移</button></div>`).join('')}</div>${facilityHTML(activeFacility())}`:''}<div class="funding-confirmations">${p.mode!=='aggregate'?`<label><input type="checkbox" data-funding-replace${session.replaceLegacy?' checked':''}>采用时，将原总额年利率、提款、计划还款和额度上限四类假设标为“本模型不采用”，保留原值、原话和本次替代说明。</label><details><summary>查看会被替代的现有假设（${session.legacyRows.length} 项）</summary><ul>${session.legacyRows.map(row=>`<li>${esc(row.label || row.id)}：${esc(row.value ?? '待提供')} ${esc(row.unit || '')} · ${esc(row.period || '期间待提供')}</li>`).join('') || '<li>当前没有这四类已保存候选；逐笔模式也不会新造总额假设。</li>'}</ul></details>`:''}<label><input type="checkbox" data-funding-confirm${session.confirmed?' checked':''}>我已核对原始依据、适用范围、全部月份、数值及模型支付口径，明确由本次操作采用。</label></div><p class="funding-hint">未知数值、未核对条件和缺失月份不能作为完整融资输入。历史 TB 不会被此处的预测安排改写。</p></div><div class="funding-editor-foot"><span>返回表格后，仍须点击父页面保存才写入项目。</span><div><button type="button" data-funding-action="draft">保留未完成草稿</button><button type="button" class="funding-primary" data-funding-action="adopt">采用本次融资口径</button></div></div>`;
  }
  function showDecision(message,action) {
    session.decision=action;const box=get('[data-funding-decision]');box.innerHTML=`<p>${esc(message)}</p><div><button type="button" data-funding-action="cancel-decision">保留并继续编辑</button><button type="button" data-funding-action="confirm-decision" class="funding-danger">明确确认上述操作</button></div>`;box.hidden=false;box.scrollIntoView({block:'nearest'});box.querySelector('button').focus();
  }
  function hide() {
    const old=session;generation++;session=null;dialog.close();onDirty({projectId:old?.projectId,revision:old?.revision,dirty:false});if(returnFocus?.isConnected)returnFocus.focus();
  }
  function close() {
    if(applying)return false;if(session?.dirty){showDecision('关闭会放弃本窗口尚未放回表格的修改；此前已返回表格的草稿仍保留。',()=>hide());return false;}if(dialog.open)hide();return true;
  }
  function requireEvidence(e,label) {
    if(e.kind==='operator_assumption'){if(!e.note)throw new Error(`${label}请填写人工假设依据。`);return;}
    if(e.kind!=='minutes_quote')throw new Error(`${label}请选择依据类型。`);
    const source=session.sources.find(item=>item.id===e.source_id);
    if(!source || !e.quote || !source.text.includes(e.quote))throw new Error(`${label}引文须逐字对应当前有效纪要。`);
    if(!e.note)throw new Error(`${label}请填写本次采用说明。`);
  }
  function validateAdoption(plan) {
    if(!plan.adoption_note)throw new Error('请填写本次采用理由及适用范围。');
    if(!session.confirmed)throw new Error('请明确确认本次采用的依据、月份与计算口径。');
    if(plan.mode!=='aggregate') {
      if(!session.replaceLegacy)throw new Error('请确认本模式将明确替代原四类总额融资假设。');
      if(plan.payment_policy!==POLICY)throw new Error('请明确选择模型现金支付顺序。');
      requireEvidence(plan.evidence,'整体融资安排：');
    }
    if(plan.mode!=='facilities'){if(plan.facilities.length)throw new Error('请先明确处理保留的逐笔融资列表，再采用其他口径。');return;}
    if(!session.calendar.length)throw new Error('尚未取得已确认预测月份；请先核对历史 TB 再采用完整融资安排。');
    if(!Object.hasOwn(INTEREST,plan.interest_policy))throw new Error('请明确选择利息口径。');
    if(!plan.facilities.length)throw new Error('请至少录入一笔融资，或明确选择无借款模式。');
    for(const [index,f] of plan.facilities.entries()) {
      const label=`第 ${index+1} 笔融资：`;
      if(!f.name || !['revolver','term'].includes(f.kind))throw new Error(`${label}请填写名称并选择类型。`);
      if(f.currency!==session.currency || String(f.unit)!==String(session.unit))throw new Error(`${label}请明确选择本模型币种和金额单位。`);
      for(const key of NUMBERS)if(f[key]===null)throw new Error(`${label}${LABELS[key]}尚未明确；若为零请明确填写 0。`);
      if(f.opening_overdue>f.opening_principal)throw new Error(`${label}期初逾期本金不能超过期初本金。`);
      if(f.opening_drawn_total<f.opening_principal || (f.kind==='revolver' && f.opening_drawn_total!==f.opening_principal))throw new Error(`${label}累计已提款口径与期初本金不符，请核对。`);
      if(typeof f.prepayment_permission!=='boolean' || f.prepayment_allocation!=='keep_scheduled_principal')throw new Error(`${label}请明确提前还款许可及后续分期处理口径。`);
      for(const key of MONTHS)if(!validMonth(f[key]))throw new Error(`${label}${LABELS[key]}须明确到月份。`);
      if(f.available_from>f.available_to || f.available_to>=f.maturity)throw new Error(`${label}可提款期须有序，最后可提款月须早于到期月。`);
      requireEvidence(f.evidence,label);
      if(Object.keys(f.schedule).sort().join('|')!==session.calendar.join('|'))throw new Error(`${label}月度安排须完整覆盖当前预测期，并明确处理预测期外旧行。`);
      for(const [month,row] of Object.entries(f.schedule)) {
        for(const key of ROW_NUMBERS)if(row[key]===null)throw new Error(`${label}${month} ${LABELS[key]}尚未填写。`);
        if(typeof row.conditions_met!=='boolean')throw new Error(`${label}${month} 提款条件尚未核对。`);
      }
    }
  }
  async function apply(adopt) {
    let message='';
    try {
      error();const plan=planForRequest(session.plan);
      if(plan.mode!=='facilities' && plan.facilities.length)throw new Error('当前模式仍保留逐笔列表；请先明确处理，不会静默丢弃草稿。');
      if(adopt){validateAdoption(plan);plan.status='adopted';}
      applying=true;dialog.setAttribute('aria-busy','true');dialog.querySelectorAll('button,input,select,textarea').forEach(el=>el.disabled=true);
      await onApply({projectId:session.projectId,revision:session.revision,plan,replaceLegacy:adopt && plan.mode!=='aggregate' && session.replaceLegacy,disposition:adopt?'adopted':'draft'});
      session.dirty=false;hide();
    } catch(exception){message=exception.message || '融资安排未能返回表格，输入仍保留。';}
    finally {applying=false;dialog.removeAttribute('aria-busy');if(session){render();if(message)error(message);}}
  }
  dialog.addEventListener('input',event=>{
    if(!session || applying)return;const target=event.target;
    if(target.dataset.planField){session.plan[target.dataset.planField]=target.value;markDirty();return;}
    const facilityId=target.closest('[data-facility-id].funding-facility')?.dataset.facilityId;
    const facility=list(session.plan.facilities).find(item=>item.facility_id===facilityId);
    if(target.dataset.facilityField && facility){facility[target.dataset.facilityField]=target.value;markDirty();return;}
    if(target.dataset.scheduleField && facility){const month=target.closest('[data-funding-month]').dataset.fundingMonth;facility.schedule[month] ||= emptyRow();facility.schedule[month][target.dataset.scheduleField]=target.value;markDirty();return;}
    if(target.dataset.evidenceField){const scope=target.closest('[data-evidence-scope]').dataset.evidenceScope;const owner=scope==='plan'?session.plan:facility;if(owner){owner.evidence ||= emptyEvidence();owner.evidence[target.dataset.evidenceField]=target.value;markDirty();}}
  });
  dialog.addEventListener('change',event=>{
    if(!session || applying)return;const target=event.target;
    if(target.matches('[data-funding-confirm]')){session.confirmed=target.checked;session.dirty=true;onDirty({projectId:session.projectId,revision:session.revision,dirty:true});return;}
    if(target.matches('[data-funding-replace]')){session.replaceLegacy=target.checked;session.dirty=true;onDirty({projectId:session.projectId,revision:session.revision,dirty:true});return;}
    if(target.dataset.planField==='mode' || ['kind','source_id'].includes(target.dataset.evidenceField))render();
  });
  dialog.addEventListener('click',event=>{
    const button=event.target.closest('[data-funding-action]');if(!button || !session || applying)return;const action=button.dataset.fundingAction;
    if(action==='close'){close();return;}if(action==='draft'){apply(false);return;}if(action==='adopt'){apply(true);return;}
    if(action==='cancel-decision'){session.decision=null;get('[data-funding-decision]').hidden=true;return;}
    if(action==='confirm-decision'){const fn=session.decision;session.decision=null;if(fn)fn();return;}
    if(action==='select-facility'){session.selected=button.dataset.facilityId;render();return;}
    if(action==='add-facility') {
      if(session.plan.facilities.length>=12)return;
      const facility={facility_id:crypto.randomUUID(),name:null,kind:null,currency:null,unit:null,evidence:emptyEvidence(),schedule:Object.fromEntries(session.calendar.map(month=>[month,emptyRow()]))};
      for(const key of [...NUMBERS,...MONTHS])facility[key]=null;
      session.plan.facilities.push(facility);session.selected=facility.facility_id;markDirty();render();get('[data-facility-field="name"]')?.focus();return;
    }
    if(action==='move-up' || action==='move-down') {
      const index=session.plan.facilities.findIndex(item=>item.facility_id===button.dataset.facilityId),next=index+(action==='move-up'?-1:1);
      if(index<0 || next<0 || next>=session.plan.facilities.length)return;
      [session.plan.facilities[index],session.plan.facilities[next]]=[session.plan.facilities[next],session.plan.facilities[index]];markDirty();render();return;
    }
    if(action==='remove-facility'){const id=session.selected;showDecision('确认从本次计划移除此笔融资及其月度安排。已保存旧版本由项目历史保留；未保存修改将被放弃。',()=>{session.plan.facilities=session.plan.facilities.filter(item=>item.facility_id!==id);session.selected=session.plan.facilities[0]?.facility_id;markDirty();render();});return;}
    if(action==='remove-all'){showDecision('确认从本次草稿移除全部逐笔融资及月度安排。已保存旧版本保留在项目历史；未保存内容不会继续采用。',()=>{session.plan.facilities=[];session.selected=null;markDirty();render();});return;}
    if(action==='remove-outside') {
      const facility=activeFacility(),outside=Object.keys(facility.schedule).filter(month=>!session.calendar.includes(month));
      if(!session.calendar.length){error('尚无已确认预测月份，不能判断哪些旧行在范围外。');return;}
      showDecision(`明确移除本笔融资的预测期外安排：${outside.join('、')}。不会将金额移到其他月份。`,()=>{for(const month of outside)delete facility.schedule[month];markDirty();render();});
    }
  });
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  return {
    async open({projectId,revision,plan,currency,unit,sources=[],legacyRows=[]}={}) {
      if(session?.dirty || applying){close();throw new Error('请先保留或放弃当前融资窗口的修改。');}
      if(dialog.open)hide();returnFocus=document.activeElement;
      const initial=plan?copy(plan):{schema:'model-funding/v1',mode:'aggregate',status:'draft',adoption_note:null,payment_policy:null,interest_policy:null,evidence:emptyEvidence(),facilities:[]};
      session={projectId,revision,plan:initial,original:plan?copy(plan):null,currency,unit:String(unit),unitLabel:({'1':'元','1000':'千元','10000':'万元','1000000':'百万元'})[String(unit)] || String(unit),sources:list(sources).filter(source=>source.role==='minutes' && source.active!==false && typeof source.text==='string'),legacyRows:copy(legacyRows),calendar:[],calendarError:'',selected:initial.facilities?.[0]?.facility_id,dirty:false,confirmed:false,replaceLegacy:false};
      session.plan.facilities ||= [];for(const facility of session.plan.facilities)facility.schedule ||= {};
      const token=++generation;render();dialog.showModal();get('[data-plan-field="mode"]').focus();
      try {
        const data=await api(`/api/projects/${encodeURIComponent(projectId)}/schedule-calendar`);
        if(token!==generation || !session)return;
        const periods=data?.forecast_periods;if(!Array.isArray(periods) || !periods.length || periods.length>60 || periods.some(month=>!validMonth(month)) || periods.join('|')!==[...new Set(periods)].sort().join('|'))throw new Error('Invalid calendar');
        session.calendar=[...periods];for(const facility of session.plan.facilities)for(const month of periods)if(!(month in facility.schedule))facility.schedule[month]=emptyRow();render();
      } catch {
        if(token!==generation || !session)return;session.calendarError='暂未取得预测月份。先保留条款草稿；确认历史试算表后重新打开。';render();
      }
    },
    close,
    hasUnsaved:()=>Boolean(session?.dirty),
    destroy(){if(!close())return false;generation++;dialog.remove();return true;}
  };
}

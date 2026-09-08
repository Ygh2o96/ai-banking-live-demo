/* Operating meaning controls. Pure DOM and caller-owned drafts; no requests or saves. */
export const OPERATING_DRIVERS = new Set(['volume','asp','service_units','service_rate','monthly_revenue']);
const clone = value => JSON.parse(JSON.stringify(value));
const monthOK = value => /^\d{4}-(0[1-9]|1[0-2])$/.test(value || '') && Number(value.slice(0,4)) > 0;
const text = value => value === null || value === undefined ? '' : String(value);
const node = (tag, className, content) => { const el=document.createElement(tag); if(className)el.className=className; if(content!==undefined)el.textContent=content; return el; };
const hasOwn = (value,key) => Object.prototype.hasOwnProperty.call(value,key);

function amount(raw) {
  const value=text(raw).trim();
  if(!value)return null;
  if(value.length>200 || !/^\+?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value))throw new Error('请填写有限、非负的数值；不确定的月份保持空白。');
  const number=Number(value);
  if(!Number.isFinite(number) || number<0 || (number===0 && /[1-9]/.test(value.split(/e/i)[0])))throw new Error('数值超出可保存范围，请核对单位和小数精度。');
  return number;
}
function monthSpan(start,end) {
  if(!monthOK(start)||!monthOK(end)||start>end)throw new Error('请明确起止月份，止月不能早于起月。');
  const serial=month=>Number(month.slice(0,4))*12+Number(month.slice(5))-1;
  const begin=serial(start),last=serial(end);
  if(last-begin>=60)throw new Error('一次最多安排 60 个月。');
  return Array.from({length:last-begin+1},(_,index)=>{const n=begin+index;return `${String(Math.floor(n/12)).padStart(4,'0')}-${String(n%12+1).padStart(2,'0')}`;});
}
export function operatingStageText(row) {
  if(!OPERATING_DRIVERS.has(row.id))return '';
  const modes=row.operatingModes || [row.operating_binding?.mode || 'legacy'];
  if(new Set(modes).size>1)return '各行数值含义不同：最终月值直接替换；基期值在增长前替换。请先核对分期安排。';
  return modes[0]==='effective_monthly'?'情景替换指定月份的最终值，不再叠加该驱动增长。':modes[0]==='baseline_rollforward'?'情景在各适用月份替换增长前输入；原基期和增长区间保持不变。':'兼容口径：情景替换增长前输入，仍沿用原有逐月增长行为。';
}
export function hasEffectiveOperatingMap(row) {
  return row.operating_binding?.mode==='effective_monthly' && row.values && typeof row.values==='object' && !Array.isArray(row.values) && Object.keys(row.values).length>0;
}

export function createOperatingControls({row,index,draft,onDirty=()=>{}}) {
  if(!OPERATING_DRIVERS.has(row.id))return null;
  const prefix=`operating_${index}_`;
  const legacy=!row.operating_binding && !row.operating_binding_required;
  const originalMap=hasOwn(row,'values') && row.values!==null;
  let state=draft?clone(draft):{
    mode:row.operating_binding?.mode || (legacy?'legacy':''),
    format:originalMap?'map':'single',month:monthOK(row.period)?row.period:'',
    anchor:text(row.operating_binding?.anchor_month),through:text(row.operating_binding?.through_month),
    entries:Object.entries(row.values || {}).map(([month,value],i)=>({key:`e${i}`,month,value:text(value)})),
    nextEntry:Object.keys(row.values || {}).length,spanStart:'',spanEnd:'',discardMap:false,converted:Boolean(row.operating_binding)
  };
  let calendar=[];
  const element=node('section','operating-controls');element.dataset.operatingIndex=String(index);
  const heading=node('h4','', '这项数值如何进入预测');element.append(heading);
  const hint=node('p','operating-hint', '原文和原建议值另行保留。选择建模用法不代表管理层已确认。');element.append(hint);
  const makeField=(label,key,type='month')=>{
    const field=node('label','operating-field',label),input=node('input');input.type=type;input.name=prefix+key;input.id=prefix+key;
    if(type==='month')input.autocomplete='off';
    input.value=text(state[key]);input.addEventListener('input',()=>{state[key]=input.value;changed();});field.append(input);return {field,input};
  };
  const makeSelect=(label,key,options)=>{
    const field=node('label','operating-field',label),input=node('select');input.name=prefix+key;input.id=prefix+key;
    options.forEach(([value,label])=>{const option=node('option','',label);option.value=value;input.append(option);});
    if(state[key] && !options.some(([value])=>value===state[key])){const option=node('option','','现有口径无法识别，请重新选择');option.value=state[key];input.append(option);}
    input.value=state[key];input.addEventListener('change',()=>{state[key]=input.value;if(key==='mode' && input.value && input.value!=='legacy')state.converted=true;state.discardMap=false;discard.checked=false;sync();changed();});field.append(input);return {field,input};
  };
  const choices=[['','请选择数值含义'],...(legacy?[['legacy','保留现有兼容口径（增长前输入）']]:[]),['effective_monthly','指定月份的预测值（已包含增长）'],['baseline_rollforward','从基期值按增长率推算']];
  const mode=makeSelect('数值含义','mode',choices);element.append(mode.field);
  const legacyNote=node('p','operating-warning','尚未转换：本行继续作为增长前输入，在每个适用月份按原有累计增长处理；不是该月最终预测值。原有期间和分月值均保留。');element.append(legacyNote);
  const undecided=node('p','operating-warning','本项需要明确数值含义后才能确认。可先保持待确认并保存草稿。');element.append(undecided);
  const effective=node('div','operating-effective');element.append(effective);
  const format=makeSelect('按哪个范围填写','format',[['single','一个指定月份'],['map','逐月填写最终值']]);effective.append(format.field);
  const month=makeField('本行数值适用月份','month');effective.append(month.field);
  const map=node('div','operating-map');effective.append(map);
  map.append(node('p','operating-hint','每月值已包含该驱动增长。缺少的月份不会沿用本行数值，也不会自动补零。其他候选行可以覆盖不同月份。'));
  const span=node('div','operating-span'),start=makeField('起月','spanStart'),end=makeField('止月','spanEnd');span.append(start.field,end.field);map.append(span);
  const fill=node('button','button button-small','列出这些月份，保留已有值');fill.type='button';map.append(fill);
  const entries=node('div','operating-entries');map.append(entries);
  const add=node('button','button button-small','添加一个月份');add.type='button';map.append(add);
  const baseline=node('div','operating-baseline');element.append(baseline);
  const anchor=makeField('基期月份（本行数值所属月）','anchor'),through=makeField('推算至哪个月','through');baseline.append(anchor.field,through.field,node('p','operating-hint','基期月本身保持本行数值；从下一个月开始增长。指定月份的最终值只覆盖当月，不重设后续增长基期。'));
  const discardLabel=node('label','operating-discard'),discard=node('input');discard.type='checkbox';discard.name=prefix+'discardMap';discard.checked=state.discardMap;discardLabel.append(discard,node('span','','我明确移除本行分月值，改用本行单一数值；原始来源保留。'));element.append(discardLabel);
  discard.addEventListener('change',()=>{state.discardMap=discard.checked;changed();});
  const calendarText=node('p','operating-calendar','预测月份待读取；请先核对历史试算表。月份不会自动填写。');element.append(calendarText);
  const error=node('p','operating-error');error.setAttribute('role','alert');error.hidden=true;element.append(error);
  function changed(){error.hidden=true;onDirty(snapshot());}
  function mapHasData(){return originalMap || state.entries.some(entry=>text(entry.month).trim() || text(entry.value).trim());}
  function showError(cause){error.textContent=cause.message;error.hidden=false;}
  function drawEntries(){
    entries.replaceChildren();
    for(const entry of state.entries){
      const line=node('div','operating-entry'),mf=node('label','operating-field','月份'),mi=node('input');mi.type='month';mi.name=prefix+entry.key+'_month';mi.value=entry.month;
      const vf=node('label','operating-field',`最终预测值${row.unit?`（${row.unit}）`:''}`),vi=node('input');vi.type='text';vi.inputMode='decimal';vi.name=prefix+entry.key+'_value';vi.value=entry.value;vi.placeholder='待提供；零需明确填写';
      mi.addEventListener('input',()=>{entry.month=mi.value;changed();});vi.addEventListener('input',()=>{entry.value=vi.value;changed();});mf.append(mi);vf.append(vi);
      const remove=node('button','button button-small','移除此月');remove.type='button';remove.setAttribute('aria-label',`移除 ${entry.month || '未填写'} 月份及其输入值`);
      remove.addEventListener('click',()=>{state.entries=state.entries.filter(item=>item.key!==entry.key);drawEntries();changed();add.focus();});line.append(mf,vf,remove);entries.append(line);
    }
  }
  add.addEventListener('click',()=>{try{if(state.entries.length>=60)throw new Error('每项最多填写 60 个月，请先移除不需要的月份。');state.entries.push({key:`e${state.nextEntry++}`,month:'',value:''});drawEntries();changed();entries.lastElementChild?.querySelector('input')?.focus();}catch(cause){showError(cause);}});
  fill.addEventListener('click',()=>{try{const months=monthSpan(state.spanStart,state.spanEnd),missing=months.filter(month=>!state.entries.some(entry=>entry.month===month));if(state.entries.length+missing.length>60)throw new Error('加入后超过 60 行；现有月份未被移除，请先核对范围。');for(const month of missing)state.entries.push({key:`e${state.nextEntry++}`,month,value:''});drawEntries();changed();}catch(cause){showError(cause);}});
  function sync(){
    const legacyOption=[...mode.input.options].find(option=>option.value==='legacy');if(legacyOption)legacyOption.disabled=Boolean(state.converted);
    legacyNote.hidden=state.mode!=='legacy';undecided.hidden=Boolean(state.mode);
    effective.hidden=state.mode!=='effective_monthly';baseline.hidden=state.mode!=='baseline_rollforward';
    map.hidden=state.format!=='map';month.field.hidden=state.format!=='single';
    discardLabel.hidden=!mapHasData() || (state.mode==='effective_monthly' && state.format==='map') || state.mode==='legacy' || !state.mode;
    const scalar=document.querySelector(`[name="assumption_value_${index}"]`),period=document.querySelector(`[name="assumption_period_${index}"]`);
    if(scalar){scalar.readOnly=state.mode==='effective_monthly' && state.format==='map';scalar.title=scalar.readOnly?'本行数值保留；预测只使用下方逐月值，无后备数值。':'';}
    if(period){period.hidden=state.mode!=='legacy';period.readOnly=state.mode!=='legacy';}
  }
  function snapshot(){return clone(state);}
  function collect(current){
    const result=clone(current),confirmed=result.status==='confirmed';
    if(state.mode==='legacy'){if(!legacy)throw new Error('新假设不能退回未明确的兼容口径。');return result;}
    if(!state.mode){delete result.operating_binding;result.operating_binding_required=true;if(confirmed)throw new Error(`请明确“${row.label || row.id}”是最终月值还是基期推算。`);return result;}
    if(!['effective_monthly','baseline_rollforward'].includes(state.mode))throw new Error('当前数值含义无法识别，请重新选择。');
    result.operating_binding={version:1,mode:state.mode};result.operating_binding_required=true;
    const useMap=state.mode==='effective_monthly' && state.format==='map';
    if(!useMap && (mapHasData() || hasOwn(result,'values'))){
      if(mapHasData() && !state.discardMap)throw new Error('本行仍有分月值。请明确确认移除后，再改用单一数值或基期推算。');
      delete result.values;
    }
    const checkMonth=(value,label)=>{if(!monthOK(value)){if(confirmed || value)throw new Error(`${label}请填写明确月份。`);return;}if(calendar.length && !calendar.includes(value))throw new Error(`${label}不在本项目预测月份内，请核对历史期间。`);};
    if(useMap){
      const values={};
      for(const entry of state.entries){
        if(!entry.month && !text(entry.value).trim())continue;
        if(!monthOK(entry.month))throw new Error('分月值的每一行都需要明确月份；未完成的行仍保留在页面草稿。');
        checkMonth(entry.month,'分月值月份');
        if(hasOwn(values,entry.month))throw new Error(`${entry.month} 重复填写，请合并核对后保留一行。`);
        const value=amount(entry.value);if(confirmed && value===null)throw new Error(`${entry.month} 的最终预测值尚未填写，不能确认。`);values[entry.month]=value;
      }
      if(confirmed && !Object.keys(values).length)throw new Error('请至少填写一个明确月份及最终预测值。');
      result.values=values;
    }else if(state.mode==='effective_monthly'){
      checkMonth(state.month,'指定月份');result.period=state.month;
    }else{
      if(!monthOK(state.anchor) && (confirmed || state.anchor))throw new Error('请明确基期月份。');
      checkMonth(state.through,'推算止月');
      if(state.anchor && state.through && state.anchor>state.through)throw new Error('推算止月不能早于基期月份。');
      if(calendar.length && monthOK(state.anchor)){
        const previous=calendar[0];
        const n=Number(previous.slice(0,4))*12+Number(previous.slice(5))-2;
        const before=`${String(Math.floor(n/12)).padStart(4,'0')}-${String(n%12+1).padStart(2,'0')}`;
        if(!calendar.includes(state.anchor) && state.anchor!==before)throw new Error('基期必须是预测首月的前一个月，或预测期内的月份。');
      }
      result.operating_binding.anchor_month=state.anchor;result.operating_binding.through_month=state.through;result.period=state.anchor;
    }
    if(!useMap && confirmed && (typeof result.value!=='number'||!Number.isFinite(result.value)||result.value<0))throw new Error('本行需填写有限、非负数值后再确认。');
    return result;
  }
  function setCalendar(periods,errorMessage=''){
    calendar=Array.isArray(periods)?periods.filter(monthOK):[];
    calendarText.textContent=calendar.length?`本项目预测月份：${calendar[0]} 至 ${calendar.at(-1)}。基期可选预测首月前一月；日期需你明确填写。`:errorMessage || '预测月份暂不可用；请先确认历史试算表，月份不会自动填写。';
  }
  drawEntries();sync();return {element,snapshot,collect,sync,setCalendar};
}

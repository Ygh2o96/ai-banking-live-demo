/* Banker provisional controls. Caller owns saving, source validation and adoption receipts. */
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const node=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
const array=value=>Array.isArray(value)?value:[];
const originLabels={management_input:'管理层输入（责任归属，不代表公司确认）',banker_provisional:'银行团队暂定假设'};
export const hasProvisionalInputs=governance=>governance?.status==='PROVISIONAL_INTERNAL_REVIEW' || array(governance?.provisional_inputs).length>0;

export function createProvisionalControls({row,index,onDirty=()=>{}}={}) {
  const sticky=row.assumption_origin==='banker_provisional' || Boolean(row.provisional);
  const element=node('section','provisional-controls');element.dataset.provisionalIndex=String(index);
  const originField=node('label','field','假设来源类别'),origin=node('select');origin.name=`assumption_origin_${index}`;
  for(const [value,label] of [['','请选择来源类别'],...Object.entries(originLabels)]){const option=node('option','',label);option.value=value;option.disabled=sticky && value!=='banker_provisional';origin.append(option);}
  origin.value=sticky?'banker_provisional':row.assumption_origin || (row.required_placeholder || !row.owner?'':'management_input');originField.append(origin);element.append(originField);
  const fields=node('div','provisional-fields');element.append(fields);
  fields.append(node('p','field-hint','资料不足时，由银行团队明确提出本版暂定输入。采用仅供内部建模，不代表公司事实或公司认可。'));
  const makeText=(title,name,value,{multiline=false,maxLength}={})=>{const label=node('label','field',title),input=node(multiline?'textarea':'input');input.name=name;if(multiline)input.rows=2;else input.type='text';input.value=typeof value==='string'?value:'';if(maxLength)input.maxLength=maxLength;label.append(input);fields.append(label);return input;};
  const responsible=makeText('暂定假设责任人（由操作人填写）',`provisional_responsible_${index}`,row.provisional?.responsible_person,{maxLength:160});
  const reason=makeText('资料缺口与暂定原因',`provisional_reason_${index}`,row.provisional?.reason,{multiline:true,maxLength:4000});
  reason.placeholder='说明哪项来源尚缺或不足；所选数值与方法请写在“本次采用说明”。';
  const acknowledgement=node('label','check-label provisional-ack'),accept=node('input');accept.type='checkbox';accept.name=`accept_provisional_${index}`;accept.checked=false;
  acknowledgement.append(accept,node('span','','我明确采用本行当前数值、期间及依据，仅用于本版内部建模；状态须选“已采用建模”。'));fields.append(acknowledgement);
  const receipt=node('p','field-hint provisional-receipt');
  receipt.textContent=row.provisional?.acceptance?`已保存操作采用记录：${row.provisional.acceptance.at || '时间未提供'}。这不是公司确认，也不是身份认证。原记录是否仍有效由保存时核对。`:'尚无有效操作采用记录。可以先保存草稿，采用时须填写责任人、原因及本次采用说明。';fields.append(receipt);
  if(row.confirmation_invalidated)fields.append(node('p','notice warning','原操作采用记录已失效：资料、假设或采用状态已变化。请核对本行数值、期间与依据；再次采用时，请选择“已采用建模”并重新勾选。'));
  if(sticky)fields.append(node('p','field-hint','本候选曾作为暂定假设，类别保留。取得公司依据后，请保留或排除此项，另加来源候选。'));
  function resetAcceptance(){accept.checked=false;}
  function sync(){
    if(sticky)origin.value='banker_provisional';
    const provisional=origin.value==='banker_provisional';fields.hidden=!provisional;
    const owner=document.querySelector(`[name="assumption_owner_${index}"]`);
    if(owner){for(const option of owner.options)option.disabled=provisional && !['','banker'].includes(option.value);if(provisional && owner.value!=='banker')owner.value='';}
    if(!provisional)resetAcceptance();
  }
  element.addEventListener('input',event=>{if(event.target!==accept)resetAcceptance();onDirty();});
  element.addEventListener('change',event=>{if(event.target!==accept)resetAcceptance();sync();onDirty();});
  function collect(current){
    const result=JSON.parse(JSON.stringify(current));delete result.accept_provisional;
    const selected=sticky?'banker_provisional':origin.value;
    if(!selected){if(result.status==='confirmed')throw new Error(`请明确“${row.label || row.id}”的假设来源类别。`);delete result.assumption_origin;delete result.provisional;return result;}
    result.assumption_origin=selected;
    if(selected!=='banker_provisional'){delete result.provisional;return result;}
    if(result.owner!=='banker')throw new Error(`“${row.label || row.id}”是暂定假设，请明确选择银行团队为责任归属。`);
    result.provisional={version:1,responsible_person:responsible.value.trim(),reason:reason.value.trim()};
    result.accept_provisional=accept.checked;
    if(result.status==='confirmed' && (!result.provisional.responsible_person || !result.provisional.reason || !result.adoption_note?.trim()))throw new Error(`请填写“${row.label || row.id}”的暂定责任人、原因和本次采用说明；未完成时可先保存为待采用。`);
    return result;
  }
  sync();return {element,sync,collect,resetAcceptance};
}

const display=value=>value===null || value===undefined?'未提供':typeof value==='object'?JSON.stringify(value):String(value);
export function provisionalSummaryHTML(governance,{context='本版模型',compact=false,resolveLabel=value=>value}={}) {
  if(!hasProvisionalInputs(governance))return '';
  const inputs=array(governance?.provisional_inputs);
  const boundary=`${context}含银行团队暂定假设，仅供内部复核。计算检查或资金约束满足，不代表公司确认、独立复核通过或可正式交付。`;
  if(compact)return `<p class="provisional-warning" data-provisional-warning>${esc(boundary)}</p>`;
  return `<section class="provisional-governance" data-provisional-governance><h2>银行团队暂定假设 · 内部复核版</h2><p>${esc(boundary)}</p><p class="field-hint">以下只列本版模型实际使用的候选及月份；后续项目修改不会改写本版记录。</p>${inputs.length?`<details><summary>查看本版暂定输入与采用记录（${inputs.length} 项候选 / 期间记录）</summary><div class="table-scroll" tabindex="0" aria-label="本版暂定假设"><table><thead><tr><th>驱动 / 期间</th><th>采用值 / 实际输入</th><th>责任与资料缺口</th><th>来源与采用记录</th></tr></thead><tbody>${inputs.map(item=>{const responsibility=item.responsibility;const person=typeof responsibility==='object'?responsibility?.responsible_person:responsibility;return `<tr><td>${esc(resolveLabel(item.driver_id) || item.driver_id)}<div>${esc(item.period)}</div><small>候选 ${esc(item.candidate_id || '编号未提供')}</small></td><td>采用 ${esc(display(item.adopted_value))}<br>实际 ${esc(display(item.effective_value))}<br>${esc(item.unit)}</td><td>银行团队 · ${esc(person || '责任人未提供')}<p>${esc(item.reason || '原因未提供')}</p><p>采用说明：${esc(item.adoption_note || '未提供')}</p></td><td>${item.source_quote?`<blockquote>${esc(item.source_quote)}</blockquote>`:'<p>未附原文；依据缺口见暂定原因。</p>'}<small>来源 ${esc(item.source_id || '未关联')}</small><details><summary>操作采用记录</summary><dl><dt>采用时间</dt><dd>${esc(item.acceptance?.at || '未提供')}</dd><dt>项目版本</dt><dd>${esc(item.acceptance?.revision ?? '未提供')}</dd><dt>操作身份</dt><dd>${esc(item.acceptance?.actor==='local_operator'?'本机操作人（未经身份认证）':item.acceptance?.actor || '未提供')}</dd><dt>资料指纹</dt><dd>${esc(item.acceptance?.context_sha256 || '未提供')}</dd><dt>假设指纹</dt><dd>${esc(item.acceptance?.assumption_sha256 || '未提供')}</dd></dl></details></td></tr>`;}).join('')}</tbody></table></div></details>`:'<p class="field-hint">本版标为暂定内部复核版，但未返回逐项记录，请核对已保存模型。</p>'}</section>`;
}

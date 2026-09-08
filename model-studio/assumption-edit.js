/* Preserve the original object and a precise edit path. No model mutation. */
export function monthlySeries(value) {
 if(!value||typeof value!=='object'||Array.isArray(value))return [];
 const entries=Object.entries(value);
 return entries.length&&entries.every(([p,v])=>/^\d{4}-(0[1-9]|1[0-2])$/.test(p)&&typeof v==='number'&&Number.isFinite(v))?entries.sort(([a],[b])=>a.localeCompare(b)):[];
}
export function assumptionChange(item, values) {
 const series=monthlySeries(item.value), raw=values.new_value;
 const hasValue=raw!==undefined&&String(raw).trim()!=='';
 const to=hasValue?Number(raw):null;
 if(hasValue&&!Number.isFinite(to))throw new Error('请输入有效数值。');
 if(!hasValue&&!String(values.text||'').trim())throw new Error('请填写修改数值或意见。');
 const month=values.value_month;
 if(series.length&&hasValue&&!series.some(([p])=>p===month))throw new Error('请选择本项已有的月份。');
 const path=series.length&&hasValue?[month]:typeof item.value==='number'?[]:item.value&&typeof item.value.source_value==='number'?['source_value']:[];
 return {text:values.text||`请将「${item.label}」${month?' '+month:''}调整为 ${to} ${item.unit||''}，并重算受影响的项目。`,
         change:{item_id:item.id,from:item.value,to,value_path:path}};
}

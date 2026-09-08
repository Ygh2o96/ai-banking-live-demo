/* Presentation aliases do not alter typed dimensions, values or source units. */
export function displayUnit(raw, context={}) {
 const scales={'1':context.currency==='CNY'?'元':'基本单位','元':'元','thousand':'千','千元':'千','million':'百万','百万元':'百万'};
 const amount=[context.currency,scales[context.unit]||context.unit].filter(Boolean).join(' · ')||'模型金额单位';
 const names={model_unit:amount,model_unit_per_unit:amount+' / 单位',ratio:'比例（小数）',subscriber:'订阅客户',patient:'患者',order:'订单',days:'天',units:'数量'};
 return String(raw||'').split(/([/*])/).map(t=>t==='*'?' × ':t==='/'?' / ':names[t]||t).join('');
}

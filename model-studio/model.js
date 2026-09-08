/* Synthetic sales / cash illustration. No imported company data or formula execution. */
export const initialInputs=Object.freeze({units:320,growth:6,price:3200,cost:2100,overhead:260000,opening:900000,capex:140000,collection:75});
export const inputFields=Object.freeze([
 {key:'units',label:'首月销量',unit:'辆',min:1,max:100000,step:1},
 {key:'growth',label:'月度销量增长',unit:'%',min:-30,max:50,step:0.5},
 {key:'price',label:'平均售价',unit:'CNY / 辆',min:1,max:100000,step:50},
 {key:'cost',label:'单位采购成本',unit:'CNY / 辆',min:0,max:100000,step:50},
 {key:'overhead',label:'每月固定现金支出',unit:'CNY',min:0,max:100000000,step:10000},
 {key:'opening',label:'期初现金',unit:'CNY',min:0,max:1000000000,step:50000},
 {key:'capex',label:'首月设备付款',unit:'CNY',min:0,max:100000000,step:10000},
 {key:'collection',label:'当月销售当月回款',unit:'%',min:0,max:100,step:5},
]);
const money=n=>Math.round((n+Number.EPSILON)*100)/100;
export function calculate(inputs){
 for(const f of inputFields){const v=inputs[f.key];if(typeof v!=='number'||!Number.isFinite(v)||v<f.min||v>f.max||(f.key==='units'&&!Number.isInteger(v)))throw new Error(`${f.label}需介于 ${f.min} 与 ${f.max} 之间${f.key==='units'?'，并为整数':''}。`);}
 let priorCash=inputs.opening,priorRevenue=0;
 const months=Array.from({length:6},(_,i)=>{
  const units=Math.round(inputs.units*(1+inputs.growth/100)**i),revenue=money(units*inputs.price),variableCost=money(units*inputs.cost);
  const contribution=money(revenue-variableCost-inputs.overhead),collections=money(revenue*inputs.collection/100+priorRevenue*(1-inputs.collection/100));
  const payments=money(variableCost+inputs.overhead+(i===0?inputs.capex:0)),cash=money(priorCash+collections-payments);
  const result={period:`2027-${String(i+1).padStart(2,'0')}`,units,revenue,variableCost,contribution,collections,payments,cash};priorCash=cash;priorRevenue=revenue;return result;
 });
 return {inputs:{...inputs},months,revenue:money(months.reduce((s,m)=>s+m.revenue,0)),contribution:money(months.reduce((s,m)=>s+m.contribution,0)),minimumCash:Math.min(...months.map(m=>m.cash)),closingCash:months.at(-1).cash,closingReceivables:money(months.at(-1).revenue*(1-inputs.collection/100))};
}
export const formatMoney=n=>new Intl.NumberFormat('zh-CN',{maximumFractionDigits:2}).format(n);
export function row(label,value,formula,unit='CNY',period='2027年1–6月'){
 return {label,value,formula,unit,period,basis:'illustration',meaning:'销售与现金收付示意；基于本页可调整的合成输入。',evidence:[{source_id:'synthetic-assumptions',quote:'清禾出行合成情景；输入可在收入驱动及现金安排中查看。'}]};
}
export const values=(model,key)=>Object.fromEntries(model.months.map(m=>[m.period,m[key]]));
export const series=(model,key)=>({points:model.months.map(m=>({period:m.period,value:m[key]}))});
export function sections(model,room='drivers'){
 const baseline=calculate(initialInputs);
 if(room==='cash')return [
  {title:'每月现金余额',type:'time_series',rows:[row('当前情景',series(model,'cash'),'上月现金 + 销售回款 − 采购及固定支出 − 设备付款'),row('初始情景',series(baseline,'cash'),'同一计算方法；使用初始合成输入')]},
  {title:'现金收付明细',type:'data_grid',rows:[row('销售回款',values(model,'collections'),'当月收入 × 当月回款比例 + 上月收入 × 余款比例'),row('现金支出',values(model,'payments'),'当月销量 × 采购单价 + 固定支出 + 首月设备付款'),row('月末现金',values(model,'cash'),'上月现金 + 当月回款 − 当月支出')]},
 ];
 return [
  {title:'销售收入与经营贡献',type:'bar_chart',rows:model.months.map(m=>row(m.period,{series:{销售收入:m.revenue,经营贡献:m.contribution}},'收入 = 销量 × 售价；经营贡献 = 收入 − 采购成本 − 固定支出'))},
  {title:'销售拆解',type:'data_grid',rows:[row('销量',values(model,'units'),'首月销量 × (1 + 月增长率)^月份序号，四舍五入至整辆','辆'),row('销售收入',values(model,'revenue'),'销量 × 售价'),row('经营贡献',values(model,'contribution'),'销售收入 − 采购成本 − 固定支出')]},
 ];
}

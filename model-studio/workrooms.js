/* Stable navigation and projections of shared business objects. No financial calculations. */
export const ROOMS=[
 ['todos','Banker 待办','回复资料问题，裁决关键判断，查看已办记录'],
 ['alchemy','业务炼金坊','理解公司，汇聚资料，准备下一轮讨论'],
 ['drivers','动力设计室','从经营事实建立适合这家公司的预测驱动'],
 ['chassis','底盘装配间','重构历史，调查会计变动，检查模型接线'],
 ['assembly','总装调校室','查看完整三表，比较和调整工作情景'],
 ['treasury','资金调度室','查看月度收付、现金需求和融资安排'],
 ['special','专项实验室','盈亏平衡、盈利路径与现金跑道'],
 ['quality','验证室','核对勾稽、约束、敏感性和复核证据'],
 ['dispatch','发报室','讨论同版模型的中英文文稿与交付']
];
export const roomTitle=id=>ROOMS.find(r=>r[0]===id)?.[1]||'主工作台';
export const roomProjection=(run,id)=>run?.workrooms?.rooms.find(r=>r.id===id);
export function visibleItems(run,id) {
 const items=run?.workpapers?.at(-1)?.items||[];
 if(id==='overview')return items;
 const selected=new Set(roomProjection(run,id)?.item_ids||[]);
 return items.filter(i=>selected.has(i.id));
}
export function roomIntro(run,project,id,esc) {
 if(id==='overview')return '';
 const r=roomProjection(run,id),row=ROOMS.find(r=>r[0]===id);
 const kinds={tb:'历史 TB',mdd:'管理层访谈',fdd_note:'FDD 纪要',business_note:'业务纪要',model_meeting:'模型讨论反馈',other_note:'补充资料'};
 return `<section class="room-intro"><p>${esc(row?.[2]||'')}</p>
 ${id==='alchemy'?`<div class="room-source-list">${(project.sources||[]).map(s=>`<article><span class="badge neutral">${esc(kinds[s.source_kind]||kinds[s.role]||'资料')}</span><strong>${esc(s.name)}</strong><small>来源版本 ${esc(s.sha256?.slice(0,12))}</small></article>`).join('')||'<p>先上传已有资料；可以分批补充。</p>'}</div><button class="button" data-step="intake">上传 / 更新资料 ↗</button>`:''}
 ${id==='chassis'?'<button class="button" data-step="precedents">查看先例工坊 ↗</button>':''}
 </section>`;
}
const statements=[['利润表',[['revenue','营业收入'],['cogs','营业成本'],['gross_profit','毛利'],['selling_expense','销售费用'],['admin_expense','管理费用'],['research_expense','研发费用'],['depreciation','折旧'],['interest_expense','利息费用'],['tax_expense','所得税'],['net_income','净利润']]],
 ['资产负债表',[['cash','现金'],['receivables','应收款'],['inventory','存货'],['net_ppe','固定资产净额'],['other_assets','其他资产'],['assets','资产总额'],['payables','应付款'],['debt','借款'],['tax_payable','应付税款'],['other_liabilities','其他负债'],['liabilities','负债总额'],['equity','权益合计'],['balance_check','配平差额']]],
 ['现金流量表',[['opening_cash','期初现金'],['cfo','经营现金流'],['cfi','投资现金流'],['cff','融资现金流'],['net_cash_flow','现金净变动'],['cash','期末现金'],['funding_gap','融资缺口']]]];
export function financialTables(model,esc,fmt,room='assembly') {
 const groups=room==='treasury'?statements.slice(-1):statements;
 const rows=model.forecast||[];
 if(!rows.length)return '';
 return `<div class="room-statements">${groups.map(([title,keys])=>`<details open><summary>${title} · 月度预测</summary><div class="table-scroll"><table><thead><tr><th>科目</th>${rows.map(r=>`<th>${esc(r.period)}</th>`).join('')}</tr></thead><tbody>${keys.map(([k,label])=>`<tr><th>${label}</th>${rows.map(r=>`<td class="numeric">${esc(fmt(r[k]))}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`).join('')}</div>`;
}

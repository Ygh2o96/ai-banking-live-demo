/* Deterministic projection of calculated business nodes, no inferred status. */
import {displayUnit} from './model-units.js';
export function renderBusinessDrivers(view, {escape:esc,format:fmt,id='',context={}}) {
 if(!view)return '';
 const destinations={revenue:'收入',cogs:'现金营业成本',selling_expense:'销售费用',admin_expense:'管理费用',research_expense:'研发费用'};
 const nodes=view.nodes, modules=[...new Set(nodes.map(n=>n.module))];
 return `<details class="business-drivers" data-h-detail="drivers-${esc(id)}" open>
  <summary><strong>业务驱动怎样进入模型</strong></summary>
  <p>本版 agent 选择的业务组成和实际测算。核心输入及修改入口在假设看板中；本表随同版模型重算。</p>
  ${modules.map(module=>`<details data-h-detail="driver-module-${esc(id)}-${esc(module)}"><summary>${nodes.filter(n=>n.module===module).map(n=>esc(n.label)).join(' · ')}</summary>
   <div class="table-wrap"><table><thead><tr><th>业务变量</th>${view.periods.map(p=>`<th>${esc(p)}</th>`).join('')}</tr></thead><tbody>
   ${nodes.filter(n=>n.module===module).map(n=>`<tr><td><strong>${esc(n.label)}</strong><br><small>${esc(displayUnit(n.unit,context))}</small></td>${view.periods.map(p=>`<td>${esc(fmt(n.values[p]))}</td>`).join('')}</tr>`).join('')}
   </tbody></table></div>
   ${nodes.filter(n=>n.module===module).map(n=>`<p><strong>${esc(n.label)}</strong>：${esc(n.rationale)}${Object.entries(view.outputs).filter(([,node])=>node===n.id).map(([sink])=>` <span class="badge neutral">进入${esc(destinations[sink]||sink)}</span>`).join('')}</p>`).join('')}
  </details>`).join('')}
 </details>`;
}

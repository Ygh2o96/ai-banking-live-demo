/* A projection of actual formula connections and backend movement checks. */
export function renderFinancialWiring(wiring, {escape:esc, format:fmt, id=''}) {
 if(!wiring)return '';
 const {summary,scope,bridges}=wiring;
 const failed=bridges.filter(b=>!b.passed);
 const periods=[...new Set(bridges.map(b=>b.period))];
 return `<details class="financial-wiring" data-h-detail="wiring-${esc(id)}">
  <summary><strong>模型内部走线与配平</strong> · ${esc(summary.module_count)} 个明细组件 · ${failed.length?`${esc(failed.length)} 项变动需要解释`:'已登记的余额变动勾稽一致'}</summary>
  <p>查看本版公式怎样连接，以及期初余额加上哪些变动得到期末余额。${esc(scope.currency)} · ${esc(scope.unit)}。</p>
  <p class="field-hint">按本版选定的聚合政策检查；计算勾稽不代表资料充分或完成独立复核。</p>
  ${failed.map(b=>`<p class="notice warning"><strong>${esc(b.period)} · ${esc(b.label)}</strong>：模型期末 ${esc(fmt(b.closing))}，按已登记变动应为 ${esc(fmt(b.expected_closing))}，差额 ${esc(fmt(b.residual))}。</p>`).join('')}
  <p>${wiring.modules.map(m=>`<span class="badge neutral">${esc(m.label)}</span>`).join(' ')}</p>
  ${periods.map(p=>`<details data-h-detail="wiring-${esc(id)}-${esc(p)}"><summary>${esc(p)} · 余额与变动</summary>
   ${bridges.filter(b=>b.period===p).map(b=>`<details data-h-detail="wiring-${esc(id)}-${esc(p)}-${esc(b.account)}"><summary><strong>${esc(b.label)}</strong> · 期初 ${esc(fmt(b.opening))} → 期末 ${esc(fmt(b.closing))}${b.passed?'':' · 有差额'}</summary>
    <table><thead><tr><th>组成</th><th>本版金额</th></tr></thead><tbody>
    <tr><td>期初余额</td><td>${esc(fmt(b.opening))}</td></tr>
    ${b.contributions.map(c=>`<tr><td>${esc(c.label)}<br><small>${esc(c.node)}</small></td><td>${esc(fmt(c.signed_amount))}</td></tr>`).join('')}
    ${b.constant_policy?'<tr><td colspan="2">本版明确采用余额不变政策</td></tr>':''}
    <tr><td>按已登记变动计算的期末</td><td>${esc(fmt(b.expected_closing))}</td></tr>
    <tr><td>资产负债表实际计算的期末</td><td>${esc(fmt(b.closing))}</td></tr>
    <tr><td>差额</td><td>${esc(fmt(b.residual))}</td></tr></tbody></table>
   </details>`).join('')}</details>`).join('')}
  <details data-h-detail="wiring-${esc(id)}-connections"><summary>查看实际跨模块公式引用</summary>
   <table><thead><tr><th>上游公式节点</th><th>下游公式节点</th></tr></thead><tbody>${wiring.connections.map(c=>`<tr><td>${esc(c.source)}</td><td>${esc(c.target)}</td></tr>`).join('')}</tbody></table>
   ${wiring.connections_truncated?'<p class="field-hint">此处展示部分引用，完整连接保存在本版工具结果中。</p>':''}
  </details></details>`;
}

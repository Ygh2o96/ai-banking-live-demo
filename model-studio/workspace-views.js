/* Layout selection only. Data and actions are supplied by the supervisor host. */
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderWorkspaceView(view,{card,remaining}) {
 if(!view)return '';
 const supported=new Set(['assumption_cards','record_table','milestone_timeline','stage_flow']);
 if(view.sections.some(s=>!supported.has(s.component)))return remaining();
 return `<section class="adaptive-view"><div class="supervisor-section-head"><h2>${esc(view.title)}</h2><span class="muted">按业务组织的工作视图</span></div><p>${view.paradigms.map(p=>esc(p.label)).join(' · ')}</p>${view.sections.map(s=>`<section><h3>${esc(s.title)}</h3><div class="adaptive-${s.component}" role="list">${s.items.map(i=>`<div role="listitem">${card(i)}</div>`).join('')}</div></section>`).join('')}${remaining(view.remaining_item_ids,view.attention_item_ids)}</section>`;
}

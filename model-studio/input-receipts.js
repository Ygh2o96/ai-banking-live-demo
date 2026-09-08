import {roomTitle} from './workrooms.js';
export const progressLabels={received:'已收到指令',acknowledged:'主 agent 已读取',workpaper_updated:'已更新底稿',calculated:'已完成试算',calculated_with_issues:'试算完成 · 有检查项待处理',model_adopted:'已采用模型'};
export function renderInputReceipt(input, esc, {showText=true}={}) {
 const stage=input.execution_stage||input.status;
 const calculations=input.calculation_receipts||[],models=input.model_receipts||[],papers=input.workpaper_receipts||[];
 return `<div class="input-receipt"><span class="badge ${stage==='calculated_with_issues'?'warning':'neutral'}">${esc(progressLabels[stage]||stage)}</span>${showText?`<span class="harness-verbatim">${esc(input.text)}</span>`:''}${input.workspace?`<small>${esc(roomTitle(input.workspace.room_id))} · ${esc({discussion:'讨论与解释',trial:'试算方案',revision:'修改工作版'}[input.intent]||'修改工作版')}</small>`:''}
 ${papers.slice(-1).map(r=>`<small>${r.current?'已更新':'此前更新'}底稿 V${esc(r.version)} · ${esc(r.explanation)}</small>`).join('')}
 ${calculations.slice(-1).map(r=>`<small>${r.current?'已进入本版试算':'此前已试算'} · ${esc(r.item_ids.length)} 个关联项 · ${esc(r.model_hash.slice(0,8))}${r.failed_check_ids.length?` · ${esc(r.failed_check_ids.length)} 项检查待处理`:' · 采用模型另行记录'}</small>`).join('')}
 ${models.slice(-1).map(r=>`<small>${r.current?'已采用':'此前采用'}模型 ${esc(r.model_id.slice(0,8))} · ${esc(r.item_ids.length)} 个关联项</small>`).join('')}
 ${!papers.length&&!calculations.length&&!models.length?'<small>后续实施结果将单独记录</small>':''}</div>`;
}

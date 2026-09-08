/* Read-only projection of the separately persisted modelling Analyst. */
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={starting:'正在开始',running:'正在建模',waiting:'本轮工作已返回',completed:'本轮工作已返回',failed:'本轮工作未完成',stopped:'已停止',paused:'已暂停'};
export function workerStatusHTML(run){
 if(!run||(run.role_id&&run.role_id!=='modelling'))return '';
 const worker=run.worker_state;
 if(!worker?.run_id)return '<p class="field-hint" data-worker-status="unassigned">建模 Analyst · 尚未派发建模任务</p>';
 const current=worker.current===true&&Number.isInteger(run.epoch)&&worker.parent_epoch===run.epoch&&run.control==='active'&&run.source_current===true&&run.engine_current!==false;
 const status=current?(labels[worker.status]||'查看任务记录'):'前次任务记录';
 const summary=typeof worker.last_message==='string'&&worker.last_message.trim()?worker.last_message:typeof worker.summary==='string'?worker.summary:'';
 const hasFiles=Array.isArray(worker.artifacts)&&worker.artifacts.length>0;
 return `<details class="reporting-record reporting-worker-summary" data-h-detail="reporting-worker-summary" data-worker-status="${esc(current?worker.status:'historical')}"><summary>建模 Analyst · ${esc(status)}</summary><p>负责模型搭建、计算与核对，结果由华泰建模专家向你汇报。</p>${summary?`<p class="harness-verbatim">${esc(summary)}</p>`:''}${hasFiles?'<p class="field-hint">成果文件保留在对应的对话记录中。</p>':''}</details>`;
}

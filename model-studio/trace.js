import {provisionalSummaryHTML} from './provisional.js';
/** Read-only frozen-build trace viewer, contract v1. No saves or recomputation. */
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rows=v=>Array.isArray(v)?v:[];
const finite=v=>typeof v==='number' && Number.isFinite(v);
const present=v=>v!==null && v!==undefined;
const amount=v=>finite(v)?new Intl.NumberFormat('zh-CN',{maximumFractionDigits:12}).format(v):'—';
const plain=v=>typeof v==='string'?v:finite(v)?String(v):typeof v==='boolean'?(v?'是':'否'):v==null?'未提供':JSON.stringify(v);
const UNITS={ratio:'比例（小数）',days:'天',units:'数量','CNY/unit':'元 / 单位','RMB/unit':'元 / 单位','HKD/unit':'港元 / 单位','USD/unit':'美元 / 单位'};
const SCALE={'1':'元','1000':'千元','10000':'万元','1000000':'百万元'};
const nodeIndexes=new WeakMap();
export function resolveTraceBinding(result,{scope,period,field,value,aliases=[]}={}) {
  if(!finite(value))return {reason:'本项未提供有限数值'};
  let id;
  if(result.display_bindings!==undefined) {
    if(result.display_bindings?.schema!=='model-display-bindings/v1')return {reason:'本版追溯映射格式未被支持'};
    id=result.display_bindings[scope]?.[period]?.[field];
  } else if(scope==='forecast') {
    const matches=rows(result.lineage).filter(item=>item.period===period && [field,...aliases].includes(item.metric));
    const ids=[...new Set(matches.map(item=>item.node))];if(ids.length>1)return {reason:'本项存在不同的计算绑定',mismatch:true};id=ids[0];
  }
  if(typeof id!=='string' || !id)return {reason:'本版未提供此项追溯记录'};
  if(!nodeIndexes.has(result)) {const index=new Map();for(const node of rows(result.workbook_spec?.nodes))index.set(node.id,index.has(node.id)?null:node);nodeIndexes.set(result,index);}
  const node=nodeIndexes.get(result).get(id);
  if(!node || !finite(node.calculated_value) || node.calculated_value!==value)return {reason:'数值与计算绑定不一致，暂不可追溯',mismatch:true};
  return {nodeId:id};
}
const STATES={management_input:'管理层输入（责任归属，不代表公司确认）',banker_provisional:'银行团队暂定假设',PROVISIONAL_INTERNAL_REVIEW:'含暂定假设，仅供内部复核',REVIEW_COPY:'复核用工作版本',local_operator:'本机操作人（未经身份认证）',effective_monthly:'指定月份的预测值，已包含增长',baseline_rollforward:'从基期值按增长率推算',tb_input:'历史试算表输入',assumption_input:'建模假设输入',funding_input:'融资条款输入',funding_facility:'本笔融资依据',funding_plan:'整体融资依据',manual:'人工采用依据',resolved:'已定位',verified:'指纹核对一致',unresolved:'来源未能完整定位',missing:'未提供',mismatch:'指纹或内容不一致',legacy_unavailable:'旧版缺少核对记录',ambiguous:'原文位置有歧义',confirmed:'本版采用',adopted:'本版采用',excluded:'本模型不采用',proposed:'原候选，尚未采用',conflicted:'存在分歧',calculation:'计算值',derived:'计算值',literal:'计算常量',constant:'计算常量',calendar:'期间参数',policy:'建模政策',assumption:'建模假设',source:'来源输入',tb:'历史试算表',minutes:'讨论纪要',minutes_quote:'纪要原话',operator_assumption:'操作人假设',scenario:'情景输入',funding:'融资条款',empty_aggregation:'空汇总，不代表已确认的零',value:'输入值'};
const FIELDS={assumption_origin:'假设来源类别',provisional:'暂定假设记录',assumption_governance:'本版假设治理记录',provisional_inputs:'本版实际使用的暂定输入',responsibility:'责任记录',responsible_person:'暂定假设责任人（操作人填写）',acceptance:'操作采用记录',confirmation_invalidated:'采用失效原因',actor:'操作身份',at:'采用时间',revision:'项目版本',context_sha256:'采用资料指纹',assumption_sha256:'采用假设指纹',driver_id:'业务驱动',schema:'记录格式',operating_binding:'预测值口径',anchor_month:'基期月份',through_month:'推算截至月份',mode:'计算方式',version:'口径版本',raw_numeric:'原文数值',raw_unit:'原文单位',name:'融资名称',confirmation_scope:'采用范围',payment_policy:'模型支付顺序',interest_policy:'计息口径',normalized_decimal:'精确读取金额',raw_preview:'原表单元格',normalized_record:'按确认口径读取的记录',normalization:'历史读取口径',amounts_decimal:'精确读取金额',scenario_applied:'是否应用本情景',cash_allocation:'总额与月份分配',allocated_values:'明确分月金额',offset_unit:'位置计数口径',basis:'金额性质',sign_convention:'原始借贷符号',profit_closure:'利润结转口径',pl_basis:'历史损益口径',consolidation_scope:'主体范围',header_row:'表头行',fiscal_year_start_month:'财政年度起始月',currency:'币种',opening_period:'期初对应月份',source_proposal:'来源原建议',original_proposed_value:'来源原建议',proposed_value:'原建议值',adopted_value:'本版采用值',effective_value:'本版实际输入',model_value:'本版模型值',scenario_value:'本情景值',value:'数值',values:'分月采用值',original_value:'原始值',original_unit:'原始单位',unit:'单位',period:'适用期间',source_date:'讨论日期',date:'日期',confirmed_at:'采用时间',accepted_at:'采用时间',adoption_note:'采用说明',note:'说明',owner:'责任归属',candidate_id:'候选记录编号',facility_id:'融资记录编号',status:'状态',sheet:'原工作表',row:'原行号',row_number:'原行号',row_numbers:'原行号',field:'原字段',column:'原列',cell:'原单元格',account_code:'科目编码',account_name:'科目名称',entity:'主体',line:'原文行号',closing:'期末原始值',opening:'期初原始值',debit:'借方原始值',credit:'贷方原始值',source_id:'来源编号',source_name:'来源名称',source_row_id:'原行记录编号',source_locator:'原文位置',locator:'原文位置',char_start:'起始字符位置',char_end:'结束字符位置',line_start:'起始行',line_end:'结束行',page:'页码',text:'原文上下文',quote:'逐字原话',before:'前文',after:'后文',normalized:'按确认口径读取的记录',raw:'原始记录',preview:'原表片段',source:'来源',context:'原文上下文',headers:'原列名称',rows:'原表行',raw_value:'原始值',normalized_value:'按确认口径读取的值',source_quote:'原话',reason:'说明',basis:'采用口径',kind:'记录类型',conditions:'适用条件',conditions_met:'条件是否满足',original_proposal:'来源原建议',adopted:'本版采用',effective:'本版实际输入',scenario:'本情景输入'};
function recordHTML(value,depth=0) {
  if(value===null || value===undefined)return '<span class="trace-muted">未提供</span>';
  if(typeof value!=='object')return esc(plain(value));
  if(Array.isArray(value))return `<ol class="trace-record-list">${value.map(item=>`<li>${recordHTML(item,depth+1)}</li>`).join('')}</ol>`;
  return `<dl class="trace-facts">${Object.entries(value).map(([key,item])=>`<div><dt>${esc(FIELDS[key] || key.replaceAll('_',' '))}</dt><dd>${['owner','status','assumption_origin','actor'].includes(key) && typeof item==='string'?esc(key!=='owner'?(STATES[item] || item):({management:'管理层（责任归属记录，不代表已确认）',banker:'银行团队',accountant:'会计师'}[item] || item)):recordHTML(item,depth+1)}</dd></div>`).join('')}</dl>`;
}
function contextHTML(context,quote) {
  if(context===null || context===undefined)return '<p class="trace-muted">本版未保留可显示的上下文。</p>';
  if(typeof context.text==='string') {
    const chars=Array.from(context.text),start=context.quote_start,end=context.quote_end;
    const located=context.offset_unit==='unicode_codepoints' && Number.isInteger(start) && Number.isInteger(end) && start>=0 && end>=start && end<=chars.length && chars.slice(start,end).join('')===quote;
    return `<p class="trace-context-text">${located?esc(chars.slice(0,start).join(''))+'<mark>'+esc(chars.slice(start,end).join(''))+'</mark>'+esc(chars.slice(end).join('')):esc(context.text)}</p>${located?'':'<p class="trace-muted">未取得可确认的高亮位置，保留上下文原样供核对。</p>'}`;
  }
  return recordHTML(context);
}
let instance=0;
export function createTraceViewer({api,resolveLabel=label=>label}={}) {
  if(typeof api!=='function')throw new TypeError('Trace viewer requires read-only api.');
  const uid=`trace-${++instance}`,dialog=document.createElement('dialog');dialog.className='trace-dialog';dialog.setAttribute('aria-labelledby',`${uid}-title`);document.body.append(dialog);
  let session=null,sequence=0;
  const find=selector=>dialog.querySelector(selector);
  const label=value=>resolveLabel(String(value || '未命名输入')) || String(value || '未命名输入');
  const stateLabel=value=>STATES[value] || String(value || '未提供');
  const units=value=>UNITS[value] || value || '单位未提供';
  function close() {sequence++;const focus=session?.returnFocus;session=null;if(dialog.open)dialog.close();if(focus?.isConnected)focus.focus({preventScroll:true});else document.querySelector('#workspace')?.focus({preventScroll:true});}
  function metadataHTML() {
    const b=session.identity,current=Number.isInteger(b?.current_project_revision) && Number.isInteger(session.currentProjectRevision)?Math.max(b.current_project_revision,session.currentProjectRevision):b?.current_project_revision??session.currentProjectRevision;
    const old=b && present(current) && b.source_revision!==current;
    return `<div class="trace-version"><span>${esc(session.buildName || '已保存模型')} · 版本 ${esc(session.buildId.slice(0,8))}</span><span>${b?`资料版本 ${esc(b.source_revision)}`:'正在核对版本'} · ${esc(session.currency || '')} ${esc(SCALE[session.unit] || session.unit || '单位未提供')}</span></div>${old?`<p class="trace-notice" data-trace-old-version>正在核对资料版本 ${esc(b.source_revision)} 生成的模型；当前项目为 ${esc(current)}。以下计算及原文均来自旧版。</p>`:''}`;
  }
  function identityHTML() {
    const b=session.identity;if(!b)return '';
    return `<details class="trace-technical"><summary>版本与文件指纹</summary><dl class="trace-facts">${[['模型版本',b.id],['模型引擎',b.engine_id],['资料版本',b.source_revision],['模型指纹',b.model_hash],['模型记录指纹',b.model_json_sha256],['资料快照指纹',b.project_sha256],['Excel 指纹',b.xlsx_sha256],['生成时间',session.createdAt || '未提供']].map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></details>`;
  }
  function warningHTML(items) {return rows(items).length?`<ul class="trace-warnings">${items.map(item=>`<li>${esc(stateLabel(item))}</li>`).join('')}</ul>`:'';}
  function evidenceHTML(evidence,nodeId) {
    if(!rows(evidence).length)return '<p class="trace-muted">本节点未提供直接来源。计算值请沿上游输入继续核对；常量或政策不能视为已确认来源事实。</p>';
    return rows(evidence).map((e,index)=>`<article class="trace-evidence"><div class="trace-inline"><strong>${esc(e.source_name || stateLabel(e.kind))}</strong><span class="trace-tag">${esc(stateLabel(e.status))}</span></div>${e.quote?`<blockquote>${esc(e.quote)}</blockquote>`:'<p class="trace-muted">未提供逐字引文。</p>'}<div class="trace-values">${[['来源原建议',e.original_proposed_value],['本版采用',e.adopted_value],['本情景输入',e.scenario_value]].filter(([,v])=>present(v)).map(([k,v])=>`<div><span>${k}</span><div class="trace-layer-value">${recordHTML(v)}</div></div>`).join('')}</div>${e.assumption_origin?`<p>假设来源：${esc(stateLabel(e.assumption_origin))}</p>`:''}${e.provisional?`<details><summary>本输入的暂定责任与操作采用</summary>${recordHTML(e.provisional)}</details>`:''}${e.note?`<p>${esc(e.note)}</p>`:''}<p class="trace-authority">${esc(e.authority || '采用仅用于本版建模；不代表公司或贷款人确认。')}</p>${e.key?`<button type="button" data-trace-source-index="${index}">查看本版原始依据</button>`:'<p class="trace-muted">未提供可定位的来源锚点。</p>'}${e.locator?`<details><summary>原文位置记录</summary>${recordHTML(e.locator)}</details>`:''}</article>`).join('');
  }
  function nodeHTML(data,view) {
    const n=data.node,title=view.displayLabel || label(n.label),deps=rows(data.dependencies),p=data.pagination || {};
    return `<section><p class="trace-eyebrow">${esc(stateLabel(n.classification || n.kind))} · ${esc(n.period || '期间未提供')}</p><h3 class="trace-result-label">${esc(title)}</h3><div class="trace-result-value">${amount(n.value)} <span>${esc(units(n.unit))}</span></div>${!finite(n.value)?'<p class="trace-notice">本节点未提供有效数值；未知不等于零。</p>':''}<p class="trace-muted">本版模型值；只读核对，不更改已保存模型。</p>${warningHTML(data.warnings)}${provisionalSummaryHTML(data.assumption_governance,{compact:true,context:'本版追溯模型'})}<section class="trace-section"><h3>这项数字如何计算</h3><p class="trace-formula" data-trace-logical>${esc(n.formula?.logical || (n.expr===null?'本节点为直接输入，未提供计算表达式。':'未提供可显示的计算表达式。'))}</p><details class="trace-technical"><summary>查看保存的 Excel 公式与完整表达式</summary><p>输出工作簿位置：<code>${esc(n.workbook?.sheet || '未提供')}!${esc(n.workbook?.cell || '未提供')}</code></p><pre>${esc(n.formula?.excel || '此单元格无保存的 Excel 公式。')}</pre><p>保存的 Excel 缓存值：${esc(plain(n.saved_excel_value))}<br>模型记录精确值：${esc(plain(n.value))}</p><p class="trace-muted">缓存值和模型记录分别展示；此处未启动重新计算。</p><pre>${esc(JSON.stringify(n.expr,null,2))}</pre></details></section><section class="trace-section"><div class="trace-section-head"><h3>直接参与计算的输入</h3><span class="trace-muted">${Number.isInteger(p.total)?(p.total===0?'共 0 项':`共 ${p.total} 项 · 当前 ${Number(p.offset || 0)+1}–${Number(p.offset || 0)+deps.length}`):'总数未提供'}</span></div>${deps.length?`<div class="trace-table-scroll" tabindex="0" aria-label="直接计算输入"><table><thead><tr><th>输入 / 期间</th><th>本版数值</th><th>使用次数</th><th>继续核对</th></tr></thead><tbody>${deps.map((d,index)=>`<tr><td>${esc(label(d.label))}<small>${esc(d.period || '期间未提供')} · ${esc(units(d.unit))}</small></td><td class="trace-numeric">${amount(d.value)}</td><td>${rows(d.occurrences).length || '未提供'}</td><td><button type="button" data-trace-dependency="${index}">继续查看<span class="trace-sr-only"> ${esc(label(d.label))} ${esc(d.period)}</span></button></td></tr>`).join('')}</tbody></table></div>`:'<p class="trace-muted">没有返回直接引用输入。请同时核对上方表达式、常量和来源说明。</p>'}<div class="trace-pagination">${p.offset>0?'<button type="button" data-trace-page="prev">上一组输入</button>':''}${Number.isInteger(p.next_offset)?'<button type="button" data-trace-page="next">下一组输入</button>':''}</div><p class="trace-muted">同一输入在表达式中重复出现时，列表合并显示；上方表达式仍保留原顺序与全部使用次数。</p></section><section class="trace-section"><h3>原始依据与本版采用</h3>${evidenceHTML(data.evidence,n.id)}</section></section>`;
  }
  function sourceHTML(data) {
    const source=data.source || {},integrity=data.integrity || {},valid=integrity.status==='verified';
    const href=valid && source.id?`/api/builds/${encodeURIComponent(session.buildId)}/trace/source/${encodeURIComponent(source.id)}/download`:null;
    return `<section><p class="trace-eyebrow">${esc(stateLabel(data.kind))} · 本版资料快照</p><h3 class="trace-result-label">${esc(source.name || '来源未提供')}</h3><div class="trace-inline"><span class="trace-tag">${esc(stateLabel(data.status))}</span><span class="trace-tag">${esc(stateLabel(integrity.status))}</span></div><p class="trace-notice${valid?' trace-verified':''}">${esc(integrity.message || '来源原件尚未核对；以下仅为已保存的快照内容。')}</p>${warningHTML(data.warnings)}${provisionalSummaryHTML(data.assumption_governance,{compact:true,context:'本版追溯模型'})}<dl class="trace-facts"><div><dt>来源类型</dt><dd>${esc(stateLabel(source.role))}</dd></div><div><dt>保存日期</dt><dd>${esc(source.uploaded_at || '未提供')}</dd></div><div><dt>在本版的使用状态</dt><dd>${source.active_in_build===true?'本版有效资料':source.active_in_build===false?'本版留存资料':'未提供'}</dd></div></dl>${data.quote?`<section class="trace-section"><h3>逐字引文</h3><blockquote class="trace-quote">${esc(data.quote)}</blockquote></section>`:''}<section class="trace-section"><h3>${source.role==='tb'?'原表位置与冻结记录':'原文位置与上下文'}</h3>${data.locator?recordHTML(data.locator):'<p class="trace-muted">未提供可确认的原文位置；不会猜测第一处文字或原表单元格。</p>'}<div class="trace-context">${contextHTML(data.context,data.quote)}</div>${source.role==='tb'?'<p class="trace-muted">原始行、列与按确认口径读取的记录分别核对；上游模型的 Excel 地址不等于来源原表地址。</p>':''}</section><section class="trace-section"><h3>原建议、本版采用与情景输入</h3>${present(data.values)?recordHTML(data.values):'<p class="trace-muted">未提供分层数值记录。</p>'}${data.note?`<p>采用说明：${esc(data.note)}</p>`:''}${data.candidate?`<details data-trace-candidate><summary>本版候选与采用记录</summary>${recordHTML(data.candidate)}</details>`:''}${data.facility?`<details data-trace-facility><summary>本笔融资采用记录</summary>${recordHTML(data.facility)}</details>`:''}<p class="trace-authority">${esc(data.authority || '本版建模采用不代表公司、贷款人或复核人的确认。')}</p></section><details class="trace-technical"><summary>原件指纹及记录编号</summary><p>SHA-256 · ${esc(source.sha256 || '未提供')}</p><p>来源记录 · ${esc(source.id || '未提供')}</p></details>${href?`<a class="trace-download" href="${href}" download>下载已核对的本版原件</a>`:'<p class="trace-muted">原件无法核对，不提供替代下载。已保存上下文仍保留供识别缺口。</p>'}</section>`;
  }
  function render({focus=false}={}) {
    if(!session)return;const view=session.stack.at(-1);
    dialog.innerHTML=`<header class="trace-head"><div><p class="trace-eyebrow">计算与原始依据</p><h2 id="${uid}-title" tabindex="-1">这项数字从哪里来</h2></div><button type="button" data-trace-close aria-label="关闭计算追溯">关闭</button></header><div class="trace-body">${metadataHTML()}<nav class="trace-nav" aria-label="追溯路径"><button type="button" data-trace-back${session.stack.length<2?' disabled':''}>返回上一步</button><span>${session.stack.length} 层 · ${view?.kind==='source'?'原始依据':'计算输入'}</span></nav><div class="trace-status" role="status" aria-live="polite">${session.loading?'正在读取本版保存的记录…':''}</div><div class="trace-content" aria-busy="${session.loading}">${session.error?`<div class="trace-error" role="alert" tabindex="-1"><strong>本次追溯未能完成</strong><p>${esc(session.error)}</p><button type="button" data-trace-retry>重试本版请求</button></div>`:session.loading?'<p class="trace-muted">页面不会改用最新项目或其他模型的来源。</p>':view?.data?(view.kind==='source'?sourceHTML(view.data):nodeHTML(view.data,view)):'<p class="trace-muted">尚未取得记录。</p>'}</div>${identityHTML()}<p class="trace-boundary">来源、建模采用与复核结论分别记录。此窗口不改变假设，也不产生复核通过结论。</p></div>`;
    if(focus)(find('.trace-error') || find('h2'))?.focus?.({preventScroll:true});
  }
  function verifyIdentity(data,view) {
    const b=data?.build;
    if(!b || b.id!==session.buildId || b.project_id!==session.projectId || !['model_hash','model_json_sha256','project_sha256','xlsx_sha256'].every(key=>typeof b[key]==='string' && /^[0-9a-f]{64}$/.test(b[key])))throw new Error('返回记录与所选模型版本不一致，已停止显示。');
    if(session.identity && ['id','project_id','source_revision','model_hash','model_json_sha256','project_sha256','xlsx_sha256','engine_id'].some(key=>session.identity[key]!==b[key]))throw new Error('同一模型的保存指纹发生变化，不能继续使用此前记录。');
    if(view.kind==='source') {if(data.schema!=='model-trace-source/v1' || data.node_id!==view.nodeId || data.anchor!==view.anchor)throw new Error('来源锚点与本次所选输入不一致。');}
    else {if(data.schema!=='model-trace/v1' || data.node?.id!==view.nodeId)throw new Error('返回计算节点与点击的数字不一致。');if(finite(view.expectedValue) && data.node.value!==view.expectedValue)throw new Error('所显示的数值与绑定的计算节点不一致；本项暂不可追溯。');}
    session.identity=b;
  }
  async function fetchView(view) {
    const token=++sequence;session.loading=true;session.error='';render();
    const path=`/api/builds/${encodeURIComponent(session.buildId)}/trace${view.kind==='source'?`/source?node_id=${encodeURIComponent(view.nodeId)}&anchor=${encodeURIComponent(view.anchor)}`:`?node_id=${encodeURIComponent(view.nodeId)}&offset=${view.offset || 0}`}`;
    try {
      const response=await api(path,{method:'GET'});if(token!==sequence || !session)return;
      const data=view.kind==='source'?response.source:response.trace;verifyIdentity(data,view);view.data=data;session.loading=false;render();dialog.scrollTop=view.scroll || 0;find('[data-trace-back]')?.focus({preventScroll:true});
    } catch(e) {if(token!==sequence || !session)return;session.loading=false;session.error=e.message || '服务暂不可用，已保留当前所选版本。';for(const item of session.stack)delete item.data;render({focus:true});}
  }
  function push(view) {const old=session.stack.at(-1);if(old)old.scroll=dialog.scrollTop;session.stack.push(view);fetchView(view);}
  dialog.addEventListener('click',event=>{
    if(!session)return;const target=event.target.closest('button');if(!target)return;const view=session.stack.at(-1);
    if(target.hasAttribute('data-trace-close')){close();return;}
    if(target.hasAttribute('data-trace-back') && session.stack.length>1){session.stack.pop();fetchView(session.stack.at(-1));return;}
    if(target.hasAttribute('data-trace-retry')){fetchView(view);return;}
    if(session.loading || session.error)return;
    if(target.hasAttribute('data-trace-dependency')){const d=view.data.dependencies?.[Number(target.dataset.traceDependency)];if(d)push({kind:'node',nodeId:d.id,expectedValue:d.value,displayLabel:label(d.label),offset:0});return;}
    if(target.hasAttribute('data-trace-source-index')){const e=view.data.evidence?.[Number(target.dataset.traceSourceIndex)];if(e?.key)push({kind:'source',nodeId:view.nodeId,anchor:e.key});return;}
    if(target.hasAttribute('data-trace-page')){const p=view.data.pagination;view.offset=target.dataset.tracePage==='next'?p.next_offset:Math.max(0,p.offset-p.limit);fetchView(view);}
  });
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  return {open({buildId,nodeId,projectId,currentProjectRevision,expectedValue,displayLabel,currency,unit,buildName,createdAt,returnFocus=document.activeElement}={}) {
    if(!buildId || !nodeId || !projectId)throw new Error('缺少明确模型或计算节点，不能开始追溯。');
    if(dialog.open)close();session={buildId,nodeId,projectId,currentProjectRevision,currency,unit:String(unit??''),buildName,createdAt,returnFocus,stack:[{kind:'node',nodeId,expectedValue,displayLabel,offset:0}],identity:null,error:'',loading:true};dialog.showModal();fetchView(session.stack[0]);
  },close,isOpen:()=>!!session,notifyProject({projectId,revision}={}) {if(!session)return;if(projectId!==session.projectId){close();return;}session.currentProjectRevision=revision;if(!session.loading)render();},destroy(){close();dialog.remove();}};
}

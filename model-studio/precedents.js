/* Standalone local intake. Uploading never adopts a recipe or starts an agent. */
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const titles={three_statement_core:'三表连接底盘',ppe_signed_movement:'固定资产变动桥接',short_debt_reclassification:'借款流动性重分类',lease_liability_signed_movement:'租赁负债变动桥接',asset_allocated_cashflow_proxy:'按资产分配的现金流估计',equity_explicit_movements:'权益变动明细',term_deposit_signed_cash_bridge:'定期存款现金桥接',preferred_liability_conversion:'优先工具负债转换',bounded_settlement_request:'有边界的结算估计',retained_earnings_parent:'母公司留存收益滚动',noncontrolling_interest:'非控股权益滚动',company_workpaper:'公司经营底稿组合',engineering_backlog:'工程订单簿驱动',tam_penetration:'市场规模与渗透率驱动'};
const classes={chassis_recipe:'底盘参考',accounting_identity:'会计勾稽',conditional_estimate:'条件估计',driver_profile_recipe:'经营驱动参考'};
const states={RECIPE_DERIVED_FROM_PINNED_SEED:'由固定底盘提炼',BUILDER_CACHED_REPLAY:'已做缓存数值回放；独立复核另计',DERIVED_FROM_PINNED_PROFILE:'由固定经营结构提炼'};
const title=e=>e.title_zh||e.title||titles[e.id]||e.id;
const receiptDate=value=>value&&Number.isFinite(Date.parse(value))?new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'short',day:'numeric',timeZone:'Asia/Hong_Kong'}).format(new Date(value)):'';
function recentCandidatesHTML(candidates){
 const recent=[...candidates].sort((a,b)=>(Date.parse(b.created_at)||0)-(Date.parse(a.created_at)||0)).slice(0,3);
 return `<div class="workshop-exhibit-head"><div><p class="eyebrow">先例书架</p><h2>${recent.some(c=>receiptDate(c.created_at))?'最近收到':'已上传模板'}</h2></div><button class="button button-quiet" data-upload-focus>＋ 上传模板</button></div><div class="workshop-exhibit-items">${recent.map(c=>`<button type="button" class="workshop-source-card" data-candidate-open="${esc(c.id)}"><span class="workshop-file-tab" aria-hidden="true">${esc(String(c.original_ext||c.name?.split('.').at(-1)||'原件').replace(/^\./,'').toUpperCase())}</span><strong>${esc(c.name)}</strong>${receiptDate(c.created_at)?`<small>收到 ${esc(receiptDate(c.created_at))}</small>`:''}<span class="workshop-card-link">查看原件与详情 ↗</span></button>`).join('')||'<p class="workshop-exhibit-empty">书架等待第一份模板。上传后，原件会出现在这里。</p>'}</div>`;
}
export function createPrecedentWorkshop({api,onError=()=>{},onWorkspace=()=>{}}) {
 let slot=null,generation=0,request=0,events=null,compact=false,workspace=null;
 function notice(message){const status=slot?.querySelector('[data-workshop-notice]');if(status)status.textContent=message;}
 function showWorkspace(value,reason){
  if(!value?.id||value.internal_workspace!=='precedent_librarian'||(workspace&&workspace.id!==value.id))throw new Error('服务返回的资料范围与先例工坊不一致。');
  if(workspace&&Number(value.revision)<Number(workspace.revision))return;
  workspace=value;onWorkspace(value,'precedents',{reason});
 }
 function reveal(target){
  const drawer=slot.querySelector('[data-workshop-drawer]');if(drawer)drawer.open=true;
  if(!target)return;
  target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
  (target.querySelector('input,summary,a,button')||target).focus({preventScroll:true});
 }
 async function refresh(query='',id='') {
  const g=generation, ticket=++request;
  const data=await api('/api/precedents?'+new URLSearchParams(id?{template_id:id}:{query}));
  if(g!==generation||ticket!==request||!slot)return;
  const lib=data.library;
  if(compact)slot.querySelector('[data-workshop-recent]').innerHTML=recentCandidatesHTML(data.candidates);
  slot.querySelector('[data-library-results]').innerHTML=lib.template?
   `<article class="supervisor-panel"><h2>${esc(title(lib.entry))}</h2><p>${esc(lib.entry.summary)}</p><p class="muted">版本 ${esc(lib.entry.sha256.slice(0,12))} · 按适用条件引用</p><pre>${esc(JSON.stringify(lib.template,null,2))}</pre></article>`:
   `<p>${esc(lib.total_matches)} 个匹配参考${lib.truncated?' · 请缩小查询范围':''}</p><div class="precedent-grid">${lib.matches.map(e=>`<article class="supervisor-panel"><span class="badge neutral">${esc(classes[e.classification]||e.classification)}</span><h3>${esc(title(e))}</h3><p>${esc(e.summary)}</p><small>${esc(states[e.state]||e.state)}</small><br><button class="button" data-template="${esc(e.id)}">查看接口与适用条件</button></article>`).join('')}</div>`;
  slot.querySelector('[data-library-candidates]').innerHTML=data.candidates.map(c=>`<article class="supervisor-panel" data-candidate-row="${esc(c.id)}" tabindex="-1"><span class="badge neutral">已保存原件 · 已检查结构</span><h3>${esc(c.name)}</h3><p>版本 ${esc(c.sha256.slice(0,12))}</p><p>${esc(c.inspection.note)}</p><details><summary>查看结构与提炼步骤</summary><pre>${esc(JSON.stringify(c.inspection,null,2))}</pre><ol>${c.next_steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></details><a class="button" href="/api/precedents/candidates/${encodeURIComponent(c.id)}/original">下载留存原件</a> <button class="button button-primary" data-library-agent="${esc(c.id)}" data-candidate-sha="${esc(c.sha256)}">交给图书管理员阅读</button><p data-candidate-status="${esc(c.id)}" role="status"></p></article>`).join('')||'<p class="muted">上传后原件会留在本机候选区，供后续拆解与复核。</p>';
 }
 function unmount(){generation++;events?.abort();events=null;slot=null;workspace=null;}
 async function mount(el,options={}){unmount();slot=el;compact=options.compact===true;events=new AbortController();const g=generation;slot.innerHTML=`<div class="supervisor-heading"><div><p class="eyebrow">MODEL STUDIO / KNOWLEDGE WORKSHOP</p><h1>先例工坊</h1><p>把模型沉淀成有来源、适用条件和验证记录的构建参考。</p></div><button class="button button-primary" data-upload-focus>上传新模板 ↓</button></div>
 <section class="supervisor-panel"><h2>图书管理员的工具架</h2><p>先例图书管理员独立整理和检索模板，说明适用条件、与需求的差异及可以组合的部件。</p><p class="field-hint">在右侧说明要研究的模型问题；也可以先上传一份模板，再交给图书管理员阅读。</p><form data-library-search><label>检索模板<input name="query" maxlength="200" placeholder="如 cash、debt、revenue"></label><button class="button button-primary">查询参考库</button></form></section><div data-library-results></div>
 <section class="supervisor-panel"><h2>上传值得提炼的模板</h2><p>独立于项目资料。接收原件并检查结构后，再形成语义拆解、去公司化及验证候选；发布为后续独立步骤。</p><form data-library-upload><label>JSON / Excel 原件<input type="file" name="file" accept=".json,.xlsx" required></label><button class="button button-primary">保存到候选区</button><span role="status" data-upload-status></span></form></section><div data-library-candidates></div>`;
  if(compact){
   const content=slot.innerHTML.replaceAll('在右侧','在聊天中');slot.innerHTML=`<section class="workshop-showcase" aria-label="先例书架"><div data-workshop-recent><p role="status">正在读取书架…</p></div><p data-workshop-notice role="status" aria-live="polite"></p><details class="workshop-drawer" data-workshop-drawer><summary>浏览全部模板与参考库 <span aria-hidden="true">↗</span></summary><div class="workshop-drawer-body">${content}</div></details></section>`;
   slot.querySelector('.workshop-drawer-body .supervisor-heading').remove();
  }
  slot.addEventListener('submit',async e=>{e.preventDefault();e.stopPropagation();const f=e.target,g=generation;if(!f.reportValidity())return;const b=f.querySelector('button');b.disabled=true;try{
   if(f.matches('[data-library-upload]')){slot.querySelector('[data-upload-status]').textContent='正在保存模板…';notice('正在保存模板…');const result=await api('/api/precedents/candidates',{method:'POST',body:new FormData(f)});if(g!==generation)return;f.reset();slot.querySelector('[data-upload-status]').textContent=result.duplicate?'该原件已有留存，已定位到原候选。':'原件已保存，结构检查已完成。';notice(slot.querySelector('[data-upload-status]').textContent);}
   await refresh(f.matches('[data-library-search]')?new FormData(f).get('query'):'');
  }catch(err){if(g===generation){const status=f.querySelector('[data-upload-status]');if(status)status.textContent=err.message;notice(err.message);onError(err);}}finally{b.disabled=false;}},{signal:events.signal});
  slot.addEventListener('click',async e=>{const candidate=e.target.closest('[data-library-agent]');if(candidate){const own=generation;candidate.disabled=true;try{const data=await api(`/api/precedents/candidates/${encodeURIComponent(candidate.dataset.libraryAgent)}/agent-source`,{method:'POST',body:{candidate_sha256:candidate.dataset.candidateSha}});if(own!==generation)return;showWorkspace(data.project,'sources-updated');const status=[...slot.querySelectorAll('[data-candidate-status]')].find(el=>el.dataset.candidateStatus===candidate.dataset.libraryAgent);if(status)status.textContent=compact?'已加入阅读资料。确认聊天中的阅读范围后即可开始。':'已放入图书管理员的阅读资料。在右侧确认本轮阅读范围后即可开始。';notice(status?.textContent||'已加入阅读资料。');}catch(err){if(own===generation){notice(err.message);onError(err);}}finally{candidate.disabled=false;}return;}if(e.target.closest('[data-upload-focus]')){reveal(slot.querySelector('[data-library-upload]'));return;}const card=e.target.closest('[data-candidate-open]');if(card){reveal([...slot.querySelectorAll('[data-candidate-row]')].find(el=>el.dataset.candidateRow===card.dataset.candidateOpen));return;}const b=e.target.closest('[data-template]');if(b)refresh('',b.dataset.template).catch(error=>{if(g===generation)onError(error);});},{signal:events.signal});
  try{await refresh();if(g!==generation)return;const data=await api('/api/precedents/agent-workspace',{method:'POST',body:{}});if(g===generation)showWorkspace(data.project,'mount');}catch(e){if(g===generation){const recent=slot.querySelector('[data-workshop-recent]');if(recent&&!recent.querySelector('[data-candidate-open]'))recent.innerHTML=`<p role="status">${esc(e.message)}</p>`;onError(e);}}
 }
 return {mount,unmount};
}

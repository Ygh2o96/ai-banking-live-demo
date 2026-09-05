/* Forecast Lab teaching surface. One timestamp clock owns every animated state. */
(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const fmt = (value, places = 2) => Number(value).toLocaleString('en-US', {minimumFractionDigits:places, maximumFractionDigits:places});
  const bound = (value) => Math.max(0, Math.min(1, value));
  const ease = (value) => { const p = bound(value); return p * p * (3 - 2 * p); };
  const state = {mode:null, example:'dio', source:null, frame:null, elapsed:0, last:null, playing:false, speed:1, optIn:false, trigger:null, phase:-1, laneActive:true};
  const duration = 36000;
  const stepCount = () => state.mode === 'lattice' ? 4 : 6;
  const phaseDuration = () => duration / stepCount();
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches && !state.optIn;
  const titles = {dio:'轻轻动一下 DIO，沿公式追到三张表', tax:'税款少了一段变动', equity:'发行费用漏记权益'};
  const phaseLabels = {
    dio:['连接三张表','展开计算公式','扰动 DIO','比较实际与预期','标记缺失连接','展开差异来源'],
    tax:['连接税务科目','查看原有公式','加入 DTA 变动','比较实际与预期','标记现金税差异','追到遗漏的来源'],
    equity:['连接融资与权益','查看原有公式','带入发行费用','比较实际与预期','标记权益差异','追到遗漏的来源'],
    lattice:['七个维度拼成组合','逐项检查刚性约束','按融资金额分组','按目标顺序比较']
  };
  const captions = {
    dio:['先连接 DIO、存货与经营现金流；利润表提供销售成本。','每张表保留单元格、公式和当前数值，可以沿着连接阅读。','DIO 在 65 天和 58 天之间摆动；首月公式同步重算。','存货与现金流按预期联动；收入、销售成本保持原值。','漏接存货变动的示例：存货已变化，CFO 仍停在原值。','CFO 少变动的金额，恰好等于释放的存货。沿差异追回缺失连接。'],
    tax:['税费、应交税费与递延所得税资产，一起影响实际缴税现金。','原公式已经计入税费与应交税费；DTA 变动尚未接入。','递延所得税资产增加 1,141；应付现金税还要补上这段变动。','原公式产生的现金流，比完整公式高 1,141：现金税少付了。','差异锁定在现金税支出这一行，其他融资与权益科目保持原值。','1,141 的差异与 DTA 期末减期初完全对应，定位到缺失项。'],
    equity:['现金流量表记下募集款与发行费用，权益表接收股本与溢价。','原公式从募集款扣除股本；尚未扣除已经支付的发行费用。','发行费用现金流为 −1,112；这笔费用也应减少权益。','现金已经流出；权益少扣 1,112，原公式结果偏高。','同一笔发行费用在 CFS 与 Equity 的处理出现差异。','差异 1,112 对应 CFS!N51。将该负数接入股本溢价公式。'],
    lattice:['每个维度选一个值，七个值合在一起，就是一套完整假设。','全量计算 21,600 套组合，逐项检查盈利、现金与三表勾稽。','通过约束的方案中，10 套无需外部融资；其余方案显示融资负担。','先比较外部融资，再比较改动幅度、最低现金和净利润。']
  };
  function framePost(open) {
    if (window.parent !== window) window.parent.postMessage({type:'MODEL_CINEMA_STATE', open}, location.origin === 'null' ? '*' : location.origin);
  }
  function phasesMarkup() {
    const labels = phaseLabels[state.mode === 'lattice' ? 'lattice' : state.example];
    return `<nav class="cinema-chapters" aria-label="演示阶段">${labels.map((label,i) => `<button type="button" data-cinema-phase="${i}"><span>${String(i+1).padStart(2,'0')}</span>${label}<i></i></button>`).join('')}</nav><div class="cinema-narration"><span id="cinema-phase-label">01</span><p id="cinema-caption" aria-live="polite"></p></div>`;
  }
  function cell(key, ref, name, formula, className = '') {
    return `<tr data-cinema-row="${key}" class="${className}"><th scope="row"><code>${esc(ref)}</code><span>${esc(name)}</span></th><td><strong data-cinema-value="${key}">—</strong><code>${esc(formula)}</code></td></tr>`;
  }
  function sheet(key, title, rows, note) {
    return `<article class="cinema-sheet" data-cinema-sheet="${key}"><header><span>${esc(key)}</span><h3>${esc(title)}</h3><i aria-hidden="true"></i></header><div class="cinema-sheet-columns"><span>单元格 / 科目</span><span>当前值 / 公式</span></div><table aria-label="${esc(title)}"><tbody>${rows}</tbody></table><footer>${esc(note)}</footer></article>`;
  }
  function dioSheets() {
    return sheet('IS','利润表',cell('revenue','收入','营业收入','销售计划 · 保持不变','is-fixed')+cell('cogs','COGS','销售成本','收入 × (1 − 毛利率)','is-fixed')+cell('np','净利润','本月净利润','本月其余假设固定','is-fixed'),'固定科目保持原值')+
      sheet('BS','资产负债表',cell('inventory','存货','期末存货','= COGS / 30 × DIO','is-linked')+cell('openingInventory','期初','期初存货','上月期末存货','is-fixed')+cell('cash','现金','融资后现金余额','= 期初现金 + CFO + CFI + CFF','is-linked'),'存货释放的资金沿现金流传导')+
      sheet('CFS','现金流量表',cell('inventoryDelta','Δ存货','本月存货增加','= 期末存货 − 期初存货','is-linked')+cell('cfo','CFO','经营现金净流量','= NP + D&A − ΔAR − Δ存货 + ΔAP','is-linked')+cell('funding','融资','本月融资提款','= 现金底线 − 融资前现金','is-linked'),'现金底线不变，所需融资随之减少');
  }
  function actualSheets() {
    if (state.example === 'tax') return sheet('IS','利润表',cell('taxExpense','N20','所得税费用','按所得税费用确认','is-fixed')+cell('taxNet','净利润','税后利润','费用已计入本表','is-fixed'),'损益表记录税费')+
      sheet('BS','资产负债表',cell('dtaEnd','N11','期末递延税项资产','DTA 期末余额','is-linked')+cell('dtaStart','J11','期初递延税项资产','DTA 期初余额','is-fixed')+cell('dtaDelta','ΔDTA','资产增加','= BS!N11 − BS!J11','is-linked'),'缺失来源：DTA 期末减期初')+
      sheet('CFS','现金流量表',cell('taxPayable','J148 → N148','应交税费期初 → 期末',"'Working Capital'!J148 → N148",'is-fixed')+cell('taxCash','N30','现金税支出',"= -IS!N20 - 'Working Capital'!J148",'is-linked')+cell('taxDifference','差额','原公式 − 完整公式','= +ΔDTA','is-linked'),'现金流出显示为负数');
    return sheet('CFS','现金流量表',cell('proceeds','N50','股份发行所得款','募集资金现金流入','is-fixed')+cell('issueCost','N51','Pre-IPO 发行费用','费用现金流出','is-linked')+cell('cashEffect','现金','费用对现金的影响','= CFS!N51','is-linked'),'现金已扣除发行费用')+
      sheet('Equity','权益表',cell('shareCapital','N11','新增股本','从发行所得款分配','is-fixed')+cell('sharePremium','N23','新增股份溢价','= CFS!N50 − N11','is-linked')+cell('equityDifference','差额','原公式 − 完整公式','= -CFS!N51','is-linked'),'股份溢价还应扣除发行费用')+
      sheet('BS','资产负债表',cell('equityCash','现金','费用造成现金减少','= CFS!N51','is-linked')+cell('equityBalance','权益','费用造成权益减少','= Equity!N23 的费用调整','is-linked')+cell('equityCheck','差异','现金与权益处理差异','= 1,112','is-linked'),'同一笔费用，核对两端');
  }
  function wiggleMarkup() {
    const isDio = state.example === 'dio';
    return `<div class="cinema-case-tabs" role="tablist" aria-label="选择模型案例"><button role="tab" type="button" data-cinema-case="dio" aria-selected="${isDio}">DIO · 三表联动</button><button role="tab" type="button" data-cinema-case="tax" aria-selected="${state.example==='tax'}">税款少了一段变动</button><button role="tab" type="button" data-cinema-case="equity" aria-selected="${state.example==='equity'}">发行费用漏记权益</button><span>${isDio?'演示模型 · 2027 年 1 月 · 百万港币':'回放案例 · 千元人民币 (RMB 千元)'}</span></div>${phasesMarkup()}
      <section class="cinema-wiggle-stage" aria-label="公式联动演示"><div class="cinema-driver" id="cinema-driver"><div><span>${isDio?'唯一变动的假设':'沿公式追踪的来源'}</span><h3>${isDio?'存货周转天数 DIO':state.example==='tax'?'递延所得税资产变动':'已支付的发行费用'}</h3></div><strong id="cinema-input">${isDio?'65.0':'0'}<small>${isDio?'天':''}</small></strong><svg id="cinema-wave" viewBox="0 0 220 52" aria-hidden="true"><path class="wave-base" d="M0 26 H220"/><path id="cinema-wave-path" d="M0 26 H220"/></svg><div class="cinema-driver-end"><span>${isDio?'65 → 58 天':state.example==='tax'?'BS!N11 − BS!J11':'CFS!N51'}</span><b id="cinema-live-state">连接公式</b></div></div>
      <div class="cinema-books" id="cinema-books"><svg class="cinema-connections" id="cinema-connections" aria-hidden="true"></svg>${isDio?dioSheets():actualSheets()}</div>
      <div class="cinema-comparison"><span>本轮检查 <b id="cinema-compare-name">经营现金流变动</b></span><div>预期 <strong id="cinema-expected">0.00</strong></div><div>实际 <strong id="cinema-actual">0.00</strong></div><div class="cinema-diff">差异 <strong id="cinema-difference">0.00</strong><span id="cinema-diff-tag">等待扰动</span></div></div>
      <section class="cinema-lineage" id="cinema-lineage" aria-label="自动展开的公式来源"><div class="cinema-lineage-heading"><span>差异指纹</span><h3 id="cinema-lineage-title"></h3><strong id="cinema-fingerprint"></strong></div><div class="cinema-lineage-chain" id="cinema-lineage-chain"></div><p id="cinema-lineage-note"></p></section>
      <p class="cinema-source-summary" id="cinema-source-summary"></p></section>`;
  }
  const dimensionNames = ['增长率组合','毛利率','管理费用率','年度广告','DSO','DIO','DPO'];
  function dimensionValue(dimension,value) {
    if (Array.isArray(value)) return value.map(item=>fmt(item*100,0)+'%').join(' / ');
    if (['gross_margin','management_expense_ratio'].includes(dimension.id)) return fmt(value*100,1)+'%';
    return fmt(value,0)+(dimension.id==='advertising_spend'?' 百万港币':' 天');
  }
  function candidate(index) {
    const lattice = state.source.lattice;
    let remaining = index;
    const choices = [];
    for(let d=lattice.dimensions.length-1;d>=0;d--) { choices[d]=remaining%lattice.dimensions[d].cardinality;remaining=Math.floor(remaining/lattice.dimensions[d].cardinality); }
    return {id:index+1, choices, values:lattice.dimensions.map((dimension,i)=>dimensionValue(dimension,dimension.values[choices[i]]))};
  }
  function latticeMarkup() {
    const lattice = state.source.lattice;
    return `${phasesMarkup()}<section class="cinema-lattice"><div class="cinema-dimensions">${lattice.dimensions.map((dimension,i)=>`<div data-cinema-dimension="${i}"><span>${dimensionNames[i]}<b>×${dimension.cardinality}</b></span><strong data-dimension-value="${i}"></strong><div>${dimension.values.map((_,j)=>`<i data-dimension-choice="${i}-${j}"></i>`).join('')}</div></div>`).join('')}</div><div class="cinema-product"><span>每个维度各取一个值</span><strong>${lattice.dimensions.map(row=>row.cardinality).join(' × ')} <i>=</i> ${fmt(lattice.dimension_product,0)}</strong><span>七维有限候选空间</span></div>
      <div class="cinema-lattice-workspace"><div class="cinema-lattice-board"><div class="cinema-candidate"><span>当前组合 <b id="cinema-candidate-id">#00001</b></span><code id="cinema-candidate-vector"></code></div><canvas id="cinema-lattice-canvas" aria-label="固定视角的候选点阵；点阵表示组合结构，右侧显示实际筛选数量" role="img"></canvas><div class="cinema-canvas-legend"><span><i></i>候选组合结构示意</span><span><i></i>零融资分组</span><span><i></i>剔除</span></div></div><aside class="cinema-results"><div class="cinema-totals"><div><span>全量计算</span><strong>${fmt(lattice.evaluated_candidates,0)}</strong></div><div><span>满足约束</span><strong>${fmt(lattice.feasible_candidates,0)}</strong></div><div><span>剔除</span><strong>${fmt(lattice.rejected_candidates,0)}</strong></div><div><span>零外部融资</span><strong>${fmt(lattice.liquidity_funding.feasible_zero_external_funding,0)}</strong></div></div><div id="cinema-result-detail"></div></aside></div><p class="cinema-lattice-note">点阵用于呈现组合结构。数量与排序指标来自本轮全量计算；搜索范围为上述七项有限取值。</p></section>`;
  }
  function setText(selector,value) { const node=$(selector); if(node && node.textContent!==String(value)) node.textContent=value; }
  function put(key,value) { setText(`[data-cinema-value="${key}"]`,typeof value==='number'?fmt(value):value); }
  function phaseUpdate(phase) {
    if(state.phase===phase) return;
    state.phase=phase;
    const key=state.mode==='lattice'?'lattice':state.example;
    $$('.cinema-chapters button').forEach((button,i)=>{button.classList.toggle('is-current',i===phase);button.classList.toggle('is-complete',i<phase);button.setAttribute('aria-current',i===phase?'step':'false');});
    setText('#cinema-phase-label',String(phase+1).padStart(2,'0'));
    setText('#cinema-caption',captions[key][phase]);
    $('#h1-teach-drawer').dataset.phase=String(phase);
    if(state.mode==='lattice') updateLatticeDetail(phase);
  }
  function updateLatticeDetail(phase) {
    const l=state.source.lattice;
    const filterNames=['2028E 净利润为正','融资后月度现金底线','授权范围与三表勾稽'];
    if(phase<2) $('#cinema-result-detail').innerHTML=`<h3>刚性约束检查</h3><ol class="cinema-filter-list">${l.sequential_filter.map((row,i)=>`<li><span>${filterNames[i]}</span><strong>${fmt(row.surviving,0)} <small>通过</small></strong><em>${fmt(row.rejected_here,0)} 剔除</em></li>`).join('')}</ol><p>允许明确列示融资，再检查融资后的现金底线。</p>`;
    else if(phase===2) $('#cinema-result-detail').innerHTML=`<h3>可行方案的融资负担</h3><div class="cinema-funding-groups">${l.liquidity_funding.feasible_funding_bins.map((row,i)=>`<div><span>${['零融资','0–100','100–250','250–1,000'][i]}${i?' 百万港币':''}</span><strong>${fmt(row.candidates,0)}</strong><i style="--bar:${row.candidates/l.feasible_candidates}"></i></div>`).join('')}</div><p>分组区间为左开右闭；融资越少，越优先比较。</p>`;
    else $('#cinema-result-detail').innerHTML=`<h3>优选方案 · 实际排序指标</h3><div class="cinema-rank-order">融资金额 → 假设改动 → 最低现金 → 净利润</div><table class="cinema-rank-table"><thead><tr><th>次序</th><th>融资</th><th>改动幅度</th><th>最低现金</th><th>净利润</th></tr></thead><tbody>${l.top_ranked_plans.map(row=>`<tr><th>#${row.rank}</th><td>${fmt(row.external_funding)}</td><td>${fmt(row.normalized_driver_movement,6)}</td><td>${fmt(row.minimum_monthly_cash)}</td><td>${fmt(row.net_profit_2028)}</td></tr>`).join('')}</tbody></table><p>金额为百万港币。指标相同则按固定枚举顺序；改动幅度为归一化值。</p>`;
  }
  function connectionFrame(progress, fault) {
    const svg=$('#cinema-connections'), books=$('#cinema-books');
    if(!svg||!books) return;
    const bounds=books.getBoundingClientRect();
    svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
    const points=$$('.cinema-sheet').map(sheet=>{const r=sheet.getBoundingClientRect();return {x:r.left-bounds.left+r.width/2,y:r.top-bounds.top};});
    const mobile=bounds.width<720;
    const paths=points.slice(1).map((point,i)=>mobile?`M${points[i].x} ${points[i].y+8} V${point.y-8} H${point.x} V${point.y}`:`M${points[i].x} ${points[i].y} V8 H${point.x} V${point.y}`);
    const pulse=(state.elapsed%1800)/1800;
    const signal=state.phase===2&&!mobile?`<circle cx="${points[0].x+(points.at(-1).x-points[0].x)*pulse}" cy="8" r="3.5" fill="#b18c4e"/>`:'';
    svg.innerHTML=`<path d="M${bounds.width/2} 0 V8"/>`+paths.map((path,i)=>`<path d="${path}" pathLength="1" class="${fault&&i===1?'is-broken':''}" style="stroke-dasharray:1;stroke-dashoffset:${1-bound(progress)}"/>`).join('')+signal;
  }
  function lineage(phase) {
    const el=$('#cinema-lineage');
    el.classList.toggle('is-revealed',phase===5);
    el.setAttribute('aria-hidden',String(phase!==5));
    if(state.example==='dio') {
      setText('#cinema-lineage-title','CFO 少变动的金额，与存货释放完全相同');
      setText('#cinema-fingerprint',fmt(-state.source.simple.deltas.first_month_inventory,6));
      $('#cinema-lineage-chain').innerHTML='<code>DIO 65 → 58</code><span>→</span><code>存货减少 17.398867</code><span>→</span><code class="is-missing">CFO 遗漏 −Δ存货</code><span>→</span><code>追回存货变动</code>';
      setText('#cinema-lineage-note','漏接存货变动为教学示意。检查差额的金额与方向，再核对源单元格及相邻期间的公式。');
    } else if(state.example==='tax') {
      setText('#cinema-lineage-title','现金税少付 1,141，对应 DTA 的增加');setText('#cinema-fingerprint','1,141');
      $('#cinema-lineage-chain').innerHTML='<code>BS!N11 − BS!J11</code><span>→</span><code class="is-missing">遗漏 DTA 变动 +1,141</code><span>→</span><code>现金税流出应增加 1,141</code>';
      setText('#cinema-lineage-note',"完整公式：CFS!N30 = -IS!N20 - (BS!N11 - BS!J11) + 'Working Capital'!N148 - 'Working Capital'!J148");
    } else {
      setText('#cinema-lineage-title','权益少扣 1,112，对应已支付的发行费用');setText('#cinema-fingerprint','1,112');
      $('#cinema-lineage-chain').innerHTML='<code>CFS!N51 = −1,112</code><span>→</span><code class="is-missing">Equity!N23 未接入</code><span>→</span><code>股份溢价应减少 1,112</code>';
      setText('#cinema-lineage-note','完整公式：Equity!N23 = CFS!N50 - N11 + CFS!N51。费用现金流为负数，加入后减少权益。');
    }
  }
  function drawWiggle(phase,local) {
    const src=state.source;
    const signal=phase<2?0:phase===2?(1-Math.cos(local*Math.PI*3))/2:1;
    const fault=state.example==='dio'?phase>=4:phase>=3;
    const input=$('#cinema-input');
    let expected=0,actual=0;
    if(state.example==='dio') {
      const b=src.baseline.months[0], a=src.simple_adjusted.months[0];
      const dio=src.simple.baseline+(src.simple.new_value-src.simple.baseline)*signal;
      const inv=b.pnl.cogs/30*dio;
      const baseInv=b.pnl.cogs/30*src.simple.baseline;
      const change=inv-baseInv;
      const cfo=b.cfs.cfo-change;
      const funding=Math.max(0,b.cfs.funding_draw+change);
      const displayedCfo=fault?b.cfs.cfo:cfo;
      input.innerHTML=`${fmt(dio,1)}<small>天</small>`;
      put('revenue',b.pnl.revenue);put('cogs',b.pnl.cogs);put('np',b.pnl.net_profit);
      put('inventory',signal===1?a.bs.inventory:inv);put('openingInventory',b.bs.inventory-b.cfs.delta_inventory);
      put('cash',b.bs.cash);put('inventoryDelta',signal===1?a.cfs.delta_inventory:b.cfs.delta_inventory+change);
      put('cfo',!fault&&signal===1?a.cfs.cfo:displayedCfo);put('funding',fault?b.cfs.funding_draw:signal===1?a.cfs.funding_draw:funding);
      setText('[data-cinema-row="cfo"] td code',fault?'= NP + D&A − ΔAR − 固定Δ存货 + ΔAP':'= NP + D&A − ΔAR − Δ存货 + ΔAP');
      expected=-change;actual=fault?0:expected;
      setText('#cinema-compare-name','首月 CFO 变动');
      setText('#cinema-source-summary',`完整演示模型：首月存货 Δ ${fmt(src.simple.deltas.first_month_inventory,6)}；36 个月融资总额 Δ ${fmt(src.simple.deltas.external_funding,6)}；最低现金 Δ ${fmt(src.simple.deltas.minimum_monthly_cash,2)}。金额为百万港币。`);
      $('[data-cinema-row="cfo"]').classList.toggle('is-mismatch',fault);
      setText('#cinema-diff-tag',fault?'漏接存货变动 · 教学示意':phase>=3?'逐项一致':'同步重算');
    } else if(state.example==='tax') {
      const amount=1141*signal;
      input.innerHTML=`${fmt(amount,0)}<small>DTA 增加</small>`;
      const fixedTaxExpense=8867.5219527831614, openingTaxPayable=13318;
      put('taxExpense',fixedTaxExpense);put('taxNet','保持原值');put('dtaEnd',24324+amount);put('dtaStart',24324);put('dtaDelta',amount);
      put('taxPayable','13,318 → 0');put('taxCash',-fixedTaxExpense-openingTaxPayable);put('taxDifference',amount);
      expected=-amount;actual=0;setText('#cinema-compare-name','DTA 对现金税的增量影响');
      setText('#cinema-source-summary','现金流出为负数。展示该遗漏项造成的增量差异，原表其他税费与应交税费保持不变。');
      $('[data-cinema-row="taxCash"]').classList.toggle('is-mismatch',fault);
      setText('#cinema-diff-tag',fault?'现金税少付':'等待比较');
    } else {
      const amount=-1112*signal;
      input.innerHTML=`${fmt(amount,0)}<small>费用现金流</small>`;
      const proceeds=364997.04070000001,shareCapital=15746.264999999999;
      put('proceeds',proceeds);put('issueCost',amount);put('cashEffect',amount);put('shareCapital',shareCapital);put('sharePremium',proceeds-shareCapital);put('equityDifference',-amount);put('equityCash',amount);put('equityBalance',0);put('equityCheck',-amount);
      expected=amount;actual=0;setText('#cinema-compare-name','发行费用对权益的增量影响');
      setText('#cinema-source-summary','发行费用已从现金流出。权益表原公式遗漏同笔费用的扣减，差额保留到来源核对。');
      $('[data-cinema-row="sharePremium"]').classList.toggle('is-mismatch',fault);
      $('[data-cinema-row="equityBalance"]').classList.toggle('is-mismatch',fault);
      setText('#cinema-diff-tag',fault?'权益少扣':'等待比较');
    }
    setText('#cinema-expected',fmt(expected));setText('#cinema-actual',fmt(actual));setText('#cinema-difference',fmt(actual-expected));
    $('.cinema-comparison').classList.toggle('is-mismatch',fault);
    setText('#cinema-live-state',phaseLabels[state.example][phase]);
    $$('.cinema-sheet').forEach((sheet,i)=>{sheet.style.setProperty('--sheet-reveal',String(phase===0?ease(local*2-i*.22):1));});
    $$('.cinema-sheet .is-linked').forEach(row=>row.classList.toggle('is-moving',phase===2));
    const path=Array.from({length:90},(_,i)=>{const x=i/89*220;const t=i/89;const y=26-(phase===2?Math.sin(t*Math.PI*4-local*Math.PI*3)*17:phase>2?0:0);return `${i?'L':'M'}${x.toFixed(1)} ${y.toFixed(1)}`;}).join(' ');
    $('#cinema-wave-path').setAttribute('d',path);
    connectionFrame(phase===0?ease(local):1,fault);
    if(state.lastLineagePhase!==phase) {lineage(phase);state.lastLineagePhase=phase;}
  }
  function drawLattice(phase,local) {
    const lattice=state.source.lattice;
    const index=Math.min(lattice.dimension_product-1,Math.floor((state.elapsed/duration)*lattice.dimension_product));
    const c=candidate(index);
    setText('#cinema-candidate-id','#'+String(c.id).padStart(5,'0'));
    setText('#cinema-candidate-vector',c.values.join(' · '));
    c.values.forEach((value,i)=>{setText(`[data-dimension-value="${i}"]`,value);$$(`[data-cinema-dimension="${i}"] i`).forEach((el,j)=>el.classList.toggle('is-selected',j===c.choices[i]));});
    const canvas=$('#cinema-lattice-canvas'), ctx=canvas.getContext('2d');
    const rect=canvas.getBoundingClientRect(), w=rect.width,h=rect.height,dpr=Math.min(devicePixelRatio||1,2);
    if(!w||!h)return;
    const pixelW=Math.round(w*dpr),pixelH=Math.round(h*dpr);
    if(canvas.width!==pixelW||canvas.height!==pixelH){canvas.width=pixelW;canvas.height=pixelH;}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const mobile=w<650;
    const columns=mobile?12:18, rows=mobile?8:12, count=columns*rows;
    const spread=ease(phase===0?local*1.3:1), filter=phase===1?ease(local):phase>1?1:0,group=phase===2?ease(local):phase>2?1:0;
    const left=w*.12,right=w*.86,top=h*.22,bottom=h*.76;
    const side=mobile?4:6, depth=count/(side*side);
    const project=(a,b,c)=>({x:w*.5+(a-b)*w*.28,y:h*.61+(a+b-1)*h*.16-c*h*.32});
    ctx.lineWidth=1;
    // Orthographic projection: a fixed camera keeps the geometry legible.
    // Its three display axes are a schematic projection, not three financial drivers.
    if(phase<2){
      ctx.strokeStyle='rgba(151,193,168,.14)';
      for(let z=0;z<depth;z++) for(let i=0;i<side;i++){
        for(const edge of [[[0,i/(side-1),z/(depth-1)],[1,i/(side-1),z/(depth-1)]],[[i/(side-1),0,z/(depth-1)],[i/(side-1),1,z/(depth-1)]]]){
          const a=project(...edge[0]),b=project(...edge[1]);
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
        }
      }
      const scan=(local*.9+.05)%1,plane=[project(scan,0,0),project(scan,1,0),project(scan,1,1),project(scan,0,1)];
      ctx.beginPath();plane.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();
      ctx.fillStyle='rgba(191,220,136,.07)';ctx.fill();ctx.strokeStyle='rgba(210,222,147,.5)';ctx.stroke();
    }
    const removed=Math.round(count*lattice.rejected_candidates/lattice.evaluated_candidates);
    // Allocate representative marks by the observed aggregate counts. A single
    // zero-funding mark keeps the very small, nonzero group visible.
    const feasibleMarks=count-removed;
    const bins=lattice.liquidity_funding.feasible_funding_bins;
    const allocations=bins.map(bin=>Math.max(1,Math.round(feasibleMarks*bin.candidates/lattice.feasible_candidates)));
    const largest=bins.reduce((best,bin,i)=>bin.candidates>bins[best].candidates?i:best,0);
    allocations[largest]+=feasibleMarks-allocations.reduce((sum,value)=>sum+value,0);
    for(let i=0;i<count;i++) {
      const col=i%side,row=Math.floor(i/side)%side,layer=Math.floor(i/(side*side));
      const rejected=i<removed;
      const point=project(col/(side-1),row/(side-1),layer/(depth-1));
      let x=point.x,y=point.y;
      x=w*.5+(x-w*.5)*spread;y=h*.49+(y-h*.49)*spread;
      let bin=0;
      if(rejected){x+=(w*.1-x)*filter*.35;y+=(h*.89-y)*filter;}
      else {
        let localMark=i-removed;
        while(bin<allocations.length-1&&localMark>=allocations[bin]){localMark-=allocations[bin];bin++;}
        const cols=Math.min(8,Math.ceil(Math.sqrt(allocations[bin]))),totalRows=Math.ceil(allocations[bin]/cols);
        const gx=w*(.18+bin*.21)+(localMark%cols-(cols-1)/2)*w*.014;
        const gy=h*.48+(Math.floor(localMark/cols)-(totalRows-1)/2)*h*.025;
        x+=(gx-x)*group;y+=(gy-y)*group;
      }
      const alpha=rejected?1-filter*.55:1;
      ctx.globalAlpha=alpha*(phase===0?bound(local*4-i/count):1);
      ctx.fillStyle=rejected&&filter>.2?'#c58268':phase>=2&&!rejected&&bin===0?'#d8b774':'#88baa0';
      const size=(mobile?2:2.4)+layer/(depth-1);
      const nearScan=phase<2&&Math.abs(col/(side-1)-(local*.9+.05)%1)<.1;
      if(nearScan){ctx.shadowColor='#cddd91';ctx.shadowBlur=13;ctx.fillStyle='#e3eab3';}
      ctx.beginPath();ctx.arc(x,y,size,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    }
    ctx.globalAlpha=1;ctx.font=`500 ${mobile?11:13}px -apple-system, sans-serif`;ctx.textAlign='center';ctx.fillStyle='#bbcec0';
    if(phase<2){ctx.fillText(phase===0?'七项选择，装配为完整假设':'检查盈利、融资后现金与勾稽',w*.5,h*.1);if(phase===1){ctx.fillStyle='#dca48b';ctx.fillText(`${fmt(lattice.rejected_candidates,0)} 个方案剔除`,w*.5,h*.97);}}
    else {['零融资','0–100','100–250','250–1,000'].forEach((label,i)=>ctx.fillText(label,w*(.18+i*.21),h*.79));ctx.fillText('按融资金额归组 · 百万港币',w*.5,h*.1);}
    if(phase===3){ctx.fillStyle='rgba(13,34,28,.9)';ctx.fillRect(w*.12,h*.29,w*.76,h*.3);ctx.strokeStyle='#b69762';ctx.strokeRect(w*.12,h*.29,w*.76,h*.3);ctx.fillStyle='#eddfc0';ctx.font=`600 ${mobile?16:24}px -apple-system, sans-serif`;ctx.fillText('同一组方案，按目标顺序比较',w*.5,h*.42);ctx.font=`500 ${mobile?11:15}px -apple-system, sans-serif`;ctx.fillStyle='#b9cdbf';ctx.fillText('右侧列出本轮优选方案的实际指标',w*.5,h*.51);}
  }
  function render() {
    if(!state.mode)return;
    const phase=Math.min(stepCount()-1,Math.floor(state.elapsed/phaseDuration()));
    const local=bound((state.elapsed-phase*phaseDuration())/phaseDuration());
    phaseUpdate(phase);
    $$('.cinema-chapters button i').forEach((el,i)=>el.style.transform=`scaleX(${i<phase?1:i===phase?local:0})`);
    if(state.mode==='wiggle')drawWiggle(phase,local);else drawLattice(phase,local);
    const seconds=Math.floor(state.elapsed/1000);setText('#cinema-time',`00:${String(seconds).padStart(2,'0')} / 00:36`);
  }
  function syncControls() {
    const button=$('#h1-teach-pause');
    button.textContent=state.playing?'暂停':reduced()?'播放完整动效':state.elapsed>=duration?'播放完毕':'继续播放';
    button.setAttribute('aria-pressed',String(!state.playing));
    $('#h1-teach-prev').disabled=state.elapsed===0;
    $('#h1-teach-next').disabled=state.elapsed>=phaseDuration()*(stepCount()-1);
  }
  function stopFrame() {if(state.frame!==null)cancelAnimationFrame(state.frame);state.frame=null;state.last=null;}
  function tick(timestamp) {
    state.frame=null;
    if(!state.playing||!state.mode||document.hidden||!state.laneActive)return;
    if(state.last!==null)state.elapsed=Math.min(duration,state.elapsed+(timestamp-state.last)*state.speed);
    state.last=timestamp;render();
    if(state.elapsed>=duration){state.playing=false;syncControls();return;}
    state.frame=requestAnimationFrame(tick);
  }
  function schedule() {stopFrame();if(state.playing&&!document.hidden&&state.laneActive)state.frame=requestAnimationFrame(tick);syncControls();}
  function seek(phase) {state.elapsed=Math.max(0,Math.min(stepCount()-1,phase))*phaseDuration();state.playing=false;stopFrame();render();syncControls();}
  function rebuild() {
    stopFrame();state.phase=-1;state.lastLineagePhase=-1;state.elapsed=0;
    $('#h1-teach-title').textContent=state.mode==='wiggle'?titles[state.example]:'21,600 套假设，怎样逐步筛选';
    $('#h1-teach-kicker').textContent=state.mode==='wiggle'?'FORECAST LAB / WIGGLE TEST':'FORECAST LAB / SOLVER LATTICE';
    $('#h1-teach-body').innerHTML=state.mode==='wiggle'?wiggleMarkup():latticeMarkup();
    $('#h1-teach-body').scrollTop=0;
    state.playing=!reduced();if(reduced())state.elapsed=phaseDuration();render();schedule();
  }
  function open(mode,trigger,source) {
    if(!['wiggle','lattice'].includes(mode))return;
    state.source=source;state.mode=mode;state.trigger=trigger||document.activeElement;state.example='dio';
    const dialog=$('#h1-teach-drawer');
    document.body.classList.add('h1-teach-open');dialog.classList.add('is-open');
    if(!dialog.open)dialog.showModal();
    framePost(true);rebuild();$('#h1-teach-close').focus();
  }
  function close() {
    if(!state.mode)return;
    stopFrame();state.playing=false;state.mode=null;
    const dialog=$('#h1-teach-drawer');dialog.classList.remove('is-open');dialog.close();
    document.body.classList.remove('h1-teach-open');framePost(false);
    if(state.trigger?.isConnected)state.trigger.focus();state.trigger=null;
  }
  function replay() {state.optIn=true;state.elapsed=0;state.phase=-1;state.playing=true;render();schedule();}
  function toggle() {if(!state.mode)return;if(reduced()){state.optIn=true;state.playing=true;}else if(state.elapsed>=duration){replay();return;}else state.playing=!state.playing;schedule();}
  $('#h1-teach-drawer').addEventListener('cancel',event=>{event.preventDefault();close();});
  $('#h1-teach-body').addEventListener('click',event=>{
    const example=event.target.closest('[data-cinema-case]'),phase=event.target.closest('[data-cinema-phase]');
    if(example){state.example=example.dataset.cinemaCase;rebuild();$(`[data-cinema-case="${state.example}"]`).focus();}
    if(phase)seek(Number(phase.dataset.cinemaPhase));
  });
  $('#h1-teach-prev').addEventListener('click',()=>seek(Math.floor(state.elapsed/phaseDuration())-1));
  $('#h1-teach-next').addEventListener('click',()=>seek(Math.floor(state.elapsed/phaseDuration())+1));
  $('#h1-teach-speed').addEventListener('change',event=>{state.speed=Number(event.target.value);schedule();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopFrame();else if(state.mode)schedule();});
  window.addEventListener('message',event=>{
    if(event.source!==window.parent || (location.origin!=='null' && event.origin!==location.origin))return;
    if(event.data?.type!=='LANE_VISIBILITY' || typeof event.data.active!=='boolean')return;
    state.laneActive=event.data.active;
    if(!state.laneActive)stopFrame();else if(state.mode){framePost(true);schedule();}
  });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>{if(state.mode&&reduced()){state.playing=false;stopFrame();render();syncControls();}});
  window.addEventListener('resize',()=>{if(state.mode)render();});
  document.addEventListener('keydown',event=>{
    if(!state.mode)return;
    if(event.code==='Space'&&!['BUTTON','SELECT','INPUT'].includes(event.target.tagName)){event.preventDefault();toggle();}
    if(event.key==='Tab'){
      const focusable=$$('#h1-teach-drawer button:not(:disabled), #h1-teach-drawer select');
      const first=focusable[0],last=focusable.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  window.ModelCinema=Object.freeze({open,close,replay,toggle,seek,state:()=>({mode:state.mode,example:state.example,elapsed:state.elapsed,playing:state.playing,phase:state.phase,speed:state.speed,pendingFrame:state.frame!==null})});
})();

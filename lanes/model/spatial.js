/* Model teaching visuals. No timers: the cinema's timestamp is the only clock. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const all = s => [...document.querySelectorAll(s)];
  const fmt = (n,p=2) => Number(n).toLocaleString('en-US',{minimumFractionDigits:p,maximumFractionDigits:p});
  const clamp = n => Math.max(0,Math.min(1,n));
  const smooth = n => {n=clamp(n);return n*n*(3-2*n);};
  const names = ['增长','毛利率','管理费率','广告','DSO','DIO','DPO'];
  const value = (d,v) => Array.isArray(v)?v.map(n=>fmt(n*100,0)).join('/')+'%':(['gross_margin','management_expense_ratio'].includes(d.id)?fmt(v*100,1)+'%':fmt(v,0)+(d.id==='advertising_spend'?'m':'d'));
  function decode(l,index) {
    let n=index;const choices=[];
    for(let k=6;k>=0;k--){choices[k]=n%l.dimensions[k].cardinality;n=Math.floor(n/l.dimensions[k].cardinality);}
    return {id:index+1,choices,values:choices.map((j,i)=>value(l.dimensions[i],l.dimensions[i].values[j]))};
  }
  function encode(l,c){return c.reduce((n,j,k)=>n*l.dimensions[k].cardinality+j,0);}
  function text(selector,v){const el=$(selector);if(el&&el.textContent!==String(v))el.textContent=v;}
  const checks = [
    ['W01','DIO · 存货天数','授权范围内 ±1 天；端点','存货、Δ存货、CFO、融资','销量、价格等独立输入；收入公式','按期末或平均存货口径重算'],
    ['W02','DSO · 收款天数','±1 天；回款跨月','应收、回款、CFO、融资','销售确认口径','当月和次月应收滚存'],
    ['W03','DPO · 付款天数','±1 天；付款跨月','应付、付款、CFO、融资','采购与成本的独立输入','当月和次月应付滚存'],
    ['W04','销量 / 售价','分别单动；零销量边界','收入、成本、税费、营运资金','另一项输入及历史实际','量 × 价与产品小计'],
    ['W05','单位成本 / 毛利率','按模型授权口径单动','毛利、税费、存货、现金流','独立销量 / 售价输入','避免同时改成本和毛利率'],
    ['W06','人数 / 薪酬 / 费用率','分别单动；入职跨月','费用、应计、现金支付','收入独立驱动','计提月份与付款月份'],
    ['W07','资本开支 / 投产时间','金额单动；跨月投产','固定资产、折旧、CFI、税费','历史原值和累计折旧','期初 + 新增 − 处置 − 折旧'],
    ['W08','折旧年限 / 残值','有效区间两侧；零残值','折旧、净资产、非现金加回','资本开支现金支付','当期及下一期资产滚存'],
    ['W09','税率 / 税务差异输入','税务计划允许的上下扰动','所得税、DTA/DTL、应交税、现金税','已锁定的税前经营驱动','费用、递延税和实缴税的桥接'],
    ['W10','发行费用金额 / 支付时间','金额单动；支付跨期','CFS、费用或权益、BS','募集款与股本独立输入','按费用性质确认归属；防止漏记或重复扣减'],
    ['W11','借款 / 偿还 / 利率','分别单动；额度和余额边界','债务、利息、CFF、现金','独立经营假设','申请额、实际额、被限额部分分列'],
    ['W12','增资 / 分红','授权金额；分配上限','现金、股本 / 溢价 / 留存收益','经营利润驱动','现金与权益同笔、同期对应'],
    ['W13','汇率','按币种和折算口径单动','折算、汇兑、现金流汇率影响','原币金额与原币经营驱动','损益、其他综合收益与现金汇率影响分开'],
    ['W14','最低现金 / 融资触发值','阈值之下、恰好、之上','融资前现金、提款、融资后现金','独立经营输入','分段函数与零融资边界']
  ];
  function checklistMarkup(){return `<details class="wiggle-checklist"><summary><span>从一个 DIO，扩展到整本模型</span><b>脚本化检查清单 · ${checks.length} 类 ↗</b></summary><div class="wiggle-checklist-body"><p>先把清单映射到每个工作簿的输入格。脚本在副本中逐项扰动、重算并还原，记录实际变化、预期变化和差异；Agent 汇总异常，再沿依赖链查来源。</p><ol class="wiggle-batch-steps"><li>映射输入格</li><li>单变量扰动</li><li>重算与对比</li><li>还原并校验</li><li>日志交给 Agent</li></ol><p class="wiggle-template-note">检查模板 · 尚未对本清单逐项执行。输入格须经授权；公式格只检查，不覆盖；历史实际锁定。缺映射、重算失败与跳过项单独记录。</p><div class="wiggle-check-scroll"><table><thead><tr><th>ID</th><th>待映射的输入格</th><th>扰动方式</th><th>追踪变化</th><th>保护项</th><th>重点核对</th></tr></thead><tbody>${checks.map(r=>'<tr>'+r.map(c=>`<td>${c}</td>`).join('')+'</tr>').join('')}</tbody></table></div><div class="wiggle-log-spec"><strong>每条日志保留</strong><code>workbook_hash · sheet!cell · period · original_formula/value · shock · expected_delta · actual_delta · tolerance · status · lineage · recalc_engine · restored_hash</code><p>本期与下一期一起查；先测单变量，再补交互和阈值测试。差额的金额与方向可帮助定位遗漏项，仍需核对公式来源。</p></div></div></details>`;}
  const paperRows = {
    dio:[['IS','利润表',[['revenue','收入'],['cogs','销售成本'],['np','净利润']]],['BS','资产负债表',[['inventory','存货'],['openingInventory','期初存货'],['cash','现金']]],['CFS','现金流量表',[['inventoryDelta','Δ 存货'],['cfo','经营现金流'],['funding','融资提款']]]],
    tax:[['IS','利润表',[['taxExpense','税费'],['taxNet','税后利润']]],['BS','资产负债表',[['dtaEnd','期末 DTA'],['dtaStart','期初 DTA'],['dtaDelta','Δ DTA']]],['CFS','现金流量表',[['taxPayable','应交税费'],['taxCash','现金税'],['taxDifference','差额']]]],
    equity:[['CFS','现金流量表',[['proceeds','募集款'],['issueCost','发行费用'],['cashEffect','现金影响']]],['Equity','权益表',[['shareCapital','股本'],['sharePremium','股份溢价'],['equityDifference','差额']]],['BS','资产负债表',[['equityCash','现金影响'],['equityBalance','权益影响'],['equityCheck','差额']]]]
  };
  function wiggleMarkup(example) {
    const sheets=paperRows[example];
    const pos=[[330,34],[28,208],[330,376]];
    const papers=sheets.map(([key,label,rows],i)=>`<g class="spatial-paper" data-spatial-paper="${i}" transform="translate(${pos[i].join(' ')})"><rect class="paper-shadow" x="7" y="9" width="278" height="162" rx="3"/><rect class="paper-back" x="3" y="4" width="278" height="162" rx="3"/><rect class="paper-face" width="278" height="162" rx="3"/><path class="paper-rule" d="M0 34 H278 M0 66 H278 M0 98 H278 M0 130 H278 M118 34 V130"/><text class="paper-title" x="14" y="22">${key} · ${label}</text><text class="paper-sheet-tab" x="14" y="151">${key}</text>${rows.map(([ref,name],j)=>`<g data-spatial-row="${ref}"><rect class="paper-cell-tint" x="119" y="${35+j*32}" width="157" height="30"/><text class="paper-name" x="13" y="${55+j*32}">${name}</text><text class="paper-value" x="262" y="${55+j*32}" text-anchor="end" data-spatial-mirror="${ref}">—</text></g>`).join('')}</g>`).join('');
    return `<aside class="wiggle-physical"><header><span>01 / 看表之间的变化</span><strong>同一个输入，沿连接走一遍</strong></header><svg id="spatial-wiggle-map" viewBox="0 0 640 580" role="img" aria-label="缩略工作表与动态依赖连线，数值与右侧公式同步"><g class="spatial-source"><rect x="28" y="32" width="245" height="90" rx="4"/><text x="44" y="57">${example==='dio'?'DIO · 唯一变动输入':'本轮追踪的来源变动'}</text><text x="44" y="95" id="spatial-input">—</text></g><g class="spatial-wires"><path data-spatial-wire="input" d="M148 122 V208"/><path data-spatial-wire="context" d="M330 114 H318 Q306 114 306 132 V244 Q306 258 290 258 H278"/><path data-spatial-wire="output" d="M168 370 V450 Q168 466 190 466 H330"/><circle data-spatial-packet="input" r="4"/><circle data-spatial-packet="output" r="4"/><text x="159" y="163">${example==='dio'?'按周转天数重算':'核对来源增量'}</text><text x="176" y="438">${example==='dio'?'−Δ 存货 → CFO':example==='tax'?'Δ DTA → 现金税':'现金支付 ↔ 权益扣减'}</text></g>${papers}</svg><div class="wiggle-physical-legend"><span>随公式联动</span><span>保护项不变</span><span>差异待查</span></div><p id="spatial-wiggle-status" aria-live="polite">先接好输入与工作表。</p></aside>`;
  }
  function drawWiggle(s,phase,local) {
    const map=$('#spatial-wiggle-map');if(!map)return;
    const fault=s.example==='dio'?phase>=4:phase>=3;
    text('#spatial-input',$('#cinema-input').textContent);
    all('[data-spatial-mirror]').forEach(el=>{
      const ref=el.dataset.spatialMirror,original=$(`[data-cinema-value="${ref}"]`),row=$(`[data-cinema-row="${ref}"]`);
      if(original)el.textContent=original.textContent;
      el.parentNode.classList.toggle('is-moving',phase===2&&row?.classList.contains('is-linked'));
      el.parentNode.classList.toggle('is-fixed',!!row?.classList.contains('is-fixed'));
      el.parentNode.classList.toggle('is-mismatch',!!row?.classList.contains('is-mismatch'));
    });
    all('[data-spatial-paper]').forEach((el,i)=>{el.style.opacity=phase===0?String(.25+.75*smooth(local*2-i*.25)):'1';});
    map.classList.toggle('has-fault',fault);
    const inputPath=$('[data-spatial-wire="input"]'),contextPath=$('[data-spatial-wire="context"]');
    inputPath.setAttribute('d',s.example==='equity'?'M273 77 H330':'M148 122 V208');
    contextPath.setAttribute('d',s.example==='tax'?'M470 196 V376':'M330 114 H318 Q306 114 306 132 V244 Q306 258 290 258 H306');
    all('[data-spatial-wire]').forEach(el=>el.classList.toggle('is-broken',fault&&el.dataset.spatialWire===(s.example==='equity'?'context':'output')));
    all('[data-spatial-packet]').forEach((el,i)=>{
      const path=$(`[data-spatial-wire="${el.dataset.spatialPacket}"]`);
      const p=path.getPointAtLength(((s.elapsed/2600+i*.35)%1)*path.getTotalLength());
      el.setAttribute('cx',p.x);el.setAttribute('cy',p.y);el.style.opacity=phase>=2&&(!fault||i===0)?'1':'0';
    });
    const output=$('[data-spatial-wire="output"]');output.style.strokeDashoffset=String(-s.elapsed/90);
    text('#spatial-wiggle-status',phase<2?'先接好输入与工作表。':fault?'红色连接对应右侧差异；沿同一条来源继续查。':phase===2?'绿色单元格随公式更新；保护项保持原值。':'左边看传导，右边核对实际与预期。');
  }
  function boardMarkup(){return `<div class="spatial-view-info"><b id="spatial-view-title">7D → 3D · 候选空间投影</b><span id="spatial-view-description"></span></div><div class="spatial-slice-controls" id="spatial-slice-controls"><label>固定毛利率 <select id="spatial-slice-select" aria-label="切换三维切片"><option value="auto">自动翻看切片</option><option value="0">32.0%</option><option value="1">33.0%</option><option value="2">34.0%</option><option value="3">35.0%</option></select></label><span id="spatial-fixed-values"></span></div><div class="spatial-readout" id="spatial-readout"></div>`;}
  function hud(c){text('#cinema-candidate-id','#'+String(c.id).padStart(5,'0'));text('#cinema-candidate-vector',c.values.map((v,i)=>`${names[i]} ${v}`).join(' · '));c.values.forEach((v,i)=>{text(`[data-dimension-value="${i}"]`,v);all(`[data-cinema-dimension="${i}"] i`).forEach((e,j)=>e.classList.toggle('is-selected',j===c.choices[i]));});}
  function setupCanvas(){const canvas=$('#cinema-lattice-canvas'),rect=canvas.getBoundingClientRect(),w=rect.width,h=rect.height,dpr=Math.min(devicePixelRatio||1,2);if(!w||!h)return null;const pw=Math.round(w*dpr),ph=Math.round(h*dpr);if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph;}const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);return {ctx,w,h,mobile:w<520};}
  function line(ctx,points,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();}
  function dot(ctx,p,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();}
  const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  function label(ctx,p,title,detail,w,h,mobile=false,avoid=[]){
    const bw=mobile?135:177,bh=41;
    const box=(x,y)=>({x:Math.max(8,Math.min(w-bw-8,x)),y:Math.max(8,Math.min(h-bh-8,y)),w:bw,h:bh});
    const candidates=[box(p.x+15,p.y-47),box(p.x-bw-15,p.y-47),box(p.x+15,p.y+15),box(p.x-bw-15,p.y+15)];
    for(let y=8;y<=h-bh-8;y+=24)for(let x=8;x<=w-bw-8;x+=24)candidates.push(box(x,y));
    const chosen=candidates.find(a=>!avoid.some(b=>overlaps(a,b)))||candidates[0],{x,y}=chosen;
    line(ctx,[p,{x:Math.max(x,Math.min(x+bw,p.x)),y:y+bh/2}],'#b7a36b');ctx.fillStyle='#173e32';ctx.fillRect(x,y,bw,bh);ctx.strokeStyle='#9e9369';ctx.strokeRect(x,y,bw,bh);ctx.textAlign='left';ctx.fillStyle='#eee3c9';ctx.font='600 11px ui-monospace, monospace';ctx.fillText(title,x+9,y+15);ctx.fillStyle='#b9cebd';ctx.font='10px ui-monospace, monospace';ctx.fillText(detail,x+9,y+31);
  }
  function pointTags(ctx,points,active,w,h,mobile,t,avoid=[]){
    const used=[],limit=mobile?2:5,offset=Math.floor(t/2.8);
    for(let i=0;i<points.length&&used.length<limit;i++){
      const item=points[(i*7+offset)%points.length],p=item.p;
      if(Math.hypot(p.x-active.x,p.y-active.y)<125)continue;
      const x=p.x+6,y=p.y-8,bw=mobile?96:117;
      if(x<8||x+bw>w-8||y<14||y>h-15||used.some(r=>Math.abs(r.y-y)<23&&Math.abs(r.x-x)<bw+8)||avoid.some(r=>overlaps({x:x-3,y:y-11,w:bw,h:17},r)))continue;
      used.push({x,y});ctx.fillStyle='#14392de8';ctx.fillRect(x-3,y-11,bw,17);ctx.fillStyle='#a9c4aa';ctx.font='9px ui-monospace, monospace';ctx.textAlign='left';
      ctx.fillText(`GM ${item.c.values[1]} · DIO ${item.c.values[5]}`,x,y);
    }
  }
  function drawProjection(s,phase,local,env){
    const {ctx,w,h,mobile}=env,l=s.source.lattice,t=s.elapsed/1000,count=mobile?84:216;
    const active=Math.floor(t/1.8)%count,points=[];
    const axis=Array.from({length:7},(_,i)=>({x:Math.cos(i*Math.PI*2/7),y:Math.sin(i*Math.PI*2/7),z:Math.sin(i*Math.PI*4/7)}));
    const yaw=matchMedia('(pointer:coarse)').matches?0:Math.sin(t/7)*.13;
    const project=(x,y,z)=>({x:w*.5+(x*Math.cos(yaw)-z*Math.sin(yaw))*w*.24,y:h*.51+y*h*.24+z*h*.1});
    const axisLabels=[];
    for(let i=0;i<7;i++){const end=project(axis[i].x*1.65,axis[i].y*1.65,axis[i].z);line(ctx,[project(0,0,0),end],'#789f803d');ctx.fillStyle='#b0c0a9';ctx.textAlign='center';ctx.font='11px sans-serif';ctx.fillText(names[i],end.x,end.y-8);const tw=ctx.measureText(names[i]).width;axisLabels.push({x:end.x-tw/2-6,y:end.y-23,w:tw+12,h:22});}
    for(let i=0;i<count;i++){const c=decode(l,Math.floor(i*(l.dimension_product-1)/(count-1)));const v=c.choices.map((j,k)=>j/(l.dimensions[k].cardinality-1)-.5);const xyz=['x','y','z'].map(k=>v.reduce((sum,n,j)=>sum+n*axis[j][k],0)*.7);const p=project(...xyz);points.push({p,c});if(i>0&&i%4!==0)line(ctx,[points[i-1].p,p],'#719e8020');dot(ctx,p,i===active?4.5:2.2,i===active?'#e6cf96':'#88b99f');}
    const a=points[active];hud(a.c);pointTags(ctx,points,a.p,w,h,mobile,t,axisLabels);label(ctx,a.p,'#'+String(a.c.id).padStart(5,'0'),`GM ${a.c.values[1]} · DIO ${a.c.values[5]}`,w,h,mobile,axisLabels);
    dot(ctx,a.p,10+Math.sin(t*2)*2,'#d8bd7426');
    text('#spatial-view-title','7D → 3D · 候选空间投影');text('#spatial-view-description','七项假设一起决定位置；投影中靠近的点，原始组合仍可能不同。');text('#spatial-readout',`屏幕抽取 ${count} 个组合展示结构；完整计算覆盖 ${fmt(l.dimension_product,0)} 个组合。`);
  }
  function drawSlice(s,phase,local,env){
    const {ctx,w,h,mobile}=env,l=s.source.lattice,t=s.elapsed/1000,select=$('#spatial-slice-select');
    const gm=select.value==='auto'?Math.floor((s.elapsed-9000)/4200)%4:Number(select.value);
    const fixed=[2,Math.max(0,gm),2,2];const points=[];
    const lift=.86+.14*Math.sin(t*.7),p=(x,y,z)=>({x:w*.5+(x-y)*w*.27,y:h*.64+(x+y-1)*h*.15-z*h*.36*lift});
    for(let z=0;z<4;z++){
      const corners=[p(0,0,z/3),p(1,0,z/3),p(1,1,z/3),p(0,1,z/3),p(0,0,z/3)];
      ctx.beginPath();corners.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.fillStyle=`rgba(143,179,147,${.03+z*.012})`;ctx.fill();line(ctx,corners,'#93b18c55');
      for(let x=0;x<3;x++)line(ctx,[p(x/2,0,z/3),p(x/2,1,z/3)],'#88ac893b');
      for(let y=0;y<3;y++)line(ctx,[p(0,y/2,z/3),p(1,y/2,z/3)],'#88ac893b');
      const lp=p(0,1,z/3);ctx.font='10px ui-monospace, monospace';ctx.textAlign='left';ctx.fillStyle='#c2c8a5';ctx.fillText('DPO '+l.dimensions[6].values[z]+'d',Math.max(8,lp.x-28),lp.y+15);
      for(let x=0;x<3;x++)for(let y=0;y<3;y++){const c=decode(l,encode(l,[...fixed,x,y,z])),q=p(x/2,y/2,z/3);points.push({c,p:q});dot(ctx,q,3.2,'#91bea1');}
    }
    const active=Math.floor(t/1.5)%points.length,a=points[active];pointTags(ctx,points,a.p,w,h,mobile,t);dot(ctx,a.p,6,'#e3c78b');dot(ctx,a.p,12+Math.sin(t*2)*2,'#dfc38325');label(ctx,a.p,`#${String(a.c.id).padStart(5,'0')} · GM ${a.c.values[1]}`,`DSO ${a.c.values[4]} / DIO ${a.c.values[5]}`,w,h,mobile);hud(a.c);
    ctx.font='11px sans-serif';ctx.textAlign='center';ctx.fillStyle='#cfdbca';ctx.fillText('DSO →',w*.75,h*.84);ctx.fillText('← DIO',w*.25,h*.84);
    text('#spatial-view-title','固定四个假设，展开一个三维切片');text('#spatial-view-description','层高代表 DPO；平面内两轴代表 DSO 和 DIO。翻动毛利率，就换到另一张切片。');text('#spatial-fixed-values',`增长 ${a.c.values[0]} · 管理费率 ${a.c.values[2]} · 广告 HK${a.c.values[3]}`);text('#spatial-readout',`S = {增长=${a.c.values[0]}, GM=${a.c.values[1]}, 管理费率=${a.c.values[2]}, 广告=${a.c.values[3]}} × DSO × DIO × DPO · 3 × 3 × 4 = ${points.length} 个组合`);
  }
  function drawGroups(s,phase,local,env){
    const {ctx,w,h,mobile}=env,l=s.source.lattice,t=s.elapsed/1000,bins=l.liquidity_funding.feasible_funding_bins;
    bins.forEach((bin,k)=>{const x=w*(.14+k*.24),y=h*.45,marks=mobile?12:24;
      for(let i=0;i<marks;i++){const a=i*Math.PI*2/marks+t*.13,r=(mobile?17:28)+(i%3)*7;dot(ctx,{x:x+Math.cos(a)*r,y:y+Math.sin(a)*r*.72},2,k===0?'#dbc188':'#8cb999');}
      ctx.textAlign='center';ctx.font=`600 ${mobile?16:22}px ui-monospace, monospace`;ctx.fillStyle='#e4dfbf';ctx.fillText(fmt(bin.candidates,0),x,y+6);ctx.font='11px sans-serif';ctx.fillStyle='#b7c7b1';ctx.fillText(['零融资','0–100','100–250','250–1,000'][k],x,h*.73);
      const flow=(t/3+k*.17)%1;dot(ctx,{x:x,y:h*.22+flow*h*.12},2.5,'#bfb182');
    });
    text('#spatial-view-title','通过约束后，比较融资需求');text('#spatial-view-description',`${fmt(l.rejected_candidates,0)} 套未通过；${fmt(l.feasible_candidates,0)} 套可行方案分成四组。金额为百万港币。`);text('#spatial-readout','圆环为分组标识，点的数量不代表方案占比；各组实际数量见中心数字。');text('#cinema-candidate-id','融资分组');text('#cinema-candidate-vector','先检查完整候选空间，再比较可行方案的资金负担。');
  }
  function drawRanking(s,phase,local,env){
    const {ctx,w,h,mobile}=env,l=s.source.lattice,t=(s.elapsed-27000)/1000,plans=l.top_ranked_plans;
    const keys=['external_funding','normalized_driver_movement','minimum_monthly_cash','net_profit_2028'];
    const labels=['融资 ↓','改动 ↓','现金 ↑','净利 ↑'];
    const metric=Math.floor(Math.max(0,t)/3)%4,selected=Math.floor(Math.max(0,t)/1.65)%plans.length;
    const xs=keys.map((_,i)=>w*(.12+i*.25)),top=h*.2,bottom=h*.75;
    const ranges=keys.map(k=>({min:Math.min(...plans.map(r=>r[k])),max:Math.max(...plans.map(r=>r[k]))}));
    const point=(row,k)=>({x:xs[k],y:ranges[k].min===ranges[k].max?(top+bottom)/2:bottom-(row[keys[k]]-ranges[k].min)/(ranges[k].max-ranges[k].min)*(bottom-top)});
    keys.forEach((k,i)=>{line(ctx,[{x:xs[i],y:top-13},{x:xs[i],y:bottom+14}],metric===i?'#d5b97b':'#88a58b50',metric===i?2:1);ctx.textAlign='center';ctx.font='11px sans-serif';ctx.fillStyle=metric===i?'#e8d8b3':'#a5b99f';ctx.fillText(labels[i],xs[i],h*.12);ctx.font='10px ui-monospace, monospace';ctx.fillText(fmt(ranges[i].min,i===1?3:0),xs[i],bottom+34);});
    plans.forEach((row,j)=>{const points=keys.map((_,i)=>point(row,i));line(ctx,points,['#dcc28a','#8fbaa3','#789f87'][j],selected===j?2.5:1);points.forEach(p=>dot(ctx,p,selected===j?4.5:3,['#dcc28a','#8fbaa3','#789f87'][j]));
      const u=(Math.max(0,t)/2+j*.2)%3,a=Math.floor(u),q=u-a;dot(ctx,{x:points[a].x+(points[a+1].x-points[a].x)*q,y:points[a].y+(points[a+1].y-points[a].y)*q},selected===j?5:3,'#f2e5bc');
    });
    const row=plans[selected],p=point(row,metric);label(ctx,p,`#${row.rank} · ${labels[metric]}`,fmt(row[keys[metric]],metric===1?6:2),w,h,mobile);
    all('.cinema-rank-table tbody tr').forEach((el,i)=>el.classList.toggle('is-tracing',i===selected));
    text('#spatial-view-title','前三个方案，沿四项指标来回比较');text('#spatial-view-description','先比融资，再比假设改动；前项相同才比较下一项。顺序保持不变。');text('#spatial-readout','每条线对应一个已计算的优选方案；各轴单独缩放，线条高低不代表综合得分。');text('#cinema-candidate-id',`优选 #${row.rank}`);text('#cinema-candidate-vector',`融资 ${fmt(row.external_funding)}m · 改动 ${fmt(row.normalized_driver_movement,6)} · 最低现金 ${fmt(row.minimum_monthly_cash)}m · 净利 ${fmt(row.net_profit_2028)}m`);
  }
  function drawLattice(s,phase,local){const env=setupCanvas();if(!env)return;$('#spatial-slice-controls').hidden=phase!==1;[drawProjection,drawSlice,drawGroups,drawRanking][phase](s,phase,local,env);if(phase>=2){s.source.lattice.dimensions.forEach((d,i)=>text(`[data-dimension-value="${i}"]`,d.cardinality+' 个取值'));all('[data-dimension-choice]').forEach(el=>el.classList.remove('is-selected'));}}
  window.ModelSpatial=Object.freeze({wiggleMarkup,drawWiggle,checklistMarkup,boardMarkup,drawLattice,decode,encode});
})();

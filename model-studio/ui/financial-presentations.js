/* Trusted presentation adapters. Descriptors contain data only, never chart options. */
export const presentationTypes = Object.freeze(['kpi','data_grid','time_series','bar_chart','waterfall','heatmap','scatter','comparison']);
const titles={kpi:'指标卡',data_grid:'交互数据表',time_series:'期间走势',bar_chart:'分类比较',waterfall:'变动桥图',heatmap:'二维分析',scatter:'两项指标关系',comparison:'方案或版本对比'};
const basisNames={source:'资料数据',proposal:'建议方案',illustration:'示意'};
const states=new Map(),resources=new Map();
const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const numeric=v=>v===null||(typeof v==='number'&&Number.isFinite(v));
const scalar=v=>v==null||typeof v==='string'||typeof v==='boolean'||numeric(v);
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const label=v=>typeof v==='string'&&v.length>0&&v.length<=300;
const keysAre=(v,keys)=>object(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const fieldText=v=>v==null?'未取得':typeof v==='boolean'?(v?'是':'否'):String(v);

export function financialValueText(value,depth=0){
  if(depth>6)return '数据层级过深';
  if(scalar(value))return fieldText(value);
  if(Array.isArray(value))return value.map(v=>financialValueText(v,depth+1)).join('\n');
  if(object(value))return Object.entries(value).map(([k,v])=>`${k}：${financialValueText(v,depth+1)}`).join('\n');
  return '无法显示的数据';
}

export function validateFinancialSection(section){
  const type=section?.type,rows=section?.rows;
  if(!presentationTypes.includes(type)||!Array.isArray(rows)||rows.length<1||rows.length>100)throw new Error('展示组件的数据行无效。');
  const chart=!['kpi','data_grid','comparison'].includes(type);
  if(chart&&new Set(rows.map(r=>r.unit||'')).size>1)throw new Error('不同单位请分开展示。');
  const names=new Set(),coordinates=new Set();
  for(const row of rows){
    if(!object(row)||!label(row.label)||!Object.hasOwn(basisNames,row.basis))throw new Error('数据行缺少名称或资料／建议／示意标记。');
    const value=row.value??null;
    let valid=false;
    if(type==='kpi')valid=scalar(value);
    if(['data_grid','comparison'].includes(type)){
      valid=type==='data_grid'&&scalar(value);
      if(object(value))valid=Object.keys(value).length>0&&Object.keys(value).length<=24&&Object.entries(value).every(([k,v])=>label(k)&&scalar(v));
    }
    if(type==='time_series'){
      if(names.has(row.label))throw new Error('每行应代表名称独立的走势系列。');
      names.add(row.label);
      if(numeric(value))valid=label(row.period);
      else if(keysAre(value,['points'])&&Array.isArray(value.points)&&value.points.length>0&&value.points.length<=240){
        const periods=new Set();
        valid=value.points.every(p=>{if(!keysAre(p,['period','value'])||!label(p.period)||!numeric(p.value)||periods.has(p.period))return false;periods.add(p.period);return true;});
      }
    }
    if(type==='bar_chart')valid=numeric(value)||(keysAre(value,['series'])&&object(value.series)&&Object.keys(value.series).length>0&&Object.keys(value.series).length<=24&&Object.entries(value.series).every(([k,v])=>label(k)&&numeric(v)));
    if(type==='waterfall')valid=keysAre(value,['start','end'])&&numeric(value.start)&&numeric(value.end);
    if(type==='heatmap'){
      valid=keysAre(value,['x','y','value'])&&label(value.x)&&label(value.y)&&numeric(value.value);
      if(valid){const pair=JSON.stringify([value.x,value.y]);if(coordinates.has(pair))throw new Error('二维坐标重复；请给每个坐标一个结果。');coordinates.add(pair);}
    }
    if(type==='scatter')valid=keysAre(value,['x','y'])&&numeric(value.x)&&numeric(value.y);
    if(!valid)throw new Error(`${titles[type]}的数据形状不符合组件目录。`);
  }
  return section;
}

function evidenceHTML(row){
  const items=Array.isArray(row.evidence)?row.evidence:[];
  return items.length?items.map(e=>`<blockquote>${escapeHTML(e.quote||'')}<small>${escapeHTML(e.locator||'')}${e.source_id?` · ${escapeHTML(e.source_id)}`:''}</small></blockquote>`).join(''):'<p>该行未附来源依据。</p>';
}

function fallbackTable(section){
  return `<details class="fp-data" open><summary>查看全部原值、公式与依据</summary><div class="fp-table-scroll"><table class="fp-source-table"><thead><tr><th>项目</th><th>原值</th><th>单位／期间</th><th>性质</th><th>公式／依据</th></tr></thead><tbody>${(Array.isArray(section.rows)?section.rows:[]).map((r,i)=>`<tr><th scope="row">${escapeHTML(r.label)}</th><td><button type="button" class="fp-value-button ${r.value==null?'fp-missing':''}" data-fp-row="${i}">${escapeHTML(financialValueText(r.value))}</button></td><td>${escapeHTML(r.unit||'未注明单位')}<br>${escapeHTML(r.period||'')}</td><td>${escapeHTML(basisNames[r.basis]||'未注明')}</td><td>${escapeHTML(r.formula||'')}<details><summary>查看依据</summary>${evidenceHTML(r)}</details></td></tr>`).join('')}</tbody></table></div></details>`;
}

/** Pure HTML renderer: source rows remain readable before/without library loading. */
export function renderFinancialSection(section,esc=escapeHTML){
  let error='';try{validateFinancialSection(section);}catch(e){error=e.message;}
  const rows=Array.isArray(section?.rows)?section.rows:[];
  const units=[...new Set(rows.map(r=>r.unit||'未注明单位'))];
  const bases=[...new Set(rows.map(r=>r.basis))];
  const safeSection=JSON.stringify(section).replace(/</g,'\\u003c');
  return `<section class="financial-presentation" data-financial-presentation="${escapeHTML(section.type)}" data-fp-spec="${escapeHTML(safeSection)}"><div class="fp-heading"><h3>${esc(section.title||'数据展示')}</h3><span class="fp-kind">${titles[section.type]||'原值表'}</span></div><div class="fp-meta"><span>${escapeHTML(units.join(' · '))}</span>${bases.map(b=>`<span class="fp-basis" data-basis="${escapeHTML(b)}">${escapeHTML(basisNames[b]||'未注明')}</span>`).join('')}</div><p class="fp-status" role="status"${error?' data-error="true"':''}>${escapeHTML(error)}</p><div class="fp-grid-controls" hidden><label>搜索数据 <input type="search" data-fp-search autocomplete="off" placeholder="项目、原值、单位或性质"></label><small>点击列标题排序；点击数值查看依据。</small></div><div class="fp-surface" aria-label="${escapeHTML(section.title)}"></div><aside class="fp-inspector" hidden aria-live="polite"></aside>${fallbackTable(section)}</section>`;
}

function localResource(relative,type,globalName){
  if(globalName&&globalThis[globalName])return Promise.resolve(globalThis[globalName]);
  const url=new URL(relative,import.meta.url);
  if(url.origin!==location.origin)throw new Error('展示资源必须来自本地应用。');
  if(resources.has(url.href))return resources.get(url.href);
  const promise=new Promise((resolve,reject)=>{
    const element=document.createElement(type==='css'?'link':'script');
    const timer=setTimeout(()=>{element.remove();reject(new Error('本地展示资源加载超时。'));},8000);
    element.onload=()=>{clearTimeout(timer);resolve(globalName?globalThis[globalName]:true);};
    element.onerror=()=>{clearTimeout(timer);element.remove();reject(new Error('本地展示资源暂不可用；可继续查看原值表。'));};
    if(type==='css'){element.rel='stylesheet';element.href=url.href;}else{element.src=url.href;element.async=true;}
    document.head.append(element);
  }).catch(error=>{resources.delete(url.href);throw error;});
  resources.set(url.href,promise);return promise;
}

function inspectRow(state,index,point){
  const row=state.section.rows[index];if(!row)return;
  const panel=state.host.querySelector('.fp-inspector');panel.hidden=false;
  panel.innerHTML=`<h4>${escapeHTML(row.label)}</h4><dl><dt>原值</dt><dd>${escapeHTML(financialValueText(point??row.value))}</dd><dt>单位</dt><dd>${escapeHTML(row.unit||'未注明单位')}</dd><dt>期间</dt><dd>${escapeHTML(row.period||'未注明期间')}</dd><dt>性质</dt><dd>${escapeHTML(basisNames[row.basis])}</dd><dt>公式</dt><dd>${escapeHTML(row.formula||'未附公式')}</dd><dt>说明</dt><dd>${escapeHTML(row.meaning||'')}</dd></dl>${evidenceHTML(row)}`;
  state.host.dispatchEvent(new CustomEvent('financial-presentation-select',{bubbles:true,detail:{type:state.section.type,title:state.section.title,row_index:index,row:structuredClone(row),point:point===undefined?null:structuredClone(point)}}));
}

function textNode(value){const node=document.createElement('span');node.textContent=fieldText(value);return node;}
function valueButton(value,state,rowIndex,point){const b=document.createElement('button');b.type='button';b.className='fp-value-button';b.textContent=fieldText(value);b.addEventListener('click',event=>{event.stopPropagation();inspectRow(state,rowIndex,point);});return b;}

function mountKpis(state){
  state.surface.classList.add('fp-kpis');
  state.surface.innerHTML=state.section.rows.map((r,i)=>`<button type="button" class="fp-kpi" data-fp-row="${i}"><span>${escapeHTML(r.label)}</span><strong class="${r.value==null?'fp-missing':''}">${escapeHTML(fieldText(r.value))}</strong><small>${escapeHTML(r.unit||'未注明单位')} · ${escapeHTML(r.period||'')}</small><small>${escapeHTML(basisNames[r.basis])}</small></button>`).join('');
}

async function mountGrid(state){
  const [,Tabulator]=await Promise.all([localResource('./vendor/tabulator-6.5.2/tabulator.min.css','css'),localResource('./vendor/tabulator-6.5.2/tabulator.min.js','js','Tabulator')]);
  if(state.disposed||!state.host.isConnected){release(state);return;}
  const rows=state.section.rows,columns=[];
  for(const row of rows)for(const key of object(row.value)?Object.keys(row.value):['原值'])if(!columns.includes(key))columns.push(key);
  if(columns.length>24)throw new Error('数据列超过展示范围；请分开展示。');
  const data=rows.map((r,index)=>{const values=object(r.value)?r.value:{原值:r.value};return {fpIndex:index,label:r.label,unit:r.unit||'未注明单位',period:r.period||'',basis:basisNames[r.basis],...Object.fromEntries(columns.map((key,i)=>['v'+i,Object.hasOwn(values,key)?values[key]:null]))};});
  const safeColumn=(name,field,extra={})=>({title:'',field,minWidth:125,titleFormatter:()=>textNode(name),formatter:cell=>textNode(cell.getValue()),...extra});
  state.grid=new Tabulator(state.surface,{data,index:'fpIndex',height:Math.min(430,rows.length*42+55),layout:'fitDataStretch',placeholder:'没有匹配的数据。',reactiveData:false,selectableRows:false,columns:[
    safeColumn('项目','label',{frozen:true,width:190}),
    ...columns.map((key,i)=>safeColumn(key,'v'+i,{sorter:data.every(r=>r['v'+i]===null||typeof r['v'+i]==='number')?'number':'string',sorterParams:{alignEmptyValues:'bottom'},formatter:cell=>valueButton(cell.getValue(),state,cell.getRow().getData().fpIndex,{[key]:cell.getValue()})})),
    safeColumn('单位','unit'),safeColumn('期间','period'),safeColumn('性质','basis'),
  ]});
  state.host.querySelector('.fp-grid-controls').hidden=false;
  const search=state.host.querySelector('[data-fp-search]');
  search.addEventListener('input',()=>{const needle=search.value.trim().toLocaleLowerCase();state.grid.setFilter(row=>!needle||Object.values(row).some(value=>fieldText(value).toLocaleLowerCase().includes(needle)));},{signal:state.abort.signal});
  await new Promise(resolve=>{state.grid.on('tableBuilt',resolve);state.abort.signal.addEventListener('abort',resolve,{once:true});});
}

function chartOptions(section){
  const rows=section.rows,type=section.type,unit=rows[0].unit||'未注明单位';
  const options={animation:false,color:['#26765b','#d19535','#587cc1','#9a6198','#5d9496','#ae6550'],aria:{enabled:true},tooltip:{trigger:'item',renderMode:'richText',confine:true,formatter:p=>`${rows[p.data?.fpRow]?.label||p.seriesName}\n${financialValueText(p.data?.fpPoint??p.value)}\n${unit}`},legend:{type:'scroll',top:0},grid:{left:60,right:28,top:52,bottom:62,containLabel:true},xAxis:{type:'category',axisLabel:{hideOverlap:true}},yAxis:{type:'value',name:unit,axisLabel:{hideOverlap:true}},dataZoom:[{type:'inside',xAxisIndex:0,filterMode:'none'},{type:'slider',xAxisIndex:0,bottom:5,height:20,filterMode:'none'}]};
  const datum=(value,fpRow,fpPoint)=>({value,fpRow,fpPoint});
  if(type==='time_series'){
    const periods=[];
    const series=rows.map((r,ri)=>{const points=object(r.value)?r.value.points:[{period:r.period,value:r.value??null}];for(const p of points)if(!periods.includes(p.period))periods.push(p.period);return {r,ri,points};});
    options.xAxis.data=periods;
    options.series=series.map(({r,ri,points})=>({name:r.label,type:'line',symbol:'circle',symbolSize:8,connectNulls:false,data:periods.map(period=>{const p=points.find(p=>p.period===period);return datum(p?.value??null,ri,p||{period,value:null});})}));
  }else if(type==='bar_chart'){
    const names=[];for(const r of rows)for(const name of object(r.value)?Object.keys(r.value.series):['数值'])if(!names.includes(name))names.push(name);
    if(names.length>24)throw new Error('比较系列过多；请分开展示。');
    options.xAxis.data=rows.map(r=>r.label);
    options.series=names.map(name=>({name,type:'bar',barMaxWidth:44,data:rows.map((r,i)=>{const v=object(r.value)?r.value.series[name]:(name==='数值'?r.value:null);return datum(v??null,i,{series:name,value:v??null});})}));
  }else if(type==='waterfall'){
    options.xAxis.data=rows.map(r=>r.label);options.legend.show=false;
    options.series=[{name:'给定起点与终点',type:'custom',encode:{x:0,y:[1,2]},data:rows.map((r,i)=>datum([i,r.value.start,r.value.end],i,r.value)),renderItem:(params,api)=>{
      if(api.value(1)==null||api.value(2)==null||!Number.isFinite(api.value(1))||!Number.isFinite(api.value(2)))return;
      const start=api.coord([api.value(0),api.value(1)]),end=api.coord([api.value(0),api.value(2)]),width=Math.min(44,api.size([1,0])[0]*0.65);
      // Endpoint subtraction here is pixel geometry only. No business deltas/totals are calculated.
      return {type:'rect',shape:{x:start[0]-width/2,y:Math.min(start[1],end[1]),width,height:Math.max(2,Math.abs(start[1]-end[1]))},style:{fill:api.value(2)>=api.value(1)?'#26765b':'#ae6550'}};
    }}];
  }else if(type==='heatmap'){
    const xs=[...new Set(rows.map(r=>r.value.x))],ys=[...new Set(rows.map(r=>r.value.y))],values=rows.map(r=>r.value.value).filter(v=>v!==null);
    options.xAxis.data=xs;options.yAxis={type:'category',data:ys,axisLabel:{hideOverlap:true}};options.legend.show=false;options.grid.right=78;
    if(values.length)options.visualMap={min:Math.min(...values),max:Math.max(...values),calculable:false,orient:'vertical',right:0,top:'center',inRange:{color:['#f0e6b5','#7eb79a','#1a6950']}};
    options.series=[{name:unit,type:'heatmap',data:rows.map((r,i)=>datum([xs.indexOf(r.value.x),ys.indexOf(r.value.y),r.value.value],i,r.value)),label:{show:true,formatter:p=>fieldText(p.data.fpPoint.value)},emphasis:{itemStyle:{borderWidth:2,borderColor:'#2d5472'}}}];
  }else if(type==='scatter'){
    options.xAxis={type:'value',name:'X'};options.yAxis.name='Y';
    options.dataZoom.push({type:'inside',yAxisIndex:0,filterMode:'none'});
    options.series=[{name:'观测值',type:'scatter',symbol:'circle',symbolSize:14,data:rows.map((r,i)=>datum([r.value.x,r.value.y],i,r.value))}];
  }
  return options;
}

async function mountChart(state){
  const echarts=await localResource('./vendor/echarts-6.1.0/echarts.min.js','js','echarts');
  if(state.disposed||!state.host.isConnected){release(state);return;}
  state.surface.classList.add('fp-chart');
  state.chart=echarts.init(state.surface,null,{renderer:'canvas'});
  state.chart.setOption(chartOptions(state.section),{notMerge:true});
  state.chart.on('click',p=>{if(Number.isInteger(p.data?.fpRow))inspectRow(state,p.data.fpRow,p.data.fpPoint);});
  const help=document.createElement('p');help.className='fp-chart-help';help.textContent='点选图形查看原值及依据；图例可切换系列，底部滑块可缩放。缺失值保留在原值表中。';state.surface.after(help);state.help=help;
}

function release(state){
  if(state.disposed)return;state.disposed=true;state.abort.abort();state.resize?.disconnect();state.chart?.dispose();state.grid?.destroy();state.help?.remove();states.delete(state.host);
}

export function disposeFinancialPresentations(root){
  for(const [host,state]of states)if(host===root||root?.contains(host))release(state);
}

/** Idempotent enhancement; detached instances are disposed on every mount. */
export async function mountFinancialPresentations(root){
  for(const [host,state]of states)if(!host.isConnected)release(state);
  const hosts=[...(root?.matches?.('[data-financial-presentation]')?[root]:[]),...(root?.querySelectorAll?.('[data-financial-presentation]')||[])];
  if(!hosts.length)return;
  await localResource('./financial-presentations.css','css').catch(()=>{});
  await Promise.all(hosts.map(async host=>{
    if(!host.isConnected)return;
    if(states.has(host))return states.get(host).ready;
    const state={host,surface:host.querySelector('.fp-surface'),abort:new AbortController(),disposed:false};states.set(host,state);
    state.ready=(async()=>{
      const status=host.querySelector('.fp-status');
      try{
        state.section=JSON.parse(host.dataset.fpSpec);validateFinancialSection(state.section);
        host.addEventListener('click',event=>{const button=event.target.closest('[data-fp-row]');if(button&&host.contains(button))inspectRow(state,Number(button.dataset.fpRow));},{signal:state.abort.signal});
        if(state.section.type==='kpi')mountKpis(state);
        else if(['data_grid','comparison'].includes(state.section.type))await mountGrid(state);
        else await mountChart(state);
        if(state.disposed||!host.isConnected){release(state);return;}
        host.dataset.fpReady='true';status.textContent='';host.querySelector('.fp-data').open=false;
        state.resize=new ResizeObserver(()=>{if(!state.disposed){state.chart?.resize();state.grid?.redraw();}});state.resize.observe(state.surface);
      }catch(error){
        if(state.disposed)return;
        state.chart?.dispose();state.grid?.destroy();state.chart=null;state.grid=null;state.surface.replaceChildren();state.surface.classList.remove('fp-chart');
        status.dataset.error='true';status.textContent=`${error.message} 下方保留原值与依据。`;host.querySelector('.fp-data').open=true;host.dataset.fpReady='fallback';
      }
    })();return state.ready;
  }));
}

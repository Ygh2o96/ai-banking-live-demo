import {reportingDeskHTML} from './ui/reporting-desk.js';
import {createRoomDrawer} from './ui/reporting-shell.js';
import {renderFinancialSection,mountFinancialPresentations,disposeFinancialPresentations} from './ui/financial-presentations.js';
import {initialInputs,inputFields,calculate,formatMoney,sections} from './model.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const roomTitles={drivers:'收入驱动',cash:'现金安排',sources:'资料清单',memo:'备忘录示意'};
let versions=[calculate(initialInputs)],viewVersion=0,roomHost=null,noticeTimer;
const current=()=>versions.at(-1),selected=()=>versions[viewVersion]||current();
const money=v=>`CNY ${formatMoney(v)}`;
const suggestions=()=>`<div class="demo-suggestions" aria-label="建议讨论"><button type="button" data-action="drivers">调一调销量与售价</button><button type="button" data-action="cash">看看现金承受能力</button><button type="button" data-action="sources">准备资料清单</button></div>`;
function notify(text){const el=document.querySelector('.demo-toast');el.textContent=text;el.hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>{el.hidden=true;},4200);}
function cashAlert(model){return model.minimumCash<0?`<p class="demo-cash-alert" role="status"><strong>按当前假设，现金出现缺口 ${money(Math.abs(model.minimumCash))}。</strong>请检查回款与付款时点，并讨论可落实的资金安排；本示例尚未加入任何融资。</p>`:'';}
function outputHTML(model,version){
 return `<section class="demo-inline-output" data-demo-output="${version}" aria-label="第 ${version+1} 版销售与现金示意"><div class="demo-output-head"><strong>销售与现金收付示意</strong><small>情景 ${version+1} · 2027年1–6月</small></div><div class="demo-kpis"><div><span>销售收入</span><strong data-total-revenue>${formatMoney(model.revenue)}</strong><small>CNY</small></div><div><span>期末现金</span><strong>${formatMoney(model.closingCash)}</strong><small>CNY</small></div><div><span>最低月末现金</span><strong>${formatMoney(model.minimumCash)}</strong><small>CNY</small></div></div>${cashAlert(model)}<p class="demo-output-context">金额单位：CNY · 每个情景的结果保留在对应讨论中。</p><div class="demo-output-actions"><button class="button button-small" data-room="drivers" data-version="${version}">查看收入拆解 ↗</button><button class="button button-small" data-room="cash" data-version="${version}">查看现金安排 ↗</button><button class="button button-small" data-room="memo" data-version="${version}">备忘录示意 ↗</button></div></section>`;
}
function appendTurn(type,text,attachment=''){
 const article=document.createElement('article');article.className=`conversation-entry ${type}`;
 article.innerHTML=`<div class="conversation-meta"><strong>${type==='user'?'你':'华泰建模专家'}</strong><span>${type==='user'?'本页操作':'示例答复'}</span></div><div class="harness-verbatim" data-message-text>${esc(text)}</div>${attachment}`;
 document.querySelector('[data-conversation-messages]').append(article);
 const host=document.querySelector('.agent-conversation');host.scrollTop=host.scrollHeight;
}
function showContext(id){const el=document.querySelector('.demo-context');el.hidden=false;el.innerHTML=`正在讨论：${esc(roomTitles[id])} · 情景 ${viewVersion+1}<button type="button" data-clear-context aria-label="取消讨论上下文">×</button>`;document.querySelector('#demo-message').focus({preventScroll:true});}
const drawer=createRoomDrawer({
 mount(host,id){roomHost=host;renderRoom(id);},
 unmount(){if(roomHost)disposeFinancialPresentations(roomHost);roomHost=null;},
 onDiscuss(id){showContext(id);},
});
drawer.element.querySelector('.report-room-head small').textContent='交互演示 · 合成资料';
function openRoom(id,version=versions.length-1){if(!roomTitles[id])return;viewVersion=version;drawer.open(id,roomTitles[id],String(version));}
function kpisHTML(model,room){return `<div class="demo-room-kpis"><div class="demo-kpis">${(room==='cash'?[['最低月末现金',model.minimumCash],['期末未收销售款',model.closingReceivables]]:[['六个月销售收入',model.revenue],['六个月经营贡献',model.contribution]]).map(([l,v])=>`<div><span>${l} · CNY</span><strong>${formatMoney(v)}</strong></div>`).join('')}</div></div>`;}
function auditHTML(model){return `<aside class="demo-audit"><h3>计算口径与资料边界</h3><ul><li>来源：本页合成输入，全部用于交互演示。每次重新计算会保存一份独立情景。</li><li>销量按月复合增长，四舍五入至整辆；销售收入 = 销量 × 售价。</li><li>经营贡献 = 销售收入 − 采购成本 − 固定现金支出；未计税费、折旧、利息和其他损益。</li><li>回款按当月 ${formatMoney(model.inputs.collection)}% 和次月 ${formatMoney(100-model.inputs.collection)}% 分配；明确假定期初应收款为 0，采购和固定支出当月支付。</li><li>期末现金 = 期初现金 + 销售回款 − 采购及固定支出 − 设备付款。没有融资、税款、存货或完整三表衔接。</li><li>本示例展示销售与现金收付，不构成完整 PFM。所需真实资料列于资料清单。</li></ul></aside>`;}
function inputHTML(model,room){const keys=room==='cash'?['opening','collection','overhead','capex']:['units','growth','price','cost'];return `<form class="demo-input-panel" data-model-form><h3>调整${room==='cash'?'现金安排':'销售假设'} <small class="muted">· 情景 ${viewVersion+1}</small></h3><div class="demo-input-grid">${inputFields.filter(f=>keys.includes(f.key)).map(f=>`<label for="input-${f.key}">${f.label}<input id="input-${f.key}" name="${f.key}" type="number" min="${f.min}" max="${f.max}" step="${f.key==='price'?'any':f.step}" value="${model.inputs[f.key]}" required inputmode="decimal"><small>${f.unit}</small></label>`).join('')}</div><div class="demo-input-actions"><button type="submit" class="button button-primary">重新计算并留在对话</button><button type="button" class="demo-preset" data-preset="${room}">${room==='cash'?'试试：回款放慢':'试试：销量增长放缓'}</button></div><p class="demo-error" role="alert" hidden></p></form>`;}
function renderRoom(id){
 if(!roomHost)return;disposeFinancialPresentations(roomHost);const model=selected();
 if(id==='drivers'||id==='cash'){
  roomHost.innerHTML=`<p class="demo-room-intro">${id==='drivers'?'把收入拆成销量和售价，再观察经营贡献。':'调节回款和支出时点，观察现金低点。'}每次计算生成一个新情景，原结果仍可从对话打开。</p>${inputHTML(model,id)}<div data-room-results>${cashAlert(model)}${kpisHTML(model,id)}${sections(model,id).map(s=>renderFinancialSection(s)).join('')}${auditHTML(model)}</div>`;
  mountFinancialPresentations(roomHost);
 }else if(id==='sources'){
  roomHost.innerHTML=`<article class="demo-document"><p class="eyebrow">清禾出行 · 合成资料</p><h3>下一轮需要哪些资料</h3><p>先验证影响最大的假设：销量、售价、回款节奏，以及可动用现金。以下为资料需求清单示例。</p><table><thead><tr><th>资料</th><th>要解决的问题</th></tr></thead><tbody><tr><td>按月及产品销售明细</td><td>增长来自销量还是价格，是否存在季节性</td></tr><tr><td>客户账期及回款明细</td><td>当月回款比例和期初应收款是否可靠</td></tr><tr><td>采购及费用付款安排</td><td>单价、付款时点与固定支出的依据</td></tr><tr><td>现金及受限资金明细</td><td>期初余额中实际可动用的金额</td></tr></tbody></table><div class="demo-download"><a href="./sample-request.csv" download="清禾出行_合成资料清单示例.csv" class="button button-primary">下载资料清单示例 ↓</a></div><p class="demo-document-note">合成示例 CSV，可在表格软件中打开；这份下载为资料清单，非 PFM 工作簿。</p>${auditHTML(model)}</article>`;
 }else{
  roomHost.innerHTML=`<article class="demo-document"><p class="eyebrow">清禾出行 · 情景 ${viewVersion+1} · 备忘录示例</p><h3>销售计划与现金安排</h3><p>本页以六个月销售与现金收付为讨论范围。首月销量为 ${formatMoney(model.inputs.units)} 辆，月度增长假设为 ${formatMoney(model.inputs.growth)}%，平均售价为 ${money(model.inputs.price)}／辆。</p><h4>情景结果</h4><p>六个月销售收入为 ${money(model.revenue)}，经营贡献为 ${money(model.contribution)}。最低月末现金为 ${money(model.minimumCash)}，期末现金为 ${money(model.closingCash)}。</p>${cashAlert(model)}<h4>值得继续讨论的事项</h4><p>收入增长需要销售明细支持。回款速度会影响现金低点；当月回款比例目前设为 ${formatMoney(model.inputs.collection)}%。建议结合客户账期核对，并补充期初应收款和受限资金资料。</p><h4>计算范围</h4><p>本示例按销量与售价计算收入，按明确的回款和付款假设计算现金。经营贡献未计税费、折旧和利息；完整财务模型所需的其他科目及三表衔接尚未覆盖。</p><p class="demo-document-note">合成资料 · 根据情景 ${viewVersion+1} 自动填入本页计算结果</p>${auditHTML(model)}</article>`;
 }
}
function recordScenario(form){
 const model=selected(),next={...model.inputs};for(const [key,value] of new FormData(form)){if(Object.hasOwn(next,key))next[key]=value.trim()===''?NaN:Number(value);}
 try{
  const result=calculate(next),changes=inputFields.filter(f=>next[f.key]!==model.inputs[f.key]).map(f=>`${f.label}调整为 ${formatMoney(next[f.key])} ${f.unit}`);
  if(!changes.length){notify('请先调整一项假设，再重新计算。');return;}
  versions.push(result);viewVersion=versions.length-1;
  appendTurn('user',changes.join('；')+'。');
  appendTurn('agent',`已按本页计算关系更新情景 ${viewVersion+1}。六个月销售收入为 ${money(result.revenue)}，最低月末现金为 ${money(result.minimumCash)}。可展开收入或现金安排，继续查看明细。`,outputHTML(result,viewVersion));
  drawer.refresh(String(viewVersion));notify(`情景 ${viewVersion+1} 已计算；结果保留在对应讨论中。`);
 }catch(e){const error=form.querySelector('.demo-error');error.textContent=e.message;error.hidden=false;}
}
function action(id,{append=true}={}){
 if(append){const prompts={drivers:'看看销量和售价对结果的影响。',cash:'如果回款放慢，现金还能承受吗？',sources:'请准备下一轮资料需求清单。'};const replies={drivers:'可以从首月销量、增长率、售价和单位成本入手。展开收入驱动后，调整假设并重新计算，结果会留在这轮讨论。',cash:'可以在现金安排中调整当月回款比例，同时观察每个月的现金余额。初始示例明确假定期初应收款为 0；实际建模需要取得这部分资料。',sources:'已展开资料需求清单示例。优先补充销售明细、客户回款、付款安排及可动用现金资料。'};appendTurn('user',prompts[id]);appendTurn('agent',replies[id],id==='sources'?'<div class="demo-output-actions"><a class="button button-small" href="./sample-request.csv" download="清禾出行_合成资料清单示例.csv">下载合成资料清单示例（CSV） ↓</a></div>':'');}
 openRoom(id);
}
function renderDesk(){
 const run={id:'00000000-0000-4000-8000-000000000001',role_id:'modelling',epoch:0,source_current:true,engine_current:true,control:'active',status:'succeeded',agent_state:{status:'completed'},goal:'清禾出行的销售与现金收付示意',inputs:[],events:[],native_artifacts:[],business_boards:[],calls:[],documents:[],request_lists:[]};
 const root=document.querySelector('#demo-desk');root.innerHTML=reportingDeskHTML({run,hasConsent:true,cap:{agent:{available:false}}});
 root.querySelector('.reporting-desk-head h2').textContent='华泰建模专家';root.querySelector('[data-reporting-status]').textContent='示例工作台';root.querySelector('.reporting-eyebrow').textContent='项目对话';
 root.querySelector('[data-reporting-controls]').replaceChildren();root.querySelector('[data-reporting-outputs]')?.remove();root.querySelector('[data-reporting-attention]')?.remove();root.querySelector('[data-conversation-empty]').hidden=true;root.querySelector('[data-live-message]').remove();root.querySelector('.conversation-actions')?.remove();
 root.querySelector('[data-reporting-composer]').innerHTML=`<form class="demo-composer" data-compose><div class="demo-context" hidden></div><label for="demo-message">继续讨论</label><div class="demo-compose-row"><textarea id="demo-message" name="message" rows="2" maxlength="1200" placeholder="试试：调整售价、查看现金，或准备资料清单…" required></textarea><button class="button button-primary" type="submit">发送 ↗</button></div><small>示例答复 · 可体验收入、现金和资料清单操作</small></form>`;
 appendTurn('user','先把清禾出行未来六个月的销售和现金安排搭起来。想看看销量增长放缓、回款变慢会有什么影响。');
 appendTurn('agent','这是六个月的初始情景。调整销量、售价或回款，查看收入和现金变化。',outputHTML(current(),0)+suggestions());
 const conversation=root.querySelector('.agent-conversation');conversation.scrollTop=matchMedia('(max-width:800px)').matches?conversation.scrollHeight:0;
}
document.addEventListener('click',event=>{
 const room=event.target.closest('[data-room]');if(room&&room.tagName==='BUTTON'){openRoom(room.dataset.room,room.dataset.version===undefined?versions.length-1:Number(room.dataset.version));return;}
 const suggested=event.target.closest('[data-action]');if(suggested){action(suggested.dataset.action);return;}
 if(event.target.closest('[data-home]')){drawer.close();document.querySelector('#demo-message').focus({preventScroll:true});}
 if(event.target.closest('[data-audit]')){const button=document.querySelector('[data-audit]'),enabled=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(enabled));document.body.classList.toggle('audit-visible',enabled);if(enabled&&!drawer.current())openRoom('drivers');notify(enabled?'已展开计算口径与资料依据。':'已收起扩展依据。');}
 if(event.target.closest('[data-clear-context]'))document.querySelector('.demo-context').hidden=true;
 if(event.target.closest('[data-reset]')){drawer.close();versions=[calculate(initialInputs)];viewVersion=0;renderDesk();notify('已回到初始合成情景。');}
 const preset=event.target.closest('[data-preset]');if(preset){const input=roomHost.querySelector(`[name="${preset.dataset.preset==='cash'?'collection':'growth'}"]`);input.value=preset.dataset.preset==='cash'?'40':'2';input.focus();notify('假设已填入；点击重新计算即可比较。');}
});
document.addEventListener('submit',event=>{
 if(event.target.matches('[data-model-form]')){event.preventDefault();recordScenario(event.target);return;}
 if(!event.target.matches('[data-compose]'))return;event.preventDefault();const input=event.target.querySelector('textarea'),text=input.value.trim();if(!text)return;input.value='';appendTurn('user',text);
 const id=/资料|清单|文件/.test(text)?'sources':/现金|回款|账期/.test(text)?'cash':/收入|销量|售价|价格|增长|成本/.test(text)?'drivers':null;
 if(id){appendTurn('agent',`这个演示可以展开${roomTitles[id]}，体验其中的示例操作。${id==='sources'?'资料清单可下载为合成示例 CSV。':'请在右侧调整假设，再点击重新计算。'}`);openRoom(id);}
 else appendTurn('agent','当前演示提供三项操作：调整销量与售价、查看现金安排、准备资料清单。请选择下方一项继续体验。',suggestions());
});
document.addEventListener('keydown',event=>{if(event.key==='Enter'&&(event.metaKey||event.ctrlKey)&&event.target.matches('#demo-message')){event.preventDefault();event.target.form.requestSubmit();}});
window.addEventListener('pagehide',()=>{disposeFinancialPresentations(document);clearTimeout(noticeTimer);});
renderDesk();

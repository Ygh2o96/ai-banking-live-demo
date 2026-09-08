import {timeHK} from './runtime-ui.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const column=n=>{let value='';for(let i=n+1;i>0;i=Math.floor((i-1)/26))value=String.fromCharCode(65+(i-1)%26)+value;return value;};
const status=s=>s.active===false?'保留的旧版':s.authority_status==='unresolved'?'版本范围待核对':s.authority_status==='operator_resolved'?'已明确适用关系':'可供分析';
const decisionLabel=d=>({supersedes:'当前这份完整替代对方',coexists:'分别适用，并存',different_purpose:'用途不同，需要交叉核对',no_version_link:'没有文件版本关系'}[d]||d);
const kindLabel=k=>({unclassified_table:'表格资料 · 用途待识别',other_note:'文稿资料 · 用途待识别',tb:'试算平衡表',fdd:'财务尽调资料',minutes:'讨论纪要'}[k]||k||'用途待识别');
const valueText=v=>v==null?'':typeof v==='object'?JSON.stringify(v):String(v);
export function sourceCellHTML(cell){
 const raw=valueText(cell.value),display=cell.display_value??raw;
 const error=cell.cell_type==='e'||/^#(?:REF!|DIV\/0!|VALUE!|N\/A|NAME\?|NUM!|NULL!)$/.test(raw);
 const title=error?(raw==='#REF!'?'引用失效 (#REF!)':`原件错误值 ${raw}`):display;
 const details=[];
 if(cell.formula_present)details.push(`<p>原件公式：<code>${esc(cell.formula||'共享公式；请核对原件')}</code></p><p>保存时的缓存值：${esc(cell.cached_value==null?'无缓存值':valueText(cell.cached_value))}</p><p>本系统未执行或重算公式；缓存值可能已过期。</p>`);
 if(cell.display_basis)details.push(`<p>原始值：${esc(raw)}<br>原件格式：${esc(cell.number_format||'ISO 日期')}<br>Excel 日期系统：${esc(cell.excel_date_system||'原件日期类型')}</p>`);
 if(error&&!cell.formula_present)details.push('<p>错误值来自原件保存内容，请回到原件核对。</p>');
 return `<td><span${error?' class="badge warning"':''}>${esc(title)}</span>${cell.formula_present?'<small class="muted"> · 公式缓存</small>':''}${details.length?`<details><summary>${cell.formula_present?'查看公式与缓存':'查看原始值'}</summary>${details.join('')}</details>`:''}</td>`;
}
export function createSourceRoom({api,onError,onProject}){
 let root=null,project=null,generation=0,mode='intake',sources=[],chosen=null,sheet=null,offset=0,history=[],busy=false,timer=null,signature='',previewRequest=0,showAll=false,events=null,feedback='';
 const selected=new Map();
 function listHTML(){return `<div class="source-register">${sources.map(s=>`<button class="source-register-row ${chosen===s.id?'selected':''}" data-source-preview="${esc(s.id)}"><strong>${esc(s.name)}</strong><span class="badge ${s.authority_status==='unresolved'?'warning':'neutral'}">${status(s)}</span><small>${esc(kindLabel(s.agent_description?.source_kind||s.source_kind))} · ${esc(s.agent_description?.entity||'主体待明确')} · ${esc(s.agent_description?.period||'期间待明确')}</small><small>资料日期：${esc(s.source_date||s.agent_description?.source_date||'尚未从原件确认')} · ${s.sheets.length?`${s.sheets.length} 个工作表`:`${s.text_length} 字`}</small><small>${s.extraction_status==='extracted'?'已提取':'原件已保存 · 提取未完成'} · ${esc(timeHK(s.uploaded_at))} 收到</small></button>`).join('')||'<p>收件室收到资料后，会在这里保留全部版本和原文入口。</p>'}</div>`;}
 function render(){
  root.innerHTML=`<div class="page-head"><div><p class="eyebrow">MODEL STUDIO / ${mode==='intake'?'INTAKE':'SOURCE OF RECORD'}</p><h1>${mode==='intake'?'收件室':'标准件房'}</h1><p>${mode==='intake'?'接收现有文件，提取原文并识别业务用途。涉及同一文件的更新时，再核对版本关系。':'查看全套源头资料、业务用途和出处。不同用途的资料可并存核对；文件更新须明确替代范围。'}</p></div><button class="button" data-step="${mode==='intake'?'data-room':'intake'}">${mode==='intake'?'查看标准件房':'继续交资料'} ↗</button></div>
   ${mode==='intake'?`<section class="panel intake-drop" data-intake-drop><h2>把资料放到这里</h2><p>TB、运营数据、MDD、FDD、业务纪要、报告均可分批上传；不用先选类别。</p><form data-intake-form><input type="file" name="files" multiple required aria-label="选择项目资料"><button class="button button-primary" type="submit">接收并整理资料</button></form><p class="field-hint">支持拖入多份文件。可提取 XLSX、CSV、TSV、DOCX、PDF、TXT、Markdown 和 JSON；其他格式保留原件并标出提取状态。单份上限 20 MB。</p><div data-upload-progress role="status"></div></section>`:''}
   <section class="source-room-policy"><strong>资料版本 ${project.revision}</strong><span>上传时间不等于资料日期。同一业务的表格、纪要与尽调资料可以相互核对；这本身不构成版本替代。</span><small data-source-sync>已读取本版资料</small><button class="button button-small" data-step="harness">交给主 agent 继续理解 ↗</button></section><p data-source-feedback role="status" aria-live="polite">${esc(feedback)}</p>
   <div class="data-room-layout"><section><h2>全部资料 · ${sources.length} 份</h2>${listHTML()}</section><section class="source-full-preview" data-full-preview><p class="muted">选择左侧资料，查看所有工作表或逐页原文。</p></section></div>`;
 }
 function relationHTML(s){
  const candidates=s.relationship_candidates||[],byOther=new Map();
  for(const c of candidates){if(!byOther.has(c.other_id))byOther.set(c.other_id,c);else if(c.operator_decision||c.current_proposal!==false)byOther.set(c.other_id,c);}
  for(const id of s.update_candidates||[])if(!byOther.has(id))byOther.set(id,{other_id:id,compatible:true,reason:'相同文件系列可能更新，替代范围待核对。'});
  return [...byOther.values()].map(c=>{const other=sources.find(x=>x.id===c.other_id);if(!other)return '';
   const pending=c.current_proposal!==false&&!c.operator_decision&&s.active!==false&&other.active!==false;
   return `<section class="notice ${c.compatible&&pending?'warning':'neutral'}"><strong>与 ${esc(other.name)} 的资料关系</strong><p>${esc(c.reason)}</p>${c.proposal_rationale?`<p>Agent 当时的候选依据：${esc(c.proposal_rationale)}</p>`:''}<details><summary>查看判断所据资料</summary>${(c.evidence||[]).map(e=>`<p>${esc(e.name)} · ${esc(kindLabel(e.source_kind))} · ${esc(e.format)}</p>${(e.citations||[]).map(ref=>`<blockquote>${esc(ref.quote)}<small>${esc(ref.locator)}</small></blockquote>`).join('')}`).join('')}</details>${pending?`<form data-source-resolution data-source="${esc(s.id)}" data-other="${esc(other.id)}" novalidate><label>资料关系<select name="decision" required><option value="">请选择资料关系</option><option value="different_purpose">用途不同，需要交叉核对</option><option value="coexists">两份分别适用，并存</option><option value="no_version_link">没有文件版本关系</option>${c.compatible?'<option value="supersedes">当前这份完整替代对方</option>':''}</select></label><label>范围与依据<textarea name="reason" rows="2" required maxlength="3000" placeholder="例如：TB 提供科目余额，FDD 解释财务事项，两份需相互核对。"></textarea></label><p data-resolution-feedback role="status" aria-live="polite"></p><button class="button" type="submit">记录这个判断</button></form>`:c.operator_decision?`<p>已记录：${esc(decisionLabel(c.operator_decision.decision))}。${esc(c.operator_decision.reason)}</p>`:c.current_proposal===false?'<p>历史候选；后续资料说明已更新，记录保留供追溯。</p>':'<p>已归档的版本；记录保留供追溯。</p>'}</section>`;
  }).join('')+(s.authority_decisions||[]).map(d=>`<details><summary>操作记录 · ${esc(decisionLabel(d.decision))} · ${esc(timeHK(d.at))}</summary><p>${esc(d.reason)}</p></details>`).join('')+(candidates.length?`<details><summary>Agent 与文件系列的候选记录 · ${candidates.length} 条</summary>${candidates.map(c=>`<p>${esc(sources.find(x=>x.id===c.other_id)?.name||c.other_id)} · ${esc(c.origin==='agent_interpretation'?'Agent 提议':'文件系列提示')} · ${esc(timeHK(c.proposed_at))}<br>${esc(c.proposal_rationale||c.reason)}</p>`).join('')}</details>`:'');
 }
 function tableHTML(p){
  const infos=p.sheet_metadata||p.sheets.map(name=>({name,default_visible:true}));
  const options=infos.filter(i=>showAll||i.default_visible||i.name===p.sheet);
  return `<label>工作表<select data-preview-sheet>${options.map(i=>`<option ${i.name===p.sheet?'selected':''} value="${esc(i.name)}">${esc(i.name)}${i.default_visible?'':`（${esc(i.hidden_reason||'隐藏表')}）`}</option>`).join('')}</select></label>${infos.some(i=>!i.default_visible)?`<label><input type="checkbox" data-preview-all ${showAll?'checked':''}> 显示全部工作表（含原件隐藏表与可能的内部存储表）</label>`:''}<p class="field-hint">共 ${p.total} 个有内容的行；原始行号保留。日期按原件单元格格式显示，原始数值可展开查看。公式显示保存时的缓存值，未经重算。</p><div class="table-scroll source-data-table"><table><thead><tr><th>原行号</th>${Array.from({length:Math.max(0,...p.rows.map(r=>r.values.length))},(_,i)=>`<th>${column(i)}</th>`).join('')}</tr></thead><tbody>${p.rows.map(r=>`<tr><th>${r.row}</th>${(r.cells||r.values.map(value=>({value}))).map(sourceCellHTML).join('')}</tr>`).join('')}</tbody></table></div>`;
 }
 async function loadPreview(g=generation){
  if(!chosen)return;const request=++previewRequest,id=chosen;
  const q=new URLSearchParams({offset:String(offset),limit:'100',show_all:String(showAll)});if(sheet)q.set('sheet',sheet);
  try{const r=await api(`/api/projects/${project.id}/data-room/${id}?${q}`);if(g!==generation||id!==chosen||request!==previewRequest)return;
   const p=r.preview,s=sources.find(x=>x.id===id);if(!s)return;sheet=p.sheet||null;
   root.querySelector('[data-full-preview]').innerHTML=`<h2>${esc(p.name)}</h2><p>${esc(kindLabel(s.agent_description?.source_kind||s.source_kind))} · ${esc(s.agent_description?.entity||'主体待明确')} · ${esc(s.agent_description?.period||'期间待明确')}</p><p class="source-dates">资料日期：${esc(s.source_date||s.agent_description?.source_date||'未确认')}<br>收件时间：${esc(timeHK(p.uploaded_at))}（香港）</p><details><summary>原件标识</summary><p>内容版本：${esc(p.sha256)}</p></details><a class="button button-small" href="/api/projects/${project.id}/data-room/${id}/original">下载保留的原件</a>${relationHTML(s)}
   ${s.agent_description?`<details><summary>Agent 对资料的识别与原文依据</summary><p>${esc(s.agent_description.rationale)}</p>${(s.agent_description.evidence||[]).map(e=>`<blockquote>${esc(e.quote)}<small>${esc(e.locator)}</small></blockquote>`).join('')}<small>源于原文的分析判断；可在右侧对话中纠正。</small></details>`:''}${(p.limitations||[]).map(l=>`<p class="notice warning">${esc(l)}</p>`).join('')}${p.kind==='table'?tableHTML(p):`<p class="field-hint">提取正文共 ${p.total} 字；可连续翻阅。不能提取的内容请看原件。</p><div class="source-text-preview">${esc(p.text)||'当前没有可读取的提取正文。原件与提取问题已保留。'}</div>`}
   <div class="button-row preview-pagination"><button class="button button-small" data-preview-prev ${!history.length?'disabled':''}>上一页</button><span>从${p.kind==='table'?'第 '+String(p.offset+1)+' 条有内容行':'正文位置 '+String(p.offset)}起显示</span><button class="button button-small" data-preview-next="${p.next_offset??''}" ${p.next_offset===null?'disabled':''}>下一页</button></div>`;
  }catch(e){if(g===generation&&request===previewRequest){const area=root.querySelector('[data-full-preview]');area.innerHTML=`<p class="notice warning" role="alert">预览未能读取：${esc(e.message)}</p>`;onError(e);}}
 }
 async function upload(files){
  if(busy||!files.length)return;busy=true;const g=generation,messages=[];
  try{for(const file of files){if(g!==generation)break;root.querySelector('[data-upload-progress]').textContent=`正在接收 ${file.name}…`;
    const form=new FormData();form.append('file',file);form.append('revision',String(project.revision));
    try{const data=await api(`/api/projects/${project.id}/intake`,{method:'POST',body:form});if(g!==generation)return;project=data.project;messages.push(`${file.name}：${data.duplicate?'内容重复，已关联已有资料':data.extraction_status==='extracted'?'已接收并提取':'原件已保存，提取状态见标准件房'}`);}catch(e){messages.push(`${file.name}：${e.message}`);}
   }
   if(g===generation){const r=await api(`/api/projects/${project.id}/data-room`);if(g!==generation)return;sources=r.sources;signature=JSON.stringify(sources);chosen=chosen||sources[0]?.id;render();root.querySelector('[data-upload-progress]').textContent=messages.join('\n');await loadPreview(g);onProject({project},false);}
  }catch(e){if(g===generation)onError(e);}finally{if(g===generation)busy=false;}
 }
 async function resolveForm(form,g){
  const notice=form.querySelector('[data-resolution-feedback]');
  if(busy){notice.textContent='正在保存，请稍候。';return;}
  const decision=form.elements.decision.value,reason=form.elements.reason.value.trim();
  if(!decision||!reason){notice.textContent=!decision?'请选择资料关系，再记录判断。':'请填写范围与依据，再记录判断。';notice.setAttribute('role','alert');(!decision?form.elements.decision:form.elements.reason).focus();return;}
  busy=true;const button=form.querySelector('button[type="submit"]');button.disabled=true;notice.textContent='正在保存资料关系…';
  try{const data=await api(`/api/projects/${project.id}/data-room/resolve`,{method:'POST',body:{revision:project.revision,source_id:form.dataset.source,other_id:form.dataset.other,decision,reason}});if(g!==generation)return;
   project=data.project;sources=data.sources||(await api(`/api/projects/${project.id}/data-room`)).sources;if(g!==generation)return;
   signature=JSON.stringify(sources);feedback=`已记录：${decisionLabel(decision)}。${reason}`;render();await loadPreview(g);onProject(data,false);
  }catch(err){if(g===generation){notice.textContent=`未保存：${err.message}。当前填写内容已保留。`;notice.setAttribute('role','alert');onError(err);}}
  finally{if(g===generation){busy=false;if(button.isConnected)button.disabled=false;}}
 }
 async function poll(g){
  if(g!==generation||!root)return;
  try{if(!busy){const data=await api(`/api/projects/${project.id}/data-room`);if(g!==generation)return;
    const next=JSON.stringify(data.sources);
    if(next!==signature){const editing=[...root.querySelectorAll('[data-source-resolution]')].some(f=>f.elements.reason.value||f.elements.decision.value);if(!editing){signature=next;sources=data.sources;const list=root.querySelector('.source-register');if(list)list.outerHTML=listHTML();await loadPreview(g);}}
    if(data.revision!==project.revision){const changed=await api(`/api/projects/${project.id}`);if(g===generation){project=changed.project;onProject(changed,false);}}
    const sync=root?.querySelector('[data-source-sync]');if(sync)sync.textContent=`资料同步检查 ${timeHK(new Date().toISOString())}（香港）`;
  }}catch{const sync=root?.querySelector('[data-source-sync]');if(g===generation&&sync)sync.textContent='资料同步暂未完成，保留上次内容；正在重试。';}
  finally{if(g===generation)timer=setTimeout(()=>poll(g),3500);}
 }
 function unmount(){generation++;clearTimeout(timer);events?.abort();events=null;root=null;busy=false;}
 async function mount(el,p,kind){unmount();root=el;project=p;mode=kind;feedback='';const g=generation;events=new AbortController();const options={signal:events.signal};root.textContent='正在读取源头资料…';
  try{const r=await api(`/api/projects/${p.id}/data-room`);if(g!==generation)return;sources=r.sources;signature=JSON.stringify(sources);chosen=selected.get(p.id)||sources.find(s=>s.active!==false)?.id||sources[0]?.id;sheet=null;offset=0;history=[];showAll=false;render();await loadPreview(g);
   root.addEventListener('click',e=>{const button=e.target.closest('[data-source-preview]');if(button){chosen=button.dataset.sourcePreview;selected.set(project.id,chosen);sheet=null;offset=0;history=[];showAll=false;root.querySelectorAll('[data-source-preview]').forEach(b=>b.classList.toggle('selected',b===button));loadPreview();}const next=e.target.closest('[data-preview-next]');if(next&&!next.disabled){history.push(offset);offset=Number(next.dataset.previewNext);loadPreview();}if(e.target.closest('[data-preview-prev]')&&history.length){offset=history.pop();loadPreview();}},options);
   root.addEventListener('change',e=>{if(e.target.matches('[data-preview-sheet]')){sheet=e.target.value;offset=0;history=[];loadPreview();}if(e.target.matches('[data-preview-all]')){showAll=e.target.checked;sheet=null;offset=0;history=[];loadPreview();}},options);
   root.addEventListener('submit',e=>{if(!e.target.matches('[data-intake-form],[data-source-resolution]'))return;e.preventDefault();e.stopPropagation();if(e.target.matches('[data-intake-form]'))upload([...e.target.elements.files.files]);else resolveForm(e.target,g);},options);
   root.addEventListener('dragover',e=>{if(e.target.closest('[data-intake-drop]'))e.preventDefault();},options);
   root.addEventListener('drop',e=>{if(e.target.closest('[data-intake-drop]')){e.preventDefault();upload([...e.dataTransfer.files]);}},options);
   timer=setTimeout(()=>poll(g),3500);
  }catch(e){if(g===generation)onError(e);}
 }
 return {mount,unmount};
}

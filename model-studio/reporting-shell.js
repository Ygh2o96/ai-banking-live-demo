/* Presentation navigation only. Opening a room never starts or changes a run. */
export function createRoomDrawer({mount,unmount,onDiscuss}) {
 const dialog=document.createElement('dialog');
 dialog.className='report-room-drawer';
 dialog.setAttribute('aria-labelledby','report-room-title');
 dialog.innerHTML='<header class="report-room-head"><div><small>展开查看</small><h2 id="report-room-title"></h2></div><div class="button-row"><button type="button" class="button button-small" data-drawer-discuss>回到对话讨论</button><button type="button" class="icon-button" data-drawer-close aria-label="收起详情">×</button></div></header><div class="report-room-body" data-room-body></div>';
 document.body.append(dialog);
 let current=null,returnFocus=null,currentKey='';
 function close({focus=true}={}) {
  if(!current)return;
  unmount();current=null;currentKey='';dialog.close();dialog.querySelector('[data-room-body]').replaceChildren();
  document.body.classList.remove('report-room-open');
  if(focus){
   const usable=el=>el?.isConnected&&el.getClientRects().length&&!el.closest('[inert]');
   const fallback=[document.querySelector('.navigation-toggle'),document.querySelector('#workspace .reporting-composer textarea')].find(usable);
   (usable(returnFocus)?returnFocus:fallback)?.focus({preventScroll:true});
  }
 }
 function open(id,title,key='') {
  if(current===id&&currentKey===key&&dialog.open){dialog.querySelector('[data-drawer-close]').focus();return;}
  if(current)close({focus:false});
  current=id;currentKey=key;returnFocus=document.activeElement;
  dialog.querySelector('h2').textContent=title;
  dialog.dataset.room=id;
  dialog.showModal();document.body.classList.add('report-room-open');
  mount(dialog.querySelector('[data-room-body]'),id);
  dialog.querySelector('[data-drawer-close]').focus({preventScroll:true});
 }
 dialog.querySelector('[data-drawer-close]').addEventListener('click',()=>close());
 dialog.querySelector('[data-drawer-discuss]').addEventListener('click',()=>{const id=current;close({focus:false});onDiscuss(id);});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&current&&!document.querySelector('dialog:modal')){event.preventDefault();close();}});
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
 return {open,close,current:()=>current,element:dialog};
}

/* The mobile menu uses the same navigation, with no duplicate project state. */
export function initWorkspaceNavigation() {
 const mobile=matchMedia('(max-width:800px)'),side=document.querySelector('.sidebar');
 const toggle=document.querySelector('.navigation-toggle'),main=document.querySelector('.main-shell');
 const scrim=document.querySelector('.navigation-scrim');
 if(!side||!toggle)return;
 let opened=false,previous=null;
 const focusable=()=>[...side.querySelectorAll('button,select,a[href],summary,input')].filter(el=>{
  if(el.disabled||el.tabIndex<0||el.closest('[inert]')||!el.getClientRects().length)return false;
  // Closed details can retain layout boxes for descendants that cannot receive focus.
  for(let parent=el.parentElement;parent&&parent!==side;parent=parent.parentElement){
   if(parent.matches('details:not([open])')){
    const summary=[...parent.children].find(child=>child.tagName==='SUMMARY');
    if(!summary?.contains(el))return false;
   }
  }
  return getComputedStyle(el).visibility==='visible';
 });
 function close({restore=true}={}){
  opened=false;document.body.classList.remove('navigation-open');toggle.setAttribute('aria-expanded','false');
  scrim.hidden=true;main.inert=false;side.inert=mobile.matches;side.removeAttribute('role');side.removeAttribute('aria-modal');
  if(restore&&previous?.isConnected)previous.focus({preventScroll:true});
 }
 toggle.addEventListener('click',()=>{
  if(opened){close();return;}
  previous=document.activeElement;opened=true;side.inert=false;main.inert=true;
  side.setAttribute('role','dialog');side.setAttribute('aria-modal','true');
  document.body.classList.add('navigation-open');scrim.hidden=false;toggle.setAttribute('aria-expanded','true');
  focusable()[0]?.focus({preventScroll:true});
 });
 document.querySelectorAll('[data-close-navigation]').forEach(button=>button.addEventListener('click',()=>close()));
 side.addEventListener('click',event=>{
  if(opened&&event.target.closest('[data-step],[data-open-room],#new-project'))close();
 });
 side.querySelector('#project-select')?.addEventListener('change',()=>{if(opened)close();});
 document.addEventListener('keydown',event=>{
  if(!opened)return;
  if(event.key==='Escape'){event.preventDefault();close();}
  if(event.key==='Tab'){
   const items=focusable(),first=items[0],last=items.at(-1);
   if(!items.includes(document.activeElement)){event.preventDefault();(event.shiftKey?last:first)?.focus();}
   else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  }
 });
 mobile.addEventListener('change',()=>close({restore:false}));close({restore:false});
}

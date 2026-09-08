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
  if(focus&&returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
 }
 // Refresh displayed content and its identity together, retaining the caller's focus anchor.
 function refresh(key='') {
  if(!current||!dialog.open)return;
  unmount();currentKey=key;
  mount(dialog.querySelector('[data-room-body]'),current);
 }
 function open(id,title,key='') {
  if(current===id&&currentKey===key&&dialog.open){dialog.querySelector('[data-drawer-close]').focus();return;}
  if(current)close({focus:false});
  current=id;currentKey=key;returnFocus=document.activeElement;
  dialog.querySelector('h2').textContent=title;
  dialog.dataset.room=id;
  dialog.show();document.body.classList.add('report-room-open');
  mount(dialog.querySelector('[data-room-body]'),id);
  dialog.querySelector('[data-drawer-close]').focus({preventScroll:true});
 }
 dialog.querySelector('[data-drawer-close]').addEventListener('click',()=>close());
 dialog.querySelector('[data-drawer-discuss]').addEventListener('click',()=>{const id=current;close({focus:false});onDiscuss(id);});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&current&&!document.querySelector('dialog:modal')){event.preventDefault();close();}});
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
 return {open,close,refresh,current:()=>current,element:dialog};
}

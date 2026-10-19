/* UpKeep boards: pull-to-refresh (phone/touch only). Pull down from the very top past ~70px, release -> location.reload().
   Touch events only, so mouse/desktop use is a no-op. No fetch, no storage, no sends. */
(function(){
 if(window.__ukPtr)return;window.__ukPtr=1;
 if(!('ontouchstart' in window)&&!(navigator.maxTouchPoints>0))return;
 var TH=70,MAX=120,st=null,dist=0,busy=false,el,ic,tx;
 function top(){return (window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0)<=0}
 function css(){var s=document.createElement('style');s.textContent=
  'html{overscroll-behavior-y:contain}'+
  '.uk-ptr{position:fixed;top:0;left:50%;z-index:2147483000;display:flex;align-items:center;gap:8px;padding:7px 14px 7px 10px;'+
  'background:#fff;border:1px solid #d9d6cf;border-radius:999px;box-shadow:0 2px 10px rgba(0,0,0,.08);color:#6b6b6b;'+
  'font:500 13px/1 Hind,system-ui,sans-serif;letter-spacing:.01em;pointer-events:none;opacity:0;'+
  'transform:translate(-50%,-56px);transition:opacity .15s}'+
  '.uk-ptr.on{opacity:1}.uk-ptr.anim{transition:transform .2s ease,opacity .2s}'+
  '.uk-ptr svg{width:18px;height:18px;flex:none;transition:transform .15s}'+
  '.uk-ptr.ready svg{transform:rotate(180deg)}'+
  '.uk-ptr.spin svg{animation:ukptr .8s linear infinite}'+
  '@keyframes ukptr{to{transform:rotate(360deg)}}';
  document.head.appendChild(s)}
 var ARROW='<svg viewBox="0 0 24 24" fill="none" stroke="#7a7a7a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
 var SPIN='<svg viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#e2dfd8"/><path d="M21 12a9 9 0 0 0-9-9" stroke="#7a7a7a"/></svg>';
 function build(){css();el=document.createElement('div');el.className='uk-ptr';el.setAttribute('role','status');el.setAttribute('aria-live','polite');
  ic=document.createElement('span');ic.style.display='flex';ic.innerHTML=ARROW;tx=document.createElement('span');tx.textContent='Pull to refresh';
  el.append(ic,tx);document.body.appendChild(el)}
 function show(d){var y=Math.min(d,MAX)*0.6-56+12;el.style.transform='translate(-50%,'+Math.round(y)+'px)';el.classList.add('on');
  var r=d>=TH;el.classList.toggle('ready',r);tx.textContent=r?'Release to refresh':'Pull to refresh'}
 function reset(){el.classList.add('anim');el.classList.remove('on','ready');el.style.transform='translate(-50%,-56px)';
  setTimeout(function(){el.classList.remove('anim')},220)}
 function scroller(t){for(;t&&t!==document.body&&t.nodeType===1;t=t.parentNode){var o=getComputedStyle(t).overflowY;
  if((o==='auto'||o==='scroll')&&t.scrollHeight>t.clientHeight&&t.scrollTop>0)return true}return false}
 function start(e){if(busy||e.touches.length!==1||!top()||scroller(e.target)){st=null;return}
  st={x:e.touches[0].clientX,y:e.touches[0].clientY,mode:null};dist=0}
 function move(e){if(!st||busy)return;var t=e.touches[0],dx=t.clientX-st.x,dy=t.clientY-st.y;
  if(!st.mode){if(Math.abs(dx)<6&&Math.abs(dy)<6)return;st.mode=(dy>0&&Math.abs(dy)>Math.abs(dx)&&top())?'pull':'none'}
  if(st.mode!=='pull')return;
  if(dy<=0||!top()){dist=0;reset();st.mode='none';return}
  dist=dy;if(e.cancelable)e.preventDefault();show(dist)}
 function end(){if(!st)return;var m=st.mode;st=null;if(m!=='pull')return;
  if(dist>=TH){busy=true;el.classList.add('anim','on','spin');el.classList.remove('ready');ic.innerHTML=SPIN;tx.textContent='Refreshing';
   el.style.transform='translate(-50%,16px)';setTimeout(function(){location.reload()},150)}else reset();dist=0}
 function init(){if(!document.body)return setTimeout(init,30);build();
  document.addEventListener('touchstart',start,{passive:true});document.addEventListener('touchmove',move,{passive:false});
  document.addEventListener('touchend',end,{passive:true});document.addEventListener('touchcancel',function(){if(st&&st.mode==='pull')reset();st=null;dist=0},{passive:true})}
 init();
})();

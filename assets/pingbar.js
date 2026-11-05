/* Ping bar: drag to resize on desktop (inner edge), Hide/Show toggle (slim tab), saved in localStorage. Phone keeps the stacked layout; Hide collapses the list. */
(function(){
var WK='ccm-ping-w',HK='ccm-ping-hidden',MIN=280,MAX=640,DEF=388,mq=matchMedia('(min-width:1100px)');
var st=document.createElement('style');st.textContent=
'@media (min-width:1100px){body.ccm-side{padding-right:calc(var(--pw,388px) + 8px)!important}body.ccm-side #p-pinglog,#v2-ping{width:var(--pw,388px)!important}body.pw-v2{padding-right:var(--pw,388px)!important}'+
'html.pw-hid body.ccm-side,html.pw-hid body.pw-v2{padding-right:44px!important}html.pw-hid body.ccm-side #p-pinglog,html.pw-hid #v2-ping{width:36px!important;padding:8px 0!important;overflow:hidden}'+
'html.pw-hid .pw-panel>*:not(.pw-tab){display:none!important}html:not(.pw-hid) .pw-tab{display:none}'+
'.pw-drag{position:absolute;left:-5px;top:0;bottom:0;width:10px;cursor:col-resize;z-index:5;touch-action:none}.pw-drag:after{content:"";position:absolute;left:4px;top:50%;width:2px;height:44px;margin-top:-22px;border-radius:2px;background:#cfc8bb}.pw-drag:hover:after,.pw-drag.on:after{background:#1a1a1a}html.pw-hid .pw-drag{display:none}'+
'.pw-tab{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;width:36px;height:100%;padding-top:10px;font:600 14px Khand,sans-serif;color:#1a1a1a}.pw-tab span{writing-mode:vertical-rl;letter-spacing:.06em}.pw-tab b{font:600 12px Hind,sans-serif;border:1px solid #d9d1c4;border-radius:99px;padding:2px 6px;background:#fff}}'+
'.pw-btn{font:600 12px Hind,sans-serif;border:1px solid #d9d1c4;background:#fff;color:#1a1a1a;border-radius:99px;padding:3px 10px;cursor:pointer;margin-left:auto}.pw-btn:hover{border-color:#1a1a1a}'+
'@media (max-width:1099px){html.pw-hid .pw-panel>*:not(.pw-head):not(.pw-tab){display:none!important}.pw-tab{display:none!important}.pw-drag{display:none}}'+
'body.pw-drag-on{cursor:col-resize;user-select:none}';
document.head.appendChild(st);
function clamp(w){return Math.max(MIN,Math.min(MAX,Math.min(w,innerWidth-560)))}
function setW(w){document.documentElement.style.setProperty('--pw',clamp(w)+'px')}
function setH(h){document.documentElement.classList.toggle('pw-hid',h);try{localStorage.setItem(HK,h?'1':'0')}catch(e){}var b=document.querySelector('.pw-btn');if(b){b.textContent=h?'Show':'Hide';b.setAttribute('aria-expanded',String(!h))}}
var w0=+localStorage.getItem(WK)||DEF;setW(w0);if(localStorage.getItem(HK)==='1')document.documentElement.classList.add('pw-hid');
function init(n){var p=document.getElementById('p-pinglog')||document.getElementById('v2-ping');if(!p||(p.id==='p-pinglog'&&!document.body.classList.contains('ccm-side'))){if(n<40)setTimeout(function(){init(n+1)},150);return}
 if(p.querySelector('.pw-btn'))return;if(p.id==='v2-ping')document.body.classList.add('pw-v2');p.classList.add('pw-panel');
 var hd=p.querySelector('.mc-ph')||p.firstElementChild;hd.classList.add('pw-head');hd.style.display='flex';hd.style.alignItems='center';
 var bt=document.createElement('button');bt.type='button';bt.className='pw-btn';bt.title='Hide or show the Ping Log';bt.onclick=function(){setH(!document.documentElement.classList.contains('pw-hid'))};hd.appendChild(bt);
 var tab=document.createElement('button');tab.type='button';tab.className='pw-tab';tab.setAttribute('aria-label','Show the Ping Log');tab.innerHTML='<b>Show</b><span>Ping Log</span>';tab.onclick=function(){setH(false)};p.appendChild(tab);
 var dg=document.createElement('div');dg.className='pw-drag';dg.setAttribute('role','separator');dg.setAttribute('aria-orientation','vertical');dg.setAttribute('aria-label','Drag to resize the Ping Log');dg.tabIndex=0;p.appendChild(dg);
 if(getComputedStyle(p).position==='static')p.style.position='relative';
 dg.addEventListener('pointerdown',function(e){if(!mq.matches)return;e.preventDefault();dg.setPointerCapture(e.pointerId);dg.classList.add('on');document.body.classList.add('pw-drag-on');
  function mv(ev){setW(innerWidth-ev.clientX)}function up(){dg.classList.remove('on');document.body.classList.remove('pw-drag-on');dg.removeEventListener('pointermove',mv);dg.removeEventListener('pointerup',up);var w=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pw'));try{localStorage.setItem(WK,w)}catch(x){}}
  dg.addEventListener('pointermove',mv);dg.addEventListener('pointerup',up)});
 dg.addEventListener('keydown',function(e){var w=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pw'))||DEF;if(e.key==='ArrowLeft')w+=20;else if(e.key==='ArrowRight')w-=20;else return;e.preventDefault();setW(w);localStorage.setItem(WK,clamp(w))});
 setH(document.documentElement.classList.contains('pw-hid'));addEventListener('resize',function(){setW(+localStorage.getItem(WK)||DEF)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){init(0)});else init(0);
})();

/* Live Supabase ping bridge (ops session). */
(function(){
  function add(src){if(document.querySelector('script[src="'+src+'"]'))return;var s=document.createElement('script');s.src=src;s.defer=true;document.head.appendChild(s)}
  var base=(document.currentScript&&document.currentScript.src||'').replace(/[^\/]*$/,'');
  add(base+'su-config.js'); add(base+'su-auth.js'); add(base+'su-live-pings.js');
})();

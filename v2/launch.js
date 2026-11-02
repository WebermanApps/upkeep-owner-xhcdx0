/* Launch Countdown + Launch Checklist (Nov 2 2026). Countdown target: Dec 1 2026 12:00 AM America/Detroit. Checklist: localStorage only. */
(function(){
"use strict";
var css='.lc-tick{display:inline-flex;align-items:center;gap:6px;font:500 13px Hind,system-ui,sans-serif;color:#1a1a1a;background:#fff;border:1px solid #e3ddd2;border-radius:999px;padding:3px 10px;white-space:nowrap;line-height:1.3}'+
'.lc-tick b{font:600 15px Khand,sans-serif;color:#C4552D}.lc-tick .lc-l{font:600 12px Khand,sans-serif;color:#555}.lc-tick .lc-tz{font-size:11px;color:#6b6b6b}'+
'.lc-wrap{display:flex;justify-content:flex-end;padding:4px 12px 0}.lc-float{position:fixed;top:8px;right:10px;z-index:50}'+
'@media(max-width:600px){.lc-tick .lc-tz{display:none}.lc-tick{font-size:12px}}'+
'.lc-sec{background:#fff;border-radius:12px;margin:12px 0;padding:10px 14px;box-shadow:0 1px 3px rgba(0,0,0,.06);font-family:Hind,system-ui,sans-serif;color:#1a1a1a}'+
'.lc-sec>summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px;font:600 20px Khand,sans-serif}.lc-sec>summary::-webkit-details-marker{display:none}'+
'.lc-sec>summary .lc-c{font:500 14px Hind,sans-serif;color:#555}.lc-sec>summary .lc-ch{margin-left:auto;transition:transform .15s}.lc-sec[open]>summary .lc-ch{transform:rotate(180deg)}'+
'.lc-bar{height:6px;background:#eee;border-radius:3px;margin:6px 0 8px;overflow:hidden}.lc-bar i{display:block;height:100%;background:#0B6E4F}'+
'.lc-ul{list-style:none;margin:0;padding:0}.lc-ul li{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f0ece4;font-size:15px}'+
'.lc-ul li.done span{color:#777;text-decoration:line-through}.lc-ul li span{flex:1}.lc-ul input{width:18px;height:18px;accent-color:#05668D}'+
'.lc-x{border:0;background:none;color:#8a8a8a;font-size:18px;cursor:pointer;padding:0 6px}.lc-x:hover{color:#B02030}'+
'.lc-add{display:flex;gap:6px;margin-top:8px}.lc-add input{flex:1;min-width:0;font:inherit;padding:6px 9px;border:1px solid #ccc;border-radius:8px}'+
'.lc-btn{font:600 14px Hind,sans-serif;padding:6px 12px;border-radius:8px;border:1px solid #bbb;background:#fff;color:#1a1a1a;cursor:pointer}.lc-btn.p{background:#05668D;border-color:#05668D;color:#fff}'+
'.lc-ft{display:flex;gap:6px;justify-content:flex-end;margin-top:8px}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
/* --- countdown --- */
function detroitOffsetMin(d){var p={};new Intl.DateTimeFormat('en-US',{timeZone:'America/Detroit',hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).formatToParts(d).forEach(function(x){p[x.type]=x.value});return (Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute)-Math.floor(d.getTime()/60000)*60000)/60000}
var guess=new Date(Date.UTC(2026,11,1,5,0));var TARGET=Date.UTC(2026,11,1,0,0)-detroitOffsetMin(guess)*60000; /* midnight Detroit (EST, UTC-5) */
function tick(){var el=document.createElement('span');el.className='lc-tick';el.setAttribute('role','timer');el.setAttribute('aria-label','Launch countdown');
 function up(){var ms=TARGET-Date.now();if(ms<=0){el.innerHTML='<span class="lc-l">Launched</span> <b>Dec 1</b>';return}var m=Math.floor(ms/60000),d=Math.floor(m/1440),h=Math.floor(m%1440/60),mi=m%60;
  el.innerHTML='<span class="lc-l">Launch In</span> <b>'+d+'d</b> <b>'+h+'h</b> <b>'+mi+'m</b> <span class="lc-tz">Dec 1 · Detroit Time</span>'}
 up();setInterval(up,15000);return el}
function placeTick(){var t=tick(),h=document.querySelector('.mc-mh-in')||document.querySelector('header.v2-hd')||document.querySelector('.mw-cc-header')||document.querySelector('header');
 if(h){var w=document.createElement('div');w.className='lc-host';w.style.cssText='margin-left:auto;display:flex;align-items:center';w.appendChild(t);
  var cs=getComputedStyle(h);if(cs.display.indexOf('flex')>=0){h.appendChild(w)}else{w.className='lc-wrap';h.appendChild(w)}}
 else{t.classList.add('lc-float');document.body.appendChild(t)}}
/* --- checklist --- */
var LK='launchChecklist.v1',LO='launchChecklist.open',SEED=['Final offer terms + refund rule','Invite text, video beats, deadline, welcome box picks','Last 7 warm-list homes + addresses','Film talking-head video with Ethan','Final video edit with app link + promo code','Order welcome box items','Promo codes at checkout','Real sign-up + payment backend','Move invite pages to smartupkeep.ai, no password, add phone number','Remove smartupkeep.ai beta password','Ethan hired + certified (EPA 608, Lead-Safe, OSHA 10, CPR)','Van bought, stocked, insured','Member agreement + refund policy with Legal','LLC registration + payments (e.g. Stripe)','Pricing decision at 25 members'];
function load(){try{var x=JSON.parse(localStorage.getItem(LK));if(Array.isArray(x))return x}catch(e){}return SEED.map(function(t){return {t:t,d:false}})}
function save(x){try{localStorage.setItem(LK,JSON.stringify(x))}catch(e){}}
function checklist(){var tgt=document.getElementById('p-warm')||document.getElementById('s-warm');if(!tgt||document.querySelector('.lc-sec'))return;
 var L=load(),sec=document.createElement('details');sec.className='lc-sec';sec.id='launch-checklist';sec.open=localStorage.getItem(LO)==='1';
 sec.addEventListener('toggle',function(){localStorage.setItem(LO,sec.open?'1':'0')});
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function draw(){var n=L.filter(function(x){return x.d}).length,pct=L.length?Math.round(n/L.length*100):0;
  sec.innerHTML='<summary>Launch Checklist <span class="lc-c">'+n+' of '+L.length+' Done</span><span class="lc-ch" aria-hidden="true">▾</span></summary>'+
  '<div class="lc-bar"><i style="width:'+pct+'%"></i></div><ul class="lc-ul">'+L.map(function(x,i){return '<li class="'+(x.d?'done':'')+'"><input type="checkbox" data-i="'+i+'"'+(x.d?' checked':'')+' aria-label="Done"><span>'+esc(x.t)+'</span><button class="lc-x" data-del="'+i+'" title="Delete" aria-label="Delete item">×</button></li>'}).join('')+'</ul>'+
  '<form class="lc-add"><input placeholder="Add Item" aria-label="New checklist item"><button class="lc-btn p" type="submit">Add Item</button></form>'+
  '<div class="lc-ft"><button class="lc-btn" type="button" data-restore>Restore Original</button><button class="lc-btn" type="button" data-all>Delete All</button></div>';
  sec.querySelectorAll('input[type=checkbox]').forEach(function(c){c.onchange=function(){L[+c.dataset.i].d=c.checked;save(L);draw()}});
  sec.querySelectorAll('[data-del]').forEach(function(b){b.onclick=function(){L.splice(+b.dataset.del,1);save(L);draw()}});
  sec.querySelector('.lc-add').onsubmit=function(e){e.preventDefault();var v=this.querySelector('input').value.trim();if(v){L.push({t:v,d:false});save(L);draw();sec.querySelector('.lc-add input').focus()}};
  sec.querySelector('[data-all]').onclick=function(){if(confirm('Delete all checklist items?')){L=[];save(L);draw()}};
  sec.querySelector('[data-restore]').onclick=function(){L=SEED.map(function(t){return {t:t,d:false}});save(L);draw()};
 }
 draw();tgt.parentNode.insertBefore(sec,tgt)}
function init(){placeTick();checklist();if(!document.querySelector('.lc-sec')){var n=0,iv=setInterval(function(){checklist();if(document.querySelector('.lc-sec')||++n>40)clearInterval(iv)},250)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* Launch Countdown + Launch Checklist (Nov 2 2026). Countdown target: Dec 1 2026 12:00 AM America/Detroit. Checklist: localStorage only. Launch Timeline added Nov 2 2026. */
(function(){
"use strict";
var css='.lc-tick{display:inline-flex;align-items:center;gap:6px;font:500 13px Hind,system-ui,sans-serif;color:#1a1a1a;background:#fff;border:1px solid #e3ddd2;border-radius:999px;padding:3px 10px;white-space:nowrap;line-height:1.3}'+
'.lc-tick b{font:600 15px Khand,sans-serif;color:#C4552D}.lc-tick .lc-l{font:600 12px Khand,sans-serif;color:#555}.lc-tick .lc-tz{font-size:11px;color:#6b6b6b}'+
'.lc-wrap{display:flex;justify-content:flex-end;padding:4px 12px 0}.lc-float{position:fixed;top:8px;right:10px;z-index:50}'+
'@media(max-width:600px){.lc-tick .lc-tz{display:none}.lc-tick{font-size:12px}}'+
'.lc-stack{display:flex;flex-direction:column;gap:12px;margin:12px 0;grid-column:1/-1;min-width:0;max-width:100%}.lc-stack>*{min-width:0;max-width:100%;box-sizing:border-box}.v2-sec.lc-sec>summary{min-height:35px}.lc-warm .wl-t{display:block;overflow-x:auto}@media(max-width:700px){.lc-warm .wl-t{display:table}}'+
'.lc-sec{display:block;width:auto;height:auto!important;min-height:0!important;grid-area:auto!important;color:#1a1a1a}.lc-sec:not([open]){padding-bottom:0}'+
'.lc-sec>summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:10px}.lc-sec>summary::-webkit-details-marker{display:none}.lc-sec>summary h2{margin:0}'+
'.lc-ch{margin-left:auto;transition:transform .15s;color:#555}.lc-sec[open]>summary .lc-ch,.lc-warm:not(.wl-closed) .lc-ch{transform:rotate(180deg)}.lc-sec:not([open])>summary,.lc-warm.wl-closed>.mc-ph{border-bottom:0;margin-bottom:0}'+
'.lc-warm{height:auto!important;min-height:0!important}.lc-warm.wl-closed{padding-bottom:0}.lc-warm.wl-closed>:not(.mc-ph){display:none!important}.lc-wh{cursor:pointer}.lc-wh>.wl-count:not(.lc-wc){display:none}'+
'.lc-body{padding-top:4px}.p-warm.lc-warm .mc-pb{overflow:visible}'+
'.lc-bar{height:6px;background:#eee;border-radius:3px;margin:6px 0 8px;overflow:hidden}.lc-bar i{display:block;height:100%;background:#0B6E4F}'+
'.lc-ul{list-style:none;margin:0;padding:0}.lc-ul li{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f0ece4;font-size:15px}'+
'.lc-ul li.done span{color:#777;text-decoration:line-through}.lc-ul li span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lc-ul input{width:16px;height:16px;margin:0;flex:none;accent-color:#05668D}'+
'.lc-x{flex:none;border:0;background:none;color:#8a8a8a;font-size:18px;line-height:1;cursor:pointer;padding:0 6px}.lc-x:hover{color:#B02030}'+
'.lc-foot{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px}.lc-foot .lc-add{flex:1 1 320px;margin:0}.lc-foot .lc-ft{margin:0}.lc-m{flex:none}'+
'.lc-add{display:flex;gap:6px;margin-top:8px}.lc-add input{flex:1;min-width:0;font:inherit;padding:6px 9px;border:1px solid #ccc;border-radius:8px}'+
'.lc-btn{font:600 13px Hind,sans-serif;padding:6px 12px;border-radius:8px;border:1px solid #bbb;background:#fff;color:#1a1a1a;cursor:pointer}.lc-btn.p{background:#05668D;border-color:#05668D;color:#fff}'+
'.lc-ft{display:flex;gap:6px;justify-content:flex-end;margin-top:8px}'+
'.lc-m{font:600 12px Khand,sans-serif;font-style:normal;color:#05668D;background:#E8F1F5;border-radius:999px;padding:1px 8px;white-space:nowrap}'+
'.lt-h{font:600 16px Khand,sans-serif;margin:10px 0 2px;color:#1a1a1a}.lt-ul{margin:0;padding-left:18px;font-size:15px}.lt-ul li{padding:2px 0}';
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
var LK='launchChecklist.v1',LO='launchChecklist.open',TO='launchTimeline.open';
/* SEED (Nov 2 2026 plan): [text, target month tag, done by default]. Saved lists in localStorage are kept; Restore Original loads this seed. */
var SEED=[['Final offer terms + refund rule','Nov'],['Swipe the decks','Nov'],['Last 7 warm-list homes + addresses','Nov'],['Approve the script','Nov'],['Film talking-head video with Ethan (lined up for November)','Nov'],['Final video edit with app link + promo code','Nov'],['Promo codes at checkout','Nov',true],['Real sign-up + payment backend','Nov'],['Member agreement + refund policy with Legal','Nov'],['LLC registration + payments (e.g. Stripe)','Nov'],['Pricing decision','Nov'],['Invites out: text first, then video, then mailer, 3 days apart','Dec 1'],['Move invite pages to smartupkeep.ai, no password, add phone number','Dec 1'],['Remove smartupkeep.ai beta password','Dec 1'],['Ethan hired + certified (EPA 608, Lead-Safe, OSHA 10, CPR)','Dec'],["Confirm Ethan's onboarding is ready",'Dec'],['Van bought, stocked, insured','Dec']];
function seedList(){return SEED.map(function(x){return {t:x[0],m:x[1],d:!!x[2]}})}
var TL=[['November 2026 · Before Launch',['Finalize the offer terms and the refund rule','Swipe the decks','Add the last 7 warm-list homes','Approve the script','Film the talking-head video with Ethan (line him up for November)','Final video edit','Build the real sign-up and payment backend','Draft the member agreement and refund policy with Legal','Set up the LLC and payments','Make the pricing decision']],
['Dec 1 2026 · Launch',['Invites go out by text first, then the video, then a mailer, three days apart','Invite pages move to smartupkeep.ai with no password','Remove the beta password']],
['December 2026',['Hire Ethan and get him certified (EPA 608, Lead-Safe, OSHA 10, CPR); paid training hours start, about 40 hours (estimate)','Buy, stock and insure the van']],
['January 2027',['No visits on Jan 1 or Jan 4–8','Jan 11: first demo home · Jan 12: second · Jan 13: two homes','Remaining 21 demo homes through Jan 29: 1 visit each Friday, 2 each other weekday']]];
function load(){try{var x=JSON.parse(localStorage.getItem(LK));if(Array.isArray(x))return x}catch(e){}return seedList()}
function save(x){try{localStorage.setItem(LK,JSON.stringify(x))}catch(e){}}
function isV2(){return !!document.getElementById('s-warm')}
function shell(id,title,key,def){var v=isV2(),d=document.createElement('details');d.id=id;d.className='lc-sec '+(v?'v2-sec':'mc-p');
 var o=localStorage.getItem(key);d.open=o==null?!!def:o==='1';d.addEventListener('toggle',function(){try{localStorage.setItem(key,d.open?'1':'0')}catch(e){}});
 var sm=document.createElement('summary');sm.className='lc-sum mc-ph'+(v?' v2-sh':'');sm.innerHTML='<h2>'+title+'</h2><span class="wl-count lc-c"></span><span class="lc-ch" aria-hidden="true">▾</span>';
 var bd=document.createElement('div');bd.className='lc-body mc-pb'+(v?' v2-sb':'');d.append(sm,bd);return {d:d,c:sm.querySelector('.lc-c'),b:bd}}
function stack(){var st=document.getElementById('lc-stack');if(st)return st;var w=document.getElementById('p-warm')||document.getElementById('s-warm');if(!w)return null;
 st=document.createElement('div');st.id='lc-stack';st.className='lc-stack';
 if(isV2()){w.parentNode.insertBefore(st,w)}else{var g=document.getElementById('mc-grid')||w.parentNode;g.parentNode.insertBefore(st,g.nextSibling)}
 return st}
function timeline(st){if(document.getElementById('launch-timeline'))return;var x=shell('launch-timeline','Launch Timeline',TO,false);x.c.textContent='Nov 2026 to Jan 2027 · Plan';
 x.b.innerHTML=TL.map(function(g){return '<h4 class="lt-h">'+g[0]+'</h4><ul class="lt-ul">'+g[1].map(function(t){return '<li>'+t+'</li>'}).join('')+'</ul>'}).join('');st.appendChild(x.d)}
function warmFold(st){var w=document.getElementById('p-warm')||document.getElementById('s-warm');if(!w||w.dataset.lcFold)return;w.dataset.lcFold='1';
 w.style.gridArea='';w.classList.add('lc-warm');st.appendChild(w);var h=w.querySelector('.mc-ph'),K='warmList.open';if(!h)return;
 h.classList.add('lc-wh');h.setAttribute('role','button');h.tabIndex=0;var c=document.createElement('span');c.className='wl-count lc-wc';var ch=document.createElement('span');ch.className='lc-ch';ch.setAttribute('aria-hidden','true');ch.textContent='▾';h.append(c,ch);
 function cnt(){var n=0,t=0;try{var s=JSON.parse(localStorage.getItem('ccm-warm-v1'));if(s&&s.homes){t=s.homes.length;n=s.homes.filter(function(x){return x.status==='Member'}).length}}catch(e){}if(!t){try{var sd=JSON.parse(document.getElementById('warm-data').textContent);n=sd.homes.filter(function(x){return x.status==='Member'}).length}catch(e){n=25}}c.textContent=n+' Members'}
 function set(o){w.classList.toggle('wl-closed',!o);h.setAttribute('aria-expanded',String(o));try{localStorage.setItem(K,o?'1':'0')}catch(e){}cnt()}
 h.addEventListener('click',function(e){if(e.target.closest('button,a,input,select'))return;set(w.classList.contains('wl-closed'))});h.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();h.click()}});
 w.addEventListener('change',cnt);set(localStorage.getItem(K)==='1')}
function checklist(){var tgt=document.getElementById('p-warm')||document.getElementById('s-warm');if(!tgt||document.getElementById('launch-checklist'))return;var st=stack();
 var L=load(),x=shell('launch-checklist','Launch Checklist',LO,false),sec=x.d,B=x.b;
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function draw(){var n=L.filter(function(x){return x.d}).length,pct=L.length?Math.round(n/L.length*100):0;x.c.textContent=n+' of '+L.length+' Done';
  B.innerHTML='<div class="lc-bar"><i style="width:'+pct+'%"></i></div><ul class="lc-ul">'+L.map(function(x,i){return '<li class="'+(x.d?'done':'')+'"><input type="checkbox" data-i="'+i+'"'+(x.d?' checked':'')+' aria-label="Done"><span title="'+esc(x.t)+'">'+esc(x.t)+'</span>'+(x.m?'<em class="lc-m">'+esc(x.m)+'</em>':'')+'<button class="lc-x" data-del="'+i+'" title="Delete" aria-label="Delete item">×</button></li>'}).join('')+'</ul>'+
  '<div class="lc-foot"><form class="lc-add"><input placeholder="Add Item" aria-label="New checklist item"><button class="lc-btn p" type="submit">Add Item</button></form>'+
  '<div class="lc-ft"><button class="lc-btn" type="button" data-restore>Restore Original</button><button class="lc-btn" type="button" data-all>Delete All</button></div></div>';
  B.querySelectorAll('input[type=checkbox]').forEach(function(c){c.onchange=function(){L[+c.dataset.i].d=c.checked;save(L);draw()}});
  B.querySelectorAll('[data-del]').forEach(function(b){b.onclick=function(){L.splice(+b.dataset.del,1);save(L);draw()}});
  B.querySelector('.lc-add').onsubmit=function(e){e.preventDefault();var v=this.querySelector('input').value.trim();if(v){L.push({t:v,d:false});save(L);draw();B.querySelector('.lc-add input').focus()}};
  B.querySelector('[data-all]').onclick=function(){if(confirm('Delete all checklist items?')){L=[];save(L);draw()}};
  B.querySelector('[data-restore]').onclick=function(){L=seedList();save(L);draw()};
 }
 draw();st.appendChild(sec);timeline(st);warmFold(st)}
function init(){placeTick();checklist();if(!document.querySelector('.lc-sec')){var n=0,iv=setInterval(function(){checklist();if(document.querySelector('.lc-sec')||++n>40)clearInterval(iv)},250)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* uk11f mission header (same on the Command Center and the 4 team boards): callsign, mission clock, status light bars, tab row. No layout reset (panels fixed).
   Reads the page's own board-data (field "mc"). UpKeep Develop, Oct 20 2026. */
(function(){'use strict';
var B=document.body,K=B.getAttribute('data-board')||'',ROOT=K==='ethan-cc'?'./':'../';
var TABS=[['ethan-cc','Command Center',''],['members','Members','members/'],['technicians','Technicians','technicians/'],['tools-equipment','Tools & Equipment','tools-equipment/'],['scheduling','Scheduling','scheduling/'],['security','Security',null]];
var CALL={'ethan-cc':'UPK-CC','members':'UPK-MEM','technicians':'UPK-TEC','tools-equipment':'UPK-TLS','scheduling':'UPK-SCH'};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var bd=null;try{bd=JSON.parse(document.getElementById('board-data').textContent)}catch(_){}
var mc=(bd&&bd.mc)||{};
var h=el('header','mc-mh');h.setAttribute('aria-label','Mission header');var r=el('div','mc-mh-in');
var a=el('a','mc-apps mc-hide-s');a.href='https://webermanapps.github.io/a-o956qercs5ubd57y/';a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M3 11l9-7 9 7"></path><path d="M5 10v10h14V10"></path><path d="M10 20v-6h4v6"></path></svg>';a.appendChild(el('span',null,'Apps'));a.setAttribute('aria-label','Apps Home');
var cs=el('div','mc-cs');var im=el('img');im.src=ROOT+'assets/smart-upkeep-mark.png';im.alt='';im.width=28;im.height=28;cs.append(im,el('b',null,CALL[K]||'UPK'),el('span',null,K==='ethan-cc'?'UpKeep Command Center':(TABS.filter(function(t){return t[0]===K})[0]||[0,''])[1]+' Command Center'));
var L=el('div','mc-lights');L.setAttribute('aria-label','Status lights');
(mc.lights||[]).forEach(function(x){var s=el('span','mc-light '+(x.c==='green'?'':x.c));s.title=x.name+': '+x.why;s.setAttribute('role','img');s.setAttribute('aria-label',x.name+' '+x.c+': '+x.why);s.append(el('i'),el('span',null,x.short||x.name));L.appendChild(s)});
var ck=el('div','mc-clock');var sim=el('span','sim',mc.sim||'');sim.title='TEST snapshot date';var ict=el('span','ict');var tb=el('b');tb.setAttribute('aria-live','off');ict.append(tb,document.createTextNode(' ICT'));ck.append(sim,ict);
function tick(){var d=new Date(Date.now()+7*36e5);tb.textContent=('0'+d.getUTCHours()).slice(-2)+':'+('0'+d.getUTCMinutes()).slice(-2)+':'+('0'+d.getUTCSeconds()).slice(-2)}tick();setInterval(tick,1000);
r.append(a,cs,L,ck);
h.appendChild(r);var nav=el('nav','mc-tabs');nav.setAttribute('aria-label','Boards');
TABS.forEach(function(t){var x;if(t[2]===null){x=el('span','mc-tab is-soon t-'+t[0]);x.title='Coming Soon';x.append(el('i'),document.createTextNode(t[1]+' \u00b7 soon'))}else{x=el('a','mc-tab t-'+t[0]);x.href=ROOT+t[2]||'./';if(!t[2])x.href=ROOT;x.append(el('i'),document.createTextNode(t[1]));if(t[0]===K)x.setAttribute('aria-current','page')}nav.appendChild(x)});
h.appendChild(nav);B.insertBefore(h,B.firstChild);
})();

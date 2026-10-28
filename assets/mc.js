/* uk11i UpKeep Command Center: MacBook-fit 6 panels; no header Needs Machan;
   tile content per Oct 28 deck locks (Members/Technicians/Scheduling/Ping Log) +
   Tools vans+shop freewrite; Marketing summary. UpKeep Develop / Machan Oct 28 2026.
   Reads only the inline #mc-data block (TEST snapshot). Clears legacy ukcc-layout-uk11f. */
(function(){'use strict';
var D;try{D=JSON.parse(document.getElementById('mc-data').textContent)}catch(_){return}
var LS='ukcc-layout-uk11f',COLS=12,ROWS=6,RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(i){return document.getElementById(i)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function chip(t,c){return el('span','chip '+(c||'mute'),t)}
function toast(m){var t=el('div','mc-toast',m);t.setAttribute('role','status');document.body.appendChild(t);setTimeout(function(){t.remove()},3200)}
function stub(l){var b=el('button','mc-b stub',l);b.type='button';b.addEventListener('click',function(){toast('Not connected yet. Nothing was sent or changed (TEST).')});return b}
function rows(list,lim){var u=el('ul','mc-rows');(list||[]).slice(0,lim||99).forEach(function(x){var li=el('li'),s=el('span');s.appendChild(el('b',null,x.t));if(x.s)s.appendChild(el('small',null,x.s));li.appendChild(s);if(x.r)li.appendChild(el('em',null,x.r));if(x.chip)li.appendChild(chip(x.chip[0],x.chip[1]));u.appendChild(li)});return u}
function moreHint(n,shown){if(n>shown){var p=el('p','mc-more','+ '+(n-shown)+' more');return p}return null}
function fold(h,n,sum,body){var d=el('details','mc-fold'),s=el('summary');s.append(el('b',null,h+(n!=null?' ('+n+')':'')),el('span',null,sum||''));d.appendChild(s);var b=el('div');d.appendChild(b);if(body)body(b);return d}
function ro(stats){var g=el('div','mc-ro');stats.forEach(function(s){var c=el('div');c.append(el('b','num',s[1]),el('span',null,s[0]));if(s[2])c.appendChild(el('small',null,s[2]));g.appendChild(c)});return g}
function needBand(t,opts){opts=opts||{};var nd=el('div','mc-need');nd.id='need-'+t.id;
 /* z7cble note: Needs only when items exist — no empty Needs headers on every section; no global header Needs */
 if(!(t.needs&&t.needs.length)||opts.hide){nd.hidden=true;nd.setAttribute('aria-hidden','true');return nd}
 var h=el('h3',null,'Needs Machan');nd.appendChild(h);
 var u=el('ul');t.needs.forEach(function(x){var li=el('li'),s=el('span');s.appendChild(el('b',null,x.t));if(x.s)s.appendChild(el('small',null,x.s));li.appendChild(s);(x.acts||[]).forEach(function(a){li.appendChild(stub(a))});u.appendChild(li)});nd.appendChild(u);
 return nd}
function sortable(t,cols,data,rowFn,init){var st={k:init||null,d:1},tb=el('tbody'),th=el('thead'),tr=el('tr');
 cols.forEach(function(c){var x=el('th');var b=el('button',null,c[0]);b.type='button';x.appendChild(b);x.setAttribute('aria-sort','none');b.addEventListener('click',function(){if(st.k===c[1])st.d=-st.d;else{st.k=c[1];st.d=1}draw()});x._k=c[1];tr.appendChild(x)});th.appendChild(tr);t.append(th,tb);
 function draw(){[].forEach.call(tr.children,function(x){x.setAttribute('aria-sort',x._k===st.k?(st.d>0?'ascending':'descending'):'none')});var L=data.slice();if(st.k)L.sort(function(a,b){var p=a[st.k],q=b[st.k];var r=(typeof p==='number'&&typeof q==='number')?p-q:String(p).localeCompare(String(q),undefined,{numeric:true});return r*st.d});while(tb.firstChild)tb.firstChild.remove();L.forEach(function(x){tb.appendChild(rowFn(x))})}
 draw();return t}
function td(r,v,c){var x=el('td',c||null);if(v instanceof Node)x.appendChild(v);else x.textContent=v==null?'\u2013':v;r.appendChild(x);return x}
var P={};
/* ---------- specialized tiles (deck locks Oct 28) ---------- */
/* Members v7bucs: Primary metrics · 4 pills · Needs OFF · open messages list · 4 then more · mid density */
P['team-members']=function(b){var t=D.teams.find(function(x){return x.id==='members'});if(!t)return;
 b.appendChild(ro(t.stats.slice(0,4)));
 /* Needs Machan OFF on Members tile — still keep a hidden anchor if linked elsewhere */
 b.appendChild(needBand(t,{hide:true}));
 var open=(t.main.rows||[]).filter(function(r){return !r.f||r.f==='Open'||(r.chip&&/new|waiting/i.test(r.chip[0]))});
 if(!open.length)open=t.main.rows||[];
 b.appendChild(el('p','mc-sec','Open messages'));
 b.appendChild(rows(open,4));
 var mh=moreHint(open.length,4);if(mh)b.appendChild(mh)};
/* Technicians u3tf3p: Metrics · clear green Needs · stop bars per TD · folds if room */
P['team-technicians']=function(b){var t=D.teams.find(function(x){return x.id==='technicians'});if(!t)return;
 b.appendChild(ro(t.stats.slice(0,4)));
 b.appendChild(needBand(t));
 /* Week load stop bars per TD — always (deck A) */
 var wl=(t.folds||[]).find(function(f){return /week load/i.test(f.h)});
 if(wl&&wl.bars){b.appendChild(el('p','mc-sec','Week load'));wl.bars.forEach(function(br){var r=el('div','mc-bar'),i=el('i'),u=el('u');u.style.width=(br.v/br.max*100)+'%';i.appendChild(u);r.append(el('span',null,br.t),i,el('em',null,br.r));b.appendChild(r)})}
 /* Folds (Certs / Training) only if MacBook room — include compact when clear + bars fit */
 if(!t.needs.length){(t.folds||[]).filter(function(f){return !/week load/i.test(f.h)}).slice(0,2).forEach(function(f){b.appendChild(fold(f.h,f.n,f.sum,function(x){if(f.rows)x.appendChild(rows(f.rows,3));if(f.bars)f.bars.forEach(function(br){var r=el('div','mc-bar'),i=el('i'),u=el('u');u.style.width=(br.v/br.max*100)+'%';i.appendChild(u);r.append(el('span',null,br.t),i,el('em',null,br.r));x.appendChild(r)});if(f.note)x.appendChild(el('p','mc-quiet',f.note))}))})}};
/* Scheduling hqq4gd: Metrics · green clear Needs · separate Scheduling Requests (not under Needs) · 4 rows */
P['team-scheduling']=function(b){var t=D.teams.find(function(x){return x.id==='scheduling'});if(!t)return;
 b.appendChild(ro(t.stats.slice(0,4)));
 b.appendChild(needBand(t)); /* green when all clear (note) */
 b.appendChild(el('p','mc-sec','Scheduling Requests'));
 var req=t.main.rows||[];
 b.appendChild(rows(req,4));
 var mh=moreHint(req.length,4);if(mh)b.appendChild(mh)};
/* Tools freewrite: per-van subsections + At the Shop (van lows separate from shop lows). Needs when relevant. */
P['team-tools-equipment']=function(b){var t=D.teams.find(function(x){return x.id==='tools-equipment'});if(!t)return;
 b.appendChild(ro(t.stats.slice(0,4)));
 b.appendChild(needBand(t));
 var vans={};(D.gear&&D.gear.vans||[]).forEach(function(x){var k=String(x.van);(vans[k]=vans[k]||[]).push(x)});
 var vanIds=Object.keys(vans).sort(function(a,b){return (+a)-(+b)});
 vanIds.forEach(function(vid){var lows=vans[vid].filter(function(x){return x.st==='Below min'});
  var blk=el('div','mc-van');
  var hd=el('div','mc-van-h');hd.append(el('b',null,'Van #'+vid),el('span',null,'Tech Dash '+vid));
  hd.appendChild(chip(lows.length?lows.length+' low':'OK',lows.length?'warn':'ok'));
  blk.appendChild(hd);
  if(lows.length){var u=el('ul','mc-rows');lows.forEach(function(x){var li=el('li'),s=el('span');s.appendChild(el('b',null,x.item));s.appendChild(el('small',null,x.cat+' · '+x.on+' on · min '+x.min));li.appendChild(s);li.appendChild(chip('Below min','warn'));u.appendChild(li)});blk.appendChild(u)}
  else blk.appendChild(el('p','mc-quiet','No van lows'));
  b.appendChild(blk)});
 /* At the Shop — shared / shop-shelf lows (not invented counts). Prefer gear.shop; else shared needs (Van 1-3) + clear. */
 var shop=el('div','mc-shop');
 var sh=el('div','mc-van-h');sh.append(el('b',null,'At the Shop'),el('span',null,'Shop shelf'));
 var shopLines=[];
 if(D.gear&&D.gear.shop&&D.gear.shop.length){shopLines=D.gear.shop}
 else{(t.needs||[]).forEach(function(n){if(/Van 1-3|all vans|shop/i.test(n.s||'')||/Van 1-3|all vans|shop/i.test(n.t||''))shopLines.push({t:n.t,s:n.s||'Shared restock',chip:n.chip||['Shop','shop']})})}
 sh.appendChild(chip(shopLines.length?shopLines.length+' low':'OK',shopLines.length?'shop':'ok'));
 shop.appendChild(sh);
 if(shopLines.length){var u2=el('ul','mc-rows');shopLines.forEach(function(x){var li=el('li'),s=el('span');s.appendChild(el('b',null,x.t||x.item));if(x.s)s.appendChild(el('small',null,x.s));li.appendChild(s);if(x.chip)li.appendChild(chip(x.chip[0],x.chip[1]||'shop'));u2.appendChild(li)});shop.appendChild(u2)}
 else shop.appendChild(el('p','mc-quiet','No shop lows (TEST)'));
 b.appendChild(shop)};
/* Marketing summary placeholder (18vb3b still open — keep summary only) */
P.marketing=function(b){b.appendChild(el('p','mc-quiet','Early marketing KPIs (placeholders — not live).'));
 b.appendChild(el('p','mc-quiet','Full campaigns board still open (18vb3b). This tile shows early metric slots only.'));
 var g=el('div','mc-ro');[['Reach','—','early'],['CTR','—','early'],['Leads','—','early'],['Spend','—','early']].forEach(function(s){var c=el('div');c.append(el('b','num',s[1]),el('span',null,s[0]));c.appendChild(el('small',null,s[2]));g.appendChild(c)});b.appendChild(g)};
/* Ping Log l8sm55: Always-expanded table · team tabs · 5 rows before scroll · quiet chevron */
P.pinglog=function(b){var lk=el('p','mc-lock');lk.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>';lk.appendChild(document.createTextNode('Locked log · UK-YYYYMMDD-NN · '));lk.appendChild(el('span','test','TEST'));
 var chev=el('button','mc-chev');chev.type='button';chev.setAttribute('aria-label','Ping Log panel');chev.innerHTML='&#9662;';chev.title='Always expanded';b.append(lk,chev);
 var cur='All',tabs=el('div','mc-ttabs'),box=el('div','mc-ping-body');
 ['All'].concat(D.teams.map(function(t){return t.name})).forEach(function(n){var x=el('button',null,n);x.type='button';x.setAttribute('aria-pressed',String(n===cur));x.addEventListener('click',function(){cur=n;[].forEach.call(tabs.children,function(y){y.setAttribute('aria-pressed',String(y===x))});draw()});tabs.appendChild(x)});
 b.append(tabs,box);
 function draw(){while(box.firstChild)box.firstChild.remove();var L=D.pings.filter(function(p){return cur==='All'||p.team===cur});var cn={Open:0,'In progress':0,Done:0};L.forEach(function(p){cn[p.state]=(cn[p.state]||0)+1});
  box.appendChild(el('p','mc-quiet',L.length+' pings · '+(cn.Open||0)+' open · '+(cn['In progress']||0)+' in progress · '+(cn.Done||0)+' done'));
  var wrap=el('div','mc-ping-scroll');var t=el('table','mc-t'),th=el('thead'),tr=el('tr');
  ['ID','Time','Type','Summary','Team','Status'].forEach(function(c){tr.appendChild(el('th',null,c))});th.appendChild(tr);t.appendChild(th);var tb=el('tbody');t.appendChild(tb);
  L.forEach(function(p){var r=el('tr');td(r,p.id,'mono');td(r,p.time,'mono');td(r,p.type);var s=td(r,p.summary);if(p.waiting)s.appendChild(el('span','w','Waiting: '+p.waiting));td(r,p.team);td(r,chip(p.state,p.state==='Open'?'s-open':p.state==='Done'?'s-done':'s-prog'));tb.appendChild(r)});
  if(!L.length){var er=el('tr'),ec=el('td','mc-quiet','No pings from this team yet.');ec.colSpan=6;er.appendChild(ec);tb.appendChild(er)}
  wrap.appendChild(t);box.appendChild(wrap)}draw()};
/* legacy helpers kept for any stray panel ids */
P.status=function(b){b.appendChild(el('p','mc-quiet','Status lives in the header lights.'))};
P.gear=P['team-tools-equipment'];
/* ---------- build ---------- */
var DEF=D.layout,G=$('mc-grid');var map={};
DEF.forEach(function(p){var s=el('section','mc-p p-'+p.id+(p.team?' is-acc t-'+p.team:''));s.id='p-'+p.id;s.setAttribute('aria-labelledby','ph-'+p.id);var h=el('div','mc-ph'),h2=el('h2',null,p.title);h2.id='ph-'+p.id;h.appendChild(h2);if(p.badge)h.appendChild(el('span','test',p.badge));h.appendChild(el('span','sp'));if(p.href){var a=el('a',null,'Open');a.href=p.href;a.setAttribute('aria-label','Open '+p.title+' board');h.appendChild(a)}s.appendChild(h);var bd=el('div','mc-pb');s.appendChild(bd);
 try{(P[p.id]||function(x){x.appendChild(el('p','mc-quiet','Panel not wired.'))})(bd)}catch(e){bd.appendChild(el('p','mc-quiet','Panel failed to render.'));setTimeout(function(){throw e})}
 G.appendChild(s);map[p.id]={el:s,def:p}});
/* Morning Report ticker only — NO header Needs Machan band (freewrite) */
(function(){var bn=$('mc-band');if(bn){bn.hidden=true;bn.setAttribute('aria-hidden','true');bn.innerHTML=''}
 var tk=$('mc-tick'),rr=tk&&tk.querySelector('.mc-tick-r'),mr=$('mc-mr');if(!tk||!rr||!mr)return;
 D.morning.forEach(function(m){rr.appendChild(el('span',null,m.t))});
 var ol=el('ol');D.morning.forEach(function(m){var li=el('li',m.tone==='warn'?'warn':null);li.appendChild(el('b',null,m.t));li.appendChild(el('small',null,m.s));ol.appendChild(li)});mr.appendChild(ol);
 tk.addEventListener('click',function(){mr.hidden=!mr.hidden;tk.setAttribute('aria-expanded',String(!mr.hidden));tk.querySelector('em').textContent=mr.hidden?'More \u25BE':'Less \u25B4'});
 var red=D.lights.filter(function(x){return x.c==='red'});var al=$('mc-alert');if(red.length){al.hidden=false;al.textContent='Red alert: '+red.map(function(x){return x.name+' \u2013 '+x.why}).join(' \u00b7 ');
  var played=false;function chime(){if(played)return;played=true;try{var C=new (window.AudioContext||window.webkitAudioContext)(),o=C.createOscillator(),g=C.createGain();o.type='sine';o.frequency.value=880;g.gain.setValueAtTime(0.0001,C.currentTime);g.gain.exponentialRampToValueAtTime(0.06,C.currentTime+0.02);g.gain.exponentialRampToValueAtTime(0.0001,C.currentTime+1.2);o.connect(g);g.connect(C.destination);o.start();o.stop(C.currentTime+1.3)}catch(_){}}
  document.addEventListener('pointerdown',chime,{once:true});document.addEventListener('keydown',chime,{once:true})}})();
/* ---------- layout: fixed 6-panel MacBook-fit (3+3 on 6 rows) ---------- */
try{localStorage.removeItem(LS)}catch(_){}
var mq=matchMedia('(min-width:1100px)');
function apply(){Object.keys(map).forEach(function(id){var s=map[id].el,d=map[id].def;if(!mq.matches){s.style.gridArea='';return}s.style.gridArea=d.r+' / '+d.c+' / span '+d.h+' / span '+d.w})}
function sizeRows(){var hd=G.getBoundingClientRect().top+window.scrollY,ft=36;if(!mq.matches){G.style.removeProperty('--rowh');return}
 var avail=Math.max(360,window.innerHeight-hd-ft-(ROWS-1)*8);var rh=Math.floor(avail/ROWS);
 /* Always fit MacBook / desktop viewport — never force oversized fixed rows */
 G.style.setProperty('--rowh',Math.max(88,Math.min(rh,160))+'px')}
function onmq(){document.body.classList.remove('mc-drag');apply();sizeRows()}
mq.addEventListener?mq.addEventListener('change',onmq):mq.addListener(onmq);window.addEventListener('resize',sizeRows);onmq();
var a=$('mc-asof');if(a)a.textContent=D.asof_line;
window.__mc={layoutKey:LS,fixed:true,tag:'uk11h'};
})();

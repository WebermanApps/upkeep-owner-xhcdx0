/* uk11f UpKeep Command Center: mission grid of movable, resizable panels (layout saved in localStorage on this device),
   needs band, Morning Report ticker, status wall, locked Ping Log, every-item gear table (sortable). UpKeep Develop, Oct 20 2026.
   Reads only the inline #mc-data block (TEST snapshot). Nothing here writes anywhere except localStorage (layout) . */
(function(){'use strict';
var D;try{D=JSON.parse(document.getElementById('mc-data').textContent)}catch(_){return}
var LS='ukcc-layout-uk11f',COLS=12,ROWS=8,RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(i){return document.getElementById(i)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function chip(t,c){return el('span','chip '+(c||'mute'),t)}
function toast(m){var t=el('div','mc-toast',m);t.setAttribute('role','status');document.body.appendChild(t);setTimeout(function(){t.remove()},3200)}
function stub(l){var b=el('button','mc-b stub',l);b.type='button';b.addEventListener('click',function(){toast('Not connected yet. Nothing was sent or changed (TEST).')});return b}
function rows(list,lim){var u=el('ul','mc-rows');(list||[]).slice(0,lim||99).forEach(function(x){var li=el('li'),s=el('span');s.appendChild(el('b',null,x.t));if(x.s)s.appendChild(el('small',null,x.s));li.appendChild(s);if(x.r)li.appendChild(el('em',null,x.r));if(x.chip)li.appendChild(chip(x.chip[0],x.chip[1]));u.appendChild(li)});return u}
function fold(h,n,sum,body){var d=el('details','mc-fold'),s=el('summary');s.append(el('b',null,h+(n!=null?' ('+n+')':'')),el('span',null,sum||''));d.appendChild(s);var b=el('div');d.appendChild(b);if(body)body(b);return d}
function ro(stats){var g=el('div','mc-ro');stats.forEach(function(s){var c=el('div');c.append(el('b','num',s[1]),el('span',null,s[0]));if(s[2])c.appendChild(el('small',null,s[2]));g.appendChild(c)});return g}
function sortable(t,cols,data,rowFn,init){var st={k:init||null,d:1},tb=el('tbody'),th=el('thead'),tr=el('tr');
 cols.forEach(function(c){var x=el('th');var b=el('button',null,c[0]);b.type='button';x.appendChild(b);x.setAttribute('aria-sort','none');b.addEventListener('click',function(){if(st.k===c[1])st.d=-st.d;else{st.k=c[1];st.d=1}draw()});x._k=c[1];tr.appendChild(x)});th.appendChild(tr);t.append(th,tb);
 function draw(){[].forEach.call(tr.children,function(x){x.setAttribute('aria-sort',x._k===st.k?(st.d>0?'ascending':'descending'):'none')});var L=data.slice();if(st.k)L.sort(function(a,b){var p=a[st.k],q=b[st.k];var r=(typeof p==='number'&&typeof q==='number')?p-q:String(p).localeCompare(String(q),undefined,{numeric:true});return r*st.d});while(tb.firstChild)tb.firstChild.remove();L.forEach(function(x){tb.appendChild(rowFn(x))})}
 draw();return t}
function td(r,v,c){var x=el('td',c||null);if(v instanceof Node)x.appendChild(v);else x.textContent=v==null?'\u2013':v;r.appendChild(x);return x}
var P={};
/* ---------- panels ---------- */
P.status=function(b){var w=el('div','mc-wall');var all=true;D.lights.forEach(function(x){if(x.c!=='green')all=false;var r=el('div','r '+(x.c==='green'?'':x.c));r.append(el('i'),el('span',null,x.name),el('small',null,x.why));w.appendChild(r)});b.appendChild(w);
 var hh=el('div','mc-quiet');b.appendChild(el('p','mc-quiet','Agent health: '+D.health.map(function(h){return h.name+' '+h.state}).join(' \u00b7 ')));
 if(all){var hp=el('div','mc-happy');hp.innerHTML=D.machan_svg;hp.appendChild(el('span',null,'All clear. Machan is happy.'));b.appendChild(hp)}
 else b.appendChild(el('p','mc-quiet','Green = all clear \u00b7 amber = waiting on Machan or a flag \u00b7 red = live alert (slow pulse, soft chime).'))};
P.pipeline=function(b){var p=D.pipeline;b.appendChild(ro([['Active',String(p.active),p.trend],['Members',String(p.members),'TEST']]));
 var mx=p.members;p.stages.forEach(function(s){var r=el('div','mc-bar');r.style.setProperty('--c',s[2]);var i=el('i'),u=el('u');u.style.width=(s[1]/mx*100)+'%';i.appendChild(u);r.append(el('span',null,s[0]),i,el('em',null,String(s[1])));b.appendChild(r)});
 b.appendChild(el('p','mc-quiet','Plans: '+Object.keys(p.plans).map(function(k){return k+' '+p.plans[k]}).join(' \u00b7 ')))};
P.techs=function(b){var V=D.visits,g=el('div','mc-tl');g.appendChild(el('span'));V.days.forEach(function(d){g.appendChild(el('span','h',d.dow[0]+d.dow[1]))});
 D.roster.forEach(function(r){var on=r.days[V.today_i]==='On';var t=el('span','t');var li=el('i',on?'on':null);li.title=on?'On today':'Off today';t.append(li,document.createTextNode('TD'+r.td));g.appendChild(t);
  V.days.forEach(function(d,i){var n=d.visits.filter(function(v){return v.td===r.td}).length,c=el('span','c'+(r.days[i]==='On'?' on':''));c.title='Tech Dash '+r.td+' \u00b7 '+d.label+': '+(r.days[i]==='On'?n+' of '+D.cap+' stops':'off');if(n){var u=el('u');u.style.width=Math.min(100,n/D.cap*100)+'%';c.appendChild(u)}g.appendChild(c)})});
 b.appendChild(g);b.appendChild(el('p','mc-quiet','Timeline bars = planned stops per tech-day (cap '+D.cap+' + 1 flex). Light = working today. Visit logs: 0 \u00b7 photos: 0.'))};
P.visits=function(b){var V=D.visits,today=V.days[V.today_i];b.appendChild(el('p','mc-quiet','Today '+today.long+': '+(today.visits.length?today.visits.length+' visits':'no visits (first day of work).')+' First visit '+V.first+'. This week '+V.week+': '+V.total+' visits.'));
 var t=el('table','mc-t'),th=el('thead'),tr=el('tr');['ID','Day','Time','Member','Area','Visit','Tech','Status'].forEach(function(c){tr.appendChild(el('th',null,c))});th.appendChild(tr);t.appendChild(th);var tb=el('tbody');t.appendChild(tb);
 V.days.forEach(function(d,i){d.visits.forEach(function(v){var r=el('tr',i===V.today_i?'is-today':null);td(r,v.id,'mono');td(r,d.dow+' '+d.label,'mono');td(r,v.t,'mono');td(r,v.name);td(r,v.area.split(' \u00b7 ')[0]);td(r,v.type);td(r,'TD'+v.td,'mono');td(r,chip(v.st,v.st==='Scheduled'?'ok':'info'));tb.appendChild(r)})});b.appendChild(t)};
P.opendates=function(b){var V=D.visits,g=el('div','mc-od');g.appendChild(el('span'));V.days.forEach(function(d){g.appendChild(el('span',null,d.dow.slice(0,2)+' '+d.label.split(' ')[1]))});var tot=0;
 D.roster.forEach(function(r){g.appendChild(el('span','l','TD'+r.td));V.days.forEach(function(d,i){var n=d.visits.filter(function(v){return v.td===r.td}).length;if(r.days[i]!=='On'){g.appendChild(el('b',null,'\u2013'));return}var o=D.cap-n;tot+=o;var x=el('b',o===D.cap?'o':(o>0?'f':''),String(o));x.title=o+' of '+D.cap+' planned stops open';g.appendChild(x)})});
 b.appendChild(g);b.appendChild(el('p','mc-quiet',tot+' open planned stops this week on working tech-days (+1 flex each). Off days show \u2013.'))};
P.inflight=function(b){var L=D.pings.filter(function(p){return p.state!=='Done'});if(!L.length){b.appendChild(el('p','mc-ok','Nothing in flight.'));return}
 b.appendChild(rows(L.map(function(p){return {t:p.summary,s:p.id+' \u00b7 '+p.team+(p.waiting?' \u00b7 waiting on '+p.waiting:''),chip:[p.state,p.state==='Open'?'s-open':'s-prog']}})))};
P.pinglog=function(b){var lk=el('p','mc-lock');lk.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>';lk.appendChild(document.createTextNode('Locked log: read-only here; agents add pings. IDs UK-YYYYMMDD-NN. '));lk.appendChild(el('span','test','TEST'));b.appendChild(lk);
 var cur='All',tabs=el('div','mc-ttabs'),box=el('div');['All'].concat(D.teams.map(function(t){return t.name})).forEach(function(n){var x=el('button',null,n);x.type='button';x.setAttribute('aria-pressed',String(n===cur));x.addEventListener('click',function(){cur=n;[].forEach.call(tabs.children,function(y){y.setAttribute('aria-pressed',String(y===x))});draw()});tabs.appendChild(x)});b.append(tabs,box);
 function draw(){while(box.firstChild)box.firstChild.remove();var L=D.pings.filter(function(p){return cur==='All'||p.team===cur});var cn={Open:0,'In progress':0,Done:0};L.forEach(function(p){cn[p.state]++});
  box.appendChild(el('p','mc-quiet',L.length+' pings \u00b7 '+cn.Open+' open \u00b7 '+cn['In progress']+' in progress \u00b7 '+cn.Done+' done'));
  var t=el('table','mc-t'),th=el('thead'),tr=el('tr');['ID','Received','Type','Summary','Source','Owner','Due','Status'].forEach(function(c){tr.appendChild(el('th',null,c))});th.appendChild(tr);t.appendChild(th);var tb=el('tbody');t.appendChild(tb);var last='';
  L.forEach(function(p){if(p.day!==last){last=p.day;var hr=el('tr','dayh'),hc=el('td',null,p.day);hc.colSpan=8;hr.appendChild(hc);tb.appendChild(hr)}var r=el('tr');td(r,p.id,'mono');td(r,p.time+' ICT','mono');td(r,p.type);var s=td(r,p.summary);if(p.waiting)s.appendChild(el('span','w','Waiting on: '+p.waiting));td(r,p.source);td(r,p.owner);td(r,p.due||'\u2013','mono');td(r,chip(p.state,p.state==='Open'?'s-open':p.state==='Done'?'s-done':'s-prog'));tb.appendChild(r)});
  if(!L.length){var er=el('tr'),ec=el('td','mc-quiet','No pings from this team yet.');ec.colSpan=8;er.appendChild(ec);tb.appendChild(er)}box.appendChild(t)}draw()};
P.gear=function(b){var cur='van',tabs=el('div','mc-ttabs'),box=el('div');[['van','Van stock ('+D.gear.vans.length+')'],['bag','Tool bags ('+D.gear.bags.length+')']].forEach(function(n){var x=el('button',null,n[1]);x.type='button';x.setAttribute('aria-pressed',String(n[0]===cur));x.addEventListener('click',function(){cur=n[0];[].forEach.call(tabs.children,function(y){y.setAttribute('aria-pressed',String(y===x))});draw()});tabs.appendChild(x)});b.append(tabs,box);
 function draw(){while(box.firstChild)box.firstChild.remove();var t=el('table','mc-t');
  if(cur==='van')sortable(t,[['Item','item'],['Van','van'],['Category','cat'],['On','on'],['Par','par'],['Min','min'],['Status','st']],D.gear.vans,function(x){var r=el('tr',x.st==='Below min'?'is-low':null);td(r,x.item);td(r,'Van '+x.van,'mono');td(r,x.cat);td(r,String(x.on),'num');td(r,String(x.par),'num');td(r,String(x.min),'num');td(r,chip(x.st,x.st==='Below min'?'warn':'ok'));return r},'st');
  else sortable(t,[['Item','item'],['Tech','td'],['Category','cat'],['Qty','qty'],['Condition','cond'],['Checked','checked']],D.gear.bags,function(x){var r=el('tr');td(r,x.item);td(r,'TD'+x.td,'mono');td(r,x.cat);td(r,x.qty,'mono');td(r,chip(x.cond,x.cond==='Good'?'ok':'warn'));td(r,x.checked,'mono');return r});
  box.appendChild(t);box.appendChild(el('p','mc-quiet','Click a column to sort. TEST sample pars.'))}draw()};
P.telemetry=function(b){var T=D.telemetry;b.appendChild(ro(T.stats));var sp=el('div','mc-spark'),mx=Math.max.apply(null,T.days.map(function(d){return d[1]}).concat([1]));T.days.forEach(function(d){var i=el('i');i.style.height=(d[1]/mx*100)+'%';i.title=d[0]+': '+d[1]+' pings';sp.appendChild(i)});b.appendChild(sp);b.appendChild(el('p','mc-quiet',T.note))};
function team(t){return function(b){b.appendChild(ro(t.stats));
 var nd=el('div','mc-need');nd.id='need-'+t.id;var h=el('h3',null,'Needs Machan');nd.appendChild(h);
 if(t.needs.length){var u=el('ul');t.needs.forEach(function(x){var li=el('li'),s=el('span');s.appendChild(el('b',null,x.t));if(x.s)s.appendChild(el('small',null,x.s));li.appendChild(s);(x.acts||[]).forEach(function(a){li.appendChild(stub(a))});u.appendChild(li)});nd.appendChild(u)}
 else{nd.className='mc-need is-clear';nd.style.borderColor='rgba(38,194,129,.3)';nd.style.background='rgba(38,194,129,.06)';h.style.color='var(--grn)';h.textContent='Nothing needs Machan'}b.appendChild(nd);
 b.appendChild(el('p','mc-quiet',t.main.h+' \u00b7 '+t.main.sum));b.appendChild(rows(t.main.rows,4));
 t.folds.forEach(function(f){b.appendChild(fold(f.h,f.n,f.sum,function(x){if(f.rows)x.appendChild(rows(f.rows));if(f.bars)f.bars.forEach(function(br){var r=el('div','mc-bar'),i=el('i'),u=el('u');u.style.width=(br.v/br.max*100)+'%';i.appendChild(u);r.append(el('span',null,br.t),i,el('em',null,br.r));x.appendChild(r)});if(f.note)x.appendChild(el('p','mc-quiet',f.note))}))})}}
/* ---------- build ---------- */
var DEF=D.layout,G=$('mc-grid');var map={};D.teams.forEach(function(t){P['team-'+t.id]=team(t)});
DEF.forEach(function(p){var s=el('section','mc-p p-'+p.id+(p.team?' is-acc t-'+p.team:''));s.id='p-'+p.id;s.setAttribute('aria-labelledby','ph-'+p.id);var h=el('div','mc-ph'),h2=el('h2',null,p.title);h2.id='ph-'+p.id;h.appendChild(h2);if(p.badge)h.appendChild(el('span','test',p.badge));h.appendChild(el('span','sp'));if(p.href){var a=el('a',null,'Open board \u2192');a.href=p.href;h.appendChild(a)}s.appendChild(h);var bd=el('div','mc-pb');s.appendChild(bd);
 try{P[p.id](bd)}catch(e){bd.appendChild(el('p','mc-quiet','Panel failed to render.'));setTimeout(function(){throw e})}
 ['br','bl'].forEach(function(k){var z=el('span','mc-rz '+k);z.setAttribute('aria-hidden','true');z._k=k;s.appendChild(z)});G.appendChild(s);map[p.id]={el:s,def:p}});
/* band + ticker + morning report */
(function(){var bn=$('mc-band'),n=0;D.teams.forEach(function(t){n+=t.needs.length});if(!n){bn.className='mc-band is-clear';bn.appendChild(el('b',null,'Nothing needs Machan.'))}
 else{bn.appendChild(el('b',null,'Needs Machan:'));D.teams.forEach(function(t){if(!t.needs.length)return;var a=el('a',null,t.name+' '+t.needs.length);a.href='#need-'+t.id;a.addEventListener('click',function(e){e.preventDefault();var x=$('need-'+t.id);x.scrollIntoView({behavior:RM?'auto':'smooth',block:'nearest'});x.closest('.mc-pb').scrollTop=x.offsetTop-40;x.animate&&!RM&&x.animate([{boxShadow:'0 0 0 2px #ffb000'},{boxShadow:'0 0 0 0 transparent'}],{duration:1400})});bn.appendChild(a)});bn.appendChild(el('span',null,'Decisions stay in each team panel.'))}
 bn.appendChild(el('span','test','TEST'));
 var tk=$('mc-tick'),rr=tk.querySelector('.mc-tick-r'),mr=$('mc-mr');D.morning.forEach(function(m){rr.appendChild(el('span',null,m.t))});
 var ol=el('ol');D.morning.forEach(function(m){var li=el('li',m.tone==='warn'?'warn':null);li.appendChild(el('b',null,m.t));li.appendChild(el('small',null,m.s));ol.appendChild(li)});mr.appendChild(ol);
 tk.addEventListener('click',function(){mr.hidden=!mr.hidden;tk.setAttribute('aria-expanded',String(!mr.hidden));tk.querySelector('em').textContent=mr.hidden?'More \u25BE':'Less \u25B4'});
 var red=D.lights.filter(function(x){return x.c==='red'});var al=$('mc-alert');if(red.length){al.hidden=false;al.textContent='Red alert: '+red.map(function(x){return x.name+' \u2013 '+x.why}).join(' \u00b7 ');
  var played=false;function chime(){if(played)return;played=true;try{var C=new (window.AudioContext||window.webkitAudioContext)(),o=C.createOscillator(),g=C.createGain();o.type='sine';o.frequency.value=880;g.gain.setValueAtTime(0.0001,C.currentTime);g.gain.exponentialRampToValueAtTime(0.06,C.currentTime+0.02);g.gain.exponentialRampToValueAtTime(0.0001,C.currentTime+1.2);o.connect(g);g.connect(C.destination);o.start();o.stop(C.currentTime+1.3)}catch(_){}}
  document.addEventListener('pointerdown',chime,{once:true});document.addEventListener('keydown',chime,{once:true})}})();
/* ---------- layout: drag and resize like a desktop (>=1100px), saved per device ---------- */
var mq=matchMedia('(min-width:1100px)');
function load(){var s=null;try{s=JSON.parse(localStorage.getItem(LS)||'null')}catch(_){}return s&&s.v===1?s.p:{}}
var L=load();function cur(id){var d=map[id].def,o=L[id]||{};return {c:o.c||d.c,r:o.r||d.r,w:o.w||d.w,h:o.h||d.h}}
function clamp(g){g.w=Math.max(2,Math.min(COLS,g.w));g.h=Math.max(1,Math.min(ROWS+4,g.h));g.c=Math.max(1,Math.min(COLS-g.w+1,g.c));g.r=Math.max(1,g.r);return g}
function apply(){Object.keys(map).forEach(function(id){var s=map[id].el;if(!mq.matches){s.style.gridArea='';return}var g=cur(id);s.style.gridArea=g.r+' / '+g.c+' / span '+g.h+' / span '+g.w})}
function save(){try{localStorage.setItem(LS,JSON.stringify({v:1,p:L}))}catch(_){}}
function sizeRows(){var hd=G.getBoundingClientRect().top+window.scrollY,ft=48;if(!mq.matches){G.style.removeProperty('--rowh');return}var avail=window.innerHeight-hd-ft-(ROWS-1)*10;var rh=Math.floor(avail/ROWS);
 if(window.innerWidth>=1800&&window.innerHeight>=900&&rh>=118)G.style.setProperty('--rowh',rh+'px');else G.style.setProperty('--rowh','172px')}
function metrics(){var r=G.getBoundingClientRect(),cs=getComputedStyle(G),gap=parseFloat(cs.columnGap)||10,rh=parseFloat(cs.gridAutoRows)||172;return {r:r,cw:(r.width-gap*(COLS-1))/COLS+gap,rh:rh+gap}}
var drag=null;
G.addEventListener('pointerdown',function(e){if(!mq.matches||e.button!==0)return;var s=e.target.closest('.mc-p');if(!s)return;var rz=e.target.closest('.mc-rz'),hd=e.target.closest('.mc-ph');if(!rz&&(!hd||e.target.closest('a,button')))return;
 var id=s.id.slice(2),m=metrics();drag={id:id,s:s,rz:rz&&rz._k,x:e.clientX,y:e.clientY,g0:cur(id),m:m};s.classList.add('is-moving');s.setPointerCapture&&s.setPointerCapture(e.pointerId);e.preventDefault()});
G.addEventListener('pointermove',function(e){if(!drag)return;var dx=Math.round((e.clientX-drag.x)/drag.m.cw),dy=Math.round((e.clientY-drag.y)/drag.m.rh),g=Object.assign({},drag.g0);
 if(!drag.rz){g.c+=dx;g.r+=dy}else if(drag.rz==='br'){g.w+=dx;g.h+=dy}else{g.c+=dx;g.w-=dx;g.h+=dy;if(g.w<2){g.c-=2-g.w;g.w=2}}
 g=clamp(g);L[drag.id]=g;drag.s.style.gridArea=g.r+' / '+g.c+' / span '+g.h+' / span '+g.w});
function end(){if(!drag)return;drag.s.classList.remove('is-moving');save();drag=null}
G.addEventListener('pointerup',end);G.addEventListener('pointercancel',end);
var rs=$('mc-reset');if(rs)rs.addEventListener('click',function(){L={};try{localStorage.removeItem(LS)}catch(_){}apply();toast('Layout reset to default.')});
function onmq(){document.body.classList.toggle('mc-drag',mq.matches);apply();sizeRows()}
mq.addEventListener?mq.addEventListener('change',onmq):mq.addListener(onmq);window.addEventListener('resize',sizeRows);onmq();
var a=$('mc-asof');if(a)a.textContent=D.asof_line;
window.__mc={layoutKey:LS,get:function(id){return cur(id)}};
})();

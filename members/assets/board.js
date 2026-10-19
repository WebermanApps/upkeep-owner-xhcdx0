/* UpKeep boards renderer v2 (Ethan CC + Members, Technicians, Tools & Equipment, Scheduling). Branding (Swatch), Oct 19 2026.
   Data: ONLY the inline <script type="application/json" id="board-data"> block (inside the page lock). No fetch, no storage, no sends.
   Safety: DOM built with createElement + textContent (no innerHTML from data); links/images must be relative or https://webermanapps.github.io/. */
(function(){
'use strict';
var NS='http://www.w3.org/2000/svg';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=String(txt);return e}
function safeUrl(u){u=String(u||'').trim();if(!u)return null;if(/^https:\/\/webermanapps\.github\.io\//.test(u))return u;
 if(/^[a-z][a-z0-9+.-]*:/i.test(u)||u.indexOf('//')===0||u.indexOf('\\')>=0)return null;return u}
var IC={inbox:'M4 13l2.5-7h11L20 13v6H4zM4 13h5l1 2h4l1-2h5',userplus:'M9 11a4 4 0 100-8 4 4 0 000 8zM2 21c0-4 3-7 7-7s7 3 7 7M19 8v6M16 11h6',
 userminus:'M9 11a4 4 0 100-8 4 4 0 000 8zM2 21c0-4 3-7 7-7s7 3 7 7M16 11h6',calendar:'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5',
 clipboard:'M8 4h8v3H8zM6 5H5v16h14V5h-1M8 12h8M8 16h5',folder:'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z',
 check:'M4 12l5 5L20 6',chat:'M4 5h16v11H9l-5 4z',wrench:'M14.5 4.5a4.5 4.5 0 00-5.6 5.6L3.5 15.5a2 2 0 002.8 2.8l5.4-5.4a4.5 4.5 0 005.6-5.6l-2.6 2.6-2.4-.4-.4-2.4z',
 ho:'M4 12h12M12 6l6 6-6 6',arr:'M2 8h11M9 4l4 4-4 4'};
function svg(k,vb,w){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox',vb||'0 0 24 24');s.setAttribute('aria-hidden','true');if(w){s.setAttribute('width',w);s.setAttribute('height',w)}
 var p=document.createElementNS(NS,'path');p.setAttribute('d',IC[k]||IC.folder);s.appendChild(p);return s}
function arrow(){var s=svg('arr','0 0 16 16',16);s.setAttribute('fill','none');s.setAttribute('stroke','currentColor');s.setAttribute('stroke-width','1.8');s.setAttribute('stroke-linecap','square');return s}
var TONES={ok:1,info:1,warn:1,gold:1,mute:1,soon:1,paused:1};
var LEGACY={active:'ok',new:'info',paused:'paused',hired:'ok',soon:'soon',progress:'info',waiting:'gold',plain:'mute'};
function chip(tone,label){tone=LEGACY[tone]||tone;return el('span','uk-chip t-'+(TONES[tone]?tone:'mute'),label||'')}
function chipOf(c){return c?chip(c[1],c[0]):null}
var ACC={terra:'#C1502E',lagoon:'#05668D',jungle:'#0B6E4F'};
function empty(e){var d=el('div','uk-empty');d.appendChild(svg((e&&e.icon)||'folder'));var t=el('div');t.appendChild(el('b',null,(e&&e.title)||'Nothing here yet'));if(e&&e.text)t.appendChild(el('span',null,e.text));d.appendChild(t);return d}
function clear(n){while(n.firstChild)n.removeChild(n.firstChild);return n}
function $(id){return document.getElementById(id)}
var TAG=false;function tt(){return el('span','uk-tt','Temp Data')}
function tempChip(l){return el('span','uk-temp'+(l&&l.tone?' l-'+l.tone:''),(l&&l.text)||'Temp Data')}

/* rows: {title, sub, note, right, chip:[label,tone]} */
function row(x){var li=el('li'),t=el('span','uk-li-t');t.appendChild(el('b',null,x.title));if(x.sub)t.appendChild(el('span','uk-li-s',x.sub));if(x.note)t.appendChild(el('span','uk-li-n',x.note));li.appendChild(t);
 var r=el('span','uk-li-r');if(x.chip)r.appendChild(chipOf(x.chip));if(x.right)r.appendChild(el('span','uk-li-d',x.right));if(TAG)r.appendChild(tt());if(r.childNodes.length)li.appendChild(r);return li}
function rows(items,limit){var w=document.createDocumentFragment(),ul=el('ul','uk-list'),n=limit&&items.length>limit+1?limit:items.length;
 items.slice(0,n).forEach(function(x){ul.appendChild(row(x))});w.appendChild(ul);
 if(n<items.length){var d=el('details','uk-more'),s=el('summary',null,'Show all ('+items.length+')');d.appendChild(s);var u2=el('ul','uk-list');items.slice(n).forEach(function(x){u2.appendChild(row(x))});d.appendChild(u2);
  d.addEventListener('toggle',function(){s.textContent=d.open?'Show fewer':'Show all ('+items.length+')'});w.appendChild(d)}return w}
/* cards: {title, meta, chip, stats:[[k,v]], list_title, list:[rows], groups:[{name,items:[str]}], bar:{pct,label}} */
function card(c){var a=el('article','uk-tc');var h=el('div','uk-tc-h');h.appendChild(el('h3',null,c.title));var hr=el('span','uk-li-r');if(c.chip)hr.appendChild(chipOf(c.chip));if(TAG)hr.appendChild(tt());h.appendChild(hr);a.appendChild(h);
 if(c.meta)a.appendChild(el('p','uk-tc-m',c.meta));
 if(c.bar){var b=el('div','uk-bar'),i=el('i');i.style.width=Math.max(0,Math.min(100,c.bar.pct))+'%';if(c.bar.pct>90)b.className='uk-bar hi';b.appendChild(i);a.appendChild(b);if(c.bar.label)a.appendChild(el('p','uk-bar-l',c.bar.label))}
 if(c.stats&&c.stats.length){var dl=el('dl','uk-stats');c.stats.forEach(function(s){var d=el('div');d.append(el('dt',null,s[0]),el('dd',null,s[1]));dl.appendChild(d)});a.appendChild(dl)}
 if(c.list&&c.list.length){if(c.list_title)a.appendChild(el('p','uk-tc-lt',c.list_title));var ol=el('ol','uk-stops');c.list.forEach(function(x){var li=el('li');li.appendChild(el('span','uk-st-t',x.time||''));var t=el('span','uk-li-t');t.appendChild(el('b',null,x.title));if(x.sub)t.appendChild(el('span','uk-li-s',x.sub));li.appendChild(t);ol.appendChild(li)});a.appendChild(ol)}
 else if(c.list_empty)a.appendChild(el('p','uk-tc-lt',c.list_empty));
 (c.groups||[]).forEach(function(g){var d=el('details','uk-grp'),s=el('summary');s.append(el('span',null,g.name),el('span','uk-grp-n',String(g.items.length)));d.appendChild(s);var ul=el('ul');g.items.forEach(function(x){ul.appendChild(el('li',null,x))});d.appendChild(ul);a.appendChild(d)});
 return a}
function cards(list){var w=el('div','uk-cardrow');list.forEach(function(c){w.appendChild(card(c))});return w}
/* week: days [{key,dow,label,visits:[{time,title,sub,chip}]}] */
function week(sec){var box=el('div','uk-wk'),strip=el('div','uk-week'),pane=el('div','uk-wk-pane'),days=sec.days||[],today=new Date(),tk=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
 function show(i){[].forEach.call(strip.children,function(b,j){b.setAttribute('aria-pressed',String(j===i))});clear(pane);var d=days[i];
  pane.appendChild(el('p','uk-wk-h',d.long+' \u00b7 '+(d.visits.length?d.visits.length+' visit'+(d.visits.length===1?'':'s'):'No visits')));
  if(!d.visits.length){pane.appendChild(empty({icon:'calendar',title:'No visits this day',text:sec.day_empty||''}));return}
  var groups={};d.visits.forEach(function(v){(groups[v.group]=groups[v.group]||[]).push(v)});
  Object.keys(groups).sort().forEach(function(g){pane.appendChild(el('p','uk-tc-lt',g));var ol=el('ol','uk-stops');groups[g].forEach(function(x){var li=el('li');li.appendChild(el('span','uk-st-t',x.time||''));var t=el('span','uk-li-t');t.appendChild(el('b',null,x.title));if(x.sub)t.appendChild(el('span','uk-li-s',x.sub));li.appendChild(t);if(x.chip)li.appendChild(chipOf(x.chip));ol.appendChild(li)});pane.appendChild(ol)})}
 var first=-1;days.forEach(function(d,i){var b=el('button','uk-day'+(d.key===tk?' is-today':''));b.type='button';b.append(el('small',null,d.key===tk?'Today':d.dow),el('b',null,d.label),el('span',null,d.visits.length?d.visits.length+' visit'+(d.visits.length===1?'':'s'):'None'));
  if(d.visits.length&&first<0)first=i;b.addEventListener('click',function(){show(i)});strip.appendChild(b)});
 var ti=days.map(function(d){return d.key}).indexOf(tk);var ph=el('div','uk-ph');ph.append(carousel(strip),pane);box.append(ph,wgrid(days,tk));if(days.length)show(ti>=0&&days[ti].visits.length?ti:(first<0?0:first));return box}
function cell(td,c){if(c==null)c='';if(typeof c!=='object'){td.textContent=String(c);return td}
 if(c.c){td.appendChild(chipOf(c.c))}if(c.t!=null){var b=el(c.m?'span':'b',c.m?'uk-cm':null,c.t);td.appendChild(b)}if(c.s)td.appendChild(el('span','uk-cs',c.s));return td}
function tableEl(cols,rws,o){o=o||{};var t=el('table','uk-table'+(o.wide?' wide':'')+(o.cls?' '+o.cls:'')),th=el('thead'),tr=el('tr');cols.forEach(function(c){tr.appendChild(el('th',null,c))});th.appendChild(tr);t.appendChild(th);var tb=el('tbody');
 if(!rws.length){var er=el('tr','uk-tr-empty'),ec=el('td','uk-td-empty',o.empty||'Nothing logged yet.');ec.colSpan=cols.length;er.appendChild(ec);tb.appendChild(er)}
 rws.forEach(function(r){var tr2=el('tr');r.forEach(function(c,i){var td=cell(el('td',(typeof c==='string'&&/^[\d.]+( min)?$/.test(c)&&i)?'num':null),c);td.setAttribute('data-l',cols[i]);tr2.appendChild(td)});tb.appendChild(tr2)});t.appendChild(tb);
 var w=el('div','uk-tscroll'+(rws.length>12?' is-long':''));w.appendChild(t);return w}
function wgrid(days,tk){var w=el('div','uk-lt'),lg=el('p','uk-wk-lg');[1,2,3].forEach(function(n){lg.appendChild(el('span','td'+n,'Tech Dash '+n))});w.appendChild(lg);var g=el('div','uk-wkgrid');w.appendChild(g);days.forEach(function(d){var c=el('div','uk-wc'+(d.key===tk?' is-today':'')+(d.visits.length?'':' is-empty'));
 var h=el('div','uk-wc-h');h.append(el('small',null,d.key===tk?'Today \u00b7 '+d.dow:d.dow),el('b',null,d.label),el('span',null,d.visits.length?d.visits.length+' visit'+(d.visits.length===1?'':'s'):'No visits'));c.appendChild(h);
 var ul=el('ul'),LIM=6,more=null;d.visits.forEach(function(v,vi){var li=el('li','td'+((v.g&&v.g.td)||0));var gg=v.g||{};li.title=(gg.name||v.title)+' \u00b7 '+(gg.area||'')+' \u00b7 '+(gg.type||'')+' \u00b7 Tech Dash '+(gg.td||'');
  var top=el('span','uk-wv-t');top.append(el('b',null,v.time||''),el('i',null,'TD'+(gg.td||'')));li.append(top,el('span','uk-wv-n',gg.name||v.title),el('span','uk-wv-s',(gg.area?gg.area+' \u00b7 ':'')+(gg.type||'')+(gg.min?' \u00b7 '+gg.min+'m':'')));
  if(vi<LIM)ul.appendChild(li);else{if(!more){more=el('details','uk-wc-more');more.appendChild(el('summary',null,'+'+(d.visits.length-LIM)+' more'));more.appendChild(el('ul'))}more.lastChild.appendChild(li)}});
 c.appendChild(ul);if(more)c.appendChild(more);g.appendChild(c)});return w}
function section(sec){var it=sec.items||[],count=sec.count!=null?sec.count:(sec.type==='table'?(sec.rows||[]).length:it.length);
 var s=el(sec.fold?'details':'section','uk-sec'+(sec.fold?' uk-fold':''));s.id='sec-'+(sec.id||'x');s.setAttribute('aria-label',sec.title);
 var lab=sec.label?tempChip(sec.label):(sec.temp?tempChip():null),body=s;
 if(sec.fold){if(count<=6)s.open=true;var sm=el('summary','uk-fold-sum'),tw=el('span','uk-fold-tw');tw.appendChild(el('h2','uk-h2',sec.title+' ('+count+')'));if(lab)tw.appendChild(lab);sm.appendChild(tw);
  if(sec.fold_sum)sm.appendChild(el('span','uk-fold-s',sec.fold_sum));sm.appendChild(el('span','uk-fold-chev'));s.appendChild(sm);body=el('div','uk-fold-b');s.appendChild(body)}
 else{var h=el('div','uk-sh');h.appendChild(el('h2','uk-h2',sec.title));if(lab)h.appendChild(lab);s.appendChild(h)}
 if(sec.sub)body.appendChild(el('p','uk-sub',sec.sub));
 if(sec.type==='week')body.appendChild(week(sec));
 else if(sec.type==='cards'){var cr=cards(sec.cards||[]);body.appendChild(carousel(cr))}
 else if(sec.type==='table'){if(sec.intro)sec.intro.forEach(function(x){body.appendChild(el('p','uk-intro',x))});body.appendChild(tableEl(sec.cols,sec.rows,{wide:sec.cols.length>5,empty:sec.empty_row}))}
 else if(it.length){if(sec.tcols&&it[0].cells){var ph=el('div','uk-ph');ph.appendChild(rows(it,sec.limit));var lt=el('div','uk-lt');lt.appendChild(tableEl(sec.tcols,it.map(function(x){return x.cells}),{cls:'compact'}));body.append(ph,lt)}else body.appendChild(rows(it,sec.limit))}
 if((sec.type==='list'||!sec.type)&&!it.length||sec.empty_always)body.appendChild(empty(sec.empty));
 if(sec.note)body.appendChild(el('p','uk-note',sec.note));return s}
/* carousel: wraps a horizontal scroller; arrows + dots show only while items overflow (phone swipe, laptop click) */
function carousel(sc){var w=el('div','uk-car'),nav=el('div','uk-car-nav'),pv=el('button','uk-car-b'),nx=el('button','uk-car-b'),dots=el('div','uk-car-dots');
 pv.type=nx.type='button';pv.setAttribute('aria-label','Previous');nx.setAttribute('aria-label','Next');pv.textContent='\u2039';nx.textContent='\u203a';
 nav.append(pv,dots,nx);w.append(sc,nav);
 function step(){var c=sc.children[0];return c?c.getBoundingClientRect().width+parseFloat(getComputedStyle(sc).columnGap||getComputedStyle(sc).gap||0):sc.clientWidth}
 function pages(){var st=step()||1;return Math.max(1,Math.round((sc.scrollWidth-sc.clientWidth)/st)+1)}
 function upd(){var over=sc.scrollWidth>sc.clientWidth+4;w.classList.toggle('is-over',over);if(!over)return;var n=pages(),k=Math.round(sc.scrollLeft/(step()||1));
  if(dots.children.length!==n){clear(dots);for(var i=0;i<n;i++){(function(i){var d=el('button','uk-car-d');d.type='button';d.setAttribute('aria-label','Go to '+(i+1));d.addEventListener('click',function(){sc.scrollTo({left:i*step(),behavior:'smooth'})});dots.appendChild(d)})(i)}}
  [].forEach.call(dots.children,function(d,j){d.classList.toggle('on',j===Math.min(k,n-1))});pv.disabled=sc.scrollLeft<=2;nx.disabled=sc.scrollLeft>=sc.scrollWidth-sc.clientWidth-2}
 pv.addEventListener('click',function(){sc.scrollBy({left:-step(),behavior:'smooth'})});nx.addEventListener('click',function(){sc.scrollBy({left:step(),behavior:'smooth'})});
 sc.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});addEventListener('resize',upd);setTimeout(upd,0);setTimeout(upd,400);return w}
function sections(d){var ss=$('uk-sections');if(!ss)return;clear(ss);var cols=null;(d.sections||[]).forEach(function(sec){var node=section(sec);
  if(sec.half){if(!cols){cols=el('div','uk-grid2');ss.appendChild(cols)}cols.appendChild(node);if(cols.children.length===2)cols=null}else{cols=null;ss.appendChild(node)}})}

/* ---------- Ethan CC ---------- */
function tile(a){
 var href=safeUrl(a.href),t=el(href?'a':'div','uk-tile'+(a.status==='paused'?' is-paused':''));if(href)t.href=href;
 if(a.accent&&ACC[a.accent])t.style.setProperty('--uk-acc',ACC[a.accent]);
 var top=el('div','uk-tile-top'),ic=el('span','uk-tile-ic'),src=safeUrl(a.icon);
 if(src){var im=el('img');im.src=src;im.alt='';im.width=34;im.height=34;ic.appendChild(im)}
 top.append(ic,el('span','uk-tile-nm',a.name),chip(a.status,a.status_label));
 t.append(top,el('p','uk-tile-role',a.role||''));
 if(a.stat){var st=el('p','uk-tile-stat');st.appendChild(el('span',null,a.stat));st.appendChild(el('span','uk-tt','Temp Data'));t.appendChild(st)}
 var go=el('span','uk-tile-go');go.appendChild(el('span',null,a.cta||(href?'Open Dashboard':'Board coming soon')));if(href)go.appendChild(arrow());t.appendChild(go);
 t.setAttribute('aria-label',a.name+', '+(a.status_label||'')+(href?', open dashboard':''));
 return t}
function renderEthan(d){
 var h=$('uk-hero');if(h&&d.hero){clear(h);var src=safeUrl(d.hero.img);if(src){var im=el('img');im.src=src;im.alt='';im.width=48;im.height=48;h.appendChild(im)}
  var tx=el('div','uk-hero-t');tx.append(el('span','uk-hero-n',d.hero.name),el('span','uk-hero-s',d.hero.line||''));h.appendChild(tx)}
 var ag=d.agents||[],g=$('uk-tiles');
 var n=ag.length,np=ag.filter(function(a){return a.status==='paused'}).length,nl=ag.filter(function(a){return safeUrl(a.href)&&a.status!=='paused'}).length;
 var s=$('uk-agents-sub');if(s)s.textContent=n+' Agent'+(n===1?'':'s')+' \u00b7 '+nl+' Dashboard'+(nl===1?'':'s')+' Ready'+(np?' \u00b7 '+np+' Paused':'');
 if(g){clear(g);ag.forEach(function(a){var li=el('li');li.appendChild(tile(a));g.appendChild(li)});
  if(d.more_slot&&d.more_slot.show!==false){if(false){}var li=el('li'),m=el('div','uk-tile is-more'),top=el('div','uk-tile-top'),ic=el('span','uk-tile-ic'),im=el('img');
   im.src='assets/icons/more.svg';im.alt='';im.width=34;im.height=34;ic.appendChild(im);top.append(ic,el('span','uk-tile-nm',d.more_slot.title||'More agents coming'));
   m.append(top,el('p','uk-tile-role',d.more_slot.text||''));li.appendChild(m);g.appendChild(li)}}
 if(g&&!g.parentNode.classList.contains('uk-car')){var gp=g.parentNode,gn=g.nextSibling;gp.insertBefore(carousel(g),gn)}
 var p=$('uk-projects');if(p){clear(p);var pr=d.projects||[];$('uk-proj-n').textContent='('+pr.length+')';
  if(!pr.length)p.appendChild(empty({icon:'folder',title:'No ongoing projects',text:''}));
  else{var cs=el('div','uk-cards');pr.forEach(function(x){var c=el('article','uk-card'),hd=el('div','uk-card-h');hd.append(el('h3',null,x.title),chip(x.status,x.status_label));c.appendChild(hd);
   if(x.owner)c.appendChild(el('span','uk-meta','Owner: '+x.owner));if(x.note)c.appendChild(el('p',null,x.note));
   if(x.handoff!==false&&d.handoff!==false){var b=el('button','uk-ho op-btn op-btn--ho');b.type='button';b.setAttribute('data-project',x.id||'');b.appendChild(svg('ho'));b.appendChild(el('span',null,'Hand off project'));
    var msg=el('p','uk-ho-msg');msg.setAttribute('aria-live','polite');
    b.addEventListener('click',function(){var P=window.ProjectsSection;if(P&&P.openHandoff){P.openHandoff({id:x.id,title:x.title,agent:x.owner_agent||'ethan'},b)}else{msg.textContent='Hand off turns on when this board is published.'}});
    c.append(b,msg)}
   cs.appendChild(c)});p.appendChild(cs)}}
 var tk=$('uk-tasks');if(tk){clear(tk);var ts=d.tasks||[];$('uk-task-n').textContent='('+ts.length+')';
  if(!ts.length)tk.appendChild(empty({icon:'check',title:'No open tasks',text:'Nothing waiting right now.'}));
  else{var ul=el('ul','uk-list');ts.forEach(function(x){var li=row(x);li.insertBefore(el('span','uk-check'),li.firstChild);ul.appendChild(li)});tk.appendChild(ul)}}
}
function renderSub(d){
 var c=$('uk-chief');if(c&&d.chief){clear(c);var src=safeUrl(d.chief.img);if(src){var im=el('img');im.src=src;im.alt='';c.appendChild(im)}var t=el('div');t.append(el('b',null,d.chief.name),el('span',null,d.chief.line||''));c.appendChild(t)}
 var st=$('uk-strip'),dots=$('uk-dots');if(st){clear(st);if(dots)dots.hidden=true;var sl=d.strip||[];st.style.setProperty('--uk-n',String(Math.max(1,sl.length)));
  sl.forEach(function(x){var e=el('div','uk-cell');e.append(el('span','uk-lbl',x.label),el('span','uk-v',x.value),el('span','uk-n',x.note||''));st.appendChild(e)});
  if(!st.parentNode.classList.contains('uk-car')){var ph=st.parentNode,nx=st.nextSibling,cw=carousel(st);ph.insertBefore(cw,nx)}}
 sections(d)}
function renderCommon(d){
 var b=$('uk-banner');if(b){clear(b);if(d.banner){b.hidden=false;b.appendChild(el('span','uk-temp','Temp Data'));b.appendChild(el('span',null,d.banner))}else b.hidden=true}
 var r=d.routines||[],h=$('uk-rt-h'),cnt=$('uk-rt-c'),list=$('uk-rt-list');
 if(h)h.textContent='Routines ('+r.length+')';if(cnt)cnt.textContent=r.filter(function(x){return x.status==='on'}).length+' active';
 if(list){clear(list);if(!r.length)list.appendChild(el('p','uk-empty-line','No routines yet.'));
  r.forEach(function(x){var rw=el('div','uk-rt-row');rw.append(el('b',null,x.short||x.name),el('span',null,(x.short_time||x.schedule_plain||'')+(x.status==='paused'?' \u00b7 Paused':'')));list.appendChild(rw)})}
 var a=$('uk-asof');if(a&&d.updated_label)a.textContent='Built '+d.updated_label;
}
/* ---- Document Center (uk6). Renders the INLINE docs list from #board-data (encrypted with the page by the page lock).
   No fetch and no crypto here: links and thumbnails use Security's documented markup only (a[data-enc-file], a[data-enc-download],
   img[data-enc-img]); Security's enc_file_viewer.js, once inlined in the locked page, opens and decrypts them. Same look and
   classes as the kit Document Center (projects.css op-fold / op-card). Paths must be files/<12 a-z0-9>.enc, else the item is skipped. */
var DOC_MAX=6,ENCP=/^files\/[a-z0-9]{12}\.enc$/,DKIND={pdf:'PDF',ppt:'PPT',doc:'DOC',xls:'XLS',img:'IMG',other:'FILE'},DBADGE={PDF:'pdf',PPT:'ppt',DOC:'doc',XLS:'xls',IMG:'img',FILE:'other',DECK:'ppt',MD:'doc',HTML:'doc'};
var DI={open:['M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5'],dl:['M12 4v11M7 10l5 5 5-5M5 20h14'],
 doc:['M7 3h7l5 5v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z','M14 3v5h5M9 13h6M9 17h6'],chev:['M6 9l6 6 6-6'],prev:['M15 6l-6 6 6 6'],next:['M9 6l6 6-6 6']};
function dsvg(k){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');DI[k].forEach(function(x){var q=document.createElementNS(NS,'path');q.setAttribute('d',x);s.appendChild(q)});return s}
function encRef(r){return r&&typeof r.path==='string'&&ENCP.test(r.path)?r.path:null}
function dbadge(p){var t=String(p.type||'').toUpperCase();return Object.prototype.hasOwnProperty.call(DBADGE,t)?t:DKIND[dkind(p)]}
function dkind(p){var u=String(p.type||'').toUpperCase();if(Object.prototype.hasOwnProperty.call(DBADGE,u))return DBADGE[u];var t=String(p.type||'').toLowerCase();if(/^pdf$/.test(t))return 'pdf';if(/^(pptx?|odp|key)$/.test(t))return 'ppt';if(/^(docx?|odt|rtf)$/.test(t))return 'doc';if(/^(xlsx?|ods)$/.test(t))return 'xls';return 'other'}
function ddate(p){var s=String(p.date||'');var d=new Date(/^\d{4}-\d{2}-\d{2}$/.test(s)?s+'T12:00:00':(s||p.updated||''));if(isNaN(d))return '';
 var o={month:'short',day:'numeric'};if(d.getFullYear()!==new Date().getFullYear())o.year='numeric';return (s?'':'Updated ')+d.toLocaleDateString('en-US',o)}
function dact(p,kind){var ref=kind==='open'?(encRef(p.preview)||encRef(p.file)):encRef(p.file),lab=kind==='open'?'Open':'Download';
 var a=el('a','op-btn'+(kind==='open'?' op-btn--open':''));a.href='#';a.setAttribute('role','button');a.setAttribute('aria-label',lab+' '+p.title);
 a.append(dsvg(kind==='open'?'open':'dl'),el('span',null,lab));if(ref)a.setAttribute('data-enc-file',ref);if(kind!=='open')a.setAttribute('data-enc-download','');return a}
function dcard(p,i){var c=el('article','op-card op-k-'+dkind(p));c.setAttribute('aria-label',p.title);c.setAttribute('role','listitem');
 var th=el('div','op-thumb'),img=el('img'),ph=el('div','op-ph',dbadge(p));img.alt='';img.decoding='async';th.append(img,ph,el('span','op-type',dbadge(p)));c.appendChild(th);
 var tp=encRef(p.thumb);if(tp){img.addEventListener('load',function(){img.classList.add('on')});img.setAttribute('data-enc-img',tp)}else ph.classList.add('done');
 var bd=el('div','op-body');bd.appendChild(el('h3','op-t',p.title));if(typeof p.label==='string'&&p.label){var lc=el('p','uk-doc-lbl');lc.appendChild(chip('warn',p.label.slice(0,40)));bd.appendChild(lc)}bd.appendChild(el('p','op-meta',ddate(p)+(p.slides?' \u00b7 '+(+p.slides)+' slides':'')));var bs=el('div','op-btns');bs.append(dact(p,'open'),dact(p,'dl'));bd.appendChild(bs);
 var mb=el('button','op-more-btn'),dt=el('div','op-details');mb.type='button';mb.append(el('span',null,'Tell me more'),dsvg('chev'));dt.id='op-d-'+i;dt.hidden=true;mb.setAttribute('aria-expanded','false');mb.setAttribute('aria-controls',dt.id);
 if(p.desc)dt.appendChild(el('p','op-desc',String(p.desc).slice(0,400)));var bits=[];if(p.pages&&!p.slides)bits.push(p.pages+(dkind(p)==='ppt'?' slides':' pages'));if(p.size)bits.push(Math.max(1,Math.round(p.size/1024))+' KB');if(p.agent)bits.push('Pinned by '+p.agent);
 if(bits.length)dt.appendChild(el('small',null,bits.join(' \u00b7 ')));if(!dt.childNodes.length)dt.appendChild(el('p',null,'No extra details yet.'));
 mb.addEventListener('click',function(){var x=mb.getAttribute('aria-expanded')!=='true';mb.setAttribute('aria-expanded',String(x));dt.hidden=!x;mb.firstChild.textContent=x?'Show less':'Tell me more'});
 bd.append(mb,dt);c.appendChild(bd);return c}
function renderDocs(d){var sec=document.querySelector('[data-uk-docs]');if(!sec)return;var dc=d.docs||{},own=String(dc.owner||'This agent');
 var list=(Array.isArray(dc.items)?dc.items:[]).filter(function(p){return p&&typeof p.title==='string'&&p.title&&!p.hidden&&encRef(p.file)}).map(function(p){p.title=p.title.slice(0,80);return p})
  .sort(function(x,y){return (Date.parse(y.updated)||0)-(Date.parse(x.updated)||0)});
 clear(sec);var fd=el('details','op-fold'),sm=el('summary','op-fold-sum'),fb=el('div','op-fold-body');fd.id='mw-docs-fold';
 sm.append(el('span','op-fold-t','Document Center'),el('span','op-fold-n','('+list.length+')'),el('span','op-chev'));fd.append(sm,fb);sec.appendChild(fd);
 var hd=el('div','op-head'),tt=el('div','op-ttl'),nav=el('div','op-nav'),pv=el('button'),nx=el('button');tt.appendChild(el('p','op-sub',own+'\u2019s working documents'));
 pv.type=nx.type='button';pv.setAttribute('aria-label','Previous documents');nx.setAttribute('aria-label','Next documents');pv.appendChild(dsvg('prev'));nx.appendChild(dsvg('next'));nav.append(pv,nx);hd.append(tt,nav);fb.appendChild(hd);
 if(!list.length){var em=el('div','op-empty op-empty--box');em.append(dsvg('doc'),el('p',null,'No documents yet. '+own+' pins PDFs, slides and docs here.'));fb.appendChild(em);nav.hidden=true;return}
 if(!(window.mwEncFile&&typeof window.mwEncFile.open==='function'))fb.appendChild(el('p','op-sub uk-docs-wait','Documents open here once Security\u2019s file viewer is added to this page.'));
 var tr=el('div','op-track');tr.setAttribute('role','list');tr.setAttribute('aria-label','Document Center');list.slice(0,DOC_MAX).forEach(function(p,i){tr.appendChild(dcard(p,i))});fb.appendChild(tr);
 function upd(){pv.disabled=tr.scrollLeft<4;nx.disabled=tr.scrollLeft+tr.clientWidth>=tr.scrollWidth-4;nav.style.visibility=tr.scrollWidth>tr.clientWidth+4?'visible':'hidden'}
 function step(k){var c=tr.querySelector('.op-card');tr.scrollBy({left:k*(c?c.getBoundingClientRect().width+12:tr.clientWidth),behavior:'smooth'})}
 pv.addEventListener('click',function(){step(-1)});nx.addEventListener('click',function(){step(1)});tr.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);fd.addEventListener('toggle',function(){if(fd.open)setTimeout(upd,0)});setTimeout(upd,50);
 if(list.length>DOC_MAX){var od=el('details','op-older'),os=el('summary'),ul=el('ul','op-list');os.append(el('span',null,'More ('+(list.length-DOC_MAX)+')'),dsvg('chev'));od.appendChild(os);
  list.slice(DOC_MAX).forEach(function(p){var li=el('li','op-k-'+dkind(p)),t=el('div','op-lt');t.append(el('b',null,p.title),el('span','op-meta',dbadge(p)+' \u00b7 '+ddate(p)));li.append(t,dact(p,'open'),dact(p,'dl'));ul.appendChild(li)});od.appendChild(ul);fb.appendChild(od)}}
function render(d){if(!d||typeof d!=='object')return;TAG=!!d.item_tag;var k=d.board&&d.board.kind;if(k==='ethan-cc')renderEthan(d);else renderSub(d);renderCommon(d);renderDocs(d)}
function share(btn,ok){var u=location.href.split('#')[0],t=document.title;
 if(navigator.share){navigator.share({title:t,url:u}).catch(function(){});return}
 try{navigator.clipboard.writeText(u).then(function(){if(ok)ok.textContent='Link copied'},function(){if(ok)ok.textContent=u})}catch(_){if(ok)ok.textContent=u}
 if(btn&&btn.classList.contains('mw-bh-share')){btn.classList.add('is-copied');setTimeout(function(){btn.classList.remove('is-copied')},1600)}
 if(ok)setTimeout(function(){ok.textContent=''},2400)}
function init(){
 [].forEach.call(document.querySelectorAll('[data-uk-share]'),function(b){b.addEventListener('click',function(){share(b,$('uk-share-ok'))})});
 var inl=$('board-data'),cur=null;try{cur=JSON.parse(inl.textContent)}catch(_){}render(cur)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

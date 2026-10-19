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
 var ti=days.map(function(d){return d.key}).indexOf(tk);box.append(strip,pane);if(days.length)show(ti>=0&&days[ti].visits.length?ti:(first<0?0:first));return box}
function table(sec){var t=el('table','uk-table'+(sec.cols.length>5?' wide':'')),th=el('thead'),tr=el('tr');sec.cols.forEach(function(c){tr.appendChild(el('th',null,c))});th.appendChild(tr);t.appendChild(th);var tb=el('tbody');
 if(!sec.rows.length){var er=el('tr','uk-tr-empty'),ec=el('td','uk-td-empty',sec.empty_row||'Nothing logged yet.');ec.colSpan=sec.cols.length;er.appendChild(ec);tb.appendChild(er)}
 sec.rows.forEach(function(r){var tr2=el('tr');r.forEach(function(c,i){var td=el('td',i?'num':null,c);td.setAttribute('data-l',sec.cols[i]);tr2.appendChild(td)});tb.appendChild(tr2)});t.appendChild(tb);return t}
function section(sec){var s=el('section','uk-sec');s.id='sec-'+(sec.id||'x');s.setAttribute('aria-label',sec.title);
 var h=el('div','uk-sh');h.appendChild(el('h2','uk-h2',sec.title));if(sec.label)h.appendChild(tempChip(sec.label));else if(sec.temp)h.appendChild(tempChip());s.appendChild(h);if(sec.sub)s.appendChild(el('p','uk-sub',sec.sub));
 var it=sec.items||[];
 if(sec.type==='week')s.appendChild(week(sec));
 else if(sec.type==='cards')s.appendChild(cards(sec.cards||[]));
 else if(sec.type==='table'){if(sec.intro)sec.intro.forEach(function(x){s.appendChild(el('p','uk-intro',x))});s.appendChild(table(sec))}
 else if(it.length)s.appendChild(rows(it,sec.limit));
 if((sec.type==='list'||!sec.type)&&!it.length||sec.empty_always)s.appendChild(empty(sec.empty));
 if(sec.note)s.appendChild(el('p','uk-note',sec.note));return s}
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
  if(d.more_slot&&d.more_slot.show!==false){var li=el('li'),m=el('div','uk-tile is-more'),top=el('div','uk-tile-top'),ic=el('span','uk-tile-ic'),im=el('img');
   im.src='assets/icons/more.svg';im.alt='';im.width=34;im.height=34;ic.appendChild(im);top.append(ic,el('span','uk-tile-nm',d.more_slot.title||'More agents coming'));
   m.append(top,el('p','uk-tile-role',d.more_slot.text||''));li.appendChild(m);g.appendChild(li)}}
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
 var st=$('uk-strip'),dots=$('uk-dots');if(st){clear(st);clear(dots);var sl=d.strip||[];st.style.setProperty('--uk-n',String(Math.max(1,sl.length)));
  sl.forEach(function(x,i){var e=el('div','uk-cell');e.append(el('span','uk-lbl',x.label),el('span','uk-v',x.value),el('span','uk-n',x.note||''));st.appendChild(e);dots.appendChild(el('i',i===0?'on':null))});
  st.onscroll=function(){var w=st.firstChild?st.firstChild.offsetWidth+10:1,k=Math.round(st.scrollLeft/w);[].forEach.call(dots.children,function(x,j){x.className=j===k?'on':''})}}
 sections(d)}
function renderCommon(d){
 var b=$('uk-banner');if(b){clear(b);if(d.banner){b.hidden=false;b.appendChild(el('span','uk-temp','Temp Data'));b.appendChild(el('span',null,d.banner))}else b.hidden=true}
 var r=d.routines||[],h=$('uk-rt-h'),cnt=$('uk-rt-c'),list=$('uk-rt-list');
 if(h)h.textContent='Routines ('+r.length+')';if(cnt)cnt.textContent=r.filter(function(x){return x.status==='on'}).length+' active';
 if(list){clear(list);if(!r.length)list.appendChild(el('p','uk-empty-line','No routines yet.'));
  r.forEach(function(x){var rw=el('div','uk-rt-row');rw.append(el('b',null,x.short||x.name),el('span',null,(x.short_time||x.schedule_plain||'')+(x.status==='paused'?' \u00b7 Paused':'')));list.appendChild(rw)})}
 var a=$('uk-asof');if(a&&d.updated_label)a.textContent='Built '+d.updated_label;
}
function render(d){if(!d||typeof d!=='object')return;TAG=!!d.item_tag;var k=d.board&&d.board.kind;if(k==='ethan-cc')renderEthan(d);else renderSub(d);renderCommon(d)}
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

/* UpKeep agent boards renderer uk9 (Members, Technicians, Tools & Equipment, Scheduling). Branding (Swatch), Oct 19 2026.
   Data: ONLY the inline <script type="application/json" id="board-data"> block (inside the page lock). No fetch, no storage, no sends.
   Safety: DOM built with createElement + textContent (never innerHTML from data); links must be relative or https://webermanapps.github.io/.
   Documents use Security's markup only (a[data-enc-file], a[data-enc-download], img[data-enc-img]); the inlined enc_file_viewer.js does the rest. */
(function(){
'use strict';
var NS='http://www.w3.org/2000/svg',D=null,NOW=new Date();
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=String(txt);return e}
function $(id){return document.getElementById(id)}
function clear(n){while(n&&n.firstChild)n.removeChild(n.firstChild);return n}
function safeUrl(u){u=String(u||'').trim();if(!u)return null;if(/^https:\/\/webermanapps\.github\.io\//.test(u))return u;if(/^[a-z][a-z0-9+.-]*:/i.test(u)||u.indexOf('//')===0||u.indexOf('\\')>=0)return null;return u}
function S(t,a,kids){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);(kids||[]).forEach(function(c){e.appendChild(c)});return e}
var P={chev:'M6 9l6 6 6-6',arr:'M9 6l6 6-6 6',open:'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5',dl:'M12 4v11M7 10l5 5 5-5M5 20h14',
 doc:'M7 3h7l5 5v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1zM14 3v5h5M9 13h6M9 17h6',warn:'M12 3l10 18H2zM12 10v5M12 18v.5',lock:'M6 11h12v10H6zM8 11V7a4 4 0 018 0v4',
 check:'M4 12l5 5L20 6',dash:'M6 12h12',plus:'M12 5v14M5 12h14',print:'M7 9V3h10v6M6 18H4v-8h16v8h-2M7 14h10v7H7z',van:'M2 7h11v9H2zM13 10h4l3 3v3h-7zM6 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z',
 bell:'M6 16V11a6 6 0 0112 0v5l2 2H4zM10 20a2 2 0 004 0',ok:'M12 3a9 9 0 100 18 9 9 0 000-18zM8 12l3 3 5-6'};
function ic(k,w){var s=S('svg',{viewBox:'0 0 24 24','aria-hidden':'true',width:w||18,height:w||18,fill:'none',stroke:'currentColor','stroke-width':'2','stroke-linecap':'square','stroke-linejoin':'miter'});s.appendChild(S('path',{d:P[k]}));return s}
var TONES={ok:1,info:1,warn:1,gold:1,mute:1,soon:1,paused:1},LEG={active:'ok',new:'info',paused:'paused',hired:'ok',soon:'soon',progress:'info',waiting:'gold',plain:'mute',decided:'ok',open:'info'};
/* status = dot and word (footer 08 Swatch call, catalog 08 B) */
function chip(tone,label){tone=LEG[tone]||tone;return el('span','uk-dw t-'+(TONES[tone]?tone:'mute'),label||'')}
function chipOf(c){return c?chip(c[1],c[0]):null}
/* labels = soft pills (footer 07 Swatch call); approval = outlined capital tag (header 18 Swatch call) */
function pill(t,tone){return el('span','uk-pill'+(tone?' p-'+tone:''),t)}
function stamp(t){return el('span','uk-stamp',t)}
function temp(l){return pill((l&&l.text)||'Temp Data',(l&&l.tone)||'temp')}
function plural(n,w,p){return n+' '+(n===1?w:(p||w+'s'))}
function on(e,ev,f){e.addEventListener(ev,f);return e}
function btn(c,txt,k){var b=el('button',c);b.type='button';if(k)b.appendChild(ic(k,16));if(txt!=null)b.appendChild(el('span',null,txt));return b}

/* fold: kit row + chevron (All Boards Rules 01 B). opts:{open,label,sum,count,plain,cls} */
function fold(title,o){o=o||{};var d=el('details','uk-fold'+(o.plain?' is-plain':'')+(o.cls?' '+o.cls:''));if(o.open)d.open=true;
 var s=el('summary','uk-fold-sum');if(o.plain)s.appendChild(ic('arr',16));var tw=el('span','uk-fold-tw');tw.appendChild(el('span','uk-fold-t',title+(o.count!=null?' ('+o.count+')':'')));
 if(o.badge!=null){tw.appendChild(el('span','uk-count',String(o.badge)))}if(o.label)tw.appendChild(o.label);s.appendChild(tw);
 s.appendChild(el('span','uk-fold-s',o.sum||''));if(!o.plain)s.appendChild(el('span','uk-chev'));d.appendChild(s);var b=el('div','uk-fold-b');d.appendChild(b);return {node:d,body:b,sum:s}}

/* ---------- illustrations (drawings, never photos of people) ---------- */
var HC=[['#E9D8C4','#C1502E'],['#D9E4E8','#05668D'],['#DDE8DF','#0B6E4F'],['#EFE3C8','#8A5A0C'],['#E6E1EA','#5B4B7A'],['#F1DDD3','#7A3B22']];
function homeSvg(v,kind,w,h){v=(+v||0)%6;var c=HC[v],s=S('svg',{viewBox:'0 0 160 100',width:w||160,height:h||100,'aria-hidden':'true',preserveAspectRatio:'xMidYMid slice'});
 s.appendChild(S('rect',{width:160,height:100,fill:'#F4EFE6'}));s.appendChild(S('rect',{y:78,width:160,height:22,fill:'#DCE3D3'}));
 if(kind==='furnace'){s.appendChild(S('rect',{x:55,y:18,width:50,height:66,fill:'#fff',stroke:'#8b8478','stroke-width':2}));s.appendChild(S('rect',{x:63,y:28,width:34,height:14,fill:c[0]}));[0,1,2,3].forEach(function(i){s.appendChild(S('line',{x1:63,y1:52+i*6,x2:97,y2:52+i*6,stroke:'#8b8478','stroke-width':2}))});return s}
 if(kind==='heater'){s.appendChild(S('rect',{x:62,y:14,width:36,height:70,rx:0,fill:'#fff',stroke:'#8b8478','stroke-width':2}));s.appendChild(S('rect',{x:62,y:14,width:36,height:10,fill:c[1]}));s.appendChild(S('circle',{cx:80,cy:62,r:5,fill:c[0],stroke:'#8b8478'}));return s}
 if(kind==='gutter'){s.appendChild(S('path',{d:'M20 50 L80 20 L140 50 Z',fill:c[1]}));s.appendChild(S('rect',{x:16,y:50,width:128,height:6,fill:'#8b8478'}));s.appendChild(S('rect',{x:136,y:56,width:6,height:24,fill:'#8b8478'}));s.appendChild(S('rect',{x:30,y:56,width:100,height:24,fill:c[0]}));return s}
 s.appendChild(S('rect',{x:38,y:42,width:84,height:38,fill:c[0]}));s.appendChild(S('path',{d:'M30 44 L80 16 L130 44 Z',fill:c[1]}));
 s.appendChild(S('rect',{x:72,y:56,width:16,height:24,fill:'#fff'}));s.appendChild(S('rect',{x:46,y:52,width:16,height:12,fill:'#fff'}));s.appendChild(S('rect',{x:98,y:52,width:16,height:12,fill:'#fff'}));
 if(v%2)s.appendChild(S('rect',{x:104,y:22,width:8,height:14,fill:'#8b8478'}));return s}
var PHK=['front','furnace','heater','gutter','front','gutter'];

/* ---------- small pieces ---------- */
function row(x){var li=el('li'),t=el('span','uk-li-t');t.appendChild(el('b',null,x.title));if(x.sub)t.appendChild(el('span','uk-li-s',x.sub));if(x.note)t.appendChild(el('span','uk-li-n',x.note));li.appendChild(t);
 var r=el('span','uk-li-r');if(x.chip)r.appendChild(chipOf(x.chip));if(x.right)r.appendChild(el('span','uk-li-d',x.right));if(r.childNodes.length)li.appendChild(r);return li}
function rows(items,limit){var w=document.createDocumentFragment(),ul=el('ul','uk-list'),n=limit&&items.length>limit+1?limit:items.length;items.slice(0,n).forEach(function(x){ul.appendChild(row(x))});w.appendChild(ul);
 if(n<items.length){var d=el('details','uk-more'),s=el('summary',null,'Show all ('+items.length+')');d.appendChild(s);var u2=el('ul','uk-list');items.slice(n).forEach(function(x){u2.appendChild(row(x))});d.appendChild(u2);on(d,'toggle',function(){s.textContent=d.open?'Show fewer':'Show all ('+items.length+')'});w.appendChild(d)}return w}
function cell(td,c){if(c==null)c='';if(typeof c!=='object'){td.textContent=String(c);return td}if(c.c)td.appendChild(chipOf(c.c));if(c.t!=null)td.appendChild(el(c.m?'span':'b',c.m?'uk-cm':null,c.t));if(c.s)td.appendChild(el('span','uk-cs',c.s));return td}
function table(cols,rws,o){o=o||{};var t=el('table','uk-table'+(o.cls?' '+o.cls:'')),th=el('thead'),tr=el('tr');cols.forEach(function(c){tr.appendChild(el('th',null,c))});th.appendChild(tr);t.appendChild(th);var tb=el('tbody');
 if(!rws.length){var er=el('tr'),ec=el('td','uk-td-empty',o.empty||'Nothing logged yet.');ec.colSpan=cols.length;er.appendChild(ec);tb.appendChild(er)}
 rws.forEach(function(r){var tr2=el('tr');r.forEach(function(c,i){var td=cell(el('td'),c);td.setAttribute('data-l',cols[i]);tr2.appendChild(td)});tb.appendChild(tr2)});t.appendChild(tb);var w=el('div','uk-tscroll');w.appendChild(t);return w}
function card(c){var a=el('article','uk-tc'),h=el('div','uk-tc-h');h.appendChild(el('h3',null,c.title));if(c.chip)h.appendChild(chipOf(c.chip));a.appendChild(h);if(c.meta)a.appendChild(el('p','uk-tc-m',c.meta));
 if(c.stats&&c.stats.length){var dl=el('dl','uk-stats');c.stats.forEach(function(s){var d=el('div');d.append(el('dt',null,s[0]),el('dd',null,s[1]));dl.appendChild(d)});a.appendChild(dl)}
 if(c.list&&c.list.length){if(c.list_title)a.appendChild(el('p','uk-tc-lt',c.list_title));var ol=el('ol','uk-stops');c.list.forEach(function(x){var li=el('li');li.appendChild(el('span','uk-st-t',x.time||''));var t=el('span','uk-li-t');t.appendChild(el('b',null,x.title));if(x.sub)t.appendChild(el('span','uk-li-s',x.sub));li.appendChild(t);ol.appendChild(li)});a.appendChild(ol)}
 else if(c.list_empty)a.appendChild(el('p','uk-tc-lt',c.list_empty));return a}
/* carousel: arrows + dots only while items overflow */
function carousel(sc,cls){var w=el('div','uk-car'+(cls?' '+cls:'')),nav=el('div','uk-car-nav'),pv=btn('uk-car-b',null),nx=btn('uk-car-b',null),dots=el('div','uk-car-dots');
 pv.setAttribute('aria-label','Previous');nx.setAttribute('aria-label','Next');pv.textContent='\u2039';nx.textContent='\u203a';nav.append(pv,dots,nx);w.append(sc,nav);
 function step(){var c=sc.children[0];return c?c.getBoundingClientRect().width+(parseFloat(getComputedStyle(sc).columnGap)||0):sc.clientWidth}
 function upd(){var over=sc.scrollWidth>sc.clientWidth+4;w.classList.toggle('is-over',over);if(!over)return;var st=step()||1,n=Math.max(1,Math.round((sc.scrollWidth-sc.clientWidth)/st)+1),k=Math.round(sc.scrollLeft/st);
  if(dots.children.length!==n){clear(dots);for(var i=0;i<n;i++){(function(i){var d=btn('uk-car-d',null);d.setAttribute('aria-label','Go to '+(i+1));on(d,'click',function(){sc.scrollTo({left:i*step(),behavior:'smooth'})});dots.appendChild(d)})(i)}}
  [].forEach.call(dots.children,function(d,j){d.classList.toggle('on',j===Math.min(k,n-1))});pv.disabled=sc.scrollLeft<=2;nx.disabled=sc.scrollLeft>=sc.scrollWidth-sc.clientWidth-2}
 on(pv,'click',function(){sc.scrollBy({left:-step(),behavior:'smooth'})});on(nx,'click',function(){sc.scrollBy({left:step(),behavior:'smooth'})});
 sc.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});addEventListener('resize',upd);setTimeout(upd,0);setTimeout(upd,400);w._upd=upd;return w}
function tabs(names,cur,cb,cls){var w=el('div','uk-tabs'+(cls?' '+cls:''));w.setAttribute('role','tablist');names.forEach(function(n){var b=btn('uk-tab',n);b.setAttribute('role','tab');b.setAttribute('aria-selected',String(n===cur));
 on(b,'click',function(){[].forEach.call(w.children,function(x){x.setAttribute('aria-selected',String(x===b))});cb(n)});w.appendChild(b)});return w}
function fmtTime(d){return d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}
function ago(d){var m=Math.round((NOW-d)/60000);if(m<0)return '';if(m<60)return m+' min ago';var h=Math.round(m/60);if(h<24)return h+' hr ago';var dd=Math.round(h/24);return dd===1?'Yesterday':dd+' days ago'}
function dayKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}

/* ---------- header ---------- */
var HZ={gas:['Gas','h-gas'],electrical:['Electrical','h-el'],co:['CO','h-co'],flooding:['Flooding','h-fl']};
function renderHeader(d){var h=d.header||{};var st=$('uk-hd-status');if(st&&h.status)st.appendChild(chipOf(h.status));var ln=$('uk-hd-line');if(ln)ln.textContent=h.line||'';
 /* Emergency Alerts: fold that opens itself when an alert is live (09 B); colour tag per hazard (10 B); green all-clear strip (11 B) */
 var A=$('uk-alerts'),al=h.alerts||{items:[]};if(A){clear(A);if(!al.items.length){var s=el('div','uk-allclear');s.setAttribute('role','status');s.append(ic('ok',20),el('b',null,'No active alerts'),el('span',null,al.checked||''));A.appendChild(s)}
  else{var f=fold('Emergency Alerts',{open:true,badge:al.items.length,cls:'uk-alert-fold',sum:'Opened itself: '+plural(al.items.length,'live alert')});A.appendChild(f.node);
   if(al.banner){var bn=el('div','uk-hz-banner'),tg=el('div','uk-hz-tags');Object.keys(HZ).forEach(function(k){var n=al.items.filter(function(x){return x.hazard===k}).length;tg.appendChild(el('span','uk-hz '+HZ[k][1]+(n?' is-live':''),HZ[k][0]+' '+n))});bn.appendChild(tg);
    al.items.forEach(function(x){var r=el('div','uk-hz-row');r.append(el('span','uk-hz '+((HZ[x.hazard]||['',''])[1]),(HZ[x.hazard]||[x.hazard])[0]));var t=el('div');t.append(el('b',null,x.title),el('span',null,[x.where,x.at].filter(Boolean).join(' \u00b7 ')));if(x.note)t.appendChild(el('small',null,x.note));r.append(t,pill(x.label||'TEST','test'));bn.appendChild(r)});
    if(al.open_items&&al.open_items.length){var ul=el('ul','uk-hz-open');ul.appendChild(el('li','uk-hz-oh','Open items ('+al.open_items.length+')'));al.open_items.forEach(function(x){ul.appendChild(el('li',null,x))});bn.appendChild(ul)}f.body.appendChild(bn)}
   if(al.checked)f.body.appendChild(el('p','uk-quiet',al.checked))}}
 /* To-Do: fold like the dashboards (12 A); Task, Asker, Label, Due (13 B); open and due summary (14 B); Scheduling: one list, oldest first */
 var T=$('uk-todo'),td=h.todo||{items:[]};if(T){clear(T);var its=(td.items||[]).slice().sort(function(a,b){return (Date.parse(a.created)||0)-(Date.parse(b.created)||0)});
  var op=its.filter(function(x){return !x.done}),due=op.filter(function(x){return x.due===dayKey(NOW)}).length,dn=its.length-op.length;
  var sum=op.length+' open'+(due?', '+due+' due today':'')+(dn?' \u00b7 '+dn+' decided':'');var f2=fold('To-Do List',{count:its.length,sum:sum,cls:'uk-todo-fold'});T.appendChild(f2.node);
  if(!its.length)f2.body.appendChild(el('p','uk-quiet','Nothing waiting on you right now.'));else{var ol=el('ol','uk-todo');its.forEach(function(x){var li=el('li',x.done?'is-done':null);li.appendChild(ic(x.done?'check':'dash',16));var t=el('div','uk-todo-t');t.appendChild(el('b',null,x.task));
   var m=el('span','uk-todo-m');m.appendChild(el('span',null,'Asked by '+x.asker));if(x.label)m.appendChild(pill(x.label[0],x.label[1]==='ok'?'decided':x.label[1]==='warn'?'warn':x.label[1]==='info'?'open':'test'));m.appendChild(el('span',null,x.due?(x.due===dayKey(NOW)?'Due today':'Due '+x.due):'No due date'));t.appendChild(m);if(x.where)t.appendChild(el('small',null,x.where));li.appendChild(t);ol.appendChild(li)});f2.body.appendChild(ol);if(td.note)f2.body.appendChild(el('p','uk-quiet',td.note))}}
 renderDocs(d)}

/* ---------- Documents Center: dropdown list (15 A), plain list (16 neither), title and chip only (17 B), preview pane (19 B), one quiet line (20 A) ---------- */
var ENCP=/^files\/[a-z0-9]{12}\.enc$/,DB={PDF:1,PPT:1,DOC:1,XLS:1,IMG:1,FILE:1,DECK:1,MD:1,HTML:1};
function encRef(r){return r&&typeof r.path==='string'&&ENCP.test(r.path)?r.path:null}
function dact(p,kind){var ref=kind==='open'?(encRef(p.preview)||encRef(p.file)):encRef(p.file),lab=kind==='open'?'Open':'Download';var a=el('a','uk-btn'+(kind==='open'?' is-pri':''));a.href='#';a.setAttribute('role','button');a.setAttribute('aria-label',lab+' '+p.title);
 a.append(ic(kind==='open'?'open':'dl',16),el('span',null,lab));if(ref)a.setAttribute('data-enc-file',ref);if(kind!=='open')a.setAttribute('data-enc-download','');return a}
function ddate(p){var s=String(p.date||'');var d=new Date(/^\d{4}-\d{2}-\d{2}$/.test(s)?s+'T12:00:00':(p.updated||''));return isNaN(d)?'':d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}
function renderDocs(d){var sec=document.querySelector('[data-uk-docs]');if(!sec)return;var dc=d.docs||{},own=String(dc.owner||'This agent');
 var list=(Array.isArray(dc.items)?dc.items:[]).filter(function(p){return p&&typeof p.title==='string'&&p.title&&!p.hidden&&encRef(p.file)}).sort(function(x,y){return (Date.parse(y.updated)||0)-(Date.parse(x.updated)||0)});
 clear(sec);var f=fold('Documents Center',{count:list.length,sum:list.length?own+'\u2019s working documents':''});f.node.id='mw-docs-fold';sec.appendChild(f.node);
 if(!list.length){f.body.appendChild(el('p','uk-quiet','No documents pinned yet.'));return}
 if(!(window.mwEncFile&&typeof window.mwEncFile.open==='function'))f.body.appendChild(el('p','uk-quiet uk-docs-wait','Documents open here once Security\u2019s file viewer is added to this page.'));
 var wrap=el('div','uk-docs-split'),ul=el('ul','uk-doclist'),pane=el('div','uk-docpane');ul.setAttribute('aria-label','Documents');wrap.append(ul,pane);f.body.appendChild(wrap);var panes=[];
 list.forEach(function(p,i){var t=String(p.type||'').toUpperCase(),li=el('li','uk-docrow');li.tabIndex=0;li.setAttribute('aria-label',p.title);var left=el('span','uk-doc-ic');left.appendChild(ic('doc',20));left.appendChild(el('small',null,DB[t]?t:'FILE'));
  var tt=el('span','uk-doc-t');tt.appendChild(el('b',null,p.title.slice(0,80)));if(typeof p.label==='string'&&p.label)tt.appendChild(stamp(p.label.slice(0,40)));li.append(left,tt,dact(p,'open'));ul.appendChild(li);
  var pv=el('div','uk-docpv');pv.hidden=i!==0;var th=el('div','uk-docthumb'),img=el('img');img.alt='';img.decoding='async';th.appendChild(img);th.appendChild(el('span','uk-docph',DB[t]?t:'FILE'));var tp=encRef(p.thumb);if(tp){on(img,'load',function(){img.classList.add('on')});img.setAttribute('data-enc-img',tp)}
  pv.append(th,el('h3',null,p.title.slice(0,80)));if(p.label)pv.appendChild(stamp(String(p.label).slice(0,40)));pv.appendChild(el('p','uk-quiet',[ddate(p),p.slides?p.slides+' slides':(p.pages?p.pages+' pages':''),p.agent?'Pinned by '+p.agent:''].filter(Boolean).join(' \u00b7 ')));
  if(p.desc)pv.appendChild(el('p','uk-docdesc',String(p.desc).slice(0,400)));var bs=el('div','uk-btns');bs.append(dact(p,'open'),dact(p,'dl'));pv.appendChild(bs);pane.appendChild(pv);panes.push(pv);
  function sel(){[].forEach.call(ul.children,function(x){x.classList.toggle('is-sel',x===li)});panes.forEach(function(x){x.hidden=x!==pv})}
  on(li,'click',function(e){if(e.target.closest('[data-enc-file]'))return;sel()});on(li,'keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();sel()}});if(i===0)li.classList.add('is-sel')})}

/* ---------- middle ---------- */
function renderMid(d){var b=$('uk-banner');if(b&&d.banner){b.hidden=false;b.append(pill('Temp Data','temp'),el('span',null,d.banner))}
 var st=$('uk-strip');if(st){(d.strip||[]).forEach(function(x){var e=el('div','uk-cell');e.append(el('span','uk-lbl',x.label),el('span','uk-v',x.value),el('span','uk-n',x.note||''));st.appendChild(e)});st.style.setProperty('--uk-n',String(Math.max(1,(d.strip||[]).length)))}
 var ss=$('uk-sections');(d.sections||[]).forEach(function(s){var n=section(s,d);if(n)ss.appendChild(n)});var a=$('uk-asof');if(a)a.textContent='Built '+(d.updated_label||'')}
var LOWER={reschedules:1,routes:1,weather:1,firstq:1,capacity:1,parts:1,zonemap:1,trend:1,duesoon:1,daysoff:1};
function section(s,d){var lab=s.label?temp(s.label):(s.temp?temp():null);if(s.optional)lab=(function(){var w=el('span','uk-lbls');if(lab)w.appendChild(lab);w.appendChild(pill('Optional','opt'));return w})();
 if(s.type==='needs'){var w=el('section','uk-sec uk-needs');var h=el('div','uk-sh');h.append(el('h2','uk-h2',s.title),lab);w.appendChild(h);var ul=el('ul','uk-needs-l');s.lines.forEach(function(x){var li=el('li','n-'+x[0]);li.appendChild(el('i'));li.appendChild(el('span',null,x[1]));ul.appendChild(li)});w.appendChild(ul);return w}
 var plain=d.board.kind==='scheduling'&&LOWER[s.id];var cnt=s.type==='table'?(s.rows||[]).length:(s.items?s.items.length:null);
 var f=fold(s.title,{open:!!s.open,label:lab,sum:s.fold_sum||'',count:(s.items||s.type==='table')?cnt:null,plain:plain});f.node.id='sec-'+s.id;var B=f.body;if(s.sub)B.appendChild(el('p','uk-sub',s.sub));
 var R=RENDER[s.type];if(R)R(s,B,d,f);else if(s.type==='cards'){B.appendChild(carousel((function(){var r=el('div','uk-cardrow');(s.cards||[]).forEach(function(c){r.appendChild(card(c))});return r})()))}
 else if(s.type==='table')B.appendChild(table(s.cols,s.rows,{empty:s.empty_row}));
 else if(s.items&&s.items.length){if(s.tcols&&s.items[0].cells){var ph=el('div','uk-ph');ph.appendChild(rows(s.items,s.limit));var lt=el('div','uk-lt');lt.appendChild(table(s.tcols,s.items.map(function(x){return x.cells}),{cls:'compact'}));B.append(ph,lt)}else B.appendChild(rows(s.items,s.limit))}
 else if(s.items)B.appendChild(el('p','uk-quiet','Nothing here yet.'));if(s.note)B.appendChild(el('p','uk-note',s.note));return f.node}
var RENDER={};

/* ---------- Members: catalog ---------- */
function planBadge(m){var b=el('span','uk-plan t'+m.tier);b.appendChild(el('span',null,m.plan));var k=el('i','uk-tier');for(var i=1;i<=3;i++)k.appendChild(el('b',i<=m.tier?'on':null));b.appendChild(k);b.setAttribute('aria-label',m.plan+' plan, tier '+m.tier+' of 3');return b}
var MST={Active:'ok',Paused:'paused','Cancel Pending':'gold',Cancelled:'warn'};
RENDER.catalog=function(s,B,d){var M=(d.members||[]).slice(),st={q:'',plan:'All',sort:'plan',sel:null};
 var bar=el('div','uk-cat-bar'),q=el('input','uk-search');q.type='search';q.placeholder='Search by name or area';q.setAttribute('aria-label','Search members by name or area');
 var chips=el('div','uk-chips');['All','Essentials','Plus','Complete'].forEach(function(p){var c=btn('uk-fchip',p);c.setAttribute('aria-pressed',String(p==='All'));on(c,'click',function(){st.plan=p;[].forEach.call(chips.children,function(x){x.setAttribute('aria-pressed',String(x===c))});draw()});chips.appendChild(c)});
 var so=el('select','uk-select');so.setAttribute('aria-label','Order');[['plan','Grouped by plan'],['az','A to Z'],['next','Next visit']].forEach(function(o){var op=el('option',null,o[1]);op.value=o[0];so.appendChild(op)});on(so,'change',function(){st.sort=so.value;draw()});
 var cnt=el('span','uk-quiet uk-cat-n');bar.append(q,chips,so,cnt);B.appendChild(bar);
 var jump=el('nav','uk-jump');jump.setAttribute('aria-label','Jump to letter');B.appendChild(jump);
 var split=el('div','uk-split'),left=el('div','uk-cat-list'),det=el('div','uk-detail');det.id='uk-member';split.append(left,det);B.appendChild(split);
 var tw=el('div','uk-cat-scroll'),tb=el('table','uk-table uk-cat');var th=el('thead'),tr=el('tr');['Member','Plan','Status','Area','Next visit',''].forEach(function(c,i){var x=el('th',i>2?'c'+i:null,c);if(i===5)x.setAttribute('aria-label','Open items');tr.appendChild(x)});th.appendChild(tr);tb.appendChild(th);var body=el('tbody');tb.appendChild(body);tw.appendChild(tb);left.appendChild(tw);
 on(q,'input',function(){st.q=q.value.trim().toLowerCase();draw()});
 function vis(){return M.filter(function(m){return (st.plan==='All'||m.plan===st.plan)&&(!st.q||(m.name+' '+m.area).toLowerCase().indexOf(st.q)>=0)})}
 function draw(){var L=vis(),az=function(a,b){return a.name.localeCompare(b.name)};clear(body);cnt.textContent='Showing '+L.length+' of '+M.length;
  var groups=st.sort==='plan'?['Complete','Plus','Essentials'].map(function(p){return [p,L.filter(function(m){return m.plan===p}).sort(az)]}):[[null,L.slice().sort(st.sort==='az'?az:function(a,b){return (a.next_iso||'9').localeCompare(b.next_iso||'9')||az(a,b)})]];
  groups.forEach(function(g){if(!g[1].length)return;if(g[0]){var gr=el('tr','uk-grp-h'),gc=el('td',null,g[0].toUpperCase()+' \u00b7 '+g[1].length);gc.colSpan=6;gr.appendChild(gc);body.appendChild(gr)}
   g[1].forEach(function(m){var r=el('tr','uk-mrow');r.tabIndex=0;r.setAttribute('data-id',m.id);r.setAttribute('data-l0',m.name.charAt(0).toUpperCase());if(st.sel===m.id)r.classList.add('is-sel');r.setAttribute('aria-selected',String(st.sel===m.id));
    var n=el('td','uk-mname');var th2=el('span','uk-mthumb');if(m.home.photo)th2.appendChild(homeSvg(m.home.v,'front',36,26));else th2.classList.add('none');n.append(th2,el('b',null,m.name));
    var p=el('td');p.appendChild(planBadge(m));var stt=el('td');stt.appendChild(chip(MST[m.status]||'mute',m.status));var ar=el('td','c3',m.area),nx=el('td','c4',m.next||'Not booked'),fl=el('td','c5');if(m.open.length)fl.appendChild(el('span','uk-oflag',m.open.length+' open'));
    r.append(n,p,stt,ar,nx,fl);on(r,'click',function(){pick(m,true)});on(r,'keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(m,true)}});body.appendChild(r)})});
  if(!L.length){var er=el('tr'),ec=el('td','uk-td-empty','No members match.');ec.colSpan=6;er.appendChild(ec);body.appendChild(er)}
  clear(jump);var have={};L.forEach(function(m){have[m.name.charAt(0).toUpperCase()]=1});'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function(c){var b=btn('uk-jl',c);if(!have[c])b.disabled=true;on(b,'click',function(){var r=body.querySelector('tr[data-l0="'+c+'"]');if(!r)return;[].forEach.call(jump.children,function(x){x.classList.toggle('on',x===b)});tw.scrollTo({top:r.offsetTop-(tb.tHead?tb.tHead.offsetHeight:0)-4,behavior:'smooth'})});jump.appendChild(b)});
  if(!st.sel&&L.length)pick(L[0].status==='Active'&&L[0].open.length?L[0]:(L.filter(function(m){return m.open.length&&m.home.photo&&m.visits.length})[0]||L[0]),false)}
 function pick(m,user){st.sel=m.id;[].forEach.call(body.querySelectorAll('tr.uk-mrow'),function(r){var x=r.getAttribute('data-id')===m.id;r.classList.toggle('is-sel',x);r.setAttribute('aria-selected',String(x))});detail(m);if(user&&innerWidth<900)det.scrollIntoView({behavior:'smooth',block:'start'})}
 function detail(m){clear(det);var ban=el('div','uk-dban');if(m.home.photo){ban.appendChild(homeSvg(m.home.v,'front',480,150));ban.appendChild(el('span','uk-dban-l','Drawing · TEST'))}else{ban.classList.add('none');ban.appendChild(el('span',null,'No home photo on file'))}det.appendChild(ban);
  var hd=el('div','uk-dhd');hd.appendChild(el('h3',null,m.name));var meta=el('div','uk-dmeta');meta.append(planBadge(m),chip(MST[m.status]||'mute',m.status),pill('TEST','test'));hd.appendChild(meta);hd.appendChild(el('p','uk-quiet',m.area+(m.td?' \u00b7 Tech Dash '+m.td:'')+(m.beta?' \u00b7 Beta member':'')));det.appendChild(hd);
  var qa=el('div','uk-qa');['Call','Text','Email','Client page'].forEach(function(t){var b=btn('uk-btn',t);b.disabled=true;b.title='Turns on when real member records are connected. Contact details stay off this board.';qa.appendChild(b)});det.appendChild(qa);
  var oi=el('details','uk-oi'),os=el('summary');os.append(ic('arr',14),el('span',null,'Open items'),el('span','uk-cbadge',String(m.open.length)));oi.appendChild(os);var ol=el('ul','uk-dots-l');if(!m.open.length)ol.appendChild(el('li',null,'No open items.'));m.open.forEach(function(x){ol.appendChild(el('li',null,x))});oi.appendChild(ol);det.appendChild(oi);
  if(m.missing.length){var mi=el('div','uk-miss'),ab=btn('uk-add','Add','plus'),msg=el('span','uk-quiet');on(ab,'click',function(){msg.textContent='Read-only board: add it in the member record.'});mi.append(ab,el('span',null,plural(m.missing.length,'detail')+' missing. Ask at the next visit.'),msg);var ml=el('ul','uk-dots-l is-miss');m.missing.forEach(function(x){ml.appendChild(el('li',null,x))});det.append(mi,ml)}
  var pane=el('div','uk-tabpane'),T={Home:function(){var g=el('div','uk-ntiles');[['Built',String(m.home.built)],['Sq Ft',m.home.sqft.toLocaleString('en-US')],['Systems',String(m.home.systems)]].forEach(function(x){var c=el('div');c.append(el('b',null,x[1]),el('span',null,x[0]));g.appendChild(c)});pane.appendChild(g);
    if(m.home.photo){var r=el('div','uk-phrow');['front','furnace','heater','gutter'].forEach(function(k){var f=el('figure');f.appendChild(homeSvg(m.home.v,k,200,125));f.appendChild(el('figcaption',null,{front:'Front',furnace:'Furnace',heater:'Water heater',gutter:'Gutters'}[k]));r.appendChild(f)});pane.appendChild(carousel(r,'uk-phcar'));pane.appendChild(el('p','uk-quiet','Drawings stand in for home photos (TEST).'))}else pane.appendChild(el('p','uk-quiet','No home photos on file yet.'))},
   Contact:function(){var b=el('div','uk-pref');b.append(el('span','uk-lbl','Preferred contact'),el('b',null,m.pref.how+' \u00b7 '+m.pref.when));pane.appendChild(b);pane.appendChild(el('p','uk-quiet','Phone numbers, emails and street addresses are kept off this board.'))},
   Membership:function(){var dl=el('dl','uk-kv');[['Plan',m.plan],['Billing',m.billing+' \u00b7 '+m.billing_status],['Start',m.start||'Not set'],['Renew',m.renew||'Not set'],['Add-ons',m.addons.length?m.addons.join(', '):'None'],['Tech',m.td?'Tech Dash '+m.td:'Not set']].forEach(function(x){var r=el('div');r.append(el('dt',null,x[0]),el('dd',null,x[1]));dl.appendChild(r)});pane.appendChild(dl)},
   Visits:function(){var ul=el('ul','uk-list');if(m.next)ul.appendChild(row({title:m.next,sub:m.next_type+' \u00b7 booked',chip:['Next','info']}));m.visits.forEach(function(v){ul.appendChild(row({title:v.d,sub:v.v+(v.td?' \u00b7 Tech Dash '+v.td:''),note:v.n,chip:['Done','ok']}))});if(!ul.children.length)ul.appendChild(el('li','uk-quiet','No visits yet.'));pane.appendChild(ul)},
   Notes:function(){var ul=el('ul','uk-notes');if(!m.notes.length)ul.appendChild(el('li','uk-quiet','No notes yet.'));m.notes.forEach(function(n){var li=el('li');li.append(el('span',null,n.t),el('small',null,n.d+' \u00b7 '+n.by));ul.appendChild(li)});pane.appendChild(ul)}};
  det.appendChild(tabs(Object.keys(T),'Home',function(n){clear(pane);T[n]()},'is-under'));det.appendChild(pane);T.Home();
  var pr=btn('uk-btn uk-print-b','Print member sheet','print');on(pr,'click',function(){printSheet(m)});det.appendChild(pr)}
 draw()};
function printSheet(m){var p=$('uk-print');if(!p){p=el('div');p.id='uk-print';document.body.appendChild(p)}clear(p);var band=el('div','uk-pband');band.append(el('b',null,'Smart Upkeep'),el('span',null,m.name),planBadge(m));p.appendChild(band);
 p.appendChild(el('p',null,'TEST member sheet \u00b7 '+m.area+(m.td?' \u00b7 Tech Dash '+m.td:'')+' \u00b7 printed '+NOW.toLocaleDateString('en-US')));
 [['Home',['Built '+m.home.built,m.home.sqft.toLocaleString('en-US')+' sq ft',m.home.systems+' systems']],['Open items',m.open.length?m.open:['None']],['Missing info',m.missing.length?m.missing:['None']]].forEach(function(x){var b=el('div','uk-pbox');b.appendChild(el('h4',null,x[0]));x[1].forEach(function(t){b.appendChild(el('p',null,t))});p.appendChild(b)});
 var w=el('div','uk-pbox');w.appendChild(el('h4',null,'Tech notes'));for(var i=0;i<6;i++)w.appendChild(el('div','uk-pline'));p.appendChild(w);window.print()}

/* ---------- Technicians ---------- */
var VK={seasonal:['Seasonal visit','k-se'],tune:['Monthly check-in','k-tu'],welcome:['Welcome walk','k-we'],repair:['Repair','k-re']};
function vlegend(){var p=el('p','uk-legend');Object.keys(VK).forEach(function(k){p.appendChild(el('span',VK[k][1],VK[k][0]))});return p}
function tlegend(){var p=el('p','uk-legend');[1,2,3].forEach(function(n){p.appendChild(el('span','td'+n,'Tech Dash '+n))});return p}
var VIEW={v:'Week',day:null,subs:[]};
function onView(f){VIEW.subs.push(f)}
function todayIdx(days){var k=dayKey(NOW),i=days.map(function(x){return x.key}).indexOf(k);return i<0?0:i}
function vchip(v,cls){var c=el('div','uk-vc '+(cls||''));c.title=v.name+' \u00b7 '+v.area+' \u00b7 '+v.type+' \u00b7 '+v.min+' min \u00b7 Tech Dash '+v.td;c.append(el('b',null,v.t.replace(/ (AM|PM)$/,function(m){return m.toLowerCase().trim()==='am'?'a':'p'})),el('span',null,v.name),el('small',null,v.area));return c}
function monthGrid(month,dotf){var g=el('div','uk-month');['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(function(x){g.appendChild(el('span','uk-mh',x))});for(var i=0;i<month[0].w;i++)g.appendChild(el('span','uk-md is-pad'));
 month.forEach(function(x){var c=el('div','uk-md'+(x.d===NOW.getDate()&&NOW.getMonth()===9?' is-today':''));c.appendChild(el('b',null,String(x.d)));var dots=el('span','uk-mdots');x.v.forEach(function(v){dots.appendChild(el('i',dotf(v)))});c.appendChild(dots);c.title=plural(x.v.length,'visit');g.appendChild(c)});return g}
RENDER.tcal=function(s,B,d,f){var days=d.week,box=el('div');B.append(box);var total=days.reduce(function(a,x){return a+x.visits.length},0);f.sum.querySelector('.uk-fold-s').textContent=total+' visits this week \u00b7 3 techs';
 function draw(){clear(box);var v=VIEW.v;
  if(v==='Week'){box.appendChild(vlegend());var sc=el('div','uk-xscroll'),g=el('div','uk-lanes');g.style.setProperty('--n',days.length);g.appendChild(el('span','uk-lh'));days.forEach(function(x){var h=el('span','uk-lh'+(x.key===dayKey(NOW)?' is-today':''));h.append(el('b',null,x.dow),el('small',null,x.label));g.appendChild(h)});
   [1,2,3].forEach(function(n){g.appendChild(el('span','uk-lane-n td'+n,'Tech Dash '+n));days.forEach(function(x){var c=el('div','uk-lc');x.visits.filter(function(v){return v.td===n}).forEach(function(v){c.appendChild(vchip(v,VK[v.k][1]))});if(!c.children.length)c.appendChild(el('span','uk-off','Off'));g.appendChild(c)})});sc.appendChild(g);box.appendChild(sc)}
  else if(v==='Day'){var di=VIEW.day==null?todayIdx(days):VIEW.day,x=days[di];box.appendChild(daypick(days,di,function(i){VIEW.day=i;draw()}));box.appendChild(vlegend());var cols=el('div','uk-daycols');[1,2,3].forEach(function(n){var c=el('div','uk-dcol');c.appendChild(el('h3','td'+n,'Tech Dash '+n));var vs=x.visits.filter(function(v){return v.td===n});vs.forEach(function(v){c.appendChild(vchip(v,VK[v.k][1]))});if(!vs.length)c.appendChild(el('p','uk-quiet','Off or no stops.'));cols.appendChild(c)});box.appendChild(cols)}
  else{box.appendChild(tlegend());box.appendChild(monthGrid(d.month,function(v){return 'td'+v[0]}));box.appendChild(el('p','uk-quiet','October 2026. Temp Data: the month repeats this week\u2019s sample pattern; one dot per visit in the tech\u2019s colour.'))}}
 onView(draw);draw()};
function daypick(days,cur,cb){var w=el('div','uk-daypick');days.forEach(function(x,i){var b=btn('uk-dp',null);b.append(el('small',null,x.key===dayKey(NOW)?'Today':x.dow),el('b',null,x.label));b.setAttribute('aria-pressed',String(i===cur));on(b,'click',function(){cb(i)});w.appendChild(b)});return w}
RENDER.roster=function(s,B,d,f){var box=el('div');B.appendChild(box);var days=d.week;f.sum.querySelector('.uk-fold-s').textContent=d.roster.map(function(r){return 'TD'+r.td+' '+r.days.filter(function(x){return x==='On'}).length+' days'}).join(' \u00b7 ');
 function draw(){clear(box);var v=VIEW.v,cols,rws;
  if(v==='Month'){cols=['Tech','Oct 5','Oct 12','Oct 19','Oct 26'];rws=d.roster.map(function(r){var n=r.days.filter(function(x){return x==='On'}).length;return [{t:'Tech Dash '+r.td}].concat([n,n,n,n].map(function(k){return k+' of 7 on'}))});box.appendChild(table(cols,rws,{cls:'uk-roster'}));box.appendChild(el('p','uk-quiet','Month view repeats this week\u2019s sample pattern (Temp Data).'));return}
  var idx=v==='Day'?[VIEW.day==null?todayIdx(days):VIEW.day]:days.map(function(_,i){return i});cols=['Tech'].concat(idx.map(function(i){return days[i].dow+' '+days[i].label}));
  rws=d.roster.map(function(r){return [{t:'Tech Dash '+r.td}].concat(idx.map(function(i){return {c:[r.days[i],r.days[i]==='On'?'ok':'mute']}}))});box.appendChild(table(cols,rws,{cls:'uk-roster'}))}
 onView(draw);draw()};
RENDER.photos=function(s,B,d){var L=d.visitlog||[],w=el('div','uk-pgrid-w'),g=el('div','uk-pgrid'),pn=el('div','uk-pnote');w.append(g,pn);B.appendChild(w);
 function show(x,b){[].forEach.call(g.children,function(c){c.setAttribute('aria-pressed',String(c===b))});clear(pn);pn.append(el('h3',null,x.name),el('p','uk-quiet',x.d+' \u00b7 '+x.area+' \u00b7 '+x.v),el('p',null,x.n));var dl=el('dl','uk-kv');[['Tech',x.td],['Time on site',x.min],['Tasks',x.tasks]].forEach(function(k){var r=el('div');r.append(el('dt',null,k[0]),el('dd',null,k[1]));dl.appendChild(r)});pn.append(dl,pill('TEST','test'))}
 L.forEach(function(x,i){var b=btn('uk-ph-t',null);b.setAttribute('aria-pressed','false');b.setAttribute('aria-label',x.name+', '+x.d);b.appendChild(homeSvg(x.ph,PHK[x.ph],160,100));b.appendChild(el('span',null,x.d.replace(', 2026','')+' \u00b7 '+x.name.split(' ')[0]));on(b,'click',function(){show(x,b)});g.appendChild(b);if(!i)show(x,b)})};
/* Certifications And Training (optional): badge cards per tech with valid-until dates; training as a day-by-day calendar (Research Tech Certs 03 A, 08 A) */
RENDER.certs=function(s,B,d){var r=el('div','uk-cardrow');d.certs.forEach(function(c){var a=el('article','uk-tc');var h=el('div','uk-tc-h');h.append(el('h3',null,'Tech Dash '+c.td),pill('TEST','test'));a.appendChild(h);var g=el('div','uk-badges');
  c.badges.forEach(function(b){var x=el('div','uk-badge');x.append(el('b',null,b[0]),el('span',null,/^(No expiry|Booked)/.test(b[1])?b[1]:'Valid until '+b[1]));g.appendChild(x)});a.appendChild(g);r.appendChild(a)});B.appendChild(carousel(r));
 var T=d.training;if(!T)return;B.appendChild(el('h3','uk-subh','Training Week · Oct 12 to 16'));var sc=el('div','uk-xscroll'),g=el('div','uk-tcal');g.style.setProperty('--n',T.days.length);g.appendChild(el('span','uk-lh'));
 T.days.forEach(function(x){var hh=el('span','uk-lh');hh.append(el('b',null,x[0]+' '+x[1]),el('small',null,x[2]));g.appendChild(hh)});
 T.techs.forEach(function(t){g.appendChild(el('span','uk-lane-n td'+t.td,'Tech Dash '+t.td));T.days.forEach(function(x,i){var c=el('span','uk-tday'+(i<t.done?' is-done':''));c.textContent=i<t.done?'Done':'Not done';g.appendChild(c)})});
 sc.appendChild(g);B.appendChild(sc);B.appendChild(el('p','uk-quiet',T.techs.map(function(t){return 'Tech Dash '+t.td+': '+t.done+' of 5 days'}).join(' · ')+'. Sample (TEST).'))};
/* ---------- Tools & Equipment ---------- */
var CND={Good:'ok',Worn:'gold',Replace:'warn'};
RENDER.bags=function(s,B,d,f){var r=el('div','uk-cardrow uk-bagrow'),worn=0,rep=0;d.bags.forEach(function(b){var a=el('article','uk-tc uk-bag');var h=el('div','uk-tc-h');h.append(el('h3',null,'Tech Dash '+b.td+' \u00b7 Van '+b.van));var n=0;b.cats.forEach(function(c){n+=c.items.length});h.appendChild(el('span','uk-quiet',plural(n,'tool line')));a.appendChild(h);
  b.cats.forEach(function(c){var w=c.items.filter(function(x){return x.cond==='Worn'}).length,rp=c.items.filter(function(x){return x.cond==='Replace'}).length;worn+=w;rep+=rp;var cf=fold(c.name,{plain:true,sum:plural(c.items.length,'item')+(w?' \u00b7 '+w+' worn':'')+(rp?' \u00b7 '+rp+' replace':'')});
   cf.body.appendChild(table(['Item','Qty','Condition','Last checked','Label'],c.items.map(function(x){return [{t:x.item},x.qty,{c:[x.cond,CND[x.cond]]},x.checked,{c:null,t:null,s:null,pill:x.label}]}),{cls:'compact uk-bagt'}));a.appendChild(cf.node)});
  var o=el('div','uk-openrow');o.append(el('b',null,'Final tool list: Open'),el('span',null,'Not decided yet.'));a.appendChild(o);r.appendChild(a)});B.appendChild(carousel(r,'uk-onecar'));
 [].forEach.call(B.querySelectorAll('.uk-bagt td[data-l="Label"]'),function(td){clear(td).appendChild(pill('TEST','test'))});f.sum.querySelector('.uk-fold-s').textContent='3 bags \u00b7 '+worn+' worn \u00b7 '+rep+' to replace'};
var ORD=null;
RENDER.vans=function(s,B,d){var V=d.vans,cur=0,cat='All',g=el('div','uk-vans'),box=el('div');B.append(g,box);
 V.forEach(function(v,i){var low=v.items.filter(function(x){return x.par&&x.on<x.min}).length,b=btn('uk-van',null);b.setAttribute('aria-pressed',String(i===0));var vi=el('span','uk-van-ic');vi.appendChild(ic('van',30));b.append(vi,el('b',null,'Van '+v.van),el('span',null,'Tech Dash '+v.td+' \u00b7 '+plural(v.items.length,'line')),el('span',low?'uk-low':'uk-quiet',low?low+' below min':'All above min'));on(b,'click',function(){cur=i;[].forEach.call(g.children,function(x){x.setAttribute('aria-pressed',String(x===b))});draw()});g.appendChild(b)});
 function draw(){clear(box);var v=V[cur],cats=['All'];v.items.forEach(function(x){if(cats.indexOf(x.cat)<0)cats.push(x.cat)});if(cats.indexOf(cat)<0)cat='All';var ch=el('div','uk-chips');cats.forEach(function(c){var b=btn('uk-fchip',c);b.setAttribute('aria-pressed',String(c===cat));on(b,'click',function(){cat=c;draw()});ch.appendChild(b)});box.appendChild(ch);
  var t=el('table','uk-table uk-stock'),th=el('thead'),tr=el('tr');['Item','Stock to par','On / par','',''].forEach(function(c){tr.appendChild(el('th',null,c))});th.appendChild(tr);t.appendChild(th);var tb=el('tbody');t.appendChild(tb);
  v.items.filter(function(x){return cat==='All'||x.cat===cat}).forEach(function(x){var r=el('tr'),low=x.par&&x.on<x.min;var a=el('td');a.setAttribute('data-l','Item');a.append(el('b',null,x.item),el('span','uk-cs',x.cat));var bt=el('td');bt.setAttribute('data-l','Stock to par');var bar=el('span','uk-par'+(low?' is-low':'')),i=el('i');i.style.width=(x.par?Math.min(100,x.on/x.par*100):0)+'%';bar.appendChild(i);var tk=el('b','uk-tick');tk.style.left=(x.par?x.min/x.par*100:0)+'%';bar.appendChild(tk);bt.appendChild(bar);
   var nm=el('td','num',x.on+' / '+x.par);nm.setAttribute('data-l','On / par');var fl=el('td');fl.setAttribute('data-l','Flag');if(low){var w=el('span','uk-flag');w.append(ic('warn',15),el('span',null,'Below min'));fl.appendChild(w)}var ac=el('td');ac.setAttribute('data-l','Order');
   if(low){var rb=btn('uk-btn is-sm','Request order','plus');on(rb,'click',function(){if(ORD)ORD({item:x.item,for:'Van '+v.van,qty:String(Math.max(1,x.par-x.on)),by:'Van '+v.van+' low stock',st:"Needs Max's approval",lock:true,label:'TEST',added:true});rb.disabled=true;rb.lastChild.textContent='Requested'});ac.appendChild(rb)}r.append(a,bt,nm,fl,ac);tb.appendChild(r)});
  var w=el('div','uk-tscroll');w.appendChild(t);box.appendChild(w);var o=el('div','uk-openrow');o.append(el('b',null,'Van setup: Open'),el('span',null,'Shelf layout and par levels are not decided; pars here are sample targets.'));box.appendChild(o)}
 draw()};
var OST={'Requested':'info',"Needs Max's approval":'warn','Approved':'ok','Ordered':'gold','Received':'mute'};
RENDER.orders=function(s,B,d){var bn=el('div','uk-nobuy');bn.append(ic('lock',18),el('b',null,'Nothing is bought without Max\u2019s approval.'),el('span',null,'Locked rows wait for you. This board never places orders.'));B.appendChild(bn);
 var qa=el('form','uk-quickadd'),inp=el('input');inp.type='text';inp.placeholder='Add a request in one line, e.g. 6 shoe covers for Van 2';inp.setAttribute('aria-label','New order request');var ab=btn('uk-btn is-pri','Add request','plus');ab.type='submit';qa.append(inp,ab);B.appendChild(qa);
 var note=el('p','uk-quiet','New rows live only in this tab: nothing is saved, sent or bought. Supplier and cost stay Open.');B.appendChild(note);
 var t=el('table','uk-table uk-orders'),th=el('thead'),tr=el('tr');['','Item','For','Qty','Asked by','Status','Label'].forEach(function(c){tr.appendChild(el('th',null,c))});th.appendChild(tr);t.appendChild(th);var tb=el('tbody');t.appendChild(tb);var w=el('div','uk-tscroll');w.appendChild(t);B.appendChild(w);
 function add(o,top){var r=el('tr',o.lock?'is-locked':null),c0=el('td','uk-lockc');c0.setAttribute('data-l','');if(o.lock){c0.appendChild(ic('lock',15));c0.title='Locked until Max approves'}r.appendChild(c0);[['Item',o.item],['For',o.for],['Qty',o.qty],['Asked by',o.by]].forEach(function(x,i){var td=el('td',null);td.setAttribute('data-l',x[0]);if(!i)td.appendChild(el('b',null,x[1]));else td.textContent=x[1];r.appendChild(td)});
  var s2=el('td');s2.setAttribute('data-l','Status');s2.appendChild(el('span','uk-wchip w-'+OST[o.st],o.st));var l=el('td');l.setAttribute('data-l','Label');l.appendChild(pill(o.added?'Draft':o.label,o.added?'warn':'test'));r.append(s2,l);if(top)tb.insertBefore(r,tb.firstChild);else tb.appendChild(r)}
 d.orders.forEach(function(o){add(o)});ORD=function(o){add(o,true)};
 on(qa,'submit',function(e){e.preventDefault();var v=inp.value.trim().slice(0,90);if(!v)return;var m=v.match(/^(\d+)\s+(.*)$/);add({item:m?m[2]:v,for:'Open',qty:m?m[1]:'Open',by:'You (this tab)',st:"Needs Max's approval",lock:true,label:'TEST',added:true},true);inp.value=''})};
RENDER.supplier=function(s,B,d){B.appendChild(table(['Item','Supplier','Cost'],d.orders.map(function(o){return [{t:o.item},{c:['Open','gold']},{c:['Open','gold']}]}),{cls:'compact'}));var o=el('div','uk-openrow');o.append(el('b',null,'Suppliers: Open'),el('span',null,'Prices are not shown on this board.'));B.appendChild(o)};

/* ---------- Scheduling ---------- */
var CAPD=5;
function fill(n,cap){var w=el('span','uk-fill'+(n>=cap?' is-full':''));for(var i=1;i<=4;i++)w.appendChild(el('i',n/cap>=i/4-1e-9?'on':null));w.title=n+' of '+cap+' sample stops';return w}
RENDER.sched=function(s,B,d){var days=d.week,view='Week',box=el('div');B.appendChild(tabs(['Day','Week','Month'],'Week',function(n){view=n;draw()},'is-under'));B.appendChild(box);var dayi=null;
 function draw(){clear(box);if(view==='Week'){box.appendChild(tlegend());var g=el('div','uk-wgrid');days.forEach(function(x){var c=el('div','uk-wcol'+(x.key===dayKey(NOW)?' is-today':''));var h=el('div','uk-wh');h.append(el('small',null,x.key===dayKey(NOW)?'Today \u00b7 '+x.dow:x.dow),el('b',null,x.label),el('span',null,plural(x.visits.length,'visit')));
   var fw=el('div','uk-fills');[1,2,3].forEach(function(n){fw.appendChild(fill(x.visits.filter(function(v){return v.td===n}).length,CAPD))});h.appendChild(fw);c.appendChild(h);var L=x.visits.slice().sort(function(a,b){return tm(a.t)-tm(b.t)}),LIM=6,more=null;
   L.forEach(function(v,i){var ch=vchip(v,'is-edge td'+v.td);if(i<LIM)c.appendChild(ch);else{if(!more){more=el('details','uk-wmore');more.appendChild(el('summary',null,'+'+(L.length-LIM)+' more'));c.appendChild(more)}more.appendChild(ch)}});if(!L.length)c.appendChild(el('span','uk-off','No visits'));g.appendChild(c)});box.appendChild(g)}
  else if(view==='Day'){var di=dayi==null?todayIdx(days):dayi;box.appendChild(daypick(days,di,function(i){dayi=i;draw()}));var cols=el('div','uk-daycols');[1,2,3].forEach(function(n){var c=el('div','uk-dcol');var vs=days[di].visits.filter(function(v){return v.td===n}).sort(function(a,b){return tm(a.t)-tm(b.t)});var hh=el('h3','td'+n,'Tech Dash '+n);c.appendChild(hh);c.appendChild(fill(vs.length,CAPD));vs.forEach(function(v){c.appendChild(vchip(v,'is-edge td'+n))});if(!vs.length)c.appendChild(el('p','uk-quiet','No stops.'));cols.appendChild(c)});box.appendChild(cols)}
  else{box.appendChild(monthGrid(d.month,function(){return 'lg'}));box.appendChild(el('p','uk-quiet','October 2026. One dot per booked visit. Temp Data: the month repeats this week\u2019s sample pattern.'))}}
 draw()};
function tm(t){var m=String(t).match(/(\d+):(\d+)\s*(AM|PM)/i);if(!m)return 0;var h=+m[1]%12+(m[3].toUpperCase()==='PM'?12:0);return h*60+ +m[2]}
var RQ={reschedule:['Reschedule','q-rs'],first:['First visit','q-fv'],addon:['Add-on','q-ad'],repair:['Repair need','q-rp']};
RENDER.comms=function(s,B,d){var lg=el('p','uk-legend');Object.keys(RQ).forEach(function(k){lg.appendChild(el('span',RQ[k][1],RQ[k][0]))});B.appendChild(lg);var g=el('div','uk-ccols');['New','Slot Proposed','Waiting on Approval'].forEach(function(c,ci){var col=el('div','uk-ccol'),L=d.comms.filter(function(x){return x.col===c});col.appendChild(el('h3',null,c+' ('+L.length+')'));
  L.forEach(function(x){var a=el('article','uk-cc '+RQ[x.k][1]),top=el('div','uk-cc-top');top.append(el('b',null,x.name),el('span','uk-quiet',x.area),pill(x.label,'test'));a.appendChild(top);a.appendChild(el('p',null,x.need));var bt=el('div','uk-cc-bot'),tr=el('span','uk-trk');tr.setAttribute('aria-label','Step '+x.step+' of 3');for(var i=1;i<=3;i++)tr.appendChild(el('i',i<=x.step?'on':null));
   var ph=el('span','uk-thumbs');for(var j=0;j<x.photos;j++)ph.appendChild(homeSvg(j+x.name.length,PHK[(j+1)%6],34,22));bt.append(tr,ph,el('span','uk-notes-tag',plural(x.notes,'note')));a.appendChild(bt);col.appendChild(a)});if(!L.length)col.appendChild(el('p','uk-quiet','None.'));g.appendChild(col)});B.appendChild(g)};
RENDER.list=function(s,B){if(s.items.length)B.appendChild(rows(s.items,8));else B.appendChild(el('p','uk-quiet','Nothing here yet.'))};
RENDER.weather=function(s,B){var g=el('div','uk-wx');s.days.forEach(function(x){var c=el('div',x[3]?'is-snow':null);c.append(el('b',null,x[0]),el('span','uk-wx-t',x[1]),el('span',null,x[2]));if(x[3])c.appendChild(el('span','uk-flag2','Snow-day flag'));g.appendChild(c)});B.appendChild(g);B.appendChild(el('p','uk-quiet','Sample forecast (TEST), not a live weather feed.'))};
RENDER.capbars=function(s,B){var t=el('div','uk-cap');s.weeks.forEach(function(r){var row=el('div','uk-cap-r');row.appendChild(el('b','td'+r.td,'Tech Dash '+r.td));var bars=el('div','uk-cap-b');r.weeks.forEach(function(w){var c=el('div'),bar=el('span','uk-pbar'+(w[1]/s.cap>=.85?' is-near':'')),i=el('i');i.style.width=Math.min(100,w[1]/s.cap*100)+'%';bar.appendChild(i);c.append(el('small',null,w[0]),bar,el('span',null,w[1]+' / '+s.cap));bars.appendChild(c)});row.appendChild(bars);t.appendChild(row)});B.appendChild(t)};
RENDER.zonemap=function(s,B){var g=el('div','uk-zones');s.zones.forEach(function(z,zi){var c=el('figure');var sv=S('svg',{viewBox:'0 0 120 70',width:120,height:70,'aria-hidden':'true'});sv.appendChild(S('rect',{width:120,height:70,fill:'#FAF6EE'}));var pts=[];for(var i=0;i<z[1];i++){var a=(i/Math.max(1,z[1]))*Math.PI*1.6+zi;pts.push([60+Math.cos(a)*(30+(i%2)*12),35+Math.sin(a)*20])}
  if(pts.length>1)sv.appendChild(S('polyline',{points:pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1)}).join(' '),fill:'none',stroke:'#8b8478','stroke-width':1.5,'stroke-dasharray':'3 3'}));pts.forEach(function(p,i){sv.appendChild(S('circle',{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:i?3.2:4.5,'class':'zdot td'+z[2]}))});
  c.appendChild(sv);c.appendChild(el('figcaption',null,z[0]+' \u00b7 '+plural(z[1],'stop')));g.appendChild(c)});B.appendChild(g)};
RENDER.trend=function(s,B){var g=el('div','uk-trend'),mx=1;s.weeks.forEach(function(w){mx=Math.max(mx,w[1],w[2])});s.weeks.forEach(function(w){var c=el('div'),b=el('span','uk-tb');var r=el('i','r'),x=el('i','x');r.style.height=(w[1]/mx*100)+'%';x.style.height=(w[2]/mx*100)+'%';b.append(r,x);c.append(b,el('small',null,w[0]));c.title=w[1]+' reschedules, '+w[2]+' cancels';g.appendChild(c)});
 var lg=el('p','uk-legend');lg.append(el('span','k-rs','Reschedules'),el('span','k-cx','Cancels'));B.append(lg,g)};
RENDER.daysoff=function(s,B){var g=el('div','uk-doff');s.days.forEach(function(x){var c=el('div',x[1].length===3?'is-off':null);c.appendChild(el('b',null,x[0]));if(x[1].length===3)c.appendChild(el('span',null,'All off'));else x[1].forEach(function(n){c.appendChild(el('span','td'+n,'TD'+n+' off'))});g.appendChild(c)});B.appendChild(g);B.appendChild(el('p','uk-quiet','No public holidays in these two weeks. Sample days off (TEST).'))};

/* ---------- footer: Ping Record + Routines ---------- */
var PST={New:'info',Open:'gold',Seen:'mute',Done:'ok',Paused:'paused'};
function renderFooter(d){var F=d.footer||{},P=$('uk-pings');if(P){var L=(F.pings||[]).slice().sort(function(a,b){return Date.parse(b.at)-Date.parse(a.at)});var act=L.filter(function(x){return x.status!=='Done'&&x.status!=='Paused'}).length,pz=L.filter(function(x){return x.status==='Paused'}).length;
  var f=fold('Ping Record',{count:L.length,sum:act+' active \u00b7 '+pz+' paused',label:L.length?pill('TEST','test'):null,cls:'uk-ping-fold'});P.appendChild(f.node);f.body.appendChild(el('p','uk-quiet',F.ping_line||''));(F.ping_intro||[]).forEach(function(x){f.body.appendChild(el('p','uk-sub',x))});
  if(!L.length){f.body.appendChild(el('p','uk-quiet','No pings received yet.'))}else{var flt={Type:'all',Flag:'all',Label:'all',Status:'all'},fb=el('div','uk-filters');
   [['Type',function(x){return x.type}],['Flag',function(x){return x.flag?x.flag[0].toUpperCase()+x.flag.slice(1):'None'}],['Label',function(x){return x.label}],['Status',function(x){return x.status}]].forEach(function(k){var lab=el('label','uk-flt');lab.appendChild(el('span',null,k[0]));var se=el('select','uk-select');var o=el('option',null,'All');o.value='all';se.appendChild(o);var vals=[];L.forEach(function(x){var v=k[1](x);if(vals.indexOf(v)<0)vals.push(v)});vals.forEach(function(v){var op=el('option',null,v);op.value=v;se.appendChild(op)});on(se,'change',function(){flt[k[0]]=se.value;draw()});lab.appendChild(se);fb.appendChild(lab);k.push(se)});f.body.appendChild(fb);
   var t=el('table','uk-table uk-pingt'),th=el('thead'),tr=el('tr'),COLS=['Received','From','Type','Summary','Flag','Label','Status','Ethan'];COLS.forEach(function(c){tr.appendChild(el('th',null,c))});th.appendChild(tr);t.appendChild(th);var tb=el('tbody');t.appendChild(tb);var w=el('div','uk-tscroll');w.appendChild(t);f.body.appendChild(w);
   function draw(){clear(tb);var last='';L.filter(function(x){return (flt.Type==='all'||x.type===flt.Type)&&(flt.Flag==='all'||(x.flag?x.flag[0].toUpperCase()+x.flag.slice(1):'None')===flt.Flag)&&(flt.Label==='all'||x.label===flt.Label)&&(flt.Status==='all'||x.status===flt.Status)}).forEach(function(x){var dt=new Date(x.at),k=dayKey(dt);
     if(k!==last){last=k;var hr=el('tr','uk-dayh'),hc=el('td',null,(k===dayKey(NOW)?'Today \u00b7 ':(ago(dt)==='Yesterday'?'Yesterday \u00b7 ':''))+dt.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}));hc.colSpan=8;hr.appendChild(hc);tb.appendChild(hr)}
     var r=el('tr');function td(l,n){var c=el('td');c.setAttribute('data-l',l);if(n!=null){if(typeof n==='string')c.textContent=n;else c.appendChild(n)}r.appendChild(c);return c}
     var rc=td('Received');rc.append(el('b',null,fmtTime(dt)),el('span','uk-cs',ago(dt)));td('From',x.from);td('Type',x.type);td('Summary',x.summary).className='uk-psum';var fc=td('Flag');if(x.flag){var fl=el('span','uk-flag');fl.append(ic('warn',15),el('span',null,x.flag==='safety'?'Safety':'Urgent'));fc.appendChild(fl)}else fc.appendChild(el('span','uk-quiet','\u2013'));
     td('Label',pill(x.label,'test'));td('Status',chip(PST[x.status]||'mute',x.status));var ec=td('Ethan');if(x.ethan){var ok=el('span','uk-eth');ok.appendChild(ic('check',16));ok.setAttribute('aria-label','Reported to Ethan');ec.appendChild(ok)}else ec.appendChild(el('span','uk-quiet','\u2013'));tb.appendChild(r)});
    if(!tb.children.length){var er=el('tr'),ec2=el('td','uk-td-empty','No pings match these filters.');ec2.colSpan=8;er.appendChild(ec2);tb.appendChild(er)}}draw()}}
 var R=$('routines');if(R){var rt=F.routines||[],na=rt.filter(function(x){return x.status==='on'}).length,np=rt.length-na;var f2=fold('Routines',{count:rt.length,sum:na+' active, '+np+' paused'});R.appendChild(f2.node);
  if(!rt.length)f2.body.appendChild(el('p','uk-quiet','No routines yet.'));else{var ul=el('ul','uk-rtl');rt.forEach(function(x){var li=el('li'),sw=el('span','uk-sw'+(x.status==='on'?' is-on':''));sw.appendChild(el('i'));li.append(el('b',null,x.short||x.name),el('span','uk-quiet',x.schedule_plain||x.short_time||''),sw,el('span',null,x.status==='on'?'On':'Paused'),pill(x.next_label||'on event','open'));ul.appendChild(li)});f2.body.appendChild(ul)}}}

/* ---------- Technicians view switcher (one for all: Swatch call) ---------- */
function renderViews(d){var V=$('uk-views');if(!V||!d.switcher)return;var w=el('div','uk-viewbar');w.appendChild(el('span','uk-lbl','View'));w.appendChild(tabs(d.switcher.views,d.switcher.default,function(n){VIEW.v=n;VIEW.subs.forEach(function(f){f()})},'is-under'));w.appendChild(el('span','uk-quiet','Calendar and Who Is Working follow this switch.'));V.appendChild(w)}

function share(b){var u=location.href.split('#')[0],ok=b.querySelector('.uk-share-ok');if(navigator.share){navigator.share({title:document.title,url:u}).catch(function(){});return}
 try{navigator.clipboard.writeText(u).then(function(){if(ok)ok.textContent='Link copied'},function(){if(ok)ok.textContent='Copy failed'})}catch(_){}b.classList.add('is-copied');setTimeout(function(){b.classList.remove('is-copied');if(ok)ok.textContent=''},1800)}
function init(){[].forEach.call(document.querySelectorAll('[data-uk-share]'),function(b){on(b,'click',function(){share(b)})});var cur=null;try{cur=JSON.parse($('board-data').textContent)}catch(_){}if(!cur||!cur.board)return;D=cur;
 renderHeader(cur);renderViews(cur);renderMid(cur);renderFooter(cur)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

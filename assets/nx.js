/* Command Center one-page (Nov 11 2026): expandable sections on a single page,
   Members first, mini summary cards when collapsed. Reads the inline locked
   #mc-data / #ccm-data blocks only. Nothing here writes to a server. */
(function(){'use strict';
function $(i){return document.getElementById(i)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var MC,CD;try{MC=JSON.parse($('mc-data').textContent);CD=JSON.parse($('ccm-data').textContent)}catch(_){return}
var G=$('mc-grid');if(!G)return;
var LS='ccm-nx-open-v2';
var ORDER=['team-members','team-technicians','team-tools-equipment','team-scheduling','financial','marketing','warm','pinglog'];
var DEFOPEN={'team-members':1};
var WARM_ST=['Not Sent','Sent','Interested','Booked Scan','Member'];

function st(){try{return JSON.parse(localStorage.getItem(LS))||{}}catch(_){return {}}}
function put(o){try{localStorage.setItem(LS,JSON.stringify(o))}catch(_){}}

function teamOf(id){
  var short=id.replace(/^team-/,'');
  return (MC.teams||[]).find(function(t){return t.id===short||t.id===id})||null;
}
function lightOf(id){
  var short=id.replace(/^team-/,'');
  return (MC.lights||[]).find(function(x){return x.id===short||x.id===id})||null;
}
function titleCase(s){
  return String(s||'').replace(/(^|[\s(/·\-–])([a-z])/g,function(_,a,b){return a+b.toUpperCase()});
}
function shortLabel(raw, sub){
  var a=String(raw||'').replace(/\s+/g,' ').trim();
  var c=String(sub||'').replace(/\s+/g,' ').trim();
  if(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b|\d/.test(a) && /[A-Za-z]/.test(c) && c.length<28) a=c;
  a=a.replace(/^Monthly\s+/i,'').replace(/\s*\(Earned\)/i,'').replace(/\s*\([^)]*\)\s*$/,'');
  a=a.replace(/Today's Visits$/i,'Today').replace(/Tomorrow's Visits$/i,'Tomorrow');
  a=a.replace(/^Remaining This Week$/i,'This Week');
  a=a.replace(/^Daily Ad Spend$/i,'Daily').replace(/^Weekly Ad Spend$/i,'Weekly').replace(/^Monthly Ad Spend$/i,'Monthly');
  return titleCase(a);
}
function isPlainCount(n){
  return /^-?\d+$/.test(String(n==null?'':n).replace(/,/g,'').trim());
}
function agree(n, lab){
  if(!isPlainCount(n) || Number(String(n).replace(/,/g,''))!==1) return lab;
  var map={'Techs':'Tech','Members':'Member','Orders':'Order','Pings':'Ping','Channels':'Channel','Homes':'Home','Visits':'Visit','First Visits':'First Visit','Messages':'Message','Leads':'Lead','Requests':'Request','Reschedules':'Reschedule'};
  if(map[lab]) return map[lab];
  if(/ies$/i.test(lab)) return lab.replace(/ies$/i,'y');
  if(/s$/i.test(lab) && !/ss$/i.test(lab) && !/\s/.test(lab)) return lab.replace(/s$/i,'');
  return lab;
}
function moneyOf(n){
  if(window.CCM&&CCM.money)return CCM.money(n);
  n=Math.round(+n||0);
  return (n<0?'−$':'$')+Math.abs(n).toLocaleString('en-US');
}
function warmHomes(){
  var src=null;
  try{var loc=JSON.parse(localStorage.getItem('ccm-warm-v1'));if(loc&&loc.homes)src=loc.homes}catch(_){}
  if(!src){try{src=(JSON.parse($('warm-data').textContent).homes)||[]}catch(_){src=[]}}
  return src||[];
}
function warmIdx(s){var i=WARM_ST.indexOf(s);return i<0?0:i}
function checklistState(){
  var L=null;
  try{var x=JSON.parse(localStorage.getItem('launchChecklist.v1'));if(Array.isArray(x))L=x}catch(_){}
  var items=document.querySelectorAll('#launch-checklist .lc-ul li');
  if(items.length){
    return {done:document.querySelectorAll('#launch-checklist .lc-ul li.done').length,total:items.length};
  }
  if(L){return {done:L.filter(function(x){return x.d}).length,total:L.length}}
  var t=(((document.querySelector('#launch-checklist .lc-c')||{}).textContent)||'').match(/(\d+)\s+of\s+(\d+)/i);
  if(t)return {done:+t[1],total:+t[2]};
  return {done:0,total:0};
}
function parseMilestone(title){
  var raw=String(title||'').replace(/\s+/g,' ').trim();
  var name=raw, date=null, day=null;
  var mon={jan:0,january:0,feb:1,february:1,mar:2,march:2,apr:3,april:3,may:4,jun:5,june:5,jul:6,july:6,aug:7,august:7,sep:8,september:8,oct:9,october:9,nov:10,november:10,dec:11,december:11};
  var m=raw.match(/^(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})?,?\s*(\d{4})(?:\s*·\s*(.*))?$/i);
  if(m){
    var mi=mon[m[1].toLowerCase()], yr=+m[3];
    day=m[2]?+m[2]:null;
    date=new Date(yr,mi,day||1);
    name=(m[4]||(day?m[1]+' '+day:m[1]+' '+yr)).trim();
  }
  var end=date?new Date(date):null;
  if(end&&!day){end=new Date(date.getFullYear(),date.getMonth()+1,0)}
  return {title:raw,name:titleCase(name),date:date,end:end,hasDay:!!day};
}
function fmtMileDate(x){
  if(!x||!x.date)return '—';
  if(x.hasDay)return x.date.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  return x.date.toLocaleDateString('en-US',{month:'long',year:'numeric'});
}
function scenarioToday(){
  var raw=(CD.fin2&&CD.fin2.today)||MC.sim||MC.asof_line||CD.label||'';
  var m=String(raw).match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})/i);
  if(m){
    var mon={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
    var d=new Date(+m[3],mon[m[1].slice(0,3).toLowerCase()],+m[2]);
    if(!isNaN(d.getTime())){d.setHours(0,0,0,0);return d}
  }
  var t=new Date();t.setHours(0,0,0,0);return t;
}
function isDateOnlyLabel(s){
  var t=String(s||'').replace(/\s+/g,' ').trim();
  if(!t)return false;
  var mon='January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec';
  var day='Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday';
  if(new RegExp('^(?:(?:'+day+')[,\\s]+)?(?:'+mon+')\\s+\\d{4}$','i').test(t))return true;
  if(new RegExp('^(?:(?:'+day+')[,\\s]+)?(?:'+mon+')\\s+\\d{1,2},?\\s+\\d{4}$','i').test(t))return true;
  if(new RegExp('^\\d{1,2}\\s+(?:'+mon+')\\s+\\d{4}$','i').test(t))return true;
  if(/^\d{4}-\d{1,2}-\d{1,2}$/.test(t))return true;
  if(/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(t))return true;
  var ms=Date.parse(t);
  if(isNaN(ms))return false;
  var leftover=t.replace(new RegExp(mon,'ig'),' ').replace(new RegExp(day,'ig'),' ').replace(/[0-9,./\-]/g,' ').replace(/\s+/g,' ').trim();
  leftover=leftover.replace(/\b(of|the|st|nd|rd|th)\b/ig,'').replace(/\s+/g,' ').trim();
  return !leftover;
}
function nextLine(mile){
  if(!mile)return '';
  var name=mile.name||'';
  var dt=fmtMileDate(mile);
  var dateText=(dt&&dt!=='—')?dt:name;
  if(!name||isDateOnlyLabel(name))return 'Next Milestone · '+dateText;
  if(dt&&dt!=='—'&&name.toLowerCase()!==dt.toLowerCase()&&name.toLowerCase().indexOf(dt.toLowerCase())===-1){
    return 'Next '+name+' · '+dt;
  }
  return 'Next '+name;
}
function nextMilestone(){
  var items=[];
  document.querySelectorAll('#launch-timeline .lt-h').forEach(function(h){items.push(parseMilestone(h.textContent))});
  if(!items.length){
    ['November 2026 · Before Launch','Dec 1 2026 · Launch','December 2026','January 2027'].forEach(function(t){items.push(parseMilestone(t))});
  }
  var today=scenarioToday();
  var dated=items.filter(function(x){return x.hasDay&&x.date&&x.date>=today}).sort(function(a,b){return a.date-b.date});
  if(dated.length)return dated[0];
  var open=items.filter(function(x){return x.end&&x.end>=today});
  return open[0]||items[items.length-1]||null;
}

/* 2–3 key counts for the collapsed mini card. Prefer already-rendered tiles,
   then the team's stats in #mc-data, then a short fallback. */
function countsFor(s,id){
  var out=[],seen={};
  function add(n,l,sub,opts){
    if(out.length>=3)return;
    var wide=opts&&opts.wide;
    var lab=wide?'':agree(n,shortLabel(l,sub));
    var num=String(n==null||n===''?'—':n).trim();
    var k=(lab||num).toLowerCase();
    if((!lab&&!wide)||seen[k])return;
    seen[k]=1;out.push({n:num,l:lab,wide:!!wide});
  }
  if(id==='launch-checklist'){
    var ck=checklistState();
    add(ck.done,'Done');
    add(Math.max(0,ck.total-ck.done),'Remaining');
    add(ck.total,'Total');
    return out;
  }
  if(id==='launch-timeline'){
    var mile=nextMilestone();
    if(mile)add(nextLine(mile),'',null,{wide:true});
    var nMiles=document.querySelectorAll('#launch-timeline .lt-h').length||4;
    add(nMiles,'Milestones');
    return out;
  }
  if(id!=='marketing'&&id!=='warm'){
    s.querySelectorAll('.ccm-tile').forEach(function(t){
      var b=t.querySelector('b'),sp=t.querySelector('span'),sm=t.querySelector('small');
      if(b&&sp)add(b.textContent,sp.textContent,sm&&sm.textContent);
    });
    if(out.length<3){
      s.querySelectorAll('.mc-ro > div, .mc-ro > *').forEach(function(t){
        var b=t.querySelector('b'),sp=t.querySelector('span'),sm=t.querySelector('small');
        if(b&&sp)add(b.textContent,sp.textContent,sm&&sm.textContent);
      });
    }
  }
  if(out.length<3){
    var tm=teamOf(id);
    (tm&&tm.stats||[]).forEach(function(row){add(row[1],shortLabel(row[0],row[2]))});
  }
  if(id==='financial'&&out.length<3&&CD.fin2){
    var F=CD.fin2;
    if(F.cash_today!=null)add(moneyOf(F.cash_today),'Cash On Hand');
    if(F.members!=null)add(F.members,'Members');
  }
  if(id==='marketing'){
    out=[];seen={};
    var mk=(CD.fin2&&CD.fin2.marketing)||{},ch=mk.channels||{},names=Object.keys(ch);
    var spend=names.reduce(function(a,k){return a+(+ch[k]||0)},0);
    add(moneyOf(spend),'Ad Spend');
    add(names.length,'Channels');
    add('—','Leads');
    return out;
  }
  if(id==='warm'){
    out=[];seen={};
    var homes=warmHomes();
    function cum(st){return homes.filter(function(h){return warmIdx(h.status)>=warmIdx(st)}).length}
    add(homes.length,'Homes');
    add(homes.filter(function(h){return h.status==='Member'}).length,'Members');
    add(cum('Sent'),'Sent');
    return out;
  }
  if(id==='pinglog'&&out.length<3){
    var L=MC.pings||[],cn={Open:0,'In progress':0,Done:0};
    L.forEach(function(p){cn[p.state]=(cn[p.state]||0)+1});
    add(L.length,'Pings');
    add(cn.Open||0,'Open');
    add(cn.Done||0,'Done');
  }
  return out;
}

function toneOf(id,s){
  if(id==='launch-checklist'){
    var ck=checklistState();
    return (ck.total&&ck.done>=ck.total)?'green':'amber';
  }
  if(id==='launch-timeline'){
    var mile=nextMilestone();
    if(!mile||!mile.end)return 'green';
    return mile.end>=scenarioToday()?'amber':'green';
  }
  var L=lightOf(id);
  if(L&&L.c)return /red/i.test(L.c)?'red':/amber|yellow/i.test(L.c)?'amber':'green';
  if(s.querySelector('.lv-red, .lv-yellow, .ccm-sreq.lv-yellow'))return 'amber';
  return 'green';
}

function fillMini(s,id){
  var mini=s.querySelector('.nx-mini');
  var after=s.querySelector('.mc-pb, .lc-body');
  if(!mini){mini=el('div','nx-mini');if(after)s.insertBefore(mini,after);else s.appendChild(mini)}
  mini.textContent='';
  mini.setAttribute('aria-hidden', s.classList.contains('nx-shut')?'false':'true');
  countsFor(s,id).forEach(function(c){
    var k=el('div',c.wide?'nx-k nx-wide':'nx-k');
    k.append(el('b',null,c.n));
    if(c.l)k.append(el('span',null,c.l));
    mini.appendChild(k);
  });
  var h=s.querySelector('.mc-ph, .lc-sum');
  if(h&&!h.querySelector('.nx-dot')){
    var d=el('span','nx-dot');d.setAttribute('aria-hidden','true');
    h.insertBefore(d,h.firstChild);
  }
  var dot=s.querySelector('.nx-dot');
  if(dot){dot.className='nx-dot '+toneOf(id,s)}
  applyTitleCase(s);
}

function bindSection(s){
  var id=s.id.replace(/^p-/,''),h=s.querySelector('.mc-ph, .lc-sum'),bd=s.querySelector('.mc-pb, .lc-body');
  if(!h||!bd)return;
  if(h.querySelector('.nx-tog'))return;
  var b=el('button','nx-tog');b.type='button';b.setAttribute('aria-controls',bd.id=bd.id||('pb-'+id));
  b.appendChild(el('span','nx-chev'));var lab=el('span','nx-sr');b.appendChild(lab);
  h.appendChild(b);h.classList.add('nx-h');
  var details=s.tagName==='DETAILS';
  function keepDetailsOpen(){if(details&&!s.open)s.open=true}
  function set(open,save){
    /* Keep <details> open so the mini card (a sibling of <summary>) can show.
       .nx-shut hides only the section body. */
    keepDetailsOpen();
    s.classList.toggle('nx-shut',!open);
    if(s.classList.contains('lc-warm'))s.classList.toggle('wl-closed',!open);
    b.setAttribute('aria-expanded',String(open));
    var title=(s.querySelector('h2')||{}).textContent||'Section';
    lab.textContent=(open?'Collapse ':'Expand ')+title;
    if(save){var o=st();o[id]=open?1:0;put(o)}
    var mini=s.querySelector('.nx-mini');
    if(mini)mini.setAttribute('aria-hidden',open?'true':'false');
    if(!open)fillMini(s,id);
  }
  s._nxset=set;
  var o=st();
  var initial=id in o?!!o[id]:!!DEFOPEN[id];
  set(initial,false);
  b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();set(s.classList.contains('nx-shut'),true)});
  if(details){
    s.addEventListener('toggle',function(){keepDetailsOpen()});
  }
  h.addEventListener('click',function(e){
    if(e.target.closest('a,input,select,textarea,button:not(.nx-tog)'))return;
    if(e.target===b||b.contains(e.target))return;
    set(s.classList.contains('nx-shut'),true);
  });
}

var _tcBusy=false;
function applyTitleCase(root){
  if(_tcBusy)return;
  _tcBusy=true;
  try{
    var sel='h1,h2,h3,h4,.mc-sec,.mc-fold>summary>b,.ccm-h4,.nx-k span,.ccm-tile>span,.mc-ro>div>span,.mc-need h3';
    (root||document).querySelectorAll(sel).forEach(function(n){
      if(n.closest('.mc-mh, .ccm-msgs, .nx-thread, textarea, input'))return;
      if(n.childElementCount)return;
      var t=n.textContent,u=titleCase(t);
      if(u&&u!==t)n.textContent=u;
    });
    (root||document).querySelectorAll('.ccm-tile, .mc-ro > div').forEach(function(t){
      var b=t.querySelector('b'),sp=t.querySelector('span');
      if(!b||!sp||sp.childElementCount)return;
      var u=agree(b.textContent,titleCase(sp.textContent));
      if(u&&u!==sp.textContent)sp.textContent=u;
    });
  }finally{_tcBusy=false}
}
function watchTitleCase(){
  if(window.__nxTCmo)return;
  var t=null;
  function kick(){
    if(_tcBusy)return;
    clearTimeout(t);
    t=setTimeout(function(){applyTitleCase(document)},40);
  }
  var mo=new MutationObserver(kick);
  var roots=[G,$('lc-stack'),document.getElementById('mc-main')||document.body].filter(Boolean);
  roots.forEach(function(r){mo.observe(r,{subtree:true,childList:true,characterData:true})});
  window.__nxTCmo=mo;
}

function reorder(){
  var map={};
  [].forEach.call(G.querySelectorAll('.mc-p'),function(s){map[s.id.replace(/^p-/,'')]=s});
  ORDER.forEach(function(id){
    var s=map[id]||$('p-'+id);
    if(!s)return;
    /* Marketing and Warm List were moved into #lc-stack; bring them back in section order. */
    G.appendChild(s);
    delete map[id];
  });
  Object.keys(map).forEach(function(id){G.appendChild(map[id])});
  var stack=$('lc-stack');
  if(stack&&G.parentNode)G.parentNode.insertBefore(stack,G.nextSibling);
  G.setAttribute('aria-label','Command Center: Members, Technicians, Tools and Equipment, and other sections');
}

function boot(){
  document.documentElement.classList.add('cc-one');
  document.body.classList.add('cc-one');
  document.body.classList.remove('ccm-side');
  document.documentElement.classList.remove('pw-hid');
  reorder();
  var secs=[].slice.call(G.querySelectorAll('.mc-p'));
  var stack=$('lc-stack');
  if(stack)secs=secs.concat([].slice.call(stack.querySelectorAll('.lc-sec, .mc-p')));
  var seen={};
  secs.forEach(function(s){if(s.id&&!seen[s.id]){seen[s.id]=1;bindSection(s)}});
  secs.forEach(function(s){if(s.id)fillMini(s,s.id.replace(/^p-/,''))});
  applyTitleCase(document);
  watchTitleCase();
}

/* expandable sections are bound in boot(), after Launch Checklist has moved Warm List and Marketing */
setTimeout(boot,0);

/* inline detail folds that sit inside an open section */
function fold(sec,title,count,fill){var s=$(sec);if(!s)return;var bd=s.querySelector('.mc-pb'),d=el('details','nx-fold'),sm=el('summary');sm.append(el('span',null,titleCase(title)));if(count!=null)sm.appendChild(el('span','nx-n',String(count)));d.appendChild(sm);var box=el('div','nx-fb');d.appendChild(box);var done=false;
 d.addEventListener('toggle',function(){if(d.open&&!done){done=true;try{fill(box)}catch(e){box.appendChild(el('p','mc-quiet','Could not load.'));setTimeout(function(){throw e})}}});bd.appendChild(d)}
function tbl(box,cols,rows){var w=el('div','nx-tw'),t=el('table','nx-t'),hd=el('tr');cols.forEach(function(c){hd.appendChild(el('th',null,c[0]))});var th=el('thead');th.appendChild(hd);t.appendChild(th);var tb=el('tbody');rows.forEach(function(r){var tr=el('tr');cols.forEach(function(c){tr.appendChild(el('td',null,r[c[1]]==null?'\u2013':String(r[c[1]])))});tb.appendChild(tr)});t.appendChild(tb);w.appendChild(t);box.appendChild(w)}
fold('p-team-members','All Members',(CD.members||[]).length,function(box){tbl(box,[['Member','name'],['Plan','plan'],['Area','area'],['Status','status'],['Tech','tech']],CD.members||[])});
var R=MC.roster||[],DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
if(R.length)fold('p-team-technicians','Technician Schedule',R.length,function(box){tbl(box,[['Tech','tech']].concat(DAYS.map(function(d){return [d,d]})),R.map(function(r){var o={tech:r.name||(r.td===1?'Ethan':'Tech '+r.td)};DAYS.forEach(function(d,i){o[d]=(r.days||[])[i]});return o}))});
var GE=MC.gear||{};
if((GE.vans||[]).length)fold('p-team-tools-equipment','Van Stock',GE.vans.length,function(box){tbl(box,[['Item','item'],['Category','cat'],['On Hand','on'],['Par','par'],['Status','st']],GE.vans)});
if((GE.bags||[]).length)fold('p-team-tools-equipment','Tech Bag',GE.bags.length,function(box){tbl(box,[['Item','item'],['Category','cat'],['Qty','qty'],['Condition','cond'],['Checked','checked']],GE.bags)});
if((GE.shop_full||[]).length)fold('p-team-tools-equipment','Shop Inventory',GE.shop_full.length,function(box){tbl(box,[['Item','item'],['Category','cat'],['Qty','qty'],['Min','min'],['Location','loc'],['Status','st']],GE.shop_full)});
window.__nx={v:'cc1s',onePage:true};
})();

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
  return String(s||'').replace(/\b([a-z])/g,function(m,c){return c.toUpperCase()});
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

/* 2–3 key counts for the collapsed mini card. Prefer already-rendered tiles,
   then the team's stats in #mc-data, then a short fallback. */
function countsFor(s,id){
  var out=[],seen={};
  function add(n,l,sub){
    if(out.length>=3)return;
    var lab=shortLabel(l,sub);
    var num=String(n==null||n===''?'—':n).trim();
    var k=lab.toLowerCase();
    if(!lab||seen[k])return;
    seen[k]=1;out.push({n:num,l:lab});
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
    if(F.cash_today!=null)add((window.CCM&&CCM.money)?CCM.money(F.cash_today):F.cash_today,'Cash On Hand');
    if(F.members!=null)add(F.members,'Members');
  }
  if(id==='marketing'&&out.length<3){
    add('$0','Ad Spend');
    add('5','Channels');
    add('—','Leads');
  }
  if(id==='warm'){
    out=[];seen={};
    var src=null;
    try{var loc=JSON.parse(localStorage.getItem('ccm-warm-v1'));if(loc&&loc.homes)src=loc.homes}catch(_){}
    if(!src){try{src=(JSON.parse($('warm-data').textContent).homes)||[]}catch(_){src=[]}}
    var by={};(src||[]).forEach(function(h){var k=h.status||'Sent';by[k]=(by[k]||0)+1});
    ['Sent','Interested','Booked Scan','Member'].forEach(function(k){if(by[k])add(by[k],k==='Member'?'Members':k)});
    if(!out.length)add((src||[]).length||'—','Homes');
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
  var L=lightOf(id);
  if(L&&L.c)return /red/i.test(L.c)?'red':/amber|yellow/i.test(L.c)?'amber':'green';
  if(s.querySelector('.lv-red, .lv-yellow, .ccm-sreq.lv-yellow'))return 'amber';
  return 'green';
}

function fillMini(s,id){
  var mini=s.querySelector('.nx-mini');
  if(!mini){mini=el('div','nx-mini');mini.setAttribute('aria-hidden','true');s.insertBefore(mini,s.querySelector('.mc-pb'))}
  mini.textContent='';
  countsFor(s,id).forEach(function(c){
    var k=el('div','nx-k');k.append(el('b',null,c.n),el('span',null,c.l));mini.appendChild(k);
  });
  var h=s.querySelector('.mc-ph');
  if(h&&!h.querySelector('.nx-dot')){
    var d=el('span','nx-dot');d.setAttribute('aria-hidden','true');
    h.insertBefore(d,h.firstChild);
  }
  var dot=s.querySelector('.nx-dot');
  if(dot){dot.className='nx-dot '+toneOf(id,s)}
}

function bindSection(s){
  var id=s.id.replace(/^p-/,''),h=s.querySelector('.mc-ph'),bd=s.querySelector('.mc-pb');
  if(!h||!bd)return;
  if(h.querySelector('.nx-tog'))return;
  var b=el('button','nx-tog');b.type='button';b.setAttribute('aria-controls',bd.id=bd.id||('pb-'+id));
  b.appendChild(el('span','nx-chev'));var lab=el('span','nx-sr');b.appendChild(lab);
  h.appendChild(b);h.classList.add('nx-h');
  function set(open,save){
    s.classList.toggle('nx-shut',!open);
    if(s.classList.contains('lc-warm'))s.classList.toggle('wl-closed',!open);
    b.setAttribute('aria-expanded',String(open));
    var title=(s.querySelector('h2')||{}).textContent||'Section';
    lab.textContent=(open?'Collapse ':'Expand ')+title;
    if(save){var o=st();o[id]=open?1:0;put(o)}
    if(!open)fillMini(s,id);
  }
  s._nxset=set;
  var o=st();
  set(id in o?!!o[id]:!!DEFOPEN[id],false);
  b.addEventListener('click',function(e){e.stopPropagation();set(s.classList.contains('nx-shut'),true)});
  h.addEventListener('click',function(e){
    if(e.target.closest('a,input,select,textarea,button:not(.nx-tog)'))return;
    if(e.target===b||b.contains(e.target))return;
    set(s.classList.contains('nx-shut'),true);
  });
}

function reorder(){
  var map={};
  [].forEach.call(G.querySelectorAll('.mc-p'),function(s){map[s.id.replace(/^p-/,'')]=s});
  ORDER.forEach(function(id){
    var s=map[id]||$( 'p-'+id);
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
  document.body.classList.add('cc-one');
  document.body.classList.remove('ccm-side');
  document.documentElement.classList.remove('pw-hid');
  reorder();
  [].forEach.call(G.querySelectorAll('.mc-p'),function(s){bindSection(s)});
  /* Fill minis after tiles have rendered (Members / Scheduling / Financial). */
  [].forEach.call(G.querySelectorAll('.mc-p'),function(s){fillMini(s,s.id.replace(/^p-/,''))});
}

/* expandable sections are bound in boot(), after Launch Checklist has moved Warm List and Marketing */
setTimeout(boot,0);

/* inline detail folds that sit inside an open section */
function fold(sec,title,count,fill){var s=$(sec);if(!s)return;var bd=s.querySelector('.mc-pb'),d=el('details','nx-fold'),sm=el('summary');sm.append(el('span',null,title));if(count!=null)sm.appendChild(el('span','nx-n',String(count)));d.appendChild(sm);var box=el('div','nx-fb');d.appendChild(box);var done=false;
 d.addEventListener('toggle',function(){if(d.open&&!done){done=true;try{fill(box)}catch(e){box.appendChild(el('p','mc-quiet','Could not load.'));setTimeout(function(){throw e})}}});bd.appendChild(d)}
function tbl(box,cols,rows){var w=el('div','nx-tw'),t=el('table','nx-t'),hd=el('tr');cols.forEach(function(c){hd.appendChild(el('th',null,c[0]))});var th=el('thead');th.appendChild(hd);t.appendChild(th);var tb=el('tbody');rows.forEach(function(r){var tr=el('tr');cols.forEach(function(c){tr.appendChild(el('td',null,r[c[1]]==null?'\u2013':String(r[c[1]])))});tb.appendChild(tr)});t.appendChild(tb);w.appendChild(t);box.appendChild(w)}
fold('p-team-members','All Members',(CD.members||[]).length,function(box){tbl(box,[['Member','name'],['Plan','plan'],['Area','area'],['Status','status'],['Tech','tech']],CD.members||[])});
var R=MC.roster||[],DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
if(R.length)fold('p-team-technicians','Technician Schedule',R.length,function(box){tbl(box,[['Tech','tech']].concat(DAYS.map(function(d){return [d,d]})),R.map(function(r){var o={tech:r.name||(r.td===1?'Ethan':'Tech '+r.td)};DAYS.forEach(function(d,i){o[d]=(r.days||[])[i]});return o}))});
var GE=MC.gear||{};
if((GE.vans||[]).length)fold('p-team-tools-equipment','Van Stock',GE.vans.length,function(box){tbl(box,[['Item','item'],['Category','cat'],['On Hand','on'],['Par','par'],['Status','st']],GE.vans)});
if((GE.bags||[]).length)fold('p-team-tools-equipment','Tech Bag',GE.bags.length,function(box){tbl(box,[['Item','item'],['Category','cat'],['Qty','qty'],['Condition','cond'],['Checked','checked']],GE.bags)});
if((GE.shop_full||[]).length)fold('p-team-tools-equipment','Shop Inventory',GE.shop_full.length,function(box){tbl(box,[['Item','item'],['Category','cat'],['Qty','qty'],['Min','min'],['Location','loc'],['Status','st']],GE.shop_full)});
window.__nx={v:'cc1p',onePage:true};
})();

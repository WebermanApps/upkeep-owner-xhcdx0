/* Command Center NEXT (Nov 9 2026): one page with expandable sections, inline details
   instead of separate sub-boards, one discreet preview notice. Reads the inline locked
   #mc-data / #ccm-data blocks only. Demo only: nothing here writes to a server. */
(function(){'use strict';
function $(i){return document.getElementById(i)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var MC,CD;try{MC=JSON.parse($('mc-data').textContent);CD=JSON.parse($('ccm-data').textContent)}catch(_){return}
var G=$('mc-grid');if(!G)return;
var LS='ccm-nx-open-v1',phone=window.matchMedia&&matchMedia('(max-width:1099px)');
function st(){try{return JSON.parse(localStorage.getItem(LS))||{}}catch(_){return {}}}
function put(o){try{localStorage.setItem(LS,JSON.stringify(o))}catch(_){}}
/* expandable sections (phone first: Members open by default; desktop keeps all open) */
var DEFOPEN={'team-members':1};
[].forEach.call(G.querySelectorAll('.mc-p'),function(s){var id=s.id.replace(/^p-/,''),h=s.querySelector('.mc-ph'),bd=s.querySelector('.mc-pb');if(!h||!bd)return;
 /* Warm List (launch.js) and Ping Log already have their own collapse */if(id==='warm'||h.querySelector('button,[role=button],.lc-ch'))return;
 var b=el('button','nx-tog');b.type='button';b.setAttribute('aria-controls',bd.id=bd.id||('pb-'+id));b.appendChild(el('span','nx-chev'));var lab=el('span','nx-sr');b.appendChild(lab);
 h.appendChild(b);h.classList.add('nx-h');
 function set(open,save){s.classList.toggle('nx-shut',!open);b.setAttribute('aria-expanded',String(open));lab.textContent=(open?'Collapse ':'Expand ')+s.querySelector('h2').textContent;if(save){var o=st();o[id]=open?1:0;put(o)}}
 s._nxset=set;
 function init(){var o=st();set(phone&&phone.matches?(id in o?!!o[id]:!!DEFOPEN[id]):true,false)}
 init();if(phone)(phone.addEventListener?phone.addEventListener('change',init):phone.addListener(init));
 function tog(e){if(e&&e.target.closest&&e.target.closest('a,input,select,textarea,.mc-ph button:not(.nx-tog)'))return;if(!(phone&&phone.matches)&&e&&e.currentTarget!==b)return;set(s.classList.contains('nx-shut'),true)}
 b.addEventListener('click',function(e){e.stopPropagation();set(s.classList.contains('nx-shut'),true)});
 h.addEventListener('click',function(e){if(e.target===b||b.contains(e.target))return;if(phone&&phone.matches)tog(e)});
});
/* inline detail folds that replace the separate sub-boards */
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
window.__nx={v:'uk11p'};
})();

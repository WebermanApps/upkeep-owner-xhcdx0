/* Command Center v2 PREVIEW (simplicity-first). Example data only. Uses ccm.js (same demo data + Detroit-time logic). */
(function(){'use strict';
var C=window.CCM;if(!C)return;var el=C.el,chip=C.chip,money=C.money;
function tc(s){return String(s).split(' ').map(function(w){return /^[a-z]/.test(w)?w[0].toUpperCase()+w.slice(1):w}).join(' ')}
var M={};try{M=JSON.parse(document.getElementById('mc-data').textContent)}catch(_){}
var T=function(id){return (M.teams||[]).filter(function(x){return x.id===id})[0]||{stats:[],folds:[],needs:[],main:{rows:[]}}};
document.getElementById('v2-date').textContent=new Date().toLocaleDateString('en-US',{timeZone:'America/Detroit',weekday:'long',month:'long',day:'numeric',year:'numeric'});
var main=document.getElementById('v2-main');
function section(id,title,sub){var s=el('section','v2-sec');s.id='s-'+id;var h=el('div','v2-sh mc-ph'),t=el('div');t.appendChild(el('h2',null,title));if(sub)t.appendChild(el('p',null,sub));h.appendChild(t);s.appendChild(h);var b=el('div','v2-sb mc-pb');s.appendChild(b);main.appendChild(s);return b}
function tiles(b,list){var g=el('div','ccm-tiles');list.forEach(function(x){var t=el('button','ccm-tile'+(x[3]?' lv-'+x[3]:''));t.type='button';t.append(el('b',null,x[1]),el('span',null,x[0]));if(x[2])t.appendChild(el('small',null,x[2]));if(x[4])t.onclick=x[4];else t.disabled=true;g.appendChild(t)});b.appendChild(g);return g}
function drop(b,title,n,tone,fill,open,key){var d=el('details','v2-drop'+(tone?' lv-'+tone:''));if(open)d.open=true;if(key){try{d.open=localStorage.getItem(key)==='1'}catch(_){}d.addEventListener('toggle',function(){try{localStorage.setItem(key,d.open?'1':'0')}catch(_){}})}var s=el('summary');s.appendChild(el('b',null,tc(title)));if(n!=null)s.appendChild(el('span','ccm-badge',String(n)));d.appendChild(s);var x=el('div');fill(x);d.appendChild(x);b.appendChild(d);return d}
function rowsList(list){var u=el('ul','v2-rows');list.forEach(function(r){var li=el('li'),s=el('span');s.appendChild(el('b',null,tc(r.t)));if(r.s)s.appendChild(el('small',null,r.s));li.appendChild(s);if(r.r)li.appendChild(el('em',null,r.r));u.appendChild(li)});return u}
function bars(list){var w=el('div','v2-bars');list.forEach(function(br){var r=el('div','v2-bar'),i=el('i'),u=el('u');u.style.width=Math.min(100,br.v/br.max*100)+'%';i.appendChild(u);r.append(el('span',null,br.t),i,el('em',null,br.r));w.appendChild(r)});return w}
/* Members */
var b=section('members','Members','20 demo members');C.members(b);
var mt=T('members');if(mt.needs.length)drop(b,'Needs Machan',mt.needs.length,'yellow',function(x){x.appendChild(rowsList(mt.needs))},false,'ccm-need-members');
/* Scheduling */
b=section('scheduling','Scheduling','Day boundaries in Detroit Time');C.scheduling(b);
var sr=T('scheduling').main.rows||[];drop(b,'Scheduling Requests',sr.length,sr.length?'yellow':'green',function(x){x.appendChild(sr.length?rowsList(sr):el('p','ccm-quiet','No requests.'))});var pcal=b.querySelector('.ccm-pcal'),srd=b.lastChild;if(pcal)pcal.parentNode.insertBefore(srd,pcal);
/* Technicians */
b=section('technicians','Technicians','Ethan \u00b7 Van 1');var V=C.D.visits,techs=['Ethan'];
var vt=V.filter(function(v){return v.off===0}),wk=V.filter(function(v){return v.off>=0&&v.off<=C.WEEKEND}),mo=V.filter(function(v){return v.date.slice(0,7)===new Date().toISOString().slice(0,7)&&v.status==='Done'});
var certs=(T('technicians').folds||[]).filter(function(f){return /cert/i.test(f.h)})[0],train=(T('technicians').folds||[]).filter(function(f){return /training/i.test(f.h)})[0];
tiles(b,[['Techs On Duty','1','Ethan \u00b7 Van 1','green'],['Visits Today',String(vt.length),'Ethan',null,function(){C.visitSubset('Visits Today','Ethan',vt)}],['This Week',String(wk.length),'through Saturday',null,function(){C.visitSubset('This Week','Ethan',wk)}],['Certs Coming Up',String(certs?certs.n:0),'next 12 months',null,function(){var o=C.overlay('Certifications Coming Up','Renewals and bookings');o.appendChild(rowsList(certs?certs.rows:[]));C.label(o)}]]);
b.appendChild(el('h4','v2-h','Week Load'));b.appendChild(bars(techs.map(function(t){var n=wk.filter(function(v){return v.tech===t}).length;return {t:t,v:n,max:Math.max(15,n),r:n+' visits'}})));
b.appendChild(el('h4','v2-h','Time Split'));b.appendChild(bars([{t:'Road + Houses',v:32,max:40,r:'32 hr \u00b7 80%'},{t:'Storage Unit',v:8,max:40,r:'8 hr \u00b7 20%'}]));b.appendChild(el('p','ccm-quiet','Ethan \u00b7 hourly $25 \u00b7 40 hr/wk Mon\u2013Fri'));
if(train)drop(b,'Training Week',null,null,function(x){x.appendChild(bars(train.bars))});
/* Tools & Equipment */
b=section('tools','Tools & Equipment','At The Shop, vans and orders');var g=M.gear||{vans:[],shop:[],shop_full:[]};var vans={};g.vans.forEach(function(x){(vans[x.van]=vans[x.van]||[]).push(x)});
var sf=g.shop_full||[],shopLow=sf.filter(function(x){return x.st==='Low'}).length;
var boxes=[['At The Shop',String(shopLow),shopLow?'low \u00b7 Inventory':'all good \u00b7 Inventory',shopLow?'yellow':'green',function(){C.stock('At The Shop','Inventory \u00b7 everything stored at the shop',sf)}]];
Object.keys(vans).sort().forEach(function(k){var L=vans[k],lo=L.filter(function(x){return x.st==='Below min'}).length;boxes.push(['Van '+k,lo?String(lo):'Full',lo?'below minimum':L.length+' lines \u00b7 Day One list',lo?'red':'green',function(){C.stock('Van '+k,'Ethan \u00b7 everything on the van',L.map(function(x){return {item:x.item,cat:x.cat,qty:x.on,min:x.min,loc:'Van '+k,st:x.st==='Below min'?'Low':'OK'}}))}])});
tiles(b,boxes);var ob=el('div','v2-orders');b.appendChild(ob);C.orders(ob);
b.appendChild(el('h4','v2-h','Needs Attention'));var na=[];g.vans.filter(function(x){return x.st==='Below min'}).forEach(function(x){na.push({t:x.item,s:'Van '+x.van+' \u00b7 '+x.on+' on hand, min '+x.min,r:'Red'})});sf.filter(function(x){return x.st==='Low'}).forEach(function(x){na.push({t:x.item,s:'At The Shop \u00b7 '+x.qty+' on hand, min '+x.min,r:'Yellow'})});(T('tools-equipment').needs||[]).forEach(function(n){na.push({t:n.t,s:n.s,r:'Decision'})});
b.appendChild(rowsList(na));
(T('tools-equipment').folds||[]).filter(function(f){return f.rows&&f.rows.length}).forEach(function(f){drop(b,f.h,f.rows.length,null,function(x){x.appendChild(rowsList(f.rows))})});
/* Financial */
b=section('financial','Financial','Example numbers for 20 demo members');C.financial(b);
/* Warm List */
if(window.WARM){b=section('warm','Warm List','Founding homes we know personally');var wc=el('span','wl-count');b.parentNode.querySelector('.v2-sh').appendChild(wc);WARM.render(b,{count:wc})}
/* Marketing */
b=section('marketing','Marketing','Early placeholders, not live');tiles(b,[['Reach','\u2014','not tracking yet'],['Click Rate','\u2014','not tracking yet'],['Leads','\u2014','not tracking yet'],['Spend','\u2014','not tracking yet']]);
b.appendChild(el('p','ccm-quiet','Campaigns start after the welcome deck is approved.'));
/* Projects: Routines + Document Center */
b=section('projects','Projects','Routines and documents');drop(b,'Routines',0,null,function(x){x.appendChild(el('p','ccm-quiet','No routines yet.'))});drop(b,'Document Center',0,null,function(x){x.appendChild(el('p','ccm-quiet','Team documents live on each board (Members has its welcome docs).'))});
/* Ping Log */
var pl=document.getElementById('v2-ping');var pb=pl.querySelector('.mc-pb');C.pinglog(pb,pl);
})();

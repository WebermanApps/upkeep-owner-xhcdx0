/* Warm List tracker. Seed from the locked #warm-data block; edits saved in localStorage (this browser only). */
(function(){'use strict';
var SEED;try{SEED=JSON.parse(document.getElementById('warm-data').textContent)}catch(_){return}
var LS='ccm-warm-v1',GOAL=SEED.goal||25,ST=['Not Sent','Sent','Interested','Booked Scan','Member'],CT=['Intro Video','Carousel','Founding Offer','Free Home Check Link','Mailer'],SH={'Intro Video':'Video','Founding Offer':'Offer','Free Home Check Link':'Check Link'};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function load(){try{var s=JSON.parse(localStorage.getItem(LS));if(s&&s.homes)return s}catch(_){}return {homes:SEED.homes.map(function(h){return {id:h.id,name:h.name,rel:h.rel,city:h.city,status:'Not Sent',sent:[],next:''}})}}
var S=load();function save(){try{localStorage.setItem(LS,JSON.stringify(S))}catch(_){}redraw()}
var views=[];function redraw(){views.forEach(function(f){f()})}
function idx(s){return ST.indexOf(s)}
function chipCls(s){return s==='Member'?'ok':s==='Booked Scan'?'info':s==='Interested'?'warn':s==='Sent'?'':'mute'}
function popup(title,L){var C=window.CCM;if(!C)return;var b=C.overlay(title,L.length+' homes');C.table(b,L,[['Name','name'],['Relationship','rel'],['Home','city'],['Content Sent','sentTxt'],['Status','status'],['Next Step','next']],{sort:'name',ph:'Search homes'});b.appendChild(el('p','ccm-ex','Private list \u00b7 edits saved in this browser only'))}
function render(host,opts){opts=opts||{};
 function draw(){host.textContent='';var H=S.homes;H.forEach(function(h){h.sentTxt=h.sent.join(', ')});
  var cnt=function(s){return H.filter(function(h){return idx(h.status)>=idx(s)})};
  var g=el('div','ccm-tiles wl-tiles');[['Sent','Sent'],['Interested','Interested'],['Booked Scan','Booked Scan'],['Member','Member']].forEach(function(x){var L=cnt(x[1]),t=el('button','ccm-tile');t.type='button';t.append(el('b',null,String(L.length)),el('span',null,x[0]),el('small',null,x[1]==='Sent'?'sent or further':x[1]==='Member'?'joined':'reached or further'));t.onclick=function(){popup(x[0],L)};g.appendChild(t)});host.appendChild(g);
  var tw=el('div','ccm-tw wl-tw'),t=el('table','ccm-t wl-t'),th=el('thead'),tr=el('tr');['Name','Relationship','Home','Content Sent','Status','Next Step',''].forEach(function(c){tr.appendChild(el('th',null,c))});th.appendChild(tr);var tb=el('tbody');t.append(th,tb);
  H.forEach(function(h){var r=el('tr');r.appendChild(el('td','wl-nm',h.name));r.appendChild(el('td',null,h.rel));r.appendChild(el('td',null,h.city));
   var c=el('td','wl-ct');CT.forEach(function(k){var on=h.sent.indexOf(k)>=0,b=el('button','wl-c'+(on?' on':''),SH[k]||k);b.title=k;b.type='button';b.setAttribute('aria-pressed',String(on));b.onclick=function(){if(on)h.sent=h.sent.filter(function(x){return x!==k});else{h.sent.push(k);if(h.status==='Not Sent')h.status='Sent'}save()};c.appendChild(b)});r.appendChild(c);
   var sc=el('td'),sel=el('select','wl-st st-'+idx(h.status));sel.setAttribute('aria-label','Status for '+h.name);ST.forEach(function(s){var o=el('option',null,s);o.value=s;if(s===h.status)o.selected=true;sel.appendChild(o)});sel.onchange=function(){h.status=sel.value;save()};sc.appendChild(sel);r.appendChild(sc);
   var nc=el('td'),inp=el('input','wl-next');inp.value=h.next||'';inp.placeholder='Add next step';inp.setAttribute('aria-label','Next step for '+h.name);inp.onchange=function(){h.next=inp.value.trim();save()};nc.appendChild(inp);r.appendChild(nc);
   var dc=el('td'),del=el('button','wl-del','Delete');del.type='button';del.setAttribute('aria-label','Delete '+h.name);del.onclick=function(){if(confirm('Delete '+h.name+' from the Warm List?')){S.homes=S.homes.filter(function(x){return x!==h});save()}};dc.appendChild(del);r.appendChild(dc);tb.appendChild(r)});
  if(!H.length){var er=el('tr'),ec=el('td','ccm-quiet','No homes yet. Add one below.');ec.colSpan=7;er.appendChild(ec);tb.appendChild(er)}
  tw.appendChild(t);var fd=el('details','wl-fold'),fs=el('summary');fs.appendChild(el('span',null,'Home List'));fd.appendChild(fs);try{fd.open=localStorage.getItem('ccm-warm-open')==='1'}catch(_){}fd.addEventListener('toggle',function(){try{localStorage.setItem('ccm-warm-open',fd.open?'1':'0')}catch(_){}});fd.appendChild(tw);host.appendChild(fd);
  var f=el('form','wl-add'),n=el('input'),rl=el('select'),ci=el('input'),ab=el('button',null,'Add Home');n.placeholder='Name';n.required=true;n.setAttribute('aria-label','Name');ci.placeholder='City (or TBD)';ci.setAttribute('aria-label','City');['Family','Known Personally','Friend','Neighbor','Referral','Self'].forEach(function(x){var o=el('option',null,x);rl.appendChild(o)});rl.setAttribute('aria-label','Relationship');ab.type='submit';
  var da=el('button','wl-delall','Delete All');da.type='button';da.onclick=function(){if(S.homes.length&&confirm('Delete all '+S.homes.length+' homes from the Warm List?')){S.homes=[];save()}};
  f.append(n,rl,ci,ab,da);fd.appendChild(f);f.onsubmit=function(e){e.preventDefault();if(!n.value.trim())return;S.homes.push({id:'h'+Date.now(),name:n.value.trim(),rel:rl.value,city:ci.value.trim()||'TBD',status:'Not Sent',sent:[],next:''});save()};
  var rs=el('button','wl-reset','Restore Original List');rs.type='button';rs.onclick=function(){if(confirm('Restore the original 18 homes? Your edits will be cleared.')){localStorage.removeItem(LS);S=load();redraw()}};
  var ft=el('p','ccm-ex','Private list \u00b7 edits saved in this browser only \u00b7 ');ft.appendChild(rs);host.appendChild(ft);
  if(opts.count)opts.count.textContent=H.length+' of '+GOAL+' Homes'}
 draw();views.push(draw)}
window.WARM={render:render};
})();

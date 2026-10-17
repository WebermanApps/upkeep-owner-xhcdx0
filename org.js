/* UpKeep Operator Dash: renders the hub and section pages from org.json. No agent ids or bot wiring here. */
(function(){
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var ROOT=document.documentElement.getAttribute('data-root')||'';
var $=function(i){return document.getElementById(i)};
function sURL(id){return ROOT+'s/?id='+encodeURIComponent(id)}
function basis(b){return '<span class="u-basis b-'+esc(String(b||'').toLowerCase())+'">'+esc(b||'')+'</span>'}
function chip(x){var o=x.status==='real'?(x.owner_agent||x.agent||x.name):(x.owner_agent||'');
 return o?'<span class="u-own"><i>'+esc(o.charAt(0).toUpperCase())+'</i>'+esc(o)+'</span>':'<span class="u-own none"><i></i>No owner yet</span>'}
function spark(t){if(!t||t.length<2)return '<span class="u-spk none" title="No trend data yet">no trend yet</span>';
 var mx=Math.max.apply(0,t),mn=Math.min.apply(0,t),r=(mx-mn)||1;
 return '<svg class="u-spk" viewBox="0 0 70 20" aria-hidden="true"><polyline fill="none" stroke="currentColor" stroke-width="1.6" points="'+t.map(function(v,i){return (i*70/(t.length-1)).toFixed(1)+','+(18-(v-mn)/r*16).toFixed(1)}).join(' ')+'"/></svg>'}
function tile(s){var ph=s.status!=='real',m=(s.kpi&&s.kpi.main)||{};
 return '<a class="u-tile k-'+(s.kind||'owner')+(ph?' ph':'')+'" href="'+sURL(s.id)+'">'+(ph?'<span class="u-chip">Coming soon</span>':'<span class="u-chip live">Live agent</span>')+
  '<span class="u-tn">'+esc(s.name)+'</span><span class="u-num"><b>'+esc(m.value||'-')+'</b> '+basis(m.basis)+'</span><span class="u-nl">'+esc(m.label||'')+'</span>'+spark(s.trend)+chip(s)+'</a>'}
function ocCard(x,o){o=o||{};var ph=x.status!=='real';
 return '<a class="u-card k-'+(o.kind||x.kind||'owner')+(ph?' ph':'')+(o.big?' big':'')+'" href="'+esc(o.url||sURL(x.id))+'">'+(ph?'<span class="u-chip">Coming soon</span>':'<span class="u-chip live">'+esc(o.tag||'Live agent')+'</span>')+
  '<span class="u-nm">'+esc(x.name)+'</span><span class="u-role">'+esc(o.role||'')+'</span>'+(o.noOwner?'':chip(x))+'</a>'}
function hub(d){
 var gr=d.groups||[];
 $('u-kpi').innerHTML=(d.kpis.items||[]).map(function(k){return '<div class="u-k"><span class="u-kl">'+esc(k.label)+'</span><b>'+esc(k.value)+'</b>'+basis(k.basis)+'</div>'}).join('');
 $('u-gb').innerHTML='<a class="u-gbc" href="'+sURL(d.chief.id)+'"><img src="'+ROOT+'smart-upkeep-mark.png" alt=""><span><span class="n">'+esc(d.chief.name)+'</span><br><span class="r">'+esc(d.chief.role)+' · reports to '+esc(d.lead.name)+'</span></span><span class="u-chip">Coming soon</span><span class="a">→</span></a>';
 $('u-jump').innerHTML=gr.map(function(x){return '<a href="#g-'+x.id+'">'+esc(x.name)+'</a>'}).join('');
 $('u-car').innerHTML=d.sections.map(tile).join('');
 $('u-cols').innerHTML=gr.map(function(x){var ss=d.sections.filter(function(s){return s.group===x.id}),live=ss.filter(function(s){return s.status==='real'}).length;
  return '<section class="u-col" id="g-'+x.id+'"><h2>'+esc(x.name)+'</h2><p class="cnt">'+ss.length+' Sections · '+live+' Live</p><div class="u-tiles">'+ss.map(tile).join('')+'</div></section>'}).join('');
 var n=3+d.sections.length+d.shared.length;$('u-ocn').textContent='('+n+')';
 $('u-oc').innerHTML='<div class="oc-lvl"><div class="u-card k-member"><span class="u-chip live">Owner</span><span class="u-nm">'+esc(d.owner.name)+'</span><span class="u-role">'+esc(d.owner.role)+'</span></div></div>'+
  '<div class="oc-lvl">'+ocCard(d.lead,{url:d.lead.url,kind:'lead',role:d.lead.role,tag:'Team lead',noOwner:1})+'</div>'+
  '<div class="oc-lvl">'+ocCard(d.chief,{big:1,role:d.chief.role+' · Reports to '+d.lead.name})+'</div>'+
  '<div class="oc-tree">'+gr.map(function(x){var ss=d.sections.filter(function(s){return s.group===x.id});
   return '<div class="oc-g"><div class="oc-gh">'+esc(x.name)+' <span>'+ss.length+'</span></div><div class="oc-gl">'+ss.map(function(s){return ocCard(s,{role:s.job})}).join('')+'</div></div>'}).join('')+'</div>'+
  '<div class="oc-shared"><h3>Shared from Max\'s team</h3><div class="oc-srow">'+d.shared.map(function(x){return ocCard({name:x.name,status:'real'},{url:x.url,kind:'lead',role:'Shared agent',tag:'Shared',noOwner:1})}).join('')+'</div></div>';
 var cs=function(n){var r=$('u-car');r.scrollBy({left:n*r.clientWidth*0.85,behavior:'smooth'})};$('u-prev').onclick=function(){cs(-1)};$('u-next').onclick=function(){cs(1)};
 fetch(ROOT+'requests.json?t='+Date.now()).then(function(r){return r.json()}).then(function(q){var it=q.items||[],o=it.filter(function(i){return i.status!=='verified'}).length;
  $('u-req-c').textContent=(q.placeholder?'Placeholder · ':'')+o+' open';
  if(it.length)$('u-req-l').innerHTML=it.map(function(i){return '<li>'+esc(i.text)+' · '+esc(i.owner||'')+' · '+esc(i.status||'Open')+'</li>'}).join('')}).catch(function(){});
 fetch('https://webermanapps.github.io/style-swipe/kit/deck-counts.json?t='+Date.now()).then(function(r){return r.json()}).then(function(c){
  var a=(c.agents||{})[d.deck_agent]||{},dd=a.deck_days||{},keys=Object.keys(dd).sort(),today=new Date().toLocaleDateString('en-CA',{timeZone:c.tz||undefined});
  $('u-dk-n').textContent=dd[today]||0;
  $('u-dk-g').innerHTML='<span class="u-tag"><b>'+(a.decks_total||0)+'</b> UpKeep decks all-time</span>'+keys.slice(-5).reverse().map(function(k){return '<span class="u-tag">'+esc(k)+': <b>'+dd[k]+'</b></span>'}).join('');
 }).catch(function(){$('u-dk-g').innerHTML='<span class="u-sub">Deck counts unavailable</span>'});
}
function section(d){
 var id=new URLSearchParams(location.search).get('id')||'',all=[d.chief].concat(d.sections),x=all.filter(function(s){return s.id===id})[0]||d.chief,ph=x.status!=='real';
 document.title=x.name+' · '+(d.title||'UpKeep Operator Dash');
 var want=x.name+' Dashboard';
 var hd=function(){document.querySelectorAll('.mw-cc-title,.mw-bh-title').forEach(function(e){if(e.textContent!==want)e.textContent=want});
  document.querySelectorAll('.mw-cc-desc,.mw-bh-desc').forEach(function(e){var h=esc(x.job||'');if(e.innerHTML!==h)e.innerHTML=h})};
 hd();new MutationObserver(function(){var e=document.querySelector('.mw-bh-title')||document.querySelector('.mw-cc-title');if(e&&e.textContent!==want)hd()}).observe(document.body,{childList:true,subtree:true,characterData:true});
 $('s-bn').textContent=x.name;
 $('s-bj').textContent=x.job||'';
 $('s-bo').innerHTML=(ph&&!x.owner_agent)?'<div class="u-slot"><span class="u-own none"><i></i>No owner yet</span><button type="button" class="u-assign" disabled title="Placeholder: assigning owners is not wired yet">Assign owner (placeholder)</button></div>':chip(x);
 $('s-tabs').innerHTML=all.map(function(s){return '<a href="'+sURL(s.id)+'"'+(s.id===x.id?' aria-current="page"':'')+'>'+esc(s.name)+'</a>'}).join('');
 var cur=$('s-tabs').querySelector('[aria-current]');if(cur)cur.scrollIntoView({block:'nearest',inline:'center'});
 $('s-kpi').innerHTML=((x.kpi&&x.kpi.tiles)||[]).map(function(k){return '<div class="u-k"><span class="u-kl">'+esc(k.label)+'</span><b>'+esc(k.value)+'</b>'+basis(k.basis)+'</div>'}).join('')||'<div class="u-k"><span class="u-kl">KPIs</span><b>-</b>'+basis('Planned')+'</div>';
 $('s-shows').innerHTML=(x.shows||[]).map(function(s){return '<li>'+esc(s)+'</li>'}).join('');
 $('s-facts').innerHTML=(x.facts||[]).length?x.facts.map(function(s){return '<li>'+esc(s)+'</li>'}).join(''):'<li>No data yet.</li>';
 $('s-links').innerHTML=(x.links||[]).length?x.links.map(function(l){var tag='<span class="u-chip'+(/TEST|Draft|Planned|Prototype/.test(l.tag)?'':' live')+'">'+esc(l.tag||'Link')+'</span>';
  return l.u?'<a class="u-card k-'+(l.k||'owner')+'" href="'+esc(l.u)+'">'+tag+'<span class="u-nm">'+esc(l.t)+'</span><span class="u-open">Open (locked page) →</span></a>':
  '<div class="u-card ph k-'+(l.k||'owner')+'">'+tag+'<span class="u-nm">'+esc(l.t)+'</span><span class="u-role">Link coming from UpKeep</span></div>'}).join(''):'<p class="u-sub">No linked tools yet.</p>';
 if(x.status==='real'&&x.url)$('s-real').innerHTML='<a class="s-ret" href="'+esc(x.url)+'">Open '+esc(x.agent||x.name)+'\'s live board →</a>';
}
fetch(ROOT+'org.json?t='+Date.now()).then(function(r){return r.json()}).then(function(d){if($('s-bn'))section(d);else hub(d)}).catch(function(e){console.warn('org.json',e)});
})();

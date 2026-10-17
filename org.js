/* Renders the UpKeep Owner hub and section pages from org.json. */
(function(){
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var ROOT=document.documentElement.getAttribute('data-root')||'';
function badge(st){return st==='real'?'<span class="u-badge real">Real · live agent</span>':'<span class="u-badge ph">Placeholder · not created yet</span>'}
function href(x){return x.status==='real'&&x.url?x.url:ROOT+'s/?id='+encodeURIComponent(x.id)}
function card(x,o){o=o||{};var k=o.kind||x.kind||'owner',ph=x.status!=='real';
 var u=o.url||href(x);
 return '<a class="u-card k-'+k+(ph?' ph':'')+'" href="'+esc(u)+'">'+badge(x.status)+
  '<span class="u-nm">'+esc(x.name)+'</span><span class="u-role">'+esc(o.role||x.role||('Agent: '+(x.agent||'placeholder')))+'</span>'+
  (x.job?'<span class="u-job">'+esc(x.job)+'</span>':'')+'<span class="u-open">'+(o.cta||'Open dashboard')+' →</span></a>'}
function hub(d){
 var row=document.getElementById('u-row');
 if(row){row.innerHTML=[d.chief].concat(d.sections).map(function(x){return card(x)}).join('');
  var st=function(n){row.scrollBy({left:n*row.clientWidth*0.85,behavior:'smooth'})};
  document.getElementById('u-prev').onclick=function(){st(-1)};document.getElementById('u-next').onclick=function(){st(1)};}
 var oc=document.getElementById('u-oc');if(!oc)return;
 var owner={name:d.owner.name,status:'real',job:'Owner of Smart Upkeep.'};
 oc.innerHTML='<div class="oc-lvl"><div class="u-card k-member"><span class="u-badge real">Owner</span><span class="u-nm">'+esc(d.owner.name)+'</span><span class="u-role">'+esc(d.owner.role)+'</span></div></div>'+
  '<div class="oc-lvl">'+card(d.lead,{kind:'lead',role:d.lead.role,cta:'Open Apps Home'})+'</div>'+
  '<div class="oc-lvl">'+card(d.chief,{role:d.chief.role+' · Agent: placeholder'})+'</div>'+
  '<div class="oc-grid">'+d.sections.map(function(x){return card(x,{cta:x.status==='real'?'Open board':'Open dashboard'})}).join('')+'</div>'+
  '<div class="oc-shared"><h3>Shared from Max\'s team</h3><div class="oc-srow">'+d.shared.map(function(x){return card({name:x.name,status:'real'},{url:x.url,kind:'lead',role:'Shared agent',cta:'Open'})}).join('')+'</div></div>';
}
function section(d){
 var id=new URLSearchParams(location.search).get('id')||'';
 var all=[d.chief].concat(d.sections),x=all.filter(function(s){return s.id===id})[0]||d.chief;
 document.title=x.name+' · UpKeep Owner';
 var set=function(i,h){var e=document.getElementById(i);if(e)e.innerHTML=h};
 set('s-name',esc(x.name)+' Dashboard');set('s-desc','<b>Agent: '+esc(x.status==='real'?(x.agent||x.name):'placeholder')+'</b> · '+esc(x.job||''));
 set('s-badge',badge(x.status));
 set('s-shows',(x.shows||[]).map(function(s){return '<li>'+esc(s)+'</li>'}).join(''));
 set('s-facts',(x.facts||[]).length?(x.facts.map(function(s){return '<li>'+esc(s)+'</li>'}).join('')):'<li>No data yet.</li>');
 set('s-links',(x.links||[]).length?x.links.map(function(l){return '<a class="u-card k-'+(l.k||'owner')+'" href="'+esc(l.u)+'"><span class="u-badge '+(/TEST|Draft|Planned|Prototype/.test(l.tag)?'ph':'real')+'">'+esc(l.tag||'Link')+'</span><span class="u-nm">'+esc(l.t)+'</span><span class="u-open">Open (locked page) →</span></a>'}).join(''):'<p class="u-sub">No linked tools yet.</p>');
 var hd=function(){document.querySelectorAll('.mw-cc-title').forEach(function(e){e.textContent=x.name+' Dashboard'});
 document.querySelectorAll('.mw-cc-desc').forEach(function(e){e.innerHTML='<b>Agent: '+esc(x.status==="real"?(x.agent||x.name):"placeholder")+'</b> · '+esc(x.job||'')+' '+badge(x.status)});};hd();[200,800,2000,4000].forEach(function(ms){setTimeout(hd,ms)});
 if(x.status==='real'&&x.url)set('s-real','<a class="s-ret" href="'+esc(x.url)+'">Open '+esc(x.agent||x.name)+'\'s live board →</a>');
}
fetch(ROOT+'org.json?t='+Date.now()).then(function(r){return r.json()}).then(function(d){
 if(document.getElementById('s-name'))section(d);else hub(d);
}).catch(function(e){console.warn('org.json',e)});
})();

/* UpKeep Command Center: renders boards, top band text and org chart from the inline org-data / requests-data blocks.
   Display only: no network calls, no saved state, no sending. createElement + textContent only. Runs synchronously (not deferred)
   so a later glow block (<!--mw-glow-->, see /workspace/ops/apps-home/glow.py) finds .oc-b/.oc-nm/.oc-t/.gbn/img.gbi. */
(function(){
function blk(i){var e=document.getElementById(i);try{return e?JSON.parse(e.textContent):null}catch(x){return null}}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function $(i){return document.getElementById(i)}
var D=blk('org-data'),R=blk('requests-data')||{items:[]};if(!D)return;
function sURL(id){return 's/?id='+encodeURIComponent(id)}
/* header updated */
var u=Date.parse(D.updated||'');if(u&&$('ah-up')){var dt=new Date(u+7*3600e3),M='Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),h=dt.getUTCHours();
 $('ah-up').textContent='Updated '+M[dt.getUTCMonth()]+' '+dt.getUTCDate()+', '+((h%12)||12)+':'+String(dt.getUTCMinutes()).padStart(2,'0')+' '+(h<12?'AM':'PM')+' ICT'}
/* requested changes (verified strip position) */
var it=R.items||[],open=it.filter(function(x){return x.status!=='verified'&&x.status!=='done'}).length;
if($('vc-c'))$('vc-c').textContent=(R.placeholder?'Placeholder · ':'')+open+' open';
if($('vc-l')){if(it.length)it.forEach(function(x){var li=el('li');li.appendChild(el('span','vc-s',x.text||''));li.appendChild(el('span','vc-o',x.owner?' · '+x.owner:''));$('vc-l').appendChild(li)});
 else $('vc-l').appendChild(el('li',null,'No requested changes yet. This fills in once UpKeep requests are routed here.'))}
/* boards */
var gr=D.groups||[],tabs=$('tabs'),cols=$('cols');
gr.forEach(function(g,gi){var ss=D.sections.filter(function(s){return s.group===g.id});
 var b=el('button',null,g.name.replace(' & Legal',''));b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',gi?'false':'true');b.setAttribute('aria-controls','col-'+g.id);tabs.appendChild(b);
 var c=el('section','col');c.id='col-'+g.id;if(gi)c.hidden=true;c.appendChild(el('h2',null,g.name));
 var live=ss.filter(function(s){return s.status==='real'}).length;c.appendChild(el('p','cm',ss.length+' Sections · '+live+' Live, '+(ss.length-live)+' Placeholder'));
 var p=el('div','panel');p.appendChild(el('div','pk','Choose a section'));var ul=el('ul');
 ss.forEach(function(s){var li=el('li',s.status==='real'?'':'ph'),a=el('a');a.href=sURL(s.id);a.appendChild(el('span','sic'));a.firstChild.setAttribute('aria-hidden','true');
  var n=el('span','snm',s.name);n.appendChild(el('small',null,s.status==='real'?'Live':'Placeholder · Coming soon'));a.appendChild(n);a.appendChild(el('span','op','Open section →'));li.appendChild(a);ul.appendChild(li)});
 p.appendChild(ul);c.appendChild(p);cols.appendChild(c);
 b.addEventListener('click',function(){[].forEach.call(tabs.children,function(x){x.setAttribute('aria-selected',x===b?'true':'false')});[].forEach.call(cols.children,function(x){x.hidden=x!==c})})});
/* org chart */
var oc=$('oc-body'),ch=D.chief||{},n=1+(D.sub_agents||[]).length+D.sections.length;$('oc-n').textContent='('+n+')';
function card(name,role,cls,ph,sec){var b=el('div','oc-b'+(cls?' '+cls:'')+(ph?' ph':''));var nm=el('span','oc-nm',name);if(ph)nm.appendChild(el('span','soon','Placeholder'));b.appendChild(nm);
 b.appendChild(el('span','oc-r',role));b.appendChild(el('span','oc-t',ph?'Coming soon':(sec?'Live section':'Last Activity -')));return b}
oc.appendChild(card(ch.name,(ch.role||'UpKeep Operator')+', reports to '+((D.lead||{}).name||'UpKeep'),'oc-top'));
var grid=el('div','oc-grid');
gr.forEach(function(g){var ss=D.sections.filter(function(s){return s.group===g.id}),d=el('details','oc-g');d.id='oc-'+g.id;d.open=true;
 var sm=el('summary');sm.appendChild(el('span','t',g.name));sm.appendChild(el('span','oc-j',String(ss.length)));sm.appendChild(el('span','ah3-chev'));d.appendChild(sm);
 var ul=el('ul');ss.forEach(function(s){var li=el('li'),a=el('a');a.href=sURL(s.id);a.style.textDecoration='none';a.appendChild(card(s.name,s.status==='real'?'Section · owner '+(s.owner_agent||'UpKeep'):'Section placeholder · reports to '+ch.name,'',s.status!=='real',1));li.appendChild(a);ul.appendChild(li)});
 d.appendChild(ul);grid.appendChild(d)});
oc.appendChild(grid);
oc.appendChild(el('p','oc-dk','Reports directly to '+ch.name));
(D.sub_agents||[]).forEach(function(a){oc.appendChild(card(a.name,(a.role||'Agent')+', reports to '+(a.reports_to||ch.name),'oc-sec'))});
})();

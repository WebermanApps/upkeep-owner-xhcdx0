/* uk11j Command Center: Members tiles + Messages + chat, Scheduling tiles + calendar, Financial tiles, side Ping Log.
   EXAMPLE DATA ONLY (inline #ccm-data). Day boundaries use America/Detroit. Replies stored in localStorage (demo). */
(function(){'use strict';
var D;try{D=JSON.parse(document.getElementById('ccm-data').textContent)}catch(_){return}
var TZ='America/Detroit',LSK='ccm-demo-uk11j',NOW=Date.now();
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function S(){try{return JSON.parse(localStorage.getItem(LSK))||{}}catch(_){return {}}}
function save(s){try{localStorage.setItem(LSK,JSON.stringify(s))}catch(_){}}
/* ---- time ---- */
function parts(d,tz){var o={};new Intl.DateTimeFormat('en-US',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23',weekday:'short'}).formatToParts(d).forEach(function(p){o[p.type]=p.value});return o}
var tp=parts(new Date(NOW),TZ),TODAY=Date.UTC(+tp.year,+tp.month-1,+tp.day),NOWMIN=(+tp.hour)*60+(+tp.minute),DAY=864e5;
function offMin(utcMs){var p=parts(new Date(utcMs),TZ);return (Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute)-utcMs)/6e4} /* Detroit offset, DST aware */
function ymd(off){var d=new Date(TODAY+off*DAY);return d.toISOString().slice(0,10)}
function fmtDay(off,long){var d=new Date(TODAY+off*DAY);return d.toLocaleDateString('en-US',{timeZone:'UTC',weekday:'short',month:'short',day:'numeric',year:long?'numeric':undefined})}
function h12(m){var h=Math.floor(m/60),mi=m%60;return ((h+11)%12+1)+':'+(mi<10?'0':'')+mi+(h<12?' AM':' PM')}
function tmin(t){var a=t.split(':');return a[0]*60+(+a[1])}
function bkk(off,t){var wall=TODAY+off*DAY+tmin(t)*6e4,utc=wall-offMin(wall)*6e4;return new Date(utc).toLocaleString('en-US',{timeZone:'Asia/Bangkok',weekday:'short',hour:'numeric',minute:'2-digit'})}
function timeNode(off,t){var s=el('span','ccm-tm');s.append(el('b',null,h12(tmin(t))),el('i',null,'Detroit Time'),el('small',null,bkk(off,t)+' Bangkok'));return s}
function msgWhen(at){var ms=typeof at==='number'&&Math.abs(at)<1e9?NOW+at*6e4:at,p=parts(new Date(ms),TZ),dd=(Date.UTC(+p.year,+p.month-1,+p.day)-TODAY)/DAY,t=h12((+p.hour)*60+(+p.minute));return (dd===0?'Today':dd===-1?'Yesterday':new Date(TODAY+dd*DAY).toLocaleDateString('en-US',{timeZone:'UTC',month:'short',day:'numeric'}))+' '+t}
function msAt(at){return typeof at==='number'&&Math.abs(at)<1e9?NOW+at*6e4:at}
/* ---- derived ---- */
var dow=(new Date(TODAY).getUTCDay()+6)%7,WEEKEND=6-dow;
D.visits.forEach(function(v){v.date=ymd(v.off);v.tmin=tmin(v.time);
 if(v.off<0)v.status=v.missed?'Missed':'Done';
 else if(v.off===0)v.status=NOWMIN>=v.tmin+v.mins?'Done':NOWMIN>=v.tmin?'In Progress':'Scheduled';
 else v.status=v.resched?'Reschedule Requested':'Scheduled';
 v.sortkey=v.date+' '+v.time});
D.members.forEach(function(m){m.joinDate=ymd(m.join);var n=D.visits.filter(function(v){return v.mid===m.id&&v.status!=='Done'&&v.off>=0})[0];m.next=n?n.date:'';m.nextLabel=n?fmtDay(n.off):'None'});
var MEM={};D.members.forEach(function(m){MEM[m.id]=m});
function convs(){var s=S();return D.convs.map(function(c){var x=JSON.parse(JSON.stringify(c));var add=(s.replies||{})[c.id]||[];x.msgs=x.msgs.concat(add);if((s.answered||{})[c.id])x.open=false;x.last=msAt(x.msgs[x.msgs.length-1].at);return x}).sort(function(a,b){return (b.open-a.open)||(b.last-a.last)})}
function openCount(){return convs().filter(function(c){return c.open}).length}
var curMonth=ymd(0).slice(0,7);
function monthVisits(){return D.visits.filter(function(v){return v.date.slice(0,7)===curMonth})}
function reqs(){return D.reqs.map(function(r){r.date=ymd(r.sent);r.days=-r.sent;return r})}
var money=function(n){return '$'+Math.round(n).toLocaleString('en-US')};
/* ---- overlay ---- */
var ov,ovBox;
function overlay(title,sub){close();ov=el('div','ccm-ov');ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ovBox=el('div','ccm-box');var h=el('div','ccm-oh'),t=el('div');t.append(el('h3',null,title));if(sub)t.append(el('p',null,sub));var x=el('button','ccm-x','\u00d7');x.type='button';x.setAttribute('aria-label','Close');x.onclick=close;h.append(t,x);ovBox.appendChild(h);var b=el('div','ccm-ob');ovBox.appendChild(b);ov.appendChild(ovBox);ov.addEventListener('click',function(e){if(e.target===ov)close()});document.body.appendChild(ov);document.body.classList.add('ccm-lock');x.focus();return b}
function close(){if(ov){ov.remove();ov=null;document.body.classList.remove('ccm-lock')}}
document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
function chip(t,c){return el('span','ccm-chip '+(c||''),t)}
function stCls(s){return /Done|Active|Answered/.test(s)?'ok':/Missed|Resched|Open/.test(s)?'warn':/Progress|Waiting/.test(s)?'info':''}
/* sortable+searchable table; cols:[label,key,render?] */
function table(box,data,cols,o){o=o||{};var st={k:o.sort||null,d:o.dir||1},q='',flt='All';
 var bar=el('div','ccm-bar'),inp=el('input','ccm-q');inp.type='search';inp.placeholder=o.ph||'Search';inp.setAttribute('aria-label','Search');bar.appendChild(inp);
 var chips=null;if(o.filter){chips=el('div','ccm-chips');['All'].concat(o.filter.vals).forEach(function(v){var b=el('button',null,v);b.type='button';b.setAttribute('aria-pressed',String(v==='All'));b.onclick=function(){flt=v;[].forEach.call(chips.children,function(y){y.setAttribute('aria-pressed',String(y===b))});draw()};chips.appendChild(b)});bar.appendChild(chips)}
 var cnt=el('small','ccm-cnt');bar.appendChild(cnt);box.appendChild(bar);
 var wrap=el('div','ccm-tw'),t=el('table','ccm-t'),th=el('thead'),tr=el('tr'),tb=el('tbody');
 cols.forEach(function(c){var x=el('th'),b=el('button',null,c[0]);b.type='button';x.appendChild(b);x._k=c[1];b.onclick=function(){if(st.k===c[1])st.d=-st.d;else{st.k=c[1];st.d=1}draw()};tr.appendChild(x)});th.appendChild(tr);t.append(th,tb);wrap.appendChild(t);box.appendChild(wrap);
 var tm;inp.oninput=function(){clearTimeout(tm);tm=setTimeout(function(){q=inp.value.trim().toLowerCase();draw()},120)};
 function draw(){[].forEach.call(tr.children,function(x){x.setAttribute('aria-sort',x._k===st.k?(st.d>0?'ascending':'descending'):'none')});
  var L=data.filter(function(r){return (flt==='All'||r[o.filter.key]===flt)&&(!q||cols.some(function(c){return String(r[c[1]]==null?'':r[c[1]]).toLowerCase().indexOf(q)>=0}))});
  if(st.k)L.sort(function(a,b){var p=a[st.k],r=b[st.k];var v=(typeof p==='number'&&typeof r==='number')?p-r:String(p).localeCompare(String(r),undefined,{numeric:true});return v*st.d});
  tb.textContent='';var f=document.createDocumentFragment();L.forEach(function(r){var row=el('tr');cols.forEach(function(c){var d=el('td');var v=c[2]?c[2](r):r[c[1]];if(v instanceof Node)d.appendChild(v);else d.textContent=v==null||v===''?'\u2013':v;row.appendChild(d)});if(o.click){row.tabIndex=0;row.className='ck';row.onclick=function(){o.click(r)};row.onkeydown=function(e){if(e.key==='Enter')o.click(r)}}f.appendChild(row)});tb.appendChild(f);
  if(!L.length){var er=el('tr'),ec=el('td','ccm-quiet','Nothing matches.');ec.colSpan=cols.length;er.appendChild(ec);tb.appendChild(er)}
  cnt.textContent=L.length+' of '+data.length}
 draw();return {redraw:draw}}
function label(box){box.appendChild(el('p','ccm-ex',D.label))}
/* ---- lists ---- */
function membersList(){var b=overlay('Active Members',D.members.length+' demo members');
 table(b,D.members,[['Name','name'],['Plan','plan'],['Joined','joinDate',function(r){return fmtDay(r.join,1)}],['Next Visit','next',function(r){return r.nextLabel}],['Status','status',function(r){return chip(r.status,stCls(r.status))}]],{sort:'name',ph:'Search name, plan, area',filter:null});label(b)}
var VCOLS=[['Date','sortkey',function(r){return fmtDay(r.off)}],['Time','tmin',function(r){return timeNode(r.off,r.time)}],['Member','member'],['Tech','tech'],['Type','type'],['Status','status',function(r){return chip(r.status,stCls(r.status))}]];
function visitDetail(v){var b=overlay(v.type,v.member+' \u00b7 '+fmtDay(v.off,1));var dl=el('dl','ccm-dl');
 [['Member',v.member+' ('+v.plan+' plan)'],['Area',v.area],['Tech',v.tech],['Visit Type',v.type],['Date',fmtDay(v.off,1)],['Time',timeNode(v.off,v.time)],['Length',v.mins+' min'],['Status',chip(v.status,stCls(v.status))],['Notes',v.status==='Done'?'Checklist complete. Photos in the Proof Pack.':v.status==='Missed'?'Member not home. Reschedule offered.':v.status==='Reschedule Requested'?'Member asked for a new time.':'Confirmed with member.'],['Visit ID',v.id]].forEach(function(x){dl.append(el('dt',null,x[0]));var d=el('dd');if(x[1] instanceof Node)d.appendChild(x[1]);else d.textContent=x[1];dl.appendChild(d)});b.appendChild(dl);label(b)}
function calendar(box,onDay){var cur=new Date(TODAY);cur.setUTCDate(1);var wrap=el('div','ccm-cal');box.appendChild(wrap);var det=el('div','ccm-day');box.appendChild(det);
 function draw(){wrap.textContent='';var hd=el('div','ccm-calh'),pv=el('button',null,'\u2039'),nx=el('button',null,'\u203a');pv.type=nx.type='button';pv.setAttribute('aria-label','Previous month');nx.setAttribute('aria-label','Next month');
  pv.onclick=function(){cur.setUTCMonth(cur.getUTCMonth()-1);draw()};nx.onclick=function(){cur.setUTCMonth(cur.getUTCMonth()+1);draw()};
  hd.append(pv,el('b',null,cur.toLocaleDateString('en-US',{timeZone:'UTC',month:'long',year:'numeric'})),nx);wrap.appendChild(hd);
  var g=el('div','ccm-calg');['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(function(d){g.appendChild(el('span','dw',d))});
  var first=(cur.getUTCDay()+6)%7;for(var i=0;i<first;i++)g.appendChild(el('span'));
  var y=cur.getUTCFullYear(),m=cur.getUTCMonth(),n=new Date(Date.UTC(y,m+1,0)).getUTCDate();
  for(var d=1;d<=n;d++){(function(d){var key=new Date(Date.UTC(y,m,d)).toISOString().slice(0,10),vs=D.visits.filter(function(v){return v.date===key}),b=el('button','cd'+(key===ymd(0)?' today':''));b.type='button';b.appendChild(el('b',null,d));var dots=el('i');vs.slice(0,4).forEach(function(v){dots.appendChild(el('u',stCls(v.status)))});b.appendChild(dots);b.setAttribute('aria-label',key+': '+vs.length+' visits');b.onclick=function(){show(key,vs)};g.appendChild(b)})(d)}
  wrap.appendChild(g)}
 function show(key,vs){det.textContent='';det.appendChild(el('h4',null,new Date(key+'T00:00Z').toLocaleDateString('en-US',{timeZone:'UTC',weekday:'long',month:'long',day:'numeric'})+' \u00b7 '+vs.length+' visit'+(vs.length===1?'':'s')));
  if(!vs.length){det.appendChild(el('p','ccm-quiet','No visits this day.'));return}
  var u=el('ul','ccm-vl');vs.forEach(function(v){var li=el('li');li.tabIndex=0;li.append(timeNode(v.off,v.time));var s=el('span');s.append(el('b',null,v.member),el('small',null,v.type+' \u00b7 '+v.tech));li.append(s,chip(v.status,stCls(v.status)));li.onclick=function(){visitDetail(v)};u.appendChild(li)});det.appendChild(u)}
 draw();show(ymd(0),D.visits.filter(function(v){return v.date===ymd(0)}))}
function visitsList(){var b=overlay('Visits','All past and upcoming demo visits \u00b7 day boundaries in Detroit Time');calendar(b);b.appendChild(el('h4','ccm-h4','All Visits'));
 table(b,D.visits,VCOLS,{sort:'sortkey',ph:'Search member, tech, type, status',click:visitDetail,filter:{key:'status',vals:['Done','In Progress','Scheduled','Missed','Reschedule Requested']}});label(b)}
function visitSubset(title,sub,L){var b=overlay(title,sub);table(b,L,VCOLS,{sort:'sortkey',click:visitDetail,ph:'Search'});label(b)}
function reqList(){var b=overlay('Pending Requests','Waiting on an existing member to decide');
 table(b,reqs(),[['Member','member'],['Plan','plan'],['Type','type'],['Item','item'],['Price','price',function(r){return money(r.price)}],['Date Sent','date',function(r){return fmtDay(r.sent)}],['Days Waiting','days']],{sort:'days',dir:-1,ph:'Search member or item',filter:{key:'type',vals:['Add-On','Replacement Part','Repair','Upgrade']}});label(b)}
function msgList(){var b=overlay('Messages',openCount()+' open \u00b7 '+D.convs.length+' conversations');b.appendChild(convList(12,true));label(b)}
function convList(lim,inOv){var u=el('ul','ccm-msgs');convs().slice(0,lim).forEach(function(c){var li=el('li'+'');li.className=c.open?'open':'';li.tabIndex=0;li.setAttribute('role','button');var last=c.msgs[c.msgs.length-1];var s=el('span');s.append(el('b',null,c.name),el('small',null,c.plan+' plan \u00b7 '+(last.from==='owner'?'You: ':'')+last.text));li.append(s,el('em',null,msgWhen(last.at)),chip(c.open?'Open':'Answered',c.open?'warn':'ok'));li.onclick=function(){chat(c.id)};li.onkeydown=function(e){if(e.key==='Enter')chat(c.id)};u.appendChild(li)});return u}
function chat(id){var c=convs().filter(function(x){return x.id===id})[0];if(!c)return;var b=overlay(c.name,c.plan+' plan \u00b7 '+c.area);ovBox.classList.add('ccm-chat');
 var top=el('div','ccm-ctop');top.appendChild(chip(c.open?'Awaiting Reply':'Answered',c.open?'warn':'ok'));if(c.home){var a=el('a',null,'Open Home Record');a.href='https://smartupkeep.ai/member/';a.target='_blank';a.rel='noopener';top.appendChild(a)}else top.appendChild(el('span','ccm-quiet','No Home Record yet'));b.appendChild(top);
 var th=el('div','ccm-thread');c.msgs.forEach(function(m){var d=el('div','bub '+(m.from==='owner'?'me':'them'));d.append(el('p',null,m.text),el('small',null,(m.from==='owner'?m.by:c.name)+' \u00b7 '+msgWhen(m.at)));th.appendChild(d)});b.appendChild(th);
 var f=el('form','ccm-reply'),ta=el('textarea');ta.rows=2;ta.placeholder='Write a reply to '+c.name.split(' ')[0];ta.setAttribute('aria-label','Reply');var sb=el('button',null,'Send');sb.type='submit';f.append(ta,sb);b.appendChild(f);
 b.appendChild(el('p','ccm-ex','Demo: replies are saved in this browser only. Nothing is sent to the member.'));
 f.onsubmit=function(e){e.preventDefault();var t=ta.value.trim();if(!t)return;var s=S(),now=Date.now();s.replies=s.replies||{};(s.replies[id]=s.replies[id]||[]).push({from:'owner',by:'Machan',text:t,at:now});s.answered=s.answered||{};s.answered[id]=true;
  (s.pings=s.pings||[]).push({at:now,cat:'Messages',type:'Reply Sent',summary:'Reply to '+c.name+': \u201c'+t.slice(0,80)+'\u201d',member:c.name,sender:'Machan',state:'Answered',local:1});save(s);refresh();chat(id)};
 th.scrollTop=th.scrollHeight;setTimeout(function(){ta.focus()},30)}
/* ---- panels ---- */
var hooks=[];function refresh(){hooks.forEach(function(f){f()})}
function tiles(b,list){var g=el('div','ccm-tiles');list.forEach(function(x){var t=el('button','ccm-tile');t.type='button';t.append(el('b',null,x[1]),el('span',null,x[0]));if(x[2])t.appendChild(el('small',null,x[2]));if(x[3])t.onclick=x[3];else t.disabled=true;g.appendChild(t)});b.appendChild(g);return g}
function members(b){var host=el('div');b.appendChild(host);function draw(){host.textContent='';var act=D.members.filter(function(m){return m.status==='Active'}).length,mv=monthVisits(),oc=openCount(),rq=reqs();
 tiles(host,[['Active Members',String(act),'of '+D.members.length+' members',membersList],['Visits This Month',String(mv.length),mv.filter(function(v){return v.status==='Done'}).length+' done',visitsList],['Messages',String(oc),'open',msgList],['Pending Requests',String(rq.length),money(rq.reduce(function(a,r){return a+r.price},0))+' waiting',reqList]]);
 host.appendChild(el('h4','ccm-h4','Messages'));host.appendChild(convList(12));label(host)}draw();hooks.push(draw)}
function scheduling(b,orig){var host=el('div');b.appendChild(host);var V=D.visits;
 var td=V.filter(function(v){return v.off===0}),tm=V.filter(function(v){return v.off===1}),
 rw=V.filter(function(v){return v.off>=0&&v.off<=WEEKEND&&v.status!=='Done'&&!(v.off===0&&v.status==='In Progress')}),
 nr=V.filter(function(v){return (v.status==='Missed'&&v.off>=-30)||v.status==='Reschedule Requested'});
 tiles(host,[["Today's Visits",td.filter(function(v){return v.status==='Done'}).length+'/'+td.length,'done \u00b7 Detroit day',function(){visitSubset("Today's Visits",fmtDay(0,1)+' \u00b7 Detroit Time',td)}],
  ["Tomorrow's Visits",String(tm.length),fmtDay(1),function(){visitSubset("Tomorrow's Visits",fmtDay(1,1),tm)}],
  ['Remaining This Week',String(rw.length),'through '+fmtDay(WEEKEND),function(){visitSubset('Remaining This Week','Not yet done, through Sunday',rw)}],
  ['Needs Rescheduling',String(nr.length),'missed + requests',function(){visitSubset('Needs Rescheduling','Missed in the last 30 days plus reschedule requests',nr)}]]);
 var cb=el('button','ccm-link','Open Visit Calendar');cb.type='button';cb.onclick=visitsList;host.appendChild(cb);label(host);if(orig)orig()}
function financial(b){var F=D.fin,ch=F.mrr-F.mrr_prev,pct=(ch/F.mrr_prev*100).toFixed(1),burn=F.exp_total,run=(F.cash/burn).toFixed(1);
 b.appendChild(el('p','ccm-ex','Example data \u00b7 '+D.members.length+' demo members \u00b7 this month'));
 tiles(b,[['Monthly Recurring Revenue',money(F.mrr),(ch>=0?'+':'')+money(ch)+' ('+(ch>=0?'+':'')+pct+'%) vs last month'],
  ['Cash Collected vs Billed',money(F.collected)+' / '+money(F.billed),F.failed.length+' failed: '+F.failed.map(function(x){return x.member+' '+money(x.amount)}).join(', ')],
  ['Expenses This Month',money(F.exp_total),F.expenses.slice(0,3).map(function(x){return x[0]+' '+money(x[1])}).join(' \u00b7 ')],
  ['Profit This Month',money(F.profit),Math.round(F.profit/F.collected*100)+'% margin on collected'],
  ['Cost Per Visit',money(F.exp_total/Math.max(1,D.visits.filter(function(v){return v.date.slice(0,7)===ymd(-30).slice(0,7)}).length)),'last month expenses \u00f7 visits'],
  ['Cash On Hand And Runway',money(F.cash),run+' months at full monthly expenses']]).classList.add('fin')}
/* ---- Ping Log ---- */
function pinglog(b,sec){var all=function(){var s=S();return (s.pings||[]).concat(D.pings).map(function(p){var o={};for(var k in p)o[k]=p[k];o.ms=msAt(p.at);return o}).sort(function(a,c){return c.ms-a.ms})};
 var cur='All',q='',lim=80,MAP={Messages:'Messages',Visits:'Visits',Requests:'Requests',Handoffs:'Handoffs'};
 var bar=el('div','ccm-bar'),inp=el('input','ccm-q');inp.type='search';inp.placeholder='Search pings';inp.setAttribute('aria-label','Search pings');var chips=el('div','ccm-chips');
 ['All','Messages','Visits','Requests','Handoffs'].forEach(function(v){var x=el('button',null,v);x.type='button';x.setAttribute('aria-pressed',String(v==='All'));x.onclick=function(){cur=v;lim=80;[].forEach.call(chips.children,function(y){y.setAttribute('aria-pressed',String(y===x))});draw()};chips.appendChild(x)});
 bar.append(chips,inp);var cnt=el('p','ccm-quiet'),list=el('ul','ccm-pl'),more=el('button','ccm-link','Show More');more.type='button';more.onclick=function(){lim+=100;draw()};
 b.append(bar,cnt,list,more,el('p','ccm-ex','Example data \u00b7 newest first \u00b7 times in Detroit Time'));
 var tm;inp.oninput=function(){clearTimeout(tm);tm=setTimeout(function(){q=inp.value.trim().toLowerCase();lim=80;draw()},120)};
 function draw(){var L=all().filter(function(p){return (cur==='All'||p.cat===cur)&&(!q||(p.summary+' '+p.member+' '+p.sender+' '+p.type+' '+p.state).toLowerCase().indexOf(q)>=0)});
  cnt.textContent=L.length+' pings \u00b7 '+L.filter(function(p){return p.state==='Open'||p.state==='Waiting'}).length+' open';list.textContent='';var f=document.createDocumentFragment();
  L.slice(0,lim).forEach(function(p){var li=el('li'),h=el('div');h.append(el('em',null,msgWhen(p.ms)),el('b',null,p.type),chip(p.state,stCls(p.state)));li.append(h,el('p',null,p.summary));li.appendChild(el('small',null,(p.member?p.member+' \u00b7 ':'')+'From '+p.sender));f.appendChild(li)});list.appendChild(f);more.hidden=L.length<=lim}
 draw();hooks.push(draw);
 if(sec){var hd=sec.querySelector('.mc-ph'),tg=el('button','ccm-tog','Show');tg.type='button';tg.setAttribute('aria-expanded','false');hd.appendChild(tg);tg.onclick=function(){var o=sec.classList.toggle('ccm-open');tg.textContent=o?'Hide':'Show';tg.setAttribute('aria-expanded',String(o))}}}
/* ---- Tools & Equipment: Order Approval (example orders; decisions in localStorage) ---- */
var ORD=[{id:'PO-101',item:'Scott Shop Towels (Roll)',qty:6,supplier:'Grainger',cost:42,loc:'Van 3',by:'Tech Dash 3 · Cole',lvl:'Red'},
 {id:'PO-102',item:'MERV 11 Filters 16x25x1 (12-Pack)',qty:2,supplier:'Home Depot Pro',cost:118,loc:'Inventory',by:'Tools & Equipment Agent',lvl:'Yellow'},
 {id:'PO-103',item:'Smoke/CO Alarm Batteries 9V (24)',qty:1,supplier:'Amazon Business',cost:36,loc:'Van 1',by:'Tech Dash 1 · Ana',lvl:'Yellow'},
 {id:'PO-104',item:'GFCI Outlet Tester',qty:1,supplier:'Grainger',cost:29,loc:'Van 2',by:'Tech Dash 2 · Ben',lvl:'Red'},
 {id:'PO-105',item:'Pressure Washer Hose 50 ft',qty:1,supplier:'Home Depot Pro',cost:89,loc:'Inventory',by:'Tools & Equipment Agent',lvl:'Red'}];
function ordState(){var s=S();return s.orders||{}}
function orders(b){var host=el('div','ccm-orders');b.appendChild(host);function draw(){host.textContent='';var st=ordState(),pend=ORD.filter(function(o){return !st[o.id]});
 var box=el('button','ccm-ordbox');box.type='button';var h=el('div');h.append(el('b',null,'Order Approval'),el('span','ccm-badge',String(pend.length)));box.append(h,el('small',null,pend.length?pend.length+' suggested orders waiting \u00b7 '+money(pend.reduce(function(a,o){return a+o.cost},0)):'All caught up'));box.onclick=list;host.appendChild(box)}
 function list(){var b2=overlay('Order Approval','Suggested purchase orders from red and yellow stock items');var tab='Pending',tabs=el('div','ccm-chips'),body=el('div');
  ['Pending','Approved','Rejected'].forEach(function(v){var x=el('button',null,v);x.type='button';x.setAttribute('aria-pressed',String(v===tab));x.onclick=function(){tab=v;[].forEach.call(tabs.children,function(y){y.setAttribute('aria-pressed',String(y===x))});rd()};tabs.appendChild(x)});
  var all=el('button','ccm-link','Approve All');all.type='button';all.onclick=function(){ORD.filter(function(o){return !ordState()[o.id]}).forEach(function(o){decide(o,'Approved')});rd()};
  var bar=el('div','ccm-bar');bar.append(tabs,all);b2.append(bar,body);label(b2);
  function rd(){var st=ordState();var L=ORD.filter(function(o){return (st[o.id]||'Pending')===tab});all.hidden=tab!=='Pending'||!L.length;body.textContent='';
   var w=el('div','ccm-tw'),t=el('table','ccm-t'),th=el('thead'),tr=el('tr');['Item','Qty','Supplier','Est. Cost','For','Requested By',tab==='Pending'?'Decision':'Status'].forEach(function(c){var x=el('th');x.appendChild(el('button',null,c));tr.appendChild(x)});th.appendChild(tr);var tb=el('tbody');t.append(th,tb);
   L.forEach(function(o){var r=el('tr');[[o.item,chip(o.lvl,o.lvl==='Red'?'warn':'info')],o.qty,o.supplier,money(o.cost),o.loc,o.by].forEach(function(v){var d=el('td');if(v instanceof Array){d.append(el('b',null,v[0]),document.createTextNode(' '),v[1])}else d.textContent=v;r.appendChild(d)});
    var d=el('td');if(tab==='Pending'){var a=el('button','ccm-ok','Approve'),j=el('button','ccm-no','Reject');a.type=j.type='button';a.onclick=function(){decide(o,'Approved');rd()};j.onclick=function(){decide(o,'Rejected');rd()};d.append(a,j)}else d.appendChild(chip(tab,tab==='Approved'?'ok':''));r.appendChild(d);tb.appendChild(r)});
   if(!L.length){var er=el('tr'),ec=el('td','ccm-quiet','No '+tab.toLowerCase()+' orders.');ec.colSpan=7;er.appendChild(ec);tb.appendChild(er)}w.appendChild(t);body.appendChild(w)}rd()}
 function decide(o,v){var s=S();s.orders=s.orders||{};s.orders[o.id]=v;(s.pings=s.pings||[]).push({at:Date.now(),cat:'Requests',type:'Order '+v,summary:o.id+' '+o.item+' \u00d7'+o.qty+' for '+o.loc+' \u00b7 '+money(o.cost),member:'',sender:'Machan',state:v==='Approved'?'Done':'Answered',local:1});save(s);refresh()}
 draw();hooks.push(draw)}
window.CCM={members:members,scheduling:scheduling,financial:financial,pinglog:pinglog,orders:orders,tz:TZ};
})();

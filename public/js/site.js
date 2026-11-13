(function(){
"use strict";
document.documentElement.classList.add('js');
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const I={
 check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>',
 x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 star:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
 prev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
 next:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
};
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2600)}
/* win moments: a headline that changes each time, a pop, and a small burst of bits on a right answer; a shake on a miss */
const WIN={scam:['Scam spotted.','Nice catch.','Nothing gets past you.','You saw right through it.'],safe:['Yep, that one’s real.','Good eye. That one’s fine.','Right. Nothing fishy here.'],miss:['Look again.','Not this time.','Tricky one.'],tool:['That’s the one.','Nailed it.','Right tool, right job.'],pro:['Right call.','Smart move.','That’s exactly it.'],use:['Dead on.','You read it right.','Nice measuring.'],call:['Nice and clear.','That’s how it’s done.','Clear as day.'],sort:['Right basket.','Nice sort.','Into the right pile.'],label:['Nice reading.','You cracked the label.','Right on both.'],budget:['Your Saturday works.','Your plan holds up.','You made it work.']};
const say=k=>WIN[k][Math.floor(Math.random()*WIN[k].length)];
const BITS=['var(--accent)','var(--ink)','#9FC2A0','#E9A98B','#8FB0CC'];
function react(fb,big){if(!fb)return;fb.classList.remove('pop');void fb.offsetWidth;fb.classList.add('pop');if(RM||!fb.classList.contains('ok'))return;
  const b=document.createElement('span');b.className='burst';b.setAttribute('aria-hidden','true');const n=big?18:12;let h='';
  for(let i=0;i<n;i++){const a=(-90+(Math.random()*150-75))*Math.PI/180,d=70+Math.random()*(big?110:70);h+=`<i style="--c:${BITS[i%BITS.length]};--x:${(Math.cos(a)*d).toFixed(0)}px;--y:${(Math.sin(a)*d).toFixed(0)}px;--r:${(Math.random()*360-180).toFixed(0)}deg;animation-delay:${(Math.random()*.12).toFixed(2)}s"></i>`}
  b.innerHTML=h;fb.appendChild(b);setTimeout(()=>b.remove(),1300)}
/* finished activities: only these ids are stored on this device (key otf-done); storage may be blocked */
const DONE_KEY='otf-done',ACT={tools:['Tool Time','pracTools'],budget:['Saturday on $25','pracBudget'],scams:['Scam or Safe?','pracScams'],call:['Make the Call','pracCall'],laundry:['Laundry Sort-Out','pracLaundry']},ORDER=['tools','budget','scams','call','laundry'];
const doneMem=new Set();
function doneRead(){try{const a=JSON.parse(localStorage.getItem(DONE_KEY));return Array.isArray(a)?a.filter(x=>x in ACT):[]}catch(e){return []}}
function paintDone(){$$('[data-done]').forEach(c=>c.hidden=!doneMem.has(c.dataset.done))}
doneRead().forEach(x=>doneMem.add(x));paintDone();
function doneSet(id){doneMem.add(id);const a=doneRead();if(!a.includes(id)){a.push(id);try{localStorage.setItem(DONE_KEY,JSON.stringify(a))}catch(e){}}paintDone()}
const PRAC={tools:['Reading a tape measure to the nearest 1/8 inch','Matching the right tool to the job','Knowing when to stop and get an adult'],
 budget:['Paying for needs and promises before wants','Changing your plan when something unexpected happens','Saving a little for next week'],
 scams:['Spotting a rushed deadline','Checking a link before you tap','Telling a trusted adult'],
 call:['Saying who you are and why you’re calling','Picking a time that fits your week','Repeating details back to confirm'],
 laundry:['Sorting darks, lights and towels','Reading a care label before you wash','Picking the right water temperature']};
function pracHide(id){$('#'+ACT[id][1]).hidden=true}
function finish(id){doneSet(id);const el=$('#'+ACT[id][1]),i=ORDER.indexOf(id),nx=ORDER.slice(1).map((_,k)=>ORDER[(i+k+1)%ORDER.length]).find(x=>!doneMem.has(x));
  el.innerHTML=`<div class="pc"><h3>What you practiced</h3><ul class="results">${PRAC[id].map(s=>`<li class="pass">${I.check}<span>${s}</span></li>`).join('')}</ul></div><div class="pbtns"><button class="btn btn-ink" type="button" data-pnext="${nx||'activities'}">${nx?'Next: '+ACT[nx][0]:'See all activities'}</button><a class="btn btn-line" href="#interest">Join the Interest List</a></div>`;countEvent('activity-done/'+id);
  el.hidden=false;toast(`${ACT[id][0]} finished. See what you practiced below.`)}
$$('.practiced').forEach(p=>p.addEventListener('click',e=>{const b=e.target.closest('[data-pnext]');if(b)route('#'+b.dataset.pnext,true)}));
let curView=null,curAct=null;
const hdr=$('#siteHeader');addEventListener('scroll',()=>hdr.classList.toggle('scrolled',scrollY>8),{passive:true});

/* ---------- curriculum ---------- */
const MI={
 home:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
 tech:'<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
 care:'<path d="M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3c-.5 1.7-2 3-4 3s-3.5-1.3-4-3z"/>',
 cook:'<path d="M3 11h14v3a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6zM17 12h4M7 7c0-1.5 1-1.5 1-3M11 7c0-1.5 1-1.5 1-3"/>',
 money:'<rect x="2.5" y="6" width="19" height="13" rx="2.5"/><path d="M16 12.5h2.5M2.5 10h19"/>',
 comm:'<path d="M4 5h16v10H9l-5 4z"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.3 2.4c-.5.2-.8.6-.8 1.1v.5M12 16.5v.5"/>',
 car:'<path d="M4 16V12l2-5h12l2 5v4M4 16h16M4 16v3M20 16v3"/><circle cx="7.5" cy="13.5" r=".9"/><circle cx="16.5" cy="13.5" r=".9"/>'
};
const MODS=[
 {k:'home',t:'Home & tools',man:'manuals/home-tools.html',d:'Using basic hand tools safely and handling the small fixes every home needs.',L:[['Meet your toolbox','What each common hand tool is for, and how to hold it.'],['Small fixes','Tighten a loose handle, hang something level, change a light bulb.'],['When water goes wrong','Find the shutoff valve and what to do first during a leak.']],st:'A practice board with screws, nails, a level and a shutoff valve.',stop:'Breakers, wiring, gas or anything sparking: step back and get an adult or a professional.',g:['Grades 3–8']},
 {k:'tech',t:'Tech & online safety',man:'manuals/tech.html',d:'Troubleshooting devices, protecting accounts and spotting scams before they cost you.',L:[['Restart, update, check','A simple routine that fixes most device problems.'],['Locks that work','Passphrases, two-step sign-in and never sharing a password.'],['Spot the scam','The red flags in fake prizes, account alerts and “new number” texts.']],st:'Sample messages and a practice account to secure.',stop:'Money lost, threats, or someone pressuring you to keep secrets: tell a trusted adult right away.',g:['Grades 3–8']},
 {k:'care',t:'Personal care',man:'manuals/care.html',d:'Daily routines and doing laundry from start to finish.',L:[['Read the label','What wash and dry symbols mean.'],['Run a load','Sort, measure, wash, dry and fold.'],['Everyday routines','Building simple habits that stick.']],st:'A sorting station with real clothes and care labels.',stop:'Ask before using bleach or other strong cleaning products.',g:['Grades 3–8']},
 {k:'cook',t:'Simple cooking',man:'manuals/cook.html',d:'Kitchen safety, following a recipe, making a simple meal, and cleaning up.',L:[['Clean start','Handwashing, a clean surface and safe knife handling.'],['Read a recipe','Measuring, timing and following steps in order.'],['Make it, clean it','A no-stove meal, then cleanup as part of cooking.']],st:'Recipe cards, measuring tools and no-stove ingredients.',stop:'Stovetops and ovens come later, with an adult always present.',g:['Grades 3–8']},
 {k:'money',t:'Money',man:'manuals/money.html',d:'Needs versus wants, comparing prices and building the habit of saving a little.',L:[['Needs and wants','Sorting real purchases and deciding what comes first.'],['Compare and choose','Unit prices, sales and when cheaper isn’t better.'],['Plan and save','A simple plan for spending, and setting some aside.']],st:'A mock store with price tags and a weekly budget.',stop:'Anyone asking for card numbers, passwords or gift cards: stop and check with an adult.',g:['Grades 4–8']},
 {k:'comm',t:'Communication',man:'manuals/comm.html',d:'Introducing yourself, making a call and disagreeing respectfully.',L:[['First impressions','A handshake, eye contact and a clear introduction.'],['Make the call','Planning what to say, then calling to ask or reschedule.'],['Disagree well','Staying calm and respectful when you don’t agree.']],st:'Role-play stations with real-world scripts.',stop:'Any conversation that feels unsafe: walk away and find a trusted adult.',g:['Grades 4–8']},
 {k:'help',t:'Knowing when to ask',man:'manuals/help.html',d:'Recognizing when a job is too big or unsafe, and knowing exactly who to ask.',L:[['Handle, ask or call','Sorting situations by who should handle them.'],['Your people','Naming the adults you can go to at home, school and nearby.'],['Emergencies','When to leave, when to call 911, and what to say.']],st:'Scenario cards drawn from real household situations.',stop:'This one is part of every other topic too.',g:['Grades 3–8']},
 {k:'car',t:'Vehicle basics',later:1,d:'For older students, later on: dashboard lights, tire checks, and what to do if a car breaks down.',L:[['Read the dash','What common warning lights mean.'],['Tire check','Checking pressure and tread, with an adult.'],['Breakdown plan','Getting safe and getting help.']],st:'Coming later.',stop:'All vehicle work happens with an adult. Nothing under the hood without one.',g:['Older students','Preview']}
];
const cxTabs=$('#cxTabs'),cxPanel=$('#cxPanel');
cxTabs.innerHTML=MODS.map((m,i)=>`<button class="cx-tab" role="tab" id="cxt-${m.k}" aria-controls="cxPanel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-i="${i}"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${MI[m.k]}</svg></span><span>${m.t}</span><span class="st">${m.later?'Later':''}</span></button>`).join('');
let cxI=0;
function showMod(i,focus){
  cxI=(i+MODS.length)%MODS.length;const m=MODS[cxI];
  $$('.cx-tab',cxTabs).forEach((b,j)=>{b.setAttribute('aria-selected',String(j===cxI));b.tabIndex=j===cxI?0:-1});
  cxPanel.setAttribute('aria-labelledby','cxt-'+m.k);
  cxPanel.innerHTML=`<div class="cx-head"><div><h3>${m.t}</h3><p>${m.d}</p></div>${m.man?`<a class="btn btn-line btn-sm" href="${m.man}">Read the free manual</a>`:m.later?'<span class="chip soon">Coming later</span>':''}</div>
  <div class="cx-body"><div class="cx-lessons"><span class="label">Lessons</span>${m.L.map((l,j)=>`<div class="lesson"><span class="n">${j+1}</span><b>${l[0]}</b><span class="ds">${l[1]}</span></div>`).join('')}</div>
  <div class="cx-side"><div class="callout"><span class="label">Hands-on practice</span><p>${m.st}</p></div><div class="callout stop"><span class="label">Know when to stop</span><p>${m.stop}</p></div></div></div>
  <div class="cx-foot"><span class="muted" style="font-size:14.5px">${cxI+1} of ${MODS.length}. Schools can pick any topics, in any order.</span><div class="cx-nav"><button class="icon-btn" type="button" data-cx="-1" aria-label="Previous topic">${I.prev}</button><button class="icon-btn" type="button" data-cx="1" aria-label="Next topic">${I.next}</button></div></div>`;
  cxPanel.classList.remove('swap');void cxPanel.offsetWidth;cxPanel.classList.add('swap');
  const tb=$$('.cx-tab',cxTabs)[cxI];
  if(cxTabs.scrollWidth>cxTabs.clientWidth+4)cxTabs.scrollTo({left:tb.offsetLeft-cxTabs.clientWidth/2+tb.offsetWidth/2,behavior:RM?'auto':'smooth'});
  if(focus)tb.focus({preventScroll:true});
}
cxTabs.addEventListener('click',e=>{const b=e.target.closest('.cx-tab');if(b)showMod(+b.dataset.i)});
cxTabs.addEventListener('keydown',e=>{const k=e.key;let n=null;if(k==='ArrowDown'||k==='ArrowRight')n=cxI+1;else if(k==='ArrowUp'||k==='ArrowLeft')n=cxI-1;else if(k==='Home')n=0;else if(k==='End')n=MODS.length-1;if(n!==null){e.preventDefault();showMod(n,true)}});
cxPanel.addEventListener('click',e=>{const b=e.target.closest('[data-cx]');if(b)showMod(cxI+ +b.dataset.cx)});
showMod(0);

/* ---------- session ---------- */
const SEG=[
 {t:'Open',m:5,h:'Start with real life',d:'Students talk about a time they ran into the problem or saw someone handle it. It gets everyone thinking before anyone picks up a tool.'},
 {t:'Show',m:10,h:'Watch it done',d:'A mentor shows the skill step by step, explains why each step matters, and points out common mistakes.'},
 {t:'Practice',m:25,h:'Try it yourself',d:'Students practice in small groups with real tools and materials while mentors help. Mistakes are expected.'},
 {t:'Debrief',m:10,h:'Wrap up',d:'We talk about what was hard, when to stop and ask for help, and who to ask. Everyone takes home a card with the steps.'}
];
const sbar=$('#sbar'),sdet=$('#sdetail');
sbar.innerHTML=SEG.map((s,i)=>`<button class="seg" type="button" data-i="${i}" aria-pressed="${i===2}" style="flex:${s.m}"><span>${s.t}</span><small>${s.m} min</small></button>`).join('');
function showSeg(i){$$('.seg',sbar).forEach((b,j)=>{b.setAttribute('aria-pressed',String(j===i));b.style.flex=j===i?SEG[j].m+8:SEG[j].m});const s=SEG[i];sdet.innerHTML=`<div><span class="label">${s.m} minutes</span><h3>${s.h}</h3></div><p>${s.d}</p>`;sdet.classList.remove('swap');void sdet.offsetWidth;sdet.classList.add('swap')}
sbar.addEventListener('click',e=>{const b=e.target.closest('.seg');if(b)showSeg(+b.dataset.i)});
showSeg(2);

/* ---------- voices ---------- */
/* why-we-started quotes: one at a time, every figure stays stacked in the same cell so the band never changes height.
   Auto-rotation runs only while the band is on screen and restarts its 8 s clock each time the band comes into view, so the first quote you see always gets its full time. It also never flips a quote while the page is still being scrolled: phones hold timers during a scroll and used to fire the change the moment the finger stopped, which looked like the quote changed on scroll. Prev/Next ends auto-rotation. */
const FQ=$$('#vq .fq');let qi=0,qTimer=null,qAuto=!RM,qScroll=0;
function showQ(i){qi=(i+FQ.length)%FQ.length;FQ.forEach((f,j)=>f.classList.toggle('on',j===qi));$('#vqCount').textContent=`${qi+1} of ${FQ.length}`}
function stopQ(){clearTimeout(qTimer);qTimer=null;qAuto=false;$('#vq').setAttribute('aria-live','polite')}/* screen readers hear a quote only after someone taps Prev or Next, never on the timer */
function queueQ(ms){clearTimeout(qTimer);qTimer=setTimeout(tickQ,ms)}
function tickQ(){if(!qAuto)return;if(performance.now()-qScroll<700){queueQ(900);return}if(curView==='home'&&!document.hidden)showQ(qi+1);queueQ(8000)}
$('#vqPrev').addEventListener('click',()=>{stopQ();showQ(qi-1)});$('#vqNext').addEventListener('click',()=>{stopQ();showQ(qi+1)});
addEventListener('scroll',()=>{qScroll=performance.now()},{passive:true});
if(qAuto){if('IntersectionObserver' in window)new IntersectionObserver(es=>{if(es[0].isIntersecting)queueQ(8000);else{clearTimeout(qTimer);qTimer=null}},{threshold:.5}).observe($('#vq'));else queueQ(8000)}

/* ---------- workshops age tabs, story interview row, story commitments ---------- */
const ageTl=$('#ageTabs');
if(ageTl){const tabs=$$('[role=tab]',ageTl),panels=tabs.map(t=>$('#'+t.getAttribute('aria-controls')));
  const pick=(i,f)=>{tabs.forEach((t,j)=>{t.setAttribute('aria-selected',j===i);t.tabIndex=j===i?0:-1;panels[j].classList.toggle('on',j===i)});if(f)tabs[i].focus()};
  ageTl.addEventListener('click',e=>{const t=e.target.closest('[role=tab]');if(t)pick(tabs.indexOf(t))});
  ageTl.addEventListener('keydown',e=>{const c=tabs.indexOf(document.activeElement),n=tabs.length,k={ArrowRight:(c+1)%n,ArrowLeft:(c+n-1)%n,Home:0,End:n-1}[e.key];if(k!==undefined&&c>-1){e.preventDefault();pick(k,1)}})}
const ivRow=$('#ivRow');
if(ivRow){const cs=[...ivRow.children],cnt=$('#ivCount');let ivI=0;
  const cur=()=>{if(ivRow.scrollLeft+ivRow.clientWidth>=ivRow.scrollWidth-4)return cs.length-1;let b=0,d=1e9;cs.forEach((c,j)=>{const x=Math.abs(c.offsetLeft-ivRow.scrollLeft);if(x<d){d=x;b=j}});return b};
  const upd=i=>{ivI=i;cnt.textContent=`${i+1} of ${cs.length}`};
  ivRow.addEventListener('scroll',()=>upd(cur()),{passive:true});
  const go=i=>{i=(i+cs.length)%cs.length;upd(i);ivRow.scrollTo({left:cs[i].offsetLeft,behavior:RM?'auto':'smooth'})};
  $('#ivPrev').addEventListener('click',()=>go(ivI-1));$('#ivNext').addEventListener('click',()=>go(ivI+1))}
// Sideways rows get an arrow just below them: right while more is hidden, left (back to the start) once the end is reached
function edgeArrows(row){if(!row)return;const sx=document.createElement('div'),hint=document.createElement('div');sx.className='sx';hint.className='sx-hint';row.before(sx);sx.append(row,hint);
  const mk=(c,d,go)=>{const b=document.createElement('button');b.type='button';b.className='sx-btn '+c;b.tabIndex=-1;b.setAttribute('aria-hidden','true');
    b.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;b.addEventListener('click',go);hint.append(b)};
  const by=o=>row.scrollTo({left:o,behavior:RM?'auto':'smooth'});
  mk('sx-l','M19 12H5M11 6l-6 6 6 6',()=>by(0));mk('sx-r','M5 12h14M13 6l6 6-6 6',()=>by(row.scrollLeft+row.clientWidth*.8));
  const upd=()=>{const m=row.scrollWidth-row.clientWidth,x=row.scrollLeft;if(m<4)delete sx.dataset.sx;else sx.dataset.sx=x>=m-4?'l':x>4?'m':'r'};
  row.addEventListener('scroll',upd,{passive:true});
  if('ResizeObserver' in window)new ResizeObserver(upd).observe(row);else addEventListener('resize',upd);
  if(document.fonts)document.fonts.ready.then(upd);upd();
  // One peek the first time the row is on screen: slide a little and back so it reads as swipeable
  let touched=false;['pointerdown','wheel','keydown'].forEach(t=>row.addEventListener(t,()=>{touched=true},{passive:true,once:true}));
  if(!RM&&'IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(!es[0].isIntersecting||sx.dataset.sx!=='r')return;io.disconnect();
    setTimeout(()=>{if(touched||row.scrollLeft>4)return;by(Math.min(90,row.scrollWidth-row.clientWidth));setTimeout(()=>{if(!touched)by(0)},650)},500)},{threshold:1});io.observe(row)}}
edgeArrows($('#cxTabs'));
const commits=$('#commits');
if(commits){const mq=matchMedia('(min-width:900px)'),ds=$$('details',commits);
  const sync=()=>ds.forEach((d,i)=>{d.open=mq.matches||i===0;d.firstElementChild.tabIndex=mq.matches?-1:0});
  sync();mq.addEventListener('change',sync);
  commits.addEventListener('click',e=>{if(mq.matches&&e.target.closest('summary'))e.preventDefault()})}

/* ---------- reveal ---------- */
if('IntersectionObserver' in window&&!RM){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px'});$$('.reveal').forEach(r=>{if(r.getBoundingClientRect().top>innerHeight){r.classList.add('pre');io.observe(r)}})}

/* ---------- router ---------- */
const VIEWS=['home','workshops','activities','story','involved'];
/* visit counter: one count per view shown; waits for the GoatCounter script on first load, does nothing if it's blocked */
function countVisit(view){const go=()=>window.goatcounter&&window.goatcounter.count&&window.goatcounter.count({path:'/'+view,title:view});window.goatcounter&&window.goatcounter.count?go():addEventListener('load',go,{once:true})}
/* funnel events for the smoke test: activity finished, sign-up sent (only after Formspree answers OK) */
function countEvent(name){try{window.goatcounter&&window.goatcounter.count&&window.goatcounter.count({path:name,title:name,event:true})}catch(e){}}
function route(hash,push){
  let h=(hash||'').replace(/^#/,'')||'home',view=h,target=null;
  if(!VIEWS.includes(h)){const el=document.getElementById(h);if(el){const v=el.closest('[data-view]');view=v?v.dataset.view:'home';target=el}else{view='home';h='home'}}
  /* each activity is its own screen; #activities is the picker */
  const act=ORDER.includes(h)?h:null;if(act)target=null;
  const first=curView===null,changed=view!==curView;
  $$('[data-view]').forEach(v=>v.hidden=v.dataset.view!==view);
  if(view==='activities'){$('#actPicker').hidden=!!act;$('#actScreens').hidden=!act;$('[data-view="activities"] .phead').hidden=!!act;$('.act-cta').hidden=!!act;$$('#actScreens .activity').forEach(a=>a.hidden=a.id!==act);if(h==='previews')$('#previews').open=true;if(act&&act!==curAct)countVisit('activities/'+act)}
  $$('.nav a:not(.btn)').forEach(a=>a.getAttribute('href')==='#'+view?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
  placeForm(view==='involved'?'#formSlotInvolved':'#formSlotHome');
  if(changed)countVisit(view);
  curView=view;curAct=view==='activities'?act:null;closeMenu();
  if(push){try{history.pushState(null,'','#'+h)}catch(e){}}
  requestAnimationFrame(()=>{
    if(target){$$('.reveal.pre,.stg.pre',target.closest('[data-view]')||document).forEach(r=>r.classList.remove('pre'));const top=Math.max(0,target.getBoundingClientRect().top+scrollY-84);const far=Math.abs(top-scrollY)>innerHeight*2;scrollTo({top,behavior:(RM||changed||far)?'instant':'smooth'});const f=target.matches('details')?target.querySelector('summary'):target.querySelector('h2,h3');if(f){f.tabIndex=-1;f.focus({preventScroll:true})}}
    else{scrollTo({top:0,behavior:'instant'});if(act){const f=$('#'+act+' h2');if(f){f.tabIndex=-1;f.focus({preventScroll:true})}}else if(changed&&!first){const f=$(`[data-view="${view}"] [data-focus]`);f&&f.focus({preventScroll:true})}}
    window.__stgObserve&&window.__stgObserve($(`[data-view="${view}"]`));window.__tick&&window.__tick();
    if(act==='tools')initBench();
    bench&&bench.active(act==='tools');bench&&act==='tools'&&bench.resize();hero&&hero.active(view==='home');
  });
}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const h=a.getAttribute('href');if(h.length<2)return;e.preventDefault();route(h,true)});
addEventListener('popstate',()=>route(location.hash,false));
addEventListener('hashchange',()=>route(location.hash,false));
const nav=$('#nav'),mb=$('#menuBtn');
function closeMenu(){nav.dataset.open='false';mb.setAttribute('aria-expanded','false')}
mb.addEventListener('click',()=>{const o=nav.dataset.open!=='true';nav.dataset.open=String(o);mb.setAttribute('aria-expanded',String(o));if(o)nav.querySelector('a').focus()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.dataset.open==='true'){closeMenu();mb.focus()}});
/* language switcher: one menu open at a time, closes on an outside tap or Escape */
const lang=$('#lang');
lang.addEventListener('toggle',()=>{if(lang.open)closeMenu()});
mb.addEventListener('click',()=>{lang.open=false});
document.addEventListener('click',e=>{if(lang.open&&!lang.contains(e.target))lang.open=false});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lang.open){lang.open=false;lang.querySelector('summary').focus()}});

/* ---------- form ---------- */
const holder=$('#formHolder');
function placeForm(sel){const s=$(sel);if(s&&holder.parentNode!==s)s.appendChild(holder)}
const form=$('#interestForm',holder),done=$('#formDone',holder);
// Styled dropdown over a native select. The select stays (hidden) for the form data, validation and no-script; setting its value updates the button.
function niceSelect(sel){if(!sel)return;
  const opts=[...sel.options].filter(o=>o.value),uid=sel.id+'-dd',wrap=document.createElement('div'),btn=document.createElement('button'),list=document.createElement('div');
  wrap.className='dd';sel.before(wrap);wrap.append(sel,btn,list);sel.classList.add('dd-native');sel.tabIndex=-1;sel.setAttribute('aria-hidden','true');
  const lab=sel.labels&&sel.labels[0];if(lab){lab.id=lab.id||uid+'-lab';lab.removeAttribute('for');lab.addEventListener('click',()=>btn.focus())}
  btn.type='button';btn.className='dd-btn';btn.id=uid+'-btn';btn.setAttribute('aria-haspopup','listbox');btn.setAttribute('aria-expanded','false');
  if(lab)btn.setAttribute('aria-labelledby',lab.id+' '+btn.id);if(sel.hasAttribute('aria-describedby'))btn.setAttribute('aria-describedby',sel.getAttribute('aria-describedby'));
  btn.innerHTML='<span class="dd-val"></span><svg class="dd-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  list.className='dd-list';list.setAttribute('role','listbox');list.tabIndex=-1;list.hidden=true;if(lab)list.setAttribute('aria-labelledby',lab.id);
  opts.forEach((o,i)=>{const r=document.createElement('div');r.className='dd-opt';r.id=uid+'-'+i;r.setAttribute('role','option');
    r.innerHTML='<span></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';r.firstChild.textContent=o.text;
    r.addEventListener('click',()=>pick(i));r.addEventListener('pointermove',()=>act(i,false));list.append(r)});
  const rows=[...list.children],val=btn.firstChild,cur=()=>opts.findIndex(o=>o.value===sel.value);let ai=-1;
  const render=()=>{const i=cur();val.textContent=i<0?sel.options[0].text:opts[i].text;btn.classList.toggle('dd-empty',i<0);rows.forEach((r,j)=>r.setAttribute('aria-selected',j===i?'true':'false'))};
  const act=(i,scroll=true)=>{ai=i;rows.forEach((r,j)=>r.classList.toggle('on',j===i));list.setAttribute('aria-activedescendant',rows[i].id);if(scroll)rows[i].scrollIntoView({block:'nearest'})};
  const open=()=>{if(!list.hidden)return;list.hidden=false;btn.setAttribute('aria-expanded','true');wrap.classList.add('open');
    list.style.maxHeight=Math.min(340,innerHeight-160)+'px';const b=btn.getBoundingClientRect(),h=list.offsetHeight+8;
    wrap.classList.toggle('up',innerHeight-b.bottom<h&&b.top-96>=h);act(Math.max(0,cur()));list.focus({preventScroll:true});
    const lb=list.getBoundingClientRect();if(lb.bottom>innerHeight-8)scrollBy({top:lb.bottom-innerHeight+8,behavior:RM?'auto':'smooth'})};
  const close=f=>{if(list.hidden)return;list.hidden=true;btn.setAttribute('aria-expanded','false');wrap.classList.remove('open','up');if(f)btn.focus()};
  const pick=i=>{sel.value=opts[i].value;sel.dispatchEvent(new Event('change',{bubbles:true}));close(true)};
  const jump=k=>{const n=opts.length;for(let s=1;s<=n;s++){const j=(ai+s)%n;if(opts[j].text.toLowerCase().startsWith(k)){act(j);return}}};
  btn.addEventListener('click',()=>list.hidden?open():close(true));
  btn.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','Enter',' '].includes(e.key)){e.preventDefault();open()}else if(e.key.length===1&&/\S/.test(e.key)){open();jump(e.key.toLowerCase())}});
  list.addEventListener('keydown',e=>{const n=opts.length,k=e.key;
    if(k==='ArrowDown'){e.preventDefault();act(Math.min(ai+1,n-1))}else if(k==='ArrowUp'){e.preventDefault();act(Math.max(ai-1,0))}
    else if(k==='Home'){e.preventDefault();act(0)}else if(k==='End'){e.preventDefault();act(n-1)}
    else if(k==='Enter'||k===' '){e.preventDefault();pick(ai)}else if(k==='Escape'){e.preventDefault();close(true)}else if(k==='Tab')close(true)
    else if(k.length===1&&/\S/.test(k))jump(k.toLowerCase())});
  document.addEventListener('pointerdown',e=>{if(!list.hidden&&!wrap.contains(e.target))close(false)});
  wrap.addEventListener('focusout',e=>{if(e.relatedTarget&&!wrap.contains(e.relatedTarget))close(false)});
  const d=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value');
  Object.defineProperty(sel,'value',{configurable:true,get(){return d.get.call(this)},set(v){d.set.call(this,v);render()}});
  sel.focus=o=>btn.focus(o);sel.addEventListener('change',render);if(sel.form)sel.form.addEventListener('reset',()=>setTimeout(render));
  new MutationObserver(()=>{const v=sel.getAttribute('aria-invalid');v===null?btn.removeAttribute('aria-invalid'):btn.setAttribute('aria-invalid',v)}).observe(sel,{attributes:true,attributeFilter:['aria-invalid']});
  render()}
niceSelect($('#f-role',form));
const LBL={workshops:'Workshops for my students',family:'Family days',mentor:'Volunteering',updates:'Just launch updates'};
const PREF={inperson:'A live workshop at school',online:'Monthly online activities',printables:'Printable packs',kit:'Monthly hands-on kit',unsure:'Not sure yet'};
let tried=false;
function setErr(id,m,inp){$('#'+id,holder).textContent=m;if(inp)inp.setAttribute('aria-invalid',m?'true':'false')}
function validate(){
  const n=$('#f-name',form),em=$('#f-email',form),r=$('#f-role',form),ad=$('#f-adult',form),ints=$$('input[name=interest]:checked',form);let first=null,ok=true;
  const nm=n.value.trim(),ev=em.value.trim();
  if(nm.length<2){setErr('e-name','Enter your name.',n);first=first||n;ok=false}else setErr('e-name','',n);
  if(!ev){setErr('e-email','Enter an email address.',em);first=first||em;ok=false}else if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(ev)){setErr('e-email','Check the email for a typo, like name@school.org.',em);first=first||em;ok=false}else setErr('e-email','',em);
  if(!r.value){setErr('e-role','Select the role that fits best.',r);first=first||r;ok=false}else setErr('e-role','',r);
  if(!ints.length){setErr('e-int','Choose at least one.');first=first||$('input[name=interest]',form);ok=false}else setErr('e-int','');
  const pref=$('input[name=prefer]:checked',form);
  if(!pref){setErr('e-pref','Pick one. “Not sure yet” is fine.');first=first||$('input[name=prefer]',form);ok=false}else setErr('e-pref','');
  if(!ad.checked){setErr('e-adult','The list is for adults. Please confirm you’re 18 or older.',ad);first=first||ad;ok=false}else setErr('e-adult','',ad);
  return {ok,first,data:{Name:nm,Email:ev,Organization:$('#f-org',form).value.trim()||'Not given',Role:r.value||'Not given',Interests:ints.map(i=>LBL[i.value]).join(', ')||'Not given','Best fit':pref?PREF[pref.value]:'Not given'}};
}
['input','change'].forEach(ev=>form.addEventListener(ev,()=>{if(tried)validate()}));
const send=$('#formSend',form),ferr=$('#formErr',form);let sending=false;
form.addEventListener('submit',async e=>{e.preventDefault();if(sending)return;tried=true;ferr.hidden=true;const v=validate();if(!v.ok){v.first.focus();toast('A few fields need attention.');return}
  const fd=new FormData(form);fd.set('interest',v.data.Interests);fd.set('prefer',v.data['Best fit']);fd.set('adult','Yes, 18 or older');
  sending=true;send.disabled=true;send.textContent='Sending…';
  try{const res=await fetch(form.action,{method:'POST',body:fd,headers:{Accept:'application/json'}});if(!res.ok)throw new Error('status '+res.status)}
  catch(err){sending=false;send.disabled=false;send.textContent='Join the Interest List';ferr.hidden=false;toast('That didn’t go through. Try again.');return}
  sending=false;send.disabled=false;send.textContent='Join the Interest List';countEvent('signup-sent');
  $('#formSummary',holder).innerHTML=Object.entries(v.data).map(([k,x])=>`<dt>${k}</dt><dd>${esc(x)}</dd>`).join('');form.hidden=true;done.hidden=false;done.focus();toast('Sent. You’re on the list.')});
$('#formAgain',holder).addEventListener('click',()=>{tried=false;form.reset();ferr.hidden=true;$$('[aria-invalid]',form).forEach(i=>i.removeAttribute('aria-invalid'));$$('.err',form).forEach(x=>x.textContent='');done.hidden=true;form.hidden=false;$('#f-name',form).focus()});
$$('[data-interest]').forEach(b=>b.addEventListener('click',()=>{const cb=$(`input[name=interest][value="${b.dataset.interest}"]`,form);if(cb)cb.checked=true;const r=$('#f-role',form);if(!r.value){if(b.dataset.interest==='family')r.value='Parent or guardian';if(b.dataset.interest==='mentor')r.value='Mentor or volunteer'}
  holder.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});setTimeout(()=>$('#f-name',form).focus({preventScroll:true}),RM?0:450);toast('Added to your interests.')}));

/* ---------- 3D tool models ---------- */
const TOOLS=[
 {id:'hammer',name:'Claw hammer',use:'Drives nails in. The curved claw pulls them out.',grip:'Hold near the end of the handle. Start with light taps.',safe:'Keep your other hand clear and wear eye protection.'},
 {id:'phillips',name:'Phillips screwdriver',use:'Turns screws with a + shaped slot.',grip:'Push in firmly while you turn so it doesn’t slip.',safe:'Righty-tighty, lefty-loosey. Keep your free hand out of its path.'},
 {id:'tape',name:'Tape measure',use:'Measures length, width and height in inches and feet.',grip:'Hook the end on the edge, pull the tape straight.',safe:'Let it roll back slowly. A fast snap-back can pinch fingers.'},
 {id:'wrench',name:'Adjustable wrench',use:'Grips nuts and bolts of different sizes.',grip:'Roll the little wheel until the jaw is snug on the nut.',safe:'Pull toward you rather than pushing, so your knuckles stay safe if it slips.'},
 {id:'flat',name:'Flathead screwdriver',use:'Turns screws with one straight slot.',grip:'Match the blade width to the slot.',safe:'It isn’t a pry bar. Prying can snap the tip.'},
 {id:'level',name:'Level',use:'Shows if something is straight. Bubble centered means level.',grip:'Rest it flat on the top edge of what you’re checking.',safe:'For heavy items like shelves, have a partner hold while you check.'}
];
const T=Object.fromEntries(TOOLS.map(t=>[t.id,t]));
function hasGL(){try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl')))}catch(e){return false}}
function makeTools(THREE){
  const M=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.62,metalness:0},o));
  const steel=()=>M(0xc6ccd2,{metalness:.55,roughness:.32});
  const mesh=(g,m,p,r)=>{const x=new THREE.Mesh(g,m);if(p)x.position.set(...p);if(r)x.rotation.set(...r);x.castShadow=true;x.receiveShadow=true;return x};
  const B=(a,b,c)=>new THREE.BoxGeometry(a,b,c),C=(a,b,h,s=28)=>new THREE.CylinderGeometry(a,b,h,s);
  const RB=(w,h,d,r)=>{const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSize:.02,bevelThickness:.02,bevelSegments:3,curveSegments:10});g.translate(0,0,-d/2);return g};
  const driver=(col,tip)=>{const g=new THREE.Group(),h=M(col,{roughness:.45});
    g.add(mesh(C(.125,.14,.6,32),h,[0,.5,0]));g.add(mesh(new THREE.SphereGeometry(.125,24,12,0,Math.PI*2,0,Math.PI/2),h,[0,.8,0]));
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;g.add(mesh(C(.018,.018,.5,6),M(col,{roughness:.6}),[Math.cos(a)*.128,.5,Math.sin(a)*.128]))}
    g.add(mesh(C(.06,.07,.08),M(0x6b7680,{metalness:.3}),[0,.16,0]));g.add(mesh(C(.03,.03,.85,16),steel(),[0,-.3,0]));
    g.add(tip==='x'?mesh(new THREE.ConeGeometry(.045,.15,4),steel(),[0,-.79,0],[Math.PI,Math.PI/4,0]):mesh(B(.1,.14,.022),steel(),[0,-.78,0]));return g};
  return {
    hammer(){const g=new THREE.Group();g.add(mesh(C(.065,.07,1.3,24),M(0xcfa77d,{roughness:.7}),[0,-.12,0]));g.add(mesh(C(.088,.085,.52,24),M(0x2b3540,{roughness:.85}),[0,-.56,0]));
      g.add(mesh(RB(.5,.16,.16,.04),steel(),[.04,.6,0]));g.add(mesh(C(.095,.1,.14,24),steel(),[.34,.6,0],[0,0,Math.PI/2]));g.add(mesh(B(.3,.07,.12),steel(),[-.3,.65,0],[0,0,.5]));return g},
    phillips(){return driver(0x7fa893,'x')},
    flat(){return driver(0x86a3bf,'f')},
    wrench(){const g=new THREE.Group(),s=steel();g.add(mesh(RB(.17,1.15,.06,.07),s,[0,-.22,0]));g.add(mesh(C(.24,.24,.07,36),s,[0,.48,0],[Math.PI/2,0,0]));
      g.add(mesh(B(.09,.26,.075),s,[-.13,.7,0]));g.add(mesh(B(.09,.2,.075),s,[.14,.67,0]));g.add(mesh(C(.045,.045,.15,16),M(0x2b3540),[0,.24,.02],[0,0,Math.PI/2]));
      g.add(mesh(C(.045,.045,.075,20),M(0xe6e0d4),[0,-.78,0],[Math.PI/2,0,0]));return g},
    tape(){const g=new THREE.Group();g.add(mesh(RB(.72,.72,.26,.16),M(0xe5c27e,{roughness:.45}),[0,.35,0]));g.add(mesh(C(.2,.2,.03,40),M(0x2b3540),[0,.35,.145],[Math.PI/2,0,0]));
      g.add(mesh(C(.07,.07,.04,24),M(0xe5c27e),[0,.35,.16],[Math.PI/2,0,0]));g.add(mesh(B(.13,.85,.012),M(0xf0e2b6,{roughness:.6}),[.24,-.42,.05]));
      for(let i=0;i<8;i++)g.add(mesh(B(i%2?.04:.07,.01,.004),M(0x2b3540),[.21,-.1-i*.1,.058]));g.add(mesh(B(.17,.05,.07),steel(),[.24,-.86,.05]));return g},
    level(){const g=new THREE.Group();g.add(mesh(RB(.24,1.75,.12,.05),M(0x8fb09b,{roughness:.5}),[0,0,0]));g.add(mesh(B(.17,.26,.02),M(0x2b3540),[0,0,.092]));
      g.add(mesh(C(.05,.05,.2,20),M(0xdde9b0,{roughness:.15,emissive:0x2a3010,emissiveIntensity:.2}),[0,0,.115]));g.add(mesh(new THREE.SphereGeometry(.033,14,10),M(0xffffff),[0,0,.16]));
      g.add(mesh(C(.055,.055,.02,24),M(0x2b3540),[0,.72,.094],[Math.PI/2,0,0]));g.add(mesh(C(.055,.055,.02,24),M(0x2b3540),[0,-.72,.094],[Math.PI/2,0,0]));return g}
  };
}
function setupRenderer(THREE,host){const r=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});r.setPixelRatio(Math.min(devicePixelRatio||1,2));r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;r.domElement.setAttribute('aria-hidden','true');host.insertBefore(r.domElement,host.firstChild);return r}

/* ---------- three.js loads only when a 3D scene needs it, so it never blocks the page ---------- */
let threeP=null;
function loadThree(){
  if(window.THREE)return Promise.resolve(window.THREE);
  if(!threeP)threeP=new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.async=true;s.onload=()=>window.THREE?res(window.THREE):rej(new Error('three missing'));s.onerror=()=>rej(new Error('three failed'));document.head.appendChild(s)});
  return threeP}
/* ---------- hero 3D ---------- */
let hero=null;
if(hasGL())loadThree().then(startHero,()=>{});
function startHero(){
  const host=$('#heroStage');if(!window.THREE||!hasGL()||hero)return;
  try{
    const THREE=window.THREE,r=setupRenderer(THREE,host),scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(30,1,.1,100);
    scene.add(new THREE.HemisphereLight(0xfffaf2,0xb8a98e,.78));
    const key=new THREE.DirectionalLight(0xffffff,.85);key.position.set(-4,9,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:1,far:30});key.shadow.radius=6;key.shadow.bias=-.0004;scene.add(key);
    const rim=new THREE.DirectionalLight(0xdfe8f2,.35);rim.position.set(6,4,-4);scene.add(rim);
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShadowMaterial({opacity:.15}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
    const mk=makeTools(THREE),grp=new THREE.Group();scene.add(grp);
    const L=[['hammer',-1.6,-1.1,-.5,.2],['tape',.45,-1.25,0,-.3],['level',2.0,-.4,.15,-.1],['phillips',-2.1,.95,.35,-.4],['wrench',-.35,.85,-.25,.3],['flat',1.25,1.25,.4,.5]];
    const items=L.map(([id,x,z,rz,ry],i)=>{const g=mk[id]();g.rotation.set(-Math.PI/2,0,rz);const w=new THREE.Group();w.add(g);w.position.set(x,id==='tape'?.13:id==='level'?.06:.09,z);w.rotation.y=ry;w.userData={base:w.position.y,i};grp.add(w);return w});
    $('#heroFallback').hidden=true;
    let px=0,py=0,tx=0,ty=0,on=true,run=false;const t0=performance.now();
    const LT={hammer:[-1.15,-2.35],tape:[1.15,-2.3],phillips:[-1.15,0],wrench:[1.15,.05],flat:[-1.15,2.3],level:[1.15,2.25]};
    const dir=new THREE.Vector3(0,.805,.593).normalize(),box=new THREE.Box3(),ctr=new THREE.Vector3(),v3=new THREE.Vector3();
    function fit(){const sv=[grp.rotation.x,grp.rotation.y,grp.rotation.z,grp.position.z];grp.rotation.set(0,0,0);grp.position.z=0;grp.updateMatrixWorld(true);
      box.setFromObject(grp);box.getCenter(ctr);ctr.y=0;
      const pts=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])pts.push(new THREE.Vector3(x,y,z));
      let lo=2,hi=40;for(let k=0;k<28;k++){const d=(lo+hi)/2;cam.position.copy(ctr).addScaledVector(dir,d);cam.lookAt(ctr);cam.updateMatrixWorld(true);cam.updateProjectionMatrix();
        let ok=true;for(const q of pts){v3.copy(q).project(cam);if(Math.abs(v3.x)>.8||Math.abs(v3.y)>.8){ok=false;break}}if(ok)hi=d;else lo=d}
      cam.position.copy(ctr).addScaledVector(dir,hi);cam.lookAt(ctr);cam.updateProjectionMatrix();
      grp.rotation.set(sv[0],sv[1],sv[2]);grp.position.z=sv[3]}
    function size(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.fov=30;const tall=cam.aspect<.85;
      items.forEach((it,i)=>{const id=L[i][0];if(tall){it.position.x=LT[id][0];it.position.z=LT[id][1];it.children[0].rotation.z=L[i][3]*.35}else{it.position.x=L[i][1];it.position.z=L[i][2];it.children[0].rotation.z=L[i][3]}});
      cam.updateProjectionMatrix();fit()}
    size();new ResizeObserver(()=>{size();r.render(scene,cam)}).observe(host);
    host.addEventListener('pointermove',e=>{const b=host.getBoundingClientRect();tx=(e.clientX-b.left)/b.width-.5;ty=(e.clientY-b.top)/b.height-.5;wake()});
    host.addEventListener('pointerleave',()=>{tx=ty=0;wake()});
    function frame(now){if(!on){run=false;return}const t=(now-t0)/1000;px+=(tx-px)*.05;py+=(ty-py)*.05;
      grp.rotation.y=RM?0:Math.sin(t*.2)*.08+px*.18;grp.rotation.x=RM?0:py*.06;
      items.forEach(w=>{const u=w.userData;w.position.y=u.base+(RM?0:Math.max(0,Math.sin(t*.9+u.i*1.1))*.06)});
      r.render(scene,cam);if(!RM)requestAnimationFrame(frame);else run=false}
    function wake(){if(on&&!run){run=true;requestAnimationFrame(frame)}}
    new IntersectionObserver(es=>hero&&hero.active(es[0].isIntersecting&&curView==='home')).observe(host);
    let sc=0;hero={active(v){on=v;if(v)wake()},scroll(p){sc=p;if(RM)return;grp.position.z=p*.5;grp.rotation.z=p*.06;if(!run)r.render(scene,cam)}};hero.active(true);r.render(scene,cam);
  }catch(e){hero=null}
}

/* ---------- Tool Time ---------- */
const JOBS=[
 {task:'Your new bookshelf is 30 inches wide. Will it fit next to your desk?',a:'tape'},
 {task:'A cabinet handle wobbles. Its screw has a + shaped slot.',a:'phillips'},
 {task:'You hung a frame and it looks a little crooked. How can you check?',a:'level'},
 {task:'The nut on a bike seat clamp is loose. What grips it and turns it?',a:'wrench'},
 {task:'With an adult nearby, you’re tapping in a small picture-hanging nail.',a:'hammer'},
 {task:'A toy’s battery cover is held by a screw with one straight slot.',a:'flat'}
];
/* pool of twelve situations; six are dealt each play, two of each answer. bMix is the shuffle the budget pools use too */
const bMix=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const PROP=[
 {s:'The toilet keeps running and water is starting to drip onto the floor.',w:['Bathroom'],a:'ask',why:'Tell an adult right away. They can turn the small valve behind the toilet to stop the water. You can help by finding it and grabbing towels.'},
 {s:'A picture frame in your room is hanging crooked.',w:['Bedroom'],a:'me',why:'You can handle this one. Use the level, nudge the frame until the bubble is centered, and you’re done.'},
 {s:'You smell something like rotten eggs in the kitchen, and the stove is off.',w:['Kitchen','Emergency'],a:'pro',why:'That smell can mean a gas leak. Don’t flip any switches. Get everyone outside, then call 911 or the gas company from outside.'},
 {s:'An outlet near your desk sparked and popped when you plugged in a charger.',w:['Bedroom'],a:'ask',why:'Stop using it and tell an adult. Outlets and wiring are jobs for an adult or an electrician, never a quick fix.'},
 {s:'Your bike seat is loose and slides down when you sit on it.',w:['Garage'],a:'me',why:'You can handle this. Snug the clamp nut with the adjustable wrench, and check that it’s tight before you ride.'},
 {s:'Water is coming through the ceiling during a storm.',w:['Living room','Emergency'],a:'pro',why:'Tell an adult immediately and stay away from outlets or lights near the water. A roof leak needs a professional.'},
 {s:'A kitchen cabinet door hangs loose because one hinge screw backed out.',w:['Kitchen'],a:'me',why:'You can handle this one. Hold the door straight and snug the screw with the Phillips screwdriver. If the screw just spins, tell an adult.'},
 {s:'The batteries in the TV remote died.',w:['Living room'],a:'me',why:'You can handle this. Slide the cover off, match the plus and minus marks, and put the old batteries where your family keeps used ones.'},
 {s:'The kitchen sink drains slowly and smells a little.',w:['Kitchen'],a:'ask',why:'Tell an adult. Drain cleaners are harsh chemicals, and taking the pipe apart is an adult job. You can help by keeping food scraps out of the sink.'},
 {s:'The smoke alarm in the hallway chirps every minute.',w:['Hallway'],a:'ask',why:'Tell an adult today. A chirp means the battery is low, and alarms matter too much to skip. You can help by pointing out which one it is.'},
 {s:'A power line is down in the yard after a storm.',w:['Yard','Emergency'],a:'pro',why:'Stay far away, even if it looks dead. Keep everyone and pets inside, and tell an adult to call 911 or the power company.'},
 {s:'The furnace is banging loudly and the house smells like something burning.',w:['Basement','Emergency'],a:'pro',why:'Tell an adult right away, and get out of the house if the smell is strong. A furnace is a job for a professional, never a quick fix.'}
];
const dealPro=()=>{const by=k=>bMix(PROP.filter(p=>p.a===k)).slice(0,2);return bMix([...by('me'),...by('ask'),...by('pro')])};
let PRO=dealPro();
const PROA={me:['I can handle it','Safe to do myself'],ask:['Get an adult','Stop and tell someone'],pro:['Call the pros','Leave, call for help']};
/* "Use it": tape questions (n = eighths of an inch) and the shelf task */
let uTimer=0;
const gcd=(a,b)=>b?gcd(b,a%b):a,rnd=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const frac=r=>{const g=gcd(r,8);return `${r/g}/${8/g}`},tfmt=n=>`${n>>3}${n%8?' '+frac(n%8):''} in`;
function tapeQs(){return rnd([1,2,3,4,5,6,7]).slice(0,4).map(r=>{const n=(2+Math.floor(Math.random()*9))*8+r,w=n>>3;
  const cand=[w*8+8-r,Math.random()<.5?n+1:n-1,Math.random()<.5?n+8:n-8,n+1,n-1,n+2,n-2],o=[];for(const k of cand)if(k>=8&&k!==n&&!o.includes(k)&&o.length<3)o.push(k);
  return {n,o:rnd([n,...o])}})}
const tilt0=()=>(Math.random()<.5?-1:1)*(4+Math.floor(Math.random()*13)/2);
const useFresh=()=>({ui:0,uq:tapeQs(),uScore:0,uAns:false,sv:tilt0(),sw:false});
const freshTT=()=>({mode:'explore',sel:null,seen:new Set(),mi:0,first:0,tries:0,answered:false,pi:0,pScore:0,pAns:false,dn:new Set(),fin:false,...useFresh()});
let tt=freshTT();
const tray=$('#tray'),side=$('#ttSide');
tray.innerHTML=TOOLS.map(t=>`<button type="button" data-tool="${t.id}">${{hammer:'Hammer',phillips:'Phillips',tape:'Tape measure',wrench:'Wrench',flat:'Flathead',level:'Level'}[t.id]}</button>`).join('');
$('#fb2d').innerHTML=TOOLS.map(t=>`<button type="button" data-tool="${t.id}" aria-label="${t.name}" tabindex="-1"><svg viewBox="0 0 80 200" aria-hidden="true"><use href="#t-${t.id}"/></svg></button>`).join('');
function trayState(){$$('#tray button,#fb2d button').forEach(b=>{b.classList.remove('sel','ok','no');if(tt.mode==='explore'&&tt.sel===b.dataset.tool)b.classList.add('sel');if(tt.mode==='match'&&b.dataset.st)b.classList.add(b.dataset.st)})}
function renderSide(){
  if(tt.mode==='explore'){
    const pr=`<div class="prog" aria-hidden="true">${TOOLS.map(t=>`<i class="${tt.seen.has(t.id)?'done':''}"></i>`).join('')}</div>`;
    if(!tt.sel){side.innerHTML=`<div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><span class="label">${tt.seen.size} of 6 explored</span>${pr}</div><h3>Pick up a tool to learn about it.</h3><p>Click any tool on the wall or in the row below. Check out all six, then try the challenge.</p><div class="push"><button class="btn btn-line btn-sm" type="button" data-go="match">Skip to the challenge</button></div>`;return}
    const t=T[tt.sel];
    side.innerHTML=`<div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><span class="label">${tt.seen.size} of 6 explored</span>${pr}</div><h3>${t.name}</h3><dl class="spec"><div><dt>Used for</dt><dd>${t.use}</dd></div><div><dt>How to hold</dt><dd>${t.grip}</dd></div><div><dt>Safe habit</dt><dd>${t.safe}</dd></div></dl><div class="push">${tt.seen.size===6?'<button class="btn btn-ink" type="button" data-go="match">Start the challenge</button>':'<button class="btn btn-ink btn-sm" type="button" data-nexttool>Next tool</button><button class="btn btn-line btn-sm" type="button" data-go="match">Skip to challenge</button>'}</div>`;
  }else if(tt.mode==='match'){
    if(tt.mi>=JOBS.length){tt.dn.add('match');ttCheck();side.innerHTML=`<span class="label">All jobs matched</span><div class="result"><div class="score">${tt.first}<small> / 6 on the first try</small></div><p>In a workshop, students hold each tool and try it on a practice board with a mentor.</p></div><div class="push"><button class="btn btn-ink" type="button" data-go="pro">Next: Fix or call?</button><button class="btn btn-line btn-sm" type="button" data-replay="match">Play again</button></div>`;return}
    side.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span class="label">Job ${tt.mi+1} of 6</span><div class="prog" aria-hidden="true">${JOBS.map((j,k)=>`<i class="${k<tt.mi?'done':k===tt.mi?'cur':''}"></i>`).join('')}</div></div><h3>${JOBS[tt.mi].task}</h3><div class="fb" id="ttFb"></div><div class="push"><button class="btn btn-ink" type="button" id="ttNext" hidden>${tt.mi===5?'See results':'Next job'}</button></div>`;
  }
}
function setMode(m){
  tt.mode=m;$$('#ttModes .mode').forEach(b=>{const on=b.dataset.mode===m;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1});
  clearTimeout(uTimer);$('#benchWrap').hidden=m==='pro'||m==='use';$('#proWrap').hidden=m!=='pro';$('#useWrap').hidden=m!=='use';
  $$('#tray button,#fb2d button').forEach(b=>delete b.dataset.st);
  $('#wallHint').textContent=m==='explore'?'Click a tool to pick it up':'Choose the tool for the job';
  if(m!=='explore'){tt.sel=null;bench&&bench.select(null)}else bench&&bench.select(tt.sel);
  bench&&bench.mark(null);
  if(m==='pro')renderPro();else if(m==='use')renderUse();else{renderSide();trayState();bench&&bench.resize()}
}
function pick(id){
  if(tt.mode==='explore'){tt.sel=id;tt.seen.add(id);if(tt.seen.size===6){tt.dn.add('explore');ttCheck()}bench&&bench.select(id);renderSide();trayState();return}
  if(tt.mode!=='match'||tt.mi>=JOBS.length||tt.answered)return;
  const j=JOBS[tt.mi],t=T[id],b=$$(`[data-tool="${id}"]`),fb=$('#ttFb');tt.tries++;
  if(id===j.a){tt.answered=true;if(tt.tries===1)tt.first++;b.forEach(x=>x.dataset.st='ok');fb.className='fb ok';fb.innerHTML=`<h4>${say('tool')} The ${t.name.toLowerCase()}.</h4><p>${t.use}</p><p class="hab"><b>Safe habit:</b> ${t.safe}</p>`;react(fb);const n=$('#ttNext');n.hidden=false;n.focus({preventScroll:true});bench&&bench.mark(id,'ok')}
  else{b.forEach(x=>x.dataset.st='no');fb.className='fb no';fb.innerHTML=`<h4>Not quite. Try another tool.</h4><p>The ${t.name.toLowerCase()}: ${t.use.charAt(0).toLowerCase()+t.use.slice(1)}</p>`;react(fb);bench&&bench.mark(id,'no');setTimeout(()=>{b.forEach(x=>{if(x.dataset.st==='no')delete x.dataset.st});trayState()},900)}
  trayState();
}
function renderPro(){
  const sc=$('#proScene'),sd=$('#proSide');
  if(tt.pi>=PRO.length){tt.dn.add('pro');ttCheck();sc.innerHTML=`<span class="label">All situations done</span><p class="sit">Knowing when to stop is a real skill. You just practiced it six times.</p>`;sd.innerHTML=`<span class="label">Your result</span><div class="result"><div class="score">${tt.pScore}<small> / 6</small></div><p>The rule to remember: water spreading, electricity, gas, or anything that feels unsafe means get an adult first.</p></div><div class="push"><button class="btn btn-ink" type="button" data-replay="pro">Play again</button><button class="btn btn-line btn-sm" type="button" data-go="explore">Back to Explore</button></div>`;return}
  const p=PRO[tt.pi];
  sc.innerHTML=`<div class="where">${p.w.map(w=>`<span class="chip">${w}</span>`).join('')}</div><p class="sit">${p.s}</p><div class="choices3" role="group" aria-label="What should you do?">${Object.entries(PROA).map(([k,v])=>`<button type="button" data-pa="${k}">${v[0]}<small>${v[1]}</small></button>`).join('')}</div>`;
  sd.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span class="label">Situation ${tt.pi+1} of 6</span><div class="prog" aria-hidden="true">${PRO.map((x,k)=>`<i class="${k<tt.pi?'done':k===tt.pi?'cur':''}"></i>`).join('')}</div></div><h3>What should you do?</h3><p>Some jobs are yours. Some need an adult. Some need a professional, fast.</p><div class="fb" id="proFb"></div><div class="push"><button class="btn btn-ink" type="button" id="proNext" hidden>${tt.pi===5?'See results':'Next situation'}</button></div>`;
  tt.pAns=false;
}
$('#proWrap').addEventListener('click',e=>{
  const b=e.target.closest('[data-pa]');
  if(b&&!tt.pAns){tt.pAns=true;const p=PRO[tt.pi],right=b.dataset.pa===p.a;if(right)tt.pScore++;
    $$('[data-pa]').forEach(x=>{x.disabled=true;if(x.dataset.pa===p.a)x.classList.add('ok');else if(x===b)x.classList.add('no')});
    const fb=$('#proFb');fb.className='fb '+(right?'ok':'no');fb.innerHTML=`<h4>${right?say('pro'):'Better call: '+PROA[p.a][0].toLowerCase()+'.'}</h4><p>${p.why}</p>`;react(fb);const n=$('#proNext');n.hidden=false;n.focus({preventScroll:true})}
  if(e.target.closest('#proNext')){tt.pi++;renderPro()}
});
/* Use it: zoomed tape (3 inches, ticks every 1/16) with a board edge, and a shelf with a bubble level */
function tapeSvg(n){const S=100,v=n/8,st=Math.max(0,Math.round(v-1.5)),mx=(v-st)*S;let a='',b='',lb='';
  for(let k=0;k<=48;k++){const x=k*S/16,m=k%16===0,d=`M${x} 26v${m?60:k%8===0?47:k%4===0?36:k%2===0?26:17}`;if(m){a+=d;lb+=`<text x="${x}" y="118" text-anchor="middle">${st+k/16}</text>`}else b+=d}
  return `<svg viewBox="-18 0 336 152" role="img" aria-label="Close-up of a tape measure. The edge of a board lines up with a mark on the tape."><rect x="-18" y="24" width="336" height="106" fill="#F2D24B"/><rect x="-18" y="124" width="336" height="6" fill="#D6B52E"/><rect x="-18" y="24" width="336" height="2" fill="#16211C" opacity=".35"/><rect x="${mx}" y="0" width="${318-mx}" height="24" fill="#C99A63"/><rect x="${mx-3}" y="24" width="6" height="104" fill="#B83A2A" opacity=".3"/><path d="M${mx} 0V24" stroke="#B83A2A" stroke-width="3"/><path d="${b}" stroke="#16211C" stroke-width="1.6" fill="none"/><path d="${a}" stroke="#16211C" stroke-width="2.8" fill="none"/><g fill="#16211C" font-family="Geist,system-ui,sans-serif" font-size="28" font-weight="700">${lb}</g><path d="M${mx-8} 151L${mx} 134L${mx+8} 151z" fill="#B83A2A"/></svg>`}
const bubX=v=>Math.max(-14,Math.min(14,v*6)),tiltTxt=v=>v===0?'Level':`${v>0?'Right':'Left'} end up ${Math.abs(v)} degrees`;
const shelfSvg=v=>`<svg viewBox="10 72 300 118" role="img" aria-label="A shelf on a wall bracket with a bubble level on top."><rect x="10" y="72" width="300" height="118" rx="14" fill="#F2E6D3"/><rect x="146" y="128" width="28" height="52" rx="4" fill="#9AA4AB"/><circle cx="160" cy="146" r="2.5" fill="#6B747A"/><circle cx="160" cy="164" r="2.5" fill="#6B747A"/><g id="shelfG" transform="rotate(${-v} 160 128)"><rect x="30" y="122" width="260" height="12" rx="2" fill="#C99A63"/><rect x="30" y="122" width="260" height="3" rx="1.5" fill="#D9B07A"/><rect x="104" y="100" width="112" height="22" rx="4" fill="#2F6450"/><rect x="138" y="104" width="44" height="14" rx="7" fill="#EEF3C9"/><path d="M150 104v14M170 104v14" stroke="#16211C" stroke-width="1.5"/><ellipse id="bub" cx="160" cy="111" rx="6" ry="4" fill="#fff" stroke="#7C8A4A" stroke-width="1" style="transform:translateX(${bubX(v)}px)"/></g><circle cx="160" cy="128" r="5" fill="#16211C"/></svg>`;
function shelfSet(v){$('#shelfG').setAttribute('transform',`rotate(${-v} 160 128)`);$('#bub').style.transform=`translateX(${bubX(v)}px)`;const t=$('#tilt');t.setAttribute('aria-valuetext',tiltTxt(v))}
function renderUse(){
  const sc=$('#useScene'),sd=$('#useSide'),i=tt.ui;clearTimeout(uTimer);
  const pr=`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span class="label">${i<4?`Question ${i+1} of 4`:i===4?'Last task':'All done'}</span><div class="prog" aria-hidden="true">${[0,1,2,3,4].map(k=>`<i class="${k<i?'done':k===i?'cur':''}"></i>`).join('')}</div></div>`;
  if(i<4){const q=tt.uq[i];
    sc.innerHTML=`<p class="uq">Where does the edge of the board land on the tape?</p><div class="tape">${tapeSvg(q.n)}</div><div class="choices3 c4" role="group" aria-label="What length does the tape show?">${q.o.map(k=>`<button type="button" data-ua="${k}">${tfmt(k)}</button>`).join('')}</div>`;
    sd.innerHTML=`${pr}<h3>Read the tape</h3><p>You are looking at 3 inches of tape, zoomed in. Find the big number just before the red line, then count the small marks past it. Each small mark is 1/16 inch.</p><div class="fb" id="useFb"></div><div class="push"><button class="btn btn-ink" type="button" id="useNext" hidden>${i===3?'Next: level the shelf':'Next question'}</button></div>`;tt.uAns=false}
  else if(i===4){const v=tt.sw?0:tt.sv;
    sc.innerHTML=`<p class="uq">Tilt the shelf until the bubble sits between the two lines.</p><div class="tape">${shelfSvg(v)}</div><div class="tilt"><label for="tilt">Tilt the shelf</label><input type="range" id="tilt" min="-12" max="12" step="0.5" value="${v}" aria-valuetext="${tiltTxt(v)}"${tt.sw?' disabled':''}><div class="tilt-ends"><span>Raise left end</span><span>Raise right end</span></div></div>`;
    sd.innerHTML=`${pr}<h3>Level the shelf</h3><p>A bubble level shows which side is higher. The bubble floats to the high side. Move the slider or use the arrow keys, and stop when the bubble sits between the lines.</p><div class="fb${tt.sw?' ok':''}" id="useFb">${tt.sw?'<h4>Level.</h4><p>That’s how you hang a shelf straight.</p>':''}</div><div class="push"><button class="btn btn-ink" type="button" id="useNext"${tt.sw?'':' hidden'}>See results</button></div>`}
  else{tt.dn.add('use');const nm={explore:'Explore',match:'Match the job',pro:'Fix or call?'},rest=['explore','match','pro'].filter(m=>!tt.dn.has(m)).map(m=>nm[m]);
    sc.innerHTML=`<p class="uq">You read the tape and leveled the shelf.</p><div class="tape">${shelfSvg(0)}</div>`;
    sd.innerHTML=`${pr}<h3>Nice work.</h3><div class="result"><div class="score">${tt.uScore}<small> / 4 tape readings right</small></div><p>${rest.length?`To finish Tool Time, also complete ${rest.join(', ').replace(/, ([^,]+)$/,rest.length>1?' and $1':', $1')}.`:'You have now finished every Tool Time mode.'}</p></div><div class="push"><button class="btn btn-line btn-sm" type="button" data-replay="use">Play again</button><button class="btn btn-line btn-sm" type="button" data-go="explore">Back to Explore</button></div>`;ttCheck()}
}
function ttCheck(){if(!tt.fin&&['explore','match','pro','use'].every(m=>tt.dn.has(m))){tt.fin=true;finish('tools')}}
$('#useWrap').addEventListener('click',e=>{
  const b=e.target.closest('[data-ua]');
  if(b&&!tt.uAns){tt.uAns=true;const q=tt.uq[tt.ui],k=+b.dataset.ua,ok=k===q.n,w=q.n>>3,r=q.n%8;if(ok)tt.uScore++;
    $$('[data-ua]').forEach(x=>{x.disabled=true;if(+x.dataset.ua===q.n)x.classList.add('ok');else if(x===b)x.classList.add('no')});
    const fb=$('#useFb');fb.className='fb '+(ok?'ok':'no');fb.innerHTML=`<h4>${ok?say('use')+' It is '+tfmt(q.n)+'.':'Not quite. It is '+tfmt(q.n)+'.'}</h4><p>Start at the ${w} and count the small marks to the red line: ${r*2} of them. That is ${r*2}/16, or ${frac(r)} inch.</p>`;react(fb);const n=$('#useNext');n.hidden=false;n.focus({preventScroll:true})}
  if(e.target.closest('#useNext')){tt.ui++;renderUse()}
});
$('#useWrap').addEventListener('input',e=>{if(e.target.id!=='tilt'||tt.sw)return;const v=+e.target.value;tt.sv=v;shelfSet(v);clearTimeout(uTimer);
  if(Math.abs(v)<=.5)uTimer=setTimeout(()=>{if(tt.ui!==4||tt.sw)return;tt.sw=true;tt.sv=0;const t=$('#tilt');t.value=0;t.disabled=true;shelfSet(0);const fb=$('#useFb');fb.className='fb ok';fb.innerHTML='<h4>Level.</h4><p>That’s how you hang a shelf straight.</p>';const n=$('#useNext');n.hidden=false;n.focus({preventScroll:true})},700)});
$('#ttModes').addEventListener('click',e=>{const b=e.target.closest('.mode');if(b)setMode(b.dataset.mode)});
$('#ttModes').addEventListener('keydown',e=>{const ms=['explore','match','pro','use'];let i=ms.indexOf(tt.mode);if(e.key==='ArrowRight')i++;else if(e.key==='ArrowLeft')i--;else return;e.preventDefault();i=(i+4)%4;setMode(ms[i]);$('#m-'+ms[i]).focus()});
$('#tools').addEventListener('click',e=>{
  const tb=e.target.closest('#tray [data-tool],#fb2d [data-tool]');if(tb){pick(tb.dataset.tool);return}
  const g=e.target.closest('[data-go]');if(g){setMode(g.dataset.go);return}
  const rp=e.target.closest('[data-replay]');if(rp){if(rp.dataset.replay==='match'){tt.mi=0;tt.first=0;tt.tries=0;tt.answered=false}else if(rp.dataset.replay==='use')Object.assign(tt,useFresh());else{tt.pi=0;tt.pScore=0;PRO=dealPro()}setMode(rp.dataset.replay);return}
  if(e.target.closest('[data-nexttool]')){const i=TOOLS.findIndex(t=>t.id===tt.sel);pick(TOOLS[(i+1)%6].id);return}
  if(e.target.closest('#ttNext')){tt.mi++;tt.tries=0;tt.answered=false;$$('#tray button,#fb2d button').forEach(b=>delete b.dataset.st);bench&&bench.mark(null);renderSide();trayState()}
});
tray.addEventListener('pointerover',e=>{const b=e.target.closest('[data-tool]');bench&&bench.hover(b?b.dataset.tool:null)});
tray.addEventListener('pointerleave',()=>bench&&bench.hover(null));
tray.addEventListener('focusin',e=>{const b=e.target.closest('[data-tool]');bench&&bench.hover(b?b.dataset.tool:null)});
tray.addEventListener('focusout',()=>bench&&bench.hover(null));
$('#ttReset').addEventListener('click',()=>{clearTimeout(uTimer);tt=freshTT();pracHide('tools');bench&&bench.select(null);setMode('explore');toast('Tool Time reset.')});

let bench=null,benchTried=false;
function initBench(){
  if(benchTried)return;benchTried=true;
  const flat=()=>$('#wall').classList.add('flat');
  if(!hasGL()){flat();return}
  loadThree().then(()=>{
    try{bench=buildBench()}catch(e){bench=null}
    if(!bench){flat();return}
    const onTools=location.hash.replace('#','')==='tools';bench.active(onTools);if(onTools)bench.resize();
    if(tt.sel)bench.select(tt.sel);
  },flat);
}
function buildBench(){
  const THREE=window.THREE,host=$('#wall'),r=setupRenderer(THREE,host),scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(28,2,.1,100);
  scene.add(new THREE.HemisphereLight(0xfffaf2,0xb8a98e,.82));
  const key=new THREE.DirectionalLight(0xffffff,.7);key.position.set(-3,5,7);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-6,right:6,top:5,bottom:-5,near:1,far:20});key.shadow.radius=5;key.shadow.bias=-.0005;scene.add(key);
  const wall=new THREE.Mesh(new THREE.PlaneGeometry(30,20),new THREE.ShadowMaterial({opacity:.14}));wall.receiveShadow=true;scene.add(wall);
  const mk=makeTools(THREE);
  const tools=TOOLS.map((t,i)=>{const g=mk[t.id]();g.userData={id:t.id,i,lift:0,st:null,shake:0};g.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.userData.e=o.material.emissive.clone()}});scene.add(g);
    const peg=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.3,12),new THREE.MeshStandardMaterial({color:0xb7bec5,metalness:.6,roughness:.3}));peg.rotation.x=Math.PI/2;peg.castShadow=true;scene.add(peg);g.userData.peg=peg;return g});
  let sel=null,hov=null,tagHov=null,on=false,run=false,par={x:0,y:0},pin=false;const t0=performance.now();
  function layout(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;const nar=w<620,cols=nar?3:6,rows=nar?2:1,dx=nar?1.3:1.12,dy=2.2;
    tools.forEach((g,i)=>{const c=i%cols,rr=Math.floor(i/cols);const x=(c-(cols-1)/2)*dx,y=((rows-1)/2-rr)*dy;g.userData.b=[x,y];g.userData.peg.position.set(x,y+.98,.15)});
    r.setSize(w,h,false);cam.aspect=w/h;const bw=cols*dx+.4,bh=rows*dy+.6,f=cam.fov*Math.PI/180;const d=Math.max((bh/2)/Math.tan(f/2),(bw/2)/(Math.tan(f/2)*cam.aspect))*1.02;cam.position.set(0,0,d);cam.lookAt(0,0,0);cam.updateProjectionMatrix()}
  layout();new ResizeObserver(()=>{layout();wake()}).observe(host);
  const ray=new THREE.Raycaster(),v=new THREE.Vector2();
  function hit(e){const b=r.domElement.getBoundingClientRect();v.x=((e.clientX-b.left)/b.width)*2-1;v.y=-((e.clientY-b.top)/b.height)*2+1;ray.setFromCamera(v,cam);const h=ray.intersectObjects(tools,true);if(!h.length)return null;let o=h[0].object;while(o&&!o.userData.id)o=o.parent;return o?o.userData.id:null}
  r.domElement.addEventListener('pointermove',e=>{hov=hit(e);r.domElement.style.cursor=hov?'pointer':'default';const b=r.domElement.getBoundingClientRect();par.x=(e.clientX-b.left)/b.width-.5;par.y=(e.clientY-b.top)/b.height-.5;pin=true;wake()});
  r.domElement.addEventListener('pointerleave',()=>{hov=null;pin=false;wake()});
  let dn=null;r.domElement.addEventListener('pointerdown',e=>dn={x:e.clientX,y:e.clientY});
  r.domElement.addEventListener('pointerup',e=>{if(!dn)return;const m=Math.hypot(e.clientX-dn.x,e.clientY-dn.y);dn=null;if(m>10)return;const id=hit(e);if(id)pick(id)});
  const tmp=new THREE.Color();
  function frame(now){if(!on){run=false;return}const t=(now-t0)/1000;let busy=false;
    cam.position.x+=((pin&&!RM?par.x*.5:0)-cam.position.x)*.06;cam.position.y+=((pin&&!RM?-par.y*.35:0)-cam.position.y)*.06;cam.lookAt(0,0,0);
    tools.forEach((g,i)=>{const u=g.userData,h=hov===u.id||tagHov===u.id,s=sel===u.id;
      const tgt=s?.9:u.st==='ok'?.5:h?.28:0;u.lift+=(tgt-u.lift)*.12;if(Math.abs(tgt-u.lift)>.003)busy=true;
      const sway=RM?0:Math.sin(t*1.1+i*1.3)*.06;
      if(s&&!RM)g.rotation.y=t*.9;else g.rotation.y+=((sway+(h&&!RM?.35:0))-g.rotation.y)*.1;
      let sx=0;if(u.shake>0){u.shake=Math.max(0,u.shake-.04);sx=Math.sin(u.shake*40)*.05*u.shake;busy=true}
      g.position.set(u.b[0]+sx,u.b[1]-u.lift*.1,.22+u.lift);g.scale.setScalar(1+u.lift*.16);
      const em=u.st==='ok'?0x1e5a44:u.st==='no'?0x7a2a1d:(h||s)?0x2a2418:null,k=u.st?.45:(h||s)?.3:0;
      g.traverse(o=>{if(o.isMesh){if(em!==null){tmp.setHex(em).multiplyScalar(k);o.material.emissive.copy(o.userData.e).add(tmp)}else o.material.emissive.copy(o.userData.e)}})});
    r.render(scene,cam);if(!RM||busy)requestAnimationFrame(frame);else run=false}
  function wake(){if(on&&!run){run=true;requestAnimationFrame(frame)}}
  new IntersectionObserver(es=>api.active(es[0].isIntersecting&&curAct==='tools')).observe(host);
  document.addEventListener('visibilitychange',()=>api.active(!document.hidden&&curAct==='tools'));
  const api={active(x){on=x;if(x)wake()},resize(){layout();wake()},select(id){sel=id;wake()},
    hover(id){tagHov=id;$$('#tray button').forEach(b=>b.classList.toggle('is-hover',b.dataset.tool===id));wake()},
    mark(id,st){tools.forEach(g=>{const u=g.userData;if(!id)u.st=null;else if(u.id===id){u.st=st;if(st==='no'){u.shake=1;setTimeout(()=>{if(u.st==='no'){u.st=null;wake()}},900)}}else if(st==='ok')u.st=null});wake()}};
  api.active(true);r.render(scene,cam);return api;
}
setMode('explore');

/* ---------- Budget ---------- */
const BUD=25,PRICE={},BASE={};
/* pools: one promise and four wants are dealt each play, so the Saturday changes */
const PRM=[{id:'promise',n:'Card and small gift',s:'Your sister’s birthday is Sunday',p:8,f:'You promised a birthday gift. Plan for it before wants.'},{id:'promise',n:'Pay Diego back',s:'You borrowed $6 for lunch last week',p:6,f:'You promised to pay Diego back. Plan for it before wants.'},{id:'promise',n:'Chip in for the coach’s gift',s:'The whole team said they would',p:5,f:'You promised to chip in for the coach’s gift. Plan for it before wants.'}];
const WNT=[{id:'movie',n:'Movie ticket',s:'Matinee with friends',p:9},{id:'snack',n:'Movie snacks',s:'Popcorn and a drink',p:6},{id:'arcade',n:'Arcade tokens',s:'About 20 minutes of games',p:5},{id:'case',n:'New phone case',s:'Yours still works fine',p:12},{id:'comic',n:'New comic book',s:'The next one in the series',p:5},{id:'slush',n:'Giant slushie',s:'From the corner store',p:3},{id:'stickers',n:'Skate stickers',s:'A pack of five',p:4}];
const BI={bNeeds:[{id:'bus',n:'Round-trip bus fare',s:'Rec center and back',p:4}],
 bLunch:[{id:'taco',n:'Taco truck lunch',s:'Two tacos and a drink',p:7,r:1},{id:'packed',n:'Packed lunch from home',s:'Sandwich, fruit, water',p:2,r:1}],
 bPromise:[],bWants:[]};
function bDeal(){BI.bPromise=[PRM[Math.floor(Math.random()*PRM.length)]];BI.bWants=bMix(WNT).slice(0,4);Object.keys(PRICE).forEach(k=>delete PRICE[k]);
  Object.entries(BI).forEach(([k,l])=>{$('#'+k).innerHTML=l.map(it=>{PRICE[it.id]=it.p;return `<label class="item"><input type="${it.r?'radio':'checkbox'}" ${it.r?'name="lunch"':''} value="${it.id}" id="b-${it.id}"><span class="nm">${it.n}<small>${it.s}</small></span><span class="pr">$${it.p}</span></label>`}).join('')});
  PRICE.loan=5;Object.keys(BASE).forEach(k=>delete BASE[k]);Object.assign(BASE,PRICE)}
bDeal();
const CB=[{id:'bus',p:5,t:'The bus fare went up $1. Round trip is now $5.'},{id:'movie',p:11,t:'The movie costs $2 more than you thought. The ticket is now $11.'},{id:'arcade',p:3,t:'Good news. Arcade tokens are on sale. They are now $3.'},{id:'loan',t:'A friend asks to borrow $5 and promises to pay you back next week. Lending is your choice. Money you lend is money you can’t spend.'}];
let bq={cb:null};
const bs=()=>{const sel=$$('#budForm input:checked:not([name=save])').map(i=>i.value),sp=sel.reduce((a,i)=>a+PRICE[i],0),sv=+$('#budForm input[name=save]:checked').value;return {sel,sp,sv,left:BUD-sp-sv}};
function bPrices(){$$('#budForm .item:not(.sv)').forEach(l=>{const v=l.querySelector('input').value;l.querySelector('.pr').textContent='$'+PRICE[v];l.classList.toggle('chg',PRICE[v]!==BASE[v])})}
function bRender(){const {sp,sv,left}=bs();$('#bSpent').textContent='$'+sp;$('#bSaveRow').hidden=!sv;$('#bSave').textContent='$'+sv;const l=$('#bLeft');l.textContent=(left<0?'−$':'$')+Math.abs(left);l.style.color=left<0?'var(--bad)':'';$('#bFill').style.width=Math.min(100,(sp+sv)/BUD*100)+'%';$('#bMeter').classList.toggle('over',left<0);$('#bLive').textContent=`Spent $${sp}.${sv?` Saving $${sv}.`:''} ${left<0?'Over by $'+(-left):'$'+left+' left'}.`}
function bThrow(){const pool=CB.filter(c=>c.id==='loan'||PRICE[c.id]!==undefined),c=bq.cb=pool[Math.floor(Math.random()*pool.length)];if(c.id==='loan'){$('#bCurveItems').innerHTML=`<label class="item"><input type="checkbox" value="loan" id="b-loan"><span class="nm">Lend $5 to your friend<small>They say they will pay you back next week</small></span><span class="pr">$5</span></label>`;$('#bCurve').hidden=false}else{PRICE[c.id]=c.p;bPrices()}
  $('#bCurveTxt').textContent=c.t;$('#bCurveCard').hidden=false;bRender()}
$('#budForm').addEventListener('change',()=>{bRender();pracHide('budget');$('#bResult').innerHTML=''});
$('#bCheck').addEventListener('click',()=>{const {sel,sp,sv,left}=bs(),has=i=>sel.includes(i);
  const R=[{ok:has('bus'),t:'Ride covered',f:'Add bus fare. Without it, you can’t get there.'},{ok:has('taco')||has('packed'),t:'Lunch planned',f:'Pick a lunch. Packing one saves $5.'},{ok:has('promise'),t:'Promise kept',f:BI.bPromise[0].f},{ok:left>=0,t:`Within $${BUD}`,f:`You’re $${-left} over. Drop a want${has('taco')?' or pack lunch':''}${sv?' or save a little less':''}.`}];
  const pass=R.every(x=>x.ok);let h='<ul class="results">'+R.map(x=>`<li class="${x.ok?'pass':'fail'}">${x.ok?I.check:I.x}<span>${x.ok?x.t:x.f}</span></li>`).join('');
  if(pass)h+=`<li class="bonus">${I.star}<span>${sv?`You set aside $${sv} for next week. That’s a win.`:left>=3?`You kept $${left} unspent. That counts too.`:'Next time, try setting aside $3 for next week.'}</span></li>`;h+='</ul>';
  if(pass&&!bq.cb){bThrow();$('#bResult').innerHTML=`<div class="fb"><h4>Your plan works. Now a curveball.</h4><p>Read the Curveball box, change your plan if you need to, then check again.</p></div>`;return}
  const cr=sv+left,lent=has('loan'),ln=bq.cb&&bq.cb.id==='loan'?(lent?'<p class="hab">You lent $5. That’s your choice. Remember it isn’t yours to spend until it comes back.</p>':'<p class="hab">You kept your $5. Saying no is a fair choice too.</p>'):'';
  $('#bResult').innerHTML=pass?`<div class="fb ok"><h4>${say('budget')}</h4><p>$${sp} spent${sv?`, $${sv} saved`:''}, $${left} unspent. Needs and promises came first.</p>${ln}${cr>0?`<div class="carry"><b>$${cr}</b><span>carries over to next week</span></div>`:'<p>Nothing carries over this time. A few dollars set aside next time would.</p>'}${h}</div>`:`<div class="fb no"><h4>Almost. Fix these:</h4>${h}</div>`;react($('#bResult .fb'),true);if(pass)finish('budget')});
$('#budReset').addEventListener('click',()=>{bq={cb:null};$('#budForm').reset();bDeal();$('#bCurveItems').innerHTML='';$('#bCurve').hidden=true;$('#bCurveCard').hidden=true;bPrices();bRender();$('#bResult').innerHTML='';pracHide('budget');toast('Budget reset.')});
bRender();

/* ---------- Scam or Safe ---------- */
const MS=[
 {f:'Unknown number',c:'Text message',b:'CONGRATS!! You won a free GameStation 5. Claim [in the next 10 min]: [gs5-prizes.win/claim]. Just [pay $4.99 shipping with a parent’s card].',x:1,k:['A countdown meant to rush you','A strange web address','A real prize never makes you pay. This also asks for a card number.']},
 {f:'xX_ProBuilder_Xx',c:'In-game chat',b:'yo i can give u [10,000 free coins]. send me ur [login + password] and i’ll load them rn',x:1,k:['Free in-game money is a common trick','No real player or game needs your password. Sharing it can cost you the whole account.']},
 {f:'Mom (saved contact)',c:'Text message',b:'Practice ends at 5. I’ll pick you up by the front doors. Text me if it runs late.',x:0,y:'It’s from a saved contact, matches plans you know about, and asks for nothing.',r:'Ok. See you at the front doors.'},
 {f:'Security <alerts@[g00gle]-support.co>',c:'Email',b:'Your account will be [DELETED in 1 hour]. Verify now to keep your photos: [g00gle-support.co/verify]',x:1,k:['Zeros where letters should be','A scary deadline','A login link. Open the real app instead.']},
 {f:'Riverside Library',c:'App notification',b:'Reminder: 2 books are due Friday. You can renew them in the app.',x:0,y:'It appears inside an app you already use, only shares information, and lets you act in the app.',s:'You renewed both books in the library app.'},
 {f:'Unknown number',c:'Text message',b:'hey its your cousin, [got a new number]. can u buy 2 [gift cards] and send me the codes? [don’t tell anyone] i’ll pay u back',x:1,k:['Claims to be family from a new number','Gift card codes are a favorite scam payment','Asking you to keep a secret is a red flag']},
 {f:'Tyler_07',c:'Direct message',b:'hey its tyler, my account got locked. [can u read me the 6 digit code] that just got texted to u? [need it rn] pls pls',x:1,k:['That code is the key to your account. Never share it, even with a friend.','A friend in a big hurry is a pressure trick. Call or ask them in person.']},
 {f:'Delivery Team',c:'Text message',b:'Your package could not be delivered. [Pay a $1.99 fee] at [pkg-redelivery.help/track] or it will be [sent back today].',x:1,k:['Real delivery companies don’t ask for a fee by text','A strange web address, not the real company’s site','A deadline meant to rush you']},
 {f:'SkinDrop',c:'Game chat',b:'FREE skins for everyone!! Tap [skinz-free.gg] and [log in with your game account] to get 5. [Only 20 left].',x:1,k:['A strange link, not the real game store','Free skins don’t need your login. That’s how accounts get stolen.','“Only 20 left” is a rush trick']},
 {f:'ProTrader99',c:'Game chat',b:'trade u 5 rare skins for ur 1 [dragon skin]. [send yours first] so i know ur real. [trust me], im a top player',x:1,k:['A trade that’s too good to be true','Making you go first means you can lose your item','“Trust me” is not proof. Real trades happen in the game at the same time.']},
 {f:'Coach Ray (saved contact)',c:'Text message',b:'Game moved to Saturday at 10. Same field. Bring water.',x:0,y:'It’s from a saved contact, it matches your team, and it only shares plans. You can double check with your team.',r:'Got it. Saturday at 10. I’ll bring water.'},
 {f:'Diego (saved contact)',c:'Group chat',b:'Pizza at my house after the game? My mom said it’s ok if your mom says yes.',x:0,y:'It’s from a friend you know, and it asks you to check with your parent first.',r:'Let me ask my mom. I’ll text you back.'}
];
const SN=6,shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const sDeal=()=>shuf([...shuf(MS.filter(m=>m.x)).slice(0,4),...shuf(MS.filter(m=>!m.x)).slice(0,2)]);
let sq={q:sDeal(),i:0,s:0,ph:'call',fd:[],hint:''};
const sCur=()=>sq.q[sq.i];
function sFlags(m,mode){let n=0;const r=s=>esc(s).replace(/\[(.+?)\]/g,(_,t)=>{const j=n++,f=sq.fd.includes(j);return mode==='tap'?`<span role="button" tabindex="0" class="flag${f?' on':''}" data-j="${j}" aria-pressed="${f}">${t}</span>`:mode==='show'?`<mark${f?'':' class="miss"'}>${t}</mark>`:t});return [r(m.f),r(m.b)]}
function sBubble(){const m=sCur(),[f,b]=sFlags(m,sq.ph==='call'?'plain':sq.ph);$('#scamFrom').innerHTML=f;$('#scamBody').innerHTML=b}
function sStamp(m){const st=$('#scamStamp');if(!m){st.hidden=true;return}st.textContent=m.x?'Scam':'Safe';st.className='stamp'+(m.x?'':' safe');st.hidden=false}
function sAfter(m,h){const a=$('#scamAfter');if(!h){a.innerHTML='';return}if(a.innerHTML||!sq.ok)return;setTimeout(()=>{if(sCur()===m)a.innerHTML=h},RM?0:650)}
function sRender(){const fb=$('#scamFb');$('#scamProg').innerHTML=sq.q.map((m,j)=>`<i class="${j<sq.i||sq.i>=SN?'done':j===sq.i?'cur':''}"></i>`).join('');$('#scamShow').hidden=true;sStamp(null);sAfter(null);
  if(sq.i>=SN){$('#scamFrom').textContent='Inbox clear';$('#scamChan').textContent='All 6 reviewed';$('#scamAv').textContent='✓';$('#scamCount').textContent='Done';$('#scamBody').textContent='When a message makes you feel rushed, excited or scared, slow down.';$('#scamSafe').disabled=$('#scamBad').disabled=true;$('#scamNext').hidden=true;
    fb.className='fb ok';fb.innerHTML=`<div class="result"><div class="score">${sq.s}<small> / 6</small></div><p><b>Pause.</b> Real messages rarely need an answer in minutes. <b>Don’t click.</b> Open the real app yourself. <b>Show an adult.</b> Asking is the smart move.</p><div><button class="btn btn-ink btn-sm" type="button" id="scamAgain">Play again</button></div></div>`;$('#scamAgain').addEventListener('click',sReset);react(fb,true);finish('scams');return}
  pracHide('scams');const m=sCur();sq.ph='call';sq.fd=[];sq.hint='';$('#scamCount').textContent=`${sq.i+1} / ${SN}`;$('#scamChan').textContent=m.c;$('#scamAv').textContent=m.f.replace(/[^A-Za-z]/g,'').charAt(0).toUpperCase()||'?';sBubble();$('#scamSafe').disabled=$('#scamBad').disabled=false;fb.className='fb';fb.innerHTML='';$('#scamNext').hidden=true}
function sFb(){const m=sCur(),fb=$('#scamFb'),n=m.k?m.k.length:0,fin=sq.ph==='show',rv=fin&&sq.fd.length<n;fb.className='fb '+(sq.ok?'ok':'no');
  let h=`<h4>${sq.head} This one ${m.x?'is a scam':'is safe'}.</h4>`;
  if(!m.x)h+=`<p>${esc(m.y)}</p>`;else{
    if(!fin)h+=`<p>Now tap the words that give it away. Found ${sq.fd.length} of ${n}.</p>${sq.hint?`<p class="hint">${esc(sq.hint)}</p>`:''}`;else if(sq.ok&&!rv)h+=`<p>You found all ${n}.</p>`;
    const li=m.k.map((c,j)=>sq.fd.includes(j)?`<li>${esc(c)}</li>`:fin?`<li><b>You missed:</b> ${esc(c)}</li>`:'').join('');
    if(li)h+=`<ul class="clues">${li}</ul>`;
    if(fin){h+=`<p class="hab"><b>What to do:</b> don’t click or reply. Show a trusted adult, then block and delete.</p>`;sAfter(m,'<p class="sys">Shown to an adult. Blocked and deleted.</p>')}}
  fb.innerHTML=h;$('#scamShow').hidden=!(sq.ph==='tap'&&sq.fd.length>0);$('#scamNext').hidden=!(fin||(sq.ph==='tap'&&sq.fd.length>0));$('#scamNext').textContent=sq.i===SN-1?'See results':'Next message'}
function sAns(sc){if(sq.ph!=='call'||sq.i>=SN)return;const m=sCur(),ok=sc===!!m.x;sq.ok=ok;sq.head=ok?say(m.x?'scam':'safe'):say('miss');if(ok)sq.s++;$('#scamSafe').disabled=$('#scamBad').disabled=true;
  if(m.x&&ok)sq.ph='tap';else{sq.ph='show';if(m.x)sq.fd=m.k.map((_,j)=>j)}
  sBubble();sStamp(m);sFb();react($('#scamFb'));if(!m.x)sAfter(m,m.r?`<p class="me">${esc(m.r)}</p>`:m.s?`<p class="sys">${esc(m.s)}</p>`:'');
  if(sq.ph==='show'){const n=$('#scamNext');n.hidden=false;n.focus({preventScroll:true})}}
function sFinish(){const all=sq.ok&&sq.fd.length===sCur().k.length;sq.ph='show';sBubble();sFb();if(all)react($('#scamFb'));$('#scamNext').focus({preventScroll:true})}
function sReset(){sq={q:sDeal(),i:0,s:0,ph:'call',fd:[],hint:''};sRender();toast('Scam or Safe reset.')}
$('#scamPhone').addEventListener('click',e=>{if(sq.ph!=='tap')return;const b=e.target.closest('.flag');
  if(b){const j=+b.dataset.j;if(sq.fd.includes(j))return;sq.fd.push(j);sq.hint='';b.classList.add('on');b.setAttribute('aria-pressed','true');if(sq.fd.length===sCur().k.length)sFinish();else sFb()}
  else if(e.target.closest('.bubble,.from b')){sq.hint='Look again. Which words feel off?';sFb()}});
$('#scamPhone').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('flag')){e.preventDefault();e.target.click()}});
$('#scamSafe').addEventListener('click',()=>sAns(false));$('#scamBad').addEventListener('click',()=>sAns(true));$('#scamShow').addEventListener('click',sFinish);
$('#scamNext').addEventListener('click',()=>{sq.i++;sRender()});$('#scamReset').addEventListener('click',sReset);sRender();

/* ---------- make the call: each step has 3 choices (good, vague, off); r = Dana's reply, "~" = note, "~~" = hold ---------- */
/* three scenarios; one is picked at random each play, never the same one twice in a row. mkCall builds the six steps from a scenario's words */
const CALLS=[
 {biz:'Fresh Cuts',av:'FC',who:'Dana',obj:'her',me:'Sam',thing:'haircut',pro:'Marcus',had:'Thursday at 4:00',why:'my team added a practice then',whyShort:'you have practice',want:'a later time this week',times:['Thursday at 5:30','Friday at 3:00','Saturday at 10:00'],good:'Saturday at 10:00',goodDay:'Saturday',goodFree:'Saturday morning',clash:'Thursday at 5:30',clashDay:'Thursday',clashWhy:'practice runs until 6:00',clashWith:'practice, which runs until 6:00',
  intro:'Your haircut clashes with a new practice.',week:['Practice now takes Thursday 4:00 to 6:00.',['Thursday','Free after 6:00'],['Friday','Free after 3:30'],['Saturday','Free in the morning']],
  confirm:'Fresh Cuts: Sam is booked Saturday at 10:00 with Marcus. See you then!'},
 {biz:'Bright Smiles Dental',av:'BS',who:'Priya',obj:'her',me:'Sam',thing:'dentist checkup',pro:'Dr. Lee',had:'Friday at 3:30',why:'my class has a field trip that day',whyShort:'you have a field trip',want:'another day next week',times:['Monday at 3:45','Wednesday at 4:00','Friday at 5:00'],good:'Wednesday at 4:00',goodDay:'Wednesday',goodFree:'Wednesday after school',clash:'Monday at 3:45',clashDay:'Monday',clashWhy:'soccer runs 3:30 to 5:00',clashWith:'soccer, which runs 3:30 to 5:00',
  intro:'Your dentist checkup lands on the day of a class field trip.',week:['The field trip takes all of Friday.',['Monday','Soccer 3:30 to 5:00'],['Wednesday','Free after 3:30'],['Friday','Field trip until 6:00']],
  confirm:'Bright Smiles Dental: Sam is booked Wednesday at 4:00 with Dr. Lee. Reply C to cancel.'},
 {biz:'Westside Rec Center',av:'WR',who:'Theo',obj:'him',me:'Sam',thing:'swim lesson',pro:'Coach Bea',had:'Saturday at 9:00',why:'my cousin’s birthday party is that morning',whyShort:'you have a party',want:'a different time this week',times:['Tuesday at 4:30','Thursday at 5:00','Saturday at 1:00'],good:'Saturday at 1:00',goodDay:'Saturday',goodFree:'Saturday afternoon',clash:'Tuesday at 4:30',clashDay:'Tuesday',clashWhy:'piano runs 4:00 to 5:00',clashWith:'piano, which runs 4:00 to 5:00',
  intro:'Your swim lesson clashes with your cousin’s birthday party.',week:['The party runs Saturday 9:00 to noon.',['Tuesday','Piano 4:00 to 5:00'],['Thursday','Homework club until 5:30'],['Saturday','Free after noon']],
  confirm:'Westside Rec Center: Sam is booked for a swim lesson Saturday at 1:00 with Coach Bea.'}
];
function mkCall(S){const CT=`Here are the times I have: ${S.times[0]}, ${S.times[1]}, or ${S.times[2]}.`,CH=['Okay, let me check the book. One moment.','~~','Thanks for waiting. '+CT],W=S.who,M=S.me,P=S.pro?' with '+S.pro:'',cap=s=>s[0].toUpperCase()+s.slice(1);return [
 {q:`${W} picks up. What do you say?`,s:'Said who you were',n:'Start with hello and your name.',c:[
  {y:'good',t:`Hi ${W}, this is ${M}.`,r:[`Hi ${M}! How can I help you?`]},
  {y:'vague',t:'Uh... hi.',r:['Hello? Sorry, who is this?',`~You tell ${S.obj} you’re ${M}.`,`Hi ${M}. How can I help you?`],tip:`Say your name right away. It helps ${W} find your visit.`},
  {y:'off',t:`Yeah, I need to change my ${S.thing}.`,r:['Okay... who is this, so I can look you up?',`~You tell ${S.obj} you’re ${M}.`,`Thanks, ${M}. What’s going on?`],tip:`Start with hello and your name. It’s friendlier, and it helps ${W} look you up.`}]},
 {q:`Tell ${S.obj} why you’re calling.`,s:'Said why you were calling',n:'Say why you’re calling in one clear sentence.',c:[
  {y:'good',t:`I have a ${S.thing} ${S.had}, but ${S.why}. I need to move it.`,r:[`Oh, got it. I see you ${S.had}${P}.`,'What would you like to do?']},
  {y:'vague',t:'Um, I have a thing. It’s about my appointment.',r:['Okay... which appointment? What’s the thing?',`~You explain it’s your ${S.had} ${S.thing} and ${S.whyShort}.`,`Oh, I see you ${S.had}${P}. What would you like to do?`],tip:`Say the day, the time and the problem in one sentence. Then ${W} knows what you need.`},
  {y:'off',t:'Your schedule is messed up. Fix my appointment.',r:['Oh! Sorry about that. Which appointment is it?',`~You explain it’s your ${S.had} ${S.thing} and your own plans changed.`,`Okay, I see you ${S.had}${P}. What would you like to do?`],tip:`Nothing is wrong with their schedule. Yours changed. Say that calmly and ${W} will help.`}]},
 {q:'Ask for a new time.',s:'Asked for a new time politely',n:'Ask politely, and say please.',c:[
  {y:'good',t:`Could I move it to ${S.want}, please?`,r:CH},
  {y:'vague',t:'Uh, can I change it?',r:['Change it to what? I need a day or a time.',`~You say you want ${S.want}.`,...CH],tip:`Tell ${W} what you want: ${S.want}. “Change it” can mean a lot of things.`},
  {y:'off',t:'Just give me a new time. I’m busy.',r:['Okay, okay.',...CH],tip:'Please makes a big difference. A kind voice gets help faster, even when you’re in a hurry.'}]},
 {q:`${W} read out some times. Which one do you take?`,s:'Picked a time that fits your week',n:'Check Your week before you pick a time.',c:[
  {y:'good',t:`${S.good} works. I’m free ${S.goodFree}.`,r:[`${S.good}. Perfect, that one’s open. I’ll put you down.`]},
  {y:'clash',t:`${S.clash}, please.`,r:[`${S.clash}, okay.`,`~Wait. Your week says ${S.clashWhy}. You ask for ${S.good} instead.`,`No problem. ${S.good} is open. I’ll put you down.`],tip:`${S.clash} clashes with ${S.clashWith}. Check Your week first. ${cap(S.goodFree)} is free.`},
  {y:'off',t:'Whichever. I don’t care.',r:[`Um, okay. ${S.good} is open, so I’ll put you down for that.`],tip:`Pick a time yourself. ${W} can’t see your week, and a time that clashes would mean another call.`}]},
 {q:'Say it back to be sure.',s:'Repeated the day and time back',n:'Repeat the day and time back before you hang up.',c:[
  {y:'good',t:`So that’s ${S.good}, not ${S.clashDay}. Is that right?`,r:[`Yes, that’s right. ${S.good}${S.pro?', with '+S.pro:''}.`,'Anything else I can help with?']},
  {y:'vague',t:'Okay, cool. So it’s all set?',r:[`Yep, all set. That’s ${S.good}.`,'Anything else I can help with?'],tip:`Say the day and time back yourself. It catches mix-ups, like ${S.clashDay} instead of ${S.goodDay}.`},
  {y:'off',t:'Fine. Just don’t mess it up this time.',r:[`Oh. I won’t. You’re down for ${S.good}.`,'Anything else I can help with?'],tip:'Saying the day and time back is how you check. Blaming the desk makes the call feel tense.'}]},
 {q:'Time to wrap up the call.',s:'Ended with a thank you',n:'End with a thank you.',c:[
  {y:'good',t:`No, that’s all. Thank you, ${W}! See you ${S.goodDay}.`,r:[`You’re welcome, ${M}! See you ${S.good}. Bye!`]},
  {y:'vague',t:'Uh, no. Bye.',r:['Okay. Bye now.'],tip:'A quick thank you ends the call on a good note.'},
  {y:'off',t:'Nope. Okay, bye.',r:['...Bye.'],tip:'Say thank you before you hang up. It only takes a second, and people remember it.'}]}
]}
let CS=mkCall(CALLS[0]),cLast=-1;
const CN=CS.length;
function cScene(){let i;do i=Math.floor(Math.random()*CALLS.length);while(CALLS.length>1&&i===cLast);cLast=i;const S=CALLS[i];CS=mkCall(S);cl.S=S;
  $('#callBiz').textContent=S.biz;$('#callAv').textContent=S.av;$('#callPhone').setAttribute('aria-label','Phone call with '+S.biz);$('#callIntro').textContent=S.intro+' Call the front desk, say what you need, and pick a time that fits your week.';
  $('#callWeek').innerHTML=`<h4>Your week</h4><p>${esc(S.week[0])}</p>`+S.week.slice(1).map(([d,t])=>`<div><span>${esc(d)}</span><b>${esc(t)}</b></div>`).join('');return S}
let cl=null,ctick=0;
const cFmt=ms=>{const s=Math.floor(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
function cTx(k,t,x){const p=document.createElement('p');p.className='ln '+k+(x?' '+x:'');p.textContent=t;const w=$('#callTx');w.appendChild(p);w.scrollTop=w.scrollHeight;return p}
function cStatus(t){$('#callSt').textContent=t}
function cStop(){clearInterval(ctick);ctick=0;clearTimeout(cl&&cl.to)}
function cTimer(){if(ctick)return;cl.t0=Date.now();ctick=setInterval(()=>{$('#callTime').textContent=cFmt(Date.now()-cl.t0)},500)}
function cReset(quiet){if(cl)cStop();cl={i:0,g:0,got:[],busy:false,o:shuf([0,1,2]),t0:0,to:0};const S=cScene();$('#callTime').textContent='0:00';$('#callTx').innerHTML='';cTx('desk',`Thanks for calling ${S.biz}, this is ${S.who}.`);cStatus('Connected');pracHide('call');cRender();if(!quiet)toast('Make the Call reset.')}
function cRender(){const fb=$('#callFb'),o=$('#callOpts');$('#callProg').innerHTML=CS.map((_,j)=>`<i class="${j<cl.i?'done':j===cl.i?'cur':''}"></i>`).join('');fb.className='fb';fb.innerHTML='';$('#callNext').hidden=$('#callAgain').hidden=true;
  if(cl.i>=CN)return cEnd();
  const st=CS[cl.i];$('#callStep').textContent=`Step ${cl.i+1} of ${CN}`;$('#callQ').textContent=st.q;$('#callWeek').hidden=false;
  o.innerHTML=cl.o.map(k=>`<button class="btn btn-line" type="button" data-ci="${k}" data-y="${st.c[k].y}">${esc(st.c[k].t)}</button>`).join('')}
function cPlay(L,k,id){if(cl.id!==id)return;for(;k<L.length;k++){const l=L[k];
    if(l==='~~'){cStatus('On hold');const h=cTx('sys','On hold for a moment...','hold');cl.to=setTimeout(()=>{h.classList.remove('hold');cStatus('On the call');cPlay(L,k+1,id)},RM?0:1500);return}
    l[0]==='~'?cTx('sys',l.slice(1)):cTx('desk',l)}
  cAfter()}
function cAfter(){const st=CS[cl.i],ch=st.c[cl.pick],good=ch.y==='good',fb=$('#callFb');if(good)cl.g++;cl.got[cl.i]=good;
  fb.className='fb '+(good?'ok':'no');fb.innerHTML=good?`<h4>${say('call')}</h4><p class="hab">That’s what a good call sounds like.</p>`:`<h4>Try this next time.</h4><p class="hab">${esc(ch.tip)}</p>`;react(fb);
  const W=cl.S.who;cStatus(good?`${W} sounds happy to help`:ch.y==='clash'?`${W} fixed it for you`:ch.y==='vague'?`${W} sounds confused`:`${W} sounds put off`);
  const n=$('#callNext');n.textContent=cl.i===CN-1?'See how it went':'Next step';n.hidden=false;n.focus({preventScroll:true});cl.busy=false}
function cPick(k){if(cl.busy||cl.i>=CN)return;cl.busy=true;cl.pick=k;cl.id=(cl.id||0)+1;cTimer();const ch=CS[cl.i].c[k];
  $$('#callOpts .btn').forEach(b=>{b.disabled=true;b.classList.toggle('picked',+b.dataset.ci===k)});cTx('me',ch.t);cStatus('On the call');cPlay(ch.r,0,cl.id)}
function cEnd(){const dur=cl.t0?cFmt(Date.now()-cl.t0):'0:00',fb=$('#callFb'),good=CS.filter((_,j)=>cl.got[j]),miss=CS.find((_,j)=>!cl.got[j]);cStop();
  $('#callTime').textContent=dur;cStatus('Call ended');cTx('sys','Call ended');$('#callStep').textContent='Call ended';$('#callQ').textContent='How the call went';$('#callOpts').innerHTML='';$('#callWeek').hidden=true;
  fb.className=cl.g>=4?'fb ok':'fb plain';fb.innerHTML=`<div class="result">${cl.g?`<div class="score">${cl.g}<small> / ${CN} clear</small></div>`:'<p><b>Call done. Now try it with clearer lines.</b></p>'}<ul class="results">${(good.length?good.slice(0,3).map(s=>s.s):['You stayed on the call and kept going']).map(s=>`<li class="pass">${I.check}<span>${esc(s)}</span></li>`).join('')}</ul><p class="hab"><b>Try next time:</b> ${esc(miss?miss.n:'Jot down your plan before you call: who you are, why, and when you’re free.')}</p></div>`;
  react(fb,true);$('#callAgain').hidden=false;finish('call');
  cl.to=setTimeout(()=>{if(cl&&cl.i>=CN){cTx('sys','New text message');cTx('desk',cl.S.confirm)}},RM?0:1200)}
$('#callOpts').addEventListener('click',e=>{const b=e.target.closest('[data-ci]');if(b&&!b.disabled)cPick(+b.dataset.ci)});
$('#callNext').addEventListener('click',()=>{if(cl.busy)return;cl.i++;cl.o=shuf([0,1,2]);cRender();if(cl.i<CN){$('#callOpts .btn').focus({preventScroll:true})}});
$('#callAgain').addEventListener('click',()=>cReset());$('#callReset').addEventListener('click',()=>cReset());cReset(true);

/* ---------- Laundry Sort-Out: sort the pile, then read care labels ---------- */
const LB={dark:'Darks',light:'Lights',towel:'Towels'};
const LI=[{id:'tshirt',n:'White T-shirt',b:'light',c:'l'},{id:'jeans',n:'Dark jeans',b:'dark',c:'d'},{id:'bath',n:'Bath towel',b:'towel',c:'t'},{id:'jersey',n:'Red team jersey',b:'dark',c:'r'},{id:'socks',n:'White socks',b:'light',c:'l'},{id:'hoodie',n:'Black hoodie',b:'dark',c:'d'},{id:'hand',n:'Hand towel',b:'towel',c:'t'},{id:'sweats',n:'Dark gray sweatpants',b:'dark',c:'d'}];
const LOK={l:'Lights stay together so they stay bright.',d:'Darks wash together so their color stays put.',t:'Towels shed lint, so they get their own load.',r:'New bright colors can bleed in the wash, so the red jersey goes with the darks.'};
const LCT='Towels are thick and shed lint onto clothes, so clothes wash in their own load.',LTW='Towels shed lint onto other clothes, so they get their own load.';
const LNO={l:{dark:'Light clothes can pick up color from darks and look dingy, so lights wash with lights.',towel:LCT},d:{light:'Dark clothes can leak color onto light ones, so darks wash with darks.',towel:LCT},t:{dark:LTW,light:LTW},r:{light:'A new red jersey can bleed and turn light clothes pink. New bright colors go with the darks.',towel:'Towels shed lint, and a new red jersey can bleed color too. New bright colors go with the darks.'}};
const LW=['cold','warm','hot'],LH=['low','medium','high'],dt=n=>n+' dot'+(n>1?'s':'');
const lDots=(n,y,cx=24)=>Array.from({length:n},(_,i)=>`<circle cx="${cx+(i-(n-1)/2)*7}" cy="${y}" r="2" fill="currentColor" stroke="none"/>`).join('');
const LX='<path d="M7 7l34 34M41 7L7 41"/>';
const LSY={tub:n=>`<path d="M6 15h36l-4 23q-.5 3-3.5 3h-21q-3 0-3.5-3z"/><path d="M11 22q3-3 6.5 0t6.5 0 6.5 0 6.5 0"/>${lDots(n,32)}`,nob:()=>`<path d="M24 7l18 32H6z"/>${LX}`,dry:n=>`<rect x="6" y="6" width="36" height="36" rx="2"/><circle cx="24" cy="24" r="12"/>${lDots(n,24)}`,nodry:()=>LSY.dry(0)+LX,flat:()=>'<rect x="6" y="6" width="36" height="36" rx="2"/><path d="M13 24h22"/>',iron:n=>`<path d="M6 38h36V26Q42 14 31 14H17q-3 0-4.5 4z"/>${lDots(n,30,26)}`,noiron:()=>LSY.iron(0)+LX};
const LN={tub:n=>'washtub with '+dt(n),nob:()=>'crossed-out triangle',dry:n=>'square with a circle and '+dt(n),nodry:()=>'crossed-out square with a circle',flat:()=>'square with a line',iron:n=>'iron with '+dt(n),noiron:()=>'crossed-out iron'};
const LTX={tub:n=>`Washtub with ${dt(n)}: wash in ${LW[n-1]} water.`,nob:()=>'Triangle with an X: do not use bleach.',dry:n=>`Square with a circle and ${dt(n)}: tumble dry on ${LH[n-1]} heat.`,nodry:()=>'Square and circle with an X: do not use a dryer.',flat:()=>'Square with a line in it: lay the item flat to dry.',iron:n=>`Iron with ${dt(n)}: iron on ${LH[n-1]} heat. Ask an adult first.`,noiron:()=>'Iron with an X: do not iron.'};
const LL=[{g:'a hoodie',f:'80% cotton, 20% polyester',t:2,s:[['tub',2],['nob'],['dry',2],['noiron']]},{g:'a wool sweater',f:'100% wool',t:1,d:0,s:[['tub',1],['nob'],['nodry'],['flat']]},{g:'a gym shirt',f:'100% polyester',t:1,d:1,s:[['tub',1],['nob'],['dry',1],['iron',1]]},{g:'a white cotton shirt',f:'100% cotton',t:3,s:[['tub',3],['nob'],['dry',3],['iron',3]]}];
const lSvg=(k,n)=>`<svg viewBox="0 0 48 48" aria-hidden="true">${LSY[k](n)}</svg>`;
const careSvg=L=>`<svg class="care" viewBox="0 0 340 176" role="img" aria-label="Care label with these symbols: ${L.s.map(([k,n])=>LN[k](n)).join(', ')}"><rect x="2" y="2" width="336" height="172" rx="14" fill="#FBF9F3" stroke="#BDB8AB" stroke-width="2"/><rect x="12" y="12" width="316" height="152" rx="9" fill="none" stroke="#CFCABD" stroke-width="1.6" stroke-dasharray="5 4"/><text x="170" y="46" text-anchor="middle" font-family="Geist,system-ui,sans-serif" font-size="15" font-weight="500" fill="#56615B">${L.f}</text><path d="M44 62h252" stroke="#E2DED5" stroke-width="1.5"/>${L.s.map(([k,n],i)=>`<g transform="translate(${27+i*72} 86) scale(1.3)" fill="none" stroke="#16211C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${LSY[k](n)}</g>`).join('')}</svg>`;
const lPileHtml=recap=>`<div class="pile${recap?' recap':''}" id="lPile" role="group" aria-label="${recap?'Your sorted laundry':'The laundry pile'}">${LI.map(it=>`<div class="cell"><button class="piece" type="button" data-i="${it.id}" aria-pressed="false"${recap?' tabindex="-1" disabled':''}><svg viewBox="0 0 120 120" aria-hidden="true"><use href="#l-${it.id}"></use></svg><span>${it.n}</span>${recap?`<small>${LB[it.b]}</small>`:''}</button></div>`).join('')}</div>`;
const lBaskHtml=()=>`<div class="baskets" id="lBaskets" role="group" aria-label="Baskets">${Object.keys(LB).map(k=>`<button class="bk" type="button" data-b="${k}" aria-label="${LB[k]} basket, empty"><svg viewBox="0 0 140 110" aria-hidden="true"><use href="#l-bk-${k}"></use></svg><b>${LB[k]}</b><small>Empty</small></button>`).join('')}</div>`;
const lHead=(t,n,f)=>`<div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><span class="label">${t}</span><div class="prog" id="lProg" aria-hidden="true">${Array.from({length:n},(_,i)=>`<i class="${f(i)}"></i>`).join('')}</div></div>`;
let lz=null,ld=null,lSkip=0;
const lFbSet=(c,h,p)=>{const f=$('#lFb');f.className='fb '+c;f.innerHTML=`<h4>${h}</h4><p class="hab">${p}</p>`;if(c!=='plain')react(f,h==='Pile sorted.')};
function lView(){const r=$('#lStage').getBoundingClientRect();if(r.top<70||r.top>innerHeight*.6)scrollTo({top:scrollY+r.top-100,behavior:RM?'instant':'smooth'})}
function lShow1(){lz.ph=1;$('#lStage').className='lstage';$('#lStage').innerHTML=lPileHtml()+'<div class="lfb"><div class="fb" id="lFb" aria-live="polite"></div></div>'+lBaskHtml();
  $('#lSide').innerHTML=lHead('Part 1 of 2',LI.length,()=>'')+'<h3>Sort the pile into three baskets.</h3><p>'+(matchMedia('(pointer:coarse)').matches?'Tap an item, then tap the basket it goes in.':'Drag each item to a basket. Or click an item, then click a basket.')+'</p><div class="push"><button class="btn btn-ink" id="lGo" type="button" hidden>Read the labels</button></div>'}
function lBk(){Object.keys(LB).forEach(k=>{const n=Object.values(lz.placed).filter(v=>v===k).length,t=n?n+(n>1?' items':' item'):'Empty',b=$(`.bk[data-b="${k}"]`);b.querySelector('small').textContent=t;b.setAttribute('aria-label',`${LB[k]} basket, ${t.toLowerCase()}`)})}
function lSel(id){lz.sel=id;$$('#lPile .piece').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.i===id)));$('#lStage').classList.toggle('armed',!!id);if(id)lFbSet('plain',LI.find(x=>x.id===id).n+' is picked.','Now choose a basket for it.')}
function lDrop(id,bk){const it=LI.find(x=>x.id===id),p=$(`#lPile [data-i="${id}"]`);lSel(null);p.classList.remove('lift');
  if(it.b===bk){lz.placed[id]=bk;p.classList.add('gone');p.closest('.cell').classList.add('gone');p.disabled=true;p.tabIndex=-1;const b=$(`.bk[data-b="${bk}"]`);b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump');lBk();
    const n=Object.keys(lz.placed).length,left=LI.filter(x=>!lz.placed[x.id]);$$('#lProg i').forEach((x,i)=>x.className=i<n?'done':'');
    if(left.length){lFbSet('ok',say('sort'),`${it.n} goes in ${LB[bk]}. ${LOK[it.c]}`);$(`#lPile [data-i="${left[0].id}"]`).focus({preventScroll:true})}
    else{const a=LI.filter(x=>!lz.miss[x.id]).length;lFbSet('ok','Pile sorted.',`${LOK[it.c]} ${a?a+' of '+LI.length+' went in the right basket on the first try.':'Every item is in the right basket now.'} Next, read some care labels.`);const g=$('#lGo');g.hidden=false;g.focus()}}
  else{lz.miss[id]=lz.miss[id]||bk;p.classList.remove('nope');void p.offsetWidth;p.classList.add('nope');lFbSet('no','Not that basket.',LNO[it.c][bk]);p.focus({preventScroll:true})}}
function lLab(){const L=LL[lz.li];lz.st='t';lz.msg='';$('#lStage').className='lstage lab';$('#lStage').innerHTML=`<div class="lblw">${careSvg(L)}<p class="lcap">Care label from <b>${L.g}</b></p></div>`;
  $('#lSide').innerHTML=lHead(`Label ${lz.li+1} of ${LL.length}`,LL.length,i=>i<lz.li?'done':i===lz.li?'cur':'')+`<h3>What water temperature does this label say?</h3><p>Look at the washtub. More dots mean hotter water.</p><div class="tri" id="lOpts">${LW.map((w,i)=>`<button class="btn btn-line" type="button" data-t="${i+1}">${w[0].toUpperCase()+w.slice(1)}</button>`).join('')}</div><div class="fb" id="lFb" aria-live="polite"></div><div class="push"><button class="btn btn-ink" id="lNext" type="button" hidden></button></div>`;
  lView();$('#lOpts .btn').focus({preventScroll:true})}
function lMark(v,right){$$('#lOpts .btn').forEach(b=>{b.disabled=true;const k=+(b.dataset.t||b.dataset.y);b.classList.toggle('ok',k===right);b.classList.toggle('no',k===v&&v!==right)})}
function lTemp(v){const L=LL[lz.li],ok=v===L.t;lz.r[lz.li]={t:ok};lMark(v,L.t);lz.msg=`<p class="hab"><b>${ok?'Water: right.':'Water: not quite.'}</b> The washtub has ${dt(L.t)}, which means ${LW[L.t-1]} water.</p>`;
  if(L.d==null)return lDone();
  lz.st='d';const f=$('#lFb');f.className='fb '+(ok?'ok':'no');f.innerHTML=lz.msg;
  $('#lSide h3').textContent='Can this go in the dryer?';$('#lSide h3+p').textContent='Look at the square with the circle.';const o=$('#lOpts');o.className='tri two';o.innerHTML='<button class="btn btn-line" type="button" data-y="1">Yes</button><button class="btn btn-line" type="button" data-y="0">No</button>';o.querySelector('.btn').focus({preventScroll:true})}
function lDry(v){const L=LL[lz.li],ok=v===L.d,s=L.s.find(x=>x[0]==='dry'||x[0]==='nodry');lz.r[lz.li].d=ok;lMark(v,L.d);lz.msg+=`<p class="hab"><b>${ok?'Dryer: right.':'Dryer: not quite.'}</b> ${LTX[s[0]](s[1])}</p>`;lDone()}
function lDone(){const L=LL[lz.li],r=lz.r[lz.li],all=r.t&&r.d!==false,f=$('#lFb'),nx=$('#lNext');lz.st='x';
  f.className='fb '+(all?'ok':'no');f.innerHTML=`<h4>${all?say('label'):'Here is what the label says.'}</h4>${lz.msg}<ul class="lg">${L.s.map(([k,n])=>`<li>${lSvg(k,n)}<span>${LTX[k](n)}</span></li>`).join('')}</ul>`;react(f);
  $$('#lProg i').forEach((x,i)=>x.className=i<=lz.li?'done':'');nx.textContent=lz.li===LL.length-1?'See how it went':'Next label';nx.hidden=false;nx.focus()}
function lFinish(){lz.ph=3;const a=LI.filter(x=>!lz.miss[x.id]).length,jr=!lz.miss.jersey,b=lz.r.reduce((s,x)=>s+(x.t?1:0)+(x.d?1:0),0),qs=LL.length+LL.filter(x=>x.d!=null).length,g=a+b,tot=LI.length+qs,mi=LI.find(x=>lz.miss[x.id]),ml=LL.findIndex((x,i)=>!lz.r[i].t||lz.r[i].d===false);
  const good=[];if(a)good.push(`Sorted ${a} of ${LI.length} items on the first try`);if(jr)good.push('Spotted that a new red jersey can bleed');if(b)good.push(`Read ${b} of ${qs} label questions right`);if(!good.length)good.push('You sorted the whole pile and read every label');
  const tip=mi?LNO[mi.c][lz.miss[mi.id]]:ml>=0?(!lz.r[ml].t?`Count the dots on the washtub. ${dt(LL[ml].t)} means ${LW[LL[ml].t-1]} water.`:'An X over the dryer symbol means no dryer.'):'Check the care label every time before you wash.';
  $('#lStage').className='lstage';$('#lStage').innerHTML=lPileHtml(true);
  $('#lSide').innerHTML=lHead('Finished',LL.length,()=>'done')+`<h3>How it went</h3><div class="fb ${g>=11?'ok':'plain'}" id="lFb" aria-live="polite"><div class="result">${g?`<div class="score">${g}<small> / ${tot} right</small></div>`:'<p><b>All sorted and read. Try it again and use the hints.</b></p>'}<ul class="results">${good.map(s=>`<li class="pass">${I.check}<span>${s}</span></li>`).join('')}</ul><p class="hab"><b>Try next time:</b> ${tip}</p><p class="hab">Ask an adult before you use a washer or dryer the first time.</p></div></div><div class="push"><button class="btn btn-ink" id="lAgain" type="button">Play again</button></div>`;
  lView();react($('#lFb'),true);finish('laundry')}
function lReset(quiet){lz={ph:1,sel:null,placed:{},miss:{},li:0,r:[],st:'t',msg:''};pracHide('laundry');lShow1();if(!quiet)toast('Laundry Sort-Out reset.')}
$('#lStage').addEventListener('click',e=>{if(Date.now()-lSkip<350||lz.ph!==1)return;const p=e.target.closest('.piece'),b=e.target.closest('.bk');
  if(p&&!p.disabled)lSel(lz.sel===p.dataset.i?null:p.dataset.i);
  else if(b){if(lz.sel)lDrop(lz.sel,b.dataset.b);else lFbSet('plain','Pick an item first.','Tap an item in the pile, then tap a basket. Or drag it over.')}});
$('#lStage').addEventListener('pointerdown',e=>{const p=e.target.closest('.piece');if(!p||p.disabled||lz.ph!==1||e.pointerType==='touch'||(e.pointerType==='mouse'&&e.button))return;ld={p,id:p.dataset.i,x:e.clientX,y:e.clientY,on:false,pid:e.pointerId,bk:null}});
addEventListener('pointermove',e=>{if(!ld||e.pointerId!==ld.pid)return;
  if(!ld.on){if(Math.hypot(e.clientX-ld.x,e.clientY-ld.y)<8)return;ld.on=true;const g=document.createElement('div');g.className='ghost';g.innerHTML=ld.p.querySelector('svg').outerHTML;document.body.appendChild(g);ld.g=g;ld.p.classList.add('lift');document.body.classList.add('dragging')}
  ld.g.style.transform=`translate(${e.clientX-44}px,${e.clientY-52}px) scale(1.08)`;const el=document.elementFromPoint(e.clientX,e.clientY),b=el&&el.closest('.bk');if(b!==ld.bk){ld.bk&&ld.bk.classList.remove('over');b&&b.classList.add('over');ld.bk=b}});
function ldStop(e){if(!ld||e.pointerId!==ld.pid)return;const d=ld;ld=null;if(!d.on)return;d.g.remove();document.body.classList.remove('dragging');d.p.classList.remove('lift');d.bk&&d.bk.classList.remove('over');lSkip=Date.now();
  if(e.type==='pointerup'){const el=document.elementFromPoint(e.clientX,e.clientY),b=el&&el.closest('.bk');if(b)lDrop(d.id,b.dataset.b)}}
addEventListener('pointerup',ldStop);addEventListener('pointercancel',ldStop);
$('#lSide').addEventListener('click',e=>{const t=e.target.closest('button');if(!t||t.disabled)return;
  if(t.id==='lGo'){lz.ph=2;lz.li=0;lz.r=[];lLab()}
  else if(t.dataset.t&&lz.st==='t')lTemp(+t.dataset.t);
  else if(t.dataset.y&&lz.st==='d')lDry(+t.dataset.y);
  else if(t.id==='lNext'){if(lz.li<LL.length-1){lz.li++;lLab()}else lFinish()}
  else if(t.id==='lAgain')lReset()});
$('#launReset').addEventListener('click',()=>lReset());lReset(true);

/* ---------- previews ---------- */
const PV=[
 {t:'Password Builder',m:'Tech & online safety',s:'Coming soon',d:'Turn a silly sentence into a strong passphrase you can remember.',b:['Why short passwords get guessed','Building a four-word passphrase','Never sharing, even with friends']},
 {t:'Snack Lab',m:'Simple cooking',s:'Coming soon',d:'Follow a recipe card to build a no-stove snack, then clean the station.',b:['Clean hands, clean surface','Measuring from a recipe','Cleanup as part of cooking']},
 {t:'Shutoff Finder',m:'Home & tools',s:'Coming soon',d:'Find the water shutoffs in a home and practice what to do first in a leak.',b:['Where shutoff valves live','Which way to turn','Who to tell, right away']},
 {t:'Dashboard Basics',m:'Vehicle basics',s:'Preview',d:'Coming later: what warning lights mean and when to pull over.',b:['Warning light colors','Tire checks with an adult','Who to call in a breakdown']}
];
$('#previewGrid').innerHTML=PV.map(p=>`<article class="pv"><div class="top"><span class="chip soon">${p.s}</span></div><h3>${p.t}</h3><p>${p.d}</p><details><summary>What students practice</summary><ul>${p.b.map(x=>`<li>${x}</li>`).join('')}</ul></details></article>`).join('');
$('#prev-h').textContent=PV.length+' more activities on the way';$('#previews').open=false;

/* ---------- per-activity screens: Back link on top, Next card at the bottom (art copied from the picker cards) ---------- */
ORDER.forEach((id,i)=>{const a=$('#'+id),nx=ORDER[i+1],card=nx&&$(`#pickGrid .tcard[href="#${nx}"]`);
  a.insertAdjacentHTML('afterbegin',`<a class="act-back" href="#activities">${I.prev}Back to activities</a>`);
  a.insertAdjacentHTML('beforeend',nx?`<a class="act-next" href="#${nx}">${card.querySelector('.art').outerHTML}<span class="nx"><small>Next activity</small><b>${ACT[nx][0]}</b></span>${I.next}</a>`:`<a class="act-next end" href="#activities"><span class="nx"><small>That was the last one</small><b>See all activities</b></span>${I.next}</a>`)});

route(location.hash,false);

/* ---------- help chat (preset answers, nothing sent anywhere) ---------- */
(function(){
  const fab=$('#hcFab'),box=$('#hc'),log=$('#hcLog'),opts=$('#hcOpts');
  const A={
   what:{q:'What is Own Two Feet?',a:'Own Two Feet runs live, in-person workshops where boys and young men practice everyday skills: basic tools, online safety, money, simple cooking, communication and knowing when to ask for help.',go:['#workshops','How workshops work'],next:['who','status','cost']},
   status:{q:'Are workshops running yet?',a:'Not yet. Own Two Feet is a student venture that’s still in development, so no workshops are running or booking. Join the interest list and we’ll email you when we launch.',go:['#interest','Join the interest list'],next:['host','what']},
   who:{q:'Who is it for?',a:'Boys and young men in grades 3 to 8. Activities are matched to their age, and topics for older students come later.',go:['#workshops','See age groups'],next:['safe','modules']},
   modules:{q:'What do students learn?',a:'Eight topics: home and tools, tech and online safety, personal care, simple cooking, money, communication, knowing when to ask for help, and car basics later on. Schools pick the ones they want.',go:['#cur-h','See the topics'],next:['session','try']},
   session:{q:'What happens in a session?',a:'50 or 90 minutes: start with a real-life situation, watch a mentor do it, practice it yourself, then wrap up with when to ask for help and a card to take home.',go:['#ses-h','See a session'],next:['safe','host']},
   host:{q:'Can my school get a workshop?',a:'Not yet, since we’re not booking. Join the interest list and check “Workshops for my students.” Once we launch, you’d provide a room, up to 30 students and an adult who knows them. We’d bring everything else.',go:['#interest','Join the interest list'],next:['cost','safe']},
   cost:{q:'How much will it cost?',a:'We plan to charge $200 for a 50-minute workshop and $300 for a 90-minute one, per session, for up to 30 students. We bring the supplies. Or run our activities yourself with a monthly online plan: $9.99 a month for a teacher or volunteer who shows proof, or $19.99 a month for a team of three. These are planned prices, and nothing is booking yet.',go:['#workshops','See planned prices'],next:['host','status']},
   safe:{q:'How do you keep it safe?',a:'Everything is supervised and right for their age. No electrical, gas or dangerous repairs, and every topic covers when to stop and get an adult or a pro.',next:['session','who']},
   parents:{q:'I’m a parent. How can I help?',a:'Join the interest list as a parent or guardian to hear about family workshop days, or suggest skills you’d like covered.',go:['#involved','Get involved'],next:['what','status']},
   try:{q:'Can I try an activity?',a:'Yes! There are five you can try right now: Tool Time, Saturday on $25, Scam or Safe?, Make the Call and Laundry Sort-Out.',go:['#activities','Open activities'],next:['modules','what']},
   person:{q:'Can I talk to a person?',a:'This chat can only answer the questions listed here. To reach our team, join the interest list and put your question in the notes box. We’ll get back to you.',go:['#interest','Leave a note'],next:['what','host']}
  };
  const START=['what','status','who','host','cost','try','person'];
  let started=false,busy=false;
  const scrollEnd=()=>{log.scrollTop=log.scrollHeight};
  function add(cls,html){const d=document.createElement('div');d.className='hc-msg '+cls;d.innerHTML=html;log.appendChild(d);scrollEnd();return d}
  function options(keys,label){opts.innerHTML=`<span class="lbl">${label}</span>`+keys.map(k=>`<button class="hc-opt" type="button" data-k="${k}">${A[k].q}</button>`).join('')+(keys===START?'':'<button class="hc-opt alt" type="button" data-k="__menu">All questions</button>')}
  function ask(k){if(busy)return;
    if(k==='__menu'){options(START,'Questions');opts.querySelector('button')?.focus();return}
    const it=A[k];busy=true;add('me',esc(it.q));opts.innerHTML='';
    const t=document.createElement('div');t.className='hc-typing';t.innerHTML='<i></i><i></i><i></i>';t.setAttribute('aria-hidden','true');log.appendChild(t);scrollEnd();
    setTimeout(()=>{t.remove();add('bot',esc(it.a)+(it.go?`<br><a class="go" href="${it.go[0]}" data-hcgo>${it.go[1]}</a>`:''));options(it.next,'More questions');busy=false},RM?0:650);
  }
  function open(){box.hidden=false;fab.setAttribute('aria-expanded','true');
    if(!started){started=true;add('bot','Hi! What do you want to know? Tap a question below.');options(START,'Questions')}
    setTimeout(()=>(opts.querySelector('button')||$('#hcX')).focus(),RM?0:200)}
  function close(){box.hidden=true;fab.setAttribute('aria-expanded','false');fab.focus()}
  fab.addEventListener('click',open);$('#hcX').addEventListener('click',close);
  /* phones: tuck the button away while reading down so it never sits on text; it stays off the first screen and comes back on scroll up or near the end */
  let lastY=scrollY;const tuck=y=>fab.classList.toggle('tuck',!(y+innerHeight>=document.documentElement.scrollHeight-160)&&(y<420||y>lastY));
  tuck(lastY);addEventListener('scroll',()=>{const y=scrollY;if(Math.abs(y-lastY)<8)return;tuck(y);lastY=y},{passive:true});
  opts.addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(b)ask(b.dataset.k)});
  log.addEventListener('click',e=>{if(e.target.closest('[data-hcgo]')&&innerWidth<=520)setTimeout(()=>{box.hidden=true;fab.setAttribute('aria-expanded','false')},0)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!box.hidden)close()});
})();

/* ---------- premium scroll layer ---------- */
(function(){
  const sp=$('#sprog'),heroSec=$('.hero'),stage=$('#heroStage'),copy=$('.hero-copy'),pin=$('#sesPin'),bar=$('#sesBar');
  // stagger indexes + hide only what's below the fold
  $$('.stg').forEach(g=>{[...g.children].forEach((c,i)=>c.style.setProperty('--i',i%6))});
  if('IntersectionObserver' in window&&!RM){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
    window.__stgObserve=root=>$$('.stg',root).forEach(g=>{const r=g.getBoundingClientRect();if(r.top>innerHeight&&!g.dataset.seen){g.dataset.seen=1;g.classList.add('pre');io.observe(g)}});
    window.__stgObserve(document);
  }else window.__stgObserve=()=>{};
  // word-by-word statement
  const big=$('.problem .big');
  if(big&&!RM){const wrap=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))f.appendChild(document.createTextNode(t));else{const w=document.createElement('span');w.className='w';w.textContent=t;f.appendChild(w)}});c.replaceWith(f)}else if(c.nodeType===1)wrap(c)})};wrap(big);big.setAttribute('aria-label',big.textContent)}
  const words=big?$$('.w',big):[];
  const pinOn=()=>pin&&!RM&&innerWidth>900;
  if(pinOn())pin.classList.add('on');
  addEventListener('resize',()=>{if(pin)pin.classList.toggle('on',pinOn());tick()},{passive:true});
  let lastSeg=-1,ticking=false;
  function tick(){ticking=false;
    const vh=innerHeight,max=document.documentElement.scrollHeight-vh;
    sp.style.transform=`scaleX(${max>0?Math.min(1,scrollY/max):0})`;
    if(curView!=='home')return;
    if(!RM&&heroSec){const r=heroSec.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/Math.max(1,r.height)));
      if(stage)stage.style.transform=`translateY(${p*-40}px) scale(${1-p*.03})`;if(copy)copy.style.transform=`translateY(${p*24}px)`;hero&&hero.scroll&&hero.scroll(p)}
    if(words.length){const r=big.getBoundingClientRect(),p=Math.min(1,Math.max(0,(vh*.82-r.top)/(r.height+vh*.35)));const n=Math.round(p*words.length);words.forEach((w,i)=>w.classList.toggle('on',i<n))}
    if(pin&&pin.classList.contains('on')){const r=pin.getBoundingClientRect(),span=r.height-vh,p=Math.min(1,Math.max(0,(-r.top+60)/Math.max(1,span)));
      if(bar)bar.style.width=(p*100)+'%';
      let acc=0,idx=0;const tot=SEG.reduce((a,x)=>a+x.m,0);for(let i=0;i<SEG.length;i++){acc+=SEG[i].m/tot;if(p<=acc+1e-6){idx=i;break}idx=i}
      if(idx!==lastSeg){lastSeg=idx;showSeg(idx)}}
  }
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(tick)}},{passive:true});
  // clicking a segment while pinned scrolls to its slice
  sbar.addEventListener('click',e=>{const b=e.target.closest('.seg');if(!b||!pin.classList.contains('on'))return;const i=+b.dataset.i,tot=SEG.reduce((a,x)=>a+x.m,0);let before=0;for(let k=0;k<i;k++)before+=SEG[k].m;const mid=(before+SEG[i].m/2)/tot;const top=pin.getBoundingClientRect().top+scrollY-60+mid*(pin.offsetHeight-innerHeight);lastSeg=i;scrollTo({top,behavior:'smooth'})});
  window.__tick=tick;tick();
})();
})();

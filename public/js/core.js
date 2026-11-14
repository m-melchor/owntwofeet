"use strict";
const SITE=document.documentElement.dataset.base||'/';
/* page language: English at the site root, Spanish under es/ (SITE already points at the right one for page links) */
const LANG=document.documentElement.lang.slice(0,2)==='es'?'es':'en';
/* words for scripts, in the page's language: TXT('help') reads the JSON that <JsText name="help"> put in the page */
const TXT=n=>JSON.parse(document.getElementById('txt-'+n).textContent);
document.documentElement.classList.add('js');
/* fill {name} slots in a sentence from TXT */
const fmt=(s,o)=>String(s).replace(/\{(\w+)\}/g,(_,k)=>o[k]);
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
/* the phrases live in the "acts" words group (win.scam, win.safe, ...) */
const say=k=>{const w=TXT('acts').win[k];return w[Math.floor(Math.random()*w.length)]};
const BITS=['var(--accent)','var(--ink)','#9FC2A0','#E9A98B','#8FB0CC'];
function react(fb,big){if(!fb)return;fb.classList.remove('pop');void fb.offsetWidth;fb.classList.add('pop');if(RM||!fb.classList.contains('ok'))return;
  const b=document.createElement('span');b.className='burst';b.setAttribute('aria-hidden','true');const n=big?18:12;let h='';
  for(let i=0;i<n;i++){const a=(-90+(Math.random()*150-75))*Math.PI/180,d=70+Math.random()*(big?110:70);h+=`<i style="--c:${BITS[i%BITS.length]};--x:${(Math.cos(a)*d).toFixed(0)}px;--y:${(Math.sin(a)*d).toFixed(0)}px;--r:${(Math.random()*360-180).toFixed(0)}deg;animation-delay:${(Math.random()*.12).toFixed(2)}s"></i>`}
  b.innerHTML=h;fb.appendChild(b);setTimeout(()=>b.remove(),1300)}
/* finished activities: only these ids are stored on this device (key otf-done); storage may be blocked */
const DONE_KEY='otf-done',ACT={tools:'pracTools',budget:'pracBudget',scams:'pracScams',call:'pracCall',laundry:'pracLaundry'},ORDER=['tools','budget','scams','call','laundry'];
const doneMem=new Set();
function doneRead(){try{const a=JSON.parse(localStorage.getItem(DONE_KEY));return Array.isArray(a)?a.filter(x=>x in ACT):[]}catch(e){return []}}
function paintDone(){$$('[data-done]').forEach(c=>c.hidden=!doneMem.has(c.dataset.done))}
doneRead().forEach(x=>doneMem.add(x));paintDone();
function doneSet(id){doneMem.add(id);const a=doneRead();if(!a.includes(id)){a.push(id);try{localStorage.setItem(DONE_KEY,JSON.stringify(a))}catch(e){}}paintDone()}
function pracHide(id){$('#'+ACT[id]).hidden=true}
function finish(id){const A=TXT('acts');doneSet(id);const el=$('#'+ACT[id]),i=ORDER.indexOf(id),nx=ORDER.slice(1).map((_,k)=>ORDER[(i+k+1)%ORDER.length]).find(x=>!doneMem.has(x));
  el.innerHTML=`<div class="pc"><h3>${A.practiced}</h3><ul class="results">${A.prac[id].map(s=>`<li class="pass">${I.check}<span>${s}</span></li>`).join('')}</ul></div><div class="pbtns"><button class="btn btn-ink" type="button" data-pnext="${nx||'activities'}">${nx?A.next+' '+A.names[nx]:A.seeAll}</button><a class="btn btn-line" href="${SITE}#interest">${A.join}</a></div>`;countEvent('activity-done/'+id);
  el.hidden=false;toast(fmt(A.finished,{n:A.names[id]}))}
/* finished-activity buttons go to the next activity page (or back to the picker) */
$$('.practiced').forEach(p=>p.addEventListener('click',e=>{const b=e.target.closest('[data-pnext]');if(b)location.href=SITE+'activities/'+(b.dataset.pnext==='activities'?'':b.dataset.pnext+'/')}));
/* which page this is: the view wrapper names it, an activity page also holds one activity */
const curView=($('[data-view]')||{dataset:{}}).dataset.view||null,curAct=($('#actScreens .activity')||{}).id||null;
const hdr=$('#siteHeader');addEventListener('scroll',()=>hdr.classList.toggle('scrolled',scrollY>8),{passive:true});
/* shuffles shared by the activities */
const bMix=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* ---------- reveal ---------- */
if('IntersectionObserver' in window&&!RM){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px'});$$('.reveal').forEach(r=>{if(r.getBoundingClientRect().top>innerHeight){r.classList.add('pre');io.observe(r)}})}

/* ---------- visit counter ---------- */
/* visit counter: one count per view shown; waits for the GoatCounter script on first load, does nothing if it's blocked */
function countVisit(view){const go=()=>window.goatcounter&&window.goatcounter.count&&window.goatcounter.count({path:'/'+(LANG==='es'?'es/':'')+view,title:view});window.goatcounter&&window.goatcounter.count?go():addEventListener('load',go,{once:true})}
/* funnel events for the smoke test: activity finished, sign-up sent (only after Formspree answers OK) */
function countEvent(name){try{window.goatcounter&&window.goatcounter.count&&window.goatcounter.count({path:name,title:name,event:true})}catch(e){}}
countVisit(curAct?'activities/'+curAct:curView);

const nav=$('#nav'),mb=$('#menuBtn');
function closeMenu(){nav.dataset.open='false';mb.setAttribute('aria-expanded','false')}
mb.addEventListener('click',()=>{const o=nav.dataset.open!=='true';nav.dataset.open=String(o);mb.setAttribute('aria-expanded',String(o));if(o)nav.querySelector('a').focus()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.dataset.open==='true'){closeMenu();mb.focus()}});
/* language switcher: one menu open at a time, closes on an outside tap or Escape */
const lang=$('#lang');
lang.addEventListener('toggle',()=>{if(lang.open)closeMenu()});
mb.addEventListener('click',()=>{lang.open=false});
document.addEventListener('click',e=>{if(lang.open&&!lang.contains(e.target))lang.open=false});
/* a "Join" button with data-pick remembers its choice so the interest form on the next page can pick it */
document.addEventListener('click',e=>{const b=e.target.closest('[data-pick]');if(b)try{sessionStorage.setItem('otf-pick',b.dataset.pick)}catch(_){}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lang.open){lang.open=false;lang.querySelector('summary').focus()}});
/* language links (switcher and footer) go to the same page in the other language, keep the spot on the page and remember the choice */
document.addEventListener('click',e=>{const a=e.target.closest('a[data-setlang]');if(!a)return;try{localStorage.setItem('otf-lang',a.dataset.setlang)}catch(_){}if(location.hash.length>1){e.preventDefault();location.href=a.getAttribute('href')+location.hash}});

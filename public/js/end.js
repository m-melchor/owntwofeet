"use strict";
/* ---------- same-page links: scroll to the target under the sticky header ---------- */
function goHash(h,smooth){const t=h&&document.getElementById(h);if(!t)return;if(t.matches('details'))t.open=true;
  $$('.reveal.pre,.stg.pre').forEach(r=>r.classList.remove('pre'));
  const top=Math.max(0,t.getBoundingClientRect().top+scrollY-84),far=Math.abs(top-scrollY)>innerHeight*2;scrollTo({top,behavior:(RM||!smooth||far)?'instant':'smooth'});
  const f=t.matches('details')?t.querySelector('summary'):t.querySelector('h2,h3');if(f){f.tabIndex=-1;f.focus({preventScroll:true})}}
document.addEventListener('click',e=>{const a=e.target.closest('a[href*="#"]');if(!a||a.origin!==location.origin||a.pathname!==location.pathname||a.hash.length<2||!document.getElementById(a.hash.slice(1)))return;
  e.preventDefault();closeMenu();try{history.pushState(null,'',a.hash)}catch(_){}goHash(a.hash.slice(1),true)});
addEventListener('popstate',()=>goHash(location.hash.slice(1),false));
if(location.hash)requestAnimationFrame(()=>goHash(location.hash.slice(1),false));

/* ---------- help chat (preset answers, nothing sent anywhere) ---------- */
(function(){
  const fab=$('#hcFab'),box=$('#hc'),log=$('#hcLog'),opts=$('#hcOpts');
  const A={
   what:{q:'What is Own Two Feet?',a:'Own Two Feet runs live, in-person workshops where boys and young men practice everyday skills: basic tools, online safety, money, simple cooking, communication and knowing when to ask for help.',go:[SITE+'workshops/','How workshops work'],next:['who','status','cost']},
   status:{q:'Are workshops running yet?',a:'Not yet. Own Two Feet is a student venture that’s still in development, so no workshops are running or booking. Join the interest list and we’ll email you when we launch.',go:[SITE+'#interest','Join the interest list'],next:['host','what']},
   who:{q:'Who is it for?',a:'Boys and young men in grades 3 to 8. Activities are matched to their age, and topics for older students come later.',go:[SITE+'workshops/','See age groups'],next:['safe','modules']},
   modules:{q:'What do students learn?',a:'Eight topics: home and tools, tech and online safety, personal care, simple cooking, money, communication, knowing when to ask for help, and car basics later on. Schools pick the ones they want.',go:[SITE+'#cur-h','See the topics'],next:['session','try']},
   session:{q:'What happens in a session?',a:'50 or 90 minutes: start with a real-life situation, watch a mentor do it, practice it yourself, then wrap up with when to ask for help and a card to take home.',go:[SITE+'#ses-h','See a session'],next:['safe','host']},
   host:{q:'Can my school get a workshop?',a:'Not yet, since we’re not booking. Join the interest list and check “Workshops for my students.” Once we launch, you’d provide a room, up to 30 students and an adult who knows them. We’d bring everything else.',go:[SITE+'#interest','Join the interest list'],next:['cost','safe']},
   cost:{q:'How much will it cost?',a:'We plan to charge $200 for a 50-minute workshop and $300 for a 90-minute one, per session, for up to 30 students. We bring the supplies. Or run our activities yourself with a monthly online plan: $9.99 a month for a teacher or volunteer who shows proof, or $19.99 a month for a team of three. These are planned prices, and nothing is booking yet.',go:[SITE+'workshops/','See planned prices'],next:['host','status']},
   safe:{q:'How do you keep it safe?',a:'Everything is supervised and right for their age. No electrical, gas or dangerous repairs, and every topic covers when to stop and get an adult or a pro.',next:['session','who']},
   parents:{q:'I’m a parent. How can I help?',a:'Join the interest list as a parent or guardian to hear about family workshop days, or suggest skills you’d like covered.',go:[SITE+'get-involved/','Get involved'],next:['what','status']},
   try:{q:'Can I try an activity?',a:'Yes! There are five you can try right now: Tool Time, Saturday on $25, Scam or Safe?, Make the Call and Laundry Sort-Out.',go:[SITE+'activities/','Open activities'],next:['modules','what']},
   person:{q:'Can I talk to a person?',a:'This chat can only answer the questions listed here. To reach our team, join the interest list and put your question in the notes box. We’ll get back to you.',go:[SITE+'#interest','Leave a note'],next:['what','host']}
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
  if(pin)sbar.addEventListener('click',e=>{const b=e.target.closest('.seg');if(!b||!pin.classList.contains('on'))return;const i=+b.dataset.i,tot=SEG.reduce((a,x)=>a+x.m,0);let before=0;for(let k=0;k<i;k++)before+=SEG[k].m;const mid=(before+SEG[i].m/2)/tot;const top=pin.getBoundingClientRect().top+scrollY-60+mid*(pin.offsetHeight-innerHeight);lastSeg=i;scrollTo({top,behavior:'smooth'})});
  window.__tick=tick;tick();
})();

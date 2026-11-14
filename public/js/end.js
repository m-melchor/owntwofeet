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
  const trig=$$('[data-hc]'),box=$('#hc'),log=$('#hcLog'),opts=$('#hcOpts');
  const HT=TXT('hc');
  // text lives in src/i18n/*/chat.json; links and follow-up questions stay here
  const AX={what:[SITE+'workshops/',['who','video','cost']],status:[SITE+'#interest',['host','what']],who:[SITE+'workshops/',['safe','modules']],modules:[SITE+'#cur-h',['session','try']],session:[SITE+'workshops/#ses-h',['safe','host']],host:[SITE+'#interest',['cost','safe']],cost:[SITE+'workshops/',['host','status']],video:[0,['session','safe']],safe:[0,['session','who']],parents:[SITE+'get-involved/',['what','status']],try:[SITE+'activities/',['modules','what']],person:[SITE+'#interest',['what','host']]};
  const A={};for(const k in AX){const x=HT.a[k];A[k]={q:x.q,a:x.a,next:AX[k][1]};if(AX[k][0])A[k].go=[AX[k][0],x.go]}
  const START=['what','status','who','host','cost','try','person'];
  let started=false,busy=false;
  const scrollEnd=()=>{log.scrollTop=log.scrollHeight};
  function add(cls,html){const d=document.createElement('div');d.className='hc-msg '+cls;d.innerHTML=html;log.appendChild(d);scrollEnd();return d}
  function options(keys,label){opts.innerHTML=`<span class="lbl">${label}</span>`+keys.map(k=>`<button class="hc-opt" type="button" data-k="${k}">${A[k].q}</button>`).join('')+(keys===START?'':'<button class="hc-opt alt" type="button" data-k="__menu">'+HT.all+'</button>')}
  function ask(k){if(busy)return;
    if(k==='__menu'){options(START,HT.questions);opts.querySelector('button')?.focus();return}
    const it=A[k];busy=true;add('me',esc(it.q));opts.innerHTML='';
    const t=document.createElement('div');t.className='hc-typing';t.innerHTML='<i></i><i></i><i></i>';t.setAttribute('aria-hidden','true');log.appendChild(t);scrollEnd();
    setTimeout(()=>{t.remove();add('bot',esc(it.a)+(it.go?`<br><a class="go" href="${it.go[0]}" data-hcgo>${it.go[1]}</a>`:''));options(it.next,HT.more);busy=false},RM?0:650);
  }
  /* opened from the Questions button in the header (desktop) or in the menu (phones); on desktop the panel drops from under the header */
  const hdr=$('#siteHeader');let opener=null;
  const setX=v=>trig.forEach(b=>b.setAttribute('aria-expanded',v));
  function open(e){opener=e&&e.currentTarget||null;closeMenu();box.style.setProperty('--hc-top',Math.max(12,hdr.getBoundingClientRect().bottom+10)+'px');box.hidden=false;setX('true');
    if(!started){started=true;add('bot',HT.hi);options(START,HT.questions)}
    setTimeout(()=>(opts.querySelector('button')||$('#hcX')).focus(),RM?0:200)}
  function close(){box.hidden=true;setX('false');const o=opener&&opener.offsetParent?opener:$('.hc-open');if(o&&o.offsetParent)o.focus()}
  trig.forEach(b=>b.addEventListener('click',e=>box.hidden?open(e):close()));$('#hcX').addEventListener('click',close);
  document.addEventListener('click',e=>{const p=e.composedPath();if(!box.hidden&&!p.includes(box)&&!p.some(n=>n.dataset&&'hc' in n.dataset))close()});
  opts.addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(b)ask(b.dataset.k)});
  log.addEventListener('click',e=>{if(e.target.closest('[data-hcgo]')&&innerWidth<=520)setTimeout(()=>{box.hidden=true;setX('false')},0)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!box.hidden)close()});
})();

/* ---------- premium scroll layer ---------- */
(function(){
  const sp=$('#sprog'),sd=$('#sdots'),dots=$$('i',sd),foot=$('footer.site'),heroSec=$('.hero'),stage=$('#heroStage'),copy=$('.hero-copy');
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
  addEventListener('resize',()=>tick(),{passive:true});
  let ticking=false;
  function tick(){ticking=false;
    const vh=innerHeight,max=document.documentElement.scrollHeight-vh;
    const prog=max>0?Math.min(1,Math.max(0,scrollY/max)):0,ft=foot?foot.getBoundingClientRect().top:1e9;
    sp.style.setProperty('--p',prog.toFixed(4));sp.classList.toggle('dark',ft<vh*.5);
    const on=Math.round(prog*(dots.length-1));dots.forEach((d,i)=>d.classList.toggle('on',i<=on));sd.classList.toggle('dark',ft<vh-24);
    if(curView!=='home')return;
    if(!RM&&heroSec){const r=heroSec.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/Math.max(1,r.height)));
      if(stage)stage.style.transform=`translateY(${p*-40}px) scale(${1-p*.03})`;if(copy)copy.style.transform=`translateY(${p*24}px)`;hero&&hero.scroll&&hero.scroll(p)}
    if(words.length){const r=big.getBoundingClientRect(),p=Math.min(1,Math.max(0,(vh*.82-r.top)/(r.height+vh*.35)));const n=Math.round(p*words.length);words.forEach((w,i)=>w.classList.toggle('on',i<n))}
  }
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(tick)}},{passive:true});
  window.__tick=tick;tick();
  /* desktop: the footprint trail stands in for the scrollbar, so it can be clicked or dragged like one */
  const jump=e=>{const r=sp.getBoundingClientRect(),f=Math.min(1,Math.max(0,(e.clientY-r.top)/r.height));scrollTo({top:f*(document.documentElement.scrollHeight-innerHeight),behavior:'instant'})};
  sp.addEventListener('pointerdown',e=>{sp.setPointerCapture(e.pointerId);sp.classList.add('drag');jump(e)});
  sp.addEventListener('pointermove',e=>{if(sp.hasPointerCapture(e.pointerId))jump(e)});
  ['pointerup','pointercancel'].forEach(t=>sp.addEventListener(t,()=>sp.classList.remove('drag')));
})();

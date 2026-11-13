/* Scroll status for the plain pages (manuals, privacy, 404). Same behavior as the main site's end.js scroll layer: the trail fills as you scroll and can be clicked or dragged; phones get dots. */
(function(){
  const d=document,root=d.documentElement;
  root.classList.add('sp');
  const sp=d.createElement('div');sp.className='sprog';sp.setAttribute('aria-hidden','true');sp.innerHTML='<i class="trail"></i><i class="fill"></i>';
  const sd=d.createElement('div');sd.className='sdots';sd.setAttribute('aria-hidden','true');sd.innerHTML='<i></i>'.repeat(10);
  d.body.append(sp,sd);
  const dots=[...sd.children],foot=d.querySelector('footer.site-foot');
  // only switch to light marks over the footer when the footer is dark
  const darkFoot=()=>foot&&getComputedStyle(foot).color==='rgb(255, 255, 255)';
  let ticking=false;
  function tick(){ticking=false;
    const vh=innerHeight,max=root.scrollHeight-vh,p=max>0?Math.min(1,Math.max(0,scrollY/max)):0;
    const ft=darkFoot()&&foot.offsetHeight?foot.getBoundingClientRect().top:1e9;
    sp.style.visibility=sd.style.visibility=max>2?'':'hidden'; // nothing to show on a page that fits one screen
    sp.style.setProperty('--p',p.toFixed(4));sp.classList.toggle('dark',ft<vh*.5);
    const on=Math.round(p*(dots.length-1));dots.forEach((x,i)=>x.classList.toggle('on',i<=on));sd.classList.toggle('dark',ft<vh-24);
  }
  const req=()=>{if(!ticking){ticking=true;requestAnimationFrame(tick)}};
  addEventListener('scroll',req,{passive:true});addEventListener('resize',req,{passive:true});
  // manual screens change the page height without a scroll
  addEventListener('click',()=>setTimeout(req,60));
  tick();
  const jump=e=>{const r=sp.getBoundingClientRect(),f=Math.min(1,Math.max(0,(e.clientY-r.top)/r.height));scrollTo({top:f*(root.scrollHeight-innerHeight),behavior:'instant'})};
  sp.addEventListener('pointerdown',e=>{sp.setPointerCapture(e.pointerId);sp.classList.add('drag');jump(e)});
  sp.addEventListener('pointermove',e=>{if(sp.hasPointerCapture(e.pointerId))jump(e)});
  ['pointerup','pointercancel'].forEach(t=>sp.addEventListener(t,()=>sp.classList.remove('drag')));
})();

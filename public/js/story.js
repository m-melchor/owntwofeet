"use strict";
const ivRow=$('#ivRow');
if(ivRow){const cs=[...ivRow.children],cnt=$('#ivCount');let ivI=0;
  const cur=()=>{if(ivRow.scrollLeft+ivRow.clientWidth>=ivRow.scrollWidth-4)return cs.length-1;let b=0,d=1e9;cs.forEach((c,j)=>{const x=Math.abs(c.offsetLeft-ivRow.scrollLeft);if(x<d){d=x;b=j}});return b};
  const upd=i=>{ivI=i;cnt.textContent=`${i+1} of ${cs.length}`};
  ivRow.addEventListener('scroll',()=>upd(cur()),{passive:true});
  const go=i=>{i=(i+cs.length)%cs.length;upd(i);ivRow.scrollTo({left:cs[i].offsetLeft,behavior:RM?'auto':'smooth'})};
  $('#ivPrev').addEventListener('click',()=>go(ivI-1));$('#ivNext').addEventListener('click',()=>go(ivI+1))}
const commits=$('#commits');
if(commits){const mq=matchMedia('(min-width:900px)'),ds=$$('details',commits);
  const sync=()=>ds.forEach((d,i)=>{d.open=mq.matches||i===0;d.firstElementChild.tabIndex=mq.matches?-1:0});
  sync();mq.addEventListener('change',sync);
  commits.addEventListener('click',e=>{if(mq.matches&&e.target.closest('summary'))e.preventDefault()})}

/* ---------- voices ---------- */
/* why-we-started quotes: one at a time, every figure stays stacked in the same cell so the band never changes height.
   Auto-rotation runs only while the band is on screen and restarts its 8 s clock each time the band comes into view, so the first quote you see always gets its full time. It also never flips a quote while the page is still being scrolled: phones hold timers during a scroll and used to fire the change the moment the finger stopped, which looked like the quote changed on scroll. Prev/Next ends auto-rotation. */
const FQ=$$('#vq .fq');let qi=0,qTimer=null,qAuto=!RM,qScroll=0;
function showQ(i){qi=(i+FQ.length)%FQ.length;FQ.forEach((f,j)=>f.classList.toggle('on',j===qi));$('#vqCount').textContent=`${qi+1} of ${FQ.length}`}
function stopQ(){clearTimeout(qTimer);qTimer=null;qAuto=false;$('#vq').setAttribute('aria-live','polite')}/* screen readers hear a quote only after someone taps Prev or Next, never on the timer */
function queueQ(ms){clearTimeout(qTimer);qTimer=setTimeout(tickQ,ms)}
function tickQ(){if(!qAuto)return;if(performance.now()-qScroll<700){queueQ(900);return}if(!document.hidden)showQ(qi+1);queueQ(8000)}
$('#vqPrev').addEventListener('click',()=>{stopQ();showQ(qi-1)});$('#vqNext').addEventListener('click',()=>{stopQ();showQ(qi+1)});
addEventListener('scroll',()=>{qScroll=performance.now()},{passive:true});
if(qAuto){if('IntersectionObserver' in window)new IntersectionObserver(es=>{if(es[0].isIntersecting)queueQ(8000);else{clearTimeout(qTimer);qTimer=null}},{threshold:.5}).observe($('#vq'));else queueQ(8000)}

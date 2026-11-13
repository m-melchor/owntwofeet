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

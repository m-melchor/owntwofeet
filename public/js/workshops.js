"use strict";
/* ---------- workshops age tabs, story interview row, story commitments ---------- */
const ageTl=$('#ageTabs');
if(ageTl){const tabs=$$('[role=tab]',ageTl),panels=tabs.map(t=>$('#'+t.getAttribute('aria-controls')));
  const pick=(i,f)=>{tabs.forEach((t,j)=>{t.setAttribute('aria-selected',j===i);t.tabIndex=j===i?0:-1;panels[j].classList.toggle('on',j===i)});if(f)tabs[i].focus()};
  ageTl.addEventListener('click',e=>{const t=e.target.closest('[role=tab]');if(t)pick(tabs.indexOf(t))});
  ageTl.addEventListener('keydown',e=>{const c=tabs.indexOf(document.activeElement),n=tabs.length,k={ArrowRight:(c+1)%n,ArrowLeft:(c+n-1)%n,Home:0,End:n-1}[e.key];if(k!==undefined&&c>-1){e.preventDefault();pick(k,1)}})}

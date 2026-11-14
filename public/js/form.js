"use strict";
/* ---------- form: four steps, one open at a time; with no script every step shows and the form posts as is ---------- */
const FT=TXT('formjs'),holder=$('#formHolder');
const form=$('#interestForm',holder),done=$('#formDone',holder);
const PREF={inperson:'An in-person workshop',teacher:'Teacher plan, $9.99 a month',team:'Team plan, $19.99 a month',printables:'Printable guides',family:'Family days',mentor:'Volunteering with us',updates:'Just launch updates',unsure:'Not sure yet'};
const INT={inperson:'Workshops for my students',teacher:'Monthly plan',team:'Monthly plan',printables:'Printable guides',family:'Family days',mentor:'Volunteering',updates:'Just launch updates',unsure:'Not sure yet'};
const steps=$$('.fstep',form),stepTxt=$('#fStepTxt',form),dots=$$('.fdots i',form);
let cur=1,tried=false,ptr=false;
const roleIn=()=>$('input[name=role]:checked',form),prefIn=()=>$('input[name=prefer]:checked',form);
function setErr(id,m,inp){$('#'+id,holder).textContent=m;if(inp)inp.setAttribute('aria-invalid',m?'true':'false')}
// step 2 shows only the choices that fit the role picked in step 1
function fitPrefs(){const r=roleIn(),k=r&&r.dataset.r;$$('[data-for]',form).forEach(l=>{const show=!k||l.dataset.for.split(' ').includes(k);l.hidden=!show;if(!show)$('input',l).checked=false})}
// checks one step, shows its errors, and returns the first field to fix (or null)
function check(n){
  if(n===1){const r=roleIn();setErr('e-role',r?'':FT.pickRole);return r?null:$('input[name=role]',form)}
  if(n===2){const p=prefIn();setErr('e-pref',p?'':FT.pickPref);return p?null:$('label:not([hidden]) input[name=prefer]',form)}
  if(n===3){const nm=$('#f-name',form),em=$('#f-email',form),ev=em.value.trim();let first=null;
    if(nm.value.trim().length<2){setErr('e-name',FT.name,nm);first=nm}else setErr('e-name','',nm);
    if(!ev){setErr('e-email',FT.emailEmpty,em);first=first||em}else if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(ev)){setErr('e-email',FT.emailBad,em);first=first||em}else setErr('e-email','',em);
    return first}
  const ad=$('#f-adult',form);if(!ad.checked){setErr('e-adult',FT.adult,ad);return ad}setErr('e-adult','',ad);return null}
function go(n,focus=true){cur=n;steps.forEach(s=>s.classList.toggle('on',+s.dataset.step===n));stepTxt.textContent=FT.step.replace('{n}',n);dots.forEach((d,i)=>d.classList.toggle('on',i<n));
  if(!focus)return;$('.ftitle',steps[n-1]).focus({preventScroll:true});const b=form.getBoundingClientRect();if(b.top<70||b.top>innerHeight*.7)form.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})}
function next(){const bad=check(cur);if(bad){bad.focus();return}go(cur+1)}
form.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;const n=+b.dataset.go;n>cur?next():go(n)});
// a tap on a choice in steps 1 and 2 opens the next step; arrow keys only move the choice
form.addEventListener('pointerdown',()=>{ptr=true});form.addEventListener('keydown',()=>{ptr=false});
form.addEventListener('change',e=>{const t=e.target;if(t.name==='role')fitPrefs();if(tried)check(cur);
  if(ptr&&(t.name==='role'||t.name==='prefer')){const at=cur;setTimeout(()=>{if(cur===at)next()},RM?0:220)}});
form.addEventListener('input',()=>{if(tried)check(cur)});
const send=$('#formSend',form),ferr=$('#formErr',form);let sending=false;
form.addEventListener('submit',async e=>{e.preventDefault();if(sending)return;
  if(cur<4){next();return} // Enter in a text box moves on instead of sending
  tried=true;ferr.hidden=true;
  for(let n=1;n<=4;n++){const bad=check(n);if(bad){go(n,false);bad.focus();toast(FT.attention);return}}
  const p=prefIn().value,data={Name:$('#f-name',form).value.trim(),Email:$('#f-email',form).value.trim(),Organization:$('#f-org',form).value.trim()||'Not given',Role:roleIn().value,'Best fit':PREF[p]};
  // what the thank-you list shows: English shows the values sent, Spanish shows the labels the person saw
  const shown=LANG==='es'?{...data,Organization:$('#f-org',form).value.trim()||FT.notGiven,Role:roleIn().closest('label').textContent.trim(),'Best fit':prefIn().closest('label').textContent.trim()}:data;
  const fd=new FormData(form);fd.set('interest',INT[p]);fd.set('prefer',PREF[p]);fd.set('adult','Yes, 18 or older');
  sending=true;send.disabled=true;send.textContent=FT.sending;
  try{const res=await fetch(form.action,{method:'POST',body:fd,headers:{Accept:'application/json'}});if(!res.ok)throw new Error('status '+res.status)}
  catch(err){sending=false;send.disabled=false;send.textContent=FT.send;ferr.hidden=false;toast(FT.failed);return}
  sending=false;send.disabled=false;send.textContent=FT.send;countEvent('signup-sent');
  $('#formSummary',holder).innerHTML=Object.entries(shown).map(([k,x])=>`<dt>${FT.labels[k]}</dt><dd>${esc(x)}</dd>`).join('');form.hidden=true;done.hidden=false;done.focus();toast(FT.sent)});
$('#formAgain',holder).addEventListener('click',()=>{tried=false;form.reset();fitPrefs();ferr.hidden=true;$$('[aria-invalid]',form).forEach(i=>i.removeAttribute('aria-invalid'));$$('.err',form).forEach(x=>x.textContent='');done.hidden=true;form.hidden=false;go(1)});
/* a "Join" button with data-pick (a plan or a path) picks that choice in the form; core.js keeps it for one page change */
function applyPick(k){try{k=k||sessionStorage.getItem('otf-pick');sessionStorage.removeItem('otf-pick')}catch(e){}
  const p=k&&$(`input[name=prefer][value="${k}"]`,form);if(!p||!done.hidden)return false;
  const auto={family:'parent',mentor:'volunteer'}[k];if(!roleIn()&&auto)$(`input[data-r="${auto}"]`,form).checked=true;
  fitPrefs();if(!p.closest('label').hidden)p.checked=true;go(roleIn()?(prefIn()?3:2):1,false);return true}
if(applyPick())toast(FT.picked);
document.addEventListener('click',e=>{const b=e.target.closest('[data-pick]');if(!b||(b.tagName==='A'&&b.pathname!==location.pathname)||!applyPick(b.dataset.pick))return;toast(FT.picked);
  if(b.tagName==='BUTTON'){holder.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});setTimeout(()=>$('.ftitle',steps[cur-1]).focus({preventScroll:true}),RM?0:450)}});
go(1,false);

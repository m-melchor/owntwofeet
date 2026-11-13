"use strict";
/* ---------- form ---------- */
const holder=$('#formHolder');
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

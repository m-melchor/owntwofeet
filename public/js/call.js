"use strict";
/* ---------- make the call: each step has 3 choices (good, vague, off); r = the desk's reply, "~" = note, "~~" = hold ---------- */
/* three scenarios; one is picked at random each play, never the same one twice in a row. mkCall builds the six steps from a scenario's words (all words come from the "actCall" group) */
const TC=TXT('actCall');
const CALLS=TC.calls;
function mkCall(S){const V={...S,P:fmt(TC.withPro,S),ct:fmt(TC.ct,S)},F=s=>fmt(s,V),ex=a=>a.flatMap(l=>l==='@hold'?TC.hold.map(F):[F(l)]);
 return TC.st.map(s=>({q:F(s.q),s:F(s.s),n:F(s.n),c:s.c.map(c=>({y:c.y,t:F(c.t),r:ex(c.r),...(c.tip?{tip:F(c.tip)}:{})}))}))}
let CS=mkCall(CALLS[0]),cLast=-1;
const CN=CS.length;
function cScene(){let i;do i=Math.floor(Math.random()*CALLS.length);while(CALLS.length>1&&i===cLast);cLast=i;const S=CALLS[i];CS=mkCall(S);cl.S=S;
  $('#callBiz').textContent=S.biz;$('#callAv').textContent=S.av;$('#callPhone').setAttribute('aria-label',fmt(TC.phoneLabel,S));$('#callIntro').textContent=S.intro+' '+TC.introTail;
  $('#callWeek').innerHTML=`<h4>${TC.weekH}</h4><p>${esc(S.week[0])}</p>`+S.week.slice(1).map(([d,t])=>`<div><span>${esc(d)}</span><b>${esc(t)}</b></div>`).join('');return S}
let cl=null,ctick=0;
const cFmt=ms=>{const s=Math.floor(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
function cTx(k,t,x){const p=document.createElement('p');p.className='ln '+k+(x?' '+x:'');p.textContent=t;const w=$('#callTx');w.appendChild(p);w.scrollTop=w.scrollHeight;return p}
function cStatus(t){$('#callSt').textContent=t}
function cStop(){clearInterval(ctick);ctick=0;clearTimeout(cl&&cl.to)}
function cTimer(){if(ctick)return;cl.t0=Date.now();ctick=setInterval(()=>{$('#callTime').textContent=cFmt(Date.now()-cl.t0)},500)}
function cReset(quiet){if(cl)cStop();cl={i:0,g:0,got:[],busy:false,o:shuf([0,1,2]),t0:0,to:0};const S=cScene();$('#callTime').textContent='0:00';$('#callTx').innerHTML='';cTx('desk',fmt(TC.greet,S));cStatus(TC.connected);pracHide('call');cRender();if(!quiet)toast(TC.reset)}
function cRender(){const fb=$('#callFb'),o=$('#callOpts');$('#callProg').innerHTML=CS.map((_,j)=>`<i class="${j<cl.i?'done':j===cl.i?'cur':''}"></i>`).join('');fb.className='fb';fb.innerHTML='';$('#callNext').hidden=$('#callAgain').hidden=true;
  if(cl.i>=CN)return cEnd();
  const st=CS[cl.i];$('#callStep').textContent=fmt(TC.stepOf,{i:cl.i+1,n:CN});$('#callQ').textContent=st.q;$('#callWeek').hidden=false;
  o.innerHTML=cl.o.map(k=>`<button class="btn btn-line" type="button" data-ci="${k}" data-y="${st.c[k].y}">${esc(st.c[k].t)}</button>`).join('')}
function cPlay(L,k,id){if(cl.id!==id)return;for(;k<L.length;k++){const l=L[k];
    if(l==='~~'){cStatus(TC.onHold);const h=cTx('sys',TC.holdMsg,'hold');cl.to=setTimeout(()=>{h.classList.remove('hold');cStatus(TC.onCall);cPlay(L,k+1,id)},RM?0:1500);return}
    l[0]==='~'?cTx('sys',l.slice(1)):cTx('desk',l)}
  cAfter()}
function cAfter(){const st=CS[cl.i],ch=st.c[cl.pick],good=ch.y==='good',fb=$('#callFb');if(good)cl.g++;cl.got[cl.i]=good;
  fb.className='fb '+(good?'ok':'no');fb.innerHTML=good?`<h4>${say('call')}</h4><p class="hab">${TC.goodFb}</p>`:`<h4>${TC.tryNext}</h4><p class="hab">${esc(ch.tip)}</p>`;react(fb);
  const S=cl.S;cStatus(fmt(good?TC.happy:ch.y==='clash'?TC.fixed:ch.y==='vague'?TC.confused:TC.putOff,S));
  const n=$('#callNext');n.textContent=cl.i===CN-1?TC.seeHow:TC.next;n.hidden=false;n.focus({preventScroll:true});cl.busy=false}
function cPick(k){if(cl.busy||cl.i>=CN)return;cl.busy=true;cl.pick=k;cl.id=(cl.id||0)+1;cTimer();const ch=CS[cl.i].c[k];
  $$('#callOpts .btn').forEach(b=>{b.disabled=true;b.classList.toggle('picked',+b.dataset.ci===k)});cTx('me',ch.t);cStatus(TC.onCall);cPlay(ch.r,0,cl.id)}
function cEnd(){const dur=cl.t0?cFmt(Date.now()-cl.t0):'0:00',fb=$('#callFb'),good=CS.filter((_,j)=>cl.got[j]),miss=CS.find((_,j)=>!cl.got[j]);cStop();
  $('#callTime').textContent=dur;cStatus(TC.callEnded);cTx('sys',TC.callEnded);$('#callStep').textContent=TC.callEnded;$('#callQ').textContent=TC.howQ;$('#callOpts').innerHTML='';$('#callWeek').hidden=true;
  fb.className=cl.g>=4?'fb ok':'fb plain';fb.innerHTML=`<div class="result">${cl.g?`<div class="score">${cl.g}<small>${fmt(TC.outOf,{n:CN})}</small></div>`:`<p><b>${TC.callDone}</b></p>`}<ul class="results">${(good.length?good.slice(0,3).map(s=>s.s):[TC.stayed]).map(s=>`<li class="pass">${I.check}<span>${esc(s)}</span></li>`).join('')}</ul><p class="hab"><b>${TC.tryNextB}</b> ${esc(miss?miss.n:TC.jot)}</p></div>`;
  react(fb,true);$('#callAgain').hidden=false;finish('call');
  cl.to=setTimeout(()=>{if(cl&&cl.i>=CN){cTx('sys',TC.newText);cTx('desk',cl.S.confirm)}},RM?0:1200)}
$('#callOpts').addEventListener('click',e=>{const b=e.target.closest('[data-ci]');if(b&&!b.disabled)cPick(+b.dataset.ci)});
$('#callNext').addEventListener('click',()=>{if(cl.busy)return;cl.i++;cl.o=shuf([0,1,2]);cRender();if(cl.i<CN){$('#callOpts .btn').focus({preventScroll:true})}});
$('#callAgain').addEventListener('click',()=>cReset());$('#callReset').addEventListener('click',()=>cReset());cReset(true);

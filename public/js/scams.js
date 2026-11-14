"use strict";
/* ---------- Scam or Safe ---------- */
const TS=TXT('actScams');
/* which of the 12 messages are scams (1) or safe (0); the words come from the "actScams" group */
const MS=TS.ms.map((m,i)=>({...m,x:[1,1,0,1,0,1,1,1,1,1,0,0][i]}));
const SN=6;
const sDeal=()=>shuf([...shuf(MS.filter(m=>m.x)).slice(0,4),...shuf(MS.filter(m=>!m.x)).slice(0,2)]);
let sq={q:sDeal(),i:0,s:0,ph:'call',fd:[],hint:''};
const sCur=()=>sq.q[sq.i];
function sFlags(m,mode){let n=0;const r=s=>esc(s).replace(/\[(.+?)\]/g,(_,t)=>{const j=n++,f=sq.fd.includes(j);return mode==='tap'?`<span role="button" tabindex="0" class="flag${f?' on':''}" data-j="${j}" aria-pressed="${f}">${t}</span>`:mode==='show'?`<mark${f?'':' class="miss"'}>${t}</mark>`:t});return [r(m.f),r(m.b)]}
function sBubble(){const m=sCur(),[f,b]=sFlags(m,sq.ph==='call'?'plain':sq.ph);$('#scamFrom').innerHTML=f;$('#scamBody').innerHTML=b}
function sStamp(m){const st=$('#scamStamp');if(!m){st.hidden=true;return}st.textContent=m.x?TS.scam:TS.safe;st.className='stamp'+(m.x?'':' safe');st.hidden=false}
function sAfter(m,h){const a=$('#scamAfter');if(!h){a.innerHTML='';return}if(a.innerHTML||!sq.ok)return;setTimeout(()=>{if(sCur()===m)a.innerHTML=h},RM?0:650)}
function sRender(){const fb=$('#scamFb');$('#scamProg').innerHTML=sq.q.map((m,j)=>`<i class="${j<sq.i||sq.i>=SN?'done':j===sq.i?'cur':''}"></i>`).join('');$('#scamShow').hidden=true;sStamp(null);sAfter(null);
  if(sq.i>=SN){$('#scamFrom').textContent=TS.inboxClear;$('#scamChan').textContent=TS.allReviewed;$('#scamAv').textContent='✓';$('#scamCount').textContent=TS.done;$('#scamBody').textContent=TS.slowDown;$('#scamSafe').disabled=$('#scamBad').disabled=true;$('#scamNext').hidden=true;
    fb.className='fb ok';fb.innerHTML=`<div class="result"><div class="score">${sq.s}<small> / 6</small></div><p>${TS.wrap}</p><div><button class="btn btn-ink btn-sm" type="button" id="scamAgain">${TS.playAgain}</button></div></div>`;$('#scamAgain').addEventListener('click',sReset);react(fb,true);finish('scams');return}
  pracHide('scams');const m=sCur();sq.ph='call';sq.fd=[];sq.hint='';$('#scamCount').textContent=`${sq.i+1} / ${SN}`;$('#scamChan').textContent=m.c;$('#scamAv').textContent=m.f.replace(/[^A-Za-z]/g,'').charAt(0).toUpperCase()||'?';sBubble();$('#scamSafe').disabled=$('#scamBad').disabled=false;fb.className='fb';fb.innerHTML='';$('#scamNext').hidden=true}
function sFb(){const m=sCur(),fb=$('#scamFb'),n=m.k?m.k.length:0,fin=sq.ph==='show',rv=fin&&sq.fd.length<n;fb.className='fb '+(sq.ok?'ok':'no');
  let h=`<h4>${sq.head} ${m.x?TS.thisScam:TS.thisSafe}</h4>`;
  if(!m.x)h+=`<p>${esc(m.y)}</p>`;else{
    if(!fin)h+=`<p>${fmt(TS.tapWords,{n:sq.fd.length,t:n})}</p>${sq.hint?`<p class="hint">${esc(sq.hint)}</p>`:''}`;else if(sq.ok&&!rv)h+=`<p>${fmt(TS.foundAll,{n})}</p>`;
    const li=m.k.map((c,j)=>sq.fd.includes(j)?`<li>${esc(c)}</li>`:fin?`<li><b>${TS.missed}</b> ${esc(c)}</li>`:'').join('');
    if(li)h+=`<ul class="clues">${li}</ul>`;
    if(fin){h+=`<p class="hab"><b>${TS.todoB}</b> ${TS.todo}</p>`;sAfter(m,`<p class="sys">${TS.sys}</p>`)}}
  fb.innerHTML=h;$('#scamShow').hidden=!(sq.ph==='tap'&&sq.fd.length>0);$('#scamNext').hidden=!(fin||(sq.ph==='tap'&&sq.fd.length>0));$('#scamNext').textContent=sq.i===SN-1?TS.seeResults:TS.nextMsg}
function sAns(sc){if(sq.ph!=='call'||sq.i>=SN)return;const m=sCur(),ok=sc===!!m.x;sq.ok=ok;sq.head=ok?say(m.x?'scam':'safe'):say('miss');if(ok)sq.s++;$('#scamSafe').disabled=$('#scamBad').disabled=true;
  if(m.x&&ok)sq.ph='tap';else{sq.ph='show';if(m.x)sq.fd=m.k.map((_,j)=>j)}
  sBubble();sStamp(m);sFb();react($('#scamFb'));if(!m.x)sAfter(m,m.r?`<p class="me">${esc(m.r)}</p>`:m.s?`<p class="sys">${esc(m.s)}</p>`:'');
  if(sq.ph==='show'){const n=$('#scamNext');n.hidden=false;n.focus({preventScroll:true})}}
function sFinish(){const all=sq.ok&&sq.fd.length===sCur().k.length;sq.ph='show';sBubble();sFb();if(all)react($('#scamFb'));$('#scamNext').focus({preventScroll:true})}
function sReset(){sq={q:sDeal(),i:0,s:0,ph:'call',fd:[],hint:''};sRender();toast(TS.reset)}
$('#scamPhone').addEventListener('click',e=>{if(sq.ph!=='tap')return;const b=e.target.closest('.flag');
  if(b){const j=+b.dataset.j;if(sq.fd.includes(j))return;sq.fd.push(j);sq.hint='';b.classList.add('on');b.setAttribute('aria-pressed','true');if(sq.fd.length===sCur().k.length)sFinish();else sFb()}
  else if(e.target.closest('.bubble,.from b')){sq.hint=TS.hint;sFb()}});
$('#scamPhone').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('flag')){e.preventDefault();e.target.click()}});
$('#scamSafe').addEventListener('click',()=>sAns(false));$('#scamBad').addEventListener('click',()=>sAns(true));$('#scamShow').addEventListener('click',sFinish);
$('#scamNext').addEventListener('click',()=>{sq.i++;sRender()});$('#scamReset').addEventListener('click',sReset);sRender();

"use strict";
/* ---------- Scam or Safe ---------- */
const MS=[
 {f:'Unknown number',c:'Text message',b:'CONGRATS!! You won a free GameStation 5. Claim [in the next 10 min]: [gs5-prizes.win/claim]. Just [pay $4.99 shipping with a parent’s card].',x:1,k:['A countdown meant to rush you','A strange web address','A real prize never makes you pay. This also asks for a card number.']},
 {f:'xX_ProBuilder_Xx',c:'In-game chat',b:'yo i can give u [10,000 free coins]. send me ur [login + password] and i’ll load them rn',x:1,k:['Free in-game money is a common trick','No real player or game needs your password. Sharing it can cost you the whole account.']},
 {f:'Mom (saved contact)',c:'Text message',b:'Practice ends at 5. I’ll pick you up by the front doors. Text me if it runs late.',x:0,y:'It’s from a saved contact, matches plans you know about, and asks for nothing.',r:'Ok. See you at the front doors.'},
 {f:'Security <alerts@[g00gle]-support.co>',c:'Email',b:'Your account will be [DELETED in 1 hour]. Verify now to keep your photos: [g00gle-support.co/verify]',x:1,k:['Zeros where letters should be','A scary deadline','A login link. Open the real app instead.']},
 {f:'Riverside Library',c:'App notification',b:'Reminder: 2 books are due Friday. You can renew them in the app.',x:0,y:'It appears inside an app you already use, only shares information, and lets you act in the app.',s:'You renewed both books in the library app.'},
 {f:'Unknown number',c:'Text message',b:'hey its your cousin, [got a new number]. can u buy 2 [gift cards] and send me the codes? [don’t tell anyone] i’ll pay u back',x:1,k:['Claims to be family from a new number','Gift card codes are a favorite scam payment','Asking you to keep a secret is a red flag']},
 {f:'Tyler_07',c:'Direct message',b:'hey its tyler, my account got locked. [can u read me the 6 digit code] that just got texted to u? [need it rn] pls pls',x:1,k:['That code is the key to your account. Never share it, even with a friend.','A friend in a big hurry is a pressure trick. Call or ask them in person.']},
 {f:'Delivery Team',c:'Text message',b:'Your package could not be delivered. [Pay a $1.99 fee] at [pkg-redelivery.help/track] or it will be [sent back today].',x:1,k:['Real delivery companies don’t ask for a fee by text','A strange web address, not the real company’s site','A deadline meant to rush you']},
 {f:'SkinDrop',c:'Game chat',b:'FREE skins for everyone!! Tap [skinz-free.gg] and [log in with your game account] to get 5. [Only 20 left].',x:1,k:['A strange link, not the real game store','Free skins don’t need your login. That’s how accounts get stolen.','“Only 20 left” is a rush trick']},
 {f:'ProTrader99',c:'Game chat',b:'trade u 5 rare skins for ur 1 [dragon skin]. [send yours first] so i know ur real. [trust me], im a top player',x:1,k:['A trade that’s too good to be true','Making you go first means you can lose your item','“Trust me” is not proof. Real trades happen in the game at the same time.']},
 {f:'Coach Ray (saved contact)',c:'Text message',b:'Game moved to Saturday at 10. Same field. Bring water.',x:0,y:'It’s from a saved contact, it matches your team, and it only shares plans. You can double check with your team.',r:'Got it. Saturday at 10. I’ll bring water.'},
 {f:'Diego (saved contact)',c:'Group chat',b:'Pizza at my house after the game? My mom said it’s ok if your mom says yes.',x:0,y:'It’s from a friend you know, and it asks you to check with your parent first.',r:'Let me ask my mom. I’ll text you back.'}
];
const SN=6;
const sDeal=()=>shuf([...shuf(MS.filter(m=>m.x)).slice(0,4),...shuf(MS.filter(m=>!m.x)).slice(0,2)]);
let sq={q:sDeal(),i:0,s:0,ph:'call',fd:[],hint:''};
const sCur=()=>sq.q[sq.i];
function sFlags(m,mode){let n=0;const r=s=>esc(s).replace(/\[(.+?)\]/g,(_,t)=>{const j=n++,f=sq.fd.includes(j);return mode==='tap'?`<span role="button" tabindex="0" class="flag${f?' on':''}" data-j="${j}" aria-pressed="${f}">${t}</span>`:mode==='show'?`<mark${f?'':' class="miss"'}>${t}</mark>`:t});return [r(m.f),r(m.b)]}
function sBubble(){const m=sCur(),[f,b]=sFlags(m,sq.ph==='call'?'plain':sq.ph);$('#scamFrom').innerHTML=f;$('#scamBody').innerHTML=b}
function sStamp(m){const st=$('#scamStamp');if(!m){st.hidden=true;return}st.textContent=m.x?'Scam':'Safe';st.className='stamp'+(m.x?'':' safe');st.hidden=false}
function sAfter(m,h){const a=$('#scamAfter');if(!h){a.innerHTML='';return}if(a.innerHTML||!sq.ok)return;setTimeout(()=>{if(sCur()===m)a.innerHTML=h},RM?0:650)}
function sRender(){const fb=$('#scamFb');$('#scamProg').innerHTML=sq.q.map((m,j)=>`<i class="${j<sq.i||sq.i>=SN?'done':j===sq.i?'cur':''}"></i>`).join('');$('#scamShow').hidden=true;sStamp(null);sAfter(null);
  if(sq.i>=SN){$('#scamFrom').textContent='Inbox clear';$('#scamChan').textContent='All 6 reviewed';$('#scamAv').textContent='✓';$('#scamCount').textContent='Done';$('#scamBody').textContent='When a message makes you feel rushed, excited or scared, slow down.';$('#scamSafe').disabled=$('#scamBad').disabled=true;$('#scamNext').hidden=true;
    fb.className='fb ok';fb.innerHTML=`<div class="result"><div class="score">${sq.s}<small> / 6</small></div><p><b>Pause.</b> Real messages rarely need an answer in minutes. <b>Don’t click.</b> Open the real app yourself. <b>Show an adult.</b> Asking is the smart move.</p><div><button class="btn btn-ink btn-sm" type="button" id="scamAgain">Play again</button></div></div>`;$('#scamAgain').addEventListener('click',sReset);react(fb,true);finish('scams');return}
  pracHide('scams');const m=sCur();sq.ph='call';sq.fd=[];sq.hint='';$('#scamCount').textContent=`${sq.i+1} / ${SN}`;$('#scamChan').textContent=m.c;$('#scamAv').textContent=m.f.replace(/[^A-Za-z]/g,'').charAt(0).toUpperCase()||'?';sBubble();$('#scamSafe').disabled=$('#scamBad').disabled=false;fb.className='fb';fb.innerHTML='';$('#scamNext').hidden=true}
function sFb(){const m=sCur(),fb=$('#scamFb'),n=m.k?m.k.length:0,fin=sq.ph==='show',rv=fin&&sq.fd.length<n;fb.className='fb '+(sq.ok?'ok':'no');
  let h=`<h4>${sq.head} This one ${m.x?'is a scam':'is safe'}.</h4>`;
  if(!m.x)h+=`<p>${esc(m.y)}</p>`;else{
    if(!fin)h+=`<p>Now tap the words that give it away. Found ${sq.fd.length} of ${n}.</p>${sq.hint?`<p class="hint">${esc(sq.hint)}</p>`:''}`;else if(sq.ok&&!rv)h+=`<p>You found all ${n}.</p>`;
    const li=m.k.map((c,j)=>sq.fd.includes(j)?`<li>${esc(c)}</li>`:fin?`<li><b>You missed:</b> ${esc(c)}</li>`:'').join('');
    if(li)h+=`<ul class="clues">${li}</ul>`;
    if(fin){h+=`<p class="hab"><b>What to do:</b> don’t click or reply. Show a trusted adult, then block and delete.</p>`;sAfter(m,'<p class="sys">Shown to an adult. Blocked and deleted.</p>')}}
  fb.innerHTML=h;$('#scamShow').hidden=!(sq.ph==='tap'&&sq.fd.length>0);$('#scamNext').hidden=!(fin||(sq.ph==='tap'&&sq.fd.length>0));$('#scamNext').textContent=sq.i===SN-1?'See results':'Next message'}
function sAns(sc){if(sq.ph!=='call'||sq.i>=SN)return;const m=sCur(),ok=sc===!!m.x;sq.ok=ok;sq.head=ok?say(m.x?'scam':'safe'):say('miss');if(ok)sq.s++;$('#scamSafe').disabled=$('#scamBad').disabled=true;
  if(m.x&&ok)sq.ph='tap';else{sq.ph='show';if(m.x)sq.fd=m.k.map((_,j)=>j)}
  sBubble();sStamp(m);sFb();react($('#scamFb'));if(!m.x)sAfter(m,m.r?`<p class="me">${esc(m.r)}</p>`:m.s?`<p class="sys">${esc(m.s)}</p>`:'');
  if(sq.ph==='show'){const n=$('#scamNext');n.hidden=false;n.focus({preventScroll:true})}}
function sFinish(){const all=sq.ok&&sq.fd.length===sCur().k.length;sq.ph='show';sBubble();sFb();if(all)react($('#scamFb'));$('#scamNext').focus({preventScroll:true})}
function sReset(){sq={q:sDeal(),i:0,s:0,ph:'call',fd:[],hint:''};sRender();toast('Scam or Safe reset.')}
$('#scamPhone').addEventListener('click',e=>{if(sq.ph!=='tap')return;const b=e.target.closest('.flag');
  if(b){const j=+b.dataset.j;if(sq.fd.includes(j))return;sq.fd.push(j);sq.hint='';b.classList.add('on');b.setAttribute('aria-pressed','true');if(sq.fd.length===sCur().k.length)sFinish();else sFb()}
  else if(e.target.closest('.bubble,.from b')){sq.hint='Look again. Which words feel off?';sFb()}});
$('#scamPhone').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('flag')){e.preventDefault();e.target.click()}});
$('#scamSafe').addEventListener('click',()=>sAns(false));$('#scamBad').addEventListener('click',()=>sAns(true));$('#scamShow').addEventListener('click',sFinish);
$('#scamNext').addEventListener('click',()=>{sq.i++;sRender()});$('#scamReset').addEventListener('click',sReset);sRender();

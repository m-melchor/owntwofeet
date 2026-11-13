"use strict";
/* ---------- make the call: each step has 3 choices (good, vague, off); r = Dana's reply, "~" = note, "~~" = hold ---------- */
/* three scenarios; one is picked at random each play, never the same one twice in a row. mkCall builds the six steps from a scenario's words */
const CALLS=[
 {biz:'Fresh Cuts',av:'FC',who:'Dana',obj:'her',me:'Sam',thing:'haircut',pro:'Marcus',had:'Thursday at 4:00',why:'my team added a practice then',whyShort:'you have practice',want:'a later time this week',times:['Thursday at 5:30','Friday at 3:00','Saturday at 10:00'],good:'Saturday at 10:00',goodDay:'Saturday',goodFree:'Saturday morning',clash:'Thursday at 5:30',clashDay:'Thursday',clashWhy:'practice runs until 6:00',clashWith:'practice, which runs until 6:00',
  intro:'Your haircut clashes with a new practice.',week:['Practice now takes Thursday 4:00 to 6:00.',['Thursday','Free after 6:00'],['Friday','Free after 3:30'],['Saturday','Free in the morning']],
  confirm:'Fresh Cuts: Sam is booked Saturday at 10:00 with Marcus. See you then!'},
 {biz:'Bright Smiles Dental',av:'BS',who:'Priya',obj:'her',me:'Sam',thing:'dentist checkup',pro:'Dr. Lee',had:'Friday at 3:30',why:'my class has a field trip that day',whyShort:'you have a field trip',want:'another day next week',times:['Monday at 3:45','Wednesday at 4:00','Friday at 5:00'],good:'Wednesday at 4:00',goodDay:'Wednesday',goodFree:'Wednesday after school',clash:'Monday at 3:45',clashDay:'Monday',clashWhy:'soccer runs 3:30 to 5:00',clashWith:'soccer, which runs 3:30 to 5:00',
  intro:'Your dentist checkup lands on the day of a class field trip.',week:['The field trip takes all of Friday.',['Monday','Soccer 3:30 to 5:00'],['Wednesday','Free after 3:30'],['Friday','Field trip until 6:00']],
  confirm:'Bright Smiles Dental: Sam is booked Wednesday at 4:00 with Dr. Lee. Reply C to cancel.'},
 {biz:'Westside Rec Center',av:'WR',who:'Theo',obj:'him',me:'Sam',thing:'swim lesson',pro:'Coach Bea',had:'Saturday at 9:00',why:'my cousin’s birthday party is that morning',whyShort:'you have a party',want:'a different time this week',times:['Tuesday at 4:30','Thursday at 5:00','Saturday at 1:00'],good:'Saturday at 1:00',goodDay:'Saturday',goodFree:'Saturday afternoon',clash:'Tuesday at 4:30',clashDay:'Tuesday',clashWhy:'piano runs 4:00 to 5:00',clashWith:'piano, which runs 4:00 to 5:00',
  intro:'Your swim lesson clashes with your cousin’s birthday party.',week:['The party runs Saturday 9:00 to noon.',['Tuesday','Piano 4:00 to 5:00'],['Thursday','Homework club until 5:30'],['Saturday','Free after noon']],
  confirm:'Westside Rec Center: Sam is booked for a swim lesson Saturday at 1:00 with Coach Bea.'}
];
function mkCall(S){const CT=`Here are the times I have: ${S.times[0]}, ${S.times[1]}, or ${S.times[2]}.`,CH=['Okay, let me check the book. One moment.','~~','Thanks for waiting. '+CT],W=S.who,M=S.me,P=S.pro?' with '+S.pro:'',cap=s=>s[0].toUpperCase()+s.slice(1);return [
 {q:`${W} picks up. What do you say?`,s:'Said who you were',n:'Start with hello and your name.',c:[
  {y:'good',t:`Hi ${W}, this is ${M}.`,r:[`Hi ${M}! How can I help you?`]},
  {y:'vague',t:'Uh... hi.',r:['Hello? Sorry, who is this?',`~You tell ${S.obj} you’re ${M}.`,`Hi ${M}. How can I help you?`],tip:`Say your name right away. It helps ${W} find your visit.`},
  {y:'off',t:`Yeah, I need to change my ${S.thing}.`,r:['Okay... who is this, so I can look you up?',`~You tell ${S.obj} you’re ${M}.`,`Thanks, ${M}. What’s going on?`],tip:`Start with hello and your name. It’s friendlier, and it helps ${W} look you up.`}]},
 {q:`Tell ${S.obj} why you’re calling.`,s:'Said why you were calling',n:'Say why you’re calling in one clear sentence.',c:[
  {y:'good',t:`I have a ${S.thing} ${S.had}, but ${S.why}. I need to move it.`,r:[`Oh, got it. I see you ${S.had}${P}.`,'What would you like to do?']},
  {y:'vague',t:'Um, I have a thing. It’s about my appointment.',r:['Okay... which appointment? What’s the thing?',`~You explain it’s your ${S.had} ${S.thing} and ${S.whyShort}.`,`Oh, I see you ${S.had}${P}. What would you like to do?`],tip:`Say the day, the time and the problem in one sentence. Then ${W} knows what you need.`},
  {y:'off',t:'Your schedule is messed up. Fix my appointment.',r:['Oh! Sorry about that. Which appointment is it?',`~You explain it’s your ${S.had} ${S.thing} and your own plans changed.`,`Okay, I see you ${S.had}${P}. What would you like to do?`],tip:`Nothing is wrong with their schedule. Yours changed. Say that calmly and ${W} will help.`}]},
 {q:'Ask for a new time.',s:'Asked for a new time politely',n:'Ask politely, and say please.',c:[
  {y:'good',t:`Could I move it to ${S.want}, please?`,r:CH},
  {y:'vague',t:'Uh, can I change it?',r:['Change it to what? I need a day or a time.',`~You say you want ${S.want}.`,...CH],tip:`Tell ${W} what you want: ${S.want}. “Change it” can mean a lot of things.`},
  {y:'off',t:'Just give me a new time. I’m busy.',r:['Okay, okay.',...CH],tip:'Please makes a big difference. A kind voice gets help faster, even when you’re in a hurry.'}]},
 {q:`${W} read out some times. Which one do you take?`,s:'Picked a time that fits your week',n:'Check Your week before you pick a time.',c:[
  {y:'good',t:`${S.good} works. I’m free ${S.goodFree}.`,r:[`${S.good}. Perfect, that one’s open. I’ll put you down.`]},
  {y:'clash',t:`${S.clash}, please.`,r:[`${S.clash}, okay.`,`~Wait. Your week says ${S.clashWhy}. You ask for ${S.good} instead.`,`No problem. ${S.good} is open. I’ll put you down.`],tip:`${S.clash} clashes with ${S.clashWith}. Check Your week first. ${cap(S.goodFree)} is free.`},
  {y:'off',t:'Whichever. I don’t care.',r:[`Um, okay. ${S.good} is open, so I’ll put you down for that.`],tip:`Pick a time yourself. ${W} can’t see your week, and a time that clashes would mean another call.`}]},
 {q:'Say it back to be sure.',s:'Repeated the day and time back',n:'Repeat the day and time back before you hang up.',c:[
  {y:'good',t:`So that’s ${S.good}, not ${S.clashDay}. Is that right?`,r:[`Yes, that’s right. ${S.good}${S.pro?', with '+S.pro:''}.`,'Anything else I can help with?']},
  {y:'vague',t:'Okay, cool. So it’s all set?',r:[`Yep, all set. That’s ${S.good}.`,'Anything else I can help with?'],tip:`Say the day and time back yourself. It catches mix-ups, like ${S.clashDay} instead of ${S.goodDay}.`},
  {y:'off',t:'Fine. Just don’t mess it up this time.',r:[`Oh. I won’t. You’re down for ${S.good}.`,'Anything else I can help with?'],tip:'Saying the day and time back is how you check. Blaming the desk makes the call feel tense.'}]},
 {q:'Time to wrap up the call.',s:'Ended with a thank you',n:'End with a thank you.',c:[
  {y:'good',t:`No, that’s all. Thank you, ${W}! See you ${S.goodDay}.`,r:[`You’re welcome, ${M}! See you ${S.good}. Bye!`]},
  {y:'vague',t:'Uh, no. Bye.',r:['Okay. Bye now.'],tip:'A quick thank you ends the call on a good note.'},
  {y:'off',t:'Nope. Okay, bye.',r:['...Bye.'],tip:'Say thank you before you hang up. It only takes a second, and people remember it.'}]}
]}
let CS=mkCall(CALLS[0]),cLast=-1;
const CN=CS.length;
function cScene(){let i;do i=Math.floor(Math.random()*CALLS.length);while(CALLS.length>1&&i===cLast);cLast=i;const S=CALLS[i];CS=mkCall(S);cl.S=S;
  $('#callBiz').textContent=S.biz;$('#callAv').textContent=S.av;$('#callPhone').setAttribute('aria-label','Phone call with '+S.biz);$('#callIntro').textContent=S.intro+' Call the front desk, say what you need, and pick a time that fits your week.';
  $('#callWeek').innerHTML=`<h4>Your week</h4><p>${esc(S.week[0])}</p>`+S.week.slice(1).map(([d,t])=>`<div><span>${esc(d)}</span><b>${esc(t)}</b></div>`).join('');return S}
let cl=null,ctick=0;
const cFmt=ms=>{const s=Math.floor(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
function cTx(k,t,x){const p=document.createElement('p');p.className='ln '+k+(x?' '+x:'');p.textContent=t;const w=$('#callTx');w.appendChild(p);w.scrollTop=w.scrollHeight;return p}
function cStatus(t){$('#callSt').textContent=t}
function cStop(){clearInterval(ctick);ctick=0;clearTimeout(cl&&cl.to)}
function cTimer(){if(ctick)return;cl.t0=Date.now();ctick=setInterval(()=>{$('#callTime').textContent=cFmt(Date.now()-cl.t0)},500)}
function cReset(quiet){if(cl)cStop();cl={i:0,g:0,got:[],busy:false,o:shuf([0,1,2]),t0:0,to:0};const S=cScene();$('#callTime').textContent='0:00';$('#callTx').innerHTML='';cTx('desk',`Thanks for calling ${S.biz}, this is ${S.who}.`);cStatus('Connected');pracHide('call');cRender();if(!quiet)toast('Make the Call reset.')}
function cRender(){const fb=$('#callFb'),o=$('#callOpts');$('#callProg').innerHTML=CS.map((_,j)=>`<i class="${j<cl.i?'done':j===cl.i?'cur':''}"></i>`).join('');fb.className='fb';fb.innerHTML='';$('#callNext').hidden=$('#callAgain').hidden=true;
  if(cl.i>=CN)return cEnd();
  const st=CS[cl.i];$('#callStep').textContent=`Step ${cl.i+1} of ${CN}`;$('#callQ').textContent=st.q;$('#callWeek').hidden=false;
  o.innerHTML=cl.o.map(k=>`<button class="btn btn-line" type="button" data-ci="${k}" data-y="${st.c[k].y}">${esc(st.c[k].t)}</button>`).join('')}
function cPlay(L,k,id){if(cl.id!==id)return;for(;k<L.length;k++){const l=L[k];
    if(l==='~~'){cStatus('On hold');const h=cTx('sys','On hold for a moment...','hold');cl.to=setTimeout(()=>{h.classList.remove('hold');cStatus('On the call');cPlay(L,k+1,id)},RM?0:1500);return}
    l[0]==='~'?cTx('sys',l.slice(1)):cTx('desk',l)}
  cAfter()}
function cAfter(){const st=CS[cl.i],ch=st.c[cl.pick],good=ch.y==='good',fb=$('#callFb');if(good)cl.g++;cl.got[cl.i]=good;
  fb.className='fb '+(good?'ok':'no');fb.innerHTML=good?`<h4>${say('call')}</h4><p class="hab">That’s what a good call sounds like.</p>`:`<h4>Try this next time.</h4><p class="hab">${esc(ch.tip)}</p>`;react(fb);
  const W=cl.S.who;cStatus(good?`${W} sounds happy to help`:ch.y==='clash'?`${W} fixed it for you`:ch.y==='vague'?`${W} sounds confused`:`${W} sounds put off`);
  const n=$('#callNext');n.textContent=cl.i===CN-1?'See how it went':'Next step';n.hidden=false;n.focus({preventScroll:true});cl.busy=false}
function cPick(k){if(cl.busy||cl.i>=CN)return;cl.busy=true;cl.pick=k;cl.id=(cl.id||0)+1;cTimer();const ch=CS[cl.i].c[k];
  $$('#callOpts .btn').forEach(b=>{b.disabled=true;b.classList.toggle('picked',+b.dataset.ci===k)});cTx('me',ch.t);cStatus('On the call');cPlay(ch.r,0,cl.id)}
function cEnd(){const dur=cl.t0?cFmt(Date.now()-cl.t0):'0:00',fb=$('#callFb'),good=CS.filter((_,j)=>cl.got[j]),miss=CS.find((_,j)=>!cl.got[j]);cStop();
  $('#callTime').textContent=dur;cStatus('Call ended');cTx('sys','Call ended');$('#callStep').textContent='Call ended';$('#callQ').textContent='How the call went';$('#callOpts').innerHTML='';$('#callWeek').hidden=true;
  fb.className=cl.g>=4?'fb ok':'fb plain';fb.innerHTML=`<div class="result">${cl.g?`<div class="score">${cl.g}<small> / ${CN} clear</small></div>`:'<p><b>Call done. Now try it with clearer lines.</b></p>'}<ul class="results">${(good.length?good.slice(0,3).map(s=>s.s):['You stayed on the call and kept going']).map(s=>`<li class="pass">${I.check}<span>${esc(s)}</span></li>`).join('')}</ul><p class="hab"><b>Try next time:</b> ${esc(miss?miss.n:'Jot down your plan before you call: who you are, why, and when you’re free.')}</p></div>`;
  react(fb,true);$('#callAgain').hidden=false;finish('call');
  cl.to=setTimeout(()=>{if(cl&&cl.i>=CN){cTx('sys','New text message');cTx('desk',cl.S.confirm)}},RM?0:1200)}
$('#callOpts').addEventListener('click',e=>{const b=e.target.closest('[data-ci]');if(b&&!b.disabled)cPick(+b.dataset.ci)});
$('#callNext').addEventListener('click',()=>{if(cl.busy)return;cl.i++;cl.o=shuf([0,1,2]);cRender();if(cl.i<CN){$('#callOpts .btn').focus({preventScroll:true})}});
$('#callAgain').addEventListener('click',()=>cReset());$('#callReset').addEventListener('click',()=>cReset());cReset(true);

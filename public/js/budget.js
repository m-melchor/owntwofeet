"use strict";
/* ---------- Budget ---------- */
const BUD=25,PRICE={},BASE={};
/* pools: one promise and four wants are dealt each play, so the Saturday changes */
const PRM=[{id:'promise',n:'Card and small gift',s:'Your sister’s birthday is Sunday',p:8,f:'You promised a birthday gift. Plan for it before wants.'},{id:'promise',n:'Pay Diego back',s:'You borrowed $6 for lunch last week',p:6,f:'You promised to pay Diego back. Plan for it before wants.'},{id:'promise',n:'Chip in for the coach’s gift',s:'The whole team said they would',p:5,f:'You promised to chip in for the coach’s gift. Plan for it before wants.'}];
const WNT=[{id:'movie',n:'Movie ticket',s:'Matinee with friends',p:9},{id:'snack',n:'Movie snacks',s:'Popcorn and a drink',p:6},{id:'arcade',n:'Arcade tokens',s:'About 20 minutes of games',p:5},{id:'case',n:'New phone case',s:'Yours still works fine',p:12},{id:'comic',n:'New comic book',s:'The next one in the series',p:5},{id:'slush',n:'Giant slushie',s:'From the corner store',p:3},{id:'stickers',n:'Skate stickers',s:'A pack of five',p:4}];
const BI={bNeeds:[{id:'bus',n:'Round-trip bus fare',s:'Rec center and back',p:4}],
 bLunch:[{id:'taco',n:'Taco truck lunch',s:'Two tacos and a drink',p:7,r:1},{id:'packed',n:'Packed lunch from home',s:'Sandwich, fruit, water',p:2,r:1}],
 bPromise:[],bWants:[]};
function bDeal(){BI.bPromise=[PRM[Math.floor(Math.random()*PRM.length)]];BI.bWants=bMix(WNT).slice(0,4);Object.keys(PRICE).forEach(k=>delete PRICE[k]);
  Object.entries(BI).forEach(([k,l])=>{$('#'+k).innerHTML=l.map(it=>{PRICE[it.id]=it.p;return `<label class="item"><input type="${it.r?'radio':'checkbox'}" ${it.r?'name="lunch"':''} value="${it.id}" id="b-${it.id}"><span class="nm">${it.n}<small>${it.s}</small></span><span class="pr">$${it.p}</span></label>`}).join('')});
  PRICE.loan=5;Object.keys(BASE).forEach(k=>delete BASE[k]);Object.assign(BASE,PRICE)}
bDeal();
const CB=[{id:'bus',p:5,t:'The bus fare went up $1. Round trip is now $5.'},{id:'movie',p:11,t:'The movie costs $2 more than you thought. The ticket is now $11.'},{id:'arcade',p:3,t:'Good news. Arcade tokens are on sale. They are now $3.'},{id:'loan',t:'A friend asks to borrow $5 and promises to pay you back next week. Lending is your choice. Money you lend is money you can’t spend.'}];
let bq={cb:null};
const bs=()=>{const sel=$$('#budForm input:checked:not([name=save])').map(i=>i.value),sp=sel.reduce((a,i)=>a+PRICE[i],0),sv=+$('#budForm input[name=save]:checked').value;return {sel,sp,sv,left:BUD-sp-sv}};
function bPrices(){$$('#budForm .item:not(.sv)').forEach(l=>{const v=l.querySelector('input').value;l.querySelector('.pr').textContent='$'+PRICE[v];l.classList.toggle('chg',PRICE[v]!==BASE[v])})}
function bRender(){const {sp,sv,left}=bs();$('#bSpent').textContent='$'+sp;$('#bSaveRow').hidden=!sv;$('#bSave').textContent='$'+sv;const l=$('#bLeft');l.textContent=(left<0?'−$':'$')+Math.abs(left);l.style.color=left<0?'var(--bad)':'';$('#bFill').style.width=Math.min(100,(sp+sv)/BUD*100)+'%';$('#bMeter').classList.toggle('over',left<0);$('#bLive').textContent=`Spent $${sp}.${sv?` Saving $${sv}.`:''} ${left<0?'Over by $'+(-left):'$'+left+' left'}.`}
function bThrow(){const pool=CB.filter(c=>c.id==='loan'||PRICE[c.id]!==undefined),c=bq.cb=pool[Math.floor(Math.random()*pool.length)];if(c.id==='loan'){$('#bCurveItems').innerHTML=`<label class="item"><input type="checkbox" value="loan" id="b-loan"><span class="nm">Lend $5 to your friend<small>They say they will pay you back next week</small></span><span class="pr">$5</span></label>`;$('#bCurve').hidden=false}else{PRICE[c.id]=c.p;bPrices()}
  $('#bCurveTxt').textContent=c.t;$('#bCurveCard').hidden=false;bRender()}
$('#budForm').addEventListener('change',()=>{bRender();pracHide('budget');$('#bResult').innerHTML=''});
$('#bCheck').addEventListener('click',()=>{const {sel,sp,sv,left}=bs(),has=i=>sel.includes(i);
  const R=[{ok:has('bus'),t:'Ride covered',f:'Add bus fare. Without it, you can’t get there.'},{ok:has('taco')||has('packed'),t:'Lunch planned',f:'Pick a lunch. Packing one saves $5.'},{ok:has('promise'),t:'Promise kept',f:BI.bPromise[0].f},{ok:left>=0,t:`Within $${BUD}`,f:`You’re $${-left} over. Drop a want${has('taco')?' or pack lunch':''}${sv?' or save a little less':''}.`}];
  const pass=R.every(x=>x.ok);let h='<ul class="results">'+R.map(x=>`<li class="${x.ok?'pass':'fail'}">${x.ok?I.check:I.x}<span>${x.ok?x.t:x.f}</span></li>`).join('');
  if(pass)h+=`<li class="bonus">${I.star}<span>${sv?`You set aside $${sv} for next week. That’s a win.`:left>=3?`You kept $${left} unspent. That counts too.`:'Next time, try setting aside $3 for next week.'}</span></li>`;h+='</ul>';
  if(pass&&!bq.cb){bThrow();$('#bResult').innerHTML=`<div class="fb"><h4>Your plan works. Now a curveball.</h4><p>Read the Curveball box, change your plan if you need to, then check again.</p></div>`;return}
  const cr=sv+left,lent=has('loan'),ln=bq.cb&&bq.cb.id==='loan'?(lent?'<p class="hab">You lent $5. That’s your choice. Remember it isn’t yours to spend until it comes back.</p>':'<p class="hab">You kept your $5. Saying no is a fair choice too.</p>'):'';
  $('#bResult').innerHTML=pass?`<div class="fb ok"><h4>${say('budget')}</h4><p>$${sp} spent${sv?`, $${sv} saved`:''}, $${left} unspent. Needs and promises came first.</p>${ln}${cr>0?`<div class="carry"><b>$${cr}</b><span>carries over to next week</span></div>`:'<p>Nothing carries over this time. A few dollars set aside next time would.</p>'}${h}</div>`:`<div class="fb no"><h4>Almost. Fix these:</h4>${h}</div>`;react($('#bResult .fb'),true);if(pass)finish('budget')});
$('#budReset').addEventListener('click',()=>{bq={cb:null};$('#budForm').reset();bDeal();$('#bCurveItems').innerHTML='';$('#bCurve').hidden=true;$('#bCurveCard').hidden=true;bPrices();bRender();$('#bResult').innerHTML='';pracHide('budget');toast('Budget reset.')});
bRender();

"use strict";
/* ---------- Budget ---------- */
const TB=TXT('actBudget');
const BUD=25,PRICE={},BASE={};
/* pools: one promise and four wants are dealt each play, so the Saturday changes */
const PRM=TB.prm.map((x,i)=>({id:'promise',n:x.n,s:x.s,p:[8,6,5][i],f:x.f}));
const WNT=['movie','snack','arcade','case','comic','slush','stickers'].map((id,i)=>({id,n:TB.wnt[i].n,s:TB.wnt[i].s,p:[9,6,5,12,5,3,4][i]}));
const BI={bNeeds:[{id:'bus',n:TB.bus.n,s:TB.bus.s,p:4}],
 bLunch:[{id:'taco',n:TB.taco.n,s:TB.taco.s,p:7,r:1},{id:'packed',n:TB.packed.n,s:TB.packed.s,p:2,r:1}],
 bPromise:[],bWants:[]};
function bDeal(){BI.bPromise=[PRM[Math.floor(Math.random()*PRM.length)]];BI.bWants=bMix(WNT).slice(0,4);Object.keys(PRICE).forEach(k=>delete PRICE[k]);
  Object.entries(BI).forEach(([k,l])=>{$('#'+k).innerHTML=l.map(it=>{PRICE[it.id]=it.p;return `<label class="item"><input type="${it.r?'radio':'checkbox'}" ${it.r?'name="lunch"':''} value="${it.id}" id="b-${it.id}"><span class="nm">${it.n}<small>${it.s}</small></span><span class="pr">$${it.p}</span></label>`}).join('')});
  PRICE.loan=5;Object.keys(BASE).forEach(k=>delete BASE[k]);Object.assign(BASE,PRICE)}
bDeal();
const CB=[{id:'bus',p:5,t:TB.cb.bus},{id:'movie',p:11,t:TB.cb.movie},{id:'arcade',p:3,t:TB.cb.arcade},{id:'loan',t:TB.cb.loan}];
let bq={cb:null};
const bs=()=>{const sel=$$('#budForm input:checked:not([name=save])').map(i=>i.value),sp=sel.reduce((a,i)=>a+PRICE[i],0),sv=+$('#budForm input[name=save]:checked').value;return {sel,sp,sv,left:BUD-sp-sv}};
function bPrices(){$$('#budForm .item:not(.sv)').forEach(l=>{const v=l.querySelector('input').value;l.querySelector('.pr').textContent='$'+PRICE[v];l.classList.toggle('chg',PRICE[v]!==BASE[v])})}
function bRender(){const {sp,sv,left}=bs();$('#bSpent').textContent='$'+sp;$('#bSaveRow').hidden=!sv;$('#bSave').textContent='$'+sv;const l=$('#bLeft');l.textContent=(left<0?'−$':'$')+Math.abs(left);l.style.color=left<0?'var(--bad)':'';$('#bFill').style.width=Math.min(100,(sp+sv)/BUD*100)+'%';$('#bMeter').classList.toggle('over',left<0);$('#bLive').textContent=`${fmt(TB.liveSpent,{n:'$'+sp})}${sv?fmt(TB.liveSaving,{n:'$'+sv}):''} ${left<0?fmt(TB.liveOver,{n:'$'+(-left)}):fmt(TB.liveLeft,{n:'$'+left})}.`}
function bThrow(){const pool=CB.filter(c=>c.id==='loan'||PRICE[c.id]!==undefined),c=bq.cb=pool[Math.floor(Math.random()*pool.length)];if(c.id==='loan'){$('#bCurveItems').innerHTML=`<label class="item"><input type="checkbox" value="loan" id="b-loan"><span class="nm">${TB.loanN}<small>${TB.loanS}</small></span><span class="pr">$5</span></label>`;$('#bCurve').hidden=false}else{PRICE[c.id]=c.p;bPrices()}
  $('#bCurveTxt').textContent=c.t;$('#bCurveCard').hidden=false;bRender()}
$('#budForm').addEventListener('change',()=>{bRender();pracHide('budget');$('#bResult').innerHTML=''});
$('#bCheck').addEventListener('click',()=>{const {sel,sp,sv,left}=bs(),has=i=>sel.includes(i);
  const R=[{ok:has('bus'),t:TB.rideT,f:TB.rideF},{ok:has('taco')||has('packed'),t:TB.lunchT,f:TB.lunchF},{ok:has('promise'),t:TB.promiseT,f:BI.bPromise[0].f},{ok:left>=0,t:fmt(TB.withinT,{n:'$'+BUD}),f:fmt(TB.overF,{n:'$'+(-left),a:has('taco')?TB.overA:'',b:sv?TB.overB:''})}];
  const pass=R.every(x=>x.ok);let h='<ul class="results">'+R.map(x=>`<li class="${x.ok?'pass':'fail'}">${x.ok?I.check:I.x}<span>${x.ok?x.t:x.f}</span></li>`).join('');
  if(pass)h+=`<li class="bonus">${I.star}<span>${sv?fmt(TB.bonusSaved,{n:'$'+sv}):left>=3?fmt(TB.bonusKept,{n:'$'+left}):TB.bonusNext}</span></li>`;h+='</ul>';
  if(pass&&!bq.cb){bThrow();$('#bResult').innerHTML=`<div class="fb"><h4>${TB.curveH}</h4><p>${TB.curveP}</p></div>`;return}
  const cr=sv+left,lent=has('loan'),ln=bq.cb&&bq.cb.id==='loan'?(lent?`<p class="hab">${TB.lent}</p>`:`<p class="hab">${TB.kept}</p>`):'';
  $('#bResult').innerHTML=pass?`<div class="fb ok"><h4>${say('budget')}</h4><p>${fmt(TB.summary,{sp:'$'+sp,saved:sv?fmt(TB.savedPart,{n:'$'+sv}):'',left:'$'+left})}</p>${ln}${cr>0?`<div class="carry"><b>$${cr}</b><span>${TB.carry}</span></div>`:`<p>${TB.nothing}</p>`}${h}</div>`:`<div class="fb no"><h4>${TB.almost}</h4>${h}</div>`;react($('#bResult .fb'),true);if(pass)finish('budget')});
$('#budReset').addEventListener('click',()=>{bq={cb:null};$('#budForm').reset();bDeal();$('#bCurveItems').innerHTML='';$('#bCurve').hidden=true;$('#bCurveCard').hidden=true;bPrices();bRender();$('#bResult').innerHTML='';pracHide('budget');toast(TB.reset)});
bRender();

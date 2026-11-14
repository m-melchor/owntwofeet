"use strict";
/* ---------- Laundry Sort-Out: sort the pile, then read care labels ---------- */
const TLD=TXT('actLaundry');
const LB=TLD.lb;
const LI=[{id:'tshirt',b:'light',c:'l'},{id:'jeans',b:'dark',c:'d'},{id:'bath',b:'towel',c:'t'},{id:'jersey',b:'dark',c:'r'},{id:'socks',b:'light',c:'l'},{id:'hoodie',b:'dark',c:'d'},{id:'hand',b:'towel',c:'t'},{id:'sweats',b:'dark',c:'d'}].map(it=>({...it,n:TLD.names[it.id]}));
const LOK=TLD.ok;
const LNO=TLD.no;
const LW=TLD.w,LH=TLD.h,dt=n=>fmt(n>1?TLD.dots:TLD.dot,{n});
const lDots=(n,y,cx=24)=>Array.from({length:n},(_,i)=>`<circle cx="${cx+(i-(n-1)/2)*7}" cy="${y}" r="2" fill="currentColor" stroke="none"/>`).join('');
const LX='<path d="M7 7l34 34M41 7L7 41"/>';
const LSY={tub:n=>`<path d="M6 15h36l-4 23q-.5 3-3.5 3h-21q-3 0-3.5-3z"/><path d="M11 22q3-3 6.5 0t6.5 0 6.5 0 6.5 0"/>${lDots(n,32)}`,nob:()=>`<path d="M24 7l18 32H6z"/>${LX}`,dry:n=>`<rect x="6" y="6" width="36" height="36" rx="2"/><circle cx="24" cy="24" r="12"/>${lDots(n,24)}`,nodry:()=>LSY.dry(0)+LX,flat:()=>'<rect x="6" y="6" width="36" height="36" rx="2"/><path d="M13 24h22"/>',iron:n=>`<path d="M6 38h36V26Q42 14 31 14H17q-3 0-4.5 4z"/>${lDots(n,30,26)}`,noiron:()=>LSY.iron(0)+LX};
const LN={};['tub','nob','dry','nodry','flat','iron','noiron'].forEach(k=>{LN[k]=n=>fmt(TLD.ln[k],{d:n?dt(n):''})});
const LTX={};['tub','nob','dry','nodry','flat','iron','noiron'].forEach(k=>{LTX[k]=n=>fmt(TLD.ltx[k],{d:n?dt(n):'',w:LW[n-1],h:LH[n-1]})});
const LL=[{t:2,s:[['tub',2],['nob'],['dry',2],['noiron']]},{t:1,d:0,s:[['tub',1],['nob'],['nodry'],['flat']]},{t:1,d:1,s:[['tub',1],['nob'],['dry',1],['iron',1]]},{t:3,s:[['tub',3],['nob'],['dry',3],['iron',3]]}].map((l,i)=>({...l,...TLD.ll[i]}));
const lSvg=(k,n)=>`<svg viewBox="0 0 48 48" aria-hidden="true">${LSY[k](n)}</svg>`;
const careSvg=L=>`<svg class="care" viewBox="0 0 340 176" role="img" aria-label="${fmt(TLD.careAria,{list:L.s.map(([k,n])=>LN[k](n)).join(', ')})}"><rect x="2" y="2" width="336" height="172" rx="14" fill="#FBF9F3" stroke="#BDB8AB" stroke-width="2"/><rect x="12" y="12" width="316" height="152" rx="9" fill="none" stroke="#CFCABD" stroke-width="1.6" stroke-dasharray="5 4"/><text x="170" y="46" text-anchor="middle" font-family="Geist,system-ui,sans-serif" font-size="15" font-weight="500" fill="#56615B">${L.f}</text><path d="M44 62h252" stroke="#E2DED5" stroke-width="1.5"/>${L.s.map(([k,n],i)=>`<g transform="translate(${27+i*72} 86) scale(1.3)" fill="none" stroke="#16211C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${LSY[k](n)}</g>`).join('')}</svg>`;
const lPileHtml=recap=>`<div class="pile${recap?' recap':''}" id="lPile" role="group" aria-label="${recap?TLD.recapAria:TLD.pileAria}">${LI.map(it=>`<div class="cell"><button class="piece" type="button" data-i="${it.id}" aria-pressed="false"${recap?' tabindex="-1" disabled':''}><svg viewBox="0 0 120 120" aria-hidden="true"><use href="#l-${it.id}"></use></svg><span>${it.n}</span>${recap?`<small>${LB[it.b]}</small>`:''}</button></div>`).join('')}</div>`;
const lBaskHtml=()=>`<div class="baskets" id="lBaskets" role="group" aria-label="${TLD.basketsAria}">${Object.keys(LB).map(k=>`<button class="bk" type="button" data-b="${k}" aria-label="${fmt(TLD.bkAria,{b:TLD.lbs[k],t:TLD.empty.toLowerCase()})}"><svg viewBox="0 0 140 110" aria-hidden="true"><use href="#l-bk-${k}"></use></svg><b>${LB[k]}</b><small>${TLD.empty}</small></button>`).join('')}</div>`;
const lHead=(t,n,f)=>`<div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><span class="label">${t}</span><div class="prog" id="lProg" aria-hidden="true">${Array.from({length:n},(_,i)=>`<i class="${f(i)}"></i>`).join('')}</div></div>`;
let lz=null,ld=null,lSkip=0;
const lFbSet=(c,h,p,win)=>{const f=$('#lFb');f.className='fb '+c;f.innerHTML=`<h4>${h}</h4><p class="hab">${p}</p>`;if(c!=='plain')react(f,!!win)};
function lView(){const r=$('#lStage').getBoundingClientRect();if(r.top<70||r.top>innerHeight*.6)scrollTo({top:scrollY+r.top-100,behavior:RM?'instant':'smooth'})}
function lShow1(){lz.ph=1;$('#lStage').className='lstage';$('#lStage').innerHTML=lPileHtml()+'<div class="lfb"><div class="fb" id="lFb" aria-live="polite"></div></div>'+lBaskHtml();
  $('#lSide').innerHTML=lHead(TLD.part1,LI.length,()=>'')+'<h3>'+TLD.sortH+'</h3><p>'+(matchMedia('(pointer:coarse)').matches?TLD.tapHint:TLD.dragHint)+'</p><div class="push"><button class="btn btn-ink" id="lGo" type="button" hidden>'+TLD.readLabels+'</button></div>'}
function lBk(){Object.keys(LB).forEach(k=>{const n=Object.values(lz.placed).filter(v=>v===k).length,t=n?fmt(n>1?TLD.items:TLD.item,{n}):TLD.empty,b=$(`.bk[data-b="${k}"]`);b.querySelector('small').textContent=t;b.setAttribute('aria-label',fmt(TLD.bkAria,{b:TLD.lbs[k],t:t.toLowerCase()}))})}
function lSel(id){lz.sel=id;$$('#lPile .piece').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.i===id)));$('#lStage').classList.toggle('armed',!!id);if(id)lFbSet('plain',fmt(TLD.picked,{n:LI.find(x=>x.id===id).n}),TLD.pickedP)}
function lDrop(id,bk){const it=LI.find(x=>x.id===id),p=$(`#lPile [data-i="${id}"]`);lSel(null);p.classList.remove('lift');
  if(it.b===bk){lz.placed[id]=bk;p.classList.add('gone');p.closest('.cell').classList.add('gone');p.disabled=true;p.tabIndex=-1;const b=$(`.bk[data-b="${bk}"]`);b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump');lBk();
    const n=Object.keys(lz.placed).length,left=LI.filter(x=>!lz.placed[x.id]);$$('#lProg i').forEach((x,i)=>x.className=i<n?'done':'');
    if(left.length){lFbSet('ok',say('sort'),fmt(TLD.goes,{n:it.n,b:TLD.lbs[bk],ok:LOK[it.c]}));$(`#lPile [data-i="${left[0].id}"]`).focus({preventScroll:true})}
    else{const a=LI.filter(x=>!lz.miss[x.id]).length;lFbSet('ok',TLD.pileSorted,fmt(TLD.pileP,{ok:LOK[it.c],a:a?fmt(TLD.firstTry,{a,n:LI.length}):TLD.everyRight}),true);const g=$('#lGo');g.hidden=false;g.focus()}}
  else{lz.miss[id]=lz.miss[id]||bk;p.classList.remove('nope');void p.offsetWidth;p.classList.add('nope');lFbSet('no',TLD.notBasket,LNO[it.c][bk]);p.focus({preventScroll:true})}}
function lLab(){const L=LL[lz.li];lz.st='t';lz.msg='';$('#lStage').className='lstage lab';$('#lStage').innerHTML=`<div class="lblw">${careSvg(L)}<p class="lcap">${fmt(TLD.lcap,{g:L.g})}</p></div>`;
  $('#lSide').innerHTML=lHead(fmt(TLD.labelOf,{i:lz.li+1,n:LL.length}),LL.length,i=>i<lz.li?'done':i===lz.li?'cur':'')+`<h3>${TLD.qTemp}</h3><p>${TLD.qTempP}</p><div class="tri" id="lOpts">${LW.map((w,i)=>`<button class="btn btn-line" type="button" data-t="${i+1}">${w[0].toUpperCase()+w.slice(1)}</button>`).join('')}</div><div class="fb" id="lFb" aria-live="polite"></div><div class="push"><button class="btn btn-ink" id="lNext" type="button" hidden></button></div>`;
  lView();$('#lOpts .btn').focus({preventScroll:true})}
function lMark(v,right){$$('#lOpts .btn').forEach(b=>{b.disabled=true;const k=+(b.dataset.t||b.dataset.y);b.classList.toggle('ok',k===right);b.classList.toggle('no',k===v&&v!==right)})}
function lTemp(v){const L=LL[lz.li],ok=v===L.t;lz.r[lz.li]={t:ok};lMark(v,L.t);lz.msg=`<p class="hab"><b>${ok?TLD.waterOk:TLD.waterNo}</b> ${fmt(TLD.waterWhy,{d:dt(L.t),w:LW[L.t-1]})}</p>`;
  if(L.d==null)return lDone();
  lz.st='d';const f=$('#lFb');f.className='fb '+(ok?'ok':'no');f.innerHTML=lz.msg;
  $('#lSide h3').textContent=TLD.qDry;$('#lSide h3+p').textContent=TLD.qDryP;const o=$('#lOpts');o.className='tri two';o.innerHTML='<button class="btn btn-line" type="button" data-y="1">'+TLD.yes+'</button><button class="btn btn-line" type="button" data-y="0">'+TLD.noBtn+'</button>';o.querySelector('.btn').focus({preventScroll:true})}
function lDry(v){const L=LL[lz.li],ok=v===L.d,s=L.s.find(x=>x[0]==='dry'||x[0]==='nodry');lz.r[lz.li].d=ok;lMark(v,L.d);lz.msg+=`<p class="hab"><b>${ok?TLD.dryOk:TLD.dryNo}</b> ${LTX[s[0]](s[1])}</p>`;lDone()}
function lDone(){const L=LL[lz.li],r=lz.r[lz.li],all=r.t&&r.d!==false,f=$('#lFb'),nx=$('#lNext');lz.st='x';
  f.className='fb '+(all?'ok':'no');f.innerHTML=`<h4>${all?say('label'):TLD.here}</h4>${lz.msg}<ul class="lg">${L.s.map(([k,n])=>`<li>${lSvg(k,n)}<span>${LTX[k](n)}</span></li>`).join('')}</ul>`;react(f);
  $$('#lProg i').forEach((x,i)=>x.className=i<=lz.li?'done':'');nx.textContent=lz.li===LL.length-1?TLD.seeHow:TLD.nextLabel;nx.hidden=false;nx.focus()}
function lFinish(){lz.ph=3;const a=LI.filter(x=>!lz.miss[x.id]).length,jr=!lz.miss.jersey,b=lz.r.reduce((s,x)=>s+(x.t?1:0)+(x.d?1:0),0),qs=LL.length+LL.filter(x=>x.d!=null).length,g=a+b,tot=LI.length+qs,mi=LI.find(x=>lz.miss[x.id]),ml=LL.findIndex((x,i)=>!lz.r[i].t||lz.r[i].d===false);
  const good=[];if(a)good.push(fmt(TLD.good1,{a,n:LI.length}));if(jr)good.push(TLD.good2);if(b)good.push(fmt(TLD.good3,{b,q:qs}));if(!good.length)good.push(TLD.good4);
  const tip=mi?LNO[mi.c][lz.miss[mi.id]]:ml>=0?(!lz.r[ml].t?fmt(TLD.tipDots,{d:dt(LL[ml].t),w:LW[LL[ml].t-1]}):TLD.tipX):TLD.tipDefault;
  $('#lStage').className='lstage';$('#lStage').innerHTML=lPileHtml(true);
  $('#lSide').innerHTML=lHead(TLD.finished,LL.length,()=>'done')+`<h3>${TLD.howWent}</h3><div class="fb ${g>=11?'ok':'plain'}" id="lFb" aria-live="polite"><div class="result">${g?`<div class="score">${g}<small>${fmt(TLD.outOf,{t:tot})}</small></div>`:`<p><b>${TLD.allDone}</b></p>`}<ul class="results">${good.map(s=>`<li class="pass">${I.check}<span>${s}</span></li>`).join('')}</ul><p class="hab"><b>${TLD.tryNextB}</b> ${tip}</p><p class="hab">${TLD.askAdult}</p></div></div><div class="push"><button class="btn btn-ink" id="lAgain" type="button">${TLD.playAgain}</button></div>`;
  lView();react($('#lFb'),true);finish('laundry')}
function lReset(quiet){lz={ph:1,sel:null,placed:{},miss:{},li:0,r:[],st:'t',msg:''};pracHide('laundry');lShow1();if(!quiet)toast(TLD.reset)}
$('#lStage').addEventListener('click',e=>{if(Date.now()-lSkip<350||lz.ph!==1)return;const p=e.target.closest('.piece'),b=e.target.closest('.bk');
  if(p&&!p.disabled)lSel(lz.sel===p.dataset.i?null:p.dataset.i);
  else if(b){if(lz.sel)lDrop(lz.sel,b.dataset.b);else lFbSet('plain',TLD.pickFirst,TLD.pickFirstP)}});
$('#lStage').addEventListener('pointerdown',e=>{const p=e.target.closest('.piece');if(!p||p.disabled||lz.ph!==1||e.pointerType==='touch'||(e.pointerType==='mouse'&&e.button))return;ld={p,id:p.dataset.i,x:e.clientX,y:e.clientY,on:false,pid:e.pointerId,bk:null}});
addEventListener('pointermove',e=>{if(!ld||e.pointerId!==ld.pid)return;
  if(!ld.on){if(Math.hypot(e.clientX-ld.x,e.clientY-ld.y)<8)return;ld.on=true;const g=document.createElement('div');g.className='ghost';g.innerHTML=ld.p.querySelector('svg').outerHTML;document.body.appendChild(g);ld.g=g;ld.p.classList.add('lift');document.body.classList.add('dragging')}
  ld.g.style.transform=`translate(${e.clientX-44}px,${e.clientY-52}px) scale(1.08)`;const el=document.elementFromPoint(e.clientX,e.clientY),b=el&&el.closest('.bk');if(b!==ld.bk){ld.bk&&ld.bk.classList.remove('over');b&&b.classList.add('over');ld.bk=b}});
function ldStop(e){if(!ld||e.pointerId!==ld.pid)return;const d=ld;ld=null;if(!d.on)return;d.g.remove();document.body.classList.remove('dragging');d.p.classList.remove('lift');d.bk&&d.bk.classList.remove('over');lSkip=Date.now();
  if(e.type==='pointerup'){const el=document.elementFromPoint(e.clientX,e.clientY),b=el&&el.closest('.bk');if(b)lDrop(d.id,b.dataset.b)}}
addEventListener('pointerup',ldStop);addEventListener('pointercancel',ldStop);
$('#lSide').addEventListener('click',e=>{const t=e.target.closest('button');if(!t||t.disabled)return;
  if(t.id==='lGo'){lz.ph=2;lz.li=0;lz.r=[];lLab()}
  else if(t.dataset.t&&lz.st==='t')lTemp(+t.dataset.t);
  else if(t.dataset.y&&lz.st==='d')lDry(+t.dataset.y);
  else if(t.id==='lNext'){if(lz.li<LL.length-1){lz.li++;lLab()}else lFinish()}
  else if(t.id==='lAgain')lReset()});
$('#launReset').addEventListener('click',()=>lReset());lReset(true);

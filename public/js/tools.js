"use strict";
/* ---------- Tool Time ---------- */
/* the words come from the "actTools" group (TL, read in gl.js); the right answers stay here */
const JOBS=TL.jobs.map((task,i)=>({task,a:['tape','phillips','level','wrench','hammer','flat'][i]}));
/* pool of twelve situations; six are dealt each play, two of each answer. bMix is the shuffle the budget pools use too */
const PROP=TL.prop.map((p,i)=>({...p,a:['ask','me','pro','ask','me','pro','me','me','ask','ask','pro','pro'][i]}));
const dealPro=()=>{const by=k=>bMix(PROP.filter(p=>p.a===k)).slice(0,2);return bMix([...by('me'),...by('ask'),...by('pro')])};
let PRO=dealPro();
const PROA=TL.proa;
/* "Use it": tape questions (n = eighths of an inch) and the shelf task */
let uTimer=0;
const gcd=(a,b)=>b?gcd(b,a%b):a,rnd=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const frac=r=>{const g=gcd(r,8);return `${r/g}/${8/g}`},tfmt=n=>`${n>>3}${n%8?' '+frac(n%8):''} ${TL.inch}`;
function tapeQs(){return rnd([1,2,3,4,5,6,7]).slice(0,4).map(r=>{const n=(2+Math.floor(Math.random()*9))*8+r,w=n>>3;
  const cand=[w*8+8-r,Math.random()<.5?n+1:n-1,Math.random()<.5?n+8:n-8,n+1,n-1,n+2,n-2],o=[];for(const k of cand)if(k>=8&&k!==n&&!o.includes(k)&&o.length<3)o.push(k);
  return {n,o:rnd([n,...o])}})}
const tilt0=()=>(Math.random()<.5?-1:1)*(4+Math.floor(Math.random()*13)/2);
const useFresh=()=>({ui:0,uq:tapeQs(),uScore:0,uAns:false,sv:tilt0(),sw:false});
const freshTT=()=>({mode:'explore',sel:null,seen:new Set(),mi:0,first:0,tries:0,answered:false,pi:0,pScore:0,pAns:false,dn:new Set(),fin:false,...useFresh()});
let tt=freshTT();
const tray=$('#tray'),side=$('#ttSide');
tray.innerHTML=TOOLS.map(t=>`<button type="button" data-tool="${t.id}">${TL.tray[t.id]}</button>`).join('');
$('#fb2d').innerHTML=TOOLS.map(t=>`<button type="button" data-tool="${t.id}" aria-label="${t.name}" tabindex="-1"><svg viewBox="0 0 80 200" aria-hidden="true"><use href="#t-${t.id}"/></svg></button>`).join('');
function trayState(){$$('#tray button,#fb2d button').forEach(b=>{b.classList.remove('sel','ok','no');if(tt.mode==='explore'&&tt.sel===b.dataset.tool)b.classList.add('sel');if(tt.mode==='match'&&b.dataset.st)b.classList.add(b.dataset.st)})}
function renderSide(){
  if(tt.mode==='explore'){
    const pr=`<div class="prog" aria-hidden="true">${TOOLS.map(t=>`<i class="${tt.seen.has(t.id)?'done':''}"></i>`).join('')}</div>`;
    const ex=fmt(TL.explored,{n:tt.seen.size});
    if(!tt.sel){side.innerHTML=`<div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><span class="label">${ex}</span>${pr}</div><h3>${TL.pickTitle}</h3><p>${TL.pickP}</p><div class="push"><button class="btn btn-line btn-sm" type="button" data-go="match">${TL.skip}</button></div>`;return}
    const t=T[tt.sel];
    side.innerHTML=`<div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><span class="label">${ex}</span>${pr}</div><h3>${t.name}</h3><dl class="spec"><div><dt>${TL.usedFor}</dt><dd>${t.use}</dd></div><div><dt>${TL.howHold}</dt><dd>${t.grip}</dd></div><div><dt>${TL.safeHabit}</dt><dd>${t.safe}</dd></div></dl><div class="push">${tt.seen.size===6?`<button class="btn btn-ink" type="button" data-go="match">${TL.startChallenge}</button>`:`<button class="btn btn-ink btn-sm" type="button" data-nexttool>${TL.nextTool}</button><button class="btn btn-line btn-sm" type="button" data-go="match">${TL.skipShort}</button>`}</div>`;
  }else if(tt.mode==='match'){
    if(tt.mi>=JOBS.length){tt.dn.add('match');ttCheck();side.innerHTML=`<span class="label">${TL.allMatched}</span><div class="result"><div class="score">${tt.first}<small>${TL.firstTry}</small></div><p>${TL.workshop}</p></div><div class="push"><button class="btn btn-ink" type="button" data-go="pro">${TL.nextPro}</button><button class="btn btn-line btn-sm" type="button" data-replay="match">${TL.playAgain}</button></div>`;return}
    side.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span class="label">${fmt(TL.job,{n:tt.mi+1})}</span><div class="prog" aria-hidden="true">${JOBS.map((j,k)=>`<i class="${k<tt.mi?'done':k===tt.mi?'cur':''}"></i>`).join('')}</div></div><h3>${JOBS[tt.mi].task}</h3><div class="fb" id="ttFb"></div><div class="push"><button class="btn btn-ink" type="button" id="ttNext" hidden>${tt.mi===5?TL.seeResults:TL.nextJob}</button></div>`;
  }
}
function setMode(m){
  tt.mode=m;$$('#ttModes .mode').forEach(b=>{const on=b.dataset.mode===m;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1});
  clearTimeout(uTimer);$('#benchWrap').hidden=m==='pro'||m==='use';$('#proWrap').hidden=m!=='pro';$('#useWrap').hidden=m!=='use';
  $$('#tray button,#fb2d button').forEach(b=>delete b.dataset.st);
  $('#wallHint').textContent=m==='explore'?TL.hintExplore:TL.hintMatch;
  if(m!=='explore'){tt.sel=null;bench&&bench.select(null)}else bench&&bench.select(tt.sel);
  bench&&bench.mark(null);
  if(m==='pro')renderPro();else if(m==='use')renderUse();else{renderSide();trayState();bench&&bench.resize()}
}
function pick(id){
  if(tt.mode==='explore'){tt.sel=id;tt.seen.add(id);if(tt.seen.size===6){tt.dn.add('explore');ttCheck()}bench&&bench.select(id);renderSide();trayState();return}
  if(tt.mode!=='match'||tt.mi>=JOBS.length||tt.answered)return;
  const j=JOBS[tt.mi],t=T[id],b=$$(`[data-tool="${id}"]`),fb=$('#ttFb');tt.tries++;
  if(id===j.a){tt.answered=true;if(tt.tries===1)tt.first++;b.forEach(x=>x.dataset.st='ok');fb.className='fb ok';fb.innerHTML=`<h4>${say('tool')} ${t.the}.</h4><p>${t.use}</p><p class="hab"><b>${TL.safeHabitB}</b> ${t.safe}</p>`;react(fb);const n=$('#ttNext');n.hidden=false;n.focus({preventScroll:true});bench&&bench.mark(id,'ok')}
  else{b.forEach(x=>x.dataset.st='no');fb.className='fb no';fb.innerHTML=`<h4>${TL.tryOther}</h4><p>${t.the}: ${t.use.charAt(0).toLowerCase()+t.use.slice(1)}</p>`;react(fb);bench&&bench.mark(id,'no');setTimeout(()=>{b.forEach(x=>{if(x.dataset.st==='no')delete x.dataset.st});trayState()},900)}
  trayState();
}
function renderPro(){
  const sc=$('#proScene'),sd=$('#proSide');
  if(tt.pi>=PRO.length){tt.dn.add('pro');ttCheck();sc.innerHTML=`<span class="label">${TL.allSit}</span><p class="sit">${TL.stopSkill}</p>`;sd.innerHTML=`<span class="label">${TL.yourResult}</span><div class="result"><div class="score">${tt.pScore}<small> / 6</small></div><p>${TL.rule}</p></div><div class="push"><button class="btn btn-ink" type="button" data-replay="pro">${TL.playAgain}</button><button class="btn btn-line btn-sm" type="button" data-go="explore">${TL.backExplore}</button></div>`;return}
  const p=PRO[tt.pi];
  sc.innerHTML=`<div class="where">${p.w.map(w=>`<span class="chip">${w}</span>`).join('')}</div><p class="sit">${p.s}</p><div class="choices3" role="group" aria-label="${TL.whatDo}">${Object.entries(PROA).map(([k,v])=>`<button type="button" data-pa="${k}">${v[0]}<small>${v[1]}</small></button>`).join('')}</div>`;
  sd.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span class="label">${fmt(TL.situation,{n:tt.pi+1})}</span><div class="prog" aria-hidden="true">${PRO.map((x,k)=>`<i class="${k<tt.pi?'done':k===tt.pi?'cur':''}"></i>`).join('')}</div></div><h3>${TL.whatDo}</h3><p>${TL.someJobs}</p><div class="fb" id="proFb"></div><div class="push"><button class="btn btn-ink" type="button" id="proNext" hidden>${tt.pi===5?TL.seeResults:TL.nextSit}</button></div>`;
  tt.pAns=false;
}
$('#proWrap').addEventListener('click',e=>{
  const b=e.target.closest('[data-pa]');
  if(b&&!tt.pAns){tt.pAns=true;const p=PRO[tt.pi],right=b.dataset.pa===p.a;if(right)tt.pScore++;
    $$('[data-pa]').forEach(x=>{x.disabled=true;if(x.dataset.pa===p.a)x.classList.add('ok');else if(x===b)x.classList.add('no')});
    const fb=$('#proFb');fb.className='fb '+(right?'ok':'no');fb.innerHTML=`<h4>${right?say('pro'):fmt(TL.better,{l:PROA[p.a][0].toLowerCase()})}</h4><p>${p.why}</p>`;react(fb);const n=$('#proNext');n.hidden=false;n.focus({preventScroll:true})}
  if(e.target.closest('#proNext')){tt.pi++;renderPro()}
});
/* Use it: zoomed tape (3 inches, ticks every 1/16) with a board edge, and a shelf with a bubble level */
function tapeSvg(n){const S=100,v=n/8,st=Math.max(0,Math.round(v-1.5)),mx=(v-st)*S;let a='',b='',lb='';
  for(let k=0;k<=48;k++){const x=k*S/16,m=k%16===0,d=`M${x} 26v${m?60:k%8===0?47:k%4===0?36:k%2===0?26:17}`;if(m){a+=d;lb+=`<text x="${x}" y="118" text-anchor="middle">${st+k/16}</text>`}else b+=d}
  return `<svg viewBox="-18 0 336 152" role="img" aria-label="${TL.tapeAria}"><rect x="-18" y="24" width="336" height="106" fill="#F2D24B"/><rect x="-18" y="124" width="336" height="6" fill="#D6B52E"/><rect x="-18" y="24" width="336" height="2" fill="#16211C" opacity=".35"/><rect x="${mx}" y="0" width="${318-mx}" height="24" fill="#C99A63"/><rect x="${mx-3}" y="24" width="6" height="104" fill="#B83A2A" opacity=".3"/><path d="M${mx} 0V24" stroke="#B83A2A" stroke-width="3"/><path d="${b}" stroke="#16211C" stroke-width="1.6" fill="none"/><path d="${a}" stroke="#16211C" stroke-width="2.8" fill="none"/><g fill="#16211C" font-family="Geist,system-ui,sans-serif" font-size="28" font-weight="700">${lb}</g><path d="M${mx-8} 151L${mx} 134L${mx+8} 151z" fill="#B83A2A"/></svg>`}
const bubX=v=>Math.max(-14,Math.min(14,v*6)),tiltTxt=v=>v===0?TL.tiltLevel:fmt(v>0?TL.tiltRight:TL.tiltLeft,{n:Math.abs(v)});
const shelfSvg=v=>`<svg viewBox="10 72 300 118" role="img" aria-label="${TL.shelfAria}"><rect x="10" y="72" width="300" height="118" rx="14" fill="#F2E6D3"/><rect x="146" y="128" width="28" height="52" rx="4" fill="#9AA4AB"/><circle cx="160" cy="146" r="2.5" fill="#6B747A"/><circle cx="160" cy="164" r="2.5" fill="#6B747A"/><g id="shelfG" transform="rotate(${-v} 160 128)"><rect x="30" y="122" width="260" height="12" rx="2" fill="#C99A63"/><rect x="30" y="122" width="260" height="3" rx="1.5" fill="#D9B07A"/><rect x="104" y="100" width="112" height="22" rx="4" fill="#2F6450"/><rect x="138" y="104" width="44" height="14" rx="7" fill="#EEF3C9"/><path d="M150 104v14M170 104v14" stroke="#16211C" stroke-width="1.5"/><ellipse id="bub" cx="160" cy="111" rx="6" ry="4" fill="#fff" stroke="#7C8A4A" stroke-width="1" style="transform:translateX(${bubX(v)}px)"/></g><circle cx="160" cy="128" r="5" fill="#16211C"/></svg>`;
function shelfSet(v){$('#shelfG').setAttribute('transform',`rotate(${-v} 160 128)`);$('#bub').style.transform=`translateX(${bubX(v)}px)`;const t=$('#tilt');t.setAttribute('aria-valuetext',tiltTxt(v))}
function renderUse(){
  const sc=$('#useScene'),sd=$('#useSide'),i=tt.ui;clearTimeout(uTimer);
  const pr=`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span class="label">${i<4?fmt(TL.question,{n:i+1}):i===4?TL.lastTask:TL.allDone}</span><div class="prog" aria-hidden="true">${[0,1,2,3,4].map(k=>`<i class="${k<i?'done':k===i?'cur':''}"></i>`).join('')}</div></div>`;
  if(i<4){const q=tt.uq[i];
    sc.innerHTML=`<p class="uq">${TL.tapeQ}</p><div class="tape">${tapeSvg(q.n)}</div><div class="choices3 c4" role="group" aria-label="${TL.tapeGroup}">${q.o.map(k=>`<button type="button" data-ua="${k}">${tfmt(k)}</button>`).join('')}</div>`;
    sd.innerHTML=`${pr}<h3>${TL.readTape}</h3><p>${TL.readTapeP}</p><div class="fb" id="useFb"></div><div class="push"><button class="btn btn-ink" type="button" id="useNext" hidden>${i===3?TL.nextShelf:TL.nextQ}</button></div>`;tt.uAns=false}
  else if(i===4){const v=tt.sw?0:tt.sv;
    sc.innerHTML=`<p class="uq">${TL.shelfQ}</p><div class="tape">${shelfSvg(v)}</div><div class="tilt"><label for="tilt">${TL.tiltLabel}</label><input type="range" id="tilt" min="-12" max="12" step="0.5" value="${v}" aria-valuetext="${tiltTxt(v)}"${tt.sw?' disabled':''}><div class="tilt-ends"><span>${TL.raiseL}</span><span>${TL.raiseR}</span></div></div>`;
    sd.innerHTML=`${pr}<h3>${TL.levelH}</h3><p>${TL.levelP}</p><div class="fb${tt.sw?' ok':''}" id="useFb">${tt.sw?`<h4>${TL.levelFb}</h4><p>${TL.levelFbP}</p>`:''}</div><div class="push"><button class="btn btn-ink" type="button" id="useNext"${tt.sw?'':' hidden'}>${TL.seeResults}</button></div>`}
  else{tt.dn.add('use');const nm=TL.restNames,rest=['explore','match','pro'].filter(m=>!tt.dn.has(m)).map(m=>nm[m]);
    sc.innerHTML=`<p class="uq">${TL.usedBoth}</p><div class="tape">${shelfSvg(0)}</div>`;
    sd.innerHTML=`${pr}<h3>${TL.nice}</h3><div class="result"><div class="score">${tt.uScore}<small>${TL.tapeScore}</small></div><p>${rest.length?fmt(TL.rest,{list:rest.join(', ').replace(/, ([^,]+)$/,rest.length>1?' '+TL.and+' $1':', $1')}):TL.allModes}</p></div><div class="push"><button class="btn btn-line btn-sm" type="button" data-replay="use">${TL.playAgain}</button><button class="btn btn-line btn-sm" type="button" data-go="explore">${TL.backExplore}</button></div>`;ttCheck()}
}
function ttCheck(){if(!tt.fin&&['explore','match','pro','use'].every(m=>tt.dn.has(m))){tt.fin=true;finish('tools')}}
$('#useWrap').addEventListener('click',e=>{
  const b=e.target.closest('[data-ua]');
  if(b&&!tt.uAns){tt.uAns=true;const q=tt.uq[tt.ui],k=+b.dataset.ua,ok=k===q.n,w=q.n>>3,r=q.n%8;if(ok)tt.uScore++;
    $$('[data-ua]').forEach(x=>{x.disabled=true;if(+x.dataset.ua===q.n)x.classList.add('ok');else if(x===b)x.classList.add('no')});
    const fb=$('#useFb');fb.className='fb '+(ok?'ok':'no');fb.innerHTML=`<h4>${ok?say('use')+' '+fmt(TL.tapeIs,{t:tfmt(q.n)}):fmt(TL.tapeNo,{t:tfmt(q.n)})}</h4><p>${fmt(TL.tapeWhy,{w,c:r*2,f:frac(r)})}</p>`;react(fb);const n=$('#useNext');n.hidden=false;n.focus({preventScroll:true})}
  if(e.target.closest('#useNext')){tt.ui++;renderUse()}
});
$('#useWrap').addEventListener('input',e=>{if(e.target.id!=='tilt'||tt.sw)return;const v=+e.target.value;tt.sv=v;shelfSet(v);clearTimeout(uTimer);
  if(Math.abs(v)<=.5)uTimer=setTimeout(()=>{if(tt.ui!==4||tt.sw)return;tt.sw=true;tt.sv=0;const t=$('#tilt');t.value=0;t.disabled=true;shelfSet(0);const fb=$('#useFb');fb.className='fb ok';fb.innerHTML=`<h4>${TL.levelFb}</h4><p>${TL.levelFbP}</p>`;const n=$('#useNext');n.hidden=false;n.focus({preventScroll:true})},700)});
$('#ttModes').addEventListener('click',e=>{const b=e.target.closest('.mode');if(b)setMode(b.dataset.mode)});
$('#ttModes').addEventListener('keydown',e=>{const ms=['explore','match','pro','use'];let i=ms.indexOf(tt.mode);if(e.key==='ArrowRight')i++;else if(e.key==='ArrowLeft')i--;else return;e.preventDefault();i=(i+4)%4;setMode(ms[i]);$('#m-'+ms[i]).focus()});
$('#tools').addEventListener('click',e=>{
  const tb=e.target.closest('#tray [data-tool],#fb2d [data-tool]');if(tb){pick(tb.dataset.tool);return}
  const g=e.target.closest('[data-go]');if(g){setMode(g.dataset.go);return}
  const rp=e.target.closest('[data-replay]');if(rp){if(rp.dataset.replay==='match'){tt.mi=0;tt.first=0;tt.tries=0;tt.answered=false}else if(rp.dataset.replay==='use')Object.assign(tt,useFresh());else{tt.pi=0;tt.pScore=0;PRO=dealPro()}setMode(rp.dataset.replay);return}
  if(e.target.closest('[data-nexttool]')){const i=TOOLS.findIndex(t=>t.id===tt.sel);pick(TOOLS[(i+1)%6].id);return}
  if(e.target.closest('#ttNext')){tt.mi++;tt.tries=0;tt.answered=false;$$('#tray button,#fb2d button').forEach(b=>delete b.dataset.st);bench&&bench.mark(null);renderSide();trayState()}
});
tray.addEventListener('pointerover',e=>{const b=e.target.closest('[data-tool]');bench&&bench.hover(b?b.dataset.tool:null)});
tray.addEventListener('pointerleave',()=>bench&&bench.hover(null));
tray.addEventListener('focusin',e=>{const b=e.target.closest('[data-tool]');bench&&bench.hover(b?b.dataset.tool:null)});
tray.addEventListener('focusout',()=>bench&&bench.hover(null));
$('#ttReset').addEventListener('click',()=>{clearTimeout(uTimer);tt=freshTT();pracHide('tools');bench&&bench.select(null);setMode('explore');toast(TL.reset)});

let bench=null,benchTried=false;
function initBench(){
  if(benchTried)return;benchTried=true;
  const flat=()=>$('#wall').classList.add('flat');
  if(!hasGL()){flat();return}
  loadThree().then(()=>{
    try{bench=buildBench()}catch(e){bench=null}
    if(!bench){flat();return}
    const onTools=curAct==='tools';bench.active(onTools);if(onTools)bench.resize();
    if(tt.sel)bench.select(tt.sel);
  },flat);
}
function buildBench(){
  const THREE=window.THREE,host=$('#wall'),r=setupRenderer(THREE,host),scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(28,2,.1,100);
  scene.add(new THREE.HemisphereLight(0xfffaf2,0xb8a98e,.82));
  const key=new THREE.DirectionalLight(0xffffff,.7);key.position.set(-3,5,7);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-6,right:6,top:5,bottom:-5,near:1,far:20});key.shadow.radius=5;key.shadow.bias=-.0005;scene.add(key);
  const wall=new THREE.Mesh(new THREE.PlaneGeometry(30,20),new THREE.ShadowMaterial({opacity:.14}));wall.receiveShadow=true;scene.add(wall);
  const mk=makeTools(THREE);
  const tools=TOOLS.map((t,i)=>{const g=mk[t.id]();g.userData={id:t.id,i,lift:0,st:null,shake:0};g.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.userData.e=o.material.emissive.clone()}});scene.add(g);
    const peg=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.3,12),new THREE.MeshStandardMaterial({color:0xb7bec5,metalness:.6,roughness:.3}));peg.rotation.x=Math.PI/2;peg.castShadow=true;scene.add(peg);g.userData.peg=peg;return g});
  let sel=null,hov=null,tagHov=null,on=false,run=false,par={x:0,y:0},pin=false;const t0=performance.now();
  function layout(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;const nar=w<620,cols=nar?3:6,rows=nar?2:1,dx=nar?1.3:1.12,dy=2.2;
    tools.forEach((g,i)=>{const c=i%cols,rr=Math.floor(i/cols);const x=(c-(cols-1)/2)*dx,y=((rows-1)/2-rr)*dy;g.userData.b=[x,y];g.userData.peg.position.set(x,y+.98,.15)});
    r.setSize(w,h,false);cam.aspect=w/h;const bw=cols*dx+.4,bh=rows*dy+.6,f=cam.fov*Math.PI/180;const d=Math.max((bh/2)/Math.tan(f/2),(bw/2)/(Math.tan(f/2)*cam.aspect))*1.02;cam.position.set(0,0,d);cam.lookAt(0,0,0);cam.updateProjectionMatrix()}
  layout();new ResizeObserver(()=>{layout();wake()}).observe(host);
  const ray=new THREE.Raycaster(),v=new THREE.Vector2();
  function hit(e){const b=r.domElement.getBoundingClientRect();v.x=((e.clientX-b.left)/b.width)*2-1;v.y=-((e.clientY-b.top)/b.height)*2+1;ray.setFromCamera(v,cam);const h=ray.intersectObjects(tools,true);if(!h.length)return null;let o=h[0].object;while(o&&!o.userData.id)o=o.parent;return o?o.userData.id:null}
  r.domElement.addEventListener('pointermove',e=>{hov=hit(e);r.domElement.style.cursor=hov?'pointer':'default';const b=r.domElement.getBoundingClientRect();par.x=(e.clientX-b.left)/b.width-.5;par.y=(e.clientY-b.top)/b.height-.5;pin=true;wake()});
  r.domElement.addEventListener('pointerleave',()=>{hov=null;pin=false;wake()});
  let dn=null;r.domElement.addEventListener('pointerdown',e=>dn={x:e.clientX,y:e.clientY});
  r.domElement.addEventListener('pointerup',e=>{if(!dn)return;const m=Math.hypot(e.clientX-dn.x,e.clientY-dn.y);dn=null;if(m>10)return;const id=hit(e);if(id)pick(id)});
  const tmp=new THREE.Color();
  function frame(now){if(!on){run=false;return}const t=(now-t0)/1000;let busy=false;
    cam.position.x+=((pin&&!RM?par.x*.5:0)-cam.position.x)*.06;cam.position.y+=((pin&&!RM?-par.y*.35:0)-cam.position.y)*.06;cam.lookAt(0,0,0);
    tools.forEach((g,i)=>{const u=g.userData,h=hov===u.id||tagHov===u.id,s=sel===u.id;
      const tgt=s?.9:u.st==='ok'?.5:h?.28:0;u.lift+=(tgt-u.lift)*.12;if(Math.abs(tgt-u.lift)>.003)busy=true;
      const sway=RM?0:Math.sin(t*1.1+i*1.3)*.06;
      if(s&&!RM)g.rotation.y=t*.9;else g.rotation.y+=((sway+(h&&!RM?.35:0))-g.rotation.y)*.1;
      let sx=0;if(u.shake>0){u.shake=Math.max(0,u.shake-.04);sx=Math.sin(u.shake*40)*.05*u.shake;busy=true}
      g.position.set(u.b[0]+sx,u.b[1]-u.lift*.1,.22+u.lift);g.scale.setScalar(1+u.lift*.16);
      const em=u.st==='ok'?0x1e5a44:u.st==='no'?0x7a2a1d:(h||s)?0x2a2418:null,k=u.st?.45:(h||s)?.3:0;
      g.traverse(o=>{if(o.isMesh){if(em!==null){tmp.setHex(em).multiplyScalar(k);o.material.emissive.copy(o.userData.e).add(tmp)}else o.material.emissive.copy(o.userData.e)}})});
    r.render(scene,cam);if(!RM||busy)requestAnimationFrame(frame);else run=false}
  function wake(){if(on&&!run){run=true;requestAnimationFrame(frame)}}
  new IntersectionObserver(es=>api.active(es[0].isIntersecting&&curAct==='tools')).observe(host);
  document.addEventListener('visibilitychange',()=>api.active(!document.hidden&&curAct==='tools'));
  const api={active(x){on=x;if(x)wake()},resize(){layout();wake()},select(id){sel=id;wake()},
    hover(id){tagHov=id;$$('#tray button').forEach(b=>b.classList.toggle('is-hover',b.dataset.tool===id));wake()},
    mark(id,st){tools.forEach(g=>{const u=g.userData;if(!id)u.st=null;else if(u.id===id){u.st=st;if(st==='no'){u.shake=1;setTimeout(()=>{if(u.st==='no'){u.st=null;wake()}},900)}}else if(st==='ok')u.st=null});wake()}};
  api.active(true);r.render(scene,cam);return api;
}
setMode('explore');
initBench();

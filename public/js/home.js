"use strict";
/* ---------- curriculum ---------- */
const MODS=[
 {k:'home',t:'Home & tools',man:'manuals/home-tools.html',d:'Using basic hand tools safely and handling the small fixes every home needs.',L:[['Meet your toolbox','What each common hand tool is for, and how to hold it.'],['Small fixes','Tighten a loose handle, hang something level, change a light bulb.'],['When water goes wrong','Find the shutoff valve and what to do first during a leak.']],st:'A practice board with screws, nails, a level and a shutoff valve.',stop:'Breakers, wiring, gas or anything sparking: step back and get an adult or a professional.',g:['Grades 3–8']},
 {k:'tech',t:'Tech & online safety',man:'manuals/tech.html',d:'Troubleshooting devices, protecting accounts and spotting scams before they cost you.',L:[['Restart, update, check','A simple routine that fixes most device problems.'],['Locks that work','Passphrases, two-step sign-in and never sharing a password.'],['Spot the scam','The red flags in fake prizes, account alerts and “new number” texts.']],st:'Sample messages and a practice account to secure.',stop:'Money lost, threats, or someone pressuring you to keep secrets: tell a trusted adult right away.',g:['Grades 3–8']},
 {k:'care',t:'Personal care',man:'manuals/care.html',d:'Daily routines and doing laundry from start to finish.',L:[['Read the label','What wash and dry symbols mean.'],['Run a load','Sort, measure, wash, dry and fold.'],['Everyday routines','Building simple habits that stick.']],st:'A sorting station with real clothes and care labels.',stop:'Ask before using bleach or other strong cleaning products.',g:['Grades 3–8']},
 {k:'cook',t:'Simple cooking',man:'manuals/cook.html',d:'Kitchen safety, following a recipe, making a simple meal, and cleaning up.',L:[['Clean start','Handwashing, a clean surface and safe knife handling.'],['Read a recipe','Measuring, timing and following steps in order.'],['Make it, clean it','A no-stove meal, then cleanup as part of cooking.']],st:'Recipe cards, measuring tools and no-stove ingredients.',stop:'Stovetops and ovens come later, with an adult always present.',g:['Grades 3–8']},
 {k:'money',t:'Money',man:'manuals/money.html',d:'Needs versus wants, comparing prices and building the habit of saving a little.',L:[['Needs and wants','Sorting real purchases and deciding what comes first.'],['Compare and choose','Unit prices, sales and when cheaper isn’t better.'],['Plan and save','A simple plan for spending, and setting some aside.']],st:'A mock store with price tags and a weekly budget.',stop:'Anyone asking for card numbers, passwords or gift cards: stop and check with an adult.',g:['Grades 4–8']},
 {k:'comm',t:'Communication',man:'manuals/comm.html',d:'Introducing yourself, making a call and disagreeing respectfully.',L:[['First impressions','A handshake, eye contact and a clear introduction.'],['Make the call','Planning what to say, then calling to ask or reschedule.'],['Disagree well','Staying calm and respectful when you don’t agree.']],st:'Role-play stations with real-world scripts.',stop:'Any conversation that feels unsafe: walk away and find a trusted adult.',g:['Grades 4–8']},
 {k:'help',t:'Knowing when to ask',man:'manuals/help.html',d:'Recognizing when a job is too big or unsafe, and knowing exactly who to ask.',L:[['Handle, ask or call','Sorting situations by who should handle them.'],['Your people','Naming the adults you can go to at home, school and nearby.'],['Emergencies','When to leave, when to call 911, and what to say.']],st:'Scenario cards drawn from real household situations.',stop:'This one is part of every other topic too.',g:['Grades 3–8']},
 {k:'car',t:'Vehicle basics',later:1,d:'For older students, later on: dashboard lights, tire checks, and what to do if a car breaks down.',L:[['Read the dash','What common warning lights mean.'],['Tire check','Checking pressure and tread, with an adult.'],['Breakdown plan','Getting safe and getting help.']],st:'Coming later.',stop:'All vehicle work happens with an adult. Nothing under the hood without one.',g:['Older students','Preview']}
];
/* ---------- topics: eight tiles. Phones: tap one to open its lessons below. Desktop: a side list with one topic always open ---------- */
const cxTiles=$$('#cxTiles .cx-tile'),cxPanel=$('#cxPanel'),cxWide=matchMedia('(min-width:900px)');
let cxI=-1;
function showMod(i,focus){
  cxI=(i+MODS.length)%MODS.length;const m=MODS[cxI];
  cxTiles.forEach((b,j)=>b.setAttribute('aria-expanded',String(j===cxI)));
  cxPanel.hidden=false;cxPanel.setAttribute('aria-labelledby','cxt-'+m.k);
  cxPanel.innerHTML=`<div class="cx-head"><div><h3>${m.t}</h3><p>${m.d}</p></div>${m.man?`<a class="btn btn-line btn-sm" href="${m.man}">Read the free manual</a>`:m.later?'<span class="chip soon">Coming later</span>':''}</div>
  <div class="cx-body"><div class="cx-lessons"><span class="label">Lessons</span>${m.L.map((l,j)=>`<div class="lesson"><span class="n">${j+1}</span><b>${l[0]}</b><span class="ds">${l[1]}</span></div>`).join('')}</div>
  <div class="cx-side"><div class="callout"><span class="label">Hands-on practice</span><p>${m.st}</p></div><div class="callout stop"><span class="label">Know when to stop</span><p>${m.stop}</p></div></div></div>
  <div class="cx-foot"><span class="muted" style="font-size:14.5px">${cxI+1} of ${MODS.length}. Schools can pick any topics, in any order.</span><div class="cx-nav"><button class="icon-btn" type="button" data-cx="-1" aria-label="Previous topic">${I.prev}</button><button class="icon-btn" type="button" data-cx="1" aria-label="Next topic">${I.next}</button></div></div>`;
  cxPanel.classList.remove('swap');void cxPanel.offsetWidth;cxPanel.classList.add('swap');
  if(focus)cxTiles[cxI].focus({preventScroll:true});
}
function closeMod(){cxI=-1;cxPanel.hidden=true;cxTiles.forEach(b=>b.setAttribute('aria-expanded','false'))}
$('#cxTiles').addEventListener('click',e=>{const b=e.target.closest('.cx-tile');if(!b)return;const i=+b.dataset.i;if(i===cxI){if(!cxWide.matches)closeMod();return}showMod(i);if(cxWide.matches)return;
  const r=cxPanel.getBoundingClientRect();if(r.top>innerHeight-160)scrollTo({top:scrollY+r.top-110,behavior:RM?'auto':'smooth'})});
cxPanel.addEventListener('click',e=>{const b=e.target.closest('[data-cx]');if(b)showMod(cxI+ +b.dataset.cx)});
if(cxWide.matches)showMod(0);else closeMod();
cxWide.addEventListener('change',()=>{if(cxWide.matches&&cxI<0)showMod(0)});

// Sideways rows get an arrow just below them: right while more is hidden, left (back to the start) once the end is reached
function edgeArrows(row){if(!row)return;const sx=document.createElement('div'),hint=document.createElement('div');sx.className='sx';hint.className='sx-hint';row.before(sx);sx.append(row,hint);
  const mk=(c,d,go)=>{const b=document.createElement('button');b.type='button';b.className='sx-btn '+c;b.tabIndex=-1;b.setAttribute('aria-hidden','true');
    b.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;b.addEventListener('click',go);hint.append(b)};
  const by=o=>row.scrollTo({left:o,behavior:RM?'auto':'smooth'});
  mk('sx-l','M19 12H5M11 6l-6 6 6 6',()=>by(0));mk('sx-r','M5 12h14M13 6l6 6-6 6',()=>by(row.scrollLeft+row.clientWidth*.8));
  const upd=()=>{const m=row.scrollWidth-row.clientWidth,x=row.scrollLeft;if(m<4)delete sx.dataset.sx;else sx.dataset.sx=x>=m-4?'l':x>4?'m':'r'};
  row.addEventListener('scroll',upd,{passive:true});
  if('ResizeObserver' in window)new ResizeObserver(upd).observe(row);else addEventListener('resize',upd);
  if(document.fonts)document.fonts.ready.then(upd);upd();
  // One peek the first time the row is on screen: slide a little and back so it reads as swipeable
  let touched=false;['pointerdown','wheel','keydown'].forEach(t=>row.addEventListener(t,()=>{touched=true},{passive:true,once:true}));
  if(!RM&&'IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(!es[0].isIntersecting||sx.dataset.sx!=='r')return;io.disconnect();
    setTimeout(()=>{if(touched||row.scrollLeft>4)return;by(Math.min(90,row.scrollWidth-row.clientWidth));setTimeout(()=>{if(!touched)by(0)},650)},500)},{threshold:1});io.observe(row)}}
edgeArrows($('#actRow'));

/* ---------- hero 3D ---------- */
let hero=null;
if(hasGL())loadThree().then(startHero,()=>{});
function startHero(){
  const host=$('#heroStage');if(!window.THREE||!hasGL()||hero)return;
  try{
    const THREE=window.THREE,r=setupRenderer(THREE,host),scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(30,1,.1,100);
    scene.add(new THREE.HemisphereLight(0xfffaf2,0xb8a98e,.78));
    const key=new THREE.DirectionalLight(0xffffff,.85);key.position.set(-4,9,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:1,far:30});key.shadow.radius=6;key.shadow.bias=-.0004;scene.add(key);
    const rim=new THREE.DirectionalLight(0xdfe8f2,.35);rim.position.set(6,4,-4);scene.add(rim);
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShadowMaterial({opacity:.15}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
    const mk=makeTools(THREE),grp=new THREE.Group();scene.add(grp);
    const L=[['hammer',-1.6,-1.1,-.5,.2],['tape',.45,-1.25,0,-.3],['level',2.0,-.4,.15,-.1],['phillips',-2.1,.95,.35,-.4],['wrench',-.35,.85,-.25,.3],['flat',1.25,1.25,.4,.5]];
    const items=L.map(([id,x,z,rz,ry],i)=>{const g=mk[id]();g.rotation.set(-Math.PI/2,0,rz);const w=new THREE.Group();w.add(g);w.position.set(x,id==='tape'?.13:id==='level'?.06:.09,z);w.rotation.y=ry;w.userData={base:w.position.y,i};grp.add(w);return w});
    $('#heroFallback').hidden=true;
    let px=0,py=0,tx=0,ty=0,on=true,run=false;const t0=performance.now();
    const LT={hammer:[-1.15,-2.35],tape:[1.15,-2.3],phillips:[-1.15,0],wrench:[1.15,.05],flat:[-1.15,2.3],level:[1.15,2.25]};
    const dir=new THREE.Vector3(0,.805,.593).normalize(),box=new THREE.Box3(),ctr=new THREE.Vector3(),v3=new THREE.Vector3();
    function fit(){const sv=[grp.rotation.x,grp.rotation.y,grp.rotation.z,grp.position.z];grp.rotation.set(0,0,0);grp.position.z=0;grp.updateMatrixWorld(true);
      box.setFromObject(grp);box.getCenter(ctr);ctr.y=0;
      const pts=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])pts.push(new THREE.Vector3(x,y,z));
      let lo=2,hi=40;for(let k=0;k<28;k++){const d=(lo+hi)/2;cam.position.copy(ctr).addScaledVector(dir,d);cam.lookAt(ctr);cam.updateMatrixWorld(true);cam.updateProjectionMatrix();
        let ok=true;for(const q of pts){v3.copy(q).project(cam);if(Math.abs(v3.x)>.8||Math.abs(v3.y)>.8){ok=false;break}}if(ok)hi=d;else lo=d}
      cam.position.copy(ctr).addScaledVector(dir,hi);cam.lookAt(ctr);cam.updateProjectionMatrix();
      grp.rotation.set(sv[0],sv[1],sv[2]);grp.position.z=sv[3]}
    function size(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.fov=30;const tall=cam.aspect<.85;
      items.forEach((it,i)=>{const id=L[i][0];if(tall){it.position.x=LT[id][0];it.position.z=LT[id][1];it.children[0].rotation.z=L[i][3]*.35}else{it.position.x=L[i][1];it.position.z=L[i][2];it.children[0].rotation.z=L[i][3]}});
      cam.updateProjectionMatrix();fit()}
    size();new ResizeObserver(()=>{size();r.render(scene,cam)}).observe(host);
    host.addEventListener('pointermove',e=>{const b=host.getBoundingClientRect();tx=(e.clientX-b.left)/b.width-.5;ty=(e.clientY-b.top)/b.height-.5;wake()});
    host.addEventListener('pointerleave',()=>{tx=ty=0;wake()});
    function frame(now){if(!on){run=false;return}const t=(now-t0)/1000;px+=(tx-px)*.05;py+=(ty-py)*.05;
      grp.rotation.y=RM?0:Math.sin(t*.2)*.08+px*.18;grp.rotation.x=RM?0:py*.06;
      items.forEach(w=>{const u=w.userData;w.position.y=u.base+(RM?0:Math.max(0,Math.sin(t*.9+u.i*1.1))*.06)});
      r.render(scene,cam);if(!RM)requestAnimationFrame(frame);else run=false}
    function wake(){if(on&&!run){run=true;requestAnimationFrame(frame)}}
    new IntersectionObserver(es=>hero&&hero.active(es[0].isIntersecting&&curView==='home')).observe(host);
    let sc=0;hero={active(v){on=v;if(v)wake()},scroll(p){sc=p;if(RM)return;grp.position.z=p*.5;grp.rotation.z=p*.06;if(!run)r.render(scene,cam)}};hero.active(true);r.render(scene,cam);
  }catch(e){hero=null}
}

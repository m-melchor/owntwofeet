"use strict";
/* ---------- 3D tool models ---------- */
/* tool words (name, use, grip, safe) come from the "actTools" group, which only the Tool Time page carries */
const TL=document.getElementById('txt-actTools')?TXT('actTools'):null;
const TOOLS=['hammer','phillips','tape','wrench','flat','level'].map(id=>({id,...(TL?TL.tools[id]:{})}));
const T=Object.fromEntries(TOOLS.map(t=>[t.id,t]));
function hasGL(){try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl')))}catch(e){return false}}
function makeTools(THREE){
  const M=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.62,metalness:0},o));
  const steel=()=>M(0xc6ccd2,{metalness:.55,roughness:.32});
  const mesh=(g,m,p,r)=>{const x=new THREE.Mesh(g,m);if(p)x.position.set(...p);if(r)x.rotation.set(...r);x.castShadow=true;x.receiveShadow=true;return x};
  const B=(a,b,c)=>new THREE.BoxGeometry(a,b,c),C=(a,b,h,s=28)=>new THREE.CylinderGeometry(a,b,h,s);
  const RB=(w,h,d,r)=>{const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSize:.02,bevelThickness:.02,bevelSegments:3,curveSegments:10});g.translate(0,0,-d/2);return g};
  const driver=(col,tip)=>{const g=new THREE.Group(),h=M(col,{roughness:.45});
    g.add(mesh(C(.125,.14,.6,32),h,[0,.5,0]));g.add(mesh(new THREE.SphereGeometry(.125,24,12,0,Math.PI*2,0,Math.PI/2),h,[0,.8,0]));
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;g.add(mesh(C(.018,.018,.5,6),M(col,{roughness:.6}),[Math.cos(a)*.128,.5,Math.sin(a)*.128]))}
    g.add(mesh(C(.06,.07,.08),M(0x6b7680,{metalness:.3}),[0,.16,0]));g.add(mesh(C(.03,.03,.85,16),steel(),[0,-.3,0]));
    g.add(tip==='x'?mesh(new THREE.ConeGeometry(.045,.15,4),steel(),[0,-.79,0],[Math.PI,Math.PI/4,0]):mesh(B(.1,.14,.022),steel(),[0,-.78,0]));return g};
  return {
    hammer(){const g=new THREE.Group();g.add(mesh(C(.065,.07,1.3,24),M(0xcfa77d,{roughness:.7}),[0,-.12,0]));g.add(mesh(C(.088,.085,.52,24),M(0x2b3540,{roughness:.85}),[0,-.56,0]));
      g.add(mesh(RB(.5,.16,.16,.04),steel(),[.04,.6,0]));g.add(mesh(C(.095,.1,.14,24),steel(),[.34,.6,0],[0,0,Math.PI/2]));g.add(mesh(B(.3,.07,.12),steel(),[-.3,.65,0],[0,0,.5]));return g},
    phillips(){return driver(0x7fa893,'x')},
    flat(){return driver(0x86a3bf,'f')},
    wrench(){const g=new THREE.Group(),s=steel();g.add(mesh(RB(.17,1.15,.06,.07),s,[0,-.22,0]));g.add(mesh(C(.24,.24,.07,36),s,[0,.48,0],[Math.PI/2,0,0]));
      g.add(mesh(B(.09,.26,.075),s,[-.13,.7,0]));g.add(mesh(B(.09,.2,.075),s,[.14,.67,0]));g.add(mesh(C(.045,.045,.15,16),M(0x2b3540),[0,.24,.02],[0,0,Math.PI/2]));
      g.add(mesh(C(.045,.045,.075,20),M(0xe6e0d4),[0,-.78,0],[Math.PI/2,0,0]));return g},
    tape(){const g=new THREE.Group();g.add(mesh(RB(.72,.72,.26,.16),M(0xe5c27e,{roughness:.45}),[0,.35,0]));g.add(mesh(C(.2,.2,.03,40),M(0x2b3540),[0,.35,.145],[Math.PI/2,0,0]));
      g.add(mesh(C(.07,.07,.04,24),M(0xe5c27e),[0,.35,.16],[Math.PI/2,0,0]));g.add(mesh(B(.13,.85,.012),M(0xf0e2b6,{roughness:.6}),[.24,-.42,.05]));
      for(let i=0;i<8;i++)g.add(mesh(B(i%2?.04:.07,.01,.004),M(0x2b3540),[.21,-.1-i*.1,.058]));g.add(mesh(B(.17,.05,.07),steel(),[.24,-.86,.05]));return g},
    level(){const g=new THREE.Group();g.add(mesh(RB(.24,1.75,.12,.05),M(0x8fb09b,{roughness:.5}),[0,0,0]));g.add(mesh(B(.17,.26,.02),M(0x2b3540),[0,0,.092]));
      g.add(mesh(C(.05,.05,.2,20),M(0xdde9b0,{roughness:.15,emissive:0x2a3010,emissiveIntensity:.2}),[0,0,.115]));g.add(mesh(new THREE.SphereGeometry(.033,14,10),M(0xffffff),[0,0,.16]));
      g.add(mesh(C(.055,.055,.02,24),M(0x2b3540),[0,.72,.094],[Math.PI/2,0,0]));g.add(mesh(C(.055,.055,.02,24),M(0x2b3540),[0,-.72,.094],[Math.PI/2,0,0]));return g}
  };
}
function setupRenderer(THREE,host){const r=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});r.setPixelRatio(Math.min(devicePixelRatio||1,2));r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;r.domElement.setAttribute('aria-hidden','true');host.insertBefore(r.domElement,host.firstChild);return r}

/* ---------- three.js loads only when a 3D scene needs it, so it never blocks the page ---------- */
let threeP=null;
function loadThree(){
  if(window.THREE)return Promise.resolve(window.THREE);
  if(!threeP)threeP=new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.async=true;s.onload=()=>window.THREE?res(window.THREE):rej(new Error('three missing'));s.onerror=()=>rej(new Error('three failed'));document.head.appendChild(s)});
  return threeP}

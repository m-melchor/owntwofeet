"use strict";
/* ---------- previews ---------- */
const PVT=TXT('actpv'),PV=PVT.items;
$('#previewGrid').innerHTML=PV.map(p=>`<article class="pv"><div class="top"><span class="chip soon">${p.s}</span></div><h3>${p.t}</h3><p>${p.d}</p><details><summary>${PVT.practice}</summary><ul>${p.b.map(x=>`<li>${x}</li>`).join('')}</ul></details></article>`).join('');
$('#prev-h').textContent=PVT.more.replace('{n}',PV.length);$('#previews').open=false;

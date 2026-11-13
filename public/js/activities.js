"use strict";
/* ---------- previews ---------- */
const PV=[
 {t:'Password Builder',m:'Tech & online safety',s:'Coming soon',d:'Turn a silly sentence into a strong passphrase you can remember.',b:['Why short passwords get guessed','Building a four-word passphrase','Never sharing, even with friends']},
 {t:'Snack Lab',m:'Simple cooking',s:'Coming soon',d:'Follow a recipe card to build a no-stove snack, then clean the station.',b:['Clean hands, clean surface','Measuring from a recipe','Cleanup as part of cooking']},
 {t:'Shutoff Finder',m:'Home & tools',s:'Coming soon',d:'Find the water shutoffs in a home and practice what to do first in a leak.',b:['Where shutoff valves live','Which way to turn','Who to tell, right away']},
 {t:'Dashboard Basics',m:'Vehicle basics',s:'Preview',d:'Coming later: what warning lights mean and when to pull over.',b:['Warning light colors','Tire checks with an adult','Who to call in a breakdown']}
];
$('#previewGrid').innerHTML=PV.map(p=>`<article class="pv"><div class="top"><span class="chip soon">${p.s}</span></div><h3>${p.t}</h3><p>${p.d}</p><details><summary>What students practice</summary><ul>${p.b.map(x=>`<li>${x}</li>`).join('')}</ul></details></article>`).join('');
$('#prev-h').textContent=PV.length+' more activities on the way';$('#previews').open=false;

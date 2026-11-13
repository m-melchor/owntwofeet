// Every manual page: one screen at a time (home, lessons, check, sources), picked by the address hash.
// Screen names for the tab title come from <body data-names>.
(function(){
  var root=document.documentElement;
  root.classList.add('js');
  var screens=Array.prototype.slice.call(document.querySelectorAll('[data-screen]'));
  var names=JSON.parse(document.body.getAttribute('data-names'));
  var cur='home',prev='home',first=true;
  function jump(y){root.style.scrollBehavior='auto';window.scrollTo(0,y);requestAnimationFrame(function(){root.style.scrollBehavior=''});}
  function show(){
    var hash=location.hash.replace('#','')||'home',target=null;
    if(/^s\d+$/.test(hash)){target=document.getElementById(hash);hash=target?'sources':'home';}
    if(!names[hash]){hash='home';}
    var focusEl=null;
    screens.forEach(function(s){var on=s.getAttribute('data-screen')===hash;s.classList.toggle('on',on);if(on&&!focusEl)focusEl=s;});
    if(hash!==cur){prev=cur;cur=hash;}
    document.title=names[hash]+': Own Two Feet';
    if(target){jump(0);target.scrollIntoView({block:'start'});}
    else if(!first){jump(0);requestAnimationFrame(function(){jump(0)});}
    if(!first&&focusEl){focusEl.focus({preventScroll:true});}
    first=false;
  }
  var back=document.querySelector('a[data-prev]');
  if(back){back.addEventListener('click',function(e){e.preventDefault();location.hash=(prev==='sources'||prev==='home')?'home':prev;});}
  window.addEventListener('hashchange',show);
  show();
})();

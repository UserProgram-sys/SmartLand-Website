// Smart Land interaction and motion layer
const header=document.querySelector('.header');
const nav=document.querySelector('.header .nav');
const menuButton=document.querySelector('.menu-btn');
const progressBar=document.querySelector('.scroll-progress span');
const languageButton=document.getElementById('lang');
let currentLanguage='ar';

menuButton?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',String(open));
});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded','false');
}));

languageButton?.addEventListener('click',()=>{
  currentLanguage=currentLanguage==='ar'?'en':'ar';
  document.documentElement.lang=currentLanguage;
  document.documentElement.dir=currentLanguage==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-ar][data-en]').forEach(el=>{
    el.innerHTML=el.dataset[currentLanguage];
  });
  languageButton.textContent=currentLanguage==='ar'?'EN':'AR';
});

const updateScrollUI=()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  if(progressBar) progressBar.style.width=`${max>0?(window.scrollY/max)*100:0}%`;
  header?.classList.toggle('scrolled',window.scrollY>24);
};
window.addEventListener('scroll',updateScrollUI,{passive:true});
updateScrollUI();

// Reveal elements in sequence when they enter the viewport.
const revealTargets=document.querySelectorAll(
  '.intro-grid,.principles article,.section-top,.service-grid article,.project,.film-copy,.video-card,.contact-grid'
);
if('IntersectionObserver' in window){
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -45px 0px'});
  revealTargets.forEach((el,index)=>{
    el.classList.add('reveal');
    el.style.transitionDelay=`${(index%4)*90}ms`;
    revealObserver.observe(el);
  });

  const sections=['about','services','projects','film','contact']
    .map(id=>document.getElementById(id)).filter(Boolean);
  const links=[...document.querySelectorAll('.header .nav a[href^="#"]')];
  const activeObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        links.forEach(link=>{
          link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id);
        });
      }
    });
  },{rootMargin:'-35% 0px -55% 0px',threshold:0});
  sections.forEach(section=>activeObserver.observe(section));

  // Pause videos when off-screen and never play both at once.
  const videos=[...document.querySelectorAll('.brand-video')];
  videos.forEach(video=>{
    video.addEventListener('play',()=>{
      videos.filter(other=>other!==video).forEach(other=>other.pause());
    });
    const videoObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting && !video.paused) video.pause();
      });
    },{threshold:.12});
    videoObserver.observe(video);
  });
}

/* ---------- Stars canvas ---------- */
const starsCv = document.getElementById('starsCanvas'), sctx = starsCv.getContext('2d');
let stars = [];
function resizeCanvases(){
  [starsCv, particlesCv].forEach(c=>{c.width=innerWidth; c.height=innerHeight;});
}
function initStars(){
  stars = Array.from({length: Math.min(140, innerWidth/8)}, ()=>({
    x: Math.random()*innerWidth, y: Math.random()*innerHeight*0.7,
    r: Math.random()*1.6+0.4, a: Math.random(), speed: Math.random()*0.015+0.005
  }));
}
function drawStars(){
  sctx.clearRect(0,0,starsCv.width,starsCv.height);
  stars.forEach(s=>{
    s.a += s.speed; const op = (Math.sin(s.a)+1)/2;
    sctx.beginPath(); sctx.arc(s.x,s.y,s.r,0,7);
    sctx.fillStyle = `rgba(255,245,220,${0.2+op*0.8})`; sctx.fill();
  });
  requestAnimationFrame(drawStars);
}

/* ---------- Golden particles / fireflies ---------- */
const particlesCv = document.getElementById('particlesCanvas'), pctx = particlesCv.getContext('2d');
let flies = [];
function initFlies(){
  flies = Array.from({length: 26}, ()=>({
    x: Math.random()*innerWidth, y: Math.random()*innerHeight,
    vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4, r: Math.random()*2+1, phase: Math.random()*10
  }));
}
function drawFlies(){
  pctx.clearRect(0,0,particlesCv.width,particlesCv.height);
  flies.forEach(f=>{
    f.x+=f.vx; f.y+=f.vy; f.phase+=0.05;
    if(f.x<0||f.x>innerWidth) f.vx*=-1;
    if(f.y<0||f.y>innerHeight) f.vy*=-1;
    const glow = (Math.sin(f.phase)+1)/2;
    const grad = pctx.createRadialGradient(f.x,f.y,0,f.x,f.y,8);
    grad.addColorStop(0, `rgba(255,220,140,${0.6*glow+0.2})`);
    grad.addColorStop(1, 'rgba(255,220,140,0)');
    pctx.fillStyle = grad;
    pctx.beginPath(); pctx.arc(f.x,f.y,8,0,7); pctx.fill();
  });
  requestAnimationFrame(drawFlies);
}
resizeCanvases(); initStars(); initFlies(); drawStars(); drawFlies();
window.addEventListener('resize', ()=>{resizeCanvases(); initStars(); initFlies();});

// Prevent browser from restoring previous scroll position on refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

/* ---------- Envelope Animation ---------- */
const envelopeTap = document.getElementById('envelopeTap');
const envelopeScreen = document.getElementById('envelopeScreen');
const seal = document.getElementById('seal');
const main = document.getElementById('main');
const bgMusic = document.getElementById('bgMusic');

function spawnSealBurst(x, y) {
  const count = 32;
  const colors = ['#f6e1a8', '#d4af6a', '#ff4d6d', '#ffd700', '#ffffff', '#e6284e'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'seal-spark';
    const angle = (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.4;
    const distance = 50 + Math.random() * 120;
    const size = 4 + Math.random() * 6;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.left = (x - size / 2) + 'px';
    p.style.top = (y - size / 2) + 'px';
    p.style.borderRadius = Math.random() > 0.4 ? '50%' : '2px';
    p.style.boxShadow = `0 0 12px ${p.style.backgroundColor}`;
    document.body.appendChild(p);

    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance + (Math.random() * 30);

    p.animate([
      { transform: 'translate(0, 0) scale(1.6)', opacity: 1 },
      { transform: `translate(${destX}px, ${destY}px) scale(0.1)`, opacity: 0 }
    ], {
      duration: 650 + Math.random() * 400,
      easing: 'cubic-bezier(0.12, 0.8, 0.32, 1)'
    });

    setTimeout(() => p.remove(), 1100);
  }
}

function spawnPetals(count){
  const emojis = ['🌸','🌺','🌼','💮','✨','💛'];
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const p = document.createElement('div');
      p.className='petal';
      p.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      p.style.left = Math.random()*100+'vw';
      p.style.fontSize = (14+Math.random()*18)+'px';
      document.body.appendChild(p);
      const duration = 3800+Math.random()*2600;
      p.animate([
        {transform:`translateY(-10vh) rotate(0deg)`, opacity:0},
        {transform:`translateY(50vh) translateX(${(Math.random()-0.5)*100}px) rotate(180deg)`, opacity:1, offset:0.5},
        {transform:`translateY(110vh) translateX(${(Math.random()-0.5)*200}px) rotate(360deg)`, opacity:0}
      ], {duration, easing:'ease-in-out'});
      setTimeout(()=>p.remove(), duration);
    }, i*100);
  }
}

let envelopeOpened = false;
envelopeTap.addEventListener('click', (e) => {
  if (envelopeOpened) return;
  envelopeOpened = true;

  // 1. Get seal center for radial spark burst
  const rect = seal.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  spawnSealBurst(centerX, centerY);

  // 2. Play background music immediately
  bgMusic.play().catch(() => {});

  // 3. Crack and shatter the seal & remove the corner stickers
  seal.classList.add('broken');
  const tapText = document.querySelector('.tap-text');
  if (tapText) tapText.style.opacity = '0';
  const postStamp = document.getElementById('postStamp');
  if (postStamp) postStamp.classList.add('hide');

  // 4. Open 3D top flap (rotates backward)
  setTimeout(() => {
    const flapTop = document.getElementById('envelopeFlapTop');
    if (flapTop) flapTop.classList.add('open');
  }, 220);

  // 5. Slide invitation card up out of envelope cavity
  setTimeout(() => {
    const letter = document.getElementById('invitationLetter');
    if (letter) letter.classList.add('slide-out');
  }, 620);

  // 6. Shower celebration petals and golden sparkles
  setTimeout(() => {
    spawnPetals(35);
  }, 950);

  // 7. Small card itself expands to occupy the ENTIRE screen!
  setTimeout(() => {
    const container = document.getElementById('envelopeContainer');
    const wrap = document.getElementById('envelopeTap');
    if (container) {
      container.style.perspective = 'none';
      container.style.transform = 'none';
    }
    if (wrap) {
      wrap.style.animation = 'none';
      wrap.style.transform = 'none';
    }
    const letter = document.getElementById('invitationLetter');
    if (letter) letter.classList.add('cover-screen');
  }, 1300);

  // 8. Seamless dissolve into the scrollable wedding invitation!
  setTimeout(() => {
    window.scrollTo(0, 0);
    envelopeScreen.classList.add('hide');
    main.classList.add('show');
    document.body.style.overflow = 'auto';
  }, 2500);
});

/* ---------- Scroll reveal & indicator ---------- */
const reveals = document.querySelectorAll('.reveal');
const scrollIndicator = document.querySelector('.scroll-indicator');
function checkReveal(){
  const winHeight = window.innerHeight;
  reveals.forEach(r=>{
    const rect = r.getBoundingClientRect();
    if(rect.top < winHeight - 50) r.classList.add('in');
  });
  
  if (scrollIndicator) {
    if (window.scrollY > 50) {
      scrollIndicator.classList.add('hide');
    } else {
      scrollIndicator.classList.remove('hide');
    }
  }
}
window.addEventListener('scroll', checkReveal);
checkReveal();

/* ---------- Countdown ---------- */
const weddingDate = new Date('2026-11-13T06:00:00').getTime();
function updateCountdown(){
  const now = Date.now();
  let diff = weddingDate - now;
  if(diff<0) diff=0;
  const d = Math.floor(diff/(1000*60*60*24));
  const h = Math.floor((diff/(1000*60*60))%24);
  const m = Math.floor((diff/(1000*60))%60);
  const s = Math.floor((diff/1000)%60);
  document.getElementById('cd-days').textContent = String(d).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
  document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
}
setInterval(updateCountdown,1000); updateCountdown();

/* ---------- Gallery lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
document.querySelectorAll('#galleryTrack img').forEach(img=>{
  img.addEventListener('click', ()=>{ lightboxImg.src = img.src; lightbox.style.display='flex'; });
});
lightbox.addEventListener('click', ()=> lightbox.style.display='none');

/* ---------- Auto slideshow ---------- */
const track = document.getElementById('galleryTrack');
setInterval(()=>{
  if(track.scrollLeft + track.clientWidth >= track.scrollWidth-10){ track.scrollTo({left:0, behavior:'smooth'}); }
  else{ track.scrollBy({left:296, behavior:'smooth'}); }
}, 3500);

// Attempt to play music automatically when the page loads
window.addEventListener('load', ()=>{
  bgMusic.play().catch(()=>{
    // Browsers block autoplay unless the user has interacted.
    console.log("Autoplay blocked. User interaction required.");
  });
});

// Stop music if the user backgrounds the app or switches tabs
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    bgMusic.pause();
  } else {
    // Attempt to resume when they come back
    bgMusic.play().catch(()=>{});
  }
});

/* ---------- Sparkle cursor trail ---------- */
let lastSparkle = 0;
function spawnSparkle(x,y){
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.style.left = (x-3)+'px'; s.style.top = (y-3)+'px';
  document.body.appendChild(s);
  setTimeout(()=>s.remove(), 900);
}
window.addEventListener('mousemove', (e)=>{
  const now = Date.now();
  if(now - lastSparkle > 60){ spawnSparkle(e.clientX, e.clientY); lastSparkle = now; }
});

/* ---------- Scroll progress + dynamic celestial moon scroll ---------- */
const scrollProgress = document.getElementById('scrollProgress');
const moonEl = document.getElementById('moon');
window.addEventListener('scroll', ()=>{
  const h = document.documentElement;
  const maxScroll = h.scrollHeight - h.clientHeight;
  const pct = maxScroll > 0 ? (h.scrollTop / maxScroll) : 0;
  if (scrollProgress) scrollProgress.style.width = (pct * 100) + '%';
  if (moonEl) {
    // Dynamically moves downwards as user scrolls down, and rises back up as user scrolls up
    const maxTravel = (window.innerHeight || 800) * 0.72;
    const moonY = pct * maxTravel;
    moonEl.style.transform = `translate3d(0, ${moonY}px, 0)`;
  }
}, {passive:true});

/* ---------- Family Tree Line Animation Observer ---------- */
const treeSides = document.querySelectorAll('.tree-side');
if (treeSides.length > 0) {
  const treeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('tree-active');
      }
    });
  }, { threshold: 0.18 });

  treeSides.forEach(side => treeObserver.observe(side));
}

/* ---------- Ending animation trigger & Back to Top ---------- */
const ending = document.getElementById('ending');
let fireworkInterval;

const fireworkObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      spawnPetals(14);
      if(!fireworkInterval) {
        launchFireworks();
        fireworkInterval = setInterval(launchFireworks, 2400);
      }
    } else {
      if(fireworkInterval) {
        clearInterval(fireworkInterval);
        fireworkInterval = null;
      }
    }
  });
},{threshold:0.15});

if (ending) {
  fireworkObserver.observe(ending);
}

// Relive Invitation / Back to Top button
const backToTopBtn = document.getElementById('backToTopBtn');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function launchFireworks(){
  for(let i=0;i<5;i++){
    setTimeout(()=>{
      const burst = document.createElement('div');
      burst.style.position='fixed';
      burst.style.left = (10+Math.random()*80)+'vw';
      burst.style.top = (10+Math.random()*80)+'vh'; // Spreads above and below
      burst.style.zIndex=45;
      document.body.appendChild(burst);
      for(let j=0;j<18;j++){
        const spark = document.createElement('div');
        spark.className='firework';
        spark.style.width=spark.style.height='5px';
        spark.style.background = ['#f6e1a8','#f7c6d1','#d4af6a'][j%3];
        burst.appendChild(spark);
        const angle = (j/18)*Math.PI*2;
        const dist = 60+Math.random()*80;
        spark.animate([
          {transform:'translate(0,0)', opacity:1},
          {transform:`translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`, opacity:0}
        ],{duration:1200, easing:'ease-out'});
      }
      setTimeout(()=>burst.remove(),1300);
    }, i*500);
  }
}

/* ---------- WhatsApp Modal Logic ---------- */
const waModal = document.getElementById('waModal');
const waClose = document.getElementById('waClose');
const waCustomMsg = document.getElementById('waCustomMsg');
const waSendBtn = document.getElementById('waSendBtn');
const waQuoteList = document.getElementById('waQuoteList');
let currentWaNumber = '';

// Intercept clicks on WhatsApp links
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    const url = new URL(href);
    currentWaNumber = url.pathname.replace('/', ''); // extract number
    
    // Reset modal state
    waCustomMsg.value = '';
    waModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
});

waClose.addEventListener('click', () => {
  waModal.style.display = 'none';
  document.body.style.overflow = 'auto';
});

// Select a quote
if(waQuoteList) {
  waQuoteList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      waCustomMsg.value = btn.textContent;
    });
  });
}

// Send message
waSendBtn.addEventListener('click', () => {
  const msg = waCustomMsg.value.trim();
  if(!msg) {
    alert('Please choose a quote or type a custom message.');
    return;
  }
  
  // Show animated loader
  document.getElementById('waContentWrapper').style.display = 'none';
  document.getElementById('waLoader').style.display = 'flex';
  
  const waUrl = `https://wa.me/${currentWaNumber}?text=${encodeURIComponent(msg)}`;
  
  // Wait 2.5 seconds to engage the user with the animation
  setTimeout(() => {
    // Open in same tab so mobile doesn't trigger a refresh when switching back
    window.location.href = waUrl;
    
    // Reset modal state in the background
    setTimeout(() => {
      waModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      document.getElementById('waContentWrapper').style.display = 'flex';
      document.getElementById('waLoader').style.display = 'none';
    }, 500);
  }, 2500);
});


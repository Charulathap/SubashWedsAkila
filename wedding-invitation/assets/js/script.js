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

/* ---------- Envelope open ---------- */
const envelopeTap = document.getElementById('envelopeTap');
const envelopeScreen = document.getElementById('envelopeScreen');
const seal = document.getElementById('seal');
const main = document.getElementById('main');
const bgMusic = document.getElementById('bgMusic');

function spawnPetals(count){
  const emojis = ['🌸','🌺','🌼','💮'];
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const p = document.createElement('div');
      p.className='petal';
      p.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      p.style.left = Math.random()*100+'vw';
      p.style.fontSize = (14+Math.random()*16)+'px';
      document.body.appendChild(p);
      const duration = 4000+Math.random()*3000;
      p.animate([
        {transform:`translateY(-10vh) rotate(0deg)`, opacity:0},
        {transform:`translateY(50vh) translateX(${(Math.random()-0.5)*100}px) rotate(180deg)`, opacity:1, offset:0.5},
        {transform:`translateY(110vh) translateX(${(Math.random()-0.5)*200}px) rotate(360deg)`, opacity:0}
      ], {duration, easing:'ease-in-out'});
      setTimeout(()=>p.remove(), duration);
    }, i*120);
  }
}

envelopeTap.addEventListener('click', ()=>{
  seal.classList.add('break');
  bgMusic.play().catch(()=>{});
  setTimeout(()=>{
    envelopeScreen.classList.add('hide');
    main.classList.add('show');
    spawnPetals(30);
    document.body.style.overflow='auto';
  }, 700);
});

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); } });
},{threshold:0.2});
revealEls.forEach(el=>io.observe(el));

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

/* ---------- Music control ---------- */
const musicBtn = document.getElementById('musicBtn');
musicBtn.addEventListener('click', ()=>{
  if(bgMusic.paused){ bgMusic.play().catch(()=>{}); musicBtn.textContent='🔊'; }
  else{ bgMusic.pause(); musicBtn.textContent='🔇'; }
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

/* ---------- Scroll progress + moon parallax ---------- */
const scrollProgress = document.getElementById('scrollProgress');
const moonEl = document.getElementById('moon');
window.addEventListener('scroll', ()=>{
  const h = document.documentElement;
  const pct = (h.scrollTop)/(h.scrollHeight - h.clientHeight)*100;
  scrollProgress.style.width = pct+'%';
  moonEl.style.transform = `translateY(${h.scrollTop*0.08}px)`;
}, {passive:true});

/* ---------- Ending animation trigger ---------- */
const ending = document.getElementById('ending');
let fireworkInterval;

const fireworkObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      if(!fireworkInterval) {
        launchFireworks();
        fireworkInterval = setInterval(launchFireworks, 2500);
      }
    } else {
      if(fireworkInterval) {
        clearInterval(fireworkInterval);
        fireworkInterval = null;
      }
    }
  });
},{threshold:0.1});

const endObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      if (ending.style.display !== 'flex') {
        ending.style.display = 'flex';
        spawnPetals(20);
        fireworkObserver.observe(ending);
      }
    }
  });
},{threshold:0.1});
endObserver.observe(document.querySelector('footer'));

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
  
  const waUrl = `https://wa.me/${currentWaNumber}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
  
  waModal.style.display = 'none';
  document.body.style.overflow = 'auto';
});


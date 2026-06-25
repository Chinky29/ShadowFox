/* ═══════════════════════════════════════════
   LOADER
═══════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('out');
    document.body.style.cursor = 'none';
  }, 1600);
});

/* ═══════════════════════════════════════════
   CUSTOM CURSOR
   FIX: was toggling 'cursor-expand' on body,
   but CSS targets #cur-ring.cur-hover.
   Now we toggle the class directly on the ring.
═══════════════════════════════════════════ */
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = -100, my = -100, rx = -100, ry = -100;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function trackCursor() {
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  rx += (mx - rx) * .1; ry += (my - ry) * .1;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(trackCursor);
})();
document.querySelectorAll('a, button, .proj-card, .ach-card, .edu-card, .skill-block, .exp-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('cur-hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('cur-hover'));
});

/* ═══════════════════════════════════════════
   TYPED TEXT EFFECT
═══════════════════════════════════════════ */
const roles = [
  'Full Stack Developer',
  'MERN Stack Engineer',
  'Google SDE Ambassador',
  'ML / AI Enthusiast',
  'Open to Opportunities'
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-role');

function typeRole() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 45 : 90);
}
typeRole();

/* ═══════════════════════════════════════════
   MOBILE HAMBURGER MENU
═══════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ═══════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const N = 80;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(fresh) {
      this.x = Math.random() * W;
      this.y = fresh ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.2 + .2;
      this.vx = (Math.random() - .5) * .25;
      this.vy = -(Math.random() * .4 + .1);
      this.alpha = 0;
      this.maxAlpha = Math.random() * .35 + .05;
      this.life = 0;
      this.maxLife = Math.random() * 400 + 200;
      this.gold = Math.random() < .3;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life++;
      const prog = this.life / this.maxLife;
      this.alpha = prog < .1 ? prog * 10 * this.maxAlpha
        : prog > .85 ? (1 - (prog - .85) / .15) * this.maxAlpha
        : this.maxAlpha;
      if (this.life > this.maxLife) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.gold
        ? `rgba(196,164,89,${this.alpha})`
        : `rgba(240,238,232,${this.alpha * .5})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < N; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(196,164,89,${(1 - d / 100) * .04})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════════════════════════════════
   NAV SCROLL + ACTIVE LINK HIGHLIGHT
   FIX: JS was toggling class 'solid' but CSS
   targets '#nav.scrolled'. Unified to 'scrolled'.
═══════════════════════════════════════════ */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) current = sec.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.classList.toggle('nav-active', a.getAttribute('href') === '#' + current);
  });
});

/* ═══════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */
const revIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revIO.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revIO.observe(el));

/* ═══════════════════════════════════════════
   SKILLS — staggered tag animation
═══════════════════════════════════════════ */
document.querySelectorAll('.skill-block').forEach(block => {
  const tags = block.querySelectorAll('.skill-tag');
  tags.forEach(t => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; });
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      tags.forEach((tag, i) => {
        setTimeout(() => {
          tag.style.transition = 'opacity .4s ease, transform .4s ease';
          tag.style.opacity = '1';
          tag.style.transform = 'none';
        }, i * 75);
      });
      io.disconnect();
    }
  }, { threshold: 0.3 });
  io.observe(block);
});

/* ═══════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════ */
function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
function runCounter(el) {
  const target = parseFloat(el.dataset.count);
  const dec = parseInt(el.dataset.dec || 0);
  const suf = el.dataset.suffix || '';
  const dur = 1800;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const val = target * easeOut(p);
    el.textContent = dec ? val.toFixed(dec) + suf : Math.floor(val) + suf;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const cntIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); cntIO.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => cntIO.observe(el));

/* ═══════════════════════════════════════════
   PROJECT CARD — mouse radial glow
═══════════════════════════════════════════ */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  });
});

/* ═══════════════════════════════════════════
   PARALLAX ORBS ON MOUSE
═══════════════════════════════════════════ */
document.addEventListener('mousemove', e => {
  const dx = (e.clientX / window.innerWidth - .5) * 30;
  const dy = (e.clientY / window.innerHeight - .5) * 20;
  document.querySelector('.orb1').style.transform = `translate(${dx}px,${dy}px)`;
  document.querySelector('.orb2').style.transform = `translate(${-dx * .6}px,${-dy * .6}px)`;
  document.querySelector('.orb3').style.transform = `translate(${dx * .3}px,${dy * .3}px)`;
});

/* ═══════════════════════════════════════════
   3D TILT — edu, ach, exp cards
═══════════════════════════════════════════ */
document.querySelectorAll('.edu-card, .ach-card, .exp-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const rx = -(e.clientY - (r.top + r.height / 2)) / r.height * 10;
    const ry = (e.clientX - (r.left + r.width / 2)) / r.width * 10;
    card.style.transform = `translateY(-5px) perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});
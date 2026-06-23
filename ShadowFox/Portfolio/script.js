/* ═══════════════════════════════════════════
   LOADER
═══════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('out');
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.body.classList.remove('no-cursor');
    } else {
      document.body.classList.add('no-cursor');
    }
  }, 1600);
});

/* ═══════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════ */
(() => {
  const cur = document.getElementById('cur');
  const ring = document.getElementById('cur-ring');
  if (!cur || !ring) return;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) { document.body.classList.add('no-cursor'); return; }

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  function ringLoop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(ringLoop);
  }
  ringLoop();

  const hoverables = 'a, button, .btn-glow, .clink, .skill-tag, .proj-tech, .nav-btn, .mobile-link, .exp-card, .proj-card, .edu-card, .ach-card';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cur-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cur-hover'));
  });
})();

/* ═══════════════════════════════════════════
   PARTICLE BACKGROUND
═══════════════════════════════════════════ */
(() => {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, particles;
  const COLORS = ['196,164,89', '78,205,196'];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function makeParticles() {
    const count = Math.min(90, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
      c: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));
  }
  function step() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c},0.5)`;
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(196,164,89,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  makeParticles();
  step();
  window.addEventListener('resize', () => { resize(); makeParticles(); });
})();

/* ═══════════════════════════════════════════
   ORB PARALLAX
═══════════════════════════════════════════ */
(() => {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  window.addEventListener('mousemove', e => {
    const cx = (e.clientX / window.innerWidth - 0.5);
    const cy = (e.clientY / window.innerHeight - 0.5);
    orbs.forEach((orb, i) => {
      const strength = (i + 1) * 14;
      orb.style.transform = `translate(${cx * strength}px, ${cy * strength}px)`;
    });
  });
})();

/* ═══════════════════════════════════════════
   NAV — SCROLL STATE + ACTIVE LINK
═══════════════════════════════════════════ */
(() => {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) current = sec.getAttribute('id');
    });
    navLinks.forEach(a => {
      a.classList.toggle('nav-active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ═══════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════ */
(() => {
  const hamburger = document.getElementById('navHamburger');
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('mobileMenuClose');
  if (!hamburger || !menu || !overlay) return;

  function openMenu() {
    hamburger.classList.add('open');
    menu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger.classList.remove('open');
    menu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });
  closeBtn?.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
})();

/* ═══════════════════════════════════════════
   TYPED ROLE EFFECT
═══════════════════════════════════════════ */
(() => {
  const typedEl = document.getElementById('typed-role');
  if (!typedEl) return;
  const roles = [
    'Full Stack Developer',
    'MERN Stack Engineer',
    'Google SDE Ambassador',
    'ML/AI Enthusiast',
    'Open to Opportunities'
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function typeRole() {
    const current = roles[roleIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) { deleting = true; setTimeout(typeRole, 1800); return; }
    } else {
      typedEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
    }
    setTimeout(typeRole, deleting ? 45 : 90);
  }
  typeRole();
})();

/* ═══════════════════════════════════════════
   HERO STAT COUNT-UP
═══════════════════════════════════════════ */
(() => {
  const stats = document.querySelectorAll('.hstat-num');
  if (!stats.length) return;

  function animateCount(el) {
    const target = parseFloat(el.dataset.count || '0');
    const dec = parseInt(el.dataset.dec || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1700;
    let start = null;

    function step(ts) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      el.textContent = val.toFixed(dec) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec) + suffix;
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => io.observe(s));
})();

/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */
(() => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  items.forEach(el => io.observe(el));
})();

/* ═══════════════════════════════════════════
   SKILL TAGS — STAGGERED PULSE-IN
═══════════════════════════════════════════ */
(() => {
  document.querySelectorAll('.skill-block').forEach(block => {
    const tags = block.querySelectorAll('.skill-tag');
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        tags.forEach((tag, i) => {
          tag.style.opacity = '0';
          tag.style.transform = 'translateY(8px)';
          setTimeout(() => {
            tag.style.transition = 'opacity .4s ease, transform .4s ease';
            tag.style.opacity = '1';
            tag.style.transform = 'none';
          }, i * 80);
        });
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(block);
  });
})();

/* ═══════════════════════════════════════════
   3D TILT — EXPERIENCE / PROJECT / EDUCATION / ACHIEVEMENT CARDS
═══════════════════════════════════════════ */
(() => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  function applyTilt(selector, maxDeg) {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const rx = -(e.clientY - cy) / r.height * maxDeg;
        const ry = (e.clientX - cx) / r.width * maxDeg;
        card.style.transform = `translateY(-4px) perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  applyTilt('.exp-card', 6);
  applyTilt('.edu-card', 5);
  applyTilt('.ach-card', 5);

  document.querySelectorAll('.proj-mockup').forEach(mockup => {
    mockup.addEventListener('mousemove', e => {
      const r = mockup.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const rx = -(e.clientY - cy) / r.height * 8;
      const ry = (e.clientX - cx) / r.width * 8;
      mockup.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.015)`;
    });
    mockup.addEventListener('mouseleave', () => { mockup.style.transform = ''; });
  });
})();
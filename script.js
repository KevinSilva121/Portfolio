/* ================================================
   script.js — Kevin Ramon Portfolio
   ================================================ */

/* ── PARTICLE SYSTEM ── */
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 80;
  const MAX_DIST = 140;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.5 + 0.2
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,194,255,${p.alpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  resize(); createParticles(); draw();
})();

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function loopRing() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(loopRing);
  }
  loopRing();

  document.querySelectorAll('a, button, .skill-card, .project-card, .edu-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();

/* ── NAVBAR ── */
(function initNav() {
  const nav = document.getElementById('navbar');
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  ham.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });

  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      ham.classList.remove('open');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
})();

/* ── ACTIVE NAV LINK ON SCROLL ── */
(function initActiveLink() {
  const sections = ['about', 'skills', 'projects', 'experience', 'education', 'contact'];
  const links = document.querySelectorAll('.nav-link');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
})();

/* ── TYPING EFFECT ── */
(function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = ['Full-Stack', 'Flutter', 'Vue.js', 'Node.js', 'Mobile'];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        setTimeout(() => { deleting = true; tick(); }, 1800);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    tick();
  }

  function tick() {
    setTimeout(type, deleting ? 60 : 100);
  }
  tick();
})();

/* ── COUNTER ANIMATION ── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseInt(el.dataset.count, 10);
      const dur = 1800;
      const step = Math.ceil(end / (dur / 16));
      let cur = 0;
      const timer = setInterval(() => {
        cur = Math.min(cur + step, end);
        el.textContent = cur >= 1000 ? (cur / 1000).toFixed(0) + 'K' : cur;
        if (cur >= end) clearInterval(timer);
      }, 16);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => obs.observe(c));
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (i % 4) * 0.1 + 's';
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => obs.observe(el));
})();

/* ── CONTACT FORM ── */
(function initForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...';

    const formData = new FormData(form);

    fetch('https://formsubmit.co/ajax/kevinramon121@gmail.com', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        note.textContent = '✅ Mensagem enviada! Retornarei em breve.';
        note.style.color = '#10b981';
        btn.disabled = false;
        btn.innerHTML = 'Enviar Mensagem <i class="fa-solid fa-paper-plane"></i>';
        form.reset();
        setTimeout(() => { note.textContent = ''; }, 5000);
      })
      .catch(error => {
        note.textContent = '❌ Erro ao enviar. Tente novamente mais tarde.';
        note.style.color = '#ef4444';
        btn.disabled = false;
        btn.innerHTML = 'Enviar Mensagem <i class="fa-solid fa-paper-plane"></i>';
        setTimeout(() => { note.textContent = ''; }, 5000);
      });
  });
})();

/* ── SMOOTH SECTION LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

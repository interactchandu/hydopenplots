// Open Plots Ventures - SPA interactions
// Smooth scroll with header offset, active nav highlighting, reveal on scroll, ripple, mobile nav, form validation

(function () {
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('primary-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navOverlay = document.querySelector('.nav-overlay');
  const links = document.querySelectorAll('.primary-nav .nav-link');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  navToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    if (navOverlay) {
      if (open) { navOverlay.hidden = false; navOverlay.classList.add('show'); }
      else { navOverlay.classList.remove('show'); setTimeout(() => navOverlay.hidden = true, 180); }
    }
  });
  links.forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('open');
    if (navOverlay) { navOverlay.classList.remove('show'); setTimeout(() => navOverlay.hidden = true, 180); }
  }));
  navOverlay?.addEventListener('click', () => {
    nav.classList.remove('open');
    navOverlay.classList.remove('show');
    setTimeout(() => navOverlay.hidden = true, 180);
  });

  // Smooth scrolling with header offset
  function scrollToTarget(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    const headerH = header?.offsetHeight || 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerH + 6;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const url = new URL(a.href);
    if (url.pathname === location.pathname) {
      e.preventDefault();
      scrollToTarget(url.hash || '#home');
      history.pushState(null, '', url.hash);
    }
  });

  // On initial load with hash, adjust for header offset
  window.addEventListener('load', () => {
    if (location.hash) {
      setTimeout(() => scrollToTarget(location.hash), 0);
    }
  });

  // Active nav link highlighting
  const sections = ['#home', '#about', '#featured', '#services', '#process', '#testimonials', '#contact']
    .map((s) => document.querySelector(s)).filter(Boolean);
  const navMap = new Map(Array.from(links).map((l) => [l.getAttribute('href'), l]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navMap.forEach((el, href) => el.classList.toggle('active', href === id));
      }
    });
  }, { rootMargin: '-50% 0px -45% 0px', threshold: 0.01 });
  sections.forEach((sec) => io.observe(sec));

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io2.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => io2.observe(el));

  // Ripple cursor position
  document.addEventListener('pointerdown', (e) => {
    const t = e.target.closest('.ripple');
    if (!t) return;
    const rect = t.getBoundingClientRect();
    t.style.setProperty('--x', (e.clientX - rect.left) + 'px');
    t.style.setProperty('--y', (e.clientY - rect.top) + 'px');
  });

  // Contact form validation (basic)
  const form = document.querySelector('.contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = form?.querySelector('button[type="submit"]');
  function setError(id, msg) {
    const span = form.querySelector(`.error[data-for="${id}"]`);
    if (span) span.textContent = msg || '';
  }
  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const message = data.get('message')?.toString().trim();

    let ok = true;
    setError('name'); setError('email'); setError('message');
    if (!name) { setError('name', 'Please enter your name.'); ok = false; }
    if (!email || !validateEmail(email)) { setError('email', 'Please enter a valid email.'); ok = false; }
    if (!message) { setError('message', 'Please enter a message.'); ok = false; }

    if (!ok) return;

    // Fake submit (no backend). In real use, send via API or mailto.
    status.textContent = 'Sending...';
    submitBtn.disabled = true;
    setTimeout(() => {
      status.textContent = 'Thanks! We\'ll get back to you shortly.';
      form.reset();
      submitBtn.disabled = false;
    }, 700);
  });

  // Header shadow on scroll + progress bar
  const progress = document.querySelector('.scroll-progress__bar');
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 4);
    if (progress) {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = pct + '%';
    }
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Subtle parallax for hero orbs
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('mousemove', (e) => {
    if (!orbs.length) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 to 1
    const dy = (e.clientY - cy) / cy;
    orbs.forEach((el, i) => {
      const s = (i + 1) * 4;
      el.style.transform = `translate(${dx * s}px, ${dy * s}px)`;
    });
  }, { passive: true });

  // Testimonials carousel
  const slider = document.querySelector('#testimonials .slider');
  if (slider) {
    const inner = slider.querySelector('.slides-inner');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const prev = slider.querySelector('.prev');
    const next = slider.querySelector('.next');
    const dotsC = slider.querySelector('.dots');
    let idx = 0;
    let timer;
    function go(i) {
      idx = (i + slides.length) % slides.length;
      inner.style.transform = `translateX(-${idx * 100}%)`;
      dotsC.querySelectorAll('button').forEach((b, bi) => b.classList.toggle('active', bi === idx));
    }
    function start() { timer = setInterval(() => go(idx + 1), 4000); }
    function stop() { clearInterval(timer); }
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      b.addEventListener('click', () => { stop(); go(i); start(); });
      dotsC.appendChild(b);
    });
    prev.addEventListener('click', () => { stop(); go(idx - 1); start(); });
    next.addEventListener('click', () => { stop(); go(idx + 1); start(); });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    go(0); start();
  }
})();

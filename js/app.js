// Open Plots Ventures - Premium Real Estate Website - Interactive Features

(function() {
  'use strict';

  // DOM Elements
  const header = document.querySelector('.header');
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav__link');
  const progressBar = document.querySelector('.progress__bar');
  const yearEl = document.getElementById('year');
  
  // Set current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile navigation toggle
  navToggle?.addEventListener('click', () => {
    nav.classList.toggle('open');
    const expanded = nav.classList.contains('open');
    navToggle.setAttribute('aria-expanded', expanded);
  });

  // Close mobile nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Smooth scroll with offset
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (!target) return;
    
    e.preventDefault();
    const headerHeight = header?.offsetHeight || 0;
    const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    
    window.scrollTo({
      top: targetPos,
      behavior: 'smooth'
    });
    
    history.pushState(null, '', href);
  });

  // Header scroll effects
  let lastScroll = 0;
  function handleScroll() {
    const scroll = window.scrollY;
    
    // Add scrolled class
    if (scroll > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    
    // Update progress bar
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scroll / docHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
    
    lastScroll = scroll;
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active navigation highlighting
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };
  
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, observerOptions);
  
  sections.forEach(section => navObserver.observe(section));

  // Reveal animations
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  revealElements.forEach(el => revealObserver.observe(el));

  // Testimonials Slider
  const slider = document.querySelector('.slider');
  if (slider) {
    const track = slider.querySelector('.slider__slides');
    const slides = Array.from(slider.querySelectorAll('.testimonial'));
    const prevBtn = slider.querySelector('.slider__btn--prev');
    const nextBtn = slider.querySelector('.slider__btn--next');
    const dotsContainer = slider.querySelector('.slider__dots');
    
    let currentIndex = 0;
    let autoplayInterval;
    
    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.querySelectorAll('button'));
    
    function updateSlider() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
    
    function goToSlide(index) {
      currentIndex = index;
      updateSlider();
      resetAutoplay();
    }
    
    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    }
    
    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    }
    
    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }
    
    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }
    
    prevBtn?.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
    
    nextBtn?.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
    
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    
    updateSlider();
    startAutoplay();
  }

  // Contact Form Validation
  const contactForm = document.querySelector('.contact__form');
  if (contactForm) {
    const statusEl = contactForm.querySelector('.form-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    function showError(input, message) {
      const group = input.closest('.form-group');
      const error = group?.querySelector('.form-error');
      if (error) error.textContent = message;
    }
    
    function clearError(input) {
      const group = input.closest('.form-group');
      const error = group?.querySelector('.form-error');
      if (error) error.textContent = '';
    }
    
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');
      
      let isValid = true;
      
      // Clear previous errors
      clearError(name);
      clearError(email);
      clearError(message);
      
      // Validate name
      if (!name.value.trim()) {
        showError(name, 'Please enter your name');
        isValid = false;
      }
      
      // Validate email
      if (!email.value.trim()) {
        showError(email, 'Please enter your email');
        isValid = false;
      } else if (!validateEmail(email.value.trim())) {
        showError(email, 'Please enter a valid email');
        isValid = false;
      }
      
      // Validate message
      if (!message.value.trim()) {
        showError(message, 'Please enter a message');
        isValid = false;
      }
      
      if (!isValid) return;
      
      // Simulate form submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      if (statusEl) statusEl.textContent = '';
      
      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        if (statusEl) {
          statusEl.textContent = 'Thank you! We\'ll get back to you shortly.';
          setTimeout(() => {
            statusEl.textContent = '';
          }, 5000);
        }
      }, 1500);
    });
    
    // Clear errors on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => clearError(input));
    });
  }

  // Parallax effect on hero
  const hero = document.querySelector('.hero');
  if (hero) {
    const heroContent = hero.querySelector('.hero__content');
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll < window.innerHeight) {
        if (heroContent) {
          heroContent.style.transform = `translateY(${scroll * 0.3}px)`;
        }
      }
    }, { passive: true });
  }

  // Lazy load images
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  }

})();

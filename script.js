/* ============================================================
   CLEAR VECTOR INTELLIGENCE — script.js
   Mobile nav · Scroll reveals · Counter animations
   ============================================================ */

(function () {
  'use strict';

  // ── NAVIGATION ────────────────────────────────────────
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  // Scroll-aware nav
  let lastScroll = 0;
  const onScroll = () => {
    const current = window.scrollY;
    if (current > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = current;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── REVEAL ANIMATIONS ─────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Trigger counter animation if element contains counters
        const counters = entry.target.querySelectorAll('[data-counter]');
        counters.forEach(animateCounter);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  document.querySelectorAll('.reveal, .reveal-up').forEach((el) => {
    revealObserver.observe(el);
  });

  // ── COUNTER ANIMATIONS ────────────────────────────────
  function animateCounter(el) {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    const target = parseFloat(el.dataset.counter);
    const decimals = parseInt(el.dataset.decimals || '0');
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();
    const startValue = 0;

    // Easing: ease-out cubic
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      const currentValue = startValue + (target - startValue) * eased;

      el.textContent = currentValue.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    };

    requestAnimationFrame(update);
  }

  // Also immediately trigger counters visible on initial load (hero)
  document.querySelectorAll('.hero [data-counter]').forEach((el) => {
    setTimeout(() => animateCounter(el), 600);
  });

  // ── SMOOTH SCROLL ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav').offsetHeight;
      const targetY = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  // ── BIO-LOAD BAR ANIMATION ────────────────────────────
  const bioBars = document.querySelectorAll('.bio-bar');
  const bioObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.transformOrigin = 'left center';
        bar.style.transform = 'scaleX(0)';
        requestAnimationFrame(() => {
          bar.style.transition = 'transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)';
          bar.style.transform = 'scaleX(0.72)';
        });
        bioObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bioBars.forEach((bar) => bioObserver.observe(bar));

  // ── SUBTLE PARALLAX ON HERO ────────────────────────────
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          if (scrolled < window.innerHeight) {
            heroGrid.style.transform = `translate(${scrolled * 0.08}px, ${scrolled * 0.15}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── CURRENCY TOGGLE ───────────────────────────────────
  const currencyToggle = document.querySelector('.currency-toggle');
  if (currencyToggle) {
    const options = currencyToggle.querySelectorAll('.currency-option');
    const indicator = currencyToggle.querySelector('.currency-toggle-indicator');
    const symbols = { GBP: '£', USD: '$', EUR: '€' };

    // Convert "GBP" -> "Gbp" for dataset key (data-price-gbp -> dataset.priceGbp)
    const toKey = (code) => code.charAt(0) + code.slice(1).toLowerCase();

    const updatePrices = (currency) => {
      const symbol = symbols[currency];
      const keyPart = toKey(currency);
      document.querySelectorAll('.service-price').forEach((priceEl) => {
        const value = priceEl.dataset['price' + keyPart];
        if (!value) return;
        const symbolEl = priceEl.querySelector('.service-price-symbol');
        const valueEl = priceEl.querySelector('.service-price-value');
        if (symbolEl) symbolEl.textContent = symbol;
        if (valueEl) valueEl.textContent = value;
        // Handle per-leg addon pricing (Mode 3)
        const addonValue = priceEl.dataset['priceAddon' + keyPart];
        if (addonValue) {
          const addonSymbolEl = priceEl.querySelector('.service-price-addon-symbol');
          const addonValueEl = priceEl.querySelector('.service-price-addon-value');
          if (addonSymbolEl) addonSymbolEl.textContent = symbol;
          if (addonValueEl) addonValueEl.textContent = addonValue;
        }
      });
    };

    const moveIndicator = (index) => {
      indicator.style.transform = `translateX(${index * 100}%)`;
    };

    options.forEach((opt, idx) => {
      opt.addEventListener('click', () => {
        options.forEach((o) => {
          o.classList.remove('active');
          o.setAttribute('aria-pressed', 'false');
        });
        opt.classList.add('active');
        opt.setAttribute('aria-pressed', 'true');
        moveIndicator(idx);
        updatePrices(opt.dataset.currency);
      });
    });

    // Initialise indicator position on GBP
    moveIndicator(0);
  }

})();

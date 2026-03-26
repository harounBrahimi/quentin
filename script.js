/* ============================================
   SCRIPT.JS — Portfolio Quentin Daza
   Navigation, Carrousels, Lightbox, Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. NAVIGATION — SCROLL & MENU MOBILE
     ───────────────────────────────────────── */

  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const navItems  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('.section, .hero');

  // Navbar background on scroll
  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Highlight active nav link based on scroll position
  function highlightActiveSection() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    highlightActiveSection();
  }, { passive: true });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ─────────────────────────────────────────
     2. REVEAL ON SCROLL (Intersection Observer)
     ───────────────────────────────────────── */

  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation for siblings
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach(sib => {
          if (sib === entry.target) return;
        });
        // Simple stagger based on element index within parent
        const allSiblings = Array.from(entry.target.parentElement.children);
        const sibIndex    = allSiblings.indexOf(entry.target);
        delay = Math.min(sibIndex * 80, 400);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ─────────────────────────────────────────
     3. CARROUSELS
     ───────────────────────────────────────── */

  function initCarousel(carouselEl) {
    const track  = carouselEl.querySelector('.carousel-track');
    const slides = carouselEl.querySelectorAll('.carousel-slide');
    const prevBtn = carouselEl.querySelector('.carousel-btn--prev');
    const nextBtn = carouselEl.querySelector('.carousel-btn--next');
    const dotsContainer = carouselEl.querySelector('.carousel-dots');

    if (!slides.length) return;

    let currentIndex = 0;
    const total = slides.length;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', 'Aller à l\'image ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
      currentIndex = index;
      if (currentIndex < 0) currentIndex = total - 1;
      if (currentIndex >= total) currentIndex = 0;

      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Auto-play
    let autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);

    carouselEl.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    carouselEl.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    });

    // Touch / swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carouselEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
    }, { passive: true });
  }

  // Init all carousels
  document.querySelectorAll('.carousel').forEach(initCarousel);

  /* ─────────────────────────────────────────
     4. LIGHTBOX
     ───────────────────────────────────────── */

  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev  = lightbox.querySelector('.lightbox-prev');
  const lightboxNext  = lightbox.querySelector('.lightbox-next');
  const galleryItems  = document.querySelectorAll('.gallery-item[data-src]');

  let lightboxIndex = 0;
  const gallerySrcs = Array.from(galleryItems).map(item => item.getAttribute('data-src'));

  function openLightbox(index) {
    lightboxIndex = index;
    lightboxImg.src = gallerySrcs[lightboxIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function lightboxNavigate(direction) {
    lightboxIndex += direction;
    if (lightboxIndex < 0) lightboxIndex = gallerySrcs.length - 1;
    if (lightboxIndex >= gallerySrcs.length) lightboxIndex = 0;
    lightboxImg.src = gallerySrcs[lightboxIndex];
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => lightboxNavigate(-1));
  lightboxNext.addEventListener('click', () => lightboxNavigate(1));

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lightboxNavigate(-1);
    if (e.key === 'ArrowRight') lightboxNavigate(1);
  });

  /* ─────────────────────────────────────────
     5. COMPTEURS ANIMÉS (Stat cards)
     ───────────────────────────────────────── */

  function formatCompact(value) {
    if (value >= 1000000) {
      const v = value / 1000000;
      return v % 1 === 0 ? v.toFixed(0) + ' M' : v.toFixed(1) + ' M';
    }
    if (value >= 1000) {
      const v = value / 1000;
      return v % 1 === 0 ? v.toFixed(0) + ' K' : v.toFixed(1) + ' K';
    }
    return value.toLocaleString('fr-FR');
  }

  function animateCounter(el) {
    const target  = parseInt(el.getAttribute('data-target'), 10);
    const suffix  = el.getAttribute('data-suffix') || '';
    const prefix  = el.getAttribute('data-prefix') || '';
    const format  = el.getAttribute('data-format');
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (format === 'compact') {
        el.textContent = prefix + formatCompact(current) + suffix;
      } else {
        el.textContent = prefix + current.toLocaleString('fr-FR') + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Observe stat cards
  const statValues = document.querySelectorAll('.stat-value[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(el => counterObserver.observe(el));

  /* ─────────────────────────────────────────
     6. SMOOTH SCROLL POUR ANCRES
     ───────────────────────────────────────── */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const offset = navbar.offsetHeight + 10;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ─────────────────────────────────────────
     7. INITIALISATION
     ───────────────────────────────────────── */

  // Trigger initial checks
  handleNavbarScroll();
  highlightActiveSection();

});

/* ========================================
   MAIN.JS — GSAP ScrollTrigger Animation Engine
   Athleon Global Premium Sports Landing Page
   ======================================== */

(function() {
  'use strict';

  // Wait for GSAP to load
  function waitForGSAP(callback) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      callback();
    } else {
      setTimeout(() => waitForGSAP(callback), 50);
    }
  }

  waitForGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ─────────────────────────────────────
    // LOADING SCREEN
    // ─────────────────────────────────────
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.classList.add('hidden');
          heroEntrance();
        }
      }, 2200);
    });

    // Fallback: hide loading after 4s max
    setTimeout(() => {
      if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
        loadingScreen.classList.add('hidden');
        heroEntrance();
      }
    }, 4000);

    // ─────────────────────────────────────
    // CURSOR GLOW
    // ─────────────────────────────────────
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.innerWidth > 768) {
      document.addEventListener('mousemove', (e) => {
        gsap.to(cursorGlow, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    }

    // ─────────────────────────────────────
    // NAVBAR SCROLL EFFECT
    // ─────────────────────────────────────
    const navbar = document.getElementById('navbar');
    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: (self) => {
        if (self.direction === 1 && self.scroll() > 80) {
          navbar.classList.add('scrolled');
        } else if (self.scroll() < 80) {
          navbar.classList.remove('scrolled');
        }
      }
    });

    // ─────────────────────────────────────
    // MOBILE HAMBURGER
    // ─────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
      });
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('mobile-open');
        });
      });
    }

    // ─────────────────────────────────────
    // HERO ENTRANCE ANIMATION
    // ─────────────────────────────────────
    function heroEntrance() {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-badge',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 })
        .fromTo('.hero-title',
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1 }, '-=0.4')
        .fromTo('.hero-subtitle',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .fromTo('.hero-buttons .btn',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 }, '-=0.4')
        .fromTo('.stat-item',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
        .fromTo('.sport-object',
          { opacity: 0, scale: 0.5, y: 60, rotation: -15 },
          { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 1, stagger: 0.1, ease: 'back.out(1.7)' }, '-=1');
    }

    // ─────────────────────────────────────
    // SECTION 1 → 2 TRANSITION
    // Sports cluster zooms forward, others fade, football remains
    // ─────────────────────────────────────
    const heroObjects = document.getElementById('hero-objects');
    const sideSteps = document.getElementById('side-steps');

    if (heroObjects) {
      // Zoom the entire cluster forward
      gsap.to(heroObjects, {
        scrollTrigger: {
          trigger: '#hero',
          start: 'bottom bottom',
          end: '+=600',
          scrub: 1.5,
        },
        scale: 2.5,
        z: 200,
        ease: 'power2.inOut'
      });

      // Fade out non-football objects
      ['obj-basketball', 'obj-tennis-racket', 'obj-baseball', 'obj-rugby', 'obj-tennis-ball'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          gsap.to(el, {
            scrollTrigger: {
              trigger: '#hero',
              start: 'center center',
              end: 'bottom top',
              scrub: 1,
            },
            opacity: 0,
            scale: 0.3,
            duration: 1,
          });
        }
      });
    }

    // Show side steps when reaching football section
    if (sideSteps) {
      ScrollTrigger.create({
        trigger: '#football-section',
        start: 'top 80%',
        end: 'bottom top',
        onEnter: () => sideSteps.classList.add('visible'),
        onLeaveBack: () => sideSteps.classList.remove('visible'),
      });

      // Hide side steps after rugby section
      ScrollTrigger.create({
        trigger: '#video-section',
        start: 'top 80%',
        onEnter: () => sideSteps.classList.remove('visible'),
        onLeaveBack: () => sideSteps.classList.add('visible'),
      });
    }

    // ─────────────────────────────────────
    // SECTION 2 — FOOTBALL FOCUS
    // ─────────────────────────────────────
    const footballSection = document.getElementById('football-section');
    const footballBallMain = document.getElementById('football-ball-main');

    if (footballSection) {
      // Text only — ball visibility is owned by the traveling ball
      gsap.fromTo('.football-welcome',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: '#football-section', start: 'top 70%', once: true }
        }
      );
      gsap.fromTo('.football-title',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '#football-section', start: 'top 70%', once: true }
        }
      );
      gsap.fromTo('.football-btn',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: '#football-section', start: 'top 60%', once: true }
        }
      );

      // Parallax positional only — no opacity change
      if (footballBallMain) {
        gsap.to(footballBallMain, {
          scrollTrigger: { trigger: '#football-section', start: 'top bottom', end: 'bottom top', scrub: 2 },
          y: -60, ease: 'none'
        });
      }
    }

    // ─────────────────────────────────────
    // SECTION 2 → 3 TRANSITION
    // Football morphs to basketball (crossfade + scale)
    // ─────────────────────────────────────
    // NOTE: Removed the exit scrub that was fading out the football ball
    // (prevented it from reappearing on scroll-up). Parallax only.

    // ─────────────────────────────────────
    // SECTION 3 — BASKETBALL
    // ─────────────────────────────────────
    const basketballSection = document.getElementById('basketball-section');
    if (basketballSection) {
      // Text entrance only — ball is owned by traveling ball
      gsap.fromTo('.basketball-text',
        { opacity: 0, x: 80 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '#basketball-section', start: 'top 60%', once: true }
        }
      );

      // Parallax positional only
      gsap.to('#basketball-ball-main', {
        scrollTrigger: { trigger: '#basketball-section', start: 'top bottom', end: 'bottom top', scrub: 2 },
        y: -40, rotation: -10, ease: 'none'
      });

      gsap.to('.orbit-ring-1', {
        scrollTrigger: { trigger: '#basketball-section', start: 'top bottom', end: 'bottom top', scrub: 3 },
        rotation: 180, ease: 'none'
      });

      ScrollTrigger.create({
        trigger: '#basketball-section',
        start: 'top center', end: 'bottom center',
        onEnter: () => updateSteps(1),
        onEnterBack: () => updateSteps(1),
      });
    }

    // ─────────────────────────────────────
    // SECTION 3 → 4 TRANSITION
    // Basketball morphs to rugby (stretch + crossfade)
    // ─────────────────────────────────────
    // NOTE: Removed basketball exit scrub to prevent disappear on scroll-up.

    // ─────────────────────────────────────
    // SECTION 4 — RUGBY / AERO-CORE
    // ─────────────────────────────────────
    const rugbySection = document.getElementById('rugby-section');
    if (rugbySection) {
      // Text-only entrances — rugby ball is owned by traveling ball
      gsap.fromTo('.rugby-title',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '#rugby-section', start: 'top 50%', once: true }
        }
      );
      gsap.fromTo('.rugby-desc',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '#rugby-section', start: 'top 40%', once: true }
        }
      );

      ScrollTrigger.create({
        trigger: '#rugby-section',
        start: 'top center', end: 'bottom center',
        onEnter: () => updateSteps(2),
        onEnterBack: () => updateSteps(2),
      });
    }

    // ─────────────────────────────────────
    // SECTION 4 → 5 TRANSITION
    // Rugby fades into darkness, video fades in
    // ─────────────────────────────────────
    // NOTE: Removed rugby-content exit scrub. Was causing content to vanish on scroll-up.

    // ─────────────────────────────────────
    // SECTION 5 — VIDEO + GLASS
    // ─────────────────────────────────────
    const videoSection = document.getElementById('video-section');
    const bgVideo = document.getElementById('bg-video');
    const glassCard = document.getElementById('glass-card');

    if (videoSection) {
      // Lazy load video
      ScrollTrigger.create({
        trigger: '#video-section',
        start: 'top 150%',
        once: true,
        onEnter: () => {
          if (bgVideo) bgVideo.play().catch(() => {});
        }
      });

      // Cinematic text entrance animations — staggered, dramatic
      const cinematicTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#video-section',
          start: 'top 60%',
          once: true
        }
      });

      cinematicTl
        .to('#cinematic-eyebrow', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
        .to('.line-reveal', { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: 'power4.out' }, '-=0.3')
        .to('#cinematic-quote', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.2')
        .to('#cinematic-stats', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
        .to('#cinematic-btn', { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.1');
    }

    // ─────────────────────────────────────
    // SECTION 6 — CONTACT
    // Use 'once: true' so animations always fire and stick
    // ─────────────────────────────────────
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      gsap.fromTo('.contact-title',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: '#contact-section',
            start: 'top 85%',
            once: true
          }
        }
      );

      gsap.fromTo('.contact-subtitle',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, delay: 0.2,
          scrollTrigger: {
            trigger: '#contact-section',
            start: 'top 85%',
            once: true
          }
        }
      );

      gsap.fromTo('.contact-email',
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.4,
          scrollTrigger: {
            trigger: '#contact-section',
            start: 'top 85%',
            once: true
          }
        }
      );

      gsap.fromTo('.social-link',
        { opacity: 0, y: 20, scale: 0.8 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1,
          ease: 'back.out(1.7)', delay: 0.6,
          scrollTrigger: {
            trigger: '#contact-section',
            start: 'top 85%',
            once: true
          }
        }
      );

      gsap.fromTo('.footer-bar',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, delay: 0.8,
          scrollTrigger: {
            trigger: '#contact-section',
            start: 'top 85%',
            once: true
          }
        }
      );
    }

    // ─────────────────────────────────────
    // SIDE STEPS CONTROLLER
    // ─────────────────────────────────────
    function updateSteps(activeIndex) {
      const steps = document.querySelectorAll('.step-item');
      steps.forEach((step, i) => {
        if (i <= activeIndex) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    }

    // Initialize first step as active when football section visible
    ScrollTrigger.create({
      trigger: '#football-section',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => updateSteps(0),
      onEnterBack: () => updateSteps(0),
    });

    // ─────────────────────────────────────
    // SMOOTH ANCHOR SCROLLING
    // ─────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          gsap.to(window, {
            duration: 1.2,
            scrollTo: { y: target, offsetY: 80 },
            ease: 'power3.inOut'
          });
        }
      });
    });

    // ─────────────────────────────────────
    // BUTTON HOVER GLOW EFFECTS
    // ─────────────────────────────────────
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // ─────────────────────────────────────
    // REFRESH ScrollTrigger on load
    // ─────────────────────────────────────
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    });

    // ─────────────────────────────────────
    // CONTACT FORM HANDLER
    // ─────────────────────────────────────
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Animate form out
        gsap.to(contactForm, {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            contactForm.style.display = 'none';
            formSuccess.style.display = 'flex';
            gsap.fromTo(formSuccess,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );
          }
        });
      });
    }

    // ─────────────────────────────────────
    // AUTH MODAL CONTROLLER
    // ─────────────────────────────────────
    const authOverlay = document.getElementById('auth-overlay');
    const authModal = document.getElementById('auth-modal');
    const authClose = document.getElementById('auth-close');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Credits modal elements
    const creditsOverlay = document.getElementById('credits-overlay');
    const creditsModal = document.getElementById('credits-modal');
    const creditsClose = document.getElementById('credits-close');
    const buyCreditsBtn = document.getElementById('buy-credits-btn');
    const creditPlans = document.querySelectorAll('.credit-plan');

    function openModal(tab) {
      authOverlay.classList.add('active');
      authModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Switch to correct tab
      switchTab(tab);
    }

    function openCreditsModal() {
      creditsOverlay.classList.add('active');
      creditsModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      authOverlay.classList.remove('active');
      authModal.classList.remove('active');
      if (creditsOverlay) creditsOverlay.classList.remove('active');
      if (creditsModal) creditsModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function switchTab(tab) {
      authTabs.forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
      });
      if (tab === 'login') {
        loginForm.style.display = '';
        signupForm.style.display = 'none';
      } else {
        loginForm.style.display = 'none';
        signupForm.style.display = '';
      }
    }

    if (loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); openModal('login'); });
    if (signupBtn) signupBtn.addEventListener('click', (e) => { e.preventDefault(); openModal('signup'); });
    if (buyCreditsBtn) buyCreditsBtn.addEventListener('click', (e) => { e.preventDefault(); openCreditsModal(); });
    
    if (authClose) authClose.addEventListener('click', closeModal);
    if (authOverlay) authOverlay.addEventListener('click', closeModal);
    
    if (creditsClose) creditsClose.addEventListener('click', closeModal);
    if (creditsOverlay) creditsOverlay.addEventListener('click', closeModal);

    // Credit plan selection logic
    if (creditPlans) {
      creditPlans.forEach(plan => {
        plan.addEventListener('click', () => {
          creditPlans.forEach(p => {
            p.style.borderColor = 'rgba(255,255,255,0.1)';
            p.style.background = 'rgba(255,255,255,0.03)';
          });
          plan.style.borderColor = 'var(--color-accent-blue)';
          plan.style.background = 'rgba(0, 212, 255, 0.05)';
        });
      });
    }

    authTabs.forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Form submissions → redirect to dashboard
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('login-email').value.split('@')[0];
        localStorage.setItem('athleon_user', JSON.stringify({ name: name, email: document.getElementById('login-email').value }));
        window.location.href = 'dashboard.html';
      });
    }

    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        localStorage.setItem('athleon_user', JSON.stringify({
          name: name,
          email: document.getElementById('signup-email').value,
          sport: document.getElementById('signup-sport').value
        }));
        window.location.href = 'dashboard.html';
      });
    }

  }); // end waitForGSAP

})();

// Global function for Google Sign-In
window.handleGoogleSignIn = async function() {
  try {
    if (typeof signInWithGoogle !== 'function') {
      alert('Google Sign-In is not configured yet. Set up firebase-config.js');
      return;
    }
    const user = await signInWithGoogle();
    
    // Store in localStorage for dashboard
    localStorage.setItem('athleon_user', JSON.stringify({
      name: user.name,
      email: user.email,
      photo: user.photo,
      uid: user.uid,
      sport: 'General' // Default, can be changed in profile
    }));
    
    window.location.href = 'dashboard.html';
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    alert('Failed to sign in with Google: ' + error.message);
  }
};

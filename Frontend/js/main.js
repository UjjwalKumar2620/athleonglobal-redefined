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
      // Entrance: welcome text — play once, never reverse
      gsap.fromTo('.football-welcome',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: {
            trigger: '#football-section',
            start: 'top 70%',
            once: true
          }
        }
      );

      // Entrance: title
      gsap.fromTo('.football-title',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: '#football-section',
            start: 'top 70%',
            once: true
          }
        }
      );

      // Entrance: football ball
      if (footballBallMain) {
        gsap.fromTo(footballBallMain,
          { opacity: 0, scale: 0.6 },
          {
            opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: '#football-section',
              start: 'top 75%',
              once: true
            }
          }
        );

        // Parallax effect — positional only, never changes opacity
        gsap.to(footballBallMain, {
          scrollTrigger: {
            trigger: '#football-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
          y: -60,
          ease: 'none'
        });
      }

      // Entrance: learn more button
      gsap.fromTo('.football-btn',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: {
            trigger: '#football-section',
            start: 'top 60%',
            once: true
          }
        }
      );
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
      // Basketball entrance — once only
      gsap.fromTo('.basketball-visual',
        { opacity: 0, x: -80, scale: 0.8 },
        {
          opacity: 1, x: 0, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: '#basketball-section',
            start: 'top 70%',
            once: true
          }
        }
      );

      gsap.fromTo('.basketball-text',
        { opacity: 0, x: 80 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: '#basketball-section',
            start: 'top 60%',
            once: true
          }
        }
      );

      // Parallax on basketball
      gsap.to('#basketball-ball-main', {
        scrollTrigger: {
          trigger: '#basketball-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
        y: -40,
        rotation: -10,
        ease: 'none'
      });

      // Orbit rings parallax
      gsap.to('.orbit-ring-1', {
        scrollTrigger: {
          trigger: '#basketball-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 3,
        },
        rotation: 180,
        ease: 'none'
      });

      // Update side steps
      ScrollTrigger.create({
        trigger: '#basketball-section',
        start: 'top center',
        end: 'bottom center',
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
      // Rugby entrance — once only
      gsap.fromTo('.rugby-visual',
        { opacity: 0, scale: 0.7, y: 60 },
        {
          opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: '#rugby-section',
            start: 'top 70%',
            once: true
          }
        }
      );

      gsap.fromTo('.rugby-title',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: '#rugby-section',
            start: 'top 50%',
            once: true
          }
        }
      );

      gsap.fromTo('.rugby-desc',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: '#rugby-section',
            start: 'top 40%',
            once: true
          }
        }
      );

      // Update side steps
      ScrollTrigger.create({
        trigger: '#rugby-section',
        start: 'top center',
        end: 'bottom center',
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
          if (bgVideo) {
            bgVideo.play().catch(() => {});
          }
        }
      });

      // Glass card entrance
      if (glassCard) {
        gsap.fromTo(glassCard,
          { opacity: 0, y: 80, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out',
            scrollTrigger: {
              trigger: '#video-section',
              start: 'top 60%',
              once: true
            }
          }
        );

        gsap.fromTo('.glass-label',
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.6, delay: 0.3,
            scrollTrigger: {
              trigger: '#video-section',
              start: 'top 55%',
              once: true
            }
          }
        );

        gsap.fromTo('.glass-title',
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, delay: 0.5,
            scrollTrigger: {
              trigger: '#video-section',
              start: 'top 55%',
              once: true
            }
          }
        );

        gsap.fromTo('.glass-desc',
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.6, delay: 0.7,
            scrollTrigger: {
              trigger: '#video-section',
              start: 'top 50%',
              once: true
            }
          }
        );

        gsap.fromTo('.glass-btn',
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.6, delay: 0.9,
            scrollTrigger: {
              trigger: '#video-section',
              start: 'top 45%',
              once: true
            }
          }
        );
      }
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

  }); // end waitForGSAP

})();

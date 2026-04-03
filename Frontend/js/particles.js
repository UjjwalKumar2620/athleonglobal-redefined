/* ========================================
   PARTICLES.JS — Ambient Star/Particle System
   Canvas-based floating particles for the dark background
   ======================================== */

(function() {
  'use strict';

  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let width, height;

  // Config
  const CONFIG = {
    count: 80,
    maxSize: 2.5,
    minSize: 0.5,
    speed: 0.15,
    connectionDistance: 120,
    connectionOpacity: 0.04,
    colors: [
      'rgba(255, 255, 255,',    // White
      'rgba(77, 166, 255,',     // Blue accent
      'rgba(192, 200, 212,',    // Silver
    ],
    mouse: { x: null, y: null, radius: 150 }
  };

  // Resize handler
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * (CONFIG.maxSize - CONFIG.minSize) + CONFIG.minSize;
      this.baseSize = this.size;
      this.speedX = (Math.random() - 0.5) * CONFIG.speed;
      this.speedY = (Math.random() - 0.5) * CONFIG.speed;
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.opacity = Math.random() * 0.6 + 0.2;
      this.baseOpacity = this.opacity;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Pulse effect
      this.opacity = this.baseOpacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.15;
      this.size = this.baseSize + Math.sin(time * this.pulseSpeed * 0.5 + this.pulseOffset) * 0.3;

      // Mouse interaction
      if (CONFIG.mouse.x !== null) {
        const dx = this.x - CONFIG.mouse.x;
        const dy = this.y - CONFIG.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.mouse.radius) {
          const force = (CONFIG.mouse.radius - dist) / CONFIG.mouse.radius;
          this.x += dx * force * 0.02;
          this.y += dy * force * 0.02;
          this.opacity = Math.min(1, this.opacity + force * 0.3);
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.1, this.size), 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();

      // Glow for larger particles
      if (this.baseSize > 1.5) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color + (this.opacity * 0.1) + ')';
        ctx.fill();
      }
    }
  }

  // Initialize particles
  function init() {
    resize();
    particles = [];

    // Reduce count on mobile
    const count = window.innerWidth < 768 ? Math.floor(CONFIG.count * 0.4) : CONFIG.count;

    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  // Draw connections between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectionDistance) {
          const opacity = CONFIG.connectionOpacity * (1 - dist / CONFIG.connectionDistance);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(77, 166, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate(time) {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update(time);
      p.draw();
    });

    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  // Event listeners
  window.addEventListener('resize', () => {
    resize();
    // Reinitialize on significant size changes
    if (Math.abs(particles.length - (window.innerWidth < 768 ? CONFIG.count * 0.4 : CONFIG.count)) > 10) {
      init();
    }
  });

  window.addEventListener('mousemove', (e) => {
    CONFIG.mouse.x = e.clientX;
    CONFIG.mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    CONFIG.mouse.x = null;
    CONFIG.mouse.y = null;
  });

  // Start
  init();
  animate(0);

  // Expose for cleanup if needed
  window.particlesCleanup = () => {
    cancelAnimationFrame(animationId);
  };
})();

/* ========================================
   SMOKE.JS — High-Density Tornado/Storm Effect
   Spiraling, wobbling particles for the Rugby section
   ======================================== */

(function() {
  'use strict';

  const canvas = document.getElementById('smoke-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let tornadoParticles = [];
  let animationId;
  let isActive = false;

  const CONFIG = {
    count: 500, // Extreme density for true storm power
    minRadius: 50,
    maxRadius: 400,
    minSpeed: 0.02,
    maxSpeed: 0.08,
    opacity: 0.25,
    colors: [
      '200, 220, 255', // Ice blue
      '255, 255, 255', // White
      '180, 120, 60',  // Leather
      '255, 215, 0'    // Spark/Energy gold
    ],
    particleMaxSize: 5,
    particleMinSize: 1
  };

  class TornadoParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.centerX = canvas.width / 2;
      this.centerY = canvas.height / 2;
      
      // Starting parameters for the vortex
      this.radius = Math.random() * (CONFIG.maxRadius - CONFIG.minRadius) + CONFIG.minRadius;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed) + CONFIG.minSpeed;
      
      // Randomize color from the storm palette
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      
      // 3D positioning
      this.z = Math.random() * 2 - 1; 
      this.size = Math.random() * (CONFIG.particleMaxSize - CONFIG.particleMinSize) + CONFIG.particleMinSize;
      
      // Storm wobbling (drifting center)
      this.driftX = (Math.random() - 0.5) * 50;
      this.driftY = (Math.random() - 0.5) * 30;
      
      // Life parameters
      this.opacity = 0;
      this.life = 0;
      this.maxLife = 120 + Math.random() * 150;
      
      // Spiraling motion (radius changes over time)
      this.radialPulse = Math.random() * 0.05;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
      // Rotate around the drifting center
      this.angle += this.speed;
      this.pulsePhase += this.radialPulse;
      
      // The "Vortex" math - radius changes slightly to feel alive
      const currentRadius = this.radius + Math.sin(this.pulsePhase) * 20;

      // Calculate position with elliptical perspective
      this.x = this.centerX + this.driftX + Math.cos(this.angle) * currentRadius;
      // Ellipse height is 1/3 of width for horizontal tornado feel
      this.y = this.centerY + this.driftY + Math.sin(this.angle) * currentRadius * 0.35;

      this.life++;

      // Professional fade in/out
      if (this.life < 30) {
        this.opacity = (this.life / 30) * CONFIG.opacity;
      } else if (this.life > this.maxLife - 30) {
        this.opacity = ((this.maxLife - this.life) / 30) * CONFIG.opacity;
      } else {
        this.opacity = CONFIG.opacity;
      }

      if (this.life >= this.maxLife) {
        this.reset();
      }
    }

    draw() {
      if (this.opacity <= 0) return;

      // Depth perception via scale
      // Front elements (z > 0) are larger and brighter
      const depth = Math.sin(this.angle);
      const scale = 1 + depth * 0.5;
      const currentOpacity = this.opacity * (0.4 + scale * 0.6);

      ctx.save();
      
      // Draw a "streak" to show velocity (tornado type)
      const tailAngle = this.angle - (this.speed * 2.5);
      const tailRadius = this.radius + Math.sin(this.pulsePhase - 0.1) * 20;
      const tailX = this.centerX + this.driftX + Math.cos(tailAngle) * tailRadius;
      const tailY = this.centerY + this.driftY + Math.sin(tailAngle) * tailRadius * 0.35;

      const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
      gradient.addColorStop(0, `rgba(${this.color}, 0)`);
      gradient.addColorStop(0.5, `rgba(${this.color}, ${currentOpacity * 0.7})`);
      gradient.addColorStop(1, `rgba(${this.color}, ${currentOpacity})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = this.size * scale;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      ctx.restore();
    }
  }

  function resize() {
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      init();
    }
  }

  function init() {
    tornadoParticles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      tornadoParticles.push(new TornadoParticle());
    }
  }

  function animate() {
    if (!isActive) return;

    // Use trails/blur instead of full clear for storm feel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Explicitly clearing some of it to prevent over-accumulation
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    tornadoParticles.forEach(p => {
      p.update();
      p.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isActive = true;
        animate();
      } else {
        isActive = false;
        cancelAnimationFrame(animationId);
      }
    });
  }, { threshold: 0.1 });

  function start() {
    const rugbySection = document.getElementById('rugby-section');
    if (rugbySection) {
      observer.observe(rugbySection);
    }
    resize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.addEventListener('resize', resize);
})();

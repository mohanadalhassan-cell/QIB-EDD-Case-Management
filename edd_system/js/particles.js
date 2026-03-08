/**
 * QIB EDD System — Particle Network Animation
 * Creates an elegant neural network effect
 */

(function() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let mouseX = 0;
  let mouseY = 0;
  
  const config = {
    particleCount: 80,
    particleMinSize: 1,
    particleMaxSize: 2.5,
    connectionDistance: 150,
    mouseRadius: 200,
    baseSpeed: 0.3,
    colors: {
      particle: 'rgba(0, 212, 255, 0.6)',
      connection: 'rgba(0, 212, 255, 0.1)',
      mouseConnection: 'rgba(0, 212, 255, 0.25)'
    }
  };
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * config.baseSpeed,
      vy: (Math.random() - 0.5) * config.baseSpeed,
      size: Math.random() * (config.particleMaxSize - config.particleMinSize) + config.particleMinSize,
      opacity: Math.random() * 0.5 + 0.3
    };
  }
  
  function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(createParticle());
    }
  }
  
  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
    ctx.fill();
  }
  
  function drawConnection(p1, p2, distance, maxDist, isMouseConnection = false) {
    const opacity = 1 - (distance / maxDist);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    
    if (isMouseConnection) {
      ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.3})`;
      ctx.lineWidth = 1.5;
    } else {
      ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.12})`;
      ctx.lineWidth = 1;
    }
    
    ctx.stroke();
  }
  
  function updateParticle(p) {
    p.x += p.vx;
    p.y += p.vy;
    
    // Bounce off edges
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    
    // Keep in bounds
    p.x = Math.max(0, Math.min(canvas.width, p.x));
    p.y = Math.max(0, Math.min(canvas.height, p.y));
    
    // Mouse interaction - subtle attraction
    const dx = mouseX - p.x;
    const dy = mouseY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < config.mouseRadius && dist > 0) {
      const force = (config.mouseRadius - dist) / config.mouseRadius * 0.01;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    }
    
    // Limit velocity
    const maxVel = config.baseSpeed * 2;
    const vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (vel > maxVel) {
      p.vx = (p.vx / vel) * maxVel;
      p.vy = (p.vy / vel) * maxVel;
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(p => {
      updateParticle(p);
      drawParticle(p);
    });
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.connectionDistance) {
          drawConnection(particles[i], particles[j], distance, config.connectionDistance);
        }
      }
      
      // Mouse connections
      const mdx = particles[i].x - mouseX;
      const mdy = particles[i].y - mouseY;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      
      if (mDist < config.mouseRadius) {
        drawConnection(particles[i], { x: mouseX, y: mouseY }, mDist, config.mouseRadius, true);
      }
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  // Event listeners
  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  document.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });
  
  // Initialize
  resize();
  initParticles();
  animate();
  
  // Cleanup function
  window.destroyParticles = function() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
})();

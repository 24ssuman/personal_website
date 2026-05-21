/**
 * animation.js
 * Implements interactive floating molecular animations and scroll-reveal effects.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Interactive Molecular Canvas Background ---
  const hero = document.querySelector(".hero-home");
  if (hero) {
    // Create canvas element
    const canvas = document.createElement("canvas");
    canvas.className = "molecular-canvas";
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Configuration
    let particleCount = 45;
    const connectionDistance = 110;
    const particles = [];
    const mouse = { x: null, y: null, radius: 150 };

    // Responsive sizing
    function resizeCanvas() {
      canvas.width = hero.clientWidth;
      canvas.height = hero.clientHeight;
      
      // Adjust particle density based on screen size
      if (canvas.width < 768) {
        particleCount = 20;
      } else {
        particleCount = 45;
      }
    }

    // Colors matching the styling (using Suman's Teal and Rust accents with transparency)
    const particleColor = "rgba(20, 95, 104, 0.4)"; // Teal
    const hydrogenColor = "rgba(182, 83, 56, 0.35)"; // Rust
    const bondColor = "rgba(20, 95, 104, 0.12)"; // Faded Teal
    const mouseBondColor = "rgba(182, 83, 56, 0.25)"; // Rust bond to cursor

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Molecular motion is thermal and slow
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        
        // Define atom type: 'O' (Oxygen, larger) or 'H' (Hydrogen, smaller)
        // 1:2 ratio mimicking water clusters
        this.type = Math.random() > 0.33 ? "H" : "O";
        this.radius = this.type === "O" ? Math.random() * 3.5 + 3.5 : Math.random() * 2 + 1.5;
      }

      update() {
        // Wrap around boundaries
        if (this.x < 0 || this.x > canvas.width) {
          this.vx = -this.vx;
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.vy = -this.vy;
        }

        // Apply motion
        this.x += this.vx;
        this.y += this.vy;

        // Interaction with mouse cursor (repulsion)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            // Smoothly push particles away
            this.x += (dx / dist) * force * 1.5;
            this.y += (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.type === "O" ? particleColor : hydrogenColor;
        ctx.fill();

        // Add a micro glow effect to oxygen (representing hydration shell/polarizability)
        if (this.type === "O") {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(20, 95, 104, 0.06)";
          ctx.fill();
        }
      }
    }

    // Initialize particles
    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    // Draw bonds (molecular graph edges)
    function drawBonds() {
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Check distance to other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.7;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = bondColor.replace("0.12", opacity.toString());
            ctx.lineWidth = p1.type === "O" && p2.type === "O" ? 1.2 : 0.8;
            ctx.stroke();
          }
        }

        // Draw dynamic chemical bonds to cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const opacity = (1 - dist / mouse.radius) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = mouseBondColor.replace("0.25", opacity.toString());
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    // Main animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      drawBonds();
      animationFrameId = requestAnimationFrame(animate);
    }

    // Setup events
    window.addEventListener("resize", () => {
      resizeCanvas();
      initParticles();
    });

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    hero.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Start canvas execution
    resizeCanvas();
    initParticles();
    animate();
  }

  // --- 2. Viewport Scroll Reveal ---
  const revealElements = document.querySelectorAll(".reveal-item");
  if (revealElements.length > 0) {
    const observerOptions = {
      root: null, // Viewport
      rootMargin: "0px 0px -40px 0px", // Trigger slightly before element is fully visible
      threshold: 0.12, // 12% visibility triggers the reveal
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add visible class
          entry.target.classList.add("revealed");
          
          // Stop observing once revealed (improves scroll performance)
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el, index) => {
      // Stagger child elements in grids dynamically
      const parentGrid = el.closest(".metric-grid, .card-grid, .education-grid, .recognition-grid, .feature-grid, .conference-list, .publication-section");
      if (parentGrid) {
        // Find index of the element within siblings inside its grid
        const siblings = Array.from(parentGrid.querySelectorAll(".reveal-item"));
        const gridIndex = siblings.indexOf(el);
        if (gridIndex !== -1) {
          el.style.transitionDelay = `${gridIndex * 0.08}s`;
        }
      }
      revealObserver.observe(el);
    });
  }

  // --- 3. Dynamic Smooth Publication Accordions ---
  const publicationCards = document.querySelectorAll(".paper-card");
  publicationCards.forEach((card) => {
    const details = card.querySelector("details");
    const summary = card.querySelector("summary");
    
    if (details && summary) {
      summary.addEventListener("click", (e) => {
        // Prevent default browser toggle behavior to animate manually
        e.preventDefault();
        
        const content = details.querySelector("p");
        const link = details.querySelector(".paper-link");
        
        if (details.hasAttribute("open")) {
          // Close animation
          card.classList.remove("expanded");
          setTimeout(() => {
            details.removeAttribute("open");
          }, 300); // match transition speed
        } else {
          // Open
          details.setAttribute("open", "");
          // Allow render before adding expanded class
          requestAnimationFrame(() => {
            card.classList.add("expanded");
          });
        }
      });
    }
  });
});

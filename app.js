/**
 * EDTF Landing Page JavaScript Core
 * Interactive canvas background, loss calculator, live counter, and UI animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components with error isolation
  const initializers = [
    { name: 'Mobile Navigation', fn: initMobileNav },
    { name: 'Background Canvas', fn: initBackgroundCanvas },
    { name: 'Live Loss Counter', fn: initLiveLossCounter },
    { name: 'Calculator', fn: initCalculator },
    { name: 'Scroll Animations', fn: initScrollAnimations },
    { name: 'Scroll Spy', fn: initScrollSpy }
  ];

  initializers.forEach(init => {
    try {
      init.fn();
    } catch (err) {
      console.error(`Error initializing ${init.name}:`, err);
    }
  });
});

/* ==========================================================================
   Mobile Navigation Menu Toggle
   ========================================================================== */
function initMobileNav() {
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-item a');

  burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle');
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        burger.classList.remove('toggle');
      }
    });
  });

  // Header background on scroll
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   Interactive Particles Network Canvas Background
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Resize handler
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Mouse interactivity coordinates
  const mouse = {
    x: null,
    y: null,
    radius: 120 // Interaction distance
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Node Class
  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 1.5 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce on borders
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push/pull effect
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          // Apply tiny acceleration away from mouse (push effect)
          this.x -= dx / dist * force * 0.6;
          this.y -= dy / dist * force * 0.6;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(190, 100%, 50%, 0.15)';
      ctx.fill();
    }
  }

  // Create Node Array (optimized density based on screen size)
  const nodeCount = Math.min(Math.floor((width * height) / 18000), 80);
  const nodes = Array.from({ length: nodeCount }, () => new Node());

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines first for hi-tech blueprint aesthetic
    drawBackgroundGrid();

    // Update and draw nodes
    nodes.forEach(node => {
      node.update();
      node.draw();
    });

    // Draw network connections (lines between close nodes)
    drawConnections();

    animationFrameId = requestAnimationFrame(animate);
  }

  function drawBackgroundGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.007)';
    ctx.lineWidth = 1;
    const gridSize = 80;

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Connect if nodes are close enough
        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.12;
          ctx.strokeStyle = `hsla(190, 100%, 50%, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Start Animation
  animate();
}

/* ==========================================================================
   Live Ticker Counter - National Business Energy Losses
   ========================================================================== */
function initLiveLossCounter() {
  const tickerVal = document.getElementById('ticker-val');
  if (!tickerVal) return;

  // Starting value of total estimated national losses since current business day start
  const now = new Date();
  const secondsSinceMidnight = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
  
  // Base loss rate is approx. 85.50 PLN per second nationwide due to unoptimized contracts
  let currentLoss = 1245000 + (secondsSinceMidnight * 85.50);

  function updateCounter() {
    // Add random incremental value reflecting fluctuations
    const increment = Math.random() * 8.5 + 4.2;
    currentLoss += increment;
    
    // Format to currency style PLN
    tickerVal.textContent = Math.floor(currentLoss).toLocaleString('pl-PL');
  }

  // Update every 120ms
  setInterval(updateCounter, 120);
}

/* ==========================================================================
   Interactive Cost Savings & Loss Calculator
   ========================================================================== */
function initCalculator() {
  // Elements selectors
  const tabElectricity = document.querySelector('.calc-tab[data-type="electricity"]');
  const tabGas = document.querySelector('.calc-tab[data-type="gas"]');
  
  const costSlider = document.getElementById('calc-cost-slider');
  const costDisplay = document.getElementById('calc-cost-display');
  
  const mwhSlider = document.getElementById('calc-mwh-slider');
  const mwhDisplay = document.getElementById('calc-mwh-display');
  const mwhLabel = document.getElementById('calc-mwh-label');
  
  const unitToggle = document.getElementById('calc-unit-toggle');
  const toggleLabel = document.getElementById('toggle-unit-text');
  
  const displayMonthlyLoss = document.getElementById('loss-monthly-value');
  const displayYearlyLoss = document.getElementById('loss-yearly-value');
  const displayContractLoss = document.getElementById('loss-contract-value');
  
  const calculatorTitle = document.getElementById('calc-type-title');
  const resultCurrencyLabel = document.querySelectorAll('.loss-value span');

  let activeTab = 'electricity'; // 'electricity' or 'gas'

  // Slider limits and initial values based on tab type
  const tabConfigs = {
    electricity: {
      costMin: 1000,
      costMax: 150000,
      costStart: 45000,
      mwhMinMonthly: 1,
      mwhMaxMonthly: 250,
      mwhStartMonthly: 90,
      mwhMinYearly: 10,
      mwhMaxYearly: 3000,
      mwhStartYearly: 1080,
      rate: 510,
      color: 'var(--primary-cyan)',
      label: 'Zużycie Energii (MWh)'
    },
    gas: {
      costMin: 1000,
      costMax: 150000,
      costStart: 60000,
      mwhMinMonthly: 1,
      mwhMaxMonthly: 250,
      mwhStartMonthly: 150,
      mwhMinYearly: 10,
      mwhMaxYearly: 3000,
      mwhStartYearly: 1800,
      rate: 197,
      color: 'var(--accent-orange)',
      label: 'Zużycie Gazu (MWh)'
    }
  };

  // Switch Active Tab
  function setTab(tab) {
    activeTab = tab;
    const config = tabConfigs[tab];

    // Toggle active state classes
    tabElectricity.classList.toggle('active', tab === 'electricity');
    tabGas.classList.toggle('active', tab === 'gas');

    // Update Slider Ranges and values
    costSlider.min = config.costMin;
    costSlider.max = config.costMax;
    costSlider.value = config.costStart;
    costSlider.setAttribute('data-type', tab);

    unitToggle.checked = false; // Reset to monthly unit by default
    toggleLabel.textContent = 'Miesięcznie';

    mwhSlider.min = config.mwhMinMonthly;
    mwhSlider.max = config.mwhMaxMonthly;
    mwhSlider.value = config.mwhStartMonthly;
    mwhSlider.setAttribute('data-type', tab);

    // Toggle switch data theme
    document.querySelector('.toggle-switch').setAttribute('data-theme', tab);

    // Update colors and text labels
    mwhLabel.textContent = config.label;
    calculatorTitle.textContent = tab === 'electricity' ? 'Energia Elektryczna' : 'Gaz Ziemny';
    
    // Set neon accent colors to calculations
    const themeGlow = tab === 'electricity' ? 'var(--primary-cyan)' : 'var(--accent-orange)';
    const themeGlowShadow = tab === 'electricity' ? 'var(--primary-cyan-glow)' : 'var(--accent-orange-glow)';
    
    displayMonthlyLoss.style.color = themeGlow;
    displayMonthlyLoss.style.textShadow = `0 0 20px ${themeGlowShadow}`;
    displayYearlyLoss.style.color = themeGlow;
    displayYearlyLoss.style.textShadow = `0 0 20px ${themeGlowShadow}`;

    resultCurrencyLabel.forEach(span => {
      span.style.color = themeGlow;
    });

    calculateSavings();
  }

  // Savings Algorithm Logic
  function calculateSavings() {
    const cost = parseFloat(costSlider.value);
    const mwh = parseFloat(mwhSlider.value);
    const isYearlyUnit = unitToggle.checked;
    
    const config = tabConfigs[activeTab];
    
    // 1. Convert consumption to monthly
    const mwhMonthly = isYearlyUnit ? (mwh / 12) : mwh;
    
    // 2. Optimum cost is MWh * multiplier
    const optimumCost = mwhMonthly * config.rate;
    
    // 3. Raw monthly potential loss
    let potentialLoss = cost - optimumCost;
    
    // 4. If negative (client has great pricing), fall back to pseudo-random 4-5% of their total cost
    if (potentialLoss <= 0) {
      // Deterministic calculation based on cost to prevent erratic value flickering during drag
      const pseudoRandomFactor = 0.04 + (Math.sin(cost) + 1) * 0.005; // range: 0.040 to 0.050 (4% - 5%)
      potentialLoss = cost * pseudoRandomFactor;
    }

    const yearlyLoss = potentialLoss * 12;
    const contractLoss = yearlyLoss * 3; // 3-year contract estimation

    // Update Form Inputs displays
    costDisplay.textContent = Math.round(cost).toLocaleString('pl-PL') + ' zł';
    mwhDisplay.textContent = Math.round(mwh).toLocaleString('pl-PL') + ' MWh';

    // Update Outputs UI dynamically
    animateValue(displayMonthlyLoss, parseInt(displayMonthlyLoss.textContent.replace(/\s/g, '')) || 0, Math.round(potentialLoss));
    animateValue(displayYearlyLoss, parseInt(displayYearlyLoss.textContent.replace(/\s/g, '')) || 0, Math.round(yearlyLoss));
    animateValue(displayContractLoss, parseInt(displayContractLoss.textContent.replace(/\s/g, '')) || 0, Math.round(contractLoss));
  }

  // Smooth digits rolling animation counter
  function animateValue(obj, start, end) {
    if (start === end) {
      obj.textContent = end.toLocaleString('pl-PL');
      return;
    }
    
    const duration = 250; // ms
    let startTime = null;
    
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      obj.textContent = current.toLocaleString('pl-PL');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }

  // Event Listeners for calculator inputs
  tabElectricity.addEventListener('click', () => setTab('electricity'));
  tabGas.addEventListener('click', () => setTab('gas'));

  costSlider.addEventListener('input', calculateSavings);
  mwhSlider.addEventListener('input', calculateSavings);
  
  unitToggle.addEventListener('change', () => {
    const config = tabConfigs[activeTab];
    if (unitToggle.checked) {
      toggleLabel.textContent = 'Rocznie';
      mwhSlider.min = config.mwhMinYearly;
      mwhSlider.max = config.mwhMaxYearly;
      mwhSlider.value = Math.min(config.mwhMaxYearly, Math.max(config.mwhMinYearly, mwhSlider.value * 12));
    } else {
      toggleLabel.textContent = 'Miesięcznie';
      mwhSlider.min = config.mwhMinMonthly;
      mwhSlider.max = config.mwhMaxMonthly;
      mwhSlider.value = Math.min(config.mwhMaxMonthly, Math.max(config.mwhMinMonthly, Math.round(mwhSlider.value / 12)));
    }
    calculateSavings();
  });

  // Init default layout
  setTab('electricity');
}

/* ==========================================================================
   Scroll Reveal Fade-In Trigger Animations
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after animating once to keep page performance clean
        observer.unobserve(entry.target);
      }
    });
  };

  const options = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(revealCallback, options);
  
  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

/* ==========================================================================
   Scroll Spy - Highlight Current Navigation Link
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 150; // offset for nav bar height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      const href = item.querySelector('a').getAttribute('href');
      if (href === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
}

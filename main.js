(function() {
  'use strict';

  /* ── LOADING SCREEN ── */
  var loadingScreen = document.getElementById('sm-loading-screen');
  var loadingLogo = loadingScreen ? loadingScreen.querySelector('.loading-screen__logo') : null;
  var loadingX = loadingScreen ? loadingScreen.querySelector('.loading-screen__x') : null;
  var loadingName = loadingScreen ? loadingScreen.querySelector('.loading-screen__name') : null;
  var loadingRole = loadingScreen ? loadingScreen.querySelector('.loading-screen__role') : null;
  var particleCanvas = document.getElementById('loading-particles');

  /* ── PARTICLE SYSTEM ── */
  function initParticles(canvas) {
    if (!canvas) return null;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var animId = null;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Particle types: 'droplet', 'sparkle', 'bokeh'
    for (var i = 0; i < 40; i++) {
      var type;
      var rand = Math.random();
      if (rand < 0.4) type = 'droplet';
      else if (rand < 0.75) type = 'sparkle';
      else type = 'bokeh';

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        type: type,
        r: type === 'bokeh' ? (Math.random() * 7 + 8) : (type === 'droplet' ? (Math.random() * 3 + 3) : (Math.random() * 2 + 2)),
        dx: (Math.random() - 0.5) * 0.15,
        dy: type === 'sparkle' ? (Math.random() - 0.5) * 0.1 : -(Math.random() * 0.2 + 0.05),
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.008 + 0.003,
        swayAmp: Math.random() * 0.3 + 0.1,
        alpha: type === 'bokeh' ? (Math.random() * 0.05 + 0.03) : (type === 'sparkle' ? (Math.random() * 0.6 + 0.3) : (Math.random() * 0.4 + 0.2)),
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: type === 'sparkle' ? (Math.random() * 0.04 + 0.02) : (Math.random() * 0.015 + 0.005),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.005
      });
    }

    function drawDroplet(ctx, x, y, r, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      // Teardrop shape
      ctx.moveTo(x, y - r * 1.4);
      ctx.bezierCurveTo(x + r * 0.8, y - r * 0.5, x + r * 0.7, y + r * 0.6, x, y + r);
      ctx.bezierCurveTo(x - r * 0.7, y + r * 0.6, x - r * 0.8, y - r * 0.5, x, y - r * 1.4);
      ctx.closePath();
      ctx.fillStyle = 'rgba(78, 197, 191, 0.6)';
      ctx.fill();
      // Subtle inner highlight
      ctx.beginPath();
      ctx.arc(x - r * 0.15, y - r * 0.3, r * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
      ctx.restore();
    }

    function drawSparkle(ctx, x, y, r, alpha, rotation) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      // 4-point star
      ctx.beginPath();
      for (var i = 0; i < 4; i++) {
        var angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
        var nextAngle = ((i + 0.5) / 4) * Math.PI * 2 - Math.PI / 2;
        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        ctx.lineTo(Math.cos(nextAngle) * r * 0.3, Math.sin(nextAngle) * r * 0.3);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
      // Tiny glow
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + (alpha * 0.15) + ')';
      ctx.fill();
      ctx.restore();
    }

    function drawBokeh(ctx, x, y, r, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(78, 197, 191, 0.5)';
      ctx.fill();
      // Soft ring
      ctx.beginPath();
      ctx.arc(x, y, r * 0.85, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(78, 197, 191, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        // Gentle sway
        p.sway += p.swaySpeed;
        p.x += p.dx + Math.sin(p.sway) * p.swayAmp;
        p.y += p.dy;
        p.pulse += p.pulseSpeed;
        p.rotation += p.rotSpeed;

        var flicker = 0.5 + 0.5 * Math.sin(p.pulse);
        var a = p.alpha * flicker;

        // Wrap around edges
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        if (p.type === 'droplet') {
          drawDroplet(ctx, p.x, p.y, p.r, a);
        } else if (p.type === 'sparkle') {
          drawSparkle(ctx, p.x, p.y, p.r, a, p.rotation);
        } else {
          drawBokeh(ctx, p.x, p.y, p.r, a);
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return { stop: function() { if (animId) cancelAnimationFrame(animId); } };
  }

  var particleSys = initParticles(particleCanvas);

  if (loadingScreen) {
    var loadingEnter = loadingScreen.querySelector('.loading-screen__enter');
    var clickHandled = false;

    /* Staggered entrance (SLOWER): logo → × → name → role */
    setTimeout(function() {
      if (loadingLogo) loadingLogo.classList.add('show');
    }, 600);
    setTimeout(function() {
      if (loadingX) loadingX.classList.add('show');
    }, 1400);
    setTimeout(function() {
      if (loadingName) loadingName.classList.add('show');
    }, 2200);
    setTimeout(function() {
      if (loadingRole) loadingRole.classList.add('show');
    }, 3000);

    /* Show "Click to Enter" prompt after all elements appear */
    setTimeout(function() {
      if (loadingEnter) loadingEnter.classList.add('show');
    }, 3700);

    /* Click-to-enter: reverse animation exit */
    function dismissLoadingScreen() {
      if (clickHandled) return;
      clickHandled = true;

      /* Reverse exit: enter-prompt → role → name → × → logo */
      if (loadingEnter) loadingEnter.classList.add('is-exiting');
      if (loadingRole) loadingRole.classList.add('is-exiting');
      setTimeout(function() {
        if (loadingName) loadingName.classList.add('is-exiting');
      }, 150);
      setTimeout(function() {
        if (loadingX) loadingX.classList.add('is-exiting');
      }, 300);
      setTimeout(function() {
        if (loadingLogo) loadingLogo.classList.add('is-exiting');
      }, 450);

      /* After reverse animation completes, hide screen and start hero */
      setTimeout(function() {
        if (particleSys) particleSys.stop();
        loadingScreen.classList.add('is-hidden');
        if (document.body.classList.contains('slideshow-mode')) {
          triggerSlideAnimations(slides[0]);
        } else {
          var heroEls = document.querySelectorAll('#section-hook .animate-on-scroll');
          heroEls.forEach(function(el, i) {
            setTimeout(function() { el.classList.add('is-visible'); }, i * 120);
          });
        }
      }, 950);
    }

    loadingScreen.addEventListener('click', dismissLoadingScreen);
  }

  /* ── SCROLL PROGRESS ── */
  var bar = document.getElementById('scroll-progress');
  function updateBar() {
    if (document.body.classList.contains('slideshow-mode')) return;
    var st = window.pageYOffset;
    var dh = document.documentElement.scrollHeight - window.innerHeight;
    var pct = dh > 0 ? (st / dh) * 100 : 0;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }
  window.addEventListener('scroll', updateBar, { passive: true });

  /* ── ANIMATE ON SCROLL ── */
  var aosEls = document.querySelectorAll('.animate-on-scroll');
  var aosObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); aosObserver.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  aosEls.forEach(function(el) { aosObserver.observe(el); });

  /* ── NAV DOTS ── */
  var dots = document.querySelectorAll('.nav-dot');
  var sections = document.querySelectorAll('.section[id]');
  var navContainer = document.getElementById('nav-dots');
  var stickyLogo = document.getElementById('sticky-logo');

  function isSectionDark() {
    return true; /* All sections are now dark theme */
  }

  var secObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !document.body.classList.contains('slideshow-mode')) {
        var id = e.target.id;
        var target = e.target;
        dots.forEach(function(d) {
          d.classList.toggle('is-active', d.dataset.section === id);
        });
        var isDark = isSectionDark(id, target);
        if (isDark) {
          navContainer.classList.add('nav-dots--dark');
          if (stickyLogo) stickyLogo.classList.add('sticky-logo--light');
        } else {
          navContainer.classList.remove('nav-dots--dark');
          if (stickyLogo) stickyLogo.classList.remove('sticky-logo--light');
        }
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(function(s) { secObserver.observe(s); });

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() {
      if (document.body.classList.contains('slideshow-mode')) {
        goToSlide(i);
      } else {
        var t = document.getElementById(dot.dataset.section);
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  if (stickyLogo) {
    stickyLogo.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── KPI COUNTER ANIMATION ── */
  function animateKPI(el) {
    var target = parseInt(el.getAttribute('data-kpi') || '0');
    var format = el.getAttribute('data-format') || 'count';
    var dur = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.floor(eased * target);
      if (format === 'dollar') el.textContent = '$' + val + 'K/mo';
      else if (format === 'count-plus') el.textContent = val + '+';
      else el.textContent = val;
      if (p < 1) requestAnimationFrame(step);
      else {
        if (format === 'dollar') el.textContent = '$' + target + 'K/mo';
        else if (format === 'count-plus') el.textContent = target + '+';
        else el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  var footSec = document.getElementById('section-footprint');
  var kpiCountered = false;
  if (footSec) {
    new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !kpiCountered) {
        kpiCountered = true;
        // Dot grid
        var dotGrid = document.getElementById('fp-dot-grid');
        if (dotGrid) dotGrid.classList.add('is-visible');
        // KPI cards staggered
        setTimeout(function() {
          document.querySelectorAll('.footprint-kpi__number').forEach(function(el, i) {
            setTimeout(function() { animateKPI(el); }, i * 150);
          });
        }, 200);
        // Glowing rule
        setTimeout(function() {
          var rule = document.getElementById('fp-rule');
          if (rule) rule.classList.add('is-visible');
        }, 2200);
      }
    }, { threshold: 0.15 }).observe(footSec);
  }

  /* ── DIGIT SCRAMBLE ON HOVER ── */
  var CHARS = '0123456789';
  document.querySelectorAll('.footprint-kpi__number').forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      var orig = el.textContent;
      var iter = 0;
      var iv = setInterval(function() {
        el.textContent = orig.split('').map(function(ch, i) {
          if (i < iter) return orig[i];
          if (/[0-9]/.test(ch)) return CHARS[Math.floor(Math.random() * CHARS.length)];
          return ch;
        }).join('');
        iter += 0.5;
        if (iter >= orig.length) { clearInterval(iv); el.textContent = orig; }
      }, 35);
    });
  });

  /* ── D3 MAP INIT ── */
  function initFPMap() {
    var svg = document.getElementById('fp-map-svg');
    var statesG = document.getElementById('fp-states');
    var pinsG = document.getElementById('fp-pins');
    var contentG = document.getElementById('fp-content');
    if (!svg || !statesG || !pinsG) return;

    var W = 960, H = 520;

    // Single active set — all 15 states by FIPS id
    var ACTIVE = {'17':1,'55':1,'12':1,'04':1,'08':1,'48':1,'13':1,'01':1,'32':1,'06':1,'42':1,'27':1,'38':1,'56':1,'26':1};

    function isActive(id) {
      var s = String(parseInt(id));
      if (s.length === 1) s = '0' + s;
      return !!ACTIVE[s];
    }

    // Authoritative city dataset — one entry per city, deduplicated from client list.
    // Each city gets one dot on the map. types contains only allowed values:
    // "Law Firm", "Medical Practice", "Franchise"
    var CITIES = [
      // Arizona
      { name:'Scottsdale',        state:'AZ', lat:33.4942, lon:-111.9261, types:['Law Firm'],                   hitR:14, delay:650, clients:['Genesis Family Law','Aurit Mediation'] },
      { name:'Gilbert',           state:'AZ', lat:33.3528, lon:-111.7890, types:['Law Firm'],                   hitR:14, delay:660, clients:['Genesis Family Law','Aurit Mediation'] },
      { name:'Glendale',          state:'AZ', lat:33.5387, lon:-112.1860, types:['Law Firm'],                   hitR:14, delay:670, clients:['Genesis Family Law'] },
      { name:'Show Low',          state:'AZ', lat:34.2542, lon:-110.0298, types:['Law Firm'],                   hitR:14, delay:680, clients:['Genesis Family Law'] },
      { name:'Lake Havasu City',  state:'AZ', lat:34.4839, lon:-114.3225, types:['Law Firm'],                   hitR:14, delay:690, clients:['Genesis Family Law'] },
      { name:'Phoenix',           state:'AZ', lat:33.4484, lon:-112.0740, types:['Law Firm'],                   hitR:14, delay:700, clients:['Arizona Family Law Attorneys','Aurit Mediation'] },
      // Florida
      { name:'Miami',             state:'FL', lat:25.7617, lon:-80.1918,  types:['Law Firm'],                   hitR:14, delay:200, clients:['Vasquez de Lara Law Group','Kalish & Jaggars'] },
      { name:'Coral Gables',      state:'FL', lat:25.7215, lon:-80.2684,  types:['Law Firm'],                   hitR:14, delay:220, clients:['Vasquez de Lara Law Group'] },
      { name:'Miami Lakes',       state:'FL', lat:25.9087, lon:-80.3087,  types:['Law Firm'],                   hitR:14, delay:240, clients:['Vasquez de Lara Law Group'] },
      { name:'Pembroke Pines',    state:'FL', lat:26.0078, lon:-80.2963,  types:['Law Firm'],                   hitR:14, delay:260, clients:['Vasquez de Lara Law Group'] },
      { name:'Fort Lauderdale',   state:'FL', lat:26.1224, lon:-80.1373,  types:['Law Firm'],                   hitR:14, delay:280, clients:['Vasquez de Lara Law Group','Kalish & Jaggars'] },
      { name:'West Palm Beach',   state:'FL', lat:26.7153, lon:-80.0534,  types:['Law Firm'],                   hitR:14, delay:320, clients:['Kalish & Jaggars'] },
      { name:'Tampa',             state:'FL', lat:27.9506, lon:-82.4572,  types:['Law Firm'],                   hitR:14, delay:350, clients:['LaFrance Law'] },
      { name:'Orlando',           state:'FL', lat:28.5383, lon:-81.3792,  types:['Law Firm'],                   hitR:14, delay:400, clients:['Fanash Family Law'] },
      { name:'Jacksonville',      state:'FL', lat:30.3322, lon:-81.6557,  types:['Franchise'],                  hitR:14, delay:440, clients:['College Hunks Hauling Junk & Moving','Stretch Zone'] },
      // Illinois
      { name:'Chicago',           state:'IL', lat:41.8781, lon:-87.6298,  types:['Law Firm'],                   hitR:14, delay:100, clients:['Sterling Lawyers','Johnson Law Group'] },
      { name:'Evanston',          state:'IL', lat:42.0451, lon:-87.6877,  types:['Law Firm'],                   hitR:14, delay:120, clients:['Sterling Lawyers'] },
      { name:'Arlington Heights', state:'IL', lat:42.0884, lon:-87.9806,  types:['Law Firm'],                   hitR:14, delay:140, clients:['Sterling Lawyers'] },
      { name:'Schaumburg',        state:'IL', lat:42.0334, lon:-88.0834,  types:['Law Firm'],                   hitR:14, delay:160, clients:['Sterling Lawyers'] },
      { name:'Hoffman Estates',   state:'IL', lat:42.0629, lon:-88.1227,  types:['Law Firm'],                   hitR:14, delay:180, clients:['Sterling Lawyers'] },
      { name:'Aurora',            state:'IL', lat:41.7606, lon:-88.3201,  types:['Law Firm'],                   hitR:14, delay:200, clients:['Sterling Lawyers'] },
      { name:'Naperville',        state:'IL', lat:41.7508, lon:-88.1535,  types:['Law Firm'],                   hitR:14, delay:220, clients:['Sterling Lawyers'] },
      { name:'Plainfield',        state:'IL', lat:41.6260, lon:-88.2039,  types:['Law Firm'],                   hitR:14, delay:240, clients:['Sterling Lawyers'] },
      { name:'St. Charles',       state:'IL', lat:41.9142, lon:-88.3087,  types:['Law Firm'],                   hitR:14, delay:260, clients:['Sterling Lawyers'] },
      // Wisconsin
      { name:'Kenosha',           state:'WI', lat:42.5847, lon:-87.8212,  types:['Law Firm','Medical Practice'], hitR:14, delay:250, clients:['Sterling Lawyers','NeuroEndo'] },
      { name:'Racine',            state:'WI', lat:42.7261, lon:-87.7829,  types:['Law Firm'],                   hitR:14, delay:270, clients:['Sterling Lawyers'] },
      { name:'Beloit',            state:'WI', lat:42.5083, lon:-89.0318,  types:['Law Firm'],                   hitR:14, delay:310, clients:['Sterling Lawyers'] },
      { name:'Janesville',        state:'WI', lat:42.6828, lon:-89.0187,  types:['Law Firm'],                   hitR:14, delay:300, clients:['Sterling Lawyers'] },
      { name:'Lake Geneva',       state:'WI', lat:42.5917, lon:-88.4334,  types:['Medical Practice'],           hitR:14, delay:330, clients:['NeuroEndo'] },
      { name:'Franklin',          state:'WI', lat:42.8886, lon:-88.0384,  types:['Medical Practice'],           hitR:14, delay:170, clients:['NeuroEndo'] },
      { name:'Milwaukee',         state:'WI', lat:43.0389, lon:-87.9065,  types:['Law Firm'],                   hitR:14, delay:140, clients:['Sterling Lawyers'] },
      { name:'Brookfield',        state:'WI', lat:43.0606, lon:-88.1065,  types:['Law Firm','Medical Practice'], hitR:14, delay:160, clients:['Sterling Lawyers','Quintessa Medical Aesthetics'] },
      { name:'Waukesha',          state:'WI', lat:43.0117, lon:-88.2315,  types:['Law Firm'],                   hitR:14, delay:190, clients:['Sterling Lawyers'] },
      { name:'Delafield',         state:'WI', lat:43.0608, lon:-88.4037,  types:['Medical Practice'],           hitR:14, delay:210, clients:['Quintessa Medical Aesthetics'] },
      { name:'Oconomowoc',        state:'WI', lat:43.1117, lon:-88.4993,  types:['Law Firm'],                   hitR:14, delay:220, clients:['Sterling Lawyers'] },
      { name:'Menomonee Falls',   state:'WI', lat:43.1789, lon:-88.1173,  types:['Law Firm'],                   hitR:14, delay:180, clients:['Sterling Lawyers'] },
      { name:'Mequon',            state:'WI', lat:43.2219, lon:-87.9823,  types:['Law Firm','Medical Practice'], hitR:14, delay:200, clients:['Sterling Lawyers','Quintessa Medical Aesthetics'] },
      { name:'Middleton',         state:'WI', lat:43.0972, lon:-89.5043,  types:['Medical Practice'],           hitR:14, delay:290, clients:['Quintessa Medical Aesthetics'] },
      { name:'Madison',           state:'WI', lat:43.0731, lon:-89.4012,  types:['Law Firm'],                   hitR:14, delay:280, clients:['Sterling Lawyers'] },
      { name:'Sheboygan',         state:'WI', lat:43.7508, lon:-87.7145,  types:['Medical Practice'],           hitR:14, delay:320, clients:['Quintessa Medical Aesthetics'] },
      { name:'West Bend',         state:'WI', lat:43.4253, lon:-88.1834,  types:['Law Firm'],                   hitR:14, delay:240, clients:['Sterling Lawyers'] },
      { name:'Beaver Dam',        state:'WI', lat:43.4578, lon:-88.8373,  types:['Law Firm'],                   hitR:14, delay:340, clients:['Sterling Lawyers'] },
      { name:'Appleton',          state:'WI', lat:44.2619, lon:-88.4154,  types:['Law Firm'],                   hitR:14, delay:360, clients:['Sterling Lawyers'] },
      { name:'Baraboo',           state:'WI', lat:43.4711, lon:-89.7443,  types:['Law Firm'],                   hitR:14, delay:380, clients:['Sterling Lawyers'] },
      { name:'Green Bay',         state:'WI', lat:44.5133, lon:-88.0133,  types:['Law Firm'],                   hitR:14, delay:400, clients:['Sterling Lawyers'] },
      // Texas
      { name:'Houston',           state:'TX', lat:29.7604, lon:-95.3698,  types:['Law Firm'],                   hitR:14, delay:500, clients:['Ramji Law Group'] },
      { name:'Angleton',          state:'TX', lat:29.1694, lon:-95.4319,  types:['Law Firm'],                   hitR:14, delay:510, clients:['Scott M. Brown Law Office'] },
      { name:'Dallas',            state:'TX', lat:32.7767, lon:-96.7970,  types:['Law Firm'],                   hitR:14, delay:520, clients:['Ramji Law Group'] },
      { name:'Tyler',             state:'TX', lat:32.3513, lon:-95.3011,  types:['Law Firm'],                   hitR:14, delay:530, clients:['Ramji Law Group'] },
      { name:'Pearland',          state:'TX', lat:29.5636, lon:-95.2860,  types:['Law Firm'],                   hitR:14, delay:540, clients:['Scott M. Brown Law Office'] },
      { name:'League City',       state:'TX', lat:29.5075, lon:-95.0949,  types:['Law Firm'],                   hitR:14, delay:550, clients:['Scott M. Brown Law Office'] },
      { name:'Rosenberg',         state:'TX', lat:29.5572, lon:-95.8086,  types:['Law Firm'],                   hitR:14, delay:560, clients:['Ramji Law Group'] },
      { name:'Round Rock',        state:'TX', lat:30.5083, lon:-97.6789,  types:['Law Firm'],                   hitR:14, delay:570, clients:['Ramji Law Group'] },
      { name:'McKinney',          state:'TX', lat:33.1976, lon:-96.6153,  types:['Law Firm'],                   hitR:14, delay:580, clients:['Ramage Family Law Firm'] },
      { name:'Frisco',            state:'TX', lat:33.1507, lon:-96.8236,  types:['Law Firm'],                   hitR:14, delay:590, clients:['Ramage Family Law Firm'] },
      { name:'San Antonio',       state:'TX', lat:29.4241, lon:-98.4936,  types:['Law Firm'],                   hitR:14, delay:620, clients:['Ramji Law Group'] },
      { name:'Odessa',            state:'TX', lat:31.8457, lon:-102.3676, types:['Law Firm'],                   hitR:14, delay:640, clients:['Ramji Law Group'] },
      { name:'Midland',           state:'TX', lat:31.9974, lon:-102.0779, types:['Law Firm'],                   hitR:14, delay:650, clients:['Ramji Law Group'] },
      { name:'El Paso',           state:'TX', lat:31.7619, lon:-106.4850, types:['Law Firm'],                   hitR:14, delay:660, clients:['Ramji Law Group'] },
      // Colorado
      { name:'Colorado Springs',  state:'CO', lat:38.8339, lon:-104.8214, types:['Law Firm'],                   hitR:14, delay:710, clients:['Johnson Law Group'] },
      { name:'Englewood',         state:'CO', lat:39.6478, lon:-104.9878, types:['Law Firm'],                   hitR:14, delay:720, clients:['Johnson Law Group'] },
      { name:'Lakewood',          state:'CO', lat:39.7047, lon:-105.0814, types:['Law Firm'],                   hitR:14, delay:730, clients:['The Drake Law Firm'] },
      { name:'Denver',            state:'CO', lat:39.7392, lon:-104.9903, types:['Law Firm'],                   hitR:14, delay:740, clients:['Johnson Law Group'] },
      { name:'Commerce City',     state:'CO', lat:39.8083, lon:-104.9339, types:['Law Firm'],                   hitR:14, delay:750, clients:['Johnson Law Group'] },
      { name:'Golden',            state:'CO', lat:39.7555, lon:-105.2211, types:['Law Firm'],                   hitR:14, delay:760, clients:['The Drake Law Firm'] },
      { name:'Fort Collins',      state:'CO', lat:40.5853, lon:-105.0844, types:['Law Firm'],                   hitR:14, delay:770, clients:['Johnson Law Group'] },
      // Georgia
      { name:'Atlanta',           state:'GA', lat:33.7490, lon:-84.3880,  types:['Law Firm'],                   hitR:14, delay:900, clients:['TDE Family Law','Ramji Law Group'] },
      // Alabama
      { name:'Birmingham',        state:'AL', lat:33.5186, lon:-86.8104,  types:['Law Firm'],                   hitR:14, delay:920, clients:['Summit Family Law'] },
      { name:'Tuscaloosa',        state:'AL', lat:33.2098, lon:-87.5692,  types:['Law Firm'],                   hitR:14, delay:930, clients:['Summit Family Law'] },
      { name:'Florence',          state:'AL', lat:34.7998, lon:-87.6773,  types:['Law Firm'],                   hitR:14, delay:940, clients:['Summit Family Law'] },
      { name:'Athens',            state:'AL', lat:34.8029, lon:-86.9720,  types:['Law Firm'],                   hitR:14, delay:950, clients:['Summit Family Law'] },
      { name:'Huntsville',        state:'AL', lat:34.7304, lon:-86.5861,  types:['Law Firm'],                   hitR:14, delay:960, clients:['Summit Family Law'] },
      // California
      { name:'Modesto',           state:'CA', lat:37.6391, lon:-120.9969, types:['Law Firm'],                   hitR:14, delay:800, clients:['MeyerPink Law'] },
      { name:'Sonora',            state:'CA', lat:37.9841, lon:-120.3821, types:['Law Firm'],                   hitR:14, delay:820, clients:['MeyerPink Law'] },
      { name:'Murphys',           state:'CA', lat:38.1374, lon:-120.4610, types:['Law Firm'],                   hitR:14, delay:840, clients:['MeyerPink Law'] },
      // Nevada
      { name:'Las Vegas',         state:'NV', lat:36.1699, lon:-115.1398, types:['Law Firm'],                   hitR:14, delay:780, clients:['Rosenblum Law'] },
      // Pennsylvania
      { name:'Lancaster',         state:'PA', lat:40.0379, lon:-76.3055,  types:['Law Firm'],                   hitR:14, delay:870, clients:['Lancaster Law Firm'] },
      // Minnesota
      { name:'Moorhead',          state:'MN', lat:46.8739, lon:-96.7678,  types:['Law Firm'],                   hitR:14, delay:290, clients:['Gjesdahl Law'] },
      // North Dakota
      { name:'Fargo',             state:'ND', lat:46.8772, lon:-96.7898,  types:['Law Firm'],                   hitR:14, delay:340, clients:['Gjesdahl Law'] },
      // Wyoming
      { name:'Cheyenne',          state:'WY', lat:41.1400, lon:-104.8202, types:['Law Firm'],                   hitR:14, delay:370, clients:['Johnson Law Group'] },
      // Michigan
      { name:'Bloomfield Hills',  state:'MI', lat:42.5836, lon:-83.2455,  types:['Law Firm'],                   hitR:14, delay:310, clients:['Genesis Family Law'] }
    ];

    // Load D3 + topojson
    if (typeof d3 === 'undefined' || typeof topojson === 'undefined') return;

    // FIXED: reduced scale (1280→1100) to pull map inward and prevent edge clipping;
    // translate shifted down 10px to better vertically center the continental US
    var projection = d3.geoAlbersUsa().scale(1100).translate([W/2, H/2 + 10]);
    var pathGen = d3.geoPath().projection(projection);

    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(function(us) {
      var features = topojson.feature(us, us.objects.states).features;

      // Draw states — base first, then active states on top with glow border
      var baseFeatures = features.filter(function(f) { return !isActive(f.id); });
      var activeFeatures = features.filter(function(f) { return isActive(f.id); });
      baseFeatures.forEach(function(f) {
        var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', pathGen(f) || '');
        p.setAttribute('class', 'fp-state fp-state--base');
        p.setAttribute('data-fips', f.id);
        statesG.appendChild(p);
      });
      activeFeatures.forEach(function(f) {
        var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', pathGen(f) || '');
        p.setAttribute('class', 'fp-state fp-state--base');
        p.setAttribute('data-fips', f.id);
        statesG.appendChild(p);
        setTimeout(function() { p.setAttribute('class', 'fp-state fp-state--active'); }, 600);
      });

      // Draw dots
      var tooltip = document.getElementById('fp-tooltip');
      var ttCity = document.getElementById('fp-tt-city');
      var ttLocs = document.getElementById('fp-tt-locs');

      CITIES.forEach(function(d) {
        var coords = projection([d.lon, d.lat]);
        if (!coords) return;
        var cx = coords[0], cy = coords[1];

        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'fp-dot-group');
        g.setAttribute('transform', 'translate(' + cx + ',' + cy + ')');
        g.setAttribute('data-translate', cx + ',' + cy);
        g.style.opacity = '0';
        g.style.transformOrigin = 'center';
        g.style.transformBox = 'fill-box';

        // Layer 1: Ambient halo
        var halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        halo.setAttribute('r', '14');
        halo.setAttribute('cx', '0');
        halo.setAttribute('cy', '0');
        halo.setAttribute('fill', 'rgba(78,197,191,0.06)');
        halo.setAttribute('filter', 'url(#fp-dot-blur)');
        g.appendChild(halo);

        // Layer 2: Inner glow (pulses)
        var glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('r', '6');
        glow.setAttribute('cx', '0');
        glow.setAttribute('cy', '0');
        glow.setAttribute('fill', 'rgba(78,197,191,0.25)');
        glow.setAttribute('filter', 'url(#fp-dot-blur-sm)');
        glow.style.transformOrigin = 'center';
        glow.style.transformBox = 'fill-box';
        g.appendChild(glow);

        // Layer 3: Core dot (solid, no animation)
        var core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        core.setAttribute('r', '2.5');
        core.setAttribute('cx', '0');
        core.setAttribute('cy', '0');
        core.setAttribute('fill', '#4EC5BF');
        g.appendChild(core);

        pinsG.appendChild(g);

        // Staggered reveal with scale-up
        setTimeout(function() {
          g.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
          g.style.opacity = '1';

          // Desynchronized pulse on glow layer only
          var pulseDur = (2.5 + Math.random() * 2.5).toFixed(2) + 's';
          var pulseDel = (Math.random() * 4).toFixed(2) + 's';
          glow.style.animation = 'dot-pulse ' + pulseDur + ' ease-in-out ' + pulseDel + ' infinite';
        }, d.delay);
      });

      var hitsG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      hitsG.setAttribute('id', 'fp-hits');
      svg.appendChild(hitsG);

      // Build hit regions for hover tooltip
      CITIES.forEach(function(c) {
        var coords = projection([c.lon, c.lat]);
        if (!coords) return;
        var svgX = coords[0], svgY = coords[1];

        // Hit region for hover tooltip
        var hit = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        hit.setAttribute('cx', String(svgX));
        hit.setAttribute('cy', String(svgY));
        hit.setAttribute('r', String(c.hitR));
        hit.setAttribute('fill', 'transparent');
        hit.setAttribute('cursor', 'pointer');
        hitsG.appendChild(hit);

        hit.addEventListener('mouseenter', function() {
          if (!tooltip) return;
          if (ttCity) ttCity.textContent = c.clients.join(' · ');
          if (ttLocs) ttLocs.textContent = c.name + ', ' + c.state;
          // Use current viewport cx/cy (updated by updateHitPositions on zoom)
          var curX = parseFloat(hit.getAttribute('cx'));
          var curY = parseFloat(hit.getAttribute('cy'));
          var ttx = curX + c.hitR + 8;
          var tty = curY - 30;
          if (ttx + 205 > W) ttx = curX - 210; // 200px tooltip + 5px margin / 10px offset
          if (tty < 10) tty = 10;
          tooltip.setAttribute('transform', 'translate(' + ttx + ',' + tty + ')');
          tooltip.style.display = 'block';
        });
        hit.addEventListener('mouseleave', function() {
          if (tooltip) tooltip.style.display = 'none';
        });
      });

      // Also update hit-region positions on zoom so tooltips follow the map
      function updateHitPositions(t) {
        var k = t.k, tx = t.x, ty = t.y;
        var hits = hitsG.querySelectorAll('circle');
        var idx = 0;
        CITIES.forEach(function(c) {
          var coords = projection([c.lon, c.lat]);
          if (!coords) return;
          var vpX = coords[0] * k + tx;
          var vpY = coords[1] * k + ty;
          if (hits[idx]) {
            hits[idx].setAttribute('cx', String(vpX));
            hits[idx].setAttribute('cy', String(vpY));
          }
          idx++;
        });
      }

      // Set up D3 zoom
      var zoom = d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent([[-120, -80], [W + 120, H + 80]])
        .on('zoom', function(event) {
          var t = event.transform;

          // Apply zoom transform to the map content group
          if (contentG) {
            contentG.setAttribute('transform',
              'translate(' + t.x + ',' + t.y + ') scale(' + t.k + ')');
          }

          // Update hit circles and tooltip position to follow zoom
          updateHitPositions(t);

          // Counter-scale dots so they maintain readable size at any zoom level
          // Exponent 0.7 dampens the inverse: dots shrink gradually rather than
          // inversely with zoom, keeping them visible while reducing overlap in clusters
          if (t.k > 1) {
            var dotScale = 1 / Math.pow(t.k, 0.7);
            var dotGroups = pinsG.querySelectorAll('.fp-dot-group');
            for (var i = 0; i < dotGroups.length; i++) {
              var translate = dotGroups[i].getAttribute('data-translate');
              if (translate) {
                dotGroups[i].setAttribute('transform',
                  'translate(' + translate + ') scale(' + dotScale.toFixed(4) + ')');
              }
            }
          }

          // Fade the scroll-to-zoom hint on first interaction
          var hint = document.getElementById('fp-zoom-hint');
          if (hint && !hint.classList.contains('is-hidden')) {
            hint.classList.add('is-hidden');
            setTimeout(function() { hint.style.display = 'none'; }, 900);
          }
        });

      d3.select(svg).call(zoom);

      // Zoom control buttons
      var zoomInBtn = document.getElementById('fp-zoom-in');
      var zoomOutBtn = document.getElementById('fp-zoom-out');
      var zoomResetBtn = document.getElementById('fp-zoom-reset');

      if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function() {
          d3.select(svg).transition().duration(350).call(zoom.scaleBy, 1.6);
        });
      }
      if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function() {
          d3.select(svg).transition().duration(350).call(zoom.scaleBy, 1 / 1.6);
        });
      }
      if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', function() {
          d3.select(svg).transition().duration(600).call(zoom.transform, d3.zoomIdentity);
        });
      }

    }).catch(function(err) {
      console.warn('Map data load failed (network or parse error):', err);
      var mapCtr = document.getElementById('fp-map-container');
      if (mapCtr) {
        var errP = document.createElement('p');
        errP.style.cssText = 'text-align:center;color:var(--dark-text-muted);padding:var(--space-xl);';
        errP.textContent = 'Map unavailable — network connection required.';
        mapCtr.appendChild(errP);
      }
    });
  }

  // Load D3 and topojson dynamically, then init map on footprint section visibility
  var fpMapInited = false;
  function loadAndInitMap() {
    if (fpMapInited) return;
    fpMapInited = true;
    if (typeof d3 !== 'undefined' && typeof topojson !== 'undefined') {
      initFPMap();
      return;
    }
    var d3s = document.createElement('script');
    d3s.src = 'https://d3js.org/d3.v7.min.js';
    d3s.onload = function() {
      var topos = document.createElement('script');
      topos.src = 'https://unpkg.com/topojson-client@3/dist/topojson-client.min.js';
      topos.onload = function() { setTimeout(initFPMap, 100); };
      document.head.appendChild(topos);
    };
    document.head.appendChild(d3s);
  }

  var fpMapCont = document.getElementById('fp-map-container');
  if (fpMapCont) {
    new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) loadAndInitMap();
    }, { threshold: 0.1 }).observe(fpMapCont);
  }

  /* ── REDUCED MOTION OVERRIDE ── */
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.animate-on-scroll').forEach(function(el) { el.classList.add('is-visible'); });
    if (loadingScreen) { loadingScreen.classList.add('is-hidden'); if (particleSys) particleSys.stop(); }
  }

  /* ── SLIDESHOW (DESKTOP ≥769px ONLY) ── */
  var slides = Array.from(document.querySelectorAll('.section[id]'));
  var currentSlide = 0;
  var isAnimating = false;
  var slideshowActive = false;
  var SLIDESHOW_MIN_SCALE = 0.55;

  function triggerSlideAnimations(slide) {
    if (!slide) return;
    var els = slide.querySelectorAll('.animate-on-scroll');
    els.forEach(function(el, i) {
      if (!el.classList.contains('is-visible')) {
        setTimeout(function() { el.classList.add('is-visible'); }, i * 80);
      }
    });
  }

  function updateSlideshowProgressBar() {
    if (bar && slides.length > 1) {
      bar.style.width = (currentSlide / (slides.length - 1) * 100) + '%';
    }
  }

  function updateSlideshowNavDots() {
    var slide = slides[currentSlide];
    dots.forEach(function(d, i) {
      d.classList.toggle('is-active', i === currentSlide);
    });
    if (!slide) return;
    var isDark = isSectionDark(slide.id, slide);
    if (isDark) {
      navContainer.classList.add('nav-dots--dark');
      if (stickyLogo) stickyLogo.classList.add('sticky-logo--light');
    } else {
      navContainer.classList.remove('nav-dots--dark');
      if (stickyLogo) stickyLogo.classList.remove('sticky-logo--light');
    }
  }

  function updateSlideshowArrows() {
    var leftArrow = document.getElementById('slide-arrow-left');
    var rightArrow = document.getElementById('slide-arrow-right');
    if (leftArrow) leftArrow.style.display = currentSlide === 0 ? 'none' : 'flex';
    if (rightArrow) rightArrow.style.display = currentSlide === slides.length - 1 ? 'none' : 'flex';
    // Toggle dark-section arrow styling
    var activeSlide = slides[currentSlide];
    if (activeSlide) {
      var isDarkSlide = isSectionDark(activeSlide.id, activeSlide);
      if (leftArrow) leftArrow.classList.toggle('slide-arrow--on-dark', isDarkSlide);
      if (rightArrow) rightArrow.classList.toggle('slide-arrow--on-dark', isDarkSlide);
    }
  }

  // Sections that use overflow-y: auto scrolling instead of scaling
  var SCROLLABLE_SECTIONS = {
    'section-footprint': true
  };

  function scaleActiveSlide() {
    if (!slideshowActive) return;
    var slide = slides[currentSlide];
    if (!slide) return;
    var inner = slide.querySelector('.section-inner');
    if (!inner) return;
    // Skip scaling for sections that use overflow scrolling
    if (SCROLLABLE_SECTIONS[slide.id]) {
      inner.style.transform = '';
      return;
    }
    // Reset scale so we measure natural height
    inner.style.transform = '';
    var naturalHeight = inner.scrollHeight;
    var available = window.innerHeight;
    if (naturalHeight > available) {
      var factor = available / naturalHeight;
      factor = Math.max(factor, SLIDESHOW_MIN_SCALE);
      inner.style.transform = 'scale(' + factor + ')';
    } else {
      inner.style.transform = '';
    }
  }

  function clearAllScales() {
    slides.forEach(function(slide) {
      var inner = slide.querySelector('.section-inner');
      if (inner) {
        inner.style.transform = '';
      }
    });
  }

  function goToSlide(index) {
    if (!slideshowActive) return;
    if (index < 0 || index >= slides.length || index === currentSlide || isAnimating) return;
    isAnimating = true;

    var prev = currentSlide;
    var next = index;
    var dir = next > prev ? 1 : -1;

    slides[next].classList.remove('slide-active', 'slide-exit-left', 'slide-exit-right');
    slides[next].classList.add(dir > 0 ? 'slide-enter-right' : 'slide-enter-left');

    void slides[next].offsetHeight;

    slides[prev].classList.remove('slide-active');
    slides[prev].classList.add(dir > 0 ? 'slide-exit-left' : 'slide-exit-right');

    slides[next].classList.remove('slide-enter-right', 'slide-enter-left');
    slides[next].classList.add('slide-active');

    currentSlide = next;
    updateSlideshowNavDots();
    updateSlideshowArrows();
    updateSlideshowProgressBar();

    triggerSlideAnimations(slides[next]);

    var footprintSlide = document.getElementById('section-footprint');
    if (slides[next] === footprintSlide) {
      loadAndInitMap();
      if (!kpiCountered) {
        kpiCountered = true;
        var dotGrid = document.getElementById('fp-dot-grid');
        if (dotGrid) dotGrid.classList.add('is-visible');
        setTimeout(function() {
          document.querySelectorAll('.footprint-kpi__number').forEach(function(el, i) {
            setTimeout(function() { animateKPI(el); }, i * 150);
          });
        }, 200);
        setTimeout(function() {
          var rule = document.getElementById('fp-rule');
          if (rule) rule.classList.add('is-visible');
        }, 2200);
      }
    }

    setTimeout(function() {
      isAnimating = false;
      slides.forEach(function(s, i) {
        if (i !== currentSlide) {
          s.classList.remove('slide-exit-left', 'slide-exit-right');
        }
      });
      scaleActiveSlide();
    }, 600);
  }

  function enterSlideshowMode() {
    slideshowActive = true;
    document.body.classList.add('slideshow-mode');
    aosObserver.disconnect();
    secObserver.disconnect();

    slides.forEach(function(slide, i) {
      slide.classList.remove('slide-active', 'slide-exit-left', 'slide-exit-right', 'slide-enter-right', 'slide-enter-left');
      if (i === currentSlide) {
        slide.classList.add('slide-active');
      }
    });

    updateSlideshowNavDots();
    updateSlideshowArrows();
    updateSlideshowProgressBar();
    scaleActiveSlide();
  }

  function exitSlideshowMode() {
    slideshowActive = false;
    document.body.classList.remove('slideshow-mode');
    isAnimating = false;
    clearAllScales();

    slides.forEach(function(slide) {
      slide.classList.remove('slide-active', 'slide-exit-left', 'slide-exit-right', 'slide-enter-right', 'slide-enter-left');
    });

    aosEls.forEach(function(el) {
      if (!el.classList.contains('is-visible')) {
        aosObserver.observe(el);
      }
    });
    sections.forEach(function(s) { secObserver.observe(s); });

    var leftArrow = document.getElementById('slide-arrow-left');
    var rightArrow = document.getElementById('slide-arrow-right');
    if (leftArrow) leftArrow.style.display = 'none';
    if (rightArrow) rightArrow.style.display = 'none';

    if (slides[currentSlide]) {
      slides[currentSlide].scrollIntoView({ behavior: 'auto' });
    }
  }

  function initSlideshow() {
    if (window.innerWidth >= 769) {
      if (!slideshowActive) {
        enterSlideshowMode();
      }
    } else {
      if (slideshowActive) {
        exitSlideshowMode();
      }
    }
  }

  document.addEventListener('keydown', function(e) {
    if (!slideshowActive) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      goToSlide(currentSlide + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      goToSlide(currentSlide - 1);
    }
  });

  var slideArrowLeft = document.getElementById('slide-arrow-left');
  var slideArrowRight = document.getElementById('slide-arrow-right');
  if (slideArrowLeft) {
    slideArrowLeft.addEventListener('click', function() { goToSlide(currentSlide - 1); });
  }
  if (slideArrowRight) {
    slideArrowRight.addEventListener('click', function() { goToSlide(currentSlide + 1); });
  }

  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      initSlideshow();
      if (slideshowActive) {
        scaleActiveSlide();
      }
    }, 200);
  });

  initSlideshow();


})();

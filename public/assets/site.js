// ===== Automonie marketing site, shared scripts =====
(function () {
  // App links: UPDATE `apk` AFTER EVERY ANDROID BUILD.
  // Get the current URL with:  npx eas build:list --platform android --limit 1
  // (look for "Application Archive URL"). Last updated: build 9c65cf4e, 2026-08-31.
  var LINKS = {
    web: 'https://app.automonie.com',
    // iPhone = the installable PWA (open in Safari → Add to Home Screen).
    ios: 'https://app.automonie.com',
    apk: 'https://expo.dev/artifacts/eas/EfqRDk5tNoHrUKpGaYTf_9eHZHGsud3cwMRlohU5C10.apk'
  };
  document.querySelectorAll('[data-app]').forEach(function (el) {
    var t = LINKS[el.getAttribute('data-app')];
    if (t) { el.href = t; el.target = '_blank'; el.rel = 'noopener'; }
  });

  // Mobile nav toggle
  var tg = document.getElementById('navToggle'), lk = document.getElementById('navLinks');
  if (tg && lk) {
    tg.addEventListener('click', function () { lk.classList.toggle('open'); });
    lk.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { lk.classList.remove('open'); });
    });
  }

  // Year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Scroll reveal
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Safety net: if the observer never fires at all (unsupported browser, or a
  // renderer that does not run IntersectionObserver), reveal everything rather
  // than leaving the page blank.
  setTimeout(function () {
    if (!document.querySelector('.reveal.in')) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    }
  }, 3000);

  // ===== Interactive scenes =====
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stages = [].slice.call(document.querySelectorAll('.stage'));

  // 1) Play when scrolled into view; keep playing on hover.
  if (stages.length && 'IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('live', e.isIntersecting); });
    }, { threshold: .35 });
    stages.forEach(function (s) { sio.observe(s); });
  } else {
    stages.forEach(function (s) { s.classList.add('live'); });
  }

  // 2) Cursor parallax: tilt the scene toward the pointer.
  if (!reduce) {
    stages.forEach(function (s) {
      var scene = s.querySelector('.scene');
      if (!scene) return;
      s.addEventListener('mousemove', function (ev) {
        var r = s.getBoundingClientRect();
        var dx = (ev.clientX - r.left) / r.width - .5;
        var dy = (ev.clientY - r.top) / r.height - .5;
        scene.style.setProperty('--ry', (dx * 16).toFixed(2) + 'deg');
        scene.style.setProperty('--rx', (-dy * 12).toFixed(2) + 'deg');
      });
      s.addEventListener('mouseleave', function () {
        scene.style.setProperty('--ry', '0deg');
        scene.style.setProperty('--rx', '0deg');
      });
      // Touch: tap replays the animation.
      s.addEventListener('click', function () {
        s.classList.remove('live');
        void s.offsetWidth;
        s.classList.add('live');
      });
    });
  }

  // 3) Scroll-driven scrub: set --p (0..1) as the element crosses the viewport.
  var scrubs = [].slice.call(document.querySelectorAll('[data-scrub]'));
  if (scrubs.length && !reduce) {
    var tick = function () {
      var vh = window.innerHeight || 800;
      scrubs.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var p = 1 - (r.top - vh * .25) / (vh * .6);
        p = Math.max(0, Math.min(1, p));
        el.style.setProperty('--p', p.toFixed(3));
      });
    };
    var queued = false;
    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { tick(); queued = false; });
    }, { passive: true });
    window.addEventListener('resize', tick);
    tick();
  } else {
    scrubs.forEach(function (el) { el.style.setProperty('--p', '1'); });
  }

  // 4) Live hero phone: count the balance up and slide rows in when visible.
  var phone = document.querySelector('.uiphone');
  if (phone) {
    var balEl = phone.querySelector('[data-count-to]');
    var played = false;
    var run = function () {
      if (played) return;
      played = true;
      phone.classList.add('play');
      if (!balEl || reduce) { if (balEl) balEl.textContent = balEl.getAttribute('data-final'); return; }
      var end = +balEl.getAttribute('data-count-to'), t0 = null;
      var fmt = function (n) { return '₦' + Math.round(n).toLocaleString('en-NG'); };
      var step = function (ts) {
        if (!t0) t0 = ts;
        var k = Math.min((ts - t0) / 1400, 1);
        var eased = 1 - Math.pow(1 - k, 3);
        balEl.textContent = fmt(end * eased);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var pio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { run(); pio.disconnect(); } });
      }, { threshold: .3 });
      pio.observe(phone);
      setTimeout(run, 2500); // fallback if the observer never fires
    } else { run(); }
  }

  // Count-up stats
  var cu = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, end = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '', t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1100, 1);
        el.textContent = Math.round(p * end) + suf;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      cu.unobserve(el);
    });
  }, { threshold: .6 });
  document.querySelectorAll('.num[data-count]').forEach(function (el) { cu.observe(el); });
})();

// ===== Waitlist signup =====
(function () {
  var API = 'https://api.automonie.com';
  var form = document.getElementById('wlForm');
  if (!form) return;
  var email = document.getElementById('wlEmail');
  var phone = document.getElementById('wlPhone');
  var group = document.getElementById('wlGroup');
  var btn = document.getElementById('wlBtn');
  var msg = document.getElementById('wlMsg');
  var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Campaign source: a ?src= param wins (per-event QR tags, e.g. nysc-ikeja), else
  // the form's data-source (per-page default), else 'website'.
  var srcParam = new URLSearchParams(location.search).get('src');
  var source = (srcParam || form.getAttribute('data-source') || 'website').toString().slice(0, 40);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = (email.value || '').trim();
    var ph = (phone && phone.value || '').trim();
    var digits = ph.replace(/[^\d]/g, '');
    if (!reEmail.test(v)) { msg.textContent = 'Please enter a valid email.'; msg.className = 'wl-msg err'; return; }
    if (digits.length < 7) { msg.textContent = 'Please enter your WhatsApp number.'; msg.className = 'wl-msg err'; return; }
    btn.disabled = true; btn.textContent = 'Joining…'; msg.textContent = ''; msg.className = 'wl-msg';
    fetch(API + '/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: v, phone: ph, source: source })
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          msg.textContent = "You're in! Tap below to join our WhatsApp community.";
          if (group && res.d && res.d.groupUrl) { group.href = res.d.groupUrl; group.style.display = 'inline-flex'; }
          msg.className = 'wl-msg';
          btn.textContent = 'Joined \u2713';
        } else {
          msg.textContent = (res.d && res.d.message) || 'Something went wrong. Try again.';
          msg.className = 'wl-msg err';
          btn.disabled = false; btn.textContent = 'Join the waitlist';
        }
      })
      .catch(function () {
        msg.textContent = 'Network error. Please try again.';
        msg.className = 'wl-msg err';
        btn.disabled = false; btn.textContent = 'Join the waitlist';
      });
  });
})();

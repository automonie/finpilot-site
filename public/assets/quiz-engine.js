// Shared, config-driven money-personality quiz engine. Each page defines window.QUIZ
// (archetypes + questions + copy) then loads this file. Pure client-side, no deps.
// Renders into #quizStage; captures a waitlist email; shares a 9:16 image card.
(function () {
  var Q = window.QUIZ;
  if (!Q) return;
  var API = 'https://api.automonie.com';
  var ARCHETYPES = Q.archetypes, PRIORITY = Q.priority, QUESTIONS = Q.questions;
  var EYEBROW = Q.eyebrow || 'YOUR MONEY PERSONALITY';
  var CARD_TAG = Q.cardTag || 'What’s your money personality?';
  var SOURCE = Q.source || 'quiz';
  var SHARE_URL = Q.shareUrl || 'https://automonie.com/quiz';

  var scores = {}, idx = 0, answered = [];
  var el = function (id) { return document.getElementById(id); };
  var stage = el('quizStage');

  function start() { scores = {}; idx = 0; answered = []; PRIORITY.forEach(function (k) { scores[k] = 0; }); renderQuestion(); }

  function renderQuestion() {
    var QU = QUESTIONS[idx]; var pct = Math.round((idx) / QUESTIONS.length * 100); var opts = '';
    QU.a.forEach(function (opt, i) { opts += '<button class="q-opt" data-i="' + i + '" style="animation-delay:' + (80 + i * 70) + 'ms">' + opt.t + '</button>'; });
    stage.innerHTML = '<div class="q-anim"><div class="q-progress"><span style="width:' + pct + '%"></span></div><div class="q-count">Question ' + (idx + 1) + ' of ' + QUESTIONS.length + '</div><h2 class="q-title">' + QU.q + '</h2><div class="q-opts">' + opts + '</div>' + (idx > 0 ? '<button class="q-back" id="qBack">Back</button>' : '') + '</div>';
    stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var os = stage.querySelectorAll('.q-opt');
    for (var j = 0; j < os.length; j++) { os[j].addEventListener('click', function () { pick(this, +this.getAttribute('data-i')); }); }
    var back = el('qBack'); if (back) back.addEventListener('click', goBack);
  }
  function pick(btn, i) { var all = stage.querySelectorAll('.q-opt'); for (var j = 0; j < all.length; j++) all[j].disabled = true; btn.classList.add('sel'); setTimeout(function () { choose(i); }, 280); }
  function choose(i) { var w = QUESTIONS[idx].a[i].w; answered[idx] = w; for (var k in w) scores[k] += w[k]; idx++; if (idx >= QUESTIONS.length) interstitial(); else renderQuestion(); }
  function goBack() { if (idx === 0) return; idx--; var w = answered[idx]; if (w) { for (var k in w) scores[k] -= w[k]; answered[idx] = null; } renderQuestion(); }
  function interstitial() { stage.innerHTML = '<div class="q-anim q-loading"><div class="q-dots"><span></span><span></span><span></span></div><p class="q-loading-text">Reading your spending DNA...</p></div>'; stage.scrollIntoView({ behavior: 'smooth', block: 'start' }); setTimeout(renderResult, 1400); }
  function winner() { var best = PRIORITY[0], bestN = -1; PRIORITY.forEach(function (k) { if (scores[k] > bestN) { bestN = scores[k]; best = k; } }); return best; }

  function renderResult() {
    var A = ARCHETYPES[winner()];
    var artHead = A.img ? '<div class="q-art-wrap r1"><img class="q-art" src="' + A.img + '" alt="' + A.name + '" loading="eager"></div>' : '<div class="q-badge"><svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg></div>';
    stage.innerHTML = '<div class="q-anim q-result" style="--acc:' + A.color + '">' + artHead + '<div class="q-eyebrow r1">' + EYEBROW + '</div><h2 class="q-name r2">' + A.name + '</h2><p class="q-tag r3">' + A.tagline + '</p><p class="q-blurb r4">' + A.blurb + '</p><div class="q-actions r5"><button class="btn-primary" id="qShare">Share my result</button><button class="q-retake" id="qRetake">Retake quiz</button></div><div class="q-capture r6"><p class="q-cap-title">This is just the surface. Automonie reads your real transactions and shows you where your money actually went, free.</p><form id="qForm" class="q-form" novalidate><input id="qEmail" class="q-input" type="email" inputmode="email" autocomplete="email" placeholder="you@email.com" aria-label="Email" required><button class="btn-primary" type="submit" id="qJoin">Get early access</button></form><p class="q-msg" id="qMsg" role="status" aria-live="polite"></p></div></div>';
    stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el('qRetake').addEventListener('click', start);
    el('qShare').addEventListener('click', function () { share(A); });
    el('qForm').addEventListener('submit', function (e) { e.preventDefault(); join(); });
  }

  function shadeCol(hex, amt) { var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; function f(v) { return Math.max(0, Math.min(255, Math.round(v * (1 + amt)))); } return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')'; }
  function wrapCentre(ctx, text, cx, y, maxW, lineH) { var words = text.split(' '), line = '', lines = [], i, t; for (i = 0; i < words.length; i++) { t = line ? line + ' ' + words[i] : words[i]; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = words[i]; } else line = t; } if (line) lines.push(line); for (i = 0; i < lines.length; i++) ctx.fillText(lines[i], cx, y + i * lineH); return y + lines.length * lineH; }
  function loadImg(src) { return new Promise(function (res) { if (!src) { res(null); return; } var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { res(null); }; im.src = src; }); }
  function roundRectPath(x, ix, iy, w, h, r) { x.beginPath(); x.moveTo(ix + r, iy); x.arcTo(ix + w, iy, ix + w, iy + h, r); x.arcTo(ix + w, iy + h, ix, iy + h, r); x.arcTo(ix, iy + h, ix, iy, r); x.arcTo(ix, iy, ix + w, iy, r); x.closePath(); }
  function renderCard(A) {
    var fontsReady = (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve());
    return Promise.all([fontsReady, loadImg(A.img)]).then(function (arr) {
      var img = arr[1];
      var W = 1080, H = 1920, c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d');
      var g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, A.color); g.addColorStop(1, shadeCol(A.color, -0.55)); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.textAlign = 'left'; x.fillStyle = 'rgba(255,255,255,0.96)'; x.font = '700 54px Poppins, Arial, sans-serif'; x.fillText('automonie', 90, 150);
      x.fillStyle = 'rgba(255,255,255,0.82)'; x.font = '700 32px Poppins, Arial, sans-serif'; x.fillText(EYEBROW, 92, 206);
      var y;
      if (img) {
        var iw = 904, ih = Math.round(iw * img.height / img.width), ix = (W - iw) / 2, iy = 270;
        if (iy + ih > 1440) { ih = 1170; iw = Math.round(ih * img.width / img.height); ix = (W - iw) / 2; }
        x.save(); roundRectPath(x, ix, iy, iw, ih, 40); x.clip(); x.drawImage(img, ix, iy, iw, ih); x.restore();
        y = iy + ih + 72; x.textAlign = 'center';
      } else {
        x.textAlign = 'center';
        x.beginPath(); x.arc(W / 2, 470, 120, 0, 7); x.fillStyle = 'rgba(255,255,255,0.18)'; x.fill();
        x.strokeStyle = '#fff'; x.lineWidth = 12; x.lineCap = 'round'; x.lineJoin = 'round';
        x.beginPath(); x.arc(W / 2, 442, 44, 0, 7); x.stroke();
        x.beginPath(); x.moveTo(W / 2 - 72, 562); x.quadraticCurveTo(W / 2, 468, W / 2 + 72, 562); x.stroke();
        x.fillStyle = 'rgba(255,255,255,0.82)'; x.font = '700 36px Poppins, Arial, sans-serif'; x.fillText(EYEBROW, W / 2, 710);
        x.fillStyle = '#fff'; x.font = '700 104px Poppins, Arial, sans-serif';
        y = wrapCentre(x, A.name, W / 2, 830, W - 192, 116) + 46;
      }
      x.font = '600 46px Poppins, Arial, sans-serif'; x.fillStyle = 'rgba(255,255,255,0.95)';
      wrapCentre(x, '“' + A.tagline + '”', W / 2, y, W - 200, 60);
      x.font = '700 42px Poppins, Arial, sans-serif'; x.fillStyle = 'rgba(255,255,255,0.9)'; x.fillText(CARD_TAG, W / 2, H - 150);
      x.font = '700 46px Poppins, Arial, sans-serif'; x.fillStyle = '#fff'; x.fillText('Take the free quiz → automonie.com', W / 2, H - 86);
      return new Promise(function (res) { c.toBlob(function (b) { res(b); }, 'image/png', 0.95); });
    });
  }

  function share(A) {
    var msg = 'My result: ' + A.name + '. "' + A.tagline + '"\n\nWhat’s yours? Take the free Automonie quiz → ' + SHARE_URL;
    var btn = el('qShare'), prev = btn.textContent;
    btn.textContent = 'Creating…';
    renderCard(A).then(function (blob) {
      var file = new File([blob], 'automonie-result.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file], text: msg, title: 'My Automonie result' }).then(function () { btn.textContent = prev; });
      }
      var url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = file.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
      try { navigator.clipboard.writeText(msg); } catch (e) {}
      btn.textContent = 'Saved image ✓'; setTimeout(function () { btn.textContent = prev; }, 2200);
    }).catch(function () {
      btn.textContent = prev;
      if (navigator.share) { navigator.share({ title: 'My Automonie result', text: msg }).catch(function () {}); }
      else { try { navigator.clipboard.writeText(msg); } catch (e) { window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank'); } }
    });
  }

  function join() {
    var email = el('qEmail'), msg = el('qMsg'), btn = el('qJoin'); var v = (email.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { msg.textContent = 'Please enter a valid email.'; msg.className = 'q-msg err'; return; }
    btn.disabled = true; btn.textContent = 'Joining...'; msg.textContent = ''; msg.className = 'q-msg';
    fetch(API + '/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: v, source: SOURCE }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) { if (res.ok) { el('qForm').reset(); msg.textContent = "You're on the list! We'll email you at launch."; msg.className = 'q-msg'; btn.textContent = 'Joined'; } else { msg.textContent = (res.d && res.d.message) || 'Something went wrong.'; msg.className = 'q-msg err'; btn.disabled = false; btn.textContent = 'Get early access'; } })
      .catch(function () { msg.textContent = 'Network error. Please try again.'; msg.className = 'q-msg err'; btn.disabled = false; btn.textContent = 'Get early access'; });
  }

  if (stage) start();
})();

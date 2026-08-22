// Automonie Money Personality Quiz — maps 7 answers to one of the 8 spending
// archetypes (mirrors finpilot-mobile/src/lib/archetype.ts). Pure client-side,
// no dependency. Captures a waitlist email at the end.
(function () {
  var API = 'https://api.automonie.com';

  // The 8 archetypes. Priority order = tie-break (most distinctive first),
  // matching the app.
  var ARCHETYPES = {
    ghost:     { name: 'The Ghost Spender',        color: '#6b7280', tagline: 'Money enter, money disappear. No receipts, no memory.', blurb: 'Most of your money vanishes into transfers and untracked cash. You are not broke — you are just haunted by spending you never see.' },
    detonator: { name: 'The Last-Week Detonator',  color: '#ef4444', tagline: 'Three weeks of discipline, then the last week undid all of it.', blurb: 'You hold it together for most of the month, then the final seven days detonate the budget. The damage is always late, never early.' },
    subs:      { name: 'The Subscription Collector',color: '#8b5cf6', tagline: 'You are funding apps you forgot you married.', blurb: 'Small recurring charges have quietly formed a committee that meets monthly to remove your money. Half of them you have not opened in months.' },
    ajo:       { name: 'The Ajo Loyalist',          color: '#0ea5e9', tagline: 'Discipline na your middle name. Small small, consistently.', blurb: 'You put money away before you spend, every single time. Slow, steady, unbothered — the tortoise that quietly wins.' },
    softlife:  { name: 'The Soft-Life Economist',   color: '#f59e0b', tagline: 'Soft life, but the numbers still add up. Enjoyment with sense.', blurb: 'You enjoy the finer things and still finish the month in the green. Treats, yes — but calculated treats.' },
    sapa:      { name: 'The Sapa Survivor',         color: '#f97316', tagline: 'You stretched the last change into a full week. Legend.', blurb: 'More goes out than comes in, and yet you survive on pure strategy. Every naira is doing overtime.' },
    detty:     { name: 'The Detty Prophet',         color: '#ec4899', tagline: 'You planned to save. You spent. No regrets, prophet.', blurb: 'Nearly everything that lands goes right back out — and you enjoyed every bit of it. The vibes were, respectfully, immaculate.' },
    steady:    { name: 'The Steady Hand',           color: '#14b8a6', tagline: 'No drama, no chaos — just a balanced month.', blurb: 'Your spending is spread out and under control. No plot twists, no panic. Quietly, consistently winning.' },
  };
  var PRIORITY = ['ghost', 'detonator', 'subs', 'ajo', 'softlife', 'sapa', 'detty', 'steady'];

  var QUESTIONS = [
    { q: "It's the end of the month. Where did your money actually go?", a: [
      { t: "Honestly? No idea. It just… vanished.", w: { ghost: 2 } },
      { t: "The last week did most of the damage.", w: { detonator: 2 } },
      { t: "Subscriptions and small charges, everywhere.", w: { subs: 2 } },
      { t: "I saved a good chunk before I spent anything.", w: { ajo: 2 } },
    ] },
    { q: 'Your salary just landed. First move?', a: [
      { t: 'Move part to savings immediately.', w: { ajo: 2 } },
      { t: 'Treat myself — I earned it.', w: { detty: 2, softlife: 1 } },
      { t: 'Clear the debts and transfers I owe.', w: { sapa: 1, ghost: 1 } },
      { t: 'Nothing dramatic — carry on as normal.', w: { steady: 2 } },
    ] },
    { q: 'How many subscriptions are you paying for right now?', a: [
      { t: "I genuinely don't know.", w: { subs: 2, ghost: 1 } },
      { t: 'Four or more, and I use maybe two.', w: { subs: 2 } },
      { t: 'One or two, deliberate.', w: { steady: 1, ajo: 1 } },
      { t: 'Zero. I cancel fast.', w: { sapa: 1, steady: 1 } },
    ] },
    { q: "What's your usual spending rhythm?", a: [
      { t: 'Calm all month, then chaos in the last week.', w: { detonator: 2 } },
      { t: 'Steady and spread out.', w: { steady: 2 } },
      { t: 'Big treats whenever the vibe is right.', w: { softlife: 2, detty: 1 } },
      { t: "Bare minimum — I'm surviving.", w: { sapa: 2 } },
    ] },
    { q: "Where does most of your 'fun' money go?", a: [
      { t: 'Eating out, delivery, the good life.', w: { softlife: 2, detty: 1 } },
      { t: 'Nights out, betting, entertainment.', w: { detty: 2 } },
      { t: "I don't really have fun money.", w: { sapa: 2, ajo: 1 } },
      { t: "Transfers I can't even trace later.", w: { ghost: 2 } },
    ] },
    { q: 'By the 25th of the month, you are usually…', a: [
      { t: 'Still comfortable.', w: { steady: 1, ajo: 1 } },
      { t: 'Counting coins, planning survival.', w: { sapa: 2 } },
      { t: 'Wondering where it all went.', w: { ghost: 2, detonator: 1 } },
      { t: 'Fine — I front-loaded my savings.', w: { ajo: 2 } },
    ] },
    { q: 'Pick the line that stings the most (because it’s true):', a: [
      { t: '"Money enter, money disappear."', w: { ghost: 2 } },
      { t: '"Three weeks calm, then hold my drink."', w: { detonator: 2 } },
      { t: '"Funding apps I forgot I married."', w: { subs: 2 } },
      { t: '"Soft life, but the numbers still add up."', w: { softlife: 2 } },
    ] },
  ];

  var scores = {};
  var idx = 0;
  var answered = [];

  var el = function (id) { return document.getElementById(id); };
  var stage = el('quizStage');

  function start() {
    scores = {}; idx = 0; answered = [];
    PRIORITY.forEach(function (k) { scores[k] = 0; });
    renderQuestion();
  }

  function renderQuestion() {
    var Q = QUESTIONS[idx];
    var pct = Math.round((idx) / QUESTIONS.length * 100);
    var html = '<div class="q-progress"><span style="width:' + pct + '%"></span></div>' +
      '<div class="q-count">Question ' + (idx + 1) + ' of ' + QUESTIONS.length + '</div>' +
      '<h2 class="q-title">' + Q.q + '</h2><div class="q-opts">';
    Q.a.forEach(function (opt, i) {
      html += '<button class="q-opt" data-i="' + i + '">' + opt.t + '</button>';
    });
    html += '</div>';
    if (idx > 0) html += '<button class="q-back" id="qBack">← Back</button>';
    stage.innerHTML = html;
    stage.scrollIntoView({ behavior: 'smooth', block: 'start' });

    var opts = stage.querySelectorAll('.q-opt');
    for (var j = 0; j < opts.length; j++) {
      opts[j].addEventListener('click', function () { choose(+this.getAttribute('data-i')); });
    }
    var back = el('qBack');
    if (back) back.addEventListener('click', goBack);
  }

  function choose(i) {
    var w = QUESTIONS[idx].a[i].w;
    answered[idx] = w;
    for (var k in w) scores[k] += w[k];
    idx++;
    if (idx >= QUESTIONS.length) renderResult(); else renderQuestion();
  }

  function goBack() {
    if (idx === 0) return;
    idx--;
    var w = answered[idx];
    if (w) { for (var k in w) scores[k] -= w[k]; answered[idx] = null; }
    renderQuestion();
  }

  function winner() {
    var best = PRIORITY[0], bestN = -1;
    PRIORITY.forEach(function (k) { if (scores[k] > bestN) { bestN = scores[k]; best = k; } });
    return best;
  }

  function renderResult() {
    var key = winner();
    var A = ARCHETYPES[key];
    var html = '<div class="q-result" style="--acc:' + A.color + '">' +
      '<div class="q-badge"><svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg></div>' +
      '<div class="q-eyebrow">Your money personality</div>' +
      '<h2 class="q-name">' + A.name + '</h2>' +
      '<p class="q-tag">' + A.tagline + '</p>' +
      '<p class="q-blurb">' + A.blurb + '</p>' +
      '<div class="q-actions">' +
        '<button class="btn btn-primary" id="qShare">Share my result</button>' +
        '<button class="q-retake" id="qRetake">Retake quiz</button>' +
      '</div>' +
      '<div class="q-capture">' +
        '<p class="q-cap-title">This is just the surface. Automonie reads your real transactions and shows you where your money actually went — free.</p>' +
        '<form id="qForm" class="q-form" novalidate>' +
          '<input id="qEmail" class="q-input" type="email" inputmode="email" autocomplete="email" placeholder="you@email.com" aria-label="Email" required>' +
          '<button class="btn btn-primary" type="submit" id="qJoin">Get early access</button>' +
        '</form>' +
        '<p class="q-msg" id="qMsg" role="status" aria-live="polite"></p>' +
      '</div>' +
    '</div>';
    stage.innerHTML = html;
    stage.scrollIntoView({ behavior: 'smooth', block: 'start' });

    el('qRetake').addEventListener('click', start);
    el('qShare').addEventListener('click', function () { share(A); });
    el('qForm').addEventListener('submit', function (e) { e.preventDefault(); join(); });
  }

  function share(A) {
    var text = 'I’m ' + A.name + ' — "' + A.tagline + '"\nWhat’s your money personality? Take the Automonie quiz:';
    var url = 'https://automonie.com/quiz.html';
    if (navigator.share) { navigator.share({ title: 'My Automonie money personality', text: text, url: url }).catch(function () {}); return; }
    var btn = el('qShare');
    try {
      navigator.clipboard.writeText(text + ' ' + url);
      var prev = btn.textContent; btn.textContent = 'Copied!'; setTimeout(function () { btn.textContent = prev; }, 1600);
    } catch (e) { window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank'); }
  }

  function join() {
    var email = el('qEmail'), msg = el('qMsg'), btn = el('qJoin');
    var v = (email.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { msg.textContent = 'Please enter a valid email.'; msg.className = 'q-msg err'; return; }
    btn.disabled = true; btn.textContent = 'Joining…'; msg.textContent = ''; msg.className = 'q-msg';
    fetch(API + '/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: v, source: 'quiz' }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (res.ok) {
          el('qForm').reset();
          msg.textContent = "You're on the list! We'll email you at launch.";
          msg.className = 'q-msg';
          btn.textContent = 'Joined ✓';
        } else { msg.textContent = (res.d && res.d.message) || 'Something went wrong.'; msg.className = 'q-msg err'; btn.disabled = false; btn.textContent = 'Get early access'; }
      })
      .catch(function () { msg.textContent = 'Network error. Please try again.'; msg.className = 'q-msg err'; btn.disabled = false; btn.textContent = 'Get early access'; });
  }

  if (stage) start();
})();

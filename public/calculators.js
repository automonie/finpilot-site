// Automonie free tools — the Naira Budget Calculator and the Lagos/Abuja
// Cost-of-Living Calculator. Pure client-side, no dependency. Each runs only if
// its root element is on the page.
(function () {
  var naira = function (n) { return '₦' + Math.round(n || 0).toLocaleString('en-NG'); };
  var num = function (v) { return parseFloat(String(v || '').replace(/[^0-9.]/g, '')) || 0; };
  var el = function (id) { return document.getElementById(id); };

  // ---- Budget calculator (50/30/20, adjustable savings rate) ----
  (function budget() {
    var root = el('budgetCalc');
    if (!root) return;
    var income = el('income'), pct = el('savePct'), pctLabel = el('savePctLabel');
    var out = el('budgetOut');
    function render() {
      var inc = num(income.value);
      var p = (+pct.value) / 100;
      pctLabel.textContent = (+pct.value) + '%';
      if (inc <= 0) { out.style.display = 'none'; return; }
      out.style.display = 'block';
      var save = inc * p, rest = inc - save;
      var needs = rest * 5 / 8, wants = rest * 3 / 8;
      var pctOf = function (x) { return (x / inc * 100).toFixed(0) + '%'; };
      el('saveHeadline').innerHTML = 'On <strong>' + naira(inc) + '</strong>/month, aim to put away <strong>' + naira(save) + '</strong> (' + (+pct.value) + '%) before you spend a naira.';
      el('needsAmt').textContent = naira(needs);
      el('wantsAmt').textContent = naira(wants);
      el('saveAmt').textContent = naira(save);
      el('needsPct').textContent = pctOf(needs);
      el('wantsPct').textContent = pctOf(wants);
      el('savePctOut').textContent = pctOf(save);
      el('barNeeds').style.width = pctOf(needs);
      el('barWants').style.width = pctOf(wants);
      el('barSave').style.width = pctOf(save);
    }
    income.addEventListener('input', render);
    pct.addEventListener('input', render);
    render();
  })();

  // ---- Cost-of-living calculator (Lagos / Abuja, editable estimates) ----
  (function col() {
    var root = el('colCalc');
    if (!root) return;
    var city = el('colCity'), life = el('colLife'), house = el('colHouse');
    var cats = ['Rent', 'Food', 'Transport', 'Util', 'Health', 'Misc'];
    var base = { Rent: 150000, Food: 80000, Transport: 40000, Util: 25000, Health: 15000, Misc: 40000 };
    var cityF = { lagos: 1.0, abuja: 1.05, other: 0.7 };
    var lifeF = { lean: 0.7, moderate: 1.0, comfortable: 1.6 };
    var houseF = { single: 1.0, couple: 1.5, family: 2.3 };
    function fillDefaults() {
      var f = cityF[city.value] * lifeF[life.value] * houseF[house.value];
      cats.forEach(function (c) { el('col' + c).value = Math.round(base[c] * f / 1000) * 1000; });
      recalc();
    }
    function recalc() {
      var total = 0;
      cats.forEach(function (c) { total += num(el('col' + c).value); });
      el('colTotal').textContent = naira(total);
      el('colYear').textContent = naira(total * 12) + ' / year';
    }
    [city, life, house].forEach(function (s) { s.addEventListener('change', fillDefaults); });
    cats.forEach(function (c) { el('col' + c).addEventListener('input', recalc); });
    var reset = el('colReset');
    if (reset) reset.addEventListener('click', fillDefaults);
    fillDefaults();
  })();
})();

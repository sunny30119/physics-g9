/* ===== 分頁 2：功率 =====
   ① 功率賽跑：兩條跑道＋下方 W–t 圖（斜率＝功率）
   ② 爬樓梯功率計算器
   ③ 家電功率表 */
(() => {
  const cv = document.getElementById('c3race'); if (!cv) return;
  const S = stage(cv, 760, 340), ctx = S.ctx;
  const R = id => bindRange(id, null, reset);
  const L = [
    { k: '🅰', F: R('c3pFA'), S: R('c3pSA'), T: R('c3pTA'), y: 62, color: '#C8682A' },
    { k: '🅱', F: R('c3pFB'), S: R('c3pSB'), T: R('c3pTB'), y: 142, color: '#2F5D8C' },
  ];
  [['c3pFA', 'c3pFB', ' N'], ['c3pSA', 'c3pSB', ' m'], ['c3pTA', 'c3pTB', ' 秒']].forEach(([a, b, u]) => [a, b].forEach(id => {
    const el = document.getElementById(id), out = $(`output[for="${id}"]`);
    const f = () => out.textContent = el.value + u; el.addEventListener('input', f); f();
  }));
  let t = 0, run = false;
  const val = l => ({ F: +l.F.value, S: +l.S.value, T: +l.T.value });
  const tMax = () => Math.max(...L.map(l => val(l).T));
  function reset() { run = false; t = 0; draw(); info(); }
  function step(dt) {
    if (!run) return;
    t += dt * tMax() / 5;          // 不管多少秒，都用 5 秒播完
    if (t >= tMax()) { t = tMax(); run = false; }
    draw(); info();
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const X0 = 60, X1 = 720;
    const sMax = Math.max(...L.map(l => val(l).S));
    label(ctx, `⏱ 經過 ${fmt(t, 1)} 秒`, S.W - 12, 16, { align: 'right', size: 14, bold: true, bg: '#FFF3E0' });
    L.forEach(l => {
      const v = val(l), frac = Math.min(1, t / v.T);
      ground(ctx, X0 - 20, X1 + 20, l.y + 22);
      const x = X0 + (X1 - X0) * (v.S / sMax) * frac;
      ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = l.color; ctx.beginPath();
      const xe = X0 + (X1 - X0) * (v.S / sMax); ctx.moveTo(xe, l.y - 26); ctx.lineTo(xe, l.y + 22); ctx.stroke(); ctx.restore();
      label(ctx, `終點 ${v.S} m`, xe, l.y - 32, { align: 'center', size: 12, color: l.color });
      box(ctx, x - 20, l.y - 18, 40, 40, l.color, l.k.replace(/🅰/, 'A').replace(/🅱/, 'B'));
      if (frac < 1) arrow(ctx, x - 20 - 14 - v.F * 2, l.y + 2, x - 22, l.y + 2, '#D32F2F', 3, 10);
      label(ctx, `${v.F} N`, x - 40 - v.F, l.y - 22, { align: 'center', size: 12, color: '#D32F2F', bold: true });
    });
    // W–t 圖
    const gx = 60, gy = 320, gw = 640, gh = 115;
    const Wmax = Math.max(...L.map(l => val(l).F * val(l).S)) * 1.1, Tm = tMax();
    arrow(ctx, gx, gy, gx + gw + 20, gy, '#333', 1.5, 8); arrow(ctx, gx, gy, gx, gy - gh - 15, '#333', 1.5, 8);
    label(ctx, '時間（秒）', gx + gw + 20, gy - 10, { align: 'right', size: 12 });
    label(ctx, '已作的功（J）', gx + 6, gy - gh - 12, { size: 12 });
    L.forEach(l => {
      const v = val(l), W = v.F * v.S;
      ctx.strokeStyle = l.color; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(gx, gy);
      const tt = Math.min(t, v.T);
      ctx.lineTo(gx + gw * tt / Tm, gy - gh * (W * tt / v.T) / Wmax);
      if (t > v.T) ctx.lineTo(gx + gw * t / Tm, gy - gh * W / Wmax);
      ctx.stroke();
      if (t > 0) label(ctx, `${l.k} ${fmt(W * tt / v.T, 1)} J`, gx + gw * Math.min(t, Tm) / Tm + 6, gy - gh * (W * tt / v.T) / Wmax - (l.k === '🅰' ? 8 : -8), { size: 12, color: l.color, bold: true });
    });
  }
  function info() {
    const r = L.map(l => { const v = val(l); return { ...v, W: v.F * v.S, P: v.F * v.S / v.T }; });
    document.getElementById('c3raceR').innerHTML = r.map((x, i) => `
      <div><span>${L[i].k} 功 W＝F×S</span><b>${x.F}×${x.S}＝${x.W} J</b></div>
      <div><span>${L[i].k} 功率 P＝W÷t</span><b>${x.W}÷${x.T}＝${fmt(x.P, 2)} W</b></div>`).join('');
    const [a, b] = r;
    let s;
    if (a.W === b.W) s = `兩人作的功<b>一樣多</b>（${a.W} J），但 ${a.P > b.P ? '🅰' : a.P < b.P ? '🅱' : '兩人'}${a.P === b.P ? '功率也一樣' : '花的時間比較短，<b>功率比較大</b>'}。`;
    else s = `${a.W > b.W ? '🅰' : '🅱'} 作的功比較多；${a.P > b.P ? '🅰' : a.P < b.P ? '🅱' : '兩人'} 的功率比較大${(a.W > b.W) !== (a.P > b.P) && a.P !== b.P ? '——<b>作功多的不一定功率大！</b>' : '。'}`;
    document.getElementById('c3raceTxt').innerHTML = s;
  }
  document.getElementById('c3raceGo').onclick = () => { t = 0; run = true; };
  $$('#c3racePre .chip').forEach(c => c.onclick = () => {
    const p = c.dataset.p.split(',');
    ['c3pFA', 'c3pSA', 'c3pTA', 'c3pFB', 'c3pSB', 'c3pTB'].forEach((id, i) => { const e = document.getElementById(id); e.value = p[i]; e.dispatchEvent(new Event('input')); });
    $$('#c3racePre .chip').forEach(x => x.classList.toggle('on', x === c));
    t = 0; run = true;
  });
  const lp = loop(step);
  registerSim('t2', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- 爬樓梯功率＋家電表 ---------- */
(() => {
  const m = document.getElementById('c3stM'); if (!m) return;
  let myP = 300;
  const upd = () => {
    const M = +m.value, H = +h.value, T = +tt.value;
    const W = M * G * H, P = W / T; myP = P;
    document.getElementById('c3stR').innerHTML = `
      <div><span>體重 F＝m×g</span><b>${fmt(M * G, 0)} N</b></div>
      <div><span>功 W＝F×h</span><b>${fmt(W, 0)} J</b></div>
      <div><span>功率 P＝W÷t</span><b>${fmt(P, 0)} W</b></div>
      <div><span>換成馬力</span><b>${fmt(P / 746, 2)} 匹</b></div>`;
    document.getElementById('c3stTxt').innerHTML = P > 746
      ? `哇！你短時間輸出超過 1 馬力。不過你能維持多久呢？`
      : `你的功率約是 1 匹馬的 ${fmt(P / 746 * 100, 0)}%。`;
    appl();
  };
  const h = bindRange('c3stH', v => v + ' m', upd), tt = bindRange('c3stT', v => v + ' 秒', upd);
  bindRange('c3stM', v => v + ' kg', upd);
  const LIST = [['LED 燈泡', 10], ['手機充電器', 20], ['電風扇', 45], ['冰箱', 130], ['電視', 140], ['電鍋', 700], ['吹風機', 800], ['冷氣', 900], ['1 馬力', 746], ['機車引擎（125 cc，約）', 8000], ['小客車引擎（約）', 100000]];
  function appl() {
    document.getElementById('c3appl').innerHTML = LIST.sort((a, b) => a[1] - b[1]).map(([n, w]) =>
      `<tr><td>${n}</td><td>${w >= 1000 ? fmt(w / 1000, 1) + ' 千瓦（' + w.toLocaleString() + ' W）' : w + ' W'}</td><td>${w / myP < 1 ? '約 ' + fmt(w / myP, 2) + ' 個' : '約 ' + fmt(w / myP, w / myP < 10 ? 1 : 0) + ' 個'}</td></tr>`).join('');
  }
  onG(upd);
  upd();
})();

/* ---------- 臺北 101 案例跟著 g 值變 ---------- */
onG(g => { const e = document.getElementById('c3e101'); if (e) e.textContent = (Math.round(3000 * g * 382 / 37 / 1000) * 1000).toLocaleString(); });

/* ===== 分頁 2：週期波的特徵 ===== */

/* 畫一條正弦曲線：x 從 xa 到 xb，y = yc - amp*sin(k(x - x0)) */
function sine(ctx, xa, xb, yc, amp, lam, ph = 0, color = '#1565C0', w = 3) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath();
  for (let x = xa; x <= xb + 0.1; x += 2) { const y = yc - amp * Math.sin(2 * Math.PI * (x - xa) / lam + ph); x === xa ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
  ctx.stroke(); ctx.restore();
}
/* 量尺寸用的雙箭頭＋文字 */
function dim(ctx, x1, y1, x2, y2, txt, color = '#C62828', side = 'top') {
  arrow(ctx, (x1 + x2) / 2, (y1 + y2) / 2, x1, y1, color, 2, 9); arrow(ctx, (x1 + x2) / 2, (y1 + y2) / 2, x2, y2, color, 2, 9);
  const vert = Math.abs(x2 - x1) < 2;
  label(ctx, txt, vert ? x1 + 8 : (x1 + x2) / 2, vert ? (y1 + y2) / 2 : (y1 + y2) / 2 + (side === 'top' ? -13 : 13), { align: vert ? 'left' : 'center', size: 13, bold: true, color, bg: 'rgba(255,255,255,.85)' });
}

/* ---------- ① 名詞圖解 ---------- */
(() => {
  const cv = document.getElementById('w2terms'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const X0 = 40, LAM = 220, AMP = 50, YC = 92, YL = 240;
  let key = '';
  const TXT = {
    crest: '<b>波峰</b>：波形的最高點。', trough: '<b>波谷</b>：波形的最低點。',
    eq: '<b>平衡位置</b>：沒有波通過時，介質原本所在的位置（虛線）。',
    amp: '<b>振幅</b>：介質由平衡位置偏移到波峰（或波谷）的垂直距離。手擺動的力量大小會影響振幅。',
    lam: '<b>波長 λ</b>（lambda）：一個全波的長度＝相鄰兩波峰的距離＝相鄰兩波谷的距離＝兩個相同對應位置的距離。',
    full: '<b>一個全波</b>：波源振動一次，產生一個波峰和一個波谷，稱為一個全波。',
    dense: '縱波沒有波峰、波谷，而是<b>密部</b>（介質擠在一起）和<b>疏部</b>（介質散開）。相鄰兩密部（或兩疏部）的距離也是一個<b>波長</b>。上面橫波的波峰，對應下面縱波的密部位置（這是一種常見的對照畫法）。',
    err: '⚠ <b>常見錯誤</b>：① 把「波峰到波谷的高度」當成振幅——那是振幅的 <b>2 倍</b>。② 把「波峰到相鄰波谷的距離」當成波長——那只有<b>半個波長</b>。',
  };
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = key === 'eq' ? '#C62828' : '#90A4AE'; ctx.lineWidth = key === 'eq' ? 2.5 : 1.5;
    ctx.beginPath(); ctx.moveTo(X0 - 10, YC); ctx.lineTo(S.W - 20, YC); ctx.stroke(); ctx.restore();
    if (key === 'eq') label(ctx, '平衡位置', S.W - 24, YC - 12, { align: 'right', size: 13, bold: true, color: '#C62828' });
    if (key === 'full') { ctx.fillStyle = 'rgba(255,193,7,.25)'; ctx.fillRect(X0, YC - AMP - 8, LAM, AMP * 2 + 16); label(ctx, '一個全波', X0 + LAM / 2, YC + AMP + 22, { align: 'center', size: 13, bold: true, color: '#8D6E00' }); }
    sine(ctx, X0, X0 + LAM * 3.1, YC, AMP, LAM);
    label(ctx, '橫波', 10, 20, { size: 13, bold: true, color: '#1565C0' });
    // 標記
    const crests = [X0 + LAM / 4, X0 + LAM * 5 / 4, X0 + LAM * 9 / 4], troughs = [X0 + LAM * 3 / 4, X0 + LAM * 7 / 4, X0 + LAM * 11 / 4];
    if (key === 'crest') crests.forEach(x => { ctx.fillStyle = '#C62828'; ctx.beginPath(); ctx.arc(x, YC - AMP, 7, 0, 7); ctx.fill(); label(ctx, '波峰', x, YC - AMP - 18, { align: 'center', size: 13, bold: true, color: '#C62828' }); });
    if (key === 'trough') troughs.forEach(x => { ctx.fillStyle = '#C62828'; ctx.beginPath(); ctx.arc(x, YC + AMP, 7, 0, 7); ctx.fill(); label(ctx, '波谷', x, YC + AMP + 18, { align: 'center', size: 13, bold: true, color: '#C62828' }); });
    if (key === 'amp') { dim(ctx, crests[0], YC, crests[0], YC - AMP, '振幅'); dim(ctx, troughs[0], YC, troughs[0], YC + AMP, '振幅'); }
    if (key === 'lam') { dim(ctx, crests[0], YC - AMP - 14, crests[1], YC - AMP - 14, '波長 λ'); dim(ctx, troughs[1], YC + AMP + 14, troughs[2], YC + AMP + 14, '波長 λ', '#C62828', 'bottom'); }
    if (key === 'err') {
      dim(ctx, crests[1], YC - AMP, crests[1], YC + AMP, '✘ 不是振幅（是 2 倍）', '#E65100');
      dim(ctx, crests[0], YC - AMP - 14, troughs[0], YC - AMP - 14, '✘ 不是波長（是一半）', '#E65100');
    }
    // 縱波：粒子疏密
    label(ctx, '縱波', 10, YL - 52, { size: 13, bold: true, color: '#2E7D32' });
    ctx.fillStyle = '#2E7D32';
    for (let i = 0; i < 70; i++) {
      const x0 = X0 + i * 10; if (x0 > X0 + LAM * 3.1) break;
      const x = x0 + 13 * Math.cos(2 * Math.PI * (x0 - X0) / LAM);   // 波峰處（相位 π/2）→ 粒子聚集（密部）
      for (let r = 0; r < 4; r++) ctx.fillRect(x - 1.5, YL - 30 + r * 18, 3, 10);
    }
    if (key === 'dense') {
      crests.forEach(x => label(ctx, '密部', x, YL + 44, { align: 'center', size: 13, bold: true, color: '#C62828', bg: 'rgba(255,255,255,.85)' }));
      troughs.forEach(x => label(ctx, '疏部', x, YL + 44, { align: 'center', size: 13, bold: true, color: '#6A1B9A', bg: 'rgba(255,255,255,.85)' }));
      dim(ctx, crests[0], YL - 42, crests[1], YL - 42, '波長 λ');
      crests.forEach(x => { ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = '#C62828'; ctx.beginPath(); ctx.moveTo(x, YC - AMP); ctx.lineTo(x, YL - 34); ctx.stroke(); ctx.restore(); });
    }
  }
  $$('#w2termBtns .chip').forEach(c => c.onclick = () => {
    key = c.dataset.k; $$('#w2termBtns .chip').forEach(x => x.classList.toggle('on', x === c));
    document.getElementById('w2termTxt').innerHTML = TXT[key]; draw();
  });
  registerSim('t2', { start: draw, resize: draw });
})();

/* ---------- ② 繩波產生器 ---------- */
(() => {
  const cv = document.getElementById('w2rope'); if (!cv) return;
  const S = stage(cv, 760, 270), ctx = S.ctx;
  const PX = 18, X0 = 52, LEN = 36, YC = 120, PCM = 18;   // 1 cm = 18 px、P 在 18 cm 處
  let v = 10, t = 0, run = true, slow = false, cnt = null, path = 0, lastY = 0;
  const F = bindRange('w2f', x => x + ' Hz', () => { reset(); });
  const A = bindRange('w2A', x => x + ' cm', () => { draw(); info(); });
  function reset() { t = 0; path = 0; cnt = null; draw(); info(); }
  const lam = () => v / +F.value;
  const y = (xcm, tt) => { const tau = tt - xcm / v; return tau < 0 ? 0 : +A.value * Math.sin(2 * Math.PI * +F.value * tau); };
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    // 尺
    ctx.fillStyle = '#FFF8E1'; ctx.fillRect(X0 - 6, 212, LEN * PX + 12, 34);
    for (let c = 0; c <= LEN; c++) {
      const x = X0 + c * PX; ctx.strokeStyle = '#8D6E63'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, 212); ctx.lineTo(x, 212 + (c % 5 ? 7 : 13)); ctx.stroke();
      if (c % 5 === 0) label(ctx, c, x, 236, { align: 'center', size: 12, color: '#5D4037' });
    }
    label(ctx, 'cm', X0 + LEN * PX + 14, 236, { size: 12, color: '#5D4037' });
    // 平衡線、刻度
    ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = '#B0BEC5'; ctx.beginPath(); ctx.moveTo(X0, YC); ctx.lineTo(X0 + LEN * PX, YC); ctx.stroke(); ctx.restore();
    // 繩子
    ctx.save(); ctx.strokeStyle = v === 10 ? '#6D4C41' : '#455A64'; ctx.lineWidth = v === 10 ? 4 : 3; ctx.beginPath();
    for (let c = 0; c <= LEN; c += 0.1) { const xx = X0 + c * PX, yy = YC - y(c, t) * PX; c === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy); }
    ctx.stroke(); ctx.restore();
    // 手
    ctx.font = '28px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✋', X0 - 22, YC - y(0, t) * PX);
    // 波前
    const front = Math.min(LEN, v * t);
    if (front < LEN) label(ctx, '波前 →', X0 + front * PX + 6, YC - 22, { size: 12, color: '#1565C0', bold: true });
    // P 點
    const yp = YC - y(PCM, t) * PX;
    ctx.fillStyle = '#D32F2F'; ctx.beginPath(); ctx.arc(X0 + PCM * PX, yp, 7, 0, 7); ctx.fill();
    label(ctx, 'P', X0 + PCM * PX + 12, yp - 12, { size: 14, bold: true, color: '#D32F2F' });
    const vy = y(PCM, t + 0.01) - y(PCM, t);
    if (Math.abs(vy) > 1e-4) arrow(ctx, X0 + PCM * PX - 18, yp, X0 + PCM * PX - 18, yp - Math.sign(vy) * 24, '#D32F2F', 2.5, 9);
    // 自動量波長（在波已經填滿的區段找兩個相鄰波峰）
    const L = lam();
    if (front > L * 1.3 && L * PX < 600) {
      // 波峰位置：f(t - x/v) 相位 = π/2 + 2πn
      const ph = +F.value * t;   // 波源已振動的圈數
      let xc = (ph - 0.25 - Math.floor(ph - 0.25)) * L;   // 離手最近的波峰（cm）
      if (xc < 0.3) xc += L;
      const ly = Math.max(30, YC - +A.value * PX - 16);
      if (xc + L <= front) dim(ctx, X0 + xc * PX, ly, X0 + (xc + L) * PX, ly, 'λ＝' + fmt(L, 2) + ' cm');
      const xt = xc + L / 2;
      if (xt <= front) dim(ctx, X0 + xt * PX + 2, YC, X0 + xt * PX + 2, YC + +A.value * PX, 'A', '#2E7D32');
    }
    if (cnt) label(ctx, `⏱ ${fmt(Math.min(1, cnt.el), 2)} 秒｜通過 P 的全波：${cnt.n} 個`, S.W - 10, 18, { align: 'right', size: 14, bold: true, bg: '#FFF3E0' });
  }
  function info() {
    const f = +F.value, L = lam();
    document.getElementById('w2R').innerHTML = `
      <div><span>頻率 f</span><b>${f} Hz</b></div><div><span>週期 T＝1/f</span><b>${fmt(1 / f, 2)} s</b></div>
      <div><span>波長 λ</span><b>${fmt(L, 2)} cm</b></div><div><span>振幅 A</span><b>${A.value} cm</b></div>
      <div><span>波速 v＝f×λ</span><b>${f} × ${fmt(L, 2)} ＝ ${fmt(f * L, 1)} cm/s</b></div>
      <div><span>P 已走過的路程</span><b>${fmt(path, 1)} cm</b></div>`;
  }
  const lp = loop(dt => {
    if (!run) return;
    const d = dt * (slow ? 0.25 : 1);
    const before = y(PCM, t); t += d; const after = y(PCM, t);
    path += Math.abs(after - before);
    if (cnt && cnt.el < 1) {
      cnt.el += d;
      // 波峰通過 P：P 的相位越過 0.25
      const phP = +F.value * (t - PCM / v), phB = +F.value * (t - d - PCM / v);
      if (phP >= 0 && Math.floor(phP - 0.25) > Math.floor(phB - 0.25)) cnt.n++;
      if (cnt.el >= 1) document.getElementById('w2Txt').innerHTML = `1 秒內，P 點振動了 <b>${+F.value}</b> 次（看到 ${cnt.n} 個波峰通過）＝頻率 <b>${+F.value} Hz</b>。<br>每通過一個全波，P 走了 4 個振幅的路程（上→回→下→回）＝ 4×${A.value}＝${4 * A.value} cm。`;
    }
    draw(); info();
  });
  document.getElementById('w2pause').onclick = e => { run = !run; e.target.textContent = run ? '⏸ 暫停' : '▶ 繼續'; };
  document.getElementById('w2slow').onclick = e => { slow = !slow; e.target.classList.toggle('sel', slow); };
  document.getElementById('w2count').onclick = () => {
    if (v * t < PCM + 0.5) t = PCM / v + 0.5;   // 等波先傳到 P
    cnt = { el: 0, n: 0 }; run = true;
  };
  $$('#w2med .chip').forEach(c => c.onclick = () => {
    v = +c.dataset.v; $$('#w2med .chip').forEach(x => x.classList.toggle('on', x === c)); reset();
    document.getElementById('w2Txt').innerHTML = v === 20 ? '換成<b>拉緊一點的繩子 B</b>：同樣的頻率，波長變成 2 倍——因為<b>介質變了，波速變了</b>。' : '回到繩子 A。';
  });
  registerSim('t2', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ③ 一秒產生幾個波 ---------- */
(() => {
  const cv = document.getElementById('w2hand'); if (!cv) return;
  const S = stage(cv, 420, 240), ctx = S.ctx;
  const V = 6, PX = 52, X0 = 40, YC = 110, AMP = 1;   // 6 cm/s、1 cm = 52 px（尺 0–6 cm）
  let f = 2, t = 0, run = false;
  const y = (x, tt) => { const tau = tt - x / V; return tau < 0 ? 0 : Math.sin(2 * Math.PI * f * tau); };
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    for (let c = 0; c <= 6; c++) { ctx.strokeStyle = '#8D6E63'; ctx.beginPath(); ctx.moveTo(X0 + c * PX, 190); ctx.lineTo(X0 + c * PX, 200); ctx.stroke(); label(ctx, c + '', X0 + c * PX, 212, { align: 'center', size: 12 }); }
    label(ctx, '公分', X0 + 6 * PX + 8, 212, { size: 12 });
    ctx.save(); ctx.strokeStyle = '#6D4C41'; ctx.lineWidth = 3.5; ctx.beginPath();
    for (let x = 0; x <= 6; x += 0.03) { const yy = YC - y(x, t) * 34 * AMP; x === 0 ? ctx.moveTo(X0 + x * PX, yy) : ctx.lineTo(X0 + x * PX, yy); }
    ctx.stroke(); ctx.restore();
    ctx.font = '24px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✋', X0 - 20, YC - y(0, t) * 34);
    const n = Math.floor(f * Math.min(t, 1) + 1e-9);
    label(ctx, `時間 ${fmt(Math.min(t, 1), 2)} 秒`, 12, 20, { size: 14, bold: true });
    label(ctx, `已產生 ${n} 個全波`, 410, 20, { align: 'right', size: 14, bold: true, color: '#C62828' });
    if (t >= 1) label(ctx, `頻率＝${f} 次/秒＝${f} Hz，週期＝1/${f}＝${fmt(1 / f, 2)} 秒，波長＝${fmt(V / f, 1)} cm`, 210, 160, { align: 'center', size: 13, bold: true, bg: '#FFF3E0' });
  }
  const lp = loop(dt => { if (!run) return; t += dt * 0.5; if (t >= 1) { t = 1; run = false; } draw(); });
  document.getElementById('w2handGo').onclick = () => { t = 0; run = true; };
  $$('#w2handF .chip').forEach(c => c.onclick = () => { f = +c.dataset.f; $$('#w2handF .chip').forEach(x => x.classList.toggle('on', x === c)); t = 0; draw(); });
  registerSim('t2', { start() { draw(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ④ 兩條繩子比賽 ---------- */
(() => {
  const cv = document.getElementById('w2race'); if (!cv) return;
  const S = stage(cv, 760, 220), ctx = S.ctx;
  const V = 6, PX = 105, X0 = 50;   // 0–6 cm
  const F1 = bindRange('w2rf1', x => x + ' Hz', () => { t = 0; draw(); info(); });
  const F2 = bindRange('w2rf2', x => x + ' Hz', () => { t = 0; draw(); info(); });
  let t = 0, run = false;
  const rope = (yc, f, col) => {
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath();
    for (let x = 0; x <= 6; x += 0.02) { const tau = t - x / V, yy = yc - (tau < 0 ? 0 : 22 * Math.sin(2 * Math.PI * f * tau)); x === 0 ? ctx.moveTo(X0 + x * PX, yy) : ctx.lineTo(X0 + x * PX, yy); }
    ctx.stroke(); ctx.restore();
  };
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#E8F5E9'; ctx.fillRect(X0 + 6 * PX - 4, 10, 8, 190); label(ctx, '終點', X0 + 6 * PX, 210, { align: 'center', size: 12, bold: true, color: '#2E7D32' });
    rope(60, +F1.value, '#C8682A'); rope(150, +F2.value, '#2F5D8C');
    label(ctx, F1.value + ' Hz', 10, 60, { size: 13, bold: true, color: '#C8682A' }); label(ctx, F2.value + ' Hz', 10, 150, { size: 13, bold: true, color: '#2F5D8C' });
    const fr = Math.min(6, V * t);
    ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = '#C62828'; ctx.beginPath(); ctx.moveTo(X0 + fr * PX, 20); ctx.lineTo(X0 + fr * PX, 190); ctx.stroke(); ctx.restore();
    label(ctx, '兩個波前', X0 + fr * PX, 14, { align: 'center', size: 12, color: '#C62828', bold: true });
  }
  function info() {
    const f1 = +F1.value, f2 = +F2.value;
    document.getElementById('w2raceR').innerHTML = `
      <div><span>上：f × λ</span><b>${f1} × ${fmt(V / f1, 2)} ＝ ${V} cm/s</b></div>
      <div><span>下：f × λ</span><b>${f2} × ${fmt(V / f2, 2)} ＝ ${V} cm/s</b></div>`;
  }
  const lp = loop(dt => {
    if (!run) return; t += dt * 0.5; if (V * t >= 6) { run = false; document.getElementById('w2raceTxt').innerHTML = '🏁 <b>同時到達！</b>兩條繩子一樣，波速都是 6 cm/s。頻率高的那條，波長比較短，「頻率 × 波長」一樣。'; }
    draw();
  });
  document.getElementById('w2raceGo').onclick = () => { t = 0; run = true; };
  registerSim('t2', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ⑤ 例題圖 ---------- */
(() => {
  const c1 = document.getElementById('w2ex1');
  if (c1) {
    const S = stage(c1, 640, 200), ctx = S.ctx;
    const draw = () => {
      S.fit(); ctx.clearRect(0, 0, S.W, S.H);
      label(ctx, '①', 10, 50, { size: 16, bold: true }); sine(ctx, 40, 620, 50, 26, 96);
      label(ctx, '②', 10, 150, { size: 16, bold: true });
      ctx.save(); ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 3; ctx.beginPath();
      const r = rng(7); let x = 40, ph = 0; ctx.moveTo(40, 150);
      const seg = [[60, 30], [40, 14], [110, 36], [50, 20], [90, 10], [70, 34], [120, 22]];
      seg.forEach(([w, a]) => { for (let k = 0; k <= w; k += 2) ctx.lineTo(x + k, 150 - a * Math.sin(Math.PI * k / w) * (ph % 2 ? -1 : 1)); x += w; ph++; });
      ctx.stroke(); ctx.restore();
    };
    registerSim('t2', { start: draw, resize: draw });
  }
  const c2 = document.getElementById('w2ex2');
  if (c2) {
    const S = stage(c2, 640, 220), ctx = S.ctx;
    const X0 = 40, PX = 7, YC = 100, A = 5 * 7;   // 1 cm = 7 px
    const draw = () => {
      S.fit(); ctx.clearRect(0, 0, S.W, S.H);
      ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = '#B0BEC5'; ctx.beginPath(); ctx.moveTo(X0, YC); ctx.lineTo(X0 + 82 * PX, YC); ctx.stroke(); ctx.restore();
      sine(ctx, X0, X0 + 80 * PX, YC, A, 20 * PX);
      arrow(ctx, X0 + 66 * PX, 22, X0 + 80 * PX, 22, '#1565C0', 2.5, 10); label(ctx, '波前進方向', X0 + 64 * PX, 22, { align: 'right', size: 12, color: '#1565C0', bold: true });
      dim(ctx, X0 + 25 * PX, YC - A, X0 + 25 * PX, YC + A, '10 cm', '#555');
      dim(ctx, X0, 190, X0 + 80 * PX, 190, '80 cm', '#555', 'bottom');
      [['P', 10], ['R', 40]].forEach(([n, x]) => { ctx.fillStyle = '#D32F2F'; ctx.beginPath(); ctx.arc(X0 + x * PX, YC, 6, 0, 7); ctx.fill(); label(ctx, n, X0 + x * PX + 8, YC + 16, { size: 14, bold: true, color: '#D32F2F' }); });
    };
    registerSim('t2', { start: draw, resize: draw });
  }
})();

/* ---------- ⑥ 海邊數浪 ---------- */
(() => {
  const cv = document.getElementById('w2sea'); if (!cv) return;
  const S = stage(cv, 760, 220), ctx = S.ctx;
  const PXM = 28, X0 = 20, POST = 12;   // 1 m = 28 px，計數木樁在 12 m
  let T = 3, L = 9, t = 0, sw = { on: false, t: 0 }, n = 0;
  const newSea = () => { const r = Math.random; T = [2, 2.5, 3, 4, 5][Math.floor(r() * 5)]; L = [6, 8, 9, 10, 12][Math.floor(r() * 5)]; sw = { on: false, t: 0 }; n = 0; document.getElementById('w2seaIn').value = ''; document.getElementById('w2seaTxt').innerHTML = '💡 方法提示：第 1 個浪峰經過木樁時按碼錶開始（這一個記為 0），之後每經過一個按「＋1」，數到 10 再按停止 → 這段時間有 10 個週期，週期＝時間÷10。（小心例題 3-3 的陷阱：從 1 開始數會少一個！）'; info(); };
  const eta = (xm, tt) => 0.6 * Math.sin(2 * Math.PI * (xm / L - tt / T));
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#FFF8E1'; ctx.fillRect(0, 0, S.W, S.H);
    ctx.beginPath(); ctx.moveTo(0, S.H);
    for (let x = 0; x <= S.W; x += 4) ctx.lineTo(x, 110 - eta((x - X0) / PXM, t) * 40);
    ctx.lineTo(S.W, S.H); ctx.closePath(); ctx.fillStyle = '#4FA3D1'; ctx.fill();
    // 木樁
    for (let m = 0; m <= 26; m += 2) {
      const x = X0 + m * PXM; ctx.fillStyle = m === POST ? '#C62828' : '#6D4C41'; ctx.fillRect(x - 3, 40, 6, 150);
      label(ctx, m + 'm', x, 204, { align: 'center', size: 11, color: '#5D4037' });
    }
    label(ctx, '計數木樁', X0 + POST * PXM, 30, { align: 'center', size: 12, bold: true, color: '#C62828' });
    arrow(ctx, 560, 22, 700, 22, '#0D47A1', 2.5, 10); label(ctx, '浪往右前進', 556, 22, { align: 'right', size: 12, color: '#0D47A1', bold: true });
  }
  function info() {
    document.getElementById('w2seaR').innerHTML = `<div><span>碼錶</span><b>${fmt(sw.t, 1)} 秒 ${sw.on ? '⏺' : ''}</b></div><div><span>數到的浪峰</span><b>${n} 個</b></div>`;
  }
  const lp = loop(dt => { t += dt; if (sw.on) sw.t += dt; draw(); info(); });
  document.getElementById('w2seaT').onclick = () => { sw.on = !sw.on; };
  document.getElementById('w2seaC').onclick = () => { n++; info(); };
  document.getElementById('w2seaZ').onclick = () => { sw = { on: false, t: 0 }; n = 0; info(); };
  document.getElementById('w2seaNew').onclick = newSea;
  document.getElementById('w2seaChk').onclick = () => {
    const g = +document.getElementById('w2seaIn').value, v = L / T, ok = g > 0 && Math.abs(g - v) / v < 0.08;
    const off = g > 0 && Math.abs(g * 9 / 10 - v) / v < 0.06 || Math.abs(g * 10 / 9 - v) / v < 0.06;
    document.getElementById('w2seaTxt').innerHTML = (ok ? '✅ <b>很接近！</b>' : off ? '🤔 <b>差一點點！</b>是不是多數或少數了一個浪峰？（10 個週期要看到 11 個浪峰）' : '🤔 <b>再算算看。</b>') +
      `<br>這片海：週期 T＝${T} 秒（頻率 ${fmt(1 / T, 2)} Hz）、波長 λ＝${L} 公尺 → 波速 v＝λ÷T＝<b>${fmt(v, 2)} 公尺／秒</b>。`;
  };
  newSea();
  registerSim('t2', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ⑦ v＝f×λ 計算器 ---------- */
(() => {
  const host = document.getElementById('w2calc'); if (!host) return;
  const L = [
    ['🎹 鋼琴的 La（空氣中）', 440, 340, '聲波'],
    ['🗣️ 男生說話（空氣中）', 150, 340, '聲波'],
    ['🦇 蝙蝠的超聲波（空氣中）', 50000, 340, '聲波'],
    ['🩺 醫學超音波（人體軟組織中）', 3e6, 1540, '聲波'],
    ['📻 FM 廣播 100 MHz', 1e8, 3e8, '電磁波'],
    ['📶 Wi-Fi 2.4 GHz', 2.4e9, 3e8, '電磁波'],
    ['🍲 微波爐 2.45 GHz', 2.45e9, 3e8, '電磁波'],
  ];
  const unitF = f => f >= 1e9 ? fmt(f / 1e9, 2) + ' GHz' : f >= 1e6 ? fmt(f / 1e6, 2) + ' MHz' : f >= 1e3 ? fmt(f / 1e3, 1) + ' kHz' : f + ' Hz';
  const unitL = l => l >= 1 ? fmt(l, 2) + ' 公尺' : l >= 0.01 ? fmt(l * 100, 2) + ' 公分' : fmt(l * 1000, 2) + ' 毫米';
  host.innerHTML = L.map((x, i) => `<button class="chip" data-i="${i}">${x[0]}</button>`).join('');
  $$('.chip', host).forEach(c => c.onclick = () => {
    $$('.chip', host).forEach(x => x.classList.toggle('on', x === c));
    const [n, f, v, k] = L[+c.dataset.i];
    document.getElementById('w2calcR').innerHTML = `<div><span>種類</span><b>${k}</b></div><div><span>頻率 f</span><b>${unitF(f)}</b></div>
      <div><span>波速 v</span><b>${v >= 1e8 ? '3×10⁸' : v} m/s</b></div><div><span>波長 λ＝v÷f</span><b>${unitL(v / f)}</b></div>`;
  });
})();

/* ---------- ⑧ 資優：兩種圖 ---------- */
(() => {
  const cv = document.getElementById('w2graphs'); if (!cv) return;
  const S = stage(cv, 420, 280), ctx = S.ctx;
  const draw = () => {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    [[70, '位移–位置圖（某一瞬間的照片）', '位置 x', '波長 λ'], [210, '位移–時間圖（只盯著 P 點）', '時間 t', '週期 T']].forEach(([yc, tt, ax, dm]) => {
      label(ctx, tt, 10, yc - 52, { size: 13, bold: true });
      arrow(ctx, 30, yc, 405, yc, '#555', 1.5, 8); label(ctx, ax, 405, yc + 14, { align: 'right', size: 12 });
      sine(ctx, 30, 390, yc, 30, 140, 0, yc < 100 ? '#1565C0' : '#C62828', 2.5);
      dim(ctx, 65, yc - 38, 205, yc - 38, dm, '#333');
    });
  };
  registerSim('t2', { start: draw, resize: draw });
})();

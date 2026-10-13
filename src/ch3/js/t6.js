/* ===== 分頁 6：彈力位能 =====
   光滑地面，彈簧一端固定在牆。x = 木塊偏離原長的位置（m，負＝壓縮）。木塊 1 kg。
   彈力位能 ½kx²，動能 ½mv²，總和固定（力學能守恆的預告） */
(() => {
  const cv = document.getElementById('c3spr'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const WALL = 50, EQ = 320, PX = 600, M = 1, GY = 220;   // 原長時木塊左緣在 EQ；1 m = 600 px
  let x = 0, v = 0, run = false, drag = false, free = false, mode = 'hold', maxK = 0, x0 = 0;
  const kEl = bindRange('c3sprK', v => v + ' N/m', () => { stop(); });
  const k = () => +kEl.value;
  const bx = () => EQ + x * PX;
  function stop() { run = false; x = 0; v = 0; free = false; maxK = 0; draw(); info(); }
  function release(xx) { x = xx; x0 = xx; v = 0; run = true; free = false; maxK = 0; info(); }
  function step(dt) {
    if (!run) { return; }
    const sub = 8; dt = dt * 0.5 / sub;
    for (let i = 0; i < sub; i++) {
      if (!free) {
        const a = -k() * x / M; v += a * dt; x += v * dt;
        if (mode === 'free' && x >= 0 && v > 0) free = true;   // 回到原長、往右運動 → 脫離彈簧
      } else x += v * dt;
    }
    maxK = Math.max(maxK, 0.5 * M * v * v);
    if (free && bx() > S.W - 30) run = false;
    draw(); info();
  }
  function spring(x1, x2, y) {
    const n = 14, w = x2 - x1;
    ctx.save(); ctx.strokeStyle = '#455A64'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1, y);
    for (let i = 1; i <= n; i++) ctx.lineTo(x1 + w * (i - .5) / n, y + (i % 2 ? -14 : 14));
    ctx.lineTo(x2, y); ctx.stroke(); ctx.restore();
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#90A4AE'; ctx.fillRect(WALL - 22, GY - 120, 22, 120);
    for (let yy = GY - 120; yy < GY; yy += 12) { ctx.strokeStyle = '#607D8B'; ctx.beginPath(); ctx.moveTo(WALL - 22, yy + 12); ctx.lineTo(WALL - 10, yy); ctx.stroke(); }
    ground(ctx, WALL - 22, S.W - 10, GY);
    // 原長位置
    ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = '#2E7D32'; ctx.beginPath(); ctx.moveTo(EQ, GY - 110); ctx.lineTo(EQ, GY + 6); ctx.stroke(); ctx.restore();
    label(ctx, '原長', EQ, GY - 118, { align: 'center', size: 12, color: '#2E7D32', bold: true });
    const sx = free ? EQ : bx();
    spring(WALL, sx, GY - 30);
    box(ctx, bx(), GY - 60, 60, 60, '#C8956A', '1 kg');
    const xx = free ? 0 : x;
    const st = Math.abs(xx) < 0.003 ? '原長' : xx < 0 ? `壓縮 ${fmt(-xx * 100, 1)} cm` : `拉長 ${fmt(xx * 100, 1)} cm`;
    label(ctx, st, (WALL + sx) / 2, GY - 64, { align: 'center', size: 13, bold: true, bg: 'rgba(255,255,255,.85)' });
    if (!run && !drag && x === 0) label(ctx, '👆 按住木塊往左或往右拖', EQ + 30, GY + 36, { align: 'center', size: 13, color: '#66736E' });
    if (Math.abs(v) > 0.05) arrow(ctx, bx() + 30, GY - 80, bx() + 30 + Math.sign(v) * (20 + Math.abs(v) * 12), GY - 80, '#1565C0', 3, 10);
    const U = 0.5 * k() * xx * xx, Kin = 0.5 * M * v * v;
    ebars(ctx, 560, 60, 180, 150, [
      { name: '彈力位能', val: U, color: '#8E24AA' },
      { name: '動能', val: Kin, color: '#1E88E5' },
      { name: '總和', val: U + Kin, color: '#F9A825' },
    ], 0.5 * k() * Math.max(Math.abs(x0), Math.abs(xx), 0.1) ** 2 * 1.15, { title: '能量（焦耳）', d: 2 });
    drawFx(xx);
  }
  function info() {
    const xx = free ? 0 : x, U = 0.5 * k() * xx * xx, Kin = 0.5 * M * v * v;
    document.getElementById('c3sprR').innerHTML = `
      <div><span>形變量</span><b>${fmt(Math.abs(xx) * 100, 1)} cm</b></div>
      <div><span>彈力位能</span><b>${fmt(U, 2)} J</b></div>
      <div><span>木塊動能</span><b>${fmt(Kin, 2)} J</b></div>
      <div><span>這次的最大動能</span><b>${fmt(maxK, 2)} J</b></div>`;
    const t = document.getElementById('c3sprTxt');
    if (drag) t.innerHTML = x < 0 ? '你正在<b>壓縮</b>彈簧：你對彈簧作功，存成彈力位能。' : '你正在<b>拉長</b>彈簧：拉長也會儲存彈力位能！';
    else if (run && free) t.innerHTML = '木塊離開彈簧了：彈力位能<b>全部</b>變成木塊的動能，之後在光滑地面上等速前進。';
    else if (run) t.innerHTML = '彈力位能 ⇄ 動能 來回轉換。注意黃色的<b>總和</b>一直不變！（光滑地面、沒有摩擦力）';
  }
  // 拖曳
  cv.addEventListener('pointerdown', e => {
    const p = S.pt(e);
    if (p.x > bx() - 20 && p.x < bx() + 80 && p.y > GY - 90) { drag = true; run = false; free = false; v = 0; cv.setPointerCapture(e.pointerId); }
  });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    const p = S.pt(e);
    x = clamp((p.x - 30 - EQ) / PX, -0.25, 0.25); maxK = 0;
    draw(); info();
  });
  cv.addEventListener('pointerup', () => { if (!drag) return; drag = false; if (Math.abs(x) > 0.005) release(x); });
  $$('#c3sprPre .chip').forEach(c => c.onclick = () => { release(+c.dataset.x); });
  $$('#c3sprMode .chip').forEach(c => c.onclick = () => { mode = c.dataset.m; $$('#c3sprMode .chip').forEach(z => z.classList.toggle('on', z === c)); stop(); });
  document.getElementById('c3sprStop').onclick = stop;

  /* 資優：F–x 圖 */
  const fc = document.getElementById('c3fx');
  const F2 = fc && stage(fc, 360, 260), fx = F2 && F2.ctx;
  function drawFx(xx) {
    if (!F2 || !fc.clientWidth) return;
    F2.fit(); fx.clearRect(0, 0, 360, 260);
    const xa = Math.abs(xx), kk = k();
    const OX = 45, OY = 220, PXX = 1150, PYY = 190 / (kk * 0.25);   // 0.25 m → 287 px；最大彈力 → 190 px
    arrow(fx, OX, OY, 345, OY, '#333', 1.5, 8); arrow(fx, OX, OY, OX, 12, '#333', 1.5, 8);
    label(fx, '形變量 x（m）', 345, OY - 12, { align: 'right', size: 12 }); label(fx, '彈力 F（N）', OX + 6, 16, { size: 12 });
    fx.strokeStyle = '#7B1FA2'; fx.lineWidth = 2.5; fx.beginPath(); fx.moveTo(OX, OY); fx.lineTo(OX + 0.25 * PXX, OY - kk * 0.25 * PYY); fx.stroke();
    fx.fillStyle = 'rgba(123,31,162,.25)'; fx.beginPath(); fx.moveTo(OX, OY); fx.lineTo(OX + xa * PXX, OY - kk * xa * PYY); fx.lineTo(OX + xa * PXX, OY); fx.closePath(); fx.fill();
    [0.1, 0.2].forEach(v => label(fx, v, OX + v * PXX, OY + 12, { align: 'center', size: 12 }));
    if (xa > 0.005) label(fx, `面積＝½×${fmt(xa, 2)}×${fmt(kk * xa, 1)}＝${fmt(0.5 * kk * xa * xa, 2)} J`, OX + xa * PXX / 2 + 20, OY - kk * xa * PYY / 3 - 10, { size: 13, bold: true, color: '#4A148C', bg: 'rgba(255,255,255,.85)' });
  }
  const lp = loop(step);
  registerSim('t6', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- 分類：哪一種能量 ---------- */
(() => {
  const host = document.getElementById('c3sort6'); if (!host) return;
  mountSort(host, ['動能', '重力位能', '彈力位能'], [
    ['拉滿弓、還沒放手的弓', 2, '弓臂彎曲（形變）→ 彈力位能。'],
    ['正在飛行的箭', 0, '箭在運動 → 動能（也有一點重力位能）。'],
    ['停在山頂、還沒出發的雲霄飛車', 1, '在高處、靜止 → 重力位能。'],
    ['被踩扁的海綿彈簧床墊', 2, '床墊被壓縮 → 彈力位能。'],
    ['在平直公路上奔馳的汽車', 0, '在運動、高度沒變 → 動能。'],
    ['掛在牆上的時鐘', 1, '在高處 → 重力位能（以地面為基準）。'],
    ['機械錶裡上緊的發條', 2, '發條被捲緊（形變）→ 彈力位能，慢慢釋放推動指針。'],
  ]);
})();

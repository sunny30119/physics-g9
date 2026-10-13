/* ===== 分頁 5 補充：高空墜物危險度 =====
   重力位能 mgh（以地面為基準）＝ 不計空氣阻力時落地前的動能。每層樓以 3 m 計。 */
(() => {
  const cv = document.getElementById('c3fall'); if (!cv) return;
  const S = stage(cv, 760, 340), ctx = S.ctx;
  const OBJ = { apple: ['🍎 蘋果', 0.2], bottle: ['🧴 600 mL 瓶裝水', 0.6], phone: ['📱 手機', 0.2], pot: ['🪴 小盆栽', 1.5], brick: ['🧱 磚頭', 2.5] };
  let obj = 'bottle', y = 0, v = 0, run = false;
  const fl = bindRange('c3ff', v => v + ' 樓（約 ' + (v - 1) * 3 + ' m）', () => { reset(); });
  $$('#c3fobj .chip').forEach(c => c.onclick = () => { obj = c.dataset.o; $$('#c3fobj .chip').forEach(x => x.classList.toggle('on', x === c)); reset(); });
  const H = () => (fl.value - 1) * 3;   // 從第 n 樓窗台，到地面約 (n-1)×3 m
  function reset() { y = 0; v = 0; run = false; draw(); info(); }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const GY = 320, FH = 9.5, bx = 60, bw = 120;   // 每層樓 9.5 px（最多 31 樓）
    ctx.fillStyle = '#CFD8DC'; ctx.fillRect(bx, GY - 31 * FH, bw, 31 * FH);
    for (let f = 0; f < 31; f++) { ctx.fillStyle = (f + 1) === +fl.value ? '#FFB300' : '#90A4AE'; ctx.fillRect(bx + 12, GY - (f + 1) * FH + 2, bw - 24, FH - 4); }
    ground(ctx, 10, 340, GY);
    const top = GY - (fl.value - 1) * FH * 1 - FH * 0.5;
    const oy = top + (y / Math.max(H(), 0.01)) * (GY - top - 10);
    label(ctx, OBJ[obj][0].split(' ')[0], bx + bw + 30, Math.min(GY - 10, oy), { align: 'center', size: 22 });
    label(ctx, `第 ${fl.value} 樓`, bx + bw / 2, top - 14, { align: 'center', size: 12, bold: true, color: '#E65100', bg: '#FFF8E1' });
    // 右側：能量比較長條
    const E = OBJ[obj][1] * G * H();
    const REF = [['⚾ 職棒快速球（約 150 km/h）', 126], ['🎳 保齡球從 1 m 掉到腳上', 7 * G * 1]];
    const items = [[OBJ[obj][0] + ` 從 ${fl.value} 樓`, E, '#E53935'], ...REF.map(r => [r[0], r[1], '#90A4AE'])];
    const max = Math.max(...items.map(i => i[1]), 50) * 1.1, x0 = 380, w = 330;
    label(ctx, '落地前的動能（焦耳）', x0, 30, { size: 14, bold: true });
    items.forEach(([n, val, c], i) => {
      const yy = 60 + i * 80;
      ctx.fillStyle = '#ECEFF1'; ctx.fillRect(x0, yy + 18, w, 26);
      ctx.fillStyle = c; ctx.fillRect(x0, yy + 18, w * val / max, 26);
      label(ctx, n, x0, yy + 6, { size: 13 });
      const bw2 = w * val / max;
      if (bw2 > 70) label(ctx, fmt(val, 0) + ' J', x0 + bw2 - 6, yy + 31, { align: 'right', size: 13, bold: true, color: '#fff' });
      else label(ctx, fmt(val, 0) + ' J', x0 + bw2 + 6, yy + 31, { size: 13, bold: true, color: '#37474F' });
    });
  }
  function info() {
    const m = OBJ[obj][1], E = m * G * H(), vv = Math.sqrt(2 * G * H());
    document.getElementById('c3fallR').innerHTML = `
      <div><span>高度</span><b>${H()} m</b></div>
      <div><span>重力位能＝重量 × 高度</span><b>${fmt(E, 0)} J</b></div>
      <div><span>落地前速率（不計空氣阻力）</span><b>${fmt(vv * 3.6, 0)} km/h</b></div>
      <div><span>相當於幾顆快速球</span><b>${fmt(E / 126, 1)} 顆</b></div>`;
  }
  document.getElementById('c3fallGo').onclick = () => { y = 0; v = 0; run = true; };
  onG(() => { draw(); info(); });
  const lp = loop(dt => { if (!run) return; dt *= 0.6; v += G * dt; y += v * dt; if (y >= H()) { y = H(); run = false; } draw(); });
  registerSim('t5', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

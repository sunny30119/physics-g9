/* ===== 分頁 2 補充：上 3 樓的三種方法（作功相同、功率不同）===== */
(() => {
  const cv = document.getElementById('c3floor'); if (!cv) return;
  const S = stage(cv, 760, 370), ctx = S.ctx;
  const H = 9;   // 3 層樓 ≈ 9 m
  const LANES = [
    { n: '🚶 慢慢走樓梯', T: 40, c: '#43A047' },
    { n: '🏃 衝刺跑樓梯', T: 12, c: '#E53935' },
    { n: '🛗 搭電梯', T: 8, c: '#1E88E5' },
  ];
  let t = 0, run = false;
  const mEl = bindRange('c3floorM', v => v + ' kg', () => { t = 0; run = false; draw(); info(); });
  const tEls = LANES.map((L, i) => bindRange('c3floorT' + i, v => v + ' 秒', () => { L.T = +tEls[i].value; t = 0; run = false; draw(); info(); }));
  LANES.forEach((L, i) => L.T = +tEls[i].value);
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const GY = 345, PH = 80, Tm = Math.max(...LANES.map(l => l.T));
    LANES.forEach((L, i) => {
      const x0 = 40 + i * 240, w = 200;
      ctx.fillStyle = '#ECEFF1'; ctx.fillRect(x0, GY - 3 * PH - 10, w, 3 * PH + 10);
      for (let f = 0; f <= 3; f++) { ctx.fillStyle = '#90A4AE'; ctx.fillRect(x0, GY - f * PH, w, 3); label(ctx, (f + 1) + 'F', x0 + w - 4, GY - f * PH - 10, { align: 'right', size: 12, color: '#607D8B' }); }
      if (i < 2) { ctx.strokeStyle = '#B0BEC5'; ctx.lineWidth = 2; ctx.beginPath(); for (let k = 0; k < 24; k++) { const sx = x0 + 10 + (k % 8) * 18, sy = GY - Math.floor(k / 8) * PH - (k % 8) * 10; ctx.moveTo(sx, sy); ctx.lineTo(sx + 18, sy); ctx.lineTo(sx + 18, sy - 10); } ctx.stroke(); }
      else { ctx.strokeStyle = '#78909C'; ctx.strokeRect(x0 + 70, GY - 3 * PH - 8, 60, 3 * PH + 8); }
      const f = Math.min(1, t / L.T), y = GY - f * 3 * PH;
      const px = i < 2 ? x0 + 20 + ((f * 3) % 1) * 140 : x0 + 100;
      if (i === 2) { ctx.fillStyle = 'rgba(30,136,229,.25)'; ctx.fillRect(x0 + 72, y - 70, 56, 70); }
      ctx.strokeStyle = '#37474F'; ctx.lineWidth = 3; ctx.fillStyle = L.c;
      ctx.beginPath(); ctx.arc(px, y - 52, 8, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(px, y - 44); ctx.lineTo(px, y - 20); ctx.moveTo(px, y - 20); ctx.lineTo(px - 7, y); ctx.moveTo(px, y - 20); ctx.lineTo(px + 7, y); ctx.stroke();
      label(ctx, L.n, x0 + w / 2, 14, { align: 'center', size: 14, bold: true, color: L.c });
      label(ctx, f >= 1 ? `✔ ${L.T} 秒到達` : `${fmt(Math.min(t, L.T), 1)} 秒`, x0 + w / 2, 34, { align: 'center', size: 13 });
    });
  }
  function info() {
    const m = +mEl.value, W = m * G * H;
    document.getElementById('c3floorR').innerHTML = LANES.map(L => `<div><span>${L.n}</span><b>${fmt(W / L.T, 0)} W</b></div>`).join('') + `<div><span>三種方法作的功（對抗重力）</span><b>都是 ${fmt(W, 0)} J</b></div>`;
  }
  document.getElementById('c3floorGo').onclick = () => { t = 0; run = true; };
  onG(info);
  const lp = loop(dt => { if (!run) return; t += dt * Math.max(...LANES.map(l => l.T)) / 6; if (t >= Math.max(...LANES.map(l => l.T))) run = false; draw(); });
  registerSim('t2', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

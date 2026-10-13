/* ===== 分頁 6 補充：彈弓射高 =====
   彈弓當成 k = 200 N/m 的彈簧：彈力位能 ½kx² → 全部變成重力位能 mgh（不計阻力）→ h = ½kx² / (mg) */
(() => {
  const cv = document.getElementById('c3sling'); if (!cv) return;
  const S = stage(cv, 760, 360), ctx = S.ctx;
  const K = 200, BALL = { m1: ['彈珠 20 g', 0.02], m2: ['小石頭 50 g', 0.05], m3: ['網球 60 g', 0.06] };
  let ball = 'm2', y = 0, v = 0, run = false, peak = 0, hist = [];
  const xEl = bindRange('c3slx', v => v + ' cm', () => { if (!run) { y = 0; draw(); info(); } });
  $$('#c3slb .chip').forEach(c => c.onclick = () => { ball = c.dataset.b; $$('#c3slb .chip').forEach(z => z.classList.toggle('on', z === c)); y = 0; run = false; draw(); info(); });
  const x = () => xEl.value / 100, m = () => BALL[ball][1];
  const Ue = () => 0.5 * K * x() * x(), hMax = () => Ue() / (m() * G);
  const GY = 330, SX = 200;
  const scaleH = () => Math.max(10, Math.ceil(Math.max(hMax(), ...hist.map(h => h.h)) / 10) * 10);
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const top = 40, PXM = (GY - 60 - top) / scaleH();
    ground(ctx, 10, 420, GY);
    for (let k = 0; k <= scaleH(); k += scaleH() / 5) { const yy = GY - 60 - k * PXM; label(ctx, fmt(k, 0) + ' m', 40, yy, { align: 'right', size: 11, color: '#90A4AE' }); ctx.fillStyle = '#ECEFF1'; ctx.fillRect(44, yy, 340, 1); }
    // 之前的紀錄
    hist.forEach((hh, i) => { const yy = GY - 60 - hh.h * PXM; ctx.fillStyle = 'rgba(123,31,162,.6)'; ctx.fillRect(SX + 40 + i * 14, yy - 1, 10, 3); });
    // 彈弓
    ctx.strokeStyle = '#6D4C41'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(SX, GY); ctx.lineTo(SX, GY - 40); ctx.lineTo(SX - 24, GY - 70); ctx.moveTo(SX, GY - 40); ctx.lineTo(SX + 24, GY - 70); ctx.stroke();
    const pull = run || y > 0 ? 0 : x() * 120;
    const by = run || y > 0 ? GY - 60 - y * PXM : GY - 66 + pull;
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(SX - 24, GY - 70); ctx.lineTo(SX, run || y > 0 ? GY - 66 : by); ctx.lineTo(SX + 24, GY - 70); ctx.stroke();
    ctx.fillStyle = '#546E7A'; ctx.beginPath(); ctx.arc(SX, by, 8, 0, 7); ctx.fill();
    if (!run && y === 0) label(ctx, `拉長 ${xEl.value} cm`, SX + 40, GY - 50, { size: 13, bold: true, color: '#C62828' });
    if (peak > 0 && !run) label(ctx, `最高 ${fmt(peak, 1)} m`, SX + 40, GY - 60 - peak * PXM, { size: 13, bold: true, color: '#4A148C', bg: '#F3E5F5' });
    // 長條：彈力位能、動能、重力位能
    const Ug = m() * G * y, Kin = Math.max(0, Ue() - Ug);   // 不計阻力：動能＝彈力位能 − 已增加的重力位能
    const Uel = run || y > 0 ? 0 : Ue();
    ebars(ctx, 470, 70, 260, 210, [
      { name: '彈力位能', val: Uel, color: '#8E24AA' },
      { name: '動能', val: run ? Kin : 0, color: '#1E88E5' },
      { name: '重力位能', val: Ug, color: '#43A047' },
    ], Math.max(Ue(), 0.5) * 1.1, { title: '能量（焦耳）', d: 2 });
  }
  function info() {
    document.getElementById('c3slR').innerHTML = `
      <div><span>儲存的彈力位能</span><b>${fmt(Ue(), 2)} J</b></div>
      <div><span>預測最高高度（不計阻力）</span><b>${fmt(hMax(), 1)} m</b></div>`;
    const tb = document.getElementById('c3slT');
    tb.innerHTML = hist.length ? hist.map((h, i) => `<tr><td>${i + 1}</td><td>${h.b}</td><td>${h.x} cm</td><td><b>${fmt(h.h, 1)} m</b></td></tr>`).join('') : '<tr><td colspan="4" class="note">發射後會自動記錄</td></tr>';
  }
  document.getElementById('c3slGo').onclick = () => { y = 0; v = Math.sqrt(2 * Ue() / m()); run = true; peak = 0; };
  document.getElementById('c3slClr').onclick = () => { hist = []; peak = 0; y = 0; draw(); info(); };
  onG(() => { draw(); info(); });
  const lp = loop(dt => {
    if (!run) return;
    dt *= Math.max(0.6, Math.sqrt(scaleH() / 20));   // 很高時播快一點
    v -= G * dt; y += v * dt; peak = Math.max(peak, y);
    if (y <= 0) { y = 0; v = 0; run = false; hist.push({ b: BALL[ball][0], x: +xEl.value, h: peak }); if (hist.length > 10) hist.shift(); info(); }
    draw();
  });
  registerSim('t6', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

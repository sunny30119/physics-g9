/* ===== 分頁 2：光的傳播速率 ===== */
const C_LIGHT = 3e8;

/* ---------- ① 伽利略的燈籠 ---------- */
(() => {
  const cv = document.getElementById('l2gal'); if (!cv) return;
  const S = stage(cv, 760, 200), ctx = S.ctx;
  const GD = bindRange('l2gd', v => v + ' 公里', () => draw());
  let t = -1, run = false;
  const REACT = 0.25;   // 人的反應時間約 0.25 秒
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const night = ctx.createLinearGradient(0, 0, 0, S.H); night.addColorStop(0, '#0D1B2A'); night.addColorStop(1, '#1B263B'); ctx.fillStyle = night; ctx.fillRect(0, 0, S.W, S.H);
    const hill = (x) => { ctx.fillStyle = '#2E4A2E'; ctx.beginPath(); ctx.moveTo(x - 110, 200); ctx.quadraticCurveTo(x, 40, x + 110, 200); ctx.fill(); };
    hill(110); hill(650);
    const a = t >= 0, b = t >= REACT;
    const lamp = (x, on) => { ctx.fillStyle = on ? '#FFD54F' : '#5D4037'; ctx.shadowColor = '#FFD54F'; ctx.shadowBlur = on ? 25 : 0; ctx.fillRect(x - 8, 82, 16, 20); ctx.shadowBlur = 0; };
    lamp(110, a); lamp(650, b);
    label(ctx, '伽利略', 110, 130, { align: 'center', size: 13, color: '#fff', bold: true }); label(ctx, '助手', 650, 130, { align: 'center', size: 13, color: '#fff', bold: true });
    if (a) { ctx.strokeStyle = 'rgba(255,213,79,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(120, 92); ctx.lineTo(640, 92); ctx.stroke(); }
    label(ctx, GD.value + ' 公里', 380, 70, { align: 'center', size: 13, color: '#B0BEC5' });
    if (t >= REACT + 0.05) label(ctx, `量到的時間 ≈ ${fmt(REACT, 2)} 秒（其中光只花了 ${fmt(2 * GD.value * 1000 / C_LIGHT * 1e6, 1)} 微秒）`, 380, 30, { align: 'center', size: 14, bold: true, color: '#FFF59D' });
  }
  const lp = loop(dt => { if (!run) return; t += dt * 0.5; if (t > 1) run = false; draw(); });
  document.getElementById('l2gGo').onclick = () => {
    t = 0; run = true;
    const us = 2 * +GD.value * 1000 / C_LIGHT * 1e6;
    document.getElementById('l2gTxt').innerHTML = `不管山頭距離 1 公里還是 10 公里，量到的時間都是大約 <b>0.25 秒</b>——那其實是助手「看到光 → 掀開燈籠」的<b>反應時間</b>。光來回 ${GD.value} 公里只要約 <b>${fmt(us, 1)} 微秒</b>（百萬分之一秒），人根本量不出來。<br>伽利略的結論：光如果不是無限快，也是「快得不得了」。`;
  };
  registerSim('t2', { start() { draw(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ② 羅默與木衛一 ---------- */
(() => {
  const cv = document.getElementById('l2rom'); if (!cv) return;
  const S = stage(cv, 760, 240), ctx = S.ctx;
  const P = bindRange('l2rp', v => v + '°', () => { draw(); info(); });
  const SX = 230, SY = 120, R = 80;
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#0B0F1A'; ctx.fillRect(0, 0, S.W, S.H);
    ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(SX, SY, R, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#FFC107'; ctx.beginPath(); ctx.arc(SX, SY, 16, 0, 7); ctx.fill(); label(ctx, '太陽', SX, SY + 30, { align: 'center', size: 12, color: '#FFE082' });
    const JX = 690; ctx.fillStyle = '#D7A86E'; ctx.beginPath(); ctx.arc(JX, SY, 22, 0, 7); ctx.fill(); label(ctx, '木星', JX, SY + 36, { align: 'center', size: 12, color: '#FFE0B2' });
    ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(JX - 34, SY - 8, 4, 0, 7); ctx.fill(); label(ctx, '木衛一', JX - 34, SY - 22, { align: 'center', size: 11, color: '#fff' });
    const a = rad(+P.value), ex = SX + R * Math.cos(a), ey = SY - R * Math.sin(a);
    ctx.fillStyle = '#42A5F5'; ctx.beginPath(); ctx.arc(ex, ey, 9, 0, 7); ctx.fill(); label(ctx, '地球', ex, ey - 18, { align: 'center', size: 12, color: '#90CAF9', bold: true });
    ray(ctx, JX - 34, SY - 8, ex, ey, 'rgba(255,255,255,.7)', 1.5, 0.5);
  }
  function info() {
    const a = rad(+P.value), extra = 1.5e11 * (1 - Math.cos(a));
    document.getElementById('l2rTxt').innerHTML = `地球離木星比最近時多了約 <b>${fmt(extra / 1.5e11, 2)} 個日地距離</b>，木衛一被木星遮住的訊號（光）要多走這段路，衛星食會比預測晚約 <b>${fmt(extra / C_LIGHT / 60, 1)} 分鐘</b>。<br>羅默在 1676 年就是從這種「延遲」推論：<b>光速是有限的</b>。`;
  }
  registerSim('t2', { start() { draw(); info(); }, resize: draw });
})();

/* ---------- ③ 斐索的齒輪 ---------- */
(() => {
  const cv = document.getElementById('l2fiz'); if (!cv) return;
  const S = stage(cv, 760, 250), ctx = S.ctx;
  const RV = bindRange('l2fr', v => fmt(v, 1) + ' 圈／秒', () => info());
  const N = 720, D = 8633;
  let ang = 0;
  const phase = () => +RV.value * N * 2 * D / C_LIGHT;   // 光來回期間齒輪轉過幾個「齒距」
  const bright = () => 0.5 + 0.5 * Math.cos(2 * Math.PI * phase());
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, S.W, S.H);
    // 光源、半透鏡、齒輪、遠方鏡子、眼睛
    ctx.fillStyle = '#FFEB3B'; ctx.beginPath(); ctx.arc(60, 60, 12, 0, 7); ctx.fill(); label(ctx, '光源', 60, 34, { align: 'center', size: 12, color: '#FFF59D' });
    ray(ctx, 72, 60, 150, 120, '#FFEB3B', 2, 0.6);
    ctx.strokeStyle = '#90CAF9'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(135, 105); ctx.lineTo(165, 135); ctx.stroke(); label(ctx, '半透鏡', 150, 155, { align: 'center', size: 11, color: '#90CAF9' });
    const WX = 240, WY = 120 + 40, WR = 46;   // 輪心在光束下方，光束剛好通過邊緣的齒縫
    ctx.save(); ctx.translate(WX, WY); ctx.rotate(ang);
    for (let k = 0; k < 24; k++) { ctx.fillStyle = '#B0BEC5'; ctx.save(); ctx.rotate(k * Math.PI * 2 / 24); ctx.fillRect(WR - 8, -4, 14, 8); ctx.restore(); }
    ctx.fillStyle = '#78909C'; ctx.beginPath(); ctx.arc(0, 0, WR - 6, 0, 7); ctx.fill(); ctx.restore();
    label(ctx, '齒輪（720 齒，圖中只畫 24 齒）', WX, 96, { align: 'center', size: 11, color: '#CFD8DC' });
    ray(ctx, 150, 120, 690, 120, 'rgba(255,235,59,.85)', 2, 0.4);
    ctx.save(); ctx.setLineDash([8, 6]); ctx.strokeStyle = '#555'; ctx.beginPath(); ctx.moveTo(420, 100); ctx.lineTo(440, 140); ctx.moveTo(430, 100); ctx.lineTo(450, 140); ctx.stroke(); ctx.restore();
    label(ctx, '8633 公尺（圖中縮短）', 520, 100, { align: 'center', size: 12, color: '#B0BEC5' });
    ctx.fillStyle = '#ECEFF1'; ctx.fillRect(700, 90, 8, 60); label(ctx, '鏡子', 704, 166, { align: 'center', size: 12, color: '#ECEFF1' });
    // 回來的光（亮度）
    const b = bright();
    ray(ctx, 690, 128, 150, 128, `rgba(255,152,0,${0.15 + 0.85 * b})`, 2, 0.5);
    ray(ctx, 150, 128, 150, 210, `rgba(255,152,0,${0.15 + 0.85 * b})`, 2, 0.6);
    ctx.font = '26px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('👁️', 150, 228);
    ctx.fillStyle = `rgba(255,200,0,${b})`; ctx.beginPath(); ctx.arc(330, 226, 14, 0, 7); ctx.fill(); ctx.strokeStyle = '#FFB300'; ctx.stroke();
    label(ctx, '眼睛看到的亮度', 352, 226, { size: 12, color: '#FFE082' });
  }
  function info() {
    const ph = phase(), t = 2 * D / C_LIGHT;
    document.getElementById('l2fR').innerHTML = `<div><span>光來回時間</span><b>${fmt(t * 1e6, 1)} 微秒</b></div><div><span>這段時間齒輪轉過</span><b>${fmt(ph, 2)} 個齒距</b></div>
      <div><span>回來的光</span><b>${bright() < 0.08 ? '⚫ 被擋住（全黑）' : bright() > 0.9 ? '🔆 穿過齒縫' : '🌗 部分被擋'}</b></div>`;
  }
  const lp = loop(dt => { ang += +RV.value * dt * 0.15; draw(); });
  document.getElementById('l2fCalc').onclick = () => {
    const rv = +RV.value; if (!rv) return;
    const c = 4 * N * D * rv;
    document.getElementById('l2fTxt').innerHTML = `你在 <b>${fmt(rv, 1)} 圈／秒</b> 看到第一次全黑。齒輪轉過半個齒距的時間＝1 ÷ (720×2×${fmt(rv, 1)}) 秒，這就是光來回 2×8633 公尺的時間：<br>光速 ＝ 2×8633 ÷ 時間 ＝ 4×720×8633×${fmt(rv, 1)} ≈ <b>${fmt(c / 1e8, 2)}×10⁸ m/s</b>` +
      (Math.abs(c - C_LIGHT) / C_LIGHT < 0.04 ? '　✅ 很接近 3×10⁸ m/s！（斐索當年得到約 3.13×10⁸ m/s）' : '　🤔 好像還沒找到「第一次全黑」，再慢慢調調看（約 12 圈／秒）。');
  };
  registerSim('t2', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ④ 光要走多久 ---------- */
(() => {
  const host = document.getElementById('l2calc'); if (!host) return;
  const LY = 9.46e15;
  const L = [
    ['🚄 臺北到高雄', 3.5e5], ['🌏 繞地球赤道一圈', 4.0e7], ['🌕 地球到月球', 3.84e8], ['☀️ 地球到太陽', 1.5e11],
    ['🔴 地球到火星（最近時）', 5.6e10], ['🔵 地球到海王星', 4.5e12], ['⭐ 比鄰星（最近的恆星）', 4.24 * LY], ['✨ 織女星', 25 * LY], ['🌌 仙女座星系', 2.5e6 * LY],
  ];
  const tf = s => s < 1 ? fmt(s * 1000, 2) + ' 毫秒' : s < 120 ? fmt(s, 2) + ' 秒' : s < 7200 ? fmt(s / 60, 1) + ' 分鐘' : s < 3.15e7 * 2 ? fmt(s / 3600, 1) + ' 小時' : fmt(s / 3.15e7, 1).toString() + ' 年';
  host.innerHTML = L.map((x, i) => `<button class="chip" data-i="${i}">${x[0]}</button>`).join('');
  $$('.chip', host).forEach(c => c.onclick = () => {
    $$('.chip', host).forEach(x => x.classList.toggle('on', x === c));
    const [n, d] = L[+c.dataset.i], s = d / C_LIGHT, car = d / 30;   // 車速約 30 m/s（108 km/h）
    document.getElementById('l2calcR').innerHTML = `<div><span>距離</span><b>${d >= 1e15 ? fmt(d / LY, 2) + ' 光年' : fmt(d / 1000, 0) + ' 公里'}</b></div>
      <div><span>光要走</span><b>${tf(s)}</b></div><div><span>開車（108 km/h）要</span><b>${tf(car)}</b></div>`;
  });
})();

/* ===== 分頁 4 補充：接雞蛋挑戰 =====
   雞蛋 60 g 從 h 落下，用「緩衝距離 s」讓它停下。
   接住時：平均阻力 F × s ＝ 雞蛋的動能＋緩衝時重力再作的功 ＝ mg(h + s) → F ＝ mg(h + s) / s
   模擬設定：平均受力超過 25 N 雞蛋就破（真實雞蛋因方向、大小而不同） */
(() => {
  const cv = document.getElementById('c3egg'); if (!cv) return;
  const S = stage(cv, 760, 320), ctx = S.ctx;
  const M = 0.06, LIMIT = 25, TOP = 30, GY = 280, PX = 70;
  let y = 0, v = 0, phase = 'ready', sNow = 0, broke = false;
  const hEl = bindRange('c3eh', v => v + ' m', reset), sEl = bindRange('c3es', v => v + ' cm', reset);
  $$('#c3ePre .chip').forEach(c => c.onclick = () => { sEl.value = c.dataset.s; sEl.dispatchEvent(new Event('input')); $$('#c3ePre .chip').forEach(x => x.classList.toggle('on', x === c)); });
  const h = () => +hEl.value, s = () => sEl.value / 100;
  const force = () => M * G * (h() + s()) / s();
  function reset() { phase = 'ready'; y = 0; v = 0; sNow = 0; broke = false; draw(); info(); }
  function step(dt) {
    if (phase === 'fall') {
      dt *= 0.5; v += G * dt; y += v * dt;
      if (y >= h()) { y = h(); phase = 'catch'; }
    } else if (phase === 'catch') {
      dt *= 0.25;
      const a = (force() - M * G) / M;           // 減速度
      v = Math.max(0, v - a * dt); sNow += v * dt;
      if (v <= 0 || sNow >= s()) { sNow = s(); phase = 'done'; broke = force() > LIMIT; info(); }
    }
    draw();
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const hy = TOP + h() * PX;          // 手（接住點）的初始高度
    const cushion = s() * PX * 4;       // 緩衝距離放大 4 倍顯示
    // 高度刻度
    for (let k = 0; k <= 3; k += 0.5) label(ctx, `${k} m`, 40, hy - k * PX, { align: 'right', size: 11, color: '#90A4AE' });
    ctx.strokeStyle = '#CFD8DC'; ctx.beginPath(); ctx.moveTo(44, TOP); ctx.lineTo(44, hy); ctx.stroke();
    // 手／墊子
    const handY = hy + sNow * PX * 4;
    ctx.fillStyle = 'rgba(255,183,77,.25)'; ctx.fillRect(170, hy, 140, cushion);
    label(ctx, `緩衝距離 ${sEl.value} cm（圖放大 4 倍）`, 320, hy + cushion / 2, { size: 12, color: '#E65100' });
    ctx.fillStyle = '#FFB74D'; rrect(ctx, 190, handY, 100, 14, 7); ctx.fill();
    label(ctx, '🤲 手／墊子', 240, handY + 26, { align: 'center', size: 13 });
    // 蛋
    const ey = phase === 'ready' ? TOP : phase === 'fall' ? TOP + y * PX : handY;
    ctx.save(); ctx.translate(240, ey - 20);
    if (broke) {
      ctx.fillStyle = '#FFD54F'; ctx.beginPath(); ctx.ellipse(0, 14, 34, 8, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#FFF8E1'; ctx.beginPath(); ctx.moveTo(-20, 12); ctx.lineTo(-10, 0); ctx.lineTo(-4, 10); ctx.lineTo(6, -2); ctx.lineTo(14, 12); ctx.fill();
    } else { ctx.fillStyle = '#FFF8E1'; ctx.strokeStyle = '#BCAAA4'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, 14, 19, 0, 0, 7); ctx.fill(); ctx.stroke(); }
    ctx.restore();
    // 右側：力的比較
    const F = force();
    const x0 = 470, w = 260, bh = 30;
    label(ctx, '接住時，手對蛋的平均力', x0, 50, { size: 14, bold: true });
    const sc = w / Math.max(60, F * 1.1);
    ctx.fillStyle = '#E0E0E0'; ctx.fillRect(x0, 70, w, bh);
    ctx.fillStyle = F > LIMIT ? '#E53935' : '#43A047'; ctx.fillRect(x0, 70, Math.min(w, F * sc), bh);
    ctx.strokeStyle = '#B71C1C'; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(x0 + LIMIT * sc, 62); ctx.lineTo(x0 + LIMIT * sc, 108); ctx.stroke(); ctx.setLineDash([]);
    label(ctx, '蛋殼極限', x0 + LIMIT * sc, 118, { align: 'center', size: 12, color: '#B71C1C' });
    label(ctx, `${fmt(F, 1)} N`, x0 + Math.min(w, F * sc) - 6, 85, { align: 'right', size: 14, bold: true, color: '#fff' });
    const msg = phase !== 'done' ? '' : broke ? '💥 破了！' : '🥚 成功接住！';
    if (msg) label(ctx, msg, x0 + w / 2, 170, { align: 'center', size: 26, bold: true, color: broke ? '#C62828' : '#2E7D32' });
  }
  function info() {
    const KE = M * G * h(), F = force();
    document.getElementById('c3eggR').innerHTML = `
      <div><span>蛋落到手上時的動能</span><b>${fmt(KE, 2)} J</b></div>
      <div><span>緩衝距離 S</span><b>${sEl.value} cm</b></div>
      <div><span>手的平均力 F ≈ 動能 ÷ S</span><b style="color:${F > LIMIT ? 'var(--bad)' : 'var(--ok)'}">${fmt(F, 1)} N</b></div>`;
  }
  document.getElementById('c3eggGo').onclick = () => { reset(); phase = 'fall'; };
  onG(() => { draw(); info(); });
  const lp = loop(step);
  registerSim('t4', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

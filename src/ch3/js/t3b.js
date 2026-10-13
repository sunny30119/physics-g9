/* ===== 分頁 3 補充：煞車距離模擬 =====
   反應距離 = v × 反應時間；煞車距離 = v² / (2μg)（摩擦力作負功吃掉動能）*/
(() => {
  const cv = document.getElementById('c3brake'); if (!cv) return;
  const S = stage(cv, 760, 230), ctx = S.ctx;
  const X0 = 70, GY = 160;
  let PX = 5.6, RANGE = 120;   // 依停止距離自動調整比例，最少畫到 120 m
  let mu = 0.7, t = 0, run = false, res = null;
  const sp = bindRange('c3bv', v => v + ' km/h', reset), rt = bindRange('c3brt', v => v + ' 秒', reset), pd = bindRange('c3bd', v => v + ' m', reset);
  $$('#c3broad .chip').forEach(c => c.onclick = () => { mu = +c.dataset.mu; $$('#c3broad .chip').forEach(x => x.classList.toggle('on', x === c)); reset(); });
  $$('#c3brtPre .chip').forEach(c => c.onclick = () => { rt.value = c.dataset.t; rt.dispatchEvent(new Event('input')); });
  const v0 = () => sp.value / 3.6;
  const calc = () => { const v = v0(), dr = v * rt.value, db = v * v / (2 * mu * G); return { v, dr, db, tot: dr + db, tb: v / (mu * G) }; };
  function reset() { t = 0; run = false; res = null; draw(); info(); }
  function pos(tt) {
    const c = calc();
    if (tt <= rt.value) return { x: c.v * tt, v: c.v, ph: '反應中' };
    const tb = tt - rt.value;
    if (tb >= c.tb) return { x: c.tot, v: 0, ph: '停止' };
    return { x: c.dr + c.v * tb - 0.5 * mu * G * tb * tb, v: c.v - mu * G * tb, ph: '煞車中' };
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const c = calc(), p = pos(t), ped = +pd.value;
    RANGE = Math.max(120, Math.ceil((Math.max(c.tot, ped) + 10) / 20) * 20); PX = 660 / RANGE;
    const hit = c.tot > ped;
    ctx.fillStyle = mu < 0.5 ? '#546E7A' : '#616161'; ctx.fillRect(0, GY - 50, S.W, 70);
    ctx.fillStyle = '#FFF'; for (let x = 0; x < S.W; x += 40) ctx.fillRect(x, GY - 16, 22, 3);
    if (mu < 0.5) label(ctx, '🌧 路面濕滑', 12, GY - 62, { size: 13, bold: true, color: '#455A64' });
    for (let m = 0; m <= RANGE; m += RANGE > 160 ? 40 : 20) label(ctx, m + ' m', X0 + m * PX, GY + 34, { align: 'center', size: 12, color: '#607D8B' });
    // 反應距離、煞車距離色帶（播完才顯示）
    if (p.ph === '停止' || !run && t > 0) {
      ctx.fillStyle = 'rgba(255,193,7,.55)'; ctx.fillRect(X0, GY + 8, c.dr * PX, 8);
      ctx.fillStyle = 'rgba(244,67,54,.55)'; ctx.fillRect(X0 + c.dr * PX, GY + 8, c.db * PX, 8);
      label(ctx, `反應 ${fmt(c.dr, 1)} m`, X0 + c.dr * PX / 2, GY + 50, { align: 'center', size: 12, color: '#8D6E00', bold: true });
      label(ctx, `煞車 ${fmt(c.db, 1)} m`, X0 + (c.dr + c.db / 2) * PX, GY + 50, { align: 'center', size: 12, color: '#B71C1C', bold: true });
    }
    // 行人
    const px = X0 + ped * PX;
    ctx.save(); ctx.strokeStyle = '#FFEB3B'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(px, GY - 46, 6, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(px, GY - 40); ctx.lineTo(px, GY - 22); ctx.lineTo(px - 6, GY - 8); ctx.moveTo(px, GY - 22); ctx.lineTo(px + 6, GY - 8); ctx.stroke(); ctx.restore();
    label(ctx, '🚸 行人', px, GY - 64, { align: 'center', size: 12, bold: true, color: '#F57F17', bg: '#FFFDE7' });
    // 車
    const cx = X0 + Math.min(p.x, hit ? ped : RANGE) * PX;
    if (hit && p.x >= ped) label(ctx, '💥', X0 + ped * PX, GY - 30, { align: 'center', size: 30 });
    ctx.fillStyle = '#1E88E5'; rrect(ctx, cx - 44, GY - 40, 44, 22, 5); ctx.fill();
    ctx.fillStyle = '#90CAF9'; rrect(ctx, cx - 36, GY - 50, 26, 12, 4); ctx.fill();
    ctx.fillStyle = '#212121'; [cx - 36, cx - 10].forEach(x => { ctx.beginPath(); ctx.arc(x, GY - 16, 6, 0, 7); ctx.fill(); });
    if (p.ph === '反應中' && t > 0) label(ctx, '😮 看到了…', cx - 22, GY - 66, { align: 'center', size: 12, bg: '#fff' });
    if (p.ph === '煞車中') label(ctx, '🛑 踩煞車！', cx - 22, GY - 66, { align: 'center', size: 12, bg: '#FFEBEE', color: '#C62828', bold: true });
    label(ctx, `車速 ${fmt(p.v * 3.6, 0)} km/h｜${t > 0 ? p.ph : '準備'}`, 12, 16, { size: 14, bold: true });
  }
  function info() {
    const c = calc(), ped = +pd.value, hit = c.tot > ped;
    let hv = 0;
    if (hit) { // 撞到時的速率
      if (ped <= c.dr) hv = c.v; else { const d = ped - c.dr; hv = Math.sqrt(Math.max(0, c.v * c.v - 2 * mu * G * d)); }
    }
    document.getElementById('c3brakeR').innerHTML = `
      <div><span>反應距離（還沒踩煞車）</span><b>${fmt(c.dr, 1)} m</b></div>
      <div><span>煞車距離</span><b>${fmt(c.db, 1)} m</b></div>
      <div><span>停止距離（合計）</span><b>${fmt(c.tot, 1)} m</b></div>
      <div><span>結果</span><b style="color:${hit ? 'var(--bad)' : 'var(--ok)'}">${hit ? `撞上！撞擊時速 ${fmt(hv * 3.6, 0)} km/h` : `停住了，離行人 ${fmt(ped - c.tot, 1)} m`}</b></div>`;
  }
  document.getElementById('c3brakeGo').onclick = () => { t = 0; run = true; };
  onG(() => { if (S) { draw(); info(); } });
  const lp = loop(dt => { if (!run) return; t += dt; const c = calc(); if (t > rt.value + c.tb + 0.3) run = false; draw(); });
  registerSim('t3', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

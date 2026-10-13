/* ===== 分頁 3：動能 =====
   黏土牆實驗：球以 v 射入黏土，黏土阻力固定 FR = 50 N → 坑深 d = ½mv² / FR */
(() => {
  const cv = document.getElementById('c3clay'); if (!cv) return;
  const S = stage(cv, 760, 230), ctx = S.ctx;
  const FR = 50, WALL = 360, PXD = 330;   // 黏土牆位置、坑深 1 m = 330 px
  let x = 60, v = 0, phase = 'ready', dFinal = 0, recs = [];
  const m = bindRange('c3cm', v => v + ' kg', reset), vv = bindRange('c3cv', v => v + ' m/s', reset);
  const deepOn = () => document.body.dataset.mode !== 'stu';
  const R = mm => 12 + mm * 5;
  function reset() { phase = 'ready'; x = 60; v = 0; draw(); }
  function step(dt) {
    if (phase === 'fly') {
      x += v * 90 * dt;                      // 飛行段放慢顯示
      if (x + R(+m.value) >= WALL) { x = WALL - R(+m.value); phase = 'dig'; }
    } else if (phase === 'dig') {
      const mm = +m.value, a = FR / mm;
      const nv = Math.max(0, v - a * dt * 0.6);  // 慢動作
      x += (v + nv) / 2 * dt * 0.6 * PXD;
      v = nv;
      if (v <= 0) { phase = 'done'; dFinal = 0.5 * mm * vv.value ** 2 / FR; x = WALL - R(mm) + dFinal * PXD; }
    }
    draw();
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const mm = +m.value, r = R(mm), cy = 120;
    // 黏土
    ctx.fillStyle = '#B07A4A'; ctx.fillRect(WALL, 30, S.W - WALL - 10, 180);
    ctx.fillStyle = 'rgba(0,0,0,.08)'; for (let i = 0; i < 40; i++) ctx.fillRect(WALL + (i * 53) % (S.W - WALL - 20), 34 + (i * 37) % 170, 6, 3);
    label(ctx, '軟黏土牆', WALL + 10, 44, { size: 13, color: '#fff', bold: true });
    // 刻度
    for (let k = 0; k <= 10; k++) { const xx = WALL + k * 0.1 * PXD; if (xx > S.W - 12) break; ctx.fillStyle = '#fff'; ctx.fillRect(xx, 200, 1.5, k % 5 ? 6 : 10); if (k % 5 === 0) label(ctx, (k * 10) + ' cm', xx + 2, 190, { size: 12, color: '#fff' }); }
    // 坑
    const depth = Math.max(0, x + r - WALL);
    if (depth > 0) { ctx.fillStyle = '#5E3B1E'; ctx.beginPath(); ctx.moveTo(WALL, cy - r - 2); ctx.lineTo(WALL + depth - r, cy - r - 2); ctx.arc(WALL + depth - r, cy, r + 2, -Math.PI / 2, Math.PI / 2); ctx.lineTo(WALL, cy + r + 2); ctx.fill(); }
    // 球
    const g = ctx.createRadialGradient(x - r / 3, cy - r / 3, 2, x, cy, r);
    g.addColorStop(0, '#E0E6EE'); g.addColorStop(1, '#55606E');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, cy, r, 0, 7); ctx.fill();
    label(ctx, mm + ' kg', x, cy, { align: 'center', size: 12, color: '#fff', bold: true });
    if (phase === 'ready') arrow(ctx, x + r + 4, cy, x + r + 30 + vv.value * 12, cy, '#1565C0', 3, 10);
    label(ctx, phase === 'ready' ? `速率 ${vv.value} m/s →` : phase === 'done' ? `坑深 ${fmt(dFinal * 100, 1)} cm` : '', phase === 'done' ? WALL + depth / 2 : 40, phase === 'done' ? cy + r + 30 : cy - r - 20, { size: 15, bold: true, color: phase === 'done' ? '#fff' : '#1565C0', bg: phase === 'done' ? 'rgba(0,0,0,.5)' : null });
  }
  function table() {
    const tb = document.getElementById('c3clayT');
    $$('#c3clay ~ * th.dp, th.dp').forEach(th => th.style.display = deepOn() ? '' : 'none');
    if (!recs.length) { tb.innerHTML = '<tr><td colspan="5" class="note">按「記錄這一次」把結果加進表格</td></tr>'; return; }
    tb.innerHTML = recs.map((r, i) => `<tr><td>${i + 1}</td><td>${r.m} kg</td><td>${r.v} m/s</td><td><b>${fmt(r.d * 100, 1)} cm</b></td><td style="${deepOn() ? '' : 'display:none'}">${fmt(0.5 * r.m * r.v * r.v, 2)} J</td></tr>`).join('');
    if (recs.length >= 2) {
      const a = recs[recs.length - 2], b = recs[recs.length - 1];
      let s = '';
      if (a.m === b.m && a.v !== b.v) s = `質量不變，速率變成 <b>${fmt(b.v / a.v, 2)}</b> 倍 → 坑深變成 <b>${fmt(b.d / a.d, 2)}</b> 倍。${Math.abs(b.d / a.d - (b.v / a.v) ** 2) < 0.01 ? '（正好是速率倍數的<b>平方</b>！）' : ''}`;
      else if (a.v === b.v && a.m !== b.m) s = `速率不變，質量變成 <b>${fmt(b.m / a.m, 2)}</b> 倍 → 坑深變成 <b>${fmt(b.d / a.d, 2)}</b> 倍。（和質量成正比）`;
      else s = '想看出規律，每次只改變<b>一個</b>變因（控制變因）。';
      document.getElementById('c3clayTxt').innerHTML = s;
    }
  }
  document.getElementById('c3clayGo').onclick = () => { x = 60; v = +vv.value; phase = 'fly'; };
  document.getElementById('c3clayRec').onclick = () => {
    const d = 0.5 * m.value * vv.value ** 2 / FR;
    recs.push({ m: +m.value, v: +vv.value, d });
    if (phase !== 'done') { phase = 'done'; dFinal = d; x = WALL - R(+m.value) + d * PXD; draw(); }
    table();
  };
  document.getElementById('c3clayClr').onclick = () => { recs = []; table(); };
  $$('#modeSeg button').forEach(b => b.addEventListener('click', table));
  const lp = loop(step);
  registerSim('t3', { start() { draw(); table(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- 比比看動能 ---------- */
(() => {
  const host = document.getElementById('c3kesort'); if (!host) return;
  mountSort(host, ['甲較大', '乙較大', '一樣大'], [
    ['甲：1 kg 的球，速率 4 m/s｜乙：2 kg 的球，速率 2 m/s', 0, '比「質量 × 速率²」：甲 1×4²＝16，乙 2×2²＝8。速率影響比較大，甲的動能是乙的 2 倍。'],
    ['甲：2 kg 的球，速率 3 m/s｜乙：2 kg 的球，速率 3 m/s，但方向相反', 2, '動能只看速率大小，不看方向（動能沒有方向）。'],
    ['甲：一輛停著的卡車｜乙：一隻飛行中的蚊子', 1, '停著的卡車速率是 0，動能是 0；蚊子再小，只要在動就有動能。'],
    ['甲：4 kg 的球，速率 1 m/s｜乙：1 kg 的球，速率 2 m/s', 2, '比「質量 × 速率²」：甲 4×1²＝4，乙 1×2²＝4，一樣大。速率 2 倍讓動能變 4 倍，剛好抵消質量 4 倍。'],
    ['甲：時速 60 公里的機車（連人 200 kg）｜乙：時速 30 公里的機車（連人 200 kg）', 0, '質量一樣，甲的速率是 2 倍，動能是 4 倍。'],
  ]);
})();

/* ===== 分頁 7：力學能守恆 =====
   ① 單擺：擺長 L＝2.5 m、擺錘 2 kg，可拖曳；可開空氣阻力（力學能 → 熱）
   ② 雲霄飛車設計師：三座山，用力學能守恆算速率；有摩擦時每走 1 m 損失固定能量 */
(() => {
  const cv = document.getElementById('c3swing'); if (!cv) return;
  const S = stage(cv, 540, 360), ctx = S.ctx;
  const PIV = [180, 30], L = 2.5, PXM = 100, M = 2;
  let th = 0, om = 0, run = false, drag = false, fric = 0, heat = 0, E0 = 0;
  const h = a => L * (1 - Math.cos(a));            // 相對最低點的高度
  function start(a) { th = a; om = 0; heat = 0; E0 = M * G * h(a); run = true; }
  function step(dt) {
    if (!run) return;
    const sub = 10; dt = dt * 0.8 / sub;
    for (let i = 0; i < sub; i++) {
      const before = M * G * h(th) + 0.5 * M * (om * L) ** 2;
      let al = -G / L * Math.sin(th);
      if (fric) al -= 0.12 * om;
      om += al * dt; th += om * dt;
      const after = M * G * h(th) + 0.5 * M * (om * L) ** 2;
      if (fric && after < before) heat += before - after;
    }
    draw(); info();
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#6D4C41'; ctx.fillRect(PIV[0] - 70, PIV[1] - 10, 140, 8);
    const bx = PIV[0] + Math.sin(th) * L * PXM, by = PIV[1] + Math.cos(th) * L * PXM;
    // 出發高度虛線
    if (E0 > 0) { const hy = PIV[1] + L * PXM - (E0 / (M * G)) * PXM; ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = '#E65100'; ctx.beginPath(); ctx.moveTo(10, hy); ctx.lineTo(350, hy); ctx.stroke(); ctx.restore(); label(ctx, '出發高度', 12, hy - 9, { size: 12, color: '#E65100' }); }
    const lowY = PIV[1] + L * PXM; ctx.strokeStyle = '#CFD8DC'; ctx.beginPath(); ctx.moveTo(10, lowY + 18); ctx.lineTo(350, lowY + 18); ctx.stroke();
    ctx.strokeStyle = '#455A64'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...PIV); ctx.lineTo(bx, by); ctx.stroke();
    const g = ctx.createRadialGradient(bx - 5, by - 5, 2, bx, by, 16); g.addColorStop(0, '#FFE082'); g.addColorStop(1, '#F57F17');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, 16, 0, 7); ctx.fill();
    if (!run && th === 0) label(ctx, '👆 拖曳擺錘', bx + 22, by, { size: 13, color: '#66736E' });
    const U = M * G * h(th), K = 0.5 * M * (om * L) ** 2;
    const max = Math.max(E0, 1) * 1.1;
    const items = [{ name: '位能', val: U, color: '#8E24AA' }, { name: '動能', val: K, color: '#1E88E5' }, { name: '力學能', val: U + K, color: '#F9A825' }];
    if (fric) items.push({ name: '熱能', val: heat, color: '#E53935' });
    // 長條（直式、窄版）
    const x0 = 360, bw = fric ? 36 : 46, gap = 8, top = 50, hh = 250;
    items.forEach((it, i) => {
      const x = x0 + i * (bw + gap); ctx.fillStyle = '#ECEFF1'; ctx.fillRect(x, top, bw, hh);
      const vh = hh * Math.max(0, it.val) / max; ctx.fillStyle = it.color; ctx.fillRect(x, top + hh - vh, bw, vh);
      label(ctx, it.name, x + bw / 2, top + hh + 16, { align: 'center', size: 14, bold: true, color: it.color === '#F9A825' ? '#B26A00' : it.color });
    });
    label(ctx, '能量長條', 445, 34, { align: 'center', size: 14, bold: true });
  }
  function info() {
    const U = M * G * h(th), K = 0.5 * M * (om * L) ** 2;
    document.getElementById('c3swR').innerHTML = `
      <div><span>離最低點高度</span><b>${fmt(h(th), 2)} m</b></div>
      <div><span>速率</span><b>${fmt(Math.abs(om * L), 2)} m/s</b></div>
      <div><span>位能＋動能</span><b>${fmt(U + K, 1)} J</b></div>
      ${fric ? `<div><span>變成熱能</span><b>${fmt(heat, 1)} J</b></div>` : ''}`;
    if (run) document.getElementById('c3swTxt').innerHTML = fric
      ? '有空氣阻力：力學能（黃）慢慢變少，變成了<b>熱能</b>（紅）。但黃＋紅＝一開始的能量！（下一頁的能量守恆）'
      : '沒有阻力：位能（紫）和動能（藍）此消彼長，<b>力學能（黃）始終不變</b>，擺錘每次都回到出發的高度。';
  }
  cv.addEventListener('pointerdown', e => { const p = S.pt(e); const bx = PIV[0] + Math.sin(th) * L * PXM, by = PIV[1] + Math.cos(th) * L * PXM; if (Math.hypot(p.x - bx, p.y - by) < 40) { drag = true; run = false; cv.setPointerCapture(e.pointerId); } });
  cv.addEventListener('pointermove', e => { if (!drag) return; const p = S.pt(e); th = clamp(Math.atan2(p.x - PIV[0], p.y - PIV[1]), -1.4, 1.4); om = 0; E0 = M * G * h(th); heat = 0; draw(); info(); });
  cv.addEventListener('pointerup', () => { if (drag) { drag = false; start(th); } });
  $$('#c3swFric .chip').forEach(c => c.onclick = () => {
    fric = +c.dataset.f; $$('#c3swFric .chip').forEach(x => x.classList.toggle('on', x === c));
    if (run) { E0 = M * G * h(th) + 0.5 * M * (om * L) ** 2; heat = 0; } else start(th || -Math.PI / 3);   // 擺動中切換：從當下繼續，熱能從 0 開始算
  });
  document.getElementById('c3swGo').onclick = () => start(-Math.PI / 3);
  document.getElementById('c3swStop').onclick = () => { run = false; };
  onG(() => { draw(); info(); });
  const lp = loop(step);
  registerSim('t7', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- 雲霄飛車設計師 ---------- */
(() => {
  const cv = document.getElementById('c3coaster'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const GY = 270, PY = 4.6, LOSS = 0.5;   // 1 m 高 = 4.6 px；有摩擦時每前進 1 m 損失 0.5 J/kg
  const h1 = bindRange('c3h1', v => v + ' m', reset), h2 = bindRange('c3h2', v => v + ' m', reset), h3 = bindRange('c3h3', v => v + ' m', reset);
  let fric = 0, x = 0, dir = 1, run = false, e = 0, status = '', maxX = 0, stopT = 0;
  const XS = [40, 160, 290, 420, 550, 680, 740];   // 山頂、谷、山頂、谷、山頂、谷、終點
  const MPX = 0.33;                                 // 水平 1 px ≈ 0.33 m
  const ys = () => [+h1.value, 3, +h2.value, 3, +h3.value, 3, 3];
  function height(px) {
    const Y = ys();
    for (let i = 0; i < XS.length - 1; i++) if (px <= XS[i + 1]) { const t = (px - XS[i]) / (XS[i + 1] - XS[i]); return Y[i] + (Y[i + 1] - Y[i]) * (1 - Math.cos(Math.PI * t)) / 2; }
    return 3;
  }
  function reset() { run = false; x = XS[0] + 1; dir = 1; e = G * +h1.value; status = ''; maxX = x; document.getElementById('c3cTxt').innerHTML = '🎯 挑戰：在「有摩擦」的情況下，讓車子<b>剛好</b>通過第 3 座山。'; draw(); info(); }
  function step(dt) {
    if (!run) return;
    dt *= 1.2;
    const sub = 20;
    for (let i = 0; i < sub; i++) {
      const hgt = height(x), v2 = 2 * (e - G * hgt);
      if (v2 <= 0) {   // 爬不上去 → 回頭（之後在山谷間來回）
        dir = -dir; x += dir * 0.5;
        if (x > XS[0] + 5) status = 'stuck';
        if (fric && e < G * 3 + 0.3) { run = false; break; }
        continue;
      }
      const v = Math.sqrt(v2), slope = (height(x + 0.5) - height(x - 0.5)) / (1 * MPX);
      const dxm = v * dt / sub / Math.sqrt(1 + slope * slope);
      x += dir * dxm / MPX;
      if (fric) e -= LOSS * dxm;
      maxX = Math.max(maxX, x);
      if (x >= XS[XS.length - 1] - 2) { run = false; status = 'done'; break; }
      if (x <= XS[0]) { x = XS[0]; dir = 1; }
    }
    draw(); info();
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    // 軌道
    ctx.fillStyle = '#E3F2FD'; ctx.beginPath(); ctx.moveTo(XS[0], GY);
    for (let px = XS[0]; px <= 740; px += 4) ctx.lineTo(px, GY - height(px) * PY);
    ctx.lineTo(740, GY); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 4; ctx.beginPath();
    for (let px = XS[0]; px <= 740; px += 4) { const y = GY - height(px) * PY; px === XS[0] ? ctx.moveTo(px, y) : ctx.lineTo(px, y); }
    ctx.stroke();
    // 出發高度（可用的力學能）
    const eh = (run || status ? e : G * +h1.value) / G;
    ctx.save(); ctx.setLineDash([6, 4]); ctx.strokeStyle = '#F9A825'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, GY - eh * PY); ctx.lineTo(750, GY - eh * PY); ctx.stroke(); ctx.restore();
    label(ctx, `目前力學能能到達的最高高度 ${fmt(eh, 1)} m`, 750, GY - eh * PY + 14, { align: 'right', size: 12, color: '#E65100', bg: 'rgba(255,255,255,.8)' });
    [[XS[0], h1], [XS[2], h2], [XS[4], h3]].forEach(([px, el], i) => label(ctx, `${i + 1}：${el.value} m`, px, GY - el.value * PY - 16, { align: 'center', size: 13, bold: true }));
    // 車
    const cy = GY - height(x) * PY, sl = (height(x + 2) - height(x - 2)) * PY / 4;
    ctx.save(); ctx.translate(x, cy); ctx.rotate(-Math.atan(sl));
    ctx.fillStyle = '#1565C0'; rrect(ctx, -16, -18, 32, 14, 4); ctx.fill();
    ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(-9, -3, 4, 0, 7); ctx.arc(9, -3, 4, 0, 7); ctx.fill(); ctx.restore();
    if (status === 'done') label(ctx, '🎉 跑完全程！', 600, 40, { align: 'center', size: 20, bold: true, color: '#2E7D32' });
    if (status === 'stuck') label(ctx, '😱 卡住了，爬不過去！', 560, 40, { align: 'center', size: 20, bold: true, color: '#C62828' });
  }
  function info() {
    const hgt = height(x), v = Math.sqrt(Math.max(0, 2 * (e - G * hgt)));
    document.getElementById('c3cR').innerHTML = `
      <div><span>目前高度</span><b>${fmt(hgt, 1)} m</b></div>
      <div><span>速率</span><b>${fmt(v * 3.6, 0)} km/h</b></div>
      <div><span>每公斤的力學能</span><b>${fmt(e, 0)} J</b></div>`;
    const t = document.getElementById('c3cTxt');
    if (status === 'stuck') t.innerHTML = `車子的力學能只夠爬到 <b>${fmt(e / G, 1)} m</b> 高，前面的山<b>不比這個高度矮</b>，所以爬不過去、又滑回來。${fric ? '有摩擦時，力學能一路被消耗，後面的山要比第 1 座矮更多。' : '沒有摩擦時，後面的山必須<b>比第 1 座矮</b>（等高的話，車子到山頂速率剛好變 0，會停在那裡過不去）。'}`;
    else if (status === 'done') t.innerHTML = fric ? '成功！注意黃色虛線（可用的力學能）一路下降——摩擦把力學能變成了熱。' : '成功！沒有摩擦時，黃色虛線一直和出發點一樣高：<b>力學能守恆</b>。';
  }
  $$('#c3cFric .chip').forEach(c => c.onclick = () => { fric = +c.dataset.f; $$('#c3cFric .chip').forEach(x => x.classList.toggle('on', x === c)); reset(); });
  document.getElementById('c3cGo').onclick = () => { reset(); stopT = 0; run = true; };
  onG(reset);
  const lp = loop(step);
  registerSim('t7', { start() { reset(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

onG(g => { const v = fmt(30 * g * 0.8, 1); ['c3ex7', 'c3ex7b'].forEach(id => { const e = document.getElementById(id); if (e) e.textContent = v; }); });

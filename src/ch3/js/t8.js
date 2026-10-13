/* ===== 分頁 8：能量守恆 =====
   ① 焦耳槳輪：ΔT ＝ mgh ÷ (水的質量 × 4186)；可連續落下
   ② 彈跳球：每次落地保留 k 倍力學能
   ③ 能量轉換鏈遊戲 */
(() => {
  const cv = document.getElementById('c3joule'); if (!cv) return;
  const S = stage(cv, 760, 320), ctx = S.ctx;
  const C = 4186, T0 = 25;
  let drops = 0, prog = 0, run = false, queue = 0, ang = 0;
  const mEl = bindRange('c3jm', v => v + ' kg', reset), hEl = bindRange('c3jh', v => v + ' m', reset), wEl = bindRange('c3jw', v => v + ' kg', reset);
  const perDrop = () => mEl.value * G * hEl.value;
  const dT = () => drops * perDrop() / (wEl.value * C) + (run ? prog * perDrop() / (wEl.value * C) : 0);
  function reset() { drops = 0; prog = 0; run = false; queue = 0; draw(); info(); }
  function step(dt) {
    if (!run) return;
    prog += dt * 0.7; ang += dt * 14;
    if (prog >= 1) { prog = 0; drops++; if (--queue > 0) run = true; else run = false; info(); }
    draw();
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const cx = 260, top = 40;
    // 容器
    ctx.fillStyle = '#B0BEC5'; rrect(ctx, cx - 70, 150, 140, 140, 8); ctx.fill();
    ctx.fillStyle = '#4FC3F7'; ctx.globalAlpha = 0.7; rrect(ctx, cx - 62, 170, 124, 112, 6); ctx.fill(); ctx.globalAlpha = 1;
    // 葉片（旋轉）
    ctx.save(); ctx.translate(cx, 225); ctx.strokeStyle = '#37474F'; ctx.lineWidth = 6;
    for (let k = 0; k < 4; k++) { const a = ang + k * Math.PI / 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 46, Math.sin(a) * 14); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = '#37474F'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, 225); ctx.lineTo(cx, 80); ctx.stroke();
    // 轉軸與繩、滑輪、重錘
    ctx.fillStyle = '#795548'; ctx.fillRect(cx - 18, 64, 36, 22);
    [-1, 1].forEach(sd => {
      const px = cx + sd * 170, py = top + 20;
      ctx.strokeStyle = '#8D6E63'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx + sd * 18, 72); ctx.lineTo(px, py - 10); ctx.stroke();
      ctx.fillStyle = '#9E9E9E'; ctx.beginPath(); ctx.arc(px, py, 12, 0, 7); ctx.fill();
      const wy = py + 30 + (run ? prog : 0) * 120;
      ctx.beginPath(); ctx.moveTo(px + sd * 12, py); ctx.lineTo(px + sd * 12, wy); ctx.stroke();
      box(ctx, px + sd * 12 - 18, wy, 36, 40, '#455A64', fmt(mEl.value / 2, 1) + 'kg');
    });
    ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = '#90A4AE';
    ctx.beginPath(); ctx.moveTo(cx + 140, top + 50); ctx.lineTo(cx + 230, top + 50); ctx.moveTo(cx + 140, top + 170); ctx.lineTo(cx + 230, top + 170); ctx.stroke(); ctx.restore();
    label(ctx, `落下 ${hEl.value} m`, cx + 236, top + 110, { size: 12, color: '#607D8B' });
    // 溫度計
    const tx = 560, T = T0 + dT();
    ctx.fillStyle = '#ECEFF1'; rrect(ctx, tx - 10, 30, 20, 240, 10); ctx.fill();
    ctx.fillStyle = '#E53935'; ctx.beginPath(); ctx.arc(tx, 280, 16, 0, 7); ctx.fill();
    const span = 3, hh = clamp((T - T0) / span, 0, 1) * 200 + 10;
    ctx.fillRect(tx - 5, 270 - hh, 10, hh);
    for (let k = 0; k <= span; k += 0.5) { const y = 260 - k / span * 200; ctx.fillStyle = '#607D8B'; ctx.fillRect(tx + 10, y, k % 1 ? 6 : 10, 1.5); if (k % 1 === 0) label(ctx, (T0 + k) + '°C', tx + 24, y, { size: 12 }); }
    label(ctx, `${T.toFixed(3)} °C`, tx, 14, { align: 'center', size: 16, bold: true, color: '#C62828' });
    label(ctx, `已落下 ${drops} 次`, 680, 300, { align: 'center', size: 14, bold: true });
  }
  function info() {
    const W = perDrop(), tot = W * drops;
    document.getElementById('c3jR').innerHTML = `
      <div><span>每次減少的位能</span><b>${fmt(W, 0)} J</b></div>
      <div><span>累計作的功</span><b>${fmt(tot, 0)} J</b></div>
      <div><span>水得到的熱（≈ 功 ÷ 4.2）</span><b>${fmt(tot / 4.186, 0)} 卡</b></div>
      <div><span>水溫上升</span><b>${dT().toFixed(3)} °C</b></div>`;
  }
  document.getElementById('c3jGo').onclick = () => { if (!run) { queue = 1; run = true; } };
  document.getElementById('c3j10').onclick = () => { queue = 10; run = true; };
  document.getElementById('c3jReset').onclick = reset;
  onG(() => { draw(); info(); });
  const lp = loop(step);
  registerSim('t8', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- 彈跳球 ---------- */
(() => {
  const cv = document.getElementById('c3bounce'); if (!cv) return;
  const S = stage(cv, 440, 320), ctx = S.ctx;
  const M = 0.1, H0 = 2, GY = 290, PX = 120;
  let k = 0.9, y = H0, v = 0, run = false, heat = 0, n = 0;
  function start() { y = H0; v = 0; heat = 0; n = 0; run = true; }
  function step(dt) {
    if (!run) return;
    const sub = 6; dt = dt * 0.8 / sub;
    for (let i = 0; i < sub; i++) {
      v -= G * dt; y += v * dt;
      if (y <= 0) {
        y = 0; const Kb = 0.5 * M * v * v;
        heat += Kb * (1 - k); v = Math.sqrt(2 * Kb * k / M); n++;
        if (Kb * k < 0.003) { v = 0; run = false; heat = M * G * H0; break; }
      }
    }
    draw(); info();
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ground(ctx, 10, 250, GY);
    for (let hh = 0; hh <= 2; hh += 0.5) label(ctx, hh + ' m', 4, GY - hh * PX, { size: 12, color: '#90A4AE' });
    ctx.fillStyle = k === 0 ? '#8D6E63' : '#FF7043'; ctx.beginPath(); ctx.arc(140, GY - 14 - y * PX, 14, 0, 7); ctx.fill();
    const Em = M * G * y + 0.5 * M * v * v, E = M * G * H0;
    const x0 = 290, top = 50, hh = 220, bw = 34;
    ctx.strokeStyle = '#90A4AE'; ctx.setLineDash([4, 3]); ctx.strokeRect(x0 - 6, top - 6, bw * 3 + 32, hh + 12); ctx.setLineDash([]);
    [[Em, '力學能', '#F9A825'], [heat, '熱＋聲', '#E53935'], [Em + heat, '總能量', '#78909C']].forEach(([val, nm, c], i) => {
      const x = x0 + i * (bw + 8), vh = hh * val / E;
      ctx.fillStyle = '#ECEFF1'; ctx.fillRect(x, top, bw, hh); ctx.fillStyle = c; ctx.fillRect(x, top + hh - vh, bw, vh);
      label(ctx, nm, x + bw / 2, top + hh + 18, { align: 'center', size: 12 });
    });
  }
  function info() {
    document.getElementById('c3bR').innerHTML = `<div><span>落地次數</span><b>${n}</b></div><div><span>剩下的力學能</span><b>${fmt((M * G * y + 0.5 * M * v * v) / (M * G * H0) * 100, 0)}%</b></div>`;
  }
  $$('#c3bBall .chip').forEach(c => c.onclick = () => { k = +c.dataset.k; $$('#c3bBall .chip').forEach(x => x.classList.toggle('on', x === c)); start(); });
  document.getElementById('c3bGo').onclick = start;
  const lp = loop(step);
  registerSim('t8', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- 能量轉換鏈 ---------- */
(() => {
  const host = document.getElementById('c3chainSc'); if (!host) return;
  const FORMS = ['化學能', '熱能', '動能', '重力位能', '彈力位能', '電能', '光能', '聲能'];
  const SC = [
    { n: '🏞 水力發電', q: '水庫的水 → 流下 → 推動水輪機 → 發電', a: ['重力位能', '動能', '電能'], why: '高處的水有重力位能，流下時變成動能，推動水輪機帶動發電機，產生電能。' },
    { n: '☀️ 太陽能計算機', q: '陽光照在太陽能板上 → 計算機顯示數字', a: ['光能', '電能'], why: '太陽能電池把光能直接轉成電能（課本 p.76）。' },
    { n: '🔥 火力發電', q: '燒煤 → 把水煮成高壓蒸汽 → 推動渦輪 → 發電', a: ['化學能', '熱能', '動能', '電能'], why: '煤的化學能燃燒變熱能，水蒸氣推動渦輪（動能），帶動發電機發出電能。' },
    { n: '🔦 手搖發電手電筒', q: '吃早餐 → 手搖把手 → 發電 → 燈泡亮', a: ['化學能', '動能', '電能', '光能'], why: '食物的化學能讓肌肉運動（動能），手搖帶動發電機（電能），燈泡發光（光能，也有一些熱能）。' },
    { n: '🏹 射箭', q: '拉滿的弓 → 放手 → 箭往上飛到最高點', a: ['彈力位能', '動能', '重力位能'], why: '拉開的弓儲存彈力位能，放手後變成箭的動能，箭往上飛時動能又變成重力位能。' },
    { n: '🔔 敲鐘', q: '鐘槌被拉高 → 放下撞鐘 → 鐘聲響起', a: ['重力位能', '動能', '聲能'], why: '鐘槌在高處有重力位能，落下變動能，撞擊讓鐘振動發出聲能（也有一些變成熱）。' },
  ];
  let cur = 0, picked = [];
  host.innerHTML = SC.map((s, i) => `<button class="chip${i ? '' : ' on'}" data-i="${i}">${s.n}</button>`).join('');
  const opts = document.getElementById('c3chainOpts');
  opts.innerHTML = FORMS.map(f => `<button class="chip" data-f="${f}">${f}</button>`).join('');
  function render() {
    const s = SC[cur];
    document.getElementById('c3chainQ').innerHTML = s.q;
    const ok = picked.every((p, i) => p === s.a[i]);
    document.getElementById('c3chainAns').innerHTML = picked.length
      ? picked.map((p, i) => `<span style="color:${p === s.a[i] ? 'var(--ok)' : 'var(--bad)'};font-weight:bold">${p}</span>`).join(' → ') + (picked.length === s.a.length && ok ? '　🎉 完全正確！' : !ok ? '　✘ 再想想' : ' → ？')
      : '<span class="note">從下面依序點選…</span>';
    const t = document.getElementById('c3chainTxt');
    if (picked.length === s.a.length && ok) { t.style.display = 'block'; t.innerHTML = s.why; } else t.style.display = 'none';
  }
  $$('.chip', host).forEach(c => c.onclick = () => { cur = +c.dataset.i; picked = []; $$('.chip', host).forEach(x => x.classList.toggle('on', x === c)); render(); });
  $$('.chip', opts).forEach(c => c.onclick = () => { if (picked.length < SC[cur].a.length) picked.push(c.dataset.f); render(); });
  document.getElementById('c3chainUndo').onclick = () => { picked.pop(); render(); };
  document.getElementById('c3chainShow').onclick = () => { picked = [...SC[cur].a]; render(); };
  render();
})();

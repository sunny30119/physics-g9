/* ===== 分頁 4：功與動能的變化 =====
   四種情境，右邊長條：初動能、外力作的功（可為負）、現在的動能＝初動能＋功 */
(() => {
  const cv = document.getElementById('c3wk'); if (!cv) return;
  const S = stage(cv, 760, 380), ctx = S.ctx;
  const P = document.getElementById('c3wkP'), PL = document.getElementById('c3wkPL');
  const CFG = {
    drop:  { lab: '落下高度', unit: ' m', min: 2, max: 10, step: 1, def: 8, m: 0.5 },
    up:    { lab: '上拋初速', unit: ' m/s', min: 4, max: 14, step: 1, def: 12, m: 0.5 },
    push:  { lab: '推力 F', unit: ' N', min: 2, max: 20, step: 2, def: 10, m: 2 },
    slide: { lab: '初速', unit: ' m/s', min: 2, max: 8, step: 1, def: 6, m: 2 },
  };
  const FRIC = 8, PUSHD = 5;   // 摩擦力 8 N；光滑面推 5 m
  let mode = 'drop', run = false, st;
  const out = $('output[for="c3wkP"]');
  P.addEventListener('input', () => { out.textContent = P.value + CFG[mode].unit; reset(); });
  function setMode(m) {
    mode = m; const c = CFG[m];
    PL.firstChild.textContent = c.lab + ' ';
    Object.assign(P, { min: c.min, max: c.max, step: c.step }); P.value = c.def; out.textContent = c.def + c.unit;
    reset();
  }
  function reset() {
    run = false;
    const p = +P.value;
    st = { t: 0, y: mode === 'drop' ? p : 0, v: mode === 'up' ? p : mode === 'slide' ? p : 0, x: 0, done: false };
    st.K0 = 0.5 * CFG[mode].m * st.v ** 2;
    draw(); info();
  }
  function forces() {   // 回傳 [力的大小（帶正負，沿運動軸）, 名稱]
    const m = CFG[mode].m;
    if (mode === 'drop' || mode === 'up') return [-m * G, '重力'];
    if (mode === 'push') return [st.x < PUSHD ? +P.value : 0, '推力'];
    return [st.v > 0 ? -FRIC : 0, '摩擦力'];
  }
  function work() {     // 外力作的功（累計）
    const m = CFG[mode].m, p = +P.value;
    if (mode === 'drop') return m * G * (p - st.y);
    if (mode === 'up') return -m * G * st.y;
    if (mode === 'push') return p * Math.min(st.x, PUSHD);
    return -FRIC * st.x;
  }
  function step(dt) {
    if (!run || st.done) return;
    dt *= 0.55;
    const m = CFG[mode].m;
    if (mode === 'drop') { st.v += G * dt; st.y -= st.v * dt; if (st.y <= 0) { st.y = 0; st.v = Math.sqrt(2 * G * +P.value); st.done = true; run = false; } }
    else if (mode === 'up') { st.v -= G * dt; st.y += st.v * dt; if (st.y <= 0 && st.v < 0) { st.y = 0; st.v = -+P.value; st.done = true; run = false; } }
    else if (mode === 'push') { const a = st.x < PUSHD ? +P.value / m : 0; st.v += a * dt; st.x += st.v * dt; if (st.x >= 9) { st.done = true; run = false; } }
    else { st.v -= FRIC / m * dt; if (st.v <= 0) { st.v = 0; st.x = 0.5 * m * (+P.value) ** 2 / FRIC; st.done = true; run = false; } else st.x += st.v * dt; }
    st.t += dt;
    draw(); info();
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const m = CFG[mode].m, [F, fname] = forces();
    if (mode === 'drop' || mode === 'up') {
      const gy = 350, PX = 30, bx = 230;
      ground(ctx, 60, 420, gy);
      for (let h = 0; h <= 10; h += 2) { label(ctx, h + ' m', 50, gy - h * PX, { align: 'right', size: 12, color: '#8A96A3' }); ctx.fillStyle = '#C9D3DD'; ctx.fillRect(56, gy - h * PX, 8, 1.5); }
      const by = gy - st.y * PX - 12;
      if (mode === 'drop') { ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = '#90A4AE'; ctx.beginPath(); ctx.arc(bx, gy - +P.value * PX - 12, 12, 0, 7); ctx.stroke(); ctx.restore(); }
      ctx.fillStyle = '#F5F5F5'; ctx.strokeStyle = '#C62828'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bx, by, 12, 0, 7); ctx.fill(); ctx.stroke();
      const ga = Math.min(by, gy - 54); arrow(ctx, bx + 26, ga, bx + 26, ga + 50, '#D32F2F', 4, 11); label(ctx, '重力', bx + 34, ga + 40, { size: 13, color: '#D32F2F', bold: true });
      if (Math.abs(st.v) > 0.05 && !st.done) { const d = st.v > 0 ? -1 : 1, ma = d > 0 ? Math.min(by, gy - 50) : by; arrow(ctx, bx - 26, ma, bx - 26, ma + d * 45, '#1565C0', 3, 10); label(ctx, '運動方向', bx - 34, ma + d * 30, { size: 13, color: '#1565C0', align: 'right' }); }
      const same = (mode === 'drop') || st.v < 0;
      label(ctx, st.done ? '落地！' : Math.abs(st.v) < 0.25 && mode === 'up' && st.t > 0 ? '最高點：速率≈0' : same ? '力與運動同向 → 作正功' : '力與運動反向 → 作負功', 240, 26, { align: 'center', size: 15, bold: true, color: same ? '#2E7D32' : '#C62828', bg: '#fff' });
    } else {
      const gy = 260, PX = 42, X0 = 40;
      ground(ctx, 20, 440, gy, mode === 'slide');
      if (mode === 'slide') { ctx.fillStyle = 'rgba(141,110,99,.15)'; ctx.fillRect(20, gy, 420, 14); label(ctx, '粗糙地面（摩擦力 8 N）', 230, gy + 30, { align: 'center', size: 13, color: '#6D4C41' }); }
      else { label(ctx, '光滑地面', 230, gy + 30, { align: 'center', size: 13, color: '#66736E' }); ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = '#C8682A'; ctx.beginPath(); ctx.moveTo(X0 + 30 + PUSHD * PX, gy - 70); ctx.lineTo(X0 + 30 + PUSHD * PX, gy); ctx.stroke(); ctx.restore(); label(ctx, '推 5 m 後放手', X0 + 30 + PUSHD * PX, gy - 78, { align: 'center', size: 12, color: '#C8682A' }); }
      for (let k = 0; k <= 9; k++) label(ctx, k + 'm', X0 + 30 + k * PX, gy + 50, { align: 'center', size: 11, color: '#8A96A3' });
      const bx = X0 + 30 + Math.min(st.x, 9.2) * PX;
      box(ctx, bx - 26, gy - 52, 52, 52, '#B98B5E', '2 kg');
      if (F > 0) arrow(ctx, bx - 26 - 15 - F * 3, gy - 26, bx - 28, gy - 26, '#D32F2F', 4, 11);
      if (F < 0) arrow(ctx, bx - 4, gy - 6, bx - 4 - 50, gy - 6, '#D32F2F', 4, 11);
      if (F) label(ctx, fname, F > 0 ? bx - 50 : bx - 60, gy - (F > 0 ? 44 : 18), { align: 'center', size: 13, color: '#D32F2F', bold: true, bg: 'rgba(255,255,255,.8)' });
      if (st.v > 0.05) arrow(ctx, bx + 30, gy - 70, bx + 30 + 20 + st.v * 6, gy - 70, '#1565C0', 3, 10);
      label(ctx, F > 0 ? '力與運動同向 → 作正功' : F < 0 ? '力與運動反向 → 作負功' : st.done ? (mode === 'slide' ? '停下來了' : '') : '沒有外力 → 不作功，速率不變', 230, 26, { align: 'center', size: 15, bold: true, color: F > 0 ? '#2E7D32' : F < 0 ? '#C62828' : '#555', bg: '#fff' });
    }
    // 右側長條：初動能 / 外力作的功 / 現在動能
    const W = work(), K0 = st.K0, K = K0 + W;
    const max = Math.max(1, mode === 'drop' ? m * G * 10 : mode === 'up' ? 0.5 * m * 196 : mode === 'push' ? 20 * PUSHD : 0.5 * m * 64);
    const x0 = 480, y0 = 70, h = 220, zero = y0 + h * 0.72, sc = (h * 0.72 - 10) / max, bw = 70;
    ctx.fillStyle = 'rgba(255,255,255,.9)'; rrect(ctx, x0 - 10, y0 - 40, 280, h + 85, 10); ctx.fill();
    label(ctx, '能量帳本（焦耳）', x0 + 130, y0 - 22, { align: 'center', size: 14, bold: true });
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, zero); ctx.lineTo(x0 + 260, zero); ctx.stroke();
    [[K0, '一開始的動能', '#90A4AE'], [W, '外力作的功', W >= 0 ? '#43A047' : '#E53935'], [K, '現在的動能', '#1E88E5']].forEach(([v, n, c], i) => {
      const bx = x0 + 10 + i * 85, hh = v * sc;
      ctx.fillStyle = c; ctx.fillRect(bx, hh >= 0 ? zero - hh : zero, bw, Math.abs(hh));
      if (hh >= 0) label(ctx, fmt(v, 1), bx + bw / 2, zero - hh - 10, { align: 'center', size: 13, bold: true });
      else label(ctx, fmt(v, 1), bx + bw / 2, zero + Math.max(10, -hh / 2), { align: 'center', size: 13, bold: true, color: -hh > 20 ? '#fff' : '#C62828' });
      label(ctx, n, bx + bw / 2, y0 + h + 22, { align: 'center', size: 12 });
      if (i < 2) label(ctx, i === 0 ? '＋' : '＝', bx + bw + 7, zero - 30, { align: 'center', size: 18, bold: true, color: '#555' });
    });
  }
  function info() {
    const m = CFG[mode].m, W = work(), K = st.K0 + W;
    document.getElementById('c3wkR').innerHTML = `
      <div><span>速率</span><b>${fmt(Math.abs(st.v), 2)} m/s</b></div>
      <div><span>外力作的功（累計）</span><b style="color:${W >= 0 ? 'var(--ok)' : 'var(--bad)'}">${fmt(W, 1)} J</b></div>
      <div><span>動能的變化</span><b>${fmt(K - st.K0, 1)} J</b></div>
      <div><span>現在的動能</span><b>${fmt(0.5 * m * st.v ** 2, 1)} J</b></div>`;
    const T = {
      drop: '球從靜止落下：重力和位移<b>同向</b>，重力作正功，動能從 0 開始增加。落地時「重力作的功」＝「獲得的動能」。',
      up: '球往上飛時重力作<b>負功</b>，動能一直減少，到最高點變成 0；落回來時重力作正功，動能又增加。回到手中時，重力的總功＝？',
      push: '推力和位移同向，作正功，箱子動能增加。放手後沒有外力作功，動能（速率）就不再改變。',
      slide: '箱子靠慣性滑行，摩擦力和運動方向<b>相反</b>，作負功，動能一直減少到 0。動能去哪了？變成地面和箱子的熱（3-3 節會談）。',
    };
    document.getElementById('c3wkTxt').innerHTML = T[mode];
  }
  $$('#c3wkMode .chip').forEach(c => c.onclick = () => { $$('#c3wkMode .chip').forEach(x => x.classList.toggle('on', x === c)); setMode(c.dataset.m); });
  document.getElementById('c3wkGo').onclick = () => { if (st.done) reset(); run = true; };
  document.getElementById('c3wkPause').onclick = () => run = false;
  document.getElementById('c3wkReset').onclick = reset;
  onG(() => { if (st) reset(); });
  const lp = loop(step);
  setMode('drop');
  registerSim('t4', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- 例題跟著 g ---------- */
onG(g => {
  const F = 0.5 * g, W = F * 5;
  [['c3ex4F', F], ['c3ex4F2', F], ['c3ex4W', W], ['c3ex4A', W]].forEach(([id, v]) => { const e = document.getElementById(id); if (e) e.textContent = fmt(v, 2); });
});

/* ---------- 資優：功能定理計算器 ---------- */
(() => {
  if (!document.getElementById('c3netF')) return;
  const upd = () => {
    const F = +f1.value, f = +f2.value, s = +sd.value, Wp = F * s, Wf = -f * s, net = Wp + Wf;
    document.getElementById('c3netR').innerHTML = `
      <div><span>推力作的功</span><b style="color:var(--ok)">＋${Wp} J</b></div>
      <div><span>摩擦力作的功</span><b style="color:var(--bad)">${Wf} J</b></div>
      <div><span>總功＝動能變化</span><b>${net > 0 ? '＋' : ''}${net} J</b></div>
      <div><span>結果</span><b style="font-size:1rem">${net > 0 ? '愈推愈快' : net < 0 ? '愈來愈慢（假設原本在動）' : '等速度前進'}</b></div>`;
  };
  const f1 = bindRange('c3netF', v => v + ' N', upd), f2 = bindRange('c3netf', v => v + ' N', upd), sd = bindRange('c3netS', v => v + ' m', upd);
  upd();
})();

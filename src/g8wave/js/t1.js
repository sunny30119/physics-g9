/* ===== 分頁 1：波與波動 =====
   ① 水波與小鴨（側視；資優：水分子小圓圈）
   ② 探討活動 3-1 彈簧波：橫波／縱波、擺一次／連續、髮圈與位置紀錄
   ③ 分類：力學波／非力學波
   ④ 人浪（橫波／縱波版）
   ⑤ 地震 P 波 S 波與速報 */

/* ---------- ① 水波與小鴨 ---------- */
(() => {
  const cv = document.getElementById('w1duck'); if (!cv) return;
  const S = stage(cv, 760, 230), ctx = S.ctx;
  const A = bindRange('w1dA', v => v + ' 像素', () => draw());
  const LAM = 240, V = 80, DX = 380;   // 波長 240 px、波速 80 px/s、小鴨在 x = 380
  let t = 0, run = true, slow = false, trail = false, path = [];
  const y0 = 130;
  const eta = (x, tt) => +A.value * Math.sin(2 * Math.PI * (x - V * tt) / LAM);
  const duckPos = tt => {   // 小鴨：上下為主，帶一點點前後（深水波的小圓圈）
    const ph = 2 * Math.PI * (DX - V * tt) / LAM;
    return { x: DX + 0.35 * +A.value * Math.cos(ph), y: y0 - +A.value * Math.sin(ph) };   // 波峰經過時往前、波谷經過時往後
  };
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const sky = ctx.createLinearGradient(0, 0, 0, S.H); sky.addColorStop(0, '#EAF4FB'); sky.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S.W, S.H);
    // 水
    ctx.beginPath(); ctx.moveTo(0, S.H);
    for (let x = 0; x <= S.W; x += 4) ctx.lineTo(x, y0 - eta(x, t));
    ctx.lineTo(S.W, S.H); ctx.closePath();
    const wg = ctx.createLinearGradient(0, 80, 0, S.H); wg.addColorStop(0, '#5BA4D6'); wg.addColorStop(1, '#1E5F8F');
    ctx.fillStyle = wg; ctx.fill();
    // 波峰標記（跟著跑）
    for (let k = -2; k < 6; k++) {
      const xc = ((V * t + LAM / 4) % LAM) + k * LAM;
      if (xc < 10 || xc > S.W - 10) continue;
      label(ctx, '波峰', xc, y0 - +A.value - 16, { align: 'center', size: 12, color: '#0D47A1', bold: true });
    }
    arrow(ctx, 30, 26, 150, 26, '#0D47A1', 3, 12);
    label(ctx, '波前進方向', 160, 26, { size: 13, color: '#0D47A1', bold: true });
    // 軌跡
    if (trail && path.length > 1) {
      ctx.save(); ctx.strokeStyle = 'rgba(211,47,47,.75)'; ctx.lineWidth = 2; ctx.beginPath();
      path.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.restore();
    }
    // 小鴨
    const d = duckPos(t);
    ctx.save(); ctx.translate(d.x, d.y - 10);
    ctx.fillStyle = '#FFD54F'; ctx.beginPath(); ctx.ellipse(0, 0, 22, 12, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(14, -14, 9, 0, 7); ctx.fill();
    ctx.fillStyle = '#FF8F00'; ctx.beginPath(); ctx.moveTo(22, -14); ctx.lineTo(31, -11); ctx.lineTo(22, -9); ctx.fill();
    ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(16, -16, 1.8, 0, 7); ctx.fill();
    ctx.restore();
    // 原位置虛線
    ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(0,0,0,.35)';
    ctx.beginPath(); ctx.moveTo(DX, 40); ctx.lineTo(DX, S.H - 10); ctx.stroke(); ctx.restore();
    label(ctx, '小鴨原本的位置', DX + 6, S.H - 14, { size: 12, color: '#fff' });
    const vy = -(duckPos(t + 0.02).y - d.y);
    if (Math.abs(vy) > 0.3) arrow(ctx, d.x - 40, d.y - 10, d.x - 40, d.y - 10 - Math.sign(vy) * 26, '#D32F2F', 3, 10);
  }
  const lp = loop(dt => {
    if (!run) return;
    t += dt * (slow ? 0.3 : 1);
    if (trail) { path.push(duckPos(t)); if (path.length > 900) path.shift(); }
    draw();
    if (trail) document.getElementById('w1dTxt').innerHTML = `已經過 <b>${fmt(t, 1)}</b> 秒，波峰跑了約 ${fmt(V * t / LAM, 1)} 個波長，小鴨的軌跡卻一直在原地附近繞（像一個扁扁的圓）。<b>波往前跑，介質（水）在原地振動。</b>`;
  });
  document.getElementById('w1dGo').onclick = e => { run = !run; e.target.textContent = run ? '⏸ 暫停' : '▶ 繼續'; };
  document.getElementById('w1dSlow').onclick = e => { slow = !slow; e.target.classList.toggle('sel', slow); };
  document.getElementById('w1dTrail').onclick = e => { trail = !trail; path = []; e.target.classList.toggle('sel', trail); };
  registerSim('t1', { start() { draw(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ② 探討活動 3-1：彈簧波 ---------- */
(() => {
  const cv = document.getElementById('w1spring'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const N = 56, X0 = 70, X1 = 740, Y = 120;
  const dx = (X1 - X0) / (N - 1);
  const V = 160, T = 0.9, AMP = 48;   // 波速 px/s、週期 s、振幅 px
  let mode = 'T', kind = '1', t = -1, run = false, paused = false, slow = false, ring = 22, hist = [], lastRec = -1;
  const src = tt => {   // 手（波源）的位移：擺一次＝一個完整的來回（上→回→下→回），產生一個波峰＋一個波谷；連續＝正弦
    if (tt < 0) return 0;
    if (kind === '1') return tt < T ? Math.sin(2 * Math.PI * tt / T) : 0;
    return Math.sin(2 * Math.PI * tt / T);
  };
  // 擺一次：手上去、下來、回原位（一個完整的來回），會產生「一個」完整的起伏
  const u = (i, tt) => AMP * src(tt - (i * dx) / V);
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    // 桌面
    ctx.fillStyle = '#F4EDE2'; ctx.fillRect(0, 30, S.W, 180);
    label(ctx, mode === 'T' ? '從上往下看桌面：手「垂直彈簧」來回擺動' : '從上往下看桌面：手「沿著彈簧」前後推拉',
      S.W / 2, 16, { align: 'center', size: 13, color: '#66736E' });
    // 彈簧
    const pts = [];
    for (let i = 0; i < N; i++) {
      const d = u(i, t);
      pts.push(mode === 'T' ? { x: X0 + i * dx, y: Y - d } : { x: X0 + i * dx + d * 0.42, y: Y });
    }
    ctx.save(); ctx.strokeStyle = '#7A8896'; ctx.lineWidth = 2.2;
    if (mode === 'T') {
      ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
      ctx.lineWidth = 1.6; pts.forEach(p => { ctx.beginPath(); ctx.ellipse(p.x, p.y, 3, 12, 0, 0, 7); ctx.stroke(); });
    } else {
      pts.forEach(p => { ctx.beginPath(); ctx.ellipse(p.x, p.y, 3.2, 26, 0, 0, 7); ctx.stroke(); });
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pts[0].x, Y - 26); pts.forEach(p => ctx.lineTo(p.x, Y - 26)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pts[0].x, Y + 26); pts.forEach(p => ctx.lineTo(p.x, Y + 26)); ctx.stroke();
    }
    ctx.restore();
    // 髮圈
    const r = pts[ring];
    ctx.save(); ctx.fillStyle = '#FBC02D'; ctx.strokeStyle = '#8D6E00'; ctx.lineWidth = 2;
    if (mode === 'T') { ctx.beginPath(); ctx.ellipse(r.x, r.y, 7, 16, 0, 0, 7); ctx.fill(); ctx.stroke(); }
    else { ctx.beginPath(); ctx.ellipse(r.x, r.y, 7, 30, 0, 0, 7); ctx.fill(); ctx.stroke(); }
    ctx.restore();
    label(ctx, '髮圈', r.x, mode === 'T' ? r.y - 30 : Y - 42, { align: 'center', size: 12, bold: true, color: '#8D6E00' });
    // 手（波源）
    const h = pts[0];
    ctx.font = '30px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✋', h.x - 26, h.y);
    label(ctx, '波源（手）', 34, Y + 70, { align: 'center', size: 12, color: '#66736E' });
    // 方向箭頭
    arrow(ctx, 470, 56, 600, 56, '#1565C0', 3, 11); label(ctx, '波前進方向', 606, 56, { size: 13, bold: true, color: '#1565C0' });
    if (mode === 'T') { arrow(ctx, r.x + 26, Y + 6, r.x + 26, Y - 30, '#D32F2F', 2.5, 9); arrow(ctx, r.x + 26, Y - 6, r.x + 26, Y + 30, '#D32F2F', 2.5, 9); label(ctx, '振動方向', r.x + 34, Y + 40, { size: 12, color: '#D32F2F', bold: true }); }
    else { arrow(ctx, r.x, Y + 48, r.x + 30, Y + 48, '#D32F2F', 2.5, 9); arrow(ctx, r.x, Y + 48, r.x - 30, Y + 48, '#D32F2F', 2.5, 9); label(ctx, '振動方向', r.x, Y + 64, { align: 'center', size: 12, color: '#D32F2F', bold: true }); }
    // 下方：髮圈位置紀錄（時間圖）
    const gx = 70, gy = 222, gw = 640, gh = 66;
    ctx.fillStyle = '#fff'; ctx.fillRect(gx, gy, gw, gh); ctx.strokeStyle = '#CFD8DC'; ctx.strokeRect(gx, gy, gw, gh);
    label(ctx, mode === 'T' ? '髮圈偏離原位多少（上下）↓ 時間 →' : '髮圈偏離原位多少（前後）↓ 時間 →', gx + 4, gy + 10, { size: 12, color: '#66736E' });
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(gx, gy + gh / 2 + 6); ctx.lineTo(gx + gw, gy + gh / 2 + 6); ctx.stroke(); ctx.setLineDash([]);
    if (hist.length > 1) {
      ctx.strokeStyle = '#F9A825'; ctx.lineWidth = 2.5; ctx.beginPath();
      hist.forEach((v, i) => { const x = gx + i * (gw / 400), y = gy + gh / 2 + 6 - v * 0.42; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
    }
  }
  function info() {
    const d = u(ring, t);
    document.getElementById('w1sR').innerHTML = `
      <div><span>波形</span><b>${mode === 'T' ? '橫波（高低波）' : '縱波（疏密波）'}</b></div>
      <div><span>介質振動 vs 波前進</span><b>${mode === 'T' ? '互相垂直' : '互相平行'}</b></div>
      <div><span>髮圈離原位</span><b>${fmt(Math.abs(d) / 10, 1)} 格</b></div>
      <div><span>髮圈有沒有跟著波跑走？</span><b>${kind === 'c' && t > ring * dx / V ? '沒有，一直在原處附近振動' : t > ring * dx / V + T ? '沒有，回到原位了' : t > 0 ? '觀察中…' : '？'}</b></div>`;
  }
  function txt() {
    const el = document.getElementById('w1sTxt');
    if (mode === 'T') el.innerHTML = '<b>① 上下擺動：</b>彈簧振動方向（紅）與波前進方向（藍）<b>互相垂直</b>，形成高低起伏的波形——<b>橫波</b>。';
    else el.innerHTML = '<b>② 左右推動：</b>彈簧振動方向與波前進方向<b>互相平行</b>，形成疏密相間（擠在一起、拉開）的波形——<b>縱波</b>。';
    if (kind === 'c') el.innerHTML += '<br><b>③ 連續擺動：</b>看下方髮圈的紀錄：髮圈只在原處來回，<b>介質不會隨著波動前進</b>。';
  }
  const lp = loop(dt => {
    if (!run || paused) return;
    t += dt * (slow ? 0.3 : 1);
    if (t >= 0 && t - lastRec >= 0.015) { lastRec = t; hist.push(u(ring, t)); if (hist.length > 400) hist.shift(); }   // 每 0.015 秒（模擬時間）記一筆，和螢幕更新率無關
    if (kind === '1' && t > (N * dx) / V + T + 0.3) run = false;
    draw(); info();
  });
  const go = () => { t = 0; hist = []; lastRec = -1; run = true; paused = false; document.getElementById('w1sPause').textContent = '⏸ 暫停'; txt(); };
  document.getElementById('w1sGo').onclick = go;
  document.getElementById('w1sPause').onclick = e => { paused = !paused; e.target.textContent = paused ? '▶ 繼續' : '⏸ 暫停'; };
  document.getElementById('w1sSlow').onclick = e => { slow = !slow; e.target.classList.toggle('sel', slow); };
  $$('#w1sMode .chip').forEach(c => c.onclick = () => { mode = c.dataset.m; $$('#w1sMode .chip').forEach(x => x.classList.toggle('on', x === c)); t = -1; hist = []; run = false; txt(); draw(); info(); });
  $$('#w1sKind .chip').forEach(c => c.onclick = () => { kind = c.dataset.k; $$('#w1sKind .chip').forEach(x => x.classList.toggle('on', x === c)); t = -1; hist = []; run = false; txt(); draw(); info(); });
  cv.addEventListener('pointerdown', e => {
    const p = S.pt(e); if (p.y > 215) return;
    ring = clamp(Math.round((p.x - X0) / dx), 3, N - 2); hist = []; draw(); info();
  });
  registerSim('t1', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ③ 分類：力學波／非力學波 ---------- */
(() => {
  const host = document.getElementById('w1sort1'); if (!host) return;
  mountSort(host, ['力學波（要介質）', '非力學波（不用介質）'], [
    ['吉他弦發出的聲音', 0, '聲波要靠空氣等介質傳播。'],
    ['太陽照到地球的陽光', 1, '陽光穿過真空的太空到達地球，不需要介質。'],
    ['池塘的漣漪', 0, '水波的介質是水。'],
    ['手機收到的 4G／5G 訊號', 1, '手機訊號是電磁波，不需要介質。'],
    ['地震時傳來的地震波', 0, '地震波靠岩石、地層傳播。'],
    ['微波爐裡加熱食物的微波', 1, '微波是電磁波的一種。'],
    ['甩動跳繩產生的繩波', 0, '繩波的介質是繩子。'],
    ['醫院照 X 光', 1, 'X 光也是電磁波。'],
  ]);
})();

/* ---------- ④ 人浪 ---------- */
(() => {
  const cv = document.getElementById('w1crowd'); if (!cv) return;
  const S = stage(cv, 760, 250), ctx = S.ctx;
  const V = bindRange('w1cV', v => v + ' 座位／秒', null);
  const N = 30, X0 = 30, DX = 24, Y = 190;
  let mode = 'T', t = -1, run = false, pick = -1, front = 0;   // front：人浪前緣經過了幾個座位
  const W = 2.6;   // 每位觀眾動作持續的「座位數」
  const act = (i, tt) => {   // 0→1→0 的站起動作
    if (t < 0) return 0;
    const pos = front - i;   // 人浪前緣已經過了這個座位多少
    if (pos < 0 || pos > W) return 0;
    return Math.sin(Math.PI * pos / W);
  };
  function person(x, y, s, hl) {
    ctx.save(); ctx.strokeStyle = hl ? '#D32F2F' : '#37474F'; ctx.fillStyle = hl ? '#D32F2F' : '#37474F'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y - 52 - s * 26, 7, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x, y - 44 - s * 26); ctx.lineTo(x, y - 20 - s * 18); ctx.stroke();
    // 手
    ctx.beginPath(); ctx.moveTo(x, y - 40 - s * 26); ctx.lineTo(x - 8, y - 28 - s * 50); ctx.moveTo(x, y - 40 - s * 26); ctx.lineTo(x + 8, y - 28 - s * 50); ctx.stroke();
    // 腳（坐著時彎曲）
    ctx.beginPath(); ctx.moveTo(x, y - 20 - s * 18); ctx.lineTo(x + 10 * (1 - s), y - 10 + 0 * s); ctx.lineTo(x + 10 * (1 - s), y); ctx.stroke();
    ctx.restore();
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#E8F5E9'; ctx.fillRect(0, 0, S.W, S.H);
    // 座位
    for (let i = 0; i < N; i++) { ctx.fillStyle = '#90A4AE'; ctx.fillRect(X0 + i * DX - 9, Y - 20, 18, 6); ctx.fillRect(X0 + i * DX - 9, Y - 20, 3, 20); }
    for (let i = 0; i < N; i++) {
      const s = act(i, t);
      const x = X0 + i * DX + (mode === 'L' ? s * 14 : 0), st = mode === 'T' ? s : 0;
      person(x, Y, st, i === pick);
    }
    if (pick >= 0) {
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = '#D32F2F';
      ctx.beginPath(); ctx.moveTo(X0 + pick * DX, 30); ctx.lineTo(X0 + pick * DX, Y + 8); ctx.stroke(); ctx.restore();
      label(ctx, '他的座位', X0 + pick * DX, Y + 24, { align: 'center', size: 12, color: '#D32F2F', bold: true });
    }
    arrow(ctx, 30, 22, 150, 22, '#1565C0', 3, 11); label(ctx, '人浪前進方向', 158, 22, { size: 13, color: '#1565C0', bold: true });
    label(ctx, (mode === 'T' ? '每人：站起來 → 坐下（上下）＝ 橫波' : '每人：往右擠 → 回原位（前後）＝ 縱波') + '｜動畫放慢 3 倍', S.W - 12, 22, { align: 'right', size: 13, color: '#37474F', bold: true });
  }
  const lp = loop(dt => {
    if (!run) return;
    t += dt; front += +V.value * dt / 3;   // 動畫放慢 3 倍，看得清楚
    if (front - N > W + 2) { run = false; }
    draw();
    if (!run && pick >= 0) document.getElementById('w1cTxt').innerHTML = `人浪已經跑出畫面了，紅色觀眾還在<b>自己的座位</b>上。往前跑的是「站起來的動作」（擾動），不是人。<br>人浪速度 ${V.value} 座位／秒，若一個座位寬約 0.6 公尺，就是每秒約 <b>${fmt(V.value * 0.6, 1)} 公尺</b>。`;
  });
  document.getElementById('w1cGo').onclick = () => { t = 0; front = 0; run = true; };
  document.getElementById('w1cRe').onclick = () => { t = -1; front = 0; run = false; draw(); };
  $$('#w1cMode .chip').forEach(c => c.onclick = () => { mode = c.dataset.m; $$('#w1cMode .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  cv.addEventListener('pointerdown', e => { const p = S.pt(e); pick = clamp(Math.round((p.x - X0) / DX), 0, N - 1); draw(); });
  registerSim('t1', { start() { draw(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ⑤ 地震 P 波、S 波與速報 ---------- */
(() => {
  const cv = document.getElementById('w1quake'); if (!cv) return;
  const S = stage(cv, 760, 230), ctx = S.ctx;
  const VP = 6, VS = 3.5;
  const D = bindRange('w1qD', v => v + ' 公里', () => { t = -1; draw(); info(); });
  const C = bindRange('w1qC', v => v + ' 秒', () => { draw(); info(); });
  let t = -1, run = false;
  const X0 = 60, X1 = 720, KM = (X1 - X0) / 200;
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#EFEBE9'; ctx.fillRect(0, 90, S.W, 140);
    ctx.fillStyle = '#BCAAA4'; ctx.fillRect(0, 88, S.W, 4);
    // 震源
    ctx.font = '26px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('💥', X0, 150);
    label(ctx, '震源', X0, 178, { align: 'center', size: 12, bold: true });
    // 你
    const xd = X0 + +D.value * KM;
    ctx.font = '28px sans-serif'; ctx.fillText('🏫', xd, 74);
    label(ctx, '你（' + D.value + ' 公里）', xd, 40, { align: 'center', size: 13, bold: true, bg: 'rgba(255,255,255,.85)' });
    for (let k = 0; k <= 200; k += 50) label(ctx, k + ' km', X0 + k * KM, 214, { align: 'center', size: 12, color: '#8D6E63' });
    if (t >= 0) {
      const xp = X0 + Math.min(200, VP * t) * KM, xs = X0 + Math.min(200, VS * t) * KM;
      // P 波：疏密線
      ctx.save(); ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 2;
      for (let k = 0; k < 6; k++) { const x = xp - k * 9; if (x > X0) { ctx.beginPath(); ctx.moveTo(x, 100); ctx.lineTo(x, 196); ctx.stroke(); } }
      ctx.restore(); label(ctx, 'P 波（縱波）', xp, 108, { align: 'center', size: 12, color: '#1565C0', bold: true, bg: 'rgba(255,255,255,.8)' });
      // S 波：起伏
      ctx.save(); ctx.strokeStyle = '#C62828'; ctx.lineWidth = 3; ctx.beginPath();
      for (let x = X0; x <= xs; x += 3) { const y = 160 + 14 * Math.sin((x - xs) / 9) * Math.exp(-(xs - x) / 120); x === X0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke(); ctx.restore(); label(ctx, 'S 波（橫波）', xs, 186, { align: 'center', size: 12, color: '#C62828', bold: true, bg: 'rgba(255,255,255,.8)' });
      // 警報
      const tAlert = 20 / VP + +C.value;   // 震央附近測站（約 20 公里）收到 P 波後計算發布
      if (t >= tAlert) label(ctx, '📱 手機響了！強震即時警報', S.W / 2, 22, { align: 'center', size: 15, bold: true, color: '#fff', bg: '#E65100' });
      label(ctx, '經過 ' + fmt(t, 1) + ' 秒', S.W - 10, 22, { align: 'right', size: 13, bold: true });
    }
  }
  function info() {
    const d = +D.value, tp = d / VP, ts = d / VS, tA = 20 / VP + +C.value, lead = ts - tA;
    document.getElementById('w1qR').innerHTML = `
      <div><span>P 波抵達</span><b>${fmt(tp, 1)} 秒</b></div>
      <div><span>S 波抵達（劇烈搖晃）</span><b>${fmt(ts, 1)} 秒</b></div>
      <div><span>手機警報響起</span><b>${fmt(tA, 1)} 秒</b></div>
      <div><span>警報比 S 波早</span><b style="color:${lead > 0 ? 'var(--ok)' : 'var(--bad)'}">${lead > 0 ? fmt(lead, 1) + ' 秒' : '來不及（盲區）'}</b></div>`;
    document.getElementById('w1qTxt').innerHTML = lead > 0
      ? `你有大約 <b>${fmt(lead, 0)} 秒</b>可以「趴下、掩護、穩住」。離震央愈遠，P 波和 S 波拉開的時間差愈大，能搶到的時間愈多。`
      : `離震央太近：警報發出時 S 波已經到了。這個區域叫做<b>預警盲區</b>，所以平時就要熟悉避難動作。`;
  }
  const lp = loop(dt => { if (!run) return; t += dt * 4; if (t > 200 / VS + 2) run = false; draw(); });
  document.getElementById('w1qGo').onclick = () => { t = 0; run = true; };
  registerSim('t1', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ===== 分頁 3：聲音的形成 ===== */

/* ---------- ① 探討活動 3-2：音叉 ---------- */
(() => {
  const cv = document.getElementById('w3fork'); if (!cv) return;
  const S = stage(cv, 420, 300), ctx = S.ctx;
  let amp = 0, t = 0, inWater = false, snd = null, drops = [], step = 0;
  const TXT = [
    '先敲音叉，仔細看音叉的「叉」在做什麼。',
    '🔨 敲擊後，音叉發出「嗡——」的聲音，兩支叉<b>快速地來回振動</b>。接著把音叉放進水裡。',
    '💧 振動的音叉碰到水面，<b>水花四濺</b>！證明發聲的音叉真的在振動。再敲一次，然後用手握住音叉。',
    '✊ 握住音叉，振動停止，<b>聲音也消失了</b>。→ 聲音是由物體的振動產生的。',
    '🧪 <b>對照組</b>：沒有敲過的音叉放進水裡，水面<b>完全不動</b>。所以剛才的水花，是「振動」造成的，不是把音叉放進水裡本身造成的。',
  ];
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    if (inWater) { ctx.fillStyle = '#BBDEFB'; ctx.fillRect(60, 200, 300, 100); ctx.fillStyle = '#64B5F6'; ctx.fillRect(60, 200, 300, 4); }
    const cx = 210, top = inWater ? 125 : 40, len = 130, gap = 26;
    const d = amp * 9 * Math.sin(t * 2 * Math.PI * 9);
    ctx.save(); if (inWater) { ctx.translate(0, 340); ctx.scale(1, -1); }   // 放進水裡時叉尖朝下
    ctx.save(); ctx.strokeStyle = '#78909C'; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx - gap - d, top); ctx.quadraticCurveTo(cx - gap - d * .4, top + len * .7, cx - gap, top + len); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + gap + d, top); ctx.quadraticCurveTo(cx + gap + d * .4, top + len * .7, cx + gap, top + len); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, top + len, gap, 0, Math.PI); ctx.stroke();
    ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(cx, top + len + gap); ctx.lineTo(cx, top + len + gap + 60); ctx.stroke();
    ctx.restore();
    if (step === 3 && !inWater) { ctx.font = '40px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✊', cx + 40, top + 60); }
    if (amp > 0.05) { // 聲波弧線
      for (let k = 1; k <= 3; k++) {
        const r = 40 + ((t * 60 + k * 30) % 90);
        ctx.save(); ctx.strokeStyle = `rgba(21,101,192,${amp * (1 - r / 140)})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, top + 30, r, -0.5, 0.5); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, top + 30, r, Math.PI - 0.5, Math.PI + 0.5); ctx.stroke(); ctx.restore();
      }
    }
    ctx.restore();
    if (inWater) label(ctx, '叉尖碰到水面', 300, 186, { size: 12, color: '#1565C0', bold: true });
    drops.forEach(p => { ctx.fillStyle = '#1E88E5'; ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, 7); ctx.fill(); });
    label(ctx, amp > 0.05 ? '嗡————' : '（安靜）', 20, 24, { size: 15, bold: true, color: amp > 0.05 ? '#1565C0' : '#90A4AE' });
  }
  const lp = loop(dt => {
    t += dt;
    if (amp > 0) { amp *= Math.exp(-dt * (inWater ? 1.6 : 0.25)); if (amp < 0.02) amp = 0; }
    if (snd) { snd.vol(0.22 * amp); if (amp === 0) { snd.stop(); snd = null; } }
    if (inWater && amp > 0.15 && Math.random() < amp) drops.push({ x: 210 + (Math.random() < .5 ? -26 : 26) + (Math.random() - .5) * 24, y: 200, vx: (Math.random() - .5) * 120, vy: -120 - Math.random() * 160 * amp });
    drops.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 600 * dt; }); drops = drops.filter(p => p.y < 205);
    draw();
  });
  const hit = () => { amp = 1; if (!snd) snd = AUD.tone({ freq: 440, harm: [1, 0.04], vol: 0.22 }); };
  document.getElementById('w3hit').onclick = () => { inWater = false; hit(); step = Math.max(step, 1); if (step === 3) step = 1; document.getElementById('w3forkTxt').innerHTML = TXT[step === 1 ? 1 : step]; };
  document.getElementById('w3water').onclick = () => { inWater = true; if (amp < 0.3) hit(); step = 2; document.getElementById('w3forkTxt').innerHTML = TXT[2]; };
  document.getElementById('w3grip').onclick = () => { if (amp === 0) { hit(); } setTimeout(() => { amp = 0; inWater = false; step = 3; document.getElementById('w3forkTxt').innerHTML = TXT[3]; }, amp ? 0 : 600); };
  document.getElementById('w3still').onclick = () => { if (snd) { snd.stop(); snd = null; } amp = 0; inWater = true; step = 4; document.getElementById('w3forkTxt').innerHTML = TXT[4]; };
  window.addEventListener('audstop', () => { snd = null; amp = 0; });
  registerSim('t3', { start() { draw(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ② 空氣粒子：聲音是縱波 ---------- */
(() => {
  const cv = document.getElementById('w3air'); if (!cv) return;
  const S = stage(cv, 760, 230), ctx = S.ctx;
  const F = bindRange('w3af', x => x + ' 次／秒', null);
  const A = bindRange('w3aA', x => x + '', null);
  let t = 0, slow = false, mark = 24;
  const COLS = 62, ROWS = 9, X0 = 90, DX = 10.5, Y0 = 40, DY = 19, V = 130;
  const r = rng(3), jit = Array.from({ length: COLS * ROWS }, () => [(r() - .5) * 4, (r() - .5) * 6]);
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const Amax = 0.8 * V / (2 * Math.PI * +F.value), Ause = Math.min(+A.value, Amax);   // 幅度太大時相鄰粒子會互相穿越，自動限制
    const u = x => { const tau = t - (x - X0) / V; return tau < 0 ? 0 : Ause * Math.sin(2 * Math.PI * +F.value * tau); };
    // 喇叭
    const c = u(X0);
    ctx.fillStyle = '#455A64'; ctx.fillRect(20, 80, 30, 70);
    ctx.beginPath(); ctx.moveTo(50, 90); ctx.lineTo(72 + c, 40); ctx.lineTo(72 + c, 190); ctx.lineTo(50, 140); ctx.closePath(); ctx.fillStyle = '#78909C'; ctx.fill();
    label(ctx, '喇叭', 35, 210, { align: 'center', size: 12 });
    for (let i = 0; i < COLS; i++) for (let j = 0; j < ROWS; j++) {
      const x0 = X0 + i * DX, x = x0 + u(x0) + jit[i * ROWS + j][0], y = Y0 + j * DY + jit[i * ROWS + j][1];
      const red = i === mark && j === 4;
      ctx.fillStyle = red ? '#D32F2F' : '#1E88E5'; ctx.beginPath(); ctx.arc(x, y, red ? 5.5 : 3, 0, 7); ctx.fill();
    }
    const xm = X0 + mark * DX;
    ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(211,47,47,.6)'; ctx.beginPath(); ctx.moveTo(xm, 22); ctx.lineTo(xm, 214); ctx.stroke(); ctx.restore();
    label(ctx, '紅點的原位置', xm, 14, { align: 'center', size: 12, color: '#D32F2F' });
    arrow(ctx, 560, 214, 700, 214, '#1565C0', 2.5, 10); label(ctx, '聲波前進方向', 556, 214, { align: 'right', size: 12, color: '#1565C0', bold: true });
  }
  const lp = loop(dt => { t += dt * (slow ? 0.3 : 1); draw(); });
  document.getElementById('w3aSlow').onclick = e => { slow = !slow; e.target.classList.toggle('sel', slow); };
  document.getElementById('w3aMark').onclick = () => { mark = 8 + Math.floor(Math.random() * 50); };
  registerSim('t3', { start() { draw(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ③ 波以耳的真空鈴 ---------- */
(() => {
  const cv = document.getElementById('w3jar'); if (!cv) return;
  const S = stage(cv, 760, 280), ctx = S.ctx;
  const AIR = bindRange('w3air2', v => v + ' %', () => txt());
  let ringing = false, t = 0, next = 0, hang = 'soft', hitT = -9;
  const r = rng(11), mol = Array.from({ length: 160 }, () => ({ x: 230 + r() * 300, y: 50 + r() * 180, vx: (r() - .5) * 160, vy: (r() - .5) * 160 }));
  const loud = () => Math.min(1, (+AIR.value / 100) * 1 + (hang === 'rod' ? 0.22 : 0));
  function txt() {
    const a = +AIR.value, el = document.getElementById('w3jarTxt');
    if (hang === 'rod') el.innerHTML = '🧠 鈴鐺用<b>金屬桿</b>固定在罩子上：空氣抽光後<b>仍然聽得到一點聲音</b>！振動從金屬桿（固體）傳到玻璃罩，再傳到外面的空氣。1650 年代有人做類似實驗就是這樣，誤以為「聲音不需要空氣」。<b>好的實驗要控制變因</b>：鈴鐺必須用軟線吊著，不能碰到罩子。';
    else if (a > 70) el.innerHTML = '空氣很多，鈴聲很清楚。';
    else if (a > 20) el.innerHTML = '空氣愈來愈少，鈴聲<b>愈來愈小</b>……';
    else if (a > 0) el.innerHTML = '只剩一點點空氣，幾乎聽不到了。';
    else el.innerHTML = '空氣抽光了：<b>完全聽不到鈴聲</b>，但你<b>看得到</b>鈴鐺還在敲！<br>→ 聲音需要介質才能傳播；光不需要。這就是波以耳在 1660 年證明的事。';
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    // 罩子
    ctx.save(); ctx.strokeStyle = '#90A4AE'; ctx.lineWidth = 4; ctx.fillStyle = 'rgba(227,242,253,.6)';
    ctx.beginPath(); ctx.moveTo(220, 250); ctx.lineTo(220, 90); ctx.quadraticCurveTo(220, 36, 380, 36); ctx.quadraticCurveTo(540, 36, 540, 90); ctx.lineTo(540, 250); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.fillStyle = '#607D8B'; ctx.fillRect(190, 250, 380, 16);
    // 抽氣機
    ctx.fillStyle = '#5D4037'; ctx.fillRect(600, 200, 110, 66); label(ctx, '抽氣機', 655, 233, { align: 'center', size: 13, color: '#fff', bold: true });
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(570, 258); ctx.lineTo(600, 240); ctx.stroke();
    // 空氣分子
    const n = Math.round(mol.length * +AIR.value / 100);
    ctx.fillStyle = 'rgba(30,136,229,.7)'; for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(mol[i].x, mol[i].y, 3, 0, 7); ctx.fill(); }
    // 吊線或金屬桿
    if (hang === 'soft') { ctx.strokeStyle = '#8D6E63'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(380, 40); ctx.quadraticCurveTo(372, 70, 380, 98); ctx.stroke(); }
    else { ctx.fillStyle = '#546E7A'; ctx.fillRect(376, 38, 8, 62); }
    // 鈴
    const sh = (t - hitT) < 0.25 ? Math.sin((t - hitT) * 90) * 4 * (1 - (t - hitT) / 0.25) : 0;
    ctx.save(); ctx.translate(380 + sh, 100);
    ctx.fillStyle = '#F9A825'; ctx.beginPath(); ctx.moveTo(-34, 70); ctx.quadraticCurveTo(-34, 0, 0, 0); ctx.quadraticCurveTo(34, 0, 34, 70); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#F57F17'; ctx.fillRect(-38, 66, 76, 8); ctx.restore();
    // 小鎚
    const ang = ringing ? ((t - hitT) < 0.12 ? 0 : 0.5) : 0.5;
    ctx.save(); ctx.translate(470, 210); ctx.rotate(-ang - 0.25); ctx.strokeStyle = '#4E342E'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-58, -30); ctx.stroke();
    ctx.fillStyle = '#4E342E'; ctx.beginPath(); ctx.arc(-60, -31, 8, 0, 7); ctx.fill(); ctx.restore();
    // 聲音大小指示
    const L = ringing ? loud() : 0;
    ctx.fillStyle = '#ECEFF1'; ctx.fillRect(40, 60, 26, 180); ctx.fillStyle = '#43A047'; ctx.fillRect(40, 240 - 180 * L, 26, 180 * L);
    label(ctx, '聽到的', 53, 36, { align: 'center', size: 12, bold: true }); label(ctx, '音量', 53, 50, { align: 'center', size: 12, bold: true });
    label(ctx, '👀 看得到鈴在動', 380, 20, { align: 'center', size: 13, color: '#2E7D32', bold: true });
  }
  const lp = loop(dt => {
    t += dt;
    const n = Math.round(mol.length * +AIR.value / 100);
    for (let i = 0; i < n; i++) { const m = mol[i]; m.x += m.vx * dt; m.y += m.vy * dt; if (m.x < 226 || m.x > 534) m.vx *= -1; if (m.y < 50 || m.y > 246) m.vy *= -1; }
    if (ringing && t >= next) { hitT = t; next = t + 0.5; const L = loud(); if (L > 0.005) AUD.ding({ freq: 1320, harm: [1, 0.5, 0.25, 0.3], vol: 0.3 * L, dur: 0.45 }); }
    draw();
  });
  document.getElementById('w3ring').onclick = () => { ringing = true; next = t; AUD.ctx(); };
  document.getElementById('w3stop').onclick = () => { ringing = false; };
  window.addEventListener('audstop', () => { ringing = false; });
  $$('#w3hang .chip').forEach(c => c.onclick = () => { hang = c.dataset.h; $$('#w3hang .chip').forEach(x => x.classList.toggle('on', x === c)); txt(); });
  txt();
  registerSim('t3', { start() { draw(); lp.start(); }, stop() { lp.stop(); ringing = false; }, resize: draw });
})();

/* ---------- ④ 聲音賽跑 ---------- */
(() => {
  const cv = document.getElementById('w3race'); if (!cv) return;
  const S = stage(cv, 760, 250), ctx = S.ctx;
  const T = bindRange('w3T', v => v + ' ℃', () => { t = 0; run = false; draw(); info(); });
  const steel = document.getElementById('w3steel');
  let t = 0, run = false;
  const lanes = () => [
    { n: '🌬️ 空氣', v: 331 + 0.6 * +T.value, c: '#64B5F6' },
    { n: '💧 水', v: 1463, c: '#1E88E5' },
    { n: '🪵 木頭', v: 3352, c: '#8D6E63' },
    ...(steel.checked ? [{ n: '🔩 鋼鐵', v: 5900, c: '#546E7A' }] : []),
  ];
  const X0 = 110, X1 = 720, D = 1000;
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const L = lanes(), h = 210 / L.length;
    L.forEach((ln, i) => {
      const y = 20 + i * h + h / 2;
      ctx.fillStyle = i % 2 ? '#FAFAFA' : '#F1F4F6'; ctx.fillRect(X0, y - h / 2 + 2, X1 - X0, h - 4);
      label(ctx, ln.n, 10, y, { size: 14, bold: true });
      const d = Math.min(D, ln.v * t), x = X0 + d / D * (X1 - X0);
      ctx.save(); ctx.strokeStyle = ln.c; ctx.lineWidth = 3;
      for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(x - k * 9, y, 10, -0.9, 0.9); ctx.stroke(); }
      ctx.restore();
      if (d >= D) label(ctx, '🏁 ' + fmt(D / ln.v, 3) + ' 秒', X1 - 6, y, { align: 'right', size: 13, bold: true, color: '#2E7D32', bg: 'rgba(255,255,255,.9)' });
    });
    ctx.fillStyle = '#C62828'; ctx.fillRect(X1, 16, 4, 214);
    label(ctx, '0 m', X0, 240, { align: 'center', size: 12 }); label(ctx, '1000 m', X1, 240, { align: 'center', size: 12 });
    label(ctx, '經過 ' + fmt(t, 3) + ' 秒', S.W / 2, 240, { align: 'center', size: 12, bold: true });
  }
  function info() {
    document.getElementById('w3raceR').innerHTML = lanes().map(l => `<div><span>${l.n}</span><b>${fmt(l.v, 1)} m/s</b></div>`).join('');
  }
  const lp = loop(dt => { if (!run) return; t += dt / 2; if (t > 1000 / lanes()[0].v + 0.05) run = false; draw(); });
  document.getElementById('w3raceGo').onclick = () => { t = 0; run = true; };
  steel.onchange = () => { t = 0; draw(); info(); };
  registerSim('t3', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ⑤ 閃電打雷遊戲 ---------- */
(() => {
  const cv = document.getElementById('w3storm'); if (!cv) return;
  const S = stage(cv, 760, 220), ctx = S.ctx;
  let st = null, t = 0, flashT = -9, rounds = [], thunder = null;
  function draw() {
    S.fit();
    const fl = t - flashT < 0.15;
    ctx.fillStyle = fl ? '#FFFDE7' : '#263238'; ctx.fillRect(0, 0, S.W, S.H);
    ctx.fillStyle = fl ? '#B0BEC5' : '#37474F'; ctx.beginPath(); ctx.ellipse(500, 40, 200, 40, 0, 0, 7); ctx.fill();
    if (st && fl) {
      ctx.save(); ctx.strokeStyle = '#FFF176'; ctx.lineWidth = 4; ctx.beginPath(); let x = st.x, y = 60; ctx.moveTo(x, y);
      const r = rng(st.seed); while (y < 180) { x += (r() - .5) * 40; y += 18; ctx.lineTo(x, y); } ctx.stroke(); ctx.restore();
    }
    ctx.fillStyle = '#33691E'; ctx.fillRect(0, 180, S.W, 40);
    ctx.font = '30px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🧍', 60, 160);
    if (st && st.arrived && t - st.arr < 1.5) label(ctx, '轟隆隆隆……', 380, 120, { align: 'center', size: 22, bold: true, color: '#FFCC80' });
    if (st && !st.done) label(ctx, '⏱ ' + fmt(t - st.t0, 1) + ' 秒', S.W - 14, 200, { align: 'right', size: 16, bold: true, color: '#fff' });
  }
  function info() {
    const last = rounds[rounds.length - 1];
    document.getElementById('w3stormR').innerHTML = last ? `
      <div><span>你數的時間差</span><b>${fmt(last.dt, 1)} 秒</b></div><div><span>你估的距離（×340）</span><b>${fmt(last.dt * 340 / 1000, 2)} 公里</b></div>
      <div><span>實際距離</span><b>${fmt(last.d / 1000, 2)} 公里</b></div><div><span>已玩回合</span><b>${rounds.length}</b></div>` : '<div><span>狀態</span><b>按「⚡ 打雷了！」開始</b></div>';
  }
  const lp = loop(dt => {
    t += dt;
    if (st && !st.arrived && t - st.t0 >= st.d / 340) { st.arrived = true; st.arr = t; }
    draw();
  });
  document.getElementById('w3flash').onclick = () => {
    if (thunder) thunder.stop(); thunder = AUD.group();   // 只取消上一回合還沒響的雷聲
    const d = 500 + Math.round(Math.random() * 45) * 100;   // 0.5～5 公里
    st = { d, t0: t, x: 200 + Math.random() * 500, seed: Math.floor(Math.random() * 1e6), arrived: false, done: false };
    flashT = t;
    AUD.clap({ dest: thunder.node, delay: d / 340, dur: 2.6, lowpass: 260 + 2000 * 500 / d, decay: 1.4, vol: Math.min(1, 1.6 * 1000 / d + 0.3) });
    document.getElementById('w3stormTxt').innerHTML = '⚡ 看到閃電了！開始數：一千零一、一千零二……聽到雷聲就按「👂 聽到了！」';
  };
  document.getElementById('w3heard').onclick = () => {
    if (!st || st.done) return;
    st.done = true; const dt = t - st.t0; rounds.push({ dt, d: st.d });
    const err = Math.abs(dt * 340 - st.d) / st.d;
    document.getElementById('w3stormTxt').innerHTML = `${err < 0.15 ? '🎯 <b>很準！</b>' : '🙂 <b>再練習一下！</b>'} 雷聲實際要 ${fmt(st.d / 340, 1)} 秒才傳到你這裡。<br>距離 ＝ 聲速 × 時間差 ＝ 340 × ${fmt(st.d / 340, 1)} ≈ <b>${fmt(st.d / 1000, 1)} 公里</b>。<br>⚠️ 聽得到雷聲，就表示你在雷擊範圍內，應立刻進到室內。`;
    info();
  };
  info();
  registerSim('t3', { start() { draw(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ⑥ 百米計時員 ---------- */
(() => {
  const cv = document.getElementById('w3gun'); if (!cv) return;
  const S = stage(cv, 420, 200), ctx = S.ctx;
  const D = bindRange('w3gD', v => v + ' 公尺', () => { draw(); info(); });
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#D84315'; ctx.fillRect(20, 110, 380, 50);
    for (let k = 0; k < 4; k++) { ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(20, 110 + k * 16.6); ctx.lineTo(400, 110 + k * 16.6); ctx.stroke(); }
    const xs = 40, xe = 40 + Math.min(1, +D.value / 200) * 340;
    ctx.font = '26px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🔫', xs, 90); ctx.fillText('⏱️', xe, 90);
    label(ctx, '起跑槍（冒煙＋槍聲）', xs, 54, { size: 12, bold: true });
    label(ctx, '計時員', xe, 182, { align: 'center', size: 12, bold: true });
    dim(ctx, xs, 70, xe, 70, D.value + ' m', '#333');
  }
  function info() {
    const d = +D.value, ts = d / 340;
    document.getElementById('w3gunR').innerHTML = `<div><span>槍聲傳到計時員</span><b>${fmt(ts, 3)} 秒</b></div><div><span>槍口的煙（光）傳到</span><b>約 ${fmt(d / 3e8 * 1e6, 2)} 微秒</b></div>`;
    document.getElementById('w3gunTxt').innerHTML = `如果「聽到槍聲」才按碼錶，就晚按了 <b>${fmt(ts, 2)} 秒</b>，選手的成績會被算得比較快。百米世界紀錄只有 9.58 秒，差 ${fmt(ts, 2)} 秒可是天大的差別！<br>所以以前的計時員要<b>看槍口冒煙</b>就按錶；現在則改用電子計時，起跑槍和計時器直接連線。`;
  }
  registerSim('t3', { start() { draw(); info(); }, resize: draw });
})();

/* ---------- ⑦ 資優：粒子彈簧鏈 ---------- */
(() => {
  const cv = document.getElementById('w3chain'); if (!cv) return;
  const S = stage(cv, 760, 140), ctx = S.ctx;
  const K = bindRange('w3k', v => ['', '很軟（像氣體）', '軟', '中', '中', '中硬', '硬', '硬', '很硬', '非常硬（像鋼鐵）'][v], () => reset());
  const N = 34, X0 = 40, DX = 20;
  let x = [], v = [], t = 0, arrive = null;
  function reset() { x = Array(N).fill(0); v = Array(N).fill(0); t = 0; arrive = null; draw(); }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    for (let i = 0; i < N - 1; i++) {
      const a = X0 + i * DX + x[i], b = X0 + (i + 1) * DX + x[i + 1];
      ctx.strokeStyle = '#90A4AE'; ctx.lineWidth = 1 + +K.value * 0.35; ctx.beginPath();
      for (let s = 0; s <= 1; s += 0.1) ctx.lineTo(a + (b - a) * s, 60 + (s > 0.05 && s < 0.95 ? (Math.round(s * 10) % 2 ? -5 : 5) : 0));
      ctx.stroke();
    }
    x.forEach((d, i) => { ctx.fillStyle = i === N - 1 ? '#C62828' : '#1E88E5'; ctx.beginPath(); ctx.arc(X0 + i * DX + d, 60, 6, 0, 7); ctx.fill(); });
    label(ctx, arrive != null ? `推動傳到最右邊花了 ${fmt(arrive, 2)}（相對時間）` : '最右邊的紅球什麼時候開始動？', S.W / 2, 112, { align: 'center', size: 14, bold: true, bg: '#F3E5F5' });
  }
  const lp = loop(dt => {
    const k = +K.value * 30, sub = 20, h = dt / sub;
    for (let s = 0; s < sub; s++) {
      for (let i = 0; i < N; i++) {
        let f = 0;
        if (i > 0) f += k * (x[i - 1] - x[i]);
        if (i < N - 1) f += k * (x[i + 1] - x[i]);
        v[i] += f * h; v[i] *= 0.9995;
      }
      for (let i = 0; i < N; i++) x[i] += v[i] * h;
      t += h;
      if (arrive == null && Math.abs(x[N - 1]) > 1) arrive = t;
    }
    draw();
  });
  document.getElementById('w3push').onclick = () => { reset(); v[0] = 220; };
  reset();
  registerSim('t3', { start() { draw(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

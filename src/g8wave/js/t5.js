/* ===== 分頁 5：聲波的傳播與應用（回聲、超聲波） ===== */

/* ---------- ① 山谷回聲 ---------- */
(() => {
  const cv = document.getElementById('w5echo'); if (!cv) return;
  const S = stage(cv, 760, 230), ctx = S.ctx;
  const D = bindRange('w5d', v => v + ' 公尺', () => { pulse = null; draw(); info(); });
  const T = bindRange('w5T', v => v + ' ℃', () => info());
  let pulse = null, t = 0;
  const v = () => 331 + 0.6 * +T.value;
  const X0 = 80, X1 = 690;
  const wallX = () => X0 + (X1 - X0) * Math.min(1, +D.value / 700);
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#E3F2FD'; ctx.fillRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#8D6E63'; ctx.beginPath(); ctx.moveTo(wallX(), 210); ctx.lineTo(wallX() + 10, 30); ctx.lineTo(wallX() + 70, 20); ctx.lineTo(S.W, 40); ctx.lineTo(S.W, 210); ctx.fill();
    ctx.fillStyle = '#7CB342'; ctx.fillRect(0, 200, S.W, 30);
    ctx.font = '30px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🧍', X0 - 30, 175);
    dim(ctx, X0, 214, wallX(), 214, D.value + ' m', '#333', 'bottom');
    if (pulse) {
      const d = v() * (t - pulse.t0), L = +D.value;
      const toPx = m => X0 + (wallX() - X0) * m / L;
      if (d < L) { ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(toPx(d) - k * 8, 120, 26, -0.7, 0.7); ctx.stroke(); } label(ctx, '原聲 →', toPx(d), 80, { align: 'center', size: 12, bold: true, color: '#1565C0' }); }
      else if (d < 2 * L) { ctx.strokeStyle = '#C62828'; ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(toPx(2 * L - d) + k * 8, 120, 26, Math.PI - 0.7, Math.PI + 0.7); ctx.stroke(); } label(ctx, '← 回聲', toPx(2 * L - d), 80, { align: 'center', size: 12, bold: true, color: '#C62828' }); }
      label(ctx, '⏱ ' + fmt(Math.min(t - pulse.t0, 2 * L / v()), 2) + ' 秒', S.W - 14, 20, { align: 'right', size: 15, bold: true, bg: '#fff' });
    }
  }
  function info() {
    const L = +D.value, tt = 2 * L / v();
    document.getElementById('w5echoR').innerHTML = `<div><span>聲速</span><b>${fmt(v(), 1)} m/s</b></div><div><span>來回總路程</span><b>${2 * L} m</b></div><div><span>回聲晚多久到</span><b>${fmt(tt, 2)} 秒</b></div>`;
    document.getElementById('w5echoTxt').innerHTML = tt < 0.1
      ? `來回只要 ${fmt(tt, 2)} 秒，<b>不到 0.1 秒</b>，人耳分不出原聲和回聲，只覺得聲音比較「響」。（這就是教室裡聽不到回聲的原因）`
      : `回聲晚了 ${fmt(tt, 2)} 秒才回來，聽得出「喂～……喂～」。<br>反過來算：距離＝${fmt(v(), 0)}×${fmt(tt, 2)}÷2＝<b>${L} 公尺</b>。`;
  }
  const lp = loop(dt => { t += dt; if (pulse && v() * (t - pulse.t0) > 2 * +D.value + 50) pulse = null; draw(); });
  document.getElementById('w5shout').onclick = () => {
    pulse = { t0: t };
    const tt = 2 * +D.value / v();
    const voice = [1, 0.6, 0.4, 0.3, 0.2];
    AUD.ding({ freq: 330, harm: voice, vol: 0.35, dur: 0.35 });
    AUD.ding({ freq: 330, harm: voice, vol: 0.35 * Math.max(0.12, 1 - +D.value / 900), dur: 0.35, delay: tt });
  };
  registerSim('t5', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ② 禮堂牆面 ---------- */
(() => {
  const cv = document.getElementById('w5hall'); if (!cv) return;
  const S = stage(cv, 760, 220), ctx = S.ctx;
  const WALL = {
    brick: { nm: '磚砌牆面', r: 0.85, c: '#B5651D', txt: '堅硬的磚牆把大部分聲音<b>反射</b>回來：一聲拍手後還有一長串「嗡嗡」的殘響，演講會聽不清楚。' },
    tile: { nm: '光滑磁磚', r: 0.92, c: '#B0BEC5', txt: '光滑磁磚反射最強，殘響最長——像浴室唱歌特別「好聽」的原因。' },
    curtain: { nm: '布幔', r: 0.45, c: '#8E24AA', txt: '柔軟的布幔吸收了不少聲音，殘響變短，聲音比較清楚。' },
    foam: { nm: '吸音海綿', r: 0.18, c: '#546E7A', txt: '吸音海綿表面柔軟、有很多小孔，把聲音<b>吸收</b>掉，幾乎沒有殘響——錄音室常用。' },
    bumpy: { nm: '凹凸紋路板', r: 0.55, c: '#A1887F', txt: '凹凸紋路把聲音往各個方向打散（擴散），不會集中反射成明顯的回聲。音樂廳常用來減少回聲（課本圖 3-26）。' },
  };
  let k = 'brick', rays = [], t = 0;
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const w = WALL[k];
    ctx.fillStyle = '#FFF8E1'; ctx.fillRect(40, 30, 680, 160);
    ctx.fillStyle = w.c; ctx.fillRect(20, 20, 720, 12); ctx.fillRect(20, 188, 720, 12); ctx.fillRect(20, 20, 20, 180); ctx.fillRect(720, 20, 20, 180);
    if (k === 'bumpy' || k === 'foam') { ctx.fillStyle = 'rgba(0,0,0,.2)'; for (let x = 24; x < 736; x += 14) { ctx.fillRect(x, 24, 7, 6); ctx.fillRect(x, 192, 7, 6); } }
    ctx.font = '26px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('👏', 160, 110); ctx.fillText('🧑‍🎓', 600, 110);
    rays.forEach(r => { ctx.fillStyle = `rgba(21,101,192,${r.e})`; ctx.beginPath(); ctx.arc(r.x, r.y, 3, 0, 7); ctx.fill(); });
    label(ctx, w.nm + '｜反射約 ' + Math.round(w.r * 100) + '%', S.W / 2, 10, { align: 'center', size: 12, bold: true });
  }
  const lp = loop(dt => {
    t += dt; const w = WALL[k];
    rays.forEach(r => {
      r.x += r.vx * dt; r.y += r.vy * dt;
      const hit = () => { r.e *= w.r; if (k === 'bumpy') { const a = Math.random() * Math.PI * 2, s = Math.hypot(r.vx, r.vy); r.vx = Math.cos(a) * s; r.vy = Math.sin(a) * s; } };
      if (r.x < 42) { r.x = 42; r.vx = Math.abs(r.vx); hit(); } if (r.x > 718) { r.x = 718; r.vx = -Math.abs(r.vx); hit(); }
      if (r.y < 34) { r.y = 34; r.vy = Math.abs(r.vy); hit(); } if (r.y > 186) { r.y = 186; r.vy = -Math.abs(r.vy); hit(); }
    });
    rays = rays.filter(r => r.e > 0.05);
    draw();
  });
  $$('#w5wall .chip').forEach(c => c.onclick = () => { k = c.dataset.k; $$('#w5wall .chip').forEach(x => x.classList.toggle('on', x === c)); rays = []; document.getElementById('w5hallTxt').innerHTML = WALL[k].txt; draw(); });
  document.getElementById('w5clap').onclick = () => {
    rays = Array.from({ length: 90 }, (_, i) => { const a = i / 90 * Math.PI * 2; return { x: 160, y: 110, vx: Math.cos(a) * 260, vy: Math.sin(a) * 260, e: 1 }; });
    const r = WALL[k].r;
    AUD.clap({ vol: 0.7, dur: 0.08 });
    for (let i = 1; i <= 14; i++) { const e = Math.pow(r, i * 1.1); if (e < 0.03) break; AUD.clap({ delay: i * 0.07 + Math.random() * 0.02, vol: 0.5 * e, dur: 0.08, lowpass: k === 'curtain' ? 1500 : 6000 }); }
  };
  document.getElementById('w5hallTxt').innerHTML = WALL[k].txt;
  registerSim('t5', { start() { draw(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ③ 聽力極限與動物 ---------- */
(() => {
  const cv = document.getElementById('w5hear'); if (!cv) return;
  const S = stage(cv, 760, 240), ctx = S.ctx;
  const s2f = s => Math.round(10 * Math.pow(10, s / 100 * 4.1));   // 10 Hz～約 126 kHz
  const f2s = f => Math.round(Math.log10(f / 10) / 4.1 * 100);
  const flab = f => f >= 1000 ? fmt(f / 1000, 1) + ' kHz' : f + ' Hz';
  let curF = s2f(50);   // 目前頻率（精確值；快捷鈕不經過拉桿取整）
  const F = bindRange('w5hf', s => flab(s2f(s)), s => { curF = s2f(s); upd(); });
  let snd = null;
  const TXT0 = document.getElementById('w5hTxt').innerHTML;
  const AN = [['🧑 人', 20, 20000, '#1565C0'], ['🐕 狗', 15, 50000, '#8D6E63'], ['🐈 貓', 60, 65000, '#F57C00'], ['🐬 海豚', 2000, 100000, '#00838F'], ['🦇 蝙蝠', 1000, 120000, '#6A1B9A']];
  const X0 = 90, X1 = 740, lx = f => X0 + (X1 - X0) * Math.log10(f / 10) / 4.1;
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = 'rgba(255,235,59,.25)'; ctx.fillRect(lx(20), 10, lx(20000) - lx(20), 190);
    ctx.fillStyle = 'rgba(244,67,54,.08)'; ctx.fillRect(lx(20000), 10, X1 - lx(20000), 190);
    label(ctx, '超聲波', (lx(20000) + X1) / 2, 20, { align: 'center', size: 12, bold: true, color: '#C62828' });
    label(ctx, '次聲波', (X0 + lx(20)) / 2, 20, { align: 'center', size: 12, bold: true, color: '#6D4C41' });
    AN.forEach(([n, a, b, c], i) => { const y = 44 + i * 32; label(ctx, n, 10, y, { size: 14, bold: true }); ctx.fillStyle = c; rrect(ctx, lx(a), y - 9, lx(b) - lx(a), 18, 9); ctx.fill(); label(ctx, a + '～' + b + ' Hz', lx(a) + 8, y, { size: 12, color: '#fff', bold: true }); });
    [10, 100, 1000, 10000, 100000].forEach(f => label(ctx, f >= 1000 ? f / 1000 + 'k' : f, lx(f), 214, { align: 'center', size: 12 }));
    label(ctx, '頻率（Hz）', X1, 232, { align: 'right', size: 12 });
    const f = curF, x = lx(f);
    ctx.fillStyle = '#C62828'; ctx.fillRect(x - 1.5, 30, 3, 172);
  }
  function upd() {
    const f = curF;
    if (snd) { if (f > 22000 || f < 15) snd.vol(0); else { snd.freq(f); snd.vol(0.12); } }
    const who = AN.filter(a => f >= a[1] && f <= a[2]).map(a => a[0]).join('、') || '（都聽不到）';
    document.getElementById('w5hR').innerHTML = `<div><span>頻率</span><b>${f} Hz</b></div><div><span>空氣中的聲速</span><b>約 340 m/s</b></div>
      <div><span>波長＝v÷f</span><b>${340 / f >= 1 ? fmt(340 / f, 2) + ' 公尺' : fmt(34000 / f, 2) + ' 公分'}</b></div><div><span>聽得到的動物</span><b>${who}</b></div>`;
    const T = document.getElementById('w5hTxt');
    if (f > 22000) T.innerHTML = `${f} Hz 是<b>超聲波</b>：人耳聽不到（電腦喇叭也放不出來，所以這裡不發聲）。注意：聲速仍然是約 340 m/s，<b>和一般聲音一樣</b>，只是波長很短。`;
    else if (f > 20000) T.innerHTML = `${f} Hz 已經超過 20000 赫，屬於<b>超聲波</b>，一般人聽不到。聲速仍然約 340 m/s。`;
    else if (f < 20) T.innerHTML = `${f} Hz 低於 20 赫，屬於<b>次聲波</b>，人耳聽不到（大象、鯨魚會用）。筆電喇叭也放不出這麼低的音。`;
    else T.innerHTML = TXT0;
    draw();
  }
  document.getElementById('w5hPlay').onclick = () => { if (!snd) snd = AUD.tone({ freq: curF, vol: 0.12 }); upd(); };
  document.getElementById('w5hStop').onclick = () => { if (snd) snd.stop(); snd = null; };
  window.addEventListener('audstop', () => { snd = null; });
  $$('#w5hPre .chip').forEach(c => c.onclick = () => { curF = +c.dataset.f; F.value = f2s(curF); $('output[for="w5hf"]').textContent = flab(curF); upd(); });
  registerSim('t5', { start() { draw(); upd(); }, resize: draw });
})();

/* ---------- ④ 聲納 ---------- */
(() => {
  const cv = document.getElementById('w5sonar'); if (!cv) return;
  const S = stage(cv, 760, 280), ctx = S.ctx;
  const SEA = 60, MAXD = 600, PY = 200 / MAXD;   // 海面 y=60，最深 600 m 對應 200 px
  const depth = x => 260 + 160 * Math.sin(x / 90) + 90 * Math.sin(x / 37 + 1) + (x > 430 && x < 520 ? -180 * Math.sin((x - 430) / 90 * Math.PI) : 0);
  const fish = x => x > 200 && x < 260 ? 110 : null;
  let ship = 40, auto = false, pings = [], map = [], last = null;
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#E3F2FD'; ctx.fillRect(0, 0, S.W, SEA);
    ctx.fillStyle = '#1565C0'; ctx.fillRect(0, SEA, S.W, S.H - SEA);
    ctx.fillStyle = '#5D4037'; ctx.beginPath(); ctx.moveTo(0, S.H);
    for (let x = 0; x <= S.W; x += 4) ctx.lineTo(x, SEA + depth(x) * PY); ctx.lineTo(S.W, S.H); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.75)'; for (let x = 205; x < 258; x += 9) { ctx.font = '12px sans-serif'; ctx.fillText('🐟', x, SEA + 110 * PY + (x % 3) * 4); }
    pings.forEach(p => {
      const y = SEA + p.d * PY;
      ctx.strokeStyle = p.up ? '#FFEB3B' : '#80DEEA'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(p.x, y, 12, p.up ? Math.PI + 0.6 : 0.6, p.up ? -0.6 : Math.PI - 0.6); ctx.stroke();
    });
    // 已量到的點（畫在上方小地圖）
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(0, 0, S.W, 0);
    map.forEach(m => { ctx.fillStyle = m.fish ? '#FFEB3B' : '#FF7043'; ctx.beginPath(); ctx.arc(m.x, SEA + m.d * PY, 3.5, 0, 7); ctx.fill(); });
    ctx.font = '28px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🚢', ship, SEA - 14);
    for (let d = 0; d <= 600; d += 200) label(ctx, d + ' m', S.W - 6, SEA + d * PY + (d ? 0 : 8), { align: 'right', size: 11, color: '#E3F2FD' });
  }
  function ping(x) {
    ship = x; const f = fish(x), d = f ?? depth(x);
    pings.push({ x, d: 0, tgt: d, up: false, fish: !!f });
  }
  const lp = loop(dt => {
    const V = 1500, SLOW = 1;
    pings.forEach(p => {
      if (!p.up) { p.d += V * dt * SLOW; if (p.d >= p.tgt) { p.d = p.tgt; p.up = true; p.t = 0; } }
      else { p.d -= V * dt * SLOW; if (p.d <= 0) { p.done = true; map.push({ x: p.x, d: p.tgt, fish: p.fish }); last = p; AUD.ding({ freq: 2200, vol: 0.06, dur: 0.12 });
        document.getElementById('w5sR').innerHTML = `<div><span>來回時間</span><b>${fmt(2 * p.tgt / V, 3)} 秒</b></div><div><span>深度＝1500×t÷2</span><b>${fmt(p.tgt, 0)} 公尺</b></div><div><span>判斷</span><b>${p.fish ? '🐟 回聲提早：魚群！' : '海底'}</b></div><div><span>已量測點數</span><b>${map.length}</b></div>`; } }
    });
    pings = pings.filter(p => !p.done);
    if (auto && !pings.length) { if (ship > S.W - 30) auto = false; else ping(ship + 24); }
    draw();
  });
  cv.addEventListener('pointerdown', e => { const p = S.pt(e); ping(clamp(p.x, 20, S.W - 20)); });
  document.getElementById('w5sAuto').onclick = () => { auto = true; if (ship > S.W - 40) { ship = 20; } ping(ship); };
  document.getElementById('w5sClear').onclick = () => { map = []; pings = []; auto = false; ship = 40; draw(); };
  registerSim('t5', { start() { draw(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ⑤ 倒車雷達 ---------- */
(() => {
  const cv = document.getElementById('w5car'); if (!cv) return;
  const S = stage(cv, 760, 220), ctx = S.ctx;
  const D = bindRange('w5cd', v => v + ' 公分', () => { draw(); info(); });
  let obj = 'wall', on = false, next = 0, t = 0;
  const OX = 640, PX = 2;   // 障礙物在 x=640，1 cm = 2 px
  const detected = () => obj !== 'kid' || +D.value > 60;   // 太近時低矮的小朋友落在感測器死角
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#ECEFF1'; ctx.fillRect(0, 180, S.W, 40);
    const rear = OX - +D.value * PX, cx = rear - 220;
    ctx.fillStyle = '#1976D2'; rrect(ctx, cx, 110, 220, 60, 10); ctx.fill(); rrect(ctx, cx + 30, 80, 140, 40, 10); ctx.fill();
    ctx.fillStyle = '#263238'; ctx.beginPath(); ctx.arc(cx + 45, 172, 16, 0, 7); ctx.arc(cx + 175, 172, 16, 0, 7); ctx.fill();
    ctx.fillStyle = '#FFEB3B'; ctx.fillRect(rear - 4, 140, 6, 8);
    // 感測範圍（扇形）
    ctx.fillStyle = 'rgba(255,193,7,.18)'; ctx.beginPath(); ctx.moveTo(rear, 144); ctx.lineTo(rear + 400, 70); ctx.lineTo(rear + 400, 150); ctx.closePath(); ctx.fill();
    label(ctx, '超聲波感測範圍', rear + 10, 92, { size: 11, color: '#8D6E00' });
    if (obj === 'wall') { ctx.fillStyle = '#A1887F'; ctx.fillRect(OX, 30, 40, 150); }
    if (obj === 'pole') { ctx.fillStyle = '#FBC02D'; ctx.fillRect(OX, 60, 10, 120); }
    if (obj === 'kid') { ctx.font = '34px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🧒', OX + 14, 166); }
    dim(ctx, rear, 200, OX, 200, D.value + ' cm', '#333', 'bottom');
  }
  function info() {
    const d = +D.value, tt = 2 * d / 100 / 340;
    const lvl = !detected() ? '偵測不到！' : d > 150 ? '嗶……嗶……（慢）' : d > 80 ? '嗶、嗶、嗶（快）' : d > 40 ? '嗶嗶嗶嗶（很快）' : '嗶————（長音，停！）';
    document.getElementById('w5cR').innerHTML = `<div><span>回聲來回時間</span><b>${fmt(tt * 1000, 2)} 毫秒</b></div><div><span>距離＝340×t÷2</span><b>${d} cm</b></div><div><span>警示聲</span><b>${lvl}</b></div>`;
    document.getElementById('w5cTxt').innerHTML = obj === 'kid' && !detected()
      ? '⚠️ <b>小朋友蹲在車尾正下方，落在感測器的死角</b>，雷達完全沒反應！這就是課本漫畫裡「蹲在車後很危險」的原因。改善方法：加裝更多感測器、倒車攝影機，倒車前先繞車一圈確認。'
      : obj === 'pole' ? '細柱子反射的超聲波比較少，有時偵測不穩定。倒車雷達只是輔助，還是要用眼睛確認。'
        : '倒車雷達發出約 40000 赫的超聲波，接收回聲計算距離；距離愈近，嗶聲愈快。';
  }
  const lp = loop(dt => {
    t += dt;
    if (on && t >= next && detected()) {
      const d = +D.value;
      if (d <= 40) { AUD.ding({ freq: 2000, vol: 0.12, dur: 0.18 }); next = t + 0.15; }
      else { AUD.ding({ freq: 2000, vol: 0.12, dur: 0.1 }); next = t + (d > 150 ? 0.8 : d > 80 ? 0.4 : 0.18); }
    }
  });
  $$('#w5cObj .chip').forEach(c => c.onclick = () => { obj = c.dataset.k; $$('#w5cObj .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); info(); });
  document.getElementById('w5cBeep').onclick = () => { on = true; next = t; AUD.ctx(); };
  document.getElementById('w5cOff').onclick = () => { on = false; };
  window.addEventListener('audstop', () => { on = false; });
  registerSim('t5', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); on = false; }, resize: draw });
})();

/* ---------- ⑥ 資優：都卜勒效應 ----------
   聲音的頻率用真實公式 f' = f·v/(v ∓ vs)；畫面上的聲波故意畫慢（約 160 px/s），讓波峰擠在一起看得清楚 */
(() => {
  const cv = document.getElementById('w5dop'); if (!cv) return;
  const S = stage(cv, 760, 200), ctx = S.ctx;
  const VS = bindRange('w5dv', v => v + ' m/s（約 ' + Math.round(v * 3.6) + ' km/h）', null);
  const F0 = 700, V = 340, WV = 160;   // WV：畫面上聲波擴散速率（px/s）
  let run = false, x = 0, t = 0, fronts = [], snd = null, lastEmit = 0;
  const cvx = () => +VS.value * 2.2;   // 車子在畫面上的速率（px/s）；速率 0 時停在原地
  const heard = () => { const vs = +VS.value; return x < S.W / 2 ? F0 * V / (V - vs) : F0 * V / (V + vs); };
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#ECEFF1'; ctx.fillRect(0, 150, S.W, 50);
    fronts.forEach(f => { const r = (t - f.t) * WV; if (r > 900) return; ctx.strokeStyle = 'rgba(198,40,40,.4)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(f.x, 120, r, 0, 7); ctx.stroke(); });
    ctx.font = '34px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🚑', x, 128);
    ctx.font = '30px sans-serif'; ctx.fillText('🧍', S.W / 2, 165);
    label(ctx, run ? `你聽到約 ${Math.round(heard())} Hz（警笛本身 ${F0} Hz）` : '按「開過來」', 14, 20, { size: 14, bold: true, bg: '#F3E5F5' });
    label(ctx, '畫面中聲波故意畫慢，讓波峰的疏密看得清楚', S.W - 10, 20, { align: 'right', size: 11, color: '#777' });
  }
  const lp = loop(dt => {
    if (!run) return;
    t += dt; x += cvx() * dt;
    if (+VS.value === 0 && t > 4) { run = false; if (snd) snd.stop(); snd = null; }
    if (t - lastEmit > 0.12) { fronts.push({ x, t }); lastEmit = t; if (fronts.length > 70) fronts.shift(); }
    if (snd) snd.freq(heard());
    if (x > S.W - 20) { run = false; if (snd) snd.stop(); snd = null; }
    draw();
  });
  document.getElementById('w5dGo').onclick = () => { x = +VS.value === 0 ? 200 : 20; t = 0; lastEmit = -1; fronts = []; run = true; if (snd) snd.stop(); snd = AUD.tone({ freq: heard(), harm: [1, 0.3, 0.1], vol: 0.12 }); };
  window.addEventListener('audstop', () => { snd = null; run = false; });
  registerSim('t5', { start() { draw(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

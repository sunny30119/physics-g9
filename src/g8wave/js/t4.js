/* ===== 分頁 4：多變的聲音（聲音三要素） ===== */

/* 示波器畫法：fn(秒) → -1～1；窗寬 win 秒 */
function scope(ctx, x, y, w, h, fn, win, opt = {}) {
  ctx.save();
  ctx.fillStyle = opt.bg || '#0B1F1A'; rrect(ctx, x, y, w, h, 8); ctx.fill();
  ctx.strokeStyle = 'rgba(120,255,180,.12)'; ctx.lineWidth = 1;
  for (let i = 1; i < 10; i++) { ctx.beginPath(); ctx.moveTo(x + w * i / 10, y); ctx.lineTo(x + w * i / 10, y + h); ctx.stroke(); }
  for (let j = 1; j < 6; j++) { ctx.beginPath(); ctx.moveTo(x, y + h * j / 6); ctx.lineTo(x + w, y + h * j / 6); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(120,255,180,.35)'; ctx.beginPath(); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.stroke();
  ctx.strokeStyle = opt.color || '#69F0AE'; ctx.lineWidth = 2.4; ctx.beginPath();
  const N = Math.round(w);
  for (let i = 0; i <= N; i++) { const tt = win * i / N, yy = y + h / 2 - clamp(fn(tt), -1.05, 1.05) * h * 0.45; i ? ctx.lineTo(x + i, yy) : ctx.moveTo(x + i, yy); }
  ctx.stroke();
  if (opt.ax !== false) { label(ctx, opt.yl || '振動位移', x + 8, y + 14, { size: 12, color: '#A5D6A7' }); label(ctx, opt.xl || ('時間 →（共 ' + fmt(win * 1000, 1) + ' 毫秒）'), x + w - 8, y + h - 12, { align: 'right', size: 12, color: '#A5D6A7' }); }
  ctx.restore();
}
/* 諧波波形（正規化到最大值 1） */
function harmFn(harm) {
  const raw = t => harm.reduce((s, a, i) => s + a * Math.sin(2 * Math.PI * (i + 1) * t), 0);
  let mx = 1e-9; for (let k = 0; k < 400; k++) mx = Math.max(mx, Math.abs(raw(k / 400)));
  return ph => raw(ph) / mx;   // ph：以週期為單位
}

/* ---------- ① 聲音實驗室 ---------- */
(() => {
  const cv = document.getElementById('w4scope'); if (!cv) return;
  const S = stage(cv, 760, 260), ctx = S.ctx;
  const sl2f = s => Math.round(100 * Math.pow(20, s / 100));
  const f2sl = f => Math.round(Math.log(f / 100) / Math.log(20) * 100);
  let tim = 'pure', snd = null, fn = harmFn(TIMBRE.pure.harm), prev = { v: 50, f: 47 };
  const VOL = bindRange('w4vol', v => v + ' %', () => upd('v'));
  let curF = sl2f(+document.getElementById('w4freq').value);   // 精確頻率（音階鈕不經過拉桿取整）
  const FR = bindRange('w4freq', s => sl2f(s) + ' Hz', s => { curF = sl2f(s); upd('f'); });
  document.getElementById('w4tim').innerHTML = Object.entries(TIMBRE).map(([k, o]) => `<button class="chip ${k === tim ? 'on' : ''}" data-k="${k}">${o.nm}</button>`).join('');
  const KEYS = [['Do', 262], ['Re', 294], ['Mi', 330], ['Fa', 349], ['Sol', 392], ['La', 440], ['Si', 494], ['高音Do', 523]];
  document.getElementById('w4keys').innerHTML = KEYS.map(([n, f]) => `<button class="chip" data-f="${f}">${n}</button>`).join('');
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const f = curF, a = +VOL.value / 100;
    scope(ctx, 10, 10, S.W - 20, S.H - 20, tt => a * fn(f * tt), 0.01);
    label(ctx, `${TIMBRE[tim].nm}｜${f} Hz｜音量 ${VOL.value}%`, S.W - 22, 28, { align: 'right', size: 14, bold: true, color: '#E8F5E9' });
  }
  function info() {
    const f = curF;
    document.getElementById('w4R').innerHTML = `<div><span>頻率（音調）</span><b>${f} Hz</b></div><div><span>週期</span><b>${fmt(1000 / f, 2)} 毫秒</b></div>
      <div><span>10 毫秒內的波數</span><b>${fmt(f / 100, 1)} 個</b></div><div><span>振幅（音量）</span><b>${VOL.value} %</b></div>`;
  }
  function upd(which) {
    const f = curF;
    if (snd) { snd.freq(f); snd.vol(0.3 * (+VOL.value / 100) ** 1.5); }
    const tx = document.getElementById('w4Txt');
    if (which === 'v') tx.innerHTML = `只改<b>音量</b>：示波器上的波變${+VOL.value > prev.v ? '高' : '矮'}了（振幅改變），但一格裡的波數（頻率）<b>沒有變</b>——音調不變。`;
    if (which === 'f') tx.innerHTML = `只改<b>頻率</b>：示波器上的波變${+FR.value > prev.f ? '密（頻率變高，音調變高）' : '疏（頻率變低，音調變低）'}，但波的高度（振幅）<b>沒有變</b>——音量不變。`;
    if (which === 't') tx.innerHTML = `換成<b>${TIMBRE[tim].nm}</b>：頻率和振幅都沒變，但<b>波形</b>變了——聽起來像不同的樂器，這就是<b>音色</b>。`;
    prev = { v: +VOL.value, f: +FR.value };
    draw(); info();
  }
  const play = () => { if (!snd) snd = AUD.tone({ freq: curF, harm: TIMBRE[tim].harm, vol: 0.3 * (+VOL.value / 100) ** 1.5 }); };
  document.getElementById('w4play').onclick = play;
  document.getElementById('w4stop').onclick = () => { if (snd) snd.stop(); snd = null; };
  window.addEventListener('audstop', () => { snd = null; });
  $$('#w4tim .chip').forEach(c => c.onclick = () => {
    tim = c.dataset.k; fn = harmFn(TIMBRE[tim].harm); $$('#w4tim .chip').forEach(x => x.classList.toggle('on', x === c));
    if (snd) snd.wave(TIMBRE[tim].harm); upd('t');
  });
  $$('#w4keys .chip').forEach(c => c.onclick = () => {
    curF = +c.dataset.f; FR.value = f2sl(curF); $('output[for="w4freq"]').textContent = curF + ' Hz'; upd('f');
    if (!snd) AUD.ding({ freq: +c.dataset.f, harm: TIMBRE[tim].harm, vol: 0.35 * (+VOL.value / 100) ** 1.2, dur: 0.9 });
  });
  registerSim('t4', { start() { draw(); info(); }, resize: draw });
})();

/* ---------- ② 試管 ---------- */
(() => {
  const cv = document.getElementById('w4tube'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const W = [1, 2, 3].map(i => bindRange('w4w' + i, v => v + ' %', () => draw()));
  const FO = bindRange('w4force', v => ['', '很輕', '輕', '中', '大', '很大'][v], null);
  const LEN = 16;   // 試管長 16 cm
  let hl = -1, hlT = 0, t = 0, shake = 0;
  const air = i => LEN * (1 - +W[i].value / 100);
  const fBlow = i => Math.round(343 / (4 * (air(i) + 0.5) / 100));
  const fKnock = i => Math.round(1500 / (1 + 0.9 * +W[i].value / 80));
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    [0, 1, 2].forEach(i => {
      const cx = 140 + i * 240, top = 40, PX = 13, h = LEN * PX, w = 46;
      const sx = i === 1 && shake > 0 ? Math.sin(t * 90) * 3 * shake : 0;
      ctx.save(); ctx.translate(sx, 0);
      // 空氣柱
      const ah = air(i) * PX;
      ctx.fillStyle = hl === i ? 'rgba(129,212,250,.85)' : 'rgba(179,229,252,.55)'; ctx.fillRect(cx - w / 2, top, w, ah);
      // 水
      ctx.fillStyle = '#1E88E5'; ctx.fillRect(cx - w / 2, top + ah, w, h - ah);
      // 玻璃
      ctx.strokeStyle = '#78909C'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - w / 2, top); ctx.lineTo(cx - w / 2, top + h - 10); ctx.quadraticCurveTo(cx - w / 2, top + h + 12, cx, top + h + 12); ctx.quadraticCurveTo(cx + w / 2, top + h + 12, cx + w / 2, top + h - 10); ctx.lineTo(cx + w / 2, top); ctx.stroke();
      ctx.restore();
      if (ah > 26) label(ctx, '空氣柱', cx, top + ah / 2, { align: 'center', size: 12, bold: true, color: '#01579B' });
      label(ctx, '試管 ' + (i + 1), cx, 20, { align: 'center', size: 14, bold: true });
      dim(ctx, cx + w / 2 + 14, top, cx + w / 2 + 14, top + ah, fmt(air(i), 1) + ' cm', '#0277BD');
      label(ctx, '吹：約 ' + fBlow(i) + ' Hz', cx, top + h + 30, { align: 'center', size: 13, bold: true, color: hl === i ? '#C62828' : '#333' });
      if (hl === i && t - hlT < 0.9) { ctx.font = '22px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🌬️', cx - 44, top - 6); }
    });
  }
  const lp = loop(dt => { t += dt; if (shake > 0) shake = Math.max(0, shake - dt * 1.5); if (hl >= 0 && t - hlT > 1.2) hl = -1; draw(); });
  $$('#w4tube ~ .grid2 [data-b], [data-b]').forEach(b => { if (!b.closest('.card') || !b.closest('.card').contains(cv)) return;
    b.onclick = () => {
      const i = +b.dataset.b; hl = i; hlT = t;
      const s = AUD.tone({ freq: fBlow(i), harm: TIMBRE.flute.harm, vol: 0.2 }); setTimeout(() => s && s.stop(), 900);
      AUD.noise && (() => { const n = AUD.noise({ vol: 0.025, lowpass: 3000 }); setTimeout(() => n && n.stop(), 900); })();
      const f = [0, 1, 2].map(fBlow);
      document.getElementById('w4tubeTxt').innerHTML = `試管 ${i + 1}：空氣柱 ${fmt(air(i), 1)} cm，音調約 <b>${fBlow(i)} Hz</b>。<br>${f[0] === f[1] && f[1] === f[2] ? '' : '水愈<b>多</b> → 空氣柱愈<b>短</b> → 吹出的音調愈<b>高</b>（課本：聲音的高低取決於空氣柱的長度）。'}`;
    };
  });
  document.getElementById('w4knock').onclick = () => {
    shake = 1; const F = +FO.value;
    AUD.ding({ freq: fKnock(1), harm: [1, 0, 0.3, 0, 0.15], vol: 0.07 * F, dur: 0.9 });
    document.getElementById('w4tubeTxt').innerHTML = `🥄 用「${['', '很輕', '輕', '中', '大', '很大'][F]}」的力量敲試管 2：敲得愈用力，<b>振幅愈大，音量愈大</b>（音調不變，約 ${fKnock(1)} Hz）。`;
  };
  registerSim('t4', { start() { draw(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ③ 烏克麗麗 ---------- */
(() => {
  const cv = document.getElementById('w4string'); if (!cv) return;
  const S = stage(cv, 760, 200), ctx = S.ctx;
  const L = bindRange('w4sL', v => v + ' cm', () => { draw(); info(); });
  const T = bindRange('w4sT', v => ['', '很鬆', '', '鬆', '', '中', '', '緊', '', '很緊'][v] || ('第 ' + v + ' 段'), () => { draw(); info(); });
  let mu = 1, amp = 0, t = 0;
  const freq = () => Math.round(220 * (60 / +L.value) * Math.sqrt(+T.value / 5) * Math.sqrt(1 / mu));
  const NUT = 60, BR = 700;   // 弦枕、琴橋
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#D7A86E'; rrect(ctx, 40, 50, 690, 100, 14); ctx.fill();
    ctx.fillStyle = '#5D4037'; ctx.fillRect(NUT - 6, 48, 8, 104); ctx.fillRect(BR, 60, 10, 80);
    for (let k = 1; k < 12; k++) { const x = BR - (BR - NUT) * Math.pow(2, -k / 12) * 0 - (BR - NUT) * (1 - Math.pow(2, -k / 12)); ctx.fillStyle = '#BDBDBD'; ctx.fillRect(BR - (BR - NUT) * Math.pow(2, -k / 12) - 1 - (BR - NUT) * 0, 52, 2, 96); }
    const xf = BR - (BR - NUT) * (+L.value / 60);
    const yc = 100, lw = mu === 2 ? 5 : mu === 1 ? 3 : 1.6;
    ctx.strokeStyle = '#ECEFF1'; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(NUT, yc); ctx.lineTo(xf, yc); ctx.stroke();
    ctx.strokeStyle = '#FFF'; ctx.beginPath();
    for (let x = xf; x <= BR; x += 3) { const s = (x - xf) / (BR - xf); const yy = yc + amp * 18 * Math.sin(Math.PI * s) * Math.cos(t * freq() / 25); x === xf ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
    ctx.stroke();
    if (+L.value < 60) { ctx.font = '26px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('👆', xf, yc - 26); }
    dim(ctx, xf, 175, BR, 175, '振動部分 ' + L.value + ' cm', '#4E342E', 'bottom');
    label(ctx, '弦鈕（調鬆緊）', NUT - 20, 30, { size: 12, color: '#5D4037', bold: true });
  }
  function info() {
    document.getElementById('w4sR').innerHTML = `<div><span>振動長度</span><b>${L.value} cm</b></div><div><span>鬆緊</span><b>${T.value} / 9</b></div>
      <div><span>粗細</span><b>${mu === 2 ? '粗' : mu === 1 ? '中' : '細'}</b></div><div><span>頻率（音調）</span><b>${freq()} Hz</b></div>`;
  }
  const lp = loop(dt => { t += dt; if (amp > 0) { amp *= Math.exp(-dt * 1.3); if (amp < 0.02) amp = 0; } draw(); });
  document.getElementById('w4pluck').onclick = () => { amp = 1; AUD.ding({ freq: freq(), harm: [1, 0.6, 0.4, 0.25, 0.15, 0.1], vol: 0.3, dur: 1.6 }); };
  $$('#w4sThick .chip').forEach(c => c.onclick = () => { mu = +c.dataset.m; $$('#w4sThick .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); info(); });
  registerSim('t4', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ④ 分貝尺 ---------- */
(() => {
  const cv = document.getElementById('w4db'); if (!cv) return;
  const S = stage(cv, 760, 190), ctx = S.ctx;
  const V = bindRange('w4dbv', v => v + ' 分貝', () => { draw(); info(); });
  const X0 = 40, X1 = 730, PX = (X1 - X0) / 140;
  const ITEMS = [[0, '耳朵剛好聽得到'], [20, '樹葉沙沙'], [30, '悄悄話'], [60, '一般交談'], [80, '繁忙路口'], [100, '耳機開到最大'], [120, '飛機起降附近'], [140, '近距離鞭炮']];
  const ZONES = [[40, 60, '#FFF59D', '影響睡眠'], [60, 75, '#FFE082', '影響學習'], [75, 85, '#FFCC80', '效率降低'], [85, 120, '#FFAB91', '長期：聽力損失'], [120, 140, '#EF9A9A', '永久性損傷']];
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ZONES.forEach(([a, b, c, n]) => { ctx.fillStyle = c; ctx.fillRect(X0 + a * PX, 60, (b - a) * PX, 40); });
    ZONES.forEach(([a, b, c, n]) => label(ctx, n, X0 + (a + b) / 2 * PX, 80, { align: 'center', size: 11, color: '#4E342E', bold: true }));
    ctx.strokeStyle = '#555'; ctx.strokeRect(X0, 60, X1 - X0, 40);
    for (let d = 0; d <= 140; d += 10) { label(ctx, d, X0 + d * PX, 50, { align: 'center', size: 11, color: '#555' }); }
    ITEMS.forEach(([d, n], i) => { const x = X0 + d * PX; ctx.fillStyle = '#37474F'; ctx.fillRect(x - 1, 100, 2, 36 + (i % 2) * 18); label(ctx, n, x, 144 + (i % 2) * 18, { align: d === 0 ? 'left' : d === 140 ? 'right' : 'center', size: 12 }); });
    const x = X0 + +V.value * PX;
    ctx.fillStyle = '#C62828'; ctx.beginPath(); ctx.moveTo(x, 58); ctx.lineTo(x - 9, 38); ctx.lineTo(x + 9, 38); ctx.fill();
    label(ctx, V.value + ' dB', x, 24, { align: 'center', size: 15, bold: true, color: '#C62828' });
  }
  function info() {
    const d = +V.value, r = Math.pow(10, (d - 60) / 10);
    const near = ITEMS.reduce((a, b) => Math.abs(b[0] - d) < Math.abs(a[0] - d) ? b : a);
    document.getElementById('w4dbTxt').innerHTML = `${d} 分貝（接近「${near[1]}」）的聲音強度，${d === 60 ? '和一般交談差不多。' : `是一般交談（60 分貝）的 <b>${r >= 1 ? fmt(r, 0).toString() : '1/' + fmt(1 / r, 0)}</b> 倍。`}` +
      (d >= 85 ? '<br>⚠️ <b>長期處在 85 分貝以上的環境中，可能使聽力受損而重聽。</b>' : d >= 70 ? '<br>70 分貝左右的環境，會讓人心情煩躁、無法專心。' : '');
  }
  registerSim('t4', { start() { draw(); info(); }, resize: draw });
})();

/* ---------- ⑤ 樂音與噪音 ---------- */
(() => {
  const cv = document.getElementById('w4mn'); if (!cv) return;
  const S = stage(cv, 760, 200), ctx = S.ctx;
  let cur = null, snds = [], seed = 1;
  const NZ = Float32Array.from({ length: 4096 }, () => Math.random() * 2 - 1);   // 雜訊表
  const nz = t => NZ[(Math.floor(t * 40000) + seed * 97) & 4095];
  const piano = harmFn([1, 0.5, 0.3, 0.2, 0.1]), flute = harmFn(TIMBRE.flute.harm);
  const SRC = {
    piano: { nm: '鋼琴 Do', db: 60, music: true, fn: t => piano(262 * t), play: () => [AUD.tone({ freq: 262, harm: [1, 0.5, 0.3, 0.2, 0.1], vol: 0.2 })] },
    flute: { nm: '長笛 La', db: 65, music: true, fn: t => flute(440 * t), play: () => [AUD.tone({ freq: 440, harm: TIMBRE.flute.harm, vol: 0.2 })] },
    chord: { nm: '和弦 Do Mi Sol', db: 60, music: true, fn: t => (Math.sin(2 * Math.PI * 262 * t) + Math.sin(2 * Math.PI * 330 * t) + Math.sin(2 * Math.PI * 392 * t)) / 2.6, play: () => [262, 330, 392].map(f => AUD.tone({ freq: f, vol: 0.1 })) },
    noise: { nm: '雜訊', db: 55, music: false, fn: t => nz(t) * 0.9, play: () => [AUD.noise({ vol: 0.08 })] },
    drill: { nm: '電鑽', db: 95, music: false, fn: t => 0.35 * Math.sign(Math.sin(2 * Math.PI * 118 * t)) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 23 * t)) + 0.6 * nz(t), play: () => [AUD.tone({ freq: 118, type: 'square', vol: 0.05 }), AUD.noise({ vol: 0.05, lowpass: 2500 })] },
    fire: { nm: '鞭炮', db: 120, music: false, fn: t => { const x = t * 230 + seed * 0.37, k = Math.floor(x); return NZ[(k * 31) & 4095] > 0.2 ? nz(t) * Math.exp(-(x - k) * 5) * (0.5 + Math.abs(NZ[(k * 7) & 4095]) * 0.5) : 0; },   // 爆裂的間隔和大小都不規則
      play: () => { const g = AUD.group(); let d = 0; for (let k = 0; k < 28; k++) { d += 0.06 + Math.random() * 0.16; AUD.clap({ dest: g.node, delay: d, vol: 0.18 + Math.random() * 0.15, dur: 0.07 }); } return [g]; } },
  };
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    if (!cur) { scope(ctx, 10, 10, S.W - 20, S.H - 20, () => 0, 0.02); label(ctx, '👆 選一個聲音', S.W / 2, S.H / 2 - 20, { align: 'center', size: 15, color: '#E8F5E9' }); return; }
    const s = SRC[cur];
    scope(ctx, 10, 10, S.W - 20, S.H - 20, s.fn, 0.02, { color: s.music ? '#69F0AE' : '#FF8A80' });
    label(ctx, s.nm + '（約 ' + s.db + ' 分貝）｜' + (s.music ? '波形有規律 → 樂音' : '波形沒有規律 → 噪音'), S.W - 22, 28, { align: 'right', size: 14, bold: true, color: s.music ? '#B9F6CA' : '#FFCDD2' });
  }
  const stopAll = () => { snds.forEach(x => x && x.stop()); snds = []; };
  const lp = loop(() => { if (cur && !SRC[cur].music) { seed++; draw(); } });
  $$('#w4mnB .chip').forEach(c => c.onclick = () => {
    stopAll(); cur = c.dataset.k; $$('#w4mnB .chip').forEach(x => x.classList.toggle('on', x === c));
    snds = SRC[cur].play(); draw();
  });
  document.getElementById('w4mnStop').onclick = () => { stopAll(); cur = null; $$('#w4mnB .chip').forEach(x => x.classList.remove('on')); draw(); };
  window.addEventListener('audstop', () => { snds = []; cur = null; });
  registerSim('t4', { start() { draw(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- ⑥ 麥克風示波器 ---------- */
(() => {
  const cv = document.getElementById('w4mic'); if (!cv) return;
  const S = stage(cv, 760, 220), ctx = S.ctx;
  let stream = null, an = null, buf = null, raf = null, peakF = 0, fc = 0, lastP = { f: 0, rms: 0 };
  function pitch(b, sr) {   // 自相關法估計基音頻率
    let rms = 0; for (const v of b) rms += v * v; rms = Math.sqrt(rms / b.length);
    if (rms < 0.01) return { f: 0, rms };
    let best = -1, bestC = 0;
    const W = Math.min(1024, b.length >> 1);   // 只用 1024 點相關，減少運算
    for (let lag = Math.floor(sr / 1200); lag < Math.min(b.length - W, Math.floor(sr / 70)); lag++) {
      let c = 0; for (let i = 0; i < W; i++) c += b[i] * b[i + lag];
      if (c > bestC) { bestC = c; best = lag; }
    }
    return { f: best > 0 ? sr / best : 0, rms };
  }
  function frame() {
    if (!an) return;
    an.getFloatTimeDomainData(buf);
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const sr = AUD.ctx().sampleRate, n = Math.min(buf.length, Math.round(sr * 0.02));
    scope(ctx, 10, 10, S.W - 20, S.H - 20, tt => buf[Math.min(n - 1, Math.round(tt * sr))] * 4, n / sr);
    if (fc++ % 3 === 0) lastP = pitch(buf, sr);   // 每 3 格才估一次音調
    const p = lastP;
    if (p.f) peakF = p.f;
    document.getElementById('w4micR').innerHTML = `<div><span>估計的音調（頻率）</span><b>${p.f ? Math.round(p.f) + ' Hz' : '—'}</b></div><div><span>相對音量</span><b>${'▮'.repeat(Math.min(20, Math.round(p.rms * 80)))}</b></div>`;
    raf = requestAnimationFrame(frame);
  }
  async function on() {
    try {
      const a = AUD.ctx();
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      const src = a.createMediaStreamSource(stream);
      an = a.createAnalyser(); an.fftSize = 2048; buf = new Float32Array(an.fftSize);
      src.connect(an);   // 只接分析器，不接喇叭（避免回授尖叫）
      frame();
    } catch (e) {
      document.getElementById('w4micR').innerHTML = `<div><span>狀態</span><b>沒辦法打開麥克風</b></div><div><span>可能原因</span><b>沒有允許、或裝置沒有麥克風</b></div>`;
    }
  }
  function off() { cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach(t => t.stop()); stream = null; an = null; idle(); }
  document.getElementById('w4micOn').onclick = () => { off(); on(); };
  document.getElementById('w4micOff').onclick = off;
  function idle() { S.fit(); ctx.clearRect(0, 0, S.W, S.H); scope(ctx, 10, 10, S.W - 20, S.H - 20, () => 0, 0.02); label(ctx, '按「🎤 打開麥克風」', S.W / 2, S.H / 2 - 20, { align: 'center', size: 15, color: '#E8F5E9' }); }
  registerSim('t4', { start: idle, stop: off, resize() { if (!an) idle(); } });
})();

/* ---------- ⑦ 資優：諧波疊加 ---------- */
(() => {
  const cv = document.getElementById('w4harm'); if (!cv) return;
  const S = stage(cv, 420, 240), ctx = S.ctx;
  const host = document.getElementById('w4harmS');
  let h = [1, 0, 0, 0, 0, 0, 0, 0], snd = null;
  host.innerHTML = h.map((v, i) => `<div class="ctl" style="margin:2px 0"><label>${i ? (i + 1) + ' 倍頻（' + 220 * (i + 1) + ' Hz）' : '基音（220 Hz）'} <output for="w4h${i}"></output></label><input type="range" id="w4h${i}" min="0" max="100" step="5" value="${v * 100}"></div>`).join('');
  const R = h.map((v, i) => bindRange('w4h' + i, x => x + '%', () => { h[i] = x(i); upd(); }));
  function x(i) { return +R[i].value / 100; }
  function upd() { h = R.map((r, i) => x(i)); if (h.every(v => v === 0)) h[0] = 0.01; if (snd) snd.wave(h); draw(); }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const fn = harmFn(h);
    scope(ctx, 6, 6, S.W - 12, 150, tt => fn(220 * tt), 2 / 220, { xl: '兩個週期' });
    const bw = (S.W - 40) / 8;
    h.forEach((v, i) => { ctx.fillStyle = i ? '#9575CD' : '#5E35B1'; ctx.fillRect(20 + i * bw + 4, 230 - v * 60, bw - 8, v * 60); label(ctx, (i + 1) + 'f', 20 + i * bw + bw / 2, 234, { align: 'center', size: 11, base: 'bottom' }); });
  }
  const P = { 1: [1, 0, 0, 0, 0, 0, 0, 0], saw: [1, .5, .33, .25, .2, .17, .14, .12], odd: [1, 0, .33, 0, .2, 0, .14, 0] };
  $$('#w4harmP .chip').forEach(c => c.onclick = () => {
    const p = c.dataset.p === 'rnd' ? h.map((_, i) => i ? Math.round(Math.random() * 20) / 20 : 1) : P[c.dataset.p];
    p.forEach((v, i) => { R[i].value = v * 100; R[i].dispatchEvent(new Event('input')); });
  });
  document.getElementById('w4harmPlay').onclick = () => { if (!snd) snd = AUD.tone({ freq: 220, harm: h, vol: 0.2 }); };
  document.getElementById('w4harmStop').onclick = () => { if (snd) snd.stop(); snd = null; };
  window.addEventListener('audstop', () => { snd = null; });
  // 八度
  $$('#w4oct .chip').forEach(c => c.onclick = () => {
    const f = c.dataset.f;
    if (f === 'both') [262, 523].forEach(q => AUD.ding({ freq: q, harm: [1, 0.3], vol: 0.2, dur: 1.5 }));
    else if (f === 'bad') [262, 277].forEach(q => AUD.ding({ freq: q, harm: [1, 0.3], vol: 0.2, dur: 1.5 }));
    else AUD.ding({ freq: +f, harm: [1, 0.3], vol: 0.25, dur: 1.2 });
  });
  registerSim('t4', { start: draw, resize: draw });
})();

/* ---------- ⑧ 探討活動 3-4：分類 ---------- */
(() => {
  const host = document.getElementById('w4mnSort'); if (!host) return;
  mountSort(host, ['聽起來愉悅', '聽起來不舒服'], [
    ['🎹 鋼琴的 Do', 0, '約 60 分貝、波形規律：大多數人覺得悅耳。'],
    ['🎼 和弦 Do Mi Sol', 0, '約 60 分貝；幾個頻率比很簡單的音疊在一起，波形仍有規律，聽起來和諧。'],
    ['📢 沙沙的雜訊', 1, '約 55 分貝，不大聲，但波形雜亂沒有規律；聽久了大多數人會覺得煩。'],
    ['🚧 工地電鑽', 1, '約 95 分貝、波形雜亂，超過 85 分貝長期聽會傷害聽力。'],
    ['🧨 鞭炮聲', 1, '近距離可達 120 分貝以上，波形是不規則的爆裂，可能造成聽力受損。'],
    ['🎵 長笛的 La', 0, '約 65 分貝、波形規律、音量適中。'],
  ]);
})();

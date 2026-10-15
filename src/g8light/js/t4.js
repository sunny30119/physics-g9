/* ===== 分頁 4：面鏡成像 ===== */

/* 畫一個 F 字（中心 x,y、大小 s；flipX/flipY 鏡像） */
function letterF(ctx, x, y, s, color, flipX = false, flipY = false, alpha = 1, dashed = false) {
  ctx.save(); ctx.translate(x, y); ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1); ctx.globalAlpha = alpha;
  ctx.strokeStyle = color; ctx.lineWidth = s * 0.18; ctx.lineCap = 'round'; if (dashed) ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(-s * .3, s * .5); ctx.lineTo(-s * .3, -s * .5); ctx.lineTo(s * .35, -s * .5); ctx.moveTo(-s * .3, 0); ctx.lineTo(s * .2, 0); ctx.stroke();
  ctx.restore();
}

/* ---------- ① 平面鏡成像 ---------- */
(() => {
  const cv = document.getElementById('l4plane'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const MX = 400;
  let seen = 2, mode = 'top', obj = { x: 250, y: 120 }, eye = { x: 200, y: 250 }, opt = { ext: false, paper: false }, drag = null;
  let person = 230;   // 照全身：人到鏡子的距離（px）
  function drawTop() {
    ctx.fillStyle = '#FAFAFA'; ctx.fillRect(0, 0, S.W, S.H);
    ctx.fillStyle = 'rgba(176,190,197,.25)'; ctx.fillRect(MX, 0, S.W - MX, S.H);
    label(ctx, '鏡子後面', MX + 180, 20, { align: 'center', size: 12, color: '#78909C' });
    ctx.fillStyle = '#607D8B'; ctx.fillRect(MX - 3, 60, 6, 180); label(ctx, '平面鏡（長度有限）', MX, 252, { align: 'center', size: 12, bold: true });
    const img = { x: 2 * MX - obj.x, y: obj.y };
    if (opt.paper) { ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = '#BDBDBD'; ctx.fillRect(img.x - 6, 40, 12, 220); ctx.strokeRect(img.x - 6, 40, 12, 220); label(ctx, '白紙：上面沒有像', img.x + 12, 50, { size: 12, color: '#C62828', bold: true }); }
    // 兩個點（F 的頂端和底端）的光線；反射點必須落在鏡面上
    seen = 0;
    [[0, -22, '#E53935'], [0, 22, '#FB8C00']].forEach(([dx, dy, c]) => {
      const o = { x: obj.x - 8 + dx, y: obj.y + dy }, im = { x: 2 * MX - o.x, y: o.y };
      const t = (MX - eye.x) / (im.x - eye.x), P = { x: MX, y: eye.y + (im.y - eye.y) * t };
      if (P.y < 60 || P.y > 240) return;
      seen++;
      ray(ctx, o.x, o.y, P.x, P.y, c, 2.2); ray(ctx, P.x, P.y, eye.x, eye.y, c, 2.2);
      if (opt.ext) extLine(ctx, P.x, P.y, im.x, im.y, c);
    });
    letterF(ctx, obj.x, obj.y, 48, '#2E7D32');
    letterF(ctx, img.x, img.y, 48, '#2E7D32', true, false, 0.55, true);
    label(ctx, '物', obj.x - 34, obj.y, { size: 13, bold: true, color: '#2E7D32' }); label(ctx, '像（虛像）', img.x + 30, img.y, { size: 13, bold: true, color: '#2E7D32' });
    dim(ctx, obj.x, 282 - 20, MX, 282 - 20, '物距 ' + Math.round((MX - obj.x) / 10) + ' cm', '#455A64', 'bottom');
    dim(ctx, MX, 282 - 20, img.x, 282 - 20, '像距 ' + Math.round((MX - obj.x) / 10) + ' cm', '#455A64', 'bottom');
    ctx.font = '28px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('👁️', eye.x, eye.y);
  }
  function drawBody() {
    const GY = 285, K = 1.45;   // 1 cm = 1.45 px
    ctx.fillStyle = '#FAFAFA'; ctx.fillRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#BCAAA4'; ctx.fillRect(0, GY, S.W, 15);
    const px = MX - person, H = 160, E = 150;
    const man = (x, a, dashed) => { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#37474F'; ctx.lineWidth = 4; if (dashed) ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.arc(x, GY - (H - 10) * K, 10 * K, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, GY - (H - 20) * K); ctx.lineTo(x, GY - 80 * K); ctx.lineTo(x - 14, GY); ctx.moveTo(x, GY - 80 * K); ctx.lineTo(x + 14, GY); ctx.moveTo(x - 22, GY - 120 * K); ctx.lineTo(x + 22, GY - 120 * K); ctx.stroke(); ctx.restore(); };
    man(px, 1, false); man(2 * MX - px, 0.45, true);
    // 鏡子整面（淡）與需要的部分（亮）
    ctx.fillStyle = 'rgba(96,125,139,.25)'; ctx.fillRect(MX - 3, 20, 6, GY - 20);
    const top = (H + E) / 2, bot = E / 2;
    ctx.fillStyle = '#1565C0'; ctx.fillRect(MX - 4, GY - top * K, 8, (top - bot) * K);
    const ey = GY - E * K;
    ray(ctx, px, GY - H * K, MX, GY - top * K, '#E53935', 2); ray(ctx, MX, GY - top * K, px + 6, ey, '#E53935', 2);
    ray(ctx, px + 10, GY, MX, GY - bot * K, '#FB8C00', 2); ray(ctx, MX, GY - bot * K, px + 6, ey, '#FB8C00', 2);
    dim(ctx, MX + 26, GY - top * K, MX + 26, GY - bot * K, '需要 ' + (top - bot) + ' cm', '#1565C0');
    label(ctx, `身高 ${H} cm、眼睛高 ${E} cm｜人到鏡子 ${Math.round(person / K)} cm`, 14, 18, { size: 13, bold: true });
    label(ctx, '← 拖動人 →', px, GY - 8, { align: 'center', size: 11, color: '#666' });
  }
  function draw() { S.fit(); ctx.clearRect(0, 0, S.W, S.H); mode === 'top' ? drawTop() : drawBody(); info(); }
  function info() {
    const R = document.getElementById('l4pR'), T = document.getElementById('l4pTxt');
    if (mode === 'top') {
      R.innerHTML = `<div><span>物距</span><b>${Math.round((MX - obj.x) / 10)} cm</b></div><div><span>像距</span><b>${Math.round((MX - obj.x) / 10)} cm</b></div><div><span>大小</span><b>物＝像</b></div><div><span>像的種類</span><b>虛像</b></div>`;
      T.innerHTML = seen === 0 ? '👀 從這個位置<b>看不到</b>像：連接眼睛和像的直線，沒有通過鏡面（反射點落在鏡子外面）。像其實還在鏡後的對稱位置，換個角度（移動眼睛）就可能看到——這就是探討活動 4-2「想一想 2」。' : opt.paper ? '鏡子後面的白紙上<b>沒有像</b>：光線根本沒有跑到鏡子後面。所以平面鏡的像是<b>虛像</b>。' :
        opt.ext ? '把進入眼睛的反射光<b>往鏡子後面延長</b>（虛線），延長線會聚在同一點——那就是像的位置。不管眼睛在哪裡，延長線都會聚到同一個像。' :
          '物體的光經鏡面反射進入眼睛，大腦以為光是直線過來的，就在鏡子後面「看到」一個像。拖動眼睛，再按「顯示延長線」。';
    } else {
      R.innerHTML = `<div><span>人到鏡子</span><b>${Math.round(person / 1.45)} cm</b></div><div><span>最少需要的鏡子長度</span><b>80 cm（身高的一半）</b></div>`;
      T.innerHTML = '拖動人前後移動：需要的鏡子（藍色那段）<b>長度和位置都不變</b>，永遠是身高的一半，跟站多遠無關！';
    }
  }
  const pick = p => {
    if (mode === 'body') return 'man';
    return Math.hypot(p.x - obj.x, p.y - obj.y) < Math.hypot(p.x - eye.x, p.y - eye.y) ? 'obj' : 'eye';
  };
  const mv = e => {
    if (!drag) return; const p = S.pt(e);
    if (drag === 'man') person = clamp(MX - p.x, 60, 360);
    else { const q = { x: clamp(p.x, 40, MX - 30), y: clamp(p.y, 15, 285) }; if (drag === 'obj') obj = q; else eye = q; }
    draw();
  };
  cv.addEventListener('pointerdown', e => { drag = pick(S.pt(e)); cv.setPointerCapture(e.pointerId); mv(e); });
  cv.addEventListener('pointermove', mv); cv.addEventListener('pointerup', () => drag = null);
  $$('#l4pMode .chip').forEach(c => c.onclick = () => { mode = c.dataset.m; $$('#l4pMode .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  $$('#l4pOpt .chip').forEach(c => c.onclick = () => { opt[c.dataset.k] = !opt[c.dataset.k]; c.classList.toggle('on', opt[c.dataset.k]); draw(); });
  registerSim('t4', { start: draw, resize: draw });
})();

/* ---------- ② 凹面鏡、凸面鏡 ---------- */
(() => {
  const cv = document.getElementById('l4curve'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const K = bindRange('l4cR', v => ['', '很平', '平', '中', '彎', '很彎'][v], () => draw());
  let kind = 'cave', src = 'par';
  const VX = 600, YC = 150;
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#101820'; ctx.fillRect(0, 0, S.W, S.H);
    const R = [0, 760, 600, 460, 360, 280][+K.value], f = R / 2;
    ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(20, YC); ctx.lineTo(740, YC); ctx.stroke(); ctx.setLineDash([]);
    // 鏡子形狀
    const H = 120;
    const mirX = y => kind === 'flat' ? VX : kind === 'cave' ? (VX - R) + Math.sqrt(R * R - (y - YC) ** 2) : (VX + R) - Math.sqrt(R * R - (y - YC) ** 2);
    ctx.strokeStyle = '#B0BEC5'; ctx.lineWidth = 6; ctx.beginPath(); for (let y = YC - H; y <= YC + H; y += 3) { y === YC - H ? ctx.moveTo(mirX(y), y) : ctx.lineTo(mirX(y), y); } ctx.stroke();
    const normal = (x, y) => { if (kind === 'flat') return { x: -1, y: 0 }; const cx = kind === 'cave' ? VX - R : VX + R; let n = { x: (x - cx) / R, y: (y - YC) / R }; if (n.x > 0) n = { x: -n.x, y: -n.y }; return n; };
    const refl = (d, n) => { const k = d.x * n.x + d.y * n.y; return { x: d.x - 2 * k * n.x, y: d.y - 2 * k * n.y }; };
    const colors = ['#FFEB3B', '#FFC107', '#FF9800', '#FFC107', '#FFEB3B'];
    if (src === 'par' || kind !== 'cave') {
      [-90, -50, -20, 20, 50, 90].forEach((h, i) => {
        const y = YC + h, x = mirX(y), c = colors[i % 5];
        let d = { x: 1, y: 0 }, sx = 30, sy = y;
        if (src === 'f') { sx = VX - f; sy = YC; const L = Math.hypot(x - sx, y - sy); d = { x: (x - sx) / L, y: (y - sy) / L }; }
        ray(ctx, sx, sy, x, y, c, 2, 0.5);
        const o = refl(d, normal(x, y));
        ray(ctx, x, y, x + o.x * 560, y + o.y * 560, c, 2, 0.35);
        if (kind === 'vex') extLine(ctx, x, y, x - o.x * 300, y - o.y * 300, c, 1.2);
      });
    } else {
      [-60, -35, -15, 15, 35, 60].forEach((a, i) => {
        const sx = VX - f, sy = YC, r = rad(a); let x = VX, y = YC;
        // 從焦點射向鏡子：找交點（逐步前進）
        for (let s = 0; s < 800; s += 1) { const px = sx + Math.cos(r) * s, py = sy + Math.sin(r) * s; if (px >= mirX(py)) { x = px; y = py; break; } }
        const L = Math.hypot(x - sx, y - sy), d = { x: (x - sx) / L, y: (y - sy) / L }, o = refl(d, normal(x, y));
        ray(ctx, sx, sy, x, y, colors[i % 5], 2, 0.5); ray(ctx, x, y, x + o.x * 600, y + o.y * 600, colors[i % 5], 2, 0.35);
      });
      ctx.font = '22px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('💡', VX - f, YC);
    }
    if (kind !== 'flat') {
      const fx = kind === 'cave' ? VX - f : VX + f;
      ctx.fillStyle = '#FF5252'; ctx.beginPath(); ctx.arc(fx, YC, 6, 0, 7); ctx.fill();
      label(ctx, kind === 'cave' ? '焦點 F' : '焦點 F（延長線會聚，在鏡後）', fx, YC + 22, { align: 'center', size: 12, bold: true, color: '#FF8A80' });
    }
    const T = document.getElementById('l4cTxt');
    if (kind === 'cave') T.innerHTML = src === 'f' ? '光源放在凹面鏡的<b>焦點</b>：反射後變成<b>平行光束</b>，可以照得很遠——手電筒、車燈的反射罩就是這樣設計的（光的可逆性）。' : '平行光照到<b>凹面鏡</b>，反射後<b>會聚於一點</b>——焦點。鏡子愈彎，焦點離鏡子愈近。';
    else if (kind === 'vex') T.innerHTML = '平行光照到<b>凸面鏡</b>，反射後<b>發散</b>開來；反射光往鏡子後面延長（虛線），會交在鏡後的一點。反過來看：四面八方的光都能被凸面鏡送進眼睛，所以視野很廣。';
    else T.innerHTML = '平面鏡：平行光反射後仍然平行。';
  }
  $$('#l4cKind .chip').forEach(c => c.onclick = () => { kind = c.dataset.k; if (kind !== 'cave') { src = 'par'; $$('#l4cSrc .chip').forEach(x => x.classList.toggle('on', x.dataset.s === 'par')); } $$('#l4cKind .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  $$('#l4cSrc .chip').forEach(c => c.onclick = () => { if (c.dataset.s === 'f' && kind !== 'cave') { document.getElementById('l4cTxt').innerHTML = '「光源放在焦點」只在<b>凹面鏡</b>時有意義（凸面鏡的焦點在鏡子後面）。請先選凹面鏡。'; return; } src = c.dataset.s; $$('#l4cSrc .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  registerSim('t4', { start: draw, resize: draw });
})();

/* ---------- ③ 三種鏡子照同一張臉 ---------- */
(() => {
  const cv = document.getElementById('l4faces'); if (!cv) return;
  const S = stage(cv, 760, 220), ctx = S.ctx;
  const D = bindRange('l4fd', v => v + ' 格（凹面鏡焦距＝4 格）', () => draw());
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const p = +D.value, f = 4;
    const M = [['平面鏡', 1], ['凹面鏡', p === f ? null : f / (f - p)], ['凸面鏡', f / (f + p)]];
    M.forEach(([n, m], i) => {
      const cx = 130 + i * 250;
      ctx.fillStyle = '#ECEFF1'; ctx.beginPath(); ctx.ellipse(cx, 110, 100, 90, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#90A4AE'; ctx.lineWidth = 4; ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.ellipse(cx, 110, 98, 88, 0, 0, 7); ctx.clip();
      if (m === null) label(ctx, '一片模糊', cx, 110, { align: 'center', size: 15, bold: true, color: '#999' });
      else { const s = clamp(Math.abs(m), 0.15, 3.2); ctx.translate(cx, 110); ctx.scale(1, m < 0 ? -1 : 1); ctx.font = `${Math.round(60 * s)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🙂', 0, 0); }
      ctx.restore();
      label(ctx, n, cx, 212, { align: 'center', size: 14, bold: true });
      const desc = m === null ? '臉在焦點上：看不到像' : `${m > 0 ? '正立' : '倒立'}${Math.abs(m) > 1.02 ? '放大' : Math.abs(m) < 0.98 ? '縮小' : '等大'}`;
      label(ctx, desc, cx, 14, { align: 'center', size: 13, bold: true, color: m === null ? '#999' : m > 0 ? '#2E7D32' : '#C62828' });
    });
  }
  registerSim('t4', { start: draw, resize: draw });
})();

/* ---------- ④ 例題 4-5 ---------- */
(() => {
  const cv = document.getElementById('l4ex5'); if (!cv) return;
  const S = stage(cv, 560, 340), ctx = S.ctx;
  const ans = cv.closest('.example')?.querySelector('.ansbox');
  const MX = 330, MY = 200, O = { x: 230, y: 130 };
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.strokeStyle = '#E0E0E0'; ctx.lineWidth = 1; for (let x = 0; x < S.W; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, S.H); ctx.stroke(); } for (let y = 0; y < S.H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S.W, y); ctx.stroke(); }
    ctx.fillStyle = '#607D8B'; ctx.fillRect(MX - 3, 20, 6, MY - 20); ctx.fillRect(60, MY - 3, MX - 57, 6);
    label(ctx, '平面鏡 1', MX + 8, 30, { size: 12, bold: true }); label(ctx, '平面鏡 2', 70, MY + 16, { size: 12, bold: true });
    letterF(ctx, O.x, O.y, 50, '#E65100');
    if (ans && ans.classList.contains('show')) {
      letterF(ctx, 2 * MX - O.x, O.y, 50, '#E65100', true, false, 0.6, true); label(ctx, '鏡 1 的像', 2 * MX - O.x, O.y - 40, { align: 'center', size: 12, color: '#E65100' });
      letterF(ctx, O.x, 2 * MY - O.y, 50, '#E65100', false, true, 0.6, true); label(ctx, '鏡 2 的像', O.x, 2 * MY - O.y + 42, { align: 'center', size: 12, color: '#E65100' });
      dim(ctx, O.x, O.y + 40, MX, O.y + 40, '物距 5 格', '#555', 'bottom'); dim(ctx, MX, O.y + 40, 2 * MX - O.x, O.y + 40, '像距 5 格', '#555', 'bottom');
    }
  }
  if (ans) new MutationObserver(draw).observe(ans, { attributes: true });
  registerSim('t4', { start: draw, resize: draw });
})();

/* ---------- ⑤ 資優：兩鏡夾角成像 ---------- */
(() => {
  const cv = document.getElementById('l4kal'); if (!cv) return;
  const S = stage(cv, 420, 300), ctx = S.ctx;
  const OPTS = [180, 90, 60, 45, 36, 30];
  const A = document.getElementById('l4kA'); A.min = 0; A.max = OPTS.length - 1; A.step = 1; A.value = 1;
  const out = $('output[for="l4kA"]');
  function draw() {
    const th = OPTS[+A.value]; out.textContent = th + '°';
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const O = { x: 210, y: 160 }, R = 120;
    // 產生所有像（反射群）
    const phi0 = th / 3, set = new Map(), q = [phi0];
    const key = a => Math.round(((a % 360) + 360) % 360 * 10);
    set.set(key(phi0), phi0);
    while (q.length && set.size < 40) { const a = q.shift(); [0, th].forEach(m => { const b = 2 * m - a; if (!set.has(key(b))) { set.set(key(b), b); q.push(b); } }); }
    ctx.strokeStyle = '#607D8B'; ctx.lineWidth = 5;
    [0, th].forEach(m => { ctx.beginPath(); ctx.moveTo(O.x, O.y); ctx.lineTo(O.x + 140 * Math.cos(rad(m)), O.y - 140 * Math.sin(rad(m))); ctx.stroke(); });
    let k = 0;
    set.forEach(a => {
      const x = O.x + R * 0.7 * Math.cos(rad(a)), y = O.y - R * 0.7 * Math.sin(rad(a)), isObj = Math.abs(a - phi0) < 0.01;
      ctx.fillStyle = isObj ? '#E53935' : 'rgba(229,57,53,.35)'; ctx.beginPath(); ctx.arc(x, y, isObj ? 9 : 7, 0, 7); ctx.fill();
      if (!isObj) label(ctx, ++k + '', x, y, { align: 'center', size: 11, bold: true, color: '#fff' });
    });
    document.getElementById('l4kTxt').innerHTML = `夾角 <b>${th}°</b>：看到 <b>${set.size - 1}</b> 個像。<br>規律：像的數目 ＝ 360 ÷ θ − 1 ＝ 360 ÷ ${th} − 1 ＝ ${360 / th - 1}`;
  }
  A.addEventListener('input', draw);
  registerSim('t4', { start: draw, resize: draw });
})();

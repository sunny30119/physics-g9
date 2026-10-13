/* ===== 分頁 1：功 =====
   ① 牛頓的問題：兩條跑道，光滑平面，m = 2 kg，推到 S 就放手 → 末速度 v = √(2FS/m)
   ② 功的正負：拖曳力的方向，W = F·S·cosθ（F = 10 N，S = 3 m）
   ③ 分類遊戲
   ④ 資優：F–S 圖的面積 */
(() => {
  const cv = document.getElementById('c3push'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const M = 2, X0 = 50, PX = 110;   // 起點 x、1 公尺 = 110 px
  const lanes = [
    { k: 'A', y: 115, F: bindRange('c3FA', v => v + ' N', reset), S: bindRange('c3SA', v => v + ' m', reset), color: '#C8682A' },
    { k: 'B', y: 250, F: bindRange('c3FB', v => v + ' N', reset), S: bindRange('c3SB', v => v + ' m', reset), color: '#2F5D8C' },
  ];
  let run = false, t = 0;
  lanes.forEach(L => { L.x = 0; L.v = 0; L.dots = []; });
  function reset() { run = false; t = 0; lanes.forEach(L => { L.x = 0; L.v = 0; L.dots = []; L.done = false; }); document.getElementById('c3pushTxt').innerHTML = '按「▶ 開始推」，比比看哪個箱子放手後比較快。'; draw(); info(); }
  function step(dt) {
    if (!run) return;
    t += dt;
    lanes.forEach(L => {
      const F = +L.F.value, s = +L.S.value, maxX = (S.W - X0 - 70) / PX;
      if (L.x >= maxX) { L.done = true; return; }
      const a = L.x < s ? F / M : 0;
      L.v += a * dt; L.x += L.v * dt;
      if (L.x >= s) L.v = Math.sqrt(2 * F * s / M);   // 放手後的速度＝精確值（和右邊讀數一致）
      if (L.x > maxX) L.x = maxX;
      if (!L.dots.length || t - L.dots[L.dots.length - 1].t >= 0.15) L.dots.push({ t, x: L.x });
    });
    if (lanes.every(L => L.done)) run = false;
    draw(); info();
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    label(ctx, '光滑平面（沒有摩擦力）｜點點每隔 0.15 秒留一個：點點愈疏＝跑愈快', S.W / 2, 18, { align: 'center', size: 13, color: '#66736E' });
    lanes.forEach(L => {
      const F = +L.F.value, s = +L.S.value, gy = L.y;
      ground(ctx, 20, S.W - 10, gy);
      for (let m = 0; m <= 6; m++) label(ctx, m + 'm', X0 + m * PX, gy + 20, { align: 'center', size: 12, color: '#8A96A3' });
      // 放手的位置
      const xs = X0 + s * PX;
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = L.color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(xs, gy - 70); ctx.lineTo(xs, gy); ctx.stroke(); ctx.restore();
      label(ctx, '放手', xs, gy - 76, { align: 'center', size: 12, color: L.color, bold: true });
      // 軌跡點
      L.dots.forEach(d => { ctx.fillStyle = L.color; ctx.globalAlpha = .35; ctx.beginPath(); ctx.arc(X0 + d.x * PX, gy - 6, 3, 0, 7); ctx.fill(); ctx.globalAlpha = 1; });
      const bx = X0 + L.x * PX;
      box(ctx, bx - 22, gy - 44, 44, 44, L.color, L.k);
      if (L.x < s) arrow(ctx, bx - 22 - Math.min(90, 12 + F * 2.4), gy - 22, bx - 24, gy - 22, '#D32F2F', 4, 12);
      if (L.x < s) label(ctx, F + ' N', bx - 34 - F * 1.2, gy - 40, { align: 'center', size: 13, color: '#D32F2F', bold: true });
      label(ctx, 'v＝' + fmt(L.v, 2) + ' m/s', bx, gy - 58, { align: 'center', size: 13, bold: true, bg: 'rgba(255,255,255,.85)' });
    });
  }
  function info() {
    const r = lanes.map(L => { const F = +L.F.value, s = +L.S.value; return { F, s, W: F * s, v: Math.sqrt(2 * F * s / M) }; });
    document.getElementById('c3pushR').innerHTML = r.map((x, i) => `
      <div><span>${['🅰', '🅱'][i]} 力 × 距離（功）</span><b>${x.F} × ${x.s} ＝ ${fmt(x.W)}</b></div>
      <div><span>${['🅰', '🅱'][i]} 放手後的速度</span><b>${run || lanes[i].x > 0 ? fmt(x.v, 2) + ' m/s' : '？'}</b></div>`).join('');
    const tx = document.getElementById('c3pushTxt');
    const ended = lanes.every(L => L.x >= +L.S.value);
    if (!ended) return;
    const [a, b] = r;
    if (Math.abs(a.W - b.W) < 1e-9 && (a.F !== b.F))
      tx.innerHTML = `🤯 <b>力不同、距離也不同，但「力 × 距離」都是 ${fmt(a.W)}，放手後的速度完全一樣！</b><br>所以決定末速度的，是「力 × 距離」這個乘積——科學家叫它「功」。`;
    else if (a.F === b.F && a.s !== b.s)
      tx.innerHTML = `<b>推論 2：</b>相同外力，推的距離愈長，末速度愈大。（${a.s > b.s ? '🅰' : '🅱'} 比較快）`;
    else if (a.s === b.s && a.F !== b.F)
      tx.innerHTML = `<b>推論 1：</b>推相同距離，外力愈大，末速度愈大。（${a.F > b.F ? '🅰' : '🅱'} 比較快）`;
    else tx.innerHTML = `「力 × 距離」比較大的是 <b>${a.W > b.W ? '🅰' : a.W < b.W ? '🅱' : '一樣'}</b>，它的末速度也比較大。`;
  }
  document.getElementById('c3pushGo').onclick = () => { reset(); run = true; };
  document.getElementById('c3pushReset').onclick = reset;
  $$('#c3pushPre .chip').forEach(c => c.onclick = () => {
    const [fa, sa, fb, sb] = c.dataset.p.split(',').map(Number);
    lanes[0].F.value = fa; lanes[0].S.value = sa; lanes[1].F.value = fb; lanes[1].S.value = sb;
    lanes.forEach(L => [L.F, L.S].forEach(e => e.dispatchEvent(new Event('input'))));
    $$('#c3pushPre .chip').forEach(x => x.classList.toggle('on', x === c));
    reset(); run = true;
  });
  const lp = loop(step);
  registerSim('t1', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize() { draw(); } });
})();

/* ---------- 功的正負 ---------- */
(() => {
  const cv = document.getElementById('c3sign'); if (!cv) return;
  const S = stage(cv, 420, 300), ctx = S.ctx;
  const F = 10, SD = 3, C = [200, 165];
  let ang = 0, move = 1, drag = false;
  const deepOn = () => document.body.dataset.mode !== 'stu';
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ground(ctx, 10, S.W - 10, C[1] + 30, true);
    box(ctx, C[0] - 40, C[1] - 30, 80, 60, '#B98B5E', ''); label(ctx, '物體', C[0] - 26, C[1] + 20, { align: 'center', size: 13, bold: true, color: '#fff' });
    if (move) { arrow(ctx, C[0] - 40, C[1] + 58, C[0] + 110, C[1] + 58, '#1565C0', 4, 12); label(ctx, '位移 S＝3 m', C[0] + 35, C[1] + 78, { align: 'center', size: 14, color: '#1565C0', bold: true }); }
    else label(ctx, '物體沒有移動（S＝0）', C[0], C[1] + 62, { align: 'center', size: 14, color: '#1565C0', bold: true });
    const a = ang * Math.PI / 180, L = 110;
    const ex = C[0] + Math.cos(a) * L, ey = C[1] - Math.sin(a) * L;
    if (deepOn() && move && ang % 90 !== 0) {
      ctx.save(); ctx.setLineDash([5, 4]);
      arrow(ctx, C[0], C[1], C[0] + Math.cos(a) * L, C[1], '#7B1FA2', 2.5, 10);
      arrow(ctx, C[0], C[1], C[0], ey, '#9E9E9E', 2, 9);
      ctx.restore();
      label(ctx, '沿位移方向的分力', C[0] + Math.cos(a) * L / 2, C[1] + 44, { align: 'center', size: 12, color: '#7B1FA2', bg: 'rgba(255,255,255,.8)' });
    }
    arrow(ctx, C[0], C[1], ex, ey, '#D32F2F', 5, 16);
    ctx.fillStyle = '#D32F2F'; ctx.beginPath(); ctx.arc(ex, ey, 9, 0, 7); ctx.globalAlpha = .25; ctx.fill(); ctx.globalAlpha = 1;
    label(ctx, '外力 F＝10 N', ex + (Math.cos(a) >= 0 ? 8 : -8), ey - 16, { align: Math.cos(a) >= 0 ? 'left' : 'right', size: 14, color: '#D32F2F', bold: true });
    label(ctx, '👆 拖曳紅色箭頭的尖端', 10, 16, { size: 12, color: '#66736E' });
    info();
  }
  function info() {
    const c = Math.cos(ang * Math.PI / 180);
    const W = move ? F * SD * c : 0;
    const kind = !move ? '不作功' : Math.abs(c) < 0.01 ? '不作功' : c > 0 ? '作正功' : '作負功';
    const col = kind === '作正功' ? 'var(--ok)' : kind === '作負功' ? 'var(--bad)' : 'var(--muted)';
    document.getElementById('c3signR').innerHTML = `<div><span>力和位移的夾角</span><b>${ang}°</b></div><div><span>外力對物體</span><b style="color:${col}">${kind}</b></div><div><span>功 W</span><b>${fmt(Math.abs(W) < 0.05 ? 0 : W, 1)} J</b></div>`;
    let t;
    if (!move) t = '物體<b>沒有位移</b>，不管力朝哪裡、多用力，功都是 0。（推牆推不動）';
    else if (ang === 0) t = '力和位移<b>同向</b>：W＝F×S＝10×3＝<b>30 J</b>，作正功，物體會被加速（動能增加）。';
    else if (ang === 180) t = '力和位移<b>反向</b>：作<b>負功</b>，W＝−30 J，物體會被減速（像摩擦力）。';
    else if (ang === 90 || ang === 270) t = '力和位移<b>垂直</b>：這個力不會讓物體沿位移方向加速或減速，<b>不作功</b>。（提水桶水平走）';
    else t = `力是斜的：只有<b>沿著位移方向的那一份力</b>會作功，所以功比 30 J ${c > 0 ? '小，但仍是正功' : '的負值小，仍是負功'}。${deepOn() ? '紫色虛線就是那一份力。' : '（切到「資優」模式可以看到分力）'}`;
    document.getElementById('c3signTxt').innerHTML = t;
  }
  const setAng = e => {
    const p = S.pt(e);
    let a = Math.atan2(-(p.y - C[1]), p.x - C[0]) * 180 / Math.PI;
    a = (Math.round(a / 15) * 15 + 360) % 360;
    ang = a; draw();
  };
  cv.addEventListener('pointerdown', e => { drag = true; cv.setPointerCapture(e.pointerId); setAng(e); });
  cv.addEventListener('pointermove', e => { if (drag) setAng(e); });
  cv.addEventListener('pointerup', () => drag = false);
  $$('#c3signMove .chip').forEach(c => c.onclick = () => { move = +c.dataset.m; $$('#c3signMove .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  $$('#c3signPre .chip').forEach(c => c.onclick = () => { ang = +c.dataset.a; draw(); });
  registerSim('t1', { start: draw, resize: draw });
})();

/* ---------- 分類遊戲 ---------- */
(() => {
  const host = document.getElementById('c3sort1'); if (!host) return;
  mountSort(host, ['作正功', '作負功', '不作功'], [
    ['推著購物車往前走，推力對購物車', 0, '推力向前、車也向前移動，同向 → 正功。'],
    ['腳踏車煞車滑行時，地面摩擦力對腳踏車', 1, '摩擦力向後、車向前移動，反向 → 負功（車子愈來愈慢）。'],
    ['提著書包在走廊上水平走，手的提力對書包', 2, '提力向上、書包水平移動，兩者垂直 → 不作功。'],
    ['蘋果從樹上掉下來，重力對蘋果', 0, '重力向下、蘋果也向下移動 → 正功（蘋果愈掉愈快）。'],
    ['往上丟的球在上升時，重力對球', 1, '重力向下、球向上移動，反向 → 負功（球愈來愈慢）。'],
    ['用力推教室的牆，牆完全沒動，推力對牆', 2, '牆沒有位移（S＝0）→ 不作功。'],
    ['電梯載人上樓，地板的支撐力對人', 0, '支撐力向上、人也向上移動 → 正功。'],
    ['用繩子把水桶慢慢垂降到井底，繩子拉力對水桶', 1, '拉力向上、水桶向下移動，反向 → 負功。'],
    ['冰壺在水平冰面上滑行，重力對冰壺', 2, '重力向下、冰壺水平移動，垂直 → 不作功。'],
  ]);
})();

/* ---------- 舉重案例：跟著 g 值變 ---------- */
onG(g => {
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  set('c3liftW', fmt(100 * g * 2, 0)); set('c3bagW', fmt(5 * g * 9, 0)); set('c3pyrW', fmt(2500 * g * 50 / 10000, 0));
});

/* ---------- 資優：F–S 圖面積 ---------- */
(() => {
  const cv = document.getElementById('c3fs'); if (!cv) return;
  const S = stage(cv, 420, 280), ctx = S.ctx;
  let mode = 'c';
  const OX = 50, OY = 240, PX = 80, PY = 9;  // 1 m = 80 px，1 N = 9 px
  const f = { c: s => 10, r: s => 5 * s, s: s => 20 - 5 * s };
  const txt = {
    c: '固定 10 N 推 4 m：面積是長方形 10 × 4 ＝ <b>40 J</b>，和 W＝F×S 一樣。',
    r: '力從 0 慢慢增加到 20 N（像拉彈簧）：面積是三角形 ½ × 4 × 20 ＝ <b>40 J</b>。不能直接用「最後的力 × 距離」＝80 J！',
    s: '力從 20 N 慢慢減小到 0：面積也是三角形 ½ × 4 × 20 ＝ <b>40 J</b>。',
  };
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = 'rgba(123,31,162,.18)';
    ctx.beginPath(); ctx.moveTo(OX, OY);
    for (let s = 0; s <= 4.001; s += 0.05) ctx.lineTo(OX + s * PX, OY - f[mode](s) * PY);
    ctx.lineTo(OX + 4 * PX, OY); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#7B1FA2'; ctx.lineWidth = 3; ctx.beginPath();
    for (let s = 0; s <= 4.001; s += 0.05) { const x = OX + s * PX, y = OY - f[mode](s) * PY; s ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
    arrow(ctx, OX, OY, OX + 4.6 * PX, OY, '#333', 2); arrow(ctx, OX, OY, OX, 20, '#333', 2);
    label(ctx, 'S（m）', 412, OY - 12, { align: 'right', size: 13 });
    label(ctx, 'F（N）', OX + 6, 22, { size: 13 });
    for (let s = 1; s <= 4; s++) label(ctx, s, OX + s * PX, OY + 14, { align: 'center', size: 12 });
    [10, 20].forEach(F => label(ctx, F, OX - 8, OY - F * PY, { align: 'right', size: 12 }));
    label(ctx, '面積＝功＝40 J', OX + 2 * PX, OY - 40, { align: 'center', size: 15, bold: true, color: '#4A148C', bg: 'rgba(255,255,255,.8)' });
    document.getElementById('c3fsTxt').innerHTML = txt[mode];
  }
  $$('#c3fsMode .chip').forEach(c => c.onclick = () => { mode = c.dataset.m; $$('#c3fsMode .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  registerSim('t1', { start: draw, resize: draw });
})();

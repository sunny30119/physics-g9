/* ===== 分頁 5：光的折射 ===== */
const MED = { water: { n: 4 / 3, v: 2.25, nm: '水', c: 'rgba(66,165,245,.35)' }, glass: { n: 1.5, v: 2.0, nm: '玻璃', c: 'rgba(129,212,250,.45)' }, diamond: { n: 2.42, v: 1.24, nm: '鑽石', c: 'rgba(206,147,216,.4)' } };

/* ---------- ① 探討活動 4-3：杯底變淺 ---------- */
(() => {
  const cv = document.getElementById('l5cup'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const W = bindRange('l5w', v => v + ' %', () => draw());
  let showImg = false;
  const CL = 220, CR = 440, TOP = 70, BOT = 272, L = { x: 252, y: 262 }, E = { x: 480, y: 34 }, n = 4 / 3;
  function solve(yw) {   // 找水面上的折射點 sx
    const f = sx => { const tw = Math.atan2(sx - L.x, L.y - yw), s = n * Math.sin(tw); if (s >= 1) return -1; return Math.atan2(E.x - sx, yw - E.y) - Math.asin(s); };
    let a = L.x, b = Math.min(CR, E.x);
    if (f(a) * f(b) > 0) return null;
    for (let k = 0; k < 50; k++) { const m = (a + b) / 2; (f(a) * f(m) <= 0) ? b = m : a = m; }
    return (a + b) / 2;
  }
  function state() {
    const h = +W.value / 100 * (BOT - TOP - 10), yw = BOT - h;
    if (h < 1) { const yAt = L.y + (E.y - L.y) * (CR - L.x) / (E.x - L.x); return { h, yw, vis: yAt <= TOP, sx: null }; }
    const sx = solve(yw); if (sx == null) return { h, yw, vis: false, sx: null };
    const yAt = yw + (E.y - yw) * (CR - sx) / (E.x - sx);
    return { h, yw, sx, vis: sx <= CR && yAt <= TOP };
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#FAFAFA'; ctx.fillRect(0, 0, S.W, S.H);
    const st = state();
    if (st.h > 0) { ctx.fillStyle = 'rgba(66,165,245,.35)'; ctx.fillRect(CL, st.yw, CR - CL, BOT - st.yw); ctx.strokeStyle = '#1E88E5'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(CL, st.yw); ctx.lineTo(CR, st.yw); ctx.stroke(); }
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(CL, TOP); ctx.lineTo(CL, BOT); ctx.lineTo(CR, BOT); ctx.lineTo(CR, TOP); ctx.stroke();
    ctx.fillStyle = '#FFEB3B'; ctx.shadowColor = '#FFC107'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(L.x, L.y, 7, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    label(ctx, '燈具', L.x + 14, L.y - 4, { size: 12, bold: true });
    ctx.font = '28px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('👁️', E.x, E.y);
    label(ctx, '眼睛（固定不動）', E.x - 20, E.y + 26, { align: 'center', size: 12 });
    if (st.vis && st.sx != null) {
      ray(ctx, L.x, L.y, st.sx, st.yw, '#F9A825', 3); ray(ctx, st.sx, st.yw, E.x, E.y, '#F9A825', 3);
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = '#7E57C2'; ctx.beginPath(); ctx.moveTo(st.sx, st.yw - 50); ctx.lineTo(st.sx, st.yw + 50); ctx.stroke(); ctx.restore();
      if (showImg) {
        const t = (L.x - E.x) / (st.sx - E.x), iy = E.y + (st.yw - E.y) * t;
        extLine(ctx, st.sx, st.yw, L.x, iy, '#F9A825');
        ctx.fillStyle = 'rgba(255,235,59,.6)'; ctx.beginPath(); ctx.arc(L.x, iy, 7, 0, 7); ctx.fill();
        label(ctx, '看到的燈具（變淺了）', L.x + 12, iy - 12, { size: 12, bold: true, color: '#F57F17', bg: 'rgba(255,255,255,.85)' });
      }
    } else if (st.vis) { ray(ctx, L.x, L.y, E.x, E.y, '#F9A825', 3); }
    else {
      const yAt = L.y + (E.y - L.y) * (CR - L.x) / (E.x - L.x);
      extLine(ctx, L.x, L.y, CR, yAt, '#9E9E9E'); label(ctx, '✘ 被杯壁擋住', CR + 8, yAt, { size: 12, bold: true, color: '#C62828' });
    }
    const T = document.getElementById('l5cTxt');
    if (st.h < 1) T.innerHTML = '沒有水時：從燈具連一直線到右側杯緣，再延長——到不了眼睛，所以<b>看不到燈具</b>。慢慢加水……';
    else if (!st.vis) T.innerHTML = '水還不夠多，燈具的光仍然被杯壁擋住。繼續加水……';
    else T.innerHTML = '💡 <b>看到燈具了！</b>燈具的光從水中進入空氣時，在水面<b>偏折（偏離法線）</b>，才能越過杯緣進入眼睛。眼睛以為光是直線來的，所以覺得燈具的位置<b>變淺了</b>。按「👻 顯示看到的燈具位置」。';
  }
  $$('#l5cOpt .chip').forEach(c => c.onclick = () => { showImg = !showImg; c.classList.toggle('on', showImg); draw(); });
  registerSim('t5', { start: draw, resize: draw });
})();

/* ---------- ② 雷射折射 ---------- */
(() => {
  const cv = document.getElementById('l5laser'); if (!cv) return;
  const S = stage(cv, 760, 320), ctx = S.ctx;
  const OX = 380, OY = 160, RR = 150;
  let th = 50, med = 'water', dir = 'down', drag = false;
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const m = MED[med];
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, S.W, OY); ctx.fillStyle = m.c; ctx.fillRect(0, OY, S.W, S.H - OY);
    label(ctx, '空氣（快）', 14, 20, { size: 14, bold: true }); label(ctx, m.nm + '（慢）', 14, S.H - 20, { size: 14, bold: true, color: '#0D47A1' });
    ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = '#7E57C2'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(OX, 10); ctx.lineTo(OX, S.H - 10); ctx.stroke(); ctx.restore();
    label(ctx, '法線', OX + 6, 16, { size: 12, color: '#7E57C2', bold: true });
    const n1 = dir === 'down' ? 1 : m.n, n2 = dir === 'down' ? m.n : 1, s = dir === 'down' ? -1 : 1;   // s：入射側在上(-1)或下(+1)
    const r1 = rad(th), r2 = snell(r1, n1, n2);
    const Lp = { x: OX - RR * Math.sin(r1), y: OY + s * RR * Math.cos(r1) };
    ray(ctx, Lp.x, Lp.y, OX, OY, '#E53935', 3.5);
    ctx.save(); ctx.translate(Lp.x, Lp.y); ctx.rotate(Math.atan2(OY - Lp.y, OX - Lp.x)); ctx.fillStyle = '#C62828'; rrect(ctx, -44, -7, 44, 14, 4); ctx.fill(); ctx.restore();
    const refl = { x: OX + RR * Math.sin(r1), y: OY + s * RR * Math.cos(r1) };
    if (r2 == null) {
      ray(ctx, OX, OY, refl.x, refl.y, '#E53935', 3.5);
      label(ctx, '全反射！光完全射不出去', OX + 90, OY + s * 30, { align: 'center', size: 14, bold: true, color: '#6A1B9A', bg: 'rgba(255,255,255,.9)' });
      const aN = s > 0 ? Math.PI / 2 : -Math.PI / 2;
      angArc(ctx, OX, OY, 50, Math.atan2(Lp.y - OY, Lp.x - OX), aN, '#2E7D32', '入射角 ' + th + '°');
      angArc(ctx, OX, OY, 70, aN, Math.atan2(refl.y - OY, refl.x - OX), '#1565C0', '反射角 ' + th + '°');
    } else {
      ray(ctx, OX, OY, refl.x, refl.y, 'rgba(229,57,53,.25)', 2);
      const Rp = { x: OX + RR * 1.2 * Math.sin(r2), y: OY - s * RR * 1.2 * Math.cos(r2) };
      ray(ctx, OX, OY, Rp.x, Rp.y, '#E53935', 3.5);
      if (th > 0) {
        const aN1 = s > 0 ? Math.PI / 2 : -Math.PI / 2, aN2 = -aN1;
        angArc(ctx, OX, OY, 50, Math.atan2(Lp.y - OY, Lp.x - OX), aN1, '#2E7D32', '入射角 ' + th + '°');
        angArc(ctx, OX, OY, 70, aN2, Math.atan2(Rp.y - OY, Rp.x - OX), '#1565C0', '折射角 ' + fmt(deg(r2), 0) + '°');
        extLine(ctx, OX, OY, OX + RR * Math.sin(r1), OY - s * RR * Math.cos(r1), '#BDBDBD', 1.2);
      }
    }
    info(r2);
  }
  function info(r2) {
    const m = MED[med], v1 = dir === 'down' ? 3 : m.v, v2 = dir === 'down' ? m.v : 3;
    document.getElementById('l5R').innerHTML = `<div><span>入射側光速</span><b>${v1}×10⁸ m/s</b></div><div><span>折射側光速</span><b>${v2}×10⁸ m/s</b></div>
      <div><span>入射角</span><b>${th}°</b></div><div><span>折射角</span><b>${r2 == null ? '（全反射）' : fmt(deg(r2), 1) + '°'}</b></div>`;
    const T = document.getElementById('l5txt');
    if (th === 0) T.innerHTML = '<b>A 垂直入射：</b>光<b>不偏折</b>，直直穿過去，但光速從 ' + v1 + ' 變成 ' + v2 + '×10⁸ m/s——速率還是改變了。';
    else if (r2 == null) T.innerHTML = `由${m.nm}射向空氣，入射角超過臨界角（約 ${fmt(deg(Math.asin(1 / m.n)), 1)}°），光<b>全部反射</b>回來——全反射。`;
    else if (dir === 'down') T.innerHTML = `由光速快的空氣斜向射入光速慢的${m.nm}：<b>偏向法線</b>，折射角（${fmt(deg(r2), 0)}°）比入射角（${th}°）<b>小</b>。` + (med === 'glass' && th === 50 ? '<br>和水比較：同樣入射 50°，玻璃的折射角更小（約 31°，課本圖 D 取 30°），因為光在玻璃中更慢。' : '');
    else T.innerHTML = `由光速慢的${m.nm}斜向射入光速快的空氣：<b>偏離法線</b>，折射角比入射角<b>大</b>。和「空氣→${m.nm}」的路徑相同、方向相反——折射也有<b>可逆性</b>。`;
  }
  const mv = e => { if (!drag) return; const p = S.pt(e); th = clamp(Math.round(deg(Math.atan2(Math.abs(p.x - OX), Math.abs(p.y - OY)))), 0, 85); draw(); };
  cv.addEventListener('pointerdown', e => { drag = true; cv.setPointerCapture(e.pointerId); mv(e); });
  cv.addEventListener('pointermove', mv); cv.addEventListener('pointerup', () => drag = false);
  $$('#l5med .chip').forEach(c => c.onclick = () => { med = c.dataset.m; $$('#l5med .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  $$('#l5dir .chip').forEach(c => c.onclick = () => { dir = c.dataset.d; $$('#l5dir .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  $$('#l5pre .chip').forEach(c => c.onclick = () => { th = +c.dataset.a; draw(); });
  registerSim('t5', { start: draw, resize: draw });
})();

/* ---------- ③ 游泳池視深 ---------- */
(() => {
  const cv = document.getElementById('l5pool'); if (!cv) return;
  const S = stage(cv, 760, 280), ctx = S.ctx;
  const D = bindRange('l5d', v => fmt(v, 1) + ' m', () => draw());
  const V = bindRange('l5v', v => v + '°', () => draw());
  const SY = 70, PX = 65, n = 4 / 3, BX = 300;
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const d = +D.value, ta = rad(+V.value), tw = Math.asin(Math.sin(ta) / n);
    const app = ta < 0.01 ? d / n : d * Math.tan(tw) / Math.tan(ta);
    ctx.fillStyle = '#E3F2FD'; ctx.fillRect(0, 0, S.W, SY); ctx.fillStyle = 'rgba(41,182,246,.45)'; ctx.fillRect(0, SY, S.W, d * PX); ctx.fillStyle = '#B0BEC5'; ctx.fillRect(0, SY + d * PX, S.W, S.H);
    const B = { x: BX, y: SY + d * PX }, P = { x: BX + d * PX * Math.tan(tw), y: SY };
    const E = { x: P.x + 60 * Math.tan(ta) + (ta < 0.01 ? 0 : 0), y: SY - 60 };
    ctx.fillStyle = '#FF7043'; ctx.beginPath(); ctx.arc(B.x, B.y - 6, 7, 0, 7); ctx.fill(); label(ctx, '池底的磁磚（實際）', B.x - 12, B.y - 6, { align: 'right', size: 12, bold: true });
    ray(ctx, B.x, B.y - 6, P.x, P.y, '#F57C00', 2.5); ray(ctx, P.x, P.y, E.x, E.y, '#F57C00', 2.5);
    const I = { x: BX, y: SY + app * PX };
    extLine(ctx, P.x, P.y, I.x, I.y - 6, '#F57C00');
    ctx.fillStyle = 'rgba(255,112,67,.45)'; ctx.beginPath(); ctx.arc(I.x, I.y - 6, 7, 0, 7); ctx.fill(); label(ctx, '看起來的位置', I.x + 12, I.y - 6, { align: 'left', size: 12, bold: true, color: '#BF360C' });
    ctx.font = '24px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('👁️', E.x, E.y);
    dim(ctx, 500, SY, 500, SY + d * PX, '實深 ' + fmt(d, 1) + ' m', '#1565C0');
    dim(ctx, 640, SY, 640, SY + app * PX, '視深 ' + fmt(app, 2) + ' m', '#BF360C');
    document.getElementById('l5pR').innerHTML = `<div><span>實深</span><b>${fmt(d, 2)} m</b></div><div><span>視深</span><b>${fmt(app, 2)} m</b></div><div><span>視深 ÷ 實深</span><b>${fmt(app / d, 2)}</b></div>`;
  }
  registerSim('t5', { start: draw, resize: draw });
})();

/* ---------- ④ 資優：救生員問題 ---------- */
(() => {
  const cv = document.getElementById('l5guard'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const A = { x: 110, y: 40 }, B = { x: 620, y: 270 }, BY = 150, v1 = 7, v2 = 2, M = 0.1;   // 1 px = 0.1 m
  let px = 400, drag = false;
  const T = x => Math.hypot(x - A.x, BY - A.y) * M / v1 + Math.hypot(B.x - x, B.y - BY) * M / v2;
  let best = A.x; { let bt = 1e9; for (let x = A.x; x <= B.x; x += 0.5) { const t = T(x); if (t < bt) { bt = t; best = x; } } }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#FFE0B2'; ctx.fillRect(0, 0, S.W, BY); ctx.fillStyle = '#4FC3F7'; ctx.fillRect(0, BY, S.W, S.H - BY);
    label(ctx, '沙灘：跑 7 m/s', 14, 20, { size: 13, bold: true }); label(ctx, '海水：游 2 m/s', 14, S.H - 18, { size: 13, bold: true, color: '#01579B' });
    extLine(ctx, A.x, A.y, B.x, B.y, '#757575');
    ray(ctx, A.x, A.y, px, BY, '#D32F2F', 3); ray(ctx, px, BY, B.x, B.y, '#D32F2F', 3);
    ctx.font = '24px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🏃‍♀️', A.x, A.y); ctx.fillText('🙋', B.x, B.y);
    ctx.fillStyle = '#6A1B9A'; ctx.beginPath(); ctx.arc(px, BY, 8, 0, 7); ctx.fill(); label(ctx, '下水點（拖我）', px, BY - 18, { align: 'center', size: 12, bold: true, color: '#6A1B9A' });
    const t = T(px), tb = T(best), i = Math.atan2(px - A.x, BY - A.y), r = Math.atan2(B.x - px, B.y - BY);
    label(ctx, `花費時間 ${fmt(t, 2)} 秒（最快 ${fmt(tb, 2)} 秒）｜sin入÷7 ＝ ${fmt(Math.sin(i) / v1, 3)}、sin折÷2 ＝ ${fmt(Math.sin(r) / v2, 3)}`, S.W / 2, BY + 22, { align: 'center', size: 13, bold: true, bg: Math.abs(px - best) < 3 ? '#C8E6C9' : 'rgba(255,255,255,.9)' });
  }
  const mv = e => { if (!drag) return; px = clamp(S.pt(e).x, A.x, B.x); if (Math.abs(px - best) < 3) px = best; draw(); };
  cv.addEventListener('pointerdown', e => { drag = true; cv.setPointerCapture(e.pointerId); mv(e); });
  cv.addEventListener('pointermove', mv); cv.addEventListener('pointerup', () => drag = false);
  registerSim('t5', { start: draw, resize: draw });
})();

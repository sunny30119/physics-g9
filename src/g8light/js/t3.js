/* ===== 分頁 3：光的反射 ===== */

/* ---------- ① 實驗 4-1：狹縫鏡與電池 ---------- */
(() => {
  const cv = document.getElementById('l3exp'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const MY = 40, SX = 380, EY = 285;
  let A = { x: 270, y: 170 };
  let ex = 200, drag = false, showB = false, showL = false;
  const cross = () => { const Ai = { x: A.x, y: 2 * MY - A.y };   // A 的鏡像
    return Ai.x + (ex - Ai.x) * (MY - Ai.y) / (EY - Ai.y); };   // 眼睛→像 的連線和鏡面的交點
  const visible = () => Math.abs(cross() - SX) < 9;
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#FAFAF5'; ctx.fillRect(0, 0, S.W, S.H);
    // 方格紙
    ctx.strokeStyle = '#E3EBF3'; ctx.lineWidth = 1; for (let x = 0; x < S.W; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, S.H); ctx.stroke(); } for (let y = 0; y < S.H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S.W, y); ctx.stroke(); }
    // 摺線
    ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = '#7E57C2'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(SX, MY); ctx.lineTo(SX, S.H); ctx.stroke(); ctx.restore();
    label(ctx, '摺線（法線）', SX + 6, 250, { size: 12, color: '#7E57C2', bold: true });
    // 鏡子＋狹縫
    ctx.fillStyle = '#90A4AE'; ctx.fillRect(140, MY - 10, 480, 10);
    ctx.fillStyle = '#37474F'; ctx.fillRect(140, MY - 12, SX - 10 - 140, 14); ctx.fillRect(SX + 10, MY - 12, 620 - SX - 10, 14);
    label(ctx, '平面鏡（貼紙只留 1 cm 狹縫）', 380, 14, { align: 'center', size: 12, bold: true });
    // 電池 A
    ctx.fillStyle = '#EF6C00'; ctx.fillRect(A.x - 9, A.y - 18, 18, 36); label(ctx, 'A', A.x - 20, A.y, { align: 'right', size: 14, bold: true, color: '#EF6C00' });
    // 眼睛
    ctx.font = '26px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('👁️', ex, EY);
    label(ctx, '← 拖動眼睛 →', ex, EY - 22, { align: 'center', size: 11, color: '#666' });
    const vis = visible();
    const PX_ = cross();   // 光在鏡面上真正的反射點（在狹縫內）
    if (vis) { ray(ctx, A.x, A.y, PX_, MY, '#E53935', 2.5); ray(ctx, PX_, MY, ex, EY, '#E53935', 2.5); }
    // 電池 B（在眼睛→反射點的連線上）
    const B = { x: PX_ + (ex - PX_) * 0.55, y: MY + (EY - MY) * 0.55 };
    if (showB && vis) { ctx.fillStyle = '#1565C0'; ctx.fillRect(B.x - 9, B.y - 18, 18, 36); label(ctx, 'B', B.x + 20, B.y, { size: 14, bold: true, color: '#1565C0' }); }
    if (showL && vis) {
      const aA = Math.atan2(A.y - MY, A.x - PX_), aB = Math.atan2(EY - MY, ex - PX_);
      ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = '#7E57C2'; ctx.beginPath(); ctx.moveTo(PX_, MY); ctx.lineTo(PX_, MY + 90); ctx.stroke(); ctx.restore();
      angArc(ctx, PX_, MY, 60, aA, Math.PI / 2, '#EF6C00', fmt(Math.abs(90 - deg(aA)), 0) + '°');
      angArc(ctx, PX_, MY, 60, Math.PI / 2, aB, '#1565C0', fmt(Math.abs(deg(aB) - 90), 0) + '°');
    }
  }
  function txt() {
    const el = document.getElementById('l3expTxt');
    if (!visible()) el.innerHTML = '這個位置從狹縫看<b>不到</b>電池 A 的像。繼續移動眼睛……';
    else el.innerHTML = '👀 <b>看到了！</b>電池 A 反射的光，經過狹縫的鏡面反射後進入眼睛。' + (showL ? '<br>量一量：兩條連線和摺線（法線）的夾角<b>相等</b>——入射角＝反射角！' : showB ? '<br>電池 B 剛好遮住 A 的像，代表 B 位在反射光的路徑上。按「📏 畫出兩條連線」。' : '<br>接著按「🔋 放電池 B」。');
  }
  const mv = e => { if (!drag) return; ex = clamp(S.pt(e).x, 60, 720); draw(); txt(); };
  cv.addEventListener('pointerdown', e => { drag = true; cv.setPointerCapture(e.pointerId); mv(e); });
  cv.addEventListener('pointermove', mv); cv.addEventListener('pointerup', () => drag = false);
  $$('#l3expA .chip').forEach(c => c.onclick = () => { const [x, y] = c.dataset.a.split(',').map(Number); A = { x, y }; showB = showL = false; $$('#l3expA .chip').forEach(z => z.classList.toggle('on', z === c)); draw(); txt(); });
  document.getElementById('l3expB').onclick = () => { showB = true; draw(); txt(); };
  document.getElementById('l3expL').onclick = () => { showL = true; showB = true; draw(); txt(); };
  registerSim('t3', { start() { draw(); txt(); }, resize: draw });
})();

/* ---------- ② 雷射與平面鏡 ---------- */
(() => {
  const cv = document.getElementById('l3laser'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const OX = 380, OY = 260, RR = 210;
  let th = 40, drag = false, opt = { fold: false, rev: false, surf: false };   // th：入射角（度）
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    // 紙板
    ctx.fillStyle = '#FFFDF5'; ctx.fillRect(OX - 330, 20, 330, OY - 20);
    if (opt.fold) { ctx.fillStyle = '#D7CCC8'; ctx.beginPath(); ctx.moveTo(OX, 20); ctx.lineTo(OX + 190, 60); ctx.lineTo(OX + 190, OY - 10); ctx.lineTo(OX, OY); ctx.closePath(); ctx.fill(); label(ctx, '往後摺的紙板', OX + 100, 90, { align: 'center', size: 12, color: '#5D4037', bold: true }); }
    else { ctx.fillStyle = '#FFFDF5'; ctx.fillRect(OX, 20, 330, OY - 20); }
    // 量角器
    ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 1;
    for (let a = 0; a <= 180; a += 10) { const r = rad(a); ctx.beginPath(); ctx.moveTo(OX + (RR - 12) * Math.cos(r), OY - (RR - 12) * Math.sin(r)); ctx.lineTo(OX + RR * Math.cos(r), OY - RR * Math.sin(r)); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(OX, OY, RR, Math.PI, 2 * Math.PI); ctx.stroke();
    // 鏡子
    ctx.fillStyle = '#90A4AE'; ctx.fillRect(60, OY, 640, 10); ctx.fillStyle = '#546E7A'; for (let x = 64; x < 700; x += 12) ctx.fillRect(x, OY + 10, 6, 4);
    label(ctx, '平面鏡', 90, OY + 26, { size: 12, bold: true });
    // 法線
    ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = '#7E57C2'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(OX, OY); ctx.lineTo(OX, 24); ctx.stroke(); ctx.restore();
    label(ctx, '法線', OX + 6, 30, { size: 12, color: '#7E57C2', bold: true });
    const sgn = opt.rev ? 1 : -1, r = rad(th);
    const L = { x: OX + sgn * RR * Math.sin(r), y: OY - RR * Math.cos(r) }, Rf = { x: OX - sgn * RR * Math.sin(r), y: OY - RR * Math.cos(r) };
    ray(ctx, L.x, L.y, OX, OY, '#E53935', 3);
    const reflOnHidden = opt.fold && Rf.x > OX + 1;
    if (!reflOnHidden) ray(ctx, OX, OY, Rf.x, Rf.y, '#E53935', 3);
    else { extLine(ctx, OX, OY, Rf.x, Rf.y, 'rgba(229,57,53,.35)'); label(ctx, '看不到反射光！', OX + 110, 150, { align: 'center', size: 13, bold: true, color: '#C62828', bg: 'rgba(255,255,255,.85)' }); }
    // 雷射筆
    ctx.save(); ctx.translate(L.x, L.y); ctx.rotate(Math.atan2(OY - L.y, OX - L.x)); ctx.fillStyle = '#C62828'; rrect(ctx, -46, -7, 46, 14, 4); ctx.fill(); ctx.restore();
    // 角度
    if (th > 1) {
      const aN = -Math.PI / 2, aI = Math.atan2(L.y - OY, L.x - OX), aR = Math.atan2(Rf.y - OY, Rf.x - OX);
      angArc(ctx, OX, OY, 58, aI, aN, '#2E7D32', '入射角 ' + th + '°');
      if (!reflOnHidden) angArc(ctx, OX, OY, 78, aN, aR, '#1565C0', '反射角 ' + th + '°');
      if (opt.surf) { angArc(ctx, OX, OY, 110, aI, sgn > 0 ? 0 : -Math.PI, '#F57C00', '和鏡面夾 ' + (90 - th) + '°'); }
    }
    label(ctx, '入射線', (L.x + OX) / 2 - sgn * 0 + (sgn > 0 ? 18 : -18), (L.y + OY) / 2 - 14, { align: 'center', size: 12, color: '#C62828', bold: true });
    if (!reflOnHidden) label(ctx, '反射線', (Rf.x + OX) / 2, (Rf.y + OY) / 2 - 14, { align: 'center', size: 12, color: '#C62828', bold: true });
  }
  function info() {
    document.getElementById('l3R').innerHTML = `<div><span>入射角</span><b>${th}°</b></div><div><span>反射角</span><b>${opt.fold ? '（看不到）' : th + '°'}</b></div><div><span>光線和鏡面的夾角</span><b>${90 - th}°</b></div>`;
    const el = document.getElementById('l3txt');
    if (opt.fold) el.innerHTML = '紙板沿法線往後摺，右半邊和左半邊<b>不在同一平面</b>，就看不到反射光了 → 入射線、反射線和法線<b>位在同一平面上</b>。';
    else if (opt.rev) el.innerHTML = '🔁 從原本反射光的方向射回去，光沿著<b>原來入射光的路徑</b>反向射出——<b>光的可逆性</b>。';
    else if (th === 0) el.innerHTML = '垂直入射：入射角＝0°，光沿原路彈回去。';
    else el.innerHTML = '不管怎麼轉雷射筆，<b>入射角永遠等於反射角</b>，而且入射線和反射線分別在法線兩側。';
  }
  const setTh = p => { const a = deg(Math.atan2(Math.abs(p.x - OX), OY - p.y)); th = clamp(Math.round(a), 0, 85); };
  const mv = e => { if (!drag) return; const p = S.pt(e); if ((p.x < OX) === opt.rev && Math.abs(p.x - OX) > 4) { } setTh(p); draw(); info(); };
  cv.addEventListener('pointerdown', e => { drag = true; cv.setPointerCapture(e.pointerId); mv(e); });
  cv.addEventListener('pointermove', mv); cv.addEventListener('pointerup', () => drag = false);
  $$('#l3opt .chip').forEach(c => c.onclick = () => {
    const k = c.dataset.k; opt[k] = !opt[k];
    if (opt[k] && k === 'fold') opt.rev = false; if (opt[k] && k === 'rev') opt.fold = false;   // 摺紙板和反向入射不同時開
    $$('#l3opt .chip').forEach(x => x.classList.toggle('on', !!opt[x.dataset.k])); draw(); info();
  });
  $$('#l3pre .chip').forEach(c => c.onclick = () => { th = +c.dataset.a; draw(); info(); });
  registerSim('t3', { start() { draw(); info(); }, resize: draw });
})();

/* ---------- ③ 例題 4-3 圖（照課本方格：入射線往右 6 格、往下 4 格） ---------- */
(() => {
  const cv = document.getElementById('l3ex3'); if (!cv) return;
  const S = stage(cv, 520, 240), ctx = S.ctx;
  const ans = cv.closest('.example')?.querySelector('.ansbox');
  const G = 30, OX = 40 + 6 * G, OY = 30 + 6 * G;   // 每格 30 px；入射點在第 6 格
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.strokeStyle = '#B3E5FC'; ctx.lineWidth = 1;
    for (let k = 0; k <= 14; k++) { ctx.beginPath(); ctx.moveTo(40 + k * G, 30); ctx.lineTo(40 + k * G, OY); ctx.stroke(); }
    for (let k = 0; k <= 6; k++) { ctx.beginPath(); ctx.moveTo(40, 30 + k * G); ctx.lineTo(40 + 14 * G, 30 + k * G); ctx.stroke(); }
    ctx.fillStyle = '#90A4AE'; ctx.fillRect(40, OY, 14 * G, 8); label(ctx, '平面鏡', 8, OY + 4, { size: 12 });
    ray(ctx, OX - 6 * G, OY - 4 * G, OX, OY, '#E53935', 3);
    const th = Math.atan2(6, 4);
    if (ans && ans.classList.contains('show')) {
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = '#7E57C2'; ctx.beginPath(); ctx.moveTo(OX, OY); ctx.lineTo(OX, 30); ctx.stroke(); ctx.restore();
      ray(ctx, OX, OY, OX + 6 * G, OY - 4 * G, '#1565C0', 3);
      angArc(ctx, OX, OY, 50, -Math.PI / 2 - th, -Math.PI / 2, '#2E7D32', '入射角');
      angArc(ctx, OX, OY, 70, -Math.PI / 2, -Math.PI / 2 + th, '#1565C0', '反射角');
    }
  }
  if (ans) new MutationObserver(draw).observe(ans, { attributes: true });
  registerSim('t3', { start: draw, resize: draw });
})();

/* ---------- ④ 單向反射與漫反射 ---------- */
(() => {
  const cv = document.getElementById('l3diff'); if (!cv) return;
  const S = stage(cv, 760, 280), ctx = S.ctx;
  let kind = 'mirror', eye = { x: 560, y: 70 }, drag = false;
  const r = rng(5), norms = Array.from({ length: 9 }, () => (r() - .5) * 0.7);
  const SY = 230, inA = rad(45);
  function rays() {
    return Array.from({ length: 9 }, (_, i) => {
      const hx = 230 + i * 34, n = kind === 'mirror' ? 0 : norms[i];
      // 入射方向 (sin, cos)，法線偏 n 弧度：反射方向 = d - 2(d·N)N
      const d = { x: Math.sin(inA), y: Math.cos(inA) }, N = { x: Math.sin(n), y: -Math.cos(n) };
      const dot = d.x * N.x + d.y * N.y, o = { x: d.x - 2 * dot * N.x, y: d.y - 2 * dot * N.y };
      return { hx, o, n };
    });
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#ECEFF1'; ctx.fillRect(0, 0, S.W, S.H);
    // 表面
    ctx.fillStyle = kind === 'mirror' ? '#90A4AE' : '#F5F5F0'; ctx.strokeStyle = '#78909C';
    if (kind === 'mirror') ctx.fillRect(150, SY, 460, 12);
    else { ctx.beginPath(); ctx.moveTo(150, SY + 12); for (let x = 150; x <= 610; x += 10) ctx.lineTo(x, SY + 4 * Math.sin(x * 0.7) + 2 * Math.cos(x * 1.9)); ctx.lineTo(610, SY + 12); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    let hit = 0;
    rays().forEach(({ hx, o, n }) => {
      ray(ctx, hx - 200 * Math.tan(inA), SY - 200, hx, SY, '#FFA000', 2, 0.5);
      const ex = hx + o.x * 260, ey = SY + o.y * 260;
      ray(ctx, hx, SY, ex, ey, '#FFCA28', 2, 0.5);
      // 這條反射光有沒有進入眼睛
      const vx = eye.x - hx, vy = eye.y - SY, along = vx * o.x + vy * o.y, dist = Math.abs(vx * o.y - vy * o.x);
      if (along > 0 && dist < 22) hit++;
    });
    ctx.font = '30px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('👁️', eye.x, eye.y);
    label(ctx, '平行光束', 120, 40, { size: 13, bold: true, color: '#E65100' });
    const el = document.getElementById('l3dTxt');
    if (kind === 'mirror') el.innerHTML = hit ? '😵 眼睛剛好在反射光束的路徑上：看到<b>刺眼的光亮</b>！' : '鏡面把平行光束反射成<b>仍然平行</b>的光束（單向反射）。眼睛不在那個方向上，就幾乎看不到光——鏡子看起來暗暗的。';
    else el.innerHTML = `課本紙面看似平滑，放大看卻<b>凹凸不平</b>，每一小塊的法線方向都不同，反射光射向四面八方（<b>漫反射</b>）。眼睛在各個角度都能收到一些光（現在收到 ${hit} 條），所以看得到圖文又不刺眼。`;
  }
  const mv = e => { if (!drag) return; const p = S.pt(e); eye = { x: clamp(p.x, 20, 740), y: clamp(p.y, 20, SY - 30) }; draw(); };
  cv.addEventListener('pointerdown', e => { drag = true; cv.setPointerCapture(e.pointerId); mv(e); });
  cv.addEventListener('pointermove', mv); cv.addEventListener('pointerup', () => drag = false);
  $$('#l3surf .chip').forEach(c => c.onclick = () => { kind = c.dataset.k; $$('#l3surf .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  registerSim('t3', { start: draw, resize: draw });
})();

/* ---------- ⑤ 資優：海龍最短路徑 ---------- */
(() => {
  const cv = document.getElementById('l3hero'); if (!cv) return;
  const S = stage(cv, 760, 280), ctx = S.ctx;
  const A = { x: 160, y: 70 }, B = { x: 600, y: 130 }, MY = 230;
  let px = 300, drag = false;
  const len = x => Math.hypot(x - A.x, MY - A.y) + Math.hypot(B.x - x, MY - B.y);
  const best = A.x + (B.x - A.x) * (MY - A.y) / ((MY - A.y) + (MY - B.y));
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#90A4AE'; ctx.fillRect(40, MY, 680, 8);
    const Bi = { x: B.x, y: 2 * MY - B.y };
    extLine(ctx, px, MY, Bi.x, Bi.y, '#9E9E9E'); ctx.fillStyle = '#9E9E9E'; ctx.beginPath(); ctx.arc(Bi.x, Bi.y, 5, 0, 7); ctx.fill(); label(ctx, "B′（B 的鏡像）", Bi.x + 10, Bi.y, { size: 12, color: '#757575' });
    ray(ctx, A.x, A.y, px, MY, '#E53935', 3); ray(ctx, px, MY, B.x, B.y, '#E53935', 3);
    [['A', A], ['B', B]].forEach(([n, p]) => { ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, 7); ctx.fill(); label(ctx, n, p.x, p.y - 16, { align: 'center', size: 14, bold: true }); });
    ctx.fillStyle = '#6A1B9A'; ctx.beginPath(); ctx.arc(px, MY, 8, 0, 7); ctx.fill(); label(ctx, 'P（拖我）', px, MY + 22, { align: 'center', size: 12, color: '#6A1B9A', bold: true });
    const i = deg(Math.atan2(Math.abs(px - A.x), MY - A.y)), r = deg(Math.atan2(Math.abs(B.x - px), MY - B.y));
    const L = len(px), Lm = len(best);
    label(ctx, `AP＋PB ＝ ${fmt(L, 1)}（最短 ${fmt(Lm, 1)}）｜入射角 ${fmt(i, 0)}°、反射角 ${fmt(r, 0)}°`, S.W / 2, 22, { align: 'center', size: 14, bold: true, bg: Math.abs(px - best) < 4 ? '#C8E6C9' : '#F3E5F5' });
  }
  const mv = e => { if (!drag) return; px = clamp(S.pt(e).x, 60, 700); if (Math.abs(px - best) < 4) px = best; draw(); };
  cv.addEventListener('pointerdown', e => { drag = true; cv.setPointerCapture(e.pointerId); mv(e); });
  cv.addEventListener('pointermove', mv); cv.addEventListener('pointerup', () => drag = false);
  registerSim('t3', { start: draw, resize: draw });
})();

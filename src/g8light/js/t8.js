/* ===== 分頁 8：色散與光的三原色 ===== */

/* 光線穿過多邊形（三稜鏡）的追蹤：polys = [{pts:[{x,y}...]}]，nOf(λ) 給折射率 */
function traceRay(o, d, polys, n) {
  const path = [{ ...o }]; let p = { ...o }, inside = -1;
  for (let k = 0; k < 10; k++) {
    let best = null;
    polys.forEach((poly, pi) => poly.pts.forEach((a, i) => {
      const b = poly.pts[(i + 1) % poly.pts.length], ex = b.x - a.x, ey = b.y - a.y;
      const den = d.x * ey - d.y * ex; if (Math.abs(den) < 1e-9) return;
      const t = ((a.x - p.x) * ey - (a.y - p.y) * ex) / den, u = ((a.x - p.x) * d.y - (a.y - p.y) * d.x) / den;
      if (t > 1e-4 && u >= 0 && u <= 1 && (!best || t < best.t)) best = { t, pi, nx: -ey, ny: ex };
    }));
    if (!best) { path.push({ x: p.x + d.x * 900, y: p.y + d.y * 900 }); break; }
    p = { x: p.x + d.x * best.t, y: p.y + d.y * best.t }; path.push({ ...p });
    let L = Math.hypot(best.nx, best.ny), N = { x: best.nx / L, y: best.ny / L };
    if (N.x * d.x + N.y * d.y > 0) N = { x: -N.x, y: -N.y };
    const entering = inside < 0, n1 = entering ? 1 : n, n2 = entering ? n : 1, eta = n1 / n2;
    const ci = -(N.x * d.x + N.y * d.y), kk = 1 - eta * eta * (1 - ci * ci);
    if (kk < 0) { d = { x: d.x + 2 * ci * N.x, y: d.y + 2 * ci * N.y }; }
    else { const c = eta * ci - Math.sqrt(kk); d = { x: eta * d.x + c * N.x, y: eta * d.y + c * N.y }; inside = entering ? best.pi : -1; }
  }
  return path;
}

/* ---------- ① 三稜鏡實驗室 ---------- */
(() => {
  const cv = document.getElementById('l8prism'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const A = bindRange('l8ang', v => v + '°', () => draw());
  let src = 'white', two = false;
  const tri = (cx, cy, s, up) => { const h = s * Math.sqrt(3) / 2, k = up ? 1 : -1; return { pts: [{ x: cx, y: cy - k * h * 2 / 3 }, { x: cx + s / 2, y: cy + k * h / 3 }, { x: cx - s / 2, y: cy + k * h / 3 }] }; };
  const nOf = wl => 1.50 + 0.075 * (700 - wl) / 300;   // 色散程度放大
  const WL = { white: [700, 660, 620, 590, 565, 540, 510, 480, 450, 420], red: [650], green: [532] };
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#05070B'; ctx.fillRect(0, 0, S.W, S.H);
    const P = [tri(300, 160, 170, true)];
    if (two) P.push(tri(535, 162, 170, false));
    P.forEach(p => { ctx.fillStyle = 'rgba(178,235,242,.16)'; ctx.strokeStyle = 'rgba(178,235,242,.7)'; ctx.lineWidth = 1.5; ctx.beginPath(); p.pts.forEach((q, i) => i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)); ctx.closePath(); ctx.fill(); ctx.stroke(); });
    const aDeg = two ? clamp(+A.value, 14, 35) : +A.value, a = rad(aDeg), target = { x: 257.5, y: 135.5 };
    const dir0 = { x: Math.cos(-a), y: Math.sin(-a) };
    const start = { x: target.x - dir0.x * 260, y: target.y - dir0.y * 260 };
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    WL[src].forEach(wl => {
      const path = traceRay(start, dir0, P, nOf(wl));
      const col = src === 'white' ? wl2rgb(wl, 0.75) : wl2rgb(wl, 1);
      ctx.strokeStyle = col; ctx.lineWidth = src === 'white' ? 3 : 3.5; ctx.beginPath(); path.forEach((q, i) => i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)); ctx.stroke();
    });
    // 入射光（白光畫成白色）
    if (src === 'white') { ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(target.x, target.y); ctx.stroke(); }
    ctx.restore();
    ctx.fillStyle = '#ECEFF1'; ctx.fillRect(744, 10, 10, 280); label(ctx, '牆', 738, 20, { align: 'right', size: 12, color: '#ECEFF1' });
    label(ctx, '入射光', start.x + 20, start.y - 14, { size: 12, color: '#fff' });
    const T = document.getElementById('l8txt');
    if (two && aDeg !== +A.value) label(ctx, '加第二個三稜鏡時，入射角自動限制在 14°～35°（其他角度光打不到第二個稜鏡）', 380, 288, { align: 'center', size: 12, color: '#FFE082' });
    if (src !== 'white') T.innerHTML = `${src === 'red' ? '紅色' : '綠色'}雷射光通過三稜鏡：只會<b>偏折</b>（往三稜鏡的底部彎），<b>不會</b>分出其他顏色——因為它本來就只有一種色光。` + (two ? '<br>經過第二個倒放的三稜鏡，偏折被抵消，還是同一種顏色。' : '');
    else if (!two) T.innerHTML = '陽光（白光）通過三稜鏡：分散成<b>紅、橙、黃、綠、藍、靛、紫</b>的光帶——<b>色散</b>。<b>紫光偏折最多、紅光最少</b>：不同色光在玻璃中的速率不同（紫光最慢）。';
    else T.innerHTML = '🔁 加上倒放的第二個三稜鏡：第一個三稜鏡造成的偏折被抵消，各色光又往同一個方向前進、彼此靠攏。牛頓再用透鏡把它們會聚在一起，就<b>重新變成白光</b>。這證明：顏色不是三稜鏡加上去的，而是白光<b>本來就含有</b>的。';
  }
  $$('#l8src .chip').forEach(c => c.onclick = () => { src = c.dataset.s; $$('#l8src .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  $$('#l8two .chip').forEach(c => c.onclick = () => { two = !two; c.classList.toggle('on', two); draw(); });
  registerSim('t8', { start: draw, resize: draw });
})();

/* ---------- ② RGB 混色器 ---------- */
(() => {
  const cv = document.getElementById('l8rgb'); if (!cv) return;
  const S = stage(cv, 420, 320), ctx = S.ctx;
  const R = bindRange('l8r', v => v + '%', () => draw()), G = bindRange('l8g', v => v + '%', () => draw()), B = bindRange('l8b', v => v + '%', () => draw());
  const name = (r, g, b) => {
    const mx = Math.max(r, g, b); if (mx === 0) return '黑（沒有光）';
    const R = r / mx, G = g / mx, B = b / mx;
    if (R > 0.9 && G > 0.9 && B > 0.9) return mx < 100 ? '灰（白光變暗）' : '白';
    if (B < 0.2 && R > 0.9 && G >= 0.3 && G <= 0.75) return '橘（紅多、綠少）';
    if (B < 0.2 && G > 0.9 && R >= 0.3 && R <= 0.75) return '黃綠（綠多、紅少）';
    const on = x => x >= 0.8, k = [on(R), on(G), on(B)].join('');
    const base = { 'truefalsefalse': '紅', 'falsetruefalse': '綠', 'falsefalsetrue': '藍', 'truetruefalse': '黃', 'falsetruetrue': '青', 'truefalsetrue': '洋紅', 'truetruetrue': '白' }[k] || '混合色';
    return mx < 100 && base !== '混合色' ? '暗一點的' + base : base;
  };
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, S.W, S.H);
    const r = +R.value, g = +G.value, b = +B.value;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    [[r, 'rgba(255,0,0,', 165, 120], [g, 'rgba(0,255,0,', 255, 120], [b, 'rgba(0,0,255,', 210, 200]].forEach(([v, c, x, y]) => { ctx.fillStyle = c + (v / 100) + ')'; ctx.beginPath(); ctx.arc(x, y, 95, 0, 7); ctx.fill(); });
    ctx.restore();
    const cr = Math.round(r * 2.55), cg = Math.round(g * 2.55), cb = Math.round(b * 2.55);
    ctx.fillStyle = `rgb(${cr},${cg},${cb})`; ctx.strokeStyle = '#888'; ctx.fillRect(340, 250, 64, 54); ctx.strokeRect(340, 250, 64, 54);
    label(ctx, '三光重疊處', 372, 238, { align: 'center', size: 11, color: '#ccc' });
    document.getElementById('l8rgbTxt').innerHTML = `三盞燈都照到的地方：<b>${name(r, g, b)}</b><br>紅＋綠＝黃、綠＋藍＝青、紅＋藍＝洋紅、紅＋綠＋藍＝白。<b>色光愈混愈亮</b>。`;
  }
  $$('#l8mix .chip').forEach(c => c.onclick = () => { const [r, g, b] = c.dataset.c.split(',').map(Number); [[R, r], [G, g], [B, b]].forEach(([el, v]) => { el.value = v; el.dispatchEvent(new Event('input')); }); });
  registerSim('t8', { start: draw, resize: draw });
})();

/* ---------- ③ 螢幕放大 ---------- */
(() => {
  const cv = document.getElementById('l8pix'); if (!cv) return;
  const S = stage(cv, 420, 240), ctx = S.ctx;
  let col = [255, 255, 0];
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, 300, S.H);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) {
      const x = 12 + i * 47, y = 12 + j * 56;
      [[col[0], '255,40,40'], [col[1], '40,255,40'], [col[2], '60,90,255']].forEach(([v, c], k) => { ctx.fillStyle = `rgba(${c},${0.08 + 0.92 * v / 255})`; rrect(ctx, x + k * 14, y, 11, 46, 3); ctx.fill(); });
    }
    ctx.fillStyle = `rgb(${col.join(',')})`; ctx.fillRect(320, 60, 90, 90); ctx.strokeStyle = '#999'; ctx.strokeRect(320, 60, 90, 90);
    label(ctx, '放大看', 150, S.H - 8, { align: 'center', size: 11, color: '#ccc', base: 'bottom' });
    label(ctx, '眼睛看到', 365, 166, { align: 'center', size: 12 });
  }
  $$('#l8pixC .chip').forEach(c => c.onclick = () => { col = c.dataset.c.split(',').map(Number); $$('#l8pixC .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  registerSim('t8', { start: draw, resize: draw });
})();

/* ---------- ④ 資優：水滴與彩虹 ---------- */
(() => {
  const cv = document.getElementById('l8drop'); if (!cv) return;
  const S = stage(cv, 420, 300), ctx = S.ctx;
  const Bv = bindRange('l8b2', v => fmt(v, 2), () => draw());
  const CX = 230, CY = 150, R = 105;
  const P = phi => ({ x: CX + R * Math.cos(phi), y: CY - R * Math.sin(phi) });
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#0B1A2A'; ctx.fillRect(0, 0, S.W, S.H);
    ctx.fillStyle = 'rgba(129,212,250,.25)'; ctx.strokeStyle = '#81D4FA'; ctx.beginPath(); ctx.arc(CX, CY, R, 0, 7); ctx.fill(); ctx.stroke();
    const b = +Bv.value, i = Math.asin(b), y0 = CY - b * R;
    ray(ctx, 0, y0, P(Math.PI - i).x, y0, '#FFFFFF', 2.5);
    const res = [['紅', 1.331, '#FF3D00'], ['紫', 1.343, '#B388FF']].map(([nm, n, c]) => {
      const r = Math.asin(b / n), p1 = Math.PI - i, p2 = p1 - (Math.PI - 2 * r), p3 = p2 - (Math.PI - 2 * r), th = 4 * r - 2 * i, out = Math.PI + th;
      const A1 = P(p1), A2 = P(p2), A3 = P(p3);
      ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(A1.x, A1.y); ctx.lineTo(A2.x, A2.y); ctx.lineTo(A3.x, A3.y); ctx.lineTo(A3.x + 220 * Math.cos(out), A3.y - 220 * Math.sin(out)); ctx.stroke();
      return [nm, deg(th)];
    });
    label(ctx, '陽光 →', 6, y0 - 12, { size: 12, color: '#fff' });
    let best = 0; for (let x = 0; x < 1; x += 0.001) { const ii = Math.asin(x), rr = Math.asin(x / 1.331); best = Math.max(best, deg(4 * rr - 2 * ii)); }
    document.getElementById('l8dTxt').innerHTML = `紅光射出角 <b>${fmt(res[0][1], 1)}°</b>、紫光 <b>${fmt(res[1][1], 1)}°</b>（相對於陽光的反方向）。<br>把拉桿從 0 拉到 1：紅光的射出角最大只到約 <b>${fmt(best, 1)}°</b>，在 0.86 附近光線最集中——彩虹就出現在這個角度。`;
  }
  registerSim('t8', { start: draw, resize: draw });
})();

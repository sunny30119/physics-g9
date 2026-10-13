/* ===== 分頁 10：斜面 =====
   ① 斜面 vs. 直接抬（H＝1 m、W＝10 kgw）② 無障礙坡道設計 ③ 螺旋＝捲起來的斜面 */
(() => {
  const cv = document.getElementById('c3ramp'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const W = 10, H = 1, PX = 120, GY = 270, X0 = 60;
  let t = 0, run = false;
  const Lel = bindRange('c3rL', v => v + ' m', () => { t = 0; run = false; draw(); info(); });
  const fEl = bindRange('c3rf', v => v + ' kgw', () => { draw(); info(); });
  const L = () => +Lel.value, base = () => Math.sqrt(Math.max(0, L() * L() - H * H));
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    // 水平、垂直用同一個比例（角度才是真的）；斜面再長也畫得進畫布
    const PXs = Math.min(PX, 470 / Math.max(base(), 0.01));
    const bx = base() * PXs, topX = X0 + bx, topY = GY - H * PXs, wallX = 660;
    ground(ctx, 10, S.W - 10, GY);
    ctx.fillStyle = '#D7CCC8'; ctx.beginPath(); ctx.moveTo(X0, GY); ctx.lineTo(topX, topY); ctx.lineTo(topX, GY); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#BCAAA4'; ctx.fillRect(topX, topY, wallX - topX, H * PXs);
    label(ctx, `斜面長 L＝${L()} m`, (X0 + topX) / 2 + 20, GY + 20, { align: 'center', size: 14, bold: true, color: '#5D4037', bg: 'rgba(255,255,255,.8)' });
    label(ctx, `H＝1 m`, wallX - 8, (GY + topY) / 2, { align: 'right', size: 13, bold: true, color: '#5D4037' });
    const p = Math.min(1, t / 3), ang = Math.atan2(H, base() || 0.001);
    // B：沿斜面推
    const bxp = X0 + p * bx, byp = GY - p * H * PXs;
    ctx.save(); ctx.translate(bxp, byp); ctx.rotate(-ang); box(ctx, 0, -34, 34, 34, '#43A047', 'B'); ctx.restore();
    const F = W * H / L() + +fEl.value;
    ctx.save(); ctx.translate(bxp, byp); ctx.rotate(-ang); arrow(ctx, -14 - F * 5, -17, -2, -17, '#D32F2F', 4, 11); ctx.restore();
    label(ctx, `推 ${fmt(F, 1)} kgw`, Math.max(50, bxp - 40), byp - 52, { align: 'center', size: 13, bold: true, color: '#D32F2F', bg: 'rgba(255,255,255,.85)' });
    // A：沿平台右側垂直抬起
    const ax = wallX + 6, ay = GY - p * H * PXs;
    box(ctx, ax, ay - 34, 34, 34, '#1E88E5', 'A');
    arrow(ctx, ax + 17, ay - 34, ax + 17, ay - 34 - 46, '#D32F2F', 4, 11);
    label(ctx, '直接抬 10 kgw', ax + 17, ay - 92, { align: 'center', size: 13, bold: true, color: '#1565C0', bg: 'rgba(255,255,255,.85)' });
    label(ctx, `輸入的功　A 直接抬：10 × 1 ＝ 10 kgw·m　｜　B 推斜面：${fmt(F, 2)} × ${L()} ＝ ${fmt(F * L(), 1)} kgw·m`, 14, 20, { size: 14, bold: true });
  }
  function info() {
    const f = +fEl.value, F = W * H / L() + f;
    document.getElementById('c3rR').innerHTML = `
      <div><span>沿斜面的施力 F</span><b>${fmt(F, 2)} 公斤重</b></div>
      <div><span>推的距離</span><b>${L()} m</b></div>
      <div><span>施力作的功 F×L</span><b>${fmt(F * L(), 2)} kgw·m</b></div>
      <div><span>箱子獲得的位能 W×H</span><b>10 kgw·m</b></div>
      ${f ? `<div><span>機械效率</span><b>${fmt(10 / (F * L()) * 100, 0)}%</b></div>` : ''}`;
    document.getElementById('c3rTxt').innerHTML = f
      ? `有摩擦時，F×L 比 10 大，多出的 ${fmt(F * L() - 10, 1)} kgw·m 被摩擦變成熱。斜面愈長，摩擦作的負功愈多。`
      : (L() > 1 ? `斜面長 ${L()} m → 施力只要 ${fmt(F, 2)} 公斤重（<b>省力</b>），但要推 ${L()} m（<b>費時</b>）。` : '斜面長 1 m＝高度，等於直接垂直抬起：不省力也不費時。') + 'F×L 永遠＝10：<b>不省功</b>！';
  }
  document.getElementById('c3rGo').onclick = () => { t = 0; run = true; };
  const lp = loop(dt => { if (!run) return; t += dt; if (t >= 3) run = false; draw(); });
  registerSim('t10', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- 無障礙坡道 ---------- */
(() => {
  const cv = document.getElementById('c3ada'); if (!cv) return;
  const S = stage(cv, 440, 260), ctx = S.ctx;
  const upd = () => { draw(); info(); };
  const lim = () => { const h = hEl.value / 100; lEl.min = Math.max(0.5, Math.ceil(h * 10) / 10 + 0.1); if (+lEl.value < +lEl.min) { lEl.value = lEl.min; $('output[for="c3adaL"]').textContent = lEl.value + ' m'; } };
  const hEl = bindRange('c3adaH', v => v + ' cm', () => { lim(); upd(); }), lEl = bindRange('c3adaL', v => v + ' m', upd);
  lim();
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const h = hEl.value / 100, L = +lEl.value, base = Math.sqrt(Math.max(0, L * L - h * h));
    const sc = Math.min(330 / Math.max(base, 0.5), 160 / Math.max(h, 0.05), 60), GY = 230, X0 = 30;
    ground(ctx, 10, 430, GY);
    const tx = X0 + base * sc, ty = GY - h * sc;
    const ok = h / L <= 1 / 12 + 1e-9;
    ctx.fillStyle = ok ? '#C8E6C9' : '#FFCDD2'; ctx.beginPath(); ctx.moveTo(X0, GY); ctx.lineTo(tx, ty); ctx.lineTo(tx, GY); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = ok ? '#2E7D32' : '#C62828'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X0, GY); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.fillStyle = '#90A4AE'; ctx.fillRect(tx, ty, 430 - tx, GY - ty);
    label(ctx, '🚪', Math.min(415, tx + 30), ty - 14, { size: 20 });
    label(ctx, '♿', X0 + base * sc * 0.35, GY - h * sc * 0.35 - 16, { size: 22 });
    label(ctx, `坡度 1 : ${fmt(L / h, 1)}`, 220, 24, { align: 'center', size: 16, bold: true, color: ok ? '#2E7D32' : '#C62828' });
  }
  function info() {
    const h = hEl.value / 100, L = +lEl.value, need = 12 * h, F = 80 * h / L, ok = h / L <= 1 / 12 + 1e-9;
    document.getElementById('c3adaR').innerHTML = `
      <div><span>法規最短長度（高×12）</span><b>${fmt(need, 1)} m</b></div>
      <div><span>推輪椅需要的力</span><b>${fmt(F, 1)} 公斤重</b></div>`;
    document.getElementById('c3adaTxt').innerHTML = ok
      ? `✅ 合格！坡度夠平緩，推輪椅只要 ${fmt(F, 1)} 公斤重（直接抬要 80 公斤重）。`
      : `❌ 太陡了！坡道至少要 ${fmt(need, 1)} m 長。太陡的坡道推輪椅要 ${fmt(F, 1)} 公斤重，坐輪椅的人很難自己上去，下坡也危險。`;
  }
  registerSim('t10', { start: upd, resize: draw });
})();

/* ---------- 螺旋：圓柱表面展開 ⇄ 捲回圓柱（兩邊用同一個比例） ----------
   螺絲直徑 12 mm、長 48 mm → 周長 C ＝ π × 12 ≈ 37.7 mm。
   每轉一圈，螺紋沿軸上升一個螺距 p：展開後就是寬 C、高 p 的斜線，斜率 p ÷ C。 */
(() => {
  const cv = document.getElementById('c3screw'); if (!cv) return;
  const S = stage(cv, 440, 300), ctx = S.ctx;
  const D = 12, LEN = 48, C = Math.PI * D, K = 4.6;   // 1 mm ＝ 4.6 px（水平、垂直相同）
  const top = 40, H = LEN * K, bot = top + H;
  const pEl = bindRange('c3sp', v => v + ' mm', () => draw());
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const p = +pEl.value, turns = LEN / p, pPx = p * K, cPx = C * K;
    // 左：展開的圓柱表面（寬＝周長、高＝螺絲長）
    const x0 = 20;
    ctx.fillStyle = '#ECEFF1'; ctx.fillRect(x0, top, cPx, H);
    ctx.save(); ctx.beginPath(); ctx.rect(x0, top, cPx, H); ctx.clip();
    for (let k = 0; k <= turns + 1; k++) {
      const y = bot - k * pPx;
      ctx.strokeStyle = k === 1 ? '#E65100' : '#90A4AE'; ctx.lineWidth = k === 1 ? 4 : 2;
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + cPx, y - pPx); ctx.stroke();
    }
    ctx.restore();
    // 第二圈標示：底＝周長、高＝螺距
    const y1 = bot - pPx;
    ctx.strokeStyle = '#E65100'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0 + cPx, y1); ctx.lineTo(x0 + cPx, y1 - pPx); ctx.stroke(); ctx.setLineDash([]);
    label(ctx, `周長 ${fmt(C, 1)} mm`, x0 + cPx / 2, y1 + 11, { align: 'center', size: 12, color: '#E65100', bold: true, bg: 'rgba(255,255,255,.85)' });
    label(ctx, `螺距 ${p}`, x0 + cPx + 4, y1 - pPx / 2, { size: 12, color: '#E65100', bold: true });
    label(ctx, '① 展開：每一條斜線＝繞一圈', x0, top - 16, { size: 13, bold: true });
    // 右：捲回圓柱（直徑 D，同一比例）
    const cx = 290, r = D * K / 2;
    ctx.fillStyle = '#CFD8DC'; ctx.fillRect(cx - r, top, 2 * r, H);
    ctx.fillStyle = '#B0BEC5'; ctx.beginPath(); ctx.ellipse(cx, top, r, 6, 0, 0, 7); ctx.fill();
    const N = Math.ceil(turns * 64);
    for (let i = 0; i < N; i++) {          // θ 從 0 開始；正面（cos≥0 那半圈）實線，背面虛線
      const th0 = i / 64 * 2 * Math.PI, th1 = (i + 1) / 64 * 2 * Math.PI;
      const ya = bot - th0 / (2 * Math.PI) * pPx, yb = bot - th1 / (2 * Math.PI) * pPx;
      if (yb < top) break;
      const front = Math.sin((th0 + th1) / 2) >= 0;   // θ＝0 在左緣，0～π 是朝向我們的正面
      const turnNo = Math.floor(th0 / (2 * Math.PI));
      ctx.strokeStyle = turnNo === 1 ? '#E65100' : '#546E7A'; ctx.lineWidth = front ? (turnNo === 1 ? 4 : 2.5) : 1;
      ctx.globalAlpha = front ? 1 : 0.45;
      ctx.beginPath(); ctx.moveTo(cx - r * Math.sin(th0 - Math.PI / 2) * -1, ya); ctx.lineTo(cx - r * Math.sin(th1 - Math.PI / 2) * -1, yb); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // 正中間的切線：圓柱正面中央（θ＝π/2）螺紋的斜率＝展開圖的 螺距 ÷ 周長
    const yc = bot - 1.25 * pPx, sl = pPx / cPx, half = r * 1.6;
    ctx.save(); ctx.setLineDash([6, 4]); ctx.strokeStyle = '#6A1B9A'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx - half, yc + half * sl); ctx.lineTo(cx + half, yc - half * sl); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.setLineDash([6, 4]); ctx.strokeStyle = '#6A1B9A'; ctx.lineWidth = 2.5;      // 展開圖上同一條斜線的延伸，方便對照
    ctx.beginPath(); ctx.moveTo(x0, y1 + 0); ctx.lineTo(x0 + cPx, y1 - pPx); ctx.stroke(); ctx.restore();
    ctx.fillStyle = '#6A1B9A'; ctx.beginPath(); ctx.arc(cx, yc, 4, 0, 7); ctx.fill();
    // 螺距標示
    ctx.strokeStyle = '#E65100'; ctx.lineWidth = 1.5;
    const xr = cx + r + 10; ctx.beginPath(); ctx.moveTo(xr, bot - pPx); ctx.lineTo(xr + 6, bot - pPx); ctx.moveTo(xr, bot - 2 * pPx); ctx.lineTo(xr + 6, bot - 2 * pPx); ctx.moveTo(xr + 3, bot - pPx); ctx.lineTo(xr + 3, bot - 2 * pPx); ctx.stroke();
    label(ctx, `一圈升 ${p} mm`, xr + 10, bot - 1.5 * pPx, { size: 12, color: '#E65100', bold: true });
    label(ctx, '② 捲回圓柱：螺紋', cx, top - 16, { align: 'center', size: 13, bold: true });
    label(ctx, `共 ${fmt(turns, 1)} 圈`, cx, bot + 18, { align: 'center', size: 14, bold: true, color: '#E65100' });
    label(ctx, `斜率＝螺距 ÷ 周長＝${p} ÷ ${fmt(C, 1)} ≈ ${fmt(p / C, 2)}`, x0, bot + 18, { size: 12, bold: true, color: '#37474F' });
    document.getElementById('c3spTxt').innerHTML = `螺絲直徑 12 mm、長 48 mm。橘色是<b>同一圈</b>螺紋：展開後就是一條底＝周長、高＝螺距的斜線，捲回圓柱時繞一圈剛好上升一個螺距，兩邊的斜率一樣。<br>⚠️ 從正面看圓柱，螺紋兩側是繞到後面去，看起來比較陡；只有<b>正中間</b>那一點（紫色虛線切線）的斜率，才和展開圖的斜率一樣。<br>螺距 ${p} mm：鎖到底要轉 <b>${fmt(turns, 1)} 圈</b>。螺距愈小 → 斜率愈小（斜面愈平緩）→ <b>愈省力，但要轉愈多圈（費時）</b>。`;
  }
  registerSim('t10', { start: draw, resize: draw });
})();

/* ===== 光學共用工具 =====
   ray()：畫光線（中間有箭頭）；extLine()：虛線延長線；angArc()：量角弧；
   drawLens()、drawArrowObj()、candle()；wl2rgb()：波長 → 顏色；mountQuiz()：小測驗 */

function ray(ctx, x1, y1, x2, y2, color = '#E53935', w = 2.5, arrowAt = 0.55) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  if (arrowAt) {
    const mx = x1 + (x2 - x1) * arrowAt, my = y1 + (y2 - y1) * arrowAt, a = Math.atan2(y2 - y1, x2 - x1);
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(mx + 7 * Math.cos(a), my + 7 * Math.sin(a));
    ctx.lineTo(mx - 7 * Math.cos(a - 0.5), my - 7 * Math.sin(a - 0.5)); ctx.lineTo(mx - 7 * Math.cos(a + 0.5), my - 7 * Math.sin(a + 0.5)); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function extLine(ctx, x1, y1, x2, y2, color = '#E53935', w = 1.6) {
  ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.globalAlpha = .8;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
}
/* 量角弧：以 (cx,cy) 為圓心，從角度 a1 到 a2（弧度，畫布座標） */
function angArc(ctx, cx, cy, r, a1, a2, color, txt) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, Math.min(a1, a2), Math.max(a1, a2)); ctx.stroke();
  if (txt) { const am = (a1 + a2) / 2; label(ctx, txt, cx + (r + 18) * Math.cos(am), cy + (r + 18) * Math.sin(am), { align: 'center', size: 13, bold: true, color, bg: 'rgba(255,255,255,.85)' }); }
  ctx.restore();
}
/* 透鏡：x 位置、主軸 yc、半高 h；convex 為 true 是凸透鏡 */
function drawLens(ctx, x, yc, h, convex = true, color = 'rgba(100,181,246,.45)') {
  ctx.save(); ctx.fillStyle = color; ctx.strokeStyle = '#1976D2'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (convex) { ctx.moveTo(x, yc - h); ctx.quadraticCurveTo(x + 22, yc, x, yc + h); ctx.quadraticCurveTo(x - 22, yc, x, yc - h); }
  else { ctx.moveTo(x - 12, yc - h); ctx.lineTo(x + 12, yc - h); ctx.quadraticCurveTo(x + 2, yc, x + 12, yc + h); ctx.lineTo(x - 12, yc + h); ctx.quadraticCurveTo(x - 2, yc, x - 12, yc - h); }
  ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
}
/* 物體（箭頭）：底在 (x, yc)，高 h（往上為正）；dashed 表示虛像 */
function drawArrowObj(ctx, x, yc, h, color = '#2E7D32', dashed = false, w = 4) {
  ctx.save(); ctx.strokeStyle = ctx.fillStyle = color; ctx.lineWidth = w; if (dashed) ctx.setLineDash([6, 4]);
  ctx.beginPath(); ctx.moveTo(x, yc); ctx.lineTo(x, yc - h); ctx.stroke(); ctx.setLineDash([]);
  const s = Math.sign(h) || 1;
  ctx.beginPath(); ctx.moveTo(x, yc - h); ctx.lineTo(x - 8, yc - h + 12 * s); ctx.lineTo(x + 8, yc - h + 12 * s); ctx.closePath(); ctx.fill();
  ctx.restore();
}
/* 蠟燭：底在 (x, yc)，高 h（負值＝倒立），alpha 透明度 */
function candle(ctx, x, yc, h, alpha = 1, dashed = false) {
  ctx.save(); ctx.globalAlpha = alpha;
  const s = Math.sign(h) || 1, H = Math.abs(h), w = Math.max(6, H * 0.28);
  ctx.translate(x, yc); ctx.scale(1, s);
  ctx.fillStyle = '#FFF3E0'; ctx.strokeStyle = '#8D6E63'; ctx.lineWidth = 1.5; if (dashed) ctx.setLineDash([5, 4]);
  ctx.fillRect(-w / 2, -H * 0.7, w, H * 0.7); ctx.strokeRect(-w / 2, -H * 0.7, w, H * 0.7);
  ctx.setLineDash([]);
  const g = ctx.createRadialGradient(0, -H * 0.82, 1, 0, -H * 0.82, H * 0.2);
  g.addColorStop(0, '#FFF59D'); g.addColorStop(0.6, '#FFB300'); g.addColorStop(1, 'rgba(255,111,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, -H * 0.84, H * 0.09, H * 0.17, 0, 0, 7); ctx.fill();
  ctx.restore();
}
/* 可見光波長（nm）→ 顏色 */
function wl2rgb(nm, a = 1) {
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = -(nm - 440) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; } else { r = 1; }
  return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a})`;
}
/* 折射：入射角 th1（弧度）、n1→n2；全反射時回傳 null */
const snell = (th1, n1, n2) => { const s = n1 * Math.sin(th1) / n2; return Math.abs(s) > 1 ? null : Math.asin(s); };
const deg = r => r * 180 / Math.PI, rad = d => d * Math.PI / 180;

/* 小測驗：[{q, opts, ans, why}]，點選就對答案 */
function mountQuiz(host, items) {
  host.innerHTML = items.map((it, i) => `<div class="qz" data-i="${i}" style="margin:10px 0 14px">
    <div class="q"><b>${i + 1}.</b> ${it.q}</div><div class="vl"></div>
    <div class="reveal callout good">${it.why}</div></div>`).join('');
  $$('.qz', host).forEach(d => {
    const it = items[+d.dataset.i];
    const v = voteList($('.vl', d), it.opts, () => { v.reveal(it.ans); $('.reveal', d).classList.add('show'); });
  });
}
/* 量尺寸的雙箭頭 */
function dim(ctx, x1, y1, x2, y2, txt, color = '#C62828', side = 'top') {
  arrow(ctx, (x1 + x2) / 2, (y1 + y2) / 2, x1, y1, color, 2, 9); arrow(ctx, (x1 + x2) / 2, (y1 + y2) / 2, x2, y2, color, 2, 9);
  const vert = Math.abs(x2 - x1) < 2;
  label(ctx, txt, vert ? x1 + 8 : (x1 + x2) / 2, vert ? (y1 + y2) / 2 : (y1 + y2) / 2 + (side === 'top' ? -13 : 13), { align: vert ? 'left' : 'center', size: 13, bold: true, color, bg: 'rgba(255,255,255,.85)' });
}

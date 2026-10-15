/* ===== 分頁 1：光的直進性（針孔成像、影子） ===== */

/* ---------- ① 針孔成像 ---------- */
(() => {
  const cv = document.getElementById('l1pin'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const PX = 10, HX = 330, YC = 150, CUPR = 4.5;   // 1 cm = 10 px；針孔在 x=330
  const D = bindRange('l1d', v => v + ' cm', () => upd('d'));
  const R = bindRange('l1r', v => v + ' mm', () => upd('r'));
  let holes = 1, L = 10, prev = { d: 15, r: 0.5 };
  // LED（單位 cm）：x 是左右（正面圖）、y 是上下
  const LED = [{ c: '#FF1744', x: 0, y: 4, n: '紅' }, { c: '#00E676', x: 0, y: 0, n: '綠' }, { c: '#2979FF', x: 3, y: 0, n: '藍' }];
  const holeYs = () => holes === 1 ? [0] : [-1.4, 0, 1.4];
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const d = +D.value, dia = +R.value;
    ctx.fillStyle = '#1A1A1A'; ctx.fillRect(0, 0, 525, S.H);
    // 紙杯
    const sx = HX + L * PX;
    ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(HX, YC - CUPR * PX, L * PX, CUPR * 2 * PX);
    ctx.strokeStyle = '#ECEFF1'; ctx.lineWidth = 2; ctx.strokeRect(HX, YC - CUPR * PX, L * PX, CUPR * 2 * PX);
    ctx.fillStyle = '#ECEFF1'; ctx.fillRect(HX - 2, YC - CUPR * PX, 4, CUPR * 2 * PX);
    holeYs().forEach(h => { ctx.fillStyle = '#1A1A1A'; ctx.fillRect(HX - 3, YC - h * PX - Math.max(1.5, dia * 0.5), 6, Math.max(3, dia)); });
    ctx.fillStyle = 'rgba(255,248,225,.85)'; ctx.fillRect(sx - 2, YC - CUPR * PX, 5, CUPR * 2 * PX);
    label(ctx, '描圖紙', sx + 6, YC - CUPR * PX - 10, { size: 12, color: '#FFF8E1' });
    label(ctx, '針孔', HX, YC + CUPR * PX + 16, { align: 'center', size: 12, color: '#ECEFF1' });
    // LED 與光線（側面只畫紅、綠；藍在綠旁邊重疊）
    const lx = HX - d * PX;
    [LED[0], LED[1]].forEach(o => {
      const oy = YC - o.y * PX;
      holeYs().forEach(h => {
        const iy = h + (h - o.y) * L / d;
        if (Math.abs(iy) > CUPR) return;
        ray(ctx, lx, oy, HX, YC - h * PX, o.c, 1.6, 0.5); ray(ctx, HX, YC - h * PX, sx, YC - iy * PX, o.c, 1.6, 0.5);
      });
      ctx.fillStyle = o.c; ctx.shadowColor = o.c; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(lx, oy, 7, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    });
    label(ctx, '三色 LED', lx, YC + 60, { align: 'center', size: 12, color: '#ECEFF1' });
    dim(ctx, lx, YC + 90, HX, YC + 90, '物距 ' + d + ' cm', '#FFD54F', 'bottom');
    dim(ctx, HX, YC + 90, sx, YC + 90, '像距 ' + L + ' cm', '#80DEEA', 'bottom');
    label(ctx, '側面圖', 10, 16, { size: 13, bold: true, color: '#ECEFF1' });
    // 正面圖：描圖紙
    const FX = 640, FY = 150, FS = 21;   // 1 cm = 21 px
    ctx.fillStyle = '#FFF8E1'; ctx.beginPath(); ctx.arc(FX, FY, CUPR * FS, 0, 7); ctx.fill();
    ctx.strokeStyle = '#BCAAA4'; ctx.lineWidth = 2; ctx.stroke();
    label(ctx, '描圖紙（從杯子後方看）', FX, 18, { align: 'center', size: 12, bold: true });
    ctx.save(); ctx.beginPath(); ctx.arc(FX, FY, CUPR * FS, 0, 7); ctx.clip();
    ctx.globalCompositeOperation = 'multiply';
    const blur = Math.max(5, dia / 10 * (1 + L / d) * FS / 2), alpha = clamp(0.35 + dia * dia * 0.04, 0.35, 1);
    holeYs().forEach(h => LED.forEach(o => {
      const ix = -o.x * L / d, iy = h + (h - o.y) * L / d;
      const g = ctx.createRadialGradient(FX + ix * FS, FY - iy * FS, 0, FX + ix * FS, FY - iy * FS, blur);
      g.addColorStop(0, o.c); g.addColorStop(dia > 2 ? 0.3 : 0.7, o.c); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = alpha; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(FX + ix * FS, FY - iy * FS, blur, 0, 7); ctx.fill();
    }));
    ctx.restore();
    const outside = holeYs().some(h => LED.some(o => Math.hypot(o.x * L / d, h + (h - o.y) * L / d) > CUPR));
    if (outside) label(ctx, '⚠ 有些 LED 的像跑出描圖紙了（像太大）', FX, FY + CUPR * FS - 14, { align: 'center', size: 12, bold: true, color: '#C62828', bg: 'rgba(255,255,255,.9)' });
    // 原物方向小圖
    label(ctx, '原來的 LED（你看過去）', FX, 268, { align: 'center', size: 11, color: '#555' });
    LED.forEach(o => { ctx.fillStyle = o.c; ctx.beginPath(); ctx.arc(FX - 12 + o.x * 6, 290 - o.y * 3.5 - 4, 4, 0, 7); ctx.fill(); });
  }
  function upd(k) {
    const d = +D.value, dia = +R.value;
    document.getElementById('l1R').innerHTML = `<div><span>像的大小 ÷ 物的大小</span><b>${fmt(L / d, 2)} 倍</b></div><div><span>成像數目</span><b>${holes} 個</b></div>
      <div><span>亮度（相對）</span><b>${'☀'.repeat(clamp(Math.round(dia * dia / 4) + 1, 1, 8))}</b></div><div><span>清晰度</span><b>${dia <= 1 ? '清楚' : dia <= 3 ? '有點模糊' : '很模糊'}</b></div>`;
    const tx = document.getElementById('l1txt');
    if (k === 'd') tx.innerHTML = d > prev.d ? '針孔離 LED <b>愈遠</b>，產生的像<b>愈小</b>。' : '針孔離 LED <b>愈近</b>，產生的像<b>愈大</b>。';
    else if (k === 'r') tx.innerHTML = '針孔面積變大，相當於很多針孔成的像<b>交錯重疊</b>：像變<b>亮</b>，但形狀變<b>模糊</b>。';
    else if (k === 'h') tx.innerHTML = holes === 3 ? '多了兩個針孔：每個針孔都成一個像，描圖紙上出現 <b>3 組</b> LED 的像。' : '一個針孔，一組像。';
    else if (k === 'L') tx.innerHTML = `紙杯變長（像距 ${L} cm）：物距不變時，像變<b>${L > 10 ? '大' : '小'}</b>。比較兩個紙杯時，要控制「LED 到針孔的距離」相同。`;
    else tx.innerHTML = '描圖紙上的像：紅色在<b>下面</b>、藍色跑到<b>另一邊</b>——<b>上下顛倒、左右相反</b>。光線在針孔交叉，證明光沿直線前進。';
    prev = { d, r: dia }; draw();
  }
  $$('#l1holes .chip').forEach(c => c.onclick = () => { holes = +c.dataset.n; $$('#l1holes .chip').forEach(x => x.classList.toggle('on', x === c)); upd('h'); });
  $$('#l1cup .chip').forEach(c => c.onclick = () => { L = +c.dataset.l; $$('#l1cup .chip').forEach(x => x.classList.toggle('on', x === c)); upd('L'); });
  registerSim('t1', { start() { upd(); }, resize: draw });
})();

/* ---------- ② 影子與手影 ---------- */
(() => {
  const cv = document.getElementById('l1shadow'); if (!cv) return;
  const S = stage(cv, 760, 260), ctx = S.ctx;
  const SL = bindRange('l1sl', v => v + ' cm', () => { draw(); info(); });
  const SW = bindRange('l1sw', v => v + ' cm', () => { draw(); info(); });
  const PX = 1.9, X0 = 30, YC = 130, HH = 12;   // 手高 12 cm
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#263238'; ctx.fillRect(0, 0, S.W, S.H);
    const hx = X0 + +SL.value * PX, wx = hx + +SW.value * PX;
    const sh = HH * (+SL.value + +SW.value) / +SL.value;
    const VP = Math.min(PX, 110 / sh);   // 垂直比例：影子太大時整張圖縮小
    // 光照到的牆
    ctx.fillStyle = '#FFF8E1'; ctx.fillRect(wx, 10, 14, 240);
    ctx.fillStyle = 'rgba(255,236,179,.12)'; ctx.beginPath(); ctx.moveTo(X0, YC); ctx.lineTo(wx, 10); ctx.lineTo(wx, 250); ctx.closePath(); ctx.fill();
    // 影子區
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.beginPath(); ctx.moveTo(hx, YC - HH * VP); ctx.lineTo(wx, YC - sh * VP); ctx.lineTo(wx, YC + sh * VP); ctx.lineTo(hx, YC + HH * VP); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#111'; ctx.fillRect(wx, YC - sh * VP, 14, sh * 2 * VP);
    ray(ctx, X0, YC, wx, YC - sh * VP, '#FFE082', 1.5, 0.3); ray(ctx, X0, YC, wx, YC + sh * VP, '#FFE082', 1.5, 0.3);
    ctx.fillStyle = '#5D4037'; ctx.fillRect(hx - 5, YC - HH * VP, 10, HH * 2 * VP);
    candle(ctx, X0, YC + 40, 50);
    ctx.font = '26px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✋', hx, YC - HH * VP - 18);
    if (VP < PX - 0.01) label(ctx, '📏 影子太大，整張圖已縮小顯示（手的大小沒變）', 14, 246, { size: 12, color: '#FFE082' });
    label(ctx, '牆上的影子', wx - 6, 18, { align: 'right', size: 12, color: '#FFF8E1', bold: true });
  }
  function info() {
    const sh = HH * (+SL.value + +SW.value) / +SL.value;
    document.getElementById('l1sR').innerHTML = `<div><span>手的大小</span><b>${HH} cm</b></div><div><span>影子的大小</span><b>約 ${fmt(sh, 0)} cm</b></div><div><span>影子是手的</span><b>${fmt(sh / HH, 1)} 倍</b></div>`;
  }
  registerSim('t1', { start() { draw(); info(); }, resize: draw });
})();

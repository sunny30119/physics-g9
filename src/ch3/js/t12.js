/* ===== 分頁 12：滑輪與輪軸 =====
   ① 滑輪：n＝1（定）、2（動）、4（滑輪組）；拉繩 S1 → 物體上升 S1/n，F＝W/n
   ② 輪軸：施力在輪或軸，轉一圈時兩邊繩子移動 2πR、2πr
   ③ 工地吊鋼琴挑戰 */
(() => {
  const cv = document.getElementById('c3pulley'); if (!cv) return;
  const S = stage(cv, 440, 400), ctx = S.ctx;
  const W = 20, PX = 60, CEIL = 30;   // 手和物體共用同一個比例：1 m ＝ 60 px
  let n = 1;
  const sEl = bindRange('c3pS', v => v + ' m', () => { draw(); info(); });
  function wheel(x, y, r = 22) { ctx.fillStyle = '#B0BEC5'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.strokeStyle = '#546E7A'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = '#546E7A'; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); }
  function rope(x1, y1, x2, y2) { ctx.strokeStyle = '#8D6E63'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#78909C'; ctx.fillRect(20, CEIL - 12, 400, 12);
    const s1 = +sEl.value, rise = s1 / n, GY = 380, r = 22;
    ground(ctx, 20, 420, GY);
    const boxH = 50, by = GY - boxH - rise * PX;       // 物體上緣
    let hsx = 0, hsy = 0, bxs = 0;                     // 手的起點、物體的 x
    if (n === 1) {
      const cx = 200, cy = CEIL + 40;
      rope(cx, CEIL, cx, cy); wheel(cx, cy);
      rope(cx - r, cy, cx - r, by);
      const hy = 180 + s1 * PX;                         // 手往下拉 s1
      hsx = cx + r; hsy = 180; bxs = cx - r;
      rope(cx + r, cy, cx + r, hy);
      box(ctx, cx - r - 30, by, 60, boxH, '#1E88E5', '20kgw');
      arrow(ctx, cx + r, hy, cx + r, hy + 40, '#D32F2F', 4, 12);
      label(ctx, '✋ 往下拉', cx + r + 10, hy + 26, { size: 13, bold: true, color: '#D32F2F' });
    } else if (n === 2) {
      const mx = 170, my = by - 30;
      wheel(mx, my, r);
      rope(mx - r, CEIL, mx - r, my);                       // 一端固定在天花板
      const hy = 200 - s1 * PX;                         // 手往上拉 s1
      hsx = mx + r; hsy = 200; bxs = mx;
      rope(mx + r, my, mx + r, hy);                          // 另一端往上拉
      arrow(ctx, mx + r, hy, mx + r, hy - 36, '#D32F2F', 4, 12);
      label(ctx, '✋ 往上拉', mx + r + 10, hy - 20, { size: 13, bold: true, color: '#D32F2F' });
      rope(mx, my, mx, by);
      box(ctx, mx - 30, by, 60, boxH, '#1E88E5', '20kgw');
    } else {
      // 滑輪組：上方固定滑輪組、下方動滑輪組，中間 4 段繩子，自由端從上方往下拉
      const tx = 170, ty = CEIL + 30, my = by - 34;
      ctx.fillStyle = '#90A4AE'; rrect(ctx, tx - 50, ty - 16, 100, 32, 8); ctx.fill(); rope(tx, CEIL, tx, ty - 16);
      ctx.fillStyle = '#B0BEC5'; rrect(ctx, tx - 50, my - 16, 100, 32, 8); ctx.fill();
      [-36, -12, 12, 36].forEach(dx => rope(tx + dx, ty + 16, tx + dx, my - 16));
      label(ctx, '4 段繩子撐住', tx, (ty + my) / 2, { align: 'center', size: 12, bold: true, bg: 'rgba(255,255,255,.9)' });
      const hy = 200 + s1 * PX;                         // 手往下拉 s1
      hsx = tx + 70; hsy = 200; bxs = tx;
      rope(tx + 50, ty, tx + 70, ty); rope(tx + 70, ty, tx + 70, hy);
      arrow(ctx, tx + 70, hy, tx + 70, hy + 40, '#D32F2F', 4, 12);
      label(ctx, '✋ 往下拉', tx + 80, hy + 26, { size: 13, bold: true, color: '#D32F2F' });
      rope(tx, my + 16, tx, by);
      box(ctx, tx - 30, by, 60, boxH, '#1E88E5', '20kgw');
    }
    ctx.save(); ctx.setLineDash([4, 4]); ctx.lineWidth = 2;
    ctx.strokeStyle = '#C62828'; ctx.beginPath(); ctx.moveTo(hsx - 16, hsy); ctx.lineTo(hsx + 16, hsy); ctx.stroke();
    ctx.strokeStyle = '#1565C0'; ctx.beginPath(); ctx.moveTo(bxs - 40, GY - boxH); ctx.lineTo(bxs + 40, GY - boxH); ctx.stroke(); ctx.restore();
    label(ctx, '紅虛線＝手的起點　藍虛線＝物體頂端原本的位置', 430, GY - 84, { align: 'right', size: 12, color: '#546E7A', bg: 'rgba(255,255,255,.92)' });
    label(ctx, `物體升高 ${fmt(rise, 2)} m`, 430, GY - 20, { align: 'right', size: 14, bold: true, color: '#1565C0', bg: '#E3F2FD' });
    label(ctx, `手拉 ${fmt(s1, 2)} m`, 430, GY - 50, { align: 'right', size: 14, bold: true, color: '#C62828', bg: '#FFEBEE' });
  }
  function info() {
    const s1 = +sEl.value, F = W / n, s2 = s1 / n;
    document.getElementById('c3pR').innerHTML = `
      <div><span>施力 F</span><b>${fmt(F, 1)} 公斤重</b></div>
      <div><span>撐住物體的繩子</span><b>${n} 段</b></div>
      <div><span>施力作的功 F×S₁</span><b>${fmt(F * s1, 1)} kgw·m</b></div>
      <div><span>物體得到的位能 W×S₂</span><b>${fmt(W * s2, 1)} kgw·m</b></div>`;
    document.getElementById('c3pTxt').innerHTML = n === 1
      ? '<b>定滑輪</b>：施力＝物體重量，拉多少繩、物體就升多高。不省力也不省時，但能把「往上提」改成「往下拉」。'
      : n === 2 ? '<b>動滑輪</b>：兩段繩子一起撐住物體，施力只要一半；但物體升 1 m，手要拉 2 m。功一樣多！'
      : '<b>滑輪組</b>：四段繩子一起撐，施力只要 ¼；手要拉 4 倍長的繩子。';
  }
  $$('#c3pMode .chip').forEach(c => c.onclick = () => { n = +c.dataset.n; $$('#c3pMode .chip').forEach(x => x.classList.toggle('on', x === c)); sEl.value = 0; sEl.dispatchEvent(new Event('input')); });
  window.addEventListener('modechange', e => { if (e.detail === 'stu' && n === 4) $('#c3pMode .chip').click(); });
  registerSim('t12', { start() { draw(); info(); }, resize: draw });
})();

/* ---------- 輪軸 ---------- */
(() => {
  const cv = document.getElementById('c3wheel'); if (!cv) return;
  const S = stage(cv, 440, 340), ctx = S.ctx;
  const W = 40, PX = 5, DS = 2;   // 半徑 1 cm ＝ 5 px；繩子移動 1 cm ＝ 2 px
  let mode = 'wheel', ang = 0, target = 0;
  const upd = () => { draw(); info(); };
  const RE = bindRange('c3wR', v => v + ' cm', upd), rE = bindRange('c3wr', v => v + ' cm', upd);
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const R = RE.value * PX, r = rE.value * PX, cx = 200, cy = 120;
    const turn = ang / (2 * Math.PI);
    ctx.fillStyle = '#78909C'; ctx.fillRect(cx - 6, 0, 12, cy);
    // 輪
    ctx.fillStyle = 'rgba(255,183,77,.5)'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.strokeStyle = '#EF6C00'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#8D6E63'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
    ctx.strokeStyle = '#3E2723'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R); ctx.stroke();
    label(ctx, '輪 R', cx + R * 0.7, cy - R * 0.75, { size: 13, bold: true, color: '#E65100' });
    label(ctx, '軸 r', cx, cy, { align: 'center', size: 12, bold: true, color: '#fff' });
    // 施力邊、物體邊（物體掛左邊，施力往下拉右邊）
    const onWheel = mode === 'wheel';
    const loadR = onWheel ? r : R, effR = onWheel ? R : r;
    const loadY = 280 - turn * 2 * Math.PI * loadR / PX * DS;
    const effY = 230 + turn * 2 * Math.PI * effR / PX * DS;
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx - loadR, cy); ctx.lineTo(cx - loadR, loadY); ctx.stroke();
    box(ctx, cx - loadR - 26, loadY, 52, 40, '#1E88E5', '40kgw');
    ctx.beginPath(); ctx.moveTo(cx + effR, cy); ctx.lineTo(cx + effR, effY); ctx.stroke();
    const F = onWheel ? W * rE.value / RE.value : W * RE.value / rE.value;
    arrow(ctx, cx + effR, effY, cx + effR, effY + 30 + Math.min(F, 120) * 0.5, '#D32F2F', 4, 12);
    label(ctx, `F＝${fmt(F, 1)} kgw`, cx + effR + 10, effY + 24, { size: 13, bold: true, color: '#D32F2F', bg: 'rgba(255,255,255,.85)' });
    if (turn > 0.01) {
      label(ctx, `手拉 ${fmt(turn * 2 * Math.PI * effR / PX, 1)} cm`, 14, 20, { size: 14, bold: true, color: '#C62828', bg: '#FFEBEE' });
      label(ctx, `物體升 ${fmt(turn * 2 * Math.PI * loadR / PX, 1)} cm`, 14, 46, { size: 14, bold: true, color: '#1565C0', bg: '#E3F2FD' });
    }
  }
  function info() {
    const R = +RE.value, r = +rE.value, onW = mode === 'wheel', F = onW ? W * r / R : W * R / r;
    document.getElementById('c3wRR').innerHTML = `
      <div><span>施力臂</span><b>${onW ? R : r} cm</b></div><div><span>抗力臂</span><b>${onW ? r : R} cm</b></div>
      <div><span>需要的施力</span><b>${fmt(F, 1)} kgw</b></div>`;
    document.getElementById('c3wTxt').innerHTML = onW
      ? `施力在<b>輪</b>上：F × ${R} ＝ 40 × ${r} → F ＝ ${fmt(F, 1)} 公斤重，<b>省力費時</b>（轉一圈：手拉 2π×${R}≈${fmt(2 * Math.PI * R, 1)} cm，物體只升 2π×${r}≈${fmt(2 * Math.PI * r, 1)} cm）。`
      : `施力在<b>軸</b>上：F × ${r} ＝ 40 × ${R} → F ＝ ${fmt(F, 1)} 公斤重，<b>費力省時</b>（轉一圈：手只拉 ${fmt(2 * Math.PI * r, 1)} cm，物體卻升 ${fmt(2 * Math.PI * R, 1)} cm）。`;
  }
  $$('#c3wMode .chip').forEach(c => c.onclick = () => { mode = c.dataset.m; $$('#c3wMode .chip').forEach(x => x.classList.toggle('on', x === c)); ang = target = 0; upd(); });
  document.getElementById('c3wGo').onclick = () => { ang = 0; target = Math.PI / 2; };
  const lp = loop(dt => { if (ang < target) { ang = Math.min(target, ang + dt * 2); draw(); } });
  registerSim('t12', { start() { upd(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- 工地吊鋼琴 ---------- */
(() => {
  const host = document.getElementById('c3site'); if (!host) return;
  const W = 200, H = 5, MAX = 60;
  const OPT = [
    ['💪 直接用繩子往上提', W, H, '不省力，200 公斤重遠超過工人的極限。'],
    ['⬇ 一個定滑輪', W, H, '改變方向（可以往下拉），但施力還是 200 公斤重。'],
    ['⬆ 一個動滑輪', W / 2, 2 * H, '省一半力，100 公斤重——還是太重了。'],
    ['⛓️ 滑輪組（4 段繩子）', W / 4, 4 * H, '50 公斤重，工人拉得動！但要拉 20 公尺的繩子。'],
    ['📐 推上 15 m 長的斜坡', W * H / 15, 15, '約 66.7 公斤重，差一點點……'],
    ['📐 推上 20 m 長的斜坡', W * H / 20, 20, '50 公斤重，可以！但要準備一條 20 m 長的坡道。'],
  ];
  host.innerHTML = OPT.map((o, i) => `<button class="chip" data-i="${i}">${o[0]}</button>`).join('');
  $$('.chip', host).forEach(c => c.onclick = () => {
    const [n, F, d, why] = OPT[+c.dataset.i];
    $$('.chip', host).forEach(x => x.classList.toggle('on', x === c));
    const ok = F <= MAX + 1e-9;
    document.getElementById('c3siteR').innerHTML = `
      <div><span>需要的施力</span><b style="color:${ok ? 'var(--ok)' : 'var(--bad)'}">${fmt(F, 1)} 公斤重</b></div>
      <div><span>施力要移動的距離</span><b>${d} m</b></div>
      <div><span>施力作的功</span><b>${fmt(F * d, 0)} kgw·m</b></div>
      <div><span>結果</span><b>${ok ? '✅ 成功' : '❌ 拉不動'}</b></div>`;
    document.getElementById('c3siteTxt').innerHTML = `${why}<br><span class="note">不管哪一種方法，施力作的功都是 ${W}×${H}＝${W * H} kgw·m——簡單機械不能省功！</span>`;
  });
})();

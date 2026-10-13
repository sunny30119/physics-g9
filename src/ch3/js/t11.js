/* ===== 分頁 11：槓桿 =====
   棒長 1（0~1 位置），可拖曳支點、施力點、抗力點。抗力 20 kgw。
   施力 F ＝ W × 抗力臂 ÷ 施力臂；壓下時兩端移動距離 ∝ 力臂 */
(() => {
  const cv = document.getElementById('c3lever'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const W = 20, X0 = 80, LEN = 600, BY = 170;
  let piv = 0.5, eff = 0.95, load = 0.2, ang = 0, tAng = 0, drag = null;
  const px = u => X0 + u * LEN;
  const arms = () => ({ e: Math.abs(eff - piv), l: Math.abs(load - piv) });
  const sameSide = () => Math.sign(eff - piv) === Math.sign(load - piv);
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const P = [px(piv), BY];
    const rot = (u, dy = 0) => { const dx = px(u) - P[0]; return [P[0] + dx * Math.cos(ang) - dy * Math.sin(ang), P[1] + dx * Math.sin(ang) + dy * Math.cos(ang)]; };
    // 支點
    ctx.fillStyle = '#607D8B'; ctx.beginPath(); ctx.moveTo(P[0], P[1] + 6); ctx.lineTo(P[0] - 22, P[1] + 46); ctx.lineTo(P[0] + 22, P[1] + 46); ctx.closePath(); ctx.fill();
    ground(ctx, 20, 740, BY + 46);
    // 棒
    const a = rot(0), b = rot(1);
    ctx.strokeStyle = '#8D6E63'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); ctx.lineCap = 'butt';
    // 物體（抗力點）
    const lp = rot(load, -8);
    box(ctx, lp[0] - 22, lp[1] - 40, 44, 40, '#1E88E5', '20kgw');
    // 施力
    const { e, l } = arms(), F = e > 0.005 ? W * l / e : Infinity;
    const ep = rot(eff, sameSide() ? 6 : -8);
    const fl = Math.min(110, 20 + (isFinite(F) ? F : 200) * 1.2);
    const up = sameSide();        // 施力點與抗力點在支點同側時，要往上拉
    if (up) arrow(ctx, ep[0], ep[1] + 6, ep[0], ep[1] + 6 - fl, '#D32F2F', 5, 13);
    else arrow(ctx, ep[0], ep[1] - fl - 6, ep[0], ep[1] - 6, '#D32F2F', 5, 13);
    ctx.fillStyle = '#D32F2F'; ctx.beginPath(); ctx.arc(...rot(eff), 8, 0, 7); ctx.fill();
    label(ctx, isFinite(F) ? `施力 ${fmt(F, 1)} kgw` : '施力臂＝0！', ep[0], up ? ep[1] - fl - 14 : ep[1] - fl - 18, { align: 'center', size: 14, bold: true, color: '#D32F2F', bg: 'rgba(255,255,255,.85)' });
    // 力臂標示（水平時）
    if (Math.abs(ang) < 0.01) {
      const br = (u1, u2, y, c, t) => { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px(u1), y - 6); ctx.lineTo(px(u1), y); ctx.lineTo(px(u2), y); ctx.lineTo(px(u2), y - 6); ctx.stroke(); label(ctx, t, (px(u1) + px(u2)) / 2, y + 12, { align: 'center', size: 13, bold: true, color: c }); };
      br(piv, eff, BY + 64, '#D32F2F', `施力臂 ${fmt(e * 100, 0)} cm`);
      br(piv, load, BY + 92, '#1565C0', `抗力臂 ${fmt(l * 100, 0)} cm`);
    } else {
      // 移動距離
      const e0 = [px(eff), BY], e1 = rot(eff), l0 = [px(load), BY], l1 = rot(load);
      label(ctx, `施力端移動 ${fmt(Math.hypot(e1[0] - e0[0], e1[1] - e0[1]) / 6, 1)} cm`, e1[0], e1[1] + 30, { align: 'center', size: 13, bold: true, color: '#D32F2F', bg: '#FFEBEE' });
      label(ctx, `物體移動 ${fmt(Math.hypot(l1[0] - l0[0], l1[1] - l0[1]) / 6, 1)} cm`, l1[0], l1[1] - 60, { align: 'center', size: 13, bold: true, color: '#1565C0', bg: '#E3F2FD' });
    }
    label(ctx, '棒長 100 cm', 740, 20, { align: 'right', size: 12, color: '#90A4AE' });
  }
  function info() {
    const { e, l } = arms(), F = W * l / Math.max(e, 1e-6);
    const kind = Math.abs(e - l) < 0.01 ? '不省力也不費力' : e > l ? '<b style="color:var(--ok)">省力槓桿</b>（省力但費時）' : '<b style="color:var(--bad)">費力槓桿</b>（費力但省時）';
    document.getElementById('c3lvR').innerHTML = `
      <div><span>施力臂</span><b>${fmt(e * 100, 0)} cm</b></div><div><span>抗力臂</span><b>${fmt(l * 100, 0)} cm</b></div>
      <div><span>需要的施力</span><b>${e > 0.005 ? fmt(F, 1) + ' kgw' : '∞'}</b></div>`;
    document.getElementById('c3lvTxt').innerHTML = `這是${kind}。<br>施力 × 施力臂 ＝ ${e > 0.005 ? fmt(F, 1) : '?'} × ${fmt(e * 100, 0)} ＝ 20 × ${fmt(l * 100, 0)} ＝ 抗力 × 抗力臂<br><span class="note">按「▶ 轉動槓桿」，比較施力端和物體各移動多遠：省力的一方，一定要走比較遠。</span>`;
  }
  function pick(e) {
    const p = S.pt(e), d = [['piv', piv], ['eff', eff], ['load', load]].map(([k, u]) => [k, Math.hypot(p.x - px(u), p.y - (BY + (k === 'piv' ? 25 : -10)))]).sort((a, b) => a[1] - b[1])[0];
    return d[1] < 45 ? d[0] : null;
  }
  cv.addEventListener('pointerdown', e => { if (Math.abs(ang) > 0.01) return; drag = pick(e); if (drag) cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    const u = clamp((S.pt(e).x - X0) / LEN, 0, 1);
    if (drag === 'piv') piv = u; else if (drag === 'eff') eff = u; else load = u;
    draw(); info();
  });
  cv.addEventListener('pointerup', () => drag = null);
  $$('#c3lvPre .chip').forEach(c => c.onclick = () => { [piv, eff, load] = c.dataset.p.split(',').map(Number); ang = tAng = 0; draw(); info(); });
  document.getElementById('c3lvGo').onclick = () => { tAng = (eff > piv ? 1 : -1) * 0.12 * (sameSide() ? -1 : 1); };
  document.getElementById('c3lvReset').onclick = () => { tAng = 0; };
  const lp = loop(dt => { if (Math.abs(ang - tAng) > 0.001) { ang += Math.sign(tAng - ang) * Math.min(Math.abs(tAng - ang), dt * 0.3); draw(); } });
  registerSim('t11', { start() { draw(); info(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- 工具分類 ---------- */
(() => {
  const host = document.getElementById('c3sort11'); if (!host) return;
  mountSort(host, ['省力槓桿', '費力槓桿', '不省力也不費力'], [
    ['🔨 羊角鎚拔釘子', 0, '支點是鎚頭碰桌面的地方，手握的把手很長（施力臂長），釘子離支點很近 → 省力。'],
    ['🥢 筷子', 1, '手指施力點靠近支點（虎口），食物在筷子尖端 → 施力臂短 → 費力省時（課本 p.82）。'],
    ['🍾 開瓶器', 0, '支點在瓶蓋頂端，手握的把手長 → 省力。（課本 In my life）'],
    ['🥫 易開罐拉環', 0, '課本例子：施較小的力就能讓抗力點的鐵片向下打開。'],
    ['🔬 鑷子', 1, '支點在尾端、手指捏中間、夾東西在尖端 → 施力臂＜抗力臂 → 費力，但能精準夾小東西。'],
    ['⚖️ 等臂天平', 2, '支點在正中間，兩邊力臂相等 → 不省力也不費力，用來比較質量。'],
    ['🎣 釣竿', 1, '一手握尾端當支點、另一手在中間施力，魚在竿尖 → 費力但竿尖移動很快很遠。'],
    ['🛒 獨輪手推車', 0, '輪子是支點，重物在車斗（靠近輪子），手握把手在最遠處 → 省力。'],
    ['✂️ 裁縫剪刀', 1, '課本例子：刀刃較長，可降低操作次數，費力但省時。'],
    ['📎 大型釘書機', 0, '課本例子：不用花很大的力氣就能裝訂厚書本。'],
  ]);
})();

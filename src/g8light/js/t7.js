/* ===== 分頁 7：生活中的透鏡（眼睛、顯微鏡） ===== */

/* ---------- ① 眼睛模擬器（近軸光線追蹤：經過透鏡時 斜率 u′ = u − y/f） ---------- */
(() => {
  const cv = document.getElementById('l7eye'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const EL = 470, YC = 150, GX = 60, DN = 250, AP = 26;
  const EYES = {
    normal: { nm: '正常眼', L: 170, fr: 170, fmin: 95 },
    myopia: { nm: '近視眼', L: 200, fr: 170, fmin: 95 },
    hyper: { nm: '遠視眼', L: 140, fr: 170, fmin: 95 },
    presby: { nm: '老花眼', L: 170, fr: 170, fmin: 160 },
  };
  let who = 'normal', obj = 'far', glass = 'none';
  function idealFg(E) {
    const ft = obj === 'far' ? E.fr : E.fmin, s = 1 / (1 / ft - 1 / E.L);
    if (!(s > 0)) return null;
    const u = obj === 'far' ? Infinity : DN - GX;
    const inv = (u === Infinity ? 0 : 1 / u) - 1 / (s - GX);
    return 1 / inv;
  }
  function compute() {
    const E = EYES[who];
    let fg = null;
    if (glass !== 'none') {
      const ideal = idealFg(E);
      const need = ideal != null && isFinite(ideal) && Math.abs(ideal) < 2000;   // 太弱（或無限大）＝其實不需要眼鏡
      const right = need && ((glass === 'cave' && ideal < 0) || (glass === 'vex' && ideal > 0));
      fg = right ? ideal : (glass === 'cave' ? -600 : 600);
    }
    // 光線：遠方 → 平行；近處 → 從 (EL-DN, YC) 發出
    const hs = [-1, -0.5, 0, 0.5, 1];
    const rays = hs.map(k => {
      let x0 = 20, y = k * AP, u = 0, pts = [];
      if (obj === 'near') { x0 = EL - DN; u = (k * AP) / (DN); y = 0; }
      pts.push({ x: x0, y });
      if (fg != null) { y = y + u * (EL - GX - x0); pts.push({ x: EL - GX, y }); u = u - y / fg; x0 = EL - GX; }
      y = y + u * (EL - x0); pts.push({ x: EL, y });
      return { pts, y, u };
    });
    // 眼睛需要的焦距
    const r = rays[4]; const s = Math.abs(r.u) < 1e-9 ? Infinity : r.y / r.u;   // 進入眼睛前的光好像從距離 s 的點發出
    const need = 1 / ((s === Infinity ? 0 : 1 / s) + 1 / E.L);
    const fe = clamp(need, E.fmin, E.fr);
    const img = 1 / (1 / fe - (s === Infinity ? 0 : 1 / s));   // 成像位置（鏡後距離）
    rays.forEach(rr => { const u2 = rr.u - rr.y / fe; rr.pts.push({ x: EL + E.L, y: rr.y + u2 * E.L }); rr.u2 = u2; });
    const blur = Math.abs(img - E.L) / Math.abs(img) * AP;
    return { E, fg, fe, img, blur, rays };
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#F7F9FC'; ctx.fillRect(0, 0, S.W, S.H);
    const R = compute(), E = R.E;
    // 眼球
    ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = '#90A4AE'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(EL + E.L / 2 + 4, YC, E.L / 2 + 14, 100, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#E57373'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(EL + E.L / 2 + 4, YC, E.L / 2 + 10, 96, 0, -0.9, 0.9); ctx.stroke();
    label(ctx, '視網膜', EL + E.L + 10, YC + 112, { size: 12, color: '#C62828', bold: true });
    // 水晶體（愈厚焦距愈短）
    const th = 8 + (170 - R.fe) * 0.18;
    ctx.fillStyle = 'rgba(100,181,246,.55)'; ctx.strokeStyle = '#1976D2'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(EL, YC, th, 46, 0, 0, 7); ctx.fill(); ctx.stroke();
    label(ctx, '水晶體', EL, YC + 62, { align: 'center', size: 12, color: '#1565C0', bold: true });
    // 眼鏡
    if (R.fg != null) { drawLens(ctx, EL - GX, YC, 50, R.fg > 0, 'rgba(255,202,40,.4)'); label(ctx, R.fg > 0 ? '凸透鏡' : '凹透鏡', EL - GX, YC - 62, { align: 'center', size: 12, bold: true, color: '#E65100' }); }
    // 物體
    if (obj === 'near') { ctx.font = '24px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('📖', EL - DN, YC); label(ctx, '課本（25 cm）', EL - DN, YC + 26, { align: 'center', size: 12 }); }
    else label(ctx, '遠方的光（平行光）→', 20, YC - 50, { size: 12, bold: true, color: '#E65100' });
    // 光線
    R.rays.forEach(rr => { ctx.strokeStyle = '#FB8C00'; ctx.lineWidth = 1.8; ctx.beginPath(); rr.pts.forEach((p, i) => { const y = YC - p.y; i ? ctx.lineTo(p.x, y) : ctx.moveTo(p.x, y); }); ctx.stroke(); });
    // 成像點
    if (Math.abs(R.img) < 600) { const fx = EL + R.img; ctx.fillStyle = '#D32F2F'; ctx.beginPath(); ctx.arc(fx, YC, 5, 0, 7); ctx.fill(); label(ctx, '成像點', fx, YC + 16, { align: 'center', size: 11, color: '#D32F2F', bold: true }); }
    // 視網膜上看到的 E
    const bx = 690, by = 46;
    ctx.fillStyle = '#FFF'; ctx.strokeStyle = '#999'; ctx.lineWidth = 1; ctx.fillRect(bx - 50, by - 36, 100, 72); ctx.strokeRect(bx - 50, by - 36, 100, 72);
    const b = Math.min(10, R.blur);
    ctx.save(); ctx.font = 'bold 44px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const n = b < 0.6 ? 1 : 14;
    for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2; ctx.globalAlpha = n === 1 ? 1 : 0.13; ctx.fillStyle = '#111'; ctx.fillText('E', bx + Math.cos(a) * b, by + Math.sin(a) * b); }
    ctx.restore();
    label(ctx, '看到的樣子', bx, by + 48, { align: 'center', size: 11 });
    info(R);
  }
  function info(R) {
    const pos = Math.abs(R.img - R.E.L) < 4 ? '視網膜上 ✅' : R.img < R.E.L ? '視網膜之前' : '視網膜之後';
    document.getElementById('l7R').innerHTML = `<div><span>眼睛</span><b>${R.E.nm}</b></div><div><span>成像位置</span><b>${pos}</b></div><div><span>看得清楚嗎？</span><b>${R.blur < 1 ? '清楚' : R.blur < 4 ? '有點模糊' : '很模糊'}</b></div>`;
    const T = document.getElementById('l7txt'), w = who, o = obj, g = glass;
    let s = '';
    if (w === 'normal') s = o === 'far' ? '正常眼看遠方：不戴眼鏡時，水晶體放鬆，平行光剛好成像在<b>視網膜上</b>。' : '正常眼看近處：睫狀肌讓水晶體<b>變厚</b>（焦距變短），像仍然落在視網膜上——這叫<b>調節</b>。';
    if (w === 'myopia') s = o === 'far' ? (g === 'cave' ? '戴上<b>凹透鏡</b>：光先稍微發散，成像位置往後移到<b>視網膜上</b>，看清楚了！' : '近視眼看遠方：眼球較長，光線成像在<b>視網膜之前</b>，看不清楚。') : '近視眼看近處其實很清楚（所以叫「近」視）。';
    if (w === 'hyper') s = o === 'near' ? (g === 'vex' ? '戴上<b>凸透鏡</b>：光先會聚一些，成像往前移到<b>視網膜上</b>，看清楚了！' : '遠視眼看近處：眼球較短，水晶體再怎麼調節，成像仍在<b>視網膜之後</b>，看不清楚。') : '遠視眼看遠方：水晶體稍微用力調節就能看清楚（但容易累）。';
    if (w === 'presby') s = o === 'near' ? (g === 'vex' ? '戴上<b>凸透鏡（老花眼鏡）</b>，看近處清楚了！' : '老花眼：水晶體變硬，看近處時無法變厚，成像在<b>視網膜之後</b>。') : '老花眼看遠方沒問題。';
    if (g !== 'none') {
      const fit = (w === 'myopia' && o === 'far' && g === 'cave') || ((w === 'hyper' || w === 'presby') && o === 'near' && g === 'vex');
      if (w === 'myopia' && o === 'near' && g === 'cave') s += '<br>近視的人戴著眼鏡看書也看得清楚：凹透鏡讓光稍微發散，水晶體多用一點力調節就好。';
      else if (!fit) s += R.blur < 1 ? `<br>⚠️ 這個情況其實<b>不需要</b>這副${g === 'cave' ? '凹' : '凸'}透鏡：年輕的眼睛靠水晶體拚命調節，勉強還看得清楚，但很吃力、容易疲勞。` : `<br>⚠️ 戴錯眼鏡：${g === 'cave' ? '凹透鏡讓光更發散' : '凸透鏡讓光更會聚'}，水晶體調節不過來，<b>反而看不清楚</b>。`;
    }
    T.innerHTML = s;
  }
  const bind = (id, set) => $$('#' + id + ' .chip').forEach(c => c.onclick = () => { set(c); $$('#' + id + ' .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  bind('l7who', c => who = c.dataset.k); bind('l7obj', c => obj = c.dataset.k); bind('l7glass', c => glass = c.dataset.g);
  registerSim('t7', { start: draw, resize: draw });
})();

/* ---------- ② 顯微鏡 ---------- */
(() => {
  const cv = document.getElementById('l7mic'); if (!cv) return;
  const S = stage(cv, 760, 260), ctx = S.ctx;
  let ob = 4, ey = 10;
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    // 鏡筒示意（橫放）
    ctx.fillStyle = '#ECEFF1'; ctx.fillRect(60, 90, 360, 80);
    const YC = 130;
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(20, YC); ctx.lineTo(470, YC); ctx.stroke(); ctx.setLineDash([]);
    drawLens(ctx, 120, YC, 36); drawLens(ctx, 380, YC, 36);
    label(ctx, '物鏡 ' + ob + '×', 120, 74, { align: 'center', size: 12, bold: true }); label(ctx, '目鏡 ' + ey + '×', 380, 74, { align: 'center', size: 12, bold: true });
    drawArrowObj(ctx, 70, YC, 14, '#2E7D32', false, 3); label(ctx, '標本', 70, YC + 18, { align: 'center', size: 11 });
    drawArrowObj(ctx, 300, YC, -38, '#6A1B9A', false, 3); label(ctx, '第一次：倒立放大實像', 300, YC + 52, { align: 'center', size: 11, color: '#6A1B9A' });
    ctx.font = '24px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('👁️', 440, YC);
    label(ctx, '第二次：目鏡當放大鏡 → 放大虛像', 250, 205, { align: 'center', size: 12, bold: true, color: '#1565C0' });
    // 視野
    const VX = 620, VY = 130, VR = 95, mag = ob * ey;
    ctx.fillStyle = '#FFFDE7'; ctx.beginPath(); ctx.arc(VX, VY, VR, 0, 7); ctx.fill(); ctx.strokeStyle = '#333'; ctx.lineWidth = 3; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.arc(VX, VY, VR - 2, 0, 7); ctx.clip();
    letterF(ctx, VX, VY, Math.min(600, mag * 1.1), '#5D4037', true, true);
    ctx.restore();
    label(ctx, '視野中看到的「F」（玻片上正放）', VX, 245, { align: 'center', size: 12 });
    document.getElementById('l7mTxt').innerHTML = `總放大倍率 ＝ 物鏡 × 目鏡 ＝ ${ob} × ${ey} ＝ <b>${mag} 倍</b>。<br>視野中的像和玻片上的標本<b>上下顛倒、左右相反</b>（課本圖 4-21）；倍率愈大，看到的範圍愈小。`;
  }
  $$('#l7ob .chip').forEach(c => c.onclick = () => { ob = +c.dataset.m; $$('#l7ob .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  $$('#l7ey .chip').forEach(c => c.onclick = () => { ey = +c.dataset.m; $$('#l7ey .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  registerSim('t7', { start: draw, resize: draw });
})();

/* ---------- ③ 「看光學台」按鈕 ---------- */
$$('#p-t7 [data-go]').forEach(b => b.onclick = () => {
  showTab('t6');
  setTimeout(() => { $(`#l6pre [data-p="${b.dataset.go}"]`)?.click(); document.getElementById('l6bench')?.scrollIntoView({ behavior: 'smooth' }); }, 200);
});

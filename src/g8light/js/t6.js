/* ===== 分頁 6：透鏡成像 ===== */

/* ---------- ① 三稜鏡組合 → 透鏡 ---------- */
(() => {
  const cv = document.getElementById('l6prism'); if (!cv) return;
  const S = stage(cv, 760, 280), ctx = S.ctx;
  const F = bindRange('l6pf', v => v + ' px', () => draw());
  let kind = 'p+';
  const LX = 330, YC = 140, HS = [-100, -70, -40, -15, 15, 40, 70, 100];
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#0E1621'; ctx.fillRect(0, 0, S.W, S.H);
    ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(10, YC); ctx.lineTo(750, YC); ctx.stroke(); ctx.setLineDash([]);
    const f = +F.value, conv = kind.endsWith('+');
    if (kind[0] === 'p') {
      ctx.fillStyle = 'rgba(129,212,250,.35)'; ctx.strokeStyle = '#81D4FA';
      [-1, 1].forEach(s => { ctx.beginPath();
        if (conv) { ctx.moveTo(LX - 32, YC + s * 4); ctx.lineTo(LX + 32, YC + s * 4); ctx.lineTo(LX, YC + s * 120); }
        else { ctx.moveTo(LX - 32, YC + s * 120); ctx.lineTo(LX + 32, YC + s * 120); ctx.lineTo(LX, YC + s * 6); }
        ctx.closePath(); ctx.fill(); ctx.stroke(); });
    } else drawLens(ctx, LX, YC, 125, conv, 'rgba(129,212,250,.35)');
    HS.forEach((h, i) => {
      const y = YC + h, c = wl2rgb(620 - i * 6);
      ray(ctx, 20, y, LX, y, c, 2, 0.5);
      let slope;
      if (kind === 'p+') slope = -Math.sign(h) * 0.33; else if (kind === 'p-') slope = Math.sign(h) * 0.33;
      else if (kind === 'l+') slope = -h / f; else slope = h / f;
      ray(ctx, LX, y, 750, y + slope * (750 - LX), c, 2, 0.4);
      if (kind === 'l-') extLine(ctx, LX, y, LX - f, YC, c, 1);
    });
    if (kind[0] === 'l') {
      const fx = conv ? LX + f : LX - f;
      ctx.fillStyle = '#FF5252'; ctx.beginPath(); ctx.arc(fx, YC, 6, 0, 7); ctx.fill();
      label(ctx, conv ? '焦點（鏡後）' : '焦點（鏡前，延長線交會）', fx, YC + 22, { align: 'center', size: 12, bold: true, color: '#FF8A80' });
      dim(ctx, LX, YC + 60, fx, YC + 60, '焦距', '#FFD54F', 'bottom');
      label(ctx, '鏡心', LX, YC + 140 - 8, { align: 'center', size: 12, color: '#B3E5FC' });
    }
    const T = document.getElementById('l6pTxt');
    T.innerHTML = {
      'p+': '平行光通過<b>厚端相對</b>的三稜鏡：光都往三稜鏡的厚端（中間）偏折，<b>會聚</b>起來——但沒有聚在同一點。',
      'l+': '把三稜鏡「磨圓」成<b>凸透鏡</b>：愈邊緣的光偏折愈多，平行光就<b>會聚於一點——焦點</b>。焦點到鏡心的距離叫<b>焦距</b>。透鏡愈厚（愈彎），焦距愈短。',
      'p-': '平行光通過<b>尖端相對</b>的三稜鏡：光往外側（厚端）偏折，<b>發散</b>開來。',
      'l-': '<b>凹透鏡</b>使平行光<b>發散</b>；折射光往反方向延長（虛線），會在透鏡前方交於一點，也是<b>焦點</b>。',
    }[kind];
  }
  $$('#l6pK .chip').forEach(c => c.onclick = () => { kind = c.dataset.k; $$('#l6pK .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  registerSim('t6', { start: draw, resize: draw });
})();

/* ---------- ② 光學台 ---------- */
(() => {
  const cv = document.getElementById('l6bench'); if (!cv) return;
  const S = stage(cv, 760, 340), ctx = S.ctx;
  const LX = 400, YC = 200, PX = 8, H = 6, LH = 115;   // 1 cm = 8 px、燭高 6 cm
  let lens = 'vex', sun = false, show = [true, true, true], half = false, drag = false;
  const FF = bindRange('l6f', v => v + ' cm', () => draw());
  const P = bindRange('l6p', v => fmt(v, 1) + ' cm', () => { sun = false; draw(); });
  const f = () => lens === 'vex' ? +FF.value : -FF.value;
  function zone() {
    if (lens === 'cave') return 'cave'; if (sun) return 'inf';
    const p = +P.value, F = +FF.value;
    if (Math.abs(p - 2 * F) <= 0.3) return 'at2'; if (p > 2 * F) return 'out2';
    if (Math.abs(p - F) <= 0.3) return 'atf'; if (p > F) return 'mid'; return 'in';
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#FAFAF7'; ctx.fillRect(0, 0, S.W, S.H);
    // 光學台與刻度
    ctx.fillStyle = '#90A4AE'; ctx.fillRect(10, YC + LH + 8, 740, 8);
    ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(10, YC); ctx.lineTo(750, YC); ctx.stroke(); ctx.setLineDash([]);
    const F = +FF.value;
    [[-2, '2F'], [-1, 'F'], [1, 'F'], [2, '2F']].forEach(([k, n]) => { const x = LX + k * F * PX; ctx.fillStyle = '#C62828'; ctx.beginPath(); ctx.arc(x, YC, 4, 0, 7); ctx.fill(); label(ctx, n, x, YC + 16, { align: 'center', size: 12, bold: true, color: '#C62828' }); });
    drawLens(ctx, LX, YC, LH, lens === 'vex');
    if (half) { ctx.fillStyle = '#212121'; ctx.fillRect(LX - 10, YC, 20, LH + 4); label(ctx, '黑紙', LX + 14, YC + 60, { size: 12, bold: true }); }
    const zn = zone();
    if (zn === 'inf') {   // 太陽光：平行光
      [-80, -50, -20, 20, 50, 80].forEach(h => { ray(ctx, 20, YC + h, LX, YC + h, '#FFB300', 2); ray(ctx, LX, YC + h, LX + 2 * F * PX, YC + h - 2 * h, '#FFB300', 2, 0.3); });
      ctx.fillStyle = '#FFEB3B'; ctx.shadowColor = '#FF9800'; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(LX + F * PX, YC, 6, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = '#ECEFF1'; ctx.fillRect(LX + F * PX + 2, YC - 80, 8, 160);
      dim(ctx, LX, YC + 100, LX + F * PX, YC + 100, '焦距 f ＝ ' + F + ' cm', '#E65100', 'bottom');
      label(ctx, '☀️ 太陽光（遠方的平行光）', 20, 24, { size: 14, bold: true });
      info(zn, null); return;
    }
    const p = +P.value, fv = f(), q = 1 / (1 / fv - 1 / p), m = -q / p;
    const x0 = LX - p * PX, y0 = YC - H * PX;
    candle(ctx, x0, YC, H * PX * 1.05);
    const atF = zn === 'atf', xi = LX + q * PX, yi = YC - m * H * PX;
    const C = ['#E53935', '#1E88E5', '#43A047'];
    const out = (x, y, sx, sy) => { const t = sx > 0 ? (760 - x) / sx : 400; return { x: x + sx * t, y: y + sy * t }; };
    const blocked = y => half && y > YC + 1;
    // ① 平行主軸
    if (show[0] && !blocked(y0)) {
      ray(ctx, x0, y0, LX, y0, C[0], 2.4);
      const tx = LX + fv * PX, d = { x: (tx - LX) * Math.sign(fv), y: (YC - y0) * Math.sign(fv) };
      if (lens === 'vex') { const e = out(LX, y0, d.x, d.y); ray(ctx, LX, y0, e.x, e.y, C[0], 2.4, 0.3); if (q < 0) extLine(ctx, LX, y0, xi, yi, C[0]); }
      else { const fx = LX + fv * PX, dx = LX - fx, dy = y0 - YC, e = out(LX, y0, dx, dy); ray(ctx, LX, y0, e.x, e.y, C[0], 2.4, 0.3); extLine(ctx, LX, y0, fx, YC, C[0]); }
    }
    // ② 射向鏡心
    if (show[1] && !blocked(YC)) {
      const dx = LX - x0, dy = YC - y0, e = out(LX, YC, dx, dy);
      ray(ctx, x0, y0, LX, YC, C[1], 2.4); ray(ctx, LX, YC, e.x, e.y, C[1], 2.4, 0.3);
      if (q < 0) extLine(ctx, LX, YC, xi, yi, C[1]);
    }
    // ③ 經過焦點
    if (show[2] && !atF) {
      const fx = lens === 'vex' ? LX - fv * PX : LX - fv * PX;   // 凸：同側焦點；凹：另一側焦點（fv<0 → LX+|f|）
      const y3 = y0 + (YC - y0) * (LX - x0) / (fx - x0);
      if (Math.abs(y3 - YC) >= LH) label(ctx, '③ 這條光打不到透鏡（物太靠近焦點），改看 ①②', 400, 50, { align: 'center', size: 12, color: '#2E7D32', bg: 'rgba(255,255,255,.9)' });
      if (Math.abs(y3 - YC) < LH && !blocked(y3)) {
        ray(ctx, x0, y0, LX, y3, C[2], 2.4);
        if (lens === 'cave' || p < Math.abs(fv)) extLine(ctx, x0, y0, fx, YC, C[2], 1.2);
        ray(ctx, LX, y3, 755, y3, C[2], 2.4, 0.3);
        if (q < 0) extLine(ctx, LX, y3, xi, y3, C[2]);
      }
    }
    // 遮半邊：補畫一束從燭火頂端穿過上半部的光
    if (half && q > 0) [-100, -70, -40, -15].forEach(h => { const yl = YC + h; ray(ctx, x0, y0, LX, yl, 'rgba(255,152,0,.7)', 1.4); const d = { x: xi - LX, y: yi - yl }; const e = out(LX, yl, d.x, d.y); ray(ctx, LX, yl, e.x, e.y, 'rgba(255,152,0,.7)', 1.4, 0.3); });
    // 像
    if (!atF) {
      const onScr = xi > 20 && xi < 745 && Math.abs(m * H * PX) < 170;
      if (q > 0 && onScr) { ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = '#BDBDBD'; ctx.fillRect(xi + 4, YC - 150, 10, 300); ctx.strokeRect(xi + 4, YC - 150, 10, 300); label(ctx, '屏幕', xi + 18, YC - 140, { size: 12, bold: true }); }
      if (onScr) { candle(ctx, xi, YC, m * H * PX * 1.05, half ? 0.45 : (q < 0 ? 0.55 : 0.95), q < 0); label(ctx, q > 0 ? '實像' : '虛像（透過透鏡才看得到）', xi, m < 0 ? YC - 22 : YC + 36, { align: 'center', size: 12, bold: true, color: q > 0 ? '#2E7D32' : '#6A1B9A', bg: 'rgba(255,255,255,.85)' }); }
      else label(ctx, q > 0 ? '像在很遠的右邊（畫面外）→' : '← 像在很遠的左邊（畫面外）', q > 0 ? 740 : 20, 24, { align: q > 0 ? 'right' : 'left', size: 13, bold: true, color: '#6A1B9A' });
    } else label(ctx, '折射光互相平行，永遠不會交會：無法成像', 400, 24, { align: 'center', size: 14, bold: true, color: '#C62828', bg: '#FFEBEE' });
    label(ctx, '← 拖動蠟燭 →', x0, YC + 26, { align: 'center', size: 11, color: '#666' });
    info(zn, { p, q, m });
  }
  function info(zn, r) {
    $$('#l6table tr[data-z]').forEach(tr => tr.style.background = tr.dataset.z === zn ? '#FFF59D' : '');
    const R = document.getElementById('l6R'), T = document.getElementById('l6txt');
    if (!r) { R.innerHTML = `<div><span>焦距 f</span><b>${FF.value} cm</b></div>`; T.innerHTML = '<b>步驟 1、2：</b>讓凸透鏡對準太陽光，調整白紙到光聚成<b>最小、最亮</b>的一點，量出透鏡中心到亮點的距離——就是<b>焦距 f</b>。（⚠️ 請勿久視亮點）'; return; }
    const { p, q, m } = r, real = q > 0;
    R.innerHTML = zn === 'atf' ? `<div><span>物距</span><b>${fmt(p, 1)} cm（＝f）</b></div><div><span>成像</span><b>無法成像</b></div>` :
      `<div><span>物距 p</span><b>${fmt(p, 1)} cm</b></div><div><span>像距</span><b>${Math.abs(q) > 500 ? '非常遠' : fmt(Math.abs(q), 1) + ' cm（' + (real ? '鏡後' : '鏡前') + '）'}</b></div>
       <div><span>像的性質</span><b>${real ? '實像' : '虛像'}、${m < 0 ? '倒立' : '正立'}、${Math.abs(Math.abs(m) - 1) < 0.04 ? '相等' : Math.abs(m) > 1 ? '放大' : '縮小'}</b></div><div><span>放大率</span><b>${fmt(Math.abs(m), 2)} 倍</b></div>`;
    T.innerHTML = {
      out2: '燭火在 <b>2 倍焦距外</b>：屏幕上成<b>倒立縮小的實像</b>，位置在鏡後 f～2f 之間。燭火愈靠近透鏡，像愈大、像距愈遠。📷 照相機、眼睛',
      at2: '燭火<b>恰在 2 倍焦距</b>：成<b>倒立、等大</b>的實像，像也恰在鏡後 2 倍焦距上。',
      mid: '燭火在 <b>f～2f 之間</b>：成<b>倒立放大的實像</b>，像在鏡後 2 倍焦距外。📽 投影機、幻燈機',
      atf: '燭火<b>在焦點上</b>：折射光變成平行光，屏幕上無法成像，透過透鏡也看不到像。',
      in: '燭火在 <b>焦點內</b>：屏幕上接不到像；眼睛透過透鏡另一側觀察，看到<b>正立放大的虛像</b>（延長線交會）。愈靠近焦點，像愈大。🔍 放大鏡',
      cave: '<b>凹透鏡</b>：不論燭火在哪裡，屏幕上都無法成像；透過透鏡看到<b>正立縮小的虛像</b>，物體愈遠，像愈小。👓 近視眼鏡',
    }[zn] + (half ? '<br>🖐 遮住下半部：像仍然<b>完整</b>，只是<b>變暗</b>——燭火每一點的光都還能從上半部通過。' : '');
  }
  const mv = e => { if (!drag) return; const p = S.pt(e); P.value = clamp((LX - p.x) / PX, 2, 45); sun = false; P.dispatchEvent(new Event('input')); };
  cv.addEventListener('pointerdown', e => { const p = S.pt(e); if (p.x < LX - 10) { drag = true; cv.setPointerCapture(e.pointerId); mv(e); } });
  cv.addEventListener('pointermove', mv); cv.addEventListener('pointerup', () => drag = false);
  $$('#l6lens .chip').forEach(c => c.onclick = () => { lens = c.dataset.k; $$('#l6lens .chip').forEach(x => x.classList.toggle('on', x === c)); sun = false; draw(); });
  $$('#l6rays .chip').forEach(c => c.onclick = () => {
    if (c.dataset.r === 'half') { half = !half; c.classList.toggle('on', half); } else { const i = +c.dataset.r; show[i] = !show[i]; c.classList.toggle('on', show[i]); }
    draw();
  });
  $$('#l6pre .chip').forEach(c => c.onclick = () => {
    const F = +FF.value, k = c.dataset.p;
    if (k === 'sun') { sun = true; lens = 'vex'; $$('#l6lens .chip').forEach(x => x.classList.toggle('on', x.dataset.k === 'vex')); draw(); return; }
    lens = 'vex'; $$('#l6lens .chip').forEach(x => x.classList.toggle('on', x.dataset.k === 'vex'));
    P.value = { cam: 3.5 * F, eq: 2 * F, proj: 1.5 * F, f: F, mag: 0.6 * F }[k]; sun = false; P.dispatchEvent(new Event('input'));
  });
  registerSim('t6', { start: draw, resize: draw });
})();

/* ---------- ③ 透鏡種類、例題按鈕 ---------- */
(() => {
  const host = document.getElementById('l6kinds');
  if (host) mountSort(host, ['凸透鏡（會聚）', '凹透鏡（發散）'], [
    ['雙凸透鏡：兩面都往外凸', 0, '中央厚、邊緣薄 → 凸透鏡。'],
    ['平凸透鏡：一面平、一面凸', 0, '中央仍然比邊緣厚 → 凸透鏡。'],
    ['凹凸透鏡：一面凹、一面凸，中央比邊緣厚', 0, '判斷看「中央厚還是邊緣厚」：中央厚 → 凸透鏡（老花眼鏡常見）。'],
    ['雙凹透鏡：兩面都往內凹', 1, '中央薄、邊緣厚 → 凹透鏡。'],
    ['平凹透鏡：一面平、一面凹', 1, '中央薄 → 凹透鏡。'],
    ['凸凹透鏡：一面凸、一面凹，中央比邊緣薄', 1, '中央薄 → 凹透鏡（近視眼鏡常見）。'],
  ]);
  $$('#p-t6 [data-pre]').forEach(b => b.onclick = () => { $(`#l6pre [data-p="${b.dataset.pre}"]`)?.click(); document.getElementById('l6bench')?.scrollIntoView({ behavior: 'smooth' }); });
})();

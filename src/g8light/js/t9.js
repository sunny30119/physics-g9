/* ===== 分頁 9：顏色的成因 ===== */
const COLNAME = ([r, g, b]) => {
  const on = v => v > 0.35, k = (on(r) ? 'R' : '') + (on(g) ? 'G' : '') + (on(b) ? 'B' : '');
  return { R: '紅', G: '綠', B: '藍', RG: '黃', GB: '青', RB: '洋紅', RGB: '白', '': '黑' }[k];
};
const rgbStr = ([r, g, b]) => `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
const mul = (a, b) => a.map((v, i) => v * b[i]);

/* ---------- ① 玻璃紙濾光 ---------- */
(() => {
  const cv = document.getElementById('l9filter'); if (!cv) return;
  const S = stage(cv, 760, 200), ctx = S.ctx;
  const F = { none: ['不放', [1, 1, 1]], R: ['紅', [1, 0, 0]], G: ['綠', [0, 1, 0]], B: ['藍', [0, 0, 1]], Y: ['黃', [1, 1, 0]], C: ['青', [0, 1, 1]], M: ['洋紅', [1, 0, 1]] };
  let f1 = 'R', f2 = 'none';
  const mk = (id, get, set) => { const h = document.getElementById(id); h.innerHTML = Object.entries(F).map(([k, [n]]) => `<button class="chip ${k === get() ? 'on' : ''}" data-k="${k}">${n}</button>`).join(''); $$('.chip', h).forEach(c => c.onclick = () => { set(c.dataset.k); $$('.chip', h).forEach(x => x.classList.toggle('on', x === c)); draw(); }); };
  function beam(x1, x2, col) { const L = Math.max(...col); const g = ctx.createLinearGradient(0, 70, 0, 130); ctx.fillStyle = L < 0.05 ? 'rgba(0,0,0,0)' : rgbStr(col); ctx.globalAlpha = 0.85; ctx.fillRect(x1, 85, x2 - x1, 30); ctx.globalAlpha = 1; }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#1B1B1B'; ctx.fillRect(0, 0, S.W, S.H);
    const w = [1, 1, 1], a = mul(w, F[f1][1]), b = mul(a, F[f2][1]);
    ctx.font = '30px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🔦', 40, 100);
    beam(60, 260, w); beam(272, 470, a); beam(482, 700, b);
    [[266, f1], [476, f2]].forEach(([x, k]) => { if (k === 'none') return; ctx.fillStyle = rgbStr(F[k][1].map(v => 0.25 + 0.6 * v)); ctx.globalAlpha = 0.8; ctx.fillRect(x - 6, 50, 12, 100); ctx.globalAlpha = 1; label(ctx, F[k][0] + '色玻璃紙', x, 40, { align: 'center', size: 12, color: '#fff', bold: true }); });
    ctx.fillStyle = '#EEE'; ctx.fillRect(704, 20, 16, 160);
    const spot = Math.max(...b) < 0.05 ? [0.05, 0.05, 0.05] : b;
    ctx.fillStyle = rgbStr(spot); ctx.beginPath(); ctx.ellipse(712, 100, 10, 26, 0, 0, 7); ctx.fill();
    label(ctx, '白光', 160, 140, { align: 'center', size: 13, color: '#fff' });
    label(ctx, COLNAME(a) + '光', 370, 140, { align: 'center', size: 13, color: '#fff' });
    label(ctx, Math.max(...b) < 0.05 ? '沒有光（黑）' : COLNAME(b) + '光', 590, 140, { align: 'center', size: 13, color: '#fff' });
    const T = document.getElementById('l9fTxt');
    if (Math.max(...b) < 0.05) T.innerHTML = '兩張玻璃紙沒有「共同」能通過的色光：第一張留下的光，全被第二張吸收了——<b>一片黑</b>！玻璃紙不是加上顏色，而是<b>吸收</b>其他顏色。';
    else T.innerHTML = `白光通過${f1 === 'none' ? '' : F[f1][0] + '色玻璃紙'}${f2 === 'none' ? '' : '和' + F[f2][0] + '色玻璃紙'}後，只剩下 <b>${COLNAME(b)}光</b>。玻璃紙只讓「和自己同色」的色光穿透，其他色光被吸收。`;
  }
  mk('l9f1', () => f1, v => f1 = v); mk('l9f2', () => f2, v => f2 = v);
  registerSim('t9', { start: draw, resize: draw });
})();

/* ---------- ② 暗箱與色紙 ---------- */
(() => {
  const cv = document.getElementById('l9box'); if (!cv) return;
  const S = stage(cv, 760, 230), ctx = S.ctx;
  const PAPER = [['紅紙', [0.92, 0.06, 0.06]], ['藍紙', [0.06, 0.12, 0.92]], ['綠紙', [0.08, 0.86, 0.1]], ['黑紙', [0.05, 0.05, 0.05]], ['白紙', [0.96, 0.96, 0.96]]];
  let light = [1, 1, 1];
  const rec = {};
  const LNAME = l => ({ '1,1,1': '白光', '1,0,0': '紅光', '0,1,0': '綠光', '0,0,1': '藍光', '1,1,0': '黃光', '0,1,1': '青光' })[l.join(',')];
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = '#0D0D0D'; ctx.fillRect(0, 0, S.W, S.H);
    const lc = rgbStr(light.map(v => v * 0.9));
    const g = ctx.createRadialGradient(380, -40, 10, 380, -40, 420); g.addColorStop(0, lc); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = 0.35; ctx.fillStyle = g; ctx.fillRect(0, 0, S.W, S.H); ctx.globalAlpha = 1;
    PAPER.forEach(([n, r], i) => {
      const c = mul(light, r), x = 40 + i * 100;
      ctx.fillStyle = rgbStr(c); ctx.fillRect(x, 60, 80, 100); ctx.strokeStyle = '#333'; ctx.strokeRect(x, 60, 80, 100);
      label(ctx, n, x + 40, 178, { align: 'center', size: 13, color: '#ddd' });
      label(ctx, '看起來：' + COLNAME(c), x + 40, 200, { align: 'center', size: 12, bold: true, color: '#fff' });
    });
    // 香蕉、蘋果
    const ban = mul(light, [0.95, 0.85, 0.08]), app = mul(light, [0.9, 0.08, 0.06]), leaf = mul(light, [0.1, 0.8, 0.1]);
    ctx.save(); ctx.translate(590, 110); ctx.rotate(-0.4); ctx.fillStyle = rgbStr(ban); ctx.beginPath(); ctx.ellipse(0, 0, 50, 16, 0, 0, 7); ctx.fill(); ctx.restore();
    label(ctx, '香蕉：' + COLNAME(ban), 590, 178, { align: 'center', size: 12, bold: true, color: '#fff' });
    ctx.fillStyle = rgbStr(app); ctx.beginPath(); ctx.arc(700, 115, 28, 0, 7); ctx.fill();
    ctx.fillStyle = rgbStr(leaf); ctx.beginPath(); ctx.ellipse(712, 80, 14, 7, -0.5, 0, 7); ctx.fill();
    label(ctx, '蘋果：' + COLNAME(app), 700, 178, { align: 'center', size: 12, bold: true, color: '#fff' }); label(ctx, '葉：' + COLNAME(leaf), 700, 200, { align: 'center', size: 12, bold: true, color: '#fff' });
    label(ctx, '光源：' + LNAME(light), 14, 22, { size: 14, bold: true, color: rgbStr(light.map(v => 0.4 + 0.6 * v)) });
    const T = document.getElementById('l9bTxt');
    const one = light.filter(v => v > 0).length === 1;
    T.innerHTML = light.join() === '1,1,1' ? '白光下，每張色紙都呈現自己的顏色：紅紙反射紅光、藍紙反射藍光……白紙反射全部，黑紙全部吸收。'
      : one ? `在${LNAME(light)}下：和光同色的紙、以及白紙，呈現${COLNAME(light)}色；其他色紙沒有光可以反射，看起來是<b>黑色</b>。`
      : `${LNAME(light)}裡同時有兩種色光。規則：<b>每張紙只反射自己那一色</b>，光源裡有那種色光，紙才呈現那個顏色；白紙兩種都反射，呈現${COLNAME(light)}色；光源裡沒有的顏色的紙，看起來是黑色。<br>先預測每張紙的顏色，再看上面的暗箱對答案。`;
  }
  function table() {
    const tb = document.getElementById('l9table');
    $$('tr.rec', tb).forEach(r => r.remove());
    [['白光', [1, 1, 1]], ['紅光', [1, 0, 0]], ['藍光', [0, 0, 1]], ['綠光', [0, 1, 0]]].forEach(([n, l]) => {
      const tr = document.createElement('tr'); tr.className = 'rec';
      tr.innerHTML = `<th>${n}</th>` + [0, 1, 2, 3, 4].map(i => { const c = mul(l, PAPER[i][1]), k = n + i; return rec[k] ? `<td><span style="display:inline-block;width:14px;height:14px;border:1px solid #999;background:${rgbStr(c)};vertical-align:middle"></span> ${COLNAME(c)}</td>` : '<td style="color:#bbb">？</td>'; }).join('');
      tb.appendChild(tr);
    });
  }
  const record = () => { const n = LNAME(light); if (['白光', '紅光', '藍光', '綠光'].includes(n)) [0, 1, 2, 3, 4].forEach(i => rec[n + i] = true); table(); };
  $$('#l9light .chip').forEach(c => c.onclick = () => { light = c.dataset.l.split(',').map(Number); $$('#l9light .chip').forEach(x => x.classList.toggle('on', x === c)); record(); draw(); });
  document.getElementById('l9fill').onclick = () => { ['白光', '紅光', '藍光', '綠光'].forEach(n => [0, 1, 2, 3, 4].forEach(i => rec[n + i] = true)); table(); };
  document.getElementById('l9clr').onclick = () => { Object.keys(rec).forEach(k => delete rec[k]); table(); };
  record();
  registerSim('t9', { start: draw, resize: draw });
})();

/* ---------- ③ 例題 4-9 國旗 ---------- */
(() => {
  const cv = document.getElementById('l9flag'); if (!cv) return;
  const S = stage(cv, 760, 210), ctx = S.ctx;
  let red = false;
  const L = () => red ? [1, 0, 0] : [1, 1, 1];
  const C = c => rgbStr(mul(L(), c));
  const BLUE = [0.05, 0.3, 0.75], WHITE = [1, 1, 1], RED = [0.85, 0.08, 0.1], NAVY = [0.05, 0.12, 0.4];
  function greece(x, y, w, h) {
    for (let i = 0; i < 9; i++) { ctx.fillStyle = C(i % 2 ? WHITE : BLUE); ctx.fillRect(x, y + i * h / 9, w, h / 9 + 0.5); }
    const s = h * 5 / 9; ctx.fillStyle = C(BLUE); ctx.fillRect(x, y, s, s); ctx.fillStyle = C(WHITE); ctx.fillRect(x, y + s * 2 / 5, s, s / 5); ctx.fillRect(x + s * 2 / 5, y, s / 5, s);
  }
  function uk(x, y, w, h) {
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = C(NAVY); ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = C(WHITE); ctx.lineWidth = h * 0.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y + h); ctx.moveTo(x + w, y); ctx.lineTo(x, y + h); ctx.stroke();
    ctx.strokeStyle = C(RED); ctx.lineWidth = h * 0.067; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y + h); ctx.moveTo(x + w, y); ctx.lineTo(x, y + h); ctx.stroke();
    ctx.fillStyle = C(WHITE); ctx.fillRect(x + w / 2 - h * 0.17, y, h * 0.34, h); ctx.fillRect(x, y + h / 2 - h * 0.17, w, h * 0.34);
    ctx.fillStyle = C(RED); ctx.fillRect(x + w / 2 - h * 0.1, y, h * 0.2, h); ctx.fillRect(x, y + h / 2 - h * 0.1, w, h * 0.2);
    ctx.restore();
  }
  function canada(x, y, w, h) {
    ctx.fillStyle = C(RED); ctx.fillRect(x, y, w / 4, h); ctx.fillRect(x + w * 3 / 4, y, w / 4, h); ctx.fillStyle = C(WHITE); ctx.fillRect(x + w / 4, y, w / 2, h);
    const cx = x + w / 2, cy = y + h / 2, s = h * 0.36;
    const P = [[0, -1], [0.18, -0.62], [0.42, -0.72], [0.35, -0.28], [0.75, -0.42], [0.62, -0.1], [0.82, 0.05], [0.42, 0.32], [0.48, 0.55], [0.06, 0.45], [0.06, 0.95], [-0.06, 0.95], [-0.06, 0.45], [-0.48, 0.55], [-0.42, 0.32], [-0.82, 0.05], [-0.62, -0.1], [-0.75, -0.42], [-0.35, -0.28], [-0.42, -0.72], [-0.18, -0.62]];
    ctx.fillStyle = C(RED); ctx.beginPath(); P.forEach(([px, py], i) => i ? ctx.lineTo(cx + px * s, cy + py * s) : ctx.moveTo(cx + px * s, cy + py * s)); ctx.closePath(); ctx.fill();
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.fillStyle = red ? '#1a0000' : '#F5F5F5'; ctx.fillRect(0, 0, S.W, S.H);
    [['(A) 希臘', greece], ['(B) 英國', uk], ['(C) 加拿大', canada]].forEach(([n, f], i) => {
      const x = 25 + i * 245, y = 30, w = 220, h = 140;
      f(x, y, w, h); ctx.strokeStyle = '#777'; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
      label(ctx, n, x + w / 2, 190, { align: 'center', size: 14, bold: true, color: red ? '#fff' : '#333' });
    });
    document.getElementById('l9flagL').textContent = red ? '⚪ 換回白光' : '🔴 換成紅光照射';
  }
  document.getElementById('l9flagL').onclick = () => { red = !red; draw(); };
  registerSim('t9', { start: draw, resize: draw });
})();

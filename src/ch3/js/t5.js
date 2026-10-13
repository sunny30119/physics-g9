/* ===== 分頁 5：重力位能 =====
   沙坑實驗：重錘 m 從 h 落下。模擬簡化：坑深 ∝ 落地時的動能（= mgh），d = mgh / 400 公尺 */
(() => {
  const cv = document.getElementById('c3sand'); if (!cv) return;
  const S = stage(cv, 760, 360), ctx = S.ctx;
  const GY = 290, PX = 80, BX = 210, K = 400;
  let y = 1, v = 0, phase = 'ready', dig = 0, recs = [];
  const m = bindRange('c3sm', v => v + ' kg', reset), h = bindRange('c3sh', v => v + ' m', reset);
  function reset() { phase = 'ready'; y = +h.value; v = 0; dig = 0; draw(); }
  function step(dt) {
    if (phase !== 'fall') return;
    dt *= 0.5; v += G * dt; y -= v * dt;
    if (y <= 0) { y = 0; phase = 'done'; dig = m.value * G * h.value / K; }
    draw();
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const mm = +m.value, hh = +h.value, sz = 26 + mm * 5;
    // 沙坑
    ctx.fillStyle = '#E8D19A'; ctx.fillRect(60, GY, 300, 60);
    ctx.fillStyle = 'rgba(160,120,60,.35)'; for (let i = 0; i < 60; i++) ctx.fillRect(64 + (i * 47) % 290, GY + 4 + (i * 13) % 52, 2, 2);
    ground(ctx, 20, 60, GY); ground(ctx, 360, 420, GY);
    // 坑
    const dpx = dig * 150;
    if (dpx > 0) { ctx.fillStyle = '#B8995A'; ctx.beginPath(); ctx.ellipse(BX, GY, sz / 2 + 10, dpx + 2, 0, 0, Math.PI); ctx.fill(); }
    // 刻度
    for (let k = 0; k <= 3; k += 0.5) { const yy = GY - k * PX; ctx.fillStyle = '#C9D3DD'; ctx.fillRect(44, yy, 12, 1.5); label(ctx, k + ' m', 4, yy, { size: 12, color: '#8A96A3' }); }
    // 釋放位置虛線
    ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = '#90A4AE';
    ctx.beginPath(); ctx.moveTo(40, GY - hh * PX); ctx.lineTo(BX - sz, GY - hh * PX); ctx.stroke(); ctx.restore();
    // 重錘
    const by = GY - y * PX + (phase === 'done' ? dpx * 0.8 : 0);
    box(ctx, BX - sz / 2, by - sz, sz, sz, '#546E7A', mm + 'kg');
    if (phase === 'done') label(ctx, `坑深 ${fmt(dig * 100, 1)} cm`, BX, GY + 48, { align: 'center', size: 14, bold: true, bg: 'rgba(255,255,255,.85)' });
    // 能量長條
    const U = mm * G * y, Wg = mm * G * (hh - y), Kin = Wg;   // 不計空氣阻力：動能＝重力已作的功
    ebars(ctx, 470, 70, 260, 210, [
      { name: '重力位能', val: U, color: '#8E24AA' },
      { name: '動能', val: phase === 'done' ? 0 : Kin, color: '#1E88E5' },
      { name: '重力已作的功', val: Wg, color: '#43A047' },
    ], 5 * G * 3, { title: phase === 'done' ? '落地後：能量變成沙子變形和熱' : '能量（焦耳）', d: 1 });
  }
  function table() {
    const tb = document.getElementById('c3sandT');
    if (!recs.length) { tb.innerHTML = '<tr><td colspan="5" class="note">按「記錄」把結果加進表格</td></tr>'; return; }
    tb.innerHTML = recs.map((r, i) => `<tr><td>${i + 1}</td><td>${r.m} kg</td><td>${r.h} m</td><td><b>${fmt(r.m * G * r.h / K * 100, 1)} cm</b></td><td>${fmt(r.m * G * r.h, 1)} J</td></tr>`).join('');
    if (recs.length >= 2) {
      const a = recs[recs.length - 2], b = recs[recs.length - 1];
      const ra = a.m * a.h, rb = b.m * b.h;
      document.getElementById('c3sandTxt').innerHTML = ra === rb
        ? `🤯 質量 × 高度：${a.m}×${a.h}＝${b.m}×${b.h}，坑<b>一樣深</b>！重力位能只看「質量 × 高度」。`
        : `質量 × 高度從 ${fmt(ra, 1)} 變成 ${fmt(rb, 1)}（${fmt(rb / ra, 2)} 倍），坑深也變成 <b>${fmt(rb / ra, 2)} 倍</b>。`;
    }
  }
  document.getElementById('c3sandGo').onclick = () => { reset(); phase = 'fall'; };
  document.getElementById('c3sandRec').onclick = () => { recs.push({ m: +m.value, h: +h.value }); if (phase !== 'done') { phase = 'done'; y = 0; dig = m.value * G * h.value / K; draw(); } table(); };
  document.getElementById('c3sandClr').onclick = () => { recs = []; table(); };
  onG(() => { table(); if (phase) draw(); });
  const lp = loop(step);
  registerSim('t5', { start() { reset(); table(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

/* ---------- 基準面 ---------- */
(() => {
  if (!document.getElementById('c3ref')) return;
  let r = 0;
  const upd = () => {
    const U = h => fmt(1 * G * (h - r), 1);
    document.getElementById('c3refR').innerHTML = `
      <div><span>書在桌上（1 m）的位能</span><b>${U(1)} J</b></div>
      <div><span>書在地上（0 m）的位能</span><b>${U(0)} J</b></div>
      <div><span>從桌上掉到地上，位能減少</span><b style="color:var(--ok)">${fmt(G, 1)} J</b></div>`;
  };
  $$('#c3ref .chip').forEach(c => c.onclick = () => { r = +c.dataset.r; $$('#c3ref .chip').forEach(x => x.classList.toggle('on', x === c)); upd(); });
  onG(upd); upd();
})();

/* ---------- 高空拋物案例 ---------- */
onG(g => { const e = document.getElementById('c3bottle'); if (e) e.textContent = fmt(0.6 * g * 27, 0); });

/* ===== 分頁 0：開場（章首謎題、熱身） ===== */
(() => {
  const cv = document.getElementById('l0card'); if (!cv) return;
  const S = stage(cv, 420, 300), ctx = S.ctx;
  let view = 'white';
  const FILT = { white: null, red: '#FF2A2A', blue: '#2A5BFF' };
  const TXT = {
    white: '白光下，牌面被紅色的亂線蓋住，看不出寫了什麼。謎題說「當世界被染紅之時」……試試紅色玻璃紙？',
    red: '🟥 透過紅色玻璃紙：紅色亂線和白色底都變成一樣的紅，<b>亂線「消失」了</b>；藍色的字幾乎<b>不反射</b>紅光，看起來變成<b>黑色</b>，清楚浮現——發現光的真相的人是<b>牛頓</b>！<br>為什麼？第 ⑨ 頁「物體的顏色」會揭曉。',
    blue: '🟦 透過藍色玻璃紙：藍色的字和白底一樣變成藍色，<b>字反而不見了</b>；紅色亂線變成黑色，更明顯。看來要用對顏色的玻璃紙！',
  };
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    ctx.save();
    ctx.fillStyle = '#FFFFFF'; rrect(ctx, 90, 14, 240, 272, 14); ctx.fill(); ctx.strokeStyle = '#999'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#3F6BFF'; ctx.font = 'bold 30px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('K', 112, 40); ctx.fillText('K', 308, 260);
    ctx.font = 'bold 64px "PingFang TC","Microsoft JhengHei",sans-serif'; ctx.fillText('牛頓', 210, 150);
    const r = rng(42); ctx.globalCompositeOperation = 'multiply'; ctx.strokeStyle = '#FF3030'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    for (let k = 0; k < 110; k++) { ctx.beginPath(); let x = 100 + r() * 220, y = 24 + r() * 252; ctx.moveTo(x, y); for (let j = 0; j < 4; j++) { x += (r() - .5) * 70; y += (r() - .5) * 70; ctx.lineTo(clamp(x, 96, 324), clamp(y, 20, 280)); } ctx.stroke(); }
    ctx.globalCompositeOperation = 'source-over';
    if (FILT[view]) { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = FILT[view]; ctx.fillRect(0, 0, S.W, S.H); }
    ctx.restore();
  }
  $$('#l0view .chip').forEach(c => c.onclick = () => { view = c.dataset.v; $$('#l0view .chip').forEach(x => x.classList.toggle('on', x === c)); document.getElementById('l0txt').innerHTML = TXT[view]; draw(); });
  registerSim('t0', { start: draw, resize: draw });
  const host = document.getElementById('l0warm');
  if (host) mountSort(host, ['發光體（光源）', '不是發光體'], [
    ['太陽', 0, '太陽自己會發光。'],
    ['月亮', 1, '月亮反射太陽光，自己不會發光。'],
    ['點亮的手機螢幕', 0, '通電後螢幕自己發光。'],
    ['鏡子', 1, '鏡子只是反射光，關燈後就看不見它。'],
    ['點燃的蠟燭', 0, '燭火會發光。'],
    ['夏夜的螢火蟲', 0, '螢火蟲會用化學反應發光（生物發光）。'],
    ['白色的課本', 1, '課本反射光，所以看起來白白亮亮的，但它不是光源。'],
    ['夜晚路邊的反光貼紙', 1, '反光貼紙只是很會反射車燈，自己不會發光。'],
  ]);
})();

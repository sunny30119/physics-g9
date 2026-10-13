/* ===== 分頁 9：能源 =====
   ① 臺灣發電結構（113 / 114 年）② 分類 ③ 再生能源翻牌卡 ④ 家庭用電計算器 */
(() => {
  const cv = document.getElementById('c3mix'); if (!cv) return;
  const S = stage(cv, 760, 400), ctx = S.ctx;
  // 113 年：台大風險中心整理（能源署月報）；114 年：能源署／環境部（再生能源細項由「占再生能源比例 × 13.3%」換算，為約值）
  const CAT = [
    ['燃氣', '#EF6C00', 42.45, 47.7, '火力'], ['燃煤', '#5D4037', 39.27, 35.3, '火力'],
    ['核能', '#7B1FA2', 4.22, 1.1, '核能'],
    ['太陽光電', '#FBC02D', 5.16, 5.8, '再生'], ['風力', '#26A69A', 3.58, 4.2, '再生'], ['水力（慣常）', '#1E88E5', 1.46, 1.9, '再生'], ['生質能及廢棄物', '#7CB342', 1.34, 1.4, '再生'],
    ['其他（燃油、抽蓄水力等）', '#B0BEC5', 2.52, 2.6, '其他'],
  ];
  let yr = '113';
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const rows = CAT.filter(c => yr === 'cmp' ? (c[2] != null || c[3] != null) : c[yr === '113' ? 2 : 3] != null);
    const x0 = 190, w = 520, rowH = yr === 'cmp' ? 31 : 30, top = 70;
    // 上方：100% 堆疊條
    const sumOf = y => { const g = { 火力: 0, 核能: 0, 再生: 0, 其他: 0 }; CAT.forEach(c => { const v = c[y === '113' ? 2 : 3]; if (v != null) g[c[4]] += v; }); return g; };
    const stacks = yr === 'cmp' ? ['113', '114'] : [yr];
    stacks.forEach((y, k) => {
      const g = sumOf(y); let x = x0; const yy = 12 + k * 24;
      label(ctx, `${y} 年`, x0 - 10, yy + 9, { align: 'right', size: 13, bold: true });
      [['燃氣＋燃煤', '#E64A19', '火力'], ['核能', '#7B1FA2', '核能'], ['再生', '#43A047', '再生'], ['其他', '#B0BEC5', '其他']].forEach(([n, c, k]) => {
        const ww = w * g[k] / 100; ctx.fillStyle = c; ctx.fillRect(x, yy, ww, 18);
        if (ww > 50) label(ctx, `${n} ${fmt(g[k], 1)}%`, x + ww / 2, yy + 9, { align: 'center', size: 12, color: '#fff', bold: true });
        x += ww;
      });
    });
    const t0 = top + (yr === 'cmp' ? 0 : -20);
    rows.forEach((c, i) => {
      const y = t0 + i * rowH;
      label(ctx, c[0], x0 - 10, y + rowH / 2 - 2, { align: 'right', size: 13 });
      const vals = yr === 'cmp' ? [[c[2], 1], [c[3], 0.55]] : [[c[yr === '113' ? 2 : 3], 1]];
      vals.forEach(([v, a], k) => {
        if (v == null) return;
        const bh = yr === 'cmp' ? 12 : 20, by = y + (yr === 'cmp' ? k * 13 : 0) + 2;
        ctx.globalAlpha = a; ctx.fillStyle = c[1]; ctx.fillRect(x0, by, w * v / 58, bh); ctx.globalAlpha = 1;
        label(ctx, fmt(v, 2) + '%' + (yr === 'cmp' ? (k ? '（114）' : '（113）') : ''), x0 + w * v / 58 + 6, by + bh / 2, { size: 12, bold: k === 0 });
      });
    });
  }
  $$('#c3mixYr .chip').forEach(c => c.onclick = () => { yr = c.dataset.y; $$('#c3mixYr .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  registerSim('t9', { start: draw, resize: draw });
})();

/* ---------- 分類 ---------- */
(() => {
  const host = document.getElementById('c3sort9'); if (!host) return;
  mountSort(host, ['再生能源', '非再生能源'], [
    ['太陽光電', 0, '陽光每天都會照射，不會用完。'],
    ['天然氣', 1, '化石燃料，蘊藏量有限。'],
    ['離岸風力', 0, '風會一直吹，不會用完。'],
    ['煤', 1, '化石燃料，形成需要幾百萬年，用完就沒有了。'],
    ['核能（鈾）', 1, '鈾礦的蘊藏量有限，課本歸在非再生能源。'],
    ['垃圾焚化發電、沼氣', 0, '來自生物產生的有機物質（生質能），會持續產生。'],
    ['日月潭水力發電', 0, '雨水會持續補充水庫，屬於再生能源。'],
    ['石油', 1, '化石燃料，蘊藏量有限。'],
    ['地熱', 0, '地球內部的熱會持續補充。'],
  ]);
})();

/* ---------- 再生能源翻牌卡（課本探究提問） ---------- */
(() => {
  const host = document.getElementById('c3reCards'); if (!host) return;
  const C = [
    ['♨️ 地熱', '地底的熱能 → 熱水或蒸汽 → 推動渦輪發電', '✅ 臺灣在板塊交界，地熱資源豐富（宜蘭清水、大屯山）；不受天氣影響，可以 24 小時發電。', '⚠️ 鑽井成本高、有些地點在國家公園內；地熱流體可能結垢、腐蝕管線，目前發電量還很小。'],
    ['🗑️ 垃圾沼氣', '垃圾、廚餘、豬糞發酵產生沼氣（甲烷）→ 燃燒發電', '✅ 把廢棄物變能源，同時減少甲烷（溫室效應很強的氣體）直接排放。臺灣養豬場、掩埋場已有沼氣發電。', '⚠️ 規模小、氣體收集不穩定；燃燒仍會排放二氧化碳。'],
    ['🌾 生質能', '農作物殘渣、木屑等有機物 → 燃燒或製成燃料', '✅ 植物生長時吸收二氧化碳，燃燒時再放出，理論上接近「碳中和」。', '⚠️ 若為了生質燃料砍森林、搶耕地，反而破壞環境；臺灣土地有限。'],
    ['☀️ 太陽光電', '光能 → 太陽能板 → 電能', '✅ 臺灣日照充足，屋頂、魚塭、空地都能裝；目前再生能源中發電最多。', '⚠️ 晚上和陰天不能發電，需要儲能；大面積設置可能影響生態與農地。'],
    ['🌬️ 離岸風電', '風的動能 → 扇葉 → 電能', '✅ 臺灣海峽冬季季風強，風場條件世界一流。', '⚠️ 夏季風小、颱風與地震的考驗；建置成本高、技術需進口。'],
  ];
  host.innerHTML = C.map(([n, how, pro, con]) => `<div class="case flip" tabindex="0"><div class="where">${n}</div><h4>${how}</h4><p class="note">👆 點一下看可行性與限制</p><div class="back" style="display:none"><p>${pro}</p><p>${con}</p></div></div>`).join('');
  $$('.flip', host).forEach(c => c.onclick = () => { const b = $('.back', c), on = b.style.display === 'none'; b.style.display = on ? 'block' : 'none'; $('.note', c).style.display = on ? 'none' : ''; });
})();

/* ---------- 家庭用電計算器 ---------- */
(() => {
  const host = document.getElementById('c3home'); if (!host) return;
  const A = [['冷氣', 900, 6], ['冰箱（全天，平均）', 130, 24], ['電視', 140, 3], ['電鍋', 700, 0.5], ['吹風機', 800, 0.2], ['LED 燈（5 盞）', 50, 5], ['電腦', 100, 3], ['手機充電', 20, 2]];
  host.innerHTML = A.map(([n, w, h], i) => `<div class="ctl"><label>${n}（${w} W）每天 <output for="c3ha${i}"></output></label><input type="range" id="c3ha${i}" min="0" max="24" step="0.5" value="${h}"></div>`).join('');
  const upd = () => {
    const kwh = A.reduce((s, [, w], i) => s + w * document.getElementById('c3ha' + i).value / 1000, 0);
    const top = A.map(([n, w], i) => [n, w * document.getElementById('c3ha' + i).value / 1000]).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('c3homeR').innerHTML = `
      <div><span>一天用電</span><b>${fmt(kwh, 1)} 度</b></div>
      <div><span>相當於</span><b>${fmt(kwh * 3.6, 1)} 百萬焦耳</b></div>
      <div><span>一個月（30 天）</span><b>${fmt(kwh * 30, 0)} 度</b></div>
      <div><span>一個月約排碳</span><b>${fmt(kwh * 30 * 0.47, 0)} 公斤</b></div>
      <div><span>一個月電費（粗估）</span><b>約 ${(Math.round(kwh * 30 * 3 / 10) * 10).toLocaleString()} 元</b></div>`;
    document.getElementById('c3homeTxt').innerHTML = `最耗電的是 <b>${top[0]}</b>（每天 ${fmt(top[1], 1)} 度）。想省電，先從它下手！`;
  };
  A.forEach((a, i) => bindRange('c3ha' + i, v => v + ' 小時', upd));
  upd();
})();

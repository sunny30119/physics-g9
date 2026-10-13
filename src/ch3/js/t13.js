/* ===== 分頁 13：總複習（概念翻牌、迷思總整理） ===== */
(() => {
  const host = document.getElementById('c3cards'); if (!host) return;
  const C = [
    ['功（W）', 'W ＝ F × S｜外力 × 物體沿外力方向的位移。單位：牛頓・公尺＝焦耳（J）。同向作正功、反向作負功、垂直或沒位移不作功。', 't1'],
    ['功率（P）', 'P ＝ W ÷ t｜單位時間內作的功，描述作功的快慢。單位：焦耳／秒＝瓦特（W）。', 't2'],
    ['動能', '運動物體作功的能力。質量愈大、速率愈大，動能愈大（速率 2 倍 → 動能 4 倍）。外力作正功動能增加，作負功動能減少。', 't3'],
    ['重力位能', '物體因位置高低而具有的作功能力。＝落下過程中重力對它作的功。質量愈大、位置愈高，重力位能愈大。', 't5'],
    ['彈力位能', '物體壓縮或伸長（形變）時具有的作功能力。形變愈大，彈力位能愈大。', 't6'],
    ['力學能守恆', '力學能＝動能＋位能。只受重力或彈力作用時，動能和位能互相轉換，總和維持不變。最高點位能最大，最低點動能最大。', 't7'],
    ['能量守恆定律', '能量可以從一種形式轉變成另一種形式，總能量不會增加也不會減少。焦耳實驗：重錘損失的位能 → 水的熱能。', 't8'],
    ['能源', '能量的來源。非再生能源：核能、化石能源（目前以火力發電為主）；再生能源：太陽能、水力、生質能、風力。', 't9'],
    ['簡單機械', '斜面、槓桿、滑輪、輪軸。可以省力（費時）、省時（費力）或改變方向，但<b>不能省功</b>。', 't10'],
  ];
  host.innerHTML = C.map(([n, d, t]) => `<div class="case flip" tabindex="0"><h4 style="font-size:1.2rem">${n}</h4><p class="note front">👆 先說說看，再點我翻面</p><div class="back" style="display:none"><p>${d}</p><button class="btn ghost" data-go="${t}">去複習 →</button></div></div>`).join('');
  $$('.flip', host).forEach(c => c.onclick = e => {
    if (e.target.dataset.go) { showTab(e.target.dataset.go); return; }
    const b = $('.back', c), on = b.style.display === 'none'; b.style.display = on ? 'block' : 'none'; $('.front', c).style.display = on ? 'none' : '';
  });
  const m = document.getElementById('c3myths');
  m.innerHTML = Object.entries(ARENA).map(([t, a]) => `<div class="sortq"><div class="item" style="cursor:pointer" data-t="${t}"><span class="txt">${a.title}</span><span class="chip">去擂台 →</span></div></div>`).join('');
  $$('[data-t]', m).forEach(r => r.onclick = () => {
    showTab(r.dataset.t);
    const d = $(`#p-${r.dataset.t} details.deep`); if (d) { d.open = true; setTimeout(() => $(`#p-${r.dataset.t} [data-arena]`)?.scrollIntoView({ behavior: 'smooth' }), 300); }
  });
})();

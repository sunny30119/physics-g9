/* ===== 分頁 0：開場 ===== */
(() => {
  // 🐋 聽聽看：每個按鈕播 2 秒的純音
  let cur = null, timer = null;
  $$('#w0whale .chip').forEach(c => c.onclick = () => {
    if (cur) cur.stop(); clearTimeout(timer);
    $$('#w0whale .chip').forEach(x => x.classList.toggle('on', x === c));
    const f = +c.dataset.f;
    cur = AUD.tone({ freq: f, harm: [1], vol: f < 100 ? 0.45 : 0.18 });   // 純音：不加倍頻，避免把 20 赫聽成 40 赫
    timer = setTimeout(() => { cur && cur.stop(); cur = null; c.classList.remove('on'); }, 2000);
  });
  // 熱身分類
  const host = document.getElementById('w0warm');
  if (host) mountSort(host, ['是波動', '不是波動'], [
    ['運動會全場觀眾玩「人浪」', 0, '每個人只在座位上站起、坐下，「站起來的動作」一個傳一個往前跑，是波動。'],
    ['投手投出去的棒球', 1, '棒球本身從投手飛到捕手，是「物體」在移動，不是擾動在介質中傳遞。'],
    ['地震時大地的搖晃', 0, '地震波從震源把振動傳到遠方，是波動。'],
    ['老師說話的聲音', 0, '聲帶振動推動空氣，空氣一層推一層把振動傳出去，是聲波。'],
    ['風把一張紙吹到教室另一頭', 1, '紙本身被吹過去，是物體移動。'],
    ['手機收到的 Wi-Fi 訊號', 0, 'Wi-Fi 是電磁波（不需要介質）。'],
    ['丟進池塘的石頭激起一圈圈漣漪', 0, '漣漪是水波：水只在原地上下起伏，波紋往外擴散。'],
    ['從窗外照進來的陽光', 0, '光也是一種波（電磁波），第 4 章會學到。'],
  ]);
})();

/* ===== 延伸資源（2026-10-14 連結已檢查）=====
   lang：zh 中文｜zhsub 英文可開中文字幕｜en 英文｜sim 互動模擬
   YouTube 主題影片用「搜尋連結」，避免單一影片下架後失效 */
const YT = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
const RES = {
  t0: [
    { t: '維基百科：52 赫鯨魚（52-hertz whale）', url: 'https://en.wikipedia.org/wiki/52-hertz_whale', lang: 'en', kind: '文章', note: '英文。52 赫鯨魚的發現經過、叫聲頻率與後續研究；本章章首故事的查證來源。' },
    { t: 'PhET 互動模擬：波動入門', url: 'https://phet.colorado.edu/sims/html/waves-intro/latest/waves-intro_zh_TW.html', lang: 'sim', kind: '模擬', note: '美國科羅拉多大學的免費模擬（繁體中文版），可以玩水波、聲波、光波。' },
  ],
  t1: [
    { t: 'PhET 互動模擬：繩波', url: 'https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_zh_TW.html', lang: 'sim', kind: '模擬', note: '可以擺一次（脈衝）或連續振動，觀察繩上綠色標記點只在原地振動。' },
    { t: '中央氣象署 地震測報中心', url: 'https://scweb.cwa.gov.tw/', lang: 'zh', kind: '網站', note: '臺灣最新地震報告、強震即時警報說明，以及地震波的科普資料。' },
    { t: 'YouTube：人浪 物理 波動', url: YT('Mexican wave physics stadium'), lang: 'en', kind: '影片搜尋', note: '更多運動場人浪的影片與分析。' },
  ],
  t2: [
    { t: 'PhET 互動模擬：繩波（振盪模式）', url: 'https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_zh_TW.html', lang: 'sim', kind: '模擬', note: '切到「振盪」模式，用尺和碼錶量出波長和週期，驗證 v＝f×λ。' },
    { t: 'YouTube：週期波 波長 頻率 國中理化', url: YT('週期波 波長 頻率 波速 國中理化'), lang: 'zh', kind: '影片搜尋', note: '更多週期波的計算教學。' },
  ],
  t3: [
    { t: 'PhET 互動模擬：聲波', url: 'https://phet.colorado.edu/sims/html/sound-waves/latest/sound-waves_zh_TW.html', lang: 'sim', kind: '模擬', note: '可以看到喇叭推動空氣的疏密波，也有「抽掉空氣」的實驗。' },
    { t: '維基百科：聲速（Speed of sound）', url: 'https://en.wikipedia.org/wiki/Speed_of_sound', lang: 'en', kind: '文章', note: '英文。各種介質中的聲速表、聲速測量的歷史（本頁時間軸查證來源之一）。' },
    { t: 'YouTube：真空鈴實驗', url: YT('真空 鈴 聲音 介質 實驗'), lang: 'zh', kind: '影片搜尋', note: '更多真空罩實驗影片。' },
  ],
  t4: [
    { t: 'Chrome Music Lab：聲譜圖', url: 'https://musiclab.chromeexperiments.com/Spectrogram/', lang: 'sim', kind: '模擬', note: 'Google 的免費網頁工具，用麥克風把聲音畫成彩色的「聲譜」，可以看出音調高低和音色差異。' },
    { t: 'Chrome Music Lab：振盪器', url: 'https://musiclab.chromeexperiments.com/Oscillators/', lang: 'sim', kind: '模擬', note: '四種不同波形的聲音，上下拖動改變頻率，聽出波形和音色的關係。' },
    { t: 'phyphox 手機物理實驗室', url: 'https://phyphox.org/', lang: 'en', kind: 'App', note: '德國亞琛工業大學開發的免費 App（有中文介面），課本探討活動 3-4 可用它看聲音振幅與聲譜。' },
    { t: 'WHO：聽力損失事實清單', url: 'https://www.who.int/news-room/fact-sheets/detail/deafness-and-hearing-loss', lang: 'en', kind: '文章', note: '英文。世界衛生組織關於聽力損失的數據與預防建議。' },
  ],
  t5: [
    { t: '維基百科：動物的回聲定位', url: 'https://en.wikipedia.org/wiki/Animal_echolocation', lang: 'en', kind: '文章', note: '英文。蝙蝠、海豚的回聲定位，以及斯帕蘭札尼、葛里芬的研究歷史。' },
    { t: '衛武營國家藝術文化中心', url: 'https://www.npac-weiwuying.org/', lang: 'zh', kind: '網站', note: '課本圖 3-26 的音樂廳；官網有建築與場館介紹。' },
    { t: 'WHO：安全聆聽新標準（2022）', url: 'https://www.who.int/news/item/02-03-2022-who-releases-new-standard-to-tackle-rising-threat-of-hearing-loss', lang: 'en', kind: '新聞', note: '英文。世界衛生組織針對演唱會、夜店等場所的安全音量標準。' },
    { t: 'YouTube：超音波 產檢 原理', url: YT('超音波 原理 回聲 醫學影像'), lang: 'zh', kind: '影片搜尋', note: '醫學超音波如何用回聲成像。' },
  ],
};

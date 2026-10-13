/* ===== 延伸資源（2026-10-12 查證；詳見 research/ch3_資源查證.md）=====
   lang：zh 中文｜zhsub 英文可開中文字幕｜en 英文｜sim 互動模擬
   YouTube 影片一律用「搜尋連結」，避免單一影片下架後失效 */
const YT = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
const RES = {
  t0: [
    { t: '科技大觀園：能量的概念與轉換', url: 'https://scitechvista.nat.gov.tw/Article/C000003/detail?ID=6fcd2b95-3ad9-4f77-8168-af7fcc76ce4d', lang: 'zh', kind: '文章', note: '從「功」談起，介紹動能、位能與能量守恆（原刊《科學發展》，程度偏高中）。' },
    { t: '維基百科：能量的歷史（History of energy）', url: 'https://en.wikipedia.org/wiki/History_of_energy', lang: 'en', kind: '文章', note: '英文。從萊布尼茲的活力、楊的 energy，到克耳文與蘭金的動能、位能，本頁時間軸的主要查證來源。' },
  ],
  t1: [
    { t: 'YouTube：功、正功、負功（國中理化）', url: YT('功 正功 負功 國中 理化'), lang: 'zh', kind: '影片搜尋', note: '挑一支國中版的講解影片，複習功的定義與正負功。' },
    { t: '均一教育平台：功與能系列', url: 'https://www.junyiacademy.org/junyi-science/junyi-physics/junyi-energy-and-work-a/v/OX44xogGSxk', lang: 'zh', kind: '影片', note: '均一的物理影片（偏高中程度），資優生可以挑戰。' },
  ],
  t2: [
    { t: '泛科學：一萬馬力的鉗子是多厲害？', url: 'https://pansci.asia/archives/113554', lang: 'zh', kind: '文章', note: '用寶可夢「巨鉗蟹」的一萬馬力，練習馬力 → 瓦特 → 力的換算（1 馬力約 746 瓦）。' },
    { t: '泛科學：風速狗與馬力', url: 'https://pansci.asia/archives/110217', lang: 'zh', kind: '文章', note: '介紹瓦特為什麼發明「馬力」，以及用引擎功率估算能量。' },
    { t: '台電月刊：生活中的一度電', url: 'https://service.taipower.com.tw/tpcjournal/TPMM/2023/732/files/basic-html/page45.html', lang: 'zh', kind: '圖表', note: '常見家電的功率，以及「一度電」可以用多久。本頁家電表的資料來源。' },
    { t: 'YouTube：功率 瓦特 國中', url: YT('功率 瓦特 國中 理化'), lang: 'zh', kind: '影片搜尋', note: '功率的觀念講解影片。' },
  ],
  t3: [
    { t: 'YouTube：煞車距離與速率平方', url: YT('煞車距離 速率 平方 動能'), lang: 'zh', kind: '影片搜尋', note: '車速 2 倍、煞車距離約 4 倍的實際示範。' },
    { t: 'YouTube：車速與撞擊（英文）', url: YT('car crash speed kinetic energy physics'), lang: 'zhsub', kind: '影片搜尋', note: '英文影片，可在 YouTube 設定「自動翻譯 → 中文（繁體）」字幕。車速愈快，撞擊破壞力增加得愈驚人。' },
    { t: '維基百科：活力之爭（Vis viva）', url: 'https://en.wikipedia.org/wiki/Vis_viva', lang: 'en', kind: '文章', note: '英文。萊布尼茲 mv² 與笛卡兒派 mv 的爭論，以及後來加上 ½ 的過程。' },
  ],
  t4: [
    { t: 'PhET：能量滑板競技場', url: 'https://phet.colorado.edu/zh_TW/simulations/energy-skate-park', lang: 'sim', kind: '模擬', note: '繁體中文介面。讓滑板手從高處滑下，觀察動能、位能長條圖的變化。' },
  ],
  t5: [
    { t: '台電綠網：大觀發電廠（抽蓄水力）', url: 'https://service.taipower.com.tw/greennet/ecofriendly/education/location/87', lang: 'zh', kind: '網頁', note: '南投日月潭的抽蓄電廠：半夜用多餘的電把水抽到高處（存成重力位能），白天用電尖峰時放水發電。' },
    { t: '國家教育研究院：水力發電素養題', url: 'https://stv.naer.edu.tw/data/exam/manual/主題式跨學科素養_水力發電.pdf', lang: 'zh', kind: 'PDF', note: '跨科素養題：慣常式與抽蓄式水力發電，上下池落差和發電量的關係。' },
    { t: 'YouTube：抽蓄水力發電', url: YT('抽蓄水力發電 台電 明潭'), lang: 'zh', kind: '影片搜尋', note: '看看日月潭的抽蓄電廠怎麼「用水庫當電池」。' },
    { t: 'YouTube：高空墜物 位能 動能', url: YT('高空墜物 位能 動能'), lang: 'zh', kind: '影片搜尋', note: '小東西從高樓掉下來為什麼很危險？' },
  ],
  t6: [
    { t: 'PhET：質量與彈簧', url: 'https://phet.colorado.edu/zh_TW/simulations/masses-and-springs', lang: 'sim', kind: '模擬', note: '繁體中文介面。掛上砝碼讓彈簧振動，看彈力位能、重力位能、動能長條圖。' },
    { t: 'PhET：虎克定律', url: 'https://phet.colorado.edu/zh_TW/simulations/hookes-law', lang: 'sim', kind: '模擬', note: '繁體中文介面。拉或壓彈簧，看力和伸長量的關係，以及儲存的位能。' },
    { t: 'YouTube：撐竿跳的能量轉換', url: YT('撐竿跳 能量轉換 物理'), lang: 'zh', kind: '影片搜尋', note: '助跑的動能 → 竿子彎曲的彈力位能 → 升高的重力位能。' },
  ],
  t7: [
    { t: 'PhET：能量滑板競技場：基礎', url: 'https://phet.colorado.edu/zh_TW/simulations/energy-skate-park-basics', lang: 'sim', kind: '模擬', note: '繁體中文介面。可以開關摩擦力，看總能量和熱能的變化。' },
    { t: 'PhET：鐘擺實驗室', url: 'https://phet.colorado.edu/zh_TW/simulations/pendulum-lab', lang: 'sim', kind: '模擬', note: '繁體中文介面。像盪鞦韆一樣，看位能和動能來回轉換。' },
    { t: 'YouTube：雲霄飛車 位能 動能', url: YT('雲霄飛車 位能 動能 國中'), lang: 'zh', kind: '影片搜尋', note: '雲霄飛車為什麼第一座坡一定最高？' },
  ],
  t8: [
    { t: '英國科學博物館：焦耳的熱功當量裝置', url: 'https://collection.sciencemuseumgroup.org.uk/objects/co2526', lang: 'en', kind: '館藏照片', note: '英文。焦耳使用過的槳輪攪水裝置照片與說明（館藏標示 1876 年製作／入藏，不是 1845 年那一台）。' },
    { t: 'PhET：能量形式與轉化', url: 'https://phet.colorado.edu/zh_TW/simulations/energy-forms-and-changes', lang: 'sim', kind: '模擬', note: '繁體中文介面。把水龍頭、太陽、腳踏車接到發電機、燈泡，追蹤能量的形式怎麼轉換。' },
    { t: 'YouTube：焦耳的槳輪實驗（英文）', url: YT('Joule paddle wheel experiment mechanical equivalent of heat'), lang: 'zhsub', kind: '影片搜尋', note: '英文，可開自動翻譯字幕。重錘落下攪水、水溫上升的實驗重現。' },
  ],
  t9: [
    { t: '經濟部能源署：發電概況', url: 'https://www.moeaea.gov.tw/ECW/populace/content/Content.aspx?menu_id=14437', lang: 'zh', kind: '官方數據', note: '臺灣最新年度的發電結構（燃氣、燃煤、核能、再生能源占比）。' },
    { t: '環境部能源資訊平台：電力結構', url: 'https://energy.moenv.gov.tw/electricity-generation-mix/2408.html', lang: 'zh', kind: '官方數據', note: '114 年發電結構與再生能源各項比例，還有太陽光電、風力的裝置容量。' },
    { t: '台大風險社會與政策研究中心：2024 台灣能源情勢回顧', url: 'https://rsprc.ntu.edu.tw/web/research/research_in.jsp?lang=tw&rp_id=RP1741944880461', lang: 'zh', kind: '報告', note: '113 年（2024）全年發電結構的整理，燃氣首度超越燃煤。' },
  ],
  t10: [
    { t: 'PhET：斜坡：力與運動', url: 'https://phet.colorado.edu/zh_TW/simulations/ramp-forces-and-motion', lang: 'sim', kind: '模擬', note: '繁體中文介面。調斜面角度，看把東西推上斜坡需要多大的力。' },
    { t: 'YouTube：斜面 省力（國中理化）', url: YT('斜面 省力 國中 理化'), lang: 'zh', kind: '影片搜尋', note: '斜面省力、費時的實驗講解。' },
  ],
  t11: [
    { t: 'PhET：平衡動作（槓桿）', url: 'https://phet.colorado.edu/zh_TW/simulations/balancing-act', lang: 'sim', kind: '模擬', note: '繁體中文介面。在蹺蹺板上放不同的物體，找出平衡的規律。' },
    { t: 'YouTube：槓桿 滑輪 輪軸（國中理化）', url: YT('槓桿 滑輪 輪軸 國中 理化'), lang: 'zh', kind: '影片搜尋', note: '簡單機械的整理講解。' },
  ],
  t12: [
    { t: 'YouTube：滑輪 輪軸（國中理化）', url: YT('定滑輪 動滑輪 輪軸 國中 理化'), lang: 'zh', kind: '影片搜尋', note: '定滑輪、動滑輪、輪軸的實驗示範。' },
  ],
  t13: [
    { t: '公視新聞網：台灣螺絲螺帽出口', url: 'https://news.pts.org.tw/article/745925', lang: 'zh', kind: '新聞', note: '高雄岡山被稱為「螺絲窟」，是臺灣重要的螺絲產地（2025 年報導）。' },
    { t: 'YouTube：岡山 螺絲窟', url: YT('岡山 螺絲窟'), lang: 'zh', kind: '影片搜尋', note: '看看臺灣的螺絲工廠怎麼生產螺絲。' },
    { t: '維基百科：菲利普斯與十字螺絲', url: 'https://en.wikipedia.org/wiki/Henry_F._Phillips', lang: 'en', kind: '文章', note: '英文。十字槽螺絲的專利其實是湯普森設計的，菲利普斯買下後推廣量產。' },
  ],
};

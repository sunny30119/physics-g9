/* ===== 延伸資源（2026-10-14 連結已檢查）=====
   lang：zh 中文｜en 英文｜sim 互動模擬；YouTube 主題影片用搜尋連結 */
const YT = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
const RES = {
  t0: [
    { t: 'PhET 互動模擬：幾何光學（基礎版）', url: 'https://phet.colorado.edu/sims/html/geometric-optics-basics/latest/geometric-optics-basics_zh_TW.html', lang: 'sim', kind: '模擬', note: '美國科羅拉多大學的免費模擬（繁體中文），可玩透鏡和面鏡成像。' },
    { t: '維基百科：光學史（History of optics）', url: 'https://en.wikipedia.org/wiki/History_of_optics', lang: 'en', kind: '文章', note: '英文。從墨子、海什木到牛頓、惠更斯，本章時間軸的查證來源之一。' },
  ],
  t1: [
    { t: 'YouTube：針孔相機 自製', url: YT('針孔相機 自製 紙杯 針孔成像'), lang: 'zh', kind: '影片搜尋', note: '用紙杯、鞋盒自製針孔相機的教學。' },
    { t: 'YouTube：2020 日環食 樹葉 光斑', url: YT('2020 日環食 樹葉 光斑 針孔'), lang: 'zh', kind: '影片搜尋', note: '2020 年 6 月 21 日臺灣日環食時拍到的滿地小日環。' },
  ],
  t2: [
    { t: '維基百科：光速（Speed of light）', url: 'https://en.wikipedia.org/wiki/Speed_of_light', lang: 'en', kind: '文章', note: '英文。光速測量的歷史：伽利略、羅默、斐索、傅科，以及 1983 年公尺的定義。' },
    { t: 'YouTube：斐索 齒輪 測光速', url: YT('斐索 齒輪 測光速'), lang: 'zh', kind: '影片搜尋', note: '更多斐索實驗的動畫說明。' },
  ],
  t3: [
    { t: 'PhET 互動模擬：光的折射（含反射）', url: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_zh_TW.html', lang: 'sim', kind: '模擬', note: '用量角器量入射角與反射角、折射角。' },
    { t: 'YouTube：反射定律 實驗 雷射', url: YT('反射定律 實驗 雷射 國中'), lang: 'zh', kind: '影片搜尋', note: '更多反射定律實驗影片。' },
  ],
  t4: [
    { t: 'PhET 互動模擬：幾何光學（含面鏡）', url: 'https://phet.colorado.edu/sims/html/geometric-optics/latest/geometric-optics_zh_TW.html', lang: 'sim', kind: '模擬', note: '可以切換平面鏡、凹面鏡、凸面鏡觀察成像。' },
    { t: 'YouTube：凹面鏡 凸面鏡 生活應用', url: YT('凹面鏡 凸面鏡 生活應用 國中理化'), lang: 'zh', kind: '影片搜尋', note: '面鏡在生活中的應用。' },
  ],
  t5: [
    { t: 'PhET 互動模擬：光的折射', url: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_zh_TW.html', lang: 'sim', kind: '模擬', note: '換不同介質、調入射角，看折射角與全反射。' },
    { t: 'YouTube：硬幣 碗 倒水 折射', url: YT('硬幣 碗 倒水 折射 實驗'), lang: 'zh', kind: '影片搜尋', note: '在家做「浮起來的硬幣」。' },
  ],
  t6: [
    { t: 'PhET 互動模擬：幾何光學', url: 'https://phet.colorado.edu/sims/html/geometric-optics/latest/geometric-optics_zh_TW.html', lang: 'sim', kind: '模擬', note: '拖動物體、改變透鏡曲率和折射率，看實像與虛像。' },
    { t: 'YouTube：凸透鏡成像 實驗', url: YT('凸透鏡成像 實驗 蠟燭 光具座'), lang: 'zh', kind: '影片搜尋', note: '實驗 4-2 的實拍影片。' },
  ],
  t7: [
    { t: 'YouTube：近視 遠視 矯正 原理', url: YT('近視 遠視 矯正 原理 動畫'), lang: 'zh', kind: '影片搜尋', note: '眼睛成像與眼鏡矯正的動畫。' },
    { t: 'YouTube：天天戶外120 護眼', url: YT('天天戶外120 護眼 近視'), lang: 'zh', kind: '影片搜尋', note: '國健署與教育部的近視防治宣導。' },
  ],
  t8: [
    { t: 'PhET 互動模擬：色覺（Color Vision）', url: 'https://phet.colorado.edu/sims/html/color-vision/latest/color-vision_zh_TW.html', lang: 'sim', kind: '模擬', note: '用紅、綠、藍三盞燈混色，也可以加濾光片。' },
    { t: 'YouTube：彩虹 形成 原理', url: YT('彩虹 形成 原理 42度'), lang: 'zh', kind: '影片搜尋', note: '彩虹的形成。' },
  ],
  t9: [
    { t: 'PhET 互動模擬：色覺（濾光片）', url: 'https://phet.colorado.edu/sims/html/color-vision/latest/color-vision_zh_TW.html', lang: 'sim', kind: '模擬', note: '切到「單一燈泡」，加上濾光片，看看人眼看到什麼顏色。' },
    { t: 'YouTube：紅光 照射 色紙 實驗', url: YT('色光 照射 色紙 顏色 實驗'), lang: 'zh', kind: '影片搜尋', note: '探討活動 4-4 的實拍影片。' },
  ],
};

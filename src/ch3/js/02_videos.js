/* ===== 影片（2026-10-13 以 YouTube oembed 確認存在；詳見 research/videos.md）=====
   已排除：Walter Lewin 的影片（MIT 已於 2014 年撤下其課程）、重複或非國語/英語的影片 */
const VIDEOS = {
 "t1": [
  {
   "id": "8E6D4B04DN4",
   "title_zh": "功與能 1 功的定義",
   "author": "均一教育平台 Junyi Academy",
   "lang": "zh",
   "subs": "",
   "note_zh": "均一老師講解功的定義 W=F×s 與作功條件。上課可作為「推牆為何不作功」的概念先備影片。（片長約 9 分鐘）",
   "start": null
  },
  {
   "id": "jFX9ijjLXY0",
   "title_zh": "功與能 2   功的定義舉例",
   "author": "均一教育平台 Junyi Academy",
   "lang": "zh",
   "subs": "",
   "note_zh": "續集，用生活情境舉例判斷作功與不作功。適合看完定義後讓學生當場判斷。（片長約 4 分鐘）",
   "start": null
  },
  {
   "id": "x6VQ8wOU_Eo",
   "title_zh": "國三上理化 CH3-1 功",
   "author": "王捷自然&自然不難",
   "lang": "zh",
   "subs": "",
   "note_zh": "國三上理化 CH3-1 功，約 8 分鐘，貼合課本章節。可當課前預習或複習。（片長約 9 分鐘）",
   "start": null
  },
  {
   "id": "CX-Lf0iKXDE",
   "title_zh": "108新課綱｜九上理化｜【觀念】功、功率與能量",
   "author": "臺北酷課雲",
   "lang": "zh",
   "subs": "繁中字幕",
   "note_zh": "臺北酷課雲九上理化「功、功率與能量」，有繁中字幕。可作本章總覽。（片長約 8 分鐘）",
   "start": null
  }
 ],
 "t2": [
  {
   "id": "19di_wFcybA",
   "title_zh": "【觀念】功率",
   "author": "均一教育平台 Junyi Academy",
   "lang": "zh",
   "subs": "繁中字幕",
   "note_zh": "均一觀念影片，說明功率意義與 P=W/t 及單位瓦特。上課可銜接計算題。（片長約 6 分鐘）",
   "start": null
  },
  {
   "id": "2puOnJwuKPU",
   "title_zh": "功率是被瓦特定義的？蒸汽機和馬怎麼比較作功大小？（上）",
   "author": "LIS 情境科學教材",
   "lang": "zh",
   "subs": "繁中字幕",
   "note_zh": "LIS 情境科學教材以瓦特故事講馬力與功率的由來，有繁中字幕。適合導入「為什麼要定義功率」。（片長約 7 分鐘）",
   "start": null
  },
  {
   "id": "xLV59ghalKo",
   "title_zh": "功率是被瓦特定義的？蒸汽機和馬怎麼比較作功大小？（下）",
   "author": "LIS 情境科學教材",
   "lang": "zh",
   "subs": "",
   "note_zh": "瓦特故事下集，接續馬力與功率單位。可與上集連看。（片長約 7 分鐘）",
   "start": null
  },
  {
   "id": "S4O5voOCqAQ",
   "title_zh": "奧運自由車選手 vs 烤麵包機：他能供電嗎？",
   "author": "The Toaster Challenge",
   "lang": "en",
   "subs": "可開自動翻譯字幕",
   "note_zh": "奧運短道衝刺選手 Förstemann 踩車想供應 700 W 烤麵包機，直觀感受人體功率有限。注意：網路上有人質疑實際供電方式，宜當功率概念示意而非嚴謹實驗。（片長約 3 分鐘） ⚠️ 網路上有人質疑影片中的烤麵包機其實接著市電，請當成「人體功率有限」的概念示意。",
   "start": null
  }
 ],
 "t3": [
  {
   "id": "7-3dXrekruI",
   "title_zh": "108新課綱｜九上理化｜【觀念】動能與位能",
   "author": "臺北酷課雲",
   "lang": "zh",
   "subs": "繁中字幕",
   "note_zh": "臺北酷課雲九上理化動能與位能觀念，有繁中字幕。可講 Ek=½mv² 並對照速度平方的影響。（片長約 10 分鐘）",
   "start": null
  },
  {
   "id": "6Z-8XA4r8mc",
   "title_zh": "【李永樂老師】兩輛車 60km/h 對撞，和一輛車 120km/h 撞牆，效果一樣嗎？",
   "author": "李永乐老师",
   "lang": "zh-cn",
   "subs": "簡中字幕",
   "note_zh": "簡體中文。李永樂老師分析對撞的能量與動量，適合延伸討論速度與撞擊，內容較深可只取部分。（片長約 16 分鐘）",
   "start": null
  },
  {
   "id": "9Psl0uVsNEk",
   "title_zh": "如果有史以來最嚴重的小行星明天撞擊地球【中文字幕】｜大膽科學",
   "author": "大膽科學 - What If Chinese",
   "lang": "zh",
   "subs": "",
   "note_zh": "大膽科學中文字幕版，假設最嚴重的小行星撞地球，可串連高速物體動能極大的直覺。偏科普情境，非計算。（片長約 8 分鐘）",
   "start": null
  },
  {
   "id": "ZmO_J-_N_8Q",
   "title_zh": "0.50 口徑子彈 vs 防彈玻璃 超慢動作（Smarter Every Day 187）",
   "author": "SmarterEveryDay",
   "lang": "en",
   "subs": "可開自動翻譯字幕",
   "note_zh": "高速攝影看子彈撞擊防彈玻璃，呈現高速物體的撞擊效果。英文為主，可開字幕。（片長約 9 分鐘）",
   "start": null
  }
 ],
 "t4": [
  {
   "id": "HPaQtCFqf1c",
   "title_zh": "【113學測物理】26、27單選：安全帶及安全氣囊的作用方式",
   "author": "吳旭明x蔡佳玲-物理學習網",
   "lang": "zh",
   "subs": "",
   "note_zh": "113 學測題解說安全帶與安全氣囊如何延長作用時間、減小撞擊力。高中觀點，可取概念部分。（片長約 3 分鐘）",
   "start": null
  },
  {
   "id": "dAEQiNT-7tY",
   "title_zh": "【科普2021】汽車的安全氣囊是什麼原理？",
   "author": "万万没想到",
   "lang": "zh-cn",
   "subs": "簡中字幕",
   "note_zh": "簡體中文。說明安全氣囊原理與彈出條件，約 2.5 分鐘，適合課堂短播。（片長約 3 分鐘）",
   "start": null
  },
  {
   "id": "nsnyl8llfH4",
   "title_zh": "第一名的雞蛋掉落專案點子——用科學",
   "author": "Mark Rober",
   "lang": "en",
   "subs": "簡中字幕",
   "note_zh": "Mark Rober 用物理原理設計護蛋裝置，講緩衝減小衝擊力，有中文字幕選項。可作為學生動手前導。（片長約 10 分鐘）",
   "start": null
  },
  {
   "id": "qZuevBc93tY",
   "title_zh": "會破嗎？雞蛋掉落物理",
   "author": "TAMU Physics & Astronomy",
   "lang": "en",
   "subs": "可開自動翻譯字幕",
   "note_zh": "TAMU 物理系短片，約 1 分鐘，展示雞蛋落在不同情境的結果。可快速示範緩衝概念。（片長約 1 分鐘）",
   "start": null
  }
 ],
 "t5": [
  {
   "id": "DauDShMcWxI",
   "title_zh": "直擊山洞裡的巨型抽蓄機組！明潭發電廠探秘 利用日月潭與明潭水庫高低落差反覆抽蓄發電 有如\"天然大型儲能電池\"｜記者 陳以嘉 莊庭豪｜【POWER心動力】20230429｜三立新聞台",
   "author": "三立新聞LIVE",
   "lang": "zh",
   "subs": "",
   "note_zh": "三立新聞實地探訪明潭抽蓄機組，說明高低水庫落差反覆抽蓄發電。上課可連結位能儲存能量。（片長約 5 分鐘）",
   "start": null
  },
  {
   "id": "HCxhjiOP8DI",
   "title_zh": "全球第9大抽蓄水力發電廠! 明潭1滴水發N次電 年供74萬家戶所需 尖峰負載關頭還扮救火隊｜非凡財經新聞｜20230822",
   "author": "USTV 非凡電視",
   "lang": "zh",
   "subs": "",
   "note_zh": "非凡新聞介紹明潭抽蓄電廠規模與用電尖峰角色。與上支互補。（片長約 4 分鐘）",
   "start": null
  },
  {
   "id": "E-m7Psbuup0",
   "title_zh": "抽蓄水力發電解說",
   "author": "saVRee",
   "lang": "en",
   "subs": "可開自動翻譯字幕",
   "note_zh": "saVRee 動畫解說抽蓄水力如何以位能儲能，可開字幕。（片長約 5 分鐘）",
   "start": null
  },
  {
   "id": "7CEW2f7F7ZY",
   "title_zh": "高空墜物會造成多大傷害？通過物理學實驗告訴你",
   "author": "妈咪说MommyTalk",
   "lang": "zh-cn",
   "subs": "簡中字幕",
   "note_zh": "簡體中文。以實驗討論高空墜物的威力，約 10 分鐘，可連到重力位能轉動能與安全教育。（片長約 10 分鐘）",
   "start": null
  },
  {
   "id": "8u2WT_TDA48",
   "title_zh": "打樁機示範（布朗大學物理示範）",
   "author": "Brown Physics Demos",
   "lang": "en",
   "subs": "可開自動翻譯字幕",
   "note_zh": "約 1 分鐘打樁機示範，重物從高處落下撞擊。可直觀對應位能轉動能做功。（片長約 1 分鐘）",
   "start": null
  },
  {
   "id": "Q_ek1DlQXl4",
   "title_zh": "國三上理化 CH3-3 重力位能",
   "author": "王捷自然&自然不難",
   "lang": "zh",
   "subs": "",
   "note_zh": "國三上理化 CH3-3 重力位能，貼合課本。（片長約 6 分鐘）",
   "start": null
  }
 ],
 "t6": [
  {
   "id": "89OduOlMc0M",
   "title_zh": "十字弓 2500 幀慢動作（Slow Mo Guys）",
   "author": "The Slow Mo Guys",
   "lang": "en",
   "subs": "",
   "note_zh": "約 3 分鐘，高速攝影看弓弦釋放與箭飛出，可對應彈力位能轉動能。（片長約 3 分鐘）",
   "start": null
  },
  {
   "id": "JbtqLM9kZVs",
   "title_zh": "驚人的射箭慢動作：高速攝影精選",
   "author": "World Archery",
   "lang": "en",
   "subs": "可開自動翻譯字幕",
   "note_zh": "世界射箭總會官方約半分鐘，看弓與箭的形變。適合課堂快速播放。（片長約 1 分鐘）",
   "start": null
  },
  {
   "id": "COerd1CYvxU",
   "title_zh": "撐竿跳的物理（LSU）",
   "author": "LSU",
   "lang": "en",
   "subs": "可開自動翻譯字幕",
   "note_zh": "LSU 約 2.5 分鐘，從物理角度說明撐竿跳。可連結動能轉彈力位能再轉重力位能。（片長約 3 分鐘）",
   "start": null
  },
  {
   "id": "7Y2dcdGsLNg",
   "title_zh": "與世界紀錄保持者 Duplantis 的撐竿跳慢動作",
   "author": "Brennan Robideaux",
   "lang": "en",
   "subs": "",
   "note_zh": "約 50 秒慢動作，看竿彈曲與回彈。僅畫面示範，需自行口頭補充能量轉換。（片長約 1 分鐘）",
   "start": null
  },
  {
   "id": "5aX_Y86aFgo",
   "title_zh": "彈力位能",
   "author": "均一教育平台 Junyi Academy",
   "lang": "zh",
   "subs": "繁中字幕",
   "note_zh": "均一彈力位能講解，有繁中字幕，可在看完慢動作後正式說明概念。（片長約 7 分鐘）",
   "start": null
  }
 ],
 "t7": [
  {
   "id": "VHmcf5HX2Y4",
   "title_zh": "完整版〉雲霄飛車沒有引擎，為什麼能衝過好幾座山？3D 看懂力學能守恆｜九上理化 功與能",
   "author": "小豬玉的每日知識",
   "lang": "zh",
   "subs": "繁中字幕",
   "note_zh": "小豬玉用 3D 解釋雲霄飛車沒有引擎仍能衝過山的力學能守恆，標示九上理化。有繁中字幕，貼近課本。（片長約 7 分鐘）",
   "start": null
  },
  {
   "id": "KosXRYs7Ohw",
   "title_zh": "【舜吉自然】《國三理化》雲霄飛車的力學能守恆(NHK實驗影片)",
   "author": "順其?!自然",
   "lang": "zh",
   "subs": "",
   "note_zh": "順其自然老師介紹 NHK 雲霄飛車力學能守恆實驗影片。約 4.7 分鐘。（片長約 5 分鐘）",
   "start": null
  },
  {
   "id": "NWs2BR98QKI",
   "title_zh": "[看動畫學物理]  你會盪鞦韆嗎",
   "author": "潘冠錡老師的好好玩物理網",
   "lang": "zh",
   "subs": "繁中字幕",
   "note_zh": "潘冠錡老師動畫談如何盪鞦韆，有繁中字幕，可連結能量轉換與做功補能。（片長約 4 分鐘）",
   "start": null
  }
 ],
 "t8": [
  {
   "id": "bf7HDp23dqY",
   "title_zh": "能量轉換是從看海悟出來？能量守恆又是什麼？（上）│能量守恆│科學家的故事－焦耳│LIS情境科學教材",
   "author": "LIS 情境科學教材",
   "lang": "zh",
   "subs": "",
   "note_zh": "LIS 以焦耳故事介紹能量轉換與能量守恆（上），約 6 分鐘。（片長約 6 分鐘）",
   "start": null
  },
  {
   "id": "8sB3E7h7Oh0",
   "title_zh": "能量轉換是從看海悟出來？能量守恆又是什麼？（下）│能量守恆│科學家的故事－焦耳│LIS情境科學教材（重新上傳）",
   "author": "LIS 情境科學教材",
   "lang": "zh",
   "subs": "",
   "note_zh": "焦耳故事（下），續談能量守恆。可與上集連看。（片長約 7 分鐘）",
   "start": null
  },
  {
   "id": "m17loCpCQOQ",
   "title_zh": "【自然系列-物理 | 能量】(熱功當量) 佛系科學家 焦耳【part1】",
   "author": "LIS 情境科學教材",
   "lang": "zh",
   "subs": "",
   "note_zh": "LIS 佛系科學家焦耳 part1，介紹熱功當量。若有 part2 可續看。（片長約 6 分鐘）",
   "start": null
  },
  {
   "id": "oP5ET5uxPow",
   "title_zh": "焦耳槳輪實驗的歷史教學影片",
   "author": "HistoLab_EUF",
   "lang": "en",
   "subs": "可開自動翻譯字幕",
   "note_zh": "約 4.7 分鐘，呈現焦耳槳輪實驗裝置如何把重物下落轉成水溫上升。英文字幕，可只截取示範部分。（片長約 5 分鐘）",
   "start": null
  },
  {
   "id": "GHCc9b2phn0",
   "title_zh": "能量總是守恆嗎？",
   "author": "Physics Girl",
   "lang": "en",
   "subs": "可開自動翻譯字幕",
   "note_zh": "Physics Girl 約 6 分鐘談能量守恆，偏進階，可做延伸。（片長約 6 分鐘）",
   "start": null
  }
 ],
 "t9": [
  {
   "id": "SdR3mzHjUUQ",
   "title_zh": "【再生能源知多少】 風力發電",
   "author": "台電影音網",
   "lang": "zh",
   "subs": "",
   "note_zh": "台電再生能源知多少，風力發電篇，約 4.5 分鐘。（片長約 5 分鐘）",
   "start": null
  },
  {
   "id": "PcKzeUrgwxs",
   "title_zh": "【再生能源知多少】 太陽能發電",
   "author": "台電影音網",
   "lang": "zh",
   "subs": "",
   "note_zh": "台電再生能源知多少，太陽能篇，約 2.4 分鐘。（片長約 2 分鐘）",
   "start": null
  },
  {
   "id": "FtALJzr208M",
   "title_zh": "【再生能源知多少】 水力發電",
   "author": "台電影音網",
   "lang": "zh",
   "subs": "",
   "note_zh": "台電再生能源知多少，水力發電篇，約 2 分鐘。（片長約 2 分鐘）",
   "start": null
  },
  {
   "id": "YU3WGWsoEHQ",
   "title_zh": "一片烏雲就能讓太陽能系統崩潰？太陽能發電其實不簡單？ ft. 經濟部能源署",
   "author": "PanSci 泛科學",
   "lang": "zh",
   "subs": "簡中字幕",
   "note_zh": "泛科學與經濟部能源署合作，談太陽能發電的穩定供電問題，有中文字幕。（片長約 9 分鐘）",
   "start": null
  },
  {
   "id": "16qOzp-HllM",
   "title_zh": "那麼大的風力發電機怎麼蓋？綠能要怎麼做才能穩定供電？｜Taiwan Keywords EP1 (ft.徐文科、溫茂庭、賴佑侖)",
   "author": "PanSci 泛科學",
   "lang": "zh",
   "subs": "簡中字幕",
   "note_zh": "泛科學 Taiwan Keywords，談台灣大型風機如何建置與穩定供電，約 16 分鐘，可選段觀看。（片長約 16 分鐘）",
   "start": null
  },
  {
   "id": "OympZW70JuE",
   "title_zh": "全台離岸風機建置完成500座 能源署：持續擴大綠能建設｜20260615 公視晚間新聞",
   "author": "公視新聞網",
   "lang": "zh",
   "subs": "",
   "note_zh": "公視新聞報導全台離岸風機建置 500 座（2026-06-15），約 2.5 分鐘，可用作時事資料。（片長約 2 分鐘）",
   "start": null
  },
  {
   "id": "K7NjIXgj57s",
   "title_zh": "【觀念】核能、核電PART 1",
   "author": "均一教育平台 Junyi Academy",
   "lang": "zh",
   "subs": "",
   "note_zh": "均一核能發電觀念 Part 1，約 7 分鐘。（片長約 7 分鐘）",
   "start": null
  }
 ],
 "t10": [
  {
   "id": "0lnnLlvxd8o",
   "title_zh": "九年級上學期_3-4簡單機械-斜面原理",
   "author": "黃俊閔",
   "lang": "zh",
   "subs": "",
   "note_zh": "九年級上學期斜面原理講解，約 3.5 分鐘。（片長約 4 分鐘）",
   "start": null
  },
  {
   "id": "mTQvaNFDER8",
   "title_zh": "104學年國三理化＿簡單機械12：斜面、楔形或劈",
   "author": "蘭雅理化地科",
   "lang": "zh",
   "subs": "",
   "note_zh": "蘭雅理化地科斜面、楔形說明，約 6 分鐘。（片長約 6 分鐘）",
   "start": null
  },
  {
   "id": "_0H99WsVK_Q",
   "title_zh": "【TRY科學】20210922 - 小螺絲 栓出大世界,斜面與螺旋,力矩與轉動,簡單機械",
   "author": "大愛電視 Tzu Chi DaAiVideo",
   "lang": "zh",
   "subs": "",
   "note_zh": "大愛 TRY 科學，探討斜面與螺旋，片長 24 分鐘，建議選段觀看，細節時間未確認。（片長約 24 分鐘）",
   "start": null
  },
  {
   "id": "fHzWA9GLAkc",
   "title_zh": "阿基米德螺旋：運作模型",
   "author": "Ravindra Godbole",
   "lang": "en",
   "subs": "可開自動翻譯字幕",
   "note_zh": "約 4 分鐘阿基米德螺旋模型示範。注意字幕只有印地語，需自行口頭說明。（片長約 4 分鐘）",
   "start": null
  }
 ],
 "t11": [
  {
   "id": "Y9d7RgxYCHY",
   "title_zh": "15 槓桿的應用",
   "author": "均一教育平台 Junyi Academy",
   "lang": "zh",
   "subs": "",
   "note_zh": "均一槓桿的應用，約 3 分鐘，生活槓桿實例。（片長約 3 分鐘）",
   "start": null
  },
  {
   "id": "BXNknQbxzy0",
   "title_zh": "16 阿基米德",
   "author": "均一教育平台 Junyi Academy",
   "lang": "zh",
   "subs": "",
   "note_zh": "均一介紹阿基米德，約 3.8 分鐘。（片長約 4 分鐘）",
   "start": null
  },
  {
   "id": "YlYEi0PgG1g",
   "title_zh": "槓桿中的強力數學",
   "author": "TED-Ed",
   "lang": "en",
   "subs": "繁中字幕",
   "note_zh": "TED-Ed 動畫講槓桿原理，約 4.8 分鐘，有繁中字幕。（片長約 5 分鐘）",
   "start": null
  },
  {
   "id": "YQ32qaec7Ys",
   "title_zh": "[ 科學與科技 ] 如何變成大力士：簡單機械槓桿",
   "author": "有夠好。就是要讓你懂",
   "lang": "zh",
   "subs": "繁中字幕",
   "note_zh": "有夠好系列「如何變成大力士：槓桿」，有繁中字幕，約 7.5 分鐘。（片長約 7 分鐘）",
   "start": null
  },
  {
   "id": "Byk_PYkl0k4",
   "title_zh": "【生活裡的科學】20131123 - 撐起世界的槓桿原理",
   "author": "大愛電視 Tzu Chi DaAiVideo",
   "lang": "zh",
   "subs": "",
   "note_zh": "大愛生活裡的科學：撐起世界的槓桿原理，片長 24 分鐘，建議選段觀看。（片長約 24 分鐘）",
   "start": null
  }
 ],
 "t12": [
  {
   "id": "G3afN0KsB6Y",
   "title_zh": "106學年國三理化＿簡單機械08：滑輪、定滑輪、動滑輪、滑輪組",
   "author": "蘭雅理化地科",
   "lang": "zh",
   "subs": "",
   "note_zh": "蘭雅理化地科滑輪、定滑輪、動滑輪與滑輪組講解，約 5.4 分鐘。（片長約 5 分鐘）",
   "start": null
  },
  {
   "id": "UmFoJfIR5u0",
   "title_zh": "23 動手做：動滑輪實驗",
   "author": "均一教育平台 Junyi Academy",
   "lang": "zh",
   "subs": "",
   "note_zh": "均一動手做動滑輪實驗，約 2 分鐘。（片長約 2 分鐘）",
   "start": null
  },
  {
   "id": "7dbURxMpk_w",
   "title_zh": "19 輪軸的應用",
   "author": "均一教育平台 Junyi Academy",
   "lang": "zh",
   "subs": "",
   "note_zh": "均一輪軸的應用，約 2.6 分鐘。（片長約 3 分鐘）",
   "start": null
  },
  {
   "id": "fPDZVhgJ1_s",
   "title_zh": "[ 科學與科技 ] 如何變成大力士：簡單機械輪軸",
   "author": "有夠好。就是要讓你懂",
   "lang": "zh",
   "subs": "繁中字幕",
   "note_zh": "有夠好系列「如何變成大力士：輪軸」，有繁中字幕。（片長約 5 分鐘）",
   "start": null
  },
  {
   "id": "XT-ZqaZ3ri0",
   "title_zh": "簡單機械：滑輪與滑輪組",
   "author": "CroomPhysics",
   "lang": "en",
   "subs": "可開自動翻譯字幕",
   "note_zh": "CroomPhysics 約 8 分鐘講解滑輪組與機械利益。（片長約 8 分鐘）",
   "start": null
  },
  {
   "id": "M2w3NZzPwOM",
   "title_zh": "為什麼 snatch block 這麼棒（滑輪原理）",
   "author": "SmarterEveryDay",
   "lang": "en",
   "subs": "可開自動翻譯字幕",
   "note_zh": "Smarter Every Day 228，約 16.5 分鐘，以實作展示滑輪省力。（片長約 17 分鐘）",
   "start": null
  },
  {
   "id": "n3kS4RlaxWk",
   "title_zh": "用繩索與滑輪組救援車輛 9:1",
   "author": "homesteadprepper",
   "lang": "en",
   "subs": "可開自動翻譯字幕",
   "note_zh": "示範以滑輪組拖動車輛，貼近「拉起汽車」的畫面。非科普頻道，需先看過再用。（片長約 11 分鐘）",
   "start": null
  }
 ],
 "t13": [
  {
   "id": "gHCDeM41NHY",
   "title_zh": "一口氣搞懂「螺絲」的前世今生！曾是農業用品？標示怎麼看？",
   "author": "AddMaker 加點製造",
   "lang": "zh",
   "subs": "",
   "note_zh": "AddMaker 解說螺絲的前世今生，約 10.8 分鐘。（片長約 11 分鐘）",
   "start": null
  },
  {
   "id": "nB_CCNCuyGQ",
   "title_zh": "一顆螺絲，兩個世界！螺絲為什麼不能統一？",
   "author": "黑猫研究院",
   "lang": "zh",
   "subs": "繁中字幕",
   "note_zh": "黑貓研究院談螺絲為何不能統一，有繁中字幕，約 15.7 分鐘。（片長約 16 分鐘）",
   "start": null
  },
  {
   "id": "-Lr-8AEoCK8",
   "title_zh": "你知道螺絲是怎麼做的嗎？帶你看螺絲工廠的工作日常，原來螺絲還可以客製化｜我在工場拍拍手｜EP14 缺一不可的存在 螺絲｜公視+免費收看",
   "author": "公視+",
   "lang": "zh",
   "subs": "",
   "note_zh": "公視+ 帶看螺絲工廠製作過程，約 3.7 分鐘。（片長約 4 分鐘）",
   "start": null
  },
  {
   "id": "yzMU8rH4PN8",
   "title_zh": "螺絲從哪裡來？",
   "author": "Machine Thinking",
   "lang": "en",
   "subs": "可開自動翻譯字幕",
   "note_zh": "Machine Thinking 約 18.5 分鐘，偏歷史，建議選段。（片長約 19 分鐘）",
   "start": null
  },
  {
   "id": "wQKQX8wZ_I4",
   "title_zh": "20250405槓桿原理 開瓶器",
   "author": "黃俊維",
   "lang": "zh",
   "subs": "",
   "note_zh": "開瓶器的槓桿原理示範，約 3.5 分鐘。（片長約 4 分鐘）",
   "start": null
  }
 ]
};

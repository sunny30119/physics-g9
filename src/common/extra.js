/* =====================================================================
   理化版新增元件
   - 例題一步一步揭曉 .example
   - 隨堂筆記點空格 .fill
   - 學習 Check 自我檢查 .selfcheck（勾選會記在這台裝置的瀏覽器）
   - 時間軸 mountTimeline()
   - 能量長條圖 ebars()
   ===================================================================== */

/* 例題：<div class="card example"> 裡放 .q、<ol class="sol"><li>…</li></ol>、<div class="ansbox"> */
function mountExample(host) {
  const steps = $$('ol.sol li', host), ans = $('.ansbox', host);
  const row = document.createElement('div'); row.className = 'btnrow'; row.style.marginTop = '8px';
  row.innerHTML = `<button class="btn">下一步 ▶</button><button class="btn ghost">全部顯示</button><button class="btn ghost">↺ 重來</button>`;
  host.appendChild(row);
  const [next, all, reset] = $$('button', row);
  let k = 0;
  const upd = () => {
    steps.forEach((s, i) => s.classList.toggle('show', i < k));
    if (ans) ans.classList.toggle('show', k > steps.length - 1 && k >= steps.length);
    next.disabled = k >= steps.length;
    next.style.opacity = next.disabled ? .4 : 1;
  };
  next.onclick = () => { k = Math.min(steps.length, k + 1); upd(); };
  all.onclick = () => { k = steps.length; upd(); };
  reset.onclick = () => { k = 0; upd(); };
  upd();
}

/* 隨堂筆記：<span class="fill" data-a="答案"></span>；卡片 .notes 會多一顆「全部顯示」 */
function mountFills() {
  $$('.fill').forEach(f => {
    f.textContent = f.dataset.a;
    f.title = '點一下看答案';
    f.onclick = () => f.classList.toggle('show');
  });
  $$('.notes').forEach(n => {
    const fs = $$('.fill', n); if (!fs.length) return;
    const row = document.createElement('div'); row.className = 'btnrow'; row.style.marginTop = '8px';
    row.innerHTML = `<button class="btn ghost">👀 全部顯示</button><button class="btn ghost">🙈 全部藏起來</button>`;
    const [a, b] = $$('button', row);
    a.onclick = () => fs.forEach(f => f.classList.add('show'));
    b.onclick = () => fs.forEach(f => f.classList.remove('show'));
    n.appendChild(row);
  });
}

/* 學習 Check：<ul class="selfcheck" data-key="3-1"><li>我了解…</li></ul> */
function mountSelfcheck() {
  $$('.selfcheck').forEach(ul => {
    const key = 'chk-' + ul.dataset.key;
    const saved = store.get()[key] || [];
    $$('li', ul).forEach((li, i) => {
      const txt = li.innerHTML;
      li.innerHTML = `<label><input type="checkbox"><span>${txt}</span></label>`;
      const cb = $('input', li);
      cb.checked = !!saved[i];
      li.classList.toggle('done', cb.checked);
      cb.onchange = () => {
        const arr = store.get()[key] || [];
        arr[i] = cb.checked; store.set({ [key]: arr });
        li.classList.toggle('done', cb.checked);
      };
    });
  });
}

/* 時間軸：資料是 [{yr, face, nm, sm, txt}] */
function mountTimeline(host, items) {
  host.innerHTML = `<div class="timeline">${items.map((e, i) => `<button class="ev" data-i="${i}">
    <div class="face">${e.face}</div><div class="yr">${e.yr}</div><div class="nm">${e.nm}</div><div class="sm">${e.sm}</div></button>`).join('')}</div>
    <div class="tl-detail note">👆 點一張卡片，看這位科學家做了什麼。可以左右滑動。</div>`;
  const det = $('.tl-detail', host);
  $$('.ev', host).forEach(b => b.onclick = () => {
    $$('.ev', host).forEach(x => x.classList.toggle('on', x === b));
    const e = items[+b.dataset.i];
    det.classList.remove('note');
    det.innerHTML = `<b>${e.yr}｜${e.nm}</b><br>${e.txt}`;
  });
}

/* 能量長條圖：items = [{name, val, color}]，max = 長條滿格的值 */
function ebars(ctx, x, y, w, h, items, max, opt = {}) {
  const n = items.length, gap = 10, bw = (w - gap * (n - 1)) / n;
  ctx.save();
  ctx.fillStyle = opt.bg || 'rgba(255,255,255,.85)'; rrect(ctx, x - 8, y - 26, w + 16, h + 52, 8); ctx.fill();
  if (opt.title) label(ctx, opt.title, x + w / 2, y - 13, { align: 'center', size: 13, bold: true });
  items.forEach((it, i) => {
    const bx = x + i * (bw + gap);
    ctx.fillStyle = '#E4E8EE'; ctx.fillRect(bx, y, bw, h);
    const v = Math.max(0, it.val), hh = Math.min(h, h * v / (max || 1));
    ctx.fillStyle = it.color; ctx.fillRect(bx, y + h - hh, bw, hh);
    if (it.val < -1e-9) { ctx.fillStyle = it.color; ctx.globalAlpha = .4; ctx.fillRect(bx, y + h, bw, Math.min(20, h * -it.val / max)); ctx.globalAlpha = 1; }
    label(ctx, it.name, bx + bw / 2, y + h + 12, { align: 'center', size: 13 });
    if (opt.vals !== false) label(ctx, fmt(it.val, opt.d ?? 0) + (opt.unit ?? ' J'), bx + bw / 2, y + h - hh - 10, { align: 'center', size: 13, bold: true, color: '#333' });
  });
  ctx.restore();
}

/* 畫一個箱子（可加文字） */
function box(ctx, x, y, w, h, color = '#C8956A', txt = '') {
  ctx.save();
  ctx.fillStyle = color; rrect(ctx, x, y, w, h, 4); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.5; ctx.stroke();
  if (txt) label(ctx, txt, x + w / 2, y + h / 2, { align: 'center', size: 13, bold: true, color: '#fff' });
  ctx.restore();
}
/* 地面（可畫斜線表示粗糙） */
function ground(ctx, x1, x2, y, rough = false, color = '#6B7A89') {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
  ctx.lineWidth = 1.2;
  for (let x = x1; x < x2; x += rough ? 9 : 18) { ctx.beginPath(); ctx.moveTo(x, y + 2); ctx.lineTo(x - 7, y + 11); ctx.stroke(); }
  ctx.restore();
}

/* 延伸資源：<div class="res" data-res="t1"></div>，資料在 RES.t1 = [{t, url, lang:'zh'|'en'|'zhsub', note}] */
function mountRes() {
  if (typeof RES === 'undefined') return;
  const LANG = { zh: ['zh', '中文'], en: ['en', '英文'], zhsub: ['zh', '英文・可開中文字幕'], ensub: ['en', '英文・英文字幕'], sim: ['zh', '互動模擬'] };
  $$('[data-res]').forEach(h => {
    const list = RES[h.dataset.res] || [];
    if (!list.length) { h.closest('.card')?.remove(); return; }
    h.innerHTML = list.map(r => { const [c, n] = LANG[r.lang] || ['', r.lang || '']; return `<a href="${r.url}" target="_blank" rel="noopener"><b>${r.t}</b><span class="lang ${c}">${n}</span>${r.kind ? `<span class="lang">${r.kind}</span>` : ''}<small>${r.note}</small></a>`; }).join('');
  });
}

/* 影片：<div class="vids" data-vid="t1"></div>，資料在 VIDEOS.t1 = [{id, title_zh, author, lang, subs, note_zh, start}]
   先顯示縮圖，點了才載入 YouTube 播放器（省流量、離線時也不會卡住） */
function mountVids() {
  $$('[data-vid]').forEach(h => {
    const list = (typeof VIDEOS !== 'undefined' && VIDEOS[h.dataset.vid]) || [];
    if (!list.length) { h.closest('.card')?.remove(); return; }
    h.innerHTML = list.map((v, i) => `<div class="vid" data-i="${i}">
      <div class="thumb" style="background-image:url(https://i.ytimg.com/vi/${v.id}/hqdefault.jpg)"><span class="play">▶</span></div>
      <div class="vmeta"><b>${v.title_zh}</b><small>${v.author}${v.lang === 'en' ? '｜英文' : v.lang === 'zh-cn' ? '｜簡體中文' : ''}${v.subs && v.subs !== '無' ? '｜' + v.subs : ''}</small><p>${v.note_zh}</p>
      <a href="https://www.youtube.com/watch?v=${v.id}${v.start ? '&t=' + v.start + 's' : ''}" target="_blank" rel="noopener">在 YouTube 開啟 ↗</a></div></div>`).join('');
    $$('.vid .thumb', h).forEach(th => th.onclick = () => {
      const v = list[+th.closest('.vid').dataset.i];
      th.outerHTML = `<div class="thumb"><iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0${v.start ? '&start=' + v.start : ''}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="${v.title_zh}"></iframe></div>`;
    });
  });
}

/* 分頁列：◀ ▶ 按鈕、滑鼠滾輪左右捲動 */
function mountTabScroll() {
  const nav = document.getElementById('tabNav'), L = document.getElementById('tabL'), R = document.getElementById('tabR');
  if (!nav || !L || !R) return;
  const upd = () => { L.disabled = nav.scrollLeft <= 2; R.disabled = nav.scrollLeft + nav.clientWidth >= nav.scrollWidth - 2; };
  L.onclick = () => nav.scrollBy({ left: -nav.clientWidth * 0.7, behavior: 'smooth' });
  R.onclick = () => nav.scrollBy({ left: nav.clientWidth * 0.7, behavior: 'smooth' });
  nav.addEventListener('wheel', e => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { nav.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });
  nav.addEventListener('scroll', upd); window.addEventListener('resize', upd); upd();
}

function bootExtra() {
  mountTabScroll();
  mountRes();
  mountVids();
  $$('.example').forEach(mountExample);
  mountFills();
  mountSelfcheck();
  if (typeof TIMELINE !== 'undefined') $$('[data-timeline]').forEach(h => mountTimeline(h, TIMELINE));
}

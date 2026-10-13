/* ===== 分頁 14：練習場 =====
   題庫 QBANK（由 src/make_qbank.py 從 research/*.json 產生）：
   單題 {id, src, sec, topic, back, lv, type:'mc'|'num', q, opts, ans, tol, unit, exp, myth, fig}
   題組 {id, src, sec, topic, back, lv, type:'group', stem, fig, sub:[{id, q, opts, ans, exp, myth, fig}]}
   作答紀錄 store.qa[id] = {n 作答次數, c 答對次數, last 最近一次是否答對} */
(() => {
  const body = document.getElementById('c3qBody'); if (!body || typeof QBANK === 'undefined') return;
  const L = 'ABCD';
  const SECN = { '3-1': '3-1 功與功率', '3-2': '3-2 動能與位能', '3-3': '3-3 能量守恆與能源', '3-4': '3-4 簡單機械' };
  const TABN = { t1: '功', t2: '功率', t3: '動能', t4: '功與動能變化', t5: '重力位能', t6: '彈力位能', t7: '力學能守恆', t8: '能量守恆', t9: '能源', t10: '斜面', t11: '槓桿', t12: '滑輪與輪軸' };
  let mode = 'prac';
  const sel = id => $$(`#${id} .chip.on`).map(c => c.dataset.v);
  const qa = () => store.get().qa || {};
  const saveQa = (id, ok) => { const all = qa(); const r = all[id] || { n: 0, c: 0 }; r.n++; if (ok) r.c++; r.last = ok; all[id] = r; store.set({ qa: all }); stat(); };
  const items = () => QBANK.flatMap(q => q.type === 'group' ? q.sub.map(s => s.id) : [q.id]);
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function pool() {
    const secs = sel('c3qSec'), lvs = sel('c3qLv').map(Number), src = sel('c3qSrc')[0] || 'all';
    return QBANK.filter(q => secs.includes(q.sec) && lvs.includes(q.lv) && (src === 'all' || (src === 'cap') === q.src.includes('會考')));
  }
  const nItems = list => list.reduce((s, q) => s + (q.type === 'group' ? q.sub.length : 1), 0);
  function stat() {
    const r = qa(), el = document.getElementById('c3qStat');
    el.innerHTML = Object.entries(SECN).map(([s, n]) => {
      const ids = QBANK.filter(q => q.sec === s).flatMap(q => q.type === 'group' ? q.sub.map(x => x.id) : [q.id]);
      const done = ids.filter(i => r[i]), right = done.filter(i => r[i].last);
      return `<div><span>${n}</span><b>${done.length} / ${ids.length} 題</b><span>${done.length ? '最近答對率 ' + Math.round(right.length / done.length * 100) + '%' : '還沒開始'}</span></div>`;
    }).join('') + `<div><span>📕 錯題本</span><b>${Object.values(r).filter(x => !x.last).length} 題</b><span>&nbsp;</span></div>`;
  }
  function count() { const p = pool(); document.getElementById('c3qCount').textContent = `符合條件：${p.length} 道（共 ${nItems(p)} 小題）`; }

  /* ---------- 一題的 HTML（單題或題組小題） ---------- */
  const meta = q => `<div class="qmeta"><span class="tag">${SECN[q.sec] || q.sec}</span><span class="tag">${TABN[q.back] || q.topic}</span><span class="tag">${'⭐'.repeat(q.lv)}</span><span class="tag ${q.src.includes('會考') ? 'cap' : ''}">${q.src}</span></div>`;
  function oneQ(q, k, opt = {}) {
    const fig = q.fig ? `<div class="qfig">${q.fig}</div>` : '';
    const inp = q.type === 'num'
      ? `<div class="numrow"><input type="number" step="any" class="numin" placeholder="填數字"> <span>${q.unit || ''}</span>${opt.quiz ? '' : ' <button class="btn numgo">送出</button>'}</div>`
      : `<div class="opts">${q.opts.map((o, i) => `<button class="opt qopt" data-i="${i}"><span class="letter">${L[i]}</span><span class="t">${o}</span></button>`).join('')}</div>`;
    return `<div class="qitem" data-id="${q.id}">${k ? `<div class="qno">${k}</div>` : ''}<div class="qtext">${q.q}</div>${fig}${inp}<div class="qfb"></div></div>`;
  }
  const isRight = (q, v) => q.type === 'num' ? Math.abs(+v - q.ans) <= (q.tol ?? 0.01) + 1e-9 : +v === q.ans;
  const ansText = q => q.type === 'num' ? `${q.ans} ${q.unit || ''}` : `(${L[q.ans]}) ${q.opts[q.ans]}`;
  function feedback(el, q, v, parent) {
    const ok = isRight(q, v), fb = $('.qfb', el);
    if (q.type === 'mc') $$('.qopt', el).forEach((b, i) => { b.disabled = true; b.classList.add(i === q.ans ? 'right' : (i === +v ? 'wrong' : 'dim')); });
    else { $('.numin', el).disabled = true; const g = $('.numgo', el); if (g) g.remove(); }
    const back = parent?.back || q.back;
    fb.innerHTML = `<div class="callout ${ok ? 'good' : 'warn'}"><b>${ok ? '✔ 答對了！' : '✘ 答錯了'}</b>　正確答案：${ansText(q)}${q.myth ? `<br><span class="mythtag">⚠️ 迷思：${q.myth}</span>` : ''}
      <div class="qexp">💡 ${q.exp}</div>${back ? `<button class="btn ghost goback" data-t="${back}">🔙 回去看「${TABN[back] || back}」的模擬</button>` : ''}</div>`;
    $('.goback', fb)?.addEventListener('click', () => showTab(back));
    return ok;
  }

  /* ---------- 練習模式 ---------- */
  function practice(list, title) {
    let order = shuffle(list), k = 0;
    const show = () => {
      if (!order.length) { body.innerHTML = '<p class="note">這個範圍沒有題目，請調整上面的選項。</p>'; return; }
      if (k >= order.length) { body.innerHTML = `<div class="callout good big">🎉 這一輪 ${order.length} 道題練完了！</div><div class="btnrow" style="margin-top:10px"><button class="btn" id="c3again">再練一輪（重新洗牌）</button></div>`; $('#c3again').onclick = () => practice(list, title); return; }
      const q = order[k];
      const html = q.type === 'group'
        ? `${meta(q)}<div class="qstem">📖 ${q.stem}</div>${q.fig ? `<div class="qfig">${q.fig}</div>` : ''}${q.sub.map((s, i) => oneQ(s, `(${i + 1})`)).join('')}`
        : meta(q) + oneQ(q);
      body.innerHTML = `<div class="note">${title || '練習模式'}｜第 ${k + 1} / ${order.length} 道</div><div class="qcard">${html}</div>
        <div class="btnrow" style="margin-top:10px"><button class="btn" id="c3next">下一題 →</button>${k ? '<button class="btn ghost" id="c3prev">← 上一題</button>' : ''}</div>`;
      const subs = q.type === 'group' ? q.sub : [q];
      $$('.qitem', body).forEach((el, i) => {
        const s = subs[i];
        $$('.qopt', el).forEach(b => b.onclick = () => saveQa(s.id, feedback(el, s, b.dataset.i, q)));
        const go = $('.numgo', el), inp = $('.numin', el);
        if (go) { go.onclick = () => { if (inp.value === '') return; saveQa(s.id, feedback(el, s, inp.value, q)); }; inp.onkeydown = e => { if (e.key === 'Enter') go.click(); }; }
      });
      $('#c3next').onclick = () => { k++; show(); window.scrollTo({ top: body.getBoundingClientRect().top + scrollY - 120 }); };
      $('#c3prev')?.addEventListener('click', () => { k--; show(); });
    };
    show();
  }

  /* ---------- 測驗模式 ---------- */
  function quizSetup() {
    const p = pool();
    body.innerHTML = `<p>從目前範圍（${p.length} 道）隨機抽題，限時作答，交卷後一起檢討。</p>
      <div class="chips" id="c3qN"><button class="chip" data-n="10">10 道</button><button class="chip on" data-n="15">15 道</button><button class="chip" data-n="25">25 道</button></div>
      <div class="btnrow" style="margin-top:10px"><button class="btn warn" id="c3qStart">⏱ 開始測驗</button></div>`;
    $$('#c3qN .chip').forEach(c => c.onclick = () => $$('#c3qN .chip').forEach(x => x.classList.toggle('on', x === c)));
    $('#c3qStart').onclick = () => quiz(shuffle(p).slice(0, +$('#c3qN .chip.on').dataset.n));
  }
  function quiz(list) {
    if (!list.length) { body.innerHTML = '<p class="note">這個範圍沒有題目。</p>'; return; }
    const t0 = Date.now(); let n = 0;
    const html = list.map(q => q.type === 'group'
      ? `<div class="qcard">${meta(q)}<div class="qstem">📖 ${q.stem}</div>${q.fig ? `<div class="qfig">${q.fig}</div>` : ''}${q.sub.map((s, i) => oneQ(s, `${++n}`, { quiz: 1 })).join('')}</div>`
      : `<div class="qcard">${meta(q)}${oneQ(q, `${++n}`, { quiz: 1 })}</div>`).join('');
    body.innerHTML = `<div class="quizbar"><b>⏱ <span id="c3timer">00:00</span></b><span class="note">共 ${n} 題，作答完按最下面的「交卷」</span></div>${html}
      <div class="btnrow" style="margin-top:12px"><button class="btn warn" id="c3submit">📤 交卷</button></div>`;
    const tick = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000), el = document.getElementById('c3timer'); if (!el) return clearInterval(tick); el.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }, 1000);
    $$('.qitem', body).forEach(el => $$('.qopt', el).forEach(b => b.onclick = () => { $$('.qopt', el).forEach(x => x.classList.toggle('picked', x === b)); el.dataset.v = b.dataset.i; }));
    $('#c3submit').onclick = () => {
      clearInterval(tick);
      const flat = list.flatMap(q => q.type === 'group' ? q.sub.map(s => [s, q]) : [[q, q]]);
      let right = 0;
      $$('.qitem', body).forEach((el, i) => {
        const [q, par] = flat[i], v = q.type === 'num' ? $('.numin', el).value : el.dataset.v;
        const ok = v !== undefined && v !== '' && feedback(el, q, v, par);
        if (v === undefined || v === '') { feedback(el, q, -1, par); }
        saveQa(q.id, !!ok); if (ok) right++;
      });
      const s = Math.floor((Date.now() - t0) / 1000);
      $('#c3submit').remove();
      body.insertAdjacentHTML('afterbegin', `<div class="callout good big" id="c3score">成績：${right} / ${flat.length} 題（${Math.round(right / flat.length * 100)} 分）｜用時 ${Math.floor(s / 60)} 分 ${s % 60} 秒<br><span class="note">往下看每題的詳解；答錯的已收進錯題本。</span></div>`);
      window.scrollTo({ top: body.getBoundingClientRect().top + scrollY - 120 });
    };
  }

  /* ---------- 錯題本 ---------- */
  function wrongBook() {
    const r = qa(), wrongIds = new Set(Object.keys(r).filter(i => !r[i].last));
    const list = QBANK.filter(q => q.type === 'group' ? q.sub.some(s => wrongIds.has(s.id)) : wrongIds.has(q.id));
    if (!list.length) { body.innerHTML = '<div class="callout good">📕 錯題本是空的！去「練習模式」或「測驗模式」練幾題吧。</div>'; return; }
    body.innerHTML = `<p>目前有 <b>${wrongIds.size}</b> 題答錯的題目（重新答對就會自動移出錯題本）。</p>
      <div class="btnrow"><button class="btn warn" id="c3wPrac">📖 重練這些錯題</button><button class="btn ghost" id="c3wClr">清空全部作答紀錄</button></div>
      <ul class="wlist">${list.map(q => `<li><b>${TABN[q.back] || q.topic}</b>｜${(q.type === 'group' ? q.stem : q.q).replace(/<[^>]+>/g, '').slice(0, 50)}…</li>`).join('')}</ul>`;
    $('#c3wPrac').onclick = () => practice(list, '📕 錯題重練');
    $('#c3wClr').onclick = () => { if (confirm('確定清空這台裝置上的所有作答紀錄？')) { store.set({ qa: {} }); stat(); wrongBook(); } };
  }

  /* ---------- 產生練習卷 ---------- */
  function printSetup() {
    const p = pool();
    body.innerHTML = `<p>依照上面選的範圍與難度（目前 ${p.length} 道），隨機組成一份練習卷。</p>
      <div class="chips" id="c3pN"><button class="chip" data-n="10">10 道</button><button class="chip on" data-n="20">20 道</button><button class="chip" data-n="30">30 道</button><button class="chip" data-n="999">全部</button></div>
      <label class="note" style="display:block;margin-top:8px"><input type="checkbox" id="c3pExp" checked> 解答頁附上詳解</label>
      <div class="btnrow" style="margin-top:10px"><button class="btn warn" id="c3pGo">📄 產生練習卷（預覽）</button></div>`;
    $$('#c3pN .chip').forEach(c => c.onclick = () => $$('#c3pN .chip').forEach(x => x.classList.toggle('on', x === c)));
    $('#c3pGo').onclick = () => paper(shuffle(p).slice(0, +$('#c3pN .chip.on').dataset.n).sort((a, b) => a.sec.localeCompare(b.sec) || a.lv - b.lv), $('#c3pExp').checked);
  }
  function paper(list, withExp) {
    let n = 0; const ans = [];
    const qhtml = q => { n++; ans.push([n, q]); const opts = q.type === 'num' ? `<div class="pnum">答：__________ ${q.unit || ''}</div>` : `<div class="popts">${q.opts.map((o, i) => `<span>(${L[i]}) ${o}</span>`).join('')}</div>`; return `<div class="pq"><span class="pn">${n}.</span> ${q.q}${q.fig ? `<div class="pfig">${q.fig}</div>` : ''}${opts}</div>`; };
    const body2 = list.map(q => q.type === 'group' ? `<div class="pg"><div class="pstem">◎ 題組（第 ${n + 1}～${n + q.sub.length} 題）：${q.stem}</div>${q.fig ? `<div class="pfig">${q.fig}</div>` : ''}${q.sub.map(qhtml).join('')}</div>` : qhtml(q)).join('');
    const d = new Date(), ds = `${d.getFullYear() - 1911}.${d.getMonth() + 1}.${d.getDate()}`;
    document.getElementById('c3paper').innerHTML = `
      <div class="ppage"><div class="phead"><b>國三理化　第 3 章 功與能　練習卷</b><span>${ds}　範圍：${sel('c3qSec').join('、')}</span></div>
      <div class="pinfo">班級：＿＿＿＿　座號：＿＿＿　姓名：＿＿＿＿＿＿　得分：＿＿＿＿</div>${body2}</div>
      <div class="ppage pbreak"><div class="phead"><b>解答${withExp ? '與詳解' : ''}</b><span>第 3 章 功與能 練習卷</span></div>
      ${withExp ? ans.map(([k, q]) => `<div class="pa"><b>${k}. ${q.type === 'num' ? q.ans + ' ' + (q.unit || '') : '(' + L[q.ans] + ')'}</b>　${q.exp}</div>`).join('') : `<div class="pagrid">${ans.map(([k, q]) => `<span>${k}. ${q.type === 'num' ? q.ans + ' ' + (q.unit || '') : L[q.ans]}</span>`).join('')}</div>`}</div>`;
    const w = document.getElementById('c3paperWrap'); w.style.display = 'block'; w.scrollIntoView({ behavior: 'smooth' });
  }
  document.getElementById('c3paperPrint').onclick = () => { document.body.classList.add('printing'); window.print(); };
  window.addEventListener('afterprint', () => document.body.classList.remove('printing'));
  document.getElementById('c3paperClose').onclick = () => { document.getElementById('c3paperWrap').style.display = 'none'; };

  /* ---------- 介面 ---------- */
  function render() {
    count();
    if (mode === 'prac') practice(pool());
    else if (mode === 'quiz') quizSetup();
    else if (mode === 'wrong') wrongBook();
    else printSetup();
  }
  ['c3qSec', 'c3qLv'].forEach(id => $$(`#${id} .chip`).forEach(c => c.onclick = () => { c.classList.toggle('on'); render(); }));
  $$('#c3qSrc .chip').forEach(c => c.onclick = () => { $$('#c3qSrc .chip').forEach(x => x.classList.toggle('on', x === c)); render(); });
  $$('#c3qMode .chip').forEach(c => c.onclick = () => { mode = c.dataset.m; $$('#c3qMode .chip').forEach(x => x.classList.toggle('on', x === c)); render(); });
  // 下載檔
  const DL = (typeof DOWNLOADS !== 'undefined' ? DOWNLOADS : []);
  const dl = document.getElementById('c3dl');
  if (DL.length) dl.innerHTML = DL.map(f => `<a href="${f.href}" download><b>${f.t}</b><span class="lang">${f.fmt}</span><small>${f.note}</small></a>`).join('');
  else dl.closest('.card').remove();
  stat(); render();
})();

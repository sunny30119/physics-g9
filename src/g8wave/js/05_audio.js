/* ===== 發聲引擎（Web Audio：瀏覽器內建的電子樂器）=====
   - AUD.tone()：持續的音（可改頻率、音量、音色）
   - AUD.ding()：敲一下、會慢慢變小的音（鈴、音叉、回聲）
   - AUD.clap()：拍手／爆裂／雷聲（短噪音）
   - AUD.noise()：持續的噪音
   換分頁時全部自動停止；右上角「🔊」可以整本靜音 */
const AUD = (() => {
  let ac = null, out = null, bus = null, muted = false;   // bus：所有「排程好的短音」（ding、clap）都接在這裡，換分頁時整條拔掉
  const live = new Set();
  function ctx() {
    if (!ac) {
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
      ac = new C();
      const comp = ac.createDynamicsCompressor();   // 防止好幾個聲音疊在一起時爆音
      out = ac.createGain(); out.gain.value = muted ? 0 : 1;
      out.connect(comp); comp.connect(ac.destination);
      bus = ac.createGain(); bus.connect(out);
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  /* 諧波：harm[0] 是基音，harm[1] 是 2 倍頻……（決定音色） */
  function periodic(harm) {
    const a = ctx(), re = new Float32Array(harm.length + 1), im = new Float32Array(harm.length + 1);
    harm.forEach((v, i) => im[i + 1] = v);
    return a.createPeriodicWave(re, im);
  }
  function tone(o = {}) {
    const a = ctx(); if (!a) return null;
    const osc = a.createOscillator(), g = a.createGain();
    g.gain.value = 0; osc.frequency.value = o.freq || 440;
    if (o.harm) osc.setPeriodicWave(periodic(o.harm)); else osc.type = o.type || 'sine';
    osc.connect(g); g.connect(out); osc.start();
    const t = {
      freq(f) { osc.frequency.setTargetAtTime(f, a.currentTime, 0.015); },
      vol(v) { g.gain.setTargetAtTime(Math.max(0, v), a.currentTime, 0.03); },
      wave(h) { if (Array.isArray(h)) osc.setPeriodicWave(periodic(h)); else osc.type = h; },
      stop() { g.gain.setTargetAtTime(0, a.currentTime, 0.03); setTimeout(() => { try { osc.stop(); } catch (e) {} }, 250); live.delete(t); },
    };
    t.vol(o.vol ?? 0.15); live.add(t);
    return t;
  }
  function ding(o = {}) {
    const a = ctx(); if (!a) return;
    const when = a.currentTime + (o.delay || 0), dur = o.dur ?? 0.7, peak = Math.max(0.0002, o.vol ?? 0.25);
    const g = a.createGain(); g.connect(o.dest || bus);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(peak, when + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    const osc = a.createOscillator(); osc.frequency.value = o.freq || 880;
    if (o.harm) osc.setPeriodicWave(periodic(o.harm)); else osc.type = o.type || 'sine';
    osc.connect(g); osc.start(when); osc.stop(when + dur + 0.05);
  }
  function clap(o = {}) {
    const a = ctx(); if (!a) return;
    const when = a.currentTime + (o.delay || 0), dur = o.dur ?? 0.12;
    const buf = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, o.decay ?? 3);
    const src = a.createBufferSource(); src.buffer = buf;
    const g = a.createGain(); g.gain.value = o.vol ?? 0.5;
    let node = src;
    if (o.lowpass) { const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lowpass; src.connect(f); node = f; }
    node.connect(g); g.connect(o.dest || bus); src.start(when);
  }
  function noise(o = {}) {
    const a = ctx(); if (!a) return null;
    const buf = a.createBuffer(1, a.sampleRate * 2, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = a.createBufferSource(); src.buffer = buf; src.loop = true;
    const g = a.createGain(); g.gain.value = 0;
    let node = src;
    if (o.lowpass) { const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lowpass; src.connect(f); node = f; }
    node.connect(g); g.connect(out); src.start();
    const t = {
      vol(v) { g.gain.setTargetAtTime(Math.max(0, v), a.currentTime, 0.03); },
      stop() { g.gain.setTargetAtTime(0, a.currentTime, 0.03); setTimeout(() => { try { src.stop(); } catch (e) {} }, 250); live.delete(t); },
    };
    t.vol(o.vol ?? 0.1); live.add(t);
    return t;
  }
  /* 一組可以單獨取消的排程音（例如雷聲、鞭炮）：group().stop() 只停這一組 */
  function group() { const a = ctx(); if (!a) return { node: null, stop() {} }; const g = a.createGain(); g.connect(bus); return { node: g, stop() { try { g.disconnect(); } catch (e) {} } }; }
  function stopAll() {
    [...live].forEach(t => t.stop()); live.clear();
    if (bus) { bus.disconnect(); bus = ac.createGain(); bus.connect(out); }   // 還沒響的雷聲、回聲也一起取消
    window.dispatchEvent(new Event('audstop'));
  }
  function setMuted(m) {
    muted = m; if (out) out.gain.value = m ? 0 : 1;
    const b = document.getElementById('sndBtn'); if (b) b.textContent = m ? '🔇 聲音關' : '🔊 聲音開';
  }
  return { ctx, tone, ding, clap, noise, group, stopAll, setMuted, get muted() { return muted; }, get now() { return ac ? ac.currentTime : 0; } };
})();

/* 樂器音色（諧波的相對大小；數值是示意，用來聽出「波形不同 → 音色不同」） */
const TIMBRE = {
  pure:     { nm: '純音（音叉）', harm: [1] },
  flute:    { nm: '長笛', harm: [1, 0.35, 0.12, 0.05] },
  clarinet: { nm: '單簧管', harm: [1, 0, 0.55, 0, 0.35, 0, 0.2, 0, 0.1] },
  violin:   { nm: '小提琴', harm: [1, 0.5, 0.33, 0.25, 0.2, 0.17, 0.14, 0.12, 0.1, 0.08] },
  trumpet:  { nm: '小號', harm: [0.6, 1, 0.8, 0.6, 0.45, 0.3, 0.2, 0.12] },
  oboe:     { nm: '雙簧管', harm: [0.4, 0.6, 1, 0.5, 0.35, 0.2, 0.15, 0.1] },
};

/* 換分頁就停掉所有聲音；右上角靜音鍵 */
(() => {
  const _show = showTab;
  showTab = id => { AUD.stopAll(); _show(id); };
  const b = document.getElementById('sndBtn');
  if (b) b.onclick = () => { AUD.setMuted(!AUD.muted); if (AUD.muted) AUD.stopAll(); };
})();

/* ---------- 小測驗：[{q, opts, ans, why}]，點選就對答案（閱讀題、仿會考題用） ---------- */
function mountQuiz(host, items) {
  host.innerHTML = items.map((it, i) => `<div class="qz" data-i="${i}" style="margin:10px 0 14px">
    <div class="q"><b>${i + 1}.</b> ${it.q}</div><div class="vl"></div>
    <div class="reveal callout good">${it.why}</div></div>`).join('');
  $$('.qz', host).forEach(d => {
    const it = items[+d.dataset.i];
    const v = voteList($('.vl', d), it.opts, () => { v.reveal(it.ans); $('.reveal', d).classList.add('show'); });
  });
}

/* ===== 分頁 1 補充：生活情境劇場「有沒有作功？」=====
   每個情境：人物＋物體動畫，標出力（紅）與位移（藍），算出功 */
(() => {
  const cv = document.getElementById('c3scene'); if (!cv) return;
  const S = stage(cv, 760, 300), ctx = S.ctx;
  const GY = 240;
  // fa：力的方向（度，0＝右，90＝上）；mv：物體移動方向（度）或 null（不動）；F、D：力（N）、移動距離（m）
  const SC = {
    cart:  { n: '推購物車往前走', fa: 0, mv: 0, F: 20, D: 5, obj: 'cart', who: '推力', ans: '推力和位移同向 → 作<b>正功</b>：W＝20×5＝100 J。購物車被推得愈來愈快（或克服摩擦力前進）。' },
    bucket:{ n: '提水桶在走廊水平走', fa: 90, mv: 0, F: 100, D: 5, obj: 'bucket', who: '手的提力', ans: '提力向上、水桶水平移動，兩者<b>垂直</b> → 提力<b>不作功</b>。手會痠是因為肌肉一直在出力、消耗能量，但沒有傳給水桶。' },
    lift:  { n: '舉重：把槓鈴舉起來', fa: 90, mv: 90, F: 980, D: 2, obj: 'bar', who: '舉力', ans: () => `舉力向上、槓鈴也向上移動 → 作<b>正功</b>：100 kg 的槓鈴重約 ${fmt(100 * G, 0)} N，W ≈ ${fmt(100 * G, 0)}×2 ≈ ${fmt(200 * G, 0)} J，存成槓鈴的重力位能。` },
    hold:  { n: '舉重：舉在頭頂不動', fa: 90, mv: null, F: 980, D: 0, obj: 'bar', who: '舉力', ans: '槓鈴<b>沒有位移</b>（S＝0）→ 不作功。選手還是很累，但物理上的功是 0。' },
    wall:  { n: '用力推牆，牆沒動', fa: 0, mv: null, F: 300, D: 0, obj: 'wall', who: '推力', ans: '牆<b>沒有位移</b> → 推力不作功，不管推多用力。' },
    drag:  { n: '斜斜地拉行李箱', fa: 35, mv: 0, F: 30, D: 5, obj: 'case', who: '拉力', ans: '拉力是斜的，和位移夾 35°。只有<b>沿著地面的那一份力</b>作功，所以還是作<b>正功</b>，但比 30×5＝150 J 少（約 123 J）。' },
    brake: { n: '腳踏車煞車，摩擦力', fa: 180, mv: 0, F: 150, D: 4, obj: 'bike', who: '地面摩擦力', ans: '摩擦力向後、腳踏車向前移動，兩者<b>反向</b> → 作<b>負功</b>，腳踏車的動能減少，最後停下來。' },
    tug:   { n: '拔河：紅隊被拉過去', fa: 180, mv: 0, F: 600, D: 1, obj: 'rope', who: '紅隊的拉力', ans: '紅隊往左拉，但繩子（和紅隊）卻往右移動 → 紅隊的拉力作<b>負功</b>；藍隊的拉力和移動同向，作<b>正功</b>。如果繩子僵持不動，雙方都<b>不作功</b>！' },
  };
  let cur = 'cart', t = 0, run = true;
  function person(x, y, pose) {
    ctx.save(); ctx.strokeStyle = '#37474F'; ctx.fillStyle = '#FFCC80'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(x, y - 92, 12, 0, 7); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y - 80); ctx.lineTo(x, y - 40); ctx.stroke();
    const step = Math.sin(t * 6) * 8 * (pose.walk ? 1 : 0);
    ctx.beginPath(); ctx.moveTo(x, y - 40); ctx.lineTo(x - 10 + step, y); ctx.moveTo(x, y - 40); ctx.lineTo(x + 10 - step, y); ctx.stroke();
    ctx.beginPath(); pose.arms.forEach(([ax, ay]) => { ctx.moveTo(x, y - 70); ctx.lineTo(ax, ay); }); ctx.stroke();
    ctx.restore();
  }
  function draw() {
    S.fit(); ctx.clearRect(0, 0, S.W, S.H);
    const s = SC[cur], moving = s.mv !== null;
    const prog = moving ? Math.min(1, (t % 4) / 3) : 0;
    ground(ctx, 10, S.W - 10, GY, cur === 'brake');
    let ox = 300, oy = GY, dx = 0, dy = 0;
    if (moving && s.mv === 0) dx = prog * 260;
    if (moving && s.mv === 90) dy = -prog * 95;
    const objX = ox + dx, objY = oy + dy;
    // 物體與人物
    if (s.obj === 'cart') { box(ctx, objX, GY - 50, 70, 40, '#90A4AE', '🛒'); person(objX - 30, GY, { walk: 1, arms: [[objX, GY - 50], [objX, GY - 46]] }); }
    if (s.obj === 'bucket') { person(objX, GY, { walk: 1, arms: [[objX + 14, GY - 40], [objX - 8, GY - 50]] }); box(ctx, objX + 4, GY - 40, 26, 30, '#42A5F5', ''); }
    if (s.obj === 'bar') { const by = GY - 85 + dy * 0.9; person(380, GY, { walk: 0, arms: [[362, by], [398, by]] }); ctx.fillStyle = '#455A64'; ctx.fillRect(320, by - 4, 120, 8); ctx.beginPath(); ctx.arc(318, by, 18, 0, 7); ctx.arc(442, by, 18, 0, 7); ctx.fill(); }
    if (s.obj === 'wall') { ctx.fillStyle = '#BCAAA4'; ctx.fillRect(420, 40, 40, GY - 40); for (let yy = 50; yy < GY; yy += 22) { ctx.strokeStyle = '#8D6E63'; ctx.strokeRect(420, yy, 40, 22); } person(392, GY, { walk: 0, arms: [[420, GY - 76], [420, GY - 66]] }); }
    if (s.obj === 'case') { const cx = objX + 20; box(ctx, cx, GY - 46, 40, 46, '#7E57C2', ''); ctx.strokeStyle = '#333'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx + 40, GY - 44); ctx.lineTo(cx + 85, GY - 75); ctx.stroke(); person(cx + 100, GY, { walk: 1, arms: [[cx + 85, GY - 75]] }); }
    if (s.obj === 'bike') { const v = 1 - prog; const bx = ox + (1 - v * v) * 260; ctx.strokeStyle = '#263238'; ctx.lineWidth = 3; [0, 60].forEach(o => { ctx.beginPath(); ctx.arc(bx + o, GY - 18, 18, 0, 7); ctx.stroke(); }); ctx.beginPath(); ctx.moveTo(bx, GY - 18); ctx.lineTo(bx + 25, GY - 45); ctx.lineTo(bx + 60, GY - 18); ctx.stroke(); dx = bx - ox; if (prog > 0.05 && prog < 1) for (let k = 0; k < 4; k++) label(ctx, '〰', bx - 10 - k * 14, GY - 4, { size: 12, color: '#E64A19' }); }
    if (s.obj === 'rope') { ctx.strokeStyle = '#8D6E63'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(objX - 110, GY - 60); ctx.lineTo(objX + 200, GY - 60); ctx.stroke(); ctx.fillStyle = '#E53935'; ctx.fillRect(objX + 40, GY - 70, 6, 20); person(objX - 90, GY, { walk: 0, arms: [[objX - 70, GY - 60]] }); person(objX - 40, GY, { walk: 0, arms: [[objX - 20, GY - 60]] }); label(ctx, '紅隊', objX - 65, GY - 125, { align: 'center', size: 14, color: '#C62828', bold: true }); person(objX + 140, GY, { walk: 0, arms: [[objX + 120, GY - 60]] }); person(objX + 190, GY, { walk: 0, arms: [[objX + 170, GY - 60]] }); label(ctx, '藍隊', objX + 165, GY - 125, { align: 'center', size: 14, color: '#1565C0', bold: true }); }
    // 力的箭頭（紅）
    const a = s.fa * Math.PI / 180, L = 80;
    let fx = s.obj === 'bar' ? 300 : s.obj === 'wall' ? 360 : s.obj === 'rope' ? objX - 20 : s.obj === 'case' ? objX + 60 : s.obj === 'bike' ? ox + dx + 30 : objX + 35;
    let fy = s.obj === 'bar' ? GY - 85 + dy * 0.9 + 85 : s.obj === 'bucket' ? GY - 120 : GY - 150;
    if (s.obj === 'bike') { fx = ox + dx + 30; fy = GY + 18; }
    arrow(ctx, fx, fy, fx + Math.cos(a) * L, fy - Math.sin(a) * L, '#D32F2F', 5, 14);
    label(ctx, s.who, fx + Math.cos(a) * L + (Math.cos(a) < -0.3 ? -8 : 8), fy - Math.sin(a) * L - 12, { size: 14, bold: true, color: '#D32F2F', align: Math.cos(a) < -0.3 ? 'right' : 'left', bg: 'rgba(255,255,255,.85)' });
    // 位移（藍）
    if (moving) {
      if (s.mv === 0 && dx > 8) { arrow(ctx, ox, GY + 30, ox + dx, GY + 30, '#1565C0', 4, 12); label(ctx, '位移', ox + dx / 2, GY + 48, { align: 'center', size: 14, bold: true, color: '#1565C0' }); }
      if (s.mv === 90 && -dy > 8) { arrow(ctx, 470, GY - 85, 470, GY - 85 + dy, '#1565C0', 4, 12); label(ctx, '位移', 480, GY - 130, { size: 14, bold: true, color: '#1565C0' }); }
    } else label(ctx, '位移＝0（沒有移動）', S.W / 2 + 120, GY + 40, { align: 'center', size: 15, bold: true, color: '#1565C0' });
    label(ctx, s.n, 14, 20, { size: 16, bold: true });
  }
  function info() {
    const s = SC[cur];
    const kind = s.D === 0 || s.fa === 90 && s.mv === 0 ? '不作功' : Math.cos((s.fa - s.mv) * Math.PI / 180) > 0 ? '正功' : '負功';
    document.getElementById('c3sceneTxt').innerHTML = `<b style="color:${kind === '正功' ? 'var(--ok)' : kind === '負功' ? 'var(--bad)' : 'var(--muted)'}">→ ${kind}</b>　${typeof s.ans === 'function' ? s.ans() : s.ans}`;
  }
  const host = document.getElementById('c3sceneBtns');
  host.innerHTML = Object.entries(SC).map(([k, s]) => `<button class="chip${k === cur ? ' on' : ''}" data-k="${k}">${s.n}</button>`).join('');
  $$('.chip', host).forEach(c => c.onclick = () => {
    cur = c.dataset.k; t = 0;
    $$('.chip', host).forEach(x => x.classList.toggle('on', x === c));
    document.getElementById('c3sceneTxt').innerHTML = '先想一想：這個力有沒有作功？是正功還是負功？<button class="btn ghost" id="c3sceneAns" style="margin-left:8px">看答案</button>';
    document.getElementById('c3sceneAns').onclick = info;
  });
  $$('.chip', host)[0].click();
  const lp = loop(dt => { t += dt; draw(); });
  registerSim('t1', { start() { draw(); lp.start(); }, stop() { lp.stop(); }, resize: draw });
})();

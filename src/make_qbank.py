"""把 research/ 的題庫 JSON 合併成網頁用的 ch3/js/03_qbank.js。
用法：python3 make_qbank.py（build.py 會自動呼叫）"""
import json, pathlib
root = pathlib.Path(__file__).parent
R = root.parent / 'research'
SEC = {'t1': '3-1', 't2': '3-1', 't3': '3-2', 't4': '3-2', 't5': '3-2', 't6': '3-2', 't7': '3-3', 't8': '3-3', 't9': '3-3', 't10': '3-4', 't11': '3-4', 't12': '3-4'}
# 排除：109 會考第 37 題需要三下電學 P＝V²/R（審題報告建議移到三下題庫）
EXCLUDE = {q for q in ['cap109-37']}
out = []
for fn in ['orig_questions.json', 'cap_questions.json']:
    p = R / fn
    if not p.exists(): continue
    for q in json.loads(p.read_text(encoding='utf-8')):
        if q.get('id') in EXCLUDE or '109 年會考 第 37 題' in q.get('src', ''): continue
        q['sec'] = SEC.get(q.get('back'), q.get('sec'))
        if not q.get('sec') or not q.get('back'): raise SystemExit(f"題目 {q.get('id')} 缺少 sec/back，請先補上")
        q.setdefault('src', '原創'); q.setdefault('lv', 2)
        if q.get('type') == 'group':
            for i, s in enumerate(q['sub']):
                s.setdefault('id', f"{q['id']}-{i + 1}")
                s.setdefault('type', 'mc')
        out.append(q)
js = '/* 自動產生，請勿手動修改：來源 research/orig_questions.json、cap_questions.json（make_qbank.py） */\nconst QBANK = ' + json.dumps(out, ensure_ascii=False) + ';\n'
(root / 'ch3' / 'js' / '03_qbank.js').write_text(js, encoding='utf-8')
print(f'QBANK：{len(out)} 道')

import json,math,html
L=json.load(open('songs.json'))
top=L[0]; rest=L[1:]
groups=[('Core Rotation','sung 6+ times',lambda n:n>=6),('Regulars','sung 4–5 times',lambda n:4<=n<=5),('Occasional','sung 2–3 times',lambda n:2<=n<=3)]
once=[s for s in rest if s[1]['n']==1]
n_songs=len(L); slots=sum(s[1]['n'] for s in L); new=sum(s[1]['new'] for s in L); pct=round(100*len(once)/n_songs)
def dots(n,cls=''): return ''.join(f'<i class="d{cls}"></i>' for _ in range(n))
def row(name,v):
  tag='<b class="new">NEW</b>' if v['new'] else ''
  return f'<div class="row"><span class="nm"><span class="t">{html.escape(name)}</span>{tag}</span><span class="dots">{dots(v["n"])}</span><span class="ct">{v["n"]}</span></div>'
sec=''
for title,sub,f in groups:
  items=[s for s in rest if f(s[1]['n'])]
  rows=math.ceil(len(items)/2); mx=max(v['n'] for k,v in items); nw=min(int(355-mx*10-24),232)
  sec+=f'<section><h2>{title} <span>{sub} · {len(items)} songs</span></h2><div class="grid" style="grid-template-rows:repeat({rows},auto);--nw:{nw}px">'+''.join(row(k,v) for k,v in items)+'</div></section>'
DISP={'Who Else/Jesus be the Name/What a Beautiful Name':'Who Else medley'}
onceh=''.join(f'<li class="{"b" if v["new"] else ""}">{html.escape(k)}</li>' for k,v in sorted([(DISP.get(k,k),v) for k,v in once],key=lambda x:x[0].lower()))
page=f'''<!doctype html><html><head><meta charset="utf-8"><title>Follow Church - Sunday Morning Songs</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
@page{{size:8.5in 11in;margin:0}}
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{background:#fff}}
body{{font-family:Inter,"Helvetica Neue",Arial,sans-serif;color:#1c2333;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
.page{{width:8.5in;height:11in;padding:.42in .45in .35in;overflow:hidden;position:relative}}
header h1{{font-size:22pt;font-weight:800;letter-spacing:-.4px;color:#14213d}}
header p{{font-size:10pt;color:#5b6475;margin-top:2px}}
.stats{{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:12px 0 10px}}
.stat{{border:1px solid #e3e6ec;border-radius:8px;padding:7px 10px}}
.stat b{{display:block;font-size:19pt;font-weight:800;color:#14213d;line-height:1.1}}
.stat span{{font-size:9pt;color:#5b6475}}
.banner{{background:#14213d;color:#fff;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:14px}}
.banner .lbl{{font-size:9pt;text-transform:uppercase;letter-spacing:1px;color:#f2b84b;font-weight:700}}
.banner .song{{font-size:17pt;font-weight:800}}
.banner .dots{{flex:1;justify-content:flex-end}}.banner .dots i{{width:10px;height:10px;background:#f2b84b;margin-right:3px}}
.banner .ct{{font-size:15pt;font-weight:800;color:#f2b84b;width:auto;white-space:nowrap;flex:none}}
.banner .ct small{{font-size:9pt;font-weight:600;color:#c9cfdb}}
section{{margin-top:9px}}
h2{{font-size:11.5pt;font-weight:800;color:#14213d;border-bottom:2px solid #14213d;padding-bottom:2px;margin-bottom:4px}}
h2 span{{font-size:9pt;font-weight:600;color:#5b6475;margin-left:6px}}
.grid{{display:grid;grid-auto-flow:column;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:20px}}
.row{{display:flex;align-items:center;height:18.5px;border-bottom:1px solid #f0f2f5}}
.nm{{width:var(--nw);flex:none;display:flex;align-items:center;gap:4px;font-size:9.5pt;white-space:nowrap;overflow:hidden}}
.dots{{flex:1;display:flex;align-items:center;min-width:0}}
i.d{{display:inline-block;width:8px;height:8px;border-radius:50%;background:#2a7f8e;margin-right:2px;flex:none}}
.ct{{width:18px;flex:none;text-align:right;font-size:9pt;font-weight:700;color:#5b6475}}
b.new{{font-size:6.5pt;font-weight:800;background:#f2b84b;color:#14213d;border-radius:3px;padding:1px 3px;letter-spacing:.4px;flex:none}}
ul{{columns:3;column-gap:22px;list-style:none;font-size:9.5pt;line-height:1.45}}
li{{break-inside:avoid;padding-left:11px;position:relative}}
li:before{{content:"";position:absolute;left:0;top:.5em;width:6px;height:6px;border-radius:50%;background:#2a7f8e}}
li.b{{font-weight:700}}
.key{{font-size:9pt;color:#5b6475;margin-top:4px}}
footer{{position:absolute;bottom:.3in;left:.45in;right:.45in;font-size:9pt;color:#8a92a3;display:flex;justify-content:space-between;border-top:1px solid #e3e6ec;padding-top:5px}}
footer i.d{{width:8px;height:8px;vertical-align:middle}}
</style></head><body><div class="page">
<header><h1>Follow Church - Sunday Morning Songs</h1><p>Song usage across 75 Sundays plus Christmas Eve · Christmas songs not included</p></header>
<div class="stats">
<div class="stat"><b>{n_songs}</b><span>different songs</span></div>
<div class="stat"><b>{slots}</b><span>total song slots</span></div>
<div class="stat"><b>{new}</b><span>new songs introduced</span></div>
<div class="stat"><b>{pct}%</b><span>of songs sung only once</span></div>
</div>
<div class="banner"><div><div class="lbl">Most-sung song</div><div class="song">{html.escape(top[0])}</div></div><span class="dots">{dots(top[1]["n"])}</span><span class="ct">{top[1]["n"]} <small>times</small></span></div>
{sec}
<section><h2>Sung Once <span>{len(once)} songs · <b style="color:#1c2333">bold</b> = new this period</span></h2><ul>{onceh}</ul></section>
<footer><span><i class="d"></i> = one service the song was used &nbsp;·&nbsp; <b class="new">NEW</b> = introduced this period</span><span>Source: Planning Center Services song usage report</span></footer>
</div></body></html>'''
open(sys_out:= 'Follow_Church_Sunday_Morning_Songs.html','w').write(page)

import csv,collections,json,sys
r=list(csv.reader(open(sys.argv[1],encoding='utf-8-sig')))
EXCL={'Angels (Glory To God)','Joy To The World (Joyful Joyful)'}
SHORT={'All The Time (feat. Justus Tams & Rudy Villarreal) [Live]':'All The Time',
'By Faith (feat. Michael Shannon & Zo Ross-Waddell) [Live]':'By Faith',
'I Got Saved (feat. Chris Brown) [Live]':'I Got Saved',
'Jesus Be The Name (feat. Tiffany Hudson)':'Jesus Be The Name',
'Your Ways Better Forrest Frank':'Your Ways Better'}
songs={}
for row in r[1:]:
  if not row or not row[0].strip(): continue
  n=row[0].strip()
  if n in EXCL: continue
  c=sum(v.strip()=='✓' for v in row[3:])
  assert c==int(row[2])
  name=SHORT.get(n,n)
  if name in songs:
    songs[name]['n']+=c; songs[name]['new']=songs[name]['new'] and row[1]=='new'
  else: songs[name]={'n':c,'new':row[1]=='new'}
L=sorted(songs.items(),key=lambda x:(-x[1]['n'],x[0].lower()))
for k,v in L: print(v['n'],'NEW' if v['new'] else '',k)
tot=sum(v['n'] for v in songs.values()); once=sum(v['n']==1 for v in songs.values())
print(len(songs),tot,sum(v['new'] for v in songs.values()),once,round(100*once/len(songs)))
json.dump(L,open('songs.json','w'))

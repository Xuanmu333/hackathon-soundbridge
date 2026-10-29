import asyncio, hashlib, json, subprocess, sys
from pathlib import Path
import edge_tts
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT.parent/'SoundBridge_Film'
edition=sys.argv[1] if len(sys.argv)>1 else 'story'
assert edition in ('story','road')
scenes=json.loads((ROOT/f'src/{edition}-outline.json').read_text())
voice_dir=ROOT/f'public/voice-{edition}';voice_dir.mkdir(exist_ok=True)
def filename(i,j,text):return f'{i:02}-{j:02}-{hashlib.sha256(text.encode()).hexdigest()[:8]}.mp3'
def length(p):return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)]))
async def main():
 sem=asyncio.Semaphore(3)
 async def generate(i,j,line):
  p=voice_dir/filename(i,j,line['zh'])
  async with sem:
   if not p.exists():
    for attempt in range(3):
     try:
      await edge_tts.Communicate(line['zh'],'zh-CN-XiaoxiaoNeural',rate='+6%').save(str(p));break
     except Exception:
      if attempt==2:raise
      await asyncio.sleep(2)
 await asyncio.gather(*(generate(i,j,l) for i,s in enumerate(scenes) for j,l in enumerate(s['lines'])))
 data=[];start_global=0;captions=[];english=[];speeds=[]
 for i,scene in enumerate(scenes):
  files=[voice_dir/filename(i,j,l['zh']) for j,l in enumerate(scene['lines'])]
  lengths=[length(p) for p in files];dur=scene['duration'];available=dur-1.25-.18*(len(files)-1)
  speed=max(1,sum(lengths)/available);speeds.append(speed)
  if speed>1:
   for p in files:
    tmp=p.with_suffix('.tmp.mp3');subprocess.run(['ffmpeg','-y','-v','error','-i',str(p),'-af',f'atempo={speed:.6f}',str(tmp)],check=True);tmp.replace(p)
   lengths=[length(p) for p in files]
  gap=max(.18,(dur-1.25-sum(lengths))/(len(files)-1 or 1));start=.55;voice=[]
  for line,p,d in zip(scene['lines'],files,lengths):
   voice.append(dict(file=f'voice-{edition}/{p.name}',start=round(start,3),duration=d,**line))
   cap=dict(text=line['zh'],startMs=round((start_global+start)*1000),endMs=round((start_global+min(start+d+.12,dur-.2))*1000),timestampMs=None,confidence=None)
   captions.append(cap);english.append({**cap,'text':line['en']});start+=d+gap
  data.append({k:scene[k] for k in ['name','duration','title','en']}|dict(start=start_global,voice=voice));start_global+=dur
 (ROOT/f'src/{edition}-script.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
 (OUT/f'captions.{edition}.zh.json').write_text(json.dumps(captions,ensure_ascii=False,indent=2)+'\n')
 def ts(ms):
  h,r=divmod(ms,3600000);m,r=divmod(r,60000);s,ms=divmod(r,1000);return f'{h:02}:{m:02}:{s:02},{ms:03}'
 (OUT/f'SoundBridge_{edition.title()}_中英字幕.srt').write_text('\n\n'.join(f'{i+1}\n{ts(c["startMs"])} --> {ts(c["endMs"])}\n{c["text"]}\n{e["text"]}' for i,(c,e) in enumerate(zip(captions,english)))+'\n')
 print(json.dumps({'seconds':start_global,'lines':len(captions),'max_speed_adjustment':round(max(speeds),3)}))
asyncio.run(main())

import asyncio, json, subprocess, wave
from pathlib import Path
import numpy as np
import edge_tts
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT.parent/'SoundBridge_Film'
scenes=[('Opening',
  12,
  '每一步，更有把握',
  'CONFIDENCE IN EVERY STEP',
  [('独自出门，去见一位朋友。', 'Heading out on your own to meet a friend.'),
   ('对聋人和重听人士，重要的环境提醒，也应有触觉的入口。',
    'For deaf and hard-of-hearing people, important cues should be accessible through touch.'),
   ('SoundBridge，让重要的提醒被感知。', 'SoundBridge. Make important cues easier to notice.')]),
 ('Outdoors',
  14,
  '车铃响起，腕上提醒',
  'NOTICE THE CUE',
  [('共享步道上，身后传来车铃。', 'On a shared path, a bicycle bell rings behind you.'),
   ('拟议系统识别声音类别，触发三次短振，并显示车铃图标和文字。',
    'The proposed system recognizes the sound, then shows a bicycle-bell alert with three short '
    'pulses.'),
   ('提醒提供线索，接下来，观察周围。', 'The alert offers a cue. Next, check your surroundings.')]),
 ('Response',
  12,
  '观察之后，自主行动',
  'LOOK. DECIDE. CONTINUE.',
  [('她停在步道一侧，转头确认骑行者的位置。', 'She pauses at the side of the path and checks where the cyclist is.'),
   ('确认空间后，让对方通过，再继续自己的行程。', 'After checking the space, she lets the cyclist pass and continues.'),
   ('选择，由她自己作出。', 'The decision is hers.')]),
 ('Recognition',
  16,
  '提醒如何产生？',
  'ON-WATCH RECOGNITION',
  [('麦克风采集短时声音，转换为频谱特征。',
    'Microphones capture short audio windows and convert them into spectral features.'),
   ('拟议的本地模型，识别车铃、鸣笛和门铃。',
    'The proposed on-device model recognizes bicycle bells, horns and doorbells.'),
   ('置信度筛选、连续确认和重复抑制，再决定是否提醒。',
    'Confidence checks, temporal confirmation and deduplication determine whether to alert.'),
   ('真实环境中的漏报和误报，仍需验证。',
    'Missed detections and false alerts still need testing in real environments.')]),
 ('Haptics',
  12,
  '重要提醒，也能被触摸',
  'FEEL THE DIFFERENCE',
  [('声音类别映射到振动节奏，再驱动触觉马达。', 'Sound categories map to rhythms that drive the haptic actuator.'),
   ('门铃用两组双击，车铃和鸣笛用三次短振。',
    'Doorbells use two paired taps; bicycle bells and horns use three short pulses.'),
   ('配合图标与文字，不只依赖颜色。', 'Icons and text reinforce the cue, without relying on color alone.')]),
 ('Direction',
  15,
  '来向，只作辅助线索',
  'DIRECTION WITH UNCERTAINTY',
  [('来向估计，需要多麦克风硬件和校准。', 'Direction estimation requires multiple microphones and calibration.'),
   ('比较声音到达的时间差，估计相对手表的大致来向。',
    'Arrival-time differences estimate an approximate direction relative to the watch.'),
   ('无法可靠判断时，明确显示方向不确定。', 'When the estimate is unreliable, show that the direction is uncertain.'),
   ('它不能代替观察，也不保证避开危险。', 'It cannot replace observation or guarantee avoidance of danger.')]),
 ('Status',
  12,
  '当前状态，必须看得见',
  'KNOW WHEN ALERTS ARE UNAVAILABLE',
  [('拟议状态设计，让暂停、低电量和感知故障清晰可见。',
    'The proposed status design makes pause, low battery and sensing faults visible.'),
   ('暂停或故障时，明确告知无法提供提醒。',
    'When paused or sensing fails, clearly show that alerts are unavailable.'),
   ('没有收到提醒，不代表周围没有风险。', 'No alert does not mean there is no risk nearby.')]),
 ('Personalize',
  12,
  '提醒，适合自己的感受',
  'YOUR WRIST. YOUR PREFERENCES.',
  [('选择关注的声音，试一试不同的振动强度。', 'Choose the sounds to notice and try different vibration strengths.'),
   ('字号也能调整，偏好保存在本地。', 'Adjust text size and store preferences locally.'),
   ('与聋人和重听人士共同测试，让提示容易理解。',
    'Test together with deaf and hard-of-hearing people to make cues understandable.')]),
 ('Home',
  12,
  '回到日常，也从容回应',
  'INDEPENDENCE AT HOME',
  [('同样的感知流程，也能用于居家门铃提示。', 'The same sensing flow can support doorbell alerts at home.'),
   ('振动与文字提示有人来访，让你继续专注自己的生活。', 'Vibration and text signal a visitor while you focus on your day.'),
   ('何时回应，由你决定。', 'Choose when to respond.')]),
 ('Modes',
  12,
  '开启与暂停，都由你掌握',
  'CONTROL STAYS WITH YOU',
  [('居家关注门铃，户外关注车铃与鸣笛。', 'Home focuses on doorbells; outdoors on bicycle bells and horns.'),
   ('暂停会停止采集与提醒，并持续显示暂停状态。',
    'Pausing stops capture and alerts, with a persistent paused indicator.'),
   ('准备好了，再恢复感知。', 'Resume awareness when you are ready.')]),
 ('Privacy',
  11,
  '私人的时刻，留在腕上',
  'LOCAL-FIRST PRIVACY',
  [('方案默认本地处理，不保存原始录音。', 'The proposed default is local processing without saving raw recordings.'),
   ('可选事件历史，只记录类别与时间，由你管理。', 'Optional event history stores category and time under your control.'),
   ('这些目标，需要在最终软硬件中落实。', 'These goals must be implemented in the final hardware and software.')]),
 ('Closing',
  10,
  '每一步，更有把握',
  'MORE CONFIDENCE. MORE POSSIBILITY.',
  [('从独自出门，到与朋友相聚，生活按自己的节奏展开。',
    'From heading out alone to meeting a friend, life moves at your own pace.'),
   ('SoundBridge。让重要的提醒，被及时感知。', 'SoundBridge. Help important cues reach you when they matter.')])]
async def main():
 sem=asyncio.Semaphore(3)
 async def generate(i,j,zh):
  p=ROOT/'public'/'voice-safety'/f'{i:02}-{j:02}.mp3'
  async with sem:
   if not p.exists():
    for attempt in range(3):
     try:
      await edge_tts.Communicate(zh,'zh-CN-XiaoxiaoNeural',rate='+8%').save(str(p));break
     except Exception:
      if attempt==2: raise
      await asyncio.sleep(2)
  return p
 await asyncio.gather(*(generate(i,j,pair[0]) for i,s in enumerate(scenes) for j,pair in enumerate(s[4])))
 data=[]; global_start=0; captions=[]; ens=[]
 for i,(name,dur,title,en,lines) in enumerate(scenes):
  files=[ROOT/'public'/'voice-safety'/f'{i:02}-{j:02}.mp3' for j in range(len(lines))]
  def length(p): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)]))
  lengths=[length(p) for p in files]
  available=dur-1.5-.2*(len(lines)-1)
  speed=max(1,sum(lengths)/available)
  if speed>1:
   for p in files:
    tmp=p.with_name(p.stem+'-speed.mp3')
    subprocess.run(['ffmpeg','-y','-i',str(p),'-af',f'atempo={speed:.6f}',str(tmp),'-loglevel','error'],check=True);tmp.replace(p)
   lengths=[length(p) for p in files]
  gap=max(.17,(dur-1.5-sum(lengths))/(len(lines)-1 or 1)); start=.65; voice=[]
  for j,((zh,eng),d) in enumerate(zip(lines,lengths)):
   item={'file':f'voice-safety/{i:02}-{j:02}.mp3','start':round(start,3),'duration':d,'zh':zh,'en':eng}
   voice.append(item)
   cap={'text':zh,'startMs':round((global_start+start)*1000),'endMs':round((global_start+min(start+d+.12,dur-.2))*1000),'timestampMs':None,'confidence':None}
   captions.append(cap);ens.append({**cap,'text':eng});start+=d+gap
  data.append({'name':name,'duration':dur,'start':global_start,'title':title,'en':en,'voice':voice});global_start+=dur
 (ROOT/'src'/'script.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
 (OUT/'captions.safety.zh.json').write_text(json.dumps(captions,ensure_ascii=False,indent=2))
 def ts(ms):
  h,rem=divmod(ms,3600000);m,rem=divmod(rem,60000);s,ms=divmod(rem,1000);return f'{h:02}:{m:02}:{s:02},{ms:03}'
 (OUT/'SoundBridge_Safety_中英字幕.srt').write_text('\n\n'.join(f'{i+1}\n{ts(c["startMs"])} --> {ts(c["endMs"])}\n{c["text"]}\n{e["text"]}' for i,(c,e) in enumerate(zip(captions,ens)))+'\n')
 print('Prepared',len(captions),'voice lines;',global_start,'seconds; max speed',round(max([1,speed]),2))
asyncio.run(main())

import asyncio, json, subprocess, wave
from pathlib import Path
import numpy as np
import edge_tts
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT.parent/'SoundBridge_Film'
scenes=[
('Opening',12,'让每个重要时刻，都被感知','FEEL EVERY MOMENT',[
('有些重要的时刻，从一个声音开始。','Some meaningful moments begin with a sound.'),
('一声门铃，一句问候，一次擦肩而过。','A doorbell. A greeting. Someone passing by.'),
('让这些连接，被更多人感知。','Make those connections easier to notice.')]),
('Architecture',10,'把声音，变成触觉','SOUND → UNDERSTANDING → TOUCH',[
('SoundBridge，构想一款独立运行的声音感知手表。','SoundBridge imagines a standalone sound-aware watch.'),
('采集、识别、提醒，都在腕上完成。','Sensing, recognition and alerts — all on the wrist.')]),
('Recognition',16,'它如何理解环境声音？','01 / ON-DEVICE SOUND AI',[
('麦克风采集声音，将短时音频转换为频谱特征。','Microphones capture audio; short windows become spectral features.'),
('轻量模型在本地，区分门铃、人声、车铃和鸣笛。','A local model distinguishes doorbells, speech, bicycle bells and horns.'),
('再通过置信度判断、连续确认与重复抑制，减少无效打扰。','Confidence checks, temporal confirmation and deduplication limit unwanted alerts.')]),
('Home',12,'不错过，一个熟悉的到来','02 / AT HOME',[
('门铃响起，识别结果触发专属振动，屏幕显示门铃事件。','A recognized doorbell triggers its haptic pattern and an on-screen event.'),
('即使正在忙碌，也能知道有人来访。何时回应，由你决定。','Notice a visitor while you are busy. Choose when to respond.')]),
('Conversation',12,'让加入对话，多一个线索','03 / IN CONVERSATION',[
('开启交谈模式，系统优先提醒附近的人声。','Conversation mode prioritizes nearby speech.'),
('一次轻柔长振，提醒你抬头看看。','One gentle, sustained pulse invites you to look up.'),
('它提示有人说话，不判断对方是否正在叫你。','It detects speech, not whether someone is addressing you.')]),
('Outdoors',12,'感知身边，保持自己的步调','04 / OUT AND ABOUT',[
('户外模式关注车铃与鸣笛，识别后发送短促振动。','Outdoor mode focuses on bicycle bells and horns, with brief pulses.'),
('停一停，看看周围，再由自己判断下一步。','Pause, look around, and decide your next move.'),
('这是环境提示，不替代道路观察。','An awareness cue that does not replace looking around.')]),
('Haptics',12,'不用看屏幕，也能分辨','05 / A TACTILE LANGUAGE',[
('事件类别，映射到不同的振动节奏。','Each event category maps to a different haptic rhythm.'),
('门铃是两组双击，人声是一段长振，交通提示是三次短振。','Doorbell: two paired taps. Speech: one long pulse. Traffic: three short taps.'),
('驱动触觉马达，让声音有了可学习的触感。','A haptic actuator turns sound categories into learnable sensations.')]),
('Direction',15,'不只知道发生了什么','06 / APPROXIMATE DIRECTION',[
('方向提示，需要兼容的多麦克风硬件。','Direction cues require compatible multi-microphone hardware.'),
('比较声音到达不同麦克风的时间差，估计来向。','Compare arrival times across microphones to estimate the source direction.'),
('表盘用柔和扇区，提示大致方向。','A soft sector indicates an approximate direction.'),
('精度仍需在真实噪声和佩戴条件下验证。','Accuracy still needs validation with real noise and wrist placement.')]),
('Personalize',14,'你的手腕，你的偏好','07 / MAKE IT YOURS',[
('首次使用，开启感知，选择声音，再试一试振动。','Start awareness, choose your sounds, then preview the vibration.'),
('只接收选中的声音，文字大小与振动强度也能调整。','Choose the sounds to receive, plus text size and vibration strength.'),
('把偏好保存在本地，让提醒更适合自己。','Store preferences locally so alerts fit your needs.')]),
('Modes',12,'需要连接，也需要安静','08 / CONTROL STAYS WITH YOU',[
('居家、交谈、户外，切换的是声音筛选规则。','Home, conversation and outdoors apply different sound filters.'),
('想安静时，暂停感知，停止采集与提醒。','Pause awareness to stop capture and alerts when you want quiet.'),
('准备好了，再轻触恢复。','Tap to resume when you are ready.')]),
('Privacy',13,'让私人的时刻，留在腕上','09 / LOCAL-FIRST PRIVACY',[
('方案默认在设备内处理，不保存原始录音。','The proposed default is local processing without saving raw recordings.'),
('若启用事件历史，只保留类别与时间，并由用户管理。','If event history is enabled, keep category and time under user control.'),
('这些隐私目标，仍需在最终软硬件中落实。','These privacy goals must be implemented in the final hardware and software.')]),
('Closing',10,'科技的温度，是把选择交还给你','TECHNOLOGY, WITH HUMANITY',[
('下一步，与聋人及重听人士共同设计、测试、完善。','Next: co-design, test and refine with deaf and hard-of-hearing people.'),
('SoundBridge。感知连接，自主回应。','SoundBridge. Feel connected. Choose your response.')])]
async def main():
 sem=asyncio.Semaphore(3)
 async def generate(i,j,zh):
  p=ROOT/'public'/'voice'/f'{i:02}-{j:02}.mp3'
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
  files=[ROOT/'public'/'voice'/f'{i:02}-{j:02}.mp3' for j in range(len(lines))]
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
   item={'file':f'voice/{i:02}-{j:02}.mp3','start':round(start,3),'duration':d,'zh':zh,'en':eng}
   voice.append(item)
   cap={'text':zh,'startMs':round((global_start+start)*1000),'endMs':round((global_start+min(start+d+.12,dur-.2))*1000),'timestampMs':None,'confidence':None}
   captions.append(cap);ens.append({**cap,'text':eng});start+=d+gap
  data.append({'name':name,'duration':dur,'start':global_start,'title':title,'en':en,'voice':voice});global_start+=dur
 (ROOT/'src'/'script.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
 (OUT/'captions.zh.json').write_text(json.dumps(captions,ensure_ascii=False,indent=2))
 def ts(ms):
  h,rem=divmod(ms,3600000);m,rem=divmod(rem,60000);s,ms=divmod(rem,1000);return f'{h:02}:{m:02}:{s:02},{ms:03}'
 (OUT/'SoundBridge_中英字幕.srt').write_text('\n\n'.join(f'{i+1}\n{ts(c["startMs"])} --> {ts(c["endMs"])}\n{c["text"]}\n{e["text"]}' for i,(c,e) in enumerate(zip(captions,ens)))+'\n')
 print('Prepared',len(captions),'voice lines;',global_start,'seconds; max speed',round(max([1,speed]),2))
asyncio.run(main())

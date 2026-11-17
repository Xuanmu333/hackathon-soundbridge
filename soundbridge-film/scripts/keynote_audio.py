from pathlib import Path
import json,subprocess,wave,math
import numpy as np
root=Path(__file__).resolve().parents[2]
public=root/'soundbridge-film/public'
work=root/'SoundBridge_Film/qa/keynote'
work.mkdir(parents=True, exist_ok=True)
sc=json.loads((root/'soundbridge-film/src/keynote/story.json').read_text())
sr=48000
def decode(path,channels):
 raw=subprocess.check_output(['ffmpeg','-loglevel','error','-i',str(path),'-ar',str(sr),'-ac',str(channels),'-f','f32le','pipe:1'])
 return np.frombuffer(raw,np.float32).reshape(-1,channels)
def level(a):return np.sqrt(np.mean(a*a)+1e-12)
n=sc[-1]['end']*sr
music=decode(public/'score-162.wav',2)[:n].copy()
music*=.019/level(music)
ramp=int(1.2*sr)
music[:ramp]*=np.linspace(0,1,ramp)[:,None]
ramp=int(3*sr)
music[-ramp:]*=np.linspace(1,0,ramp)[:,None]
def place(t,a,pan=0):
 start=round(t*sr);v=np.asarray(a).reshape(-1,1);music[start:start+len(v)]+=v*np.array([1-pan,1+pan],np.float32)
rng=np.random.default_rng(817)
def click(t):
 x=np.arange(round(.075*sr))/sr
 noise=rng.normal(0,1,len(x));high=noise-np.r_[0,noise[:-1]]
 transient=.033*high*np.exp(-x/.004)+.045*np.sin(2*np.pi*(930+rng.uniform(-70,70))*x)*np.exp(-x/.012)+.026*np.sin(2*np.pi*168*x)*np.exp(-x/.021)
 place(t,transient,-.1+rng.uniform(-.08,.08))
for i in range(len('SoundBridge')):click(math.ceil((.43+i*.106)*30)/30)
for i in range(len('为听障人士设计的环境感知手表')):click(math.ceil((1.86+i*.119)*30)/30)
def bell(t):
 x=np.arange(sr*1)/sr
 tone=np.zeros_like(x)
 for hz,amp,decay in [(1251,.028,.28),(2135,.016,.21),(3195,.008,.13)]:
  tone+=amp*np.sin(2*np.pi*hz*x)*np.exp(-x/decay)*np.minimum(1,x/.004)
 place(t,tone,-.24)
bell(18.65);bell(18.83)
x=np.arange(round(.57*sr))/sr
horn=.024*(np.sin(x*2*np.pi*352)+.6*np.sin(x*2*np.pi*449))*np.minimum(1,x/.06)*np.minimum(1,(x[-1]-x)/.11)
place(87.78,horn,.2)
def tap(t,d,strong):
 x=np.arange(round(d*sr))/sr;env=np.sin(np.pi*x/d)**1.4
 place(t,.025*strong*env*(np.sin(2*np.pi*100*x)+.36*np.sin(2*np.pi*210*x)))
for t in [24,24.6,25.2]:tap(t,.25,1)
for i,t in enumerate([89,94,99,104]):tap(t,.75,1+i*.12);tap(t+1.2,.75,1+i*.12)
def write_pcm(filename, track):
 with wave.open(str(work/filename),'wb') as w:
  w.setparams((track.shape[1],2,sr,0,'NONE','not compressed'))
  w.writeframes((np.clip(track,-.98,.98)*32767).astype('<i2').tobytes())
write_pcm('ambience.wav', music)
for i,s in enumerate(sc[:-1]):
 voice=decode(public/'keynote'/f'v{i}.mp3',1)[:,0].copy()
 voice*=min(.14/level(voice),.90/np.max(abs(voice)))
 offset=.9 if i==0 else 1.2
 track=np.zeros((int((s['end']-s['start'])*sr),2),np.float32)
 start=round(offset*sr)
 track[start:start+len(voice)]=voice[:,None]
 write_pcm(f'voice-{i}.wav',track)
 place(s['start']+offset,voice)
write_pcm('sound.wav', music)

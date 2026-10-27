from pathlib import Path
import numpy as np, wave
sr=32000;dur=150
mix=np.zeros((sr*dur,2),dtype=np.float32)
def tone(start,duration,freq,level,pan=0,pluck=False):
 n=int(duration*sr);t=np.arange(n,dtype=np.float32)/sr
 sig=np.sin(2*np.pi*freq*t)+.24*np.sin(2*np.pi*freq*2*t)+.06*np.sin(2*np.pi*freq*3*t)
 env=np.exp(-t*2.2)*(1-np.exp(-t*65)) if pluck else np.minimum(t/2,1)*np.minimum((duration-t)/2,1)
 sig=sig*env*level;off=int(start*sr);n=min(n,len(mix)-off)
 if n>0:
  mix[off:off+n,0]+=sig[:n]*(1-pan*.4);mix[off:off+n,1]+=sig[:n]*(1+pan*.4)
chords=[[130.81,164.81,196,246.94],[110,130.81,164.81,220],[87.31,130.81,174.61,220],[98,146.83,196,246.94]]
for k,start in enumerate(np.arange(0,150,8)):
 chord=chords[k%4]
 for j,freq in enumerate(chord): tone(float(start),min(10,150-start),freq,.018,(j-1.5)/2)
 for j in range(8):tone(float(start+j),2.7,chord[(j*3)%4]*4,.028 if j%2==0 else .017,(-1)**j*.55,True)
# Restrained UI motifs and abstract haptic clicks.
for st in [12,22,38,50,62,74,86,101,115,127,140]:
 tone(st,1.7,880,.035,-.25,True);tone(st+.13,1.4,1320,.018,.3,True)
for st in [40.5,41,42,42.5,76,76.35,77.25,77.6,82,82.4,82.8]:tone(st,.15,110,.07,0,True)
fade=np.minimum(np.arange(len(mix))/sr/3,1)*np.minimum((len(mix)-np.arange(len(mix)))/sr/4,1)
mix*=fade[:,None]
with wave.open(str(Path(__file__).resolve().parents[1]/'public'/'score.wav'),'wb') as out:
 out.setnchannels(2);out.setsampwidth(2);out.setframerate(sr);out.writeframes((np.clip(mix,-.95,.95)*32767).astype('<i2').tobytes())
print('Original ambient score: 150 seconds, stereo')

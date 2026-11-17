import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import script from '../road-script.json';
import {PhotoJourney} from '../studio3d/PhotoJourney';
import {roadState} from '../studio3d/roadState';
import {bearingLabel,events,formatBearing,haptic,micArrivals,phase,ViewState} from '../studio3d/state';
import {blend,Continuity,inside,progress} from './Continuity';
import {SlateWatch} from './SlateWatch';
import {SignalPath,SpatialCue} from './SignalPath';
import './template.css';

const chapterTitles:Record<string,[string,string]> = {
 Structure:['拆开一份提醒','Inside the watch'],
 Logic:['声音如何抵达手腕','From sound to touch'],
 Opening:['小林走上街头','On the road with Xiaolin'],
 Approach:['左后方，响起车铃','A bicycle approaches'],
 Respond:['她抬腕，回头观察','A glance before giving way'],
 Array:['四个麦克风，一个来向','Locating the sound'],
 RoadSounds:['哪些声音值得提醒？','Choosing when to alert'],
 Bearing:['手腕转动，指向更新','A direction relative to the dial'],
 Crossing:['路口传来鸣笛','A horn at the crossing'],
 Escalation:['小林还没有确认','Following up on an alert'],
 Wait:['在路缘内，等车通过','Waiting at the curb'],
 Personalize:['找到舒适的振动强度','Adjusting the watch'],
 RearAlert:['右后方，又一声车铃','Another rider approaches'],
 Closing:['小林继续她的行程','Continuing her journey'],
};
const photoScenes=['Opening','Approach','Respond','Bearing','Crossing','Escalation','Wait','Personalize','RearAlert','Closing'];
const englishEvent:Record<string,string>={bike:'Bicycle bell',horn:'Car horn',siren:'Emergency siren',engine:'Vehicle',construction:'Roadworks',noise:'Background',bell:'Bell'};
const chapterWeight=(time:number,start:number,end:number)=>progress(time,start-.55,start+.55)*(1-progress(time,end-.55,end+.55));

const Readout=({name,s,t}:{name:string;s:ViewState;t:number})=>{
 const event=events[s.event],p=phase(s);
 if(name==='Structure'){
  const parts=[['麦克风阵列','接收声音'],['处理电路','识别类别'],['显示模组','呈现方位'],['触觉马达','传递振动']];
  return <div className="sb-components">{parts.map(([part,job],i)=><div key={part} style={{opacity:s.componentFocus===i?1:.43}}><i/><b>{part}</b><small>{job}</small></div>)}</div>;
 }
 if(name==='Logic'){
  const step=t<16?0:t<21?1:t<25?2:3;
  return <div className="sb-components">{['四路收音','AI 分类','估算来向','腕上提醒'].map((part,i)=><div key={part} style={{opacity:i<=step?1:.34}}><i/><b>{part}</b><small>{['阵列','声谱特征','时差与姿态','触觉与视觉'][i]}</small></div>)}</div>;
 }
 if(name==='Array')return <div className="sb-components">{micArrivals(s.bearing).map((m)=><div key={m.id}><i style={{transform:'scale('+(.66+.34*Math.sin(t*2-m.fraction))+')'}}/><b>{m.id}</b><small>+{Math.round(m.delay)} μs</small></div>)}</div>;
 if(name==='RoadSounds')return <div className="sb-components">{(['noise','siren','engine','construction'] as const).map(id=><div key={id} style={{opacity:s.event===id?1:.33}}><i/><b>{events[id].zh}</b><small>{events[id].pattern}</small></div>)}</div>;
 return <div>{event.zh} · {p===3?event.pattern:'环境感知'}</div>;
};

const cueFor=(name:string,s:ViewState)=>{
 if(name==='Structure')return ['部件协作','收音、识别、显示、振动'];
 if(name==='Logic')return ['触觉输出','振动提示类别，表盘补充方向'];
 if(s.event==='noise')return ['环境底噪','暂缓提醒'];
 if(name==='Array')return ['声源方位',formatBearing(s.bearing)+'　'+bearingLabel(s.bearing)];
 if(name==='Bearing')return ['相对表盘十二点',s.directionReady?formatBearing(s.bearing)+'　'+bearingLabel(s.bearing):'姿态变化中'];
 if(s.alertStage==='confirmed')return ['点按已确认','结束本轮提醒'];
 if(s.alertStage)return ['间隔重复',s.alertStage==='viewing'?'已抬腕 · 等待点按':events[s.event].pattern+'　'+Math.round(s.strength*100)+'%'];
 if(name==='Personalize')return ['个人设置','振动 '+Math.round(s.strength*100)+'%　'+(s.largeText?'大字显示':'标准字号')];
 if(name==='Wait'||name==='Closing')return ['小林的行动',name==='Wait'?'观察路况 · 等待通过':'继续前行'];
 if(phase(s)<0)return ['腕上状态','环境感知中'];
 if(phase(s)<3)return ['腕上状态',['声音传播','阵列接收','AI 识别'][phase(s)]];
 return ['触觉节奏',events[s.event].pattern];
};

export const TemplateFilm=()=>{
 const frame=useCurrentFrame(),{fps,width}=useVideoConfig(),t=frame/fps;
 const body=inside(t),scene=script.find(c=>t<c.start+c.duration)??script[script.length-1];
 const state=roadState(t).s;
 // Keep the full opening disassembly visible after the three corner marks have travelled.
 const s=t<12?{...roadState(Math.max(0,(t-4.6)*12/7.4)).s}:state;
 const photo=script.reduce((v,c)=>v+(photoScenes.includes(c.name)?chapterWeight(t,c.start,c.start+c.duration):0),0);
 const sceneTime=t<54?t:t<76?54+(t-54)*10/22:t-12;
 const [cueLabel,cueValue]=cueFor(scene.name,s);
 const activeVoice=scene.voice.find(v=>t>=scene.start+v.start&&t<scene.start+v.start+v.duration+.12);
 const diagram=progress(t,11.2,13.1)*(1-progress(t,26.5,28.8));
 const productAlpha=progress(t,4.3,6)*(1-progress(t,156.5,158.2))*(1-diagram);
 const labelAlpha=body*(1-progress(t,156.5,158.7));
 const waveY=blend(352,488,photo),pulseY=blend(460,549,photo);

 const ink=blend(0,1,body);
 const productScale=1+.065*Math.sin(t*.085);
 return <AbsoluteFill style={{backgroundColor:'#e7ebf1'}}><div className="sb-template" style={{transform:'scale('+width/1280+')'}}>
  <div className="sb-wash" style={{opacity:body}}/>
  <Continuity t={t} s={s} photo={photo}/>
  <div className="sb-name" style={{left:blend(640,64,body),top:blend(304,37,body),fontSize:blend(65,29,body),opacity:progress(t,.15,1.3),color:body>.9?'#35334a':'#6554b7',transform:'translateX('+(-50*(1-body))+'%)'}}>SoundBridge</div>
  <div className="sb-coverline" style={{left:blend(640,1179,body),top:blend(391,48,body),fontSize:blend(22,16,body),opacity:progress(t,.55,1.6),transform:'translateX('+blend(-50,-100,body)+'%)'}}>为听障人士设计的环境感知手表</div>
  <div className="sb-header-line" style={{transform:'scaleX('+ink+')',opacity:body}}/>
  <div className="sb-watch" style={{opacity:productAlpha,transform:'translateY('+((1-productAlpha)*14)+'px) scale('+productScale+')'}}>
   <div className="sb-contact"/>{productAlpha>0&&<SlateWatch s={s}/>}
  </div>
  {diagram>0&&<SignalPath t={t} alpha={diagram}/>}
  {scene.name==='Approach'&&<SpatialCue s={s} t={t}/>}

  {script.map(c=>{
   const alpha=chapterWeight(t,c.start,c.start+c.duration)*labelAlpha;
   if(alpha<=0)return null;
   const [zh,en]=chapterTitles[c.name];
   const textAlpha=(progress(t,c.start,c.start+.48)*(1-progress(t,c.start+c.duration-.48,c.start+c.duration)))*labelAlpha;
   return <React.Fragment key={c.name}><div className="sb-chapter" style={{opacity:textAlpha,transform:'translateY('+((1-alpha)*(t<c.start+2?12:-12))+'px)'}}><small>{en}</small><h1>{zh}</h1></div>
   {!photoScenes.includes(c.name)&&<div className="sb-readout" style={{opacity:alpha}}><Readout name={c.name} s={s} t={t}/></div>}</React.Fragment>;
  })}
  {photo>0&&<div className="sb-photo" style={{opacity:photo*labelAlpha,transform:'translateY('+(1-photo)*11+'px)',clipPath:'inset(0 '+(1-photo)*38+'% 0 0 round 15px)'}}><PhotoJourney seconds={sceneTime}/></div>}
  <div className="sb-wave-caption" style={{top:waveY-46,opacity:labelAlpha}}>{scene.name==='Array'?'阵列输入':s.event==='noise'?'背景声音':'声音信号'}<span>{scene.name==='Structure'||scene.name==='Logic'?'Signal input':englishEvent[s.event]}</span></div>
  <div className="sb-feedback" style={{top:pulseY+14,opacity:labelAlpha}}><span>{cueLabel}</span><b style={{color:haptic(s)>.1?'#6650bb':undefined}}>{cueValue}</b></div>
  <Img src={staticFile('hackathon/credit.png')} className="sb-credit"/>
  {activeVoice&&<div className="sb-subtitles"><strong>{activeVoice.zh}</strong><small>{activeVoice.en}</small></div>}
 </div><Audio src={staticFile('hackathon/narration.m4a')}/></AbsoluteFill>;
};

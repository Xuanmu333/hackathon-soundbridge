import {AbsoluteFill,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import script from '../road-script.json';
import {Experience} from './Experience';
import {ease,Feature,Focus} from './state';
import {journeyWindow,roadState} from './roadState';
import {PhotoJourney,photoIndex,photoShots} from './PhotoJourney';
import './road.css';

export const RoadFilm=()=>{
 const frame=useCurrentFrame(),{fps,width}=useVideoConfig(),seconds=frame/fps;
 const j=roadState(seconds),rect=journeyWindow(seconds);
 const scene=script.find(c=>seconds>=c.start&&seconds<c.start+c.duration)??script[script.length-1],local=seconds-scene.start;
 const voice=scene.voice.find(v=>local>=v.start&&local<v.start+v.duration+.15);
 const focus:Focus={};
 const ranges:[Feature,number,number][]=[['source',12,21],['haptics',21,30],['bearing',30,48],['source',48,55],['haptics',55,70],['bearing',70,88],['haptics',88,95],['text',95,104],['structure',104,126],['source',126,133],['haptics',133,142]];
 for(const [key,a,b] of ranges)focus[key]=(focus[key]??0)+ease((seconds-a)/.8)*(1-ease((seconds-b)/.8));
 return <AbsoluteFill style={{background:'#141716'}}><div className="road-console" style={{width:1600,height:900,transform:`scale(${width/1600})`,transformOrigin:'top left',fontFamily:'Helvetica Neue,PingFang SC,sans-serif'}}>
  <Experience s={j.s} focus={focus} film roadChapter={{name:scene.name,index:script.indexOf(scene)+1,reveal:ease(local/.6)*(1-ease((local-scene.duration+.3)/.3))}} title={scene.title} subtitle={scene.en} chapter={`${String(script.indexOf(scene)+1).padStart(2,'0')} / 11 — SAFETY, WITH YOU`}/>
  <div style={{position:'absolute',inset:'102px 0 0',zIndex:5,background:'#141716',opacity:1-rect.progress,pointerEvents:'none'}}/>
  <div className="journey-video" style={{left:rect.left,top:rect.top,width:rect.width,height:rect.height,borderRadius:18-6*rect.progress}}>
   <PhotoJourney seconds={seconds}/>
   <div className="journey-intro" style={{opacity:1-ease((seconds-7.7)/1.5)}}><small>小林的一天 / A DAY WITH XIAOLIN</small><h2>独自出行，<br/>也能及时察觉。</h2><p>为听障人士设计。<br/>让视线之外的安全线索，抵达手腕。</p><span>感知环境 · 观察确认 · 自主行动</span></div>
   <div className="journey-live" style={{opacity:rect.progress}}><span>出行情景</span><strong>{photoShots[photoIndex(seconds)].label}</strong></div>
  </div>
  {rect.progress>.5&&<div className="journey-note" style={{opacity:rect.progress}}>环境声音 → 腕上提醒 → 观察与行动</div>}
  {voice&&<div className="story-film-caption"><strong>{voice.zh}</strong><span>{voice.en}</span></div>}
 </div><Audio src={staticFile('score.wav')} volume={.32}/>
 {script.flatMap(c=>c.voice.map(v=><Sequence key={v.file} from={Math.round((c.start+v.start)*fps)} durationInFrames={Math.ceil(v.duration*fps)} layout="none"><Audio src={staticFile(v.file)}/></Sequence>))}
 </AbsoluteFill>;
};

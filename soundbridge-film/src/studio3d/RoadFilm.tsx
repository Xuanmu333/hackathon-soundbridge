import {AbsoluteFill,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import script from '../road-script.json';
import {Experience} from './Experience';
import {ease} from './state';
import {TechnicalLogic} from './TechnicalLogic';
import {journeyWindow,roadState} from './roadState';
import {PhotoJourney,photoIndex,photoShots} from './PhotoJourney';
import './road.css';

export const RoadFilm=()=>{
 const frame=useCurrentFrame(),{fps,width}=useVideoConfig(),seconds=frame/fps;
 const j=roadState(seconds),rect=journeyWindow(seconds);
 const scene=script.find(c=>seconds>=c.start&&seconds<c.start+c.duration)??script[script.length-1],local=seconds-scene.start;
 const voice=scene.voice.find(v=>local>=v.start&&local<v.start+v.duration+.15);
 const productOpacity=seconds<42?1-ease((seconds-18)/4):ease((seconds-48)/4);
 return <AbsoluteFill style={{background:'#141716'}}><div className={`road-console ${seconds<42?'technical-opening':''}`} style={{width:1600,height:900,transform:`scale(${width/1600})`,transformOrigin:'top left',fontFamily:'Helvetica Neue,PingFang SC,sans-serif'}}>
  <Experience s={j.s} productOpacity={productOpacity} film roadChapter={{name:scene.name,index:script.indexOf(scene)+1,reveal:ease(local/.6)*(1-ease((local-scene.duration+.3)/.3))}} title={scene.title} subtitle={scene.en} chapter={`${String(script.indexOf(scene)+1).padStart(2,'0')} / 12 — SAFETY, WITH YOU`}/>
  <TechnicalLogic seconds={seconds}/>
  {seconds>=42&&<><div style={{position:'absolute',inset:'102px 0 0',zIndex:5,background:'#141716',opacity:1-rect.progress,pointerEvents:'none'}}/>
  <div className="journey-video" style={{opacity:ease((seconds-42)/.8),left:rect.left,top:rect.top,width:rect.width,height:rect.height,borderRadius:18-6*rect.progress}}>
   <PhotoJourney seconds={seconds}/>
   <div className="journey-intro" style={{opacity:1-ease((seconds-47.7)/1.5)}}><small>小林的一天 / A DAY WITH XIAOLIN</small><h2>独自出行，<br/>也能及时察觉。</h2><p>为听障人士设计。<br/>让视线之外的安全线索，抵达手腕。</p><span>感知环境 · 观察确认 · 自主行动</span></div>
   <div className="journey-live" style={{opacity:rect.progress}}><span>出行情景</span><strong>{photoShots[photoIndex(seconds)].label}</strong></div>
  </div>
  {rect.progress>.5&&<div className="journey-note" style={{opacity:rect.progress}}>环境声音 → 腕上提醒 → 观察与行动</div>}
  </>}
  {voice&&<div className="story-film-caption"><strong>{voice.zh}</strong><span>{voice.en}</span></div>}
 </div><Audio src={staticFile('score.wav')} volume={.32}/>
 {script.flatMap(c=>c.voice.map(v=><Sequence key={v.file} from={Math.round((c.start+v.start)*fps)} durationInFrames={Math.ceil(v.duration*fps)} layout="none"><Audio src={staticFile(v.file)}/></Sequence>))}
 </AbsoluteFill>;
};

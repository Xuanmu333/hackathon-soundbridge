import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import script from '../story-script.json';
import {Experience} from './Experience';
import {ease, Feature, Focus, initialState, ViewState} from './state';

const envelope = (t:number,start:number,end:number,fade=.65) => ease((t-start)/fade)*(1-ease((t-end+fade)/fade));
export const filmState = (seconds: number) => {
  const scene = script.find(c => seconds >= c.start && seconds < c.start + c.duration) ?? script[script.length - 1];
  const t = seconds - scene.start;
  const s: ViewState = {...initialState, bearing:-120, time:10, orbit:.09*Math.sin(seconds*.08)};
  const focus:Focus={};
  const light = (key:Feature,start=0,end=scene.duration) => {focus[key]=envelope(t,start,end);};
  let picture:string|undefined, storyOpacity=0, steps:string[]=[], detail='';
  switch(scene.name){
    case 'Opening':
      s.time=0;picture='safety/walking.png';storyOpacity=1-ease((t-9)/2.5);steps=['独自出行','察觉环境','自主决定'];detail='听障使用者小林，正在去见朋友。\n她期待的是更从容地掌握自己的日常。';break;
    case 'Outdoors':
      picture='safety/walking.png';storyOpacity=1-ease((t-4)/1.5);s.time=Math.max(0,Math.min(7,(t-4.5)*.72));light('source',4,15);steps=['身后传来车铃','目光仍然朝前','声音抵达手表'];detail='共享步道上，一声车铃来自左后方。\n把视线之外的线索，带到手腕。';break;
    case 'Recognition':
      s.time=4.6+Math.min(2.4,t*.23);light('source');break;
    case 'Direction':
      light('bearing');s.directionPreview=true;s.faceView=ease(t/1.7)*(1-ease((t-20)/2));
      s.time=t<5?2.8+t*.34:t<10?4.6+(t-5)*.48:10;
      s.bearing=-120+75*ease((t-11.2)/.8)+105*ease((t-12.9)/.8)+75*ease((t-14.6)/.8);
      s.uncertain=t>=17;break;
    case 'Haptics':
      light('haptics');s.time=7.15+t;s.faceView=.65*ease(t/1);picture='story/glance.png';storyOpacity=envelope(t,2.6,5.4,.6)+envelope(t,8,12,.65);steps=['三次短振','抬腕查看','获得来向线索'];detail='触觉先引起注意。\n表盘再给出声音类别与来向。';break;
    case 'Response':
      picture='safety/observe.png';storyOpacity=envelope(t,0,12,.65);steps=['收到线索','观察确认','自主让行','继续前行'];detail='小林确认骑行者的位置，让出空间。\n手表提供线索，行动由她自己决定。';break;
    case 'Personalize':
      s.event=t>1.5&&t<3.2?'horn':'bike';light('source',0,4.8);light('haptics',4.5,7.5);light('text',7,12);s.strength=.35+.5*ease((t-4.9)/1.5);s.largeText=t>7.5;s.time=t>4.9&&t<7.5?7.15+(t-4.9):10;s.faceView=.65*ease(t/1);break;
    case 'Home':
      s.event='bell';s.bearing=-45;s.time=Math.min(11,Math.max(0,(t-3.5)*1.3));light('source',4,10);light('haptics',9,15);
      picture='story/home.png';storyOpacity=(1-ease((t-4)/1.2))+envelope(t,10.2,15,.65);steps=['专注手边的事','两组双振','看见门铃文字','从容回应'];detail='门铃响起，来访信息抵达手腕。\n她可以自行决定何时回应。';break;
    case 'Structure':
      light('structure');s.exploded=ease((t-1)/2.8)*(1-ease((t-9.6)/3));s.faceView=-1.1*s.exploded;s.orbit-=.25*s.exploded;s.time=4.6+Math.min(2.3,t*.2);break;
    case 'Modes':
      light('mode');s.mode=t>1.5&&t<8?'paused':'listening';s.time=t<1.5?10:t<8?0:t-8;break;
    case 'Privacy':
      light('privacy');s.time=4.8;break;
    case 'Closing':
      s.time=0;picture='safety/friends.png';storyOpacity=ease(t/.8);steps=['独立','安心','连接'];detail='科技的意义，是让她更从容地\n过自己的生活。';break;
  }
  const voice=scene.voice.find(v=>t>=v.start&&t<v.start+v.duration+.15);
  return {s,scene,t,focus,picture,storyOpacity,steps,detail,caption:voice?{zh:voice.zh,en:voice.en}:undefined};
};

export const DemoFilm = () => {
  const frame=useCurrentFrame(),{fps,width}=useVideoConfig();
  const {s,scene,t,focus,picture,storyOpacity,steps,detail,caption}=filmState(frame/fps);
  // A short editorial dip hides chapter state changes without interrupting movement inside a shot.
  const cut=scene.start===0?0:1-ease(t/.45);
  return <AbsoluteFill style={{background:'#141716'}}>
    <div style={{width:1600,height:900,transform:`scale(${width/1600})`,transformOrigin:'top left',fontFamily:'Helvetica Neue, PingFang SC, sans-serif'}}>
      <Experience s={s} focus={focus} film title={scene.title} subtitle={scene.en} chapter={`${String(script.indexOf(scene)+1).padStart(2,'0')} / 12 — SAFETY, WITH YOU`}/>
      {picture&&storyOpacity>0&&<div style={{position:'absolute',inset:'104px 0 0',background:'#141716',opacity:storyOpacity,zIndex:5}}/>}
      {picture&&storyOpacity>0&&<div className="story-overlay" style={{opacity:storyOpacity}}>
        <Img src={staticFile(picture)} style={{transform:`scale(${1+t*.002})`,transformOrigin:'65% 50%'}}/>
        <div className="story-shade"/>
        <div className="story-copy" style={{transform:`translateY(${(1-ease(t/.9))*14}px)`}}><small>小林的一天 / A DAY WITH XIAOLIN</small><h2>{scene.title.split('，').map((line,i)=><span key={line} style={{display:'block'}}>{line}{i<scene.title.split('，').length-1?'，':''}</span>)}</h2><p style={{whiteSpace:'pre-line'}}>{detail}</p></div>
        <div className="story-steps">{steps.map((step,i)=>{const a=ease((t-i*2)/.7);return <div key={step} style={{opacity:.4+.6*a,borderColor:`rgba(245,238,215,${.2+.6*a})`}}><b>0{i+1}</b>{step}</div>;})}</div>
      </div>}
      {cut>0&&<div className="chapter-wipe" style={{opacity:cut}}/>}
      {caption&&<div className="story-film-caption"><strong>{caption.zh}</strong><span>{caption.en}</span></div>}
    </div>
    <Audio src={staticFile('score.wav')} volume={.32}/>
    {script.flatMap(c=>c.voice.map(v=><Sequence key={v.file} from={Math.round((c.start+v.start)*fps)} durationInFrames={Math.ceil(v.duration*fps)} layout="none"><Audio src={staticFile(v.file)}/></Sequence>))}
  </AbsoluteFill>;
};

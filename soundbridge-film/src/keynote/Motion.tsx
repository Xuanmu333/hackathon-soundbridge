import React, {useLayoutEffect, useRef} from 'react';
import {PerspectiveCamera,Vector3} from 'three';
import marks from '../hackathon/marks.json';
import {cameraPosition} from '../studio3d/WatchWorld';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SlateWatch} from '../hackathon/SlateWatch';
import {haptic, initialState, micArrivals, ViewState} from '../studio3d/state';
import story from './story.json';
import duration from './durations.json';

const S=(t:number,a:number,b:number)=>{const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*x*(10+x*(-15+6*x));};
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
const windowAt=(t:number,a:number,b:number,edge=.9)=>S(t,a-edge,a+edge)*(1-S(t,b-edge,b+edge));
const box=(left:number,top:number):React.CSSProperties=>({position:'absolute',left,top});
const captionParts=[
 [],
 [['小林沿着步道去上班。','Xiaolin takes the riverside path to work.'],['她看得见前方，却可能错过身后骑行者的车铃。','She sees the path ahead, but may miss the bicycle bell behind her.']],
 [['手腕轻振三下。','Three short taps get her attention.'],['她抬腕看到左后方的标记，','She checks the rear-left marker,'],['转头确认，再往旁边让出一点空间。','looks back, then makes room for the rider.']],
 [['同一声车铃，先后抵达表壳上的四个麦克风。','The same bell reaches four microphones at slightly different times.'],['处理器比较这段微小的时差，估算声音的来向。','The processor uses those tiny delays to estimate its bearing.']],
 [['手表上的 AI 比较声谱，','On-device AI compares sound patterns'],['区分车铃、鸣笛、警笛和施工声。','to distinguish bells, horns, sirens and roadworks.'],['风声和人群底噪留在背景里。','Wind and crowd noise stay in the background.']],
 [['手腕转动时，表盘的十二点方向也在变。','As her wrist turns, twelve o’clock turns with it.'],['小林自然抬腕，姿态稳定后，','Xiaolin raises her wrist naturally. Once it settles,'],['箭头才显示新的相对角度。','the pointer shows the updated relative bearing.']],
 [['路口传来鸣笛，手腕长振两下。','At the crossing, two long pulses mark a horn.'],['小林手臂仍垂着。','Her arm is still lowered.'],['声音持续、提醒尚未确认时，','While the sound persists without acknowledgement,'],['手表隔一会儿再振，逐步增强。','the watch repeats the cue at intervals, with increasing strength.']],
 [['小林停在路缘内。','Xiaolin stops at the curb.'],['她抬腕看清来向，点按结束提醒，','She checks the bearing and taps to end the alert.'],['抬头观察，等车过去再走。','She looks up and waits for the vehicle to pass.']],
 [],
];
const offsets=[.9,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2];
const subtitle=(idx:number,sec:number)=>{
 const parts=captionParts[idx];if(!parts.length||idx===8)return null;
 const total=parts.reduce((n,p)=>n+p[0].length,0);
 let a=offsets[idx];
 for(const p of parts){let b=a+duration[idx]*p[0].length/total;if(sec>=a&&sec<b+.025)return p;a=b;}
 return null;
};
const crops=[['bat',27,20,32,34],['motorola',1143,21,110,28],['hackathon',31,667,155,31]] as const;
const marksCenter=[[43,37],[1198,35],[108.5,682.5]];
const violet='#6855b6';
const tint=(a:string,b:string,w:number)=>'rgb('+[0,1,2].map(i=>Math.round(mix(parseInt(a.slice(1+i*2,3+i*2),16),parseInt(b.slice(1+i*2,3+i*2),16),w))).join(',')+')';
const labels=[[],['步道上','来自视线之外'],['左后方','三次短振'],['阵列收音','四路信号的到达顺序'],['端侧声音识别','声谱中的道路事件'],['表盘十二点为参照','声源相对方位'],['未确认','两次长振 · 间隔重复'],['她看清来向','点按后提醒结束'],[]];
type Point=[number,number];
function watchState(t:number):ViewState{
 const raise=S(t,74,80), horn=t>=86, left=-123+45*raise;
 const pulse=t>=24&&t<27?7.25+(t-24):horn&&t>=89&&t<108?7.25+(t-89)%5:0;
 return {...initialState,orbit:.5*Math.sin(t*.075-.8)+.1*Math.cos(t*.19),faceView:.15+.78*windowAt(t,68,87,3)-.48*windowAt(t,38,54,3),
 time:t<22?0:t<38?8+(t-22):t<55?3.2+1.1*S(t,41,48):t<70?5.4:t<117?8+t*.08:0,
 event:horn?'horn':'bike',directionReady:(t<74||t>79.8)&&(t<87||t>=106),wristYaw:40*raise-26*S(t,84,88),bearing:horn?57:Math.round(left),
 bearingHighlight:Math.max(windowAt(t,26,33),windowAt(t,79.8,86),windowAt(t,106,111)),hapticTime:pulse,
 strength:.58+.27*S(t,94,102),exploded:1.15*windowAt(t,41,53,2.5),alertStage:horn?(t>110?'confirmed':t>=106?'viewing':'repeat'):undefined};
}
const photoShots=[
 [6.1,23.5,'safety/walking.png'],[23.5,30.7,'story/glance.png'],[30.7,39,'safety/observe.png'],
 [85.4,105,'keynote/approach.png'],[105,111,'road-photos/curb-check.png'],[111,113.3,'road-photos/adjust.png'],[113.3,116,'road-photos/wait.png'],[116,121.7,'keynote/onward.png'],
] as const;
function inkPoint(t:number,u:number,k:number,join:number,beat:number):Point{
 const x=89+u*1050, base=555+k*9, phase=t*.85;
 const angle=u*2*Math.PI-Math.PI/2, center=marksCenter[k];
 const home:Point=k===0?[center[0]+13*Math.cos(angle),center[1]+13*Math.sin(angle)]:[center[0]+(u-.5)*(k===1?98:135),center[1]+(k===1?4*Math.sin(u*8*Math.PI):0)];
 const spread=windowAt(t,39,55,2.3), spectral=windowAt(t,55,71,2.3), bearing=windowAt(t,71,87,2);
 const road=Math.sin(Math.PI*u)**2*(20*Math.sin(u*7-phase*.22)+8*Math.sin(u*13+phase*.22));
 const field=Math.exp(-((u-.48)**2)/.068)*Math.sin(u*(44+k*3)-phase*2);
 const pulse=(c:number,w:number)=>Math.exp(-((u-c)**2)/w);
 const taps=pulse(.34,.00035)+pulse(.5,.00035)+pulse(.66,.00035);
 const double=pulse(.39,.0028)+pulse(.64,.0028);
 const h=windowAt(t,24,37,2)*taps+windowAt(t,87,109,2.4)*double;
 const signal=base+road*(1-spread)*(1-spectral)-field*(spread*22+spectral*(58-k*10))-(15+beat*29)*h;
 const arc:Point=[390+235*Math.cos(Math.PI*(1.1+u*.8)),511+60*Math.sin(Math.PI*(1.1+u*.8))+k*7];
 const dest:Point=[mix(x,arc[0],bearing*.65),mix(signal,arc[1],bearing*.65)];
 return [mix(home[0],dest[0],join),mix(home[1],dest[1],join)-Math.sin(Math.PI*join)*(k===2?25:52)];
}
// Gather the ink in place before the resulting paths travel into the story.
const sortedInk=marks.map((group,k)=>[...group].sort((a,b)=>k===0?
 Math.atan2(a[1]-37,a[0]-43)-Math.atan2(b[1]-37,b[0]-43):a[0]-b[0]||a[1]-b[1]));
function LogoInk({t}:{t:number}){
 const ref=useRef<HTMLCanvasElement>(null);
 useLayoutEffect(()=>{const c=ref.current?.getContext('2d');if(!c)return;c.setTransform(1.5,0,0,1.5,0,0);c.clearRect(0,0,1280,720);
 const gathering=S(t,5.1,6.55)*(1-S(t,122.4,123.75)),shown=S(t,5.08,5.33)*(1-S(t,6.35,6.65))+S(t,122.35,122.6)*(1-S(t,123.52,123.8));
 if(!shown)return;c.fillStyle='#696281';sortedInk.forEach((pts,k)=>pts.forEach(([x,y,alpha],i)=>{const u=i/(pts.length-1),a=u*Math.PI*2-Math.PI,cc=marksCenter[k];
 const dst=k===0?[cc[0]+13*Math.cos(a),cc[1]+13*Math.sin(a)]:[cc[0]+(u-.5)*(k===1?98:135),cc[1]+(k===1?4*Math.sin(u*8*Math.PI):0)];
 c.globalAlpha=shown*alpha;c.fillRect(mix(x,dst[0],gathering),mix(y,dst[1],gathering),1.2,1.2)}));},[t]);
 return <canvas ref={ref} width={1920} height={1080} style={{...box(0,0),width:1280,height:720}}/>;
}
function projectWatch(s:ViewState,x:number,z:number,y:number,left:number,top:number,scale:number):Point{
 const camera=new PerspectiveCamera(36,620/537,.1,100);camera.position.set(...cameraPosition(s.orbit,s.faceView));camera.lookAt(-.35,1.05,0);camera.updateMatrixWorld();
 const v=new Vector3(x,y,z).applyAxisAngle(new Vector3(0,1,0),-(s.wristYaw??0)*Math.PI/180);v.y+=1.4;v.project(camera);
 return [left+310+310*v.x*scale,top+268.5-268.5*v.y*scale];
}
export const KeynoteMotion=()=>{
 const t=useCurrentFrame()/30,{width}=useVideoConfig(),idx=story.findIndex(s=>t<s.end),sc=story[idx],dt=t-sc.start;
 const join=S(t,6.5,10.9)*(1-S(t,117.6,122.4)),corners=(1-S(t,5.08,5.33))+S(t,123.3,123.8);
 const s=watchState(t),beat=haptic(s),tech=windowAt(t,39,86.5,2);
 const street=Math.max(windowAt(t,8.1,23.8,2.2),windowAt(t,31.6,37.1,1.85),windowAt(t,88,96.3,2.5),windowAt(t,114.5,120.3,2));
 const photo=Math.max(windowAt(t,7.1,38.7,1.4),windowAt(t,86,121.1,1.55));
 const handX=mix(962,903,S(t,65,85)),handY=mix(mix(513,360,S(t,23,28)),365,S(t,65,85));
 const watchX=mix(662-26*tech,handX-310,street),watchY=mix(44+11*Math.sin(t*.055),handY-268.5,street);
 const scale=mix(1.08+.18*tech+.035*Math.sin(t*.075),.075,street);
 const hero=(1-S(t,6.1,8.35))+S(t,120.6,123.5),name='SoundBridge',tag='为听障人士设计的环境感知手表';
 const typing=(str:string,first:number,step:number)=>str.slice(0,Math.max(0,Math.floor((t-first)/step)+1));
 const cap=subtitle(idx,dt);
 const mid=idx>0&&idx<8,mat=windowAt(t,54.5,71,1.65);
 const mic=micArrivals(-123).sort((a,b)=>a.delay-b.delay).map(m=>projectWatch(s,m.x,m.z,-.015,watchX,watchY,scale));
 const center=projectWatch(s,0,0,.17,watchX,watchY,scale),link=windowAt(t,38.8,54.8,2),dial=windowAt(t,25.2,35,2)+windowAt(t,72,87,2)+windowAt(t,106,113,2);
 const trace=(u:number,k:number):Point=>{const point=inkPoint(t,u,k,join,beat),tail=S(u,.66,1);
 const m=mic[[0,2,3][k]];
 const a=(s.bearing-90+(u-1)*90)*Math.PI/180,target=[center[0]+118*Math.cos(a),center[1]+84*Math.sin(a)];
 const studio:Point=[mix(mix(point[0],m[0],link*tail),target[0],dial*tail),mix(mix(point[1],m[1],link*tail),target[1],dial*tail)];
 const sourceX=mix(163,221,S(t,75,86)),sourceY=mix(331,294,S(t,75,86));
 const bow=Math.sin(Math.PI*u),packet=Math.exp(-((u-((t*.25)%1))**2)/.016);
 const field:Point=[mix(sourceX,handX,u),mix(sourceY,handY,u)-bow*(86+k*13)+bow*packet*(7+k*1.5)*Math.sin(55*u-t*5)];
 const onward=S(t,113,116.8);
 const path:Point=[mix(field[0],340+220*u+195*u*u,onward),mix(field[1],731-465*u+65*u*u+k*bow*4,onward)];
 return [mix(studio[0],path[0],street),mix(studio[1],path[1],street)];};
 return <AbsoluteFill style={{background:'#e7eaf0'}}><div style={{width:1280,height:720,flex:'none',position:'relative',overflow:'hidden',transformOrigin:'0 0',transform:'scale('+width/1280+')',background:'radial-gradient(ellipse at 76% 43%, #fcfcff 0%,#ecebf4 28%,#e7eaf0 66%)',fontFamily:'Helvetica Neue, PingFang SC, sans-serif',color:'#272538'}}>
 {photo>.001&&<div style={{...box(mix(80,0,street),mix(197,0,street)),width:mix(564,1280,street),height:mix(298,720,street),borderRadius:17*(1-street),overflow:'hidden',opacity:photo}}>
 {photoShots.map(([a,b,file],i)=>{if(t<a-1.3||t>b+1.35)return null;const entering=(i===0||i===3)?1:S(t,a-1.25,a+1.25);return <Img key={a} src={staticFile(file)} style={{...box(0,0),width:'100%',height:'100%',objectFit:'cover',opacity:entering,transform:'scale('+(1.015+.045*S(t,a-1,b+1))+')',objectPosition:'50% 50%'}}/>})}
 <div style={{position:'absolute',inset:0,opacity:street,background:'linear-gradient(180deg,rgba(14,16,24,.53),transparent 30%, transparent 66%,rgba(12,15,21,.79)),linear-gradient(105deg,rgba(11,16,24,.38),transparent 56%)'}}/></div>}
 <div style={{...box(watchX+154,watchY+392),width:330,height:46,background:'radial-gradient(ellipse,#49435948,transparent 67%)',filter:'blur(7px)',opacity:(1-mat*.8)*(1-street)}}/>
 <div style={{...box(watchX,watchY),width:620,height:537,transform:'scale('+scale+')',opacity:(1-.98*mat)*(1-S(street,.65,.97))}}>{street<.98&&<SlateWatch s={s}/>}</div>
 <svg viewBox="0 0 1280 720" width="1280" height="720" style={{...box(0,0),pointerEvents:'none'}}>
 {[0,1,2].map(k=>{const pts=Array.from({length:181},(_,i)=>trace(i/180,k));const draw=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');const p=pts[Math.min(180,Math.floor(((t*.125+k*.3)%1)*180))];const op=S(t,6.35,6.65)*(1-S(t,122.35,122.6));return <g key={k} opacity={op*(1-.50*street)*(1-.72*S(t,116,118)*street)}><path d={draw} stroke={tint([violet,'#9387c3','#aca5c4'][k],['#fbefcc','#ded3f4','#ece4f7'][k],street)} strokeWidth={k===0?2.1:1.15} fill="none"/><circle cx={p[0]} cy={p[1]} r={2.9-k*.4} fill={violet} opacity={.76*join}/></g>})}
 {beat>0&&street>.1&&[0,1,2].map(k=><circle key={k} cx={handX} cy={handY} r={8+k*8+beat*8} fill="none" stroke="#ffe7aa" strokeWidth={2} opacity={beat*street*(1-k*.23)}/>)}
 {mic.map(([x,y],k)=>{const a=link*S(t,41+k*.88,42.1+k*.88);return <g key={k} opacity={a}><circle cx={x} cy={y} r="6.5" fill="#f5f2ff" stroke={violet} strokeWidth="2"/><text x={x+(k%2?14:-14)} y={y-11} textAnchor={k%2?'start':'end'} fontSize="15" fill="#4b406e">{micArrivals(-123).sort((a,b)=>a.delay-b.delay)[k].id}</text></g>})}
 </svg>
 {((t>5&&t<6.7)||(t>122.3&&t<123.9))&&<LogoInk t={t}/>}
 {mat>.001&&<div style={{...box(711,182),width:470,opacity:mat}}>
 <div style={{fontSize:16,color:'#65577e',marginBottom:17}}>声音特征 · 时频分布</div>
 <svg viewBox="0 0 444 166" width="444" height="166">{Array.from({length:16},(_,r)=>Array.from({length:57},(_,c)=>{
 const freq=(15-r)/16,u=c/56,band=.22+.17*Math.sin(u*5+t*.39),harm=Math.exp(-((freq-band)**2)/.0024)+.68*Math.exp(-((freq-2*band)**2)/.0036);
 const amp=(.25+.75*Math.abs(Math.sin(u*10-t*.48)))*harm;return <rect key={r*57+c} x={c*7.8} y={r*10} width="5.6" height="6.5" rx="1.5" fill={violet} opacity={.07+.82*Math.min(1,amp)}/>;}))}</svg>
 <div style={{fontSize:15,color:'#615877',marginTop:8}}>横轴：时间　　 纵轴：频率</div></div>}
 {crops.map(([file,left,top,w,h],i)=><Img key={file} src={staticFile('hackathon/'+file+'.png')} style={{...box(left,top),width:w,height:h,opacity:corners*S(t,.03+i*.12,.85+i*.12),clipPath:'inset(0 '+(100*(1-S(t,i*.12,.9+i*.12)))+'% 0 0)'}}/>)}
 {corners>0&&<Img src={staticFile('hackathon/credit.png')} style={{...box(1258,575),width:15,height:124,opacity:.55*corners}}/>}
 {hero>0&&<div style={{...box(82,246),opacity:hero,transform:'translateY('+(-15*(1-hero))+'px)'}}>
 <div style={{fontSize:78,fontWeight:650,letterSpacing:'-.065em',color:violet}}>{typing(name,.43,.106)}<span style={{fontWeight:300,opacity:t>.2&&t<1.8?1:0}}>|</span></div>
 <div style={{fontSize:27,letterSpacing:'-.025em',marginTop:10}}>{typing(tag,1.86,.119)}</div>
 <div style={{fontSize:17,color:'#615e76',marginTop:13,opacity:S(t,2.5,4)}}>An environmental awareness watch for deaf<br/>and hard-of-hearing people.</div></div>}
 {story.slice(1,8).map((ch,j)=>{const a=windowAt(t,ch.start+.25,ch.end-.3,1.05);if(a===0)return null;return <div key={j} style={{...box(80,mix(79,73,street)),color:tint('#272538','#ffffff',street),textShadow:street>.5?'0 1px 12px #15162266':'none',opacity:a,transform:'translateY('+((1-a)*(t<ch.start+2?13:-13))+'px)'}}><div style={{fontSize:16,color:tint(violet,'#f0dfbb',street),letterSpacing:'.02em'}}>{ch.en}</div><div style={{fontSize:49,letterSpacing:'-.055em',fontWeight:590,marginTop:5}}>{ch.title}</div></div>})}
 {tech>.001&&<div style={{...box(82,215),width:535,opacity:tech*(1-photo)}}>
 {[[39,55],[55,71],[71,87]].map(([a,b],j)=>{const alpha=windowAt(t,a,b,1);if(alpha<.001)return null;return <div key={a} style={{...box(0,0),opacity:alpha}}>
 <div style={{fontSize:16,color:'#685a93',marginBottom:19}}>{labels[j+3][0]}</div>
 {j===0?micArrivals(-123).sort((a,b)=>a.delay-b.delay).map((m,k)=>{const p=S(t,41+k*.88,42.1+k*.88);return <div key={m.id} style={{display:'flex',alignItems:'center',height:44,gap:16,color:violet}}><span style={{fontSize:18,width:35}}>{m.id}</span><svg width="305" height="32"><path d={Array.from({length:120},(_,n)=>{let u=n/119,v=16-12*Math.exp(-((u-.22-m.fraction*.22)**2)/.013)*Math.sin(57*u);return (n?'L':'M')+(u*300)+' '+v}).join(' ')} fill="none" stroke={violet} strokeWidth="1.8" opacity={.22+.78*p}/></svg><span style={{opacity:p,fontSize:14}}>第 {k+1} 路到达</span></div>}):
 j===1?<div>{['车铃','鸣笛','警笛','施工声','风声与人群'].map((v,k)=><div key={v} style={{display:'flex',alignItems:'center',height:38,gap:18,opacity:.35+.65*S(t,55.6+k*.8,57+k*.8)}}><span style={{fontSize:19,width:100}}>{v}</span><svg width="155" height="26">{Array.from({length:42},(_,n)=>{const h=(3+15*Math.abs(Math.sin(n*(k+1)*.31+t*.55))*Math.sin(Math.PI*n/42)**.6)*(k===4?.42:1);return <rect key={n} x={n*3.6} y={13-h/2} width="2.2" height={h} rx="1" fill={k===4?'#9693a3':violet}/>})}</svg><span style={{fontSize:15,color:'#6b6779'}}>{k===4?'背景':'道路事件'}</span></div>)}</div>:
 <div><div style={{fontSize:87,fontWeight:500,letterSpacing:'-.065em',color:violet,fontVariantNumeric:'tabular-nums'}}>{s.directionReady?s.bearing+'°':'···'}</div><div style={{fontSize:19,marginTop:12}}>{s.directionReady?'相对表盘十二点':'抬腕转动中'}</div></div>}
 </div>})}</div>}
 {mid&&photo>.05&&<div style={{...box(82,509),fontSize:15,color:'#615575',opacity:(1-street)*photo*windowAt(t,sc.start+.45,sc.end-.45,.8)}}>{labels[idx].join('　/　')}</div>}
 {cap&&<div style={{position:'absolute',left:85,right:85,bottom:23,textAlign:'center',color:tint('#272538','#ffffff',street),textShadow:street>.48?'0 1px 8px #15172099':'none'}}><div style={{fontSize:25,fontWeight:550,lineHeight:1.45}}>{cap[0]}</div><div style={{fontSize:17,marginTop:3,color:tint('#545166','#f5f0ea',street)}}>{cap[1]}</div></div>}
 </div></AbsoluteFill>;
};

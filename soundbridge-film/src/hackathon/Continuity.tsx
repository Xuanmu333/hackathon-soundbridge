import {useLayoutEffect, useRef} from 'react';
import {Img,staticFile} from 'remotion';
import marks from './marks.json';
import {ease, haptic, hapticPattern, ViewState} from '../studio3d/state';

export const blend = (from:number, to:number, amount:number) => from + (to-from)*amount;
export const progress = (t:number, start:number, end:number) => ease((t-start)/(end-start));
export const inside = (t:number) => progress(t,3.2,6.1)*(1-progress(t,156.4,160));
const crops=[
 {name:'bat',left:27,top:20,width:32,height:34},
 {name:'motorola',left:1143,top:21,width:110,height:28},
 {name:'hackathon',left:31,top:667,width:155,height:31},
];
const inkToTrace=(body:number)=>progress(body,0,.055);
const markPoints = marks.map((group,index) => [...group].sort((a,b) => index === 0
  ? Math.atan2(a[1]-37,a[0]-43)-Math.atan2(b[1]-37,b[0]-43)
  : a[0]-b[0] || a[1]-b[1]));

// Use the photographed lettering itself as the starting geometry of each trace.
export const Continuity = ({t,s,photo}:{t:number;s:ViewState;photo:number}) => {
 const canvas = useRef<HTMLCanvasElement>(null);
 useLayoutEffect(()=>{
  const ctx=canvas.current?.getContext('2d');
  if(!ctx)return;
  ctx.setTransform(1.5,0,0,1.5,0,0);
  ctx.clearRect(0,0,1280,720);
  const body=inside(t), beat=haptic(s), pattern=hapticPattern(s.event);
  const waveY=blend(352,488,photo), pulseY=blend(460,549,photo);
  const ink=[100,100,127], violet=[101,83,181];
  markPoints.forEach((points,index)=>{
   const open=progress(t,.13+index*.18,1.22+index*.18);
   const color=ink.map((v,i)=>Math.round(blend(v,violet[i],body)));
   ctx.fillStyle='rgb('+color.join(',')+')';
   points.forEach(([x,y,alpha],i)=>{
    const u=i/(points.length-1);
    let tx=0,ty=0;
    if(index===0){
     const tick=Math.min(95,Math.floor(u*96));
     const angle=(tick/96)*2*Math.PI-Math.PI;
     const radial=1+(u*96%1)*(tick%8===0?.048:.02);
     tx=319+Math.cos(angle)*226*radial;
     ty=344+Math.sin(angle)*194*radial;
    }else if(index===1){
     const column=Math.min(71,Math.floor(u*72));
     const envelope=Math.sin(Math.PI*column/72)**.65;
     const signal=s.event==='noise'?.13:.32+.68*Math.abs(Math.sin(column*.27-t*2.1)*Math.cos(column*.091+t*.6));
     tx=651+column*7.66;
     ty=waveY+(u*72%1-.5)*(6+(photo?42:76)*signal*envelope);
    }else{
     const count=pattern.length||1;
     const slot=Math.min(count-1,Math.floor(u*count));
     const note=pattern[slot];
     const width=note?32+note.duration*92:145;
     tx=653+slot*(455/count)+(u*count%1)*width;
     ty=pulseY+(y-683)*(.17+.28*beat);
    }
    const arrive=open*(.74+.26*progress(t,.18+u*.6+index*.18,.78+u*.6+index*.18));
    const travel=body;
    const arc=Math.sin(travel*Math.PI);
    const px=blend(x,tx,travel)+arc*(index===2?55:-30);
    const py=blend(y,ty,travel)+arc*(index===1?-52:40)+(1-arrive)*10;
    ctx.globalAlpha=inkToTrace(body)*alpha*arrive*blend(1,index===0?.55:.86,travel);
    ctx.fillRect(px,py,blend(1, index===0?1.55:2.2,travel),blend(1,1.7,travel));
   });
  });
  ctx.globalAlpha=1;
 },[t,s,photo]);
 return <>{crops.map(({name,left,top,width,height},i)=>{
  const appear=progress(t,.13+i*.18,1.22+i*.18);
  const opacity=appear*(1-inkToTrace(inside(t)));
  return opacity>0&&<Img key={name} src={staticFile('hackathon/'+name+'.png')} style={{position:'absolute',left,top,width,height,opacity,transform:'translateY('+((1-appear)*10)+'px)',clipPath:'inset(0 '+((1-appear)*65)+'% 0 0)'}}/>;
 })}<canvas ref={canvas} width={1920} height={1080} style={{position:'absolute',inset:0,width:1280,height:720,pointerEvents:'none'}}/></>;
};

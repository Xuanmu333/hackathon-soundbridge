import {ease,haptic,initialState,ViewState} from './state';
export const journeyWindow = (t:number) => {
  const u=ease((t-8)/4);
  return {left:36+1134*u,top:106+78*u,width:1528-1138*u,height:680-460.625*u,progress:u};
};
const hold=(t:number,a:number,b:number,fade=.8)=>ease((t-a)/fade)*(1-ease((t-b)/fade));
export const roadState=(t:number)=>{
  const s:ViewState={...initialState,bearing:-120,time:0,orbit:.04*Math.sin(t*.08)};
  let elapsed=-1;
  if(t>=12&&t<48){elapsed=t-12;s.bearing=-120+75*ease((t-25)/6);}
  if(t>=48&&t<104){elapsed=t-48;s.event='horn';s.bearing=60-120*ease((t-60)/6);}
  if(t>=126){elapsed=t-126;s.bearing=135-90*ease((t-139)/6);}
  if(elapsed>=0)s.time=Math.min(11,elapsed);
  if(t>=30&&t<48){s.directionPreview=true;s.faceView=.55;s.time=10;}
  if(t>=70&&t<88){s.directionPreview=true;s.faceView=.55;s.time=10;}
  s.strength=t<88?.65:.45+.4*ease((t-91)/2);s.largeText=t>=95;
  if(t>=88&&t<104){s.time=t>=91&&t<94?7.15+t-91:10;s.faceView=.55;}
  if(t>=104&&t<126){s.time=5;s.exploded=ease((t-106)/3)*(1-ease((t-120)/3));s.faceView=-1.1*s.exploded;s.orbit-=.25*s.exploded;}
  if(t>=146)s.time=0;
  const raise=Math.max(hold(t,19.55,24),hold(t,55.55,60),hold(t,89,98),hold(t,133.55,138));
  const turn=Math.max(hold(t,22,27),hold(t,58,65),hold(t,136,141));
  const pause=Math.max(hold(t,20.5,28),hold(t,55.5,67),hold(t,88,100),hold(t,134.5,142));
  const distance=.55*(Math.min(t,21)+Math.max(0,Math.min(t-29,27))+Math.max(0,Math.min(t-68,21))+Math.max(0,Math.min(t-101,34))+Math.max(0,t-143));
  const side=.66*(-hold(t,23,29,1.2)+hold(t,137,143,1.2));
  const wristPulse=haptic(s);
  const incident=t<48?'bike':t<126?'horn':'rear';
  const action=raise>.3?'抬腕查看':pause>.5?(turn>.4?'观察来向 · 等待通过':'停步确认'):Math.abs(side)>.25?'靠边让行':'保持观察 · 继续行走';
  return {s,raise,turn,walk:1-pause,distance,side,wristPulse,incident,action};
};

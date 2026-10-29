import {ease,haptic,initialState,ViewState} from './state';
export const journeyWindow = (t:number) => {
  const u=ease((t-48)/4);
  return {left:36+1134*u,top:106+78*u,width:1528-1138*u,height:680-460.625*u,progress:u};
};
const hold=(t:number,a:number,b:number,fade=.8)=>ease((t-a)/fade)*(1-ease((t-b)/fade));
export const roadState=(t:number)=>{
  const s:ViewState={...initialState,bearing:-120,time:0,orbit:.04*Math.sin(t*.08)};
  if(t<22){s.exploded=ease((t-2)/3)*(1-ease((t-16)/3));s.faceView=-1.1*s.exploded;s.orbit-=.25*s.exploded;}
  if(t>=52&&t<82){s.time=Math.min(11,t-52);s.bearing=-120+75*ease((t-65)/9);}
  if(t>=82&&t<126){s.time=Math.min(11,t-82);s.event='horn';s.bearing=60-120*ease((t-94)/6);}
  if(t>=126){s.time=Math.min(11,t-126);s.bearing=135-90*ease((t-139)/6);}
  if(t>=70&&t<82||t>=104&&t<116){s.directionPreview=true;s.faceView=.55;s.time=10;}
  s.strength=t<116?.65:.45+.4*ease((t-118)/2);s.largeText=t>=122;
  if(t>=116&&t<126){s.time=t>=118&&t<121?7.15+t-118:10;s.faceView=.55;}
  if(t>=144)s.time=0;
  const highlight=Math.max(hold(t,61,68),hold(t,71,81),hold(t,90,94),hold(t,104,116),hold(t,134,141));
  s.bearingHighlight=highlight*(.65+.35*Math.pow(Math.sin(t*Math.PI),2));
  s.faceView+=highlight*.5;
  const raise=Math.max(hold(t,59.55,64),hold(t,89.55,94),hold(t,117,124),hold(t,133.55,138));
  const turn=Math.max(hold(t,62,67),hold(t,92,99),hold(t,136,141));
  const pause=Math.max(hold(t,60.5,68),hold(t,89.5,101),hold(t,116,126),hold(t,134.5,142));
  const distance=.55*Math.max(0,t-42);
  const side=.66*(-hold(t,63,69,1.2)+hold(t,137,143,1.2));
  const wristPulse=haptic(s),incident=t<82?'bike':t<126?'horn':'rear';
  return {s,raise,turn,walk:1-pause,distance,side,wristPulse,incident};
};

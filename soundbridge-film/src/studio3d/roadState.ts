import {ease,followUpCue,haptic,initialState,ViewState} from './state';
export const journeyWindow=(t:number)=>{
 const u=ease((t-31)/3);
 return {left:36+1134*u,top:106+78*u,width:1528-1138*u,height:680-460.625*u,progress:u};
};
const hold=(t:number,a:number,b:number,fade=.8)=>ease((t-a)/fade)*(1-ease((t-b)/fade));
const roadBaseState=(t:number)=>{
 const s:ViewState={...initialState,bearing:-120,time:0,orbit:.04*Math.sin(t*.08),directionReady:true};
 if(t<12){
  s.exploded=ease((t-.8)/1.6)*(1-ease((t-9.5)/2));s.faceView=-1.1*s.exploded;
  s.orbit=-.25+.32*ease(t/12);s.componentFocus=Math.min(3,Math.floor(t/2.8));
  s.time=s.componentFocus===0?3.3+(t%2.8)*.4:s.componentFocus===1?5.4:s.componentFocus===2?10:7.25+(t-8.4);
 }
 if(t>=34&&t<64){s.time=Math.min(11,t-34);s.bearing=-120+75*ease((t-48)/10);s.directionReady=t>=42.8;}
 if(t>=54&&t<64){s.directionPreview=true;s.faceView=.55*hold(t,54,64);s.time=10;}
 if(t>=64&&t<82){
  s.time=10;s.sourceBearing=-60;s.wristYaw=30*ease((t-65)/3)-60*ease((t-71)/4);
  s.wristTilt=.9*(1-ease((t-65)/3));s.bearing=-60-s.wristYaw;s.faceView=.65*hold(t,64,82);
  s.directionReady=t>=68&&(t<71||t>=75);
 }
 if(t>=82&&t<124){s.time=Math.min(11,t-82);s.event='horn';s.bearing=60-120*ease((t-114)/6);s.directionReady=t>=105.5;s.sourceRadius=2.7-.045*Math.min(t-82,22);}
 if(t>=94&&t<114){
  const acknowledged=t>=108,follow=followUpCue(t-94,acknowledged);
  s.hapticTime=follow.active?follow.clock:0;s.strength=follow.strength;
  s.alertStage=acknowledged?'confirmed':t>=104?'viewing':t>=100?'strong':'repeat';
 }
 if(t>=124&&t<134){s.event='horn';s.time=10;s.hapticTime=t>=126&&t<129?7.25+t-126:0;s.strength=.45+.4*ease((t-125)/3);s.faceView=.55*hold(t,124,134);s.largeText=t>=130;}
 if(t>=134){s.strength=.85;s.largeText=true;s.time=Math.min(11,t<137.1?(t-134)/3.1*7.1:7.1+t-137.1);s.bearing=135-90*ease((t-140)/4);s.directionReady=t>=138.5;}
 if(t>=146)s.time=0;
 const highlight=Math.max(hold(t,43,52),hold(t,55,63),hold(t,68,81),hold(t,106,114),hold(t,139,144));
 s.bearingHighlight=s.directionReady?highlight*(.65+.35*Math.pow(Math.sin(t*Math.PI),2)):0;
 s.faceView+=highlight*.35;
 const raise=Math.max(hold(t,41.55,46),hold(t,104,114),hold(t,125,132),hold(t,137.6,141));
 const turn=Math.max(hold(t,46,52),hold(t,110,122),hold(t,141,145));
 const pause=Math.max(hold(t,42,53),hold(t,91,124),hold(t,124,134),hold(t,138,146));
 const distance=.55*Math.max(0,t-28),side=.66*(-hold(t,47,53,1.2)+hold(t,141,146,1.2));
 return {s,raise,turn,walk:1-pause,distance,side,wristPulse:haptic(s),incident:t<82?'bike':t<134?'horn':'rear'};
};
export const roadStoryTime=(t:number)=>t<64?t:t<76?54:t-12;
export const roadState=(t:number)=>{
 const j=roadBaseState(roadStoryTime(t));
 if(t>=64&&t<76){
  const event=t<66?'noise':t<69?'siren':t<72?'engine':'construction';
  const start=t<66?64:t<69?66:t<72?69:72;
  j.s={...initialState,event,time:event==='noise'?0:7.25+t-start,bearing:event==='siren'?-60:event==='engine'?60:135,directionReady:true,faceView:.45};
  j.wristPulse=haptic(j.s);
 }
 return j;
};

import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Sequence, staticFile, Img} from 'remotion';
import {Audio, Video} from '@remotion/media';
import script from './script.json';
export const C={bg:'#050b12',cyan:'#64e8eb',blue:'#6997ff',warm:'#f4bf87',white:'#eff7f9',muted:'#91a9b7'};
export const ease={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const fonts='"PingFang SC", "Helvetica Neue", Arial, sans-serif';
export function Scene({id,children}:{id:number;children:React.ReactNode}){
 const f=useCurrentFrame(),{fps}=useVideoConfig(),s=script[id];
 const line=s.voice.find(v=>f/fps>=v.start&&f/fps<v.start+v.duration+.13);
 return <AbsoluteFill style={{background:C.bg,color:C.white,fontFamily:fonts,overflow:'hidden'}}>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 75% 40%, #123044 0%, #09131e 38%, #050b12 72%)'}}/>
  <div style={{position:'absolute',left:-200,right:-200,height:650,top:650,backgroundImage:'linear-gradient(#3bd8eb15 1px, transparent 1px),linear-gradient(90deg,#3bd8eb15 1px,transparent 1px)',backgroundSize:'90px 90px',transform:`perspective(600px) rotateX(65deg) translateY(${f%90}px)`,opacity:.5}}/>
  <div style={{position:'absolute',left:100,top:58,fontSize:26,letterSpacing:3,fontWeight:600}}>◈ SOUNDBRIDGE</div>
  <div style={{position:'absolute',right:100,top:63,fontSize:19,letterSpacing:2,color:C.muted}}>CONCEPT FILM <span style={{color:C.cyan,marginLeft:24}}>{String(id+1).padStart(2,'0')} / 12</span></div>
  <div style={{position:'absolute',left:100,right:100,top:108,height:1,background:'#8dc8de22'}}/>
  <AbsoluteFill style={{opacity:interpolate(f,[0,16,s.duration*fps-14,s.duration*fps-1],[0,1,1,0],ease)}}>{children}</AbsoluteFill>
  <div style={{position:'absolute',left:80,right:80,bottom:52,textAlign:'center',minHeight:112,display:'flex',flexDirection:'column',justifyContent:'center',background:'linear-gradient(90deg,transparent,#050b12ee 12%,#050b12ee 88%,transparent)',padding:'10px 45px'}}>
   {line&&<><div style={{fontSize:36,lineHeight:1.5,fontWeight:500,letterSpacing:.6}}>{line.zh}</div><div style={{fontSize:25,lineHeight:1.5,color:'#b7c7d1',marginTop:4}}>{line.en}</div></>}
  </div>
  <div style={{position:'absolute',left:100,bottom:27,fontSize:17,color:'#6e8697',letterSpacing:1}}>概念演示 · 拟议实现 / PROPOSED DESIGN</div>
  <div style={{position:'absolute',bottom:0,height:3,width:`${(s.start+f/fps)/150*100}%`,background:C.cyan,boxShadow:'0 0 20px #64e8eb'}}/>
  {s.voice.map((v,i)=><Sequence key={i} from={Math.round(v.start*fps)} durationInFrames={Math.ceil(v.duration*fps)} premountFor={fps} name={v.zh}><Audio src={staticFile(v.file)} premountFor={fps}/></Sequence>)}
 </AbsoluteFill>
}
export function Title({kicker,title,sub,x=100,y=155,width=1000}:{kicker:string;title:string;sub?:string;x?:number;y?:number;width?:number}){const f=useCurrentFrame();return <div style={{position:'absolute',left:x,top:y,width,transform:`translateY(${interpolate(f,[0,28],[22,0],ease)}px)`}}><div style={{fontSize:23,letterSpacing:4,color:C.cyan,marginBottom:22}}>{kicker}</div><div style={{fontSize:72,fontWeight:600,lineHeight:1.2,letterSpacing:-2,whiteSpace:'pre-line'}}>{title}</div>{sub&&<div style={{fontSize:27,color:C.muted,marginTop:22,letterSpacing:1}}>{sub}</div>}</div>}
export function Icon({kind,size=64,color=C.cyan}:{kind:string;size?:number;color?:string}){const paths:Record<string,React.ReactNode>={bell:<><path d="M6 10a6 6 0 0 1 12 0c0 7 3 7 3 8H3c0-1 3-1 3-8Z"/><path d="M9 21h6M12 2v2"/></>,bike:<><circle cx="5" cy="17" r="4"/><circle cx="19" cy="17" r="4"/><path d="m5 17 5-10 6 10H5l8-7h4M8 7h4M16 4h3l2 5"/></>,horn:<><path d="m4 9 10-5v16L4 15H2V9h2Z"/><path d="M18 8c2 2 2 6 0 8M21 5c4 4 4 10 0 14"/></>,chip:<><rect x="5" y="5" width="14" height="14" rx="3"/><rect x="9" y="9" width="6" height="6"/><path d="M8 1v4M16 1v4M8 19v4M16 19v4M1 8h4M1 16h4M19 8h4M19 16h4"/></>,lock:<><rect x="5" y="10" width="14" height="12" rx="3"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 15v3"/></>,wave:<path d="M3 9v6M7 6v12M12 2v20M17 6v12M21 9v6"/>,pause:<path d="M8 5v14M16 5v14"/>,check:<path d="m5 12 4 4L20 5"/>,mic:<><rect x="8" y="2" width="8" height="13" rx="4"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v4M8 23h8"/></>};return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{paths[kind]||paths.wave}</svg>}
export function Watch({x=1230,y=320,size=450,label='SoundBridge',sub='声音感知已开启',kind='wave',color=C.cyan,bearing,active=true,textScale=1,children}:{x?:number;y?:number;size?:number;label?:string;sub?:string;kind?:string;color?:string;bearing?:number;active?:boolean;textScale?:number;children?:React.ReactNode}){
 const f=useCurrentFrame();const p=(f%48)/48;const tick=f%120;const timing=kind==='bell'?[[0,12],[22,34],[65,77],[87,99]]:[[0,12],[30,42],[60,72]];const vibrating=active&&timing.some(([a,b])=>tick>=a&&tick<b);
 return <div style={{position:'absolute',left:x,top:y,width:size,height:size,transform:`translate(${vibrating?Math.sin(f*3)*2:0}px,${Math.sin(f/60)*5}px)`}}>
  <div style={{position:'absolute',left:'30%',width:'40%',top:'-30%',height:'160%',borderRadius:65,background:'linear-gradient(90deg,#101b23,#2c3b42 28%,#16242c 70%,#081118)',boxShadow:'inset 0 0 0 2px #637d8333'}}/>
  {active&&[0,1,2].map(i=><div key={i} style={{position:'absolute',inset:-20-i*30-p*25,border:`1px solid ${color}`,borderRadius:'50%',opacity:(1-p)*(.25-i*.05)}}/>)}
  <div style={{position:'absolute',right:-13,top:'42%',width:26,height:62,borderRadius:7,background:'linear-gradient(90deg,#202d35,#8c9da6,#192833)'}}/>
  <div style={{position:'absolute',inset:0,borderRadius:'50%',padding:10,background:'linear-gradient(125deg,#b1c1ca,#26323d 24%,#76838a 43%,#131d25 65%,#9baeb5 88%,#29353b)',boxShadow:'0 45px 75px #000a,inset 0 0 2px #fff'}}>
   <div style={{width:'100%',height:'100%',borderRadius:'50%',position:'relative',overflow:'hidden',background:'radial-gradient(circle at 35% 20%,#102d35,#02090e 70%)',border:'8px solid #0a1219',boxSizing:'border-box'}}>
    <svg viewBox="0 0 400 400" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
     <circle cx="200" cy="200" r="180" fill="none" stroke="#aac9d122"/>
     {Array.from({length:60},(_,i)=><line key={i} x1="200" y1="18" x2="200" y2={i%5?23:30} stroke={i%5?'#8fb4c044':color} strokeWidth={i%5?1:2} transform={`rotate(${i*6} 200 200)`}/>)}
     {bearing!==undefined&&<g transform={`rotate(${bearing} 200 200)`}><path d="M200 200 L103 45 A183 183 0 0 1 297 45 Z" fill={color} opacity=".13"/><path d="M103 45 A183 183 0 0 1 297 45" stroke={color} strokeWidth="6" fill="none"/><circle cx="200" cy="18" r="6" fill={color}/></g>}
    </svg>
    <div style={{position:'absolute',top:'14%',width:'100%',textAlign:'center',fontSize:size*.035,color:'#809aa5'}}>10:09</div>
    <div style={{position:'absolute',top:'29%',width:'100%',textAlign:'center'}}><Icon kind={kind} color={color} size={size*.14}/><div style={{fontSize:size*.073*textScale,fontWeight:600,marginTop:12,color:C.white}}>{label}</div><div style={{fontSize:size*.034,color:'#b0c4cc',marginTop:10}}>{sub}</div><div style={{display:'flex',justifyContent:'center',gap:9,marginTop:25}}>{active&&timing.map(([a,b],i)=><span key={i} style={{height:5,width:12,marginLeft:kind==='bell'&&i===2?13:0,borderRadius:10,background:color,opacity:active&&tick>=a&&tick<b?1:.25}}/>)}</div></div>{children}
    <div style={{position:'absolute',inset:0,borderRadius:'50%',background:'linear-gradient(130deg,#ffffff0b,transparent 45%)',pointerEvents:'none'}}/>
   </div>
  </div>
 </div>
}
export function Waves({x=100,y=450,width=800,height=180,color=C.cyan,quiet=false}:{x?:number;y?:number;width?:number;height?:number;color?:string;quiet?:boolean}){const f=useCurrentFrame();return <svg style={{position:'absolute',left:x,top:y}} width={width} height={height}>{Array.from({length:70},(_,i)=>{const a=quiet?4:12+Math.abs(Math.sin(i*.37+f*.12)*Math.sin(i*.17-f*.04))*height*.85;return <rect key={i} x={i*width/70} y={(height-a)/2} width={width/105} height={a} rx={3} fill={color} opacity={.25+.75*Math.sin(i/70*Math.PI)}/>})}</svg>}
export function Flow({items,y=755,x=100,width=1600}:{items:string[];y?:number;x?:number;width?:number}){const f=useCurrentFrame();return <div style={{position:'absolute',left:x,top:y,width,display:'flex',alignItems:'center',gap:20}}>{items.map((t,i)=><React.Fragment key={t}>{i>0&&<span style={{fontSize:34,color:C.cyan,opacity:.35+.65*Math.max(0,Math.sin(f/10-i))}}>⟶</span>}<div style={{padding:'20px 27px',borderBottom:`2px solid ${i===Math.floor(f/45)%items.length?C.cyan:'#2b414e'}`,background:'#0d1a26cc',fontSize:27,whiteSpace:'nowrap',color:i===Math.floor(f/45)%items.length?C.white:C.muted}}>{t}</div></React.Fragment>)}</div>}
export function Footage({src,x=100,y=350,w=950,h=445,opacity=1}:{src:string;x?:number;y?:number;w?:number;h?:number;opacity?:number}){const {fps}=useVideoConfig();return <div style={{position:'absolute',left:x,top:y,width:w,height:h,overflow:'hidden',borderRadius:24,border:'1px solid #a6d4db44',opacity}}><Video src={staticFile('footage/'+src+'.mp4')} muted loop premountFor={fps} objectFit="cover" style={{width:'100%',height:'100%'}}/><div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,#06111c66,transparent 60%)'}}/></div>}
export function Note({text,x=110,y=840,color=C.muted}:{text:string;x?:number;y?:number;color?:string}){return <div style={{position:'absolute',left:x,top:y,fontSize:23,color,letterSpacing:.5}}>{text}</div>}
export function Tap({x,y,from=40}:{x:number;y:number;from?:number}){const f=useCurrentFrame(),v=interpolate(f,[from,from+10,from+30],[0,1,0],ease);return <div style={{position:'absolute',left:x-24,top:y-24,width:48,height:48,border:`3px solid ${C.white}`,borderRadius:'50%',opacity:v,transform:`scale(${1+(f-from)/40})`,boxShadow:'0 0 25px #64e8eb'}}/>}

export function StoryImage({name,full=false}:{name:string;full?:boolean}){const f=useCurrentFrame();return <div style={{position:'absolute',left:full?0:100,top:full?110:360,width:full?1920:1040,height:full?780:450,overflow:'hidden',borderRadius:full?0:22}}><Img src={staticFile('safety/'+name+'.png')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',scale:interpolate(f,[0,450],[1,1.045],ease)}}/><div style={{position:'absolute',inset:0,background:full?'linear-gradient(90deg,#050b12e8 0%,#050b1280 33%,transparent 65%),linear-gradient(0deg,#050b12 0%,transparent 30%)':'linear-gradient(0deg,#050b1280,transparent 45%)'}}/></div>}

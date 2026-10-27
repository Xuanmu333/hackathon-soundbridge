import {Img,interpolate,staticFile,useCurrentFrame,Easing} from 'remotion';
import {C,ease} from './visuals';

// The imagery and fields explain proposed architecture; they are not measured data.
export function TechBackdrop({asset}:{asset:'processor'|'actuator'}){
 const f=useCurrentFrame();
 return <div style={{position:'absolute',left:0,top:110,width:1920,height:785,overflow:'hidden',background:'#02060c'}}>
  <Img src={staticFile(`technology/${asset}.png`)} style={{position:'absolute',width:1920,height:1080,top:-15,right:0,scale:interpolate(f,[0,85],[.84,.89],{...ease,easing:Easing.bezier(.4,0,.2,1)}),transformOrigin:'right top',translate:`${interpolate(f,[0,85],[30,-10],{...ease,easing:Easing.bezier(.4,0,.2,1)})}px 0px`}}/>
  <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#02060c 0%,#02060ce8 22%,transparent 54%),linear-gradient(0deg,#050b12,transparent 24%)'}}/>

 </div>
}
export function TechHeading({eyebrow,title,sub}:{eyebrow:string;title:string;sub:string}){
 const f=useCurrentFrame();return <div style={{position:'absolute',left:100,top:150,width:850,translate:`0px ${interpolate(f,[0,22],[22,0],{...ease,easing:Easing.bezier(.22,1,.36,1)})}px`}}>
 <div style={{fontSize:21,letterSpacing:4,color:C.cyan,display:'flex',alignItems:'center',gap:18,marginBottom:24}}><span style={{height:2,width:42,background:C.cyan,boxShadow:'0 0 14px #64e8eb'}}/>{eyebrow}</div>
 <div style={{fontSize:84,fontWeight:550,lineHeight:1.12,letterSpacing:-2,whiteSpace:'pre-line'}}>{title}</div>
 <div style={{fontSize:28,color:'#a6bbc8',marginTop:23,lineHeight:1.5}}>{sub}</div>
 </div>
}
export function StageRail({items,active,color=C.cyan}:{items:string[];active:number;color?:string}){
 return <div style={{position:'absolute',left:100,right:100,top:782,display:'flex',gap:30}}>{items.map((item,i)=><div key={item} style={{flex:1,borderTop:`2px solid ${i<=active?color:'#34505d'}`,paddingTop:14,display:'flex',gap:16,alignItems:'baseline',color:i===active?C.white:'#708c9e'}}><span style={{fontSize:18,letterSpacing:2,color:i===active?color:'#49616f'}}>0{i+1}</span><span style={{fontSize:27,whiteSpace:'nowrap'}}>{item}</span></div>)}</div>
}
export function SignalMesh({x=100,y=495,w=640,h=180}:{x?:number;y?:number;w?:number;h?:number}){
 const f=useCurrentFrame();return <svg width={w} height={h} style={{position:'absolute',left:x,top:y,overflow:'visible'}}>
  {Array.from({length:18},(_,row)=>{const points=Array.from({length:70},(_,col)=>{const t=col/69;const envelope=Math.sin(t*Math.PI)**2;const wave=Math.sin(t*20+f*.08-row*.24)*envelope*45;return `${t*w+row*2},${h*.5+row*4+wave}`;}).join(' ');return <polyline key={row} points={points} fill="none" stroke={row%4===0?C.white:C.cyan} strokeWidth={row%4===0?1.3:.7} opacity={.13+row/40}/>;})}
  <line x1={f%180/180*w} x2={f%180/180*w} y1="0" y2={h} stroke={C.cyan} opacity=".5"/>
 </svg>
}
export function DataTraces({progress}:{progress:number}){
 const x=interpolate(progress,[0,.3,.7,1],[620,900,1180,1460],ease),y=interpolate(progress,[0,.3,.7,1],[650,620,620,550],ease);
 return <svg width="1920" height="900" style={{position:'absolute',left:0,top:0,pointerEvents:'none'}}>
 <path d="M620 650 L900 620 L1180 620 L1460 550" fill="none" stroke={C.cyan} opacity=".12"/>
 <path d="M620 650 L900 620 L1180 620 L1460 550" pathLength="1" fill="none" stroke={C.cyan} strokeWidth="2" strokeDasharray="1" strokeDashoffset={1-progress} opacity=".55"/>
 {progress>0&&progress<1&&<><circle cx={x} cy={y} r="14" fill={C.cyan} opacity=".12"/><circle cx={x} cy={y} r="5" fill={C.white}/></>}
 </svg>
}
export function OrbitField({x=1495,y=570,r=310,color=C.cyan,dim=false,motionFrame}:{x?:number;y?:number;r?:number;color?:string;dim?:boolean;motionFrame?:number}){
 const currentFrame=useCurrentFrame(),f=motionFrame??Math.min(currentFrame,85);return <svg width="1920" height="900" style={{position:'absolute',inset:0,pointerEvents:'none',opacity:dim?.35:1}}>
 <defs><radialGradient id="orbital-light"><stop stopColor={color} stopOpacity=".13"/><stop offset="1" stopColor={color} stopOpacity="0"/></radialGradient></defs>
 <ellipse cx={x} cy={y} rx={r*1.35} ry={r*.8} fill="url(#orbital-light)"/>
 {[0,1,2].map(i=><g key={i} transform={`rotate(${-18+i*19} ${x} ${y})`}><ellipse cx={x} cy={y} rx={r+i*25} ry={r*(.27+i*.07)} fill="none" stroke={color} strokeWidth={i===0?1.5:1} opacity={.3-i*.05}/><ellipse cx={x} cy={y} rx={r+i*25} ry={r*(.27+i*.07)} fill="none" stroke={color} strokeWidth="3" strokeDasharray="80 1200" strokeDashoffset={-f*(1+i*.3)-i*200}/></g>)}
 {Array.from({length:48},(_,i)=>{const a=i*Math.PI/24;return <line key={i} x1={x+Math.cos(a)*r*1.12} y1={y+Math.sin(a)*r*.5} x2={x+Math.cos(a)*(r*1.12+6)} y2={y+Math.sin(a)*(r*.5+4)} stroke={color} opacity={i%4===0?.55:.18}/>;})}
 </svg>
}
export function TechAtmosphere({motionFrame}:{motionFrame?:number}={}){const currentFrame=useCurrentFrame(),f=motionFrame??Math.min(currentFrame,60);return <><div style={{position:'absolute',left:900,top:140,width:950,height:740,background:'radial-gradient(ellipse,#15466866,transparent 65%)'}}/><OrbitField motionFrame={f}/></>}

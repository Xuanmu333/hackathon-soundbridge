import {TechAtmosphere} from '../technology';
import {useCurrentFrame,interpolate,Easing} from 'remotion';
import {Scene,Title,Watch,Icon,C,Tap,Note,ease} from '../visuals';

// A scripted drag with direction changes. The spring retains velocity across targets.
// Values beyond 1 affect only the rubber-band illustration, never the selected setting.
const strengthFrames=(()=>{
 const out:number[]=[];let position=.42,velocity=0;
 for(let frame=0;frame<360;frame++){
  const target=interpolate(frame,[40,57,72,93,103,119],[.42,.92,.55,1.16,1.16,.8],ease);
  for(let sub=0;sub<4;sub++){velocity+=(210*(target-position)-25*velocity)/120;position+=velocity/120;}
  out.push(position);
 }
 return out;
})();
export const Personalize=()=>{
 const f=useCurrentFrame(),raw=strengthFrames[Math.max(0,Math.min(f,359))],strength=Math.max(0,Math.min(1,raw)),knob=raw>1?1+(raw-1)*.22:Math.max(0,raw);
 const font=interpolate(f,[138,165],[.25,.85],{...ease,easing:Easing.bezier(.4,0,.2,1)});
 const selected=interpolate(f,[30,39],[1,0],ease),preview=f>=120;
 return <Scene id={7}>
 <TechAtmosphere/>
 <Title kicker="07 / MAKE IT YOURS" title="你的手腕，你的偏好。" width={1500}/>
 <div style={{position:'absolute',left:110,top:375,display:'flex',gap:30}}>{[['bell','门铃'],['bike','车铃'],['horn','鸣笛']].map(([kind,label],i)=><div key={kind} style={{display:'flex',alignItems:'center',gap:14,fontSize:27,opacity:i===0?.4+.6*selected:1}}><Icon kind={kind} size={34}/><span>{label}</span><div style={{width:58,height:30,borderRadius:18,background:i===0&&selected<.5?'#344955':'#247381',padding:4,boxSizing:'border-box'}}><div style={{width:22,height:22,borderRadius:'50%',background:C.white,translate:`${i===0?28*selected:28}px 0px`}}/></div></div>)}</div>
 <Tap x={259} y={390} from={23}/>
 <div style={{position:'absolute',left:110,top:478,width:840}}>
  <div style={{display:'flex',justifyContent:'space-between',fontSize:31}}><span>振动强度</span><span style={{fontSize:25,color:C.cyan}}>{raw>1?'已达最大强度':strength<.5?'轻柔':strength<.85?'适中':'强'}</span></div>
  <div style={{position:'relative',marginTop:34,height:8,background:'#2b414e',borderRadius:8}}><div style={{height:8,width:`${strength*100}%`,borderRadius:8,background:C.cyan}}/><div style={{position:'absolute',left:knob*840-17,top:-13,width:34,height:34,borderRadius:'50%',background:'radial-gradient(circle at 30% 20%,white,#a6c6ce)',boxShadow:'0 4px 12px #0008'}}/>{f>=40&&f<=120&&<div style={{position:'absolute',left:knob*840-28,top:-24,width:54,height:54,borderRadius:'50%',border:'1px solid #ffffff88',opacity:interpolate(f,[40,45,112,120],[0,1,1,0],ease)}}/>}</div>
  <div style={{display:'flex',justifyContent:'space-between',fontSize:19,color:C.muted,marginTop:19}}><span>轻柔</span><span>适中</span><span>强</span></div>
 </div>
 <div style={{position:'absolute',left:110,top:660,width:840}}><div style={{display:'flex',justifyContent:'space-between',fontSize:31}}><span>文字大小</span><span style={{fontSize:25,color:C.cyan}}>{font>.6?'更大':'标准'}</span></div><div style={{position:'relative',marginTop:30,height:8,background:'#2b414e',borderRadius:8}}><div style={{height:8,width:`${font*100}%`,background:C.cyan,borderRadius:8}}/><div style={{position:'absolute',left:font*840-17,top:-13,width:34,height:34,borderRadius:'50%',background:'white'}}/></div></div>
 <Watch x={1300} y={385} size={390} label={preview?'车铃提示':'声音感知'} sub={preview?'振动预览 / Preview':selected>.5?'3 sounds selected':'2 sounds selected'} kind={preview?'bike':'check'} eventStart={120} active={preview} textScale={1+font*.3}/>
 <Note text="调整、试用、再调整 · 偏好保存在本地"/>
 </Scene>;
};

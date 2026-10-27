import {TechAtmosphere} from '../technology';
import {useCurrentFrame,interpolate,interpolateColors,Easing} from 'remotion';
import {Scene,Title,Watch,C,Tap,Note,ease} from '../visuals';
export const Modes=()=>{
 const f=useCurrentFrame();
 const paused=f>=160&&f<280,pausing=f>=150&&f<160,resuming=f>=280&&f<290;
 const travel=interpolate(f,[150,160,280,290],[1,0,0,1],{...ease,easing:Easing.bezier(.22,1,.36,1)});
 const activity=interpolate(f,[150,160,280,290],[1,0,0,1],ease);
 const clock=f<160?f:f<280?160:f-120;
 const press=interpolate(f,[140,146,152,270,276,282],[1,.92,1,1,.92,1],ease);
 const mode=interpolate(f,[80,98],[0,1],{...ease,easing:Easing.bezier(.22,1,.36,1)});
 const status=pausing?'正在暂停…':paused?'感知已暂停 · 无法提供提醒':resuming?'正在恢复…':'声音感知已开启';
 return <Scene id={9}>
 <div style={{opacity:.12+.88*activity}}><TechAtmosphere motionFrame={Math.min(clock,60)}/></div>
 <Title kicker="09 / CONTROL STAYS WITH YOU" title={'开启与暂停，\n都由你掌握。'} width={1000}/>
 <div style={{position:'absolute',left:100,top:430,width:360,height:78,border:'1px solid #405866',borderRadius:18,display:'flex',background:'#0a1824'}}>
  <div style={{position:'absolute',left:5+mode*178,top:5,width:172,height:66,borderRadius:13,background:'linear-gradient(135deg,#215361,#10303e)',border:'1px solid #64e8eb99',boxShadow:'0 0 25px #64e8eb18'}}/>
  {['居家','户外'].map((t,i)=><div key={t} style={{position:'relative',width:180,display:'flex',justifyContent:'center',alignItems:'center',fontSize:32,color:(mode>.5?1:0)===i?C.white:C.muted}}>{t}</div>)}
 </div>
 <div style={{position:'absolute',left:108,top:540,fontSize:27,color:C.muted}}>{mode>.5?'车铃 + 鸣笛':'门铃优先'} / Selected sound filters</div>
 <svg width="860" height="100" style={{position:'absolute',left:110,top:610}}>{Array.from({length:70},(_,i)=>{const a=3+activity*(12+Math.abs(Math.sin(i*.37+clock*.12)*Math.sin(i*.17-clock*.04))*80);return <rect key={i} x={i*12} y={(100-a)/2} width="7" height={a} rx="3" fill={interpolateColors(activity,[0,1],['#526676',C.cyan])} opacity={.3+Math.sin(i/70*Math.PI)*.7}/>;})}</svg>
 <div style={{position:'absolute',left:110,top:730,width:200,height:80,borderRadius:48,border:`1px solid ${interpolateColors(activity,[0,1],['#53606b',C.cyan])}`,background:interpolateColors(activity,[0,1],['#14202c','#123d45']),boxShadow:`inset 0 2px 8px #ffffff22,0 0 ${activity*32}px #64e8eb33`}}>
  <div style={{position:'absolute',left:7+travel*120,top:7,width:66,height:66,borderRadius:'50%',scale:press,background:'radial-gradient(circle at 30% 23%,#efffff,#9ab6bc 55%,#304954)',boxShadow:`inset 0 1px 2px #fff,0 5px 12px #0008,0 0 ${activity*16}px #64e8eb66`}}/>
 </div>
 <div style={{position:'absolute',left:345,top:750,fontSize:29,color:paused?C.warm:C.white}}>{status}</div>
 <Tap x={270} y={770} from={140}/><Tap x={150} y={770} from={270}/>
 <Watch x={1300} y={385} size={390} label={pausing?'正在暂停':paused?'感知已暂停':resuming?'正在恢复':f<150?'声音感知':'感知已恢复'} sub={paused?'无法提供提醒':pausing||resuming?'状态切换中':'Ready when you are'} kind={paused?'pause':'wave'} active={false}/>
 <Note text="轻触开关 → 状态切换 → 停止采集与提醒"/>
 </Scene>;
};

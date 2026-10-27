import {TechAtmosphere} from '../technology';
import {useCurrentFrame} from 'remotion';
import {Scene,Title,Watch,Waves,C,Tap,Note} from '../visuals';
export const Modes=()=>{const f=useCurrentFrame();const paused=f>=150&&f<280;const m=f<90?0:1;return <Scene id={9}>
 <TechAtmosphere/>
 <Title kicker="09 / CONTROL STAYS WITH YOU" title={'开启与暂停，\n都由你掌握。'} width={1000}/>
 <div style={{position:'absolute',left:100,top:430,display:'flex',gap:20}}>{['居家','户外'].map((t,i)=><div key={t} style={{fontSize:32,padding:'18px 42px',borderRadius:15,background:m===i?'#174452':'#13232e',border:`1px solid ${m===i?C.cyan:'#30424e'}`}}>{t}</div>)}</div>
 <div style={{position:'absolute',left:108,top:540,fontSize:27,color:C.muted}}>{['门铃优先','车铃 + 鸣笛'][m]} / Selected sound filters</div>
 <Waves x={110} y={610} width={860} height={100} quiet={paused} color={paused?'#526676':C.cyan}/>
 <div style={{position:'absolute',left:110,top:765,fontSize:31,display:'flex',alignItems:'center',gap:30}}><div style={{width:90,height:46,borderRadius:28,background:paused?'#354955':C.cyan,padding:5,boxSizing:'border-box'}}><div style={{width:36,height:36,background:'white',borderRadius:'50%',marginLeft:paused?0:44}}/></div>{paused?'感知已暂停 · 采集与提醒停止':'声音感知已开启'}</div>
 <Tap x={155} y={788} from={150}/><Tap x={155} y={788} from={280}/>
 <Watch x={1300} y={385} size={390} label={paused?'感知已暂停':f<150?'声音感知':'感知已恢复'} sub={paused?'无法提供提醒':'Ready when you are'} kind={paused?'pause':'wave'} active={!paused}/>
 <Note text="本地模式规则 + 采集状态控制"/>
 </Scene>};

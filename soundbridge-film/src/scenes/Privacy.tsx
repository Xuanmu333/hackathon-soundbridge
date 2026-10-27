import {useCurrentFrame} from 'remotion';
import {Scene,Icon,C,Note} from '../visuals';
import {TechBackdrop,TechHeading,OrbitField,StageRail} from '../technology';
export const Privacy=()=>{const f=useCurrentFrame(),step=Math.min(2,Math.floor(f/100));const statements=[['核心识别，在设备内','ON-DEVICE PROCESSING','chip'],['原始录音，默认不保存','NO RAW RECORDINGS BY DEFAULT','lock'],['可选事件历史，由你管理','CATEGORY + TIME, UNDER YOUR CONTROL','check']];return <Scene id={10}>
 <TechBackdrop asset="processor"/>
 <OrbitField x={1420} y={530} r={355}/>
 <svg width="1920" height="900" style={{position:'absolute',inset:0}}><path d="M1110 270 L1420 200 L1720 300 L1720 610 Q1560 755 1420 770 Q1240 735 1110 610 Z" fill="#64e8eb04" stroke={C.cyan} strokeWidth="1" opacity=".4" strokeDasharray="400 20" strokeDashoffset={Math.min(f,80)*.35}/></svg>
 <TechHeading eyebrow="10 / LOCAL-FIRST ARCHITECTURE" title={'私人的时刻，\n留在腕上。'} sub="本地处理 / 用户控制"/>
 <div style={{position:'absolute',left:108,top:490}}><Icon kind={statements[step][2]} size={70}/><div style={{fontSize:39,marginTop:30,lineHeight:1.5}}>{statements[step][0]}</div><div style={{fontSize:20,color:C.cyan,letterSpacing:2,marginTop:16}}>{statements[step][1]}</div></div>
 <StageRail items={['设备内推理','录音不留存','历史可管理']} active={step}/>
 <Note text="拟议隐私架构 · 需在最终硬件、固件和存储策略中落实" y={853}/>
 </Scene>};

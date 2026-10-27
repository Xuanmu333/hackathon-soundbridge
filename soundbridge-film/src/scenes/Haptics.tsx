import {useCurrentFrame} from 'remotion';
import {Scene,C,Note} from '../visuals';
import {TechBackdrop,TechHeading,StageRail} from '../technology';
export const Haptics=()=>{const f=useCurrentFrame(),traffic=f>=180,t=f-(traffic?205:25);const beats=traffic?[[0,12],[30,42],[60,72]]:[[0,12],[22,34],[65,77],[87,99]];const pulse=beats.some(([a,b])=>t>=a&&t<b);return <Scene id={4}>
 <TechBackdrop asset="actuator"/>
 <TechHeading eyebrow="04 / ENGINEERED TO BE FELT" title={'让重要的提醒，\n抵达你的手腕。'} sub="事件类别 → 节奏编码 → 触觉马达"/>
 <div style={{position:'absolute',left:105,top:475,fontSize:25,letterSpacing:3,color:C.warm}}>{traffic?'车铃 / 鸣笛 · TRAFFIC':'门铃 · DOORBELL'}</div>
 <div style={{position:'absolute',left:100,top:528,fontSize:65,fontWeight:500}}>{traffic?'三次短振':'双击 · 双击'}</div>
 <svg width="1920" height="900" style={{position:'absolute',inset:0}}>
 <line x1="105" x2="710" y1="662" y2="662" stroke="#526b7a66"/>
 {beats.map(([a,b],i)=><g key={a}><rect x={105+a*5} y="633" width={(b-a)*5} height="58" rx="7" fill={C.warm} opacity={t>=a&&t<b?1:.24}/><text x={105+a*5+22} y="735" fill="#95aebc" fontSize="21">{i+1}</text></g>)}
 <line x1={105+Math.max(0,Math.min(120,t))*5} x2={105+Math.max(0,Math.min(120,t))*5} y1="620" y2="703" stroke="#fff4df" strokeWidth="2"/>
 {beats.map(([onset])=>{const age=t-onset;if(age<0||age>=28)return null;return <ellipse key={onset} cx="1460" cy="550" rx={55+age*5} ry={20+age*1.8} fill="none" stroke={C.warm} strokeWidth="2" opacity={(1-age/28)*.8}/>;})}
 <ellipse cx="1460" cy="550" rx="45" ry="16" fill={C.warm} opacity={pulse?.18:0}/>

 <path d="M1515 550 L1690 610 L1810 610" stroke={C.warm} fill="none" opacity=".7"/>
 <circle cx="1515" cy="550" r="4" fill={C.warm}/><text x="1685" y="645" fill={C.warm} fontSize="25">触觉马达</text>
 </svg>
 <StageRail items={['事件映射','节奏编码','马达驱动','触觉提示']} active={t< -12?0:t<0?1:t<100?2:3} color={C.warm}/>
 <Note text="分层结构与振动传播为概念示意 · 节奏、强度需与用户共同测试" y={853}/>
 </Scene>};

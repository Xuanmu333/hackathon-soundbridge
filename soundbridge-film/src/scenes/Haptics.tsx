import {useCurrentFrame} from 'remotion';
import {Scene,Title,Watch,C,Icon,Note} from '../visuals';
export const Haptics=()=>{const f=useCurrentFrame(),a=Math.min(2,Math.floor(f/120));const rows=[{label:'门铃',en:'DOORBELL',kind:'bell',p:[[0,16],[25,16],[85,16],[110,16]],c:C.cyan},{label:'人声',en:'SPEECH',kind:'speech',p:[[0,108]],c:C.blue},{label:'交通提示',en:'TRAFFIC',kind:'bike',p:[[0,16],[38,16],[76,16]],c:C.warm}];return <Scene id={6}>
 <Title kicker="05 / A TACTILE LANGUAGE" title="不用看屏幕，也能分辨。" width={1500}/>
 <div style={{position:'absolute',left:100,top:385,width:970}}>{rows.map((r,i)=><div key={r.kind} style={{height:135,display:'flex',alignItems:'center',gap:24,borderBottom:'1px solid #29414c',opacity:i===a?1:.4}}><Icon kind={r.kind} color={r.c} size={48}/><div style={{width:230,fontSize:33}}>{r.label}<div style={{fontSize:17,color:C.muted,letterSpacing:2,marginTop:8}}>{r.en}</div></div><svg width="530" height="95"><line x1="0" x2="510" y1="50" y2="50" stroke="#53717c66"/>{r.p.map(([x,w],n)=><rect key={n} x={x*3.5+20} y={25} width={w*3.5} height={50} rx={6} fill={r.c} opacity={i===a&&f%120>x*.75&&f%120<(x+w)*.75?1:.35}/>)}{i===a&&<line x1={(f%120)/120*510} x2={(f%120)/120*510} y1="10" y2="85" stroke="white" strokeWidth="2"/>}</svg></div>)}</div>
 <Watch x={1300} y={385} size={390} label={rows[a].label} sub="Haptic pattern preview" kind={rows[a].kind} color={rows[a].c}/>
 <Note text="事件类别 → 节奏映射 → 触觉驱动器 → 振动马达　｜　节奏为概念示意"/>
 </Scene>};

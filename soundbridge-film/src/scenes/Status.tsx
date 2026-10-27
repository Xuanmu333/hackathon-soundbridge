import {TechAtmosphere} from '../technology';
import {useCurrentFrame} from 'remotion';
import {Scene,Title,Watch,Note,C} from '../visuals';
export const Status=()=>{const f=useCurrentFrame(),i=Math.min(2,Math.floor(f/120));const states=[['感知已暂停','无法提供提醒','恢复感知后继续'],['电量偏低','请及时充电','留意剩余电量'],['感知不可用','无法提供提醒','请检查设备状态']];return <Scene id={6}>
 <TechAtmosphere/>
 <Title kicker="06 / PROPOSED STATUS DESIGN" title="当前状态，必须看得见。" sub="拟议状态设计 / 尚待硬件与软件实现" width={1600}/>
 <div style={{position:'absolute',left:110,top:435,display:'flex',flexDirection:'column',gap:35}}>{states.map((s,j)=><div key={s[0]} style={{display:'flex',gap:40,alignItems:'center',opacity:i===j?1:.3}}><div style={{fontSize:40,color:C.warm,width:300}}>{s[0]}</div><div style={{fontSize:30}}>{s[1]}</div></div>)}</div>
 <Watch x={1300} y={385} size={390} label={states[i][0]} sub={states[i][1]} kind={i===0?'pause':'wave'} active={false} color={C.warm}/>
 <Note text="没有收到提醒，不代表周围没有风险。" color={C.warm}/>
 </Scene>};

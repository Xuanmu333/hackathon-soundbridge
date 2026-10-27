import {useCurrentFrame} from 'remotion';
import {Scene,Title,StoryImage,C} from '../visuals';
export const Response=()=>{const f=useCurrentFrame();return <Scene id={2}>
 <StoryImage name="observe" full/>
 <Title kicker="02 / LOOK. DECIDE. CONTINUE." title={'收到提醒，\n观察，再行动。'} y={205} width={1100}/>
 <div style={{position:'absolute',left:108,top:535,display:'flex',flexDirection:'column',gap:30}}>{['停在一侧 · 观察周围','确认空间 · 让行','继续自己的行程'].map((t,i)=><div key={t} style={{fontSize:34,color:f>i*95?C.warm:C.muted,opacity:f>i*95?1:.35}}>{String(i+1).padStart(2,'0')}{'  '}{t}</div>)}</div>
 </Scene>};

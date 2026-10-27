import {useCurrentFrame,interpolate} from 'remotion';
import {Scene,Title,Icon,C,Flow,ease} from '../visuals';
export const Architecture=()=>{const f=useCurrentFrame();const e=interpolate(f,[25,95,210,280],[0,1,1,0],ease);return <Scene id={1}>
 <Title kicker="THE COMPLETE LOOP" title={'把声音，\n变成触觉。'} sub="独立腕上设备 / Standalone wearable" y={190} width={740}/>
 <div style={{position:'absolute',left:1050,top:450,transform:'rotateX(45deg) rotateZ(-25deg)',width:600,height:350}}>
 {[0,1,2].map((n)=><div key={n} style={{position:'absolute',inset:20+n*25,border:`2px solid ${n===1?C.cyan:'#729ba7'}`,background:n===1?'#123a45ee':'#101e2abb',borderRadius:55,transform:`translateY(${(n-1)*150*e}px)`,boxShadow:'0 20px 35px #0008',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon kind={['mic','chip','wave'][n]} size={90}/></div>)}
 </div>
 <div style={{position:'absolute',left:100,top:560,display:'flex',gap:40}}>{[['mic','采集'],['chip','理解'],['wave','触达']].map(([k,t])=><div key={k} style={{width:160}}><Icon kind={k}/><div style={{fontSize:32,marginTop:18}}>{t}</div></div>)}</div>
 <Flow items={['环境声音','本地处理','触觉 + 屏幕']} y={795} width={1450}/>
 </Scene>};

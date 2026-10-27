import {useCurrentFrame} from 'remotion';
import {Scene,Title,Watch,Footage,C,Note} from '../visuals';
export const Home=()=>{const f=useCurrentFrame(),on=f>65;return <Scene id={3}>
 <Title kicker="02 / AT HOME" title="不错过，一个熟悉的到来。" width={1500}/>
 <Footage src="home" y={365} w={1010} h={440}/>
 <Watch x={1290} y={370} size={400} label={on?'门铃响了':'正在感知'} sub={on?'Someone may be at the door':'Listening on your wrist'} kind={on?'bell':'wave'} color={C.warm} active={on}/>
 <div style={{position:'absolute',left:135,top:715,padding:'16px 24px',borderRadius:12,background:'#06111de8',fontSize:28,color:C.warm}}>{on?'门铃 → 双击 · 双击 → 来访提示':'在熟悉的生活中，自在专注。'}</div>
 <Note text="你收到提示。何时回应，由你决定。" color={C.warm}/>
 </Scene>};

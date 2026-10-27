import {useCurrentFrame} from 'remotion';
import {Scene,Title,Watch,Footage,C,Note} from '../visuals';
export const Outdoors=()=>{const f=useCurrentFrame(),horn=f>205;return <Scene id={5}>
 <Title kicker="04 / OUT AND ABOUT" title="感知身边，保持自己的步调。" width={1650}/>
 <Footage src="outdoor" y={365} w={1010} h={440}/>
 <Watch x={1290} y={370} size={400} label={horn?'车辆鸣笛':'自行车铃'} sub="Pause. Look around." kind={horn?'horn':'bike'} color={C.warm}/>
 <div style={{position:'absolute',left:135,top:715,padding:'16px 24px',borderRadius:12,background:'#06111de8',fontSize:28,color:C.warm}}>户外筛选 → {horn?'鸣笛识别':'车铃识别'} → 三次短振</div>
 <Note text="环境感知辅助，不是导航或防碰撞系统。"/>
 </Scene>};

import {useCurrentFrame,interpolate} from 'remotion';
import {Scene,Title,Watch,Footage,C,ease} from '../visuals';
export const Closing=()=>{const f=useCurrentFrame();return <Scene id={11}>
 <Footage src="social" x={0} y={120} w={1920} h={800} opacity={.32}/>
 <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#050b12e8 20%,#050b1233),linear-gradient(0deg,#050b12 5%,transparent 75%)'}}/>
 <Title kicker="TECHNOLOGY, WITH HUMANITY" title={'科技的温度，\n是把选择交还给你。'} sub="与聋人及重听人士共同设计 · 测试 · 完善" y={260} width={1250}/>
 <div style={{position:'absolute',left:105,top:640,fontSize:54,fontWeight:500,letterSpacing:3,color:C.warm,opacity:interpolate(f,[100,155],[0,1],ease)}}>感知连接，自主回应。</div>
 <Watch x={1375} y={380} size={340} label="SoundBridge" sub="Feel connected. Choose freely." color={C.warm}/>
 <div style={{position:'absolute',left:110,top:820,color:C.muted,fontSize:22}}>下一步：硬件选型 / 声学与续航验证 / 共同设计与真实场景测试</div>
 </Scene>};

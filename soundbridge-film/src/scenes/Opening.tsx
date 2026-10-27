import {useCurrentFrame,interpolate} from 'remotion';
import {Scene,Title,Watch,Footage,C,ease} from '../visuals';
export const Opening=()=>{const f=useCurrentFrame();return <Scene id={0}>
 <div style={{opacity:interpolate(f,[0,210,300],[.7,.5,.22],ease)}}><Footage src="home" x={0} y={120} w={1920} h={800}/></div>
 <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#050b12ee 10%,#050b1266 70%),linear-gradient(0deg,#050b12 5%,transparent 55%)'}}/>
 <Title kicker="A BRIDGE TO EVERYDAY LIFE" title={'每个重要时刻，\n都值得被感知。'} sub="SoundBridge · 让声音，成为可触摸的连接" y={280} width={1050}/>
 <div style={{opacity:interpolate(f,[130,195],[0,1],ease)}}><Watch x={1300} y={360} size={410} label="感知连接" sub="Feel connected"/></div>
 <div style={{position:'absolute',left:105,top:660,fontSize:27,color:C.warm,letterSpacing:5}}>INDEPENDENCE / AWARENESS / CHOICE</div>
 </Scene>};

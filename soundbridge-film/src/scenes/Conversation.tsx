import {useCurrentFrame} from 'remotion';
import {Scene,Title,Watch,Footage,C,Note} from '../visuals';
export const Conversation=()=>{const f=useCurrentFrame(),on=f>50;return <Scene id={4}>
 <Title kicker="03 / IN CONVERSATION" title="让加入对话，多一个线索。" width={1600}/>
 <Footage src="social" y={365} w={1010} h={440}/>
 <Watch x={1290} y={370} size={400} label={on?'附近有人说话':'交谈模式'} sub="A moment to look up" kind={on?'speech':'wave'} color={C.blue}/>
 <div style={{position:'absolute',left:135,top:715,padding:'16px 24px',borderRadius:12,background:'#06111de8',fontSize:28,color:'#b6c9ff'}}>交谈模式 → 人声检测 → 轻柔长振</div>
 <Note text="检测附近人声；不识别身份，也不判断对话对象。"/>
 </Scene>};

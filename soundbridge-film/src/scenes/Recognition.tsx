import {useCurrentFrame} from 'remotion';
import {Scene,Title,Waves,Icon,C,Flow,Note} from '../visuals';
export const Recognition=()=>{const f=useCurrentFrame();const stage=Math.min(2,Math.floor(f/150));return <Scene id={3}>
 <Title kicker="03 / ON-WATCH RECOGNITION" title="提醒如何产生？" sub="采集 → 频谱特征 → 轻量模型 → 事件判断" width={1500}/>
 <div style={{position:'absolute',left:100,top:400,width:480,height:290,border:'1px solid #35515f',borderRadius:22,background:'#0c1d29'}}><div style={{padding:28,color:C.muted,fontSize:23}}>AUDIO INPUT / 短时声音</div><Waves x={25} y={90} width={430} height={150}/></div>
 <svg width="500" height="290" style={{position:'absolute',left:620,top:400}}>{Array.from({length:32},(_,x)=>Array.from({length:14},(_,y)=>{const v=(Math.sin(x*.8+y*.4+f*.04)+Math.cos(x*.2-y*.8))/2;return <rect key={x+'-'+y} x={x*15} y={y*18+25} width="11" height="14" rx="2" fill={v>.3?C.cyan:v>0?C.blue:'#17364c'} opacity={.35+Math.abs(v)*.6}/>}))}</svg>
 <div style={{position:'absolute',left:1180,top:395,width:610}}>{[['bell','门铃 / Doorbell'],['bike','车铃 / Bicycle bell'],['horn','鸣笛 / Horn']].map(([k,t],i)=><div key={k} style={{display:'flex',gap:22,alignItems:'center',height:76,color:i===stage?C.cyan:C.muted}}><Icon kind={k} size={38} color={i===stage?C.cyan:C.muted}/><span style={{fontSize:28,width:270}}>{t}</span><div style={{width:220,height:8,background:'#21313f'}}><div style={{width:i===stage?'88%':'14%',height:8,background:i===stage?C.cyan:'#4a6375'}}/></div></div>)}</div>
 <Flow items={['置信度门槛','连续窗口确认','重复提醒抑制','触发事件']} y={755}/>
 <Note text="识别流程示意 · 模型、漏报率与误报率需经真实环境验证"/>
 </Scene>};

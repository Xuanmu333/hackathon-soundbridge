import {useCurrentFrame} from 'remotion';
import {Scene,Icon,C,Note} from '../visuals';
import {TechBackdrop,TechHeading,StageRail,SignalMesh,DataTraces} from '../technology';
export const Recognition=()=>{const f=useCurrentFrame(),step=Math.min(3,Math.floor(f/120));const labels=['短时声音 → 频谱特征','本地模型 → 事件类别','连续确认 → 触发提醒','真实环境 → 验证性能'];return <Scene id={3}>
 <TechBackdrop asset="processor"/>
 <DataTraces/>
 <TechHeading eyebrow="03 / ON-WATCH INTELLIGENCE" title={'让声音，\n成为可感知的信息。'} sub="短时采集 / 频谱特征 / 本地推理"/>
 <div style={{position:'absolute',left:105,top:465,fontSize:31,color:C.cyan}}>{labels[step]}</div>
 {step===0?<SignalMesh/>:<div style={{position:'absolute',left:105,top:535,display:'flex',gap:40}}>{[['bike','车铃'],['horn','鸣笛'],['bell','门铃']].map(([kind,label],i)=><div key={kind} style={{color:i===0?C.white:C.muted,opacity:step===3?.6:1}}><div style={{height:75,display:'flex',alignItems:'center'}}><Icon kind={kind} size={54} color={i===0?C.cyan:C.muted}/></div><div style={{fontSize:29}}>{label}</div></div>)}</div>}
 <div style={{position:'absolute',left:105,top:700,color:'#92aebb',fontSize:25}}>{step<2?'信号结构可视化 / 概念示意':step===2?'置信度筛选 · 连续窗口确认 · 重复抑制':'漏报与误报，需要在真实环境中测试'}</div>
 <StageRail items={['声音采集','特征与分类','事件判断','性能验证']} active={step}/>
 <Note text="芯片与悬浮频谱为概念可视化 · 不代表已验证的硬件与性能" y={853}/>
 </Scene>};

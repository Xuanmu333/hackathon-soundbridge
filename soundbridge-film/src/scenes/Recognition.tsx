import {useCurrentFrame,interpolate,Easing} from 'remotion';
import {Scene,Icon,C,Note,ease} from '../visuals';
import {TechBackdrop,TechHeading,StageRail,SignalMesh,DataTraces} from '../technology';
export const Recognition=()=>{
 const f=useCurrentFrame(),step=f<126?0:f<233?1:f<369?2:3;
 const fold=interpolate(f,[95,125],[0,1],{...ease,easing:Easing.bezier(.4,0,.2,1)});
 const transfer=interpolate(f,[110,180],[0,1],{...ease,easing:Easing.bezier(.4,0,.2,1)});
 const result=interpolate(f,[270,310],[0,1],{...ease,easing:Easing.bezier(.4,0,.2,1)});
 const badge=interpolate(f,[306,322],[0,1],ease);
 const labels=['短时声音 → 频谱特征','本地模型 → 事件类别','连续确认 → 触发提醒','真实环境 → 验证性能'];
 return <Scene id={3}>
 <TechBackdrop asset="processor"/>
 <div style={{opacity:interpolate(f,[105,115,220,236],[0,1,1,.15],ease)}}><DataTraces progress={transfer}/></div>
 <TechHeading eyebrow="03 / ON-WATCH INTELLIGENCE" title={'让声音，\n成为可感知的信息。'} sub="短时采集 / 频谱特征 / 本地推理"/>
 <div style={{position:'absolute',left:105,top:465,fontSize:31,color:C.cyan}}>{labels[step]}</div>
 {f<126&&<div style={{position:'absolute',left:100+fold*180,top:535+fold*30,width:640,height:180,scale:1-fold*.8,opacity:1-fold,transformOrigin:'center'}}><SignalMesh x={0} y={0}/></div>}
 {f>=126&&<div style={{position:'absolute',left:105,top:535,display:'flex',gap:40,opacity:interpolate(f,[126,137],[0,1],ease)*(1-badge*.6)}}>{[['bike','车铃'],['horn','鸣笛'],['bell','门铃']].map(([kind,label])=><div key={kind} style={{color:C.muted}}><Icon kind={kind} size={44} color={C.muted}/><div style={{fontSize:25,marginTop:12}}>{label}</div></div>)}</div>}
 {f>=180&&f<270&&<div style={{position:'absolute',left:1410,top:500,width:100,height:100,borderRadius:'50%',border:`1px solid ${C.cyan}`,opacity:interpolate(f,[180,195,250,270],[0,.6,.6,0],ease),scale:interpolate(f,[180,270],[.7,1.25],ease)}}/>}
 {f>=270&&<div style={{position:'absolute',left:interpolate(result,[0,1],[1430,105]),top:interpolate(result,[0,1],[520,630]),height:58,width:58+badge*480,overflow:'hidden',borderRadius:29,background:'#0c2935f5',border:'1px solid #64e8eb99',display:'flex',alignItems:'center',gap:17,padding:'0 18px',boxSizing:'border-box',boxShadow:`0 0 ${16*(1-badge)}px #64e8eb55`}}><span style={{width:11,height:11,flexShrink:0,borderRadius:'50%',background:C.cyan}}/><span style={{fontSize:26,whiteSpace:'nowrap',opacity:badge}}>事件已确认 · 进入触觉映射</span></div>}
 <div style={{position:'absolute',left:105,top:718,color:'#92aebb',fontSize:23}}>{step<2?'信号结构可视化 / 概念示意':step===2?'置信度筛选 · 连续窗口确认 · 重复抑制':'漏报与误报，需要在真实环境中测试'}</div>
 <StageRail items={['声音采集','特征与分类','事件判断','性能验证']} active={step}/>
 <Note text="芯片与悬浮频谱为概念可视化 · 不代表已验证的硬件与性能" y={853}/>
 </Scene>;
};

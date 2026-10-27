import {useCurrentFrame} from 'remotion';
import {Scene,Title,Watch,Icon,C,Note} from '../visuals';
export const Privacy=()=>{const f=useCurrentFrame();return <Scene id={10}>
 <Title kicker="10 / LOCAL-FIRST PRIVACY" title={'让私人的时刻，\n留在腕上。'} width={1000}/>
 <div style={{position:'absolute',left:110,top:440,width:910}}>{[['chip','核心识别，在设备内','ON-DEVICE INFERENCE'],['lock','原始录音，默认不保存','NO RAW RECORDINGS BY DEFAULT'],['check','事件历史，由你管理','OPTIONAL CATEGORY + TIME HISTORY']].map(([k,t,e],i)=><div key={k} style={{display:'flex',gap:30,alignItems:'center',height:115,opacity:f>i*65?1:.15}}><Icon kind={k} size={50}/><div style={{fontSize:32}}>{t}<div style={{fontSize:19,letterSpacing:2,color:C.muted,marginTop:9}}>{e}</div></div></div>)}</div>
 <div style={{position:'absolute',left:1180,top:245,width:630,height:625,border:'1px solid #64e8eb55',borderRadius:55,background:'linear-gradient(135deg,#64e8eb06,#64e8eb12)'}}/>
 <Watch x={1300} y={385} size={390} label="本地处理" sub="Your moments stay yours" kind="lock"/>
 <Note text="拟议隐私默认值 · 需在最终硬件、固件和存储策略中落实"/>
 </Scene>};

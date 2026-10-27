import {TechAtmosphere} from '../technology';
import {useCurrentFrame,interpolate} from 'remotion';
import {Scene,Title,Watch,Icon,C,Tap,Note,ease} from '../visuals';
export const Personalize=()=>{const f=useCurrentFrame();const stage=Math.min(2,Math.floor(f/120));const larger=f>260;return <Scene id={7}>
 <TechAtmosphere/>
 <Title kicker="07 / MAKE IT YOURS" title="你的手腕，你的偏好。" width={1500}/>
 <div style={{position:'absolute',left:100,top:365,display:'flex',gap:25}}>{['01 开启感知','02 选择声音','03 试试触感'].map((t,i)=><div key={i} style={{fontSize:26,padding:'16px 24px',borderRadius:30,border:`1px solid ${stage===i?C.cyan:'#304755'}`,color:stage===i?C.cyan:C.muted}}>{t}</div>)}</div>
 <div style={{position:'absolute',left:110,top:470,width:900}}>{stage<2?<>{[['bell','门铃'],['bike','车铃'],['horn','鸣笛']].map(([k,t],i)=><div key={k} style={{height:72,display:'flex',alignItems:'center',gap:25,fontSize:30,borderBottom:'1px solid #27414f'}}><Icon kind={k} size={35}/><span>{t}</span><div style={{marginLeft:'auto',width:72,height:36,background:i===0&&f>195?'#3e4f5c':C.cyan,borderRadius:22,padding:4,boxSizing:'border-box'}}><div style={{width:28,height:28,borderRadius:'50%',background:'#fff',marginLeft:i===0&&f>195?0:36}}/></div></div>)}</>:<>{[['文字大小','标准 → 更大'],['振动强度','轻柔 → 适中 → 强']].map(([label,txt],i)=><div key={label} style={{marginBottom:55}}><div style={{display:'flex',justifyContent:'space-between',fontSize:30}}><span>{label}</span><span style={{color:C.cyan,fontSize:24}}>{txt}</span></div><div style={{marginTop:25,height:8,background:'#30424e',borderRadius:8}}><div style={{position:'relative',width:`${interpolate(f,[280+i*25,350+i*25],[40,75],ease)}%`,height:8,background:C.cyan}}><div style={{position:'absolute',right:-12,top:-10,width:28,height:28,borderRadius:'50%',background:'white',boxShadow:'0 0 20px #64e8eb88'}}/></div></div></div>)}</>}</div>
 <Tap x={974} y={578} from={195}/>
 <Watch x={1300} y={385} size={390} label={larger?'车铃提示':'声音感知'} sub={stage===1?(f>195?'2 sounds selected':'3 sounds selected'):'Your wrist. Your way.'} kind={larger?'bike':'check'} textScale={larger?1.25:1}/>
 <Note text="偏好本地保存 → 筛选事件、调整字号与触觉驱动参数"/>
 </Scene>};

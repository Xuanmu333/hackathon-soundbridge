import {useCurrentFrame,interpolate} from 'remotion';
import {Scene,Watch,Icon,C,Note,ease} from '../visuals';
import {TechHeading,OrbitField,StageRail} from '../technology';
export const Direction=()=>{const f=useCurrentFrame(),uncertain=f>=245,fade=interpolate(f,[230,245],[1,0],ease),clock=Math.min(f,230);const sensors=[[1100,440],[1330,280],[1630,440],[1450,740]];return <Scene id={5}>
 <div style={{position:'absolute',left:700,top:110,width:1220,height:780,background:'radial-gradient(ellipse,#103c5355,transparent 67%)'}}/>
 <OrbitField x={1370} y={530} r={370} dim={uncertain} motionFrame={clock}/>
 <svg width="1920" height="900" style={{position:'absolute',inset:0}}>
 <defs><linearGradient id="sound-volume" x1="0" y1="0" x2="1" y2="1"><stop stopColor={C.cyan} stopOpacity=".22"/><stop offset="1" stopColor={C.cyan} stopOpacity="0"/></linearGradient></defs>
 {fade>0&&<g opacity={fade}><path d="M950 290 L1630 440 L1450 740 Z" fill="url(#sound-volume)"/>{[20,45,70,95,120].map(onset=>{const age=clock-onset;if(age<0||age>80)return null;const p=age/80,x=950+p*240,y=290+p*130;return <ellipse key={onset} cx={x} cy={y} rx={25+p*125} ry={60+p*125} fill="none" stroke={C.cyan} opacity={(1-p)*.4} transform={`rotate(-35 ${x} ${y})`}/>;})}</g>}
 {sensors.map(([x,y],i)=><g key={i}><path d={`M950 290 L${x} ${y}`} stroke={uncertain?'#304653':C.cyan} strokeDasharray="3 12" strokeDashoffset={-Math.min(clock,180)*2-i*9} opacity={uncertain?.1:.35}/><circle cx={x} cy={y} r="15" fill="#091e29" stroke={uncertain?C.muted:C.cyan}/><circle cx={x} cy={y} r="5" fill={uncertain?C.muted:C.cyan}/><text x={x+25} y={y+7} fill={C.muted} fontSize="21">MIC {String.fromCharCode(65+i)}</text></g>)}
 {Array.from({length:13},(_,row)=>Array.from({length:32},(_,col)=>{const lat=(row/12-.5)*Math.PI;const lon=col/32*Math.PI*2+Math.min(clock,180)*.0025;const x=Math.cos(lat)*Math.cos(lon)*335,z=Math.cos(lat)*Math.sin(lon)*335,y=Math.sin(lat)*335;const depth=1+z/1500;return <circle key={row+'-'+col} cx={1370+x/depth} cy={520+(y*.92-z*.22)/depth} r={z>0?1.2:2} fill={C.cyan} opacity={.1+fade*.12+(1-z/335)*(.035+fade*.165)}/>;}))}
 <ellipse cx="1370" cy="530" rx="190" ry="340" fill="none" stroke={C.cyan} opacity=".14" transform="rotate(25 1370 530)"/>
 <ellipse cx="1370" cy="530" rx="125" ry="340" fill="none" stroke={C.cyan} opacity=".1" transform="rotate(-25 1370 530)"/>
 </svg>
 <TechHeading eyebrow="05 / SPATIAL SOUND FIELD" title={'感知来向，\n理解不确定性。'} sub="多麦克风 / 到达时间差 / 相对来向"/>
 <div style={{position:'absolute',left:105,top:480,fontSize:100,fontWeight:200,color:uncertain?C.warm:C.cyan,letterSpacing:-4}}>{uncertain?'?':'Δt'}</div>
 <div style={{position:'absolute',left:110,top:625,fontSize:35,color:uncertain?C.warm:C.white}}>{uncertain?'方向不确定 · 请观察周围':'比较声音抵达各麦克风的时间'}</div>
 <div style={{position:'absolute',left:110,top:692,fontSize:25,color:C.muted}}>相对手表的辅助线索</div>
 {!uncertain&&<div style={{position:'absolute',left:918,top:243}}><Icon kind="wave" size={52}/></div>}
 <Watch x={1220} y={370} size={300} label={uncertain?'方向不确定':'大致来向'} sub={uncertain?'请观察周围':'相对手表'} kind="bike" bearing={uncertain?undefined:-60} bearingOpacity={fade} active={false}/>
 <StageRail items={['多点采集','时间差估计','来向判断','不确定状态']} active={uncertain?3:Math.min(2,Math.floor(f/85))}/>
 <Note text="空间声场与阵列为结构示意 · 需真实佩戴与噪声测试 · 不保证避险" y={853}/>
 </Scene>};

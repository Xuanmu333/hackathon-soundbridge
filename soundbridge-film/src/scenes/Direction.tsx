import {useCurrentFrame} from 'remotion';
import {Scene,Title,Watch,Icon,C,Note} from '../visuals';
export const Direction=()=>{const f=useCurrentFrame();const uncertain=f>=245;const angle=-60;return <Scene id={5}>
 <Title kicker="05 / DIRECTION WITH UNCERTAINTY" title={'来向，\n只作辅助线索。'} width={1200}/>
 <svg width="970" height="410" style={{position:'absolute',left:100,top:430}}>
  {[80,145,210,275,340].map((r,i)=><circle key={i} cx="120" cy="180" r={r+(f%35)} stroke={C.cyan} fill="none" opacity={.3-i*.045}/>)}
  <path d="M120 180 700 90M120 180 700 280" stroke="#64e8eb77" strokeDasharray="8 10" fill="none"/>
  <rect x="650" y="40" width="250" height="300" rx="35" fill="#102632" stroke="#466876"/>
  <circle cx="690" cy="90" r="13" fill={C.cyan}/><circle cx="690" cy="280" r="13" fill={C.blue}/>
  <text x="730" y="100" fill={C.cyan} fontSize="26">Mic A</text><text x="730" y="290" fill={C.blue} fontSize="26">Mic B</text>
  <text x="720" y="205" fill="#e7f7fa" fontSize="40">Δt</text>
  <text x="360" y="385" fill="#9ab3c0" fontSize="25">到达时间差 → 来向估计</text>
 </svg>
 <div style={{position:'absolute',left:181,top:565}}><Icon kind="wave" size={80}/></div>
 <Watch x={1300} y={385} size={390} label={uncertain?'方向不确定':'大致来向'} sub={uncertain?'请观察周围':'相对手表 / Relative to watch'} kind="bike" bearing={uncertain?undefined:angle}/>
 <Note text="需硬件与校准验证 · 不可靠时不显示方向扇区 · 不保证避险"/>
 </Scene>};

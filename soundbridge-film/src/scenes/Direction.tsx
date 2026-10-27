import {useCurrentFrame} from 'remotion';
import {Scene,Title,Watch,Icon,C,Note} from '../visuals';
export const Direction=()=>{const f=useCurrentFrame();const angle=-65+Math.sin(f/95)*65;return <Scene id={7}>
 <Title kicker="06 / APPROXIMATE DIRECTION" title={'不只知道发生了什么，\n也知道往哪里看。'} width={1200}/>
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
 <Watch x={1300} y={385} size={390} label="大致来向" sub="Relative to the watch" kind="bike" bearing={angle}/>
 <Note text="需多麦克风阵列与校准 · 扇区为示意，非实测角度或精度"/>
 </Scene>};

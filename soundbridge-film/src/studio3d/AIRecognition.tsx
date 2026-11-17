import {ease,events,ViewState} from './state';

export const AIRecognition=({s}:{s:ViewState})=>{
 const u=ease((s.time-4.6)/2.5),labels=['车铃','鸣笛','环境背景'];
 const winner=s.event==='horn'?1:0;
 return <div className="signal-card ai-recognition">
  <div className="section-label">端侧 AI 声音识别<span>ON-DEVICE AI</span></div>
  <svg viewBox="0 0 280 100" aria-label="声谱特征进入本地模型进行声音分类的概念动画">
   {Array.from({length:72},(_,i)=>{const x=i%18,y=Math.floor(i/18),value=.15+.85*Math.abs(Math.sin(x*.63+y*1.3+s.time*3));return <rect key={i} x={x*8} y={16+y*15} width="5" height="12" fill="#e5b879" opacity={value}/>;})}
   <path d="M153 44H181" stroke="#b99a70" strokeWidth="2" strokeDasharray="4 4" strokeDashoffset={-s.time*20}/>
   {[0,1,2].flatMap(i=>[0,1,2].map(j=><path key={`${i}${j}`} d={`M196 ${23+i*22}L250 ${23+j*22}`} stroke="#ba925a" opacity={.2+u*.5}/>))}
   {[196,250].flatMap(x=>[0,1,2].map(i=><circle key={`${x}${i}`} cx={x} cy={23+i*22} r={4+u*2} fill="#e9c28b"/>))}
   <text x="70" y="92" textAnchor="middle" fill="#aebba7" fontSize="11">声谱特征</text><text x="225" y="92" textAnchor="middle" fill="#aebba7" fontSize="11">本地模型</text>
  </svg>
  <div className="ai-candidates">{labels.map((label,i)=><div key={label} style={{opacity:i===winner?1:.42}}><span>{label}</span><i><b style={{width:`${(i===winner?30+u*65:32-u*20)}%`}}/></i><small>{i===winner&&u>.65?'匹配':'候选'}</small></div>)}</div>
  <strong>{u>.65?`${events[s.event].zh} · 连续识别一致`:'分析声谱 · 比较类别'}</strong>
  <p>识别过程示意 · 确认类别后触发提醒</p>
 </div>;
};

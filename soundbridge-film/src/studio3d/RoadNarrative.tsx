import React from 'react';
import {bearingLabel,events,formatBearing,haptic,hapticPattern,micArrivals,phase,ViewState} from './state';

export const roadNarrative:Record<string,{tag:string;title:string;text:string}>= {
 Logic:{tag:'技术实现',title:'两路解析，\n形成一份提醒',text:'收音之后，一路识别声音类别，一路估算来向。结果汇合，转成触觉与视觉线索，帮助听障使用者及时察觉。'},
 Opening:{tag:'独立出行',title:'把安全线索\n带到她的手腕',text:'小林是一位听障人士。SoundBridge 将重要的环境声音转为可感知的提醒，支持她观察与判断。'},
 Approach:{tag:'身后来车',title:'车铃响起，\n提醒即将抵达',text:'四个麦克风接收声音，识别车铃与来向。三次短振，让她注意到视线之外的骑行者。'},
 Respond:{tag:'感知与回应',title:'感到短振，\n抬腕确认',text:'三次短振引起注意；图标和文字说明声音类别，方位标记提示往哪里看。她观察后，再让出空间。'},
 Array:{tag:'多点定位',title:'四路时差，\n共同指向来向',text:'同一次声音先后抵达四个麦克风。比较到达时差，估算来向，再用角度和方位标记呈现。'},
 Crossing:{tag:'路口警觉',title:'车辆鸣笛，\n两次长振提醒',text:'鸣笛采用两次长振，与车铃的短振形成区别。表盘补充类别和方向，她在路缘内停步查看。'},
 Wait:{tag:'观察与等待',title:'先看清车辆，\n再决定行动',text:'触觉让她察觉提醒，视觉给出进一步线索。她观察车辆、等待通过，确认路况后继续前行。'},
 Bearing:{tag:'多种感知',title:'触觉唤起注意，\n视觉解释线索',text:'振动节奏、声音图标、类别文字和来向标记协同表达。看清是什么、从哪里来，再自主判断。'},
 Personalize:{tag:'适合自己的提醒',title:'停稳之后，\n调到舒适清楚',text:'用鸣笛提醒预览振动与表盘，按个人感受调整强度和字号。图形与手表同步演示，后续行程沿用她的设置。'},
 Structure:{tag:'内部协作',title:'从声音信号，\n到可感知的提醒',text:'麦克风收音，处理电路识别，显示模组呈现信息，触觉马达传达振动。每个部件都服务于清楚的线索。'},
 RearAlert:{tag:'再次察觉',title:'右后方接近，\n短振再次提醒',text:'另一位骑行者接近。三次短振与右后方标记同步出现，她抬腕查看、回头确认，为对方留出空间。'},
 Closing:{tag:'安全与自主',title:'持续感知，\n从容走自己的路',text:'提醒结束，手表恢复环境感知。及时的线索帮助她留意周围，行动始终由她自己决定。'},
};

export const RoadNarrative:React.FC<{s:ViewState;chapter:string;index:number;reveal?:number}>=({s,chapter,index,reveal=1})=>{
 const copy=roadNarrative[chapter],p=phase(s),idle=p<0,pulse=haptic(s),pattern=hapticPattern(s.event),personalize=chapter==='Personalize',technical=chapter==='Structure'||chapter==='Logic';
 const end=pattern[pattern.length-1].start+pattern[pattern.length-1].duration;
 const sensation=personalize?`体验反馈 · 振动强度 ${Math.round(s.strength*100)}%`:idle?'等待新的声音线索':s.time<pattern[0].start?'识别后触发腕上提醒':s.time<end?'图形与手表同步振动':'提醒已送达 · 观察周围';
 const tactile=chapter!=='Array'&&!technical;
 return <aside className="road-narrative" style={{opacity:reveal,transform:`translateY(${(1-reveal)*10}px)`}}>
  <div className="narrative-kicker"><b>{String(index).padStart(2,'0')}</b><span>{copy.tag}</span><i/></div>
  <h2>{copy.title}</h2><p className="narrative-copy">{copy.text}</p>
  <div className="narrative-signal"><span>{technical?'实现逻辑':personalize?'个人设置':idle?'环境感知':p<3?'声音解析':'识别结果'}</span><strong>{technical?'信号 → 感知':personalize?'提醒体验':idle?'感知中':p<3?'接收 → 分析':events[s.event].zh}</strong><small>{technical?'麦克风 · 本地处理 · 显示与触觉':personalize?`振动 ${Math.round(s.strength*100)}% · ${s.largeText?'大字显示已开启':'标准字号'}`:idle?'留意周围的下一条线索':p<3?'阵列接收 · 类别与来向判断':`${formatBearing(s.bearing)} · ${bearingLabel(s.bearing)}`}</small></div>
  <div className="narrative-graphic">
   {chapter==='Logic'&&<div className="logic-left-steps"><div><b>01</b><span>收音<small>同步接收四路信号</small></span></div><div><b>02</b><span>解析<small>类别识别 + 来向估算</small></span></div><div><b>03</b><span>反馈<small>触觉提醒 + 表盘呈现</small></span></div></div>}
   {tactile&&<>
    <svg viewBox="0 0 264 144" aria-label="与腕表同步的振动节奏">
     <path d="M8 69H256" stroke="#5a625c" strokeWidth="1"/>
     {pattern.map((beat,i)=>{const x=15+(beat.start-pattern[0].start)/(end-pattern[0].start)*234,w=beat.duration/(end-pattern[0].start)*234;const v=s.time>=beat.start&&s.time<beat.start+beat.duration?Math.sin((s.time-beat.start)/beat.duration*Math.PI):0;return <g key={beat.start}><rect x={x} y={69-7-v*s.strength*24} width={w} height={14+v*s.strength*48} rx="6" fill={v>0?'#f3c789':s.time>=beat.start+beat.duration?'#8b7960':'#292f2b'} stroke={v>0?'#ffead0':'#8c8578'} opacity={idle?.3:1}/><text x={x+w/2} y="123" textAnchor="middle" fill="#a4ada6" fontSize="11">0{i+1}</text></g>;})}
     <circle cx="132" cy="24" r={3+pulse*4} fill={idle?'#72867a':'#f3c789'} opacity={idle?.5:.4+pulse*.6}/>
    </svg>
    <div className="narrative-pattern"><strong>{idle?'触觉待命':events[s.event].pattern}</strong><span>{sensation}</span></div>
   </>}
   {chapter==='Array'&&<><svg viewBox="0 0 264 158" aria-label="四麦克风时差定位">{micArrivals(s.bearing).map((m,i)=>{const x=i===0||i===3?28:236,y=i<2?28:125;return <g key={m.id}><path d={`M${x} ${y}L132 76`} stroke="#797d70" strokeDasharray="3 5"/><circle cx={x} cy={y} r="12" fill="#252c27" stroke="#d5b786"/><text x={x} y={y+4} textAnchor="middle" fill="#ede4d4" fontSize="10">{m.id}</text><text x={x} y={y+(i<2?28:-21)} textAnchor="middle" fill="#b7beb5" fontSize="10">+{Math.round(m.delay)} μs</text></g>;})}<circle cx="132" cy="76" r="26" fill="#252b27" stroke="#d5b786"/><text x="132" y="80" textAnchor="middle" fill="#eee5d7" fontSize="13">{formatBearing(s.bearing)}</text></svg><div className="narrative-pattern"><strong>时差 → 来向</strong><span>四路信号，对应表盘方位</span></div></>}
   {chapter==='Structure'&&<><svg viewBox="0 0 264 158" aria-label="内部部件协作">{['显示与触觉','本地识别','麦克风收音'].map((label,i)=><g key={label} transform={`translate(0,${(i-1)*s.exploded*9})`}><path d={`M46 ${38+i*37}l86 -15 86 15 -86 15z`} fill="#2e3530" stroke="#b5a082"/><text x="132" y={42+i*37} textAnchor="middle" fill="#e3ded2" fontSize="12">{label}</text></g>)}</svg><div className="narrative-pattern"><strong>信号 → 感知</strong><span>内部展开与主画面同步</span></div></>}
  </div>
  <div className="narrative-senses"><div><b>触觉</b><span>节奏 · 强度</span></div><div><b>视觉</b><span>图标 · 文字 · 来向</span></div></div>
  <div className="narrative-action"><span/>感知线索，观察确认，自主行动</div>
 </aside>;
};

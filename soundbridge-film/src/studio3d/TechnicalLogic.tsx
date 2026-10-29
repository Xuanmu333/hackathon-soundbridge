import {ease} from './state';

export const TechnicalLogic=({seconds}:{seconds:number})=>{
 const t=seconds-20,opacity=ease((seconds-19)/3)*(1-ease((seconds-40)/2));
 const capture=ease(t/2),analysis=ease((t-4)/2),fusion=ease((t-12)/2),output=ease((t-15)/2);
 const pulses=[16.2,16.8,17.4].map(start=>t>=start&&t<start+.25?Math.sin((t-start)/.25*Math.PI):0);
 const wire=(d:string,level:number)=><g opacity={.18+.82*level}><path d={d} fill="none" stroke="#5e625a" strokeWidth="2"/><path d={d} fill="none" stroke="#e5bc84" strokeWidth="2" strokeDasharray="6 16" strokeDashoffset={-seconds*32}/></g>;
 return <div className="technical-logic" style={{opacity}}>
  <div className="logic-title"><small>ON-DEVICE SIGNAL INTELLIGENCE</small><h2>同一声音，两路解析。</h2><p>声音类别与空间来向，汇合为一份清楚的提醒。</p></div>
  <svg viewBox="0 0 1120 450" aria-label="四路收音分别进行声音分类和时差定位，结果融合后生成触觉及视觉提示">
   {wire('M185 225H225V115H285',analysis)}{wire('M225 225V335H285',analysis)}
   {wire('M535 115H580V225H630',fusion)}{wire('M535 335H580V225',fusion)}{wire('M790 225H855',output)}
   <g opacity={.25+.75*capture}>
    <rect x="5" y="105" width="180" height="240" rx="18" fill="#212723" stroke="#9b8466"/>
    <text x="95" y="139" textAnchor="middle" fill="#f3e3cb" fontSize="22">四路同步收音</text>
    {[0,1,2,3].map(i=><g key={i}><text x="22" y={182+i*39} fill="#c2c9bd" fontSize="14">M{i+1}</text><path d={Array.from({length:55},(_,j)=>{const x=57+j*1.9;const a=(j-23-i*3)/9;return `${j?'L':'M'}${x},${178+i*39+Math.sin(a*5-t*3)*Math.exp(-a*a*.5)*12}`;}).join(' ')} stroke="#e5bc84" fill="none" strokeWidth="2"/></g>)}
   </g>
   <g opacity={.2+.8*analysis}>
    <rect x="285" y="35" width="250" height="160" rx="18" fill="#252a25" stroke="#c69b6e"/>
    <text x="310" y="72" fill="#d5b78f" fontSize="14">01 / 声音是什么</text><text x="310" y="109" fill="#f2eee4" fontSize="24">频谱特征 → 分类</text>
    {Array.from({length:22},(_,i)=><rect key={i} x={312+i*6} y={152-(6+Math.abs(Math.sin(i*.7+t))*24)} width="3" height={6+Math.abs(Math.sin(i*.7+t))*24} fill="#ce9c68"/>)}
    <text x="493" y="153" textAnchor="middle" fill="#f1d4aa" fontSize="18">车铃</text>
    <rect x="285" y="255" width="250" height="160" rx="18" fill="#252a25" stroke="#c69b6e"/>
    <text x="310" y="292" fill="#d5b78f" fontSize="14">02 / 声音从哪里来</text><text x="310" y="330" fill="#f2eee4" fontSize="24">到达时差 → 来向</text>
    <text x="310" y="373" fill="#b7c2b5" fontSize="16">Δt₁ · Δt₂ · Δt₃</text><text x="490" y="373" textAnchor="middle" fill="#f1d4aa" fontSize="27">−45°</text>
   </g>
   <g opacity={.2+.8*fusion}><circle cx="710" cy="225" r="78" fill="#272b25" stroke="#c8a476" strokeWidth="2"/><circle cx="710" cy="225" r={88+Math.sin(t*2)*2} fill="none" stroke="#a1785066"/><text x="710" y="217" textAnchor="middle" fill="#f2e6d4" fontSize="24">结果汇合</text><text x="710" y="248" textAnchor="middle" fill="#b9c2b5" fontSize="15">类别 + 来向</text></g>
   <g opacity={.15+.85*output}>
    <rect x="855" y="65" width="255" height="320" rx="22" fill="#252a25" stroke="#dab889"/>
    <text x="882" y="104" fill="#efddc2" fontSize="20">视觉 · 看清来向</text><text x="982" y="157" textAnchor="middle" fill="#edd3aa" fontSize="17">车铃 / 左前方</text>
    <rect x="901" y="171" width="162" height="65" rx="12" fill="#ad723033" stroke="#ecc68a" opacity={.7+.3*Math.sin(t*3)**2}/><text x="982" y="218" textAnchor="middle" fill="#fff0d6" fontSize="46">−45°</text>
    <path d="M882 258H1083" stroke="#5a6155"/><text x="882" y="291" fill="#efddc2" fontSize="20">触觉 · 引起注意</text>
    {[0,1,2].map(i=><rect key={i} x={885+i*62} y={321-pulses[i]*9} width="43" height={12+pulses[i]*18} rx="5" fill="#edc58d"/>)}
    <text x="982" y="366" textAnchor="middle" fill="#b8c3b3" fontSize="15">三次短振</text>
   </g>
  </svg>
  <div className="logic-conclusion">{t<4?'接收同一次声音，形成四路数字信号':t<12?'并行解析：识别声音类别，同时估算声源来向':t<16?'把“发生了什么”与“从哪里来”关联起来':'触觉引起注意 → 视觉补充信息 → 使用者观察与判断'}</div>
 </div>;
};

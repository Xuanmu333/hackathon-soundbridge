import {formatBearing,haptic,ViewState} from './state';

export const AdaptiveFeedback=({s,chapter}:{s:ViewState;chapter:string})=>{
 if(chapter!=='Bearing'&&chapter!=='Escalation')return null;
 const ready=s.directionReady!==false,yaw=s.wristYaw??0,pulse=haptic(s);
 const names={repeat:'尚未确认 · 间隔重复',strong:'仍未确认 · 增强提醒',viewing:'已经抬腕 · 等待确认',confirmed:'已点按确认 · 停止升级'};
 return <aside className="adaptive-feedback">
  <small>{chapter==='Bearing'?'WRIST ORIENTATION':'RESPONSIVE HAPTICS'}</small>
  <h3>{chapter==='Bearing'?(ready?'姿态稳定，更新指向':'姿态变化，暂缓指向'):names[s.alertStage??'repeat']}</h3>
  {chapter==='Bearing'?<>
   <svg viewBox="0 0 320 180" aria-label="固定声源与转动的表盘坐标对比">
    <circle cx="160" cy="100" r="59" fill="none" stroke="#737c6b" strokeDasharray="2 7"/>
    <path d="M160 100L65 45" stroke="#dabb8d" strokeWidth="2" strokeDasharray="4 5"/>
    <circle cx="65" cy="45" r="7" fill="#edc78d"/><text x="42" y="22" fill="#d9c29d" fontSize="12">声源保持原位</text>
    <g transform={`rotate(${yaw},160,100)`}><rect x="129" y="62" width="62" height="76" rx="18" fill="#622331" stroke="#cfae88"/><path d="M160 90V48m-5 7 5-7 5 7" fill="none" stroke="#e6e9df" strokeWidth="2"/><text x="161" y="36" textAnchor="middle" fill="#c4cebc" fontSize="11">12 点</text></g>
    <text x="260" y="102" textAnchor="middle" fill="#ead2aa" fontSize="25">{ready?formatBearing(s.bearing):'更新中'}</text>
    <text x="160" y="171" textAnchor="middle" fill="#b5c1ac" fontSize="12">表盘转动 {formatBearing(yaw)} · 指向随坐标更新</text>
   </svg><p>抬腕查看即可，无需刻意水平。<br/>方向相对当前表盘，不是身体。</p>
  </>:<>
   <div className="response-stages">{['重复','增强','查看','确认'].map((label,i)=>{const current=['repeat','strong','viewing','confirmed'].indexOf(s.alertStage??'repeat');return <span key={label} style={{color:i<=current?'#f0c893':'#69735f',borderColor:i===current?'#d6b284':'#505746'}}>{label}</span>;})}</div>
   <div className="response-pulse"><i style={{scale:1+pulse*.15,opacity:.3+pulse*.7}}/ ><strong>{s.alertStage==='confirmed'?'✓ 已确认':`${Math.round(s.strength*100)}%`}</strong><span>{s.alertStage==='confirmed'?'停止升级，继续观察路况':'两次长振 · 保留间隔'}</span></div>
   <p>{s.alertStage==='viewing'?'抬腕是查看动作，点按才是明确确认。':'未抬腕不等于未感受到振动。'}<br/>每轮最多 30 秒；确认或事件解除即结束。</p>
  </>}
 </aside>;
};

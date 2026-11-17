import {events,haptic,SoundEvent,ViewState} from './state';

const sounds:SoundEvent[]=['noise','siren','engine','construction'];
const descriptions=['风声 / 人群底噪 · 减少打扰','留意应急车辆','留意附近交通 · 不等同危险','留意作业区域'];
export const RoadSounds=({s,chapter}:{s:ViewState;chapter:string})=>chapter!=='RoadSounds'?null:<div className="road-sounds">
 <div className="section-label">AI 声音筛选<span>EVENT FILTER</span></div>
 <p>识别类别 → 结合场景 → 区别提醒</p>
 {sounds.map((id,i)=>{const selected=s.event===id;return <div key={id} className="sound-choice" style={{opacity:selected?1:.38,borderColor:selected?'#bca482':'#424943',background:selected?'#38372f':'transparent'}}>
  <i style={{background:id==='noise'?'#89938c':'#e2bf8b',transform:`scale(${selected?1+haptic(s)*.65:1})`}}/>
  <span><b>{events[id].zh}</b><small>{descriptions[i]}</small></span><em>{events[id].pattern}</em>
 </div>;})}
 <footer>背景声减少提醒 · 未知声音不直接归为底噪</footer>
</div>;

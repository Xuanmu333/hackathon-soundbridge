import {Img,staticFile} from 'remotion';
import {ease} from './state';

export const photoShots=[
 {start:0,src:'safety/walking.png',label:'独自出行 · 留意周围',zoom:1,origin:'65% 50%'},
 {start:59.55,src:'story/glance.png',label:'收到提醒 · 抬腕查看',zoom:1,origin:'65% 50%'},
 {start:64,src:'safety/observe.png',label:'观察来向 · 靠边让行',zoom:1,origin:'65% 50%'},
 {start:80,src:'safety/walking.png',label:'保持观察 · 继续前行',zoom:1,origin:'65% 50%'},
 {start:82,src:'road-photos/curb-check.png',label:'来到路口 · 留意车辆',zoom:1.9,origin:'0% 50%'},
 {start:89.55,src:'road-photos/curb-check.png',label:'路缘内停步 · 抬腕查看',zoom:1,origin:'65% 50%'},
 {start:94,src:'road-photos/wait.png',label:'观察车辆 · 等待通过',zoom:1,origin:'65% 50%'},
 {start:104,src:'safety/walking.png',label:'确认路况 · 继续前行',zoom:1,origin:'65% 50%'},
 {start:117,src:'road-photos/adjust.png',label:'停在安全位置 · 调整提醒',zoom:1,origin:'50% 50%'},
 {start:124,src:'safety/walking.png',label:'保持观察 · 继续前行',zoom:1,origin:'65% 50%'},
 {start:133.55,src:'story/glance.png',label:'再次收到提醒 · 抬腕查看',zoom:1,origin:'65% 50%'},
 {start:138,src:'safety/observe.png',label:'观察确认 · 留出空间',zoom:1,origin:'65% 50%'},
 {start:144,src:'safety/walking.png',label:'自主判断 · 从容出行',zoom:1,origin:'65% 50%'},
];
export const photoIndex=(t:number)=>photoShots.reduce((last,s,i)=>t>=s.start?i:last,0);
export const PhotoJourney=({seconds}:{seconds:number})=>{
 const index=photoIndex(seconds),shot=photoShots[index];
 const layer=(i:number,opacity:number)=>{const s=photoShots[i],elapsed=Math.max(0,seconds-s.start);return <Img key={i} src={staticFile(s.src)} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 20%',transform:`scale(${s.zoom+Math.min(elapsed,20)*.0016})`,transformOrigin:s.origin,opacity}}/>;};
 return <>{index>0&&layer(index-1,1)}{layer(index,index===0?1:ease((seconds-shot.start)/.65))}</>;
};

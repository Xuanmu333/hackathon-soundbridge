import {Img,staticFile} from 'remotion';
import {ease} from './state';

export const photoShots=[
 {
  "start": 0,
  "src": "safety/walking.png",
  "label": "独自出行 · 留意周围",
  "zoom": 1,
  "origin": "65% 50%"
 },
 {
  "start": 41.55,
  "src": "story/glance.png",
  "label": "收到提醒 · 抬腕查看",
  "zoom": 1,
  "origin": "65% 50%"
 },
 {
  "start": 46,
  "src": "safety/observe.png",
  "label": "观察来向 · 靠边让行",
  "zoom": 1,
  "origin": "65% 50%"
 },
 {
  "start": 54,
  "src": "safety/walking.png",
  "label": "保持观察 · 继续前行",
  "zoom": 1,
  "origin": "65% 50%"
 },
 {
  "start": 64,
  "src": "story/glance.png",
  "label": "抬腕查看 · 方向随姿态更新",
  "zoom": 1,
  "origin": "65% 50%"
 },
 {
  "start": 82,
  "src": "road-photos/curb-check.png",
  "label": "车辆接近 · 鸣笛提醒",
  "zoom": 1.7,
  "origin": "0% 50%"
 },
 {
  "start": 92,
  "src": "road-photos/wait.png",
  "label": "尚未观察到查看动作",
  "zoom": 1.7,
  "origin": "90% 50%"
 },
 {
  "start": 104,
  "src": "road-photos/curb-check.png",
  "label": "抬腕查看 · 等待点按确认",
  "zoom": 1,
  "origin": "65% 50%"
 },
 {
  "start": 108,
  "src": "road-photos/adjust.png",
  "label": "点按确认 · 停止升级",
  "zoom": 1,
  "origin": "50% 50%"
 },
 {
  "start": 114,
  "src": "road-photos/wait.png",
  "label": "观察车辆 · 等待通过",
  "zoom": 1,
  "origin": "65% 50%"
 },
 {
  "start": 124,
  "src": "road-photos/adjust.png",
  "label": "安全位置 · 调整提醒",
  "zoom": 1,
  "origin": "50% 50%"
 },
 {
  "start": 134,
  "src": "safety/walking.png",
  "label": "保持观察 · 继续前行",
  "zoom": 1,
  "origin": "65% 50%"
 },
 {
  "start": 137.6,
  "src": "story/glance.png",
  "label": "再次收到提醒 · 抬腕查看",
  "zoom": 1,
  "origin": "65% 50%"
 },
 {
  "start": 141,
  "src": "safety/observe.png",
  "label": "观察确认 · 留出空间",
  "zoom": 1,
  "origin": "65% 50%"
 },
 {
  "start": 146,
  "src": "safety/walking.png",
  "label": "自主判断 · 从容出行",
  "zoom": 1,
  "origin": "65% 50%"
 }
];
export const photoIndex=(t:number)=>photoShots.reduce((last,s,i)=>t>=s.start?i:last,0);
export const PhotoJourney=({seconds}:{seconds:number})=>{
 const index=photoIndex(seconds),shot=photoShots[index];
 const layer=(i:number,opacity:number)=>{const s=photoShots[i],elapsed=Math.max(0,seconds-s.start);return <Img key={i} src={staticFile(s.src)} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 20%',transform:`scale(${s.zoom+Math.min(elapsed,20)*(s.src==='road-photos/curb-check.png'&&s.zoom>1?.025:.0016)})`,transformOrigin:s.origin,opacity}}/>;};
 return <>{index>0&&layer(index-1,1)}{layer(index,index===0?1:ease((seconds-shot.start)/.65))}</>;
};

import {progress} from './Continuity';
import {ViewState} from '../studio3d/state';

export const SignalPath=({t,alpha}:{t:number;alpha:number})=>{
 const split=progress(t,13,16), joined=progress(t,17,21), out=progress(t,21,24);
 const paths=['M158 343 C209 343 213 285 252 285','M158 343 C209 343 213 401 252 401','M383 285 C432 285 420 343 463 343','M383 401 C432 401 420 343 463 343'];
 return <svg viewBox="0 0 640 640" style={{position:'absolute',inset:0,width:640,height:640,opacity:alpha}} aria-label="麦克风输入并行送入声音分类与定位，再合成腕上提示">
  {paths.map((d,i)=><g key={d}><path d={d} fill="none" stroke="#b6b0c9" strokeWidth="1.4"/><path d={d} fill="none" stroke="#7560bf" strokeWidth="2.8" strokeDasharray="8 20" strokeDashoffset={-t*25} opacity={i<2?split:joined}/></g>)}
  <g fill="#6855b0">{[0,1,2,3].map(i=><circle key={i} cx={145+i%2*12} cy={337+Math.floor(i/2)*12} r="3.7"/>)}</g>
  <g textAnchor="middle" fontFamily="Helvetica Neue, PingFang SC, sans-serif" fill="#373247">
  <text x="151" y="382" fontSize="16">四路收音</text>
  {[{y:285,title:'声音分类',sub:'声谱 · AI'},{y:401,title:'来向估算',sub:'时差 · 姿态'}].map(({y,title,sub})=><g key={title} opacity={.4+.6*split}><rect x="250" y={y-33} width="135" height="66" rx="15" fill="#edecf5" stroke="#b4a9cc"/><text x="317" y={y-1} fontSize="20">{title}</text><text x="317" y={y+21} fontSize="14" fill="#625773">{sub}</text></g>)}
  <g opacity={.4+.6*out}><circle cx="475" cy="343" r="18" fill="#6956ad"/><path d="m466 343 6 6 10-13" fill="none" stroke="white" strokeWidth="2"/><text x="475" y="382" fontSize="16">腕上提示</text></g>
  </g>
 </svg>;
};

export const SpatialCue=({s,t}:{s:ViewState;t:number})=>{
 const theta=s.bearing*Math.PI/180;
 const x=319+Math.sin(theta)*226,y=344-Math.cos(theta)*194;
 const arrival=progress(t,34,35)*(1-progress(t,40,41));
 if(!arrival)return null;
 return <svg viewBox="0 0 640 640" style={{position:'absolute',inset:0,width:640,height:640,opacity:arrival}}>
 <path d={'M'+x+' '+y+'L319 344'} stroke="#6954ac" strokeWidth="2" strokeDasharray="2 10" strokeDashoffset={-t*26} fill="none"/>
 {[0,1,2].map(i=>{const u=((t-34)*.62+i/3)%1;return <circle key={i} cx={x} cy={y} r={6+u*38} stroke="#8c7cbf" fill="none" opacity={1-u}/>;})}
 <circle cx={x} cy={y} r="5" fill="#6351a7"/><text x={x-9} y={y+24} textAnchor="end" fontSize="15" fill="#514b67">车铃</text>
 </svg>;
};

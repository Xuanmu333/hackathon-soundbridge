import {useCurrentFrame} from 'remotion';
import {Scene,Title,StoryImage,Watch,Note,C} from '../visuals';
export const Outdoors=()=>{const f=useCurrentFrame(),on=f>100;return <Scene id={1}>
 <Title kicker="01 / NOTICE THE CUE" title="车铃响起，腕上提醒。" width={1500}/>
 <StoryImage name="walking"/>
 <Watch x={1310} y={390} size={390} label={on?'车铃提示':'户外感知'} sub={on?'请观察周围 / Look around':'车铃 · 鸣笛'} kind={on?'bike':'wave'} color={C.warm} active={on}/>
 <div style={{position:'absolute',left:130,top:735,fontSize:30,padding:'14px 24px',background:'#05111dee',color:C.warm}}>{on?'车铃 → 三次短振 → 图标与文字':'步道上的环境声音'}</div>
 <Note text="场景与触觉为概念演示 · 识别效果尚待实测"/>
 </Scene>};

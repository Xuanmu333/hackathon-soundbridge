import {Scene,Title,StoryImage,Note,C} from '../visuals';
export const Opening=()=> <Scene id={0}>
 <StoryImage name="walking" full/>
 <Title kicker="INDEPENDENCE / ENVIRONMENTAL AWARENESS" title={'每一步，\n更有把握。'} sub="面向聋人和重听人士的声音感知手表" y={230} width={1000}/>
 <Note text="独自出门，去见一位朋友。" x={108} y={700} color={C.warm}/>
 </Scene>;

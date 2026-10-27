import {Composition,Folder,Series,staticFile,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {Opening} from './scenes/Opening';
import {Outdoors} from './scenes/Outdoors';
import {Response} from './scenes/Response';
import {Recognition} from './scenes/Recognition';
import {Haptics} from './scenes/Haptics';
import {Direction} from './scenes/Direction';
import {Status} from './scenes/Status';
import {Personalize} from './scenes/Personalize';
import {Home} from './scenes/Home';
import {Modes} from './scenes/Modes';
import {Privacy} from './scenes/Privacy';
import {Closing} from './scenes/Closing';
const Film=()=>{const {fps}=useVideoConfig();return <><Series>
<Series.Sequence name="01 Opening" durationInFrames={360} premountFor={fps}><Opening/></Series.Sequence>
<Series.Sequence name="02 Outdoors" durationInFrames={420} premountFor={fps}><Outdoors/></Series.Sequence>
<Series.Sequence name="03 Response" durationInFrames={360} premountFor={fps}><Response/></Series.Sequence>
<Series.Sequence name="04 Recognition" durationInFrames={480} premountFor={fps}><Recognition/></Series.Sequence>
<Series.Sequence name="05 Haptics" durationInFrames={360} premountFor={fps}><Haptics/></Series.Sequence>
<Series.Sequence name="06 Direction" durationInFrames={450} premountFor={fps}><Direction/></Series.Sequence>
<Series.Sequence name="07 Status" durationInFrames={360} premountFor={fps}><Status/></Series.Sequence>
<Series.Sequence name="08 Personalize" durationInFrames={360} premountFor={fps}><Personalize/></Series.Sequence>
<Series.Sequence name="09 Home" durationInFrames={360} premountFor={fps}><Home/></Series.Sequence>
<Series.Sequence name="10 Modes" durationInFrames={360} premountFor={fps}><Modes/></Series.Sequence>
<Series.Sequence name="11 Privacy" durationInFrames={330} premountFor={fps}><Privacy/></Series.Sequence>
<Series.Sequence name="12 Closing" durationInFrames={300} premountFor={fps}><Closing/></Series.Sequence>
</Series><Audio src={staticFile('score.wav')} premountFor={fps} volume={.5}/></>};
const MotionStudy=()=> <Series><Series.Sequence durationInFrames={360}><Haptics/></Series.Sequence><Series.Sequence durationInFrames={360}><Modes/></Series.Sequence></Series>;
export const RemotionRoot=()=> <>
<Composition id="Motion-Study" component={MotionStudy} durationInFrames={720} fps={30} width={1920} height={1080}/>
<Composition id="SoundBridge-Film" component={Film} durationInFrames={4500} fps={30} width={1920} height={1080}/><Folder name="Scenes">
<Composition id="Opening" component={Opening} durationInFrames={360} fps={30} width={1920} height={1080}/>
<Composition id="Outdoors" component={Outdoors} durationInFrames={420} fps={30} width={1920} height={1080}/>
<Composition id="Response" component={Response} durationInFrames={360} fps={30} width={1920} height={1080}/>
<Composition id="Recognition" component={Recognition} durationInFrames={480} fps={30} width={1920} height={1080}/>
<Composition id="Haptics" component={Haptics} durationInFrames={360} fps={30} width={1920} height={1080}/>
<Composition id="Direction" component={Direction} durationInFrames={450} fps={30} width={1920} height={1080}/>
<Composition id="Status" component={Status} durationInFrames={360} fps={30} width={1920} height={1080}/>
<Composition id="Personalize" component={Personalize} durationInFrames={360} fps={30} width={1920} height={1080}/>
<Composition id="Home" component={Home} durationInFrames={360} fps={30} width={1920} height={1080}/>
<Composition id="Modes" component={Modes} durationInFrames={360} fps={30} width={1920} height={1080}/>
<Composition id="Privacy" component={Privacy} durationInFrames={330} fps={30} width={1920} height={1080}/>
<Composition id="Closing" component={Closing} durationInFrames={300} fps={30} width={1920} height={1080}/>
</Folder></>;

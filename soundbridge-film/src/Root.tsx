import {Composition,Folder,Series,staticFile,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {Opening} from './scenes/Opening';
import {Architecture} from './scenes/Architecture';
import {Recognition} from './scenes/Recognition';
import {Home} from './scenes/Home';
import {Conversation} from './scenes/Conversation';
import {Outdoors} from './scenes/Outdoors';
import {Haptics} from './scenes/Haptics';
import {Direction} from './scenes/Direction';
import {Personalize} from './scenes/Personalize';
import {Modes} from './scenes/Modes';
import {Privacy} from './scenes/Privacy';
import {Closing} from './scenes/Closing';
const Film=()=>{const {fps}=useVideoConfig();return <>
 <Series>
  <Series.Sequence name="01 Human connection" durationInFrames={360} premountFor={fps}><Opening/></Series.Sequence>
  <Series.Sequence name="02 On-watch architecture" durationInFrames={300} premountFor={fps}><Architecture/></Series.Sequence>
  <Series.Sequence name="03 Recognition pipeline" durationInFrames={480} premountFor={fps}><Recognition/></Series.Sequence>
  <Series.Sequence name="04 Doorbell" durationInFrames={360} premountFor={fps}><Home/></Series.Sequence>
  <Series.Sequence name="05 Conversation" durationInFrames={360} premountFor={fps}><Conversation/></Series.Sequence>
  <Series.Sequence name="06 Outdoors" durationInFrames={360} premountFor={fps}><Outdoors/></Series.Sequence>
  <Series.Sequence name="07 Haptic patterns" durationInFrames={360} premountFor={fps}><Haptics/></Series.Sequence>
  <Series.Sequence name="08 Direction estimation" durationInFrames={450} premountFor={fps}><Direction/></Series.Sequence>
  <Series.Sequence name="09 Personal preferences" durationInFrames={420} premountFor={fps}><Personalize/></Series.Sequence>
  <Series.Sequence name="10 Modes and pause" durationInFrames={360} premountFor={fps}><Modes/></Series.Sequence>
  <Series.Sequence name="11 Privacy" durationInFrames={390} premountFor={fps}><Privacy/></Series.Sequence>
  <Series.Sequence name="12 Human-centered closing" durationInFrames={300} premountFor={fps}><Closing/></Series.Sequence>
 </Series>
 <Audio src={staticFile('score.wav')} premountFor={fps} volume={.5}/>
 </>};
export const RemotionRoot=()=> <>
 <Composition id="SoundBridge-Film" component={Film} durationInFrames={4500} fps={30} width={1920} height={1080}/>
 <Folder name="Scenes">
 <Composition id="Opening" component={Opening} durationInFrames={360} fps={30} width={1920} height={1080}/>
 <Composition id="Architecture" component={Architecture} durationInFrames={300} fps={30} width={1920} height={1080}/>
 <Composition id="Recognition" component={Recognition} durationInFrames={480} fps={30} width={1920} height={1080}/>
 <Composition id="Home" component={Home} durationInFrames={360} fps={30} width={1920} height={1080}/>
 <Composition id="Conversation" component={Conversation} durationInFrames={360} fps={30} width={1920} height={1080}/>
 <Composition id="Outdoors" component={Outdoors} durationInFrames={360} fps={30} width={1920} height={1080}/>
 <Composition id="Haptics" component={Haptics} durationInFrames={360} fps={30} width={1920} height={1080}/>
 <Composition id="Direction" component={Direction} durationInFrames={450} fps={30} width={1920} height={1080}/>
 <Composition id="Personalize" component={Personalize} durationInFrames={420} fps={30} width={1920} height={1080}/>
 <Composition id="Modes" component={Modes} durationInFrames={360} fps={30} width={1920} height={1080}/>
 <Composition id="Privacy" component={Privacy} durationInFrames={390} fps={30} width={1920} height={1080}/>
 <Composition id="Closing" component={Closing} durationInFrames={300} fps={30} width={1920} height={1080}/>
 </Folder>
 </>;

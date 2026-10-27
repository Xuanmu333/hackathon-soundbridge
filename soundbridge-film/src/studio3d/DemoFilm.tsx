import {AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import script from '../script.json';
import {Experience} from './Experience';
import {ease, initialState, ViewState} from './state';

export const filmState = (seconds: number) => {
  const scene = script.find(c => seconds >= c.start && seconds < c.start + c.duration) ?? script[script.length - 1];
  const t = seconds - scene.start;
  const s: ViewState = {...initialState, time: Math.min(11, t), orbit: .09 * Math.sin(seconds * .08)};
  let picture: string | undefined;
  switch (scene.name) {
    case 'Opening': s.time = 0;s.orbit = -.2 + ease(t / 9) * .32;picture = 'safety/walking.png';break;
    case 'Outdoors': s.time = Math.min(11, t * .92);break;
    case 'Response': s.time = 10.5;picture = 'safety/observe.png';break;
    case 'Recognition': s.exploded = ease(t / 2);s.time = t < 4.2 ? 3.2 + t / 4.2 * 1.35 : t < 12.2 ? 4.6 + (t - 4.2) / 8 * 2.4 : 7.15 + t - 12.2;break;
    case 'Haptics': s.exploded = 1 - ease((t - 8.5) / 2.5);s.event = t >= 4.4 && t < 7.4 ? 'bell' : 'bike';s.time = 7.2 + (t < 4.4 ? t : t < 7.4 ? t - 4.4 : t - 7.4);break;
    case 'Direction': s.bearing = -115 + ease(t / 3) * 190;s.time = t < 3 ? 0 : t < 7.8 ? .7 + (t - 3) / 4.8 * 6.3 : 10;s.uncertain = t >= 7.8;break;
    case 'Status': s.mode = t < 4 ? 'low' : t < 8 ? 'paused' : 'fault';s.time = 0;break;
    case 'Personalize': s.strength = .3 + .6 * ease(t / 4);s.largeText = t > 6;s.time = t < 5 ? 7.2 + t : 10;break;
    case 'Home': s.event = 'bell';s.bearing = -70;s.time = t;break;
    case 'Modes': s.mode = t > 3 && t < 8.8 ? 'paused' : 'listening';s.time = t < 3 ? t : t > 8.8 ? t - 8.8 : 0;break;
    case 'Privacy': s.exploded = ease(t / 2) * (1 - ease((t - 7.5) / 2.5));s.time = 4.6 + Math.min(2.3, t / 4);break;
    case 'Closing': s.time = 0;s.orbit = .12 - ease(t / 8) * .2;picture = 'safety/friends.png';break;
  }
  const voice = scene.voice.find(v => t >= v.start && t < v.start + v.duration + .15);
  return {s, scene, picture, caption: voice ? {zh: voice.zh, en: voice.en} : undefined};
};

export const DemoFilm = () => {
  const frame = useCurrentFrame(), {fps, width} = useVideoConfig();
  const {s, scene, picture, caption} = filmState(frame / fps);
  return <AbsoluteFill style={{background: '#141716'}}>
    <div style={{width: 1600, height: 900, transform: `scale(${width / 1600})`, transformOrigin: 'top left'}}>
      <Experience s={s} film title={scene.title} subtitle={scene.en} chapter={`${String(script.indexOf(scene) + 1).padStart(2, '0')} / 12 — SAFETY, WITH YOU`} caption={caption} picture={picture ? staticFile(picture) : undefined}/>
    </div>
    <Audio src={staticFile('score.wav')} volume={.5}/>
    {script.flatMap(c => c.voice.map(v => <Sequence key={v.file} from={Math.round((c.start + v.start) * fps)} durationInFrames={Math.ceil(v.duration * fps)} layout="none"><Audio src={staticFile(v.file)}/></Sequence>))}
  </AbsoluteFill>;
};

export type SoundEvent = 'bike' | 'bell' | 'horn' | 'siren' | 'engine' | 'construction' | 'noise';
export type Mode = 'listening' | 'paused' | 'charging' | 'low' | 'fault';
export type ViewState = {
  event: SoundEvent; mode: Mode; bearing: number; strength: number;
  exploded: number; orbit: number; time: number; uncertain: boolean; largeText: boolean;
  directionPreview: boolean; faceView: number; bearingHighlight?: number; directionReady?: boolean; sourceBearing?: number; sourceRadius?: number; wristYaw?: number; wristTilt?: number; hapticTime?: number; componentFocus?: number; alertStage?: 'repeat'|'strong'|'viewing'|'confirmed';
};
export const initialState: ViewState = {
  event: 'bike', mode: 'listening', bearing: -115, strength: .65,
  exploded: 0, orbit: 0, time: 0, uncertain: false, largeText: false,
  directionPreview: false, faceView: 0,
};
export const events = {
  bike: {zh: '车铃', en: 'BICYCLE BELL', pattern: '三次短振', color: '#f3ba65'},
  bell: {zh: '门铃', en: 'DOORBELL', pattern: '两组双振', color: '#72e4cb'},
  horn: {zh: '鸣笛', en: 'VEHICLE HORN', pattern: '两次长振', color: '#f3ba65'},
  siren: {zh: '警笛', en: 'SIREN', pattern: '三次长振', color: '#f3ba65'},
  engine: {zh: '车辆运行声', en: 'VEHICLE SOUND', pattern: '两次短振', color: '#f3ba65'},
  construction: {zh: '施工声', en: 'CONSTRUCTION', pattern: '一长两短', color: '#f3ba65'},
  noise: {zh: '环境底噪', en: 'BACKGROUND', pattern: '不触发提醒', color: '#89938c'},
};
export const active = (s: ViewState) => s.mode === 'listening' || s.mode === 'low';
export const phase = (s: ViewState) => !active(s) ? -1 : s.time < .7 ? -1 : s.time < 3.2 ? 0 : s.time < 4.6 ? 1 : s.time < 7.1 ? 2 : 3;
export const ease = (x: number) => {const v = Math.max(0, Math.min(1, x)); return v * v * (3 - 2 * v);};
export type Feature = 'source' | 'bearing' | 'haptics' | 'structure' | 'text' | 'mode' | 'privacy';
export type Focus = Partial<Record<Feature, number>>;
export const featureNames: Record<Feature, string> = {source: '选择声音场景', bearing: '查看声源来向', haptics: '调整触觉提醒', structure: '展开内部结构', text: '调整表盘字号', mode: '控制监听状态', privacy: '本地处理'};
export const formatBearing = (value: number) => `${Math.round(value) > 0 ? '+' : ''}${Math.round(value)}°`;
export const bearingLabel = (value: number) => {
  const a = Math.abs(value), side = value < 0 ? '左' : '右';
  return a < 22.5 ? '正前方' : a < 67.5 ? `${side}前方` : a < 112.5 ? `${side}侧` : a < 157.5 ? `${side}后方` : '正后方';
};
export const microphones = [
  {id: 'M1', x: -.7, z: -.7}, {id: 'M2', x: .7, z: -.7},
  {id: 'M3', x: .7, z: .7}, {id: 'M4', x: -.7, z: .7},
];
// Concept geometry: a 3 m source and a 28 mm square array. Delays are visualized, not measured.
export const micArrivals = (bearing: number) => {
  const a = bearing * Math.PI / 180;
  const times = microphones.map(m => Math.hypot(Math.sin(a) * 3 - m.x * .02, -Math.cos(a) * 3 - m.z * .02) / 343 * 1e6);
  const first = Math.min(...times), span = Math.max(...times) - first;
  return microphones.map((m, i) => ({...m, delay: times[i] - first, fraction: span > 0 ? (times[i] - first) / span : 0}));
};
export const hapticPattern = (event: SoundEvent) => event === 'noise' ? [] : event === 'siren' ? [7.25,8.35,9.45].map(start=>({start,duration:.65})) : event === 'engine' ? [7.25,7.85].map(start=>({start,duration:.25})) : event === 'construction' ? [{start:7.25,duration:.65},{start:8.35,duration:.25},{start:8.95,duration:.25}] : event === 'horn'
  ? [{start:7.25,duration:.75},{start:8.45,duration:.75}]
  : (event === 'bell' ? [7.25,7.55,8.25,8.55] : [7.25,7.85,8.45]).map(start=>({start,duration:.25}));
export const hapticClock = (s: ViewState) => s.hapticTime ?? s.time;
export const followUpCue = (elapsed:number,acknowledged:boolean,eventPresent=true) => ({
 active:elapsed>=0&&elapsed<30&&!acknowledged&&eventPresent,
 clock:7.25+Math.max(0,elapsed)%4,
 strength:Math.min(.9,.65+Math.floor(Math.max(0,elapsed)/4)*.08),
});
export const haptic = (s: ViewState) => {
  if (!active(s)||s.alertStage==='confirmed') return 0;
  const time=hapticClock(s);
  return hapticPattern(s.event).reduce((v, beat) => Math.max(v, time >= beat.start && time < beat.start + beat.duration ? Math.sin((time - beat.start) / beat.duration * Math.PI) : 0), 0);
};

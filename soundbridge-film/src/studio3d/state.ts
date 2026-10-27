export type SoundEvent = 'bike' | 'bell' | 'horn';
export type Mode = 'listening' | 'paused' | 'charging' | 'low' | 'fault';
export type ViewState = {
  event: SoundEvent; mode: Mode; bearing: number; strength: number;
  exploded: number; orbit: number; time: number; uncertain: boolean; largeText: boolean;
};
export const initialState: ViewState = {
  event: 'bike', mode: 'listening', bearing: -115, strength: .65,
  exploded: 0, orbit: 0, time: 0, uncertain: false, largeText: false,
};
export const events = {
  bike: {zh: '车铃', en: 'BICYCLE BELL', pattern: '三次短振', color: '#f3ba65'},
  bell: {zh: '门铃', en: 'DOORBELL', pattern: '两组双振', color: '#72e4cb'},
  horn: {zh: '鸣笛', en: 'VEHICLE HORN', pattern: '三次短振', color: '#f3ba65'},
};
export const active = (s: ViewState) => s.mode === 'listening' || s.mode === 'low';
export const phase = (s: ViewState) => !active(s) ? -1 : s.time < .7 ? -1 : s.time < 3.2 ? 0 : s.time < 4.6 ? 1 : s.time < 7.1 ? 2 : 3;
export const ease = (x: number) => {const v = Math.max(0, Math.min(1, x)); return v * v * (3 - 2 * v);};
export const haptic = (s: ViewState) => {
  if (!active(s)) return 0;
  const starts = s.event === 'bell' ? [7.25, 7.55, 8.25, 8.55] : [7.25, 7.85, 8.45];
  return starts.reduce((v, t) => Math.max(v, s.time >= t && s.time < t + .25 ? Math.sin((s.time - t) / .25 * Math.PI) : 0), 0);
};

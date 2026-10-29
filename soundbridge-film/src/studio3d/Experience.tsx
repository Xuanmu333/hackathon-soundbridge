import React, {useLayoutEffect, useState} from 'react';
import {Canvas, useThree} from '@react-three/fiber';
import {Img} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {VSMShadowMap} from 'three';
import {active, bearingLabel, events, Feature, featureNames, Focus, formatBearing, micArrivals, phase, ViewState} from './state';
import {cameraPosition, project, sourcePosition, STAGE_H, STAGE_W, WatchWorld} from './WatchWorld';
import './studio.css';
import {RoadNarrative} from './RoadNarrative';

type Props = {s: ViewState; productOpacity?:number; roadChapter?: {name:string;index:number;reveal:number}; focus?: Focus; onFocusFeature?: (f: Feature) => void; film?: boolean; title?: string; subtitle?: string; chapter?: string; caption?: {zh: string; en: string}; picture?: string; onChange?: (p: Partial<ViewState>) => void; onTrigger?: () => void};
const stages = ['空间传播', '阵列接收', '本地识别', '触觉提醒'];
const stageEn = ['SOUND FIELD', 'ACQUISITION', 'ON-DEVICE AI', 'HAPTIC RESPONSE'];
const phaseDetail = ['声源发出 · 波前抵达手表', '多点收音 · 转换为数字信号', '提取特征 · 分类与置信度判断', '图标 + 文字 + 可区分振动'];
const CanvasSize = () => {
  const {set, setSize} = useThree();const [originalSetSize] = useState(() => setSize);
  useLayoutEffect(() => {originalSetSize(STAGE_W, STAGE_H);set({setSize: () => undefined});return () => set({setSize: originalSetSize});}, [set, originalSetSize]);
  return null;
};

const Label: React.FC<{point: [number, number, number]; orbit: number; faceView?: number; title: string; text: string; side?: 'left' | 'right'; color?: string; length?: number}> = ({point, orbit, faceView = 0, title, text, side = 'right', color = '#95b4b6', length = 36}) => {
  const position = project(point, orbit, faceView);
  return <div className={`sb-label ${side}`} style={{left: position.left, top: position.top, color}}><span className="anchor"/><div className="leader" style={{width: length}}/><div className="label-copy"><strong>{title}</strong><small>{text}</small></div></div>;
};

export const Experience: React.FC<Props> = ({s, productOpacity=1, roadChapter, focus = {}, onFocusFeature, film = false, title = '让重要的声音，被感知。', subtitle = 'FROM SOUND TO A SENSE OF SAFETY', chapter = '交互演示 / LIVE PRODUCT STUDY', caption, picture, onChange, onTrigger}) => {
  const focused = (Object.entries(focus).sort((a,b) => b[1]-a[1])[0] ?? ['source',0]) as [Feature, number];
  const highlight = (key: Feature): React.CSSProperties => ({background: `rgba(234,238,234,${(focus[key] ?? 0)*.11})`, boxShadow: `inset 3px 0 rgba(255,255,255,${focus[key] ?? 0})`, opacity: 1-focused[1]*.22+(focus[key] ?? 0)*.22});
  const select = (key: Feature, patch: Partial<ViewState>) => {onFocusFeature?.(key);onChange?.(patch);};
  const p = phase(s), event = events[s.event]; const canListen = active(s);const showSource=canListen&&(!roadChapter||(p>=0&&roadChapter.name!=='Personalize'));
  const modeText = s.mode === 'paused' ? '监听已暂停' : s.mode === 'charging' ? '正在充电' : s.mode === 'fault' ? '设备需检查' : s.mode === 'low' ? '低电量 · 感知中' : '环境感知开启';
  const canvasProps = {camera: {position: cameraPosition(s.orbit, s.faceView), fov: 32, near: .1, far: 100}, shadows: {type: VSMShadowMap}, dpr: 1.5, gl: {antialias: true, alpha: false}};
  return <div className="sb3d">
    <header><div className="brand"><div>SoundBridge<small>为听障人士设计的环境感知手表</small></div></div><div className="chapter">{chapter}</div><div className="prototype"><span/> CONCEPT / 概念样机</div></header>
    <div className="sb-heading"><h1>{title}</h1><p>{subtitle}</p></div>
    {roadChapter ? <RoadNarrative s={s} chapter={roadChapter.name} index={roadChapter.index} reveal={roadChapter.reveal}/> : <aside className="control-panel">
      <div className="control-focus" style={{opacity: .5 + focused[1]*.5}}><span>操作联动</span><strong>{focused[1] > .05 ? featureNames[focused[0]] : '选择功能，查看手表响应'}</strong></div>
      <div className="panel-head"><span className={`status-dot ${canListen ? 'on' : ''}`}/><strong>{modeText}</strong><span className="battery">{s.mode === 'low' ? '12' : '82'}% ▰</span></div>
      <div className="control-section" style={highlight('source')}><div className="section-label">场景声源 <span>SOURCE</span></div>
        <div className="event-buttons">{(['bike', 'bell', 'horn'] as const).map((id, i) => <button key={id} aria-pressed={s.event === id} className={s.event === id ? 'selected' : ''} onClick={() => select('source', {event: id, time: 0, directionPreview: false})}><span>{['◌', '⌂', '≋'][i]}</span>{events[id].zh}</button>)}</div>
        <button className="trigger" disabled={!canListen} onClick={() => {onFocusFeature?.('source');onTrigger?.();}}><span>◉</span> 发出{event.zh}<span>↗</span></button>
      </div><div className="control-section bearing-control" style={highlight('bearing')}>
        <div className="range-label"><label htmlFor="bearing">声源方位</label><b>{s.bearing > 0 ? '+' : ''}{Math.round(s.bearing)}°</b></div>
        <input id="bearing" type="range" min={-180} max={180} value={s.bearing} onChange={e => select('bearing', {bearing: Number(e.target.value), time: 10, directionPreview: true, uncertain: false, faceView: 1})}/>
        <div className="bearing-presets">{[-120,-45,60,135].map(v => <button key={v} aria-pressed={Math.abs(s.bearing-v)<2} className={Math.abs(s.bearing-v)<2 ? 'selected' : ''} onClick={() => select('bearing', {bearing:v,time:10,directionPreview:true,uncertain:false,faceView:1})}>{bearingLabel(v)}<b>{formatBearing(v)}</b></button>)}</div>
      </div>
      <div className="control-section" style={highlight('haptics')}><div className="section-label">触觉反馈 <span>HAPTICS</span></div><div className="range-label"><label htmlFor="strength">振动强度</label><b>{Math.round(s.strength * 100)}%</b></div><input id="strength" type="range" min={.15} max={1} step={.01} value={s.strength} onChange={e => select('haptics', {strength: Number(e.target.value), time: 7.15})}/><div className="pattern"><i style={{width:s.event==='horn'?36:undefined}}/><i style={{width:s.event==='horn'?36:undefined}}/>{s.event!=='horn'&&<i className={s.event === 'bell' ? 'four' : ''}/>}{s.event === 'bell' && <i/>}<span>{event.pattern}</span></div></div>
      <div className="control-section switches">
        <button className="toggle-row" style={highlight('structure')} aria-pressed={s.exploded > .5} onClick={() => select('structure', {exploded: s.exploded > .5 ? 0 : 1, faceView: s.exploded > .5 ? 0 : -1.1, directionPreview: false})}><span>展开内部结构<small>EXPLODED VIEW</small></span><i className={s.exploded > .5 ? 'checked' : ''}/></button>
        <button className="toggle-row" style={highlight('text')} aria-pressed={s.largeText} onClick={() => select('text', {largeText: !s.largeText, time:10})}><span>大字显示<small>ACCESSIBLE DISPLAY</small></span><i className={s.largeText ? 'checked' : ''}/></button>
      </div>
      <div className="mode-buttons" style={highlight('mode')}><button className={s.mode === 'paused' ? 'chosen' : ''} onClick={() => select('mode', {mode: s.mode === 'paused' ? 'listening' : 'paused', time: 0})}>{s.mode === 'paused' ? '▷ 恢复监听' : 'Ⅱ 暂停监听'}</button><button className={s.mode === 'charging' ? 'chosen' : ''} onClick={() => select('mode', {mode: s.mode === 'charging' ? 'listening' : 'charging', time: 0})}>ϟ 充电</button></div>
      <div className="privacy-note" style={highlight('privacy')}><span>⌾</span><div>声音在本地处理<small>不保存原始录音 · 由你掌控</small></div></div>
    </aside>}
    <div className="three-stage" style={{opacity:productOpacity}} onPointerDown={e => {if(!film) e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e => {if(e.buttons === 1 && !film) onChange?.({orbit: Math.max(-1.4, Math.min(1.4, s.orbit + e.movementX * .006))});}}>
      {film ? <ThreeCanvas {...canvasProps} width={STAGE_W} height={STAGE_H}><WatchWorld s={s} showSource={showSource}/></ThreeCanvas> : <Canvas {...canvasProps} style={{width: STAGE_W, height: STAGE_H}}><CanvasSize/><WatchWorld s={s} showSource={showSource}/></Canvas>}
      {showSource && <Label point={sourcePosition(s.bearing)} orbit={s.orbit} faceView={s.faceView} title={`${event.zh}声源`} text={p === 0 ? '声波正在传播' : 'SPATIAL SOUND SOURCE'} side="left" color={event.color}/>}
      {canListen && (s.directionPreview || p === 1) && micArrivals(s.bearing).map(m => <Label key={m.id} point={[m.x,1.4,m.z]} orbit={s.orbit} faceView={s.faceView} title={m.id} text={`${Math.round(m.delay)} μs`} side={m.x<0?'left':'right'} length={20} color={p === 1 && s.time >= 3.2+m.fraction*.85 ? '#f4e0b7' : '#a7b2b0'}/>)}
      {s.exploded > .15 && <div style={{opacity:Math.min(1,s.exploded*3)}}>
        <Label point={[.6,1.55+s.exploded*1.95,0]} orbit={s.orbit} faceView={s.faceView} title="曲面盖板玻璃" text="COVER GLASS" length={95}/>
        <Label point={[-.6,1.55+s.exploded*1.45,0]} orbit={s.orbit} faceView={s.faceView} title="显示模组" text="OLED DISPLAY" side="left" length={65}/>
        <Label point={[.2,1.4+s.exploded*.38,-.2]} orbit={s.orbit} faceView={s.faceView} title="处理电路" text="SIGNAL → FEATURES → CLASS" length={95}/>
        <Label point={[.42,1.355+s.exploded*.38,.4]} orbit={s.orbit} faceView={s.faceView} title="触觉马达" text={event.pattern} side="left" length={180}/>
      </div>}
      <div className="camera-controls"><button onClick={() => onChange?.({orbit: 0})}>◈ 产品视角</button><button onClick={() => onChange?.({orbit: -.65})}>◉ 侧面视角</button><span>{film ? '3D PRODUCT VISUALIZATION' : '拖动旋转产品'}</span></div>
    </div>
    <div className="scene-status"><span className={`status-dot ${canListen ? 'on' : ''}`}/><span>{p >= 0 ? roadChapter && p===3 ? '振动引起注意 · 表盘呈现类别与来向' : phaseDetail[p] : modeText}</span><small>{s.uncertain && p === 3 ? '方位不确定 · 仅提示类别' : '以表盘 12 点方向为 0° · 时差放大示意'}</small></div>
    {!picture && roadChapter?.name!=='Personalize' && !s.directionPreview && s.exploded < .15 && p >= 0 && <div className="signal-card"><div className="section-label">{['空间声场', '声音数字化', '识别与确认', '腕上反馈'][p]}<span>0{p + 1} / 04</span></div>
      <div className={`spectrum ${p > 1 ? 'features' : ''}`}>{Array.from({length: 28}, (_, i) => <i key={i} style={{height: 5 + Math.abs(Math.sin(i * .82 + s.time * (p < 3 ? 4 : 0))) * (15 + Math.sin(i * .35) * 12), background: p === 3 ? event.color : undefined}}/>)}</div>
      <strong>{p === 0 ? '声音具有空间来向' : p === 1 ? '短时采样 → 频谱特征' : p === 2 ? `${event.zh} / 候选类别` : `${event.zh} · ${event.pattern}`}</strong>
      <p>{p === 0 ? '声场扩散，抵达各个收音点' : p === 1 ? '收音阵列将声压变化转换为信号' : p === 2 ? '置信度筛选 · 连续确认 · 重复抑制' : s.uncertain ? '方向不确定，仅提供声音类别' : '提醒提供线索，接下来观察周围'}</p>
      {p === 2 && <div className="gate"><span>特征提取</span><b>→</b><span>分类</span><b>→</b><span>确认</span></div>}
    </div>}
    {canListen && s.directionPreview && <div className="signal-card mic-card"><div className="section-label">四路到达时间<span>MIC ARRAY</span></div>{micArrivals(s.bearing).map(m => <div className="mic-wave" key={m.id}><b>{m.id}</b><svg viewBox="0 0 130 30"><path d={Array.from({length:100},(_,i)=>{const x=i*1.3;const z=(x-35-m.fraction*40)/11;return `${i?'L':'M'}${x.toFixed(1)},${(15+Math.sin(z*4)*Math.exp(-z*z*.22)*11).toFixed(1)}`;}).join(' ')} fill="none" stroke={p===1 && s.time < 3.2+m.fraction*.85?'#66716a':'#dfc59e'} strokeWidth="1.5"/></svg><span>+{Math.round(m.delay)} μs</span></div>)}<p>相对最先到达的信号 · 时差放大示意</p><strong>{s.uncertain?'来向不明确 · 仅提示类别':p<2?'依次接收同一次声音':`${formatBearing(s.bearing)} · ${bearingLabel(s.bearing)}`}</strong><p>四路时差 → 来向估算 → 表盘指示</p></div>}
    {picture && <div className="human-window"><Img src={picture}/><span>观察周围，自主决定。</span></div>}
    <div className="pipeline">{stages.map((label, i) => <React.Fragment key={label}><div className={`pipeline-step ${p === i ? 'current' : ''} ${p > i ? 'complete' : ''}`}><b>{p > i ? '✓' : `0${i + 1}`}</b><div><strong>{label}</strong><small>{stageEn[i]}</small></div></div>{i < 3 && <div className={`pipeline-line ${p > i ? 'complete' : ''}`}/>}</React.Fragment>)}</div>
    <footer>{caption ? <div className="film-captions"><strong>{caption.zh}</strong><span>{caption.en}</span></div> : film ? null : <><span>为聋人和重听人士设计 · 感知环境，自主行动</span><span>声音、来向与内部结构均为概念演示。</span></>}</footer>
  </div>;
};

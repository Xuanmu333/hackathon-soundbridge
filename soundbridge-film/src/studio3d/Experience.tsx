import React, {useLayoutEffect, useState} from 'react';
import {Canvas, useThree} from '@react-three/fiber';
import {Img} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {VSMShadowMap} from 'three';
import {active, events, phase, ViewState} from './state';
import {cameraPosition, project, sourcePosition, STAGE_H, STAGE_W, WatchWorld} from './WatchWorld';
import './studio.css';

type Props = {s: ViewState; film?: boolean; title?: string; subtitle?: string; chapter?: string; caption?: {zh: string; en: string}; picture?: string; onChange?: (p: Partial<ViewState>) => void; onTrigger?: () => void};
const stages = ['空间传播', '阵列接收', '本地识别', '触觉提醒'];
const stageEn = ['SOUND FIELD', 'ACQUISITION', 'ON-DEVICE AI', 'HAPTIC RESPONSE'];
const phaseDetail = ['声源发出 · 波前抵达手表', '多点收音 · 转换为数字信号', '提取特征 · 分类与置信度判断', '图标 + 文字 + 可区分振动'];
const CanvasSize = () => {
  const {set, setSize} = useThree();const [originalSetSize] = useState(() => setSize);
  useLayoutEffect(() => {originalSetSize(STAGE_W, STAGE_H);set({setSize: () => undefined});return () => set({setSize: originalSetSize});}, [set, originalSetSize]);
  return null;
};

const Label: React.FC<{point: [number, number, number]; orbit: number; title: string; text: string; side?: 'left' | 'right'; color?: string; length?: number}> = ({point, orbit, title, text, side = 'right', color = '#95b4b6', length = 36}) => {
  const position = project(point, orbit);
  return <div className={`sb-label ${side}`} style={{left: position.left, top: position.top, color}}><span className="anchor"/><div className="leader" style={{width: length}}/><div className="label-copy"><strong>{title}</strong><small>{text}</small></div></div>;
};

export const Experience: React.FC<Props> = ({s, film = false, title = '让重要的声音，被感知。', subtitle = 'FROM SOUND TO A SENSE OF SAFETY', chapter = '交互演示 / LIVE PRODUCT STUDY', caption, picture, onChange, onTrigger}) => {
  const p = phase(s), event = events[s.event]; const canListen = active(s);
  const modeText = s.mode === 'paused' ? '监听已暂停' : s.mode === 'charging' ? '正在充电' : s.mode === 'fault' ? '设备需检查' : s.mode === 'low' ? '低电量 · 感知中' : '环境感知开启';
  const canvasProps = {camera: {position: cameraPosition(s.orbit), fov: 32, near: .1, far: 100}, shadows: {type: VSMShadowMap}, dpr: 1.5, gl: {antialias: true, alpha: false}};
  return <div className="sb3d">
    <header><div className="brand"><span className="brand-mark">s<span>b</span></span><div>SoundBridge<small>让安全感，触手可及</small></div></div><div className="chapter">{chapter}</div><div className="prototype"><span/> CONCEPT / 概念样机</div></header>
    <div className="sb-heading"><h1>{title}</h1><p>{subtitle}</p></div>
    <aside className="control-panel">
      <div className="panel-head"><span className={`status-dot ${canListen ? 'on' : ''}`}/><strong>{modeText}</strong><span className="battery">{s.mode === 'low' ? '12' : '82'}% ▰</span></div>
      <div className="control-section"><div className="section-label">场景声源 <span>SOURCE</span></div>
        <div className="event-buttons">{(['bike', 'bell', 'horn'] as const).map((id, i) => <button key={id} aria-pressed={s.event === id} className={s.event === id ? 'selected' : ''} onClick={() => onChange?.({event: id, time: 0})}><span>{['◌', '⌂', '≋'][i]}</span>{events[id].zh}</button>)}</div>
        <button className="trigger" disabled={!canListen} onClick={onTrigger}><span>◉</span> 发出{event.zh}<span>↗</span></button>
        <div className="range-label"><label htmlFor="bearing">声源方位</label><b>{s.bearing > 0 ? '+' : ''}{Math.round(s.bearing)}°</b></div>
        <input id="bearing" type="range" min={-180} max={180} value={s.bearing} onChange={e => onChange?.({bearing: Number(e.target.value), time: 0})}/>
        <div className="range-ends"><span>−180°</span><span>0° 前方</span><span>+180°</span></div>
      </div>
      <div className="control-section"><div className="section-label">触觉反馈 <span>HAPTICS</span></div><div className="range-label"><label htmlFor="strength">振动强度</label><b>{Math.round(s.strength * 100)}%</b></div><input id="strength" type="range" min={.15} max={1} step={.01} value={s.strength} onChange={e => onChange?.({strength: Number(e.target.value), time: 7.15})}/><div className="pattern"><i/><i/><i className={s.event === 'bell' ? 'four' : ''}/>{s.event === 'bell' && <i/>}<span>{event.pattern}</span></div></div>
      <div className="control-section switches">
        <button className="toggle-row" aria-pressed={s.exploded > .5} onClick={() => onChange?.({exploded: s.exploded > .5 ? 0 : 1})}><span>展开内部结构<small>EXPLODED VIEW</small></span><i className={s.exploded > .5 ? 'checked' : ''}/></button>
        <button className="toggle-row" aria-pressed={s.largeText} onClick={() => onChange?.({largeText: !s.largeText})}><span>大字显示<small>ACCESSIBLE DISPLAY</small></span><i className={s.largeText ? 'checked' : ''}/></button>
      </div>
      <div className="mode-buttons"><button className={s.mode === 'paused' ? 'chosen' : ''} onClick={() => onChange?.({mode: s.mode === 'paused' ? 'listening' : 'paused', time: 0})}>{s.mode === 'paused' ? '▷ 恢复监听' : 'Ⅱ 暂停监听'}</button><button className={s.mode === 'charging' ? 'chosen' : ''} onClick={() => onChange?.({mode: s.mode === 'charging' ? 'listening' : 'charging', time: 0})}>ϟ 充电</button></div>
      <div className="privacy-note"><span>⌾</span><div>声音在本地处理<small>不保存原始录音 · 由你掌控</small></div></div>
    </aside>
    <div className="three-stage" onPointerDown={e => {if(!film) e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e => {if(e.buttons === 1 && !film) onChange?.({orbit: Math.max(-1.4, Math.min(1.4, s.orbit + e.movementX * .006))});}}>
      {film ? <ThreeCanvas {...canvasProps} width={STAGE_W} height={STAGE_H}><WatchWorld s={s}/></ThreeCanvas> : <Canvas {...canvasProps} style={{width: STAGE_W, height: STAGE_H}}><CanvasSize/><WatchWorld s={s}/></Canvas>}
      {canListen && <Label point={sourcePosition(s.bearing)} orbit={s.orbit} title={`${event.zh}声源`} text={p === 0 ? '声波正在传播' : 'SPATIAL SOUND SOURCE'} side="left" color={event.color}/>}
      {s.exploded < .5 ? <Label point={[.7, 1.39, -.7]} orbit={s.orbit} title="环形收音阵列" text={p === 1 ? '声音已抵达 · 接收中' : '接收周围的声音线索'} color={p === 1 ? '#8be8d1' : undefined}/> : <>
        <Label point={[0, 1.35 + s.exploded * .74, 0]} orbit={s.orbit} length={85} title="端侧识别单元" text={p === 2 ? '特征提取 → 分类 → 门控' : 'ON-DEVICE PROCESSING'}/>
        <Label point={[.42, 1.3 + s.exploded * .74, .4]} orbit={s.orbit} length={90} title="触觉执行器" text={event.pattern} side="left" color={event.color}/>
      </>}
      <div className="camera-controls"><button onClick={() => onChange?.({orbit: 0})}>◈ 产品视角</button><button onClick={() => onChange?.({orbit: -.65})}>◉ 侧面视角</button><span>{film ? '3D PRODUCT VISUALIZATION' : '拖动旋转产品'}</span></div>
    </div>
    <div className="scene-status"><span className={`status-dot ${canListen ? 'on' : ''}`}/><span>{p >= 0 ? phaseDetail[p] : modeText}</span><small>{s.uncertain && p === 3 ? '方位不确定 · 仅提示类别' : '空间与时间经放大展示 · 非实测参数'}</small></div>
    {!picture && p >= 0 && <div className="signal-card"><div className="section-label">{['空间声场', '声音数字化', '识别与确认', '腕上反馈'][p]}<span>0{p + 1} / 04</span></div>
      <div className={`spectrum ${p > 1 ? 'features' : ''}`}>{Array.from({length: 28}, (_, i) => <i key={i} style={{height: 5 + Math.abs(Math.sin(i * .82 + s.time * (p < 3 ? 4 : 0))) * (15 + Math.sin(i * .35) * 12), background: p === 3 ? event.color : undefined}}/>)}</div>
      <strong>{p === 0 ? '声音具有空间来向' : p === 1 ? '短时采样 → 频谱特征' : p === 2 ? `${event.zh} / 候选类别` : `${event.zh} · ${event.pattern}`}</strong>
      <p>{p === 0 ? '声场扩散，抵达各个收音点' : p === 1 ? '收音阵列将声压变化转换为信号' : p === 2 ? '置信度筛选 · 连续确认 · 重复抑制' : s.uncertain ? '方向不确定，仅提供声音类别' : '提醒提供线索，接下来观察周围'}</p>
      {p === 2 && <div className="gate"><span>特征提取</span><b>→</b><span>分类</span><b>→</b><span>确认</span></div>}
    </div>}
    {picture && <div className="human-window"><Img src={picture}/><span>观察周围，自主决定。</span></div>}
    <div className="pipeline">{stages.map((label, i) => <React.Fragment key={label}><div className={`pipeline-step ${p === i ? 'current' : ''} ${p > i ? 'complete' : ''}`}><b>{p > i ? '✓' : `0${i + 1}`}</b><div><strong>{label}</strong><small>{stageEn[i]}</small></div></div>{i < 3 && <div className={`pipeline-line ${p > i ? 'complete' : ''}`}/>}</React.Fragment>)}</div>
    <footer>{caption ? <div className="film-captions"><strong>{caption.zh}</strong><span>{caption.en}</span></div> : film ? null : <><span>为聋人和重听人士设计 · 感知环境，自主行动</span><span>交互与硬件架构示意；识别、方位和触觉性能待实测验证。</span></>}</footer>
  </div>;
};

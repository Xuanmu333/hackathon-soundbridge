import React, {useEffect, useLayoutEffect, useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {active, bearingLabel, events, formatBearing, haptic, micArrivals, phase, ViewState} from './state';

export const STAGE_W = 1220;
export const STAGE_H = 650;
export const cameraPosition = (orbit: number, faceView = 0): [number, number, number] => [Math.sin(.36 + orbit) * (7.8 - Math.max(0,faceView) * 2.5), 9 + faceView * 1.8, Math.cos(.36 + orbit) * (7.8 - Math.max(0,faceView) * 2.5)];
export const sourcePosition = (bearing: number): [number, number, number] => [Math.sin(bearing * Math.PI / 180) * 2.7, 1.2, -Math.cos(bearing * Math.PI / 180) * 2.7];
export const project = (point: [number, number, number], orbit: number, faceView = 0) => {
  const c = new THREE.PerspectiveCamera(32, STAGE_W / STAGE_H, .1, 100);
  c.position.set(...cameraPosition(orbit, faceView)); c.lookAt(-.35, 1.05, 0); c.updateMatrixWorld();
  const p = new THREE.Vector3(...point).project(c);
  return {left: (p.x + 1) * STAGE_W / 2, top: (1 - p.y) * STAGE_H / 2};
};

const Environment: React.FC<{orbit: number; faceView: number}> = ({orbit, faceView}) => {
  const {gl, scene, camera} = useThree();
  useLayoutEffect(() => {camera.position.set(...cameraPosition(orbit, faceView)); camera.lookAt(-.35, 1.05, 0); camera.updateMatrixWorld();}, [camera, orbit, faceView]);
  useLayoutEffect(() => {
    const room = new THREE.Scene();room.background = new THREE.Color('#08090a');
    const panels: [number[], number[], number[]][] = [
      [[-3, 4, 3], [1.5, 6], [5, 4.8, 4.6]],
      [[3, 3, -2], [.8, 5], [5, 5, 5]],
      [[0, 5, 1], [5, .45], [3, 3, 3]],
      [[-2.5, 5, -5], [4, 2], [3, 3, 3]],
      [[-3, 1, -3], [4, 3], [2.2, .015, .06]],
    ];
    const lights = panels.map(([position, size, color]) => {const panel = new THREE.Mesh(new THREE.PlaneGeometry(size[0], size[1]), new THREE.MeshBasicMaterial({color: new THREE.Color(color[0], color[1], color[2]), side: THREE.DoubleSide}));panel.position.set(position[0], position[1], position[2]);panel.lookAt(0, 0, 0);room.add(panel);return panel;});
    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(room, .015); scene.environment = target.texture;
    scene.environmentIntensity = 1.2;
    return () => {scene.environment = null; target.dispose(); pmrem.dispose(); lights.forEach(m => {m.geometry.dispose();m.material.dispose();});};
  }, [gl, scene]);
  return null;
};

const Floor = () => {
  const reflector = useMemo(() => {
    const mirror = new Reflector(new THREE.PlaneGeometry(40, 40), {color: 0x737f83, textureWidth: 1536, textureHeight: 768});
    const material = mirror.material as THREE.ShaderMaterial;
    material.vertexShader = material.vertexShader.replace('varying vec4 vUv;', 'varying vec4 vUv; varying vec3 vFloorWorld;').replace('vUv = textureMatrix * vec4( position, 1.0 );', 'vUv = textureMatrix * vec4( position, 1.0 ); vFloorWorld = (modelMatrix * vec4(position, 1.0)).xyz;');
    material.fragmentShader = material.fragmentShader.replace('varying vec4 vUv;', 'varying vec4 vUv; varying vec3 vFloorWorld;').replace('vec4 base = texture2DProj( tDiffuse, vUv );', 'float distanceFromWatch=length(vFloorWorld.xz);float blur=(0.00035+distanceFromWatch*0.0006)*vUv.w;vec4 base=texture2DProj(tDiffuse,vUv)*0.4; base+=texture2DProj(tDiffuse,vUv+vec4(blur,0.0,0.0,0.0))*0.15; base+=texture2DProj(tDiffuse,vUv+vec4(-blur,0.0,0.0,0.0))*0.15; base+=texture2DProj(tDiffuse,vUv+vec4(0.0,blur,0.0,0.0))*0.15; base+=texture2DProj(tDiffuse,vUv+vec4(0.0,-blur,0.0,0.0))*0.15;').replace('vec4( blendOverlay( base.rgb, color ), 1.0 )', 'vec4( mix(vec3(0.00699, 0.0086, 0.0080), base.rgb, 0.32*exp(-0.06*distanceFromWatch*distanceFromWatch)), 1.0 )');
    mirror.rotation.x = -Math.PI / 2; mirror.position.y = -.255; return mirror;
  }, []);
  useEffect(() => () => {reflector.dispose(); reflector.geometry.dispose();}, [reflector]);
  return <><primitive object={reflector}/><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.25, 0]} receiveShadow><planeGeometry args={[40, 40]}/><shadowMaterial transparent opacity={.22}/></mesh></>;
};

const Atmosphere = () => {
  const texture = useMemo(() => {
    const c = document.createElement('canvas');c.width = c.height = 256;
    const ctx = c.getContext('2d')!;const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 126);
    g.addColorStop(0, 'rgba(188,15,40,0.72)');g.addColorStop(.35, 'rgba(158,8,29,0.45)');g.addColorStop(1, 'rgba(80,0,15,0)');ctx.fillStyle = g;ctx.fillRect(0, 0, 256, 256);
    const map = new THREE.CanvasTexture(c);map.colorSpace = THREE.SRGBColorSpace;return map;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <sprite position={[0, 1.2, -1.8]} scale={[8.5, 5.8, 1]}><spriteMaterial map={texture} transparent opacity={.32} blending={THREE.AdditiveBlending} depthWrite={false}/></sprite>;
};

const Case: React.FC = () => {
  const geometry = useMemo(() => {
    const profile = new THREE.Path();profile.moveTo(0, -.28).lineTo(.93, -.28).quadraticCurveTo(1.055, -.28, 1.07, -.17).lineTo(1.07, -.07).quadraticCurveTo(1.07, .065, .99, .075).lineTo(.93, .075).lineTo(.93, -.19).lineTo(0, -.19);
    return new THREE.LatheGeometry(profile.getPoints(28), 128);
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <><mesh geometry={geometry} castShadow><meshPhysicalMaterial color="#b00a24" metalness={.55} roughness={.22} clearcoat={1} clearcoatRoughness={.07}/></mesh><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.185, 0]}><circleGeometry args={[.925, 96]}/><meshStandardMaterial color="#0b0e0e" roughness={.42} metalness={.45}/></mesh></>;
};

const RoundedPart: React.FC<{size: [number, number, number]; position: [number, number, number]; color: string}> = ({size, position, color}) => {
  const [w, h, d] = size;
  const geometry = useMemo(() => new RoundedBoxGeometry(w, h, d, 4, Math.min(w, h, d) * .35), [w, h, d]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} position={position} castShadow><meshPhysicalMaterial color={color} metalness={.8} roughness={.22} clearcoat={.9}/></mesh>;
};

const CoverGlass = () => {
  const geometry = useMemo(() => {const p = new THREE.Path();p.moveTo(0, .052).lineTo(.84, .052).quadraticCurveTo(.955, .052, .96, .005).lineTo(.96, -.02).lineTo(0, -.02);return new THREE.LatheGeometry(p.getPoints(24), 128);}, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry}><meshPhysicalMaterial color="#f1f4f6" transmission={.92} thickness={.06} ior={1.5} roughness={.035} metalness={0} clearcoat={1} clearcoatRoughness={.03} envMapIntensity={1.4} depthWrite={false}/></mesh>;
};

const strapGeometry = (sign: number) => {
  const positions: number[] = [], indices: number[] = [], uvs: number[] = [];
  const rows = 38, sides = 24, r = 1.42;
  for (let j = 0; j <= rows; j++) {
    const a = j / rows * 1.72;
    for (let k = 0; k <= sides; k++) {
      const u = k / sides * Math.PI * 2;
      const x = Math.sign(Math.cos(u)) * Math.pow(Math.abs(Math.cos(u)), .32) * .54;
      const n = Math.sign(Math.sin(u)) * Math.pow(Math.abs(Math.sin(u)), .32) * .075;
      positions.push(x, -r * (1 - Math.cos(a)) + n * Math.cos(a), sign * (1.02 + r * Math.sin(a) + n * Math.sin(a)));
      uvs.push(k / sides, j / rows);
      if (j < rows && k < sides) {const v = j * (sides + 1) + k; indices.push(v, v + 1, v + sides + 1, v + 1, v + sides + 2, v + sides + 1);}
    }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); g.setIndex(indices); g.computeVertexNormals(); return g;
};
const Strap: React.FC<{sign: number}> = ({sign}) => {
  const geometry = useMemo(() => strapGeometry(sign), [sign]);
  const grain = useMemo(() => {const size = 128, data = new Uint8Array(size * size * 4);for(let i = 0; i < size * size; i++){const n = 115 + ((i * 1664525 + 1013904223) >>> 16) % 27;data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = n;data[i * 4 + 3] = 255;}const t = new THREE.DataTexture(data, size, size);t.wrapS = t.wrapT = THREE.RepeatWrapping;t.repeat.set(5, 8);t.needsUpdate = true;return t;}, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => grain.dispose(), [grain]);
  return <group>
    <mesh geometry={geometry} castShadow><meshPhysicalMaterial color="#4a1119" roughness={.67} metalness={0} specularIntensity={.25} envMapIntensity={.3} bumpMap={grain} bumpScale={.012} side={THREE.DoubleSide}/></mesh>
    {[-1, 1].flatMap(x => Array.from({length: 24}, (_, i) => {const a = .12 + i * .065;return <mesh key={`${x}${i}`} position={[x * .47, -1.42 * (1 - Math.cos(a)) + .077 * Math.cos(a), sign * (1.02 + 1.42 * Math.sin(a) + .077 * Math.sin(a))]} rotation={[-sign * a, 0, 0]}><boxGeometry args={[.014, .006, .048]}/><meshStandardMaterial color="#6a2732" roughness={.9}/></mesh>;}))}
    {sign === 1 && [0, 1, 2, 3, 4].map(i => {const a = .55 + i * .17;return <mesh key={i} position={[0, -1.42 * (1 - Math.cos(a)) + .082 * Math.cos(a), 1.02 + 1.42 * Math.sin(a) + .082 * Math.sin(a)]} rotation={[-a, 0, 0]}><boxGeometry args={[.15, .012, .08]}/><meshStandardMaterial color="#22070c"/></mesh>;})}
  </group>;
};

const Face: React.FC<{s: ViewState}> = ({s}) => {
  const p = phase(s); const event = events[s.event];const {mode, largeText, uncertain, bearing} = s;
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 768;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(384, 220, 0, 384, 384, 500); grad.addColorStop(0, '#202828'); grad.addColorStop(1, '#050808');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 768, 768);
    ctx.textAlign = 'center';
    if ((p === 3) && (mode === 'listening' || mode === 'low')) {
      const color = uncertain ? '#9aa6a2' : event.color;
      ctx.strokeStyle = '#52615c';ctx.lineWidth = 2;
      for(let i=0;i<36;i++){const a=i*Math.PI/18;const r=i%3===0?297:305;ctx.beginPath();ctx.moveTo(384+Math.sin(a)*r,384-Math.cos(a)*r);ctx.lineTo(384+Math.sin(a)*315,384-Math.cos(a)*315);ctx.stroke();}
      ctx.fillStyle='#90a099';ctx.font='23px Helvetica';ctx.fillText('0°',384,80);ctx.fillText('180°',384,704);
      ctx.save();ctx.translate(94,384);ctx.rotate(-Math.PI/2);ctx.fillText('−90°',0,0);ctx.restore();
      ctx.save();ctx.translate(674,384);ctx.rotate(Math.PI/2);ctx.fillText('+90°',0,0);ctx.restore();
      ctx.fillStyle='#a9b6b0';ctx.font='22px Helvetica';ctx.fillText('S O U N D B R I D G E',384,153);
      ctx.fillStyle=color;ctx.font=`500 ${largeText?56:42}px "PingFang SC",sans-serif`;ctx.fillText(event.zh,384,238);
      ctx.save();ctx.translate(280,220);ctx.scale(.6,.6);ctx.strokeStyle=color;ctx.lineWidth=5;ctx.lineCap='round';
      if(event===events.bike){
        for(const x of [-31,31]){ctx.beginPath();ctx.arc(x,14,18,0,Math.PI*2);ctx.stroke();}
        ctx.beginPath();ctx.moveTo(-31,14);ctx.lineTo(-14,-19);ctx.lineTo(10,14);ctx.lineTo(-31,14);ctx.lineTo(19,-19);ctx.lineTo(31,14);ctx.moveTo(19,-19);ctx.lineTo(16,-31);ctx.lineTo(30,-31);ctx.moveTo(-23,-19);ctx.lineTo(-5,-19);ctx.stroke();
      }else if(event===events.horn){
        ctx.beginPath();ctx.moveTo(-35,-12);ctx.lineTo(-17,-12);ctx.lineTo(8,-30);ctx.lineTo(8,29);ctx.lineTo(-17,11);ctx.lineTo(-35,11);ctx.closePath();ctx.stroke();
        for(const r of [18,31]){ctx.beginPath();ctx.arc(10,0,r,-.7,.7);ctx.stroke();}
      }
      ctx.restore();
      ctx.fillStyle='#f4f7f4';ctx.font=uncertain?'500 49px "PingFang SC",sans-serif':'500 94px Helvetica';ctx.fillText(uncertain?'方向不确定':formatBearing(bearing),384,388);
      ctx.fillStyle=color;ctx.font=`500 ${largeText?48:39}px "PingFang SC",sans-serif`;ctx.fillText(uncertain?'仅提示声音类别':`约 · ${bearingLabel(bearing)}`,384,456);
      ctx.fillStyle='#9caea4';ctx.font='24px "PingFang SC",sans-serif';ctx.fillText('相对表盘 12 点方向',384,514);
      ctx.fillStyle='#e2ebe4';ctx.font='29px "PingFang SC",sans-serif';ctx.fillText('请观察周围',384,583);
      ctx.fillStyle='#7f9187';ctx.font='21px "PingFang SC",sans-serif';ctx.fillText('来向概念示意',384,631);
      if(!uncertain){const a=bearing*Math.PI/180-Math.PI/2;ctx.strokeStyle=color;ctx.lineWidth=9;ctx.beginPath();ctx.arc(384,384,332,a-.19,a+.19);ctx.stroke();ctx.save();ctx.translate(384,384);ctx.rotate(a);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(289,0);ctx.lineTo(264,-12);ctx.lineTo(264,12);ctx.closePath();ctx.fill();ctx.restore();}
    } else {
    ctx.textAlign = 'center'; ctx.fillStyle = '#9bb4b7'; ctx.font = '26px Helvetica';ctx.fillText('S O U N D B R I D G E', 384, 136);
    ctx.fillStyle = '#f4faf8'; ctx.font = '500 76px Helvetica';ctx.fillText('10:24', 384, 238);
    const label = mode === 'paused' ? '监听已暂停' : mode === 'charging' ? '充电中 · 82%' : mode === 'fault' ? '请检查设备' : p === 3 ? event.zh : p === 2 ? '正在识别' : p === 1 ? '声音已接收' : mode === 'low' ? '低电量 · 12%' : '环境感知中';
    const color = (mode !== 'listening' && mode !== 'low') ? '#9ba8ad' : p === 3 ? event.color : '#72e4cb';
    ctx.strokeStyle = color;ctx.lineWidth = 5;ctx.beginPath();ctx.arc(384, 385, 70, 0, Math.PI * 2);ctx.stroke();
    ctx.lineWidth = 8;ctx.lineCap = 'round';
    if(mode === 'paused') {ctx.beginPath();ctx.moveTo(366, 356);ctx.lineTo(366, 414);ctx.moveTo(402, 356);ctx.lineTo(402, 414);ctx.stroke();}
    else if(p === 3 && event === events.bike) {
      ctx.lineWidth = 5;ctx.beginPath();ctx.arc(350, 404, 22, 0, Math.PI * 2);ctx.stroke();ctx.beginPath();ctx.arc(420, 404, 22, 0, Math.PI * 2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(350, 404);ctx.lineTo(369, 365);ctx.lineTo(397, 404);ctx.lineTo(350, 404);ctx.lineTo(405, 365);ctx.lineTo(420, 404);ctx.moveTo(405, 365);ctx.lineTo(401, 350);ctx.lineTo(419, 350);ctx.moveTo(359, 365);ctx.lineTo(380, 365);ctx.stroke();
    } else if(p === 3 && event === events.bell) {
      ctx.lineWidth = 6;ctx.beginPath();ctx.moveTo(349, 410);ctx.lineTo(357, 396);ctx.lineTo(357, 374);ctx.bezierCurveTo(357, 339, 411, 339, 411, 374);ctx.lineTo(411, 396);ctx.lineTo(419, 410);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(384, 421, 9, 0, Math.PI);ctx.stroke();
    } else if(p === 3 && event === events.horn) {
      ctx.lineWidth = 6;ctx.beginPath();ctx.moveTo(348, 374);ctx.lineTo(369, 374);ctx.lineTo(400, 352);ctx.lineTo(400, 418);ctx.lineTo(369, 397);ctx.lineTo(348, 397);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(401, 385, 25, -.7, .7);ctx.stroke();ctx.beginPath();ctx.arc(401, 385, 39, -.7, .7);ctx.stroke();
    }
    else {for(let i = -2; i <= 2; i++){const h = [16, 34, 50, 34, 16][i + 2];ctx.beginPath();ctx.moveTo(384 + i * 20, 385 - h / 2);ctx.lineTo(384 + i * 20, 385 + h / 2);ctx.stroke();}}
    ctx.fillStyle = '#f5faf9';ctx.font = `500 ${largeText ? 57 : 46}px "PingFang SC", sans-serif`;ctx.fillText(label, 384, 532);
    ctx.fillStyle = '#9bb4b7';ctx.font = '28px "PingFang SC", sans-serif';ctx.fillText(p === 3 ? '请观察周围' : mode === 'paused' ? '由你决定何时开启' : mode === 'fault' ? '感知不可用' : '本地处理 · 自主掌控', 384, 593);
    if(p === 3 && !uncertain) {ctx.strokeStyle = color;ctx.lineWidth = 10;ctx.beginPath();const a = bearing * Math.PI / 180 - Math.PI / 2;ctx.arc(384, 384, 343, a - .42, a + .42);ctx.stroke();}
    }
    const map = new THREE.CanvasTexture(canvas);map.colorSpace = THREE.SRGBColorSpace;map.anisotropy = 8;return map;
  }, [p, mode, largeText, uncertain, bearing, event]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.91, 96]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
};

const Trace: React.FC<{points: [number, number, number][]; color?: string; glow?: boolean}> = ({points, color = '#4b8983', glow = false}) => {
  const geometry = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), 20, glow ? .014 : .008, 5, false), [points, glow]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry}><meshStandardMaterial color={color} emissive={color} emissiveIntensity={glow ? 2 : .15}/></mesh>;
};

const Watch: React.FC<{s: ViewState}> = ({s}) => {
  const p = phase(s), pulse = haptic(s), e = s.exploded;
  const shake = Math.sin(s.time * 100) * pulse * s.strength * .025;
  return <group position={[shake, 1.4, 0]}>
    <Strap sign={1}/><Strap sign={-1}/>
    {[-1, 1].flatMap(x => [-1, 1].map(z => <RoundedPart key={`${x}${z}`} position={[x * .56, -.05, z * .9]} size={[.15, .27, .45]} color="#87051b"/>))}
    <Case/>
    <mesh position={[0,-.17,0]} castShadow><boxGeometry args={[1.03,.06,.68]}/><meshStandardMaterial color="#767a7b" metalness={.8} roughness={.45}/></mesh>
    {[-1,1].flatMap(x=>[-1,1].map(z=><group key={`screw${x}${z}`} position={[x*.59,-.12,z*.55]}><mesh><cylinderGeometry args={[.038,.038,.025,16]}/><meshStandardMaterial color="#b2b6b7" metalness={1} roughness={.3}/></mesh><mesh position={[0,.014,0]}><boxGeometry args={[.04,.002,.009]}/><meshBasicMaterial color="#2d3333"/></mesh></group>))}

    <mesh position={[0, .025, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.99, .047, 12, 96]}/><meshStandardMaterial color="#cf2c44" metalness={.85} roughness={.18}/></mesh>
    <mesh position={[1.065, -.065, .12]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[.145, .145, .17, 48]}/><meshStandardMaterial color="#38282d" metalness={1} roughness={.25}/></mesh>
    {Array.from({length: 24}, (_, i) => <mesh key={i} position={[1.16, -.065 + Math.cos(i / 24 * Math.PI * 2) * .13, .12 + Math.sin(i / 24 * Math.PI * 2) * .13]}><boxGeometry args={[.045, .021, .021]}/><meshStandardMaterial color="#9b5664" metalness={1} roughness={.3}/></mesh>)}
    <RoundedPart position={[1.025, -.08, -.4]} size={[.12, .12, .25]} color="#33272b"/>
    <group position={[0, -.12 + e * .38, 0]}>
      <mesh><cylinderGeometry args={[.87, .87, .045, 64]}/><meshStandardMaterial color="#122a25" metalness={.25} roughness={.4}/></mesh>
      <mesh position={[0, .075, 0]}><boxGeometry args={[.43, .1, .43]}/><meshStandardMaterial color="#29363b" metalness={.8} roughness={.28} emissive="#42e6d0" emissiveIntensity={p === 2 ? .12 : 0}/></mesh>
      <mesh position={[0, .13, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[.27, .27]}/><meshStandardMaterial color="#35413e" metalness={.6} roughness={.35}/></mesh>
      {[-1, 1].flatMap(sign => Array.from({length: 7}, (_, i) => <group key={`${sign}${i}`}>
        <mesh position={[sign * .26, .07, (i - 3) * .052]}><boxGeometry args={[.09, .02, .018]}/><meshStandardMaterial color="#cfb88c" metalness={.9} roughness={.3}/></mesh>
        <Trace points={[[sign * .3, .03, (i - 3) * .052], [sign * (.42 + i * .025), .03, (i - 3) * .052], [sign * (.42 + i * .025), .03, sign * (.32 + i * .05)]]} color={p === 2 ? '#aeb797' : '#627a68'}/>
      </group>))}
      {[[-.46, -.3], [.42, -.34], [-.36, .4]].map(([x, z], i) => <mesh key={i} position={[x, .055, z]}><boxGeometry args={[.18, .08, .13]}/><meshStandardMaterial color="#152125" metalness={.6} roughness={.4}/></mesh>)}
      <group position={[.42 + shake * 1.2, .075, .4]}>
        <mesh><cylinderGeometry args={[.175, .175, .085, 48]}/><meshStandardMaterial color="#9aa5a8" metalness={.95} roughness={.3}/></mesh>
        <mesh position={[0,.045,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.12,.145,48]}/><meshStandardMaterial color="#4b5456" metalness={.8} roughness={.35}/></mesh>
        <mesh position={[0,.048,0]}><boxGeometry args={[.09,.006,.025]}/><meshStandardMaterial color="#263333"/></mesh>
      </group>
      {Array.from({length:20},(_,i)=>{const a=i/20*Math.PI*2;return <group key={`via${i}`} position={[Math.cos(a)*.75,.028,Math.sin(a)*.75]}><mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.012,.022,10]}/><meshStandardMaterial color="#b7a16c" metalness={.8} roughness={.4}/></mesh></group>;})}
      {Array.from({length:12},(_,i)=><mesh key={`smt${i}`} position={[-.49+(i%3)*.075,.045,-.21+Math.floor(i/3)*.1]}><boxGeometry args={[.047,.032,.024]}/><meshStandardMaterial color={i%3===0?'#9b855e':'#17201e'} roughness={.5} metalness={.3}/></mesh>)}
      <mesh position={[.4,.065,-.36]}><boxGeometry args={[.25,.08,.21]}/><meshStandardMaterial color="#8b9596" roughness={.43} metalness={.9}/></mesh>

    </group>
    {e > .01 && <>
      <Trace points={[[-.64,-.08+e*.38,.25],[-.76,.02+e*.6,.25],[-.72,.1+e*1.45,.25]]} color="#a67a38"/>
      {[-.74,.74].map(x=><mesh key={x} position={[x,.12+e*.72,-.35]}><cylinderGeometry args={[.003,.003,e*1.35,8]}/><meshBasicMaterial color="#81908a" transparent opacity={e*.3}/></mesh>)}
    </>}
    <group position={[0, .12 + e * 1.45, 0]}>
      <mesh><cylinderGeometry args={[.96, .96, .055, 96]}/><meshStandardMaterial color="#141e22" metalness={.8} roughness={.2}/></mesh>
      <group position={[0, .032, 0]}><Face s={s}/></group>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, .018, 0]}><torusGeometry args={[.95, .025, 12, 96]}/><meshStandardMaterial color="#ba233b" metalness={1} roughness={.15}/></mesh>

    </group>
    <group position={[0, .12 + e * 1.95, 0]}><CoverGlass/></group>
    {micArrivals(s.bearing).map(m => <group key={m.id} position={[m.x, -.015, m.z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.045, .016, 8, 20]}/><meshStandardMaterial color={p === 1 && s.time >= 3.2 + m.fraction * .85 ? '#e8f4ed' : '#172528'} emissive="#50f5d5" emissiveIntensity={p === 1 && s.time >= 3.2 + m.fraction * .85 ? 2 : 0}/></mesh>
      {p === 1 && s.time >= 3.2 + m.fraction * .85 && <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[.07, .12 + Math.sin((s.time - 3.2) * 5) * .02, 32]}/><meshBasicMaterial color="#83eed7" transparent opacity={.6} side={THREE.DoubleSide}/></mesh>}
    </group>)}
    {pulse > 0 && [0, 1, 2].map(i => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -.22, 0]}><ringGeometry args={[1.12 + i * .15 + pulse * .06, 1.14 + i * .15 + pulse * .06, 80]}/><meshBasicMaterial color={events[s.event].color} transparent opacity={pulse * (1 - i * .25)} side={THREE.DoubleSide}/></mesh>)}
  </group>;
};

export const WatchWorld: React.FC<{s: ViewState;showSource?:boolean}> = ({s,showSource=true}) => {
  const pos = sourcePosition(s.bearing); const p = phase(s);
  return <>
    <color attach="background" args={['#141716']}/><fog attach="fog" args={['#141716', 13, 26]}/>
    <Environment orbit={s.orbit} faceView={s.faceView}/><ambientLight intensity={.14}/>
    <directionalLight position={[-3, 7, 5]} intensity={2.2} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-.001} shadow-radius={5} shadow-blurSamples={8} shadow-camera-far={25}/>
    <directionalLight position={[3, 4, -4]} intensity={.6} color="#f5e9e4"/>
    <pointLight position={[-3, 2, 1]} intensity={8} color="#e51b39"/>
    <pointLight position={[2, 2, -2]} intensity={4} color="#ea2441"/>
    <Atmosphere/>
    <Floor/>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.244, -.3]}>
      <planeGeometry args={[9, 8]}/>
      <shaderMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending}
        vertexShader="varying vec2 vGlow; void main(){vGlow=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
        fragmentShader="varying vec2 vGlow; void main(){float r=length((vGlow-0.5)*2.0);float glow=pow(max(0.0,1.0-r),2.2);gl_FragColor=vec4(0.8,0.012,0.035,glow*0.35);}"/>
    </mesh>
    <gridHelper material-transparent material-opacity={.16} args={[20, 40, '#1a3035', '#142328']} position={[0, -.245, 0]}/>
    <Watch s={s}/>
    {active(s) && showSource && <>
      <group position={pos}>
        <mesh><cylinderGeometry args={[.17, .23, .2, 32]}/><meshStandardMaterial color="#8da4ac" roughness={.3} metalness={.9}/></mesh>
        <mesh position={[0, .13, 0]}><sphereGeometry args={[.095, 24, 16]}/><meshStandardMaterial color={events[s.event].color} emissive={events[s.event].color} emissiveIntensity={p === 0 ? 2 : .3}/></mesh>
        {[.27, .38].map(r => <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, -.1, 0]}><ringGeometry args={[r, r + .012, 64]}/><meshBasicMaterial color={events[s.event].color} transparent opacity={.6} side={THREE.DoubleSide}/></mesh>)}
      </group>
      {p === 0 && [0, .38, .76].map((delay, i) => {
        const progress = Math.max(0, Math.min(1, (s.time - .7 - delay) / 2)); const radius = progress * 3.5;
        return radius > .01 && <group key={i} position={pos}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[radius, radius + .018, 112]}/><meshBasicMaterial color={events[s.event].color} transparent opacity={(1 - progress * .8) * .8} side={THREE.DoubleSide} depthWrite={false}/></mesh>
          <mesh><sphereGeometry args={[radius, 48, 24, 0, Math.PI * 2, .35, 1.2]}/><meshBasicMaterial color={events[s.event].color} wireframe transparent opacity={(1 - progress) * .065} depthWrite={false}/></mesh>
        </group>;
      })}
      {p === 1 && micArrivals(s.bearing).map(m => {
        const u = Math.max(0,Math.min(1,(s.time-3.2-m.fraction*.85)/.45));
        return <group key={m.id}>
          <Trace points={[pos,[m.x,1.4,m.z]]} color="#9b805e"/>
          {u>0 && <><Trace points={[[m.x,1.4,m.z],[m.x*.35,1.32+s.exploded*.38,m.z*.35],[0,1.32+s.exploded*.38,0]]} color="#c4b99b"/>
          <mesh position={[m.x*(1-u),1.4+(s.exploded*.38-.08)*u,m.z*(1-u)]}><sphereGeometry args={[.035,12,10]}/><meshBasicMaterial color="#fff1d5"/></mesh></>}
        </group>;
      })}
    </>}
  </>;
};

import {useLayoutEffect,useMemo,useEffect,useState,useRef} from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig,staticFile,delayRender,continueRender,cancelRender} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {GLTFLoader,GLTF} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {roadState} from './roadState';

const skin='#bc8c70';
const Ball=({position=[0,0,0],scale=[1,1,1],color=skin}:{position?:[number,number,number];scale?:[number,number,number];color?:string})=><mesh position={position} scale={scale} castShadow><sphereGeometry args={[1,24,20]}/><meshStandardMaterial color={color} roughness={.78}/></mesh>;
const Box=({position,size,color,metal=0}:{position:[number,number,number];size:[number,number,number];color:string;metal?:number})=>{
 const [w,h,d]=size;
 const geometry=useMemo(()=>new RoundedBoxGeometry(w,h,d,3,.04),[w,h,d]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh position={position} geometry={geometry} castShadow receiveShadow><meshStandardMaterial color={color} roughness={metal?.26:.8} metalness={metal}/></mesh>;
};
const Person=({t,gltf,handle}:{t:number;gltf:GLTF;handle:number})=>{
 const root=useRef<THREE.Group>(null),watch=useRef<THREE.Group>(null);

 const rig=useMemo(()=>{
  if(!gltf)return null;
  const scene=clone(gltf.scene),mixer=new THREE.AnimationMixer(scene);
  mixer.clipAction(gltf.animations.find(a=>a.name==='TPose')!).play();mixer.setTime(0);scene.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(scene),height=box.max.y-box.min.y,scale=1.78/height;
  const nodes:Record<string,THREE.Bone>={};scene.traverse(o=>{if(o instanceof THREE.Bone)nodes[o.name.replace('mixamorig','').replace(':','')]=o;if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;const mat=o.material as THREE.MeshStandardMaterial;mat.roughness=.83;mat.metalness=0;}});
  return {scene,mixer,scale,offset:-box.min.y*scale,nodes,headRest:nodes.Head.quaternion.clone()};
 },[gltf]);
 const j=roadState(t);
 useLayoutEffect(()=>{
  if(!rig||!root.current||!watch.current)return;
  rig.mixer.setTime(0);root.current.updateMatrixWorld(true);
  const aim=(name:string,childName:string,target:THREE.Vector3)=>{
   const bone=rig.nodes[name],child=rig.nodes[childName];if(!bone||!child)return;
   const base=bone.getWorldPosition(new THREE.Vector3()),before=child.getWorldPosition(new THREE.Vector3()).sub(base).normalize(),after=target.clone().sub(base).normalize();
   const q=new THREE.Quaternion().setFromUnitVectors(before,after).multiply(bone.getWorldQuaternion(new THREE.Quaternion()));
   bone.quaternion.copy(bone.parent!.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(q));bone.updateWorldMatrix(false,true);
  };
  const point=(x:number,y:number,z:number)=>new THREE.Vector3(x+j.side,y,z+j.distance);
  for(const [side,k] of [['Left',1],['Right',-1]] as const){
   const swing=Math.sin(t*5.4+(k===1?0:Math.PI))*.24*j.walk;
   aim(side+'UpLeg',side+'Leg',point(k*.095,.46,swing));
   aim(side+'Leg',side+'Foot',point(k*.095,.07,swing*1.7));
   const r=j.raise;
   aim(side+'Arm',side+'ForeArm',point(k*.26,1.13+r*.05,-swing*.45+r*.17));
   aim(side+'ForeArm',side+'Hand',point(t>=89&&t<99&&k===-1?.14:k*(.27-r*.14),.91+r*.52,-swing*.85+r*.38));
  }
  const head=rig.nodes.Head;head.quaternion.copy(rig.headRest);head.rotateX(j.raise*.4);head.rotateY((t<48?-1:1)*j.turn*.95);head.updateWorldMatrix(false,true);
  const hand=rig.nodes.LeftHand;watch.current.position.copy(hand.getWorldPosition(new THREE.Vector3()));watch.current.quaternion.copy(hand.getWorldQuaternion(new THREE.Quaternion()));
  continueRender(handle);
 },[rig,t,j.side,j.distance,j.walk,j.raise,j.turn,handle]);
 return <><group ref={root} position={[j.side,0,j.distance]}>{rig&&<primitive object={rig.scene} scale={rig.scale} position={[0,rig.offset,0]}/>}</group><group ref={watch}>
  <mesh position={[0,-.02,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.042,.012,8,24]}/><meshStandardMaterial color="#8e1230" roughness={.42}/></mesh>
  <mesh position={[0,-.02,.041]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.049,.049,.016,32]}/><meshStandardMaterial color="#c01535" metalness={.85} roughness={.2}/></mesh>
  <mesh position={[0,-.02,.051]}><circleGeometry args={[.04,32]}/><meshStandardMaterial color="#172124" emissive="#ffbe61" emissiveIntensity={j.wristPulse*.8}/></mesh>
  {j.wristPulse>0&&<mesh position={[0,-.02,.054]}><ringGeometry args={[.058,.065+j.wristPulse*.025,32]}/><meshBasicMaterial color="#f5b963" transparent opacity={j.wristPulse} side={THREE.DoubleSide}/></mesh>}
 </group></>;
};
const Tube=({a,b,r=.023,color='#566468'}:{a:[number,number,number];b:[number,number,number];r?:number;color?:string})=>{
 const delta=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.clone().normalize());
 return <mesh position={new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5)} quaternion={q} castShadow><cylinderGeometry args={[r,r,delta.length(),10]}/><meshStandardMaterial color={color} metalness={.5} roughness={.35}/></mesh>;
};
const Bicycle=({x,z,t}:{x:number;z:number;t:number})=><group position={[x,0,z]}>
 {[-.58,.58].map(v=><group key={v} position={[0,.38,v]} rotation={[0,Math.PI/2,0]}><mesh><torusGeometry args={[.35,.035,10,40]}/><meshStandardMaterial color="#252c2b" roughness={.8}/></mesh>{Array.from({length:8},(_,i)=><mesh key={i} rotation={[0,0,t*4+i*Math.PI/4]}><boxGeometry args={[.68,.006,.006]}/><meshStandardMaterial color="#949c98" metalness={.8} roughness={.3}/></mesh>)}</group>)}
 {[[[0,.38,-.58],[0,.42,0]],[[0,.42,0],[0,.88,-.27]],[[0,.88,-.27],[0,.38,-.58]],[[0,.88,-.27],[0,.9,.35]],[[0,.9,.35],[0,.42,0]],[[0,.9,.35],[0,.38,.58]],[[0,.9,.35],[0,1.05,.4]],[[0,1.05,.4],[-.22,1.05,.4]],[[0,1.05,.4],[.22,1.05,.4]]].map((v,i)=><Tube key={i} a={v[0] as [number,number,number]} b={v[1] as [number,number,number]} color="#9f7743"/>)}
 <Box position={[0,.94,-.23]} size={[.2,.06,.25]} color="#252c2b"/>
 <Ball position={[0,1.18,-.13]} scale={[.17,.28,.12]} color="#90705c"/>
 <Ball position={[0,1.56,.02]} scale={[.12,.15,.12]} color={skin}/><Ball position={[0,1.65,.01]} scale={[.14,.09,.14]} color="#45515b"/>
 {[-1,1].map(k=><group key={k}><Tube a={[k*.15,1.35,-.1]} b={[k*.19,1.06,.4]} r={.045} color="#90705c"/><Tube a={[k*.1,.99,-.15]} b={[k*.14,.64,Math.sin(t*5+k)*.17]} r={.065} color="#343c43"/><Tube a={[k*.14,.64,Math.sin(t*5+k)*.17]} b={[k*.13,.4,Math.cos(t*5+k)*.18]} r={.05} color="#343c43"/></group>)}
</group>;
const Car=({t}:{t:number})=>{
 const x=-8+(t-48)*.85;
 return <group position={[x,.1,29.5]} rotation={[0,Math.PI/2,0]}>
  <Box position={[0,.48,0]} size={[1.65,.62,3.4]} color="#52616b" metal={.6}/>
  <Box position={[0,.97,-.18]} size={[1.4,.62,1.8]} color="#829599" metal={.75}/>
  <Box position={[0,1.12,.49]} size={[1.2,.35,.04]} color="#223137" metal={.5}/>
  {[-1,1].flatMap(x=>[-1,1].map(z=><mesh key={`${x}${z}`} position={[x*.8,.32,z*1.02]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.32,.32,.2,28]}/><meshStandardMaterial color="#202827" roughness={.8}/></mesh>))}
  {[-.58,.58].map(x=><Box key={x} position={[x,.57,1.71]} size={[.35,.12,.025]} color="#f7dcad"/>)}
 </group>;
};
const Landscape=()=> <>
 <mesh position={[0,-.12,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[90,200]}/><meshStandardMaterial color="#8e9a85" roughness={1}/></mesh>
 <Box position={[0,-.06,43]} size={[3.1,.12,112]} color="#bdb5a2"/>
 <Box position={[0,-.04,29.5]} size={[30,.12,6]} color="#5c6563"/>
 {Array.from({length:7},(_,i)=><Box key={i} position={[0,.03,27+i*.7]} size={[2.2,.015,.32]} color="#cbd0c5"/>)}
 {Array.from({length:23},(_,i)=>[-1,1].map(k=><group key={`${i}${k}`} position={[k*(6.1+(i%3)*.25),0,i*4-8]}>
  <mesh position={[0,1.1,0]} castShadow><cylinderGeometry args={[.09,.16,2.2,9]}/><meshStandardMaterial color="#797463" roughness={1}/></mesh>
  <Ball position={[0,2.6,0]} scale={[.8,1.1,.85]} color={i%2?'#63735a':'#7c8663'}/><Ball position={[.35,3.1,.2]} scale={[.6,.7,.65]} color="#8b9471"/>
 </group>))}
 {Array.from({length:15},(_,i)=><Box key={i} position={[9+(i%3)*3,2.5+(i%4),i*8-12]} size={[3,5+(i%4)*2,5]} color={i%2?'#b1b1a2':'#8a9890'}/>)}
 <mesh position={[-9,.01,45]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[12,130]}/><meshStandardMaterial color="#748f8f" roughness={.25} metalness={.35}/></mesh>
 {Array.from({length:38},(_,i)=><group key={i} position={[-2.3,0,i*3-8]}><Box position={[0,.45,0]} size={[.06,.9,.06]} color="#4b5854" metal={.7}/><Box position={[0,.8,0]} size={[.045,.045,3]} color="#68756d" metal={.7}/></group>)}
 </>;
const Follow=({t}:{t:number})=>{
 const {camera}=useThree();const j=roadState(t);
 useLayoutEffect(()=>{const close=j.raise*.45;camera.position.set(4.3-close,2.75-close*.25,j.distance+6.4-close);camera.lookAt(.2,1.05,j.distance+.15);camera.updateMatrixWorld();},[camera,j.distance,j.raise]);
 return null;
};
export const Journey=()=>{
 const [gltf,setGltf]=useState<GLTF|null>(null);
 const [handle]=useState(()=>delayRender('Loading journey character'));
 useEffect(()=>{new GLTFLoader().load(staticFile('road-person.glb'),setGltf,undefined,e=>cancelRender(e));},[]);
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),t=frame/fps,j=roadState(t);
 const lightTarget=useMemo(()=>new THREE.Object3D(),[]);
 const bike1=-3+(t-12)*.9;const bike2=42.5+(t-126)*.9;
 return <AbsoluteFill style={{background:'#bec6bb'}}><ThreeCanvas width={width} height={height} camera={{fov:37,position:[4.3,2.75,6.4],near:.1,far:140}} shadows dpr={1} gl={{antialias:true}}>
  <color attach="background" args={['#bac8c3']}/><fog attach="fog" args={['#bac8c3',19,65]}/><Follow t={t}/>
  <hemisphereLight args={['#e8f0e5','#686954',2]}/><directionalLight position={[4,5,j.distance+7]} target={lightTarget} intensity={2.5} color="#e7eeee"/><directionalLight position={[-6,12,j.distance+8]} target={lightTarget} intensity={3} color="#ffe4ba" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-camera-far={120} shadow-bias={-.0002} shadow-normalBias={.035}/>
  <primitive object={lightTarget} position={[0,0,j.distance]}/><Landscape/>{gltf&&<Person t={t} gltf={gltf} handle={handle}/>}
  {t>8&&t<43&&<Bicycle x={.8} z={bike1} t={t}/>}
  {t>45&&t<74&&<Car t={t}/>}
  {t>123&&<Bicycle x={-.9} z={bike2} t={t}/>}
  {j.wristPulse>0&&<pointLight position={[j.side,1.4,j.distance+.25]} color="#efb66b" intensity={j.wristPulse*.4} distance={.5}/>}
 </ThreeCanvas><div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(15,26,24,.18),transparent 35%)',pointerEvents:'none'}}/><div style={{position:'absolute',bottom:30,left:35,color:'#f5f4e9',fontFamily:'Helvetica Neue,PingFang SC,sans-serif',fontSize:20,letterSpacing:2,opacity:.8}}>出行情景 · 三维动画</div></AbsoluteFill>;
};

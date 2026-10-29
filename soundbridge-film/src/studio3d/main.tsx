import {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Experience} from './Experience';
import {Feature, Focus, initialState, ViewState} from './state';

const App = () => {
  const [s, setState] = useState(initialState);
  const [focus,setFocus] = useState<Focus>({});
  const selected = useRef<Feature>('source');
  const [scale, setScale] = useState(Math.min(innerWidth / 1600, innerHeight / 900));
  const target = useRef({exploded:0,bearing:initialState.bearing,orbit:0,faceView:0});
  useEffect(() => {
    let id: number, last = performance.now();
    const tick = (now: number) => {const dt = Math.min((now - last) / 1000, .06);last = now;
      const blend = 1-Math.exp(-dt*5);
      setState(prev => {const next={...prev,time:Math.min(11,prev.time+dt)};for(const key of ['exploded','bearing','orbit','faceView'] as const)next[key]=Math.abs(prev[key]-target.current[key])<.002?target.current[key]:prev[key]+(target.current[key]-prev[key])*blend;return next;});
      setFocus(prev=>Object.fromEntries((['source','bearing','haptics','structure','text','mode','privacy'] as Feature[]).map(k=>[k,(prev[k]??0)+((k===selected.current?1:0)-(prev[k]??0))*blend])));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    const resize = () => setScale(Math.min(innerWidth / 1600, innerHeight / 900));
    addEventListener('resize', resize);
    return () => {cancelAnimationFrame(id);removeEventListener('resize', resize);};
  }, []);
  const change = (patch: Partial<ViewState>) => {const rest={...patch};for(const key of ['exploded','bearing','orbit','faceView'] as const)if(rest[key]!==undefined){target.current[key]=rest[key];delete rest[key];}setState(prev=>({...prev,...rest}));};
  return <div style={{position: 'absolute', width: 1600, height: 900, left: (innerWidth - 1600 * scale) / 2, top: (innerHeight - 900 * scale) / 2, transform: `scale(${scale})`, transformOrigin: 'top left'}}><Experience s={s} focus={focus} onFocusFeature={f=>{selected.current=f;}} onChange={change} onTrigger={() => change({time: 0,directionPreview:false})}/></div>;
};
createRoot(document.getElementById('root')!).render(<App/>);

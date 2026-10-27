import {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Experience} from './Experience';
import {initialState, ViewState} from './state';

const App = () => {
  const [s, setState] = useState(initialState);
  const [scale, setScale] = useState(Math.min(innerWidth / 1600, innerHeight / 900));
  const target = useRef(0);
  useEffect(() => {
    let id: number, last = performance.now();
    const tick = (now: number) => {const dt = Math.min((now - last) / 1000, .06);last = now;
      setState(prev => ({...prev, time: Math.min(11, prev.time + dt), exploded: Math.abs(prev.exploded - target.current) < .002 ? target.current : prev.exploded + (target.current - prev.exploded) * Math.min(1, dt * 5)}));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    const resize = () => setScale(Math.min(innerWidth / 1600, innerHeight / 900));
    addEventListener('resize', resize);
    return () => {cancelAnimationFrame(id);removeEventListener('resize', resize);};
  }, []);
  const change = (patch: Partial<ViewState>) => {if(patch.exploded !== undefined) {target.current = patch.exploded; const rest = {...patch};delete rest.exploded;setState(prev => ({...prev, ...rest}));} else setState(prev => ({...prev, ...patch}));};
  return <div style={{position: 'absolute', width: 1600, height: 900, left: (innerWidth - 1600 * scale) / 2, top: (innerHeight - 900 * scale) / 2, transform: `scale(${scale})`, transformOrigin: 'top left'}}><Experience s={s} onChange={change} onTrigger={() => change({time: 0})}/></div>;
};
createRoot(document.getElementById('root')!).render(<App/>);

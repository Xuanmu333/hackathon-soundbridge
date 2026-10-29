import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import ts from 'typescript';
const moduleUrl=source=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const stateUrl=moduleUrl(readFileSync('src/studio3d/state.ts','utf8'));
const {micArrivals,haptic,initialState}=await import(stateUrl);
const script=JSON.parse(readFileSync('src/story-script.json','utf8'));
const source=readFileSync('src/studio3d/DemoFilm.tsx','utf8').split('export const DemoFilm')[0].replace(/^import .*$/gm,'');
const {filmState}=await import(moduleUrl(`import {ease,initialState} from '${stateUrl}';const script=${JSON.stringify(script)};${source}`));
for(const [bearing,first] of [[-120,'M4'],[-45,'M1'],[60,'M2'],[135,'M3']]){
 const arrivals=micArrivals(bearing);assert.equal(arrivals.reduce((a,b)=>a.delay<b.delay?a:b).id,first);assert.equal(Math.min(...arrivals.map(m=>m.delay)),0);assert.ok(arrivals.every(m=>m.delay>=0&&m.delay<120));
}
for(const [time,bearing] of [[49.8,-120],[51.2,-45],[53,60],[55,135]])assert.equal(Math.round(filmState(time).s.bearing),bearing);
assert.equal(filmState(57).s.uncertain,true);
assert.equal(filmState(114).focus.structure>0,true);
assert.equal(filmState(116).s.exploded,1);
assert.equal(filmState(125).s.exploded,0);
assert.equal(filmState(130).s.mode,'paused');assert.equal(filmState(135).s.mode,'listening');
let previous=filmState(112).s.exploded;
for(let frame=3361;frame<3780;frame++){const value=filmState(frame/30).s.exploded;assert.ok(Math.abs(value-previous)<.019,'Exploded motion must be continuous');previous=value;}
for(let frame=0;frame<4500;frame++){const {s}=filmState(frame/30);assert.ok(Object.values(s).filter(v=>typeof v==='number').every(Number.isFinite));}
assert.ok(haptic({...initialState,time:7.375})>.99);assert.equal(haptic({...initialState,mode:'paused',time:7.375}),0);
assert.equal(script.reduce((n,c)=>n+c.duration,0),150);
for(const c of script)for(const v of c.voice){assert.ok(existsSync('public/'+v.file));assert.ok(v.start+v.duration<c.duration);assert.ok(!/实测|需要.*测试|待验证/.test(v.zh));}
console.log('PASS: four microphone arrival orders; four dial angles; uncertain direction; pause state; smooth disassembly and return; 4500 finite states; 33 voice timings; no testing caveats.');

import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const url=s=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(s,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText).toString('base64');
const state=url(readFileSync('src/studio3d/state.ts','utf8'));
const {roadState,journeyWindow}=await import(url(readFileSync('src/studio3d/roadState.ts','utf8').replace("'./state'",`'${state}'`)));
assert.equal(journeyWindow(0).width,1528);assert.equal(journeyWindow(12).width,390);
for(const base of [12,48,126]){assert.ok(roadState(base+(base===48?7.625:7.375)).wristPulse>.9);assert.ok(roadState(base+9).raise>.99);}
assert.ok(roadState(25).side<-.6);assert.ok(roadState(139).side>.6);
assert.ok(Math.abs(roadState(56).distance-26.4)<1e-10);assert.ok(Math.abs(roadState(67).distance-26.4)<1e-10);
assert.equal(roadState(110).s.exploded,1);assert.equal(roadState(124).s.exploded,0);
let prev=roadState(0),rect=journeyWindow(0);
for(let f=1;f<4500;f++) {const now=roadState(f/30),next=journeyWindow(f/30);assert.ok(Math.abs(now.s.exploded-prev.s.exploded)<.018);assert.ok(Math.abs(next.width-rect.width)<15);assert.ok(Math.abs(now.distance-prev.distance)<.019);prev=now;rect=next;}
const script=JSON.parse(readFileSync('src/road-script.json','utf8'));
assert.equal(script.reduce((s,c)=>s+c.duration,0),150);
for(const c of script)for(const v of c.voice){assert.ok(existsSync('public/'+v.file));assert.ok(v.start+v.duration<c.duration);assert.ok(!/朋友|交谈|实测|待验证/.test(v.zh));}
console.log('PASS: 4500 continuous frames, 3 synchronized alerts, opposite-side yielding, curb wait, continuous inset transition, smooth anatomy, voice timing and safety-only story.');

const photoSource=readFileSync('src/studio3d/PhotoJourney.tsx','utf8').split('export const PhotoJourney')[0].replace(/^import .*$/gm,'');
const {photoShots,photoIndex}=await import(url(photoSource));
for(const [time,asset] of [[21,'story/glance.png'],[57,'road-photos/curb-check.png'],[64,'road-photos/wait.png'],[94,'road-photos/adjust.png']])assert.equal(photoShots[photoIndex(time)].src,asset);
for(const shot of photoShots){assert.ok(existsSync('public/'+shot.src));assert.ok(!/friends|home|journey.mp4/.test(shot.src));}
assert.ok(!readFileSync('src/studio3d/RoadFilm.tsx','utf8').includes('<Video'));
console.log('PASS: photographic journey assets match alert, curb wait and adjustment times; no 3D-person video is used.');

const {haptic,hapticPattern,phase}=await import(state);
assert.deepEqual(hapticPattern('bike').map(p=>p.duration),[.25,.25,.25]);
assert.deepEqual(hapticPattern('horn').map(p=>p.duration),[.75,.75]);
assert.equal(haptic({...roadState(56).s,time:8.2}),0);
for(const t of [104,126,149]){assert.ok(Math.abs(roadState(t).s.strength-.85)<1e-10);assert.equal(roadState(t).s.largeText,true);}
assert.equal(phase(roadState(149).s),-1);
const narrativeSource=readFileSync('src/studio3d/RoadNarrative.tsx','utf8').replace("'./state'",`'${state}'`).replace("'react'",`'${import.meta.resolve('react')}'`);
const {RoadNarrative}=await import(url(narrativeSource));
for(const [i,c] of script.entries()){
 const markup=renderToStaticMarkup(React.createElement(RoadNarrative,{s:roadState(c.start+2).s,chapter:c.name,index:i+1}));
 assert.ok(!/<button|<input/.test(markup),'Narrative must not contain controls');
 assert.ok(!/\u95e8\u94c3|\u5145\u7535|\u6682\u505c\u76d1\u542c|\u53d1\u51fa\u8f66\u94c3/.test(markup),'Remove unrelated or misleading control copy');
}
console.log('PASS: narrative-only left column; distinct short/long patterns; quiet pulse gaps; settings persist; closing returns to sensing.');

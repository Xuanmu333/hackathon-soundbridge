import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const url=s=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(s,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText).toString('base64');
const state=url(readFileSync('src/studio3d/state.ts','utf8'));
const {roadState,roadStoryTime,journeyWindow}=await import(url(readFileSync('src/studio3d/roadState.ts','utf8').replace("'./state'",`'${state}'`)));
const {hapticPattern,followUpCue,phase}=await import(state);
assert.equal(journeyWindow(31).width,1528);assert.equal(journeyWindow(34).width,390);
assert.equal(roadState(8).s.exploded,1);assert.equal(roadState(12).s.exploded,0);
let prev=roadState(0),rect=journeyWindow(0);
for(let f=1;f<4860;f++) {const now=roadState(f/30),next=journeyWindow(f/30);assert.ok(Math.abs(now.s.exploded-prev.s.exploded)<.033);assert.ok(Math.abs(next.width-rect.width)<20);for(const k of ['bearing','time','strength'])assert.ok(Number.isFinite(now.s[k]));prev=now;rect=next;}
for(const t of [80,82,87,90]) {const s=roadState(t).s;assert.equal(s.bearing+s.wristYaw,s.sourceBearing);}
for(const t of [77,84])assert.equal(roadState(t).s.directionReady,false);
for(const t of [82,88])assert.equal(roadState(t).s.directionReady,true);
for(const t of [41.375,101.625,149.375])assert.ok(roadState(t).wristPulse>.99);
for(const t of [106.375,110.375,114.375,118.375])assert.ok(roadState(t).wristPulse>.99);
assert.equal(roadState(108.5).wristPulse,0);
assert.ok(roadState(118).s.strength>roadState(106).s.strength);
assert.equal(roadState(117).s.alertStage,'viewing');
for(const t of [120,121,124]){assert.equal(roadState(t).s.alertStage,'confirmed');assert.equal(roadState(t).wristPulse,0);}
assert.equal(followUpCue(30,false).active,false);assert.equal(followUpCue(3,true).active,false);assert.equal(followUpCue(3,false,false).active,false);
assert.deepEqual(hapticPattern('bike').map(p=>p.duration),[.25,.25,.25]);assert.deepEqual(hapticPattern('horn').map(p=>p.duration),[.75,.75]);
assert.equal(roadState(64.5).s.event,'noise');assert.equal(roadState(64.5).wristPulse,0);
for(const [t,event] of [[66.325,'siren'],[69.125,'engine'],[72.325,'construction']]){assert.equal(roadState(t).s.event,event);assert.ok(roadState(t).wristPulse>.99);}
const script=JSON.parse(readFileSync('src/road-script.json','utf8'));
assert.equal(script.reduce((s,c)=>s+c.duration,0),162);
assert.deepEqual(script.slice(0,3).map(c=>c.name),['Structure','Logic','Opening']);assert.equal(script[2].start,28);
assert.equal(script.find(c=>c.name==='RoadSounds').start,64);
for(const c of script)for(const [i,v] of c.voice.entries()){assert.ok(existsSync('public/'+v.file));assert.equal(v.playbackRate,1);assert.ok(v.file.startsWith('voice-road-steady/'));assert.ok(v.start+v.duration<c.duration);if(i)assert.ok(Math.abs(v.start-c.voice[i-1].start-c.voice[i-1].duration-.35)<.002);assert.ok(!/朋友|交谈|实测|待验证/.test(v.zh));}
const photoSource=readFileSync('src/studio3d/PhotoJourney.tsx','utf8').split('export const PhotoJourney')[0].replace(/^import .*$/gm,'');
const {photoShots,photoIndex}=await import(url(photoSource));
for(const [time,asset] of [[44,'story/glance.png'],[105,'road-photos/wait.png'],[117,'road-photos/curb-check.png'],[122,'road-photos/adjust.png']])assert.equal(photoShots[photoIndex(roadStoryTime(time))].src,asset);
for(const shot of photoShots)assert.ok(existsSync('public/'+shot.src));
for(const t of [143,151,161]){assert.ok(Math.abs(roadState(t).s.strength-.85)<1e-10);assert.equal(roadState(t).s.largeText,true);}
assert.equal(phase(roadState(161).s),-1);
const narrativeSource=readFileSync('src/studio3d/RoadNarrative.tsx','utf8').replace("'./state'",`'${state}'`).replace("'react'",`'${import.meta.resolve('react')}'`);
const {RoadNarrative}=await import(url(narrativeSource));
for(const [i,c] of script.entries()){
 const markup=renderToStaticMarkup(React.createElement(RoadNarrative,{s:roadState(c.start+2).s,chapter:c.name,index:i+1}));
 assert.ok(!/<button|<input/.test(markup));assert.ok(!/门铃|充电|暂停监听|发出车铃/.test(markup));
}
console.log('PASS: 4860 frames, posture-relative direction, synchronized patterns, background filtering, bounded escalation and explicit acknowledgement, uniform voice timing, safety-only narrative.');

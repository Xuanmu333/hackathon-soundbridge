import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,openBrowser} from '@remotion/renderer';
const url=await bundle({entryPoint:'src/index.ts'});
const browser=await openBrowser('chrome',{browserExecutable:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const composition=await selectComposition({serveUrl:url,id:'SoundBridge-Film',puppeteerInstance:browser});
const frames=[1200,1340,1510,1710,1860,2100,2310,3990];
for(let i=0;i<frames.length;i+=2){await Promise.all(frames.slice(i,i+2).map((frame,j)=>renderStill({serveUrl:url,composition,frame,output:`../SoundBridge_Film/qa/technology-${String(i+j).padStart(2,'0')}.jpg`,imageFormat:'jpeg',scale:.75,puppeteerInstance:browser})));}
await browser.close({silent:true});console.log('Eight technology keyframes rendered.');

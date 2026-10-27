import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,openBrowser} from '@remotion/renderer';
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const browser=await openBrowser('chrome',{browserExecutable:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const composition=await selectComposition({serveUrl,id:'SoundBridge-Film',puppeteerInstance:browser});
const frames=[510,1260,1310,1420,1490,1645,1825,2220,2270,2850,2898,2955,3020,3140,3667,3690,3820,4030];
for(let i=0;i<frames.length;i+=3){await Promise.all(frames.slice(i,i+3).map((frame,j)=>renderStill({serveUrl,composition,frame,output:`../SoundBridge_Film/qa/refined-${String(i+j).padStart(2,'0')}.jpg`,imageFormat:'jpeg',scale:.5,puppeteerInstance:browser})));}
await browser.close({silent:true});console.log('18 refinement frames rendered.');

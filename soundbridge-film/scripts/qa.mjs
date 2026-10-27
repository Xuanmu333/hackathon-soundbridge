import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,openBrowser} from '@remotion/renderer';
const url=await bundle({entryPoint:'src/index.ts'});
const browser=await openBrowser('chrome',{browserExecutable:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const c=await selectComposition({serveUrl:url,id:'SoundBridge-Film',puppeteerInstance:browser});
const frames=[210,510,900,1290,1650,2010,2340,2790,3360,3660,3990,4410];
for(let i=0;i<frames.length;i+=3){await Promise.all(frames.slice(i,i+3).map((frame,j)=>renderStill({serveUrl:url,composition:c,frame,output:`../SoundBridge_Film/qa/shot-${String(i+j).padStart(2,'0')}.jpg`,imageFormat:'jpeg',scale:.5,puppeteerInstance:browser})));console.log('Checked scenes',Math.min(i+3,frames.length));}
await browser.close({silent:true});

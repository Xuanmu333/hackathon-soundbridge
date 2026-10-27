import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,openBrowser} from '@remotion/renderer';
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const browser=await openBrowser('chrome',{browserExecutable:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const composition=await selectComposition({serveUrl,id:'Motion-Study',puppeteerInstance:browser});
const frames=[25,205,510,517,540,649,670];
for(let i=0;i<frames.length;i++){await renderStill({serveUrl,composition,frame:frames[i],output:`../SoundBridge_Film/qa/motion-${i}.jpg`,imageFormat:'jpeg',scale:.5,puppeteerInstance:browser});}
await browser.close({silent:true});console.log('Seven motion-state frames checked.');

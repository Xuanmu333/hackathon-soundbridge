import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,openBrowser} from '@remotion/renderer';
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const browser=await openBrowser('chrome',{browserExecutable:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',chromiumOptions:{gl:'angle'}});
const composition=await selectComposition({serveUrl,id:'SoundBridge-Road-Film',puppeteerInstance:browser});
for(const frame of [240,600,810,1110,1320,1500,1905,2250,2730,3240,3600,4470]) {
 await renderStill({serveUrl,composition,frame,output:`../SoundBridge_Film/qa/structure-${frame}.jpg`,imageFormat:'jpeg',puppeteerInstance:browser});
 console.log(`Verified frame ${frame}`);
}
await browser.close({silent:true});

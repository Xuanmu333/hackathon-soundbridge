import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,openBrowser} from '@remotion/renderer';
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const browser=await openBrowser('chrome',{browserExecutable:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',chromiumOptions:{gl:'angle'}});
const composition=await selectComposition({serveUrl,id:'SoundBridge-Road-Film',puppeteerInstance:browser});
for(const frame of [75,150,255,450,690,960,1180,1320,1740,1935,2010,2100,2200,2325,2460,3150,3310,3550,3630,4800]) {
 await renderStill({serveUrl,composition,frame,output:`../SoundBridge_Film/qa/responsive-${frame}.jpg`,imageFormat:'jpeg',puppeteerInstance:browser});
 console.log(`Verified frame ${frame}`);
}
await browser.close({silent:true});

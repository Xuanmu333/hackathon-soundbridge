import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,openBrowser} from '@remotion/renderer';
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const browser=await openBrowser('chrome',{browserExecutable:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',chromiumOptions:{gl:'angle'}});
const composition=await selectComposition({serveUrl,id:'SoundBridge-3D-Film',puppeteerInstance:browser});
for(const frame of [425,650,1335,1550,2200,2520,2920,3690,4290]) {
 await renderStill({serveUrl,composition,frame,output:`../SoundBridge_Film/qa/three-${frame}.jpg`,imageFormat:'jpeg',puppeteerInstance:browser});
 console.log(`Verified frame ${frame}`);
}
await browser.close({silent:true});

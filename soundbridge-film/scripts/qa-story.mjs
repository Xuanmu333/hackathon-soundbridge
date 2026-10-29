import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,openBrowser} from '@remotion/renderer';
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const browser=await openBrowser('chrome',{browserExecutable:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',chromiumOptions:{gl:'angle'}});
const composition=await selectComposition({serveUrl,id:'SoundBridge-3D-Film',puppeteerInstance:browser});
for(const frame of [150,690,1290,1530,1620,1950,2280,2760,3180,3540,3720,3900,4380]) {
 await renderStill({serveUrl,composition,frame,output:`../SoundBridge_Film/qa/story-${frame}.jpg`,imageFormat:'jpeg',puppeteerInstance:browser});
 console.log(`Verified frame ${frame}`);
}
await browser.close({silent:true});

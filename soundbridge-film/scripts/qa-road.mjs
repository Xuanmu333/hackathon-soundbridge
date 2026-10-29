import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,openBrowser} from '@remotion/renderer';
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const browser=await openBrowser('chrome',{browserExecutable:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',chromiumOptions:{gl:'angle'}});
const composition=await selectComposition({serveUrl,id:'SoundBridge-Road-Film',puppeteerInstance:browser});
for(const frame of [581,599,630,1080,1669,2820,3330,4050,4470]) {
 await renderStill({serveUrl,composition,frame,output:`../SoundBridge_Film/qa/narrative-${frame}.jpg`,imageFormat:'jpeg',puppeteerInstance:browser});
 console.log(`Verified frame ${frame}`);
}
await browser.close({silent:true});

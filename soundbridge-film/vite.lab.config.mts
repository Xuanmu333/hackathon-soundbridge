import {defineConfig} from 'vite';
export default defineConfig({base: './', publicDir: false, build: {outDir: '../SoundBridge_3D_Control_Demo', emptyOutDir: true, rollupOptions: {input: 'three-lab.html'}}});

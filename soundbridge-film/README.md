## Hackathon presentation film

[Download the 16:9 SoundBridge film](../SoundBridge_Film/SoundBridge_Hackathon_16x9.mp4?raw=1) for the slide deck. The Remotion composition is `SoundBridge-Hackathon` (1920 × 1080, 30 fps, 2:42), with Mandarin narration and bilingual subtitles.

## Adaptive AI edition

The active composition is `SoundBridge-Road-Film`, 162 seconds / 4860 frames. The current output is `../SoundBridge_Film/SoundBridge_Adaptive_AI_162s.mp4`. Earlier rendered editions are preserved.

The opening compresses structure and signal logic into 28 seconds, with component highlights, moving signal paths, and changing classification/direction outputs. The film then follows Xiaolin, a deaf or hard-of-hearing pedestrian, through road awareness, viewing and acknowledgement.

The 64–76 second classification interlude distinguishes background sound, sirens, vehicle sounds and construction. It demonstrates filtering of notifications, not an implemented noise-cancellation system. `AIRecognition.tsx` visualizes spectral features and candidate classes. No actual microphone or AI model is connected; all classifications and directions are concept animation states. Vehicle sounds alone do not establish collision risk.

`roadState.ts` adds wrist orientation and a fixed-world-source demonstration. Direction is relative to the current dial, hidden while the concept pose is unstable. Raising the wrist is separate from explicit acknowledgement. Follow-up cues repeat with gaps, increase within a capped strength, and end on acknowledgement, event clearance or a 30-second round limit. Left graphics and watch motion share the same haptic clock.

`PhotoJourney.tsx` retains approved photorealistic fictional character stills with frame-driven zoom/crossfades. These are not live footage. The image sequence shows arm down, wrist viewing, tapping and observing traffic in time with the watch.

All 29 voice lines use the same Xiaoxiao voice and +6% generation rate, stored in `public/voice-road-steady/`. No section is accelerated after generation. Road chapters must accommodate the original voice durations; the audio preparation script rejects overflow instead of compressing speech. Bilingual sidecars: `SoundBridge_Adaptive_AI_中英字幕.srt` and `captions.adaptive-ai.zh.json`.

Render `SoundBridge-Road-Film` to `../SoundBridge_Film/qa/road-render.mp4`, then run `python3 scripts/finish_road.py SoundBridge_Adaptive_AI_162s.mp4` for normalization and full-file validation. `node scripts/check-road.mjs` checks timing, pose-relative bearings, pulse patterns, acknowledgement, limits and narrative. `node scripts/qa-road.mjs` exports representative frames for visual review.

Prior structure-and-logic output: `../SoundBridge_Film/SoundBridge_Structure_Logic_150s.mp4`. The legacy interactive console and previous compositions below remain available.

# SoundBridge — Safety, Independence and Humanity

Previous edition: a 150-second Three.js concept film with Chinese narration, bilingual subtitles, a state-driven product console, spatial sound propagation, a red procedural watch with rounded metal casework, curved glass, fine-grain matte straps, studio reflections and a charcoal console and an independent-outing story. Local iteration output: `../SoundBridge_Film/SoundBridge_Road_Safety_150s.mp4`. The previous red edition remains unchanged. The prior structure-and-logic revision was uploaded separately.

## Interactive 3D console

Run `npm install` followed by `npm run lab`, then open `http://127.0.0.1:3010/three-lab.html`.

Use the event buttons and bearing slider to position a simulated sound source, then trigger its propagation, microphone reception, on-device recognition and haptic response. The same scene drives the video. The controls also expose an exploded view, text size, vibration strength, camera orbit, pause and charging. Selecting a different sound while paused preserves the pause state. This is an explanatory simulation; it does not access the microphone or classify real audio.

`npm run build:lab` creates the standalone web bundle in `../SoundBridge_3D_Control_Demo/`. Serve that directory over HTTP and open `three-lab.html`. No external model, HDR or third-party reference assets are fetched at runtime.

## Preview

```sh
npm install
npm run dev
```

Select `SoundBridge-3D-Film` for the new full timeline. `SoundBridge-Film` and the `Scenes` folder preserve the previous edition.

## Render

```sh
npx remotion render src/index.ts SoundBridge-3D-Film ../SoundBridge_Film/qa/story-master.mp4 --browser-executable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --gl=angle --codec=h264 --crf=20 --concurrency=3
```

This edition uses a new 33-line Chinese narration in `public/voice-story/`, with timing and bilingual text in `src/story-script.json`. Keep this new audio when exporting; do not remux the old edition audio. The installed Chrome renderer works on this Mac.

The current edition alternates large lifestyle scenes with the 3D console. Xiaolin notices a bell through a tactile cue, checks the watch, observes the rider and decides how to proceed. Four labeled microphones show relative arrival delays and four direction presets drive the source, waveforms and dial together. Highlighted controls lead the associated model changes; the glass, display and populated board lift and return smoothly. A finite sound wave travels through space to the watch, reception precedes classification, and a confirmed class drives a distinct haptic pattern. Internal layers separate to explain the proposed architecture. The source's spatial position and the transmission time are enlarged for explanation, not presented as measured physical performance. See `../SoundBridge_Film/三维控制台设计说明.html` for the reference-to-implementation mapping; the earlier motion study is documented in `动效打磨说明.html`.

## Contents

- `src/studio3d/`: shared Three.js model, frame-driven state, control console, browser entry and video timeline. All video motion derives from the Remotion frame; no independent animation loop runs in the film.
- `scripts/qa-story.mjs`: representative frames for the current story edition.
- `scripts/check-story.mjs`: microphone arrival order, angle states, smooth disassembly, pause behavior and narration timing checks.
- `scripts/prepare_story_audio.py`: generates the current narration and bilingual SRT.
- `src/story-outline.json` / `src/story-script.json`: current story and timed narration.
- `public/story/`: new fictional wrist-glance and home scenes, with generation prompts.
- `src/script.json`: preserved previous-edition scene timing and narration.
- `src/scenes/`: twelve visual chapters. Conversation/speech alerts have been removed.
- `src/visuals.tsx`: watch, signal, subtitle and shared layout components.
- `public/voice-safety/`: previous-edition Chinese voice clips (`zh-CN-XiaoxiaoNeural`). `public/voice/` belongs to the preserved earlier film.
- `public/technology/`: generated cinematic hardware concept images; prompts and shot changes are in `../SoundBridge_Film/科幻视觉升级说明与提示词.md`.
- `public/safety/`: three AI-generated fictional lifestyle keyframes, animated in the film. Prompts: `../SoundBridge_Film/素材提示词.md`.
- `public/footage/home.mp4`: existing-project home footage. Other old extracts are unused in this edition.
- `public/score.wav`: original ambient score, generated by `scripts/make_score.py`.
- `scripts/prepare_audio.py`: narration generation and bilingual SRT export. Requires `edge-tts`, FFmpeg and FFprobe.
- `scripts/qa.mjs`: chapter stills for layout inspection.

The film presents proposed behavior, including uncertainty and device availability. Hardware, recognition, direction estimates, status handling and privacy controls require implementation and validation. It makes no collision-avoidance guarantee. See `../SoundBridge_Film/安全版制作说明与分镜.md` for storyboard and limitations. The earlier film and original web presentation remain available for comparison.

`Motion-Study` is a short local review composition. The original third-party reference recording and extracted frames are excluded from public deliverables.

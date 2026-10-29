## Current structure and technical-logic edition

The user approved replacing the rejected stylized 3D character with photorealistic character images on 2026-10-28. The active composition is SoundBridge-Road-Film. PhotoJourney.tsx uses frame-driven zoom and crossfades, with a continuous opening-to-inset transition. It does not portray the images as live footage. Road alerts, wrist-check images, curb waiting, and personalization are timed together. The current local output is ../SoundBridge_Film/SoundBridge_Structure_Logic_150s.mp4. The prior Road_Safety film is preserved. Previous videos remain preserved. This structure-and-logic revision is approved for GitHub upload. The preceding narrative edition remains available.

The film opens with internal structure (0-20s), dissolves the watch into a parallel classification/localization flow (20-42s), then returns to Xiaolin's road journey (42-150s). TechnicalLogic.tsx provides frame-driven signal paths and cue graphics. On-dial angle boxes, arrows and arcs pulse during directional explanations, paired with a closer camera view.

RoadNarrative.tsx replaces the film control panel with twelve timed scene explanations and synchronized sensation graphics. Bicycle alerts use three short pulses; horn alerts use two long pulses. The left graphic and Three.js watch share hapticPattern/haptic timing. Mic-arrival and anatomy diagrams follow the corresponding chapters. Personalization explicitly previews a cue, retains strength and text-size choices, and the ending returns to sensing without a stale source marker.

New image assets and full generation prompts are in public/road-photos/. The model was the built-in image_gen tool. Original walking, glance and observe reference images remain in public/safety/ and public/story/. Journey.tsx and road-person.glb are unused rejected experiments; their composition is no longer offered in the root list.

Render SoundBridge-Road-Film to ../SoundBridge_Film/qa/road-render.mp4, then run python3 scripts/finish_road.py SoundBridge_Structure_Logic_150s.mp4 to normalize audio and validate the final file. Run node scripts/check-road.mjs for timing checks and node scripts/qa-road.mjs for key-frame review.

# SoundBridge — Safety, Independence and Humanity

Current editable project: a 150-second Three.js concept film with Chinese narration, bilingual subtitles, a state-driven product console, spatial sound propagation, a red procedural watch with rounded metal casework, curved glass, fine-grain matte straps, studio reflections and a charcoal console and an independent-outing story. Local iteration output: `../SoundBridge_Film/SoundBridge_Road_Safety_150s.mp4`. The previous red edition remains unchanged. This structure-and-logic revision is approved for GitHub upload.

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

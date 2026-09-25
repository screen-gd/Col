---
name: motion-catalogue
description: |
  Domain navigator for motion, animation, 3D, and generative media skills.
  Routes to the right skill for GSAP, Framer Motion, Three.js, Lottie,
  shaders, generative art, video, and AI media generation.
triggers:
  - "motion skills"
  - "animation skill"
  - "GSAP skill"
  - "Three.js skill"
  - "Framer Motion skill"
  - "Lottie skill"
  - "shader skill"
  - "generative art skill"
  - "WebGL skill"
  - "video generation skill"
  - "creative coding skill"
---

# motion-catalogue

Domain navigator for motion design, animation, 3D, shaders, and generative media.
Activate when the user asks for a skill in one of these areas.

→ For the full catalogue across all domains: use `design-catalogue`.

Source: https://github.com/podo/design-agent-skills/tree/main/skills/motion-catalogue

## When to use

Activate when the user:
- Asks about animation libraries (GSAP, Framer Motion, Lottie, CSS animations)
- Wants 3D (Three.js, WebGPU, shaders, WebGL, R3F)
- Needs generative art (p5.js, algorithmic art, creative coding)
- Wants video/media generation (Remotion, fal.ai, generative media)

## Motion & Animation

| Skill | Best for |
|-------|----------|
| `gsap-skills` | Official GSAP: 8 skills — core, timeline, ScrollTrigger, Flip, Draggable, SplitText |
| `framer-motion-skills` | 6 Framer Motion skills: core, Next.js, variants, scroll, gestures, layout |
| `motion-design-skill` | Official LottieFiles: timing, easing, choreography, Disney 12 principles |
| `animate-skill` | Emil-inspired Next.js/React patterns: hover, toast, text reveal, modals |
| `animate-css-skill` | Animate.css v4 + scroll triggers + RTL + prefers-reduced-motion |
| `css-animation-skill` | Scrapes live app design language → standalone animation file |
| `wiggle-claude-skill` | Animates SVG logos → Lottie JSON → GIF + MP4 |
| `emilkowalski-skill` | Animation decision framework, easing curves, interaction principles |
| `claudedesignskills` | 22-skill bundle: Three.js, GSAP, R3F, Framer, Babylon, A-Frame, PixiJS, Rive, Lottie — https://github.com/freshtechbro/claudedesignskills |
| `hyperframes` | "Write HTML → render video": GSAP/CSS/Lottie/Three.js + TTS (HeyGen) |

## Generative Art & Creative Coding

| Skill | Best for |
|-------|----------|
| `algorithmic-art` | Generative art with p5.js, flow fields, particle systems |
| `p5js-hermes` | p5.js creative coding: noise, particles, GLSL, audio-reactive |
| `remotion` | Programmatic video with React |

## 3D, Shaders & Media

| Skill | Best for |
|-------|----------|
| `shader-dev` | GLSL shaders: ray marching, fluid simulation, WebGL effects |
| `cloudai-threejs` | Three.js 3D scenes, animations, WebGL |
| `webgpu-claude-skill` | Three.js TSL, node materials, GPU compute, WGSL — r183+ |
| `threejs-ecs-ts` | Three.js + Entity Component Systems + TypeScript |
| `threejs-claude-skill-package` | 24 skills: WebGL, WebGPU, R3F, physics, IFC/BIM architecture |
| `fal-ai-skills` | fal.ai image/video and 3D model generation |
| `generative-media-skills` | 41 workflows: Midjourney v7, Flux Kontext, Kling 3.0, Veo3, Suno audio |

## Workload → Library quick routing

Use this when selecting the best UI/animation/3D library for the task:

- Simple UI micro-interactions, hover, toast, reveal, modals → Framer Motion (`motion` / `framer-motion`) or CSS / Animate.css
- Scroll-driven storytelling, pinning, scrubbing, SplitText → GSAP + ScrollTrigger
- Lottie / SVG logo animation → Lottie / wiggle workflow
- Interactive 3D in React, product configurator → React Three Fiber + drei
- Vanilla / max-control WebGL, non-React → Three.js vanilla
- Games / heavy 3D physics → Babylon.js
- Lightweight background 3D / Vanta-style effects → lightweight-3d-effects / Vanta
- 2D canvas particles, charts → PixiJS / p5.js
- Custom shaders, fluid, ray-marching → GLSL ShaderMaterial / shader-dev
- Quick designer prototype, no code → Spline

Full upstream catalogue: https://github.com/podo/design-agent-skills

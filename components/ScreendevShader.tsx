/* Background shader by @screendev on OpenShaders: https://openshaders.com/@screendev */
"use client";

import { useEffect, useRef } from "react";
import { animate, parseHex, type ShaderHandle, type ShaderOptions, type ShaderProps } from "./shader-runtime";

const FIELD_SHADER = `struct Uniforms {
  resolution: vec2f,
  time: f32,
  lightMode: f32,
  darkBackground: vec3f,
  pixelRatio: f32,
  lightBackground: vec3f,
}
@group(0) @binding(0) var<uniform> u: Uniforms;

const HUE: f32 = 0.592417479;
const HUE_SPREAD: f32 = 0.00895982143;
const HUE_TRAVEL: f32 = 1.81699848;
const CHROMA: f32 = 0.105831832;
const LIGHTNESS: f32 = 0.561614811;
const COLOUR_CYCLE: f32 = 0.157766372;
const THETA: f32 = 2.11315823;
const SHEAR: f32 = 0.959939361;
const SHRINK: f32 = 0.9488644;
const LAYERS: f32 = 73.0;
const WARP_FREQ_X: f32 = 0.463788897;
const WARP_FREQ_Y: f32 = 2.47012258;
const WARP_AMP_X: f32 = 0.101558559;
const WARP_AMP_Y: f32 = 0.0322007388;
const ASPECT_X: f32 = 2.52213597;
const ASPECT_Y: f32 = 0.203344896;
const OFFSET_X: f32 = 0.407597601;
const OFFSET_Y: f32 = -0.0278026797;
const TILT: f32 = -1.14852977;
const ZOOM: f32 = 1.0978626;
const CENTRE_X: f32 = 0.22665225;
const CENTRE_Y: f32 = 0.488793045;
const GLOW_SIZE: f32 = 0.00219408958;
const FALLOFF: f32 = 0.316368669;
const VIGNETTE: f32 = 0.00159253448;
const FLOW_SPEED: f32 = 0.433230639;
const FLOW_DIRECTION: f32 = 1.0;
const BREATH_RATE: f32 = 0.447767794;
const BREATH_AMOUNT: f32 = 0.0520217642;
const PHASE: f32 = 23.3064098;
const ECHO: f32 = 0.0;
const ECHO_SHIFT: f32 = 0.184553832;
const SOFTNESS: f32 = 0.00184572604;
const LIGHT_SWING: f32 = 0.283909291;

@vertex fn vertexMain(@builtin(vertex_index) index: u32) -> @builtin(position) vec4f {
  let position = vec2f(f32((index << 1u) & 2u), f32(index & 2u));
  return vec4f(position * 2.0 - 1.0, 0.0, 1.0);
}

const TAU: f32 = 6.28318530718;

fn oklchToLinear(L: f32, C: f32, h: f32) -> vec3f {
  let a = C * cos(h);
  let b = C * sin(h);
  let l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  let m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  let s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  var lms = vec3f(l_, m_, s_);
  lms = lms * lms * lms;
  return mat3x3f(4.0767416621, -1.2684380046, -0.0041960863,
                 -3.3077115913, 2.6097574011, -0.7034186147,
                 0.2309699292, -0.3413193965, 1.7076147010) * lms;
}

fn fmod(x: f32, y: f32) -> f32 { return x - y * floor(x / y); }

fn blueNoise(p: vec2f, frame: f32) -> f32 {
  let q = p + 5.588238 * fmod(frame, 64.0);
  return fract(52.9829189 * fract(0.06711056 * q.x + 0.00583715 * q.y));
}

@fragment fn fragmentMain(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let R = u.resolution;
  let frag = vec2f(position.x, R.y - position.y);
  let pos = (frag - 0.5 * R) / R.y;
  let t = u.time * FLOW_SPEED * FLOW_DIRECTION + PHASE;
  let breath = (-sin(u.time * BREATH_RATE * 1.5) + sin(u.time * BREATH_RATE + 1.0)) * 0.25 + 0.5;

  var p = (pos - vec2f(CENTRE_X, CENTRE_Y)) * (ZOOM - breath * BREATH_AMOUNT);
  let ct = cos(TILT);
  let st = sin(TILT);
  p = mat2x2f(ct, st, -st, ct) * p;
  let fold = mat2x2f(cos(THETA), sin(THETA), -SHEAR, cos(THETA));
  let hue0 = HUE * TAU;
  let hue1 = hue0 + HUE_SPREAD * TAU;
  var color = vec3f(0.0);

  for (var i: f32 = 1.0; i <= 96.0; i += 1.0) {
    if (i > LAYERS) { break; }
    p.x += -sin(p.y * WARP_FREQ_X + t + i * 0.007) * WARP_AMP_X;
    p.y += -sin(p.x * WARP_FREQ_Y - t + i * 0.02) * WARP_AMP_Y;
    p = fold * p * SHRINK;
    let q = p - vec2f(OFFSET_X + breath * 0.1, OFFSET_Y);
    let s = vec2f(q.x * ASPECT_X, q.y * ASPECT_Y);
    var glow = GLOW_SIZE / (dot(s, s) + SOFTNESS);
    if (ECHO > 0.0) {
      let e = vec2f((q.x - ECHO_SHIFT) * ASPECT_X, s.y);
      glow += ECHO * GLOW_SIZE / (dot(e, e) + SOFTNESS);
    }
    glow *= 0.25 + breath * 0.4;
    let r = length(p);
    let k = sin(i * COLOUR_CYCLE + t * 1.2 + r * HUE_TRAVEL) * 0.5 + 0.5;
    let tint = clamp(oklchToLinear(LIGHTNESS + LIGHT_SWING * k, CHROMA * (0.75 + 0.35 * k), mix(hue0, hue1, k)), vec3f(0.0), vec3f(1.0));
    color += glow * tint * exp2(-r * FALLOFF);
  }

  let x = max(color, vec3f(0.0));
  color = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
  color = pow(clamp(color, vec3f(0.0), vec3f(1.0)), vec3f(0.85, 0.92, 0.98));
  let edge = smoothstep(0.5, 1.6, length(pos));
  color *= 1.0 - edge * VIGNETTE;
  let dark = u.darkBackground + color * (1.0 - u.darkBackground);
  let strength = max(color.r, max(color.g, color.b));
  let light = u.lightBackground * (1.0 - strength) + color * 0.96;
  color = mix(dark, light, vec3f(u.lightMode));
  color += (blueNoise(frag, floor(u.time * 24.0)) - 0.5) / 255.0;
  return vec4f(clamp(color, vec3f(0.0), vec3f(1.0)), 1.0);
}
`;

const RARITY_SHADER = `struct Uniforms {
  resolution: vec2f,
  time: f32,
  lightMode: f32,
  darkBackground: vec3f,
  pixelRatio: f32,
  lightBackground: vec3f,
}
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var sceneSampler: sampler;
@group(0) @binding(2) var tScene: texture_2d<f32>;

const STRENGTH: f32 = 1.02943015;
const SCALE: f32 = 0.804260671;
const SEED: f32 = 0.208502308;

@vertex fn vertexMain(@builtin(vertex_index) index: u32) -> @builtin(position) vec4f {
  let position = vec2f(f32((index << 1u) & 2u), f32(index & 2u));
  return vec4f(position * 2.0 - 1.0, 0.0, 1.0);
}

fn toInk(c: vec3f) -> vec3f { return mix(c - u.darkBackground, u.lightBackground - c, vec3f(u.lightMode)); }
fn fromInk(ink: vec3f) -> vec3f { return mix(u.darkBackground + ink, u.lightBackground - ink, vec3f(u.lightMode)); }
fn sceneInk(uv: vec2f) -> vec3f {
  let c = clamp(uv, vec2f(0.0), vec2f(1.0));
  return toInk(textureSample(tScene, sceneSampler, vec2f(c.x, 1.0 - c.y)).rgb);
}
fn fmod(x: f32, y: f32) -> f32 { return x - y * floor(x / y); }

fn pixelate(frag: vec2f) -> vec3f {
  let cell = max(3.0, floor(SCALE * 6.0 * u.pixelRatio + 0.5));
  let grid = floor(frag / cell);
  let centre = (grid + 0.5) * cell;
  var ink = vec3f(0.0);
  ink += sceneInk((centre + cell * vec2f(-0.25, -0.25)) / u.resolution);
  ink += sceneInk((centre + cell * vec2f(0.25, -0.25)) / u.resolution);
  ink += sceneInk((centre + cell * vec2f(-0.25, 0.25)) / u.resolution);
  ink += sceneInk((centre + cell * vec2f(0.25, 0.25)) / u.resolution);
  return ink * 0.25;
}

@fragment fn fragmentMain(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let frag = vec2f(position.x, u.resolution.y - position.y);
  let ink = pixelate(frag);
  let color = fromInk(clamp(ink, vec3f(0.0), vec3f(1.0)));
  return vec4f(clamp(color, vec3f(0.0), vec3f(1.0)), 1.0);
}
`;

export function ScreendevShader({ theme = "dark", background, time, onError, className, style }: ShaderProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const shader = useRef<ShaderHandle | null>(null);
  const latestTheme = useRef(theme);
  const latestTime = useRef(time);
  const latestOnError = useRef(onError);
  const dark = background?.dark ?? "#090909";
  const light = background?.light ?? "#ffffff";
  const animated = time === undefined;

  useEffect(() => {
    latestTheme.current = theme;
    shader.current?.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    latestTime.current = time;
    if (time !== undefined) shader.current?.render(time);
  }, [time]);

  useEffect(() => {
    latestOnError.current = onError;
  }, [onError]);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let handle: ShaderHandle | null = null;
    const controller = new AbortController();
    const options: ShaderOptions = {
      theme: latestTheme.current,
      background: { dark, light },
      autoplay: animated,
      signal: controller.signal,
      onError: (error) => {
        if (controller.signal.aborted) return;
        if (latestOnError.current) latestOnError.current(error);
        else console.error(error);
      },
    };

    createShader(element, options).then((created) => {
      if (controller.signal.aborted) { created.destroy(); return; }
      handle = created;
      shader.current = created;
      if (latestTheme.current !== options.theme) created.setTheme(latestTheme.current);
      if (latestTime.current !== undefined) created.render(latestTime.current);
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) options.onError?.(error instanceof Error ? error : new Error(String(error)));
    });
    return () => {
      controller.abort();
      handle?.destroy();
      shader.current = null;
    };
  }, [dark, light, animated]);

  return <canvas ref={canvas} className={className} style={{ display: "block", width: "100%", height: "100%", ...style }} aria-hidden="true" />;
}

const UNIFORM_FLOATS = 12;

export async function createShader(canvas: HTMLCanvasElement, options: ShaderOptions = {}): Promise<ShaderHandle> {
  const dark = parseHex(options.background?.dark ?? "#090909");
  const light = parseHex(options.background?.light ?? "#ffffff");
  options.signal?.throwIfAborted();
  if (!navigator.gpu) throw new Error("WebGPU is not available in this browser.");
  const adapter = await navigator.gpu.requestAdapter();
  options.signal?.throwIfAborted();
  if (!adapter) throw new Error("No WebGPU adapter is available.");
  const device = await adapter.requestDevice();
  let context: GPUCanvasContext | null = null;
  let configured = false;
  let released = false;
  let failure: Error | null = null;
  let handle: ShaderHandle | null = null;

  function release() {
    if (released) return;
    released = true;
    options.signal?.removeEventListener("abort", abort);
    device.removeEventListener("uncapturederror", gpuError);
    if (configured) context?.unconfigure();
    device.destroy();
  }

  function abort() {
    if (handle) handle.destroy();
    else release();
  }

  function fail(error: Error) {
    if (released) return;
    failure = error;
    if (handle) {
      handle.destroy();
      options.onError?.(error);
    } else release();
  }

  function gpuError(event: GPUUncapturedErrorEvent) {
    event.preventDefault();
    fail(new Error(event.error.message));
  }

  function checkActive() {
    options.signal?.throwIfAborted();
    if (failure) throw failure;
  }

  options.signal?.addEventListener("abort", abort, { once: true });
  device.addEventListener("uncapturederror", gpuError);
  void device.lost.then((info) => {
    if (!released) fail(new Error(`WebGPU device lost: ${info.message || info.reason}.`));
  });

  try {
    checkActive();
    const format = navigator.gpu.getPreferredCanvasFormat();
    const uniforms = device.createBuffer({ size: UNIFORM_FLOATS * 4, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    const uniformData = new Float32Array(UNIFORM_FLOATS);
    const fieldModule = device.createShaderModule({ code: FIELD_SHADER });
    const postModule = device.createShaderModule({ code: RARITY_SHADER });
    const [fieldPipeline, postPipeline, postBlendPipeline] = await Promise.all([
      device.createRenderPipelineAsync({
        layout: "auto",
        vertex: { module: fieldModule, entryPoint: "vertexMain" },
        fragment: { module: fieldModule, entryPoint: "fragmentMain", targets: [{ format: "rgba8unorm" }] },
        primitive: { topology: "triangle-list" },
      }),
      device.createRenderPipelineAsync({
        layout: "auto",
        vertex: { module: postModule, entryPoint: "vertexMain" },
        fragment: { module: postModule, entryPoint: "fragmentMain", targets: [{ format }] },
        primitive: { topology: "triangle-list" },
      }),
      device.createRenderPipelineAsync({
        layout: "auto",
        vertex: { module: postModule, entryPoint: "vertexMain" },
        fragment: { module: postModule, entryPoint: "fragmentMain", targets: [{ format, blend: { color: { srcFactor: "constant", dstFactor: "one-minus-constant" }, alpha: { srcFactor: "one", dstFactor: "zero" } } }] },
        primitive: { topology: "triangle-list" },
      }),
    ]);
    checkActive();
    const fieldBindGroup = device.createBindGroup({
      layout: fieldPipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniforms } }],
    });
    const sceneSampler = device.createSampler({ magFilter: "linear", minFilter: "linear", addressModeU: "clamp-to-edge", addressModeV: "clamp-to-edge" });
    let scene: GPUTexture | null = null;
    let sceneView: GPUTextureView | null = null;
    let postBindGroups: GPUBindGroup[] = [];

    function sceneFor(width: number, height: number) {
      if (scene && sceneView && scene.width === width && scene.height === height) return { view: sceneView, postBindGroups };
      scene?.destroy();
      scene = device.createTexture({ size: [width, height], format: "rgba8unorm", usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING });
      const view = scene.createView();
      sceneView = view;
      postBindGroups = [postPipeline, postBlendPipeline].map((pipeline) => device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: uniforms } },
          { binding: 1, resource: sceneSampler },
          { binding: 2, resource: view },
        ],
      }));
      return { view, postBindGroups };
    }

    const canvasContext = canvas.getContext("webgpu");
    if (!canvasContext) throw new Error("A WebGPU canvas context could not be created.");
    context = canvasContext;
    context.configure({ device, format, alphaMode: "opaque" });
    configured = true;

    handle = animate(options, (time, theme, pixelRatio) => {
      const { width, height } = canvas;
      const output = canvasContext.getCurrentTexture().createView();
      const target = sceneFor(width, height);
      const drawThemed = (mode: number, blend: boolean) => {
        uniformData.set([width, height, time, mode, dark[0], dark[1], dark[2], pixelRatio, light[0], light[1], light[2], 0]);
        device.queue.writeBuffer(uniforms, 0, uniformData);
        const encoder = device.createCommandEncoder();
        const fieldPass = encoder.beginRenderPass({ colorAttachments: [{ view: target.view, loadOp: "clear", storeOp: "store" }] });
        fieldPass.setPipeline(fieldPipeline);
        fieldPass.setBindGroup(0, fieldBindGroup);
        fieldPass.draw(3);
        fieldPass.end();

        const postPass = encoder.beginRenderPass({ colorAttachments: [{ view: output, loadOp: blend ? "load" : "clear", storeOp: "store" }] });
        postPass.setPipeline(blend ? postBlendPipeline : postPipeline);
        postPass.setBindGroup(0, target.postBindGroups[blend ? 1 : 0]);
        if (blend) postPass.setBlendConstant({ r: theme, g: theme, b: theme, a: theme });
        postPass.draw(3);
        postPass.end();
        device.queue.submit([encoder.finish()]);
      };
      if (theme <= 0 || theme >= 1) { drawThemed(theme, false); return; }
      drawThemed(0, false);
      drawThemed(1, true);
    }, canvas, release, device.limits.maxTextureDimension2D);
    return handle;
  } catch (error) {
    release();
    throw failure ?? error;
  }
}

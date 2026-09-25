/* Background shader by @screendev on OpenShaders: https://openshaders.com/@screendev */
"use client";

import { useEffect, useRef } from "react";
import { animate, parseHex, type ShaderHandle, type ShaderOptions, type ShaderProps } from "./shader-runtime";

const VERTEX_SHADER = `#version 300 es
void main() {
  vec2 position = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FIELD_SHADER = `#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float uLightMode;
uniform vec3 uDarkBackground;
uniform vec3 uLightBackground;
out vec4 fragColor;

const float HUE = 0.592417479;
const float HUE_SPREAD = 0.00895982143;
const float HUE_TRAVEL = 1.81699848;
const float CHROMA = 0.105831832;
const float LIGHTNESS = 0.561614811;
const float COLOUR_CYCLE = 0.157766372;
const float THETA = 2.11315823;
const float SHEAR = 0.959939361;
const float SHRINK = 0.9488644;
const float LAYERS = 73.0;
const float WARP_FREQ_X = 0.463788897;
const float WARP_FREQ_Y = 2.47012258;
const float WARP_AMP_X = 0.101558559;
const float WARP_AMP_Y = 0.0322007388;
const float ASPECT_X = 2.52213597;
const float ASPECT_Y = 0.203344896;
const float OFFSET_X = 0.407597601;
const float OFFSET_Y = -0.0278026797;
const float TILT = -1.14852977;
const float ZOOM = 1.0978626;
const float CENTRE_X = 0.22665225;
const float CENTRE_Y = 0.488793045;
const float GLOW_SIZE = 0.00219408958;
const float FALLOFF = 0.316368669;
const float VIGNETTE = 0.00159253448;
const float FLOW_SPEED = 0.433230639;
const float FLOW_DIRECTION = 1.0;
const float BREATH_RATE = 0.447767794;
const float BREATH_AMOUNT = 0.0520217642;
const float PHASE = 23.3064098;
const float ECHO = 0.0;
const float ECHO_SHIFT = 0.184553832;
const float SOFTNESS = 0.00184572604;
const float LIGHT_SWING = 0.283909291;

const float TAU = 6.28318530718;

vec3 oklchToLinear(float L, float C, float h) {
  float a = C * cos(h), b = C * sin(h);
  float l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  float m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  float s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  vec3 lms = vec3(l_, m_, s_);
  lms = lms * lms * lms;
  return mat3(4.0767416621, -1.2684380046, -0.0041960863,
              -3.3077115913, 2.6097574011, -0.7034186147,
              0.2309699292, -0.3413193965, 1.7076147010) * lms;
}

float blueNoise(vec2 p, float frame) {
  p += 5.588238 * mod(frame, 64.0);
  return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
}

void main() {
  vec2 R = iResolution.xy;
  vec2 pos = (gl_FragCoord.xy - 0.5 * R) / R.y;
  float t = iTime * FLOW_SPEED * FLOW_DIRECTION + PHASE;
  float breath = (-sin(iTime * BREATH_RATE * 1.5) + sin(iTime * BREATH_RATE + 1.0)) * 0.25 + 0.5;

  vec2 u = (pos - vec2(CENTRE_X, CENTRE_Y)) * (ZOOM - breath * BREATH_AMOUNT);
  float ct = cos(TILT), st = sin(TILT);
  u = mat2(ct, st, -st, ct) * u;

  mat2 fold = mat2(cos(THETA), sin(THETA), -SHEAR, cos(THETA));

  float hue0 = HUE * TAU;
  float hue1 = hue0 + HUE_SPREAD * TAU;
  vec3 color = vec3(0.0);

  for (float i = 1.0; i <= 96.0; i += 1.0) {
    if (i > LAYERS) break;
    u.x += -sin(u.y * WARP_FREQ_X + t + i * 0.007) * WARP_AMP_X;
    u.y += -sin(u.x * WARP_FREQ_Y - t + i * 0.02) * WARP_AMP_Y;
    u = fold * u * SHRINK;

    vec2 q = u - vec2(OFFSET_X + breath * 0.1, OFFSET_Y);
    vec2 s = vec2(q.x * ASPECT_X, q.y * ASPECT_Y);
    float glow = GLOW_SIZE / (dot(s, s) + SOFTNESS);
#ifndef SKIP_ECHO
    vec2 e = vec2((q.x - ECHO_SHIFT) * ASPECT_X, s.y);
    glow += ECHO * GLOW_SIZE / (dot(e, e) + SOFTNESS);
#endif
    glow *= 0.25 + breath * 0.4;

    float r = length(u);
    float k = sin(i * COLOUR_CYCLE + t * 1.2 + r * HUE_TRAVEL) * 0.5 + 0.5;
    vec3 tint = clamp(oklchToLinear(LIGHTNESS + LIGHT_SWING * k, CHROMA * (0.75 + 0.35 * k), mix(hue0, hue1, k)), 0.0, 1.0);
    color += glow * tint * exp2(-r * FALLOFF);
  }

  vec3 x = max(color, 0.0);
  color = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
  color = pow(clamp(color, 0.0, 1.0), vec3(0.85, 0.92, 0.98));

  float edge = smoothstep(0.5, 1.6, length(pos));
  color *= 1.0 - edge * VIGNETTE;

  vec3 dark = uDarkBackground + color * (1.0 - uDarkBackground);
  float strength = max(color.r, max(color.g, color.b));
  vec3 light = uLightBackground * (1.0 - strength) + color * 0.96;
  color = mix(dark, light, uLightMode);

  color += (blueNoise(gl_FragCoord.xy, floor(iTime * 24.0)) - 0.5) / 255.0;
  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

const POST_SHADER = `#version 300 es
precision highp float;

uniform sampler2D tScene;
uniform vec2 iResolution;
uniform float uLightMode;
uniform float uPixelRatio;
uniform vec3 uDarkBackground;
uniform vec3 uLightBackground;
out vec4 fragColor;

const float SCALE = 0.804260671;

vec3 toInk(vec3 color) {
  return mix(color - uDarkBackground, uLightBackground - color, uLightMode);
}

vec3 fromInk(vec3 ink) {
  return mix(uDarkBackground + ink, uLightBackground - ink, uLightMode);
}

vec3 sceneInk(vec2 uv) {
  return toInk(texture(tScene, clamp(uv, 0.0, 1.0)).rgb);
}

void main() {
  float cell = max(3.0, floor(SCALE * 6.0 * uPixelRatio + 0.5));
  vec2 grid = floor(gl_FragCoord.xy / cell);
  vec2 centre = (grid + 0.5) * cell;
  vec3 ink = vec3(0.0);
  ink += sceneInk((centre + cell * vec2(-0.25, -0.25)) / iResolution);
  ink += sceneInk((centre + cell * vec2(0.25, -0.25)) / iResolution);
  ink += sceneInk((centre + cell * vec2(-0.25, 0.25)) / iResolution);
  ink += sceneInk((centre + cell * vec2(0.25, 0.25)) / iResolution);
  fragColor = vec4(clamp(fromInk(clamp(ink * 0.25, 0.0, 1.0)), 0.0, 1.0), 1.0);
}
`;

export function ScreenShader({ theme = "dark", background, time, onError, className, style }: ShaderProps) {
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
    try {
      handle = createShader(element, options);
      shader.current = handle;
      if (latestTime.current !== undefined) handle.render(latestTime.current);
    } catch (error) {
      options.onError?.(error instanceof Error ? error : new Error(String(error)));
    }
    return () => {
      controller.abort();
      handle?.destroy();
      shader.current = null;
    };
  }, [dark, light, animated]);

  return <canvas ref={canvas} className={className} style={{ display: "block", width: "100%", height: "100%", ...style }} aria-hidden="true" />;
}

function attach(gl: WebGL2RenderingContext, program: WebGLProgram, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("WebGL could not create a shader object.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(`Shader failed to compile: ${gl.getShaderInfoLog(shader)}`);
  gl.attachShader(program, shader);
  gl.deleteShader(shader);
}

function compile(gl: WebGL2RenderingContext, fragmentSource: string) {
  const program = gl.createProgram();
  if (!program) throw new Error("WebGL could not create a shader program.");
  attach(gl, program, gl.VERTEX_SHADER, VERTEX_SHADER);
  attach(gl, program, gl.FRAGMENT_SHADER, fragmentSource);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`Shader failed to link: ${gl.getProgramInfoLog(program)}`);
  return program;
}

function uniforms(gl: WebGL2RenderingContext, program: WebGLProgram, names: readonly string[]) {
  return Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program, name)]));
}

function createShader(canvas: HTMLCanvasElement, options: ShaderOptions = {}): ShaderHandle {
  const context = canvas.getContext("webgl2", { alpha: false, antialias: false, depth: false, stencil: false });
  if (!context) throw new Error("WebGL2 is not available in this browser.");
  const gl = context;
  const dark = parseHex(options.background?.dark ?? "#090909");
  const light = parseHex(options.background?.light ?? "#ffffff");

  const field = compile(gl, FIELD_SHADER);
  const fieldUniforms = uniforms(gl, field, ["iResolution", "iTime", "uLightMode", "uDarkBackground", "uLightBackground"]);
  const post = compile(gl, POST_SHADER);
  const postUniforms = uniforms(gl, post, ["tScene", "iResolution", "uLightMode", "uPixelRatio", "uDarkBackground", "uLightBackground"]);
  const scene = gl.createTexture();
  const framebuffer = gl.createFramebuffer();
  if (!scene || !framebuffer) throw new Error("WebGL could not create the shader scene.");
  gl.bindTexture(gl.TEXTURE_2D, scene);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let sceneWidth = 0;
  let sceneHeight = 0;

  function fitScene() {
    if (sceneWidth === canvas.width && sceneHeight === canvas.height) return;
    sceneWidth = canvas.width;
    sceneHeight = canvas.height;
    gl.bindTexture(gl.TEXTURE_2D, scene);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, sceneWidth, sceneHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, scene, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error("WebGL shader scene is incomplete.");
  }

  const setFrame = (locations: Record<string, WebGLUniformLocation | null>, time: number, theme: number) => {
    gl.uniform2f(locations.iResolution, canvas.width, canvas.height);
    gl.uniform1f(locations.iTime, time);
    gl.uniform1f(locations.uLightMode, theme);
    gl.uniform3fv(locations.uDarkBackground, dark);
    gl.uniform3fv(locations.uLightBackground, light);
  };

  return animate(options, (time, theme, pixelRatio) => {
    fitScene();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.useProgram(field);
    setFrame(fieldUniforms, time, theme);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(post);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, scene);
    gl.uniform1i(postUniforms.tScene, 0);
    gl.uniform2f(postUniforms.iResolution, canvas.width, canvas.height);
    gl.uniform1f(postUniforms.uLightMode, theme);
    gl.uniform1f(postUniforms.uPixelRatio, pixelRatio);
    gl.uniform3fv(postUniforms.uDarkBackground, dark);
    gl.uniform3fv(postUniforms.uLightBackground, light);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, canvas, () => {
    gl.deleteProgram(field);
    gl.deleteProgram(post);
    gl.deleteFramebuffer(framebuffer);
    gl.deleteTexture(scene);
  }, Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)));
}

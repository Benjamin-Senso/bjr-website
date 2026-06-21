'use client'

import { useEffect, useRef } from 'react'

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

// Animated, domain-warped value-noise "aurora". Purple light that slowly drifts
// near the top and fades toward the bottom. Kept deliberately low-contrast/subtle.
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  // Quintic interpolation — C2 continuous, removes the grid/blocky artifacts.
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
  float b = dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.55;
  // Fewer octaves + gentle lacunarity keeps it soft and cloud-like.
  for (int i = 0; i < 4; i++) {
    v += amp * noise(p);
    p = p * 1.9 + 11.3;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv;
  p.x *= uRes.x / uRes.y;

  float t = uTime * 0.08;

  // Large, soft features with a slow domain warp — smooth, billowing movement
  // rather than fast detail. Low frequencies keep it cloud-like.
  vec2 q = vec2(fbm(p * 1.2 + vec2(0.0, t)), fbm(p * 1.2 + vec2(5.2, t * 0.8) + 1.7));
  float n = fbm(p * 1.6 + q * 1.2 - vec2(t * 0.5, t * 0.35));

  // Gentle, wide contrast curve — no hard edges.
  float intensity = smoothstep(0.05, 0.95, n + 0.5);
  intensity = intensity * intensity * (3.0 - 2.0 * intensity); // extra easing

  // Soft global breathing so the motion stays clearly visible but never harsh.
  intensity *= 0.82 + 0.18 * sin(uTime * 0.45 + q.x * 3.0);

  // Stronger at the top, gone by the bottom.
  float fall = smoothstep(0.0, 1.0, uv.y);
  fall *= fall;

  vec3 deep = vec3(0.32, 0.25, 0.52);
  vec3 accent = vec3(0.607, 0.545, 0.784); // #9B8BC8
  vec3 col = mix(deep, accent, smoothstep(0.2, 1.0, intensity));

  float alpha = intensity * fall * 0.62;
  gl_FragColor = vec4(col, alpha);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function AuroraBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = (canvas.getContext('webgl', { alpha: true, antialias: true }) ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return

    const vert = compile(gl, gl.VERTEX_SHADER, VERT)
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vert || !frag) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    // Fullscreen triangle.
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, 'uRes')
    const uTime = gl.getUniformLocation(program, 'uTime')

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const resize = () => {
      const w = Math.floor(canvas.clientWidth * dpr)
      const h = Math.floor(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const draw = (timeSeconds: number) => {
      gl.uniform1f(uTime, timeSeconds)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    let raf = 0
    let start = 0
    const loop = (now: number) => {
      if (!start) start = now
      if (!document.hidden) draw((now - start) / 1000)
      raf = requestAnimationFrame(loop)
    }

    if (reduceMotion) {
      resize()
      draw(0) // single static frame
    } else {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      gl.deleteProgram(program)
      gl.deleteBuffer(buffer)
      gl.deleteShader(vert)
      gl.deleteShader(frag)
    }
  }, [])

  return <canvas ref={canvasRef} className="aurora" aria-hidden="true" />
}

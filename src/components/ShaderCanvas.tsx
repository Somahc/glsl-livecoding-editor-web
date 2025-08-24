import { useEffect, useRef } from "react";
import { glCreateProgram } from "../gl/glCreateProgram";
import { glCreateBuffer } from "../gl/glCreateBuffer";
import { useElement } from "../utils/useElement";

const vs = `#version 300 es
      layout(location=0) in vec2 pos;       // ← 固定ロケーション、板ポリなのでZは0で固定するから二次元
      void main(){ gl_Position = vec4(pos, 0.0, 1.0); }`;

export const ShaderCanvas = ({
  paused = false,
  fsSource,
}: {
  paused: boolean;
  fsSource: string | null;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useElement<HTMLCanvasElement | null>(canvasRef);

  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const progRef = useRef<WebGLProgram | null>(null);

  const locRRef = useRef<WebGLUniformLocation | null>(null);
  const locTRef = useRef<WebGLUniformLocation | null>(null);

  useEffect(() => {
    if (canvas == null) return;

    // キャンバスにサイズを与える（CSSでもOK）
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const gl = canvas.getContext("webgl2", { alpha: false });
    if (!gl) return;
    glRef.current = gl;

    // const vs = `#version 300 es
    //   layout(location=0) in vec2 pos;       // ← 固定ロケーション、板ポリなのでZは0で固定するから二次元
    //   void main(){ gl_Position = vec4(pos, 0.0, 1.0); }`;

    const fsDummy = `#version 300 es 
      precision highp float; out vec4 o;
      uniform vec2 r; uniform float t;
      void main(){ vec2 uv=(gl_FragCoord.xy-0.5*r)/r.y; float v=.02/abs(length(uv)-.5+.1*sin(t)); o=vec4(vec3(v),1.); }`;

    const prg = glCreateProgram(gl, vs, fsDummy);
    progRef.current = prg;

    const attStride = 2;

    // フルスクリーントライアングルの頂点位置
    const vertexPosition = new Float32Array([-1, -1, 3, -1, -1, 3]);

    const vbo = glCreateBuffer(gl, vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    gl.vertexAttribPointer(0, attStride, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    locRRef.current = gl.getUniformLocation(prg, "r");
    locTRef.current = gl.getUniformLocation(prg, "t");

    // ===== リサイズ =====
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || canvas.parentElement?.clientWidth || 1;
      const h = canvas.clientHeight || canvas.parentElement?.clientHeight || 1;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // ===== ループ =====
    let id = 0;
    const start = performance.now();
    const tick = (now: number) => {
      id = requestAnimationFrame(tick);
      if (paused) return;
      gl.useProgram(prg); // 念のため
      gl.uniform2f(locRRef.current, canvas.width, canvas.height);
      gl.uniform1f(locTRef.current, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    id = requestAnimationFrame(tick);

    canvas.addEventListener("webglcontextlost", (e) => {
      console.error("lost");
      e.preventDefault();
    });
    canvas.addEventListener("webglcontextrestored", () => {
      console.warn("restored");
    });

    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.removeEventListener("webglcontextlost", (e) => {
        console.error("lost");
        e.preventDefault();
      });
      canvas.removeEventListener("webglcontextrestored", () => {
        console.warn("restored");
      });
    };
  }, [paused, canvas]);

  useEffect(() => {
    if (!fsSource) return;

    const gl = glRef.current;
    if (!gl) return;

    try {
      //   const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      //   gl.shaderSource(fs, fsSource);
      //   gl.compileShader(fs);
      //   if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      //     console.error("[FS ERROR]", gl.getShaderInfoLog(fs) || "");
      //     gl.deleteShader(fs);
      //     return; // 失敗したら旧プログラムを使い続ける
      //   }
      //   const p = gl.createProgram()!;
      //     gl.attachShader(p, vs);
      //   gl.attachShader(p, fs);
      //   gl.linkProgram(p);
      //   gl.deleteShader(fs);
      //   if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      //     console.error("[LINK ERROR]", gl.getProgramInfoLog(p) || "");
      //     gl.deleteProgram(p);
      //     return;
      //   }
      const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;

      gl.shaderSource(vertexShader, vs);
      gl.compileShader(vertexShader);

      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(vertexShader) ?? undefined);
        return;
      }

      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(fragmentShader, fsSource);
      gl.compileShader(fragmentShader);

      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(fragmentShader) ?? undefined);
        return;
      }

      const p = gl.createProgram()!;
      gl.attachShader(p, vertexShader);
      gl.attachShader(p, fragmentShader);
      gl.linkProgram(p);

      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(p) ?? undefined);
        return;
      }

      // スワップ
      if (progRef.current) gl.deleteProgram(progRef.current);
      progRef.current = p;
      gl.useProgram(p);

      locRRef.current = gl.getUniformLocation(p, "r");
      locTRef.current = gl.getUniformLocation(p, "t");

      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    } catch (e) {
      console.error(e);
    }
  }, [fsSource]);

  // 親要素側に高さが無いと 0px になるので注意
  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100vw", height: "100vh" }}
    />
  );
};

export default ShaderCanvas;

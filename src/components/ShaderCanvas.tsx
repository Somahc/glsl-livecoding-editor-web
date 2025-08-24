import { useEffect, useRef } from "react";

export const ShaderCanvas = ({ paused = false }: { paused: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || initializedRef.current) return;
    initializedRef.current = true;

    // キャンバスにサイズを与える（CSSでもOK）
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const gl = canvas.getContext("webgl2", { alpha: false });
    if (!gl) return;

    // ===== シェーダ作成（コンパイルチェック付き）=====
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(
      gl.VERTEX_SHADER,
      `#version 300 es
      layout(location=0) in vec2 a;       // ← 固定ロケーション
      void main(){ gl_Position = vec4(a, 0.0, 1.0); }`
    );
    const fs = compile(
      gl.FRAGMENT_SHADER,
      `#version 300 es
      precision highp float; out vec4 o;
      uniform vec2 r; uniform float t;
      void main(){
        vec2 uv=(gl_FragCoord.xy-0.5*r)/r.y;
        float v=.02/abs(length(uv)-.5+.1*sin(t));
        o=vec4(vec3(v),1.);
      }`
    );
    if (!vs || !fs) return;

    const p = gl.createProgram()!;
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(p));
      return;
    }
    gl.useProgram(p); // ← 重要！！

    const locR = gl.getUniformLocation(p, "r");
    const locT = gl.getUniformLocation(p, "t");

    // ===== フルスクリーントライアングル =====
    const vb = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const va = gl.createVertexArray()!;
    gl.bindVertexArray(va);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

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
    resize(); // ← 初回に明示的に実行

    // ===== ループ =====
    let id = 0;
    const start = performance.now();
    const tick = (now: number) => {
      id = requestAnimationFrame(tick);
      if (paused) return;
      gl.useProgram(p); // 念のため
      gl.bindVertexArray(va);
      gl.uniform2f(locR, canvas.width, canvas.height);
      gl.uniform1f(locT, (now - start) / 1000);
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
      initializedRef.current = false;
      canvas.removeEventListener("webglcontextlost", (e) => {
        console.error("lost");
        e.preventDefault();
      });
      canvas.removeEventListener("webglcontextrestored", () => {
        console.warn("restored");
      });
    };
  }, [paused]);

  // 親要素側に高さが無いと 0px になるので注意
  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100vw", height: "100vh" }}
    />
  );
};

export default ShaderCanvas;

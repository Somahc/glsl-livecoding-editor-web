import { useEffect, useRef } from "react";
import { glCreateProgram } from "../../gl/glCreateProgram";
import { glCreateBuffer } from "../../gl/glCreateBuffer";
import { useElement } from "../../utils/useElement";
import { glCreateShader } from "../../gl/glCreateShader";
import { DEFAULT_FS_CODE } from "../../App";
import style from "./index.module.css";
import { compileErrorMessageAtom } from "../../stores/atom/compileErrorMessage";
import { useSetAtom } from "jotai";

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
  const glVertexShaderRef = useRef<WebGLShader | null>(null);
  const glFragmentShaderRef = useRef<WebGLShader | null>(null);
  const progRef = useRef<WebGLProgram | null>(null);

  const locResolutionRef = useRef<WebGLUniformLocation | null>(null);
  const locTimeRef = useRef<WebGLUniformLocation | null>(null);

  const setCompileErrorMessage = useSetAtom(compileErrorMessageAtom);

  useEffect(() => {
    if (canvas == null) return;

    const gl = canvas.getContext("webgl2", { alpha: false });
    if (!gl) return;
    glRef.current = gl;

    if (!glVertexShaderRef.current)
      glVertexShaderRef.current = glCreateShader(gl, "vertex", vs);

    glFragmentShaderRef.current = glCreateShader(
      gl,
      "fragment",
      DEFAULT_FS_CODE
    );

    if (
      glVertexShaderRef.current == null ||
      glFragmentShaderRef.current == null
    ) {
      console.error(
        "glVertexShaderRef.current or glFragmentShaderRef.current is null"
      );
      return;
    }

    const prg = glCreateProgram(
      gl,
      glVertexShaderRef.current,
      glFragmentShaderRef.current
    );

    progRef.current = prg;

    const attStride = 2;

    // フルスクリーントライアングルの頂点位置
    const vertexPosition = new Float32Array([-1, -1, 3, -1, -1, 3]);

    const vbo = glCreateBuffer(gl, vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    gl.vertexAttribPointer(0, attStride, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    locResolutionRef.current = gl.getUniformLocation(prg, "resolution");
    locTimeRef.current = gl.getUniformLocation(prg, "time");

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
      gl.useProgram(progRef.current); // 念のため
      gl.uniform2f(locResolutionRef.current, canvas.width, canvas.height);
      gl.uniform1f(locTimeRef.current, (now - start) / 1000);
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
    if (fsSource == null) return;
    const gl = glRef.current;
    const vsObj = glVertexShaderRef.current;
    if (!gl || !vsObj) return;

    try {
      const fsObj = glCreateShader(gl, "fragment", fsSource);
      if (fsObj == null) return;

      const newProg = glCreateProgram(gl, vsObj, fsObj);
      gl.useProgram(newProg);
      const newLocResolution = gl.getUniformLocation(newProg, "resolution");
      const newLocTime = gl.getUniformLocation(newProg, "time");

      // スワップ
      if (progRef.current) gl.deleteProgram(progRef.current);
      progRef.current = newProg;
      locResolutionRef.current = newLocResolution;
      locTimeRef.current = newLocTime;
      setCompileErrorMessage("");
    } catch (e) {
      if (e instanceof Error) {
        setCompileErrorMessage(e.message);
      } else if (typeof e === "string") {
        setCompileErrorMessage(e);
      } else {
        setCompileErrorMessage(JSON.stringify(e, null, 2));
      }
    }
  }, [fsSource, setCompileErrorMessage]);

  return <canvas ref={canvasRef} className={style.canvas} />;
};

export default ShaderCanvas;

export function glCreateShader(
  gl: WebGLRenderingContext,
  type: "vertex" | "fragment",
  source: string
): WebGLShader | null {
  const shader = gl.createShader(
    type === "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER
  )!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const rawLog = gl.getShaderInfoLog(shader) ?? "";

    // 特殊文字を削除
    const cleanedLog = (() => {
      let end = rawLog.length;
      while (end > 0) {
        const codePoint = rawLog.charCodeAt(end - 1);
        const isAsciiControl = codePoint === 0x7f || codePoint <= 0x1f; // DEL or C0 controls
        if (isAsciiControl) {
          end -= 1;
          continue;
        }
        break;
      }
      return rawLog.slice(0, end).trim();
    })();

    console.error(cleanedLog || undefined);
    throw new Error(cleanedLog || undefined);
  }

  return shader;
}

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
    console.error(type);
    console.error(gl.getShaderInfoLog(shader) ?? undefined);
    const log = gl.getShaderInfoLog(shader) ?? undefined;
    const numbered = source
      .split("\n")
      .map((l, i) => `${String(i + 1).padStart(3, " ")}| ${l}`)
      .join("\n");
    gl.deleteShader(shader);
    throw new Error(
      `[${type.toUpperCase()} COMPILE]\n${log}\n---SOURCE---\n${numbered}`
    );
  }

  return shader;
}

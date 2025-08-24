export function glCreateProgram(
  gl: WebGLRenderingContext,
  vert: string,
  frag: string
): WebGLProgram {
  // vertex shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;

  gl.shaderSource(vertexShader, vert);
  gl.compileShader(vertexShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(vertexShader) ?? undefined);
  }

  // fragment shader
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;

  gl.shaderSource(fragmentShader, frag);
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(fragmentShader) ?? undefined);
  }

  // program
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? undefined);
  }

  // いらないので削除
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  gl.useProgram(program);
  return program;
}

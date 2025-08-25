export function glCreateProgram(
  gl: WebGLRenderingContext,
  vert: WebGLShader,
  frag: WebGLShader
): WebGLProgram {
  const program = gl.createProgram()!;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const msg = gl.getProgramInfoLog(program) ?? undefined;
    gl.deleteProgram(program);
    throw new Error(msg);
  }

  // いらないので削除
  gl.deleteShader(vert);
  gl.deleteShader(frag);

  gl.useProgram(program);
  return program;
}

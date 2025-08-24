export function glCreateBuffer(
  gl: WebGL2RenderingContext,
  array: Float32Array
): WebGLBuffer {
  const buffer = gl.createBuffer()!; // バッファオブジェクト作成

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // バッファをバインド
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW); // バッファにデータをセット
  gl.bindBuffer(gl.ARRAY_BUFFER, null); // バッファをアンバインド

  return buffer;
}

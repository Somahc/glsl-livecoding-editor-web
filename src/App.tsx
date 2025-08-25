import Editor from "./components/Editor";
import ShaderCanvas from "./components/ShaderCanvas";
import { useState } from "react";

export const DEFAULT_FS_CODE = `#version 300 es 
precision highp float; out vec4 o;
uniform vec2 r; uniform float t;

void main()
{
  vec2 uv=(gl_FragCoord.xy-0.5*r)/r.y;
  float v=.02/abs(length(uv)-.5+.1*sin(t));
  o=vec4(vec3(v),1.);
}`;

function App() {
  const [code, setCode] = useState<string>(DEFAULT_FS_CODE);
  const [fsSource, setFsSource] = useState<string | null>(DEFAULT_FS_CODE);

  const handleSave = () => {
    setFsSource(code);
  };
  return (
    <>
      <Editor value={code} onChange={setCode} onSave={handleSave} />
      <ShaderCanvas paused={false} fsSource={fsSource} />
    </>
  );
}

export default App;

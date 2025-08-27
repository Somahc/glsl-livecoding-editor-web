import Editor from "./components/Editor/Editor";
import ShaderCanvas from "./components/ShaderCanvas/ShaderCanvas";
import { useState } from "react";
import UpperTimeStatsPanel from "./components/UpperTimeStatsPanel/UpperTimeStatsPanel";
import style from "./index.module.css";
import BottomStatsSection from "./components/BottomStatsSection/BottomStatsSection";

export const DEFAULT_FS_CODE = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2 resolution;
uniform float time;
uniform float bpm;

void main()
{
  vec2 uv=(gl_FragCoord.xy-0.5*resolution)/resolution.y;
  float v=.02/abs(length(uv)-.5+.1*sin(time));
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
      <div className={style.container}>
        <section>
          <UpperTimeStatsPanel />
        </section>
        <section className={style.editor}>
          <Editor value={code} onChange={setCode} onSave={handleSave} />
        </section>
        <section>
          <BottomStatsSection />
        </section>
      </div>
      <ShaderCanvas paused={false} fsSource={fsSource} />
    </>
  );
}

export default App;

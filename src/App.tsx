import Editor from "./components/Editor";
import ShaderCanvas from "./components/ShaderCanvas";

function App() {
  return (
    <>
      <Editor />
      <ShaderCanvas paused={false} />
    </>
  );
}

export default App;

import ReactCodeMirror from "@uiw/react-codemirror";
import { type SetStateAction, useCallback, useState } from "react";
import { cppLanguage } from "@codemirror/lang-cpp";

const Editor = () => {
  const [value, setValue] = useState<string>("");
  const onChange = useCallback((val: SetStateAction<string>) => {
    setValue(val);
  }, []);
  return (
    <>
      <h2>Codemirror Sample</h2>
      <ReactCodeMirror
        value={value}
        onChange={onChange}
        extensions={[cppLanguage]}
      />
    </>
  );
};

export default Editor;

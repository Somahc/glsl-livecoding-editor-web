import ReactCodeMirror from "@uiw/react-codemirror";
import { cppLanguage } from "@codemirror/lang-cpp";
import { useEffect, useMemo, useRef } from "react";
import { keymap } from "@codemirror/view";

const Editor = ({
  value,
  onChange,
  onSave,
}: {
  value: string;
  onChange: (val: string) => void;
  onSave: () => void;
}) => {
  const onSaveRef = useRef(onSave);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const saveKeymap = useMemo(
    () =>
      keymap.of([
        {
          key: "Mod-s", // Ctrl+S / Cmd+S
          preventDefault: true,
          run: () => {
            onSaveRef.current();
            console.log("save");
            return true;
          },
        },
      ]),
    []
  );
  return (
    <>
      <ReactCodeMirror
        value={value}
        onChange={onChange}
        extensions={[cppLanguage, saveKeymap]}
      />
    </>
  );
};

export default Editor;

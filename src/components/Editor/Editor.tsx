import { tags } from "@lezer/highlight";
import ReactCodeMirror from "@uiw/react-codemirror";
import { glsl } from "codemirror-lang-glsl";
import { useEffect, useMemo, useRef } from "react";
import { EditorView, keymap } from "@codemirror/view";
import "./index.module.css";
import { textBackgroundExtension } from "./textBackgroundExtension";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";

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
        extensions={[
          glsl(),
          saveKeymap,
          myTheme,
          textBackgroundExtension,
          syntaxHighlighting(myHighlightStyle),
        ]}
      />
    </>
  );
};

const myTheme = EditorView.theme({
  "&": {
    color: "white",
    fontSize: "14px",
    "&.cm-editor": {
      background: "rgb(255, 255, 255, 0)",
    },
    "&.cm-focused": {
      outline: "none",
    },
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    border: "none",
  },
});

const myHighlightStyle = HighlightStyle.define([
  { tag: tags.comment, color: "green" },
  { tag: tags.keyword, color: "orange" },
  { tag: tags.typeName, color: "blue" },
  { tag: tags.number, color: "red" },
]);

export default Editor;

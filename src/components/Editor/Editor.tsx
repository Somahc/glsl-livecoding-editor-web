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
          saveKeymap,
          glsl(),
          textBackgroundExtension,
          myTheme,
          syntaxHighlighting(myHighlightStyle),
        ]}
      />
    </>
  );
};

const myTheme = EditorView.theme({
  "&": {
    "&.cm-editor": {
      background: "rgba(255, 0, 0, 0)",
    },
    "&.cm-focused": {
      outline: "none",
    },
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    border: "none",
  },
  ".cm-scroller": {
    color: "white",
    fontSize: "18px",
    fontFamily: "'Space Mono', monospace",
    fontWeight: "400",
    fontStyle: "normal",
  },
  ".cm-line": {
    paddingLeft: "0px",
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "white",
    borderLeftWidth: "3px",
  },
});

const myHighlightStyle = HighlightStyle.define([
  { tag: tags.comment, color: "green" },
  { tag: tags.keyword, color: "orange" },
  { tag: tags.typeName, color: "rgb(82, 91, 219)" },
  { tag: tags.number, color: "red" },
]);

export default Editor;

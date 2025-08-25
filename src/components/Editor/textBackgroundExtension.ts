// textBackgroundExtension.ts
import { RangeSetBuilder, type Extension } from "@codemirror/state";
import {
  EditorView,
  Decoration,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";

const textBgMark = Decoration.mark({ class: "cm-textBg" });

const TextBackground = ViewPlugin.fromClass(
  class {
    decorations;
    constructor(view: EditorView) {
      this.decorations = this.build(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.build(update.view);
      }
    }
    private build(view: EditorView) {
      const builder = new RangeSetBuilder<Decoration>();
      for (const { from, to } of view.visibleRanges) {
        let pos = from;
        while (pos <= to) {
          const line = view.state.doc.lineAt(pos);
          const s = line.text;

          // 行に非空白が1つでもあれば、その行頭→行末まで塗る
          if (/\S/.test(s)) {
            builder.add(line.from, line.to, textBgMark);
          }
          pos = line.to + 1;
        }
      }
      return builder.finish();
    }
  },
  { decorations: (v) => v.decorations }
);

export const textBackgroundExtension: Extension = [
  TextBackground,
  EditorView.baseTheme({
    ".cm-textBg": {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
      borderRadius: "0",
    },
  }),
];

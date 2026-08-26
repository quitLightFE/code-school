import { Monaco } from "@monaco-editor/react";
import { emmetHTML, emmetCSS, emmetJSX } from "emmet-monaco-es";

let emmetInitialized = false;
let themesInitialized = false;

export const handleEditorWillMount = (monaco: Monaco) => {
  if (!emmetInitialized) {
    emmetHTML(monaco, ["html"]);
    emmetCSS(monaco, ["css"]);
    emmetJSX(monaco, ["javascript"]);

    emmetInitialized = true;
  }

  if (!themesInitialized) {
    monaco.editor.defineTheme("heroui-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "71717a", fontStyle: "italic" },
        { token: "keyword", foreground: "f43f5e" },
        { token: "number", foreground: "22c55e" },
        { token: "string", foreground: "eab308" },
        { token: "type", foreground: "3b82f6" },
      ],
      colors: {
        "editor.background": "#09090b",
        "editor.foreground": "#fafafa",
        "editorLineNumber.foreground": "#3f3f46",
        "editorLineNumber.activeForeground": "#a1a1aa",
        "editor.lineHighlightBackground": "#18181b",
        "editorCursor.foreground": "#fafafa",
      },
    });

    monaco.editor.defineTheme("heroui-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "a1a1aa", fontStyle: "italic" },
        { token: "keyword", foreground: "e11d48" },
        { token: "number", foreground: "16a34a" },
        { token: "string", foreground: "ca8a04" },
        { token: "type", foreground: "2563eb" },
      ],
      colors: {
        "editor.background": "#ffffff",
        "editor.foreground": "#09090b",
        "editorLineNumber.foreground": "#a1a1aa",
        "editorLineNumber.activeForeground": "#71717a",
        "editor.lineHighlightBackground": "#f4f4f5",
        "editorCursor.foreground": "#09090b",
      },
    });

    themesInitialized = true;
  }
};
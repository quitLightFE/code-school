import Editor from "@monaco-editor/react";
import { Tabs, Card } from "@heroui/react";
import { useTheme } from "next-themes";
import { handleEditorWillMount } from "#/utils/editorConfig";

const EDITORS_CONFIG = [
  { id: "html", label: "HTML", language: "html" },
  { id: "css", label: "CSS", language: "css" },
  { id: "js", label: "JavaScript", language: "javascript" },
] as const;

type EditorPanelProps = {
  code: { html: string; css: string; js: string };
  onChange: (type: "html" | "css" | "js", val: string) => void;
  isLocked: boolean;
  isHiddenOnMobile: boolean;
};

export function EditorPanel({
  code,
  onChange,
  isLocked,
  isHiddenOnMobile,
}: EditorPanelProps) {
  const { resolvedTheme } = useTheme();
  const editorTheme =
    resolvedTheme === "light" ? "heroui-light" : "heroui-dark";

  return (
    <Card className={`p-0 ${isHiddenOnMobile ? "hidden lg:block" : "block"}`}>
      <Tabs aria-label="Editors" className="w-full">
        <Tabs.List className="w-full border-b dark:border-zinc-800 rounded-none bg-transparent">
          {EDITORS_CONFIG.map(({ id, label }) => (
            <Tabs.Tab key={id} id={id}>
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {EDITORS_CONFIG.map(({ id, language }) => (
          <Tabs.Panel key={id} id={id} className="p-0">
            <Editor
              height="80vh"
              defaultLanguage={language}
              value={code[id]}
              onChange={(v) => onChange(id, v || "")}
              beforeMount={handleEditorWillMount}
              theme={editorTheme}
              options={{
                minimap: { enabled: false },
                fontSize: 18,
                automaticLayout: true,
                readOnly: isLocked,
                wordWrap: "on",
              }}
            />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Card>
  );
}

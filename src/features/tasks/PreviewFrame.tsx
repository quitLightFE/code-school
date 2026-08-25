import { Card } from "@heroui/react";

export function PreviewFrame({ srcDoc }: { srcDoc: string }) {
  return (
    <Card className="flex-1 p-0 overflow-hidden">
      <iframe
        title="preview"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-modals"
        className="h-full w-full bg-white"
      />
    </Card>
  );
}

import { Card, Code } from "@sanity/ui";

interface CodeContentProps {
  /** Source code to display. */
  code: string;
  /** Programming language for syntax highlighting. */
  language?: string;
}

export function CodeContent({ code, language }: CodeContentProps) {
  return (
    <Card padding={4} radius={2} tone="transparent" style={{ overflowX: "auto" }}>
      <Code size={1} language={language}>
        {code}
      </Code>
    </Card>
  );
}

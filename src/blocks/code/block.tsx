import { CodeContent } from "./content";

interface HandbookCodeValue {
  /** Document type identifier. */
  _type: "handbook.code";
  /** Source code to display. */
  code: string;
  /** Programming language for syntax highlighting. */
  language?: string;
}

export function CodeBlock({ value }: { value: HandbookCodeValue }) {
  return (
    <div style={{ marginBlock: "1.5rem" }}>
      <CodeContent code={value.code} language={value.language} />
    </div>
  );
}

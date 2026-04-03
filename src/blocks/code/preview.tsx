import type { PreviewProps } from "sanity";

import { isDefined } from "../../lib/utils";
import { CodeContent } from "./content";

interface CodePreviewProps extends PreviewProps {
  /** Source code to display. */
  code?: string;
  /** Programming language for syntax highlighting. */
  language?: string;
}

export function CodePreview({ code, language }: CodePreviewProps) {
  if (!isDefined(code)) return null;

  return <CodeContent code={code} language={language} />;
}

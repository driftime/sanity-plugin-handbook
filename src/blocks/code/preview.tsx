import type { PreviewProps } from "sanity";

import { CodeContent } from "@/blocks/code/content";
import { isDefined } from "@/lib/utils";

export type CodePreviewProps = PreviewProps & {
  code?: string;
  language?: string;
};

export function CodePreview({ code, language }: CodePreviewProps) {
  if (!isDefined(code)) return null;

  return <CodeContent code={code} language={language} />;
}

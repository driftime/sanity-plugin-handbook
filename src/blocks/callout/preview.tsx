import type { PreviewProps } from "sanity";

import type { CalloutVariant } from "./content";
import { CalloutContent } from "./content";

interface CalloutPreviewProps extends PreviewProps {
  /** Visual style variant for the callout. */
  variant?: CalloutVariant;
  /** Plain text content extracted from the callout body. */
  text?: string;
}

export function CalloutPreview({ variant, text }: CalloutPreviewProps) {
  return <CalloutContent variant={variant ?? "tip"}>{text}</CalloutContent>;
}

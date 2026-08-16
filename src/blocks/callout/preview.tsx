import type { PreviewProps } from "sanity";

import { CalloutContent } from "@/blocks/callout/content";
import type { CalloutVariant } from "@/blocks/callout/content";
import type { SanityHandbookCallout } from "@/schemas/blocks/callout";

export type CalloutPreviewProps = PreviewProps & {
  variant?: CalloutVariant;
  body?: SanityHandbookCallout["body"];
};

export function CalloutPreview({ variant, body }: CalloutPreviewProps) {
  return (
    <CalloutContent variant={variant ?? "tip"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {body?.map(({ _key, children }) => (
          <div key={_key} style={{ whiteSpace: "pre-wrap" }}>
            {children.map((child) => child.text).join("")}
          </div>
        ))}
      </div>
    </CalloutContent>
  );
}

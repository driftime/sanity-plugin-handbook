import type { ComponentProps } from "react";

import { Caption } from "@/components/caption";
import { isDefined } from "@/lib/utils";

export type ImageContentProps = ComponentProps<"div"> & {
  url: string;
  alt?: string;
  caption?: string;
};

export function ImageContent({ url, alt, caption, ...props }: ImageContentProps) {
  return (
    <div {...props}>
      <img src={url} alt={alt ?? ""} style={{ display: "block", maxWidth: "100%", borderRadius: 4 }} />
      {isDefined(caption) && <Caption>{caption}</Caption>}
    </div>
  );
}

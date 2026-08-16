import type { ComponentProps } from "react";

import { ImageContent } from "@/blocks/image/content";
import { contentSpacing } from "@/config/layout";
import { isDefined } from "@/lib/utils";
import type { SanityHandbookImage } from "@/schemas/blocks/image";

export type ImageBlockProps = Omit<ComponentProps<typeof ImageContent>, "url" | "alt" | "caption"> & {
  value: SanityHandbookImage;
};

export function ImageBlock({ value, style, ...props }: ImageBlockProps) {
  if (!isDefined(value.asset?.url)) return null;

  return (
    <ImageContent
      url={value.asset.url}
      alt={value.alt}
      caption={value.caption}
      style={{ marginBlock: contentSpacing.media, ...style }}
      {...props}
    />
  );
}

import type { PreviewProps } from "sanity";

import { ImageContent } from "@/blocks/image/content";
import { isDefined } from "@/lib/utils";

export type ImagePreviewProps = PreviewProps & {
  url?: string;
  alt?: string;
  caption?: string;
};

export function ImagePreview({ url, alt, caption }: ImagePreviewProps) {
  if (!isDefined(url)) return null;

  return <ImageContent url={url} alt={alt} caption={caption} style={{ padding: 8 }} />;
}

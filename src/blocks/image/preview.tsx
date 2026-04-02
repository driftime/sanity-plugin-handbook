import type { PreviewProps } from "sanity";

import { isDefined } from "../../lib/utils";
import { ImageContent } from "./content";

interface ImagePreviewProps extends PreviewProps {
  /** Resolved image URL from the asset. */
  url?: string;
  /** Alternative text for screen readers. */
  alt?: string;
  /** Text displayed beneath the image. */
  caption?: string;
}

export function ImagePreview({ url, alt, caption }: ImagePreviewProps) {
  if (!isDefined(url)) return null;

  return (
    <div style={{ padding: "0.5rem" }}>
      <ImageContent url={url} alt={alt} caption={caption} />
    </div>
  );
}

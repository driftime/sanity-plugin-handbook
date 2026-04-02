import type { PreviewProps } from "sanity";

import { isDefined } from "../../lib/utils";
import { VideoContent } from "./content";

interface VideoPreviewProps extends PreviewProps {
  /** Resolved video URL from the asset. */
  url?: string;
  /** Text displayed beneath the video. */
  caption?: string;
}

export function VideoPreview({ url, caption }: VideoPreviewProps) {
  if (!isDefined(url)) return null;

  return (
    <div style={{ padding: "0.5rem" }}>
      <VideoContent url={url} caption={caption} />
    </div>
  );
}

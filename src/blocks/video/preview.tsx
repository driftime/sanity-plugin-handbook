import type { PreviewProps } from "sanity";

import { VideoContent } from "@/blocks/video/content";
import { isDefined } from "@/lib/utils";

export type VideoPreviewProps = PreviewProps & {
  url?: string;
  caption?: string;
};

export function VideoPreview({ url, caption }: VideoPreviewProps) {
  if (!isDefined(url)) return null;

  return <VideoContent url={url} caption={caption} style={{ padding: 8 }} />;
}

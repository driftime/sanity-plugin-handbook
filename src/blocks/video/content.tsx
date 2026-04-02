import { Text } from "@sanity/ui";

import { isDefined } from "../../lib/utils";

interface VideoContentProps {
  /** Video source URL. */
  url: string;
  /** Text displayed beneath the video. */
  caption?: string;
}

export function VideoContent({ url, caption }: VideoContentProps) {
  return (
    <>
      <video
        src={url}
        controls
        style={{
          display: "block",
          maxWidth: "100%",
          borderRadius: "0.25rem",
          overflow: "hidden",
          WebkitTransform: "translateZ(0)",
        }}
      >
        <track kind="captions" label={caption ?? "Video"} />
      </video>
      {isDefined(caption) && (
        <div style={{ marginBlockStart: "0.75rem" }}>
          <Text size={1} muted style={{ fontStyle: "italic" }}>
            {caption}
          </Text>
        </div>
      )}
    </>
  );
}

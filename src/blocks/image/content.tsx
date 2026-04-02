import { Text } from "@sanity/ui";

import { isDefined } from "../../lib/utils";

interface ImageContentProps {
  /** Image source URL. */
  url: string;
  /** Alternative text for screen readers. */
  alt?: string;
  /** Text displayed beneath the image. */
  caption?: string;
}

export function ImageContent({ url, alt, caption }: ImageContentProps) {
  return (
    <>
      <img
        src={url}
        alt={alt ?? ""}
        style={{ display: "block", maxWidth: "100%", borderRadius: "0.25rem", overflow: "hidden" }}
      />
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

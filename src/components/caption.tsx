import { Text } from "@sanity/ui";
import type { ComponentProps } from "react";

export type CaptionProps = ComponentProps<"div"> & {
  children: string;
};

export function Caption({ children, style, ...props }: CaptionProps) {
  return (
    <div style={{ marginBlockStart: 12, ...style }} {...props}>
      <Text size={1} muted style={{ fontStyle: "italic" }}>
        {children}
      </Text>
    </div>
  );
}

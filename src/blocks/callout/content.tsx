import { Card, Flex, Text } from "@sanity/ui";
import type { ReactNode } from "react";

import { InfoIcon } from "../../icons/info";
import { LightbulbIcon } from "../../icons/lightbulb";
import { TriangleAlertIcon } from "../../icons/triangle-alert";
import { defaultIconProps } from "../../lib/icons";

export type CalloutVariant = "tip" | "info" | "warning";

interface CalloutContentProps {
  /** Visual style variant determining the icon and tone. */
  variant: CalloutVariant;
  /** Content displayed inside the callout. */
  children: ReactNode;
}

/** Icon and tone mapping for each callout variant. */
export const variantConfig = {
  tip: { icon: LightbulbIcon, tone: "positive" },
  info: { icon: InfoIcon, tone: "primary" },
  warning: { icon: TriangleAlertIcon, tone: "caution" },
} as const;

export function CalloutContent({ variant, children }: CalloutContentProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Card padding={4} radius={2} tone={config.tone}>
      <Flex align="flex-start" gap={3}>
        <div style={{ flexShrink: 0, marginTop: "-2px", fontSize: "16px", color: "var(--card-icon-color)" }}>
          <Icon {...defaultIconProps} />
        </div>
        <Text size={1} style={{ color: "var(--card-icon-color)" }}>
          {children}
        </Text>
      </Flex>
    </Card>
  );
}

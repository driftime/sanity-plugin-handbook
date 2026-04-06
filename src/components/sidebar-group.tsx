import { Box, Card, Flex, Text } from "@sanity/ui";
import type { PropsWithChildren } from "react";

type SidebarGroupProps = PropsWithChildren<{
  /** Text label displayed above the group. */
  heading: string;
}>;

export function SidebarGroup({ heading, children }: SidebarGroupProps) {
  return (
    <div>
      <Box paddingY={2}>
        <Card paddingLeft={2} padding={2}>
          <Flex align="center" gap={1}>
            <Text
              size={1}
              muted
              textOverflow="ellipsis"
              weight="semibold"
              style={{ cursor: "default", outline: "none" }}
            >
              {heading}
            </Text>
          </Flex>
        </Card>
      </Box>
      {children}
    </div>
  );
}

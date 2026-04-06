import { Card, Flex, Text } from "@sanity/ui";

interface PaneHeaderProps {
  /** Heading text displayed in the pane header. */
  title: string;
}

export function PaneHeader({ title }: PaneHeaderProps) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 1, lineHeight: 0 }}>
      <Card tone="inherit">
        <Flex direction="column" padding={3} style={{ boxSizing: "border-box" }}>
          <Flex align="flex-start">
            <Card flex={1} paddingLeft={2} padding={2}>
              <Flex align="center" gap={1}>
                <Text size={1} textOverflow="ellipsis" weight="semibold" style={{ cursor: "default", outline: "none" }}>
                  {title}
                </Text>
              </Flex>
            </Card>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
}

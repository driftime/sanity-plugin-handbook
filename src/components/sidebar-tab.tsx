import { ChevronRightIcon } from "@sanity/icons";
import { Box, Card, Flex, Stack, Text } from "@sanity/ui";
import type { ComponentType } from "react";

import { useHandbookContext } from "../contexts/handbook-context";
import { isDefined } from "../lib/utils";

interface SidebarTabProps {
  /** Unique identifier linking this tab to its content panel. */
  id: string;
  /** Text label displayed on the tab. */
  label: string;
  /** Optional icon component rendered beside the label. */
  icon?: ComponentType;
}

export function SidebarTab({ id, label, icon: Icon }: SidebarTabProps) {
  const { activeTab, setActiveTab, setSidebarExpanded } = useHandbookContext();
  const selected = activeTab === id;

  return (
    <Card
      id={id}
      aria-controls={`panel-${id}`}
      aria-selected={selected}
      role="option"
      as="button"
      selected={selected}
      marginBottom={1}
      radius={2}
      sizing="border"
      tabIndex={-1}
      tone="inherit"
      onClick={() => {
        setActiveTab(id);
        setSidebarExpanded(false);
      }}
      style={{ width: "100%", textAlign: "left", border: "none", cursor: "pointer" }}
    >
      <Flex
        align="center"
        paddingLeft={isDefined(Icon) ? 1 : 2}
        paddingRight={2}
        paddingY={1}
        style={{ height: "1.5625rem", boxSizing: "content-box" }}
      >
        <Flex align="center" flex={1} gap={2}>
          {isDefined(Icon) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25px",
                height: "25px",
                color: "var(--card-icon-color)",
              }}
            >
              <Icon />
            </div>
          )}
          <Stack flex={1} space={2}>
            <Text size={1} textOverflow="ellipsis" weight="medium" style={{ color: "inherit" }}>
              {label}
            </Text>
          </Stack>
          <Box paddingLeft={4} paddingRight={1}>
            <Box style={{ opacity: 0.5 }}>
              <Text muted size={1}>
                <ChevronRightIcon />
              </Text>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
}

import { Box, Heading, Stack, Text } from "@sanity/ui";
import type { ReactNode } from "react";

import { useHandbookContext } from "../contexts/handbook-context";
import { isDefined } from "../lib/utils";
import { PaneHeader } from "./pane-header";

interface ContentPanelProps {
  /** Unique identifier linking this panel to its sidebar tab. */
  id: string;
  /** Heading displayed at the top of the panel. */
  title: string;
  /** Optional description shown beneath the heading. */
  description?: string;
  /** Panel body content. */
  children: ReactNode;
}

export function ContentPanel({ id, title, description, children }: ContentPanelProps) {
  const { activeTab } = useHandbookContext();

  if (activeTab !== id) return null;

  return (
    <div
      id={`panel-${id}`}
      aria-labelledby={id}
      role="tabpanel"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <PaneHeader title={title} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Box
          style={{
            maxWidth: "640px",
            boxSizing: "border-box",
            marginInline: "auto",
            paddingInline: "20px",
            paddingBlockStart: "32px",
            paddingBlockEnd: "220px",
          }}
        >
          <Stack marginBottom={6} space={5}>
            <Heading as="h2" size={4}>
              {title}
            </Heading>
            {isDefined(description) && (
              <Text size={1} muted>
                {description}
              </Text>
            )}
          </Stack>
          {children}
        </Box>
      </div>
    </div>
  );
}

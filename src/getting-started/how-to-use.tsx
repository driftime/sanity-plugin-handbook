import { Box, Flex, Stack, Text } from "@sanity/ui";
import { InfoIcon, LightbulbIcon, TriangleAlertIcon } from "lucide-react";
import type { ReactNode } from "react";

import { defaultIconProps } from "../lib/icons";

function HintRow({ icon, children }: { icon: ReactNode; children: string }) {
  return (
    <Flex align="center" gap={3}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          fontSize: "16px",
          color: "var(--card-icon-color)",
        }}
      >
        {icon}
      </div>
      <Text size={1} muted>
        {children}
      </Text>
    </Flex>
  );
}

export function HowToUse() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
      <Stack space={3}>
        <Flex align="center" paddingY={1}>
          <Text size={1} weight="medium">
            Navigating the Handbook
          </Text>
        </Flex>
        <Text size={1} muted>
          Use the sidebar to browse document types and guides. Each entry opens a detailed view in the main panel
          showing field descriptions, examples, and tips.
        </Text>
      </Stack>

      <Stack space={3}>
        <Flex align="center" paddingY={1}>
          <Text size={1} weight="medium">
            Understanding Fields
          </Text>
        </Flex>
        <Text size={1} muted>
          Each document type lists its fields with a name and type label. Below the name you will find a description
          explaining what the field is for and how to use it. Some fields include an example value shown in italics.
        </Text>
        <Box marginTop={1}>
          <Text size={1} muted style={{ fontStyle: "italic" }}>
            e.g. Acme Inc.
          </Text>
        </Box>
      </Stack>

      <Stack space={3}>
        <Flex align="center" paddingY={1}>
          <Text size={1} weight="medium">
            Hints and Warnings
          </Text>
        </Flex>
        <Text size={1} muted>
          Look for these icons next to field names. Hover or click them to reveal additional guidance.
        </Text>
        <Stack space={3} marginTop={2}>
          <HintRow icon={<LightbulbIcon {...defaultIconProps} />}>
            Helpful tips and best practices for content editors.
          </HintRow>
          <HintRow icon={<InfoIcon {...defaultIconProps} />}>Additional context about how the field is used.</HintRow>
          <HintRow icon={<TriangleAlertIcon {...defaultIconProps} />}>
            Important warnings about constraints or potential issues.
          </HintRow>
        </Stack>
      </Stack>

      <Stack space={3}>
        <Flex align="center" paddingY={1}>
          <Text size={1} weight="medium">
            Nested Fields
          </Text>
        </Flex>
        <Text size={1} muted>
          Some fields contain subfields — for example, a content block might include a heading and body text. These are
          shown as collapsible sections you can expand to explore the full structure.
        </Text>
      </Stack>
    </div>
  );
}

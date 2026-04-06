import { PortableText } from "@portabletext/react";
import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react";
import { Box, Text } from "@sanity/ui";
import { useMemo } from "react";
import type { ReactNode } from "react";

import { CalloutBlock } from "../blocks/callout/block";
import { CodeBlock } from "../blocks/code/block";
import { HorizontalRuleBlock } from "../blocks/horizontal-rule/block";
import { ImageBlock } from "../blocks/image/block";
import { VideoBlock } from "../blocks/video/block";
import { useHandbookContext } from "../contexts/handbook-context";

/** Portable Text component overrides for rendering guide content. */
const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <div style={{ marginBlockStart: "3rem", marginBlockEnd: "0.25rem" }}>
        <Text as="h2" size={1} weight="medium">
          {children}
        </Text>
      </div>
    ),
    normal: ({ children }) => (
      <div style={{ marginBlock: "1rem" }}>
        <Text size={1} muted>
          {children}
        </Text>
      </div>
    ),
    blockquote: ({ children }) => (
      <div style={{ marginBlock: "2rem" }}>
        <Box paddingLeft={3} paddingY={1} style={{ borderLeft: "2px solid var(--card-border-color)" }}>
          <Text size={1} muted style={{ fontStyle: "italic" }}>
            {children}
          </Text>
        </Box>
      </div>
    ),
  },
  list: {
    bullet: ({ children, value }) => (
      <div style={{ marginBlock: value.level > 1 ? "0.75rem" : "2rem" }}>
        <Text size={1} muted>
          <ul style={{ display: "flex", flexDirection: "column", gap: "0.375rem", margin: 0, paddingLeft: "1.25em" }}>
            {children}
          </ul>
        </Text>
      </div>
    ),
    number: ({ children, value }) => (
      <div style={{ marginBlock: value.level > 1 ? "0.75rem" : "2rem" }}>
        <Text size={1} muted>
          <ol style={{ display: "flex", flexDirection: "column", gap: "0.375rem", margin: 0, paddingLeft: "1.25em" }}>
            {children}
          </ol>
        </Text>
      </div>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code
        style={{
          padding: "0.125rem 0.25rem",
          fontSize: "0.875em",
          backgroundColor: "var(--card-code-bg-color)",
          borderRadius: "0.125rem",
        }}
      >
        {children}
      </code>
    ),
    link: ({ children, value }: { children: ReactNode; value?: { href?: string } }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--card-link-fg-color)" }}>
        {children}
      </a>
    ),
    "strike-through": ({ children }) => <del>{children}</del>,
  },
};

export function GuideContent({ content }: { content: PortableTextBlock[] }) {
  const { blocks: customBlocks } = useHandbookContext();

  const components = useMemo<PortableTextComponents>(() => {
    const customTypes: Record<string, unknown> = {};

    for (const block of customBlocks) {
      customTypes[block.schema.name] = block.component;
    }

    return {
      ...portableTextComponents,
      types: {
        "handbook.image": ImageBlock,
        "handbook.video": VideoBlock,
        "handbook.code": CodeBlock,
        "handbook.callout": CalloutBlock,
        "handbook.horizontalRule": HorizontalRuleBlock,
        ...customTypes,
      },
    };
  }, [customBlocks]);

  return (
    <div>
      <PortableText value={content} components={components} />
    </div>
  );
}

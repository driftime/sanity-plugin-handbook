import type { ComponentProps } from "react";

import { HorizontalRuleContent } from "@/blocks/horizontal-rule/content";
import { contentSpacing } from "@/config/layout";
import type { SanityHandbookHorizontalRule } from "@/schemas/blocks/horizontal-rule";

export type HorizontalRuleBlockProps = ComponentProps<typeof HorizontalRuleContent> & {
  value: SanityHandbookHorizontalRule;
};

export function HorizontalRuleBlock({ value: _value, style, ...props }: HorizontalRuleBlockProps) {
  return <HorizontalRuleContent style={{ marginBlock: contentSpacing.rule, ...style }} {...props} />;
}

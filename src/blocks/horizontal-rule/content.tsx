interface HorizontalRuleContentProps {
  /** Vertical spacing above and below the rule. */
  marginBlock?: string;
}

export function HorizontalRuleContent({ marginBlock = "0" }: HorizontalRuleContentProps) {
  return <hr style={{ marginBlock, border: "none", borderTop: "1px solid var(--card-border-color)" }} />;
}

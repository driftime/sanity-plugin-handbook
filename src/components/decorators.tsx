import type { ReactNode } from "react";

interface DecoratorProps {
  /** Text content wrapped by the decorator. */
  children: ReactNode;
}

export function ParagraphDecorator({ children }: DecoratorProps) {
  return <span style={{ fontSize: "0.8125rem", color: "var(--card-muted-fg-color)" }}>{children}</span>;
}

export function HeadingDecorator({ children }: DecoratorProps) {
  return <span style={{ fontSize: "0.8125rem", fontWeight: "500", color: "var(--card-fg-color)" }}>{children}</span>;
}

export function InlineCodeDecorator({ children }: DecoratorProps) {
  return (
    <code
      style={{
        padding: "0.125rem 0.25rem",
        fontSize: "0.875em",
        color: "var(--card-muted-fg-color)",
        backgroundColor: "var(--card-code-bg-color)",
        borderRadius: "0.125rem",
      }}
    >
      {children}
    </code>
  );
}

export function BlockquoteDecorator({ children }: DecoratorProps) {
  return (
    <span
      style={{
        display: "block",
        paddingLeft: "0.75rem",
        fontSize: "0.8125rem",
        fontStyle: "italic",
        color: "var(--card-muted-fg-color)",
        borderLeft: "2px solid var(--card-border-color)",
      }}
    >
      {children}
    </span>
  );
}

import type { ReactNode } from "react";

interface DecoratorProps {
  /** Text content wrapped by the decorator. */
  children: ReactNode;
}

export function ParagraphDecorator({ children }: DecoratorProps) {
  return <span style={{ fontSize: "0.8125rem" }}>{children}</span>;
}

export function HeadingDecorator({ children }: DecoratorProps) {
  return <span style={{ fontSize: "0.8125rem", fontWeight: "500" }}>{children}</span>;
}

export function BlockquoteDecorator({ children }: DecoratorProps) {
  return (
    <div
      style={{
        paddingLeft: "0.75em",
        fontSize: "0.8125rem",
        fontStyle: "italic",
        borderLeft: "2px solid var(--card-border-color)",
      }}
    >
      {children}
    </div>
  );
}

export function BulletListDecorator({ children }: DecoratorProps) {
  return <div style={{ marginTop: "-0.25em", fontSize: "0.8125rem" }}>{children}</div>;
}

export function NumberListDecorator({ children }: DecoratorProps) {
  return <div style={{ marginTop: "-0.25em", fontSize: "0.8125rem" }}>{children}</div>;
}

export function InlineCodeDecorator({ children }: DecoratorProps) {
  return (
    <code
      style={{
        padding: "0.125rem 0.25rem",
        fontSize: "0.8125rem",
        color: "var(--card-muted-fg-color)",
        backgroundColor: "var(--card-code-bg-color)",
        borderRadius: "0.125rem",
      }}
    >
      {children}
    </code>
  );
}

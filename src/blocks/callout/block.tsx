import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import type { ReactNode } from "react";

import type { CalloutVariant } from "./content";
import { CalloutContent } from "./content";

interface HandbookCalloutValue {
  /** Document type identifier. */
  _type: "handbook.callout";
  /** Visual style and intent of the callout. */
  variant: CalloutVariant;
  /** Portable Text content displayed inside the callout. */
  body: PortableTextBlock[];
}

export function CalloutBlock({ value }: { value: HandbookCalloutValue }) {
  return (
    <div style={{ marginBlock: "2rem" }}>
      <CalloutContent variant={value.variant}>
        <PortableText
          value={value.body}
          components={{
            block: { normal: ({ children }) => <>{children}</> },
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
              link: ({ children, value: mark }: { children: ReactNode; value?: { href?: string } }) => (
                <a
                  href={mark?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--card-fg-color)" }}
                >
                  {children}
                </a>
              ),
            },
          }}
        />
      </CalloutContent>
    </div>
  );
}

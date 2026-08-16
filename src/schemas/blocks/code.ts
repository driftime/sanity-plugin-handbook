import { defineField, defineType } from "sanity";
import type { PortableTextObject } from "sanity";

import { CodePreview } from "@/blocks/code/preview";
import { CodeIcon } from "@/icons/code";
import { createSanityIcon } from "@/lib/icons";
import type { Strict } from "@/types";

/**
 * A block of source code, rendered with syntax highlighting for its language.
 *
 * @public
 */
export type SanityHandbookCode = Strict<PortableTextObject> & {
  _type: typeof codeTypeName;
  /** Source code to display. */
  code?: string;
  /** Programming language used for syntax highlighting. */
  language?: string;
};

/** Type name of the code block. */
export const codeTypeName = "handbook.code";

export const codeType = defineType({
  name: codeTypeName satisfies SanityHandbookCode["_type"],
  type: "object",
  title: "Code",
  icon: createSanityIcon(CodeIcon),
  description: "Syntax-highlighted code block with language selection.",
  components: {
    preview: CodePreview,
  },
  preview: {
    select: {
      code: "code",
      language: "language",
    },
  },
  fields: [
    defineField({
      name: "code" satisfies keyof SanityHandbookCode,
      type: "text",
      description: "The source code to display.",
    }),
    defineField({
      name: "language" satisfies keyof SanityHandbookCode,
      type: "string",
      description: "Programming language used for syntax highlighting.",
      options: {
        list: [
          { title: "CSS", value: "css" },
          { title: "GROQ", value: "groq" },
          { title: "HTML", value: "html" },
          { title: "JavaScript", value: "javascript" },
          { title: "JSON", value: "json" },
          { title: "Plain Text", value: "text" },
          { title: "React", value: "tsx" },
          { title: "Shell", value: "shell" },
          { title: "TypeScript", value: "typescript" },
        ],
      },
    }),
  ],
});

import { defineField, defineType } from "sanity";

import { CodePreview } from "../../blocks/code/preview";
import { CodeIcon } from "../../icons/code";
import { createSanityIcon } from "../../lib/icons";

export const handbookCodeType = defineType({
  name: "handbook.code",
  title: "Code",
  type: "object",
  icon: createSanityIcon(CodeIcon),
  description: "A syntax-highlighted code block with language selection.",
  preview: {
    select: { code: "code", language: "language" },
  },
  components: {
    preview: CodePreview,
  },
  fields: [
    defineField({
      name: "code",
      title: "Code",
      type: "text",
      description: "The source code to display.",
    }),
    defineField({
      name: "language",
      title: "Language",
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

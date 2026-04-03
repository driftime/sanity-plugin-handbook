import { MessageCircleQuestionMarkIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { CalloutPreview } from "../../blocks/callout/preview";
import { InlineCodeDecorator, ParagraphDecorator } from "../../components/decorators";
import { createSanityIcon } from "../../lib/icons";
import { linkAnnotation } from "../annotations/link";

export const handbookCalloutType = defineType({
  name: "handbook.callout",
  title: "Callout",
  type: "object",
  icon: createSanityIcon(MessageCircleQuestionMarkIcon),
  description: "A highlighted message block used to draw attention to tips, supplementary information, or warnings.",
  preview: {
    select: { variant: "variant", body: "body" },
    prepare({ variant, body }: { variant?: string; body?: { children?: { text?: string }[] }[] }) {
      const text = Array.isArray(body)
        ? body.flatMap((block) => (block.children ?? []).map((child) => child.text ?? "")).join("")
        : "";

      return { variant, text };
    },
  },
  components: {
    preview: CalloutPreview,
  },
  fields: [
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      description: "Visual style and intent of the callout.",
      initialValue: "tip",
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Tip", value: "tip" },
          { title: "Information", value: "info" },
          { title: "Warning", value: "warning" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description: "Content displayed inside the callout. Supports inline formatting and links.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal", component: ParagraphDecorator }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Strikethrough", value: "strike-through" },
              { title: "Code", value: "code", component: InlineCodeDecorator },
            ],
            annotations: [linkAnnotation],
          },
          lists: [],
        }),
      ],
    }),
  ],
});

import { defineArrayMember, defineField, defineType } from "sanity";
import type { PortableTextObject, PortableTextSpan, PortableTextTextBlock } from "sanity";

import type { CalloutVariant } from "@/blocks/callout/content";
import { CalloutPreview } from "@/blocks/callout/preview";
import { CodeDecorator } from "@/components/decorators";
import { ParagraphStyle } from "@/components/styles";
import { MessageCircleIcon } from "@/icons/message-circle";
import { createSanityIcon } from "@/lib/icons";
import { linkAnnotation } from "@/schemas/annotations/link";
import type { SanityKeyedArray, Strict } from "@/types";

/**
 * A highlighted message set apart from the surrounding guide text.
 *
 * @public
 */
export type SanityHandbookCallout = Strict<PortableTextObject> & {
  _type: typeof calloutTypeName;
  /** Visual style and intent of the callout. */
  variant: CalloutVariant;
  /** Portable Text content displayed inside the callout, which offers no inline objects. */
  body: SanityKeyedArray<PortableTextTextBlock<PortableTextSpan>>;
};

/** Type name of the callout block. */
export const calloutTypeName = "handbook.callout";

export const calloutType = defineType({
  name: calloutTypeName satisfies SanityHandbookCallout["_type"],
  type: "object",
  title: "Callout",
  icon: createSanityIcon(MessageCircleIcon),
  description: "Highlighted message block drawing attention to tips, supplementary information, or warnings.",
  components: {
    preview: CalloutPreview,
  },
  preview: {
    select: {
      variant: "variant",
      body: "body",
    },
    prepare(selection: { variant?: CalloutVariant; body?: SanityHandbookCallout["body"] }) {
      const { variant, body } = selection;

      return {
        title: "Callout",
        variant,
        body,
      };
    },
  },
  fields: [
    defineField({
      name: "variant" satisfies keyof SanityHandbookCallout,
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
      name: "body" satisfies keyof SanityHandbookCallout,
      type: "array",
      description: "Content displayed inside the callout. Supports inline formatting and links.",
      of: [
        defineArrayMember({
          name: "block",
          type: "block",
          styles: [{ title: "Normal", value: "normal", component: ParagraphStyle }],
          lists: [],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Strikethrough", value: "strike-through" },
              { title: "Code", value: "code", component: CodeDecorator },
            ],
            annotations: [linkAnnotation],
          },
        }),
      ],
    }),
  ],
});

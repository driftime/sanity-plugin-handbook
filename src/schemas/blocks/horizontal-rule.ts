import { defineField, defineType } from "sanity";
import type { PortableTextObject } from "sanity";

import { HorizontalRulePreview } from "@/blocks/horizontal-rule/preview";
import { SeparatorHorizontalIcon } from "@/icons/separator-horizontal";
import { createSanityIcon } from "@/lib/icons";
import type { Strict } from "@/types";

/**
 * A divider between sections of a guide, carrying no authored content of its own.
 *
 * @public
 */
export type SanityHandbookHorizontalRule = Strict<PortableTextObject> & {
  _type: typeof horizontalRuleTypeName;
};

/** Type name of the horizontal rule block. */
export const horizontalRuleTypeName = "handbook.horizontalRule";

export const horizontalRuleType = defineType({
  name: horizontalRuleTypeName satisfies SanityHandbookHorizontalRule["_type"],
  type: "object",
  title: "Horizontal Rule",
  icon: createSanityIcon(SeparatorHorizontalIcon),
  description: "Visual divider between sections of content.",
  components: {
    preview: HorizontalRulePreview,
  },
  preview: {
    prepare() {
      return {
        title: "Horizontal Rule",
      };
    },
  },
  fields: [
    // Sanity rejects an object type declaring no fields, and a rule has nothing of its own to store.
    defineField({
      name: "style",
      type: "string",
      description: "Reserved. A horizontal rule carries no authored content.",
      hidden: true,
    }),
  ],
});

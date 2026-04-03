import { MinusIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { HorizontalRulePreview } from "../../blocks/horizontal-rule/preview";
import { createSanityIcon } from "../../lib/icons";

export const handbookHorizontalRuleType = defineType({
  name: "handbook.horizontalRule",
  title: "Horizontal Rule",
  type: "object",
  icon: createSanityIcon(MinusIcon),
  description: "A visual divider between sections of content.",
  preview: {
    prepare() {
      return { title: "Horizontal Rule" };
    },
  },
  components: {
    preview: HorizontalRulePreview,
  },
  fields: [
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      description: "Presentation style for the divider.",
      hidden: true,
      initialValue: "default",
    }),
  ],
});

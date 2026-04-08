import { defineField, defineType } from "sanity";

import { BookOpenTextIcon } from "../../icons/book-open-text";
import { createSanityIcon } from "../../lib/icons";
import type { HandbookBlockDefinition, SanityHandbookGuide } from "../../types";
import { createGuideContentField } from "../guide-content";

/**
 * Creates the handbook.guide document type with the content field
 * composed from default and custom blocks.
 *
 * @param customBlocks - Custom block definitions registered by the consumer.
 * @returns A document type definition for handbook guides.
 */
export function createHandbookGuideType(customBlocks: HandbookBlockDefinition[] = []) {
  return defineType({
    name: "handbook.guide" satisfies SanityHandbookGuide["_type"],
    title: "Handbook Guide",
    type: "document",
    icon: createSanityIcon(BookOpenTextIcon),
    description: "A handbook page authored with rich text, images, and custom blocks.",
    preview: {
      select: { title: "title", description: "description" },
      prepare({ title, description }: { title?: string; description?: string }) {
        return {
          title: title ?? "Untitled Guide",
          subtitle: description,
        };
      },
    },
    fields: [
      defineField({
        name: "title" satisfies keyof SanityHandbookGuide,
        title: "Title",
        type: "string",
        description: "Display title shown in the handbook sidebar and as the page heading.",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "description" satisfies keyof SanityHandbookGuide,
        title: "Description",
        type: "string",
        description: "Brief summary displayed beneath the guide heading.",
      }),
      createGuideContentField(customBlocks),
    ],
  });
}

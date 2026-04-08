import { defineArrayMember, defineField } from "sanity";

import {
  BlockquoteDecorator,
  BulletListDecorator,
  HeadingDecorator,
  InlineCodeDecorator,
  NumberListDecorator,
  ParagraphDecorator,
} from "../components/decorators";
import type { HandbookBlockDefinition } from "../types";
import { linkAnnotation } from "./annotations/link";

/**
 * Creates the Portable Text content field for handbook guides, merging
 * default blocks with any custom blocks from the plugin configuration.
 *
 * @param customBlocks - Custom block definitions registered by the consumer.
 * @returns A field definition for the guide content array.
 */
export function createGuideContentField(customBlocks: HandbookBlockDefinition[] = []) {
  return defineField({
    name: "content",
    title: "Content",
    type: "array",
    description: "Rich text content for this guide. Supports headings, lists, images, code blocks, and custom blocks.",
    of: [
      defineArrayMember({
        name: "block",
        type: "block",
        styles: [
          { title: "Paragraph", value: "normal", component: ParagraphDecorator },
          { title: "Heading", value: "h2", component: HeadingDecorator },
          { title: "Blockquote", value: "blockquote", component: BlockquoteDecorator },
        ],
        marks: {
          decorators: [
            { title: "Bold", value: "strong" },
            { title: "Italic", value: "em" },
            { title: "Strikethrough", value: "strike-through" },
            { title: "Code", value: "code", component: InlineCodeDecorator },
          ],
          annotations: [linkAnnotation],
        },
        lists: [
          { title: "Bullet", value: "bullet", component: BulletListDecorator },
          { title: "Number", value: "number", component: NumberListDecorator },
        ],
      }),
      defineArrayMember({ type: "handbook.image" }),
      defineArrayMember({ type: "handbook.video" }),
      defineArrayMember({ type: "handbook.code" }),
      defineArrayMember({ type: "handbook.callout" }),
      defineArrayMember({ type: "handbook.horizontalRule" }),
      ...customBlocks.map((block) => defineArrayMember({ type: block.schema.name })),
    ],
  });
}

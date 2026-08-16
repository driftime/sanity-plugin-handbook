import { defineField, defineType } from "sanity";
import type { PortableTextObject } from "sanity";

import { ImagePreview } from "@/blocks/image/preview";
import { ImageIcon } from "@/icons/image";
import { createSanityIcon } from "@/lib/icons";
import type { Strict } from "@/types";

/**
 * An image placed in a guide, with the caption and alternative text shown alongside it.
 *
 * @public
 */
export type SanityHandbookImage = Strict<PortableTextObject> & {
  _type: typeof imageTypeName;
  /** Uploaded image asset, narrowed by the query to the URL the viewer renders. */
  asset?: { url?: string };
  /** Text displayed beneath the image. */
  caption?: string;
  /** Alternative text for screen readers. */
  alt?: string;
};

/** Type name of the image block. */
export const imageTypeName = "handbook.image";

export const imageType = defineType({
  name: imageTypeName satisfies SanityHandbookImage["_type"],
  type: "object",
  title: "Image",
  icon: createSanityIcon(ImageIcon),
  description: "Image with an optional caption and alternative text.",
  components: {
    preview: ImagePreview,
  },
  preview: {
    select: {
      caption: "caption",
      alt: "alt",
      url: "asset.asset.url",
    },
  },
  fields: [
    defineField({
      name: "asset" satisfies keyof SanityHandbookImage,
      title: "Image",
      type: "image",
      description: "Upload or select an image from the media library.",
      options: { hotspot: true },
    }),
    defineField({
      name: "caption" satisfies keyof SanityHandbookImage,
      type: "string",
      description: "Caption text displayed below the image, such as a credit or a note.",
    }),
    defineField({
      name: "alt" satisfies keyof SanityHandbookImage,
      title: "Alternative Text",
      type: "string",
      description: "Describes what the image shows for people who cannot see it. Don't repeat the caption here.",
    }),
  ],
});

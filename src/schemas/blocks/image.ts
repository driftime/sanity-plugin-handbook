import { defineField, defineType } from "sanity";

import { ImagePreview } from "../../blocks/image/preview";
import { ImageIcon } from "../../icons/image";
import { createSanityIcon } from "../../lib/icons";

export const handbookImageType = defineType({
  name: "handbook.image",
  title: "Image",
  type: "object",
  icon: createSanityIcon(ImageIcon),
  description: "An image with optional caption and alternative text for accessibility.",
  preview: {
    select: { caption: "caption", alt: "alt", url: "asset.asset.url" },
  },
  components: {
    preview: ImagePreview,
  },
  fields: [
    defineField({
      name: "asset",
      title: "Image",
      type: "image",
      description: "Upload or select an image from the media library.",
      options: { hotspot: true },
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Text displayed beneath the image in the handbook.",
    }),
    defineField({
      name: "alt",
      title: "Alternative Text",
      type: "string",
      description: "Describes the image for screen readers and accessibility tools.",
    }),
  ],
});

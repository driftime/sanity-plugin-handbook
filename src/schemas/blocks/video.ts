import { defineField, defineType } from "sanity";
import type { PortableTextObject } from "sanity";

import { VideoPreview } from "@/blocks/video/preview";
import { FilmIcon } from "@/icons/film";
import { createSanityIcon } from "@/lib/icons";
import type { Strict } from "@/types";

/**
 * A video placed in a guide, with the caption shown beneath it.
 *
 * @public
 */
export type SanityHandbookVideo = Strict<PortableTextObject> & {
  _type: typeof videoTypeName;
  /** Uploaded video asset, narrowed by the query to the URL the viewer renders. */
  asset?: { url?: string };
  /** Text displayed beneath the video. */
  caption?: string;
};

/** Type name of the video block. */
export const videoTypeName = "handbook.video";

export const videoType = defineType({
  name: videoTypeName satisfies SanityHandbookVideo["_type"],
  type: "object",
  title: "Video",
  icon: createSanityIcon(FilmIcon),
  description: "Video with an optional caption.",
  components: {
    preview: VideoPreview,
  },
  preview: {
    select: {
      caption: "caption",
      url: "asset.asset.url",
    },
  },
  fields: [
    defineField({
      name: "asset" satisfies keyof SanityHandbookVideo,
      title: "Video",
      type: "file",
      description: "Upload or select a video from the media library.",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "caption" satisfies keyof SanityHandbookVideo,
      type: "string",
      description: "Caption text displayed below the video, such as a credit or a note.",
    }),
  ],
});

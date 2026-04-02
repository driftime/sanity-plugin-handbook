import { VideoIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { VideoPreview } from "../../blocks/video/preview";
import { createSanityIcon } from "../../lib/icons";

export const handbookVideoType = defineType({
  name: "handbook.video",
  title: "Video",
  type: "object",
  icon: createSanityIcon(VideoIcon),
  description: "An uploaded video with optional caption.",
  preview: {
    select: { caption: "caption", url: "asset.asset.url" },
  },
  components: {
    preview: VideoPreview,
  },
  fields: [
    defineField({
      name: "asset",
      title: "Video",
      type: "file",
      description: "Upload or select a video from the media library.",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Text displayed beneath the video in the handbook.",
    }),
  ],
});

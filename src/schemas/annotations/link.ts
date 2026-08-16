import { defineArrayMember, defineField } from "sanity";
import type { PortableTextObject } from "sanity";

import type { Strict } from "@/types";

/**
 * A web address applied to a run of guide text.
 *
 * @public
 */
export type SanityHandbookLink = Strict<PortableTextObject> & {
  _type: "link";
  /** Web address the link points to. */
  href?: string;
};

export const linkAnnotation = defineArrayMember({
  name: "link" satisfies SanityHandbookLink["_type"],
  type: "object",
  description: "Link applied to the selected text.",
  preview: {
    select: {
      href: "href",
    },
    prepare(selection: { href?: string }) {
      const { href } = selection;

      return {
        title: href ?? "Link",
      };
    },
  },
  fields: [
    defineField({
      name: "href" satisfies keyof SanityHandbookLink,
      title: "URL",
      type: "url",
      description: "Web address destination for this link. Supports http, https, mailto, and tel schemes.",
      validation: (rule) => rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
    }),
  ],
});

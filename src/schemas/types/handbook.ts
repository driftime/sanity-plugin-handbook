import { defineArrayMember, defineField, defineType } from "sanity";

import { BookTextIcon } from "../../icons/book-text";
import { ListPlusIcon } from "../../icons/list-plus";
import { createSanityIcon } from "../../lib/icons";
import { isDefined } from "../../lib/utils";
import type { SanityHandbook } from "../../types";

export const handbookType = defineType({
  name: "handbook.handbook" satisfies SanityHandbook["_type"],
  title: "Handbook",
  type: "document",
  icon: createSanityIcon(BookTextIcon),
  description: "Defines the structure and ordering of the handbook, including groups and their guides.",
  preview: {
    prepare() {
      return { title: "Handbook" };
    },
  },
  fields: [
    defineField({
      name: "groups" satisfies keyof SanityHandbook,
      title: "Groups",
      type: "array",
      description:
        "Ordered list of groups displayed in the handbook sidebar. Each group contains a title and an ordered list of guide references.",
      of: [
        defineArrayMember({
          name: "group",
          type: "object",
          icon: createSanityIcon(ListPlusIcon),
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description: "Heading displayed above this group of guides in the sidebar.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "guides",
              title: "Guides",
              type: "array",
              description: "Ordered list of guides within this group. Drag to reorder.",
              of: [
                defineArrayMember({
                  type: "reference",
                  to: [{ type: "handbook.guide" }],
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "title", guide0: "guides.0.title", guide1: "guides.1.title", guide2: "guides.2.title" },
            prepare({
              title,
              guide0,
              guide1,
              guide2,
            }: {
              title?: string;
              guide0?: string;
              guide1?: string;
              guide2?: string;
            }) {
              const all = [guide0, guide1, guide2].filter((guide): guide is string => isDefined(guide));
              const shown = all.slice(0, 2);
              const hasMore = isDefined(guide2);

              function formatSubtitle() {
                if (!isDefined(shown)) return "No guides selected";
                if (hasMore) return `${shown.join(", ")}, and others`;
                return shown.join(" and ");
              }

              return {
                title: title ?? "Untitled Group",
                subtitle: formatSubtitle(),
              };
            },
          },
        }),
      ],
    }),
  ],
});

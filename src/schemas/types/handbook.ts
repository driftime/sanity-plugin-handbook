import { defineArrayMember, defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

import { BookTextIcon } from "@/icons/book-text";
import { ListPlusIcon } from "@/icons/list-plus";
import { createSanityIcon } from "@/lib/icons";
import { isDefined } from "@/lib/utils";
import type { SanityHandbookGuide } from "@/schemas/types/guide";
import { guideTypeName } from "@/schemas/types/guide";
import type { SanityKeyedArray, Strict } from "@/types";

/**
 * A titled run of guides in the sidebar, holding them in the order they appear.
 *
 * @public
 */
export interface SanityHandbookGuideGroup {
  /** Display title for this group in the sidebar. */
  title: string;
  /** Ordered array of guide references. */
  guides: SanityKeyedArray<SanityHandbookGuide>;
}

/**
 * The singleton naming every guide group and the order the sidebar lists them in.
 *
 * @public
 */
export type SanityHandbook = Strict<SanityDocument> & {
  _type: typeof handbookTypeName;
  /** Ordered array of groups, each containing a title and guide references. */
  groups: SanityKeyedArray<SanityHandbookGuideGroup>;
};

/** Document type name of the Handbook singleton. */
export const handbookTypeName = "handbook.handbook";

export const handbookType = defineType({
  name: handbookTypeName satisfies SanityHandbook["_type"],
  type: "document",
  title: "Handbook",
  icon: createSanityIcon(BookTextIcon),
  description: "Defines the groups of guides shown in the Handbook sidebar, and the order they appear in.",
  preview: {
    prepare() {
      return {
        title: "Handbook",
      };
    },
  },
  fields: [
    defineField({
      name: "groups" satisfies keyof SanityHandbook,
      type: "array",
      description:
        "Ordered list of groups displayed in the Handbook sidebar. Each group contains a title and an ordered list of guide references.",
      of: [
        defineArrayMember({
          name: "group",
          type: "object",
          icon: createSanityIcon(ListPlusIcon),
          description: "Named section of the Handbook sidebar holding an ordered list of guides.",
          fields: [
            defineField({
              name: "title" satisfies keyof SanityHandbookGuideGroup,
              type: "string",
              description: "Heading displayed above this group of guides in the sidebar.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "guides" satisfies keyof SanityHandbookGuideGroup,
              type: "array",
              description: "Ordered list of guides within this group. Drag to reorder.",
              of: [
                defineArrayMember({
                  name: "guide",
                  type: "reference",
                  to: [{ type: guideTypeName }],
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              guide0: "guides.0.title",
              guide1: "guides.1.title",
              guide2: "guides.2.title",
            },
            prepare(selection: { title?: string; guide0?: string; guide1?: string; guide2?: string }) {
              const { title, guide0, guide1, guide2 } = selection;

              const all = [guide0, guide1, guide2].filter((guide): guide is string => isDefined(guide));
              const shown = all.slice(0, 2);
              const hasMore = isDefined(guide2);

              function formatSubtitle() {
                if (!isDefined(shown)) return "No guides selected";
                if (hasMore) return `${shown.join(", ")}, and others`;
                return shown.join(" and ");
              }

              return {
                title: title ?? "Group",
                subtitle: formatSubtitle(),
              };
            },
          },
        }),
      ],
    }),
  ],
});

import { defineArrayMember, defineField } from "sanity";

/**
 * Inline link annotation for Portable Text fields.
 * Supports http, https, mailto, and tel URI schemes.
 */
export const linkAnnotation = defineArrayMember({
  name: "link",
  type: "object",
  fields: [
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      description: "Web address for this link. Supports http, https, mailto, and tel schemes.",
      validation: (rule) => rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
    }),
  ],
});

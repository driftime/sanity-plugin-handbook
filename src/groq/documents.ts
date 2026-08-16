import { guideFragment } from "@/groq/fragments";
import { defineTypedQuery } from "@/lib/groq";
import type { SanityHandbookGuide } from "@/schemas/types/guide";
import { guideTypeName } from "@/schemas/types/guide";
import type { SanityHandbook } from "@/schemas/types/handbook";
import { handbookTypeName } from "@/schemas/types/handbook";

/** Fetches the Handbook singleton with expanded guide references. */
export const handbookQuery = defineTypedQuery<SanityHandbook>(`
  *[_type == "${handbookTypeName}"][0] {
    ...,
    groups[] {
      ...,
      guides[] {
        ...,
        ${guideFragment}
      }
    }
  }
`);

/** Matches the documents whose changes the Handbook tool refetches on. */
export const handbookDocumentsQuery = defineTypedQuery<SanityHandbook | SanityHandbookGuide>(
  `*[_type == "${handbookTypeName}" || _type == "${guideTypeName}"]`,
);

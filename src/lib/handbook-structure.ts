import type { CurrentUser } from "sanity";
import type { StructureBuilder } from "sanity/structure";

import { BookOpenTextIcon } from "../icons/book-open-text";
import { BookTextIcon } from "../icons/book-text";
import { createSanityIcon } from "./icons";
import { isPermittedEditor } from "./utils";

/** Editor email addresses stored from plugin configuration for use by the structure helper. */
let registeredEditors: string[] | undefined = undefined;

/**
 * Stores the editors list from the plugin configuration for use by the structure helper.
 *
 * @internal
 * @param editors - The editors list from HandbookConfig.
 */
export function setHandbookEditors(editors?: string[]) {
  registeredEditors = editors;
}

/**
 * Creates Structure tool items for handbook documents.
 * Returns an empty array if the current user is not in the editors list
 * configured via handbookPlugin.
 *
 * @public
 * @param structureBuilder - The Sanity Structure builder instance.
 * @param context - The Structure context containing the current user.
 * @returns An array of list items for the handbook singleton and guides list.
 */
export function handbookStructure(structureBuilder: StructureBuilder, context: { currentUser: CurrentUser | null }) {
  if (!isPermittedEditor(registeredEditors, context.currentUser?.email)) return [];

  const { listItem, document, documentTypeList } = structureBuilder;

  return [
    listItem()
      .title("Handbook")
      .icon(createSanityIcon(BookTextIcon))
      .child(document().id("handbook.handbook").schemaType("handbook.handbook").title("Handbook")),
    listItem()
      .title("Handbook Guides")
      .icon(createSanityIcon(BookOpenTextIcon))
      .child(documentTypeList("handbook.guide").title("Handbook Guides")),
  ];
}

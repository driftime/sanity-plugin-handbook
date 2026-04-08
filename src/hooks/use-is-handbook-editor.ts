import { useCurrentUser } from "sanity";

import { isPermittedEditor } from "../lib/utils";

/**
 * Checks whether the current user is permitted to edit handbook content.
 * Returns true if no editors list is provided (unrestricted) or if the
 * current user's email is in the list.
 *
 * @public
 * @param editors - Optional list of permitted email addresses.
 * @returns Whether the current user can edit handbook documents.
 */
export function useIsHandbookEditor(editors?: string[]): boolean {
  const user = useCurrentUser();

  return isPermittedEditor(editors, user?.email);
}

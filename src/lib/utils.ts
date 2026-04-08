/**
 * Determines whether a value is defined and non-empty. Treats `false`, empty strings,
 * empty arrays, and empty objects as not defined.
 *
 * @param value - The value to check.
 * @returns True if the value is defined and not empty.
 */
export function isDefined<T>(value: T | null | undefined | false): value is T {
  if (value === undefined || value === null || value === false) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.some((element) => isDefined(element));
  if (typeof value === "object") return Object.keys(value).length > 0;

  return true;
}

/**
 * Checks whether an email address is in the permitted editors list.
 * Returns true if no editors list is provided or the list is empty (unrestricted access).
 *
 * @param editors - Optional list of permitted email addresses.
 * @param email - The email address to check.
 * @returns Whether the email is permitted to edit.
 */
export function isPermittedEditor(editors: string[] | undefined, email: string | undefined) {
  if (!isDefined(editors)) return true;
  if (!isDefined(email)) return false;

  return editors.includes(email);
}

/**
 * Converts a string between different casing formats.
 *
 * @param value - The string to convert.
 * @param format - The target casing format.
 * @returns The converted string.
 */
export function convertCase(value: string, format: "kebab" | "snake" | "camel" | "pascal" | "title" | "sentence") {
  const words = value
    .replaceAll(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replaceAll(/[-_\s]+/g, " ")
    .trim()
    .toLowerCase();

  switch (format) {
    case "kebab": {
      return words.replaceAll(/\s+/g, "-");
    }
    case "snake": {
      return words.replaceAll(/\s+/g, "_");
    }
    case "camel": {
      return words.replaceAll(/\s+(.)/g, (_match, character: string) => character.toUpperCase());
    }
    case "pascal": {
      return words.replaceAll(/(?:^|\s+)(.)/g, (_match, character: string) => character.toUpperCase());
    }
    case "title": {
      return words.replaceAll(/\b\w/g, (character) => character.toUpperCase());
    }
    case "sentence": {
      return words.replaceAll(/^(.)/g, (character) => character.toUpperCase());
    }
    default: {
      return value;
    }
  }
}

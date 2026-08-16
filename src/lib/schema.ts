import type { FieldDefinition, Schema } from "sanity";

import { isDefined } from "@/lib/utils";

/** A schema field as Sanity compiles it, with its type resolved to an object rather than a name. */
interface CompiledField {
  /** Field identifier in the schema. */
  name: string;
  /** Resolved type object containing the type name and base type metadata. */
  type: { name: string; title?: string; description?: string; fields?: unknown[]; of?: unknown[] };
  /** Custom title set directly on inline object definitions. */
  title?: string;
  /** Custom description set directly on inline object definitions. */
  description?: string;
  /** Fields defined directly on inline object definitions. */
  fields?: unknown[];
  /** Array members defined directly on inline array definitions. */
  of?: unknown[];
  /** Optional Handbook metadata annotations for this field. */
  handbook?: FieldDefinition["handbook"];
}

/** A schema field flattened into the shape the Handbook renders, with its type collapsed to a name. */
export interface NormalisedField {
  /** Field identifier in the schema. */
  name: string;
  /** Resolved type name. */
  type: string;
  /** Display title, falling back to the one declared on the base type. */
  title?: string;
  /** Description, falling back to the one declared on the base type. */
  description?: string;
  /** Optional Handbook metadata annotations for this field. */
  handbook?: FieldDefinition["handbook"];
  /** Normalised subfields, present on object types. */
  fields?: NormalisedField[];
  /** Normalised members, present on array types. */
  of?: NormalisedField[];
}

/** Schema type names treated as leaf types whose subfields are not displayed. */
const opaqueTypes = new Set([
  "block",
  "boolean",
  "crossDatasetReference",
  "date",
  "datetime",
  "file",
  "geopoint",
  "image",
  "number",
  "reference",
  "slug",
  "string",
  "text",
  "url",
]);

/** Fields injected by Sanity's built-in opaque types during schema compilation. */
const inheritedFieldNames: Partial<Record<string, Set<string>>> = {
  block: new Set(["children", "level", "listItem", "markDefs", "style"]),
  file: new Set(["asset", "media"]),
  geopoint: new Set(["alt", "lat", "lng"]),
  image: new Set(["asset", "crop", "hotspot", "media"]),
  slug: new Set(["current", "source"]),
};

/**
 * Checks whether a value is a compiled schema field with a nested type object.
 *
 * @param value - The value to check.
 * @returns True if the value is a compiled field.
 */
function isCompiledField(value: unknown): value is CompiledField {
  if (typeof value !== "object" || value === null) return false;
  if (!("name" in value) || !("type" in value)) return false;

  return typeof value.type === "object" && value.type !== null;
}

/**
 * Checks whether a value has a `fields` array property.
 *
 * @param value - The value to check.
 * @returns True if the value contains a `fields` array.
 */
function hasFieldsArray(value: unknown): value is { fields: unknown[] } {
  if (typeof value !== "object" || value === null || !("fields" in value)) return false;

  return Array.isArray(value.fields);
}

/**
 * Checks whether a value has an `of` array property.
 *
 * @param value - The value to check.
 * @returns True if the value contains an `of` array.
 */
function hasOfArray(value: unknown): value is { of: unknown[] } {
  if (typeof value !== "object" || value === null || !("of" in value)) return false;

  return Array.isArray(value.of);
}

/**
 * Extracts the type name a value declares, where it names one at all.
 *
 * @param value - The value to inspect.
 * @returns The type name, or undefined when the value declares none.
 */
function getTypeName(value: unknown) {
  if (typeof value !== "object" || value === null || !("type" in value)) return undefined;

  return typeof value.type === "string" ? value.type : undefined;
}

/**
 * Extracts the parent type name from a compiled schema type, if present.
 *
 * @param resolvedType - The compiled schema type to inspect.
 * @returns The parent type name, or undefined when the type extends none.
 */
function getParentTypeName(resolvedType: unknown) {
  if (typeof resolvedType !== "object" || resolvedType === null || !("type" in resolvedType)) return undefined;
  if (typeof resolvedType.type !== "object" || resolvedType.type === null || !("name" in resolvedType.type)) {
    return undefined;
  }

  return String(resolvedType.type.name);
}

/**
 * Normalises a compiled schema field into the shape the Handbook renders. Type names already seen are
 * tracked so a type that refers back to itself does not recurse forever.
 *
 * @param field - A compiled schema field or plain field definition.
 * @param visited - Type names already seen in this normalisation chain.
 * @returns The normalised field.
 */
function normaliseField(field: unknown, visited = new Set<string>()) {
  if (isCompiledField(field)) {
    const typeName = field.type.name;

    const result: NormalisedField = {
      name: field.name,
      type: typeName,
      title: field.title ?? field.type.title,
      description: field.description ?? field.type.description,
      handbook: field.handbook,
    };

    if (!visited.has(typeName)) {
      const shouldTrack = !opaqueTypes.has(typeName) && typeName !== "object" && typeName !== "array";
      const next = shouldTrack ? new Set([...visited, typeName]) : visited;
      const fieldSource = hasFieldsArray(field) ? field : field.type;
      const ofSource = hasOfArray(field) ? field : field.type;

      if (hasFieldsArray(fieldSource)) {
        result.fields = fieldSource.fields.map((subfield) => normaliseField(subfield, next));
      }
      if (hasOfArray(ofSource)) result.of = ofSource.of.map((member) => normaliseField(member, next));
    }

    return result;
  }

  // oxlint-disable-next-line no-unsafe-type-assertion -- Schema values that are already normalised carry no marker to narrow on.
  return field as NormalisedField;
}

/**
 * Resolves only the fields a custom type adds on top of an opaque base type, leaving out the ones the
 * base type contributes of its own accord.
 *
 * @param resolvedType - The compiled or normalised schema type.
 * @param parentName - The opaque base type name.
 * @returns The custom fields, or undefined when the type adds none.
 */
function resolveCustomFields(resolvedType: unknown, parentName: string) {
  if (!hasFieldsArray(resolvedType)) return undefined;

  const inherited = inheritedFieldNames[parentName];

  const customFields = resolvedType.fields
    .map((field: unknown) => normaliseField(field))
    .filter((field) => !isDefined(inherited) || !inherited.has(field.name));

  return isDefined(customFields) ? customFields : undefined;
}

/**
 * Normalises a list of raw field values into the shape the Handbook renders.
 *
 * @param items - Raw field values to normalise.
 * @returns The normalised fields, or undefined when the list holds none.
 */
function resolveNormalisedFields(items: unknown[]) {
  const normalised = items.map((item) => normaliseField(item));

  return isDefined(normalised) ? normalised : undefined;
}

/**
 * Normalises array members and filters out opaque types that have no meaningful subfields.
 *
 * @param members - Raw array member values to normalise.
 * @returns The normalised non-opaque members, or undefined when none remain.
 */
function resolveNormalisedMembers(members: unknown[]) {
  const normalised = members.map((member) => normaliseField(member)).filter((member) => !opaqueTypes.has(member.type));

  return isDefined(normalised) ? normalised : undefined;
}

/**
 * Resolves the name of the type a value extends, reaching into the schema registry when the value
 * carries nothing but a type name of its own.
 *
 * @param value - The value to inspect.
 * @param schema - The Sanity schema registry.
 * @returns The parent type name, or undefined when the value extends none.
 */
function resolveParentName(value: unknown, schema: Schema) {
  const direct = getParentTypeName(value);
  if (isDefined(direct)) return direct;

  const typeName = getTypeName(value);
  if (!isDefined(typeName)) return undefined;

  const resolvedType = schema.get(typeName);
  return isDefined(resolvedType) ? getParentTypeName(resolvedType) : undefined;
}

/**
 * Extracts the fields a value displays, whether it carries them directly, carries array members that
 * do, or names a type that does.
 *
 * @param value - The value to extract fields from.
 * @param schema - The Sanity schema registry.
 * @returns The resolved fields, or undefined when the value has none.
 */
function resolveFields(value: unknown, schema: Schema) {
  if (hasFieldsArray(value)) {
    const parentName = resolveParentName(value, schema);
    if (isDefined(parentName) && opaqueTypes.has(parentName)) return resolveCustomFields(value, parentName);

    return resolveNormalisedFields(value.fields);
  }

  if (hasOfArray(value)) {
    const members = value.of;

    if (members.length === 1) {
      const [member] = members;
      const normalised = normaliseField(member);

      if (opaqueTypes.has(normalised.type)) return undefined;

      if (hasFieldsArray(normalised)) {
        const parentName = resolveParentName(normalised, schema);
        if (isDefined(parentName) && opaqueTypes.has(parentName)) return resolveCustomFields(normalised, parentName);

        return resolveNormalisedFields(normalised.fields);
      }

      const memberType = schema.get(normalised.type);
      if (isDefined(memberType)) return resolveFields(memberType, schema);
    }

    return resolveNormalisedMembers(members);
  }

  return undefined;
}

/**
 * Resolves the displayable subfields of a field definition by traversing the schema.
 *
 * @param field - The parent field definition.
 * @param schema - The Sanity schema registry.
 * @returns The non-opaque subfields, or undefined when the field has none.
 */
export function getSubfields(field: FieldDefinition | NormalisedField, schema: Schema) {
  if (opaqueTypes.has(field.type)) return undefined;

  const directFields = resolveFields(field, schema);
  if (isDefined(directFields)) return directFields;

  const resolvedType = schema.get(field.type);
  if (!isDefined(resolvedType)) return undefined;

  const parentName = getParentTypeName(resolvedType);
  if (isDefined(parentName) && opaqueTypes.has(parentName)) {
    return resolveCustomFields(resolvedType, parentName);
  }

  return resolveFields(resolvedType, schema);
}

import { ChevronDownIcon, ChevronRightIcon } from "@sanity/icons";
import { Box, Card, Flex, Popover, Stack, Text, useClickOutsideEvent } from "@sanity/ui";
import { InfoIcon, LightbulbIcon, TriangleAlertIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { FieldDefinition, SchemaType } from "sanity";
import { useSchema } from "sanity";

import { defaultIconProps } from "../lib/icons";
import { convertCase, isDefined } from "../lib/utils";

interface FieldProps {
  /** The schema field definition to render. */
  field: FieldDefinition;
  /** Current nesting depth for recursive subfield rendering. */
  depth?: number;
}

interface CompiledField {
  /** Field identifier in the schema. */
  name: string;
  /** Resolved type object containing the type name, title, description, and nested definitions. */
  type: { name: string; title?: string; description?: string; fields?: unknown[]; of?: unknown[] };
  /** Optional handbook metadata annotations for this field. */
  handbook?: FieldDefinition["handbook"];
}

/** Schema type names treated as leaf types whose subfields are not displayed. */
const opaqueTypes = new Set([
  "slug",
  "image",
  "file",
  "reference",
  "crossDatasetReference",
  "geopoint",
  "datetime",
  "date",
  "url",
  "text",
  "string",
  "number",
  "boolean",
  "block",
]);

/** Fallback description shown when a schema field has no description defined. */
const defaultFieldDescription =
  "No description has been added for this field. Please consult your developer(s) to update your Handbook.";

/**
 * Type guard that checks whether a value is a compiled schema field with a nested type object.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a compiled field.
 */
function isCompiledField(value: unknown): value is CompiledField {
  if (typeof value !== "object" || value === null) return false;
  if (!("name" in value) || !("type" in value)) return false;

  return typeof value.type === "object" && value.type !== null;
}

/**
 * Type guard that checks whether a value has an `of` array property (e.g. array member definitions).
 *
 * @param value - The value to check.
 * @returns `true` if the value contains an `of` array.
 */
function hasOfArray(value: unknown): value is { of: unknown[] } {
  if (typeof value !== "object" || value === null || !("of" in value)) return false;

  return Array.isArray(value.of);
}

/**
 * Type guard that checks whether a value has a `fields` array property (e.g. object-type definitions).
 *
 * @param value - The value to check.
 * @returns `true` if the value contains a `fields` array.
 */
function hasFieldsArray(value: unknown): value is { fields: unknown[] } {
  if (typeof value !== "object" || value === null || !("fields" in value)) return false;

  return Array.isArray(value.fields);
}

/**
 * Extracts the string `type` property from an unknown value, if present.
 *
 * @param member - The value to inspect.
 * @returns The type name string, or `undefined`.
 */
function getTypeName(member: unknown): string | undefined {
  if (typeof member !== "object" || member === null || !("type" in member)) return undefined;

  return typeof member.type === "string" ? member.type : undefined;
}

/**
 * Normalises a compiled schema field into a FieldDefinition-compatible shape.
 *
 * @param field - A compiled schema field or plain field definition.
 * @returns A FieldDefinition-compatible object.
 */
function normaliseField(field: unknown): FieldDefinition {
  if (isCompiledField(field)) {
    const result: Record<string, unknown> = {
      name: field.name,
      type: field.type.name,
      title: field.type.title,
      description: field.type.description,
      handbook: field.handbook,
    };

    if (hasFieldsArray(field.type)) result.fields = field.type.fields.map((subfield) => normaliseField(subfield));
    if (hasOfArray(field.type)) result.of = field.type.of.map((member) => normaliseField(member));

    // oxlint-disable-next-line no-unsafe-type-assertion -- Constructed to match FieldDefinition shape.
    return result as unknown as FieldDefinition;
  }

  // oxlint-disable-next-line no-unsafe-type-assertion -- Already a plain FieldDefinition.
  return field as FieldDefinition;
}

/**
 * Determines whether a schema type is opaque (a leaf type whose subfields should not be displayed).
 *
 * @param typeName - The schema type name to check.
 * @param schema - The Sanity schema registry.
 * @returns `true` if the type is opaque.
 */
function isOpaqueType(typeName: string, schema: { get: (name: string) => SchemaType | undefined }): boolean {
  if (opaqueTypes.has(typeName)) return true;

  const parent: unknown = schema.get(typeName)?.type;

  return isDefined(parent) && typeof parent === "object" && "name" in parent && opaqueTypes.has(String(parent.name));
}

/**
 * Filters out opaque types from a list of field definitions, returning `undefined` if none remain.
 *
 * @param fields - The field definitions to filter.
 * @param schema - The Sanity schema registry.
 * @returns The filtered fields, or `undefined` if all are opaque.
 */
function filterOpaque(
  fields: FieldDefinition[],
  schema: { get: (name: string) => SchemaType | undefined },
): FieldDefinition[] | undefined {
  const filtered = fields.filter((subfield) => !isOpaqueType(subfield.type, schema));

  return isDefined(filtered) ? filtered : undefined;
}

/**
 * Normalises and filters a list of raw field or member values, removing opaque types.
 *
 * @param items - Raw field or member values to normalise.
 * @param schema - The Sanity schema registry.
 * @returns The normalised non-opaque fields, or `undefined` if none remain.
 */
function resolveNormalisedFields(
  items: unknown[],
  schema: { get: (name: string) => SchemaType | undefined },
): FieldDefinition[] | undefined {
  return filterOpaque(
    items.map((item) => normaliseField(item)),
    schema,
  );
}

/**
 * Attempts to extract displayable fields from a value by checking for direct fields,
 * an `of` array, or a schema type lookup on single array members.
 *
 * @param value - The value to extract fields from.
 * @param schema - The Sanity schema registry.
 * @returns The resolved fields, or `undefined` if the value has none.
 */
function resolveFields(
  value: unknown,
  schema: { get: (name: string) => SchemaType | undefined },
): FieldDefinition[] | undefined {
  if (hasFieldsArray(value)) return resolveNormalisedFields(value.fields, schema);

  if (hasOfArray(value)) {
    const members = value.of;

    if (members.length === 1) {
      const [member] = members;
      if (hasFieldsArray(member)) return resolveNormalisedFields(member.fields, schema);

      const memberTypeName = getTypeName(member);
      const memberType = isDefined(memberTypeName) ? schema.get(memberTypeName) : undefined;
      if (memberType && hasFieldsArray(memberType)) return resolveNormalisedFields(memberType.fields, schema);
    }

    return resolveNormalisedFields(members, schema);
  }

  return undefined;
}

/**
 * Resolves the displayable subfields of a field definition by traversing the schema.
 *
 * @param field - The parent field definition.
 * @param schema - The Sanity schema registry.
 * @returns The non-opaque subfields, or `undefined` if the field has none.
 */
function getSubfields(
  field: FieldDefinition,
  schema: { get: (name: string) => SchemaType | undefined },
): FieldDefinition[] | undefined {
  if (isOpaqueType(field.type, schema)) return undefined;

  const directFields = resolveFields(field, schema);
  if (directFields !== undefined) return directFields;

  const resolvedType = schema.get(field.type);
  if (!isDefined(resolvedType)) return undefined;

  return resolveFields(resolvedType, schema);
}

interface FieldHintProps {
  /** Accessible label and popover heading. */
  label: string;
  /** Icon element displayed on the hint button. */
  icon: ReactNode;
  /** CSS color applied to the hint icon. */
  color: string;
  /** Whether the popover is currently visible. */
  open: boolean;
  /** Text content displayed inside the popover. */
  children: string;
  /** Callback to toggle popover visibility. */
  onToggle: () => void;
  /** Callback to close the popover. */
  onClose: () => void;
}

function FieldHint({ label, icon, color, open, children, onToggle, onClose }: FieldHintProps) {
  const buttonReference = useRef<HTMLButtonElement | null>(null);
  const popoverReference = useRef<HTMLDivElement | null>(null);

  useClickOutsideEvent(open ? onClose : undefined, () => [buttonReference.current, popoverReference.current]);

  return (
    <Popover
      open={open}
      placement="top"
      portal
      radius={2}
      shadow={2}
      content={
        <div ref={popoverReference}>
          <Box padding={3} style={{ maxWidth: "280px" }}>
            <Stack space={3}>
              <Text size={1} weight="semibold">
                {label}
              </Text>
              <Text size={1} muted>
                {children}
              </Text>
            </Stack>
          </Box>
        </div>
      }
    >
      <button
        ref={buttonReference}
        aria-label={label}
        type="button"
        onClick={onToggle}
        onMouseEnter={onToggle}
        onMouseLeave={onClose}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "2px",
          fontSize: "16px",
          color,
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        {icon}
      </button>
    </Popover>
  );
}

export function Field({ field, depth = 0 }: FieldProps) {
  const schema = useSchema();
  const [expanded, setExpanded] = useState(false);
  const [openHint, setOpenHint] = useState<string | null>(null);

  const effectiveTitle = field.handbook?.title ?? field.title ?? (field.name && convertCase(field.name, "title"));
  const effectiveDescription = field.handbook?.description ?? field.description ?? defaultFieldDescription;

  const { example, tip, info, caution } = field.handbook ?? {};
  const hasHints = isDefined([tip, info, caution]);

  const subfields = getSubfields(field, schema);
  const hasSubfields = isDefined(subfields);

  const closeHint = useCallback(() => {
    setOpenHint(null);
  }, []);

  return (
    <Stack space={2}>
      <Stack space={3}>
        <Flex align="center" paddingY={1} gap={2}>
          <Box flex={1}>
            <Flex align="center" gap={2}>
              <Text size={1} weight="medium">
                {effectiveTitle}
              </Text>
              <Text size={0} muted style={{ marginTop: "2px" }}>
                {field.type}
              </Text>
            </Flex>
          </Box>
          {hasHints && (
            <Flex align="center" gap={2}>
              {isDefined(tip) && (
                <FieldHint
                  label="Tip"
                  icon={<LightbulbIcon {...defaultIconProps} />}
                  color="var(--card-icon-color)"
                  open={openHint === "tip"}
                  onToggle={() => {
                    setOpenHint(openHint === "tip" ? null : "tip");
                  }}
                  onClose={closeHint}
                >
                  {tip}
                </FieldHint>
              )}
              {isDefined(info) && (
                <FieldHint
                  label="Information"
                  icon={<InfoIcon {...defaultIconProps} />}
                  color="var(--card-icon-color)"
                  open={openHint === "info"}
                  onToggle={() => {
                    setOpenHint(openHint === "info" ? null : "info");
                  }}
                  onClose={closeHint}
                >
                  {info}
                </FieldHint>
              )}
              {isDefined(caution) && (
                <FieldHint
                  label="Caution"
                  icon={<TriangleAlertIcon {...defaultIconProps} />}
                  color="var(--card-icon-color)"
                  open={openHint === "caution"}
                  onToggle={() => {
                    setOpenHint(openHint === "caution" ? null : "caution");
                  }}
                  onClose={closeHint}
                >
                  {caution}
                </FieldHint>
              )}
            </Flex>
          )}
        </Flex>
        {isDefined(effectiveDescription) && (
          <Text size={1} muted>
            {effectiveDescription}
          </Text>
        )}
        {isDefined(example) && (
          <Box marginTop={1}>
            <Text size={1} muted style={{ fontStyle: "italic" }}>
              e.g. {example}
            </Text>
          </Box>
        )}
      </Stack>
      {hasSubfields && (
        <Box marginTop={4}>
          <Card
            as="button"
            padding={3}
            radius={2}
            tone="transparent"
            onClick={() => {
              setExpanded(!expanded);
            }}
            style={{ width: "100%", textAlign: "left", border: "none", cursor: "pointer" }}
          >
            <Flex align="center" gap={2}>
              <Text size={0}>{expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}</Text>
              <Text size={1} muted weight="medium">
                {subfields.length} subfield{subfields.length === 1 ? "" : "s"}
              </Text>
            </Flex>
          </Card>
          {expanded && (
            <Stack space={5} paddingTop={4} paddingBottom={2} paddingLeft={4}>
              {subfields.map((subfield) => (
                <Field key={subfield.name} field={subfield} depth={depth + 1} />
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Stack>
  );
}

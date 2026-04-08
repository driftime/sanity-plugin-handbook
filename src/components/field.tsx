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
  /** Type names already expanded in the ancestor chain, used to detect cycles. */
  ancestors?: Set<string>;
}

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
  /** Optional handbook metadata annotations for this field. */
  handbook?: FieldDefinition["handbook"];
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
 * Type guard that checks whether a value has a `fields` array property.
 *
 * @param value - The value to check.
 * @returns `true` if the value contains a `fields` array.
 */
function hasFieldsArray(value: unknown): value is { fields: unknown[] } {
  if (typeof value !== "object" || value === null || !("fields" in value)) return false;

  return Array.isArray(value.fields);
}

/**
 * Type guard that checks whether a value has an `of` array property.
 *
 * @param value - The value to check.
 * @returns `true` if the value contains an `of` array.
 */
function hasOfArray(value: unknown): value is { of: unknown[] } {
  if (typeof value !== "object" || value === null || !("of" in value)) return false;

  return Array.isArray(value.of);
}

/**
 * Extracts the string `type` property from an unknown value, if present.
 *
 * @param value - The value to inspect.
 * @returns The type name string, or `undefined`.
 */
function getTypeName(value: unknown) {
  if (typeof value !== "object" || value === null || !("type" in value)) return undefined;

  return typeof value.type === "string" ? value.type : undefined;
}

/**
 * Determines whether a schema type is opaque (a leaf type whose subfields should not be displayed).
 *
 * @param typeName - The schema type name to check.
 * @returns `true` if the type is opaque.
 */
function isOpaqueType(typeName: string) {
  return opaqueTypes.has(typeName);
}

/**
 * Extracts the parent type name from a compiled schema type, if present.
 *
 * @param resolvedType - The compiled schema type to inspect.
 * @returns The parent type name, or `undefined`.
 */
function getParentTypeName(resolvedType: unknown) {
  if (typeof resolvedType !== "object" || resolvedType === null || !("type" in resolvedType)) return undefined;
  if (typeof resolvedType.type !== "object" || resolvedType.type === null || !("name" in resolvedType.type)) {
    return undefined;
  }

  return String(resolvedType.type.name);
}

/**
 * Normalises a compiled schema field into a FieldDefinition-compatible shape.
 * Tracks visited type names to prevent infinite recursion on circular references.
 *
 * @param field - A compiled schema field or plain field definition.
 * @param visited - Type names already seen in this normalisation chain.
 * @returns A FieldDefinition-compatible object.
 */
function normaliseField(field: unknown, visited = new Set<string>()) {
  if (isCompiledField(field)) {
    const typeName = field.type.name;

    const result: Record<string, unknown> = {
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

    // oxlint-disable-next-line no-unsafe-type-assertion -- Constructed to match FieldDefinition shape.
    return result as unknown as FieldDefinition;
  }

  // oxlint-disable-next-line no-unsafe-type-assertion -- Already a plain FieldDefinition.
  return field as FieldDefinition;
}

/**
 * Resolves only the fields a custom type adds on top of an opaque base type,
 * excluding fields injected by the base type during schema compilation.
 *
 * @param resolvedType - The compiled or normalised schema type.
 * @param parentName - The opaque base type name.
 * @returns The custom fields, or `undefined` if none exist.
 */
function resolveCustomFields(resolvedType: unknown, parentName: string) {
  if (!hasFieldsArray(resolvedType)) return undefined;

  const inherited = inheritedFieldNames[parentName];

  const customFields = resolvedType.fields
    .map((field: unknown) => normaliseField(field))
    .filter((field) => inherited === undefined || !inherited.has(field.name));

  return isDefined(customFields) ? customFields : undefined;
}

/**
 * Normalises a list of raw field values into FieldDefinition-compatible shapes.
 *
 * @param items - Raw field values to normalise.
 * @returns The normalised fields, or `undefined` if none exist.
 */
function resolveNormalisedFields(items: unknown[]) {
  const normalised = items.map((item) => normaliseField(item));

  return isDefined(normalised) ? normalised : undefined;
}

/**
 * Normalises array members and filters out opaque types that have no meaningful subfields.
 *
 * @param members - Raw array member values to normalise.
 * @returns The normalised non-opaque members, or `undefined` if none remain.
 */
function resolveNormalisedMembers(members: unknown[]) {
  const normalised = members.map((member) => normaliseField(member)).filter((member) => !isOpaqueType(member.type));

  return isDefined(normalised) ? normalised : undefined;
}

/**
 * Resolves the parent type name from a value, trying direct extraction first
 * and falling back to a schema lookup for normalised values with string types.
 *
 * @param value - The value to inspect.
 * @param schema - The Sanity schema registry.
 * @returns The parent type name, or `undefined`.
 */
function resolveParentName(value: unknown, schema: { get: (name: string) => SchemaType | undefined }) {
  const direct = getParentTypeName(value);
  if (isDefined(direct)) return direct;

  const typeName = getTypeName(value);
  if (!isDefined(typeName)) return undefined;

  const resolvedType = schema.get(typeName);
  return isDefined(resolvedType) ? getParentTypeName(resolvedType) : undefined;
}

/**
 * Attempts to extract displayable fields from a value by checking for direct fields,
 * an `of` array, or a schema type lookup on single array members.
 *
 * @param value - The value to extract fields from.
 * @param schema - The Sanity schema registry.
 * @returns The resolved fields, or `undefined` if the value has none.
 */
function resolveFields(value: unknown, schema: { get: (name: string) => SchemaType | undefined }) {
  if (hasFieldsArray(value)) {
    const parentName = resolveParentName(value, schema);
    if (isDefined(parentName) && isOpaqueType(parentName)) return resolveCustomFields(value, parentName);

    return resolveNormalisedFields(value.fields);
  }

  if (hasOfArray(value)) {
    const members = value.of;

    if (members.length === 1) {
      const [member] = members;
      const normalised = normaliseField(member);

      if (isOpaqueType(normalised.type)) return undefined;

      if (hasFieldsArray(normalised)) {
        const parentName = resolveParentName(normalised, schema);
        if (isDefined(parentName) && isOpaqueType(parentName)) return resolveCustomFields(normalised, parentName);

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
 * @returns The non-opaque subfields, or `undefined` if the field has none.
 */
function getSubfields(field: FieldDefinition, schema: { get: (name: string) => SchemaType | undefined }) {
  if (isOpaqueType(field.type)) return undefined;

  const directFields = resolveFields(field, schema);
  if (directFields !== undefined) return directFields;

  const resolvedType = schema.get(field.type);
  if (!isDefined(resolvedType)) return undefined;

  const parentName = getParentTypeName(resolvedType);
  if (isDefined(parentName) && isOpaqueType(parentName)) {
    return resolveCustomFields(resolvedType, parentName);
  }

  return resolveFields(resolvedType, schema);
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

function FieldHints({ tip, info, caution }: { tip?: string; info?: string; caution?: string }) {
  const [openHint, setOpenHint] = useState<string | null>(null);

  const closeHint = useCallback(() => {
    setOpenHint(null);
  }, []);

  return (
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
  );
}

export function Field({ field, depth = 0, ancestors = new Set() }: FieldProps) {
  const schema = useSchema();
  const [expanded, setExpanded] = useState(false);

  const effectiveTitle = field.handbook?.title ?? field.title ?? (field.name && convertCase(field.name, "title"));
  const effectiveDescription = field.handbook?.description ?? field.description ?? defaultFieldDescription;

  const { example, tip, info, caution } = field.handbook ?? {};
  const hasHints = isDefined([tip, info, caution]);

  const isCycle = ancestors.has(field.type);
  const subfields = isCycle ? undefined : getSubfields(field, schema);
  const hasSubfields = isDefined(subfields);

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
          {hasHints && <FieldHints tip={tip} info={info} caution={caution} />}
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
      {isCycle && (
        <Box marginTop={2}>
          <Text size={1} muted style={{ fontStyle: "italic" }}>
            See {convertCase(field.type, "title")} above.
          </Text>
        </Box>
      )}
      {hasSubfields && (
        <>
          <Card
            as="button"
            padding={3}
            radius={2}
            tone="transparent"
            onClick={() => {
              setExpanded(!expanded);
            }}
            style={{ width: "100%", marginTop: "1rem", textAlign: "left", border: "none", cursor: "pointer" }}
          >
            <Flex align="center" gap={2}>
              <Text size={0}>{expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}</Text>
              <Text size={1} muted weight="medium">
                {subfields.length} subfield{subfields.length === 1 ? "" : "s"}
              </Text>
            </Flex>
          </Card>
          {expanded && (
            <div
              style={{
                marginTop: "16px",
                marginBottom: "8px",
                paddingLeft: "16px",
                borderLeft: "1px solid var(--card-border-color)",
              }}
            >
              <Stack space={5}>
                {subfields.map((subfield) => (
                  <Field
                    key={subfield.name}
                    field={subfield}
                    depth={depth + 1}
                    ancestors={new Set([...ancestors, field.type])}
                  />
                ))}
              </Stack>
            </div>
          )}
        </>
      )}
    </Stack>
  );
}

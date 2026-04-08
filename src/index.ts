import { definePlugin } from "sanity";

import { BookTextIcon } from "./icons/book-text";
import { createHandbookTool } from "./layouts/tool";
import { setHandbookEditors } from "./lib/handbook-structure";
import { createSanityIcon } from "./lib/icons";
import { isDefined, isPermittedEditor } from "./lib/utils";
import { handbookCalloutType } from "./schemas/blocks/callout";
import { handbookCodeType } from "./schemas/blocks/code";
import { handbookHorizontalRuleType } from "./schemas/blocks/horizontal-rule";
import { handbookImageType } from "./schemas/blocks/image";
import { handbookVideoType } from "./schemas/blocks/video";
import { createHandbookGuideType } from "./schemas/types/guide";
import { handbookType } from "./schemas/types/handbook";
import type { HandbookConfig, HandbookStructureGroup } from "./types";

export type {
  HandbookBlockDefinition,
  HandbookConfig,
  HandbookGuideGroup,
  HandbookMetadata,
  HandbookStructureGroup,
  SanityHandbook,
  SanityHandbookGuide,
} from "./types";
export { handbookStructure } from "./lib/handbook-structure";
export { useIsHandbookEditor } from "./hooks/use-is-handbook-editor";

/** Document types that should not appear in the "create new" menu. */
const handbookSingletonTypes = new Set(["handbook.handbook"]);

/** All handbook document types used to filter template items for non-editors. */
const handbookDocumentTypes = new Set(["handbook.handbook", "handbook.guide"]);

/**
 * Checks whether a template ID matches or is a variant of any type in the given set.
 *
 * @param templateId - The template identifier to check.
 * @param typeSet - The set of document type names to match against.
 * @returns True if the template ID matches a type or starts with a type prefix.
 */
function isHandbookTemplate(templateId: string, typeSet: Set<string>) {
  return typeSet.has(templateId) || [...typeSet].some((type) => templateId.startsWith(`${type}-`));
}

/**
 * Validates a single document type group entry in the plugin configuration.
 *
 * @param index - Position of the group in the configuration array.
 * @param group - The document type group to validate.
 */
function validateGroup(index: number, group: HandbookStructureGroup) {
  const prefix = `sanity-handbook: groups[${index}]`;

  if (!isDefined(group.title)) throw new Error(`${prefix} is missing a required "title" property.`);

  if (!Array.isArray(group.documents) || group.documents.length === 0) {
    throw new Error(`${prefix} must have a non-empty "documents" array.`);
  }

  for (const document of group.documents) {
    if (!isDefined(document.name)) {
      throw new Error(`${prefix}.documents contains a document without a "name" property.`);
    }

    if (!Array.isArray(document.fields)) {
      throw new TypeError(`${prefix}.documents.${document.name} is missing a "fields" array.`);
    }
  }
}

/**
 * Validates the full handbook plugin configuration, checking all groups.
 *
 * @param config - The plugin configuration to validate.
 */
function validateConfig(config: HandbookConfig) {
  if (config.groups) {
    for (const [index, group] of config.groups.entries()) {
      validateGroup(index, group);
    }
  }
}

/**
 * Creates a Handbook tool for Sanity Studio, providing auto-generated documentation
 * for document types and Portable Text guides within the Studio interface.
 *
 * @public
 * @param config - Optional plugin configuration.
 * @returns Sanity plugin definition.
 */
export function handbookPlugin(config?: HandbookConfig) {
  if (config) validateConfig(config);

  const customBlocks = config?.blocks ?? [];
  const editors = config?.editors;
  setHandbookEditors(editors);

  const guideType = createHandbookGuideType(customBlocks);

  return definePlugin(() => ({
    name: "@driftime/sanity-plugin-handbook",
    schema: {
      types: [
        handbookType,
        guideType,
        handbookImageType,
        handbookVideoType,
        handbookCodeType,
        handbookCalloutType,
        handbookHorizontalRuleType,
        ...customBlocks.map((block) => block.schema),
      ],
    },
    document: {
      newDocumentOptions: (templateItems, { creationContext, currentUser }) => {
        if (creationContext.type === "global" || creationContext.type === "structure") {
          if (!isPermittedEditor(editors, currentUser?.email)) {
            return templateItems.filter((item) => !isHandbookTemplate(item.templateId, handbookDocumentTypes));
          }

          return templateItems.filter((item) => !isHandbookTemplate(item.templateId, handbookSingletonTypes));
        }

        return templateItems;
      },
      actions: (actionComponents, { schemaType }) => {
        if (handbookSingletonTypes.has(schemaType)) {
          return actionComponents.filter(({ action }) => action !== "duplicate");
        }

        return actionComponents;
      },
    },
    tools: [
      {
        name: "handbook",
        title: config?.title ?? "Handbook",
        icon: createSanityIcon(BookTextIcon),
        component: createHandbookTool({ ...config, blocks: customBlocks }),
      },
    ],
  }))();
}

import { BookTextIcon } from "lucide-react";
import { definePlugin } from "sanity";

import { createHandbookTool } from "./layouts/tool";
import { createSanityIcon } from "./lib/icons";
import { isDefined } from "./lib/utils";
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

/** Document types that should not appear in the "create new" menu. */
const handbookSingletonTypes = new Set(["handbook.handbook"]);

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
        component: createHandbookTool({
          sidebarTitle: config?.sidebarTitle,
          groups: config?.groups,
          blocks: customBlocks,
        }),
      },
    ],
  }))();
}

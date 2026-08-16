export { handbookPlugin } from "@/plugin";
export { handbookStructure } from "@/lib/structure";
export { useIsHandbookEditor } from "@/hooks/use-is-handbook-editor";

export type {
  SanityHandbookMetadata,
  SanityHandbookDocumentRole,
  SanityHandbookBlockDefinition,
  SanityHandbookConfig,
} from "@/plugin";
export type { SanityHandbook, SanityHandbookGuideGroup } from "@/schemas/types/handbook";
export type { SanityHandbookGuide } from "@/schemas/types/guide";
export type { SanityHandbookCallout } from "@/schemas/blocks/callout";
export type { SanityHandbookCode } from "@/schemas/blocks/code";
export type { SanityHandbookHorizontalRule } from "@/schemas/blocks/horizontal-rule";
export type { SanityHandbookImage } from "@/schemas/blocks/image";
export type { SanityHandbookVideo } from "@/schemas/blocks/video";
export type { SanityHandbookLink } from "@/schemas/annotations/link";

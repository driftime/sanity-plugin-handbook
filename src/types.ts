import type { ComponentType } from "react";
import type {
  DocumentDefinition,
  PortableTextBlock,
  PortableTextObject,
  SanityDocument,
  SchemaTypeDefinition,
} from "sanity";

declare module "@sanity/types" {
  interface FieldDefinitionBase {
    handbook?: HandbookMetadata;
  }

  // oxlint-disable-next-line no-shadow -- Module augmentation intentionally redeclares the imported type.
  interface DocumentDefinition {
    handbook?: HandbookMetadata;
  }
}

/** @public */
export interface HandbookMetadata {
  /** Display title override for the field or document. */
  title?: string;
  /** Description shown beneath the field or document heading. */
  description?: string;
  /** Illustrative example value for the field. */
  example?: string;
  /** Helpful tip displayed as a popover hint. */
  tip?: string;
  /** Informational note displayed as a popover hint. */
  info?: string;
  /** Warning displayed as a popover hint. */
  caution?: string;
}

/** @public */
export interface HandbookStructureGroup {
  /** Display title for the document type group. */
  title: string;
  /** Brief description of the group's purpose. */
  description?: string;
  /** Document definitions belonging to this group. */
  documents: DocumentDefinition[];
}

/** @public */
export interface HandbookBlockDefinition {
  /** Sanity schema type definition for the custom block. */
  schema: SchemaTypeDefinition;
  /** React component for rendering the block in the Handbook viewer. */
  component: ComponentType<{ value: PortableTextObject }>;
}

/** @public */
export interface HandbookConfig {
  /** Title shown in the Studio tool navigation. */
  title?: string;
  /** Heading displayed at the top of the sidebar. */
  sidebarTitle?: string;
  /** Document type groups defining the hierarchy. */
  groups?: HandbookStructureGroup[];
  /** Custom Portable Text block definitions for guide content. */
  blocks?: HandbookBlockDefinition[];
  /** Email addresses permitted to edit handbook documents. */
  editors?: string[];
}

/** @public */
export interface HandbookGuideGroup {
  /** Unique key assigned by Sanity for this array item. */
  _key: string;
  /** Display title for this group in the sidebar. */
  title: string;
  /** Ordered array of guide references. */
  guides: SanityHandbookGuide[];
}

/** @public */
export interface SanityHandbook extends SanityDocument {
  /** Document type identifier. */
  _type: "handbook.handbook";
  /** Ordered array of groups, each containing a title and guide references. */
  groups: HandbookGuideGroup[];
}

/** @public */
export interface SanityHandbookGuide extends SanityDocument {
  /** Document type identifier. */
  _type: "handbook.guide";
  /** Unique key assigned by Sanity for this array item. */
  _key: string;
  /** Display title for this guide. */
  title: string;
  /** Brief description shown beneath the guide heading. */
  description?: string;
  /** Portable Text content of the guide. */
  content: PortableTextBlock[];
}

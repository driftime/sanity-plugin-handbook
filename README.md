<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/icon-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/icon-light.svg" />
    <img src="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/icon-light.svg" alt="Handbook icon" width="48" />
  </picture>
  <h1>Handbook — A Sanity Plugin</h1>
  <p>Schema-driven documentation and editorial guides, built right into Sanity Studio.</p>
</div>

<br />

## Overview

Handbook adds a dedicated tool to Sanity Studio that serves two purposes: it automatically generates browsable documentation from your document type schemas, and it provides a rich text guide authoring system for editorial teams. Field descriptions, examples, tips, notes, and warnings are pulled directly from your schema definitions, so your documentation stays in sync with your content model.

<br />

<figure>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-fields-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-fields-light.png" />
    <img src="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-fields-light.png" alt="The Handbook tool displaying field documentation for a Pages document type, with field names, types, descriptions, example values, and an expanded subfields section" />
  </picture>
  <p align="center"><sub><em>Field documentation generated automatically from your schema definitions.</em></sub></p>
</figure>

<br />

## Installation

Handbook is built for Sanity Studio 6 and React 19, and declares both as peer dependencies, so your Studio must already be on those versions.

```bash
bun add -E @driftime/sanity-plugin-handbook
```

## Basic Setup

Add the plugin to your Sanity configuration and pass in the document types you want to document, grouped by the role they play in your content model. Each role appears as a labelled section in the sidebar.

```typescript
import { defineConfig } from "sanity";
import { handbookPlugin } from "@driftime/sanity-plugin-handbook";
// ...

export default defineConfig({
  // ...
  plugins: [
    handbookPlugin({
      roles: [
        {
          title: "Singletons",
          description: "Document types that exist as a single instance.",
          documents: [home],
        },
        {
          title: "Collections",
          description: "Document types with multiple entries.",
          documents: [page],
        },
        {
          title: "Globals",
          description: "Document types shared across the site.",
          documents: [navigation, templates, settings],
        },
      ],
    }),
  ],
});
```

This registers a Handbook tool in the Studio navigation. Opening it displays a sidebar led by a built-in Getting Started section — a page explaining how to read the Handbook, and an overview listing every role and the document types filling it — followed by a labelled section per role. Selecting a document type shows its fields with their descriptions. Each document type carries through the `icon` set on its schema. See [Configuration](#configuration) for all available options.

<br />

<figure>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-document-types-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-document-types-light.png" />
    <img src="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-document-types-light.png" alt="The Handbook tool showing the Document Types overview, with Singletons, Collections, and Globals roles each listing their document types and descriptions" />
  </picture>
  <p align="center"><sub><em>Document types organised by role, browsable from the sidebar.</em></sub></p>
</figure>

<br />

## Handbook Metadata

The plugin augments Sanity's `FieldDefinitionBase` and `DocumentDefinition` interfaces, adding a `handbook` property that TypeScript recognises automatically.

```typescript
import { defineField, defineType } from "sanity";

export const pageType = defineType({
  name: "page",
  type: "document",
  title: "Pages",
  description: "General-purpose pages.",
  handbook: {
    title: "Page",
    description:
      "Standalone pages for anything that does not warrant a document type of its own. Each is reached at its own address and assembled from blocks rather than following a fixed layout.",
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Appears in navigation, browser tabs, and search results.",
      handbook: {
        description:
          "The name this page goes by wherever it is referred to rather than read — navigation menus, browser tabs, and search results. Every page needs one, and it stands behind the slug whenever that is left blank.",
        example: "About Acme Inc.",
        tip: "Keep it short enough to sit comfortably in a navigation menu, and put any fuller opening line in the heading instead.",
        info: "The slug is generated from the title once, so renaming a page later leaves its address unchanged.",
        caution: "Required. Publishing is blocked until it is filled in.",
      },
    }),
  ],
});
```

The `handbook` property supports the following keys:

| Key           | Purpose                                                                 |
| ------------- | ----------------------------------------------------------------------- |
| `title`       | Display title override for the field or document.                       |
| `description` | Description shown beneath the field or document heading.                |
| `example`     | Illustrative example value, displayed in italics.                       |
| `tip`         | Helpful guidance shown as a popover hint.                               |
| `info`        | Additional context shown as a popover hint.                             |
| `caution`     | Warning about constraints or potential issues, shown as a popover hint. |

If no `handbook` property is provided, the tool falls back to the field's `title` and `description` properties. If neither exists, the field name is converted to title case. Fields without any description display a configurable fallback message (see `undocumentedFieldMessage` in [Configuration](#configuration)).

### Subfield Browsing

Fields with nested structure display a collapsible section that editors can expand to explore subfields. Custom types extending built-in types like `image` or `file` show only the fields you add — inherited fields are excluded automatically. Circular type references are detected and labelled rather than rendering infinitely.

## Guide Content

Handbook includes a guide authoring system powered by Portable Text. The plugin automatically registers a `handbook.handbook` singleton and a `handbook.guide` document type — no additional schema setup is required.

The singleton defines the groups and ordering of your guides. Each group contains references to guide documents, which carry a title, an optional description shown beneath the heading, and a rich text body with built-in support for:

- Paragraph, heading, and blockquote styles
- Bold, italic, strikethrough, and inline code formatting
- Bullet and numbered lists
- Inline links
- Image blocks with caption and alternative text
- Video blocks with caption
- Syntax-highlighted code blocks with language selection
- Callout blocks with tip, information, and warning variants
- Horizontal rule dividers

The Handbook tool displays guides in the sidebar alongside your document types. Selecting a guide opens its content in the main panel.

<br />

<figure>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-guide-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-guide-light.png" />
    <img src="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-guide-light.png" alt="A guide displayed in the Handbook tool with headings, paragraphs, a blockquote, a bullet list, a callout, and a captioned image" />
  </picture>
  <p align="center"><sub><em>Editorial guides authored with Portable Text and rendered directly in the tool.</em></sub></p>
</figure>

<br />

## Custom Blocks

Register custom Portable Text blocks for use in guide content by providing a schema definition and a React component. Custom blocks appear as insertion options in the guide content editor and are rendered using the provided component in the Handbook viewer.

```tsx
import { defineConfig, defineField, defineType } from "sanity";
import type { PortableTextObject } from "sanity";
import { handbookPlugin } from "@driftime/sanity-plugin-handbook";
// ...

const exampleSchema = defineType({
  name: "handbook.example",
  type: "object",
  title: "Example",
  fields: [
    defineField({
      name: "label",
      type: "string",
      description: "Text displayed inside the block.",
    }),
  ],
});

function ExampleBlock({ value }: { value: PortableTextObject & { label?: string } }) {
  return <p>{value.label}</p>;
}

export default defineConfig({
  // ...
  plugins: [
    handbookPlugin({
      // ...
      blocks: [
        {
          schema: exampleSchema,
          component: ExampleBlock,
        },
      ],
    }),
  ],
});
```

## Editor Permissions

Restrict who can create and edit Handbook documents by providing a list of email addresses.

```typescript
handbookPlugin({
  // ...
  editors: ["admin@acme.com", "editor@acme.com"],
});
```

When an editors list is provided, only users whose email appears in the list can create or manage Handbook documents. Users not in the list are excluded entirely. If no editors list is provided, all users have full access.

Independently of that list, the Handbook singleton is locked for everyone: it never appears in the create-new menu, and its delete, duplicate, and unpublish actions are removed. Guides stay fully creatable by anyone the list permits.

The `useIsHandbookEditor` hook is exported for use in your own components if you need to conditionally render UI based on editor permissions. It reads the `editors` you gave the plugin, and takes a list as an optional argument to override that.

```typescript
import { useIsHandbookEditor } from "@driftime/sanity-plugin-handbook";

const isEditor = useIsHandbookEditor();
```

## Structure Integration

The Handbook tool renders guides but doesn't author them — that happens in the Structure tool, and nothing appears there until you add it. Use the `handbookStructure` helper to add a Handbook singleton editor and a Handbook Guides list, both restricted to the same editors you gave the plugin.

```typescript
import { handbookStructure } from "@driftime/sanity-plugin-handbook";
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (structureBuilder, context) => {
  const { list, documentTypeListItems, divider } = structureBuilder;

  const handbookItems = handbookStructure(structureBuilder, context);

  return list()
    .title("Content")
    .items([
      ...documentTypeListItems().filter(
        (item) => !["handbook.handbook", "handbook.guide"].includes(item.getId() ?? ""),
      ),
      ...(handbookItems.length > 0 ? [divider(), ...handbookItems] : []),
    ]);
};
```

Two things the helper asks of the surrounding structure. It reads the current user from the resolver's second argument, so accept both parameters even where the rest of your structure only needs the builder. And it returns an empty array for users outside the editors list, so add its divider only when it has items, otherwise those users see a divider with nothing beneath it.

The helper reads the `editors` you gave the plugin, so there is nothing to declare in two places. It takes a list as an optional third argument only to override that, which a Studio running several workspaces under different editors would need.

The filter is only needed where a structure draws on `documentTypeListItems()`, which lists every registered type and so includes the two the plugin adds. A structure built from your own document definitions never picks them up, and can drop the filter entirely.

The Handbook singleton is where you define guide groups and their ordering. Each group contains references to individual guide documents that editors can reorder as needed.

<br />

<figure>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-groups-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-groups-light.png" />
    <img src="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-groups-light.png" alt="The Handbook singleton editor in the Structure tool, showing reorderable groups each containing guide references" />
  </picture>
  <p align="center"><sub><em>The Handbook singleton where groups and their ordering are managed.</em></sub></p>
</figure>

<br />

Individual guides are authored as `handbook.guide` documents, which can be created and edited directly from the Structure tool using the built-in Portable Text editor.

<br />

<figure>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-editor-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-editor-light.png" />
    <img src="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-editor-light.png" alt="The Handbook Guides list in the Structure tool with a guide open beside it, showing its title, description, and Portable Text content editor" />
  </picture>
  <p align="center"><sub><em>Handbook Guides listed in the Structure tool for authoring and editing.</em></sub></p>
</figure>

<br />

## Configuration

Only `roles` is required, since it names the document types the Handbook documents. Everything else falls back to a sensible default.

| Option                     | Type                              | Default                                                                                 | Purpose                                                                          |
| -------------------------- | --------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `title`                    | `string`                          | `"Handbook"`                                                                            | Title shown in the Studio tool navigation.                                       |
| `sidebarTitle`             | `string`                          | `"Handbook"`                                                                            | Heading displayed at the top of the sidebar.                                     |
| `roles`                    | `SanityHandbookDocumentRole[]`    | — (required)                                                                            | Document roles, each shown as a labelled section in the sidebar.                 |
| `blocks`                   | `SanityHandbookBlockDefinition[]` | `[]`                                                                                    | Custom Portable Text block definitions for guide content.                        |
| `editors`                  | `string[]`                        | `undefined`                                                                             | Email addresses permitted to edit Handbook documents. Unrestricted when omitted. |
| `undocumentedFieldMessage` | `string`                          | `"This field has not been documented yet. Contact your development team for guidance."` | Fallback message shown when a field has no description.                          |

## Exported Types

Every type behind the public API is exported, for typing your own configuration or for querying Handbook content outside the Studio.

Configuration you supply:

| Type                            | Purpose                                                                     |
| ------------------------------- | --------------------------------------------------------------------------- |
| `SanityHandbookMetadata`        | The `handbook` property added to field and document definitions.            |
| `SanityHandbookDocumentRole`    | A named role, holding the document types that fill it.                      |
| `SanityHandbookBlockDefinition` | A custom Portable Text block, pairing a schema definition with a component. |
| `SanityHandbookConfig`          | The full plugin configuration accepted by `handbookPlugin`.                 |

Content the dataset stores:

| Type                           | Purpose                                                                   |
| ------------------------------ | ------------------------------------------------------------------------- |
| `SanityHandbook`               | The Handbook singleton document, defining the groups and their ordering.  |
| `SanityHandbookGuideGroup`     | A group within the Handbook singleton, holding an ordered list of guides. |
| `SanityHandbookGuide`          | A guide document, with its title, description, and Portable Text content. |
| `SanityHandbookCallout`        | A callout block, with its variant and Portable Text body.                 |
| `SanityHandbookCode`           | A code block, with its source and language.                               |
| `SanityHandbookHorizontalRule` | A horizontal rule block.                                                  |
| `SanityHandbookImage`          | An image block, with its asset, caption, and alternative text.            |
| `SanityHandbookVideo`          | A video block, with its asset and caption.                                |
| `SanityHandbookLink`           | A link annotation, with the web address it points to.                     |

## Acknowledgements

The icons in `src/icons` are derived from [Lucide](https://lucide.dev) and redrawn as standalone components, so the plugin carries its own iconography without depending on the Lucide package. Icons for controls the Studio already draws, such as disclosure arrows, come from `@sanity/icons` so they match their surroundings. Lucide is distributed under the [ISC License](https://github.com/lucide-icons/lucide/blob/main/LICENSE).

<br />
<br />

<div align="center">
  <a href="https://driftime.com" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://driftime.com/driftime-github-logo-dark.svg" />
      <source media="(prefers-color-scheme: light)" srcset="https://driftime.com/driftime-github-logo.svg" />
      <img src="https://driftime.com/driftime-github-logo.svg" alt="Driftime® Logo" width="100" />
    </picture>
  </a>
</div>

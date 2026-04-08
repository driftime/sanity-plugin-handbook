<br />

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/icon-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/icon.svg" />
    <img src="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/icon.svg" alt="Handbook icon" width="48" />
  </picture>
  <h1>Handbook — A Sanity Plugin</h1>
  <p>Schema-driven documentation and editorial guides, built right into Sanity Studio.</p>
</div>

<br />

## Overview

Handbook adds a dedicated tool to Sanity Studio that serves two purposes: it automatically generates browsable documentation from your document type schemas, and it provides a rich text guide authoring system for editorial teams. Field descriptions, examples, tips, and warnings are pulled directly from your schema definitions, so your documentation stays in sync with your content model.

<br />

<figure>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-fields-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-fields.png" />
    <img src="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-fields.png" alt="The Handbook tool displaying field documentation for a Pages document type, with field names, types, descriptions, and example values" />
  </picture>
  <p align="center"><sub><em>Field documentation generated automatically from your schema definitions.</em></sub></p>
</figure>

<br />

## Installation

```bash
bun add -E @driftime/sanity-plugin-handbook
```

## Basic Setup

Add the plugin to your Sanity configuration and pass in the document types you want to document. Each group appears as a labelled section in the sidebar.

```typescript
import { defineConfig } from "sanity";
import { handbookPlugin } from "@driftime/sanity-plugin-handbook";
// ...

export default defineConfig({
  // ...
  plugins: [
    handbookPlugin({
      groups: [
        {
          title: "Singletons",
          description: "Document types that exist as a single instance.",
          documents: [home, work, latest],
        },
        {
          title: "Collections",
          description: "Document types with multiple entries.",
          documents: [page, caseStudy, article],
        },
      ],
    }),
  ],
});
```

This registers a Handbook tool in the Studio navigation. Opening it displays a sidebar with your document types, each showing its fields with their descriptions. See [Configuration](#configuration) for all available options.

<br />

<figure>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-document-types-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-document-types.png" />
    <img src="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-document-types.png" alt="The Handbook tool showing document type groups in the sidebar with Singletons and Collections listed" />
  </picture>
  <p align="center"><sub><em>Document types organised into groups, browsable from the sidebar.</em></sub></p>
</figure>

<br />

## Handbook Metadata

The plugin augments Sanity's `FieldDefinitionBase` and `DocumentDefinition` interfaces, adding a `handbook` property that TypeScript recognises automatically.

```typescript
import { defineField, defineType } from "sanity";

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  handbook: {
    title: "Page",
    description: "A standalone page with a unique URL.",
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The primary heading displayed on this page.",
      handbook: {
        example: "Acme Inc.",
        tip: "Keep titles concise — under 60 characters for best results.",
        info: "The title is also used to generate the page's URL slug.",
        caution:
          "This field is required. Publishing without a title will cause the page to be excluded from navigation and search indexing.",
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

The singleton defines the groups and ordering of your guides. Each group contains references to guide documents, which are authored using a rich text editor with built-in support for:

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
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-structure-guide-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-structure-guide.png" />
    <img src="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-structure-guide.png" alt="A guide displayed in the Handbook tool with headings, paragraphs, a callout, a bullet list, and a code block" />
  </picture>
  <p align="center"><sub><em>Editorial guides authored with Portable Text and rendered directly in the tool.</em></sub></p>
</figure>

<br />

## Custom Blocks

Register custom Portable Text blocks for use in guide content by providing a schema definition and a React component. Custom blocks appear as insertion options in the guide content editor and are rendered using the provided component in the Handbook viewer.

```typescript
import { defineConfig, defineField, defineType } from "sanity";
import { handbookPlugin } from "@driftime/sanity-plugin-handbook";
// ...

const exampleSchema = defineType({
  name: "handbook.example",
  title: "Example",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
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

Restrict who can create and edit handbook documents by providing a list of email addresses.

```typescript
handbookPlugin({
  editors: ["editor@acme.com", "admin@acme.com"],
});
```

When an editors list is provided, only users whose email appears in the list can create or manage handbook documents. Users not in the list are excluded entirely. If no editors list is provided, all users have full access.

The `useIsHandbookEditor` hook is exported for use in your own components if you need to conditionally render UI based on editor permissions.

```typescript
import { useIsHandbookEditor } from "@driftime/sanity-plugin-handbook";

const isEditor = useIsHandbookEditor(["editor@acme.com"]);
```

## Structure Integration

To add handbook documents to the Structure tool sidebar, use the `handbookStructure` helper. This adds a Handbook singleton editor and a Handbook Guides list. The structure helper respects the same editor permissions configured via the plugin.

```typescript
import { handbookStructure } from "@driftime/sanity-plugin-handbook";

export const structure = (structureBuilder, context) => {
  return structureBuilder
    .list()
    .title("Content")
    .items([
      ...structureBuilder
        .documentTypeListItems()
        .filter((item) => !["handbook.handbook", "handbook.guide"].includes(item.getId() ?? "")),
      structureBuilder.divider(),
      ...handbookStructure(structureBuilder, context),
    ]);
};
```

The Handbook singleton is where you define guide groups and their ordering. Each group contains references to individual guide documents that editors can reorder as needed.

<br />

<figure>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-structure-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-structure.png" />
    <img src="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-structure.png" alt="The Handbook singleton editor in the Structure tool, showing reorderable groups each containing guide references" />
  </picture>
  <p align="center"><sub><em>The Handbook singleton where groups and their ordering are managed.</em></sub></p>
</figure>

<br />

Individual guides are authored as `handbook.guide` documents, which can be created and edited directly from the Structure tool using the built-in Portable Text editor.

<br />

<figure>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-structure-guides-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-structure-guides.png" />
    <img src="https://raw.githubusercontent.com/driftime/sanity-plugin-handbook/HEAD/.github/assets/handbook-structure-guides.png" alt="The Handbook Guides list in the Structure tool, showing individual guide documents available for editing" />
  </picture>
  <p align="center"><sub><em>Handbook Guides listed in the Structure tool for authoring and editing.</em></sub></p>
</figure>

<br />

## Configuration

All configuration is optional. The plugin works out of the box with sensible defaults.

| Option                     | Type                        | Default                                                                                 | Purpose                                                                          |
| -------------------------- | --------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `title`                    | `string`                    | `"Handbook"`                                                                            | Title shown in the Studio tool navigation.                                       |
| `sidebarTitle`             | `string`                    | `"Handbook"`                                                                            | Heading displayed at the top of the sidebar.                                     |
| `groups`                   | `HandbookStructureGroup[]`  | `[]`                                                                                    | Document type groups defining the sidebar hierarchy.                             |
| `blocks`                   | `HandbookBlockDefinition[]` | `[]`                                                                                    | Custom Portable Text block definitions for guide content.                        |
| `editors`                  | `string[]`                  | `undefined`                                                                             | Email addresses permitted to edit handbook documents. Unrestricted when omitted. |
| `undocumentedFieldMessage` | `string`                    | `"This field has not been documented yet. Contact your development team for guidance."` | Fallback message shown when a field has no description.                          |

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

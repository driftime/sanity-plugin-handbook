import type { ComponentType, ReactElement } from "react";

import { ContentPanel } from "../components/content-panel";
import { SidebarGroup } from "../components/sidebar-group";
import { SidebarTab } from "../components/sidebar-tab";
import { BookTextIcon } from "../icons/book-text";
import { LayoutGridIcon } from "../icons/layout-grid";
import { createSanityIcon } from "../lib/icons";
import { DocumentTypesOverview } from "./document-types";
import { HowToUse } from "./how-to-use";

interface HandbookEntry {
  /** Unique identifier used as the tab and panel key. */
  name: string;
  /** Display label in the sidebar. */
  title: string;
  /** Icon component shown beside the label. */
  icon: ComponentType;
  /** Optional description shown beneath the content heading. */
  description?: string;
  /** Component rendered in the content panel. */
  component: () => ReactElement;
}

/** Built-in getting started pages shown at the top of the sidebar. */
const entries: HandbookEntry[] = [
  {
    name: "how-to-use-this-handbook",
    title: "How to Use This Handbook",
    icon: createSanityIcon(BookTextIcon),
    description:
      "A quick guide to navigating the Handbook, understanding the information presented for each field, and making the most of tips, hints, and warnings.",
    component: HowToUse,
  },
  {
    name: "document-types",
    title: "Document Types",
    icon: createSanityIcon(LayoutGridIcon),
    description:
      "An overview of all document types, organised by group. Select a document type to view its fields, descriptions, and examples.",
    component: DocumentTypesOverview,
  },
];

export function GettingStartedTabs() {
  return (
    <SidebarGroup heading="Getting Started">
      {entries.map((entry) => (
        <SidebarTab key={entry.name} id={entry.name} label={entry.title} icon={entry.icon} />
      ))}
    </SidebarGroup>
  );
}

export function GettingStartedPanels() {
  return entries.map((entry) => {
    const { name, title, description, component: Component } = entry;

    return (
      <ContentPanel key={name} id={name} title={title} description={description}>
        <Component />
      </ContentPanel>
    );
  });
}

import { ArrowLeftIcon } from "@sanity/icons";
import { Button, Card, Flex, Text } from "@sanity/ui";

import { PaneHeader } from "../components/pane-header";
import { HandbookProvider, useHandbookContext } from "../contexts/handbook-context";
import { useContainerWidth } from "../hooks/use-container-width";
import { isDefined } from "../lib/utils";
import type { HandbookBlockDefinition, HandbookStructureGroup } from "../types";
import { Content } from "./content";
import { Sidebar } from "./sidebar";

interface HandbookToolConfig {
  /** Heading displayed at the top of the sidebar. */
  sidebarTitle?: string;
  /** Document type groups containing document definitions. */
  groups?: HandbookStructureGroup[];
  /** Custom block definitions registered by the consumer. */
  blocks?: HandbookBlockDefinition[];
}

/** Minimum container width for the wide (sidebar always visible) layout. */
const wideBreakpoint = 920;

/** Minimum container width for the medium (collapsible sidebar) layout. */
const narrowBreakpoint = 480;

/** Sidebar width in pixels when fully expanded. */
const sidebarWidth = 320;

/** Sidebar width in pixels when collapsed to a vertical label. */
const collapsedSidebarWidth = 51;

function CollapsedSidebar() {
  const { sidebarTitle, setSidebarExpanded } = useHandbookContext();

  return (
    <div
      style={{
        width: `${collapsedSidebarWidth}px`,
        minWidth: `${collapsedSidebarWidth}px`,
        overflow: "hidden",
        borderRight: "1px solid var(--card-border-color)",
      }}
    >
      <Card tone="inherit" data-collapsed="">
        <Flex
          direction="column"
          padding={3}
          onClick={() => {
            setSidebarExpanded(true);
          }}
          style={{
            width: "100vh",
            boxSizing: "border-box",
            transform: "rotate(90deg)",
            transformOrigin: `calc(${collapsedSidebarWidth}px / 2)`,
            cursor: "pointer",
          }}
        >
          <Flex align="flex-start">
            <Card flex={1} paddingLeft={2} padding={2}>
              <Flex align="center" gap={1}>
                <Text size={1} textOverflow="ellipsis" weight="semibold" style={{ cursor: "default", outline: "none" }}>
                  {sidebarTitle}
                </Text>
              </Flex>
            </Card>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
}

function NarrowContentHeader() {
  const { sidebarTitle, setSidebarExpanded } = useHandbookContext();

  return (
    <Flex align="center" gap={2} padding={3}>
      <Button
        icon={ArrowLeftIcon}
        mode="bleed"
        onClick={() => {
          setSidebarExpanded(true);
        }}
      />
      <Text size={1} weight="semibold">
        {sidebarTitle}
      </Text>
    </Flex>
  );
}

function ExpandedSidebar() {
  const { sidebarTitle } = useHandbookContext();

  return (
    <Card
      borderRight
      style={{ display: "flex", flexDirection: "column", width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` }}
    >
      <PaneHeader title={sidebarTitle} />
      <div style={{ flex: 1, paddingBottom: "4px", overflowY: "auto" }}>
        <Sidebar />
      </div>
    </Card>
  );
}

function NarrowLayout() {
  const { sidebarTitle, sidebarExpanded } = useHandbookContext();

  if (sidebarExpanded) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <PaneHeader title={sidebarTitle} />
        <div style={{ flex: 1, paddingBottom: "4px", overflowY: "auto" }}>
          <Sidebar />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <NarrowContentHeader />
      <Content />
    </div>
  );
}

function MediumLayout() {
  const { sidebarExpanded, setSidebarExpanded } = useHandbookContext();

  if (sidebarExpanded) {
    return (
      <Flex style={{ flex: 1 }}>
        <ExpandedSidebar />
        <Card
          flex={1}
          padding={3}
          onClick={() => {
            setSidebarExpanded(false);
          }}
          style={{ opacity: 0.4, overflowY: "auto", cursor: "pointer" }}
        />
      </Flex>
    );
  }

  return (
    <Flex style={{ flex: 1 }}>
      <CollapsedSidebar />
      <Card flex={1} style={{ display: "flex", flexDirection: "column" }}>
        <Content />
      </Card>
    </Flex>
  );
}

function WideLayout() {
  return (
    <Flex style={{ flex: 1 }}>
      <ExpandedSidebar />
      <Card flex={1} style={{ display: "flex", flexDirection: "column" }}>
        <Content />
      </Card>
    </Flex>
  );
}

function HandbookLayout() {
  const { reference: containerReference, width: containerWidth } = useContainerWidth<HTMLDivElement>();

  const isNarrow = isDefined(containerWidth) && containerWidth < narrowBreakpoint;
  const isMedium = isDefined(containerWidth) && containerWidth >= narrowBreakpoint && containerWidth < wideBreakpoint;

  function renderLayout() {
    if (isNarrow) return <NarrowLayout />;
    if (isMedium) return <MediumLayout />;
    return <WideLayout />;
  }

  return (
    <div ref={containerReference} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {renderLayout()}
    </div>
  );
}

/**
 * Creates the Handbook tool component bound to the given plugin configuration.
 *
 * @param config - Handbook plugin configuration.
 * @returns Tool component for Sanity Studio.
 */
export function createHandbookTool(config: HandbookToolConfig) {
  return function HandbookTool() {
    return (
      <HandbookProvider
        sidebarTitle={config.sidebarTitle ?? "Handbook"}
        groups={config.groups ?? []}
        blocks={config.blocks ?? []}
      >
        <HandbookLayout />
      </HandbookProvider>
    );
  };
}

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import { useHandbookConfiguration } from "../hooks/use-handbook-configuration";
import { isDefined } from "../lib/utils";
import type { HandbookBlockDefinition, HandbookStructureGroup, SanityHandbook } from "../types";

interface HandbookProviderConfig {
  /** Heading displayed at the top of the sidebar. */
  sidebarTitle: string;
  /** Configured document type groups containing document definitions. */
  groups: HandbookStructureGroup[];
  /** Custom block definitions registered by the consumer. */
  blocks: HandbookBlockDefinition[];
  /** Fallback message shown when a field has no description. */
  undocumentedFieldMessage: string;
}

interface HandbookContextValues extends HandbookProviderConfig {
  /** Identifier of the currently selected tab, or null if none. */
  activeTab: string | null;
  /** Whether the sidebar is currently expanded. */
  sidebarExpanded: boolean;
  /** Whether configuration data is still loading from the dataset. */
  loading: boolean;
  /** Handbook configuration singleton fetched from the dataset. */
  configuration: SanityHandbook | null;
  /** Sets the active tab by identifier. */
  setActiveTab: (id: string) => void;
  /** Toggles the sidebar expanded state. */
  setSidebarExpanded: (expanded: boolean) => void;
}

interface HandbookProviderProps extends HandbookProviderConfig {
  /** Child elements wrapped by the provider. */
  children: ReactNode;
}

const HandbookContext = createContext<HandbookContextValues | undefined>(undefined);

export function HandbookProvider({
  sidebarTitle,
  groups,
  blocks,
  undocumentedFieldMessage,
  children,
}: HandbookProviderProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { configuration, loading } = useHandbookConfiguration();

  return (
    <HandbookContext
      value={{
        sidebarTitle,
        activeTab,
        sidebarExpanded,
        loading,
        groups,
        configuration,
        blocks,
        undocumentedFieldMessage,
        setActiveTab,
        setSidebarExpanded,
      }}
    >
      {children}
    </HandbookContext>
  );
}

/**
 * Accesses the Handbook context for tab state and schema configuration.
 *
 * @returns Handbook context values including active tab, groups, and configuration.
 * @throws Error if used outside HandbookProvider.
 */
export function useHandbookContext() {
  const handbookContext = useContext(HandbookContext);

  if (!isDefined(handbookContext)) throw new Error("useHandbookContext can only be used within <HandbookProvider>");

  return handbookContext;
}

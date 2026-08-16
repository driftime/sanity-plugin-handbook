import { useContext } from "react";
import { PaneLayoutContext } from "sanity/_singletons";

import { useHandbookContext } from "@/contexts/handbook";
import { Content } from "@/layouts/content";
import { Sidebar } from "@/layouts/sidebar";
import { isDefined } from "@/lib/utils";

export function Panes() {
  const { activeTab, sidebarExpanded } = useHandbookContext();
  const paneLayout = useContext(PaneLayoutContext);

  const hasContent = isDefined(activeTab);

  if (paneLayout?.collapsed === true) {
    return sidebarExpanded || !hasContent ? <Sidebar /> : <Content />;
  }

  return (
    <>
      <Sidebar />
      {hasContent && <Content />}
    </>
  );
}

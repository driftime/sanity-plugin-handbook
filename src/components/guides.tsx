import { BookOpenTextIcon } from "lucide-react";

import { useHandbookContext } from "../contexts/handbook-context";
import { createSanityIcon } from "../lib/icons";
import { isDefined } from "../lib/utils";
import { ContentPanel } from "./content-panel";
import { GuideContent } from "./guide-content";
import { SidebarGroup } from "./sidebar-group";
import { SidebarTab } from "./sidebar-tab";

export function GuidesTabs() {
  const { configuration, loading } = useHandbookContext();

  if (loading || !isDefined(configuration)) return null;

  return configuration.groups.map((group) => (
    <SidebarGroup key={group._key} heading={group.title}>
      {group.guides.map((guide) => (
        <SidebarTab key={guide._key} id={guide._key} label={guide.title} icon={createSanityIcon(BookOpenTextIcon)} />
      ))}
    </SidebarGroup>
  ));
}

export function GuidesPanels() {
  const { configuration, loading } = useHandbookContext();

  if (loading || !isDefined(configuration)) return null;

  return configuration.groups.flatMap((group) =>
    group.guides.map((guide) => (
      <ContentPanel key={guide._key} id={guide._key} title={guide.title} description={guide.description}>
        <GuideContent content={guide.content} />
      </ContentPanel>
    )),
  );
}

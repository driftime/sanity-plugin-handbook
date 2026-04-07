import { Box } from "@sanity/ui";

import { DocumentTypesTabs } from "../components/document-types";
import { GuidesTabs } from "../components/guides";
import { GettingStartedTabs } from "../getting-started/overview";

export function Sidebar() {
  return (
    <Box paddingX={3} paddingBottom={1}>
      <GettingStartedTabs />
      <DocumentTypesTabs />
      <GuidesTabs />
    </Box>
  );
}

import { DocumentTypesPanels } from "../components/document-types";
import { GuidesPanels } from "../components/guides";
import { GettingStartedPanels } from "../getting-started/overview";

export function Content() {
  return (
    <>
      <GettingStartedPanels />
      <DocumentTypesPanels />
      <GuidesPanels />
    </>
  );
}

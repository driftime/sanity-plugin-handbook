import { useHandbookContext } from "../contexts/handbook-context";
import { convertCase } from "../lib/utils";
import { ContentPanel } from "./content-panel";
import { Field } from "./field";
import { SidebarGroup } from "./sidebar-group";
import { SidebarTab } from "./sidebar-tab";

export function DocumentTypesTabs() {
  const { groups } = useHandbookContext();

  return groups.map((group) => {
    const { title, documents } = group;

    return (
      <SidebarGroup key={title} heading={title}>
        {documents.map((document) => {
          const effectiveTitle = document.handbook?.title ?? document.title ?? convertCase(document.name, "title");
          const icon = typeof document.icon === "function" ? document.icon : undefined;

          return <SidebarTab key={document.name} id={document.name} label={effectiveTitle} icon={icon} />;
        })}
      </SidebarGroup>
    );
  });
}

export function DocumentTypesPanels() {
  const { groups } = useHandbookContext();

  return groups.map((group) => {
    const { documents } = group;

    return documents.map((document) => {
      const effectiveTitle = document.handbook?.title ?? document.title ?? convertCase(document.name, "title");
      const effectiveDescription =
        document.handbook?.description ?? (typeof document.description === "string" ? document.description : undefined);

      return (
        <ContentPanel key={document.name} id={document.name} title={effectiveTitle} description={effectiveDescription}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3.25rem" }}>
            {document.fields.map((field) => (
              <Field key={field.name} field={field} />
            ))}
          </div>
        </ContentPanel>
      );
    });
  });
}

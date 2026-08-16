import type { ComponentProps } from "react";

/** Title shown in the Studio tool navigation and at the top of the sidebar. */
export const defaultTitle = "Handbook";

/** Fallback title displayed wherever a document has no title of its own. */
export const defaultDocumentTitle = "Untitled";

/** Fallback message shown when a field has no description. */
export const defaultUndocumentedFieldMessage =
  "This field has not been documented yet. Contact your development team for guidance.";

/** Properties every icon the plugin draws is rendered with. */
export const defaultIconProps: ComponentProps<"svg"> = { width: "1em", height: "1em", strokeWidth: 1.5 };

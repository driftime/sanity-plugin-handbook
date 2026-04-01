import type { LucideIcon, LucideProps } from "lucide-react";
import { createElement } from "react";

/**
 * Default properties applied to all Lucide icons throughout the plugin.
 */
export const defaultIconProps: LucideProps = { width: "1em", height: "1em", strokeWidth: 1.5 };

/**
 * Creates a Sanity Studio icon component from a Lucide icon with default props applied.
 *
 * @param icon - The Lucide icon component to wrap.
 * @param props - Optional props to merge with defaults.
 * @returns A React component function for use in Sanity Studio.
 */
export function createSanityIcon(icon: LucideIcon, props?: LucideProps) {
  return () => createElement(icon, { ...defaultIconProps, ...props });
}

import type { ComponentType, SVGProps } from "react";
import { createElement } from "react";

/** Default properties applied to all icons throughout the plugin. */
export const defaultIconProps: SVGProps<SVGSVGElement> = { width: "1em", height: "1em", strokeWidth: 1.5 };

/**
 * Creates a Sanity Studio icon component from an SVG icon with default props applied.
 *
 * @param icon - The icon component to wrap.
 * @param props - Optional props to merge with defaults.
 * @returns A React component function for use in Sanity Studio.
 */
export function createSanityIcon(icon: ComponentType<SVGProps<SVGSVGElement>>, props?: SVGProps<SVGSVGElement>) {
  return () => createElement(icon, { ...defaultIconProps, ...props });
}

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

import { isDefined } from "../lib/utils";

interface UseContainerWidthReturn<T extends HTMLElement> {
  /** Ref to attach to the container element being measured. */
  reference: RefObject<T | null>;
  /** Measured width in pixels, or undefined before the first observation. */
  width: number | undefined;
}

/**
 * Measures the width of a container element using ResizeObserver.
 *
 * @returns An object containing a ref to attach and the measured width.
 */
export function useContainerWidth<T extends HTMLElement>(): UseContainerWidthReturn<T> {
  const reference = useRef<T | null>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const element = reference.current;

    if (!isDefined(element)) return undefined;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { reference, width };
}

import type { KeyedSegment } from "sanity";

/** A value that may be absent, covering both null and undefined. */
export type Nullable<T> = T | null | undefined;

/** Drops a type's catch-all index signature, so a mistyped field name is an error rather than an unknown value. */
export type Strict<T> = { [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K] };

/** Array of objects each carrying the key Sanity assigns to array items, keeping members identifiable. */
export type SanityKeyedArray<T> = (KeyedSegment & T)[];

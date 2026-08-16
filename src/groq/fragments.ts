import { imageTypeName } from "@/schemas/blocks/image";
import { videoTypeName } from "@/schemas/blocks/video";

/** Resolves a Portable Text asset reference to the single URL the viewer renders it from. */
export const assetUrlFragment = `"asset": { "url": asset.asset->url }`;

/** Expands guide content members with resolved asset URLs. */
export const guideContentFragment = `
  _type == "${imageTypeName}" => { ..., ${assetUrlFragment} },
  _type == "${videoTypeName}" => { ..., ${assetUrlFragment} }
`;

/** Expands a guide reference with resolved asset URLs throughout its content. */
export const guideFragment = `...@-> {
  ...,
  content[] { ..., ${guideContentFragment} }
}`;

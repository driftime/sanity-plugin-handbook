import { isDefined } from "../../lib/utils";
import { ImageContent } from "./content";

interface HandbookImageValue {
  /** Document type identifier. */
  _type: "handbook.image";
  /** Resolved image asset containing the URL. */
  asset?: { url?: string };
  /** Text displayed beneath the image. */
  caption?: string;
  /** Alternative text for screen readers. */
  alt?: string;
}

export function ImageBlock({ value }: { value: HandbookImageValue }) {
  if (!isDefined(value.asset?.url)) return null;

  return (
    <div style={{ marginBlock: "1.5rem" }}>
      <ImageContent url={value.asset.url} alt={value.alt} caption={value.caption} />
    </div>
  );
}

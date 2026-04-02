import { isDefined } from "../../lib/utils";
import { VideoContent } from "./content";

interface HandbookVideoValue {
  /** Document type identifier. */
  _type: "handbook.video";
  /** Resolved video asset containing the URL. */
  asset?: { url?: string };
  /** Text displayed beneath the video. */
  caption?: string;
}

export function VideoBlock({ value }: { value: HandbookVideoValue }) {
  if (!isDefined(value.asset?.url)) return null;

  return (
    <div style={{ marginBlock: "1.5rem" }}>
      <VideoContent url={value.asset.url} caption={value.caption} />
    </div>
  );
}

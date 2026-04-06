import { useEffect, useState } from "react";
import { useClient } from "sanity";

import type { SanityHandbook } from "../types";

/** GROQ query that fetches the handbook singleton with expanded guide references. */
const query = `*[_type == "handbook.handbook"][0]{
  groups[]{
    _key,
    title,
    guides[]{
      _key,
      ...@->{
        _id,
        _type,
        title,
        description,
        content[]{
          ...,
          _type == "handbook.image" => {
            ...,
            "asset": { "url": asset.asset->url }
          },
          _type == "handbook.video" => {
            ...,
            "asset": { "url": asset.asset->url }
          }
        }
      }
    }
  }
}`;

/** GROQ filter used to subscribe to real-time changes on handbook documents. */
const listenQuery = '*[_type == "handbook.handbook" || _type == "handbook.guide"]';

/**
 * Fetches the handbook configuration singleton from the dataset with real-time updates.
 * Expands guide references within each group.
 *
 * @returns An object containing the configuration and a loading flag.
 */
export function useHandbookConfiguration(): { configuration: SanityHandbook | null; loading: boolean } {
  const client = useClient({ apiVersion: "2026-01-01" });
  const [configuration, setConfiguration] = useState<SanityHandbook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfiguration() {
      const result = await client.fetch<SanityHandbook | null>(query);
      setConfiguration(result);
      setLoading(false);
    }

    void fetchConfiguration();

    const subscription = client.listen(listenQuery).subscribe(() => {
      void fetchConfiguration();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [client]);

  return { configuration, loading };
}

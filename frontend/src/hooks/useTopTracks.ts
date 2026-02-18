import { useState, useEffect } from 'react';
import { fetchTopTracks, fetchTrackDetails } from '../api/spotify';
import type { SpotifyTrack, TimeRange } from '../types/spotify';

export function useTopTracks(timeRange: TimeRange) {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTopTracks(timeRange)
      .then(async (data) => {
        let items = data.items;

        // Spotify may return simplified tracks without popularity.
        // Enrich by fetching full track objects by ID.
        if (items.length > 0 && items[0].popularity == null) {
          try {
            const ids = items.map((t) => t.id);
            const details = await fetchTrackDetails(ids);
            const detailMap = new Map(
              details.tracks.map((t) => [t.id, t])
            );
            items = items.map((t) => {
              const full = detailMap.get(t.id);
              return full ? { ...t, popularity: full.popularity } : t;
            });
          } catch {
            // Enrichment failed — continue with original data
          }
        }

        setTracks(items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { tracks, loading, error };
}

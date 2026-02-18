import { useState, useEffect } from 'react';
import { fetchTopTracks, fetchTrackDetails } from '../api/spotify';
import type { SpotifyTrack, TimeRange } from '../types/spotify';

async function enrichTracks(items: SpotifyTrack[]): Promise<SpotifyTrack[]> {
  if (items.length === 0) return items;
  try {
    const ids = items.map((t) => t.id);
    const details = await fetchTrackDetails(ids);
    const detailMap = new Map(
      details.tracks.filter(Boolean).map((t) => [t.id, t])
    );
    return items.map((t) => {
      const full = detailMap.get(t.id);
      if (!full) return t;
      return { ...t, popularity: full.popularity ?? t.popularity };
    });
  } catch {
    return items;
  }
}

export function useTopTracks(timeRange: TimeRange) {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTopTracks(timeRange)
      .then(async (data) => {
        const items = await enrichTracks(data.items);
        setTracks(items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { tracks, loading, error };
}

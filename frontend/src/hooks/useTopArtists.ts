import { useState, useEffect } from 'react';
import { fetchTopArtists, fetchArtistDetails } from '../api/spotify';
import type { SpotifyArtist, TimeRange } from '../types/spotify';

async function enrichArtists(items: SpotifyArtist[]): Promise<SpotifyArtist[]> {
  if (items.length === 0) return items;
  try {
    const ids = items.map((a) => a.id);
    const details = await fetchArtistDetails(ids);
    const detailMap = new Map(
      details.artists.filter(Boolean).map((a) => [a.id, a])
    );
    return items.map((a) => {
      const full = detailMap.get(a.id);
      if (!full) return a;
      return {
        ...a,
        genres: full.genres ?? a.genres,
        popularity: full.popularity ?? a.popularity,
        images: a.images ?? full.images,
      };
    });
  } catch {
    return items;
  }
}

export function useTopArtists(timeRange: TimeRange) {
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTopArtists(timeRange)
      .then(async (data) => {
        const items = await enrichArtists(data.items);
        setArtists(items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { artists, loading, error };
}

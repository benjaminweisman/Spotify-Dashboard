import { useState, useEffect } from 'react';
import { fetchTopArtists, fetchArtistDetails } from '../api/spotify';
import type { SpotifyArtist, TimeRange } from '../types/spotify';

export function useTopArtists(timeRange: TimeRange) {
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTopArtists(timeRange)
      .then(async (data) => {
        let items = data.items;

        // Spotify may return simplified artists without genres.
        // Enrich by fetching full artist objects by ID.
        if (items.length > 0 && items[0].genres == null) {
          try {
            const ids = items.map((a) => a.id);
            const details = await fetchArtistDetails(ids);
            const detailMap = new Map(
              details.artists.map((a) => [a.id, a])
            );
            items = items.map((a) => {
              const full = detailMap.get(a.id);
              if (!full) return a;
              return {
                ...a,
                genres: full.genres,
                popularity: full.popularity,
                images: a.images ?? full.images,
              };
            });
          } catch {
            // Enrichment failed — continue with original data
          }
        }

        setArtists(items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { artists, loading, error };
}

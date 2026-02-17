import { useState, useEffect } from 'react';
import { fetchTopArtists } from '../api/spotify';
import type { SpotifyArtist, TimeRange } from '../types/spotify';

export function useTopArtists(timeRange: TimeRange) {
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTopArtists(timeRange)
      .then((data) => setArtists(data.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { artists, loading, error };
}

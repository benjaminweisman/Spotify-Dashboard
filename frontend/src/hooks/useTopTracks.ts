import { useState, useEffect } from 'react';
import { fetchTopTracks } from '../api/spotify';
import type { SpotifyTrack, TimeRange } from '../types/spotify';

export function useTopTracks(timeRange: TimeRange) {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTopTracks(timeRange)
      .then((data) => setTracks(data.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { tracks, loading, error };
}

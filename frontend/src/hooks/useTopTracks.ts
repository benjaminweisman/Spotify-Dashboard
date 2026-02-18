import { useState, useEffect } from 'react';
import { fetchTopTracks } from '../api/spotify';
import type { SpotifyTrack, TimeRange } from '../types/spotify';

const SPOTIFY_API = 'https://api.spotify.com/v1';

async function enrichTracks(items: SpotifyTrack[]): Promise<SpotifyTrack[]> {
  const token = localStorage.getItem('access_token');
  if (!token || items.length === 0) return items;

  const ids = items.map((t) => t.id).join(',');
  const res = await fetch(`${SPOTIFY_API}/tracks?ids=${ids}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return items;

  const data = await res.json();
  const detailMap = new Map<string, any>(
    (data.tracks ?? []).filter(Boolean).map((t: any) => [t.id, t])
  );

  return items.map((t) => {
    const full = detailMap.get(t.id);
    if (!full) return t;
    return {
      ...t,
      popularity: full.popularity ?? t.popularity,
    };
  });
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

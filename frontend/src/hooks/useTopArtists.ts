import { useState, useEffect } from 'react';
import { fetchTopArtists } from '../api/spotify';
import type { SpotifyArtist, TimeRange } from '../types/spotify';

const SPOTIFY_API = 'https://api.spotify.com/v1';

async function enrichArtists(items: SpotifyArtist[]): Promise<SpotifyArtist[]> {
  const token = localStorage.getItem('access_token');
  if (!token || items.length === 0) return items;

  const ids = items.map((a) => a.id).join(',');
  const res = await fetch(`${SPOTIFY_API}/artists?ids=${ids}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return items;

  const data = await res.json();
  const detailMap = new Map<string, any>(
    (data.artists ?? []).filter(Boolean).map((a: any) => [a.id, a])
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
        let items = data.items;
        if (items.length > 0 && items[0].genres == null) {
          items = await enrichArtists(items);
        }
        setArtists(items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { artists, loading, error };
}

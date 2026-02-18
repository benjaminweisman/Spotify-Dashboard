import { useState, useEffect } from 'react';
import { fetchTopArtists } from '../api/spotify';
import type { SpotifyArtist, TimeRange } from '../types/spotify';

const CACHE_KEY = 'spotify_artist_details';

interface ArtistCache {
  genres: string[];
  popularity: number;
}

function getArtistCache(): Record<string, ArtistCache> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function updateArtistCache(artists: SpotifyArtist[]) {
  const cache = getArtistCache();
  let changed = false;
  for (const a of artists) {
    if (a.genres != null || a.popularity != null) {
      cache[a.id] = {
        genres: a.genres ?? cache[a.id]?.genres ?? [],
        popularity: a.popularity ?? cache[a.id]?.popularity ?? 0,
      };
      changed = true;
    }
  }
  if (changed) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  }
}

function applyArtistCache(artists: SpotifyArtist[]): SpotifyArtist[] {
  const cache = getArtistCache();
  return artists.map((a) => {
    const cached = cache[a.id];
    if (!cached) return a;
    return {
      ...a,
      genres: a.genres ?? cached.genres,
      popularity: a.popularity ?? cached.popularity,
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
      .then((data) => {
        const items = data.items;
        updateArtistCache(items);
        setArtists(applyArtistCache(items));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { artists, loading, error };
}

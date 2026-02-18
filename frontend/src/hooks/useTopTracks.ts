import { useState, useEffect } from 'react';
import { fetchTopTracks } from '../api/spotify';
import type { SpotifyTrack, TimeRange } from '../types/spotify';

const CACHE_KEY = 'spotify_track_popularity';

function getPopularityCache(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function updatePopularityCache(tracks: SpotifyTrack[]) {
  const cache = getPopularityCache();
  let changed = false;
  for (const t of tracks) {
    if (t.popularity != null) {
      cache[t.id] = t.popularity;
      changed = true;
    }
  }
  if (changed) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  }
}

function applyPopularityCache(tracks: SpotifyTrack[]): SpotifyTrack[] {
  const cache = getPopularityCache();
  return tracks.map((t) => {
    if (t.popularity != null) return t;
    const cached = cache[t.id];
    if (cached != null) return { ...t, popularity: cached };
    return t;
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
      .then((data) => {
        const items = data.items;
        // Cache any popularity values Spotify returns
        updatePopularityCache(items);
        // Fill in missing values from cache
        setTracks(applyPopularityCache(items));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { tracks, loading, error };
}

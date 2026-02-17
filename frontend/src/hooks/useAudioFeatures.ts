import { useState, useEffect } from 'react';
import { fetchAudioFeatures } from '../api/spotify';
import type { AudioFeaturesResponse } from '../types/spotify';

export function useAudioFeatures(trackIds: string[]) {
  const [data, setData] = useState<AudioFeaturesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (trackIds.length === 0) return;

    setLoading(true);
    setError(null);
    fetchAudioFeatures(trackIds)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [trackIds.join(',')]);

  return { data, loading, error };
}

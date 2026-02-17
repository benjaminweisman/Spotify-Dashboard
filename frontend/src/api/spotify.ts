import api from './client';
import type {
  SpotifyProfile,
  SpotifyTrack,
  SpotifyArtist,
  PaginatedResponse,
  AudioFeaturesResponse,
  TimeRange,
} from '../types/spotify';

export async function fetchProfile(): Promise<SpotifyProfile> {
  const { data } = await api.get('/profile/me');
  return data;
}

export async function fetchTopTracks(
  timeRange: TimeRange = 'medium_term',
  limit: number = 50
): Promise<PaginatedResponse<SpotifyTrack>> {
  const { data } = await api.get('/tracks/top', {
    params: { time_range: timeRange, limit },
  });
  return data;
}

export async function fetchTopArtists(
  timeRange: TimeRange = 'medium_term',
  limit: number = 50
): Promise<PaginatedResponse<SpotifyArtist>> {
  const { data } = await api.get('/artists/top', {
    params: { time_range: timeRange, limit },
  });
  return data;
}

export async function fetchAudioFeatures(
  trackIds: string[]
): Promise<AudioFeaturesResponse> {
  const { data } = await api.get('/tracks/audio-features', {
    params: { ids: trackIds.join(',') },
  });
  return data;
}

export async function exchangeToken(code: string) {
  const { data } = await api.post('/auth/token', { code });
  return data;
}

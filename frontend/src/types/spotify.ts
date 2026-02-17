export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: SpotifyImage[];
  popularity: number;
  external_urls: { spotify: string };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: SpotifyAlbum;
  duration_ms: number;
  popularity: number;
  external_urls: { spotify: string };
}

export interface SpotifyProfile {
  id: string;
  display_name: string;
  email: string;
  images: SpotifyImage[];
  product: string;
  country: string;
}

export interface AudioFeature {
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  liveness: number;
  tempo: number;
}

export interface AudioFeaturesResponse {
  available: boolean;
  features: (AudioFeature | null)[];
  averages: AudioFeature | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

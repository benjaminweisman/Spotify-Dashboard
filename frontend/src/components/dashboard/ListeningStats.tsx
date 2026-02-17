import { useMemo } from 'react';
import type { SpotifyTrack, SpotifyArtist } from '../../types/spotify';

interface Props {
  tracks: SpotifyTrack[];
  artists: SpotifyArtist[];
  loading: boolean;
}

export function ListeningStats({ tracks, artists, loading }: Props) {
  const stats = useMemo(() => {
    const uniqueArtists = new Set(tracks.flatMap((t) => t.artists.map((a) => a.id)));
    const allGenres = artists.flatMap((a) => a.genres ?? []);
    const uniqueGenres = new Set(allGenres);
    const avgPopularity =
      tracks.length > 0
        ? Math.round(tracks.reduce((sum, t) => sum + t.popularity, 0) / tracks.length)
        : 0;

    const genreCounts: Record<string, number> = {};
    for (const g of allGenres) {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    }
    const topGenre =
      Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

    return {
      uniqueArtists: uniqueArtists.size,
      uniqueGenres: uniqueGenres.size,
      avgPopularity,
      topGenre,
    };
  }, [tracks, artists]);

  if (loading) return <div className="card skeleton" />;

  return (
    <div className="card">
      <h2>Listening Stats</h2>
      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-value">{stats.uniqueArtists}</span>
          <span className="stat-label">Unique Artists</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{stats.uniqueGenres}</span>
          <span className="stat-label">Unique Genres</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{stats.avgPopularity}</span>
          <span className="stat-label">Avg Popularity</span>
        </div>
        <div className="stat-box">
          <span className="stat-value stat-value-text">{stats.topGenre}</span>
          <span className="stat-label">Top Genre</span>
        </div>
      </div>
    </div>
  );
}

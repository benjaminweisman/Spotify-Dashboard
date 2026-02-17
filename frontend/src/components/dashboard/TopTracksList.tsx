import type { SpotifyTrack } from '../../types/spotify';

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

interface Props {
  tracks: SpotifyTrack[];
  loading: boolean;
}

export function TopTracksList({ tracks, loading }: Props) {
  if (loading) return <div className="card skeleton" />;

  return (
    <div className="card">
      <h2>Top Tracks</h2>
      <div className="tracks-list">
        {tracks.map((track, i) => (
          <a
            key={track.id}
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="track-item"
          >
            <span className="track-rank">{i + 1}</span>
            <img
              src={track.album.images[track.album.images.length - 1]?.url}
              alt={track.album.name}
              className="track-album-art"
            />
            <div className="track-info">
              <span className="track-name">{track.name}</span>
              <span className="track-artist">
                {track.artists.map((a) => a.name).join(', ')}
              </span>
            </div>
            <span className="track-duration">{formatDuration(track.duration_ms)}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

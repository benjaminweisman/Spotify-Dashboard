import type { SpotifyArtist } from '../../types/spotify';

interface Props {
  artists: SpotifyArtist[];
  loading: boolean;
}

export function TopArtistsList({ artists, loading }: Props) {
  if (loading) return <div className="card skeleton" />;

  return (
    <div className="card">
      <h2>Top Artists</h2>
      <div className="artists-grid">
        {artists.slice(0, 20).map((artist, i) => (
          <a
            key={artist.id}
            href={artist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="artist-item"
          >
            <div className="artist-image-wrapper">
              <img
                src={artist.images[artist.images.length - 1]?.url}
                alt={artist.name}
                className="artist-image"
              />
              <span className="artist-rank">{i + 1}</span>
            </div>
            <span className="artist-name">{artist.name}</span>
            <span className="artist-genre">
              {artist.genres.slice(0, 2).join(', ')}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

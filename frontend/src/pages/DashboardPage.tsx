import { useState, useMemo } from 'react';
import type { TimeRange } from '../types/spotify';
import { useTopTracks } from '../hooks/useTopTracks';
import { useTopArtists } from '../hooks/useTopArtists';
import { useAudioFeatures } from '../hooks/useAudioFeatures';
import { Header } from '../components/layout/Header';
import { TimeRangeSelector } from '../components/dashboard/TimeRangeSelector';
import { TopTracksList } from '../components/dashboard/TopTracksList';
import { TopArtistsList } from '../components/dashboard/TopArtistsList';
import { AudioFeaturesRadar } from '../components/dashboard/AudioFeaturesRadar';
import { TasteComparison } from '../components/dashboard/TasteComparison';
import { ListeningStats } from '../components/dashboard/ListeningStats';
import { GenreBreakdown } from '../components/dashboard/GenreBreakdown';
import { PopularityDistribution } from '../components/dashboard/PopularityDistribution';
import { ErrorBanner } from '../components/common/ErrorBanner';

export function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');

  const { tracks, loading: tracksLoading, error: tracksError } = useTopTracks(timeRange);
  const { artists, loading: artistsLoading, error: artistsError } = useTopArtists(timeRange);

  const trackIds = useMemo(() => tracks.map((t) => t.id), [tracks]);
  const { data: audioFeatures, loading: featuresLoading } = useAudioFeatures(trackIds);

  const error = tracksError || artistsError;

  // Debug: render data shape directly on page
  const debugInfo = !tracksLoading && !artistsLoading && tracks.length > 0 && artists.length > 0
    ? `Track keys: ${Object.keys(tracks[0]).join(', ')} | popularity=${tracks[0].popularity} | Artist genres=${JSON.stringify(artists[0].genres)}`
    : 'Loading...';

  return (
    <div className="dashboard">
      <Header />
      <main className="dashboard-content">
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        <div style={{ background: '#1a1a2e', padding: '8px 12px', borderRadius: 6, fontSize: 12, color: '#0f0', marginBottom: 12, overflowX: 'auto', whiteSpace: 'nowrap' }}>
          DEBUG: {debugInfo}
        </div>

        {error && <ErrorBanner message={error} />}

        <ListeningStats
          tracks={tracks}
          artists={artists}
          loading={tracksLoading || artistsLoading}
        />

        <div className="dashboard-grid">
          <div className="dashboard-col">
            <TopTracksList tracks={tracks} loading={tracksLoading} />
          </div>
          <div className="dashboard-col">
            <TopArtistsList artists={artists} loading={artistsLoading} />
            {!featuresLoading && audioFeatures && (
              <AudioFeaturesRadar
                averages={audioFeatures.averages}
                available={audioFeatures.available}
              />
            )}
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-col">
            <GenreBreakdown artists={artists} loading={artistsLoading} />
          </div>
          <div className="dashboard-col">
            <PopularityDistribution tracks={tracks} loading={tracksLoading} />
          </div>
        </div>

        {audioFeatures && (
          <TasteComparison
            currentRange={timeRange}
            currentAverages={audioFeatures.averages}
            currentAvailable={audioFeatures.available}
          />
        )}
      </main>
    </div>
  );
}

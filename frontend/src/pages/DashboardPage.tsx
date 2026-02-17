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

  // Debug: check what fields Spotify actually returns
  if (!tracksLoading && tracks.length > 0) {
    const t = tracks[0];
    console.log('DEBUG TRACK:', 'popularity=' + t.popularity, 'keys=' + Object.keys(t).join(','));
  }
  if (!artistsLoading && artists.length > 0) {
    const a = artists[0];
    console.log('DEBUG ARTIST:', 'genres=' + JSON.stringify(a.genres), 'popularity=' + a.popularity, 'keys=' + Object.keys(a).join(','));
  }

  return (
    <div className="dashboard">
      <Header />
      <main className="dashboard-content">
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />

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

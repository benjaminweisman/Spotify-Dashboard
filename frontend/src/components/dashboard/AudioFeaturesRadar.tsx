import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AudioFeature } from '../../types/spotify';

const FEATURE_LABELS: Record<string, string> = {
  danceability: 'Danceability',
  energy: 'Energy',
  valence: 'Happiness',
  acousticness: 'Acoustic',
  instrumentalness: 'Instrumental',
  speechiness: 'Speechiness',
  liveness: 'Liveness',
};

interface Props {
  averages: AudioFeature | null;
  comparisonAverages?: AudioFeature | null;
  comparisonLabel?: string;
  available: boolean;
}

export function AudioFeaturesRadar({
  averages,
  comparisonAverages,
  comparisonLabel,
  available,
}: Props) {
  if (!available) {
    return (
      <div className="card feature-unavailable">
        <h2>Audio Features</h2>
        <p>
          Audio features are currently unavailable for new Spotify developer apps.
          This feature will activate once your app is approved for extended access.
        </p>
      </div>
    );
  }

  if (!averages) return <div className="card skeleton" />;

  const data = Object.entries(FEATURE_LABELS).map(([key, label]) => {
    const entry: Record<string, string | number> = {
      feature: label,
      value: averages[key as keyof AudioFeature],
    };
    if (comparisonAverages) {
      entry.comparison = comparisonAverages[key as keyof AudioFeature];
    }
    return entry;
  });

  return (
    <div className="card">
      <h2>Your Audio Fingerprint</h2>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis dataKey="feature" tick={{ fill: '#b3b3b3', fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 1]} tick={false} axisLine={false} />
          <Radar
            name="Current"
            dataKey="value"
            stroke="#1db954"
            fill="#1db954"
            fillOpacity={0.3}
          />
          {comparisonAverages && (
            <Radar
              name={comparisonLabel || 'Comparison'}
              dataKey="comparison"
              stroke="#b91d73"
              fill="#b91d73"
              fillOpacity={0.2}
            />
          )}
          {comparisonAverages && <Legend />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

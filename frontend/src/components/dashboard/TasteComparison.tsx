import { useState, useMemo } from 'react';
import { useTopTracks } from '../../hooks/useTopTracks';
import { useAudioFeatures } from '../../hooks/useAudioFeatures';
import { AudioFeaturesRadar } from './AudioFeaturesRadar';
import type { AudioFeature, TimeRange } from '../../types/spotify';

const RANGE_LABELS: Record<TimeRange, string> = {
  short_term: 'Last 4 Weeks',
  medium_term: 'Last 6 Months',
  long_term: 'All Time',
};

interface Props {
  currentRange: TimeRange;
  currentAverages: AudioFeature | null;
  currentAvailable: boolean;
}

export function TasteComparison({ currentRange, currentAverages, currentAvailable }: Props) {
  const comparisonOptions = (Object.keys(RANGE_LABELS) as TimeRange[]).filter(
    (r) => r !== currentRange
  );
  const [comparisonRange, setComparisonRange] = useState<TimeRange>(comparisonOptions[0]);

  const { tracks: compTracks } = useTopTracks(comparisonRange);
  const compTrackIds = useMemo(() => compTracks.map((t) => t.id), [compTracks]);
  const { data: compFeatures } = useAudioFeatures(compTrackIds);

  if (!currentAvailable) return null;

  return (
    <div className="taste-comparison">
      <div className="comparison-header">
        <h2>Taste Comparison</h2>
        <div className="comparison-selector">
          <span>Compare with:</span>
          {comparisonOptions.map((range) => (
            <button
              key={range}
              className={`btn btn-sm ${comparisonRange === range ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setComparisonRange(range)}
            >
              {RANGE_LABELS[range]}
            </button>
          ))}
        </div>
      </div>
      <AudioFeaturesRadar
        averages={currentAverages}
        comparisonAverages={compFeatures?.averages}
        comparisonLabel={RANGE_LABELS[comparisonRange]}
        available={currentAvailable}
      />
    </div>
  );
}

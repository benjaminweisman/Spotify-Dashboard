import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { SpotifyTrack } from '../../types/spotify';

interface Props {
  tracks: SpotifyTrack[];
  loading: boolean;
}

const BUCKETS = ['0-19', '20-39', '40-59', '60-79', '80-100'] as const;

export function PopularityDistribution({ tracks, loading }: Props) {
  const data = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    for (const track of tracks) {
      const p = track.popularity ?? 0;
      if (p < 20) counts[0]++;
      else if (p < 40) counts[1]++;
      else if (p < 60) counts[2]++;
      else if (p < 80) counts[3]++;
      else counts[4]++;
    }
    return BUCKETS.map((range, i) => ({ range, count: counts[i] }));
  }, [tracks]);

  if (loading) return <div className="card skeleton" />;
  if (tracks.length === 0) return null;

  return (
    <div className="card">
      <h2>Popularity Distribution</h2>
      <div className="popularity-chart">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
            <XAxis
              dataKey="range"
              tick={{ fill: '#b3b3b3', fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#b3b3b3', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ background: '#282828', border: 'none', borderRadius: 8 }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#1db954' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={`rgba(29, 185, 84, ${0.4 + i * 0.15})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

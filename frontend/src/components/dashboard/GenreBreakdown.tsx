import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { SpotifyArtist } from '../../types/spotify';

interface Props {
  artists: SpotifyArtist[];
  loading: boolean;
}

export function GenreBreakdown({ artists, loading }: Props) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const artist of artists) {
      for (const genre of artist.genres ?? []) {
        counts[genre] = (counts[genre] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([genre, count]) => ({ genre, count }));
  }, [artists]);

  if (loading) return <div className="card skeleton" />;
  if (data.length === 0) return null;

  return (
    <div className="card">
      <h2>Top Genres</h2>
      <div className="genre-bar-chart">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="genre"
              width={120}
              tick={{ fill: '#b3b3b3', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ background: '#282828', border: 'none', borderRadius: 8 }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#1db954' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={i === 0 ? '#1db954' : '#1db95488'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

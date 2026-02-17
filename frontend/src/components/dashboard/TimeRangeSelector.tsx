import type { TimeRange } from '../../types/spotify';

const OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'short_term', label: 'Last 4 Weeks' },
  { value: 'medium_term', label: 'Last 6 Months' },
  { value: 'long_term', label: 'All Time' },
];

interface Props {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: Props) {
  return (
    <div className="time-range-selector">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`btn ${value === opt.value ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

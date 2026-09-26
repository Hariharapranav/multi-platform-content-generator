import { clsx } from 'clsx';

interface QualityScoreProps {
  relevance: number;
  consistency: number;
  platform_fit: number;
  overall: number;
  notes: string;
}

const scoreColor = (v: number) => {
  if (v >= 85) return 'text-emerald-400';
  if (v >= 70) return 'text-yellow-400';
  return 'text-red-400';
};

const barColor = (v: number) => {
  if (v >= 85) return 'bg-gradient-to-r from-emerald-500 to-emerald-400';
  if (v >= 70) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
  return 'bg-gradient-to-r from-red-500 to-red-400';
};

export default function QualityScoreCard({ relevance, consistency, platform_fit, overall, notes }: QualityScoreProps) {
  const metrics = [
    { label: 'Relevance', value: relevance },
    { label: 'Consistency', value: consistency },
    { label: 'Platform Fit', value: platform_fit },
  ];

  return (
    <div className="mt-4 p-4 bg-surface-900/50 rounded-xl border border-white/5 space-y-3">
      {/* Overall Score */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">AI Quality Score</span>
        <div className="flex items-center gap-1.5">
          <span className={clsx('text-2xl font-bold', scoreColor(overall))}>{overall}</span>
          <span className="text-white/30 text-sm">/100</span>
        </div>
      </div>

      {/* Sub-metrics */}
      <div className="space-y-2">
        {metrics.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-white/40 w-24 shrink-0">{label}</span>
            <div className="quality-bar flex-1">
              <div
                className={clsx('quality-bar-fill', barColor(value))}
                style={{ width: `${value}%` }}
              />
            </div>
            <span className={clsx('text-xs font-semibold w-8 text-right', scoreColor(value))}>{value}</span>
          </div>
        ))}
      </div>

      {/* Notes */}
      {notes && (
        <p className="text-xs text-white/40 italic border-t border-white/5 pt-2">{notes}</p>
      )}
    </div>
  );
}

// Skeleton loading state for while AI processes
export function AnalysisSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[80, 60, 90, 70, 50].map((w, i) => (
        <div key={i} className="skeleton h-4 rounded" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

export function DNASkeleton() {
  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-3 w-48 rounded" />
        </div>
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-14 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function PlatformCardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="skeleton h-6 w-20 rounded-lg" />
          <div className="skeleton h-4 w-28 rounded" />
        </div>
        <div className="flex gap-1">
          <div className="skeleton h-6 w-12 rounded" />
          <div className="skeleton h-6 w-12 rounded" />
        </div>
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-20 rounded-lg" />
        </div>
      ))}
      <div className="flex flex-wrap gap-1.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton h-6 w-16 rounded-full" />
        ))}
      </div>
      <div className="skeleton h-24 rounded-xl" />
    </div>
  );
}

// Processing status indicator
export function ProcessingStatus({ step }: { step: 1 | 2 }) {
  return (
    <div className="glass-card p-6 flex flex-col items-center gap-4 text-center">
      {/* Animated rings */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/40 border-t-brand-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-brand-400/20 border-t-brand-400 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">🧬</span>
        </div>
      </div>

      <div>
        <p className="font-semibold text-white text-sm">
          {step === 1 ? 'Extracting Content DNA…' : 'Generating platform content…'}
        </p>
        <p className="text-xs text-white/40 mt-1">
          {step === 1
            ? 'Analyzing topic, tone, audience, and key moments'
            : 'Crafting optimized posts for all 4 platforms'}
        </p>
      </div>

      <div className="flex gap-1.5">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mt-2">
        <StepBadge num={1} label="Content DNA" active={step >= 1} done={step > 1} />
        <div className="w-8 h-px bg-white/10" />
        <StepBadge num={2} label="Platforms" active={step >= 2} done={false} />
      </div>
    </div>
  );
}

function StepBadge({ num, label, active, done }: { num: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
        done ? 'bg-emerald-500 text-white' : active ? 'bg-brand-500 text-white' : 'bg-surface-600 text-white/30'
      }`}>
        {done ? '✓' : num}
      </span>
      <span className={`text-xs ${active ? 'text-white/80' : 'text-white/30'}`}>{label}</span>
    </div>
  );
}

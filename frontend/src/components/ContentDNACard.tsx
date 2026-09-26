import type { ContentDNA } from '../types';
import {
  Target, FileText, Smile, Users, Zap, Sparkles, Heart, Anchor, Hash
} from 'lucide-react';

interface ContentDNACardProps {
  dna: ContentDNA;
}

const Section = ({
  icon: Icon,
  label,
  color,
  children,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-lg ${color}`}>
        <Icon size={13} />
      </div>
      <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</span>
    </div>
    {children}
  </div>
);

const PillList = ({ items, color }: { items: string[]; color: string }) => (
  <div className="flex flex-wrap gap-1.5">
    {items.map((item, i) => (
      <span
        key={i}
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}
      >
        {item}
      </span>
    ))}
  </div>
);

export default function ContentDNACard({ dna }: ContentDNACardProps) {
  return (
    <div className="glass-card p-6 space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        <div className="p-2 rounded-xl bg-brand-600/20 border border-brand-500/20">
          <Sparkles size={18} className="text-brand-400" />
        </div>
        <div>
          <h2 className="font-bold text-white text-sm">Content DNA</h2>
          <p className="text-xs text-white/40">Core essence extracted by AI</p>
        </div>
      </div>

      {/* Topic */}
      <Section icon={Target} label="Topic" color="bg-violet-500/20 text-violet-400">
        <p className="text-sm font-semibold text-white">{dna.topic}</p>
      </Section>

      {/* Summary */}
      <Section icon={FileText} label="Summary" color="bg-blue-500/20 text-blue-400">
        <p className="text-sm text-white/70 leading-relaxed">{dna.summary}</p>
      </Section>

      {/* Tone + Audience row */}
      <div className="grid grid-cols-2 gap-4">
        <Section icon={Smile} label="Tone" color="bg-emerald-500/20 text-emerald-400">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            {dna.tone}
          </span>
        </Section>
        <Section icon={Users} label="Audience" color="bg-orange-500/20 text-orange-400">
          <p className="text-xs text-white/70">{dna.audience}</p>
        </Section>
      </div>

      {/* Key Points */}
      <Section icon={Zap} label="Key Points" color="bg-yellow-500/20 text-yellow-400">
        <ul className="space-y-1.5">
          {dna.key_points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-white/70">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              {pt}
            </li>
          ))}
        </ul>
      </Section>

      {/* Hooks */}
      <Section icon={Anchor} label="Hooks" color="bg-pink-500/20 text-pink-400">
        <div className="space-y-2">
          {dna.hooks.map((hook, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-900/60 border border-white/5">
              <p className="text-xs text-white/70 italic">&ldquo;{hook}&rdquo;</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Emotions */}
      <Section icon={Heart} label="Emotions" color="bg-red-500/20 text-red-400">
        <PillList
          items={dna.emotions}
          color="bg-red-500/10 text-red-300 border-red-500/20"
        />
      </Section>

      {/* Keywords */}
      <Section icon={Hash} label="Keywords" color="bg-cyan-500/20 text-cyan-400">
        <PillList
          items={dna.keywords}
          color="bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
        />
      </Section>

      {/* Key Moments */}
      {dna.key_moments?.length > 0 && (
        <Section icon={Sparkles} label="Key Moments" color="bg-indigo-500/20 text-indigo-400">
          <div className="space-y-2">
            {dna.key_moments.map((moment, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-indigo-500/5 border-l-2 border-indigo-500/40">
                <p className="text-xs text-white/70 italic">"{moment}"</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

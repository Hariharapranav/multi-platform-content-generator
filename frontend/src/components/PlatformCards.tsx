import { useState } from 'react';
import { RotateCcw, Download, ChevronDown, ChevronUp } from 'lucide-react';
import type { YouTubeOutput, InstagramOutput, LinkedInOutput, TwitterOutput, ContentDNA, Platform } from '../types';
import QualityScoreCard from './QualityScoreCard';
import CopyButton from './CopyButton';
import { clsx } from 'clsx';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TagPill = ({ tag }: { tag: string }) => (
  <span className="tag-pill">{tag.startsWith('#') ? tag : `#${tag}`}</span>
);

const Field = ({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) => (
  <div className="space-y-1.5">
    <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</span>
    <p className={clsx('text-sm text-white/85 leading-relaxed whitespace-pre-wrap', mono && 'font-mono text-xs')}>{value}</p>
  </div>
);

// ─── YouTube Card ─────────────────────────────────────────────────────────────

export function YouTubeCard({
  data,
  onRegenerate,
  isRegenerating,
}: {
  data: YouTubeOutput;
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  const [showDesc, setShowDesc] = useState(false);
  const exportText = `TITLE:\n${data.title}\n\nDESCRIPTION:\n${data.description}\n\nTAGS:\n${data.tags.join(', ')}`;

  return (
    <div className="glass-card p-6 space-y-5 animate-slide-up">
      <CardHeader
        title="YouTube"
        subtitle="Title · Description · Tags"
        color="bg-red-500/20 text-red-400"
        exportText={exportText}
        exportName="youtube-content"
        onRegenerate={onRegenerate}
        isRegenerating={isRegenerating}
      />

      <Field label="Title" value={data.title} />

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Description</span>
          <div className="flex items-center gap-1">
            <CopyButton text={data.description} label="Copy desc" />
            <button
              onClick={() => setShowDesc(!showDesc)}
              className="btn-ghost text-xs"
            >
              {showDesc ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {showDesc ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>
        <div className={clsx(
          'text-sm text-white/70 leading-relaxed whitespace-pre-wrap overflow-hidden transition-all duration-300',
          showDesc ? '' : 'line-clamp-4'
        )}>
          {data.description}
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Tags ({data.tags.length})</span>
        <div className="flex flex-wrap gap-1.5">
          {data.tags.map((tag, i) => <TagPill key={i} tag={tag} />)}
        </div>
      </div>

      <QualityScoreCard {...data.quality} />
    </div>
  );
}

// ─── Instagram Card ───────────────────────────────────────────────────────────

export function InstagramCard({
  data,
  onRegenerate,
  isRegenerating,
}: {
  data: InstagramOutput;
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  const exportText = `HOOK:\n${data.hook}\n\nCAPTION:\n${data.caption}\n\nHASHTAGS:\n${data.hashtags.map(h => `#${h}`).join(' ')}`;

  return (
    <div className="glass-card p-6 space-y-5 animate-slide-up">
      <CardHeader
        title="Instagram Reel"
        subtitle="Hook · Caption · Hashtags"
        color="bg-pink-500/20 text-pink-400"
        exportText={exportText}
        exportName="instagram-content"
        onRegenerate={onRegenerate}
        isRegenerating={isRegenerating}
      />

      <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-orange-500/10 border border-pink-500/20">
        <span className="text-xs font-semibold text-pink-400 block mb-1">🎣 HOOK</span>
        <p className="text-sm font-semibold text-white">{data.hook}</p>
      </div>

      <Field label="Caption" value={data.caption} />

      <div className="space-y-2">
        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Hashtags ({data.hashtags.length})</span>
        <div className="flex flex-wrap gap-1.5">
          {data.hashtags.map((tag, i) => <TagPill key={i} tag={tag} />)}
        </div>
      </div>

      <QualityScoreCard {...data.quality} />
    </div>
  );
}

// ─── LinkedIn Card ────────────────────────────────────────────────────────────

export function LinkedInCard({
  data,
  onRegenerate,
  isRegenerating,
}: {
  data: LinkedInOutput;
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  const exportText = `HOOK:\n${data.hook}\n\nPOST:\n${data.post}\n\nHASHTAGS:\n${data.hashtags.map(h => `#${h}`).join(' ')}`;

  return (
    <div className="glass-card p-6 space-y-5 animate-slide-up">
      <CardHeader
        title="LinkedIn"
        subtitle="Hook · Post · Hashtags"
        color="bg-blue-500/20 text-blue-400"
        exportText={exportText}
        exportName="linkedin-content"
        onRegenerate={onRegenerate}
        isRegenerating={isRegenerating}
      />

      <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <span className="text-xs font-semibold text-blue-400 block mb-1">🔗 HOOK</span>
        <p className="text-sm font-semibold text-white">{data.hook}</p>
      </div>

      <Field label="Post" value={data.post} />

      <div className="space-y-2">
        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Hashtags</span>
        <div className="flex flex-wrap gap-1.5">
          {data.hashtags.map((tag, i) => <TagPill key={i} tag={tag} />)}
        </div>
      </div>

      <QualityScoreCard {...data.quality} />
    </div>
  );
}

// ─── Twitter Card ─────────────────────────────────────────────────────────────

export function TwitterCard({
  data,
  onRegenerate,
  isRegenerating,
}: {
  data: TwitterOutput;
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  const exportText = `TWEET:\n${data.post}\n\nTHREAD:\n${data.thread.map((t, i) => `${i + 1}/ ${t}`).join('\n\n')}`;

  return (
    <div className="glass-card p-6 space-y-5 animate-slide-up">
      <CardHeader
        title="X (Twitter)"
        subtitle="Tweet · Thread"
        color="bg-sky-500/20 text-sky-400"
        exportText={exportText}
        exportName="twitter-content"
        onRegenerate={onRegenerate}
        isRegenerating={isRegenerating}
      />

      <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
        <span className="text-xs font-semibold text-sky-400 block mb-1">📌 SINGLE TWEET</span>
        <p className="text-sm text-white">{data.post}</p>
        <span className="text-xs text-white/30 mt-1 block">{data.post.length}/280</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Thread ({data.thread.length} tweets)</span>
          <CopyButton text={data.thread.map((t, i) => `${i + 1}/ ${t}`).join('\n\n')} label="Copy thread" />
        </div>
        <div className="space-y-2">
          {data.thread.map((tweet, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-surface-900/50 border border-white/5 group">
              <span className="text-xs font-bold text-sky-400 mt-0.5 shrink-0">{i + 1}/</span>
              <div className="flex-1">
                <p className="text-sm text-white/80">{tweet}</p>
                <span className="text-xs text-white/20 mt-1 block">{tweet.length}/280</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <QualityScoreCard {...data.quality} />
    </div>
  );
}

// ─── Shared Card Header ───────────────────────────────────────────────────────

function CardHeader({
  title,
  subtitle,
  color,
  exportText,
  exportName,
  onRegenerate,
  isRegenerating,
}: {
  title: string;
  subtitle: string;
  color: string;
  exportText: string;
  exportName: string;
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  const handleExport = () => {
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center justify-between pb-4 border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${color}`}>{title}</div>
        <span className="text-xs text-white/30">{subtitle}</span>
      </div>
      <div className="flex items-center gap-1">
        <CopyButton text={exportText} />
        <button onClick={handleExport} className="btn-ghost text-xs" title="Download as .txt">
          <Download size={13} />
        </button>
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="btn-ghost text-xs disabled:opacity-50"
          title="Regenerate"
        >
          <RotateCcw size={13} className={isRegenerating ? 'animate-spin' : ''} />
          {isRegenerating ? 'Regenerating…' : 'Regenerate'}
        </button>
      </div>
    </div>
  );
}

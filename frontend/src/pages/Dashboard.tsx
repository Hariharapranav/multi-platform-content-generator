import { useState, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle, RefreshCw, CheckCircle2,
  FileText, ChevronRight, LogOut,
  Copy, Download, RotateCcw, ChevronDown, ChevronUp,
  Target, Users, Heart, Hash, Check,
  Video, Mic, FileAudio, FileVideo, UploadCloud, X,
  Layers, Play, MessageSquare, ThumbsUp, Repeat, Bookmark,
  Share2, Sparkles, History, Trash2, Clock, ArrowRight,
  Link2, Globe
} from 'lucide-react'
import { YoutubeIcon, InstagramIcon, LinkedinIcon, XTwitterIcon } from '@/components/ui/brand-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { AppState, Platform, PlatformOutputs } from '@/types'
import { analyzeContent, regeneratePlatform, transcribeFile, transcribeUrl } from '@/api'
import { getSavedRepurposes, saveRepurpose, deleteSavedRepurpose, type SavedRepurpose } from '@/lib/storage'

// ─── Preset Sample Stories ───────────────────────────────────────────────────

const SAMPLE_TEXT = `Last year, we launched an AI developer tool with zero marketing budget. Today, we crossed 50,000 active users.

Here is the exact distribution playbook we used:

1. Build in public from Day -30: We shared raw screenshots of our broken prototypes on X and LinkedIn before writing the production backend. The bugs sparked more conversations than polished launch videos ever did.

2. Solved one micro-pain brilliantly: Instead of building an 'all-in-one AI platform', we focused exclusively on making API latency 4x faster. Extreme focus gave developers an immediate reason to try us.

3. Engineered organic word-of-mouth: We added a 1-click benchmark report that users could share with their engineering managers. Over 30% of our new signups came directly from those shared reports.

The biggest lesson? Most startups fail at distribution, not product engineering. If you can turn your product into a talking point, the algorithm does the rest of the heavy lifting.`

const SAMPLE_VIDEO_TRANSCRIPT = `Speaker 1: Welcome everyone. In today's video keynote, I want to talk about how media companies and independent founders scale their audience in 2026.
Speaker 1: The old game was writing a single 3,000-word blog post or producing an hour-long podcast, hitting publish, and praying the algorithm picks it up. That era is completely over.
Speaker 1: Today, digital leverage comes from the Content DNA framework. Whenever you record 20 minutes of video, you aren't just creating a YouTube video. You are creating the raw genetic material for five distinct platforms.
Speaker 1: In the first five minutes alone, there is almost always a contrarian hook suitable for an X thread. Around the ten-minute mark, there is typically a tactical case study that fits LinkedIn perfectly. And throughout the recording, you have visual micro-moments that should become 45-second Instagram Reels.
Speaker 1: If you do not repurpose natively for each platform's psychology, you leave 80% of your audience reach on the table. The winning formula is simple: create once, extract the DNA, and distribute everywhere.`

// ─── Micro Helpers ───────────────────────────────────────────────────────────

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function CopyBtn({ text, label = 'Copy', className = '' }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const handle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      type="button"
      onClick={handle}
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer',
        copied && 'text-emerald-700 bg-emerald-50/50 border-emerald-200',
        className
      )}
    >
      {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-slate-400" />}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  )
}

function ExportBtn({ text, name }: { text: string; name: string }) {
  const handle = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <button
      type="button"
      onClick={handle}
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
    >
      <Download className="h-3 w-3 text-slate-400" />
      <span>Export</span>
    </button>
  )
}

// ─── Compact AI Quality Indicator ─────────────────────────────────────────────

function CompactQualityMeter({ relevance, consistency, platform_fit, overall, notes }: {
  relevance: number; consistency: number; platform_fit: number; overall: number; notes: string
}) {
  return (
    <div className="pt-4 border-t border-slate-100 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">Algorithm Fit Score</span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            {overall}/100
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
          <span>Relevance: <strong className="text-slate-700 font-semibold">{relevance}%</strong></span>
          <span>•</span>
          <span>Voice: <strong className="text-slate-700 font-semibold">{consistency}%</strong></span>
          <span>•</span>
          <span>Fit: <strong className="text-slate-700 font-semibold">{platform_fit}%</strong></span>
        </div>
      </div>
      {notes && (
        <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 rounded-lg p-2.5 border border-slate-200/50">
          💡 <span className="text-slate-700">{notes}</span>
        </p>
      )}
    </div>
  )
}

// ─── Platform Card: YouTube ───────────────────────────────────────────────────

function YouTubeCard({ data, onRegen, isRegen }: { data: any; onRegen: () => void; isRegen: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const exportText = `TITLE:\n${data.title}\n\nDESCRIPTION:\n${data.description}\n\nTAGS:\n${data.tags?.join(', ')}`

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">YouTube Studio Package</span>
          <span className="text-[10px] text-slate-400">SEO Optimized</span>
        </div>
        <div className="flex items-center gap-2">
          <CopyBtn text={exportText} label="Copy Package" />
          <ExportBtn text={exportText} name="youtube-package" />
          <button
            type="button"
            onClick={onRegen}
            disabled={isRegen}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={cn('h-3 w-3 text-slate-400', isRegen && 'animate-spin')} />
            <span>{isRegen ? 'Generating…' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      {/* Video Title */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Clickable High-CTR Title</span>
          <CopyBtn text={data.title} label="Copy Title" />
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-colors">
          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            {data.title}
          </h3>
        </div>
      </div>

      {/* Description & Timestamps */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Video Description & Timestamps</span>
          <div className="flex items-center gap-2">
            <CopyBtn text={data.description} label="Copy Description" />
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-0.5"
            >
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              <span>{expanded ? 'Show Less' : 'Expand'}</span>
            </button>
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
          <p className={cn('text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans', !expanded && 'line-clamp-6')}>
            {data.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Target Tags ({data.tags?.length || 0})</span>
          <CopyBtn text={data.tags?.join(', ') || ''} label="Copy Tags" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {data.tags?.map((t: string, i: number) => (
            <span key={i} className="inline-flex items-center rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-xs text-slate-600 font-medium">
              #{t.replace(/^#/, '')}
            </span>
          ))}
        </div>
      </div>

      <CompactQualityMeter {...data.quality} />
    </div>
  )
}

// ─── Platform Card: Instagram Reel ─────────────────────────────────────────────

function InstagramCard({ data, onRegen, isRegen }: { data: any; onRegen: () => void; isRegen: boolean }) {
  const captionText = data.caption || data.reel_caption || ''
  const exportText = `3-SEC HOOK:\n${data.hook}\n\nCAPTION:\n${captionText}\n\nHASHTAGS:\n${data.hashtags?.map((h: string) => `#${h}`).join(' ')}`

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Instagram Reel Package</span>
          <span className="text-[10px] text-slate-400">Viral Short-Form</span>
        </div>
        <div className="flex items-center gap-2">
          <CopyBtn text={exportText} label="Copy Package" />
          <ExportBtn text={exportText} name="instagram-reel" />
          <button
            type="button"
            onClick={onRegen}
            disabled={isRegen}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={cn('h-3 w-3 text-slate-400', isRegen && 'animate-spin')} />
            <span>{isRegen ? 'Generating…' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      {/* 3-Second Visual Hook Callout */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">3-Second Opening Hook (Spoken / On-Screen)</span>
          <CopyBtn text={data.hook} label="Copy Hook" />
        </div>
        <div className="p-3.5 rounded-xl border border-rose-200/80 bg-rose-50/40 text-slate-900">
          <p className="text-xs sm:text-sm font-bold tracking-tight">"{data.hook}"</p>
        </div>
      </div>

      {/* Caption Preview */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Reel Caption</span>
          <CopyBtn text={captionText} label="Copy Caption" />
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
          <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
            <div className="h-6 w-6 rounded-full bg-slate-900 text-white font-bold text-[9px] flex items-center justify-center">
              CS
            </div>
            <span className="text-xs font-bold text-slate-900">contentstudio</span>
            <span className="text-[10px] text-slate-400">• Original Audio</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
            {captionText}
          </p>
        </div>
      </div>

      {/* Hashtags */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Hashtags ({data.hashtags?.length || 0})</span>
          <CopyBtn text={data.hashtags?.map((h: string) => `#${h}`).join(' ') || ''} label="Copy Hashtags" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {data.hashtags?.map((t: string, i: number) => (
            <span key={i} className="inline-flex items-center rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-xs text-slate-600 font-medium">
              #{t.replace(/^#/, '')}
            </span>
          ))}
        </div>
      </div>

      <CompactQualityMeter {...data.quality} />
    </div>
  )
}

// ─── Platform Card: LinkedIn Post ──────────────────────────────────────────────

function LinkedInCard({ data, onRegen, isRegen }: { data: any; onRegen: () => void; isRegen: boolean }) {
  const exportText = `HOOK:\n${data.hook}\n\nPOST:\n${data.post}\n\nHASHTAGS:\n${data.hashtags?.map((h: string) => `#${h}`).join(' ')}`

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">LinkedIn Thought Leadership</span>
          <span className="text-[10px] text-slate-400">Executive Narrative</span>
        </div>
        <div className="flex items-center gap-2">
          <CopyBtn text={exportText} label="Copy Post" />
          <ExportBtn text={exportText} name="linkedin-post" />
          <button
            type="button"
            onClick={onRegen}
            disabled={isRegen}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={cn('h-3 w-3 text-slate-400', isRegen && 'animate-spin')} />
            <span>{isRegen ? 'Generating…' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      {/* Realistic LinkedIn Feed Preview */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 space-y-3.5 shadow-2xs">
        {/* Creator Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
              CS
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Founder & Technical Creator
                <span className="text-[10px] text-slate-400 font-normal ml-1">• 1st</span>
              </div>
              <div className="text-[10px] text-slate-500">Scaling AI Products • Just now • 🌐</div>
            </div>
          </div>
          <CopyBtn text={data.hook} label="Copy Hook" />
        </div>

        {/* 'See More' Trigger Hook Callout */}
        <div className="p-2.5 rounded-lg border border-blue-100 bg-blue-50/40 text-xs font-semibold text-blue-900 leading-snug">
          <span className="text-[10px] uppercase font-bold text-blue-600 block mb-0.5">Opening Hook ("See More" Trigger)</span>
          {data.hook}
        </div>

        {/* Narrative */}
        <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
          {data.post}
        </p>

        {/* Simulated Reactions */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-slate-500 text-xs font-medium px-1">
          <span className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer"><ThumbsUp className="h-3.5 w-3.5" /> Like</span>
          <span className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer"><MessageSquare className="h-3.5 w-3.5" /> Comment</span>
          <span className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer"><Repeat className="h-3.5 w-3.5" /> Repost</span>
          <span className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer"><Share2 className="h-3.5 w-3.5" /> Send</span>
        </div>
      </div>

      {/* Hashtags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {data.hashtags?.map((t: string, i: number) => (
          <span key={i} className="inline-flex items-center rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-xs text-slate-600 font-medium">
            #{t.replace(/^#/, '')}
          </span>
        ))}
      </div>

      <CompactQualityMeter {...data.quality} />
    </div>
  )
}

// ─── Platform Card: X / Twitter ───────────────────────────────────────────────

function TwitterCard({ data, onRegen, isRegen }: { data: any; onRegen: () => void; isRegen: boolean }) {
  const exportText = `STANDALONE TWEET:\n${data.post}\n\nTHREAD:\n${data.thread?.map((t: string, i: number) => `${i + 1}/ ${t}`).join('\n\n')}`

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">X (Twitter) Thread</span>
          <span className="text-[10px] text-slate-400">Viral Format</span>
        </div>
        <div className="flex items-center gap-2">
          <CopyBtn text={exportText} label="Copy All" />
          <ExportBtn text={exportText} name="twitter-thread" />
          <button
            type="button"
            onClick={onRegen}
            disabled={isRegen}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={cn('h-3 w-3 text-slate-400', isRegen && 'animate-spin')} />
            <span>{isRegen ? 'Generating…' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      {/* Standalone Tweet */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-slate-900 text-white font-bold text-[9px] flex items-center justify-center">
              CS
            </div>
            <span className="text-xs font-bold text-slate-900">Founder</span>
            <span className="text-[10px] text-slate-400">@studio • 1m</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono">{data.post?.length || 0}/280</span>
            <CopyBtn text={data.post} label="Copy Tweet" />
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-900 leading-relaxed whitespace-pre-wrap font-sans">
          {data.post}
        </p>
      </div>

      {/* Connected Thread Timeline */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Multi-Post Connected Thread ({data.thread?.length || 0} Tweets)</span>
          <CopyBtn
            text={data.thread?.map((t: string, i: number) => `${i + 1}/ ${t}`).join('\n\n') || ''}
            label="Copy Thread"
          />
        </div>

        <div className="space-y-2 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {data.thread?.map((tweet: string, i: number) => (
            <div key={i} className="relative flex items-start gap-2.5 pl-1">
              <div className="h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-2 z-10">
                {i + 1}
              </div>
              <div className="flex-1 p-3 rounded-lg border border-slate-200/80 bg-white space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">Tweet {i + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{tweet.length}/280</span>
                    <CopyBtn text={tweet} label="Copy" className="h-5 text-[10px] px-1.5" />
                  </div>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">{tweet}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CompactQualityMeter {...data.quality} />
    </div>
  )
}

// ─── Content DNA Sidebar ──────────────────────────────────────────────────────

function ContentDNASidebar({ dna }: { dna: any }) {
  const fullDNAText = `TOPIC: ${dna.topic}\n\nSUMMARY: ${dna.summary}\n\nTONE: ${dna.tone}\nAUDIENCE: ${dna.audience}\n\nKEY TAKEAWAYS:\n${dna.key_points?.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}\n\nHOOKS:\n${dna.hooks?.join('\n')}`

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
            DNA
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Content DNA</span>
        </div>
        <CopyBtn text={fullDNAText} label="Copy DNA" />
      </div>

      {/* Core Topic */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Thesis</span>
        <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <p className="text-xs font-bold text-slate-900 leading-snug">{dna.topic}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Executive Summary</span>
        <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/70">
          {dna.summary}
        </p>
      </div>

      {/* Key-Value Metadata Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-lg border border-slate-200/70 bg-white">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tone</div>
          <div className="font-semibold text-slate-900 capitalize truncate mt-0.5">{dna.tone}</div>
        </div>
        <div className="p-2.5 rounded-lg border border-slate-200/70 bg-white">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Audience</div>
          <div className="font-semibold text-slate-900 truncate mt-0.5" title={dna.audience}>{dna.audience}</div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Points</span>
        <ul className="space-y-1.5">
          {dna.key_points?.map((pt: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-800 p-2 rounded-lg bg-white border border-slate-100">
              <span className="text-[10px] font-mono font-bold text-slate-400 mt-0.5 shrink-0">
                0{i + 1}
              </span>
              <span className="leading-snug">{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Extracted Viral Hooks */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Angles & Hooks</span>
        <div className="space-y-1.5">
          {dna.hooks?.map((hook: string, i: number) => (
            <div key={i} className="group relative rounded-lg border border-slate-200/70 bg-white p-2.5 text-xs text-slate-800 flex items-center justify-between gap-2 hover:border-slate-300 transition-colors">
              <span className="leading-snug italic font-medium">"{hook}"</span>
              <CopyBtn text={hook} label="Copy" className="h-5 text-[10px] px-1.5 shrink-0 opacity-70 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div className="pt-1 flex flex-wrap gap-1">
        {dna.keywords?.map((k: string, i: number) => (
          <span key={i} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
            #{k.replace(/^#/, '')}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Dashboard Main ────────────────────────────────────────────────────────────

const INIT: AppState = {
  stage: 'idle',
  content: '',
  response: null,
  error: null,
  activePlatform: 'youtube',
  regenerating: null,
}

const SUPPORTED_EXTS = ['.mp4', '.mov', '.mp3', '.wav', '.m4a', '.webm', '.flac', '.ogg']

export default function Dashboard() {
  const [state, setState] = useState<AppState>(INIT)
  const [inputTab, setInputTab] = useState<'text' | 'media' | 'url'>('text')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaUrlLoading, setMediaUrlLoading] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [transcribeProgress, setTranscribeProgress] = useState('')
  const [mediaSourceNote, setMediaSourceNote] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [savedList, setSavedList] = useState<SavedRepurpose[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load saved repurposes from localStorage on mount
  useEffect(() => {
    setSavedList(getSavedRepurposes())
  }, [])

  const update = useCallback((patch: Partial<AppState>) => setState(prev => ({ ...prev, ...patch })), [])

  // Auto-save generation to localStorage whenever state reaches 'done'
  const handleSaveToLocalStorage = (resp: any, contentText: string) => {
    if (!resp?.content_dna) return
    const saved = saveRepurpose({
      topic: resp.content_dna.topic,
      summary: resp.content_dna.summary,
      wordCount: resp.word_count || contentText.split(/\s+/).length,
      processingTimeMs: resp.processing_time_ms || 0,
      response: resp,
      originalContent: contentText,
    })
    setSavedList(getSavedRepurposes())
  }

  const handleFileSelect = (file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!SUPPORTED_EXTS.includes(ext)) {
      update({ error: `Unsupported format (${ext}). Supported: MP4, MOV, MP3, WAV, M4A, WEBM.` })
      return
    }
    if (file.size > 25 * 1024 * 1024) {
      update({ error: 'File exceeds 25 MB limit. Please upload a smaller audio or video clip.' })
      return
    }
    setSelectedFile(file)
    update({ error: null })
  }

  // 1-Click: Transcribe File AND Generate Content
  const handleTranscribeAndGenerate = async () => {
    if (!selectedFile) return
    setTranscribing(true)
    setTranscribeProgress('Uploading media file...')
    update({ stage: 'analyzing', error: null })

    try {
      setTranscribeProgress('Transcribing spoken audio with AI engine...')
      const res = await transcribeFile(selectedFile)
      
      const transcript = res.transcript.trim()
      if (transcript.length < 20) {
        throw new Error('Transcription produced insufficient text. Please try another recording.')
      }

      setMediaSourceNote(`Uploaded: ${res.filename} (${res.word_count} words • ${(res.processing_time_ms / 1000).toFixed(1)}s)`)
      update({ content: transcript })

      setTranscribeProgress('Synthesizing Content DNA & 4 platform posts...')
      const analysisResponse = await analyzeContent(transcript)
      update({ stage: 'done', response: analysisResponse })
      handleSaveToLocalStorage(analysisResponse, transcript)
    } catch (err: unknown) {
      update({
        stage: 'error',
        error: err instanceof Error ? err.message : 'Transcription or analysis failed.'
      })
    } finally {
      setTranscribing(false)
      setTranscribeProgress('')
    }
  }

  // Transcribe Only
  const handleTranscribeOnly = async () => {
    if (!selectedFile) return
    setTranscribing(true)
    setTranscribeProgress('Transcribing media...')
    update({ error: null })

    try {
      const res = await transcribeFile(selectedFile)
      setMediaSourceNote(`Transcribed from: ${res.filename} (${res.word_count} words)`)
      update({ content: res.transcript })
      setInputTab('text')
    } catch (err: unknown) {
      update({
        error: err instanceof Error ? err.message : 'Transcription failed. Check audio format.'
      })
    } finally {
      setTranscribing(false)
      setTranscribeProgress('')
    }
  }

  // 1-Click: Transcribe Media URL AND Generate Content
  const handleTranscribeUrlAndGenerate = async () => {
    const url = mediaUrl.trim()
    if (!url) return
    setMediaUrlLoading(true)
    setTranscribeProgress('Fetching media transcript from URL…')
    update({ stage: 'analyzing', error: null })

    try {
      setTranscribeProgress('Extracting video/audio captions or remote stream…')
      const res = await transcribeUrl(url)
      
      const transcript = res.transcript.trim()
      if (transcript.length < 20) {
        throw new Error('Transcript fetched from URL was too short. Please try another link.')
      }

      setMediaSourceNote(`URL: ${res.title} (${res.word_count} words • ${(res.processing_time_ms / 1000).toFixed(1)}s)`)
      update({ content: transcript })

      setTranscribeProgress('Synthesizing Content DNA & 4 platform posts...')
      const analysisResponse = await analyzeContent(transcript)
      update({ stage: 'done', response: analysisResponse })
      handleSaveToLocalStorage(analysisResponse, transcript)
    } catch (err: unknown) {
      update({
        stage: 'error',
        error: err instanceof Error ? err.message : 'URL transcription or analysis failed.'
      })
    } finally {
      setMediaUrlLoading(false)
      setTranscribeProgress('')
    }
  }

  // Transcribe URL Only
  const handleTranscribeUrlOnly = async () => {
    const url = mediaUrl.trim()
    if (!url) return
    setMediaUrlLoading(true)
    setTranscribeProgress('Fetching transcript from URL…')
    update({ error: null })

    try {
      const res = await transcribeUrl(url)
      setMediaSourceNote(`Transcribed from: ${res.title} (${res.word_count} words)`)
      update({ content: res.transcript })
      setInputTab('text')
    } catch (err: unknown) {
      update({
        error: err instanceof Error ? err.message : 'URL transcription failed. Ensure the link has captions or direct audio.'
      })
    } finally {
      setMediaUrlLoading(false)
      setTranscribeProgress('')
    }
  }

  const handleAnalyze = async () => {
    const content = state.content.trim()
    if (content.length < 20) return
    update({ stage: 'analyzing', error: null })
    try {
      const response = await analyzeContent(content)
      update({ stage: 'done', response })
      handleSaveToLocalStorage(response, content)
    } catch (err: unknown) {
      update({ stage: 'error', error: err instanceof Error ? err.message : 'Analysis failed. Check backend connection.' })
    }
  }

  const handleRegenerate = async (platform: Platform) => {
    if (!state.response) return
    update({ regenerating: platform })
    try {
      const { output } = await regeneratePlatform(platform, state.response.content_dna as unknown as object)
      const updatedResponse = {
        ...state.response,
        platforms: { ...state.response.platforms, [platform]: output } as PlatformOutputs
      }
      update({
        regenerating: null,
        response: updatedResponse,
      })
      handleSaveToLocalStorage(updatedResponse, state.content)
    } catch (err: unknown) {
      update({ regenerating: null, error: err instanceof Error ? err.message : 'Regeneration failed' })
    }
  }

  const loadFromHistory = (item: SavedRepurpose) => {
    update({
      stage: 'done',
      content: item.originalContent || '',
      response: item.response,
      error: null,
      activePlatform: 'youtube',
    })
    setShowHistory(false)
  }

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = deleteSavedRepurpose(id)
    setSavedList(updated)
  }

  const exportAll = () => {
    if (!state.response) return
    const p = state.response.platforms
    const fullBundle = `=== AI CONTENT STUDIO EXPORT ===\n\n` +
      `TOPIC: ${state.response.content_dna.topic}\n` +
      `SUMMARY: ${state.response.content_dna.summary}\n\n` +
      `----------------------------------------\n` +
      `1. YOUTUBE VIDEO PACKAGE\n` +
      `Title: ${p.youtube.title}\n\nDescription:\n${p.youtube.description}\n\nTags: ${p.youtube.tags?.join(', ')}\n\n` +
      `----------------------------------------\n` +
      `2. INSTAGRAM REEL PACKAGE\n` +
      `Hook: ${p.instagram.hook}\n\nCaption:\n${p.instagram.caption}\n\nHashtags: ${p.instagram.hashtags?.map((h: string) => `#${h}`).join(' ')}\n\n` +
      `----------------------------------------\n` +
      `3. LINKEDIN POST\n` +
      `Hook: ${p.linkedin.hook}\n\nPost:\n${p.linkedin.post}\n\nHashtags: ${p.linkedin.hashtags?.map((h: string) => `#${h}`).join(' ')}\n\n` +
      `----------------------------------------\n` +
      `4. X (TWITTER) POST & THREAD\n` +
      `Single Post:\n${p.twitter.post}\n\nThread:\n${p.twitter.thread?.map((t: string, i: number) => `${i + 1}/ ${t}`).join('\n\n')}\n`

    const blob = new Blob([fullBundle], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `content-studio-all-platforms.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const isVideo = selectedFile?.name.match(/\.(mp4|mov|avi|mkv|webm)$/i)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white shadow-2xs">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl h-14 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                CS
              </div>
              <span className="font-bold text-sm tracking-tight text-slate-900">ContentStudio</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-medium text-slate-500">
              {state.stage === 'done' && state.response ? (
                <span className="text-slate-800 font-semibold truncate max-w-xs inline-block align-bottom">
                  {state.response.content_dna.topic}
                </span>
              ) : (
                'Studio Workspace'
              )}
            </span>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* History Toggle Button */}
            <button
              type="button"
              onClick={() => setShowHistory(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <History className="h-3.5 w-3.5 text-slate-500" />
              <span>Saved History</span>
              {savedList.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600 font-mono">
                  {savedList.length}
                </span>
              )}
            </button>

            {state.stage === 'done' && state.response && (
              <>
                <button
                  type="button"
                  onClick={exportAll}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span>Download Bundle</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setState(INIT)
                    setSelectedFile(null)
                    setMediaSourceNote(null)
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>New Repurpose</span>
                </button>
              </>
            )}

            <Link to="/">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-800" title="Exit to home">
                <LogOut className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Saved History Drawer (Slide-out Overlay) ────────────────── */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">Saved Repurposes</h3>
                <span className="text-xs text-slate-400 font-mono">({savedList.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {savedList.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <History className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-semibold text-slate-700">No saved repurposes yet</div>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Any content you analyze or transcribe will automatically be saved locally right here.
                  </p>
                </div>
              ) : (
                savedList.map(item => (
                  <div
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="group p-3 rounded-xl border border-slate-200/80 bg-white hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {item.topic}
                      </h4>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteHistory(item.id, e)}
                        className="text-slate-300 hover:text-red-500 p-1 rounded transition-colors shrink-0"
                        title="Delete from saved"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                      <span>{timeAgo(item.createdAt)}</span>
                      <span className="text-slate-500 font-semibold group-hover:text-blue-600 inline-flex items-center gap-0.5">
                        Open <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
              <span>Saved locally in browser storage</span>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="font-semibold text-slate-700 hover:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Workspace Body ────────────────────────────────────────── */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 max-w-7xl py-6">

        {/* ── IDLE / ERROR STATE: Multi-modal Input ────────────────────── */}
        {(state.stage === 'idle' || state.stage === 'error') && (
          <div className="max-w-3xl mx-auto space-y-6 pt-2">
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Multi-Modal Studio • Audio, Video & Text Ingestion</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Transform any content into 4 native platforms
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
                Paste an article, founder story, or drop an audio/video recording. ContentStudio extracts the Content DNA and formats platform-ready posts.
              </p>
            </div>

            {state.stage === 'error' && state.error && (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive">{state.error}</p>
              </div>
            )}

            {/* Input Surface */}
            <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
              {/* Tab Selector */}
              <div className="flex border-b border-slate-200 bg-slate-50/70">
                <button
                  type="button"
                  onClick={() => setInputTab('text')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer',
                    inputTab === 'text'
                      ? 'border-slate-900 bg-white text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  )}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Text or Notes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputTab('media')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer',
                    inputTab === 'media'
                      ? 'border-slate-900 bg-white text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  )}
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>Upload Audio/Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputTab('url')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer',
                    inputTab === 'url'
                      ? 'border-slate-900 bg-white text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  )}
                >
                  <Link2 className="h-3.5 w-3.5" />
                  <span>Paste Media URL</span>
                </button>
              </div>

              {/* Mode 1: Text */}
              {inputTab === 'text' && (
                <div className="p-5 space-y-3">
                  {/* Preset Pills Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Master Content</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          update({ content: SAMPLE_TEXT })
                          setMediaSourceNote('Sample 50k User Growth Playbook Loaded')
                        }}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        ⚡ 50k User Growth Story
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          update({ content: SAMPLE_VIDEO_TRANSCRIPT })
                          setMediaSourceNote('Sample Video Keynote Transcript (18 mins)')
                        }}
                        className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        🎥 Video Transcript
                      </button>
                      {state.content && (
                        <button
                          type="button"
                          onClick={() => {
                            update({ content: '' })
                            setMediaSourceNote(null)
                          }}
                          className="text-[11px] text-slate-400 hover:text-slate-700 px-1.5 py-1"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {mediaSourceNote && (
                    <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700">
                      <span className="font-medium">{mediaSourceNote}</span>
                      <button
                        type="button"
                        onClick={() => setMediaSourceNote(null)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {/* Clean Editor Area */}
                  <Textarea
                    id="content-input"
                    className="min-h-[220px] text-xs sm:text-sm border-0 p-2 bg-transparent resize-none focus:outline-none focus-visible:ring-0 leading-relaxed text-slate-900 placeholder:text-slate-400 font-sans"
                    placeholder="Paste your article, founder story, lecture transcript, or newsletter here… (Min. 20 characters)&#10;&#10;Tip: Press Ctrl + Enter to analyze immediately."
                    value={state.content}
                    onChange={e => update({ content: e.target.value })}
                    onKeyDown={e => {
                      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && state.content.trim().length >= 20) {
                        e.preventDefault()
                        handleAnalyze()
                      }
                    }}
                    autoFocus
                  />

                  {/* Editor Bottom Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-medium">
                        {state.content.trim() ? (
                          <>
                            <strong className="text-slate-700">{state.content.trim().split(/\s+/).length}</strong> words
                            <span className="mx-1">•</span>
                            <span>~{Math.max(1, Math.ceil(state.content.trim().split(/\s+/).length / 200))}m read</span>
                          </>
                        ) : (
                          'Minimum 20 characters'
                        )}
                      </span>
                      <div className="hidden sm:flex gap-1">
                        {(['YouTube', 'Instagram', 'LinkedIn', 'X'] as const).map(p => (
                          <span key={p} className="text-[10px] font-semibold border border-slate-200/80 rounded px-1.5 py-0.5 text-slate-500 bg-slate-50">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden md:inline text-[11px] text-slate-400 font-mono">Ctrl+Enter ↵</span>
                      <Button
                        id="analyze-btn"
                        onClick={handleAnalyze}
                        disabled={state.content.trim().length < 20}
                        className="gap-2 text-xs h-9 px-4 font-semibold shadow-xs bg-slate-900 text-white hover:bg-slate-800"
                      >
                        <span>Extract DNA & Generate All</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 2: Audio / Video */}
              {inputTab === 'media' && (
                <div className="p-5 space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".mp4,.mov,.mp3,.wav,.m4a,.webm,.flac,.ogg"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files?.[0]) handleFileSelect(e.target.files[0])
                    }}
                  />

                  {!selectedFile ? (
                    <div
                      onDragOver={e => { e.preventDefault(); setDragActive(true) }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={e => {
                        e.preventDefault()
                        setDragActive(false)
                        if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0])
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all space-y-3',
                        dragActive ? 'border-slate-900 bg-slate-100' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                      )}
                    >
                      <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-600 shadow-2xs">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-900">
                          Drop your audio or video file here, or browse
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Supports MP4, MOV, MP3, WAV, M4A, WEBM (up to 25 MB)
                        </p>
                      </div>
                      <div className="pt-1 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium">
                        <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">Video MP4/MOV</span>
                        <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">Audio MP3/WAV</span>
                        <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">Automatic Speech-to-Text</span>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 p-4 space-y-4 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
                            {isVideo ? <Video className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 truncate max-w-xs">{selectedFile.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {isVideo ? 'Video Recording' : 'Audio Track'}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                          className="h-8 text-xs text-slate-500 hover:text-slate-900"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Change
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-200">
                        <Button
                          onClick={handleTranscribeAndGenerate}
                          disabled={transcribing}
                          className="flex-1 h-9 text-xs font-semibold gap-2 shadow-xs bg-slate-900 text-white hover:bg-slate-800"
                        >
                          {transcribing ? (
                            <span>{transcribeProgress || 'Processing media…'}</span>
                          ) : (
                            <>
                              <span>Transcribe & Generate All Platforms</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleTranscribeOnly}
                          disabled={transcribing}
                          className="h-9 text-xs font-semibold"
                        >
                          Transcribe Only
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <span>Don't have an audio/video file handy?</span>
                    <button
                      type="button"
                      onClick={() => {
                        update({ content: SAMPLE_VIDEO_TRANSCRIPT })
                        setMediaSourceNote('Sample Video Keynote Transcript (18 mins)')
                        setInputTab('text')
                      }}
                      className="text-xs text-slate-900 underline font-semibold hover:text-blue-700 cursor-pointer"
                    >
                      Load sample video transcript
                    </button>
                  </div>
                </div>
              )}

              {/* Mode 3: Media URL (YouTube, Audio, Video link) */}
              {inputTab === 'url' && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Media URL Ingestion</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-medium">Quick Test:</span>
                      <button
                        type="button"
                        onClick={() => setMediaUrl('https://www.youtube.com/watch?v=UF8uR6Z6KLc')}
                        className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        Steve Jobs Speech
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
                        className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        YouTube Classic
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                      <span>YouTube, Podcast, or Direct Audio/Video Link</span>
                      <span className="text-[11px] font-normal text-slate-400">YouTube, MP3, MP4, WAV, M4A, WEBM</span>
                    </label>

                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                        <Link2 className="h-4 w-4" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=... or direct .mp3 / .mp4 URL"
                        value={mediaUrl}
                        onChange={e => setMediaUrl(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && mediaUrl.trim() && !mediaUrlLoading) {
                            e.preventDefault()
                            handleTranscribeUrlAndGenerate()
                          }
                        }}
                        className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200/90 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 shadow-2xs font-sans transition-colors"
                      />
                      {mediaUrl && (
                        <button
                          type="button"
                          onClick={() => setMediaUrl('')}
                          className="absolute right-3 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Instant Transcript Extraction via Deep Captioning & Streaming</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Paste any YouTube video or shorts link. We automatically extract and clean the speaker captions, isolate the core message, and format it into 4 native channel posts in one click.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
                      <Button
                        onClick={handleTranscribeUrlAndGenerate}
                        disabled={!mediaUrl.trim() || mediaUrlLoading}
                        className="flex-1 h-9 text-xs font-semibold gap-2 shadow-xs bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                      >
                        {mediaUrlLoading ? (
                          <span>{transcribeProgress || 'Processing URL…'}</span>
                        ) : (
                          <>
                            <span>Transcribe URL & Generate All Platforms</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleTranscribeUrlOnly}
                        disabled={!mediaUrl.trim() || mediaUrlLoading}
                        className="h-9 text-xs font-semibold cursor-pointer"
                      >
                        Transcribe URL Only
                      </Button>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <span>Prefer uploading your local files?</span>
                    <button
                      type="button"
                      onClick={() => setInputTab('media')}
                      className="text-xs text-slate-900 underline font-semibold hover:text-blue-700 cursor-pointer"
                    >
                      Switch to file upload
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Access to Recent Saved Repurposes */}
            {savedList.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-500 text-[11px]">Recent Saved Repurposes</span>
                  <button
                    type="button"
                    onClick={() => setShowHistory(true)}
                    className="font-semibold text-slate-700 hover:text-slate-900 hover:underline cursor-pointer"
                  >
                    View All ({savedList.length})
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {savedList.slice(0, 4).map(item => (
                    <div
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="group p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer space-y-1.5"
                    >
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {item.topic}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed">
                        {item.summary}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                        <span>{timeAgo(item.createdAt)}</span>
                        <span className="text-slate-700 font-semibold group-hover:text-blue-600 inline-flex items-center gap-0.5">
                          Open <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {/* ── ANALYZING / TRANSCRIBING STATE ───────────────────────────── */}
        {state.stage === 'analyzing' && (
          <div className="max-w-2xl mx-auto py-20 space-y-6 text-center">
            <div className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-slate-900 animate-spin mx-auto" />
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900">
                {transcribeProgress || 'Synthesizing with Gemini 3.5 Flash…'}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Extracting core thesis and tailoring native posts for YouTube, Instagram, LinkedIn, and X.
              </p>
            </div>
            <div className="max-w-xs mx-auto space-y-2">
              <div className="h-2 w-full rounded bg-slate-200/80 animate-pulse" />
              <div className="h-2 w-2/3 mx-auto rounded bg-slate-200/80 animate-pulse" />
            </div>
          </div>
        )}

        {/* ── RESULTS STAGE: Clean 2-Column Studio ────────────────────── */}
        {state.stage === 'done' && state.response && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Content DNA (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sticky top-20">
              <ContentDNASidebar dna={state.response.content_dna} />
            </div>

            {/* Right Column: Platform Studio (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <Tabs
                value={state.activePlatform}
                onValueChange={v => update({ activePlatform: v as Platform })}
                className="space-y-5"
              >
                {/* Platform Selector */}
                <TabsList className="grid grid-cols-4 h-11 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
                  <TabsTrigger
                    value="youtube"
                    className="text-xs font-bold gap-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs transition-all"
                  >
                    <YoutubeIcon className="h-4 w-4 text-red-600" />
                    <span className="hidden sm:inline">YouTube</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="instagram"
                    className="text-xs font-bold gap-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs transition-all"
                  >
                    <InstagramIcon className="h-4 w-4 text-pink-600" />
                    <span className="hidden sm:inline">Instagram</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="linkedin"
                    className="text-xs font-bold gap-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs transition-all"
                  >
                    <LinkedinIcon className="h-4 w-4 text-blue-700" />
                    <span className="hidden sm:inline">LinkedIn</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="twitter"
                    className="text-xs font-bold gap-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs transition-all"
                  >
                    <XTwitterIcon className="h-4 w-4 text-slate-900" />
                    <span className="hidden sm:inline">X (Twitter)</span>
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: YouTube */}
                <TabsContent value="youtube" className="m-0 focus-visible:outline-none">
                  <YouTubeCard
                    data={state.response.platforms.youtube}
                    onRegen={() => handleRegenerate('youtube')}
                    isRegen={state.regenerating === 'youtube'}
                  />
                </TabsContent>

                {/* Tab 2: Instagram */}
                <TabsContent value="instagram" className="m-0 focus-visible:outline-none">
                  <InstagramCard
                    data={state.response.platforms.instagram}
                    onRegen={() => handleRegenerate('instagram')}
                    isRegen={state.regenerating === 'instagram'}
                  />
                </TabsContent>

                {/* Tab 3: LinkedIn */}
                <TabsContent value="linkedin" className="m-0 focus-visible:outline-none">
                  <LinkedInCard
                    data={state.response.platforms.linkedin}
                    onRegen={() => handleRegenerate('linkedin')}
                    isRegen={state.regenerating === 'linkedin'}
                  />
                </TabsContent>

                {/* Tab 4: X / Twitter */}
                <TabsContent value="twitter" className="m-0 focus-visible:outline-none">
                  <TwitterCard
                    data={state.response.platforms.twitter}
                    onRegen={() => handleRegenerate('twitter')}
                    isRegen={state.regenerating === 'twitter'}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

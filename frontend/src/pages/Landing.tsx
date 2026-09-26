import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, CheckCircle2, FileText,
  BarChart3, RefreshCw, Copy, Download, ChevronRight,
  Star, Users, TrendingUp, Clock, Video, Mic,
  Layers, Target, ShieldCheck, Play, Sparkles, Check,
  MessageSquare, ThumbsUp, Repeat, Bookmark, Share2, ArrowUpRight
} from 'lucide-react'
import { YoutubeIcon, InstagramIcon, LinkedinIcon, XTwitterIcon } from '@/components/ui/brand-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// ─── Header / Navigation ──────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur shadow-2xs">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
            CS
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900">ContentStudio</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
          <a href="#platforms" className="hover:text-slate-900 transition-colors">Platforms</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            to="/signin"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            <span>Open Studio</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </header>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function Hero() {
  const [activeTab, setActiveTab] = useState<'youtube' | 'instagram' | 'linkedin' | 'twitter'>('linkedin')

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 bg-slate-50/70 border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center space-y-6">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Multi-Modal Engine • Audio, Video & Text Repurposing</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] max-w-4xl mx-auto">
          One recording or article.
          <br />
          <span className="text-slate-900 underline decoration-slate-300 decoration-wavy decoration-1 underline-offset-8">
            Four native platform posts.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload video (MP4, MOV), podcast audio (MP3, WAV), or paste an article. ContentStudio extracts the Content DNA and synthesizes native posts for YouTube, Instagram, LinkedIn, and X — in under 10 seconds.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
          >
            <span>Try the Live Studio</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <span>Create Free Account</span>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
            ))}
            <span className="font-semibold text-slate-800 ml-1">4.9/5</span>
          </div>
          <span>•</span>
          <span>Used by 50,000+ founders & technical creators</span>
          <span>•</span>
          <span>No credit card required</span>
        </div>
      </div>

      {/* Interactive SaaS Studio Preview Mockup */}
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl mt-12">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Simulated Browser Chrome */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/80">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            </div>
            <div className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-3 py-0.5 rounded-md shadow-2xs">
              app.contentstudio.ai/dashboard
            </div>
            <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Live AI Model
            </div>
          </div>

          {/* Interactive Split View */}
          <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 text-left bg-slate-50/30">
            {/* Left DNA Column */}
            <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-4 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[9px]">
                    DNA
                  </div>
                  <span className="text-xs font-bold text-slate-900">Extracted Content DNA</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  Verified
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Thesis</span>
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  Scaling an AI tool to 50k users with $0 marketing spend via organic distribution loops.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Tone</span>
                  <span className="font-semibold text-slate-800">Tactical & Direct</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Audience</span>
                  <span className="font-semibold text-slate-800">Founders & Engineers</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Extracted Hooks</span>
                <div className="p-2 rounded-lg border border-slate-100 bg-slate-50/50 text-xs text-slate-800 italic">
                  "Most startups fail at distribution, not engineering. Here is our 50k user playbook."
                </div>
              </div>
            </div>

            {/* Right Platform Column with Interactive Tabs */}
            <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-4 space-y-3.5 shadow-2xs">
              {/* Tab Pills */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg">
                {[
                  { id: 'youtube', label: 'YouTube', icon: YoutubeIcon, color: 'text-red-600' },
                  { id: 'instagram', label: 'Instagram', icon: InstagramIcon, color: 'text-pink-600' },
                  { id: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon, color: 'text-blue-700' },
                  { id: 'twitter', label: 'X (Twitter)', icon: XTwitterIcon, color: 'text-slate-900' },
                ].map(tab => {
                  const Icon = tab.icon
                  const active = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        'flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer',
                        active ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                      )}
                    >
                      <Icon className={cn('h-3.5 w-3.5', tab.color)} />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Tab Content Previews */}
              {activeTab === 'youtube' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-800">YouTube Video Package</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Ready to copy</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <div className="text-xs font-bold text-slate-900">
                      How We Scaled an AI Tool to 50,000 Users With Zero Marketing Budget
                    </div>
                    <div className="text-[11px] text-slate-600 whitespace-pre-wrap leading-relaxed">
                      In this breakdown, we share the exact 3-step organic growth playbook that took us from zero to 50k users without spending $1 on ads...
                    </div>
                    <div className="flex gap-1 pt-1">
                      <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">#buildinpublic</span>
                      <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">#ai</span>
                      <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">#startups</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'instagram' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-800">Instagram Reel</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Hook Optimized</span>
                  </div>
                  <div className="p-3 rounded-lg border border-rose-100 bg-rose-50/40 text-xs font-bold text-slate-900">
                    3-Sec Hook: "We hit 50,000 users with $0 marketing spend. Here is the exact playbook."
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 leading-relaxed">
                    Most startups fail at distribution, not engineering. Here are 3 non-negotiables we used to scale...
                  </div>
                </div>
              )}

              {activeTab === 'linkedin' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-800">LinkedIn Thought Leadership</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Feed Ready</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-900 text-white font-bold text-[9px] flex items-center justify-center">
                        CS
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-900">Founder & Builder • 1st</div>
                        <div className="text-[9px] text-slate-400">Just now • 🌐</div>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-blue-900 bg-blue-50 p-2 rounded border border-blue-100">
                      "Last year we launched with zero marketing budget. Today we crossed 50,000 users. Here's our exact playbook:"
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      1. Build in public from Day -30: Raw screenshots spark more conversations than polished launch videos...
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'twitter' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-800">X (Twitter) Thread</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Character Verified</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
                    <div className="text-xs font-bold text-slate-900">Tweet 1/4 • 240/280 chars</div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      Last year, we launched an AI tool with zero marketing budget. Today, we crossed 50,000 active users. Here is the exact distribution playbook we used 🧵👇
                    </p>
                  </div>
                </div>
              )}

              {/* Quality score indicator */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                <span className="font-semibold text-slate-700">Algorithm Performance Score</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  95/100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Features Grid ────────────────────────────────────────────────────────────

const features = [
  {
    icon: Video,
    title: 'Audio & Video Speech-to-Text',
    description: 'Drop podcasts, keynote videos, or voice memos (MP4, MOV, MP3, WAV, WEBM). Transcription feeds straight into the multi-platform engine.',
  },
  {
    icon: Layers,
    title: 'Structured Content DNA',
    description: 'Distills any content into structured core thesis, target audience, tone, numbered key points, and emotional hooks.',
  },
  {
    icon: Target,
    title: 'Platform-Native Formatting',
    description: 'Formatted for platform algorithms: YouTube timestamps, Instagram 3-second hook callouts, LinkedIn "See More" triggers, and X threads.',
  },
  {
    icon: BarChart3,
    title: 'AI Quality Scoring',
    description: 'Analyzes relevance to source, brand consistency, and platform algorithm compliance with actionable feedback before publishing.',
  },
  {
    icon: RefreshCw,
    title: 'Single-Platform Regeneration',
    description: 'Tweak YouTube, Instagram, LinkedIn, or X independently with custom prompt adjustments without re-running the entire batch.',
  },
  {
    icon: Copy,
    title: 'Persistent Local History & Export',
    description: 'Automatically backs up all your generated posts to local storage. 1-click bundle export for your scheduling tools.',
  },
]

function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-12 space-y-2">
          <Badge variant="secondary" className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold border-slate-200">
            Features
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Engineered for high-output creators and founders
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
            A reliable transformation pipeline from raw audio, video, or notes to platform-ready distribution assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-2.5"
            >
              <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Input Raw Content',
      desc: 'Upload an audio/video recording (MP4, MP3, MOV, WAV) or paste an article, newsletter, or lecture notes.',
    },
    {
      num: '02',
      title: 'Synthesize Content DNA',
      desc: 'The engine extracts the core thesis, target audience, tone, numbered key takeaways, and viral hooks.',
    },
    {
      num: '03',
      title: 'Copy & Distribute',
      desc: 'Get formatted posts tailored to YouTube, Instagram Reels, LinkedIn, and X with 1-click clipboard copy.',
    },
  ]

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-12 space-y-2">
          <Badge variant="secondary" className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold border-slate-200">
            Workflow
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            From single input to 4 platforms in 10 seconds
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(s => (
            <div key={s.num} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2.5 shadow-2xs">
              <span className="font-mono text-xs font-bold text-slate-400">STEP {s.num}</span>
              <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Platforms Supported ──────────────────────────────────────────────────────

function Platforms() {
  const platforms = [
    {
      name: 'YouTube',
      icon: YoutubeIcon,
      color: 'text-red-600',
      specs: ['High-CTR SEO video title', 'Structured description with timestamps', '10 targeted discovery tags'],
    },
    {
      name: 'Instagram Reel',
      icon: InstagramIcon,
      color: 'text-pink-600',
      specs: ['3-second on-screen visual hook', 'High-retention caption with line breaks', 'Targeted hashtag cloud'],
    },
    {
      name: 'LinkedIn Thought Leadership',
      icon: LinkedinIcon,
      color: 'text-blue-700',
      specs: ['"See More" trigger line hook', 'Storytelling narrative framework', 'Industry professional hashtags'],
    },
    {
      name: 'X (Twitter) Post & Thread',
      icon: XTwitterIcon,
      color: 'text-slate-900',
      specs: ['Punchy standalone viral tweet', 'Connected multi-post thread timeline', 'Strict ≤280 character verification'],
    },
  ]

  return (
    <section id="platforms" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-12 space-y-2">
          <Badge variant="secondary" className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold border-slate-200">
            Native Formatting
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Tailored to each algorithm's psychology
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {platforms.map(p => {
            const Icon = p.icon
            return (
              <div key={p.name} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <Icon className={cn('h-5 w-5', p.color)} />
                  <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                </div>
                <ul className="space-y-1.5 pt-1 border-t border-slate-100">
                  {p.specs.map((spec, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                      <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing Section ──────────────────────────────────────────────────────────

function Pricing() {
  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      period: 'free forever',
      desc: 'For individual founders and independent creators.',
      features: ['5 full repurposes / month', 'Audio & video transcription (25MB)', 'All 4 platform formats', 'Local history storage', '1-click bundle export'],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$24',
      period: 'per month',
      desc: 'For active creators publishing weekly across platforms.',
      features: ['Unlimited monthly repurposes', 'Audio & video up to 100MB', 'All 4 platform formats', 'Custom single-platform regeneration', 'Priority AI processing queue'],
      cta: 'Start Pro Trial',
      highlighted: true,
    },
    {
      name: 'Team',
      price: '$69',
      period: 'per month',
      desc: 'For content agencies and marketing departments.',
      features: ['Everything in Pro', '5 team member seats', 'Brand voice custom guidelines', 'API webhook integration', 'Dedicated support'],
      cta: 'Get Team Access',
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-12 space-y-2">
          <Badge variant="secondary" className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold border-slate-200">
            Pricing
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">Start free. Upgrade as your content distribution scales.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map(t => (
            <div
              key={t.name}
              className={cn(
                'p-6 rounded-2xl border bg-white flex flex-col justify-between space-y-5',
                t.highlighted ? 'border-slate-900 shadow-md ring-1 ring-slate-900' : 'border-slate-200 shadow-2xs'
              )}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.name}</span>
                  {t.highlighted && (
                    <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
                      Most Popular
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">{t.price}</span>
                  <span className="text-xs text-slate-500">/{t.period}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  {t.features.map((f, i) => (
                    <div key={i} className="text-xs text-slate-700 flex items-center gap-2">
                      <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/signup"
                className={cn(
                  'w-full text-center py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs block',
                  t.highlighted
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                )}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80 text-center">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Start repurposing your content today
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm">
          Join thousands of founders and creators who distribute to YouTube, Instagram, LinkedIn, and X without manual rewriting.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
          >
            <span>Open Studio Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <span>Create Free Account</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-slate-50 py-10 text-xs text-slate-500">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
            CS
          </div>
          <span className="font-bold text-slate-900">ContentStudio</span>
          <span className="text-slate-300">•</span>
          <span>SaaS Content Engine</span>
        </div>

        <div className="flex items-center gap-5 font-medium">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          <Link to="/signin" className="hover:text-slate-900 transition-colors">Sign in</Link>
          <Link to="/signup" className="hover:text-slate-900 transition-colors">Sign up</Link>
          <Link to="/dashboard" className="text-slate-900 font-semibold hover:underline">Dashboard</Link>
        </div>
      </div>
    </footer>
  )
}

// ─── Landing Page Main ────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Platforms />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  )
}

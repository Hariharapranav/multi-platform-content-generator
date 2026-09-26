import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { YoutubeIcon, InstagramIcon, LinkedinIcon, XTwitterIcon } from '@/components/ui/brand-icons'
import { cn } from '@/lib/utils'

function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 group">
      <div className="h-6 w-6 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shadow-xs group-hover:scale-105 transition-transform">
        CS
      </div>
      <span className="font-bold text-sm tracking-tight text-slate-900">ContentStudio</span>
    </Link>
  )
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" className="shrink-0">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-slate-800">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}

function PasswordStrengthBar({ value }: { value: string }) {
  const len = value.length
  const hasUpper = /[A-Z]/.test(value)
  const hasNum = /[0-9]/.test(value)
  const score = len === 0 ? 0 : len < 6 ? 1 : len < 10 && (!hasUpper || !hasNum) ? 2 : 3
  const labels = ['', 'Weak', 'Good', 'Strong']
  const colors = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500']
  const textColors = ['', 'text-red-600', 'text-amber-600', 'text-emerald-700']

  return (
    <div className="space-y-0.5 pt-0.5">
      <div className="flex gap-1">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={cn('h-1 flex-1 rounded-full transition-all duration-300', i <= score ? colors[score] : 'bg-slate-200')}
          />
        ))}
      </div>
      {value.length > 0 && (
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-slate-400">Security rating</span>
          <span className={cn('font-semibold', textColors[score])}>{labels[score]}</span>
        </div>
      )}
    </div>
  )
}

export default function SignUp() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }
    if (!agreed) {
      setError('Please accept the Terms to continue.')
      return
    }
    setLoading(true)
    setError('')
    setTimeout(() => navigate('/dashboard'), 650)
  }

  const handleOAuth = () => {
    setLoading(true)
    setTimeout(() => navigate('/dashboard'), 500)
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-50 flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="h-12 shrink-0 border-b border-slate-200/80 bg-white px-6 lg:px-10 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>Already have an account?</span>
          <Link to="/signin" className="font-semibold text-slate-900 hover:underline">
            Sign in
          </Link>
        </div>
      </header>

      {/* Main Dual-Column Container */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Left Column: Sign Up Form */}
        <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-3">
          <div className="max-w-sm w-full mx-auto space-y-3.5">
            <div className="space-y-0.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
              <p className="text-xs text-slate-500">
                Transform articles, audio, and video into high-converting posts.
              </p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleOAuth}
                className="h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
              >
                <GoogleIcon />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={handleOAuth}
                className="h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
              >
                <GithubIcon />
                <span>GitHub</span>
              </button>
            </div>

            <div className="relative my-0.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-slate-50 px-2 text-slate-400">Or with email</span>
              </div>
            </div>

            {error && (
              <div className="p-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="h-9 text-xs border-slate-200 bg-white rounded-lg focus-visible:ring-1 focus-visible:ring-slate-900"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  className="h-9 text-xs border-slate-200 bg-white rounded-lg focus-visible:ring-1 focus-visible:ring-slate-900"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="h-9 text-xs border-slate-200 bg-white rounded-lg pr-9 focus-visible:ring-1 focus-visible:ring-slate-900"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <PasswordStrengthBar value={password} />
              </div>

              <div className="flex items-start gap-1.5 pt-0.5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="h-3.5 w-3.5 mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                />
                <label htmlFor="terms" className="text-[11px] text-slate-500 cursor-pointer leading-tight">
                  I agree to the <a href="#" className="font-semibold text-slate-900 hover:underline">Terms of Service</a> & <a href="#" className="font-semibold text-slate-900 hover:underline">Privacy Policy</a>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-9 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                {loading ? 'Creating account…' : 'Create Free Account'}
                {!loading && <ArrowRight className="h-3 w-3" />}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: SaaS Showcase */}
        <div className="hidden lg:flex lg:col-span-6 border-l border-slate-200 bg-white p-8 xl:p-10 flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Free Plan • No Credit Card Required</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Transform any master content into 4 native platforms.
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                Join founders, creators, and media teams distributing on YouTube, Instagram, LinkedIn, and X without manual rewriting.
              </p>
            </div>

            {/* 4 Platforms Grid Preview */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <span className="text-xs font-bold text-slate-900">Multi-Modal Content Studio</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  Instant Output
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white">
                  <YoutubeIcon className="h-3.5 w-3.5 text-red-600 shrink-0" />
                  <span className="font-semibold text-[11px] text-slate-800 truncate">YouTube Package</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white">
                  <InstagramIcon className="h-3.5 w-3.5 text-pink-600 shrink-0" />
                  <span className="font-semibold text-[11px] text-slate-800 truncate">Instagram Reel</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white">
                  <LinkedinIcon className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                  <span className="font-semibold text-[11px] text-slate-800 truncate">LinkedIn Post</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white">
                  <XTwitterIcon className="h-3.5 w-3.5 text-slate-900 shrink-0" />
                  <span className="font-semibold text-[11px] text-slate-800 truncate">X Viral Thread</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              {[
                'Full audio/video speech transcription (MP4, MP3, WAV, MOV)',
                'Structured Content DNA extraction: topic, tone, audience, hooks',
                'Local persistent storage with 1-click restore',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <p className="text-[11px] text-slate-500 italic">
              "The Content DNA matches our exact thesis every time without generic AI fluff."
            </p>
            <div className="text-[10px] font-semibold text-slate-700 mt-0.5">
              Founder, 50,000 Active Users AI Tool
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-9 shrink-0 border-t border-slate-200/80 bg-white px-6 flex items-center justify-between text-[11px] text-slate-400">
        <div>© 2026 ContentStudio Inc.</div>
        <div className="flex gap-4">
          <Link to="/" className="hover:text-slate-700">Home</Link>
          <Link to="/dashboard" className="hover:text-slate-700">Dashboard</Link>
        </div>
      </footer>
    </div>
  )
}

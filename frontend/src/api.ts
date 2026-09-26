import type { AnalyzeResponse, Platform } from '@/types'

const DEFAULT_BACKEND = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
  ? 'https://backend-delta-ten-11.vercel.app'
  : 'http://localhost:8000'

const BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_BACKEND

export async function analyzeContent(content: string): Promise<AnalyzeResponse> {
  const res = await fetch(`${BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function regeneratePlatform(
  platform: Platform,
  content_dna: object,
  instructions?: string
): Promise<{ output: Record<string, unknown> }> {
  const res = await fetch(`${BASE_URL}/api/regenerate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform, content_dna, instructions }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function transcribeFile(
  file: File
): Promise<{ transcript: string; word_count: number; processing_time_ms: number; filename: string }> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE_URL}/api/transcribe`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function transcribeUrl(
  url: string
): Promise<{ transcript: string; word_count: number; processing_time_ms: number; title: string; source: string }> {
  const res = await fetch(`${BASE_URL}/api/transcribe-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function checkHealth(): Promise<{ status: string; provider: string }> {
  const res = await fetch(`${BASE_URL}/health`)
  return res.json()
}

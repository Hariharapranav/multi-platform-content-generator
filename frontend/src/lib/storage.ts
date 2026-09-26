import type { AnalyzeResponse } from '@/types'

export interface SavedRepurpose {
  id: string
  createdAt: number
  topic: string
  summary: string
  wordCount: number
  processingTimeMs: number
  response: AnalyzeResponse
  originalContent: string
}

const STORAGE_KEY = 'cs_saved_repurposes_v1'

export function getSavedRepurposes(): SavedRepurpose[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('Failed to load saved repurposes from localStorage', e)
    return []
  }
}

export function saveRepurpose(item: Omit<SavedRepurpose, 'id' | 'createdAt'>): SavedRepurpose {
  const all = getSavedRepurposes()
  const newItem: SavedRepurpose = {
    ...item,
    id: `rep_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
  }

  // Prepend and limit to latest 30 items
  const updated = [newItem, ...all.filter(existing => existing.topic !== newItem.topic)].slice(0, 30)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (e) {
    console.error('Failed to save repurpose to localStorage', e)
  }
  return newItem
}

export function deleteSavedRepurpose(id: string): SavedRepurpose[] {
  const all = getSavedRepurposes().filter(item => item.id !== id)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch (e) {
    console.error('Failed to delete repurpose from localStorage', e)
  }
  return all
}

export function clearAllSavedRepurposes(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('Failed to clear saved repurposes', e)
  }
}

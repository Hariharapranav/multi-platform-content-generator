// ─── Types ────────────────────────────────────────────────────────────────────

export interface QualityScore {
  relevance: number;
  consistency: number;
  platform_fit: number;
  overall: number;
  notes: string;
}

export interface ContentDNA {
  topic: string;
  summary: string;
  tone: string;
  audience: string;
  key_points: string[];
  key_moments: string[];
  emotions: string[];
  hooks: string[];
  keywords: string[];
}

export interface YouTubeOutput {
  title: string;
  description: string;
  tags: string[];
  quality: QualityScore;
}

export interface InstagramOutput {
  hook: string;
  caption: string;
  hashtags: string[];
  quality: QualityScore;
}

export interface LinkedInOutput {
  hook: string;
  post: string;
  hashtags: string[];
  quality: QualityScore;
}

export interface TwitterOutput {
  post: string;
  thread: string[];
  quality: QualityScore;
}

export interface PlatformOutputs {
  youtube: YouTubeOutput;
  instagram: InstagramOutput;
  linkedin: LinkedInOutput;
  twitter: TwitterOutput;
}

export interface AnalyzeResponse {
  content_dna: ContentDNA;
  platforms: PlatformOutputs;
  word_count: number;
  processing_time_ms: number;
}

export type Platform = 'youtube' | 'instagram' | 'linkedin' | 'twitter';

export interface AppState {
  stage: 'idle' | 'analyzing' | 'done' | 'error';
  content: string;
  response: AnalyzeResponse | null;
  error: string | null;
  activePlatform: Platform;
  regenerating: Platform | null;
}

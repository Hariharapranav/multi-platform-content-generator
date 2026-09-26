from pydantic import BaseModel, Field
from typing import Optional


# ─── Request Models ───────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    content: str = Field(..., min_length=20, description="Raw text/transcript to analyze")


class TranscribeUrlRequest(BaseModel):
    url: str = Field(..., min_length=5, description="Video, audio, or YouTube URL to transcribe")


class RegenerateRequest(BaseModel):
    platform: str = Field(..., description="Platform to regenerate: youtube|instagram|linkedin|twitter")
    content_dna: dict = Field(..., description="Existing Content DNA to regenerate from")
    instructions: Optional[str] = Field(None, description="Optional custom instructions")


# ─── Content DNA ──────────────────────────────────────────────────────────────

class ContentDNA(BaseModel):
    topic: str
    summary: str
    tone: str
    audience: str
    key_points: list[str]
    key_moments: list[str]
    emotions: list[str]
    hooks: list[str]
    keywords: list[str]


# ─── Platform Outputs ─────────────────────────────────────────────────────────

class QualityScore(BaseModel):
    relevance: int = Field(..., ge=0, le=100)
    consistency: int = Field(..., ge=0, le=100)
    platform_fit: int = Field(..., ge=0, le=100)
    overall: int = Field(..., ge=0, le=100)
    notes: str


class YouTubeOutput(BaseModel):
    title: str
    description: str
    tags: list[str]
    quality: QualityScore


class InstagramOutput(BaseModel):
    caption: str
    hook: str
    hashtags: list[str]
    quality: QualityScore


class LinkedInOutput(BaseModel):
    post: str
    hook: str
    hashtags: list[str]
    quality: QualityScore


class TwitterOutput(BaseModel):
    post: str
    thread: list[str]
    quality: QualityScore


class PlatformOutputs(BaseModel):
    youtube: YouTubeOutput
    instagram: InstagramOutput
    linkedin: LinkedInOutput
    twitter: TwitterOutput


# ─── Full Analysis Response ────────────────────────────────────────────────────

class AnalyzeResponse(BaseModel):
    content_dna: ContentDNA
    platforms: PlatformOutputs
    word_count: int
    processing_time_ms: int


class RegenerateResponse(BaseModel):
    platform: str
    output: dict
    processing_time_ms: int

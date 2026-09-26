"""
FastAPI Backend — AI Content Studio
"""
from fastapi import applications
import logging
import os
import tempfile
import time
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
# Reload trigger for ai_service updates
ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(ENV_PATH, override=True)


from models import AnalyzeRequest, AnalyzeResponse, RegenerateRequest, RegenerateResponse, TranscribeUrlRequest
from ai_service import analyze_content_dna, generate_all_platforms, regenerate_platform
from transcription import transcribe_file, transcribe_from_url, SUPPORTED_AUDIO, SUPPORTED_VIDEO

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)

# ─── App Setup ────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 AI Content Studio backend starting up...")
    logger.info(f"   AI Provider: {os.getenv('AI_PROVIDER', 'gemini')}")
    yield
    logger.info("🛑 Backend shutting down")


app = FastAPI(
    title="AI Content Studio API",
    description="Transform any content into platform-specific posts using AI",
    version="1.0.0",
    lifespan=lifespan,
)

raw_origins = os.getenv("FRONTEND_URL", "*")
if raw_origins.strip() == "*":
    cors_origins = ["*"]
    allow_creds = False
else:
    cors_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
    for default_origin in [
        "https://multicontent-studio.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173"
    ]:
        if default_origin not in cors_origins:
            cors_origins.append(default_origin)
    allow_creds = True


app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=allow_creds,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ─── Health Check ─────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "provider": os.getenv("AI_PROVIDER", "gemini"),
        "version": "1.0.0",
    }


# ─── Main Analysis Endpoint ───────────────────────────────────────────────────

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    """
    Full pipeline: Content → Content DNA → Platform Outputs
    Returns everything in one shot for the dashboard.
    """
    start = time.time()
    content = request.content.strip()

    if len(content) < 20:
        raise HTTPException(status_code=400, detail="Content too short. Please provide at least 20 characters.")

    logger.info(f"Analyzing content ({len(content)} chars)...")

    try:
        # Step 1: Extract Content DNA
        logger.info("Step 1/2: Extracting Content DNA...")
        content_dna = analyze_content_dna(content)

        # Step 2: Generate all platform outputs
        logger.info("Step 2/2: Generating platform content...")
        platforms = generate_all_platforms(content_dna, content)

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.exception(f"Unexpected error during analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"AI processing failed: {str(e)}. Check your API key and try again."
        )

    elapsed_ms = int((time.time() - start) * 1000)
    logger.info(f"✅ Analysis complete in {elapsed_ms}ms")

    return AnalyzeResponse(
        content_dna=content_dna,
        platforms=platforms,
        word_count=len(content.split()),
        processing_time_ms=elapsed_ms,
    )


# ─── Regenerate Single Platform ───────────────────────────────────────────────

@app.post("/api/regenerate", response_model=RegenerateResponse)
async def regenerate(request: RegenerateRequest):
    """
    Regenerate content for a single platform using existing Content DNA.
    Optionally accepts custom instructions.
    """
    start = time.time()
    platform = request.platform.lower()
    valid_platforms = ["youtube", "instagram", "linkedin", "twitter"]

    if platform not in valid_platforms:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid platform '{platform}'. Must be one of: {valid_platforms}"
        )

    logger.info(f"Regenerating {platform} content...")

    try:
        output = regenerate_platform(platform, request.content_dna, request.instructions)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.exception(f"Regeneration failed for {platform}: {e}")
        raise HTTPException(status_code=500, detail=f"Regeneration failed: {str(e)}")

    elapsed_ms = int((time.time() - start) * 1000)
    logger.info(f"✅ Regenerated {platform} in {elapsed_ms}ms")

    return RegenerateResponse(
        platform=platform,
        output=output,
        processing_time_ms=elapsed_ms,
    )


# ─── Transcribe Audio/Video ──────────────────────────────────────────────────

MAX_FILE_MB = 25
SUPPORTED_EXTENSIONS = SUPPORTED_AUDIO | SUPPORTED_VIDEO

@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...)):
    """
    Accepts an audio or video file, returns plain-text transcript.
    Supports: mp3, wav, m4a, ogg, flac, mp4, mov, webm, avi, mkv
    """
    import os
    filename = file.filename or "upload"
    ext = os.path.splitext(filename.lower())[1]

    if ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Supported: {', '.join(sorted(SUPPORTED_EXTENSIONS))}"
        )

    # Read & check size
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_FILE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb:.1f} MB). Maximum allowed: {MAX_FILE_MB} MB."
        )

    logger.info(f"Transcribing: {filename} ({size_mb:.1f} MB)")
    start = time.time()

    # Write to temp file
    with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        transcript = transcribe_file(tmp_path, filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception(f"Transcription error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {str(e)}. Check your API key."
        )
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass

    elapsed_ms = int((time.time() - start) * 1000)
    logger.info(f"✅ Transcribed in {elapsed_ms}ms, {len(transcript.split())} words")

    return {
        "transcript": transcript,
        "word_count": len(transcript.split()),
        "processing_time_ms": elapsed_ms,
        "filename": filename,
    }


# ─── Transcribe URL (YouTube / Video / Audio) ─────────────────────────────────

@app.post("/api/transcribe-url")
async def transcribe_url(request: TranscribeUrlRequest):
    """
    Accepts a video or audio URL (e.g. YouTube, direct media link),
    extracts transcript/captions, and returns plain-text transcript.
    """
    start = time.time()
    url = request.url.strip()

    if not url.startswith(("http://", "https://")):
        raise HTTPException(
            status_code=400,
            detail="Invalid URL. Please provide a full link starting with https:// or http://"
        )

    logger.info(f"Transcribing from URL: {url}")

    try:
        result = transcribe_from_url(url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception(f"URL transcription error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"URL transcription failed: {str(e)}"
        )

    elapsed_ms = int((time.time() - start) * 1000)
    logger.info(f"✅ URL transcribed in {elapsed_ms}ms, {result.get('word_count', 0)} words")

    return {
        "transcript": result["transcript"],
        "word_count": result.get("word_count", len(result["transcript"].split())),
        "processing_time_ms": elapsed_ms,
        "title": result.get("title", url),
        "source": result.get("source", "url"),
    }


# ─── Run ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

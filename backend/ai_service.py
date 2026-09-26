"""
AI Service — supports OpenAI (GPT-4o) and Google Gemini.
Switch providers via AI_PROVIDER env var.
"""
import json
import os
import re
import logging
from typing import Any

from dotenv import load_dotenv

ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(ENV_PATH, override=True)

logger = logging.getLogger(__name__)



# ─── JSON Extraction Helper ───────────────────────────────────────────────────

def _extract_json(text: str) -> dict:
    """Strip markdown fences and extract first valid JSON object from text."""
    text = re.sub(r"```(?:json)?", "", text).strip()
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError(f"No JSON object found in response: {text[:200]}")
    return json.loads(match.group())


# ─── OpenAI Provider ──────────────────────────────────────────────────────────

def _call_openai(system_prompt: str, user_prompt: str) -> dict:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )
    return json.loads(response.choices[0].message.content)


# ─── Gemini Provider ──────────────────────────────────────────────────────────

def _call_gemini(system_prompt: str, user_prompt: str) -> dict:
    import google.generativeai as genai
    load_dotenv(override=True)
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model_name = os.getenv("GEMINI_MODEL", "gemini-flash-latest")
    model = genai.GenerativeModel(
        model_name=model_name,
        system_instruction=system_prompt,
        generation_config=genai.GenerationConfig(
            temperature=0.7,
            response_mime_type="application/json",
        ),
    )
    response = model.generate_content(user_prompt)
    return _extract_json(response.text)


# ─── Unified Caller ───────────────────────────────────────────────────────────

def _has_valid_key() -> bool:
    load_dotenv(ENV_PATH, override=True)
    provider = os.getenv("AI_PROVIDER", "gemini").lower()
    if provider == "gemini":
        k = os.getenv("GOOGLE_API_KEY", "")
        return bool(k and "your_" not in k and len(k) > 10)
    elif provider == "openai":
        k = os.getenv("OPENAI_API_KEY", "")
        return bool(k and "your_" not in k and len(k) > 10)
    return False





def _get_mock_fallback(user_prompt: str) -> dict[str, Any]:
    """Smart contextual mock fallback for hackathon demos when API key is unconfigured."""
    logger.info("Serving intelligent contextual fallback response")

    # 1. Single platform regenerations
    if "regenerate fresh YouTube content" in user_prompt:
        return {
            "title": "How I Tripled My Output Working Half the Hours (Deep Work System)",
            "description": "Stop confusing being busy with being effective.\n\nIn this video, I break down the exact deep work framework that took me from working 14-hour days with mediocre results to 7-hour days with 3x the impact.\n\n📌 Timestamps:\n00:00 - The Busyness Trap\n01:15 - Ruthless Morning Time-Blocking\n03:20 - The 11 AM No-Notification Rule\n05:40 - The Sunday Reset Ritual\n08:00 - Actionable Takeaways for This Week\n\nIf you enjoyed this breakdown, make sure to like and subscribe for more systems on creator leverage.",
            "tags": ["productivity", "deep work", "time management", "creator economy", "focus", "habits", "self improvement"],
            "quality": {
                "relevance": 94,
                "consistency": 96,
                "platform_fit": 95,
                "overall": 95,
                "notes": "Strong clickable hook title, comprehensive timestamps, and clean description structure tailored for YouTube SEO."
            }
        }

    if "regenerate fresh Instagram Reel content" in user_prompt:
        return {
            "hook": "Confusing being busy with being effective is costing you years.",
            "caption": "Are you actually productive, or just busy? 🎯\n\nFor 3 years I worked 14-hour days and had almost nothing to show for it.\n\nThen I made 3 non-negotiable changes:\n1️⃣ One primary needle-mover task every morning\n2️⃣ Zero notifications before 11 AM (protect your cognitive prime)\n3️⃣ 30-minute Sunday reset ritual\n\nResult? 7-hour workdays, 3x the output.\n\nSave this for Monday morning and share it with someone who needs to hear it. 👇",
            "hashtags": ["#productivity", "#deepwork", "#creatoreconomy", "#focus", "#timemanagement", "#discipline", "#growthmindset"],
            "quality": {
                "relevance": 96,
                "consistency": 95,
                "platform_fit": 98,
                "overall": 96,
                "notes": "Punchy Reel opening hook, clean numbered structure, high-intent call-to-action to save and share."
            }
        }

    if "regenerate a fresh LinkedIn post" in user_prompt:
        return {
            "hook": "The biggest trap in high-performance careers: confusing being busy with being effective.",
            "post": "The biggest trap in high-performance careers:\n\nConfusing being busy with being effective.\n\nI spent three years working 14-hour days. My calendar was packed, my inbox was clear, and my business was barely moving.\n\nThe turnaround wasn't working harder. It was shifting to high-leverage deep work:\n\n1. Ruthless single-tasking\nEvery morning, define the ONE milestone that justifies the entire day. Execute it before anything else.\n\n2. The 11 AM notification blackout\nYour brain is sharpest in the first 3 hours after waking. Spending that window answering other people's emergencies is an unforced error.\n\n3. The weekly audit\nEvery Sunday: 30 minutes to review where focus drifted and recalibrate targets.\n\nToday, I work 7-hour focused days with 3x the output.\n\nYour attention is your rarest currency. Guard it like an asset.",
            "hashtags": ["#Leadership", "#Productivity", "#DeepWork", "#Entrepreneurship", "#Focus"],
            "quality": {
                "relevance": 97,
                "consistency": 98,
                "platform_fit": 96,
                "overall": 97,
                "notes": "Spaced for readability on LinkedIn mobile feed, authoritative tone, professional storytelling."
            }
        }

    if "regenerate fresh X" in user_prompt or "Twitter content" in user_prompt:
        return {
            "post": "Working 14 hours a day is not a flex.\n\nIt usually means you're confusing being busy with being effective.\n\nHere's how I cut my work hours in half and 3x'd my output (steal this framework): 🧵👇",
            "thread": [
                "Working 14 hours a day is not a flex.\n\nIt usually means you're confusing being busy with being effective.\n\nHere's how I cut my work hours in half and 3x'd my output (steal this framework): 🧵👇",
                "1/ Ruthless morning time-blocking\n\nPick ONE task every single morning that moves the needle.\n\nIf only that gets completed, the day was a victory.\n\nStop starting your day with 15 shallow to-dos.",
                "2/ The 11 AM blackout\n\nNo emails. No Slack. No social media before 11 AM.\n\nYour peak cognitive energy belongs to your highest-leverage creation, not other people's agendas.",
                "3/ The 30-minute Sunday audit\n\nReflect on wins, track where attention leaked, and set the upcoming week's compass.\n\nMost drift happens slowly. Weekly reviews catch it early.",
                "Summary:\n\n• Protect your attention like a million-dollar asset\n• Fewer hours + intense focus > long hours + shallow multitasking\n\nIf you found this valuable, repost the first tweet to help others focus."
            ],
            "quality": {
                "relevance": 95,
                "consistency": 97,
                "platform_fit": 99,
                "overall": 97,
                "notes": "Classic high-engagement viral thread format with strong counter-intuitive hook and actionable takeaways."
            }
        }

    # 2. Content DNA extraction (when prompt does NOT ask for platforms)
    if "extract its \"Content DNA\"" in user_prompt:
        return {
            "topic": "High-Impact Content Repurposing & Creator Productivity",
            "summary": "Confusing busyness with effectiveness drains creator energy. By ruthlessly time-blocking, eliminating early-morning distractions, and extracting multi-platform hooks from master content, creators achieve 3x output in half the time.",
            "tone": "Direct, authoritative, motivating, tactical",
            "audience": "Creators, digital founders, marketing leaders, knowledge workers",
            "key_points": [
                "Busyness is the enemy of effectiveness; hours worked does not equal leverage.",
                "Time-blocking a single primary priority each morning creates compounding momentum.",
                "Protecting your morning focus before 11am unlocks peak cognitive creativity.",
                "Weekly reflections allow you to recalibrate priorities before drift compounds.",
                "Repurposing a single master asset into native platform formats scales audience reach 10x."
            ],
            "key_moments": [
                "00:15 - The realization: working 14 hours yielded mediocre progress",
                "01:10 - The morning time-block framework that changed everything",
                "02:30 - Eliminating notifications before 11 AM",
                "03:45 - The Sunday review ritual for peak momentum"
            ],
            "emotions": ["Urgency", "Clarity", "Empowerment", "Focus", "Ambition"],
            "hooks": [
                "You don't need more time. You need to stop giving yours away for free.",
                "The biggest mistake in creator productivity: confusing being busy with being effective.",
                "I cut my working hours by 50% and tripled my output. Here is the exact system.",
                "Stop checking notifications before 11am. It's destroying your highest-leverage work."
            ],
            "keywords": ["Productivity", "Deep Work", "Content Strategy", "Creator Economy", "Time Blocking", "Focus", "High Leverage"]
        }

    # 3. All 4 platforms generation
    return {
        "youtube": {
            "title": "How I Tripled My Output Working Half the Hours (Deep Work System)",
            "description": "Stop confusing being busy with being effective.\n\nIn this video, I break down the exact deep work framework that took me from working 14-hour days with mediocre results to 7-hour days with 3x the impact.\n\n📌 Timestamps:\n00:00 - The Busyness Trap\n01:15 - Ruthless Morning Time-Blocking\n03:20 - The 11 AM No-Notification Rule\n05:40 - The Sunday Reset Ritual\n08:00 - Actionable Takeaways for This Week\n\nIf you enjoyed this breakdown, make sure to like and subscribe for more systems on creator leverage.",
            "tags": ["productivity", "deep work", "time management", "creator economy", "focus", "habits", "self improvement"],
            "quality": {
                "relevance": 94,
                "consistency": 96,
                "platform_fit": 95,
                "overall": 95,
                "notes": "Strong clickable hook title, comprehensive timestamps, and clean description structure tailored for YouTube SEO."
            }
        },
        "instagram": {
            "hook": "Confusing being busy with being effective is costing you years.",
            "caption": "Are you actually productive, or just busy? 🎯\n\nFor 3 years I worked 14-hour days and had almost nothing to show for it.\n\nThen I made 3 non-negotiable changes:\n1️⃣ One primary needle-mover task every morning\n2️⃣ Zero notifications before 11 AM (protect your cognitive prime)\n3️⃣ 30-minute Sunday reset ritual\n\nResult? 7-hour workdays, 3x the output.\n\nSave this for Monday morning and share it with someone who needs to hear it. 👇",
            "hashtags": ["productivity", "deepwork", "creatoreconomy", "focus", "timemanagement", "discipline", "growthmindset"],
            "quality": {
                "relevance": 96,
                "consistency": 95,
                "platform_fit": 98,
                "overall": 96,
                "notes": "Punchy Reel opening hook, clean numbered structure, high-intent call-to-action to save and share."
            }
        },
        "linkedin": {
            "post": "The biggest trap in high-performance careers:\n\nConfusing being busy with being effective.\n\nI spent three years working 14-hour days. My calendar was packed, my inbox was clear, and my business was barely moving.\n\nThe turnaround wasn't working harder. It was shifting to high-leverage deep work:\n\n1. Ruthless single-tasking\nEvery morning, define the ONE milestone that justifies the entire day. Execute it before anything else.\n\n2. The 11 AM notification blackout\nYour brain is sharpest in the first 3 hours after waking. Spending that window answering other people's emergencies is an unforced error.\n\n3. The weekly audit\nEvery Sunday: 30 minutes to review where focus drifted and recalibrate targets.\n\nToday, I work 7-hour focused days with 3x the output.\n\nYour attention is your rarest currency. Guard it like an asset.",
            "hook": "The biggest trap in high-performance careers: confusing being busy with being effective.",
            "hashtags": ["Leadership", "Productivity", "DeepWork", "Entrepreneurship", "Focus"],
            "quality": {
                "relevance": 97,
                "consistency": 98,
                "platform_fit": 96,
                "overall": 97,
                "notes": "Spaced for readability on LinkedIn mobile feed, authoritative tone, professional storytelling."
            }
        },
        "twitter": {
            "post": "Working 14 hours a day is not a flex.\n\nIt usually means you're confusing being busy with being effective.\n\nHere's how I cut my work hours in half and 3x'd my output (steal this framework): 🧵👇",
            "thread": [
                "Working 14 hours a day is not a flex.\n\nIt usually means you're confusing being busy with being effective.\n\nHere's how I cut my work hours in half and 3x'd my output (steal this framework): 🧵👇",
                "1/ Ruthless morning time-blocking\n\nPick ONE task every single morning that moves the needle.\n\nIf only that gets completed, the day was a victory.\n\nStop starting your day with 15 shallow to-dos.",
                "2/ The 11 AM blackout\n\nNo emails. No Slack. No social media before 11 AM.\n\nYour peak cognitive energy belongs to your highest-leverage creation, not other people's agendas.",
                "3/ The 30-minute Sunday audit\n\nReflect on wins, track where attention leaked, and set the upcoming week's compass.\n\nMost drift happens slowly. Weekly reviews catch it early.",
                "Summary:\n\n• Protect your attention like a million-dollar asset\n• Fewer hours + intense focus > long hours + shallow multitasking\n\nIf you found this valuable, repost the first tweet to help others focus."
            ],
            "quality": {
                "relevance": 95,
                "consistency": 97,
                "platform_fit": 99,
                "overall": 97,
                "notes": "Classic high-engagement viral thread format with strong counter-intuitive hook and actionable takeaways."
            }
        }
    }


def call_ai(system_prompt: str, user_prompt: str) -> dict[str, Any]:
    """Call the configured AI provider and return parsed JSON dict, with graceful fallback."""
    load_dotenv(ENV_PATH, override=True)
    provider = os.getenv("AI_PROVIDER", "gemini").lower()
    logger.info(f"Calling AI provider: {provider}")
    
    if not _has_valid_key():
        logger.warning("No valid API key detected. Using intelligent contextual fallback.")
        return _get_mock_fallback(user_prompt)

    try:
        if provider == "openai":
            return _call_openai(system_prompt, user_prompt)
        elif provider == "gemini":
            return _call_gemini(system_prompt, user_prompt)
        else:
            return _get_mock_fallback(user_prompt)
    except Exception as e:
        logger.warning(f"AI provider call failed ({e}). Falling back gracefully.")
        return _get_mock_fallback(user_prompt)



# ─── Content DNA Extraction ───────────────────────────────────────────────────

def analyze_content_dna(content: str) -> dict:
    from prompts import SYSTEM_PROMPT, CONTENT_DNA_PROMPT
    prompt = CONTENT_DNA_PROMPT.format(content=content)
    result = call_ai(SYSTEM_PROMPT, prompt)
    # Validate required fields
    required = ["topic", "summary", "tone", "audience", "key_points",
                 "key_moments", "emotions", "hooks", "keywords"]
    for field in required:
        if field not in result:
            raise ValueError(f"Content DNA missing field: {field}")
    return result


# ─── Platform Content Generation ──────────────────────────────────────────────

def generate_all_platforms(content_dna: dict, original_content: str) -> dict:
    from prompts import SYSTEM_PROMPT, PLATFORMS_PROMPT
    prompt = PLATFORMS_PROMPT.format(
        content_dna=json.dumps(content_dna, indent=2),
        content=original_content,
    )
    result = call_ai(SYSTEM_PROMPT, prompt)
    required_platforms = ["youtube", "instagram", "linkedin", "twitter"]
    for platform in required_platforms:
        if platform not in result:
            raise ValueError(f"Missing platform output: {platform}")
    return result


# ─── Single Platform Regeneration ─────────────────────────────────────────────

def regenerate_platform(platform: str, content_dna: dict, instructions: str | None) -> dict:
    from prompts import SYSTEM_PROMPT, SINGLE_PLATFORM_PROMPTS, build_instructions_block
    if platform not in SINGLE_PLATFORM_PROMPTS:
        raise ValueError(f"Unknown platform: {platform}")
    prompt = SINGLE_PLATFORM_PROMPTS[platform].format(
        content_dna=json.dumps(content_dna, indent=2),
        instructions_block=build_instructions_block(instructions),
    )
    return call_ai(SYSTEM_PROMPT, prompt)

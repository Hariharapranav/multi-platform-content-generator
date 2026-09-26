"""
Modular, easy-to-modify prompts for AI Content Studio.
Edit these to tune output quality per platform.
"""

# ─── System Prompt ────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are an expert content strategist and social media specialist with deep knowledge of 
platform-specific content creation. You analyze raw content (articles, transcripts, video scripts) 
and transform them into optimized, platform-native content. 

You always respond with valid, complete JSON matching the exact schema provided.
You never truncate or skip fields. You write content that is authentic, engaging, and platform-appropriate."""


# ─── Content DNA Analysis Prompt ─────────────────────────────────────────────

CONTENT_DNA_PROMPT = """Analyze the following content and extract its "Content DNA" — the core essence needed 
to create platform-specific content.

CONTENT:
{content}

Return ONLY valid JSON matching this exact schema:
{{
  "topic": "one-line topic description",
  "summary": "2-3 sentence summary of the content",
  "tone": "tone descriptor (e.g., educational, inspirational, conversational, professional)",
  "audience": "target audience description",
  "key_points": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "key_moments": ["memorable moment or quote 1", "memorable moment or quote 2", "memorable moment or quote 3"],
  "emotions": ["emotion1", "emotion2", "emotion3"],
  "hooks": ["attention-grabbing hook 1", "attention-grabbing hook 2", "attention-grabbing hook 3"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"]
}}

Requirements:
- key_points: 4-6 most important takeaways
- key_moments: 2-4 most quotable or memorable moments
- emotions: 2-4 primary emotions the content evokes
- hooks: 3 different hook styles (question, statement, statistic)
- keywords: 6-10 SEO-relevant keywords
"""


# ─── Platform Generation Prompt ───────────────────────────────────────────────

PLATFORMS_PROMPT = """Using this Content DNA, generate platform-optimized content for YouTube, Instagram, LinkedIn, and X (Twitter).

CONTENT DNA:
{content_dna}

ORIGINAL CONTENT (for reference):
{content}

Return ONLY valid JSON matching this EXACT schema:
{{
  "youtube": {{
    "title": "SEO-optimized YouTube title (50-60 chars, compelling, keyword-rich)",
    "description": "Full YouTube description (150-300 words) with timestamps placeholder, links section, and call-to-action. Include 2-3 paragraphs.",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
    "quality": {{
      "relevance": 85,
      "consistency": 90,
      "platform_fit": 88,
      "overall": 88,
      "notes": "Brief quality assessment note"
    }}
  }},
  "instagram": {{
    "hook": "First line/hook (under 125 chars, stops the scroll)",
    "caption": "Full Instagram caption (150-220 words) with storytelling, value, and CTA. Use line breaks for readability.",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8", "hashtag9", "hashtag10", "hashtag11", "hashtag12", "hashtag13", "hashtag14", "hashtag15"],
    "quality": {{
      "relevance": 85,
      "consistency": 90,
      "platform_fit": 88,
      "overall": 88,
      "notes": "Brief quality assessment note"
    }}
  }},
  "linkedin": {{
    "hook": "First line that makes people click 'see more' (under 150 chars)",
    "post": "Full LinkedIn post (200-300 words) — professional tone, structured with spacing, ends with question or CTA. Avoid corporate jargon.",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
    "quality": {{
      "relevance": 85,
      "consistency": 90,
      "platform_fit": 88,
      "overall": 88,
      "notes": "Brief quality assessment note"
    }}
  }},
  "twitter": {{
    "post": "Single tweet (under 280 chars) — punchy, shareable, uses a hook from Content DNA",
    "thread": [
      "Tweet 1 of thread — hook tweet that sets up the thread (under 280 chars)",
      "Tweet 2 — first key point with context (under 280 chars)",
      "Tweet 3 — second key point (under 280 chars)",
      "Tweet 4 — third key point or insight (under 280 chars)",
      "Tweet 5 — CTA or key takeaway (under 280 chars)"
    ],
    "quality": {{
      "relevance": 85,
      "consistency": 90,
      "platform_fit": 88,
      "overall": 88,
      "notes": "Brief quality assessment note"
    }}
  }}
}}

Platform guidelines:
- YouTube: Focus on searchability, retention, and channel growth
- Instagram: Emotional connection, visual storytelling, community hashtags
- LinkedIn: Professional value, thought leadership, network engagement  
- X/Twitter: Concise, punchy, conversation-starting, shareable
"""


# ─── Single Platform Regeneration Prompt ─────────────────────────────────────

SINGLE_PLATFORM_PROMPTS = {
    "youtube": """Using this Content DNA, regenerate fresh YouTube content. Make it different from the previous version.
{instructions_block}

CONTENT DNA:
{content_dna}

Return ONLY valid JSON:
{{
  "title": "SEO-optimized YouTube title (50-60 chars)",
  "description": "Full YouTube description (150-300 words) with paragraphs and CTA",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
  "quality": {{
    "relevance": 85,
    "consistency": 90,
    "platform_fit": 88,
    "overall": 88,
    "notes": "Assessment note"
  }}
}}""",

    "instagram": """Using this Content DNA, regenerate fresh Instagram Reel content. Make it different and more engaging.
{instructions_block}

CONTENT DNA:
{content_dna}

Return ONLY valid JSON:
{{
  "hook": "Scroll-stopping first line (under 125 chars)",
  "caption": "Full caption (150-220 words) with storytelling and CTA",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8", "hashtag9", "hashtag10", "hashtag11", "hashtag12", "hashtag13", "hashtag14", "hashtag15"],
  "quality": {{
    "relevance": 85,
    "consistency": 90,
    "platform_fit": 88,
    "overall": 88,
    "notes": "Assessment note"
  }}
}}""",

    "linkedin": """Using this Content DNA, regenerate a fresh LinkedIn post. More professional and thought-provoking.
{instructions_block}

CONTENT DNA:
{content_dna}

Return ONLY valid JSON:
{{
  "hook": "Click 'see more' hook line (under 150 chars)",
  "post": "Full post (200-300 words) — professional, structured, with CTA",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "quality": {{
    "relevance": 85,
    "consistency": 90,
    "platform_fit": 88,
    "overall": 88,
    "notes": "Assessment note"
  }}
}}""",

    "twitter": """Using this Content DNA, regenerate fresh X/Twitter content. Punchier and more shareable.
{instructions_block}

CONTENT DNA:
{content_dna}

Return ONLY valid JSON:
{{
  "post": "Single tweet (under 280 chars)",
  "thread": [
    "Tweet 1 — hook (under 280 chars)",
    "Tweet 2 — point 1 (under 280 chars)",
    "Tweet 3 — point 2 (under 280 chars)",
    "Tweet 4 — point 3 (under 280 chars)",
    "Tweet 5 — CTA (under 280 chars)"
  ],
  "quality": {{
    "relevance": 85,
    "consistency": 90,
    "platform_fit": 88,
    "overall": 88,
    "notes": "Assessment note"
  }}
}}"""
}


def build_instructions_block(instructions: str | None) -> str:
    if instructions:
        return f"\nCustom instructions: {instructions}\n"
    return ""

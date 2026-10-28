import os
import json
import re
from dotenv import load_dotenv
from groq import Groq

# Load .env from backend or root directory
load_dotenv()
root_env = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
if os.path.exists(root_env):
    load_dotenv(root_env)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
DEFAULT_MODEL = "qwen/qwen3.8-27b"

def get_groq_client():
    if not GROQ_API_KEY:
        return None
    try:
        return Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        print(f"Failed to initialize Groq client: {e}")
        return None

def extract_skills_with_ai(resume_text: str, baseline_skills: list = None) -> list:
    """
    Uses Groq AI to extract and normalize technical & professional skills from resume text,
    combining them with baseline keyword matches.
    """
    if baseline_skills is None:
        baseline_skills = []
    
    # Cap text length to avoid token limits
    truncated_text = resume_text[:6000].strip()
    if not truncated_text:
        return baseline_skills

    client = get_groq_client()
    if not client:
        return baseline_skills

    prompt = (
        "You are an expert AI Resume Parser and ATS Specialist. "
        "Extract all technical skills, programming languages, frameworks, cloud platforms, "
        "databases, developer tools, and key professional competencies from the candidate's resume below.\n\n"
        "Rules:\n"
        "1. Return ONLY a valid JSON array of strings (e.g. [\"Python\", \"React\", \"Docker\", \"SQL\"]).\n"
        "2. Do NOT include markdown code blocks, explanation, or extra text.\n"
        "3. Capitalize properly (e.g. 'JavaScript', 'PostgreSQL', 'AWS', 'TensorFlow').\n"
        "4. Max 30 most relevant skills.\n\n"
        f"Resume Content:\n{truncated_text}"
    )

    try:
        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": "You are a professional ATS parser. Always output strictly valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=600
        )
        content = response.choices[0].message.content.strip()
        # Clean any accidental code block formatting
        content = re.sub(r'^```json\s*', '', content)
        content = re.sub(r'^```\s*', '', content)
        content = re.sub(r'```$', '', content).strip()

        ai_skills = json.loads(content)
        if isinstance(ai_skills, list):
            # Merge and deduplicate preserving order
            merged = []
            seen = set()
            for s in ai_skills + baseline_skills:
                s_clean = str(s).strip()
                s_lower = s_clean.lower()
                if s_clean and s_lower not in seen:
                    seen.add(s_lower)
                    merged.append(s_clean)
            return merged
    except Exception as e:
        print(f"Groq AI skill extraction fallback: {e}")

    return baseline_skills

def analyze_job_fit(user_skills: list, job_title: str, company_name: str, job_description: str, missing_skills: list = None) -> dict:
    """
    Generates an AI Career Coach analysis comparing candidate skills against a specific job posting.
    """
    if missing_skills is None:
        missing_skills = []

    client = get_groq_client()
    if not client:
        return {
            "match_score": 75,
            "summary": f"Your profile shows relevant foundations for {job_title}.",
            "strengths": user_skills[:3] if user_skills else ["Core background"],
            "action_plan": [f"Gain experience in {s}" for s in missing_skills[:3]],
            "interview_tip": "Highlight projects demonstrating your problem-solving capabilities."
        }

    skills_str = ", ".join(user_skills) if user_skills else "General technical skillset"
    missing_str = ", ".join(missing_skills) if missing_skills else "None explicitly detected"
    jd_snippet = job_description[:1500] if job_description else "Standard job requirements"

    prompt = (
        f"You are a top-tier Career Coach and Hiring Specialist.\n"
        f"Candidate Skills: {skills_str}\n"
        f"Target Job: {job_title} at {company_name}\n"
        f"Job Scope: {jd_snippet}\n"
        f"Identified Missing Skills: {missing_str}\n\n"
        "Provide an honest, empowering assessment in strictly valid JSON with these exact keys:\n"
        "{\n"
        "  \"match_score\": <integer 0-100 indicating ATS and skill fit>,\n"
        "  \"summary\": <concise 2-sentence executive summary of candidate suitability>,\n"
        "  \"strengths\": [<array of 2-3 specific competitive advantages the candidate brings>],\n"
        "  \"action_plan\": [<array of 2-3 concrete steps/projects to bridge the missing skills>],\n"
        "  \"interview_tip\": <1 high-impact interview tip tailored to this role>\n"
        "}"
    )

    try:
        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": "You are an elite Career Coach. Always output strictly valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=700
        )
        content = response.choices[0].message.content.strip()
        content = re.sub(r'^```json\s*', '', content)
        content = re.sub(r'^```\s*', '', content)
        content = re.sub(r'```$', '', content).strip()

        data = json.loads(content)
        return data
    except Exception as e:
        print(f"Groq AI job fit analysis error: {e}")
        return {
            "match_score": 75,
            "summary": f"Candidate profile matches the core domain requirements for {job_title}.",
            "strengths": [f"Demonstrated background in {s}" for s in user_skills[:3]],
            "action_plan": [f"Learn {s} via practical projects" for s in missing_skills[:3]],
            "interview_tip": "Prepare to explain your system design and problem-solving methodology."
        }

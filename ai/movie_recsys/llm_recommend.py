import os
import json
from dotenv import load_dotenv

load_dotenv()

from openai import OpenAI
from movie_recsys.recommendation_service import RecommendationService

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def recommend_from_diary(diary_text: str, movies: list, top_n: int = 3) -> dict:
    """
    diary_text: 사용자 일기 텍스트
    movies: 백엔드가 주는 영화 리스트 (list[dict])
    """

    prompt = f"""
아래 일기를 읽고 감정을 1~3개 추출해라.
반드시 JSON 객체 하나만 반환해라.

형식:
{{
  "emotion": [
    {{"label": "슬픔", "intensity": 0.8}}
  ]
}}

일기:
{diary_text}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        response_format={"type": "json_object"},
    )

    content = (response.choices[0].message.content or "").strip()

    print("LLM RAW RESPONSE:", content)  # 🔍 디버깅용

    try:
        data = json.loads(content)
        emotions = data.get("emotion", [])
    except Exception as e:
        print("JSON 파싱 실패:", e)
        emotions = []

    recs = RecommendationService.recommend(
        llm_emotions=emotions,
        movies=movies,
        top_n=top_n,
    )

    return {"emotion": emotions, "recommendations": recs}
"""
AI 공감 피드백 서버 (FastAPI)
- POST /api/diary/empathy: 일기 분석 + 도서/영화 추천
"""

from fastapi import FastAPI
from schema.request import DiaryRequest
from service.empathy_service import EmpathyService
from config import OPENAI_API_KEY

app = FastAPI(
    title="Diary Empathy API",
    description="일기 기반 공감 피드백 및 콘텐츠 추천",
    version="1.0.0"
)

if not OPENAI_API_KEY:
    print("[WARNING] OPENAI_API_KEY not set. Using mock data.")


@app.post("/api/diary/empathy")
def generate_empathy(req: DiaryRequest):
    """일기 텍스트를 분석하여 공감 피드백과 도서/영화 추천 반환"""
    return EmpathyService.run(
        diary_text=req.diary_text,
        request_id=req.request_id
    )
"""
AI 서버의 Entry Point인 main Controller 파일
Spring Boot 백엔드에서 보내온 요청을 가장 먼저 받아서
이상이 없는지 확인하고
Service에게 일을 시키는 역할
"""

from fastapi import FastAPI
from schema.request import DiaryRequest
from service.empathy_service import EmpathyService
from config import OPENAI_API_KEY

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not in set in .env")

app = FastAPI()

# return 값이 (JSON Dict)가 그대로 Spring 서버에 전송됨 
@app.post("/api/diary/empathy")
def generate_empathy(req: DiaryRequest):
    return EmpathyService.run(
        diary_text=req.diary_text,
        request_id=req.request_id
    )
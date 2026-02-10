"""
API로 들어오는 요청 JSON을 자동으로 파싱/검증
"""
from pydantic import BaseModel

class DiaryRequest(BaseModel):
    request_id: str 
    diary_text: str
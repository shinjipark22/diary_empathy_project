from config import MAX_RETRY
from llm.client import generate_empathy_json
from schema.response import EmpathyResponse
from util.retry import retry_call

class EmpathyService:
    @staticmethod
    def run(diary_text: str, request_id: str) -> dict:
        def task():
            data = generate_empathy_json(diary_text, request_id)
            EmpathyResponse(**data) # 스키마 검증
            return data
        
        return retry_call(task, MAX_RETRY)
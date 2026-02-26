from config import MAX_RETRY
from llm.client import generate_empathy_json
from schema.response import EmpathyResponse
from util.retry import retry_call
from service.recommendation_service import get_book_recommendations, get_movie_recommendations

class EmpathyService:
    @staticmethod
    def run(diary_text: str, request_id: str) -> dict:
        def task():
            data = generate_empathy_json(diary_text, request_id)

            # GPT 응답에서 감정, 요약, 재프레이밍 추출
            output = data.get("output", {})
            emotions = output.get("emotion", [])
            summary = output.get("summary", "")
            reframe = output.get("reframe", "")

            # 도서/영화 추천 수행
            book_recs = get_book_recommendations(emotions, summary, reframe, top_k=3)
            movie_recs = get_movie_recommendations(emotions, top_k=3)

            # 추천 결과 주입
            output["book_recommendations"] = book_recs
            output["movie_recommendations"] = movie_recs
            data["output"] = output

            EmpathyResponse(**data)  # 스키마 검증
            return data

        return retry_call(task, MAX_RETRY)
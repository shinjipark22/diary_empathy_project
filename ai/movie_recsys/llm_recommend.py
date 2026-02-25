from ai.feedback.service.empathy_service import generate_empathy_json
from ai.movie_recsys.recommendation_service import RecommendationService
import uuid

def recommend_from_diary(diary_text):

    # 1️⃣ request_id 생성
    request_id = str(uuid.uuid4())

    # 2️⃣ LLM 감정 분석
    result = generate_empathy_json(diary_text, request_id)

    # 에러 처리
    if "error" in result:
        return result

    emotions = result["output"]["emotion"]

    # 3️⃣ 추천
    recommendations = RecommendationService.recommend(emotions, top_n=5)

    return {
        "emotion": emotions,
        "recommendations": recommendations
    }
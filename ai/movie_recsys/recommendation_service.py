from movie_recsys.emotion_normalizer import normalize_emotions


class RecommendationService:

    @staticmethod
    def recommend(llm_emotions, movies, top_n=3):
        """
        llm_emotions: LLM에서 추출한 감정 리스트
        movies: 백엔드 또는 테스트에서 전달받은 영화 리스트
        """

        user_vector = normalize_emotions(llm_emotions)

        # 감정이 없으면 추천 불가
        if not user_vector:
            return []

        # 가장 강한 감정 하나만 사용
        dominant_emotion = max(user_vector, key=user_vector.get)

        scored = []

        for movie in movies:
            score = movie.get(f"emo_{dominant_emotion}", 0)
            scored.append((score, movie))

        # 점수 기준 내림차순 정렬
        scored.sort(reverse=True, key=lambda x: x[0])

        return [
            {
                "id": m["id"],
                "title": m["title"],
                "overview": m["overview"]
            }
            for score, m in scored[:top_n]
        ]
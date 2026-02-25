from movie_recsys.recommendation_service import RecommendationService

fake_emotions = [
    {"label": "슬픔", "intensity": 0.8},
    {"label": "불안", "intensity": 0.3}
]

result = RecommendationService.recommend(fake_emotions, top_n=5)

for movie in result:
    print("🎬", movie["title"])
    print("📖", movie["overview"])
    print("-" * 50)
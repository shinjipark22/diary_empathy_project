from ai.movie_recsys.llm_recommend import recommend_from_diary

diary_text = """
오늘 하루가 너무 힘들었다.
회사에서 실수도 하고, 괜히 내가 부족한 사람처럼 느껴졌다.
괜히 불안하고 마음이 가라앉는다.
"""

result = recommend_from_diary(diary_text)

print("🧠 감정 분석 결과:")
print(result["emotion"])

print("\n🎬 추천 영화:")
for movie in result["recommendations"]:
    print("•", movie["title"])
    print("  ", movie["overview"][:100], "...")
    print()
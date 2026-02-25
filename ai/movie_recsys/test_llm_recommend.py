import os
import pandas as pd

from movie_recsys.llm_recommend import recommend_from_diary


CSV_PATH = os.path.expanduser("~/Desktop/movies_with_overview_final.csv")

if __name__ == "__main__":

    # 1️⃣ CSV 로드
    df = pd.read_csv(CSV_PATH)

    # 2️⃣ dict 리스트로 변환
    movies = df.to_dict(orient="records")

    # 3️⃣ 테스트할 일기 입력
    diary_text =  "내 인생은 어떻게 될까 잘하는 것도 없고 너무 불안한 기분이 든다."

    # 4️⃣ 추천 실행
    result = recommend_from_diary(diary_text, movies, top_n=3)

    # 5️⃣ 출력
    print("\n🎬 추천 영화:")
    for m in result["recommendations"]:
        print("•", m["title"])
        print(" ", m["overview"])
        print("-" * 50)
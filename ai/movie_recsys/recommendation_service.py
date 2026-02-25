import os
import pandas as pd
from ai.movie_recsys.emotion_normalizer import normalize_emotions

class RecommendationService:

    @staticmethod
    def recommend(llm_emotions, top_n=3):

        user_vector = normalize_emotions(llm_emotions)

        df = pd.read_csv(CSV_PATH)

        scores = []

        for _, row in df.iterrows():
            score = 0
            for emo, value in user_vector.items():
                score += value * row[f"emo_{emo}"]

            scores.append(score)

        df["score"] = scores

        result = df.sort_values(by="score", ascending=False).head(top_n)

        return result[["id", "title", "overview"]].to_dict(orient="records")
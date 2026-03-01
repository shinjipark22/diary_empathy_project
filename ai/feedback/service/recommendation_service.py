"""
도서/영화 추천 서비스 연동 모듈
GPT 분석 결과를 받아서 도서/영화 추천 수행
"""

import os
import sys
from pathlib import Path

# 프로젝트 루트 경로 추가
PROJECT_ROOT = Path(__file__).resolve().parents[3]
AI_ROOT = PROJECT_ROOT / "ai"
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(AI_ROOT))

# 도서 추천 관련
BOOK_DATA_DIR = str(PROJECT_ROOT / "ai" / "book_recsys" / "data" / "processed")
BOOK_DATA_PATH = str(PROJECT_ROOT / "ai" / "book_recsys" / "data" / "processed" / "aladin_books_bestseller_cleaned.csv")

# 영화 추천 관련
MOVIE_CSV_PATH = str(PROJECT_ROOT / "ai" / "movie_recsys" / "data" / "movies_with_overview_final.csv")

# 도서 추천 파이프라인 (lazy loading)
_book_pipeline = None

# 영화 데이터 (lazy loading)
_movies = None


def _load_book_pipeline():
    """도서 추천 파이프라인 로드 (한 번만)"""
    global _book_pipeline
    if _book_pipeline is not None:
        return _book_pipeline

    try:
        from book_recsys.src.recommendation.pipeline import RecommendationPipeline
        _book_pipeline = RecommendationPipeline(BOOK_DATA_DIR, BOOK_DATA_PATH)
        print("[INFO] Book recommendation pipeline loaded.")
        return _book_pipeline
    except Exception as e:
        print(f"[WARNING] Failed to load book pipeline: {e}")
        return None


def _load_movies():
    """영화 데이터 로드 (한 번만)"""
    global _movies
    if _movies is not None:
        return _movies

    try:
        import pandas as pd
        if os.path.exists(MOVIE_CSV_PATH):
            df = pd.read_csv(MOVIE_CSV_PATH)
            _movies = df.to_dict(orient="records")
            print(f"[INFO] Loaded {len(_movies)} movies.")
            return _movies
        else:
            print(f"[WARNING] Movie CSV not found: {MOVIE_CSV_PATH}")
            return None
    except Exception as e:
        print(f"[WARNING] Failed to load movies: {e}")
        return None


def get_book_recommendations(emotion_data: list, summary: str, reframe: str = "", top_k: int = 3) -> list:
    """
    도서 추천 수행

    Args:
        emotion_data: [{"label": "불안", "intensity": 0.7}, ...]
        summary: 일기 요약
        reframe: GPT가 생성한 재프레이밍 문장 (검색 쿼리 품질 향상)
        top_k: 추천 개수

    Returns:
        [{"rank": 1, "title": "...", "author": "...", "category": "...", "description": "..."}, ...]
    """
    pipeline = _load_book_pipeline()

    if pipeline is None:
        # 목 데이터 반환
        return [
            {"rank": i+1, "title": f"추천 도서 {i+1}", "author": f"저자 {i+1}", "category": "카테고리", "description": "도서 추천 시스템 로드 실패"}
            for i in range(top_k)
        ]

    try:
        diary_json = {
            "emotion": emotion_data,
            "summary": summary,
            "reframe": reframe
        }
        results = pipeline.recommend(diary_json, top_k=top_k)

        recommendations = []
        for i, book in enumerate(results):
            recommendations.append({
                "rank": i + 1,
                "title": book.get("title", "제목 없음"),
                "author": book.get("author", "저자 미상"),
                "category": book.get("category") or book.get("categoryName") or "카테고리 없음",
                "description": book.get("description", "설명 없음")[:200]  # 200자 제한
            })

        # 부족하면 빈 데이터로 채움
        while len(recommendations) < top_k:
            recommendations.append({
                "rank": len(recommendations) + 1,
                "title": "추천 도서 없음",
                "author": "-",
                "category": "-",
                "description": "추천할 도서를 찾지 못했습니다."
            })

        return recommendations

    except Exception as e:
        print(f"[ERROR] Book recommendation failed: {e}")
        return [
            {"rank": i+1, "title": f"오류", "author": "-", "category": "-", "description": str(e)}
            for i in range(top_k)
        ]


def get_movie_recommendations(emotion_data: list, top_k: int = 3) -> list:
    """
    영화 추천 수행

    Args:
        emotion_data: [{"label": "불안", "intensity": 0.7}, ...]
        top_k: 추천 개수

    Returns:
        [{"rank": 1, "title": "...", "overview": "..."}, ...]
    """
    movies = _load_movies()

    if movies is None:
        # 목 데이터 반환
        return [
            {"rank": i+1, "title": f"추천 영화 {i+1}", "overview": "영화 데이터 로드 실패"}
            for i in range(top_k)
        ]

    try:
        from movie_recsys.recommendation_service import RecommendationService

        results = RecommendationService.recommend(
            llm_emotions=emotion_data,
            movies=movies,
            top_n=top_k
        )

        recommendations = []
        for i, movie in enumerate(results):
            recommendations.append({
                "rank": i + 1,
                "title": movie.get("title", "제목 없음"),
                "overview": movie.get("overview", "줄거리 없음")[:200]  # 200자 제한
            })

        # 부족하면 빈 데이터로 채움
        while len(recommendations) < top_k:
            recommendations.append({
                "rank": len(recommendations) + 1,
                "title": "추천 영화 없음",
                "overview": "추천할 영화를 찾지 못했습니다."
            })

        return recommendations

    except Exception as e:
        print(f"[ERROR] Movie recommendation failed: {e}")
        return [
            {"rank": i+1, "title": "오류", "overview": str(e)}
            for i in range(top_k)
        ]

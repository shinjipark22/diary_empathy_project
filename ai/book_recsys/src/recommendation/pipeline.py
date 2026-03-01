import os
import sys
import torch 
from pathlib import Path

root_dir = Path(__file__).resolve().parents[2]
sys.path.append(str(root_dir))

from src.recommendation.retriever import HybridRetriever
from src.recommendation.reranker import BGEReranker

class RecommendationPipeline:
    def __init__(self, data_dir: str, data_path: str):
        # GPU 사용 가능 여부 자동 체크 
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # 1. 1차 검색기 로드
        self.retriever = HybridRetriever(data_dir, data_path)
        self.retriever.embed_model.to(self.device) # 장치 이동
        
        # 2. 2차 리랭커 로드
        self.reranker = BGEReranker()
        self.reranker.model.to(self.device) # 장치 이동

    def recommend(self, diary_json: dict, top_k: int = 3):
        if not diary_json.get('emotion') or not diary_json.get('summary'):
            return []

        candidates = self.retriever.retrieve(diary_json, top_k=50, alpha=0.5)

        emotion_label = diary_json['emotion'][0].get('label', '')
        reframe = diary_json.get('reframe', '')
        query_for_rerank = f"{emotion_label} {diary_json['summary']} {reframe}".strip()
        
        final_recommendations = self.reranker.rerank(
            query_text=query_for_rerank,
            candidates=candidates,
            top_k=top_k
        )
        
        for book in final_recommendations:
            if 'rerank_score' in book:
                book['rerank_score'] = float(book['rerank_score'])
        
        return final_recommendations

if __name__ == "__main__":
    BASE_DIR = Path(__file__).resolve().parents[2]
    DATA_DIR = str(BASE_DIR / "data" / "processed")
    DATA_PATH = str(BASE_DIR / "data" / "processed" / "aladin_books_bestseller_cleaned.csv")

    pipeline = RecommendationPipeline(DATA_DIR, DATA_PATH)

    test_diary = {
        "emotion": [{"label": "무기력", "intensity": 0.9}],
        "summary": "요즘 아무것도 하기 싫고 침대에만 누워있어. 내가 잘하고 있는 건지 모르겠고 그냥 다 멈추고 싶어.",
        "reframe": "잠시 멈춰가는 것도 과정이야."
    }

    results = pipeline.recommend(test_diary, top_k=3)

    print("\n" + "="*50)
    print("최종 추천 도서 결과")
    print("="*50)
    for i, book in enumerate(results, 1):
        title = book.get('title', '제목 없음')
        author = book.get('author', '작가 정보 없음')
        category = book.get('category') or book.get('categoryName') or '카테고리 없음'
        score = book.get('rerank_score', 0.0)
        desc = book.get('description', '설명이 없습니다.')

        print(f"[{i}위] {title}")
        print(f"- 작가: {author}")
        print(f"- 카테고리: {category}")
        print(f"- 추천 점수: {score:.4f}")
        print(f"- 한 줄 설명: {desc[:80]}...")
        print("-" * 50)
import pickle
import numpy as np
import pandas as pd
from pathlib import Path
from kiwipiepy import Kiwi
from sentence_transformers import SentenceTransformer
from numpy.linalg import norm

class HybridRetriever:
    def __init__(self, data_dir: str, data_path: str):
        self.df = pd.read_csv(data_path)
        
        with open(f'{data_dir}/bm25_index.pkl', 'rb') as f:
            self.bm25 = pickle.load(f)
        self.book_embeddings = np.load(f'{data_dir}/book_embeddings.npy')
        
        self.kiwi = Kiwi()
        self.embed_model = SentenceTransformer('BAAI/bge-m3')
        self.valid_pos = ('NNG', 'NNP', 'NNB', 'NR', 'NP', 'VV', 'VA', 'MAG')

    def _min_max_scale(self, scores):
        """점수를 0~1 사이로 정규화"""
        min_val = np.min(scores)
        max_val = np.max(scores)
        if max_val == min_val:
            return np.zeros_like(scores)
        return (scores - min_val) / (max_val - min_val)

    def retrieve(self, diary_json: dict, top_k: int = 50, alpha: float = 0.5):
        """
        일기 데이터를 받아 상위 K개의 후보 도서를 반환
        alpha: Dense(문맥) 점수의 가중치. (1-alpha)는 Sparse(키워드) 가중치
        """
        # 1. 쿼리 텍스트 구성
        emotion = diary_json.get("emotion", [{"label": "알 수 없음"}])[0]["label"]
        summary = diary_json.get("summary", "")
        reframe = diary_json.get("reframe", "")
        
        query_text = f"감정: {emotion}, 상황: {summary}, 관점: {reframe}"
        
        # 2. Sparse Retrieval 스코어 계산
        tokens = self.kiwi.tokenize(query_text)
        query_tokens = [token.form for token in tokens if token.tag in self.valid_pos]
        bm25_scores = np.array(self.bm25.get_scores(query_tokens))
        
        # 3. Dense Retrieval 스코어 계산
        query_vector = self.embed_model.encode(query_text)

        dot_product = np.dot(self.book_embeddings, query_vector)
        book_norms = norm(self.book_embeddings, axis=1)
        query_norm = norm(query_vector)
        dense_scores = dot_product / (book_norms * query_norm)
        
        # 4. 점수 정규화 및 결합 - Ensemble
        scaled_bm25 = self._min_max_scale(bm25_scores)
        scaled_dense = self._min_max_scale(dense_scores)
        
        final_scores = (alpha * scaled_dense) + ((1 - alpha) * scaled_bm25)
        
        # 5. 상위 K개 추출
        top_indices = np.argsort(final_scores)[::-1][:top_k]
        
        # 결과를 보기 좋게 리스트 형태로 반환
        results = []
        for idx in top_indices:
            book_info = self.df.iloc[idx].to_dict()
            book_info['hybrid_score'] = final_scores[idx]
            results.append(book_info)
            
        return results

# 간단한 테스트 실행 코드
if __name__ == "__main__":
    DATA_DIR = 'data/processed'
    DATA_PATH = 'data/processed/aladin_books_bestseller_cleaned.csv'
    
    retriever = HybridRetriever(DATA_DIR, DATA_PATH)
    
    # 가상의 일기 JSON 응답
    dummy_diary_json = {
        "emotion": [{"label": "불안", "intensity": 0.8}],
        "summary": "취업 준비를 하면서 계속 서류에서 떨어지니까 미래가 너무 막막하고 내 자신이 초라하게 느껴짐",
        "reframe": "지금의 실패는 내 가치가 부족해서가 아니라, 나와 더 잘 맞는 곳을 찾아가는 과정일 뿐이야. 조급해하지 말자."
    }
    
    # top_k 5개만 뽑아서 확인
    candidates = retriever.retrieve(dummy_diary_json, top_k=5, alpha=0.6)
    
    print("\n=== 1차 하이브리드 검색 결과 ===")
    for rank, book in enumerate(candidates, 1):
        print(f"{rank}위. {book['title']} (Score: {book['hybrid_score']:.4f})")
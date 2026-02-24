import pandas as pd
import numpy as np
import pickle
from pathlib import Path
from kiwipiepy import Kiwi
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer

def build_indices(data_path: str, output_dir: str):
    print("데이터 로드")
    df = pd.read_csv(data_path)

    documents = df['feature_text'].fillna("").tolist()

    print("sparse retrieval (BM25)를 위한 임베딩")
    kiwi = Kiwi()
    tokenized_docs = []
    
    # 의미 있는 품사(명사, 동사, 형용사 등)만 추출
    valid_pos = ('NNG', 'NNP', 'NNB', 'NR', 'NP', 'VV', 'VA', 'MAG')
    
    for doc in documents:
        tokens = kiwi.tokenize(doc)
        # 해당 품사에 속하는 단어만 리스트로 묶음
        doc_tokens = [token.form for token in tokens if token.tag in valid_pos]
        tokenized_docs.append(doc_tokens)
        
    bm25 = BM25Okapi(tokenized_docs)
    
    # 저장 디렉토리 생성
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    with open(f'{output_dir}/bm25_index.pkl', 'wb') as f:
        pickle.dump(bm25, f)

    print("Dense Retrieval을 위한 임베딩")

    embed_model = SentenceTransformer('jhgan/ko-sroberta-multitask')
    
    # feature_text 임베딩
    embeddings = embed_model.encode(documents, show_progress_bar=True)
    
    np.save(f'{output_dir}/book_embeddings.npy', embeddings)
    
    print("인덱스 및 임베딩 구축 완료")

if __name__ == "__main__":
    DATA_PATH = 'data/processed/aladin_books_bestseller_cleaned.csv'
    OUTPUT_DIR = 'data/processed'
    
    build_indices(DATA_PATH, OUTPUT_DIR)
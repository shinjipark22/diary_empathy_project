import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

class BGEReranker:
    def __init__(self, model_name="BAAI/bge-reranker-v2-m3"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.model.eval()

    def rerank(self, query_text: str, candidates: list, top_k: int = 3):
        """
        query_text: 일기에서 추출한 검색어
        candidates: retriever가 뽑아준 후보 도서 리스트 
        """
        if not candidates:
            return []

        pairs = [[query_text, doc['feature_text']] for doc in candidates]
        
        with torch.no_grad():
            inputs = self.tokenizer(
                pairs, 
                padding=True, 
                truncation=True, 
                return_tensors='pt', 
                max_length=512
            )
            
            scores = self.model(**inputs, return_dict=True).logits.view(-1,).float()
            
        ranked_indices = torch.argsort(scores, descending=True).tolist()
        
        final_results = []
        for i in ranked_indices[:top_k]:
            best_doc = candidates[i].copy()
            best_doc['rerank_score'] = scores[i].item()
            final_results.append(best_doc)
            
        return final_results
import os
import time
import requests
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

TARGET_CATEGORIES = {
    # [문학/에세이] - 감정 공감, 위로
    "한국에세이": 55889,
    "외국에세이": 55890,
    "한국소설": 50917,
    "영미소설": 50921,
    "한국시": 50940,
    
    # [심리/자기계발] - 문제 해결, 동기 부여
    "교양심리": 51371,
    "심리치료": 51377,
    "인간관계/처세": 336,
    "성공/처세": 326,
    "자기능력계발": 329,
    
    # [인문/철학/사회] - 깊은 성찰
    "인문학일반": 656,
    "철학일반": 51387,
    "사회과학": 798,
    
    # [실용/지식] - 다양한 일상 및 직무/학업 관심사 대응
    "경제경영": 170,
    "컴퓨터/IT": 351,
    "과학일반": 987,
    "예술/대중문화": 517
}


def fetch_aladin(category_id, query_type="Bestseller", max_pages=10):
    ttb_key = os.getenv("ALADIN_TTB_KEY")
    list_url = "http://www.aladin.co.kr/ttb/api/ItemList.aspx"
    books = []
    
    for page in range(1, max_pages + 1):
        params = {
            "ttbkey": ttb_key, "QueryType": query_type, "MaxResults": 50,
            "start": page, "SearchTarget": "Book", "output": "js",
            "Version": "20131101", "CategoryId": category_id
        }
        try:
            res = requests.get(list_url, params=params)
            items = res.json().get('item', [])
            if not items: break
            for item in items:
                books.append({
                    "isbn13": item.get("isbn13"),
                    "title": item.get("title"),
                    "author": item.get("author"),
                    "publisher": item.get("publisher"),
                    "pub_date": item.get("pubDate"),
                    "category": item.get("categoryName"),
                    "rating": item.get("customerReviewRank"),
                    "description": item.get("description", ""),
                    "link": item.get("link")
                })
            time.sleep(0.1)
        except: break
    return books

if __name__ == "__main__":
    # 1. 베스트셀러 수집 (카테고리당 10페이지)
    best_list = []
    for name, cid in TARGET_CATEGORIES.items():
        print(f" > {name} 수집 중")
        best_list.extend(fetch_aladin(cid, "Bestseller", 10))
    
    df_best = pd.DataFrame(best_list).drop_duplicates('isbn13')
    df_best.to_csv("data/aladin_books_bestseller.csv", index=False, encoding="utf-8-sig")

    # 2. 기존 최신 도서와 병합
    recent_path = "data/aladin_books_recent.csv"

    df_recent = pd.read_csv(recent_path)
    df_final = pd.concat([df_recent, df_best], ignore_index=True).drop_duplicates('isbn13')
    
    df_final.to_csv("data/aladin_books_final.csv", index=False, encoding="utf-8-sig")
    print(f"통합 완료: 총 {len(df_final)}권 (최종: aladin_books_final.csv)")

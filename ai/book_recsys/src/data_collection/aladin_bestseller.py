import os
import time
import requests
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

TARGET_CATEGORIES = {
    "한국에세이": 55889, "외국에세이": 55890, "한국소설": 50917, "영미소설": 50921, "한국시": 50940,
    "교양심리": 51371, "심리치료": 51377, "인간관계/처세": 336, "성공/처세": 326, "자기능력계발": 329,
    "인문학일반": 656, "철학일반": 51387, "사회과학": 798,
    "경제경영": 170, "컴퓨터/IT": 351, "과학일반": 987, "예술/대중문화": 517
}

def fetch_bestsellers(category_id, max_pages=20):
    ttb_key = os.getenv("ALADIN_TTB_KEY")
    url = "http://www.aladin.co.kr/ttb/api/ItemList.aspx"
    books = []
    
    for page in range(1, max_pages + 1):
        params = {
            "ttbkey": ttb_key, "QueryType": "Bestseller", "MaxResults": 50,
            "start": page, "SearchTarget": "Book", "output": "js",
            "Version": "20131101", "CategoryId": category_id
        }
        try:
            res = requests.get(url, params=params)
            items = res.json().get('item', [])
            if not items:
                break
            
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
        except:
            break
            
    return books

if __name__ == "__main__":
    all_books = []
    
    for name, cid in TARGET_CATEGORIES.items():
        print(f"{name} 수집 시작")
        all_books.extend(fetch_bestsellers(cid))
    
    df = pd.DataFrame(all_books).drop_duplicates('isbn13')
    
    os.makedirs("data", exist_ok=True)
    save_path = "data/aladin_books_bestseller.csv"
    df.to_csv(save_path, index=False, encoding="utf-8-sig")
    
    print(f"총 도서 수: {len(df)}")
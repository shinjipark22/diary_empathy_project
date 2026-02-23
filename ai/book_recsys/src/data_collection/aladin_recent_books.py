import os
import time
import requests
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

# 수집할 주요 카테고리 ID (필요 없는 분야는 주석 처리해서 사용)
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

def fetch_bulk_books(category_id: int, max_pages: int = 20) -> list:
    """
    category_id: 수집할 분야
    max_pages: 가져올 페이지 수 (1페이지당 50권, 20페이지 = 1000권)
    """
    ttb_key = os.getenv("ALADIN_TTB_KEY")
    if not ttb_key:
        raise ValueError("ALADIN_TTB_KEY가 설정되지 않았습니다.")

    list_url = "http://www.aladin.co.kr/ttb/api/ItemList.aspx"
    book_list = []
    
    for page in range(1, max_pages + 1):
        params = {
            "ttbkey": ttb_key,
            "QueryType": "ItemNewAll", # 전체 도서 대상
            "MaxResults": 50,
            "start": page,
            "SearchTarget": "Book",
            "output": "js",
            "Version": "20131101",
            "CategoryId": category_id,
            "Sort": "SalesPoint"       # 판매량순 정렬
        }
        
        try:
            res = requests.get(list_url, params=params)
            res.raise_for_status()
            items = res.json().get('item', [])
            
            if not items:
                break # 더 이상 데이터가 없으면 중단
                
            for item in items:
                book_list.append({
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
            
            time.sleep(0.1) # API 호출 제한 방지
            
        except requests.exceptions.RequestException as e:
            print(f"페이지 {page} 조회 에러: {e}")
            continue

    return book_list

def collect_all_categories(pages_per_cat=100):
    all_books = []
    
    for cat_name, cat_id in TARGET_CATEGORIES.items():
        print(f"[{cat_name}] 수집 진행 중...")
        books = fetch_bulk_books(cat_id, max_pages=pages_per_cat)
        all_books.extend(books)
        time.sleep(0.5)
        
    return pd.DataFrame(all_books)

if __name__ == "__main__":
    df = collect_all_categories(pages_per_cat=100)
    
    if not df.empty:
        # 중복 도서 제거 (다른 카테고리에 중복 등록된 도서 처리)
        df = df.drop_duplicates(subset=['isbn13'], keep='first')
        
        os.makedirs("data", exist_ok=True)
        file_path = "data/aladin_books.csv"
        df.to_csv(file_path, index=False, encoding="utf-8-sig")
        print(f"총 {len(df)}권 저장 완료: {file_path}")
    else:
        print("수집된 데이터가 없습니다.")
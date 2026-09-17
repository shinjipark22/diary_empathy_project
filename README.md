# Diary Empathy Project

사용자가 쓴 일기 텍스트를 입력받아 감정 추정, 공감 표현, 정서적 지지, 관점 재구성, 소규모 행동 제안까지 담은 구조화된 JSON을 돌려주는 LLM 공감 피드백 API다. 공감 대화 연구 구조(Empathetic Dialogue, Emotional Support Conversation)를 참고해 프롬프트 기반 MVP로 구현했다.

## 구조

```mermaid
flowchart LR
    A[일기 텍스트] --> B[FastAPI<br>POST /api/diary/empathy]
    B --> C[empathy_service.py]
    C --> D[LLM 호출<br>gpt-4o-mini]
    D --> E[JSON 생성]
    E --> F{스키마 검증<br>schema/response.py}
    F -- 실패 --> D
    F -- 통과 --> G[최종 JSON 응답]
    C -.-> H[도서 추천<br>BM25(Kiwi) + bge-m3 검색, bge-reranker-v2-m3 리랭커]
```

저장소는 모노레포다. `ai/`는 FastAPI 공감 API와 추천 모듈, `backend/`는 Spring 백엔드, `frontend/`는 UI다.

## 내 역할

- 공감 피드백 API를 구현했다. FastAPI 엔드포인트, 시스템 프롬프트, OpenAI 호출 모듈, 출력 스키마와 validator, 재시도 유틸을 만들었다 (`ai/feedback/`).
- LLM 응답이 사용자의 말투를 따라 하는 톤 미러링 문제를 프롬프트로 고쳤다.
- 도서 추천 모듈을 구현했다. 알라딘 베스트셀러 데이터를 수집·전처리하고, Kiwi 형태소 BM25와 bge-m3 임베딩을 함께 쓰는 검색기와 bge-reranker-v2-m3 리랭커로 추천 파이프라인을 만들었다 (`ai/book_recsys/`).

백엔드와 프론트엔드는 팀원이 맡았다.

## 구조와 설계 결정

출력 JSON 스키마를 강제한다. 응답 필드는 감정 추정 → 공감 → 지지 → 재구성 → 소규모 행동 제안 → 성찰 질문 순서로 설계했고, `schema/response.py`의 validator가 검증한다. 검증에 실패하면 자동으로 다시 생성한다.

프롬프트, 모델 호출, 서비스 로직을 분리했다. 모델 이름은 `ai/feedback/config.py`에서만 바꾼다.

API 명세는 아래와 같다.

```json
POST /api/diary/empathy
{"request_id": "string", "diary_text": "오늘 너무 불안했다..."}
```

```json
{
  "request_id": "...",
  "model": {"name": "diary-empathy-ko", "version": "1.0.0"},
  "output": {
    "emotion": [{"label": "불안", "intensity": 0.72}],
    "summary": "...",
    "empathy": "...",
    "support": "...",
    "reframe": "...",
    "next_actions": [{"title": "...", "detail": "..."}],
    "reflection_question": "...?",
    "safety_flags": {"self_harm_risk": false, "violence_risk": false, "abuse_risk": false}
  }
}
```

## 기술 스택

Python, FastAPI, OpenAI API, pydantic, kiwipiepy, rank-bm25, sentence-transformers(bge-m3), transformers(bge-reranker-v2-m3), pandas

## 실행 방법

```bash
python -m venv venv
venv\Scripts\activate
pip install -r ai/requirements.txt
```

`.env`에 `OPENAI_API_KEY=YOUR_KEY`를 넣는다. `.env`와 venv는 커밋하지 않는다.

```bash
uvicorn ai.feedback.app:app --reload
```

Swagger는 `http://127.0.0.1:8000/docs`에서 확인한다. 브랜치 전략과 커밋 규칙은 [CONTRIBUTING.md](CONTRIBUTING.md)에 있다.

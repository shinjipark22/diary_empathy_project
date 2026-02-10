# 📓 Diary Empathy Project

LLM 기반 일기 공감 피드백 생성 API 프로젝트입니다.  
사용자가 작성한 일기 텍스트를 입력받아 감정 추정, 공감 표현, 정서적 지지, 관점 재구성, 소규모 행동 제안까지 포함된 **구조화된 JSON 응답**을 반환합니다.

연구 기반 공감 대화 구조(Empathetic Dialogue, Emotional Support Conversation 등)를 참고하여 프롬프트 기반 MVP 형태로 구현되었습니다.

---

# 🧱 Repository Structure (Monorepo)

```
project-root/
├── ai/           # LLM 공감 분석 API (FastAPI)
├── backend/      # Spring Backend
├── frontend/     # Frontend UI
├── docs/         # 설계 문서 (선택)
└── README.md
```

---

# 🤖 AI Module Overview (ai/)

```
ai/
├── app.py                  # FastAPI 진입점
├── config.py               # 모델/파라미터 설정
├── llm/
│   ├── prompt.py           # 시스템 프롬프트
│   └── client.py           # LLM 호출 모듈
├── schema/
│   ├── request.py          # 입력 DTO
│   └── response.py         # 출력 스키마 + validator
├── service/
│   └── empathy_service.py  # 비즈니스 로직
└── util/
    └── retry.py            # 재시도 유틸
```

설계 원칙:

- 출력 JSON 스키마 강제
- validator 기반 출력 검증
- 실패 시 자동 재생성
- 프롬프트 / 모델 호출 / 서비스 로직 분리
- 모델 교체 가능 구조

---

# 🔄 Processing Flow

```
Diary Text Input
→ FastAPI Endpoint
→ Service Layer
→ LLM Call
→ JSON Generation
→ Schema Validation
→ Retry if invalid
→ Final JSON Response
```

---

# 📡 API Spec

## Endpoint

POST `/api/diary/empathy`

---

## Request

```json
{
  "request_id": "string",
  "diary_text": "오늘 너무 불안했다..."
}
```

---

## Response (Schema-fixed)

```json
{
  "request_id": "...",
  "model": {
    "name": "diary-empathy-ko",
    "version": "1.0.0"
  },
  "output": {
    "emotion": [
      {"label": "불안", "intensity": 0.72}
    ],
    "summary": "...",
    "empathy": "...",
    "support": "...",
    "reframe": "...",
    "next_actions": [
      {"title": "...", "detail": "..."}
    ],
    "reflection_question": "...?",
    "safety_flags": {
      "self_harm_risk": false,
      "violence_risk": false,
      "abuse_risk": false
    }
  }
}
```

---

# 🧠 Design Basis

다음 공감 대화 연구 구조를 참고하여 출력 필드를 설계했습니다.

- Empathetic Dialogue
- Emotional Support Conversation
- CARE / MoEL 계열

전략 구조:

```
감정 추정 → 공감 → 지지 → 재구성 → 소규모 행동 제안 → 성찰 질문
```

---

# ⚙️ Setup (AI Module)

## 1️⃣ 가상환경 생성

```
python -m venv venv
venv\Scripts\activate
```

---

## 2️⃣ 패키지 설치

```
pip install fastapi uvicorn openai pydantic python-dotenv
```

---

## 3️⃣ 환경변수 설정 (.env)

```
OPENAI_API_KEY=YOUR_KEY
```

---

# ▶️ Run

```
uvicorn ai.app:app --reload
```

Swagger 테스트:

```
http://127.0.0.1:8000/docs
```

---

# 🌳 Git Workflow

## 브랜치 전략

기본 브랜치는 `main`을 유지하고, 모든 작업은 개별 브랜치에서 진행 후 PR로 merge합니다.

```
main            ← 안정 버전
feature/*       ← 기능 개발
fix/*           ← 버그 수정
refactor/*      ← 구조 개선
docs/*          ← 문서 작업
chore/*         ← 설정/환경 작업
```

---

## 브랜치 네이밍 규칙

형식:

```
type/파트-기능-이름
```

예시:

```
feat/ai-empathy-api-psj
feat/backend-controller-psj
feat/frontend-ui-psj
fix/backend-json-error-psj
refactor/ai-module-structure-psj
docs/readme-update-psj
```

---

## 커밋 메시지 규칙

브랜치 타입과 동일한 태그를 커밋 메시지 앞에 붙입니다.

형식:

```
[TYPE] 변경 내용 요약
```

예시:

```
[FEAT] add empathy API validator
[FIX] handle invalid JSON response
[REFACTOR] split LLM client module
[DOCS] update README
[CHORE] add gitignore rules
```

---

## TYPE 태그 목록

| 태그 | 의미 |
|------|------|
| FEAT | 기능 추가 |
| FIX | 버그 수정 |
| REFACTOR | 구조 변경 |
| DOCS | 문서 |
| TEST | 테스트 |
| CHORE | 설정/환경 |


---

## 작업 규칙

- main 직접 커밋 금지
- 반드시 브랜치 생성 후 작업
- PR 기반 merge
- 하나의 브랜치 = 하나의 기능
- 리뷰 후 merge


---

# 🔒 Security

- API 키는 `.env`로 관리
- `.gitignore`에 env / venv 제외
- 모델 설정은 config.py에서 관리

---


# 👥 Contributors

- AI Module — shinjipark22
- Backend — TBD
- Frontend — TBD
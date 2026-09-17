# Git Workflow

## 브랜치 전략

기본 브랜치는 `main`을 유지하고, 모든 작업은 개별 브랜치에서 진행 후 PR로 merge한다.

```
main            ← 안정 버전
feature/*       ← 기능 개발
fix/*           ← 버그 수정
refactor/*      ← 구조 개선
docs/*          ← 문서 작업
chore/*         ← 설정/환경 작업
```

## 브랜치 네이밍 규칙

형식은 `type/파트-기능-이름`이다.

```
feat/ai-empathy-api-psj
feat/backend-controller-psj
feat/frontend-ui-psj
fix/backend-json-error-psj
refactor/ai-module-structure-psj
docs/readme-update-psj
```

## 커밋 메시지 규칙

브랜치 타입과 동일한 태그를 커밋 메시지 앞에 붙인다. 형식은 `[TYPE] 변경 내용 요약`이다.

```
[FEAT] add empathy API validator
[FIX] handle invalid JSON response
[REFACTOR] split LLM client module
[DOCS] update README
[CHORE] add gitignore rules
```

| 태그 | 의미 |
|------|------|
| FEAT | 기능 추가 |
| FIX | 버그 수정 |
| REFACTOR | 구조 변경 |
| DOCS | 문서 |
| TEST | 테스트 |
| CHORE | 설정/환경 |

## 작업 규칙

- main 직접 커밋 금지
- 반드시 브랜치 생성 후 작업
- PR 기반 merge
- 하나의 브랜치 = 하나의 기능
- 리뷰 후 merge

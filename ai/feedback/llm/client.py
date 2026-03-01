import json
from openai import OpenAI, OpenAIError

from config import OPENAI_API_KEY, MODEL_NAME, TEMPERATURE, MODEL_ALIAS, MODEL_VERSION
from llm.prompt import SYSTEM_PROMPT

# 클라이언트 생성 (API 키 없으면 None)
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

def generate_empathy_json(diary_text: str, request_id: str) -> dict:
    """
    OpenAI API를 호출하여 일기를 분석하고 JSON을 반환합니다.
    request_id와 model 정보는 AI에게 시키지 않고 파이썬이 직접 주입합니다.
    """

    # API 키 없으면 목 데이터 반환 (추천은 empathy_service에서 추가됨)
    if client is None:
        return {
            "request_id": request_id,
            "model": {"name": "mock", "version": "1.0"},
            "output": {
                "emotion": [{"label": "불안", "intensity": 0.7}],
                "summary": "목 데이터 - GPT API 키 없음",
                "empathy": "목 데이터입니다.",
                "support": "테스트용 응답입니다.",
                "reframe": "API 키를 설정하면 실제 응답을 받을 수 있습니다.",
                "next_actions": [{"title": "테스트", "detail": "API 키 설정하기"}],
                "reflection_question": "테스트가 잘 되고 있나요?",
                "safety_flags": {"self_harm_risk": False, "violence_risk": False, "abuse_risk": False}
            }
        }

    user_prompt = f"""
[일기 원문]
{diary_text}
"""

    try:
        # API 호출
        resp = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=TEMPERATURE,
            response_format={"type": "json_object"}, # JSON 모드 강제
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
        )
        
        # 응답 파싱
        content = resp.choices[0].message.content
        if not content:
            raise ValueError("OpenAI returned empty content")
            
        result_json = json.loads(content)

        # 메타데이터 주입
        result_json["request_id"] = request_id
        result_json["model"] = {
            "name": MODEL_ALIAS,
            "version": MODEL_VERSION
        }

        return result_json

    except json.JSONDecodeError:
        # AI가 JSON 형식을 깨뜨렸을 때
        print(f"[Error] JSON Parsing Failed. Request ID: {request_id}")
        return {"error": "Invalid JSON format from AI", "request_id": request_id}

    except OpenAIError as e:
        # API 키 오류, 잔액 부족, 서버 다운 등
        print(f"[Error] OpenAI API Error: {e}")
        return {"error": str(e), "request_id": request_id}

    except Exception as e:
        # 그 외 알 수 없는 에러
        print(f"[Error] Unknown Error: {e}")
        return {"error": "Unknown server error", "request_id": request_id}
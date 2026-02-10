import json
from openai import OpenAI, OpenAIError

from config import OPENAI_API_KEY, MODEL_NAME, TEMPERATURE, MODEL_ALIAS, MODEL_VERSION
from llm.prompt import SYSTEM_PROMPT

# 클라이언트 생성
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_empathy_json(diary_text: str, request_id: str) -> dict:
    """
    OpenAI API를 호출하여 일기를 분석하고 JSON을 반환합니다.
    request_id와 model 정보는 AI에게 시키지 않고 파이썬이 직접 주입합니다.
    """
    
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
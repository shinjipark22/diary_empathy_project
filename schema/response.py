"""
Python의 pydantic 라이브러리를 사용
응답 데이터가 스키마에 맞는지 검사, 정의
"""

from pydantic import BaseModel, Field, validator
from typing import List

class EmotionItem(BaseModel):
    label: str # "기쁨", "슬픔" 등
    intensity: float = Field(ge=0.0, le=1.0) # 0.0 이상 1.0 이하

class ActionItem(BaseModel):
    title: str # 행동 제목 (산책하기 등등)
    detail: str # 상세 내용

class SafetyFlags(BaseModel):
    self_harm_risk: bool # 자해 위험
    violence_risk: bool # 폭력 위험
    abuse_risk: bool # 학대 위험

# 핵심 결과물
class OutputBlock(BaseModel):
    emotion: List[EmotionItem]
    summary: str
    empathy: str 
    support: str 
    reframe: str 
    next_actions: List[ActionItem]
    reflection_question: str 
    safety_flags: SafetyFlags

    # 유효성 검사기 
    @validator("emotion")
    def check_emotion_len(cls, v):
        if not (1 <= len(v) <= 3):
            raise ValueError("emotion must be 1~3")
        return v

    @validator("next_actions")
    def check_actions_len(cls, v):
        if len(v) > 2:
            raise ValueError("next_actions max 2")
        return v 

# 최종 결과물   
class EmpathyResponse(BaseModel): 
    request_id: str 
    model: dict # 모델 정보 (예: {"name": "gpt-4", "version": "1.0"})
    output: OutputBlock # 위에서 만든 OutputBlock class
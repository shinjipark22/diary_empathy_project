package com.empathy.diary.infrastructure.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class EmpathyAiClient {

    private final RestClient restClient;

    @Value("${ai.server.url:http://localhost:8000}")
    private String aiServerUrl;

    public String analyze(String diaryText) {
        try {
            Map<String, String> request = Map.of(
                    "request_id", java.util.UUID.randomUUID().toString(),
                    "diary_text", diaryText
            );

            return restClient.post()
                    .uri(aiServerUrl + "/api/diary/empathy")
                    .body(request)
                    .retrieve()
                    .body(String.class);
        } catch (Exception e) {
            // AI 서버 연결 실패 시 임시 응답 반환
            return getMockResponse();
        }
    }

    private String getMockResponse() {
        return """
            {
                "output": {
                    "summary": "일기 분석 서비스 준비 중입니다.",
                    "empathy": "당신의 하루를 기록해주셔서 감사합니다.",
                    "support": "꾸준히 일기를 쓰는 것만으로도 큰 의미가 있어요.",
                    "reframe": "오늘의 기록이 내일의 성장이 됩니다.",
                    "next_actions": [
                        {"title": "잠시 휴식", "detail": "5분간 깊은 호흡을 해보세요."}
                    ],
                    "reflection_question": "오늘 가장 기억에 남는 순간은 무엇인가요?",
                    "keywords": ["일상", "기록"],
                    "emotion": [
                        {"label": "평온", "intensity": 0.7}
                    ],
                    "safety_flags": {
                        "self_harm_risk": false,
                        "violence_risk": false,
                        "abuse_risk": false
                    }
                }
            }
            """;
    }
}

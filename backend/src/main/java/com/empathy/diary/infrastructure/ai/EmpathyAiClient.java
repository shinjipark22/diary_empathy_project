package com.empathy.diary.infrastructure.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmpathyAiClient {

    private final RestTemplate restTemplate;

    @Value("${ai.server.url:http://localhost:8000}")
    private String aiServerUrl;

    @SuppressWarnings("unchecked")
    public Map<String, Object> analyze(String diaryText) {
        String url = aiServerUrl + "/api/diary/empathy";

        Map<String, String> request = Map.of(
            "request_id", UUID.randomUUID().toString(),
            "diary_text", diaryText
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("AI server call failed: {}", e.getMessage());
            throw new RuntimeException("AI 분석 서버 호출 실패", e);
        }
    }
}

package com.empathy.diary.domain.diary;

import com.empathy.diary.infrastructure.ai.EmpathyAiClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
public class DiaryAnalysisController {

    private final DiaryService diaryService;
    private final EmpathyAiClient empathyAiClient;
    private final ObjectMapper objectMapper;

    @PostMapping("/create")
    public ResponseEntity<DiaryAnalysisResponse> createWithAnalysis(
            @AuthenticationPrincipal Long userId,
            @RequestBody DiaryRequest request
    ) {
        // 1. 일기 저장
        DiaryResponse savedDiary = diaryService.create(userId, request);

        // 2. AI 분석 호출
        Map<String, Object> aiResponse = empathyAiClient.analyze(request.content());

        // 3. 응답 변환
        DiaryAnalysisResponse response = convertToAnalysisResponse(savedDiary.id(), aiResponse);

        return ResponseEntity.ok(response);
    }

    @SuppressWarnings("unchecked")
    private DiaryAnalysisResponse convertToAnalysisResponse(Long diaryId, Map<String, Object> aiResponse) {
        Map<String, Object> output = (Map<String, Object>) aiResponse.get("output");
        
        // emotions 변환
        List<Map<String, Object>> emotionList = (List<Map<String, Object>>) output.get("emotion");
        Map<String, Double> emotions = new LinkedHashMap<>();
        String primaryEmotion = "";
        double maxIntensity = 0;
        
        for (Map<String, Object> e : emotionList) {
            String label = (String) e.get("label");
            Double intensity = ((Number) e.get("intensity")).doubleValue();
            emotions.put(label, intensity);
            if (intensity > maxIntensity) {
                maxIntensity = intensity;
                primaryEmotion = label;
            }
        }

        // nextActions 변환
        List<Map<String, String>> actionList = (List<Map<String, String>>) output.get("next_actions");
        List<DiaryAnalysisResponse.NextAction> nextActions = actionList.stream()
            .map(a -> new DiaryAnalysisResponse.NextAction(a.get("title"), a.get("detail")))
            .toList();

        // safetyFlags 변환
        Map<String, Boolean> flags = (Map<String, Boolean>) output.get("safety_flags");
        DiaryAnalysisResponse.SafetyFlags safetyFlags = new DiaryAnalysisResponse.SafetyFlags(
            Boolean.TRUE.equals(flags.get("self_harm_risk")),
            Boolean.TRUE.equals(flags.get("violence_risk")),
            Boolean.TRUE.equals(flags.get("abuse_risk"))
        );

        // bookRecommendations 변환
        List<Map<String, Object>> bookList = (List<Map<String, Object>>) output.get("bookRecommendations");
        List<DiaryAnalysisResponse.BookRecommendation> bookRecs = bookList != null ? bookList.stream()
            .map(b -> new DiaryAnalysisResponse.BookRecommendation(
                ((Number) b.get("rank")).intValue(),
                (String) b.get("title"),
                (String) b.get("author"),
                (String) b.get("category"),
                (String) b.get("description")
            ))
            .toList() : List.of();

        // movieRecommendations 변환
        List<Map<String, Object>> movieList = (List<Map<String, Object>>) output.get("movieRecommendations");
        List<DiaryAnalysisResponse.MovieRecommendation> movieRecs = movieList != null ? movieList.stream()
            .map(m -> new DiaryAnalysisResponse.MovieRecommendation(
                ((Number) m.get("rank")).intValue(),
                (String) m.get("title"),
                (String) m.get("overview")
            ))
            .toList() : List.of();

        // Output 생성
        DiaryAnalysisResponse.Output outputBlock = new DiaryAnalysisResponse.Output(
            (String) output.get("summary"),
            (String) output.get("empathy"),
            (String) output.get("support"),
            (String) output.get("reframe"),
            nextActions,
            (String) output.get("reflection_question"),
            List.of(), // keywords
            bookRecs,
            movieRecs
        );

        return new DiaryAnalysisResponse(
            diaryId,
            LocalDateTime.now(),
            emotions,
            primaryEmotion,
            outputBlock,
            safetyFlags
        );
    }
}

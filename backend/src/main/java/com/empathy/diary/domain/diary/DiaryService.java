package com.empathy.diary.domain.diary;

import com.empathy.diary.domain.user.User;
import com.empathy.diary.domain.user.UserRepository;
import com.empathy.diary.infrastructure.ai.EmpathyAiClient;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    private final EmpathyAiClient empathyAiClient;
    private final ObjectMapper objectMapper;

    @Transactional
    public DiaryResponse create(Long userId, DiaryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Diary diary = Diary.builder()
                .user(user)
                .title(request.title())
                .content(request.content())
                .writtenDate(request.date())
                .build();

        Diary saved = diaryRepository.save(diary);
        return DiaryResponse.from(saved);
    }

    public List<DiaryResponse> findAllByUser(Long userId) {
        return diaryRepository.findByUserIdOrderByWrittenDateDesc(userId)
                .stream()
                .map(DiaryResponse::from)
                .toList();
    }

    public DiaryResponse findById(Long userId, Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary not found: " + diaryId));

        if (!diary.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Access denied");
        }

        return DiaryResponse.from(diary);
    }

    @Transactional
    public void delete(Long userId, Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary not found: " + diaryId));

        if (!diary.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Access denied");
        }

        diaryRepository.delete(diary);
    }

    @Transactional
    public DiaryAnalysisResponse createWithAnalysis(Long userId, DiaryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Diary diary = Diary.builder()
                .user(user)
                .title(request.title())
                .content(request.content())
                .writtenDate(request.date())
                .build();

        String aiResponse = empathyAiClient.analyze(request.content());
        diary.updateAnalysisResult(aiResponse);

        Diary saved = diaryRepository.save(diary);

        return parseAnalysisResponse(saved, aiResponse);
    }

    private DiaryAnalysisResponse parseAnalysisResponse(Diary diary, String aiResponse) {
        try {
            JsonNode root = objectMapper.readTree(aiResponse);
            JsonNode output = root.path("output");

            Map<String, Double> emotions = new LinkedHashMap<>();
            String primaryEmotion = null;
            double maxIntensity = 0;

            JsonNode emotionArray = output.path("emotion");
            for (JsonNode e : emotionArray) {
                String label = e.path("label").asText();
                double intensity = e.path("intensity").asDouble();
                emotions.put(label, intensity);
                if (intensity > maxIntensity) {
                    maxIntensity = intensity;
                    primaryEmotion = label;
                }
            }

            List<DiaryAnalysisResponse.NextAction> nextActions = new ArrayList<>();
            for (JsonNode action : output.path("next_actions")) {
                nextActions.add(new DiaryAnalysisResponse.NextAction(
                        action.path("title").asText(),
                        action.path("detail").asText()
                ));
            }

            List<String> keywords = new ArrayList<>();
            for (JsonNode keyword : output.path("keywords")) {
                keywords.add(keyword.asText());
            }

            JsonNode safetyNode = output.path("safety_flags");
            DiaryAnalysisResponse.SafetyFlags safetyFlags = new DiaryAnalysisResponse.SafetyFlags(
                    safetyNode.path("self_harm_risk").asBoolean(),
                    safetyNode.path("violence_risk").asBoolean(),
                    safetyNode.path("abuse_risk").asBoolean()
            );

            DiaryAnalysisResponse.Output outputDto = new DiaryAnalysisResponse.Output(
                    output.path("summary").asText(),
                    output.path("empathy").asText(),
                    output.path("support").asText(),
                    output.path("reframe").asText(),
                    nextActions,
                    output.path("reflection_question").asText(),
                    keywords
            );

            return new DiaryAnalysisResponse(
                    diary.getId(),
                    diary.getCreatedAt(),
                    emotions,
                    primaryEmotion,
                    outputDto,
                    safetyFlags
            );
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse AI response", e);
        }
    }
}

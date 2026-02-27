package com.empathy.diary.domain.diary;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record DiaryAnalysisResponse(
        Long diaryId,
        LocalDateTime createdAt,
        Map<String, Double> emotions,
        String primaryEmotion,
        Output output,
        SafetyFlags safetyFlags
) {
    public record Output(
            String summary,
            String empathy,
            String support,
            String reframe,
            List<NextAction> nextActions,
            String reflectionQuestion,
            List<String> keywords,
            List<BookRecommendation> bookRecommendations,
            List<MovieRecommendation> movieRecommendations
    ) {}

    public record BookRecommendation(
            int rank,
            String title,
            String author,
            String category,
            String description
    ) {}

    public record MovieRecommendation(
            int rank,
            String title,
            String overview
    ) {}

    public record NextAction(
            String title,
            String detail
    ) {}

    public record SafetyFlags(
            boolean selfHarmRisk,
            boolean violenceRisk,
            boolean abuseRisk
    ) {}
}

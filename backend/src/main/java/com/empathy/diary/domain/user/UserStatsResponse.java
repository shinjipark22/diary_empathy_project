package com.empathy.diary.domain.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserStatsResponse(
        @JsonProperty("total_count") Integer totalCount,
        @JsonProperty("top_emotion") String topEmotion,
        @JsonProperty("streak_count") Integer streakCount
) {
}

package com.empathy.diary.domain.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserUpdateRequest(
        String nickname,
        @JsonProperty("profile_image") String profileImage
) {
}

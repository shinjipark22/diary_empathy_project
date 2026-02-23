package com.empathy.diary.domain.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserProfileResponse(
        String nickname,
        @JsonProperty("profile_image") String profileImage
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(user.getNickname(), user.getProfileImage());
    }
}

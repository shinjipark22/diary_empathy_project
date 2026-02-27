package com.empathy.diary.application.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {
    private String token;

    @JsonProperty("is_new_user")
    private boolean isNewUser;
}

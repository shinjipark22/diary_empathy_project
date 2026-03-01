package com.empathy.diary.infrastructure.kakao;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class KakaoUserInfo {
    private String id;
    private String nickname;
    private String profileImage;
}

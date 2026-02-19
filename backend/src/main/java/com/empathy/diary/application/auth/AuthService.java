package com.empathy.diary.application.auth;

import com.empathy.diary.domain.user.User;
import com.empathy.diary.domain.user.UserRepository;
import com.empathy.diary.infrastructure.kakao.KakaoClient;
import com.empathy.diary.infrastructure.kakao.KakaoTokenResponse;
import com.empathy.diary.infrastructure.kakao.KakaoUserInfo;
import com.empathy.diary.infrastructure.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final KakaoClient kakaoClient;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse kakaoLogin(String code) {
        // 1. 카카오에서 토큰 받기
        KakaoTokenResponse tokenResponse = kakaoClient.getToken(code);

        // 2. 카카오에서 사용자 정보 받기
        KakaoUserInfo userInfo = kakaoClient.getUserInfo(tokenResponse.getAccessToken());

        // 3. 사용자 조회 또는 생성
        boolean isNewUser = !userRepository.findByKakaoId(userInfo.getId()).isPresent();

        User user = userRepository.findByKakaoId(userInfo.getId())
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .kakaoId(userInfo.getId())
                                .nickname(userInfo.getNickname())
                                .profileImage(userInfo.getProfileImage())
                                .build()
                ));

        // 4. JWT 토큰 발급
        String token = jwtTokenProvider.createToken(user.getId(), user.getKakaoId());

        return AuthResponse.builder()
                .userId(user.getId())
                .token(token)
                .isNewUser(isNewUser)
                .build();
    }
}

package com.empathy.diary.domain.user;

import com.empathy.diary.domain.diary.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final DiaryRepository diaryRepository;

    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        return UserProfileResponse.from(user);
    }

    @Transactional
    public void updateProfile(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        user.updateProfile(request.nickname(), request.profileImage());
    }

    public UserStatsResponse getStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // TODO: top_emotion은 분석 결과에서 가장 많이 나온 감정을 계산해야 함
        String topEmotion = "기쁨"; // 임시 값

        return new UserStatsResponse(
                user.getTotalDiaryCount(),
                topEmotion,
                user.getStreakCount()
        );
    }
}

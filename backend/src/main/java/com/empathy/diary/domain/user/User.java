package com.empathy.diary.domain.user;

import com.empathy.diary.domain.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kakao_id", unique = true, nullable = false)
    private String kakaoId;

    @Column(nullable = false)
    private String nickname;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "total_diary_count")
    private Integer totalDiaryCount = 0;

    @Column(name = "streak_count")
    private Integer streakCount = 0;

    @Column(name = "last_written_date")
    private LocalDate lastWrittenDate;

    @Builder
    public User(String kakaoId, String nickname, String profileImage) {
        this.kakaoId = kakaoId;
        this.nickname = nickname;
        this.profileImage = profileImage;
    }

    public void incrementDiaryCount() {
        this.totalDiaryCount++;
    }

    public void updateStreak(LocalDate writtenDate) {
        if (lastWrittenDate == null || lastWrittenDate.plusDays(1).equals(writtenDate)) {
            this.streakCount++;
        } else if (!lastWrittenDate.equals(writtenDate)) {
            this.streakCount = 1;
        }
        this.lastWrittenDate = writtenDate;
    }
}

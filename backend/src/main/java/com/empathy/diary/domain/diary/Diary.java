package com.empathy.diary.domain.diary;

import com.empathy.diary.domain.common.BaseTimeEntity;
import com.empathy.diary.domain.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "diaries")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Diary extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "written_date", nullable = false)
    private LocalDate writtenDate;

    @Column(name = "analysis_result", columnDefinition = "TEXT")
    private String analysisResult;

    @Builder
    public Diary(User user, String title, String content, LocalDate writtenDate) {
        this.user = user;
        this.title = title;
        this.content = content;
        this.writtenDate = writtenDate;
    }

    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public void updateAnalysisResult(String analysisResult) {
        this.analysisResult = analysisResult;
    }
}

package com.empathy.diary.domain.analysis;

import com.empathy.diary.domain.common.BaseTimeEntity;
import com.empathy.diary.domain.diary.Diary;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ai_analyses")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AiAnalysis extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id", nullable = false)
    private Diary diary;

    @Column(name = "primary_emotion")
    private String primaryEmotion;

    @Column(name = "emotion_data", columnDefinition = "TEXT")
    private String emotionData;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String empathy;

    @Column(columnDefinition = "TEXT")
    private String support;

    @Column(columnDefinition = "TEXT")
    private String reframe;

    @Column(name = "reflection_question", columnDefinition = "TEXT")
    private String reflectionQuestion;

    @Column(name = "next_actions", columnDefinition = "TEXT")
    private String nextActions;

    @Column(name = "safety_flags", columnDefinition = "TEXT")
    private String safetyFlags;

    @Column(name = "model_info")
    private String modelInfo;

    @Builder
    public AiAnalysis(Diary diary, String primaryEmotion, String emotionData, String summary,
                      String empathy, String support, String reframe, String reflectionQuestion,
                      String nextActions, String safetyFlags, String modelInfo) {
        this.diary = diary;
        this.primaryEmotion = primaryEmotion;
        this.emotionData = emotionData;
        this.summary = summary;
        this.empathy = empathy;
        this.support = support;
        this.reframe = reframe;
        this.reflectionQuestion = reflectionQuestion;
        this.nextActions = nextActions;
        this.safetyFlags = safetyFlags;
        this.modelInfo = modelInfo;
    }
}

package com.empathy.diary.domain.diary;

import java.time.LocalDate;

public record DiaryResponse(
        Long id,
        String title,
        String content,
        LocalDate date
) {
    public static DiaryResponse from(Diary diary) {
        return new DiaryResponse(
                diary.getId(),
                diary.getTitle(),
                diary.getContent(),
                diary.getWrittenDate()
        );
    }
}

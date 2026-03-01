package com.empathy.diary.domain.diary;

import java.time.LocalDate;

public record DiaryRequest(
        String title,
        String content,
        LocalDate date
) {
}

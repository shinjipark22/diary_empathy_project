package com.empathy.diary.domain.diary;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    List<Diary> findByUserIdOrderByWrittenDateDesc(Long userId);

    Optional<Diary> findByUserIdAndWrittenDate(Long userId, LocalDate writtenDate);
}

package com.empathy.diary.domain.diary;

import com.empathy.diary.domain.user.User;
import com.empathy.diary.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;

    @Transactional
    public DiaryResponse create(Long userId, DiaryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // 같은 날짜 일기가 있으면 UPDATE, 없으면 INSERT
        Diary diary = diaryRepository.findByUserIdAndWrittenDate(userId, request.date())
                .map(existing -> {
                    existing.update(request.title(), request.content());
                    return existing;
                })
                .orElseGet(() -> {
                    user.incrementDiaryCount();
                    return diaryRepository.save(Diary.builder()
                            .user(user)
                            .title(request.title())
                            .content(request.content())
                            .writtenDate(request.date())
                            .build());
                });

        user.updateStreak(request.date());

        return DiaryResponse.from(diary);
    }

    public List<DiaryResponse> findAllByUser(Long userId) {
        return diaryRepository.findByUserIdOrderByWrittenDateDesc(userId)
                .stream()
                .map(DiaryResponse::from)
                .toList();
    }

    public DiaryResponse findById(Long userId, Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary not found: " + diaryId));

        if (!diary.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Access denied");
        }

        return DiaryResponse.from(diary);
    }

    @Transactional
    public void delete(Long userId, Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary not found: " + diaryId));

        if (!diary.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Access denied");
        }

        diaryRepository.delete(diary);
    }
}

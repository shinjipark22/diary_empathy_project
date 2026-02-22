package com.empathy.diary.domain.diary;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;

    // TODO: 테스트 후 @AuthenticationPrincipal 복원 필요
    private Long resolveUserId(Long userId) {
        return userId != null ? userId : 1L;
    }

    @PostMapping("/api/diaries")
    public ResponseEntity<DiaryResponse> create(
            @AuthenticationPrincipal Long userId,
            @RequestBody DiaryRequest request
    ) {
        DiaryResponse response = diaryService.create(resolveUserId(userId), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/diaries")
    public ResponseEntity<List<DiaryResponse>> findAll(
            @AuthenticationPrincipal Long userId
    ) {
        List<DiaryResponse> responses = diaryService.findAllByUser(resolveUserId(userId));
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/api/diaries/{id}")
    public ResponseEntity<DiaryResponse> findById(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id
    ) {
        DiaryResponse response = diaryService.findById(resolveUserId(userId), id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/diaries/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id
    ) {
        diaryService.delete(resolveUserId(userId), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/diary/create")
    public ResponseEntity<DiaryAnalysisResponse> createWithAnalysis(
            @AuthenticationPrincipal Long userId,
            @RequestBody DiaryRequest request
    ) {
        DiaryAnalysisResponse response = diaryService.createWithAnalysis(resolveUserId(userId), request);
        return ResponseEntity.ok(response);
    }
}

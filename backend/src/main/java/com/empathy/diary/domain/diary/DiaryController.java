package com.empathy.diary.domain.diary;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diaries")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;

    @PostMapping
    public ResponseEntity<DiaryResponse> create(
            @AuthenticationPrincipal Long userId,
            @RequestBody DiaryRequest request
    ) {
        DiaryResponse response = diaryService.create(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<DiaryResponse>> findAll(
            @AuthenticationPrincipal Long userId
    ) {
        List<DiaryResponse> responses = diaryService.findAllByUser(userId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiaryResponse> findById(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id
    ) {
        DiaryResponse response = diaryService.findById(userId, id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id
    ) {
        diaryService.delete(userId, id);
        return ResponseEntity.noContent().build();
    }
}

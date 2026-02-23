package com.empathy.diary.domain.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile(
            @AuthenticationPrincipal Long userId
    ) {
        UserProfileResponse response = userService.getProfile(userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/me")
    public ResponseEntity<Map<String, String>> updateProfile(
            @AuthenticationPrincipal Long userId,
            @RequestBody UserUpdateRequest request
    ) {
        userService.updateProfile(userId, request);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @GetMapping("/me/stats")
    public ResponseEntity<UserStatsResponse> getStats(
            @AuthenticationPrincipal Long userId
    ) {
        UserStatsResponse response = userService.getStats(userId);
        return ResponseEntity.ok(response);
    }
}

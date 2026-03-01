package com.empathy.diary.interfaces.api;

import com.empathy.diary.application.auth.AuthResponse;
import com.empathy.diary.application.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/kakao")
    public ResponseEntity<AuthResponse> kakaoLogin(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        AuthResponse response = authService.kakaoLogin(code);
        return ResponseEntity.ok(response);
    }
}

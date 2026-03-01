package com.empathy.diary;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DiaryEmpathyProjectBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(DiaryEmpathyProjectBackendApplication.class, args);
    }

}

-- 테스트용 User
INSERT INTO users (id, kakao_id, nickname, created_at, updated_at)
VALUES (1, 'test_kakao_123', '테스트유저', NOW(), NOW());

-- 테스트용 Diary
INSERT INTO diaries (id, user_id, title, content, written_date, created_at, updated_at)
VALUES (1, 1, '테스트 일기', '오늘은 정말 힘든 하루였다. 프로젝트 마감이 다가오는데 불안하다.', '2026-02-19', NOW(), NOW());

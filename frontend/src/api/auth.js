
export async function postKakaoLogin(code) {
  const response = await fetch('/api/auth/kakao', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',// JSON 형식으로 보내는 경우
    },
    body: JSON.stringify({ code }),// 인가 코드를 JSON 형식으로 보내기
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error ?? `로그인 실패 (${response.status})`);
  }

  const data = await response.json(); // { token, is_new_user }// 토큰과 신규 사용자 여부를 포함한 응답 데이터

  if (!data?.token) {
    throw new Error('토큰이 없습니다.');
  }

  return data;
}

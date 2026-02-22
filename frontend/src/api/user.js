                                                                                         
  function getAuthHeaders() {                                                              
    const token = localStorage.getItem('accessToken');                                     
    return {                                                                               
      'Content-Type': 'application/json',                                                  
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async function parseOrThrow(response, fallbackMessage) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error ?? fallbackMessage ?? `서버 오류
  (${response.status})`);
    }
    return response.json().catch(() => null);
  }

  export async function getMyProfile() {
    const response = await fetch('/api/users/me', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return parseOrThrow(response, '프로필 조회 실패');
  }

  export async function updateMyProfile({ nickname, profile_image }) {
    const response = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ nickname, profile_image }),
    });
    return parseOrThrow(response, '프로필 수정 실패');
  }

  export async function getMyStats() {
    const response = await fetch('/api/users/me/stats', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return parseOrThrow(response, '통계 조회 실패');
  }

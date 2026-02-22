

function getAuthHeaders(){//
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json', 
        ...(token ? { Authorization: `Bearer ${token}` } : {}),// 토큰이 있으면 Authorization 헤더 추ㅏㄱ
    }
}

async function parseOrThrow(response,fallbackMessage){
    if(!response.ok){
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error ?? fallbackMessage ?? `서버 오류 (${response.status})`);

    }
    if (response.status === 204) {
        return null;
    }
    return response.json().catch(() => null);
}

export async function createDiary({ date, content, title }) {
  const response = await fetch('/api/diaries', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ date, content, title }),
  });
  return parseOrThrow(response, '일기 저장 실패');
}

export async function listDiaries() {
    const response = await fetch('/api/diaries', {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return parseOrThrow(response, '일기 목록 불러오기 실패');
}


export async function getDiaryById(id) {
  const response = await fetch(`/api/diaries/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return parseOrThrow(response, '일기 조회 실패');
}

export async function deleteDiary(id) {
  const response = await fetch(`/api/diaries/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return parseOrThrow(response, '일기 삭제 실패');
}
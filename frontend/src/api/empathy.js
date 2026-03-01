const USE_MOCK = false; // 목데이터 사용 시 true

function getMockResponse(diaryContent) {
  //부정 감정 키워드 포함 여부 (임시로 프론트에서 간단히 판단)
  const hasNegative = /슬퍼|우울|힘들|짜증|화나|불행/.test(diaryContent);
  return {

    diary_id :1,
    created_at:new Date().toISOString(), // 생성 시점
    
    emotions : hasNegative 
      ? { '슬픔': 0.72, '불안': 0.45 } 
      : { '평온': 0.6, '기쁨': 0.35 },
    
  primary_emotion: hasNegative ? '슬픔' : '평온', 
  output : {
    summary: `"${diaryContent.slice(0,30)}..."에 대한 하루를 기록하셨네요.`,
     empathy: hasNegative
        ? '오늘 정말 쉽지 않은 하루를 보내셨군요. 그런 감정을 느끼는 건 자연스러운 일이에요.'
        : '오늘 하루도 잘 보내셨네요. 이렇게 기록하는 것 자체가 대단한 일이에요.',

      // 감정 지원 문장
      support: hasNegative
        ? '지금 느끼는 감정은 충분히 이해할 수 있어요. 스스로를 너무 몰아세우지 마세요.'
        : '꾸준히 자신을 돌아보는 습관이 정말 좋아요. 앞으로도 이렇게 기록해보세요.',

      // 긍정적 재해석 문장
      reframe: hasNegative
        ? '힘든 순간도 결국 지나가게 됩니다. 이 경험이 나중에 더 단단한 나를 만들어줄 거예요.'
        : '평범한 하루도 소중한 경험이에요. 매일이 특별할 필요는 없답니다.',

      // 간단한 행동 추천
      next_actions: [
        { title: '따뜻한 차 한잔', detail: '잠시 멈추고 좋아하는 차를 마시며 쉬어보세요.' },
        { title: '짧은 산책', detail: '10분만 바깥 공기를 마시며 걸어보는 건 어떨까요?' },
      ],

      // 회고 질문
      reflection_question: hasNegative
        ? '오늘 하루 중 그래도 괜찮았던 순간이 있었다면 언제였나요?'
        : '오늘 가장 감사했던 순간은 언제였나요?',

      // 검색/태그용 키워드
      keywords: hasNegative
        ? ['감정', '하루', '피로']
        : ['평온', '일상', '감사'],

      // 책 추천 (콘텐츠 확장용)
      book_recommendations: [
        { rank: 1, title: '감정 수업', author: '마르크 브래킷', category: '심리', description: '감정을 이해하고 다루는 법' },
        { rank: 2, title: '나는 나로 살기로 했다', author: '김수현', category: '에세이', description: '자신을 있는 그대로 받아들이는 이야기' },
        { rank: 3, title: '미움받을 용기', author: '기시미 이치로', category: '철학', description: '아들러 심리학으로 보는 자유와 행복' },
      ],

      // 영화 추천
      movie_recommendations: [
        { rank: 1, title: '인사이드 아웃', overview: '감정들이 머릿속에서 살아간다는 아이디어의 애니메이션' },
        { rank: 2, title: 'her', overview: '고독한 현대인의 감정과 연결에 대한 이야기' },
        { rank: 3, title: '소울', overview: '삶의 의미와 감정의 소중함을 되새기는 애니메이션' },
      ],
    },

    // 안전성 체크 결과 (확장 대비)
    safety_flags: {
      self_harm_risk: false,
      violence_risk: false,
      abuse_risk: false,
  }
  
  }
}

export async function postDiaryEmpathy(diaryText) {
  const payload = typeof diaryText === 'string'
    ? { content: diaryText }
    : diaryText; // 문자열이 들어오면 content로 감싸고, 객체가 들어오면 그대로 사용

  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return getMockResponse(payload.content ?? '');
  }

  const request = {
    //user id 안쓰기로 함
    date: payload.date || new Date().toISOString().split('T')[0],
    content: payload.content || "",
    title: payload.title || "오늘의 일기",
  };

  const accessToken = localStorage.getItem('accessToken');

  const response = await fetch('/api/diary/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error ?? `서버 오류 (${response.status})`);
  }

  return response.json();
}

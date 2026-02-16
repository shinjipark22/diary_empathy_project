const USE_MOCK = true; // AI 서버 연동 시 false로 변경

function getMockResponse(diaryText) {
  const hasNegative = /힘들|슬프|우울|짜증|화가|속상|불안|걱정|외로/.test(diaryText);

  return {
    request_id: crypto.randomUUID(),
    model: { name: 'diary-empathy-ko', version: '1.0.0' },
    output: {
      emotion: hasNegative
        ? [
            { label: '슬픔', intensity: 0.72 },
            { label: '불안', intensity: 0.45 },
          ]
        : [
            { label: '평온', intensity: 0.6 },
            { label: '기쁨', intensity: 0.35 },
          ],
      summary: `"${diaryText.slice(0, 30)}..." 에 대한 하루를 기록하셨네요.`,
      empathy: hasNegative
        ? '오늘 정말 쉽지 않은 하루를 보내셨군요. 그런 감정을 느끼는 건 자연스러운 일이에요.'
        : '오늘 하루도 잘 보내셨네요. 이렇게 기록하는 것 자체가 대단한 일이에요.',
      support: hasNegative
        ? '지금 느끼는 감정은 충분히 이해할 수 있어요. 스스로를 너무 몰아세우지 마세요.'
        : '꾸준히 자신을 돌아보는 습관이 정말 좋아요. 앞으로도 이렇게 기록해보세요.',
      reframe: hasNegative
        ? '힘든 순간도 결국 지나가게 됩니다. 이 경험이 나중에 더 단단한 나를 만들어줄 거예요.'
        : '평범한 하루도 소중한 경험이에요. 매일이 특별할 필요는 없답니다.',
      next_actions: [
        { title: '따뜻한 차 한잔', detail: '잠시 멈추고 좋아하는 차를 마시며 쉬어보세요.' },
        { title: '짧은 산책', detail: '10분만 바깥 공기를 마시며 걸어보는 건 어떨까요?' },
      ],
      reflection_question: hasNegative
        ? '오늘 하루 중 그래도 괜찮았던 순간이 있었다면 언제였나요?'
        : '오늘 가장 감사했던 순간은 언제였나요?',
      safety_flags: {
        self_harm_risk: false,
        violence_risk: false,
        abuse_risk: false,
      },
    },
  };
}

export async function postDiaryEmpathy(diaryText) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return getMockResponse(diaryText);
  }

  const request = {
    request_id: crypto.randomUUID(),
    diary_text: diaryText,
  };

  const response = await fetch('/api/diary/empathy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error ?? `서버 오류 (${response.status})`);
  }

  return response.json();
}

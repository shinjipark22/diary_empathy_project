import EmotionDisplay from './EmotionDisplay';
import './EmpathyResult.css';

/* 서버 응답 구조
  {
  output: {
    emotion: ...,
    summary: ...,
    empathy: ...,
    support: ...,
    reframe: ...,
    reflection_question: ...,
    next_actions: [...],
    safety_flags: {
      self_harm_risk: false,
      violence_risk: false,
      abuse_risk: false
    }
  }
}
*/ 

export default function EmpathyResult({ data }) {
  const { output } = data;
  const hasSafetyRisk = 
    output.safety_flags.self_harm_risk ||
    output.safety_flags.violence_risk ||
    output.safety_flags.abuse_risk;

  return (
    <div className="empathy-result">
      {hasSafetyRisk && (
        <div className="empathy-result__safety-alert">
          힘든 감정이 감지되었습니다. 전문 상담이 필요하시면 정신건강 위기상담 전화
          1577-0199로 연락해 주세요.
        </div>
      )}

      <EmotionDisplay emotions={output.emotion} />

      <section className="empathy-result__section">
        <h3>요약</h3>
        <p>{output.summary}</p>
      </section>

      <section className="empathy-result__section empathy-result__section--highlight">
        <h3>공감</h3>
        <p>{output.empathy}</p>
      </section>

      <section className="empathy-result__section">
        <h3>응원</h3>
        <p>{output.support}</p>
      </section>

      <section className="empathy-result__section">
        <h3>다른 시각</h3>
        <p>{output.reframe}</p>
      </section>

      {output.next_actions.length > 0 && (
        <section className="empathy-result__section">
          <h3>작은 행동 제안</h3>
          <ul className="empathy-result__actions">
            {output.next_actions.map((action, index) => (
              <li key={index}>
                <strong>{action.title}</strong>
                <span>{action.detail}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="empathy-result__section empathy-result__section--question">
        <h3>생각해볼 질문</h3>
        <p>{output.reflection_question}</p>
      </section>
    </div>
  );
}

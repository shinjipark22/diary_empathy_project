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
  const { output, safetyFlags, emotions } = data;
  const hasSafetyRisk =
    safetyFlags?.selfHarmRisk ||
    safetyFlags?.violenceRisk ||
    safetyFlags?.abuseRisk;

  return (
    <div className="empathy-result">
      {hasSafetyRisk && (
        <div className="empathy-result__safety-alert">
          힘든 감정이 감지되었습니다. 전문 상담이 필요하시면 정신건강 위기상담 전화
          1577-0199로 연락해 주세요.
        </div>
      )}

      <EmotionDisplay emotions={emotions} />

      <section className="empathy-result__section">
        <h3>요약</h3>
        <p>{output.summary}</p>
      </section>

      <section className="empathy-result__section empathy-result__section--highlight">
        <h3>공감</h3>
        <p>{output.empathy}</p>
      </section>

      <section className="empathy-result__section empathy-result__section--split">
        <div className="empathy-result__split-item">
          <h3>응원</h3>
          <p>{output.support}</p>
        </div>
        <div className="empathy-result__split-divider" />
        <div className="empathy-result__split-item">
          <h3>다른 시각</h3>
          <p>{output.reframe}</p>
        </div>
      </section>

      {output.nextActions?.length > 0 && (
        <section className="empathy-result__section">
          <h3>작은 행동 제안</h3>
          <ul className="empathy-result__actions">
            {output.nextActions.map((action, index) => (
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
        <p>{output.reflectionQuestion}</p>
      </section>

      {output.keywords?.length>0 && (
        <section className="empathy-result__section">
          <h3>키워드</h3>
          <div className="empathy-result__keywords">
            {output.keywords.map((keyword, index) => (
              <span key={index} className="empathy-result__keyword">
                {keyword}
              </span>
            ))}
        </div>
        </section>
      )
      }

      {output.bookRecommendations?.length > 0 && (
          <section className="empathy-result__section">
            <h3>추천 책</h3>
            <ul className="empathy-result__recommendations">
              {output.bookRecommendations.map((book) => (
                <li key={book.rank}>
                  <strong>{book.rank}. {book.title}</strong> — {book.author}
                  <span className="empathy-result__category">{book.category}</span>
                  <p>{book.description}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {output.movieRecommendations?.length > 0 && (
          <section className="empathy-result__section">
            <h3>추천 영화</h3>
            <ul className="empathy-result__recommendations">
              {output.movieRecommendations.map((movie) => (
                <li key={movie.rank}>
                  <strong>{movie.rank}. {movie.title}</strong>
                  <p>{movie.overview}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
    </div>
  );
}

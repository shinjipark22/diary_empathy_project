import './EmotionDisplay.css';

export default function EmotionDisplay({ emotions }) {
  return (
    <div className="emotion-display">
      <h3 className="emotion-display__title">감정 분석</h3>
      <div className="emotion-display__list">
        {emotions.map((emotion, index) => (
          <div key={index} className="emotion-display__item">
            <span className="emotion-display__label">{emotion.label}</span>
            <div className="emotion-display__bar-bg">
              <div
                className="emotion-display__bar-fill"
                style={{ width: `${emotion.intensity * 100}%` }}
              />
            </div>
            <span className="emotion-display__value">
              {Math.round(emotion.intensity * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

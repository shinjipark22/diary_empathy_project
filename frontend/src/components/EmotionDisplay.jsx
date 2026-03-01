import './EmotionDisplay.css';

/*
  emotions 예시
  {
    '슬픔': 0.72,
    '불안': 0.45,
  }
*/

export default function EmotionDisplay({ emotions }) {
  return (
    <div className="emotion-display">
      <h3 className="emotion-display__title">감정 분석</h3>
      <div className="emotion-display__list">
        {Object.entries(emotions).map(([label, intensity],index)=>(
          <div key = {index} className="emotion-display__item">
            <span className="emotion-display__label">{label}</span>
            <div className="emotion-display__bar-bg"> 
              <div className='emotion-display__bar-fill'
              style ={{width: `${intensity * 100}%`}}
              />

            </div>
           <span className="emotion-display__value">
                {Math.round(intensity * 100)}%
              </span>

          </div>
        ))}
      </div>
    </div>
  );
}

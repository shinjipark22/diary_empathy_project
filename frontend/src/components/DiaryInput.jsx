import { useState } from 'react';
import './DiaryInput.css';


export default function DiaryInput({ onSubmit, isLoading }) {
  const [text, setText] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();//공백 제거
    if (!trimmed) return;
    onSubmit(trimmed); // 부모가 내려준 함수  (DiaryPage.jsx의 handleSubmit 함수가 호출됨)
  };
//button이 클릭되면 handleSubmit 함수가 실행 일기 문자열)
  return (
    <form className="diary-input" onSubmit={handleSubmit}>
      <label htmlFor="diary-text" className="diary-input__label">
        오늘 하루를 기록해보세요
      </label>
      <textarea
        id="diary-text"
        className="diary-input__textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="오늘 있었던 일, 느꼈던 감정을 자유롭게 적어보세요..."
        rows={8}
        disabled={isLoading}
      />
      <button
        type="submit"
        className="diary-input__button"
        disabled={isLoading || !text.trim()}
      >
        {isLoading ? '분석 중...' : '공감 받기'}
      </button>
    </form>
  );
}

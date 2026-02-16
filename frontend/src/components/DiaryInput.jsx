import { useState } from 'react';
import './DiaryInput.css';


export default function DiaryInput({ onSubmit, isLoading, date }) {
  const [text, setText] = useState('');
  const [y,m,d] = date.split('-');
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
        <p><h2>오늘은 {y}년 {m}월 {d}일 입니다. </h2></p>
        <p>오늘 하루를 기록해보세요</p>
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

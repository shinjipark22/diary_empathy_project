import { useState } from 'react';
import './DiaryInput.css';


export default function DiaryInput({ onSubmit, onSave, isLoading, date }) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [y,m,d] = date.split('-');
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedContent = text.trim();//공백 제거
    const trimmedTitle = title.trim();
    if (!trimmedContent) return;
    onSubmit({
      title: trimmedTitle,
      content: trimmedContent,
    }); // 부모가 내려준 함수  (DiaryPage.jsx의 handleSubmit 함수가 호출됨) -> 여기서 부모로 반환
  };
//button이 클릭되면 handleSubmit 함수가 실행 일기 문자열)
  return (
    <form className="diary-input" onSubmit={handleSubmit}>
      <label htmlFor="diary-text" className="diary-input__label">
        <div style={{ marginBottom: '8px' }}>
          <span>선택하신 일자는 </span>
          <h2 style={{ color: '#007bff', margin: '4px 0' }}>
            {y}년 {m}월 {d}일
          </h2>
          <span>입니다.</span>
        </div>
        <p style={{ margin: '4px 0 12px 0' }}>오늘 하루를 기록해보세요</p>
      </label>
      <input type="text" 
        placeholder='제목을 입력하세요'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
      />
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
        type="button"
        className="diary-input__button"
        disabled={isLoading || !text.trim()}
        onClick={() => onSave?.({ title: title.trim(), content: text.trim() })}
      >
        저장
      </button>
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

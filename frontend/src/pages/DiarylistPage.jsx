import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listDiaries } from '../api/diaries';
import './DiarylistPage.css';

function formatDate(dateText) {
  if (!dateText) return '';
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return dateText;
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function DiarylistPage() {
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await listDiaries();
        setDiaries(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message ?? '일기 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  const sortedDiaries = useMemo(() => {
    return [...diaries].sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')));
  }, [diaries]);

  const handleCardClick = (diary) => {
    if (diary?.date) {
      navigate(`/diary/${diary.date}`);
    }
  };

  return (
    <section className="diary-list-page">
      <header className="diary-list-header">
        <h1 className="diary-list-title">내 일기 목록</h1>
        <p className="diary-list-count">총 {sortedDiaries.length}개</p>
      </header>

      {loading && <p className="diary-list-status">일기 목록을 불러오는 중...</p>}
      {!loading && error && <p className="diary-list-status error">{error}</p>}
      {!loading && !error && sortedDiaries.length === 0 && (
        <p className="diary-list-status">아직 작성한 일기가 없어요.</p>
      )}

      {!loading && !error && sortedDiaries.length > 0 && (
        <div className="diary-grid">
          {sortedDiaries.map((diary) => (
            <article
              key={diary.id ?? `${diary.date}-${diary.title}`}
              className="diary-card"
              onClick={() => handleCardClick(diary)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleCardClick(diary);
                }
              }}
            >
              <p className="diary-card-date">{formatDate(diary.date)}</p>
              <h2 className="diary-card-title">{diary.title || '제목 없는 일기'}</h2>
              <p className="diary-card-content">{diary.content || '내용이 없습니다.'}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

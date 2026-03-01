import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { listDiaries } from '../api/diaries';
import { getMyStats } from '../api/user';
import './CalendarPage.css';
import note from '../assets/note.png';
import statsicon from '../assets/stats.png';

export default function CalendarPage() {
  const navigate = useNavigate();
  const [writtenDates, setWrittenDates] = useState(new Set());
  // 백엔드 연결 전 목데이터 - 연결 후 null로 변경
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const diaries = await listDiaries();
        const dates = new Set(diaries?.map((d) => d.date) ?? []);
        setWrittenDates(dates);
      } catch {
        // 조회 실패 시 표시 없이 진행
      }
    };
    const fetchStats = async () => {
      try {
        const data = await getMyStats();
        setStats(data);
      } catch {
        // 통계 조회 실패 시 표시 없이 진행
      }
    };

    fetchDates();
    fetchStats();
  }, []);

  const handleClick = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    navigate(`/diary/${y}-${m}-${d}`);
  };

  // 일기 작성된 날짜에 점 표시
  const tileContent = ({ date }) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const formatted = `${y}-${m}-${d}`;
    return writtenDates.has(formatted) ? (
      <div
        style={{
          width: 6,
          height: 6,
          background: '#007bff',
          borderRadius: '50%',
          margin: '2px auto 0',
        }}
      />
    ) : null;
  };

  return (
    <div className="calendar-container">
      <Calendar onClickDay={handleClick} tileContent={tileContent} />
      {/* 통계 컨테이너 */}
      {stats && (
        <div className="stats-container">
          <div className="stats-card" onClick={()=>navigate('/list')}>
            <img className="stats-icon" src={note} alt="일기 아이콘" / >
            <p className="stats-label">지금까지 작성한 일기</p>
            <p className="stats-value">{stats.total_count}<span className="stats-unit">개</span></p>
          </div>
          <div className="stats-card">
            <img className="stats-icon" src={statsicon} alt="통계 아이콘" />
            <p className="stats-label">최다 빈도 감정</p>
            <p className="stats-value">{stats.top_emotion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
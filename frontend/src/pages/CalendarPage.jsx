import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { listDiaries } from '../api/diaries';
import { getMyStats } from '../api/user';
import './CalendarPage.css';

export default function CalendarPage() {
  const navigate = useNavigate();
  const [writtenDates, setWrittenDates] = useState(new Set());
  // 백엔드 연결 전 목데이터 - 연결 후 null로 변경
  const [stats, setStats] = useState({ total_count: 100, top_emotion: '기쁨' });

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
    const formatted = date.toISOString().split('T')[0];
    navigate(`/diary/${formatted}`);
  };

  // 일기 작성된 날짜에 점 표시
  const tileContent = ({ date }) => {
    const formatted = date.toISOString().split('T')[0];
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Calendar onClickDay={handleClick} tileContent={tileContent} />
      {/* 통계 컨테이너 */}
      {stats && (
        <div style={{ marginTop: 24, padding: '16px 24px', border: '1px solid #ddd', borderRadius: 8, textAlign: 'center' }}>
          <p>총 작성 수: <strong>{stats.total_count}</strong>개</p>
          <p>최애 감정: <strong>{stats.top_emotion}</strong></p>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile } from '../api/user';

export default function Header() {
  const navigate = useNavigate();
  // 백엔드 연결 전 목데이터 - 연결 후 null로 변경
  const [profile, setProfile] = useState({ nickname: '테스트유저', profile_image: 'https://via.placeholder.com/36' });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    getMyProfile()
      .then(setProfile)
      .catch(() => {});
  }, []);

  return (
    <header className="diary-page__header">
      <h1 className="diary-page__title">감정 캘린더 서비스</h1>
      <p className="diary-page-main">오늘의 감정을 기록하고, AI의 따뜻한 공감을 받아보세요.</p>
      {profile && (
        <div
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <img
            src={profile.profile_image}
            alt="프로필"
            style={{ width: 36, height: 36, borderRadius: '50%' }}
          />
          <span>{profile.nickname}</span>
        </div>
      )}
    </header>
  );
}

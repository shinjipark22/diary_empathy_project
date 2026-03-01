import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile } from '../api/user';
import heart from '../assets/Heart.png';
import './Header.css';

export default function Header() {
  
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ 
    nickname: '로그인 해주세요', 
    profile_image: 'https://via.placeholder.com/38' 
  });

  useEffect(() => {
  
    
    
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    getMyProfile()
      .then(setProfile)
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    
     window.location.replace('/login');
  };

  return (
    <>
      <header className="custom-header">
      <div className='header-group' onClick={()=>navigate('/')}>
        <img className ="header-logo" src={heart} alt="로고" />
        <div className="header-text-group">
          
          <div className='header-title-row'>
           
            <h1 className="header-title">
            당신만을 위한 공감 다이어리</h1>
            
          </div>
          
          <p className="header-subtitle">당신의 소중한 일상을 이곳에 기록해주세요.</p>
        </div>
        </div>
        
        

     
        <div className="header-actions">
          {profile && profile.nickname !== '로그인 해주세요' && (
            <div 
              className="profile-btn" 
              onClick={() => navigate('/profile')}
              title="프로필 보기"
            >
              <img
                src={profile.profile_image}
                alt="프로필"
                className="profile-avatar"
              />
              <span className="profile-name">{profile.nickname}</span>
            </div>
          )}
            {profile && profile.nickname !== '로그인 해주세요' &&(
          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
            )
          }
        </div>
      </header>

  
    </>
  );
  
}
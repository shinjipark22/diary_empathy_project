import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile } from '../api/user';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setNickname(data.nickname ?? '');
        setProfileImage(data.profile_image ?? '');
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMyProfile({ nickname, profile_image: profileImage });
      setMessage('프로필이 수정되었습니다.');
      setIsSuccess(true);
    } catch (err) {
      setMessage(err.message);
      setIsSuccess(false);
    }
  };

  return (
    <div className="profile-page">
      <button className="profile-page__back" onClick={() => navigate(-1)}>
        ← 뒤로
      </button>
      <div className="profile-page__card">
        <h2 className="profile-page__title">프로필 수정</h2>
        <div className="profile-page__avatar-wrap">
          {profileImage ? (
            <img
              className="profile-page__avatar"
              src={profileImage}
              alt="프로필"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="profile-page__avatar-fallback">👤</div>
          )}
        </div>
        <form className="profile-page__form" onSubmit={handleSubmit}>
          <div className="profile-page__field">
            <label className="profile-page__label">닉네임</label>
            <input
              className="profile-page__input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
            />
          </div>
          <div className="profile-page__field">
            <label className="profile-page__label">프로필 사진 URL</label>
            <input
              className="profile-page__input"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="이미지 URL을 입력하세요"
            />
          </div>
          {message && (
            <p className={`profile-page__message ${isSuccess ? 'profile-page__message--success' : 'profile-page__message--error'}`}>
              {message}
            </p>
          )}
          <button type="submit" className="profile-page__submit">저장</button>
        </form>
      </div>
    </div>
  );
}

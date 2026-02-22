import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile } from '../api/user';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [message, setMessage] = useState(null);

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
      setMessage('수정 완료!');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)}>← 뒤로</button>
      <h2>프로필 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>닉네임</label>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </div>
        <div>
          <label>프로필 사진 URL</label>
          <input value={profileImage} onChange={(e) => setProfileImage(e.target.value)} />
        </div>
        <button type="submit">저장</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

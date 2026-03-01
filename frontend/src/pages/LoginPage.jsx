import './LoginPage.css';

//login Page 구성 -> 기본 주소는 http://localhost:8081으로 세팅해둠 -> 추후 변경시 수정하면 됨
export default function LoginPage() {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    return <div className='login-page' >
        <h1 className="login-title">당신의 하루를, 이곳에 기록하세요</h1>
        <div className='subtitle-box'>
             <h2 className='login-subtitle'>카카오 로그인으로 시작하기</h2>
        <button className="login-button" style={{ border: 'none', background: 'none' }} onClick={() => window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`}><img src="/src/assets/kakao_login_medium_narrow.png" alt="Login Button"></img></button>
        
        </div>
       
      
    </div>
}
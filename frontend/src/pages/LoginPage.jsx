import './LoginPage.css';

//login Page 구성 -> 기본 주소는 http://localhost:8080으로 세팅해둠 -> 추후 변경시 수정하면 됨
export default function LoginPage() {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    return <div className='login-page' >
       <button className="login-button" style={{ border: 'none', background: 'none' }} onClick={() => window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`}><img src="/src/assets/kakao_login_medium_narrow.png" alt="Login Button"></img></button>
    </div>
}
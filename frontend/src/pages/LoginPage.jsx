import './LoginPage.css';

//login Page 구성 -> 기본 주소는 http://localhost:8080으로 세팅해둠 -> 추후 변경시 수정하면 됨
export default function LoginPage() {
    return <div className='login-page' >
       <button className="login-button" style={{ border: 'none', background: 'none' }} onClick={() => window.location.href = 'http://localhost:8080/auth/login'}><img src="/src/assets/kakao_login_medium_narrow.png" alt="Login Button"></img></button>
    </div>
}
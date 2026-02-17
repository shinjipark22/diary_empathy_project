//카카오 로그인 리다이렉트 링크를 이 페이지로 해둬야 함
//벡엔드로 인가 코드 보내서 토큰 받고, 토큰이 있으면 로그인 성공 -> 메인 페이지로 이동
//로그인 실패하면 로그인 페이지로 다시 이동
//로그인 성공 시, 신규 사용자면 온보딩 페이지로 이동, 기존 사용자면 메인 페이지로 이동 -> 온보딩 페이지 아직 구현 안함
import { useEffect } from "react";
import { useNavigate,useSearchParams } from "react-router-dom";
import { postKakaoLogin } from "../api/auth";

export default function AuthCallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    useEffect(() => {
        const run  = async() =>{
            const code = searchParams.get('code');
            if (!code) {
                navigate('/login',{ replace: true });
                return;
            }
            try{
            
                const data = await postKakaoLogin(code); //인가 코드를 백엔드로 보내서 토큰 받는 함수 (api/auth.js에 구현){token, is_new_user} 형태의 응답 예상
                
                localStorage.setItem('accessToken', data.token);//로컬 스토리지에 토큰 저장
                if (data.is_new_user) {
                    navigate('/onboarding', { replace: true }); // 라우트 없으면 '/'로 변경
                    return;

                }
                navigate('/', { replace: true });
                


        } catch (error) {
            console.error(error);
            navigate('/login', { replace: true });
        }
    };

    run();
    }, [navigate, searchParams]);
    return <div>로그인 중...</div>;

}

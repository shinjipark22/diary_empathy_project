//URL에 토큰이 표현되어 있지 않으면 제대로 작동 안함

import { useEffect } from "react";
import { useNavigate,useSearchParams } from "react-router-dom";

export default function AuthCallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    useEffect(() => {
        const accessToken = searchParams.get('accessToken') || searchParams.get('token'); //token이나 accessToken 뒤에 붙어 있는 값을 토큰으로 긁어옴
        const userId = searchParams.get('userId') || searchParams.get('user_id'); //userId나 id 뒤에 붙어 있는 값을 userId로 긁어옴
        if (!accessToken) {
        navigate('/login', { replace: true });
         return;
        }
        localStorage.setItem('accessToken', accessToken); //토큰을 localStorage에 저장(앞에 값이 로컬에 저장되는 변수 명, 뒤에값이 value)
        localStorage.setItem('userId', userId);
        navigate('/', { replace: true });

    }, [navigate, searchParams]);
    return <div>로그인 중...</div>;
}
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // SPA환경에서 자동으로 조건을 만족할 때, 이동시키기 위해 사용
import { useLogin } from '../contexts/LoginContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    useEffect(() => {
        // 쿠키에서 이메일 불러오기
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=').map(c => c.trim());
            acc[key] = value;
            return acc;
        }, {});

        if (cookies.savedEmail) {
            setEmail(cookies.savedEmail);
            setRemember(true);
        }
    }, []);

    // form 데이터 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (remember) {
            document.cookie = `savedEmail=${email}; path=/; max-age=604800`;
        } else {
            document.cookie = `savedEmail=; path=/; max-age=0`;
        }

        try {
            const response = await fetch('/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (result.success) {
                login(result.user);
                navigate('/');
            } else {
                alert(result.message)
            }
        } catch (err) {
            console.error('로그인 요청 에러:', err);
        }
    };

    return (
        <div className='flex justify-center'>
            <div className='w-[400px] flex flex-col items-center p-[40px] gap-[16px]'>
                <h2 className='text-blue text-2xl'>Login</h2>
                <form className='flex flex-col w-full gap-[16px]' id='login-form' onSubmit={handleSubmit}>
                    <input className='h-[50px] rounded-[10px] border border-[#ced4da] pl-[10px]' type="text" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input className='h-[50px] rounded-[10px] border border-[#ced4da] pl-[10px]' type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <div className='text-gray flex justify-between'>
                        <label htmlFor="remember-check">
                            <input type="checkbox" name="remember-check" onChange={(e) => setRemember(e.target.checked)} />
                            아이디 저장하기
                        </label>
                        <Link to="/account">회원가입</Link>
                    </div>
                    <input className='bg-blue h-[50px] text-white rounded-[10px] border border-[#ced4da]' type="submit" value="Login" />
                </form>
            </div>
        </div>

    );
};

export default Login
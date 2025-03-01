import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');

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
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            console.log(result)

            if (result.success) {
                // 로그인 성공 시 페이지 이동이나 상태 업데이트
                alert('로그인 성공!');
            } else {
                alert(result.message)
            }
        } catch (err) {
            setError('서버와 통신 중 오류가 발생했습니다.');
            console.error('로그인 요청 에러:', err);
        }
    };

    return (
        <div className='display-flex justify-center'>
            <div className='width-[400px] display-flex flex-col items-center p-[40px] gap[16px]'>
                <h2 className='text-blue'>Login</h2>
                <form className='display-flex flex-col gap[16px]' id='login-form' onSubmit={handleSubmit}>
                    <input className='width-[25] height-[50px] rounded-[10px] border-[#ced4da] pl-[10px]' type="text" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input className='width-[25] height-[50px] rounded-[10px] border-[#ced4da] pl-[10px]' type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <div className='text-gray display-flex justify-betweeb'>
                        <label htmlFor="remember-check">
                            <input type="checkbox" name="remember-check" onChange={(e) => setRemember(e.target.checked)} />
                            아이디 저장하기
                        </label>
                        <Link to="/account">회원가입</Link>
                    </div>
                    <input className='bg-blue height-[50px] text-white rounded-[10px] border-[#ced4da]' type="submit" value="Login" />
                </form>
            </div>
        </div>

    );
};

export default Login
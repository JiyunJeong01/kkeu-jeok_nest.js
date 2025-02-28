import React from 'react'
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className='display-flex justify-center'>
            <div className='width-[400px] display-flex flex-col items-center p-[40px] gap[16px]'>
                <h2 className='text-blue'>Login</h2>
                <form className='display-flex flex-col gap[16px]' id='login-form'>
                    <input className='width-[25] height-[50px] rounded-[10px] border-[#ced4da] pl-[10px]' type="text" name="email" placeholder="Email" />
                    <input className='width-[25] height-[50px] rounded-[10px] border-[#ced4da] pl-[10px]' type="password" name="password" placeholder="Password" />
                    <div className='text-gray display-flex justify-betweeb'>
                        <label htmlFor="remember-check">
                            <input type="checkbox" name="remember-check" />
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
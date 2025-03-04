import React, { useState, useEffect } from 'react';
import Tap from '../partials/Tap'
import Memo from './Memo';
import MemoCreate from './MemoCreate';

const MemoBoard = () => {
    const [memos, setMemos] = useState([]);

    // fetch와 .json()이 Promise를 반환하기 때문에, 비동기 처리가 필요함.
    useEffect(() => {
        const fetchMemos = async () => {
            try {
                const response = await fetch('/memo', {
                    method: 'GET',
                    //credentials: 'include',
                });

                const result = await response.json();

                if (result.success === true) {
                    setMemos(result.memos);
                } else {
                    console.error('메모 불러오기 실패:', result.message);
                }
            } catch (err) {
                console.error('메모 요청 에러:', err);
            }
        };

        fetchMemos();
    }, [memos]);

    return (
        <div>
            <h1 className='text-center'> 메모입니다.</h1>
            <MemoCreate></MemoCreate>
            <div className='display-flex flex-col'>
                <Tap></Tap>
                <Memo memos={memos}></Memo>
            </div>
        </div>
    );
};

export default MemoBoard
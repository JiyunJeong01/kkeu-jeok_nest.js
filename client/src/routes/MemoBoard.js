import React from 'react'
import Tap from '../partials/Tap'
import Memo from './Memo';

const MemoBoard = () => {
    return (
        <div>
            <h1 className='text-center'> 메모입니다.</h1>
            <div className='display-flex flex-col'>
                <Tap></Tap>
                <Memo></Memo>
            </div>
        </div>
    );
};

export default MemoBoard
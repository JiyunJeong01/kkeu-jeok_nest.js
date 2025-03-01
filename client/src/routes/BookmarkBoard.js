import React from 'react'
import Tap from '../partials/Tap'
import Memo from './Memo';

const BookmarkBoard = () => {
    return (
        <div>
            <h1 className='text-center'> 북마크입니다.</h1>
            <div className='display-flex flex-col'>
                <Tap></Tap>
                <Memo></Memo>
            </div>
        </div>
    );
};

export default BookmarkBoard
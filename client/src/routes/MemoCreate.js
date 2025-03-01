import React from 'react'

const MemoCreate = () => {
    return (
        <div className="display-flex justify-center items-center">
            <form name="postForm" encType="multipart/form-data"
                className="width-[535px] min-height-[145px] bg-white rounded-[10px] position-relative">
                <textarea
                    className="width-[505px] min-height-[120px] border-none p-[15px]"
                    placeholder="무엇을 저장할까요?"
                    name="content"
                    cols="30"
                    rows="1"
                />
                <div className="row row-cols-4 imageContainer"></div>
                <div className="fileContainer"></div>
                <span className="material-symbols-outlined image">image</span>
                <span className="material-symbols-outlined file">attach_file</span>
                <button type="submit">
                    <img className="send" src="/img/send.png" alt="" />
                </button>
            </form>
        </div>
    );
};

export default MemoCreate
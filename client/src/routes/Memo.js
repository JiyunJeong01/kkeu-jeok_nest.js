import React, { useState } from 'react';

const Memo = ({ memos }) => {
    const [editingMemoId, setEditingMemoId] = useState(null);  // 개별 memo의 editing 상태를 관리

    const handleEditClick = (memoId) => {
        setEditingMemoId(memoId); // 특정 memo의 편집 상태 토글
    };

    const handleDoneClick = () => {
        setEditingMemoId(null); // 편집 종료
    };

    return (
        <div className='display-flex flex-col items-center gap[16px] m-[15px]'>
            {memos.map((memo) => (
                <div
                    key={memo.id}
                    className='display-flex flex-col width-[535px] bg-white rounded-[10px] pl-[15px] pr-[15px] gap[5px] position-relative'>
                    <div className='text-size[11px] text-gray pt-[10px]'>
                        {toDateString(memo.createdAt)}
                    </div>

                    {/* 개별 memo의 편집 상태 관리 */}
                    {editingMemoId === memo.id ? (
                        <textarea
                            className='width-[505px] border-none'
                            name="content"
                            cols="30"
                            rows="1"
                            value={memo.content}
                            onChange={(e) => {/* 상태 업데이트 로직 필요 */}}
                        />
                    ) : (
                        <div className='width-[505px]'>
                            {memo.content}
                        </div>
                    )}

                    {/* 파일 렌더링 */}
                    <div className='m-[0px]'>
                        {memo.files && (
                            <>
                                <div className="row row-cols-4">
                                    {memo.files
                                        .filter(file => file.type.startsWith('image/'))
                                        .map((file, index) => (
                                            <div key={index} className='rounded-[10px]'>
                                                <img className='width-[100%] height-[100%] cover rounded-[10px]' src={file.downloadURL} alt={file.fileName}></img>
                                            </div>
                                        ))}
                                </div>

                                <div>
                                    {memo.files
                                        .filter(file => !file.type.startsWith('image/'))
                                        .map((file, index) => (
                                            <a key={index} href={file.downloadURL} download>
                                                <div className='display-flex border-[#ced4da] rounded-[30px] p-[10px]'>
                                                    <span className="material-symbols-outlined pl-[5px]">attach_file</span>
                                                    <span className='pl-[5px]'>{file.fileName}</span>
                                                </div>
                                            </a>
                                        ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* 편집 및 삭제 아이콘 */}
                    <div className='height-[35px]'>
                        {editingMemoId === memo.id ? (
                            <span className="material-symbols-outlined image">image</span>
                        ) : null}
                        {editingMemoId === memo.id ? (
                            <span className="material-symbols-outlined file">attach_file</span>
                        ) : null}
                        <span className="material-symbols-outlined star">kid_star</span>
                        {editingMemoId === memo.id ? (
                            <img className="icon-end-edit" src="/img/done.png" alt="" onClick={handleDoneClick} />
                        ) : (
                            <img className="icon-start-edit" src="/img/edit.png" alt="" onClick={() => handleEditClick(memo.id)} />
                        )}
                        <img className="icon-delete" src="/img/delete.png" alt="" />
                    </div>
                </div>
            ))}
        </div>
    );
};

// timestamp 변경
const toDateString = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return '';  // 예외처리
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();  // "2025-03-03 15:30:00" 이런식으로 출력
};

export default Memo;

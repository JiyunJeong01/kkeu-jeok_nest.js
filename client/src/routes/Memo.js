import React, { useState } from 'react';

const Memo = ({ memos, setMemos  }) => {
    const [editingMemoId, setEditingMemoId] = useState(null);  // 개별 memo의 editing 상태를 관리

    const handleEditClick = (memoId) => {
        setEditingMemoId(memoId); // 특정 memo의 편집 상태 토글
    };

    const handleDoneClick = () => {
        setEditingMemoId(null); // 편집 종료
    };

    // 삭제 기능 추가
    const handleDeleteClick = async (memoId) => {
        try {
            const response = await fetch(`/memo/${memoId}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (result.success) {
                // 삭제 성공 시, memos 상태에서 해당 memo 제거
                setMemos((prevMemos) => prevMemos.filter(memo => memo.id !== memoId));
                alert(result.message);
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error('메모 삭제 에러:', err);
            alert('메모 삭제 중 오류 발생');
        }
    };

    return (
        <div className='flex flex-col items-center gap-4 m-4'>
            {memos.map((memo) => (
                <div
                    key={memo.id}
                    className='flex flex-col w-[535px] bg-white rounded-lg pl-[15px] pr-[15px] gap-1 relative'>
                    <div className='text-xs text-gray pt-2'>
                        {toDateString(memo.createdAt)}
                    </div>

                    {/* 개별 memo의 편집 상태 관리 */}
                    {editingMemoId === memo.id ? (
                        <textarea
                            className='w-[505px] border-none'
                            name="content"
                            cols="30"
                            rows="1"
                            value={memo.content}
                            onChange={(e) => {/* 상태 업데이트 로직 필요 */}}
                        />
                    ) : (
                        <div className='w-[505px]'>
                            {memo.content}
                        </div>
                    )}

                    {/* 파일 렌더링 */}
                    <div>
                        {memo.files && (
                            <>
                                <div className="grid grid-cols-4 gap-2">
                                    {memo.files
                                        .filter(file => file.type.startsWith('image/'))
                                        .map((file, index) => (
                                            <div key={index} className='rounded-[10px]'>
                                                <img className='w-full h-full object-cover rounded-lg' src={file.downloadURL} alt={file.fileName}></img>
                                            </div>
                                        ))}
                                </div>

                                <div>
                                    {memo.files
                                        .filter(file => !file.type.startsWith('image/'))
                                        .map((file, index) => (
                                            <a key={index} href={file.downloadURL} download>
                                                <div className='flex border border-gray-300 rounded-full p-2'>
                                                    <span className="material-symbols-outlined pl-1">attach_file</span>
                                                    <span className='pl-1'>{file.fileName}</span>
                                                </div>
                                            </a>
                                        ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* 편집 및 삭제 아이콘 */}
                    <div className='h-[40px]'>
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
                        <img className="icon-delete" src="/img/delete.png" alt="" onClick={() => handleDeleteClick(memo.id)}/>
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

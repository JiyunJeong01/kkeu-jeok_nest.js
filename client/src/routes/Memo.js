import React, { useState, useRef } from 'react';

const Memo = ({ memos, setMemos }) => {
    const [images, setImages] = useState([]);
    const [file, setFile] = useState(null);
    const [deleteFiles, setDeleteFiles] = useState([]);  // 삭제된 이미지 관리
    const [content, setContent] = useState('');
    const fileInputRef = useRef(null);
    const documentInputRef = useRef(null);

    const maxImages = 4;

    const [editingMemoId, setEditingMemoId] = useState(null); // 개별 memo의 editing 상태를 관리

    // 편집 시작
    const handleEditClick = (memoId, content) => {
        setEditingMemoId(memoId);
        setContent(content); // 해당 메모의 내용을 content에 설정
    };

    // 편집 완료
    const handleDoneClick = async (memoId) => {
        setEditingMemoId(null); // 편집 종료
        await handleUpdate(memoId); // 수정된 데이터 전송
    };

    // 이미지 선택 핸들러
    const handleImageSelect = () => {
        if (images.length >= maxImages) {
            alert(`이미지는 최대 ${maxImages}개까지 추가할 수 있습니다.`);
            return;
        }
        fileInputRef.current?.click();
    };

    // 파일 선택 핸들러
    const handleFileSelect = () => {
        if (file) {
            alert('이미 파일을 추가했습니다. 기존 파일을 삭제하고 새 파일을 추가해주세요.');
            return;
        }
        documentInputRef.current?.click();
    };

    // 이미지 업로드 처리
    const handleImageUpload = (event) => {
        const files = event.target.files;

        if (files.length + images.length > maxImages) {
            alert(`이미지는 최대 ${maxImages}개까지 추가할 수 있습니다.`);
            return;
        }

        const newImages = Array.from(files).map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages(prevImages => [...prevImages, ...newImages]);
    };

    // 파일 업로드 처리
    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
    };

    // 이미지 삭제
    const removeImage = (index, memoId) => {
        setMemos((prevMemos) =>
            prevMemos.map((memo) =>
                memo.id === memoId
                    ? { ...memo, files: memo.files.filter((_, i) => i !== index) }
                    : memo
            )
        );
        const deleteImage = index;
        setDeleteFiles(prev => [...prev, deleteImage]); 
    };

    const removeFile = (index, memoId) => {
        setMemos((prevMemos) =>
            prevMemos.map((memo) =>
                memo.id === memoId
                    ? { ...memo, files: memo.files.filter((_, i) => i !== index) }
                    : memo
            )
        );
        const deleteImage = index;
        setDeleteFiles(prev => [...prev, deleteImage]); 
    };

    // 텍스트 변경
    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    // 수정 요청 처리
    const handleUpdate = async (memoId) => {
        const formData = new FormData();
        formData.append('content', content);
        images.forEach(img => {
            if (img.file) {
                formData.append('files', img.file); // 새로 추가된 파일만 전송
            }
        });
        if (file) {
            formData.append('files', file);
        }

        // 삭제된 이미지들을 전송 (서버에서 삭제해야 할 이미지들)
        deleteFiles.forEach(file => {
            formData.append('deletedFiles', file.id); // 파일 ID를 서버에 보내서 삭제
        });

        try {
            const response = await fetch(`/memo/${memoId}`, {
                method: 'PUT',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error('메모 수정 요청 에러:', err);
        }
    };

    // 삭제 기능 추가
    const handleDeleteClick = async (memoId) => {
        try {
            const response = await fetch(`/memo/${memoId}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (result.success) {
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
                            value={content}  // 수정 중인 내용은 content로 관리
                            onChange={handleContentChange}
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
                                            <div key={index} className='rounded-[10px] relative'>
                                                <img className='w-full h-auto object-cover rounded-[10px]' src={file.downloadURL} alt={file.fileName}></img>
                                                {editingMemoId === memo.id && (
                                                    <span className="material-symbols-outlined icon-close" onClick={() => removeImage(index, memo.id)}>close</span>
                                                )}
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
                                                    {editingMemoId === memo.id && (
                                                        <span className="material-symbols-outlined icon-close" onClick={() => removeFile(index, memo.id)}>close</span>
                                                    )}
                                                </div>
                                            </a>
                                        ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* 숨겨진 이미지 파일 input */}
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                    />

                    {/* 숨겨진 일반 파일 input */}
                    <input
                        type="file"
                        ref={documentInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                    />

                    {/* 편집 및 삭제 아이콘 */}
                    <div className='h-[40px]'>
                        {editingMemoId === memo.id && (
                            <>
                                <span className="material-symbols-outlined image" onClick={handleImageSelect}>image</span>
                                <span className="material-symbols-outlined file" onClick={handleFileSelect}>attach_file</span>
                            </>
                        )}
                        <span className="material-symbols-outlined star">kid_star</span>
                        {editingMemoId === memo.id ? (
                            <img className="icon-end-edit" src="/img/done.png" alt="" onClick={() => handleDoneClick(memo.id)} />
                        ) : (
                            <img className="icon-start-edit" src="/img/edit.png" alt="" onClick={() => handleEditClick(memo.id, memo.content)} />
                        )}
                        <img className="icon-delete" src="/img/delete.png" alt="" onClick={() => handleDeleteClick(memo.id)} />
                    </div>
                </div>
            ))}
        </div>
    );
};

// timestamp 변경
const toDateString = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return ''; // 예외처리
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();  // "2025-03-03 15:30:00" 이런식으로 출력
};

export default Memo;

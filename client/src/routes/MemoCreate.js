import React, { useState, useRef } from 'react';

const MemoCreate = () => {
    const [images, setImages] = useState([]);
    const [file, setFile] = useState(null); // 파일은 1개만 허용
    const [content, setContent] = useState(''); // 텍스트 내용 상태 추가
    const fileInputRef = useRef(null);
    const documentInputRef = useRef(null); // 파일 업로드용 ref

    const maxImages = 4;

    // 이미지 선택 핸들러
    const handleImageSelect = () => {
        if (images.length >= maxImages) {
            alert(`이미지는 최대 ${maxImages}개까지 추가할 수 있습니다.`);
            return;
        }
        fileInputRef.current?.click();
    };

    // 일반 파일 선택 핸들러 (1개만)
    const handleFileSelect = () => {
        if (file) {
            alert('이미 파일을 추가했습니다. 기존 파일을 삭제하고 새 파일을 추가해주세요.');
            return;
        }
        documentInputRef.current?.click();
    };

    // 이미지 업로드 처리 및 미리보기 추가
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

    // 일반 파일 업로드 처리 (1개만)
    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
    };

    // 이미지 삭제
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // 파일 삭제
    const removeFile = () => {
        setFile(null);
    };

    // 텍스트 내용 변경
    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    // 폼 제출
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('content', content);  // 텍스트 내용 추가
        images.forEach(img => formData.append('files', img.file));  // 이미지 파일 추가
        if (file) formData.append('files', file);    // 일반 파일 추가

        try {
            const response = await fetch('/memo', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                // 초기화
                setContent('');
                setImages([]);
                setFile(null);
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error('메모 요청 에러:', err);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit} className="w-[535px] min-h-[145px] bg-white rounded-[10px] relative">

                {/* 텍스트 입력 */}
                <textarea
                    className="w-[505px] min-h-[120px] border-none p-[15px]"
                    placeholder="무엇을 저장할까요?"
                    name="content"
                    value={content}
                    onChange={handleContentChange}
                    rows="1"
                />

                {/* 이미지 미리보기 */}
                <div className="grid grid-cols-4 gap-2 m-0">
                    {images.map((image, index) => (
                        <div key={index} className="rounded-[10px] relative">
                            <img src={image.preview} alt={`upload-${index}`} className="w-full h-auto object-cover rounded-[10px]" />
                            <span className="material-symbols-outlined icon-close" onClick={() => removeImage(index)}>close</span>
                        </div>
                    ))}
                </div>

                {/* 파일 미리보기 */}
                {file && (
                    <a href={file.downloadURL} download>
                        <div className='flex border border-[#ced4da] rounded-[30px] p-[10px] relative'>
                            <span className="material-symbols-outlined pl-[5px]">attach_file</span>
                            <span className='pl-[5px]'>{file.name}</span>
                            <span className="material-symbols-outlined icon-close" onClick={removeFile}>close</span>
                        </div>
                    </a>
                )}

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

                {/* 버튼 영역 */}
                <div className='h-[35px] pt-[5px]'>
                    <span className="material-symbols-outlined image" onClick={handleImageSelect}>image</span>
                    <span className="material-symbols-outlined file" onClick={handleFileSelect}>attach_file</span>
                    <button type="submit">
                        <img className="send" src="/img/send.png" alt="" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MemoCreate;

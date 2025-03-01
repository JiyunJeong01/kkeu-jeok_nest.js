import React, { useState } from 'react';

const Memo = () => {

    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className='display-flex justify-center m-[15px]'>
            <div className='width-[535px] min-height-[145px] bg-white rounded-[10px] pl-[15px] pr-[15px] position-relative '>
                <div className='text-size[11px] text-gray pt-[10px]'>
                    2025-00-00 00:00
                </div>
                {!isEditing &&(<div className='width-[505px] pt-[5px]'>
                    여기에 적은 내용이 들어감
                </div>)}
                {isEditing && (<textarea className='width-[505px] border-none pt-[5px]'
                    name="content"
                    cols="30"
                    rows="1">
                    여기에 수정할 텍스트 내용이 들어감
                </textarea>)}

                <div className="row row-cols-4 m-[0px] pt-[5px]">
                    <div className='bg-blue height-[35px] rounded-[10px]'> </div>
                    <div className='bg-blue height-[35px] rounded-[10px]'> </div>
                    <div className='bg-blue height-[35px] rounded-[10px]'> </div>
                    <div className='bg-blue height-[35px] rounded-[10px]'> </div>
                </div>

                <div className='pt-[5px]'>
                    여기에 파일 미리보기가 들어감
                </div>

                <div className='height-[35px]'>
                    {isEditing && (<span className="material-symbols-outlined image">image</span>)}
                    {isEditing && (<span className="material-symbols-outlined file">attach_file</span>)}
                    <span class="material-symbols-outlined star">kid_star</span>
                    {isEditing ? 
                    (<img class="icon-end-edit" src="/img/done.png" alt="" onClick={() => setIsEditing(false)}></img>) 
                    : (<img class="icon-start-edit" src="/img/edit.png" alt="" onClick={() => setIsEditing(true)}></img>)}
                    <img class="icon-delete" src="/img/delete.png" alt=""></img>
                </div>
            </div>
        </div>

    );
};

export default Memo
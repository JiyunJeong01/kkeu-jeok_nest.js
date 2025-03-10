import { Controller, Get, Put, Post, Res, Body, Session, UploadedFiles, UseInterceptors, Delete, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { MemoService } from './memo.service';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('memo')
export class MemoController {
    constructor(private readonly memoService: MemoService) { }

    // 메모 조회하기
    @Get()
    async memoPage(@Session() session: Record<string, any>, @Res() res: Response) {

        // 세션 정보 조회 = 사용자가 있는지 확인
        if (!session.user) {
            return res.json({ success: false, message: '재로그인 후 시도해주세요' });
        }

        const userId = session.user.id;
        const memos = await this.memoService.findByUserId(userId);
        return res.json({ success: true, memos }); // memos 전달
    }

    // 메모 생성
    @Post()
    @UseInterceptors(FilesInterceptor('files'))
    async createMemo(@Session() session: Record<string, any>, @Body('content') content: string, @UploadedFiles() files: Array<Express.Multer.File>, @Res() res: Response) {
        
        // 세션 정보 조회 = 사용자가 있는지 확인
        if (!session.user) {
            return res.json({ success: false, message: '재로그인 후 시도해주세요' });
        }
        console.log(files);
        console.log(content);
        console.log(session.user.id);

        const userId = session.user.id;
        await this.memoService.createMemo(userId, content, files);
        return res.json({ success: true, message: "메모가 생성되었습니다." }); 
    }

    // 메모 수정
    @Put('/:memoId')
    @UseInterceptors(FilesInterceptor('files'))
    async modifiedMemo(@Session() session: Record<string, any>, @Body('content') content: string, @UploadedFiles() files: Array<Express.Multer.File>, @Param('memoId') memoId: string, @Res() res: Response) {
        // 세션 정보 조회 = 사용자가 있는지 확인
        if (!session.user) {
            return res.json({ success: false, message: '재로그인 후 시도해주세요' });
        }
        const userId = session.user.id;
        console.log(files);
        console.log(content);
        console.log(memoId);

        // await this.memoService.modifiedMemo(userId, memoId, content, files);

        return { message: "메모가 성공적으로 수정되었습니다." };
    }

    // 메모 삭제
    @Delete('/:memoId')
    async deleteMemo(@Session() session: Record<string, any>, @Param('memoId') memoId: string, @Res() res: Response) {
        
        // 세션 정보 조회 = 사용자가 있는지 확인
        if (!session.user) {
            return res.json({ success: false, message: '재로그인 후 시도해주세요' });
        }

        const userId = session.user.id;
        await this.memoService.deleteMemo(userId, memoId);

        return res.json({ success: true, message: "메모가 성공적으로 삭제되었습니다." });
    }

    // 메모 수정 중 이미지 삭제
    @Delete('/:memoId/:index')
    @HttpCode(200)
    async deleteImage(@Session() session: Record<string, any>, @Param('memoId') memoId: string, @Param('index', ParseIntPipe) index: number,) {
        const userId = session.user ? session.user.id : 0;
        await this.memoService.deleteOneFile(memoId, index, userId)
    }
}
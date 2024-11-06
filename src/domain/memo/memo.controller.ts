import { Controller, Get, Put, Post, Res, Body, Session, UploadedFiles, UseInterceptors, Delete, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { MemoService } from './memo.service';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class MemoController {
    constructor(private readonly memoService: MemoService) { }

    // 메모 페이지
    @Get()
    async memoPage(@Session() session: Record<string, any>, @Res() res: Response) {
        if (session.user) {
            const userId = session.user.id;
            const memos = await this.memoService.findByUserId(userId);
            return res.render('index', { memos, user: session.user }); // index.hbs 렌더링
        } else {
            return res.redirect('/home'); // 세션이 없으면 /home으로 리다이렉트
        }
    }

    // 메모 생성
    @Post('memo')
    @UseInterceptors(FilesInterceptor('files'))
    async createMemo(@Session() session: Record<string, any>, @Body('content') content: string, @UploadedFiles() files: Array<Express.Multer.File>,) {
        const userId = session.user ? session.user.id : 0;

        const memoId = await this.memoService.createMemo(userId, content, files);

        return '<script>alert("메모가 생성되었습니다."); window.location.replace("/");</script>';
    }

    // 메모 수정
    @Put('memo/:memoId')
    @UseInterceptors(FilesInterceptor('files'))
    async modifiedMemo(@Session() session: Record<string, any>, @Body('content') content: string, @UploadedFiles() files: Array<Express.Multer.File>, @Param('memoId') memoId: string,) {
        const userId = session.user ? session.user.id : 0;
        await this.memoService.modifiedMemo(userId, memoId, content, files);

        return { message: "메모가 성공적으로 수정되었습니다." };
    }

    // 메모 삭제
    @Delete('memo/:memoId')
    async deleteMemo(@Session() session: Record<string, any>, @Param('memoId') memoId: string,) {
        const userId = session.user ? session.user.id : 0;

        await this.memoService.deleteMemo(userId,memoId);

        return { message: "메모가 성공적으로 삭제되었습니다." };
    }

    // 메모 수정 중 이미지 삭제
    @Delete('memo/:memoId/:index')
    @HttpCode(200)
    async deleteImage(@Session() session: Record<string, any>,@Param('memoId') memoId: string, @Param('index',ParseIntPipe) index: number,) {
        const userId = session.user ? session.user.id : 0;
        await this.memoService.deleteOneFile(memoId, index, userId)
    }
}
import { Controller, Get, Post, Res, Body, Session, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
}
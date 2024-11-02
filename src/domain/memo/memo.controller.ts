import { Controller, Get, Post, Body, Session, Res, Render, HttpException, HttpStatus, Redirect } from '@nestjs/common';
import { MemoService } from './memo.service';
import { Response } from 'express';

@Controller()
export class MemoController {
    constructor(private readonly memoService: MemoService) {}

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
}
import { Controller, Get, Post, Body, Session, Res, Render, HttpException, HttpStatus, Redirect } from '@nestjs/common';
import { MemoService } from './memo.service';
import { Response } from 'express';

@Controller('memo')
export class MemoController {
    constructor(private readonly memoService: MemoService) {}

    // 메모 페이지
    @Get()
    @Render('index')
    async memoPage(@Session() session: Record<string, any>, @Res() res: Response) {
        if (session.user) {
            const userId = session.user.id;
            const memos = await this.memoService.findByUserId(userId);
            return { memos }; 
          } else {
            res.redirect('/home');
          }
      }
}
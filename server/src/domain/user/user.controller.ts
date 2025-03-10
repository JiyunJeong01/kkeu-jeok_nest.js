import { Controller, Get, Post, Body, Session, Res, Render, HttpException, HttpStatus, Redirect } from '@nestjs/common';
import { LoginDto, AccountDto } from './user.dto'; // 로그인 DTO 가져오기
import * as bcryptjs from 'bcryptjs'; // bcryptjs 가져오기
import { UserService } from './user.service'; // UserService import
import { Response } from 'express';

@Controller('user')
export class UserLoginController {
  constructor(private readonly userService: UserService) {}

  // 로그인 
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Session() session: Record<string, any>, @Res() res: Response,) {
    const { email, password } = loginDto;

    // 입력된 이메일로 사용자 찾기
    const user = await this.userService.getUserByEmail(email);

    // 사용자가 존재하지 않는 경우
    if (!user) {
      return res.json({ success: false, message: '아이디와 비밀번호를 다시 확인해주세요.' }); // 에러 메시지 반환
    }

    // 비밀번호가 일치하지 않는 경우
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.json({ success: false, message: '아이디와 비밀번호를 다시 확인해주세요.' }); // 에러 메시지 반환
    }

    // 로그인 성공 시, 세션에 사용자 정보 저장
    session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    // 로그인 성공
    return res.json({ success: true, message: '로그인 성공!', user :{userId: user.id}});
  }

  // 로그아웃
  @Post('logout')
  async logout(@Session() session: Record<string, any>, @Res() res: Response): Promise<void> {
    session.destroy((err) => {
      if (err) {
        // 세션 제거 실패시 에러 메시지와 함께 응답
        return res.json({ success: false, message: '로그아웃에 실패했습니다.' });
      }

      // 세션 제거 성공시 성공 메시지와 함께 응답
      return res.json({ success: true, message: '로그아웃에 성공했습니다.' });
    });
  }
}

@Controller('account')
export class UserAccountController {
  constructor(private readonly userService: UserService) {}

  // 회원가입 페이지
  @Get()
  @Render('account')
  accountPage() {
    return;
  }

  // 이메일 중복 확인
  @Post('check-email')
  async checkEmailDuplicate(@Body('email') email: string): Promise<{ isDuplicate: boolean }> {
    const isDuplicate = await this.userService.getUserByEmail(email);
    return { isDuplicate };
  }

  // 이메일 인증 전송
  @Post('auth-email')
  async emailAuth(@Body('email') email: string): Promise<{ ok: boolean; msg: string; authNum?: number }> {
    try {
      const result = await this.userService.sendAuthEmail(email);
      return {
        ok: true,
        msg: '메일 전송에 성공하였습니다.',
        authNum: result,
      };
    } catch (error) {
      throw new HttpException({
        ok: false,
        msg: '메일 전송에 실패하였습니다. 다시 시도해 주세요.',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 회원가입 진행
  @Post()
  @Redirect('/login')
  async account(@Body() body: AccountDto) {
    const { email, name, password } = body;
    const hashedPassword = await bcryptjs.hash(password, 12);

    await this.userService.createAccount(email, name, hashedPassword);

    return;
  }
}

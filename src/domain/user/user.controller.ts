import { Controller, Get, Post, Body, Session, Res, Render, HttpException, HttpStatus, Redirect } from '@nestjs/common';
import { LoginDto, AccountDto } from './user.dto'; // 로그인 DTO 가져오기
import * as bcryptjs from 'bcryptjs'; // bcryptjs 가져오기
import { UserService } from './user.service'; // UserService import
import { Response } from 'express';

@Controller('login')
export class UserLoginController {
  constructor(private readonly userService: UserService) { }

  // 로그인 페이지
  @Get()
  @Render('login')
  loginPage() {
    return;
  }

  // 로그인 
  @Post()
  async login(@Body() loginDto: LoginDto, @Session() session: Record<string, any>, @Res() res: Response,) {
    const { email, password } = loginDto;

    // 입력된 이메일로 사용자 찾기
    const user = await this.userService.getUserByEmail(email);

    // 사용자가 존재하지 않는 경우
    if (!user) {
      return { error: '아이디와 비밀번호를 다시 확인해주세요.' }; // 에러 메시지 반환
    }

    // 비밀번호가 일치하지 않는 경우
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return { error: '아이디와 비밀번호를 다시 확인해주세요.' }; // 에러 메시지 반환
    }

    // 로그인 성공 시, 세션에 사용자 정보 저장
    session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    // "아이디 저장하기" 체크박스 확인
    if (loginDto['remember-check']) {
      // 쿠키 설정
      res.cookie('savedEmail', email, { maxAge: 3600 * 24 * 30 * 1000, httpOnly: true }); // 쿠키 설정
    } else {
      res.clearCookie('savedEmail');
    }

    // 로그인 성공
    res.redirect("/");
  }

  // 로그아웃
  @Get('logout')
  @Redirect('/') // 로그아웃 후 리다이렉트할 URL
  async logout(@Session() session: Record<string, any>): Promise<void> {
    return new Promise((resolve, reject) => {
      session.destroy(err => {
        if (err) {
          throw new HttpException('Failed to log out', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        resolve(); // 성공적으로 로그아웃 처리
      });
    });
  }
}

@Controller('account')
export class UserAccountController {
  constructor(private readonly userService: UserService) { }

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

@Controller('setting')
export class UserSettingController {
  constructor(private readonly userService: UserService) { }

  // 셋팅 페이지
  @Get()
  @Render('setting')
  async settingPage(@Session() session: Record<string, any>) {
    const userId = session.user ? session.user.id : 0;
    return {user: session.user};
    return;
  }

  // 패스워드 변경
  @Post('change-password')
  async changePassword(
    @Session() session: Record<string, any>,
    @Res() res: Response,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmPassword') confirmPassword: string,
  ) {
    if (session.user) {
      const userId = session.user.id;

      // 현재 사용자 정보 가져오기
      const user = await this.userService.getUserById(userId);

      // 현재 비밀번호 확인
      const isValidPassword = await bcryptjs.compare(currentPassword, user.password);
      if (!isValidPassword) {
        res.send('<script>alert("비밀번호가 일치하지 않습니다."); window.location.replace("/setting");</script>');
        return 
      }

      if (newPassword === confirmPassword) {
        const hashedPassword = await bcryptjs.hash(newPassword, 12);
        await this.userService.changePassword(userId, hashedPassword);

        res.send('<script>alert("비밀번호가 변경되었습니다."); window.location.replace("/");</script>');
      }

    } else {
      return res.redirect('/');
    }
  }
}
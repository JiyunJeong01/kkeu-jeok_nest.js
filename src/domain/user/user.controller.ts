import { Controller, Get, Post, Body, Session, Render } from '@nestjs/common';
import { LoginDto } from './user.dto'; // 로그인 DTO 가져오기
import * as bcryptjs from 'bcryptjs'; // bcryptjs 가져오기
import { UserService } from './user.service'; // UserService import

@Controller('login')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Render('login')
  loginPage() {
    return;
  }

  @Post()
  async login(@Body() loginDto: LoginDto, @Session() session: Record<string, any>) {
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
      return { message: '로그인 성공', savedEmail: email }; // 쿠키 설정을 위한 이메일 반환
    } else {
      return { message: '로그인 성공' }; // 로그인 성공 메시지 반환
    }
  }
}

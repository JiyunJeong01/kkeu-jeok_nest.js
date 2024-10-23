import { Module } from '@nestjs/common';
import { UserAccountController, UserLoginController } from './user.controller';
import { UserService } from './user.service'; // 사용자 서비스 import

@Module({
  controllers: [UserLoginController, UserAccountController], // 사용자 컨트롤러 등록
  providers: [UserService], // 사용자 서비스 등록
  exports: [UserService], // 다른 모듈에서 사용할 수 있도록 UserService를 export
})
export class UserModule {}

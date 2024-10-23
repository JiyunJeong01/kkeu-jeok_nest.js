import { Module } from '@nestjs/common';
import { MemoController } from './memo.controller';
import { MemoService } from './memo.service'; 

@Module({
  controllers: [MemoController], // 사용자 컨트롤러 등록
  providers: [MemoService], // 사용자 서비스 등록
  exports: [MemoService], // 다른 모듈에서 사용할 수 있도록 UserService를 export
})
export class MemoModule {}

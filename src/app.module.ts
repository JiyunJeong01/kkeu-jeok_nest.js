import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { UserModule } from './domain/user/user.module';
import { MemoModule } from './domain/memo/memo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true, // 모든 모듈에서 접근 가능하도록 설정
  }),
  FirebaseModule,
  UserModule,
  MemoModule,
],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

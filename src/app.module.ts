import { Module } from '@nestjs/common';
import { AppController, AuthController } from './app.controller';
import { AppService, UserService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true, // 모든 모듈에서 접근 가능하도록 설정
  }),
  FirebaseModule,
],
  controllers: [AppController, AuthController],
  providers: [AppService, UserService],
})
export class AppModule {}

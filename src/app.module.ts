import { Module } from '@nestjs/common';
import { AppController, AuthController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true, // 모든 모듈에서 접근 가능하도록 설정
  }),
],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}

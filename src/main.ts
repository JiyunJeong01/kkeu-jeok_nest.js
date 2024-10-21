import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //.env 파일 가져오기
  const configService = app.get(ConfigService);

  // 정적 파일 경로 설정
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // 뷰 파일 경로 설정
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  // Partial 폴더 경로 등록
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));

  // hbs (Handlebars) 엔진 설정
  app.setViewEngine('hbs');

  // 세션 및 쿠키 설정
  app.use(cookieParser());
  app.use(session({
    secret: configService.get<string>('SECRET_KEY') || 'default_secret', // 비밀 키 설정
    resave: false,
    saveUninitialized: true,
    cookie: { secure: configService.get<string>('NODE_ENV') === 'production' }, // 프로덕션 환경에서는 secure 쿠키 설정
  }));

  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();

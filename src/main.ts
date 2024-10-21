import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  // 정적 파일 경로 설정
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // 뷰 파일 경로 설정
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  // Partial 폴더 경로 등록
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  
  // hbs (Handlebars) 엔진 설정
  app.setViewEngine('hbs');
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

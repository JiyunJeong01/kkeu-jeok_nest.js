import { Controller, Get, Res, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('home') // home.hbs를 렌더링
  index() {
    return;
  }
}

@Controller('login')
export class AuthController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('login')
  loginPage() {
    return;
  }
}

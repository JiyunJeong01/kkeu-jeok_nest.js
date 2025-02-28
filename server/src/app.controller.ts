import { Controller, Get, Render, } from '@nestjs/common';

@Controller('home')
export class AppController {
  constructor() {}

  @Get()
  @Render('home') // home.hbs를 렌더링
  index() {
  }
}

import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHandler() {
    return this.appService.getData();
  }

  @Post()
  postHandler(@Body() body: { userId: string; noteId: string }) {
    return this.appService.createItem(body);
  }

  @Post('/data')
  postDataHandler(@Body() body: { name: string; value: string }) {
    return this.appService.storeDataInRDS(body);
  }
}
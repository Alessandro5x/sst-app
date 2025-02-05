import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function handler(event, context) {
  const app = await NestFactory.create(AppModule);
  await app.init();
  return app.getHttpAdapter().getInstance()(event, context);
}
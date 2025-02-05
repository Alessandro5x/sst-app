import { NestFactory, NestApplication } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { Handler, Context, Callback } from 'aws-lambda';
import { INestApplication } from '@nestjs/common';

let cachedApp: INestApplication | null = null;

async function bootstrap(): Promise<INestApplication> {
  if (!cachedApp) {
    console.log('Bootstrapping NestJS app...');
    const app = await NestFactory.create(AppModule);
    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

async function handleRequest(method: keyof AppController, event: any) {
  try {
    console.log(`Received event for ${method}:`, event);
    const app = await bootstrap();

    if (!app) {
      throw new Error('Failed to initialize the NestJS application');
    }

    const controller = app.get(AppController);
    const data = event.body ? JSON.parse(event.body) : undefined;
    const response = await controller[method](data);
    console.log(`Response for ${method}:`, response);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error: any) {
    console.error(`Error in ${method}:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message, stack: error.stack }),
    };
  }
}

export const getHandler: Handler = (event, context, callback) => handleRequest('getHandler', event);
export const postHandler: Handler = (event, context, callback) => handleRequest('postHandler', event);
export const postDataHandler: Handler = (event, context, callback) => handleRequest('postDataHandler', event);
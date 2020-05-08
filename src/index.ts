import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import * as middleware from 'aws-serverless-express/middleware';
import * as express from 'express';
import { Server } from 'http';
import { AppModule } from './app.module';

let cachedServer: Server;

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express();
  expressApp.use(middleware.eventContext());
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.init();
  return createServer(expressApp);
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!cachedServer) {
    const server = await bootstrapServer();
    cachedServer = server;
    return proxy(server, event, context, 'PROMISE').promise;
  } else {
    return proxy(cachedServer, event, context, 'PROMISE').promise;
  }
};

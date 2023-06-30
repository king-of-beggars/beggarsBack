require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookie from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors:true});
  app.use(cookie())
  app.enableCors({
    origin : [
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'https://beggars-front.vercel.app',
    'https://https://www.thunderclient.com'
    ],
    credentials:true,
    methods : 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders : ['Set-Cookie','userId','userNickname']
  });
  await app.listen(3000);
}
bootstrap();
  
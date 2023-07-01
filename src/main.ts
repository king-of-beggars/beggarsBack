require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
let cookieParser = require('cookie-parser')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.enableCors({
    origin : [
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'https://beggars-front.vercel.app'
    ],
    credentials:true,
    methods : 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders : ['Set-Cookie','userId','userNickname'],
  });
  await app.listen(3000);
}
bootstrap();
  
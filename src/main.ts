require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
let cookieParser = require('cookie-parser')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.enableCors({
    origin : ['https://beggars-front-eight.vercel.app/','https://deeplake-beggars-front.vercel.app','https://dev-beggars-front-eight.vercel.app'],
    credentials:true,
    methods : 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders : ['Set-Cookie','userId','userNickname'],
  });
  await app.listen(3000);
}
bootstrap();
  
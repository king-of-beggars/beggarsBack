require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookie from 'cookie-parser'

async function bootstrap() {
  console.log(`dd ${process.env.DB_USERNAME}`)
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookie())
  app.enableCors({
    origin : [
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'https://beggars-front.vercel.app'
    ],
    methods : 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders : ['Set-Cookie'],
    credentials:true
  });
  await app.listen(3000);
}
bootstrap();
  
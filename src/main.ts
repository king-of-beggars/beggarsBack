require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(`dd ${process.env.DB_USERNAME}`)
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
 
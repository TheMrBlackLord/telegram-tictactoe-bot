import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   await app.listen(AppModule.port);
   Logger.log(`🚀 Application is running`);
}
bootstrap();

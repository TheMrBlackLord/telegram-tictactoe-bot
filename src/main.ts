import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   const { port } = AppModule;
   await app.listen(port);
   Logger.log(`🚀 Application is running`);
}
bootstrap();

import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import path from 'path';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';

const envFilePath = path.join('envs', `.${process.env.NODE_ENV}.env`);

@Module({
   imports: [
      ConfigModule.forRoot({
         envFilePath,
         isGlobal: true
      }),
      TelegrafModule.forRootAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory(configService: ConfigService): TelegrafModuleOptions {
            const token = configService.getOrThrow<string>('BOT_TOKEN');
            return { token };
         }
      })
   ],
   providers: [AppService, AppUpdate]
})
export class AppModule {
   static port: string | number;

   constructor(private readonly configService: ConfigService) {
      AppModule.port = configService.getOrThrow<string>('PORT');
   }
}

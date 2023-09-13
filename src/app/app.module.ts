import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { ConfigService, ConfigModule } from '@nestjs/config';
import path from 'path';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import RedisSession from 'telegraf-session-redis';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { GameModule } from '../game/game.module';
import { ImgurModule } from '../imgur/imgur.module';
import { ImgurModuleOptions } from '../common/types';

const envFilePath = path.join('envs', `.${process.env.NODE_ENV}.env`);

@Module({
   imports: [
      ConfigModule.forRoot({
         envFilePath,
         isGlobal: true
      }),
      MongooseModule.forRootAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory(configService: ConfigService): MongooseModuleOptions {
            const uri = configService.getOrThrow<string>('MONGO_URI');
            const dbName = configService.getOrThrow<string>('MONGO_DB_NAME');
            return { uri, dbName };
         }
      }),
      TelegrafModule.forRootAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory(configService: ConfigService): TelegrafModuleOptions {
            const token = configService.getOrThrow<string>('BOT_TOKEN');
            const session = new RedisSession({
               store: {
                  host: configService.getOrThrow<string>('REDIS_HOST'),
                  port: configService.getOrThrow<number>('REDIS_PORT'),
                  password: configService.get<string>('REDIS_PASSWORD') || ''
               }
            });
            return { token, middlewares: [session] };
         }
      }),
      ImgurModule.forRootAsync({
         isGlobal: true,
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory(configService: ConfigService): ImgurModuleOptions {
            const clientId = configService.getOrThrow<string>('IMGUR_ID');
            const clientSecret = configService.getOrThrow<string>('IMGUR_SECRET');
            return {
               clientId,
               clientSecret
            };
         }
      }),
      UserModule,
      GameModule
   ],
   providers: [AppUpdate]
})
export class AppModule {
   static port: string | number;

   constructor(private readonly configService: ConfigService) {
      AppModule.port = configService.getOrThrow<string>('PORT');
   }
}

import { IBot } from '../interfaces/bot.interface';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../ioc/types';
import { IConfigService } from '../interfaces';
import { Telegraf } from 'telegraf';

@injectable()
export class Bot implements IBot {
   bot: Telegraf;

   constructor(
      @inject(TYPES.ConfigService) private readonly configService: IConfigService
   ) {
      this.bot = new Telegraf(configService.getOrThrow('BOT_TOKEN'));
   }
   init(): void {
      this.bot.launch();
      this.bot.start(ctx => {
         ctx.reply('Hi!');
      });
      console.log('🚀 The bot was launched');

      process.once('SIGINT', () => this.bot.stop('SIGINT'));
      process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
   }
}

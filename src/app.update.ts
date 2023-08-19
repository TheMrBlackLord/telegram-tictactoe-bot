import { Update, Start, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { AppService } from './app.service';

@Update()
export class AppUpdate {
   constructor(private readonly appService: AppService) {}

   @Start()
   async startCommand(@Ctx() ctx: Context) {
      await ctx.reply('Welcome!');
   }
}

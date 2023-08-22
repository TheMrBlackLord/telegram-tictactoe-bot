import { Update, Start, Ctx, Action, Command } from 'nestjs-telegraf';
import menuButtons from '../buttons/menu.buttons';
import {
   CHANGE_LANGUAGE_ACTION,
   ENG_LANG,
   MY_STATS_ACTION,
   RUS_LANG
} from '../constants/actions.constants';
import languageButtons from '../buttons/language.buttons';
import { TelegrafContext, TelegrafContextCallbackDataQuery } from '../context';
import { UserService } from '../user/user.service';
import { languageGuard } from '../utils/guards.util';
import { LOCALE } from '../locale';
import { Language } from '../types/language.type';
import { MENU_COMMAND } from '../constants/commands.constants';

@Update()
export class AppUpdate {
   constructor(private readonly userService: UserService) {}

   @Start()
   async startCommand(@Ctx() ctx: TelegrafContext) {
      const language: Language = ctx.from.language_code === 'ru' ? 'russian' : 'english';
      const user = await this.userService.createNewIfNotExists(ctx.from.id, language);
      ctx.session.language = user.language;
      await ctx.reply(
         `👋 ${LOCALE[ctx.session.language].hello[0]} ${ctx.from.first_name ?? ''}, ${
            LOCALE[ctx.session.language].hello[1]
         } ${ctx.botInfo.first_name}`,
         menuButtons(user.language)
      );
   }

   @Command(MENU_COMMAND)
   async menuCommandHandler(@Ctx() ctx: TelegrafContext) {
      await ctx.reply(
         `🔽 ${LOCALE[ctx.session.language].menu}`,
         menuButtons(ctx.session.language)
      );
   }
   @Action(MY_STATS_ACTION)
   async showUserStats(@Ctx() ctx: TelegrafContext) {
      const stats = await this.userService.getUserStats(ctx.from.id);
      if (!stats) {
         return await ctx.answerCbQuery(`${LOCALE[ctx.session.language].somethingWrong}`);
      }
      await ctx.reply(
         `🎲 ${LOCALE[ctx.session.language].totalGamesCount}: ${
            stats.totalGamesCount
         }\n🎖 ${LOCALE[ctx.session.language].winPercentage}: ${
            stats.winPercentage + '%'
         }\n\n🏆 ${LOCALE[ctx.session.language].wins}: ${stats.wins}\n❌ ${
            LOCALE[ctx.session.language].defeats
         }: ${stats.defeats}\n⚖️ ${LOCALE[ctx.session.language].draws}: ${stats.draws}`
      );
      await ctx.answerCbQuery();
   }

   @Action(CHANGE_LANGUAGE_ACTION)
   async chooseLanguageHandler(@Ctx() ctx: TelegrafContext) {
      await ctx.reply(
         `🔽 ${LOCALE[ctx.session.language].chooseLanguage}`,
         languageButtons
      );
      await ctx.answerCbQuery();
   }

   @Action([ENG_LANG, RUS_LANG])
   async changeLanguage(@Ctx() ctx: TelegrafContextCallbackDataQuery) {
      const data = ctx.update.callback_query.data;
      if (!languageGuard(data)) {
         return await ctx.answerCbQuery(`${LOCALE[ctx.session.language].somethingWrong}`);
      }
      await this.userService.changeLanguage(ctx.from.id, data);
      ctx.session.language = data;
      await ctx.answerCbQuery(
         `${LOCALE[ctx.session.language].changeLanguageSuccess} ${
            LOCALE[ctx.session.language].language
         }`
      );
      await ctx.deleteMessage();
   }
}

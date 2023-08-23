import { Update, Start, Ctx, Action, Command } from 'nestjs-telegraf';
import menuButtons from '../common/buttons/menu.buttons';
import {
   CHANGE_LANGUAGE_ACTION,
   ENG_LANG,
   MY_STATS_ACTION,
   RUS_LANG
} from '../common/constants/actions.constants';
import languageButtons from '../common/buttons/language.buttons';
import { TelegrafContext, TelegrafContextCallbackDataQuery } from '../common/context';
import { UserService } from '../user/user.service';
import { languageGuard } from '../common/utils/guards.util';
import { Language } from '../common/types/language.type';
import { MENU_COMMAND } from '../common/constants/commands.constants';
import { Locale } from '../common/decorators/locale.decorator';
import { LocaleLanguage } from '../common/types/locale.type';
import { LOCALE } from '../common/locale';

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
   async menuCommandHandler(
      @Ctx() ctx: TelegrafContext,
      @Locale() locale: LocaleLanguage
   ) {
      await ctx.reply(`🔽 ${locale.menu}`, menuButtons(ctx.session.language));
   }
   @Action(MY_STATS_ACTION)
   async showUserStats(@Ctx() ctx: TelegrafContext, @Locale() locale: LocaleLanguage) {
      const stats = await this.userService.getUserStats(ctx.from.id);
      if (!stats) {
         return await ctx.answerCbQuery(`${locale.somethingWrong}`);
      }
      await ctx.reply(
         `🎲 ${locale.totalGamesCount}: ${stats.totalGamesCount}\n🎖 ${
            locale.winPercentage
         }: ${stats.winPercentage + '%'}\n\n🏆 ${locale.wins}: ${stats.wins}\n❌ ${
            locale.defeats
         }: ${stats.defeats}\n⚖️ ${locale.draws}: ${stats.draws}`
      );
      await ctx.answerCbQuery();
   }

   @Action(CHANGE_LANGUAGE_ACTION)
   async chooseLanguageHandler(
      @Ctx() ctx: TelegrafContext,
      @Locale() locale: LocaleLanguage
   ) {
      await ctx.reply(`🔽 ${locale.chooseLanguage}`, languageButtons);
      await ctx.answerCbQuery();
   }

   @Action([ENG_LANG, RUS_LANG])
   async changeLanguage(
      @Ctx() ctx: TelegrafContextCallbackDataQuery,
      @Locale() locale: LocaleLanguage
   ) {
      const data = ctx.update.callback_query.data;
      if (!languageGuard(data)) {
         return await ctx.answerCbQuery(`${locale.somethingWrong}`);
      }
      await this.userService.changeLanguage(ctx.from.id, data);
      ctx.session.language = data;
      await ctx.answerCbQuery(
         `${LOCALE[data].changeLanguageSuccess} ${LOCALE[data].language}`
      );
      await ctx.deleteMessage();
   }
}

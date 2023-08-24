import { Update, Start, Ctx, Command, Action } from 'nestjs-telegraf';
import { menuButtons, languageButtons } from '../common/buttons';
import {
   MENU_COMMAND,
   MY_STATS_ACTION,
   CHANGE_LANGUAGE_ACTION,
   ENG_LANG,
   RUS_LANG,
   PLAY_COMMAND,
   PLAY_ACTION,
   PLAY_MENU_SCENE
} from '../common/constants';
import { TelegrafContext, TelegrafContextCallbackQuery } from '../common/context';
import { Locale } from '../common/decorators';
import { LOCALE } from '../common/locale';
import { Language, LocaleLanguage } from '../common/types';
import {
   helloString,
   statsString,
   languageGuard,
   changeLangSuccessString
} from '../common/utils';
import { UserService } from '../user/user.service';

@Update()
export class AppUpdate {
   constructor(private readonly userService: UserService) {}

   @Start()
   async startCommandHandler(@Ctx() ctx: TelegrafContext) {
      const language: Language = ctx.from.language_code === 'ru' ? 'russian' : 'english';
      const user = await this.userService.createNewIfNotExists(ctx.from.id, language);
      ctx.session.language = user.language;
      await ctx.reply(helloString(ctx), menuButtons(user.language));
   }

   @Command(MENU_COMMAND)
   async menuCommandHandler(
      @Ctx() ctx: TelegrafContext,
      @Locale() locale: LocaleLanguage
   ) {
      await ctx.reply(`🔽 ${locale.menu}`, menuButtons(ctx.session.language));
   }

   @Action(MY_STATS_ACTION)
   async myStatsCommandHandler(
      @Ctx() ctx: TelegrafContext,
      @Locale() locale: LocaleLanguage
   ) {
      const stats = await this.userService.getUserStats(ctx.from.id);
      if (!stats) {
         return await ctx.answerCbQuery(`${locale.somethingWrong}`);
      }
      await ctx.reply(statsString(locale, stats));
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
   async changeLanguageHandler(
      @Ctx() ctx: TelegrafContextCallbackQuery,
      @Locale() locale: LocaleLanguage
   ) {
      const data = ctx.update.callback_query.data;
      if (!languageGuard(data)) {
         return await ctx.answerCbQuery(`${locale.somethingWrong}`);
      }
      await this.userService.changeLanguage(ctx.from.id, data);
      ctx.session.language = data;
      await ctx.answerCbQuery(changeLangSuccessString(LOCALE[data]));
      await ctx.deleteMessage();
   }

   @Command(PLAY_COMMAND)
   @Action(PLAY_ACTION)
   async playHandler(@Ctx() ctx: TelegrafContext) {
      if (ctx.callbackQuery) {
         await ctx.answerCbQuery();
      }
      await ctx.scene.enter(PLAY_MENU_SCENE);
   }
}

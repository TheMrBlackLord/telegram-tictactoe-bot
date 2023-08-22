import { Update, Start, Ctx, Action } from 'nestjs-telegraf';
import startButtons from '../buttons/start.buttons';
import { CHANGE_LANGUAGE, ENG_LANG, RUS_LANG } from 'src/constants/actions.constants';
import languageButtons from 'src/buttons/language.buttons';
import { TelegrafContext, TelegrafContextCallbackDataQuery } from 'src/context';
import { UserService } from 'src/user/user.service';
import { languageGuard } from 'src/utils/guards.util';
import { LOCALE } from 'src/locale';
import { Language } from 'src/types/language.type';

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
         startButtons(user.language)
      );
   }

   @Action(CHANGE_LANGUAGE)
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

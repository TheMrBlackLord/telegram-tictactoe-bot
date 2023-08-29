import { Update, Start, Ctx, Command, Action, On } from 'nestjs-telegraf';
import { InlineQueryResultArticle } from 'telegraf/typings/core/types/typegram';
import {
   menuButtons,
   languageButtons,
   acceptButton,
   playChoiceButtons,
   denyButton
} from '../common/buttons';
import {
   MENU_COMMAND,
   MY_STATS_ACTION,
   CHANGE_LANGUAGE_ACTION,
   ENG_LANG,
   RUS_LANG,
   PLAY_COMMAND,
   PLAY_ACTION,
   INLINE_QUERY_ID,
   THUMB_URL,
   ACCEPT_CHALLENGE_ACTION,
   DENY_CHALLENGE_ACTION
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
import { Context } from 'telegraf';
import { GameService } from '../game/game.service';

@Update()
export class AppUpdate {
   constructor(
      private readonly userService: UserService,
      private readonly gameService: GameService
   ) {}

   // ========= COMMAND HANDLERS =========

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

   // ========= ACTION HANDLERS =========

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

   @Action(ACCEPT_CHALLENGE_ACTION)
   async onAcceptChallenge(
      @Ctx() ctx: TelegrafContextCallbackQuery
      // @Locale() locale: LocaleLanguage
   ) {
      await ctx.reply('accepted');
   }

   @Action(DENY_CHALLENGE_ACTION)
   async onDenyChallenge(@Ctx() ctx: Context) {
      const language = await this.userService.getLanguage(ctx.from.id);
      const result = await this.gameService.denyChallenge(
         ctx.from.id,
         ctx.inlineMessageId
      );
      if (typeof result === 'string') {
         await ctx.answerCbQuery(LOCALE[language][result as string]);
         return;
      }

      await ctx.answerCbQuery();
      await ctx.editMessageText(`🤷‍♂️ ${LOCALE[result.language].challengeDenied}`);
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

   // ========= OTHER HANDLERS =========

   @Command(PLAY_COMMAND)
   @Action(PLAY_ACTION)
   async playHandler(@Ctx() ctx: TelegrafContext, @Locale() locale: LocaleLanguage) {
      if (ctx.callbackQuery) {
         await ctx.answerCbQuery();
      }
      await ctx.reply(
         `🔽 ${locale.chooseGameOption}`,
         playChoiceButtons(ctx.session.language)
      );
   }

   @On('inline_query')
   async onInlineQuery(@Ctx() ctx: Context) {
      const language = await this.userService.getLanguage(
         ctx.inlineQuery.from.id
      );
      const result: InlineQueryResultArticle = {
         type: 'article',
         id: INLINE_QUERY_ID,
         title: `⚔️ ${LOCALE[language].inlineQueryTitle}`,
         description: `${LOCALE[language].inlineQueryDescription}`,
         thumb_url: THUMB_URL,
         input_message_content: {
            message_text: `⚔️ ${LOCALE[language].iChallengeU}`
         },
         reply_markup: {
            inline_keyboard: [[acceptButton(language), denyButton(language)]]
         }
      };
      ctx.answerInlineQuery([result], {
         cache_time: 120
      });
   }

   @On('chosen_inline_result')
   async onNewChallenge(@Ctx() ctx: Context) {
      await this.gameService.newChallenge(ctx.from, ctx.inlineMessageId);
   }
}

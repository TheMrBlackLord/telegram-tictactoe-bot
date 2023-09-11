import { Update, Start, Ctx, Command, Action, On } from 'nestjs-telegraf';
import { InlineQueryResultArticle, InlineQueryResultCachedPhoto, InlineQueryResultPhoto } from 'telegraf/typings/core/types/typegram';
import {
   menuButtons,
   languageButtons,
   acceptButton,
   playChoiceButtons,
   denyButton,
   fieldButtons
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
   ACCEPT_CHALLENGE_ACTION,
   DENY_CHALLENGE_ACTION,
   FIELD_BUTTON_ACTION,
   INLINE_PHOTO_ID
} from '../common/constants';
import { TelegrafContext, TelegrafContextCallbackQuery } from '../common/context';
import { Locale } from '../common/decorators';
import { LOCALE } from '../common/locale';
import { Language, LocaleLanguage } from '../common/types';
import {
   helloString,
   statsString,
   languageGuard,
   changeLangSuccessString,
   gameUpdateString,
   checkWinner,
   createResultImage,
   gameFinishedString
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
   async onAcceptChallenge(@Ctx() ctx: Context) {
      const { language, payload } = await this.gameService.acceptChallenge(
         ctx.from,
         ctx.inlineMessageId
      );
      if (typeof payload === 'string') {
         await ctx.answerCbQuery(LOCALE[language][payload as string]);
         return;
      }

      await ctx.answerCbQuery();
      await ctx.editMessageText(gameUpdateString(payload), {
         reply_markup: {
            inline_keyboard: fieldButtons(payload.field)
         },
         parse_mode: 'HTML',
         disable_web_page_preview: true
      });
   }

   @Action(DENY_CHALLENGE_ACTION)
   async onDenyChallenge(@Ctx() ctx: Context) {
      const { language, errorProperty } = await this.gameService.denyChallenge(
         ctx.from.id,
         ctx.inlineMessageId
      );
      if (errorProperty) {
         await ctx.answerCbQuery(LOCALE[language][errorProperty as string]);
         return;
      }

      await ctx.answerCbQuery();
      await ctx.editMessageText(`🤷‍♂️ ${LOCALE[language].challengeDenied}`);
   }

   @Action(new RegExp(`${FIELD_BUTTON_ACTION}_\\d{2}`, 'g'))
   async onMove(@Ctx() ctx: TelegrafContextCallbackQuery) {
      const data = ctx.update.callback_query.data;
      const y = +data.at(-2);
      const x = +data.at(-1);
      const { language, payload } = await this.gameService.move(
         ctx.from.id,
         ctx.inlineMessageId,
         { x, y }
      );
      if (typeof payload === 'string') {
         await ctx.answerCbQuery(LOCALE[language][payload as string]);
         return;
      }

      const winner = checkWinner(payload.field);

      await ctx.answerCbQuery();
      if (winner) {
         await ctx.editMessageMedia({
            media: {
               source: await createResultImage([])
            },
            type: 'photo'
         });
         await ctx.editMessageText(gameFinishedString(payload, winner), {
            parse_mode: 'HTML',
            disable_web_page_preview: true
         });
      } else {
         await ctx.editMessageText(gameUpdateString(payload), {
            reply_markup: {
               inline_keyboard: fieldButtons(payload.field)
            },
            parse_mode: 'HTML',
            disable_web_page_preview: true
         });
      }
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
      const language = await this.userService.getLanguage(ctx.inlineQuery.from.id);
      const result: InlineQueryResultCachedPhoto = {
         type: 'photo',
         id: INLINE_QUERY_ID,
         caption: `⚔️ ${LOCALE[language].iChallengeU}`,
         reply_markup: {
            inline_keyboard: [[acceptButton(language), denyButton(language)]]
         },
         photo_file_id: INLINE_PHOTO_ID
      };
      ctx.answerInlineQuery([result], {
         cache_time: 120
      });
   }

   @Command('ph')
   async a(ctx: TelegrafContext) {
      const a = await ctx.replyWithPhoto({
         source: await createResultImage([])
      });
      console.log(a);
   }

   @On('chosen_inline_result')
   async onNewChallenge(@Ctx() ctx: Context) {
      await this.gameService.newChallenge(ctx.from, ctx.inlineMessageId);
   }
}

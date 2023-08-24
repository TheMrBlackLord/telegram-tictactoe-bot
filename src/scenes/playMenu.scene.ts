import { Scene, SceneEnter, Ctx, On, Message, Action } from 'nestjs-telegraf';
import { playMenuButtons } from '../common/buttons';
import {
   PLAY_MENU_SCENE,
   GAME_ID_LENGTH,
   NEW_GAME_ACTION,
   CANCEL_PLAY_ACTION
} from '../common/constants';
import { TelegrafContext } from '../common/context';
import { Locale } from '../common/decorators';
import { LocaleLanguage } from '../common/types';
import { Message as TGMessage } from 'telegraf/typings/core/types/typegram';
import { GameService } from '../game/game.service';

@Scene(PLAY_MENU_SCENE)
export class PlayMenuScene {
   constructor(private readonly gameService: GameService) {}

   @SceneEnter()
   async onSceneEnter(@Ctx() ctx: TelegrafContext, @Locale() locale: LocaleLanguage) {
      await ctx.reply(
         `✌️ ${locale.playMenuChoice}`,
         playMenuButtons(ctx.session.language)
      );
   }

   @On('text')
   async onText(
      @Ctx() ctx: TelegrafContext,
      @Message() msg: TGMessage.TextMessage,
      @Locale() locale: LocaleLanguage
   ) {
      const id = Number(msg.text);
      if (msg.text.trim().length !== GAME_ID_LENGTH || !id) {
         await ctx.reply(`🙏 ${locale.pleaseSendGameID}`);
         return;
      }
      const room = await this.gameService.enter(
         ctx.from.id,
         ctx.from.username,
         ctx.from.first_name,
         id
      );
      if (!room) {
         await ctx.reply('bad');
         return;
      }
      ctx.session.game = room;
      await ctx.reply('good');
   }

   @On('message')
   async onMessage(@Ctx() ctx: TelegrafContext, @Locale() locale: LocaleLanguage) {
      await ctx.reply(`🙏 ${locale.pleaseSendGameID}`);
   }

   @Action(NEW_GAME_ACTION)
   async newGameHandler(@Ctx() ctx: TelegrafContext, @Locale() locale: LocaleLanguage) {
      const room = await this.gameService.createAndEnter(
         ctx.from.id,
         ctx.from.username,
         ctx.from.first_name
      );
      ctx.session.game = room;
      await ctx.replyWithHTML(
         `✅ ${locale.gameRoomCreated}: <strong>${room.gameID}</strong>`
      );
      await ctx.answerCbQuery();
   }

   @Action(CANCEL_PLAY_ACTION)
   async cancelPlayHandler(@Ctx() ctx: TelegrafContext) {
      await ctx.deleteMessage();
      await ctx.scene.leave();
   }
}

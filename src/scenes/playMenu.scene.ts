import { Scene, SceneEnter, Ctx, On, Message, Action } from 'nestjs-telegraf';
import { playMenuButtons } from '../common/buttons';
import {
   PLAY_MENU_SCENE,
   GAME_ID_LENGTH,
   GAME_SCENE,
   NEW_GAME_ACTION,
   CANCEL_PLAY_ACTION
} from '../common/constants';
import { TelegrafContext } from '../common/context';
import { Locale } from '../common/decorators';
import { LocaleLanguage } from '../common/types';
import { Message as TGMessage } from 'telegraf/typings/core/types/typegram';

@Scene(PLAY_MENU_SCENE)
export class PlayMenuScene {
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
         return await ctx.reply(`🙏 ${locale.pleaseSendGameID}`);
      }
      ctx.scene.state['gameID'] = id;
      ctx.scene.enter(GAME_SCENE);
   }

   @On('message')
   async onMessage(@Ctx() ctx: TelegrafContext, @Locale() locale: LocaleLanguage) {
      await ctx.reply(`🙏 ${locale.pleaseSendGameID}`);
   }

   @Action(NEW_GAME_ACTION)
   async newGameHandler() {}

   @Action(CANCEL_PLAY_ACTION)
   async cancelPlayHandler(@Ctx() ctx: TelegrafContext) {
      await ctx.deleteMessage();
      await ctx.scene.leave();
   }
}

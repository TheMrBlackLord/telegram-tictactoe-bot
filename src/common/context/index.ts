import { Scenes } from 'telegraf';
import { Language } from '../types';
import { SceneSessionData } from 'telegraf/typings/scenes';
import { CallbackQuery, Update } from 'telegraf/typings/core/types/typegram';
import { GameRoom } from '../../schemas/gameRoom.schema';

export interface TelegrafContext extends Scenes.SceneContext {
   session: {
      language: Language;
      game?: GameRoom;
      __scenes: SceneSessionData;
   };
}
export interface TelegrafContextCallbackQuery extends TelegrafContext {
   update: Update.CallbackQueryUpdate<CallbackQuery.DataQuery>;
}

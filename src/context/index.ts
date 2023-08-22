import { Language } from 'src/types/language.type';
import { Context } from 'telegraf';
import { Update, CallbackQuery } from 'telegraf/typings/core/types/typegram';

export interface TelegrafContext extends Context {
   session: {
      language: Language;
   };
}
export interface TelegrafContextCallbackDataQuery extends TelegrafContext {
   update: Update.CallbackQueryUpdate<CallbackQuery.DataQuery>;
}

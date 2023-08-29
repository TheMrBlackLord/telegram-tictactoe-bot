import { Markup } from 'telegraf';
import { Language } from '../types';
import { LOCALE } from '../locale';
import { CANCEL_ACTION } from '../constants';

export default function (language: Language) {
   return Markup.inlineKeyboard([
      [
         Markup.button.switchToChat(`👱 ${LOCALE[language].buttonPlayWithFriend}`, ''),
         Markup.button.callback(`❌ ${LOCALE[language].cancel}`, CANCEL_ACTION)
      ]
   ]);
}

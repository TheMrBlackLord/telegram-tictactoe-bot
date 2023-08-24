import { Markup } from 'telegraf';
import { Language } from '../types';
import { LOCALE } from '../locale';
import { CANCEL_PLAY_ACTION, NEW_GAME_ACTION } from '../constants';

export default function (language: Language) {
   return Markup.inlineKeyboard([
      [
         Markup.button.callback(`🎲 ${LOCALE[language].buttonNewGame}`, NEW_GAME_ACTION),
         Markup.button.callback(`❌ ${LOCALE[language].cancel}`, CANCEL_PLAY_ACTION)
      ]
   ]);
}

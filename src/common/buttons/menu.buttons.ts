import { Markup } from 'telegraf';
import { LOCALE } from '../locale';
import { Language } from '../types';
import { MY_STATS_ACTION, PLAY_ACTION, CHANGE_LANGUAGE_ACTION } from '../constants';

export default function (language: Language) {
   return Markup.inlineKeyboard([
      [
         Markup.button.callback(`📊 ${LOCALE[language].buttonMyStats}`, MY_STATS_ACTION),
         Markup.button.callback(`🎮 ${LOCALE[language].buttonPlay}`, PLAY_ACTION)
      ],
      [
         Markup.button.callback(
            `👅 ${LOCALE[language].buttonChangeLang}`,
            CHANGE_LANGUAGE_ACTION
         )
      ]
   ]);
}

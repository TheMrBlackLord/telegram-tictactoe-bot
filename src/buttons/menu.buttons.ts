import {
   CHANGE_LANGUAGE_ACTION,
   MY_STATS_ACTION,
   PLAY_ACTION
} from '../constants/actions.constants';
import { LOCALE } from '../locale';
import { Language } from '../types/language.type';
import { Markup } from 'telegraf';

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

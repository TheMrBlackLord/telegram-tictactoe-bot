import { CHANGE_LANGUAGE, MY_STATS, PLAY } from 'src/constants/actions.constants';
import { LOCALE } from 'src/locale';
import { Language } from 'src/types/language.type';
import { Markup } from 'telegraf';

export default function (language: Language) {
   return Markup.inlineKeyboard([
      [
         Markup.button.callback(`📊 ${LOCALE[language].buttonMyStats}`, MY_STATS),
         Markup.button.callback(`🎮 ${LOCALE[language].buttonPlay}`, PLAY)
      ],
      [Markup.button.callback(`👅 ${LOCALE[language].buttonChangeLang}`, CHANGE_LANGUAGE)]
   ]);
}

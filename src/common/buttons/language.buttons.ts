import { Markup } from 'telegraf';
import { ENG_LANG, RUS_LANG } from '../constants';

export default Markup.inlineKeyboard([
   [Markup.button.callback('🇬🇧 English', ENG_LANG)],
   [Markup.button.callback('🇷🇺 Русский', RUS_LANG)]
]);

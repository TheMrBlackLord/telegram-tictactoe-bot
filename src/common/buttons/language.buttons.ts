import { RUS_LANG, ENG_LANG } from '../constants/actions.constants';
import { Markup } from 'telegraf';

export default Markup.inlineKeyboard([
   [Markup.button.callback('🇬🇧 English', ENG_LANG)],
   [Markup.button.callback('🇷🇺 Русский', RUS_LANG)]
]);

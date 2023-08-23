import { ENG_LANG, RUS_LANG } from '../constants/actions.constants';
import { Language } from '../types/language.type';

export function languageGuard(data: string): data is Language {
   return [ENG_LANG, RUS_LANG].includes(data);
}

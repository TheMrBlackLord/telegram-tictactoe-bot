import { ENG_LANG, RUS_LANG } from '../constants';
import { Language } from '../types';

export function languageGuard(data: string): data is Language {
   return [ENG_LANG, RUS_LANG].includes(data);
}

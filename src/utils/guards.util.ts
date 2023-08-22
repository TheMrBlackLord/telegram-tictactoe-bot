import { ENG_LANG, RUS_LANG } from 'src/constants/actions.constants';
import { Language } from 'src/types/language.type';

export function languageGuard(data: string): data is Language {
   return [ENG_LANG, RUS_LANG].includes(data);
}

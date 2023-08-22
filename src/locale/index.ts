import { Language } from 'src/types/language.type';
import { LocaleLanguage } from 'src/types/locale.type';

export const LOCALE: Record<Language, LocaleLanguage> = {
   english: {
      hello: ['Hi', 'welcome to'],
      language: 'english',
      chooseLanguage: 'Choose a language',
      somethingWrong: 'Something went wrong. Write to the developer',
      changeLanguageSuccess: 'Language changed to',
      buttonMyStats: 'My stats',
      buttonPlay: 'Play',
      buttonChangeLang: 'Change language'
   },
   russian: {
      hello: ['Привет,', 'добро пожаловать в'],
      language: 'русский',
      chooseLanguage: 'Выбери язык',
      somethingWrong: 'Что-то пошло не так. Обратись к разработчику',
      changeLanguageSuccess: 'Язык изменен на',
      buttonMyStats: 'Моя статиска',
      buttonPlay: 'Играть',
      buttonChangeLang: 'Сменить язык'
   }
};

import { Language } from '../types/language.type';
import { LocaleLanguage } from '../types/locale.type';

export const LOCALE: Record<Language, LocaleLanguage> = {
   english: {
      hello: ['Hi', 'welcome to'],
      language: 'english',
      menu: 'Menu',
      chooseLanguage: 'Choose a language',
      somethingWrong: 'Something went wrong. Write to the developer',
      changeLanguageSuccess: 'Language changed to',
      buttonMyStats: 'My stats',
      buttonPlay: 'Play',
      buttonChangeLang: 'Change language',
      totalGamesCount: 'Number of games',
      winPercentage: 'Winning percentage',
      wins: 'Wins',
      defeats: 'Defeats',
      draws: 'Draws'
   },
   russian: {
      hello: ['Привет,', 'добро пожаловать в'],
      language: 'русский',
      menu: 'Меню',
      chooseLanguage: 'Выбери язык',
      somethingWrong: 'Что-то пошло не так. Обратись к разработчику',
      changeLanguageSuccess: 'Язык изменен на',
      buttonMyStats: 'Моя статиска',
      buttonPlay: 'Играть',
      buttonChangeLang: 'Сменить язык',
      totalGamesCount: 'Количество игр',
      winPercentage: 'Процент побед',
      wins: 'Победы',
      defeats: 'Поражения',
      draws: 'Ничьи'
   }
};

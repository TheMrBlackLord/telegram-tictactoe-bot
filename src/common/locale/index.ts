import { Language, LocaleLanguage } from '../types';

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
      draws: 'Draws',
      playMenuChoice:
         'You can start a new game by clicking the button below or write me the ID of an already created game',
      buttonNewGame: 'New game',
      cancel: 'Cancel',
      pleaseSendGameID: 'Please send game id (7 digits)'
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
      draws: 'Ничьи',
      playMenuChoice:
         'Ты можешь начать новую игру, нажав кнопку ниже или написать мне айди уже созданной игры',
      buttonNewGame: 'Новая игра',
      cancel: 'Отмена',
      pleaseSendGameID: 'Пожалуйста, отправь айди игры (7 цифр)'
   }
};

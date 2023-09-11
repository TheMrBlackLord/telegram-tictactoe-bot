import { GameRoom } from '../../schemas/gameRoom.schema';
import { TelegrafContext } from '../context';
import { LOCALE } from '../locale';
import { Chars, LocaleLanguage, Stats } from '../types';

export const helloString = ({
   session: { language },
   from,
   botInfo
}: TelegrafContext) => {
   return `👋 ${LOCALE[language].hello[0]} ${from.first_name ?? ''}, ${
      LOCALE[language].hello[1]
   } ${botInfo.first_name}`;
};

export const statsString = (locale: LocaleLanguage, stats: Stats) => {
   return `🎲 ${locale.totalGamesCount}: ${stats.totalGamesCount}\n🎖 ${
      locale.winPercentage
   }: ${stats.winPercentage + '%'}\n\n🏆 ${locale.wins}: ${stats.wins}\n❌ ${
      locale.defeats
   }: ${stats.defeats}\n⚖️ ${locale.draws}: ${stats.draws}`;
};

export const changeLangSuccessString = (locale: LocaleLanguage) => {
   return `${locale.changeLanguageSuccess} ${locale.language}`;
};

export const gameUpdateString = (gameRoom: GameRoom) => {
   const xPlayer = gameRoom.opponents.find(player => player.char === 'x');
   const oPlayer = gameRoom.opponents.find(player => player.char === 'o');
   const { currentMove } = gameRoom;

   return `<code>${currentMove === 'x' ? '🟢' : '  '}❌</code> <a href='https://t.me/${
      xPlayer.username
   }'>${xPlayer.name}</a>\n<code>${
      currentMove === 'o' ? '🟢' : '  '
   }⭕</code> <a href='https://t.me/${oPlayer.username}'>${oPlayer.name}</a>`;
};

export const gameFinishedString = (gameRoom: GameRoom, winChar: Chars) => {
   const winner = gameRoom.opponents.find(player => player.char === winChar);

   return `🏆${LOCALE[gameRoom.gameLanguage].winner}: <a href='https://t.me/${
      winner.username
   }'>${winner.name}</a>`;
};

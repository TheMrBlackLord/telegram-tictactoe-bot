import { GAME_ID_LENGTH } from '../constants';

export const generateGameID = () => {
   const min = 10 ** (GAME_ID_LENGTH - 1);
   const max = Number('9'.repeat(GAME_ID_LENGTH));
   return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const oddOrEven = () => {
   const number = Math.floor(Math.random() * 100) + 1;
   return number % 2 === 0;
};

import { Chars, Field } from '../types';

export const checkWinner = (field: Field): Chars | null => {
   // rows
   for (let i = 0; i < 3; i++) {
      if (field[i][0] !== '' && field[i].every(value => value === field[i][0])) {
         return field[i][0] as Chars;
      }
   }

   // сolumns
   for (let i = 0; i < 3; i++) {
      const array = [field[0][i], field[1][i], field[2][i]];
      if (field[0][i] !== '' && array.every(value => value === field[0][i])) {
         return field[0][i] as Chars;
      }
   }

   // diagonals
   const array1 = [field[0][0], field[1][1], field[2][2]];
   const array2 = [field[0][2], field[1][1], field[2][0]];
   // diagonal \
   if (field[0][0] !== '' && array1.every(value => value === field[0][0])) {
      return field[0][0] as Chars;
   }
   // diagonal /
   if (field[0][2] !== '' && array2.every(value => value === field[0][2])) {
      return field[0][2] as Chars;
   }

   return null;
};

import { Chars } from './chars.type';

export type Combination = ['row' | 'col' | 'diag', number]

export type GameResult = {
   winner: Chars;
   combination: Combination;
};

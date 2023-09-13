import { Move } from '../../schemas/move.schema';

export const getResultShorthand = (moves: Move[]) => {
   return moves.reduce<string>((shorthand, move, index) => {
      const char = index % 2 ? 'x' : 'o';
      return shorthand + `${char}${move.x}${move.y}`;
   }, '');
}

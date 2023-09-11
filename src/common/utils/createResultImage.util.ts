import { readFile } from 'fs/promises';
import { Move } from '../../schemas/move.scema';
import path from 'path';

export const createResultImage = async (moves: Move[]) => {
   moves;
   const boardImg = await readFile(
      path.resolve(__dirname, '..', '..', 'assets', 'field.png')
   );
   return boardImg;
};

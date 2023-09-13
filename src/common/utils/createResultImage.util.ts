import { Move } from '../../schemas/move.scema';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';

export const createResultImage = async (moves: Move[]) => {
   const background = await loadImage(
      path.resolve(__dirname, '..', '..', 'assets', 'field.png')
   );
   const xChar = await loadImage(path.resolve(__dirname, '..', '..', 'assets', 'x.png'));
   const oChar = await loadImage(path.resolve(__dirname, '..', '..', 'assets', 'o.png'));
   const offset = 51;
   const border = 8;
   const charSize = 125;
   const { width: W, height: H } = background;
   const canvas = createCanvas(W, H);
   const ctx = canvas.getContext('2d');

   ctx.drawImage(background, 0, 0);

   for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const img = i % 2 ? oChar : xChar;
      ctx.drawImage(
         img,
         offset + charSize * move.x + border * move.x,
         offset + charSize * move.y + border * move.x
      );
   }

   return canvas.toBuffer();
};

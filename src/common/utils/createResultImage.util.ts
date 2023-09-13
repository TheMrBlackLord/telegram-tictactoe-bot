import { Move } from '../../schemas/move.schema';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';
import { Combination } from '../types';

const border = 8;
const offset = 52;
const charSize = 125;
const gap = 5;

export const createResultImage = async (moves: Move[], combination: Combination) => {
   const background = await loadImage(
      path.resolve(__dirname, '..', '..', 'assets', 'field.png')
   );
   const xChar = await loadImage(path.resolve(__dirname, '..', '..', 'assets', 'x.png'));
   const oChar = await loadImage(path.resolve(__dirname, '..', '..', 'assets', 'o.png'));

   const { width: W, height: H } = background;
   const canvas = createCanvas(W, H);
   const ctx = canvas.getContext('2d');

   ctx.drawImage(background, 0, 0);

   for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const img = i % 2 ? oChar : xChar;
      ctx.drawImage(
         img,
         offset + charSize * move.x + border * (move.x + 1),
         offset + charSize * move.y + border * (move.y + 1)
      );
   }

   ctx.strokeStyle = '#45c210';
   ctx.lineWidth = 7;
   ctx.lineCap = 'round';
   const coord =
      offset + charSize * combination[1] + border * (combination[1] + 1) + charSize / 2;
   switch (combination[0]) {
      case 'col':
         ctx.moveTo(coord, offset + border + gap);
         ctx.lineTo(coord, H - offset - border - gap);
         ctx.stroke();
         break;
      case 'row':
         ctx.moveTo(offset + border + gap, coord);
         ctx.lineTo(W - offset - border - gap, coord);
         ctx.stroke();
         break;
      case 'diag':
         if (combination[1] === 0) {
            ctx.moveTo(offset + border + gap, offset + border + gap);
            ctx.lineTo(W - offset - border - gap, H - offset - border - gap);
         }
         if (combination[1] === 1) {
            ctx.moveTo(offset + border + gap, H - offset - border - gap);
            ctx.lineTo(W - offset - border - gap, offset + border + gap);
         }
         ctx.stroke();
         break;
   }

   return canvas.toBuffer();
};

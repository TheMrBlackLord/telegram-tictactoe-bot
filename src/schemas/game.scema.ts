import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Chars, Field, Opponents } from '../common/types';
import { Moves } from './moves.scema';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game {
   @Prop({
      required: true
   })
   field: Field;

   @Prop({
      required: true
   })
   duration: number;

   @Prop({
      required: true
   })
   opponents: Opponents;

   @Prop({
      required: true
   })
   winner: Chars;

   @Prop({
      required: true,
      type: Types.ObjectId,
      ref: 'Moves'
   })
   moves: Moves;
}

export const GameSchema = SchemaFactory.createForClass(Game);

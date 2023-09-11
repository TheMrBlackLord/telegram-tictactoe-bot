import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Chars, Field, Opponents } from '../common/types';
import { Move } from './move.scema';

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
      required: true,
      type: String
   })
   winner: Chars;

   @Prop({
      required: true,
      type: Array<Types.ObjectId>,
      ref: 'Move'
   })
   moves: Move[];
}

export const GameSchema = SchemaFactory.createForClass(Game);

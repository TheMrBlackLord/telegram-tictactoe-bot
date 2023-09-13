import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Chars, Opponents } from '../common/types';
import { Image } from './image.schema';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game {
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
      type: Types.ObjectId,
      ref: 'Image'
   })
   image: Image;
}

export const GameSchema = SchemaFactory.createForClass(Game);

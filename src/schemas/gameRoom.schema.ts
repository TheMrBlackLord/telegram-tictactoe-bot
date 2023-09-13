import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Chars, Field, Language, Opponents } from '../common/types';
import { generateEmptyField } from '../common/utils';
import { Types } from 'mongoose';
import { Move } from './move.schema';

export type GameRoomDocument = HydratedDocument<GameRoom>;

@Schema()
export class GameRoom {
   @Prop({
      required: true
   })
   opponents: Opponents;

   @Prop({
      default: 'x'
   })
   currentMove: Chars;

   @Prop({
      type: Array<Types.ObjectId>,
      ref: 'Move',
      default: []
   })
   moves: Move[];

   @Prop()
   startTime: number;

   @Prop({
      required: true
   })
   initiatorID: number;

   @Prop({
      required: true
   })
   gameLanguage: Language;

   @Prop({
      required: true,
      unique: true
   })
   messageID: string;

   @Prop({
      default: generateEmptyField
   })
   field: Field;
}

export const GameRoomSchema = SchemaFactory.createForClass(GameRoom);

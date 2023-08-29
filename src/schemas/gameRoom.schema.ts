import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Field, Language, Opponents } from '../common/types';
import { generateEmptyField } from '../common/utils';

export type GameRoomDocument = HydratedDocument<GameRoom>;

@Schema()
export class GameRoom {
   @Prop({
      required: true
   })
   opponents: Opponents;

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

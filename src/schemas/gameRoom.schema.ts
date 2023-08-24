import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Field, Opponents } from '../common/types';

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
   gameID: number;

   @Prop({
      required: true
   })
   field: Field;
}

export const GameRoomSchema = SchemaFactory.createForClass(GameRoom);

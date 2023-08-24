import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Move } from '../common/types';

export type MovesDocument = HydratedDocument<Moves>;

@Schema()
export class Moves {
   @Prop({
      required: true
   })
   moves: Move[];
}

export const MovesSchema = SchemaFactory.createForClass(Moves);

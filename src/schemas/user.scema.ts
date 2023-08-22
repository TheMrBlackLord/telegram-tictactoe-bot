import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Language } from '../types/language.type';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
   @Prop({
      default: 'english',
      required: true
   })
   language: Language;

   @Prop({
      required: true,
      unique: true
   })
   tgID: number;

   @Prop({
      default: 0,
      required: true
   })
   wins: number;

   @Prop({
      default: 0,
      required: true
   })
   defeats: number;

   @Prop({
      default: 0,
      required: true
   })
   draws: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

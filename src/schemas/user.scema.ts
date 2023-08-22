import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Language } from 'src/types/language.type';

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
}

export const UserSchema = SchemaFactory.createForClass(User);

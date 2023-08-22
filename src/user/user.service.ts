import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.scema';
import { Language } from 'src/types/language.type';

@Injectable()
export class UserService {
   constructor(@InjectModel(User.name) private userModel: Model<User>) {}

   async createNewIfNotExists(tgID: number, language: Language) {
      const candidate = await this.userModel.findOne({ tgID });
      if (candidate) return candidate;
      return await this.userModel.create({
         tgID,
         language
      });
   }

   async changeLanguage(tgID: number, language: Language) {
      await this.userModel.updateOne({ tgID }, { language });
   }
}

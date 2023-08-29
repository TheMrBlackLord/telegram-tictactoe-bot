import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.scema';
import { Language, Stats } from '../common/types';

@Injectable()
export class UserService {
   constructor(@InjectModel(User.name) private userModel: Model<User>) {}

   async getLanguage(tgID: number): Promise<Language> {
      const user = await this.userModel.findOne({ tgID });
      if (!user) return 'english';
      return user.language;
   }

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

   async getUserStats(tgID: number): Promise<Stats | null> {
      const user = await this.userModel.findOne({ tgID });
      if (!user) return null;
      const { wins, defeats, draws } = user;
      const totalGamesCount = wins + defeats + draws;
      const winPercentage = Number((wins / totalGamesCount).toFixed(2)) || 0;
      return {
         wins,
         defeats,
         draws,
         totalGamesCount,
         winPercentage
      };
   }
}

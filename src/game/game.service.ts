import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from '../schemas/game.scema';
import { GameRoom } from '../schemas/gameRoom.schema';
import { User } from 'telegraf/typings/core/types/typegram';
import { Chars, Language, LocaleLanguage, Player } from '../common/types';
import { oddOrEven } from '../common/utils';
import { UserService } from '../user/user.service';

@Injectable()
export class GameService {
   constructor(
      @InjectModel(Game.name) private gameModel: Model<Game>,
      @InjectModel(GameRoom.name) private gameRoomModel: Model<GameRoom>,
      private readonly userService: UserService
   ) {}

   async newChallenge({ id: tgID, first_name: name, username }: User, messageID: string) {
      const char: Chars = oddOrEven() ? 'x' : 'o';
      const player: Player = {
         name,
         tgID,
         username,
         char
      };
      const gameLanguage = await this.userService.getLanguage(tgID);
      await this.gameRoomModel.create({
         initiatorID: tgID,
         opponents: [player],
         gameLanguage,
         messageID
      });
   }

   async denyChallenge(
      tgID: number,
      messageID: string
   ): Promise<keyof LocaleLanguage | { language: Language }> {
      const gameRoom = await this.gameRoomModel.findOne({ messageID });
      if (!gameRoom) return 'somethingWrong';
      if (gameRoom.initiatorID === tgID) return 'cannotBeDenied';
      await gameRoom.deleteOne();
      return {
         language: gameRoom.gameLanguage
      };
   }
}

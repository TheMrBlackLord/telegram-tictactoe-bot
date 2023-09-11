import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from '../schemas/game.scema';
import { GameRoom } from '../schemas/gameRoom.schema';
import { User } from 'telegraf/typings/core/types/typegram';
import { Chars, Language, LocaleLanguage, Player } from '../common/types';
import { chance50 } from '../common/utils';
import { UserService } from '../user/user.service';
import { Move } from '../schemas/move.scema';

@Injectable()
export class GameService {
   constructor(
      @InjectModel(Game.name) private gameModel: Model<Game>,
      @InjectModel(GameRoom.name) private gameRoomModel: Model<GameRoom>,
      @InjectModel(Move.name) private moveModel: Model<Move>,
      private readonly userService: UserService
   ) {}

   async newChallenge({ id: tgID, first_name: name, username }: User, messageID: string) {
      const char: Chars = chance50() ? 'x' : 'o';
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
   ): Promise<{ language: Language; errorProperty?: keyof LocaleLanguage }> {
      const gameRoom = await this.gameRoomModel.findOne({ messageID });
      if (!gameRoom) return { language: 'english', errorProperty: 'somethingWrong' };
      if (gameRoom.initiatorID === tgID) {
         return { language: gameRoom.gameLanguage, errorProperty: 'cannotBeDenied' };
      }
      await gameRoom.deleteOne();
      return {
         language: gameRoom.gameLanguage
      };
   }

   async acceptChallenge(
      { id: tgID, first_name: name, username }: User,
      messageID: string
   ): Promise<{ language: Language; payload: keyof LocaleLanguage | GameRoom }> {
      const gameRoom = await this.gameRoomModel.findOne({ messageID });
      if (!gameRoom) return { language: 'english', payload: 'somethingWrong' };
      if (gameRoom.initiatorID === tgID) {
         return { language: gameRoom.gameLanguage, payload: 'cannotBeAccepted' };
      }
      const char: Chars = gameRoom.opponents[0].char === 'x' ? 'o' : 'x';
      const player: Player = {
         name,
         tgID,
         username,
         char
      };
      gameRoom.opponents.push(player);
      await gameRoom.save();
      return {
         language: gameRoom.gameLanguage,
         payload: gameRoom
      };
   }

   async move(
      tgID: number,
      messageID: string,
      { x, y }: { x: number; y: number }
   ): Promise<{ language: Language; payload: keyof LocaleLanguage | GameRoom }> {
      const gameRoom = await this.gameRoomModel.findOne({ messageID });
      if (!gameRoom) return { language: 'english', payload: 'somethingWrong' };

      const player = gameRoom.opponents.find(plr => plr.tgID === tgID);
      if (player.char !== gameRoom.currentMove) {
         return { language: gameRoom.gameLanguage, payload: 'notYourMove' };
      }
      if (gameRoom.field[y][x] !== '') {
         return { language: gameRoom.gameLanguage, payload: 'cellIsNotEmpty' };
      }

      const move = await this.moveModel.create({ x, y });
      gameRoom.moves.push(move);
      gameRoom.field[y][x] = gameRoom.currentMove;
      gameRoom.currentMove = gameRoom.currentMove === 'x' ? 'o' : 'x';

      gameRoom.markModified('moves');
      gameRoom.markModified('field');
      await gameRoom.save();

      return { language: gameRoom.gameLanguage, payload: gameRoom };
   }
}

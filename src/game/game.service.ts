import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from '../schemas/game.schema';
import { GameRoom } from '../schemas/gameRoom.schema';
import { User } from 'telegraf/typings/core/types/typegram';
import {
   Chars,
   Field,
   GameResult,
   Language,
   LocaleLanguage,
   Player
} from '../common/types';
import { chance50, createResultImage, getResultShorthand } from '../common/utils';
import { UserService } from '../user/user.service';
import { Move } from '../schemas/move.schema';
import { ImgurService } from '../imgur/imgur.service';
import { ImageService } from '../image/image.service';

@Injectable()
export class GameService {
   constructor(
      @InjectModel(Game.name) private gameModel: Model<Game>,
      @InjectModel(GameRoom.name) private gameRoomModel: Model<GameRoom>,
      @InjectModel(Move.name) private moveModel: Model<Move>,
      private readonly userService: UserService,
      private readonly imgurService: ImgurService,
      private readonly imageService: ImageService
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
      gameRoom.startTime = Date.now();
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

   checkWinner(field: Field): GameResult | null {
      // rows
      for (let i = 0; i < 3; i++) {
         if (field[i][0] !== '' && field[i].every(value => value === field[i][0])) {
            return {
               winner: field[i][0] as Chars,
               combination: ['row', i]
            };
         }
      }

      // сolumns
      for (let i = 0; i < 3; i++) {
         const array = [field[0][i], field[1][i], field[2][i]];
         if (field[0][i] !== '' && array.every(value => value === field[0][i])) {
            return {
               winner: field[0][1] as Chars,
               combination: ['col', i]
            };
         }
      }

      // diagonal \
      const array1 = [field[0][0], field[1][1], field[2][2]];
      // diagonal /
      const array2 = [field[0][2], field[1][1], field[2][0]];
      // diag 0
      if (field[0][0] !== '' && array1.every(value => value === field[0][0])) {
         return {
            winner: field[0][0] as Chars,
            combination: ['diag', 0]
         };
      }
      // diag 1
      if (field[0][2] !== '' && array2.every(value => value === field[0][2])) {
         return {
            winner: field[0][2] as Chars,
            combination: ['diag', 1]
         };
      }

      return null;
   }

   async finishGame(result: GameResult, gameRoom: GameRoom) {
      const imageShorthand = getResultShorthand(gameRoom.moves);
      const imageDB = await this.imageService.findByShorthand(imageShorthand);
      let fileLink: string;
      if (imageDB) {
         fileLink = imageDB.fileID;
      } else {
         const resultImage = await createResultImage(gameRoom.moves, result.combination);
         fileLink = await this.imgurService.upload(resultImage);
      }
      const image = await this.imageService.create(fileLink, imageShorthand);
      await this.gameModel.create({
         duration: Date.now() - gameRoom.startTime,
         image,
         moves: gameRoom.moves,
         opponents: gameRoom.opponents,
         winner: result.winner
      });
      return fileLink;
   }
}

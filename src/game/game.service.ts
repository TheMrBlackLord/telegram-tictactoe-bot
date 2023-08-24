import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from '../common/types';
import { Game } from '../schemas/game.scema';
import { generateEmptyField, generateGameID, oddOrEven } from '../common/utils';
import { GameRoom } from '../schemas/gameRoom.schema';

@Injectable()
export class GameService {
   constructor(
      @InjectModel(Game.name) private gameModel: Model<Game>,
      @InjectModel(GameRoom.name) private gameRoomModel: Model<GameRoom>
   ) {}

   async enter(
      tgID: number,
      username: string,
      name: string,
      gameID: number
   ): Promise<GameRoom | null> {
      const room = await this.gameRoomModel.findOne({ gameID });
      if (!room) return null;
      if (room.opponents.length === 2) return null; //TODO:
      const player: Player = {
         tgID,
         username,
         name,
         char: room.opponents[0].char === 'x' ? 'o' : 'x'
      };
      room.opponents.push(player);
      return await room.save();
   }

   async createAndEnter(tgID: number, username: string, name: string): Promise<GameRoom> {
      const gameID = generateGameID();
      const player: Player = {
         tgID,
         username,
         name,
         char: oddOrEven() ? 'x' : 'o'
      };
      const room = await this.gameRoomModel.create({
         gameID,
         opponents: [player],
         field: generateEmptyField()
      });
      return room;
   }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../schemas/game.scema';
import { GameService } from './game.service';
import { GameRoom, GameRoomSchema } from '../schemas/gameRoom.schema';

@Module({
   imports: [
      MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
      MongooseModule.forFeature([{ name: GameRoom.name, schema: GameRoomSchema }]),
   ],
   providers: [GameService],
   exports: [GameService]
})
export class GameModule {}
